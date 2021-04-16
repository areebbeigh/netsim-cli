import Host from './components/Host';
import Hub from './components/Hub';
import { EngineError } from './errors';

enum DeviceType {
  HOST,
  HUB,
  SWITCH,
}

class Engine implements IEngine {
  private idCounter = 1;
  private nodes: {
    [key: number]: BaseNode;
  } = {};

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

  addDevice(name: string, type: DeviceType, ports: number) {
    if (type === DeviceType.HUB && ports > 1)
      throw new EngineError(`A Host can have only one port.`);

    const Node = this.getNodeClass(type);
    const node = new Node(name, ports);
    this.nodes[this.idCounter] = node;
    this.idCounter++;

    return node;
  }

  removeDeviceById(id: number) {
    delete this.nodes[id];
  }

  private getDeviceById(id: number) {
    if (!this.nodes[id])
      throw new EngineError(`Device id ${id} does not exist.`);
    return this.nodes[id];
  }

  listDevices() {
    return Object.values(this.nodes);
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
