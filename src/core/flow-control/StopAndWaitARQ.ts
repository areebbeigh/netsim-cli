import Frame from '../data/Frame';
import Packet from '../data/Packet';

class StopAndWaitARQ implements IFlowController {
  private iface: NetworkInterface;
  private wait = false;
  private pendingAckIntervalId: NodeJS.Timeout | undefined;

  sendWindowSize = 2;
  timeoutLimit = 2000;
  retryLimit = 1;

  constructor(iface: NetworkInterface) {
    this.iface = iface;
  }

  get logger() {
    return this.iface.host.logger;
  }

  private sendPacket(packet: Packet) {
    let attempts = 0;

    this.wait = true;
    this.pendingAckIntervalId = setInterval(() => {
      if (attempts >= this.retryLimit) {
        this.failPacket(packet);
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

  private failPacket(packet: Packet) {
    this.cleanUp();
  }

  sendPackets(packets: Packet[]) {
    packets.forEach((packet, idx) => {
      packet.seqNo = idx % this.sendWindowSize;
    });

    let idx = 0;
    const sendIntervalId = setInterval(() => {
      //   console.log(
      //     'sendintervalid',
      //     this.wait,
      //     this.pendingAckIntervalId,
      //     idx
      //   );
      if (this.wait) return;
      if (idx >= packets.length) {
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

      this.iface.sendAck(
        frame.packet.source,
        frame,
        ((frame.packet.seqNo + 1) % this.sendWindowSize).toString()
      );
    }
  }
}

export default StopAndWaitARQ;