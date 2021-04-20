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
    const json = JSON.stringify(
      {
        src: this.source,
        dst: this.destination,
        data: this.data,
      },
      undefined,
      2
    );

    return `Packet:
  ${json.split('\n').join('\n  ')}`;
  }
}

export default Packet;
export type { Packet };
