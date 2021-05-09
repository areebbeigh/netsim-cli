/**
 * A flow controller provides an API and an underlying implementation
 * of a flow control technique e.g Stop and Wait ARQ
 */
interface IFlowController {
  sendPackets: (packets: Packet[]) => void;
  receive: (packet: Packet) => void;
}
