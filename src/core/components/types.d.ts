interface IConnection {
  port1: INetworkInterface;
  port2: INetworkInterface;
}

interface INetworkInterface {
  host: NetworkNode;
  mac: string;
  connection: import('./Connection').Connection;
  skipReceiveDestinationCheck: boolean;
  connect(
    interface: import('./NetworkInterface').NetworkInterface
  ): import('./Connection').Connection;
}

type NetworkNode = Host | Hub | Switch;

interface Host {}
interface Hub {}
interface Switch {}
