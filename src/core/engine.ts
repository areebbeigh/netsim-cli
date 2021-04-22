import Host from './components/Host';
import Hub from './components/Hub';
import { EngineError } from './errors';
import Logger from './logger';

enum DeviceType {
  HOST = 'Host',
  HUB = 'Hub',
  SWITCH = 'Switch',
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
    deviceIface2: string
  ) {
    const iface1 = this.getDeviceById(deviceId1).getInterfaceByName(
      deviceIface1
    );
    const iface2 = this.getDeviceById(deviceId2).getInterfaceByName(
      deviceIface2
    );

    iface1?.connect(iface2);
  }

  send(hostId: number, ip: string, data: string) {
    const host = this.getDeviceById(hostId);
    if (!(host instanceof Host))
      throw new EngineError(`You can only call hosts to send data.`);

    host.send(ip, data);
  }
}

export default Engine;
export { DeviceType };
export type { Engine };
