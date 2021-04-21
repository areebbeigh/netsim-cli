import chalk from 'chalk';
import inquirer from 'inquirer';

import Engine, { DeviceType } from './core/engine';

const engine = new Engine();

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
          message: chalk`{bold nestim-cli>}`,
          prefix: '',
        },
      ])
      .then(({ line }) => {
        console.log(line.split(' '));
        prompt();
      });
  };

  prompt();
}

cli();
