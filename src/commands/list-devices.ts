import { CommandModule } from 'yargs';

export default {
  command: 'list-devices',
  describe: 'List all devices',
  builder: (yargs) => {
    return yargs.usage(`list-devices`);
  },
  handler: (argv: Arguments) => {
    const { engine } = argv;

    try {
      engine?.listDevices().forEach((node) => {
        console.log({
          name: node.name,
          id: node.id,
          interfaces: node.interfaces.map((iface) => ({
            name: iface.name,
            ip: iface.ip,
            subnet: iface.subnet,
            mac: iface.mac,
          })),
        });
        console.log();
      });
    } catch (e) {
      (argv.errorHandler || (() => {}))(e);
    }
  },
} as CommandModule;
