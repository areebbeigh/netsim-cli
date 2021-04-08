import type { Packet } from './Packet';

class Frame implements IFrame {
  source;
  destination;
  packet;

  constructor(source: string, destination: string, packet: Packet) {
    this.source = source;
    this.destination = destination;
    this.packet = packet;
  }
}

export default Frame;
export type { Frame };
