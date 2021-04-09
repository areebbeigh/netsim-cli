import BaseNode from './BaseNode';
import NetworkInterface from './NetworkInterface';

class Host extends BaseNode implements IHost {
  interfaces: NetworkInterface[] = [];

  constructor(name?: string) {
    super(name);
    this.createInterfaces(1, false);
  }
}

export default Host;
