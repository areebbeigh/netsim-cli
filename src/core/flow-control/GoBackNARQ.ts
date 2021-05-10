import config from '../config';
import Frame from '../data/Frame';
import Packet from '../data/Packet';
import setInterval from '../lib/setInterval';
import BaseFlowController from './BaseFlowController';

class GoBackNARQ
  extends BaseFlowController
  implements IFlowController {
  // m, sw, sf, sn
  sequenceNoBits = 3;
  sendWindowSize = Math.floor(2 ** this.sequenceNoBits - 1);
  firstOutStanding = -1;
  nextToSend = 0;

  retryLimit = config.PACKET_RETRIES;
  firstOutstandingTimerId: NodeJS.Timeout | undefined;
  awaitingAck: Packet[] = [];

  private get isWindowFull() {
    return (
      this.nextToSend - this.firstOutStanding >= this.sendWindowSize
    );
  }

  private cleanUp() {
    console.log('cleaning up');
    this.firstOutStanding = 0;
    this.nextToSend = 0;
    if (this.firstOutstandingTimerId) {
      clearInterval(this.firstOutstandingTimerId);
      this.firstOutstandingTimerId = undefined;
    }
  }

  private startTimer() {
    setTimeout(() => {
      this.resendPackets();
    }, 2000);
  }

  private resendPackets() {
    this.awaitingAck.forEach(this.sendPacket.bind(this));
  }

  /**
   * Cumilative ack
   * @param packet
   */
  private ackPacket(packet: Packet) {
    const ackNo = parseInt(packet.data, 10);

    if (ackNo > this.firstOutStanding && ackNo <= this.nextToSend) {
      this.awaitingAck = this.awaitingAck.filter(
        (p) => (p.seqNo as number) >= ackNo
      );
      this.firstOutStanding = ackNo % this.sendWindowSize;

      // Reset the timer
      if (this.firstOutstandingTimerId) {
        clearTimeout(this.firstOutstandingTimerId);
        if (this.firstOutStanding !== this.nextToSend) {
          this.startTimer();
        }
      }
    }
  }

  private sendPacket(packet: Packet) {
    this.nextToSend = (this.nextToSend + 1) % this.sendWindowSize;
    if (this.firstOutStanding === -1)
      this.firstOutStanding = packet.seqNo as number;

    this.iface.sendPacket(packet);
    if (this.firstOutstandingTimerId === undefined) this.startTimer();
  }

  sendPackets(packets: Packet[]) {
    this.assignSequenceNos(packets);

    let idx = 0;
    const sendIntervalId = setInterval(() => {
      if (this.isWindowFull) return;
      if (
        idx >= packets.length &&
        this.firstOutStanding === this.nextToSend
      ) {
        // We have finished transmitting and received all acks
        this.cleanUp();
        clearInterval(sendIntervalId);
        return;
      }
      // All packets are on wire but we don't have the final ack
      if (idx >= packets.length) return;
      this.sendPacket(packets[idx]);
      this.awaitingAck.push(packets[idx]);
      idx++;
    }, 500);
  }

  receive(frame: Frame) {
    if (frame.packet.isAck) {
      this.ackPacket(frame.packet);
    } else {
      if (frame.packet.seqNo === undefined)
        throw new Error(`Packet does not have a seqNo: ${frame}`);

      this.iface.sendAck(
        frame.packet.source,
        frame,
        ((frame.packet.seqNo + 1) % this.sendWindowSize).toString()
      );
    }
  }
}

export default GoBackNARQ;
