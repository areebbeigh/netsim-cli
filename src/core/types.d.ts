type DeviceType_ = import('./engine').DeviceType;

interface IEngine {
  addDevice(
    name: string,
    type: DeviceType_,
    ports: number
  ): [BaseNode, number];
  removeDeviceById(id: number): void;
  listDevices(): { id: number; device: BaseNode }[];

  // connect(device1: BaseNode, device2: BaseNode);
  connectById(
    deviceId1: number,
    deviceIface1: string,
    deviceId2: number,
    deviceIface2: string
  ): void;
  send(hostId: number, ip: string, data: string);
}
