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

  get isAck() {
    // TODO: Add headers to packet
    return this.packet.data === 'ACK';
  }

  toString() {
    return `<Frame src: ${this.source} dst: ${
      this.destination
    } data: ${this.packet.toString()}>`;
  }
}

export default Frame;
export type { Frame };
