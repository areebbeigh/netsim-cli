import { CommandModule } from 'yargs';

export default {
  command: 'assign-ip <deviceId> <interface> <ip>',
  describe: 'Assign IP to a device interface',
  builder: (yargs) => {
    return yargs
      .positional('deviceId', {
        type: 'string',
        describe: 'the device id e.g: 1, 2, etc.',
      })
      .positional('interface', {
        type: 'string',
        describe: 'the interface name e.g: eth0, eth1, etc.',
      })
      .positional('ip', {
        type: 'string',
        describe: 'e.g: 10.0.0.2',
      })
      .usage(`assign-ip <deviceId> <interface> <ip>`);
  },
  handler: (argv: Arguments) => {
    const { engine, deviceId, ip } = argv;

    if (deviceId && argv.interface && ip) {
      try {
        engine?.assignIp(
          deviceId as number,
          argv.interface as string,
          ip as string
        );
      } catch (e) {
        (argv.errorHandler || (() => {}))(e);
      }
    } else throw new Error('Unexpected argument types');
  },
} as CommandModule;
