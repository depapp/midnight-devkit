import { Command } from 'commander';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';

interface ProjectOptions {
  name: string;
  template: string;
  useTypeScript: boolean;
  installDependencies: boolean;
}

const templates = {
  'basic-dapp': {
    name: 'Basic DApp',
    description: 'Simple DApp with smart contract and UI',
    repo: 'https://github.com/midnight-network/basic-dapp-template'
  },
  'zk-game': {
    name: 'ZK Game',
    description: 'Privacy-preserving game using zero-knowledge proofs',
    repo: 'https://github.com/midnight-network/zk-game-template'
  },
  'defi-app': {
    name: 'DeFi Application',
    description: 'Decentralized finance application with privacy features',
    repo: 'https://github.com/midnight-network/defi-template'
  },
  'identity': {
    name: 'Identity Verification',
    description: 'Privacy-preserving identity verification system',
    repo: 'https://github.com/midnight-network/identity-template'
  }
};

export const initCommand = new Command('init')
  .description('Initialize a new Midnight project')
  .argument('[name]', 'Project name')
  .option('-t, --template <template>', 'Project template to use')
  .option('--typescript', 'Use TypeScript', true)
  .option('--no-install', 'Skip dependency installation')
  .action(async (name?: string, options?: any) => {
    console.log(chalk.cyan('\n🚀 Initializing new Midnight project...\n'));

    // Interactive prompts
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project name:',
        default: name || 'my-midnight-app',
        validate: (input: string) => {
          if (/^[a-z0-9-]+$/.test(input)) return true;
          return 'Project name must contain only lowercase letters, numbers, and hyphens';
        }
      },
      {
        type: 'list',
        name: 'template',
        message: 'Select a project template:',
        choices: Object.entries(templates).map(([key, value]) => ({
          name: `${value.name} - ${value.description}`,
          value: key
        })),
        when: !options?.template
      },
      {
        type: 'confirm',
        name: 'useTypeScript',
        message: 'Use TypeScript?',
        default: true,
        when: options?.typescript === undefined
      },
      {
        type: 'confirm',
        name: 'installDependencies',
        message: 'Install dependencies?',
        default: true,
        when: options?.install === undefined
      }
    ]);

    const projectOptions: ProjectOptions = {
      name: answers.name || name,
      template: answers.template || options?.template || 'basic-dapp',
      useTypeScript: answers.useTypeScript ?? options?.typescript ?? true,
      installDependencies: answers.installDependencies ?? options?.install ?? true
    };

    const projectPath = path.join(process.cwd(), projectOptions.name);

    // Check if directory exists
    if (fs.existsSync(projectPath)) {
      console.log(chalk.red(`\n❌ Directory ${projectOptions.name} already exists!`));
      process.exit(1);
    }

    // Create project directory
    const spinner = ora('Creating project structure...').start();
    
    try {
      // Create project directory
      fs.ensureDirSync(projectPath);

      // Create basic project structure
      await createProjectStructure(projectPath, projectOptions);

      spinner.succeed('Project structure created');

      // Install dependencies if requested
      if (projectOptions.installDependencies) {
        spinner.start('Installing dependencies...');
        execSync('npm install', { cwd: projectPath, stdio: 'ignore' });
        spinner.succeed('Dependencies installed');
      }

      // Success message
      console.log(chalk.green('\n✅ Project created successfully!\n'));
      console.log(chalk.cyan('To get started:'));
      console.log(chalk.white(`  cd ${projectOptions.name}`));
      if (!projectOptions.installDependencies) {
        console.log(chalk.white('  npm install'));
      }
      console.log(chalk.white('  npm run dev'));
      console.log(chalk.cyan('\nHappy building! 🌙'));

    } catch (error) {
      spinner.fail('Failed to create project');
      console.error(chalk.red('\n❌ Error:'), error);
      process.exit(1);
    }
  });

async function createProjectStructure(projectPath: string, options: ProjectOptions) {
  // Create directories
  const dirs = [
    'src',
    'src/contracts',
    'src/components',
    'src/utils',
    'tests',
    'public'
  ];

  dirs.forEach(dir => {
    fs.ensureDirSync(path.join(projectPath, dir));
  });

  // Create package.json
  const packageJson = {
    name: options.name,
    version: '0.1.0',
    description: 'A Midnight Network DApp',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      test: 'jest',
      'compile-contract': 'compactc src/contracts/main.compact -o build/',
      deploy: 'midnight deploy'
    },
    dependencies: {
      '@midnight-ntwrk/midnight-js-sdk': 'latest',
      '@midnight-ntwrk/compact-runtime': 'latest',
      'react': '^18.2.0',
      'react-dom': '^18.2.0',
      'vite': '^4.4.0'
    },
    devDependencies: options.useTypeScript ? {
      '@types/react': '^18.2.0',
      '@types/react-dom': '^18.2.0',
      'typescript': '^5.0.0',
      '@vitejs/plugin-react': '^4.0.0'
    } : {
      '@vitejs/plugin-react': '^4.0.0'
    },
    license: 'Apache-2.0'
  };

  fs.writeJsonSync(path.join(projectPath, 'package.json'), packageJson, { spaces: 2 });

  // Create basic contract file
  const contractContent = `
// Basic Midnight smart contract
contract Counter {
  secret counter: Field;
  
  export function increment(): Void {
    counter = counter + 1;
  }
  
  export function getCount(): Field {
    return counter;
  }
}
`;

  fs.writeFileSync(
    path.join(projectPath, 'src/contracts/Counter.compact'),
    contractContent.trim()
  );

  // Create main app file
  const appContent = options.useTypeScript ? `
import React, { useState, useEffect } from 'react';
import { MidnightProvider, useMidnight } from '@midnight-ntwrk/midnight-js-sdk';

function App() {
  const [count, setCount] = useState<number>(0);
  const { contract, isConnected } = useMidnight();

  const handleIncrement = async () => {
    if (contract) {
      await contract.increment();
      const newCount = await contract.getCount();
      setCount(newCount);
    }
  };

  return (
    <div className="app">
      <h1>Midnight Counter DApp</h1>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
      <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
    </div>
  );
}

export default App;
` : `
import React, { useState, useEffect } from 'react';
import { MidnightProvider, useMidnight } from '@midnight-ntwrk/midnight-js-sdk';

function App() {
  const [count, setCount] = useState(0);
  const { contract, isConnected } = useMidnight();

  const handleIncrement = async () => {
    if (contract) {
      await contract.increment();
      const newCount = await contract.getCount();
      setCount(newCount);
    }
  };

  return (
    <div className="app">
      <h1>Midnight Counter DApp</h1>
      <p>Count: {count}</p>
      <button onClick={handleIncrement}>Increment</button>
      <p>Connected: {isConnected ? 'Yes' : 'No'}</p>
    </div>
  );
}

export default App;
`;

  const fileExtension = options.useTypeScript ? 'tsx' : 'jsx';
  fs.writeFileSync(
    path.join(projectPath, `src/App.${fileExtension}`),
    appContent.trim()
  );

  // Create README
  const readmeContent = `
# ${options.name}

A Midnight Network DApp built with Midnight DevKit.

## Getting Started

### Prerequisites

- Node.js 18+
- Midnight Compact compiler
- Docker (for proof server)

### Installation

\`\`\`bash
npm install
\`\`\`

### Development

1. Start the proof server:
\`\`\`bash
midnight proof-server start
\`\`\`

2. Compile contracts:
\`\`\`bash
npm run compile-contract
\`\`\`

3. Start development server:
\`\`\`bash
npm run dev
\`\`\`

### Deployment

\`\`\`bash
midnight deploy --network testnet
\`\`\`

## License

Apache-2.0
`;

  fs.writeFileSync(
    path.join(projectPath, 'README.md'),
    readmeContent.trim()
  );

  // Create .gitignore
  const gitignoreContent = `
node_modules/
dist/
build/
.env
.env.local
*.log
.DS_Store
`;

  fs.writeFileSync(
    path.join(projectPath, '.gitignore'),
    gitignoreContent.trim()
  );

  // Create midnight.config.json
  const midnightConfig = {
    network: 'testnet',
    compiler: {
      version: '0.8.11',
      outputDir: 'build'
    },
    proofServer: {
      port: 6300,
      docker: true
    }
  };

  fs.writeJsonSync(
    path.join(projectPath, 'midnight.config.json'),
    midnightConfig,
    { spaces: 2 }
  );
}
