type DeviceType_ = import('./engine').DeviceType;

interface IEngine {
  logger: import('./logger').Logger;

  addDevice(
    name: string,
    type: DeviceType_,
    ports: number
  ): [BaseNode, number];
  removeDeviceById(id: number): void;
  listDevices(): BaseNode[];

  assignIp(deviceId: number, ifaceName: string, ip: string);
  connectById(
    deviceId1: number,
    deviceIface1: string,
    deviceId2: number,
    deviceIface2: string
  ): void;
  send(hostId: number, ip: string, data: string);
}

type EventType_ = import('./logger').EventType;

interface ILog {
  type: EventType_;
  host: {
    name: string;
    interface?: {
      name: string;
      mac: string;
      ip?: string;
    };
  };
  otherHost?: ILog['host'];
  dataExchanged?: string;
  toString(): string;
}

interface ILogger {
  logEvent(
    event: EventType_,
    host: BaseNode,
    iface?: NetworkInterface,
    otherHost?: BaseNode,
    otherIface?: NetworkInterface,
    dataExchanged?: string
  );
}

type LoggerCallbackFunction = (log: ILog) => void;
