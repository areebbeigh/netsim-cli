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
    const json = JSON.stringify(
      {
        src: this.source,
        dst: this.destination,
        packet: this.packet,
      },
      undefined,
      2
    );

    return `Frame:
  ${json.split('\n').join('\n  ')}`;
  }
}

export default Frame;
export type { Frame };
