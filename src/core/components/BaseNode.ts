import { NoFreeInterfaceError } from '../errors';
import NetworkInterface from './NetworkInterface';

abstract class BaseNode implements IBaseNode {
  name: string | undefined;
  interfaces: NetworkInterface[];

  constructor(name?: string) {
    this.name = name;
    this.interfaces = [];
  }

  /**
   * Create the interfaces for this node.
   * @param count
   * @param skipReceiveDestinationCheck
   */
  createInterfaces(
    count: number,
    skipReceiveDestinationCheck = false
  ): void {
    for (let i = 0; i < count; i++) {
      this.interfaces.push(
        new NetworkInterface(
          this,
          `eth${i}`,
          skipReceiveDestinationCheck
        )
      );
    }
  }

  /**
   * Returns the first available non-connected interface.
   */
  getFreeInterface(): NetworkInterface | null {
    for (let i = 0; i < this.interfaces.length; i++) {
      if (!this.interfaces[i].isConnected) return this.interfaces[i];
    }
    return null;
  }

  /**
   * Connect two nodes
   * @param node
   */
  connect(node: BaseNode) {
    const iface1 = this.getFreeInterface();
    const iface2 = node.getFreeInterface();

    if (!(iface1 && iface2))
      throw new NoFreeInterfaceError(
        `Can't connect ${this.name} and ${node.name}. ${
          iface1 ? node.name : this.name
        } does not have a free interface.`
      );

    iface1.connect(iface2);
  }
}

export default BaseNode;
export type { BaseNode };
