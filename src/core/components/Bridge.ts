import Logger from '../logger';
import Switch from './Switch';

class Bridge extends Switch {
  constructor(
    name: string,
    id: number,
    logger: Logger,
    interfaceCount = 2
  ) {
    super(name, id, logger, interfaceCount);
    if (interfaceCount !== 2) {
      console.log('Bridges can have only 2 interfaces. Overriding.');
    }
    this.createInterfaces(2, true);
    this.macTable = {};
  }
}

export default Bridge;
