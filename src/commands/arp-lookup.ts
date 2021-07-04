import { CommandModule } from 'yargs';

export default {
  command: 'arp-lookup <deviceId> <lookupIp>',
  describe: 'Send an ARP lookup from a device',
  builder: (yargs) => {
    return yargs
      .positional('deviceId', {
        type: 'string',
        describe: 'the device id e.g: 1, 2, etc.',
      })
      .positional('lookupIp', {
        type: 'string',
        describe: `the target host's ip e.g 10.0.0.2`,
      })
      .usage(`arp-lookup <deviceId> <lookupIp>`);
  },
  handler: (argv: Arguments) => {
    const { engine, deviceId, lookupIp } = argv;

    if (deviceId && lookupIp) {
      try {
        engine?.arpLookup(deviceId as number, lookupIp as string);
      } catch (e) {
        (argv.errorHandler || (() => {}))(e);
      }
    } else throw new Error('Unexpected arguments');
  },
} as CommandModule;
