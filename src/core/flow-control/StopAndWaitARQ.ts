import config from '../config';
import Frame from '../data/Frame';
import Packet from '../data/Packet';
import { EventType } from '../logger';
import setInterval from '../lib/setInterval';
import BaseFlowController from './BaseFlowController';

class StopAndWaitARQ
  extends BaseFlowController
  implements IFlowController {
  private wait = false;
  private failed = false;
  private pendingAckIntervalId: NodeJS.Timeout | undefined;

  sendWindowSize = 2;
  timeoutLimit = 2000;
  retryLimit = config.PACKET_RETRIES;

  get logger() {
    return this.iface.host.logger;
  }

  private sendPacket(packet: Packet) {
    let attempts = 0;

    this.wait = true;
    this.pendingAckIntervalId = setInterval(() => {
      if (attempts >= this.retryLimit) {
        this.failPacket(packet, attempts);
        return;
      }
      this.iface.sendPacket(packet);
      attempts++;
    }, this.timeoutLimit);
  }

  private cleanUp() {
    if (this.pendingAckIntervalId) {
      clearInterval(this.pendingAckIntervalId);
      this.wait = false;
    }
  }

  private ackPacket() {
    this.cleanUp();
  }

  private failPacket(packet: Packet, retries: number) {
    this.cleanUp();
    this.failed = true;
    this.logger.logEvent(
      EventType.LINK_FAILURE,
      this.iface.host,
      this.iface,
      undefined,
      undefined,
      `${packet}
      
  Packet dropped. Retries: ${retries}`
    );
  }

  sendPackets(packets: Packet[]) {
    this.assignSequenceNos(packets);

    let idx = 0;
    const sendIntervalId = setInterval(() => {
      //   console.log(
      //     'sendintervalid',
      //     this.wait,
      //     this.pendingAckIntervalId,
      //     idx
      //   );
      if (this.wait) return;
      if (idx >= packets.length || this.failed) {
        clearInterval(sendIntervalId);
        return;
      }

      this.sendPacket(packets[idx]);
      idx++;
    }, 500);
  }

  receive(frame: Frame) {
    if (frame.packet.isAck) {
      //   console.log(this.iface.fullName, 'got ack');
      this.ackPacket();
    } else {
      if (frame.packet.seqNo === undefined)
        throw new Error(`Packet does not have a seqNo: ${frame}`);

      if (!this.iface.host.isRouter)
        this.iface.sendAck(
          frame.packet.source,
          frame,
          ((frame.packet.seqNo + 1) % this.sendWindowSize).toString()
        );
    }
  }
}

export default StopAndWaitARQ;
