enum EventType {
  ARP_SEND = 'ARP SEND',
  ARP_RECEIVE = 'ARP RECEIVE',
  ARP_LEARN = 'ARP LEARN',
  ACK_SEND = 'ACK SEND',
  ACK_RECEIVE = 'ACK RECEIVE',
  DATA_SEND = 'DATA SEND',
  DATA_RECEIVE = 'DATA RECEIVE',
  FRAME_SEND = 'FRAME SEND',
  FRAME_RECEIVE = 'FRAME RECEIVE',

  NODE_CREATED = 'NODE CREATED',
  IP_ASSIGN = 'IP ASSIGN',
  INTERFACE_CONNECT = 'INTERFACE CONNECT',
  INTERFACE_DISCONNECT = 'INTERFACE DISCONNECT',
}

const getHostObject = (host: BaseNode, iface?: NetworkInterface) => ({
  host,
  interface: iface,
});

const getLogMessage = (log: ILog) => {
  const hostName = log.host.host.name;
  const interfaceFullName = log.host.interface?.fullName;
  const otherHostName = log.otherHost?.interface;
  const otherInterfaceFullName = log.otherHost?.interface?.fullName;

  const host1Tag = `${interfaceFullName || hostName}`;
  const host2Tag = otherHostName
    ? `${otherInterfaceFullName || otherHostName}`
    : '';
  const eventTag = `${log.type}`;

  return `${host1Tag}: ${eventTag} ${host2Tag} 
  ${log.dataExchanged || ''}
`;
};

class Logger implements ILogger {
  private listeners: LoggerCallbackFunction[] = [];

  logEvent(
    event: EventType,
    host: BaseNode,
    iface?: NetworkInterface,
    otherHost?: BaseNode,
    otherIface?: NetworkInterface,
    dataExchanged?: string
  ) {
    const log: ILog = {
      type: event,
      host: getHostObject(host, iface),
      otherHost: otherHost
        ? getHostObject(otherHost, otherIface)
        : undefined,
      dataExchanged,
    };
    log.toString = () => getLogMessage(log);
    this.emit(log);
  }

  /**
   * Listen to new log entries
   * @param cb
   */
  listen(cb: LoggerCallbackFunction) {
    this.listeners.push(cb);
  }

  /**
   * Emit a new log entry to listeners
   */
  private emit(log: ILog) {
    this.listeners.forEach((cb) => cb(log));
  }
}

export default Logger;
export { EventType };
