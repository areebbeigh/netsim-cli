import Frame from '../data/Frame';
import type { NetworkInterface } from './NetworkInterface';

class Connection implements IConnection {
  port1;
  port2;

  constructor(port1: NetworkInterface, port2: NetworkInterface) {
    this.port1 = port1;
    this.port2 = port2;
  }

  put(frame: Frame, fromInterface: NetworkInterface): void {
    if (![this.port1, this.port2].indexOf(fromInterface))
      throw Error(`Interfaces not connected.`);

    const receiver =
      fromInterface === this.port1 ? this.port2 : this.port1;
    receiver.receive(frame);
  }

  /**
   * For disconnecting two interfaces, both should simply drop their
   * reference to `this.connection`
   */
  disconnect() {
    this.port1.connection = undefined;
    this.port2.connection = undefined;
  }

  /**
   * Returns the other connected interface
   * @param iface
   */
  getConnectedInterface(iface: NetworkInterface) {
    return this.port1 !== iface ? this.port1 : this.port2;
  }
}

export default Connection;
