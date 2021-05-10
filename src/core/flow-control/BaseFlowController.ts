import Packet from '../data/Packet';

abstract class BaseFlowController {
  abstract sendWindowSize: number;

  protected iface: NetworkInterface;

  constructor(iface: NetworkInterface) {
    this.iface = iface;
  }

  assignSequenceNos(packets: Packet[]) {
    packets.forEach((packet, idx) => {
      packet.seqNo = idx % this.sendWindowSize;
    });
  }
}

export default BaseFlowController;
