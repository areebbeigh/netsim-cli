import Logger from '../logger';
import BaseNode from './BaseNode';

class Hub extends BaseNode implements IHub {
  constructor(
    name: string,
    id: number,
    logger: Logger,
    interfaceCount = 5
  ) {
    super(name, id, logger, interfaceCount);
    this.createInterfaces(interfaceCount, true);
  }
}

export default Hub;
