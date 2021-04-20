class Packet implements IPacket {
  source;
  destination;
  data;

  constructor(source: string, destination: string, data: string) {
    this.source = source;
    this.destination = destination;
    // TODO: Add limit to data length
    this.data = data;
  }

  toString() {
    return `<Packet: src:${this.source} dst:${this.destination} data:${this.data}>`;
  }
}

export default Packet;
export type { Packet };
