interface IPacket {
  source: string;
  destination: string;
  data: string;
}

interface IFrame {
  source: string;
  destination: string;
  packet: import('./Packet').Packet;
}
