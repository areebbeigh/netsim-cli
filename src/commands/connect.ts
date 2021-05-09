import { CommandModule } from 'yargs';

export default {
  command:
    'connect <deviceId1> <interface1> <deviceId2> <interface2> [successProbability]',
  describe: 'Connect two device interfaces',
  builder: (yargs) => {
    return yargs
      .positional('deviceId1', {
        type: 'string',
        describe: 'the device id e.g: 1, 2, etc.',
      })
      .positional('interface1', {
        type: 'string',
        describe: 'the interface name e.g: eth0, eth1, etc.',
      })
      .positional('deviceId2', {
        type: 'string',
        describe: 'the second device id e.g: 1, 2, etc.',
      })
      .positional('interface2', {
        type: 'string',
        describe: 'the second interface name e.g: eth0, eth1, etc.',
      })
      .option('successProbability', {
        type: 'number',
        describe: 'the success rate of sending on this link',
      })
      .usage(
        `connect <deviceId1> <interface1> <deviceId2> <interface2> [successProbability]`
      );
  },
  handler: (argv: Arguments) => {
    const {
      engine,
      deviceId1,
      interface1,
      deviceId2,
      interface2,
    } = argv;

    let { successProbability } = argv;
    if (successProbability === undefined) successProbability = 1;

    if (deviceId1 && interface1 && deviceId2 && interface2) {
      try {
        engine?.connectById(
          deviceId1 as number,
          interface1 as string,
          deviceId2 as number,
          interface2 as string,
          successProbability as number
        );
      } catch (e) {
        (argv.errorHandler || (() => {}))(e);
      }
    } else throw new Error('Unexpected arguments');
  },
} as CommandModule;
