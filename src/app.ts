import chalk from 'chalk';
import yargs from 'yargs';
import inquirer from 'inquirer';

import Engine from './core/engine';
import add from './commands/add';
import assignIp from './commands/assign-ip';
import listDevices from './commands/list-devices';
import connect from './commands/connect';
import send from './commands/send';

const engine = new Engine();
engine.logger.listen((log) => console.log(log.toString(), '\n---'));

const commands = [add, assignIp, listDevices, connect, send];
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
  .help('help');

commands.forEach((cmd) => parser.command(cmd));

function argParser(cmdString: string) {
  const args = cmdString.trim().split(' ');
  return parser.parse(args, {
    engine,
    errorHandler: (e: Error) => {
      console.log(chalk`{bold.red ${e.name}}: ${e.message}`);
    },
  });
}

function cli() {
  console.log(chalk`Welcome to netsim-cli! 
Type 'help' to get started.

Github: {blue https://github.com/areebbeigh/netsim-cli/}`);

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
    // [
    //   'add switch 5',
    //   'add host',
    //   'add host',
    //   'add host',
    //   'connect 1 eth0 2 eth0',
    //   'connect 1 eth1 3 eth0',
    //   'connect 1 eth2 4 eth0',
    //   'assign-ip 2 eth0 10.0.0.2',
    //   'assign-ip 3 eth0 10.0.0.3',
    //   'send 2 10.0.0.3 hi',
    // ].forEach(argParser);
  };
  prompt();
}

cli();
