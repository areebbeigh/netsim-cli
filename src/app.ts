import chalk from 'chalk';
import yargs from 'yargs';
import inquirer from 'inquirer';

import Engine from './core/engine';
import add from './commands/add';

const engine = new Engine();
engine.logger.listen((log) => console.log(log.toString()));

const commands = [add];
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
  };
  prompt();
}

cli();
