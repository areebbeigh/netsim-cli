import chalk from 'chalk';
import { v4 } from 'uuid';

class Packet implements IPacket {
  source;
  destination;
  data;
  seqNo: number | undefined;
  isAck = false;
  uuid: string;

  constructor(source: string, destination: string, data: string) {
    this.uuid = v4();
    this.source = source;
    this.destination = destination;
    // TODO: Add limit to data length
    this.data = data;
  }

  toString() {
    return chalk`{magenta {bold Packet:}}
    {bold id:} ${this.uuid}
    {bold src:} ${this.source} | {bold dst:} ${this.destination}
    {bold seqNo:} ${this.seqNo} | {bold isAck:} ${this.isAck}
    data: ${this.data}`;
  }
}

export default Packet;
export type { Packet };
