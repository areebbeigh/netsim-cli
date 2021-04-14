import type { Packet } from './Packet';

class Frame implements IFrame {
  source;
  destination;
  packet;

  constructor(
    source: string,
    destination: string | null,
    packet: Packet
  ) {
    this.source = source;
    this.destination = destination;
    this.packet = packet;
  }

  get isBroadcast() {
    return this.destination == null;
  }
}

export default Frame;
export type { Frame };
