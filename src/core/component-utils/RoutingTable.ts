import type Router from '../components/Router';

class RoutingTable implements IRoutingTable {
  private router: Router;
  private table: {
    // IP
    [key: string]: {
      // Mask - [cost, next hop interface]
      [key: number]: [number, NetworkInterface];
    };
  } = {};

  constructor(router: Router) {
    this.router = router;
  }

  // Merge routing table into this one by following RIP
  merge(otherTable: IRoutingTable, iface: NetworkInterface) {
    // TODO: Call only if table changed
    this.router.sendRoutingTable();
  }

  getNextHop(ip: string) {
    const maskTable = this.table[ip];
    if (!maskTable || !Object.keys(maskTable).length)
      return undefined;

    const longestMask = Object.keys(maskTable).map(parseInt).sort()[
      -1
    ];
    return maskTable[longestMask][1];
  }
}

export default RoutingTable;
