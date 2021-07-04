import { CommandModule } from 'yargs';

import { DeviceType } from '../core/engine';

const deviceChoices = ['host', 'hub', 'switch', 'bridge', 'router'];
export default {
  command: 'add <device> [ports]',
  describe: 'Create a new device',
  builder: (yargs) => {
    return yargs
      .positional('device', {
        choices: deviceChoices,
      })
      .option('ports', {
        type: 'number',
      })
      .usage(`add <${deviceChoices.join('|')}> [ports]`);
  },
  handler: (argv: Arguments) => {
    const { engine } = argv;
    const deviceType = {
      hub: DeviceType.HUB,
      host: DeviceType.HOST,
      switch: DeviceType.SWITCH,
      bridge: DeviceType.BRIDGE,
      router: DeviceType.ROUTER,
    }[argv.device as string];

    if (deviceType) {
      try {
        engine?.addDevice(deviceType, (argv.ports as number) || 1);
      } catch (e) {
        (argv.errorHandler || (() => {}))(e);
      }
    } else throw new Error('Unexpected device type. This is a bug.');
  },
} as CommandModule;
