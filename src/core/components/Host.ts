import BaseNode from './BaseNode';
import NetworkInterface from './NetworkInterface';

class Host extends BaseNode implements IHost {
  interfaces: NetworkInterface[] = [];

  constructor(name?: string, interfaceCount = 1) {
    super(name, interfaceCount);
    if (interfaceCount > 1)
      throw new Error(`Interface count > 1 not supported for Host.`);
  }

  private get iface() {
    return this.interfaces[0];
  }

  send(ip: string, data: string) {
    this.iface.sendData(ip, data);
  }
}

export default Host;
