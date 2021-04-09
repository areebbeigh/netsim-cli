type NetworkInterface = import('./NetworkInterface').NetworkInterface;
type Connection = import('./Connection').Connection;
type BaseNode = import('./BaseNode').BaseNode;

interface IConnection {
  port1: INetworkInterface;
  port2: INetworkInterface;
}

interface INetworkInterface {
  host: BaseNode;
  mac: string;
  name: string;
  connection: Connection;
  skipReceiveDestinationCheck: boolean;
  connect(interface: NetworkInterface): Connection;
}

type NetworkNode = IHost | IHub | ISwitch;

interface IBaseNode {
  interfaces: NetworkInterface[];
}
interface IHost extends IBaseNode {}
interface IHub extends IBaseNode {}
interface ISwitch extends IBaseNode {}
