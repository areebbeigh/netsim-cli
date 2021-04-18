enum EventType {
  ARP_SEND,
  ARP_RECEIVE,
  DATA_SEND,
  DATA_RECEIVE,
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
  return 'test';
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
