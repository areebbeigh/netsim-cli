import { InterfaceNotFound, NoFreeInterfaceError } from '../errors';
import NetworkInterface from './NetworkInterface';

abstract class BaseNode implements IBaseNode {
  name: string | undefined;
  interfaces: IBaseNode['interfaces'];
  arpTable: IBaseNode['arpTable'];

  constructor(name?: string, interfaceCount = 1) {
    this.name = name;
    this.interfaces = [];
    this.arpTable = {};
    this.createInterfaces(interfaceCount, false);
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

  getInterfaceByName(name: string) {
    const iface = this.interfaces.find((i) => i.name === name);
    if (!iface)
      throw new InterfaceNotFound(
        `${name} not found on node ${this.name}`
      );
    return iface;
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

  /**
   * Disconnect this node from `node`
   * @param node
   */
  disconnect(node: BaseNode) {
    this.getConnectedNodeInterfaces(node).forEach((iface) =>
      iface.disconnect()
    );
  }

  /**
   * Returns the interfaces connected to given node
   * @param node
   * @returns
   */
  private getConnectedNodeInterfaces(node: BaseNode) {
    const interfaces = this.interfaces.filter(
      (iface) => iface.getConnectedNode() === node
    );

    return interfaces;
  }

  /**
   * Lookup this host's ARP table
   * @param ip
   */
  lookupArpTable(ip: string): string | null {
    return this.arpTable[ip] || null;
  }
}

export default BaseNode;
export type { BaseNode };
