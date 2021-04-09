import Connection from './Connection';
import type { Frame } from '../data/Frame';
import type { BaseNode } from './BaseNode';
import getRandomMac from '../lib/randomMac';

class NetworkInterface implements INetworkInterface {
  host;
  skipReceiveDestinationCheck;
  name;
  connection: Connection | undefined;
  mac;

  constructor(
    host: BaseNode,
    name: string,
    skipReceiveDestinationCheck = false
  ) {
    this.skipReceiveDestinationCheck = skipReceiveDestinationCheck;
    this.host = host;
    this.name = name;
    // TODO: Add check for mac collisions.
    this.mac = getRandomMac();
  }

  connect(otherInterface: NetworkInterface): Connection {
    if (otherInterface.connection && this.connection) {
      throw Error(
        `Can't connect interfaces. Other connections already exist.`
      );
    }

    const connection: Connection =
      this.connection ||
      otherInterface.connection ||
      new Connection(this, otherInterface);
    this.connection = connection;

    // Connect the other interface to this if it doesn't have a connection already
    if (!otherInterface.connection) otherInterface.connect(this);
    return connection;
  }

  receive(frame: Frame): void {
    console.log('received:', frame, this.host);
  }

  get isConnected() {
    return !!this.connection;
  }
}

export default NetworkInterface;
export type { NetworkInterface };
