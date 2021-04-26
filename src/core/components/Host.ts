import Logger from '../logger';
import BaseNode from './BaseNode';
import Frame from '../data/Frame';
import NetworkInterface from './NetworkInterface';

class Host extends BaseNode implements IHost {
  interfaces: NetworkInterface[] = [];

  constructor(
    name: string,
    id: number,
    logger: Logger,
    interfaceCount = 1
  ) {
    super(name, id, logger, interfaceCount);
    if (interfaceCount > 1)
      throw new Error(`Interface count > 1 not supported for Host.`);

    this.createInterfaces(interfaceCount, false);
  }

  private get iface() {
    return this.interfaces[0];
  }

  receive(frame: Frame) {}

  send(ip: string, data: string) {
    this.iface.sendData(ip, data);
  }
}

export default Host;
