import chalk from 'chalk';

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
    return this.packet.isAck;
  }

  toString() {
    return chalk`{yellow {bold Frame:}}
    {bold src:} ${this.source} | {bold dst:} ${this.destination}
    ${this.packet.toString().split('\n').join('\n  ')}`;
  }
}

export default Frame;
export type { Frame };
