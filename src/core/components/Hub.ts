import BaseNode from './BaseNode';

class Hub extends BaseNode implements IHub {
  constructor(name?: string, interfaceCount = 5) {
    super(name, interfaceCount);
    this.createInterfaces(interfaceCount, true);
  }
}

export default Hub;
