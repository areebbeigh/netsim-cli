import chalk from 'chalk';

import Bridge from './components/Bridge';
import Host from './components/Host';
import Hub from './components/Hub';
import Switch from './components/Switch';
import { EngineError } from './errors';
import Logger, { EventType } from './logger';

enum DeviceType {
  HOST = 'Host',
  HUB = 'Hub',
  SWITCH = 'Switch',
  BRIDGE = 'Bridge',
}

class Engine implements IEngine {
  private idCounter = 1;
  private nodes: {
    [key: number]: BaseNode;
  } = {};
  logger: Logger;

  constructor() {
    this.logger = new Logger();
  }

  private getNodeClass(type: DeviceType) {
    switch (type) {
      case DeviceType.HOST:
        return Host;
      case DeviceType.HUB:
        return Hub;
      case DeviceType.SWITCH:
        return Switch;
      case DeviceType.BRIDGE:
        return Bridge;
      default:
        throw new EngineError(
          `${type} does not have a matching class`
        );
    }
  }

  private getDeviceById(id: number) {
    if (!this.nodes[id])
      throw new EngineError(`Device id ${id} does not exist.`);
    return this.nodes[id];
  }

  addDevice(
    type: DeviceType,
    ports: number,
    name?: string
  ): [BaseNode, number] {
    if (type === DeviceType.HOST && ports > 1)
      throw new EngineError(`A Host can have only one port.`);

    const Node = this.getNodeClass(type);
    const node = new Node(
      name || `${type}${this.idCounter}`,
      this.idCounter,
      this.logger,
      ports
    );
    this.nodes[node.id] = node;
    this.idCounter++;

    return [node, node.id];
  }

  removeDeviceById(id: number) {
    delete this.nodes[id];
  }

  listDevices() {
    return Object.values(this.nodes);
  }

  assignIp(deviceId: number, ifaceName: string, ip: string) {
    const iface = this.getDeviceById(deviceId).getInterfaceByName(
      ifaceName
    );
    iface.assignIp(ip);
  }

  connectById(
    deviceId1: number,
    deviceIface1: string,
    deviceId2: number,
    deviceIface2: string,
    successProbability = 1
  ) {
    const iface1 = this.getDeviceById(deviceId1).getInterfaceByName(
      deviceIface1
    );
    const iface2 = this.getDeviceById(deviceId2).getInterfaceByName(
      deviceIface2
    );

    const connection = iface1?.connect(iface2);
    connection.successProbability = successProbability;
  }

  send(hostId: number, ip: string, data: string) {
    const host = this.getDeviceById(hostId);
    if (!(host instanceof Host))
      throw new EngineError(`You can only call hosts to send data.`);

    host.send(ip, data);
  }

  arpLookup(hostId: number, ip: string) {
    const host = this.getDeviceById(hostId);
    if (!(host instanceof Host))
      throw new EngineError(
        `You can only call hosts to do ARP lookups.`
      );

    host.interfaces[0].doArpLookup(ip).then((lookupMac) => {
      this.logger.logEvent(
        EventType.MISC,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        chalk`{italic ARP Lookup for ${ip} gave: ${lookupMac}}`
      );
    });
  }

  /**
   * Start a dfs from this device and count the number of domains bounded
   * by the breaks function
   * @param device
   */
  private countDomains(
    device: BaseNode,
    visited: Set<BaseNode>,
    breaksDomain: (d: BaseNode) => boolean
  ) {
    let res = 0;
    if (
      visited.has(device) ||
      device.getConnectedDevices().length === 0
    ) {
      return res;
    }

    visited.add(device);
    device
      .getConnectedDevices()
      .filter((d) => !visited.has(d))
      .forEach((connectedDevice) => {
        // If the connected device breaks the CD, we count a new CD
        if (breaksDomain(device)) {
          res += 1;
          // Add the CDs discoverable from the connected device
        }

        res += this.countDomains(
          connectedDevice,
          visited,
          breaksDomain
        );
      });

    return res;
  }

  getCollisionDomains() {
    let res = 0;
    const visited = new Set<BaseNode>([]);

    this.listDevices()
      .filter((d) => d.breaksCollisionDomain)
      .forEach((device) => {
        res += this.countDomains(
          device,
          visited,
          (d) => d.breaksCollisionDomain
        );
      });

    return res;
  }

  getBroadcastDomains() {
    let res = 0;
    const visited = new Set<BaseNode>([]);

    this.listDevices()
      .filter((d) => d.breaksBroadcastDomain)
      .forEach((device) => {
        res += this.countDomains(
          device,
          visited,
          (d) => d.breaksBroadcastDomain
        );
      });

    return res;
  }

  stats() {
    return {
      collisionDomains: this.getCollisionDomains(),
      broadcastDomains: this.getBroadcastDomains(),
    };
  }
}

export default Engine;
export { DeviceType };
export type { Engine };
