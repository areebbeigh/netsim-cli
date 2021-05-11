import Frame from '../data/Frame';
import Logger, { EventType } from '../logger';
import BaseNode from './BaseNode';

class Switch extends BaseNode implements ISwitch {
  breaksCollisionDomain = true;
  breaksBroadcastDomain = false;
  macTable: { [key: string]: NetworkInterface };

  constructor(
    name: string,
    id: number,
    logger: Logger,
    interfaceCount = 5
  ) {
    super(name, id, logger, interfaceCount);
    this.createInterfaces(interfaceCount, true);
    this.macTable = {};
  }

  private doMacLookup(mac: string): NetworkInterface | undefined {
    return this.macTable[mac];
  }

  private addToMacTable(mac: string, iface: NetworkInterface) {
    if (this.macTable[mac] !== iface) {
      this.macTable[mac] = iface;
      this.logger.logEvent(
        EventType.MAC_LEARN,
        this,
        undefined,
        undefined,
        undefined,
        `${mac} is connected to ${iface.fullName}`
      );
    }
  }

  addToArpTable() {}

  receive(frame: Frame, iface: NetworkInterface) {
    this.addToMacTable(frame.source, iface);
    const forwardIface: NetworkInterface | null =
      (frame.destination && this.doMacLookup(frame.destination)) ||
      null;

    if (forwardIface === null) {
      // broadcast the frame
      this.interfaces.forEach((iface_) => {
        if (iface_.isConnected && iface_ !== iface)
          iface_.sendFrame(frame);
      });
    } else {
      forwardIface.sendFrame(frame);
    }
  }
}

export default Switch;
