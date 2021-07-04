type NetworkInterface = import('./NetworkInterface').NetworkInterface;
type Connection = import('./Connection').Connection;
type BaseNode = import('./BaseNode').BaseNode;

interface IConnection {
  port1: INetworkInterface;
  port2: INetworkInterface;
}

interface INetworkInterface {
  name: string;
  host: BaseNode;
  mac: string;
  ip: string | undefined;
  subnetMask: string;
  connection: Connection;
  skipReceiveDestinationCheck: boolean;
  connect(interface: NetworkInterface): Connection;
}

type NetworkNode = IHost | IHub | ISwitch;

interface IBaseNode {
  id: number;
  breaksCollisionDomain: boolean;
  breaksBroadcastDomain: boolean;
  interfaces: NetworkInterface[];
  arpTable: { [key: string]: string };
  logger: import('../logger').Logger;
}
interface IHost extends IBaseNode {
  send(ip: string, data: string): void;
}
interface IHub extends IBaseNode {}
interface ISwitch extends IBaseNode {}
interface IRouter extends IBaseNode {}
