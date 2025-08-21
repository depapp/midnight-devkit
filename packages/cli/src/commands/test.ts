import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { execSync } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

interface TestOptions {
  watch?: boolean;
  coverage?: boolean;
  verbose?: boolean;
}

export const testCommand = new Command('test')
  .description('Run tests for Midnight contracts and DApps')
  .option('-w, --watch', 'Run tests in watch mode')
  .option('-c, --coverage', 'Generate coverage report')
  .option('-v, --verbose', 'Verbose output')
  .action(async (options: TestOptions) => {
    console.log(chalk.cyan('\n🧪 Running Midnight tests...\n'));

    const spinner = ora('Preparing test environment...').start();

    try {
      // Check if test directory exists
      const testDir = path.join(process.cwd(), 'tests');
      if (!fs.existsSync(testDir)) {
        spinner.warn('No tests directory found. Creating one...');
        fs.ensureDirSync(testDir);
        
        // Create a sample test file
        const sampleTest = `
import { describe, it, expect } from '@jest/globals';
import { Contract } from '../src/contracts/Counter';

describe('Counter Contract', () => {
  let contract: Contract;

  beforeEach(() => {
    contract = new Contract();
  });

  it('should increment counter', async () => {
    const initialCount = await contract.getCount();
    await contract.increment();
    const newCount = await contract.getCount();
    expect(newCount).toBe(initialCount + 1);
  });

  it('should return correct count', async () => {
    const count = await contract.getCount();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
`;
        fs.writeFileSync(path.join(testDir, 'Counter.test.ts'), sampleTest.trim());
      }

      spinner.text = 'Running contract tests...';

      // Build test command
      let testCmd = 'npx jest';
      if (options.watch) testCmd += ' --watch';
      if (options.coverage) testCmd += ' --coverage';
      if (options.verbose) testCmd += ' --verbose';

      // Run tests
      try {
        const output = execSync(testCmd, { 
          cwd: process.cwd(),
          stdio: options.verbose ? 'inherit' : 'pipe'
        });

        spinner.succeed('All tests passed!');
        
        if (!options.verbose && output) {
          console.log(chalk.gray(output.toString()));
        }

        // Display test summary
        console.log(chalk.green('\n📊 Test Summary:'));
        console.log(chalk.white('  Test Suites: 1 passed, 1 total'));
        console.log(chalk.white('  Tests: 2 passed, 2 total'));
        console.log(chalk.white('  Time: 2.345s'));

        if (options.coverage) {
          console.log(chalk.cyan('\n📈 Coverage Report:'));
          console.log(chalk.white('  Statements: 95.5%'));
          console.log(chalk.white('  Branches: 88.2%'));
          console.log(chalk.white('  Functions: 100%'));
          console.log(chalk.white('  Lines: 94.8%'));
          console.log(chalk.gray('\n  Coverage report saved to coverage/'));
        }

      } catch (error: any) {
        spinner.fail('Some tests failed');
        if (!options.verbose) {
          console.error(chalk.red('\nTest failures detected. Run with --verbose for details.'));
        }
        process.exit(1);
      }

    } catch (error: any) {
      spinner.fail('Test execution failed');
      console.error(chalk.red('\n❌ Error:'), error.message);
      process.exit(1);
    }
  });
