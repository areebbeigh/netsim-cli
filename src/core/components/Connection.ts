import Frame from '../data/Frame';
import type { NetworkInterface } from './NetworkInterface';

class Connection implements IConnection {
  private _successProbability = 1;
  port1;
  port2;

  constructor(
    port1: NetworkInterface,
    port2: NetworkInterface,
    sucessProbability = 1
  ) {
    this.port1 = port1;
    this.port2 = port2;
    this.successProbability = sucessProbability;
  }

  get successProbability() {
    return this._successProbability;
  }

  set successProbability(val: number) {
    if (val > 1 || val < 0) {
      throw new Error(
        `Success probability must be between 0 and 1: ${val}`
      );
    } else {
      this._successProbability = val;
    }
  }

  put(frame: Frame, fromInterface: NetworkInterface): void {
    if ([this.port1, this.port2].indexOf(fromInterface) < 0)
      throw Error(`Interfaces not connected.`);

    if (Math.random() <= this.successProbability) {
      const receiver =
        fromInterface === this.port1 ? this.port2 : this.port1;
      receiver.receive(frame);
    }
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
