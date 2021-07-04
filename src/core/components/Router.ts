import RoutingTable from '../component-utils/RoutingTable';
import Frame from '../data/Frame';
import Logger, { EventType } from '../logger';
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
    // Use a printable cost table
    const costTable: any = {};
    Object.entries(this.routingTable.costTable).forEach(
      ([ip, val]) => {
        costTable[ip] = { cost: val[0], interface: val[1].name };
      }
    );

    if (Object.keys(costTable).length)
      this.logger.logEvent(
        EventType.RIP_UPDATE,
        this,
        undefined,
        undefined,
        undefined,
        costTable
      );

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
    this.routingTable.merge(table, iface);
  }

  receive(frame: Frame, iface: NetworkInterface) {
    if (frame.packet.destination === iface.ip) return;

    const nextIface = this.routingTable.getNextHop(
      frame.packet.destination
    );

    if (nextIface) {
      // TODO: Log receive
      nextIface.sendPacket(frame.packet);
    } else {
      console.log('router dropped pkt');
      // TODO: Log packet drop
    }
  }

  buildCostTable(): IRouteCostTable {
    const table: IRouteCostTable = {};
    this.interfaces
      .filter((iface) => iface.isConnected)
      .forEach((iface) => {
        table[`${iface.netmask.base}/${iface.netmask.mask}`] = [
          1,
          iface,
        ];
      });
    return table;
  }

  updateCostTable() {
    this.routingTable.updateCosts(this.buildCostTable());
  }

  onConnect() {
    this.updateCostTable();
  }

  onAssignIp() {
    this.updateCostTable();
  }
}

export default Router;
