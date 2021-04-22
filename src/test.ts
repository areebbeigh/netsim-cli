import Engine, { DeviceType } from './core/engine';

const engine = new Engine();

engine.logger.listen((log) => console.log(log.toString()));
// engine.logger.listen((log) => console.table(log, ['type', 'host']));

// const [hub, hubId] = engine.addDevice('Hub1', DeviceType.HUB, 5);
const [h1, h1Id] = engine.addDevice(DeviceType.HOST, 1);
const [h2, h2Id] = engine.addDevice(DeviceType.HOST, 1);
// const [h3, h3Id] = engine.addDevice('Host3', DeviceType.HOST, 1);

// console.log('devices:', engine.listDevices());
// engine.connectById(hubId, 'eth0', h1Id, 'eth0');
// engine.connectById(hubId, 'eth1', h2Id, 'eth0');
// engine.connectById(hubId, 'eth2', h3Id, 'eth0');
engine.connectById(h1Id, 'eth0', h2Id, 'eth0');

engine.assignIp(h1Id, 'eth0', '10.0.0.2');
engine.assignIp(h2Id, 'eth0', '10.0.0.3');
// engine.assignIp(h3Id, 'eth0', '10.0.0.4');

engine.send(h1Id, '10.0.0.3', 'test');
