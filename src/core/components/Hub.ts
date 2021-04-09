import BaseNode from './BaseNode';

class Hub extends BaseNode implements IHub {
  constructor(interfaceCount: number, name?: string) {
    super(name);
    this.createInterfaces(interfaceCount, true);
  }
}

export default Hub;
