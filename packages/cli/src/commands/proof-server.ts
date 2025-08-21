import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { execSync, spawn } from 'child_process';
import fs from 'fs-extra';
import path from 'path';

interface ProofServerOptions {
  port?: number;
  detached?: boolean;
  verbose?: boolean;
}

export const proofServerCommand = new Command('proof-server')
  .description('Manage Midnight proof server')
  .addCommand(
    new Command('start')
      .description('Start the proof server')
      .option('-p, --port <port>', 'Port to run on', '6300')
      .option('-d, --detached', 'Run in background')
      .option('-v, --verbose', 'Verbose output')
      .action(startProofServer)
  )
  .addCommand(
    new Command('stop')
      .description('Stop the proof server')
      .action(stopProofServer)
  )
  .addCommand(
    new Command('status')
      .description('Check proof server status')
      .action(checkStatus)
  )
  .addCommand(
    new Command('logs')
      .description('View proof server logs')
      .option('-f, --follow', 'Follow log output')
      .action(viewLogs)
  );

async function startProofServer(options: ProofServerOptions) {
  const spinner = ora('Starting proof server...').start();

  try {
    // Check if Docker is installed
    try {
      execSync('docker --version', { stdio: 'ignore' });
    } catch {
      throw new Error('Docker is not installed. Please install Docker Desktop first.');
    }

    // Check if Docker is running
    try {
      execSync('docker info', { stdio: 'ignore' });
    } catch {
      throw new Error('Docker is not running. Please start Docker Desktop.');
    }

    const port = options.port || 6300;

    // Check if proof server is already running
    try {
      execSync(`curl -s http://localhost:${port}/health`, { stdio: 'ignore' });
      spinner.warn(`Proof server is already running on port ${port}`);
      return;
    } catch {
      // Server not running, continue
    }

    spinner.text = 'Pulling latest proof server image...';

    // Pull the Docker image
    try {
      execSync('docker pull midnightnetwork/proof-server:latest', { 
        stdio: options.verbose ? 'inherit' : 'ignore' 
      });
    } catch (error) {
      spinner.warn('Could not pull latest image, using local version');
    }

    spinner.text = 'Starting proof server container...';

    // Start the container
    const dockerCmd = `docker run ${options.detached ? '-d' : ''} --rm --name midnight-proof-server -p ${port}:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'`;

    if (options.detached) {
      execSync(dockerCmd, { stdio: 'ignore' });
      spinner.succeed(`Proof server started on port ${port} (detached)`);
      console.log(chalk.cyan('\n📝 Server Info:'));
      console.log(chalk.white(`  URL: http://localhost:${port}`));
      console.log(chalk.white(`  Container: midnight-proof-server`));
      console.log(chalk.gray('\n  Run "midnight proof-server logs" to view logs'));
      console.log(chalk.gray('  Run "midnight proof-server stop" to stop the server'));
    } else {
      spinner.succeed(`Proof server starting on port ${port}...`);
      console.log(chalk.cyan('\n📝 Server running at http://localhost:' + port));
      console.log(chalk.gray('Press Ctrl+C to stop the server\n'));
      
      // Run in foreground
      const child = spawn('docker', [
        'run', '--rm', '--name', 'midnight-proof-server',
        '-p', `${port}:6300`,
        'midnightnetwork/proof-server',
        '--',
        'midnight-proof-server --network testnet'
      ], { stdio: 'inherit' });

      child.on('exit', () => {
        console.log(chalk.yellow('\n⚠️  Proof server stopped'));
      });
    }

  } catch (error: any) {
    spinner.fail('Failed to start proof server');
    console.error(chalk.red('\n❌ Error:'), error.message);
    process.exit(1);
  }
}

async function stopProofServer() {
  const spinner = ora('Stopping proof server...').start();

  try {
    execSync('docker stop midnight-proof-server', { stdio: 'ignore' });
    spinner.succeed('Proof server stopped');
  } catch {
    spinner.warn('Proof server is not running');
  }
}

async function checkStatus() {
  const spinner = ora('Checking proof server status...').start();

  try {
    // Check if container is running
    const containerRunning = execSync('docker ps --filter name=midnight-proof-server --format "{{.Names}}"', { 
      encoding: 'utf-8' 
    }).trim();

    if (containerRunning) {
      // Check health endpoint
      try {
        execSync('curl -s http://localhost:6300/health', { stdio: 'ignore' });
        spinner.succeed('Proof server is running and healthy');
        
        // Get container info
        const info = execSync('docker ps --filter name=midnight-proof-server --format "table {{.Status}}\\t{{.Ports}}"', {
          encoding: 'utf-8'
        });
        
        console.log(chalk.cyan('\n📊 Server Details:'));
        console.log(chalk.gray(info));
      } catch {
        spinner.warn('Proof server container is running but not responding');
      }
    } else {
      spinner.info('Proof server is not running');
      console.log(chalk.gray('\nRun "midnight proof-server start" to start the server'));
    }
  } catch (error: any) {
    spinner.fail('Failed to check status');
    console.error(chalk.red('\n❌ Error:'), error.message);
  }
}

async function viewLogs(options: { follow?: boolean }) {
  console.log(chalk.cyan('📜 Proof server logs:\n'));

  try {
    const args = ['logs'];
    if (options.follow) args.push('-f');
    args.push('midnight-proof-server');

    const child = spawn('docker', args, { stdio: 'inherit' });
    
    child.on('error', () => {
      console.error(chalk.red('No logs available. Is the proof server running?'));
    });
  } catch (error: any) {
    console.error(chalk.red('Failed to retrieve logs:'), error.message);
  }
}
