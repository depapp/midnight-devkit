# Midnight DevKit 🌙

A comprehensive developer toolkit for building on Midnight Network - enhancing the developer experience with powerful tools for privacy-first blockchain development.

![Midnight DevKit Banner](https://img.shields.io/badge/Midnight-DevKit-purple?style=for-the-badge)
![License](https://img.shields.io/badge/License-Apache%202.0-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-1.0.0-green?style=for-the-badge)

## 🎯 Overview

Midnight DevKit is a comprehensive suite of developer tools designed to streamline and enhance the development experience on the Midnight Network. Built for the Midnight Network "Privacy First" Challenge, this toolkit addresses key pain points in the current development workflow.

### 🚀 Key Components

1. **CLI Tool** (`@midnight-devkit/cli`) - Powerful command-line interface for project scaffolding, testing, deployment, and proof server management
2. **ZK Playground** (`@midnight-devkit/playground`) - Interactive web-based tool for experimenting with zero-knowledge proofs, featuring visual circuit building and real-time code generation

## 📦 Installation

### Quick Start

```bash
# Install the CLI globally
npm install -g @midnight-devkit/cli

# Create a new Midnight project
midnight init my-app

# Navigate to your project
cd my-app

# Start development
midnight proof-server start
npm run dev
```

### Prerequisites

- Node.js 18+ 
- Docker Desktop (for proof server)
- Midnight Compact Compiler
- Google Chrome (for Lace wallet integration)

## 🛠️ Features

### CLI Tool Features

#### Project Scaffolding
```bash
# Interactive project creation
midnight init

# With options
midnight init my-app --template defi-app --typescript
```

Available templates:
- `basic-dapp` - Simple DApp with smart contract and UI
- `zk-game` - Privacy-preserving game using ZK proofs
- `defi-app` - DeFi application with privacy features
- `identity` - Privacy-preserving identity verification

#### Contract Management
```bash
# Compile Compact contracts
midnight contract compile

# Watch mode for development
midnight contract compile --watch

# Verify deployed contract
midnight contract verify <address>

# Interactive contract interaction
midnight contract interact <address>
```

#### Deployment
```bash
# Deploy to testnet
midnight deploy --network testnet

# Deploy with custom configuration
midnight deploy --config custom.config.json
```

#### Testing
```bash
# Run tests
midnight test

# With coverage
midnight test --coverage

# Watch mode
midnight test --watch
```

#### Proof Server Management
```bash
# Start proof server
midnight proof-server start

# Run in background
midnight proof-server start --detached

# Check status
midnight proof-server status

# View logs
midnight proof-server logs --follow

# Stop server
midnight proof-server stop
```

### ZK Playground Features

The interactive web application provides:

- **Visual Circuit Builder** - Drag-and-drop interface for creating ZK circuits
- **Code Editor** - Monaco-based editor with Compact syntax highlighting
- **Proof Visualizer** - Real-time visualization of proof generation
- **Example Gallery** - Pre-built examples with explanations
- **Performance Profiler** - Analyze proof generation performance

### VS Code Extension Features

- IntelliSense for Midnight APIs
- Compact language syntax highlighting
- Contract debugging capabilities
- Security linting
- Snippet library with best practices

### Developer Dashboard

- Real-time contract monitoring
- Network statistics and health metrics
- Gas price tracking
- Interactive debugging console
- API testing interface

## 🏗️ Architecture

```
midnight-devkit/
├── packages/
│   ├── cli/                 # CLI tool
│   │   ├── src/
│   │   │   ├── commands/    # CLI commands
│   │   │   └── utils/       # Utility functions
│   │   └── package.json
│   ├── vscode-extension/    # VS Code extension
│   ├── playground/          # ZK Playground web app
│   │   ├── src/
│   │   │   ├── components/  # React components
│   │   │   └── utils/       # Helper functions
│   │   └── package.json
│   └── dashboard/           # Developer dashboard
└── package.json             # Monorepo configuration
```

## 💻 Development

### Setting up the development environment

```bash
# Clone the repository
git clone https://github.com/midnight-devkit/midnight-devkit.git
cd midnight-devkit

# Install dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test
```

### Running locally

```bash
# Start the CLI in development mode
cd packages/cli
npm run dev

# Start the ZK Playground
cd packages/playground
npm run dev

# Start the Dashboard
cd packages/dashboard
npm run dev
```

## 📚 Documentation

### CLI Commands Reference

| Command | Description |
|---------|-------------|
| `midnight init [name]` | Initialize a new project |
| `midnight deploy` | Deploy contract to network |
| `midnight test` | Run contract tests |
| `midnight contract compile` | Compile Compact contracts |
| `midnight proof-server start` | Start proof server |

### Configuration

Create a `midnight.config.json` file in your project root:

```json
{
  "network": "testnet",
  "compiler": {
    "version": "0.8.11",
    "outputDir": "build"
  },
  "proofServer": {
    "port": 6300,
    "docker": true
  }
}
```

## 🎯 Use Cases

### For New Developers
- Quick project setup with templates
- Interactive learning through ZK Playground
- Comprehensive documentation and examples

### For Experienced Developers
- Streamlined deployment workflow
- Advanced debugging tools
- Performance optimization insights

### For Teams
- Standardized project structure
- Consistent development environment
- Integrated testing framework

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Midnight Network team for the amazing platform
- DEV.to for hosting the challenge
- The open-source community for inspiration

## 🔗 Links

- [Midnight Network Documentation](https://docs.midnight.network/)
- [Challenge Page](https://dev.to/challenges/midnight-2025-08-20)
- [Discord Community](https://discord.com/invite/midnightnetwork)
- [GitHub Repository](https://github.com/midnight-devkit/midnight-devkit)

## 📞 Support

- **Discord**: Join our [Discord server](https://discord.gg/midnight-devkit)
- **Issues**: Report bugs on [GitHub Issues](https://github.com/midnight-devkit/issues)
- **Email**: support@midnight-devkit.io

---

Built with ❤️ for the Midnight Network "Privacy First" Challenge
