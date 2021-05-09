interface IPacket {
  seqNo?: number;
  isAck: boolean;
  source: string;
  destination: string;
  data: string;
}

interface IFrame {
  source: string;
  destination: string | null;
  packet: import('./Packet').Packet;
}
