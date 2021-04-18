import Engine, { DeviceType } from './core/engine';

const engine = new Engine();

const [hub, hubId] = engine.addDevice('Hub1', DeviceType.HUB, 5);
const [h1, h1Id] = engine.addDevice('Host1', DeviceType.HOST, 1);
const [h2, h2Id] = engine.addDevice('Host2', DeviceType.HOST, 1);
const [h3, h3Id] = engine.addDevice('Host3', DeviceType.HOST, 1);

console.log('devices:', engine.listDevices());
engine.connectById(hubId, 'eth0', h1Id, 'eth0');
