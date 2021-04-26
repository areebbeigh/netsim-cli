import { readFile } from 'fs';

import { CommandModule } from 'yargs';

export default {
  command: 'import <file>',
  describe: 'Import a set of instructions from file',
  builder: (yargs) => {
    return yargs
      .positional('file', {
        type: 'string',
      })
      .usage(`import <file>`);
  },
  handler: (argv: Arguments) => {
    const { argParser, errorHandler } = argv;

    readFile(argv.file as string, 'utf-8', (err, data) => {
      if (err) {
        (errorHandler || (() => {}))(err);
        return;
      }
      if (argParser) data.split('\n').forEach(argParser);
    });
  },
} as CommandModule;
