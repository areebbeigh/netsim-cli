import RoutingTable from '../component-utils/RoutingTable';
import Frame from '../data/Frame';
import Logger from '../logger';
import BaseNode from './BaseNode';

class Router extends BaseNode implements IRouter {
  breaksBroadcastDomain = true;
  breaksCollisionDomain = true;
  routingTable: RoutingTable;
  isRouter = true;

  constructor(
    name: string,
    id: number,
    logger: Logger,
    interfaceCount = 5
  ) {
    super(name, id, logger, interfaceCount);
    this.createInterfaces(interfaceCount, false);
    this.routingTable = new RoutingTable(this);
  }

  sendRoutingTable() {
    this.interfaces.forEach((iface) => {
      const node = iface.getConnectedNode();
      if (node instanceof Router) {
        (node as Router).receiveRoutingTable(
          this.routingTable,
          iface
        );
      }
    });
  }

  private receiveRoutingTable(
    table: RoutingTable,
    iface: NetworkInterface
  ) {
    // TODO: Log receive
    this.routingTable.merge(table, iface);
  }

  receive(frame: Frame, iface: NetworkInterface) {
    const nextIface = this.routingTable.getNextHop(
      frame.packet.destination
    );

    if (nextIface) {
      // TODO: Log receive
      nextIface.sendPacket(frame.packet);
    } else {
      // TODO: Log packet drop
    }
  }
}

export default Router;
