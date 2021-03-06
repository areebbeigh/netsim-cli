import { Netmask } from 'netmask';
import type Router from '../components/Router';

class RoutingTable implements IRoutingTable {
  private router: Router;
  public costTable: IRouteCostTable = {};

  constructor(router: Router) {
    this.router = router;
  }

  // Merge routing table into this one by following RIP
  merge(otherTable: RoutingTable, iface: NetworkInterface) {
    let updated = false;
    Object.entries(otherTable.costTable).forEach(([ip, val]) => {
      // Ignore own interface IPs
      if (
        this.router.interfaces
          .filter((iface_) => iface_.isConnected)
          .find((iface_) => iface_.netmask.contains(ip))
      )
        return;

      const myEntry = this.costTable[ip];
      const newVal: [number, NetworkInterface] = [val[0] + 1, val[1]];

      if (!myEntry || myEntry[0] > val[0] + 1) {
        this.costTable[ip] = newVal;
        updated = true;
      } else if (myEntry[1] === iface) {
        if (this.costTable[ip] !== newVal) {
          this.costTable[ip] = newVal;
          updated = true;
        }
      }
    });

    if (updated) this.router.sendRoutingTable();
  }

  // Update directly connected networks
  updateCosts(costTable: IRouteCostTable) {
    Object.keys(this.costTable).forEach((ip) => {
      if (this.costTable[ip]![0] === 1) delete this.costTable[ip];
    });

    this.costTable = {
      ...this.costTable,
      ...costTable,
    };
    this.router.sendRoutingTable();
  }

  getNextHop(ip: string) {
    const sortedMasks = Object.keys(this.costTable)
      .map((cidr) => new Netmask(cidr))
      .sort((a: Netmask, b: Netmask) => {
        if (a.bitmask < b.bitmask) return -1;
        if (a.bitmask > b.bitmask) return 1;
        return 0;
      })
      .reverse();

    const netmask = sortedMasks.find((nm) => nm.contains(ip));
    if (netmask) {
      return this.costTable[`${netmask.base}/${netmask.mask}`][1];
    }
  }
}

export default RoutingTable;
