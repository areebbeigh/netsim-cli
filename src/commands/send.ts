import { CommandModule } from 'yargs';

export default {
  command: 'send <deviceId> <destinationIp> <data>',
  describe: 'Send data from a device to a destination ip',
  builder: (yargs) => {
    return yargs
      .positional('deviceId', {
        type: 'string',
        describe: 'the device id e.g: 1, 2, etc.',
      })
      .positional('destinationIp', {
        type: 'string',
        describe: `the destination host's ip e.g 10.0.0.2`,
      })
      .positional('data', {
        type: 'string',
        describe: 'some data e.g "hello world"',
      })
      .usage(`send <deviceId> <destinationIp> <data>`);
  },
  handler: (argv: Arguments) => {
    const { engine, deviceId, destinationIp, data } = argv;

    if (deviceId && destinationIp && data) {
      try {
        engine?.send(
          deviceId as number,
          destinationIp as string,
          data as string
        );
      } catch (e) {
        (argv.errorHandler || (() => {}))(e);
      }
    } else throw new Error('Unexpected arguments');
  },
} as CommandModule;
