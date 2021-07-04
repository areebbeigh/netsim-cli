interface IRoutingTable {
  merge(otherTable: IRoutingTable, iface: NetworkInterface): void;
  getNextHop(ip: string): NetworkInterface | undefined;
}

interface IRouteCostTable {
  [key?: string]: [number, NetworkInterface];
}
