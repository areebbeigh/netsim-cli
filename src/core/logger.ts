enum EventType {
  ARP_SEND = 'ARP SEND',
  ARP_RECEIVE = 'ARP RECEIVE',
  ARP_LEARN = 'ARP LEARN',
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
  name: host.name || 'unknown',
  interface: iface
    ? {
        name: iface.name || 'unknown',
        mac: iface.mac,
        ip: iface.ip,
      }
    : undefined,
});

const getLogMessage = (log: ILog) => {
  return JSON.stringify(log);
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
