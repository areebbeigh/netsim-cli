import { CommandModule } from 'yargs';

export default {
  command: 'stats',
  describe: 'Output stats on current topologies',
  builder: (yargs) => {
    return yargs.usage(`stats`);
  },
  handler: (argv: Arguments) => {
    const { engine } = argv;

    try {
      console.log(engine?.stats());
    } catch (e) {
      (argv.errorHandler || (() => {}))(e);
    }
  },
} as CommandModule;
