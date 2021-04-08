import type { NetworkInterface } from './NetworkInterface';

class Connection implements IConnection {
  port1;
  port2;
  constructor(port1: NetworkInterface, port2: NetworkInterface) {
    this.port1 = port1;
    this.port2 = port2;
  }
}

export default Connection;
