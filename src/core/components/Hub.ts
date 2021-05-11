import Frame from '../data/Frame';
import Logger from '../logger';
import BaseNode from './BaseNode';

class Hub extends BaseNode implements IHub {
  breaksCollisionDomain = false;
  breaksBroadcastDomain = false;

  constructor(
    name: string,
    id: number,
    logger: Logger,
    interfaceCount = 5
  ) {
    super(name, id, logger, interfaceCount);
    this.createInterfaces(interfaceCount, true);
  }

  addToArpTable(ip: string, mac: string) {}

  receive(frame: Frame, iface: NetworkInterface) {
    this.interfaces.forEach((iface_) => {
      if (iface_.isConnected && iface_ !== iface)
        iface_.sendFrame(frame);
    });
  }
}

export default Hub;
