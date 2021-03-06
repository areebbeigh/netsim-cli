import { InterfaceNotFound, NoFreeInterfaceError } from '../errors';
import Logger, { EventType } from '../logger';
import NetworkInterface from './NetworkInterface';
import type { Frame } from '../data/Frame';

abstract class BaseNode implements IBaseNode {
  abstract breaksBroadcastDomain: boolean;
  abstract breaksCollisionDomain: boolean;
  id;
  name: string | undefined;
  interfaces: IBaseNode['interfaces'];
  arpTable: IBaseNode['arpTable'];
  logger: Logger;
  isRouter = false;

  constructor(
    name: string,
    id: number,
    logger: Logger,
    interfaceCount = 1
  ) {
    this.name = name;
    this.interfaces = [];
    this.arpTable = {};
    this.id = id;
    this.logger = logger;

    this.logger.logEvent(EventType.NODE_CREATED, this);
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

  getConnectedDevices(): BaseNode[] {
    return this.interfaces
      .filter((iface) => iface.isConnected)
      .map((iface) => iface.getConnectedNode()) as BaseNode[];
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
   * Lookup this host's ARP table
   * @param ip
   */
  lookupArpTable(ip: string): string | null {
    return this.arpTable[ip] || null;
  }

  /**
   * Add an entry to the arp table if it doesn't already exist.
   * @param ip
   * @param mac
   */
  addToArpTable(ip: string, mac: string) {
    // TODO: Invalidate/remove arp table entries.
    if (this.arpTable[ip] !== mac) {
      this.arpTable[ip] = mac;
      this.logger.logEvent(
        EventType.ARP_LEARN,
        this,
        undefined,
        undefined,
        undefined,
        `${ip} has mac ${mac}`
      );
    }
  }

  /**
   * Simply logs a DATA_RECEIVE by default
   * @param frame
   * @param iface
   */
  receive(frame: Frame, iface: NetworkInterface) {
    this.logger.logEvent(
      EventType.DATA_RECEIVE,
      this,
      iface,
      undefined,
      undefined,
      frame
    );
  }

  onConnect(iface: NetworkInterface) {}
  onAssignIp(iface: NetworkInterface) {}
}

export default BaseNode;
export type { BaseNode };
