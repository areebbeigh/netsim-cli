import chalk from 'chalk';
import yargs from 'yargs';
import inquirer from 'inquirer';

import Engine from './core/engine';
import add from './commands/add';
import assignIp from './commands/assign-ip';
import listDevices from './commands/list-devices';
import connect from './commands/connect';
import send from './commands/send';
import import_ from './commands/import';
import flowControl from './commands/flow-control';
import stats from './commands/stats';
import arpLookup from './commands/arp-lookup';

const engine = new Engine();
engine.logger.listen((log) => console.log(log.toString(), '\n---'));

const commands = [
  add,
  assignIp,
  listDevices,
  connect,
  send,
  import_,
  flowControl,
  stats,
  arpLookup,
];
const parser = yargs
  .exitProcess(false)
  .strict(true)
  .strictCommands(true)
  .strictOptions(true)
  .fail((msg, err, _) => {
    console.log(chalk`${msg}`);
    console.log(chalk`Type {bold help} for help.`);
    // won't actually exit https://github.com/yargs/yargs/issues/1196
    yargs.exit(0, err);
  })
  .help('help')
  .wrap(null);

commands.forEach((cmd) => parser.command(cmd));
parser.command({
  command: 'exit',
  describe: 'exit the cli',
  handler: () => {
    process.exit(0);
  },
});

function argParser(cmdString: string) {
  if (cmdString.trim().length <= 0 || cmdString.startsWith('#'))
    return;

  const args = cmdString.trim().split(' ');
  return parser.parse(args, {
    engine,
    errorHandler: (e: Error) => {
      console.log(chalk`{bold.red ${e.name}}: ${e.message}`);
    },
    argParser,
  });
}

function cli() {
  console.log(chalk`Welcome to netsim-cli! 
Type 'help' to get started.

Github: {blue https://github.com/areebbeigh/netsim-cli/}`);

  argParser('import ./sample_routers2.nsim');
  const prompt = () => {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'line',
          message: chalk`{bold.blue nestim-cli >}`,
          prefix: chalk`{bold $}`,
        },
      ])
      .then(({ line }) => {
        argParser(line);
        prompt();
      });
  };
  prompt();
}

cli();
