import { CommandModule } from 'yargs';
import config, { FlowControl } from '../core/config';

export default {
  command: 'flow-control <flowControlName>',
  describe: 'Import a set of instructions from file',
  builder: (yargs) => {
    return yargs
      .positional('file', {
        type: 'string',
      })
      .usage(
        `flow-control <flowControlName> (stop-and-wait, go-back-n)`
      );
  },
  handler: (argv: Arguments) => {
    const { flowControlName, errorHandler } = argv as Arguments & {
      flowControlName: 'stop-and-wait' | 'go-back-n';
    };

    switch (flowControlName) {
      case 'stop-and-wait':
        config.FLOW_CONTROL = FlowControl.STOP_AND_WAIT_ARQ;
        break;
      case 'go-back-n':
        config.FLOW_CONTROL = FlowControl.GO_BACK_N_ARQ;
        break;
      default:
        (errorHandler || (() => {}))(
          new Error(`Invalid flow control: ${flowControlName}`)
        );
        break;
    }
  },
} as CommandModule;
