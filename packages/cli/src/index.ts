#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { initCommand } from './commands/init';
import { deployCommand } from './commands/deploy';
import { testCommand } from './commands/test';
import { proofServerCommand } from './commands/proof-server';
import { contractCommand } from './commands/contract';
import { version } from '../package.json';

const program = new Command();

// ASCII art logo
const logo = chalk.cyan(`
╔══════════════════════════════════════╗
║     MIDNIGHT DEVKIT CLI              ║
║     Privacy-First Development        ║
╚══════════════════════════════════════╝
`);

program
  .name('midnight')
  .description('CLI tool for Midnight Network development')
  .version(version)
  .addHelpText('before', logo);

// Add commands
program.addCommand(initCommand);
program.addCommand(deployCommand);
program.addCommand(testCommand);
program.addCommand(proofServerCommand);
program.addCommand(contractCommand);

// Parse command line arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
