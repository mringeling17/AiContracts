# 🤖 AIContracts Dashboard

A modern web application for generating, deploying, and managing smart contracts using natural language processing. Transform human-readable agreements into blockchain-ready Solidity contracts with an intuitive dashboard interface.

![AIContracts Dashboard](https://img.shields.io/badge/Version-1.0.0-orange) ![License](https://img.shields.io/badge/License-MIT-blue) ![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-purple)

## 🚀 Features

### ✨ Core Functionalities

- **User Identity Selection**: Choose your identity from pre-configured Hardhat accounts before accessing the dashboard
- **Natural Language to Smart Contract**: Convert plain English descriptions into Solidity smart contracts
- **One-Click Deployment**: Automatically compile and deploy contracts to local Hardhat network
- **Personalized Payment Management**: Execute contract payments using your selected account identity
- **Contract Monitoring**: Real-time dashboard showing deployed contracts and their status
- **Metadata Extraction**: Automatically extract parties, amounts, due dates from contract descriptions
- **Payment Tracking**: Prevent duplicate payments and track transaction history
- **Source Code Viewing**: Inspect generated Solidity code with syntax highlighting
- **User Switching**: Easily switch between different user identities during your session

### 🎨 UI/UX Features

- **User Selection Interface**: Beautiful onboarding screen to choose your blockchain identity
- **Modern Dashboard Design**: Professional interface with orange/blue color scheme
- **Personalized Experience**: UI adapts to show your selected user identity and account
- **Responsive Layout**: Works seamlessly on desktop and mobile devices
- **Real-time Stats**: Live contract count, payment tracking, and network status
- **Interactive Cards**: Hover animations and visual feedback
- **Payment Confirmation Modal**: Detailed transaction preview before execution

## 🛠️ Technology Stack

### Frontend
- **SvelteKit** - Full-stack web framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **Prism.js** - Syntax highlighting for Solidity code

### Blockchain & Development
- **Hardhat** - Ethereum development environment
- **Ethers.js** - Ethereum interaction library
- **Solidity Compiler (solc)** - Smart contract compilation
- **Local Ethereum Network** - Hardhat's built-in blockchain

### Backend & APIs
- **OpenAI API** - AI-powered smart contract generation from natural language
- **SvelteKit API Routes** - Server-side functionality
- **File System (fs)** - Contract storage and management
- **JSON Storage** - Deployed contracts database

## 🏃‍♂️ Quick Start

### Prerequisites

**Option 1: Docker (Recommended)**
- Docker and Docker Compose
- OpenAI API key (for smart contract generation)

**Option 2: Local Development**
- Node.js (v18 or higher)
- npm or yarn package manager
- OpenAI API key (for smart contract generation)

### 🐳 Docker Installation (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aicontracts
   ```

2. **Set up environment variables**
   ```bash
   # Create .env file in the root directory
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
   ```

3. **Start all services with Docker Compose**
   ```bash
   # Production mode
   docker-compose up -d

   # Development mode (with hot reload)
   docker-compose --profile development up -d
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

5. **To stop the services**
   ```bash
   docker-compose down
   ```

### 💻 Local Development Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd aicontracts
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in the root directory
   echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
   ```

4. **Start Hardhat local network** (in a separate terminal)
   ```bash
   npx hardhat node
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🧪 Testing Guide

### Pre-configured Test Accounts

The application uses Hardhat's default accounts with these names for testing:

| Name | Address | Index | Purpose |
|------|---------|-------|---------|
| **Alice** | `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` | 0 | Default payer/recipient |
| **Bob** | `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` | 1 | Contract party |
| **Charlie** | `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` | 2 | Additional party |
| **Dave** | `0x90F79bf6EB2c4f870365E785982E1f101E93b906` | 3 | Payment sender |
| **Eve** | `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65` | 4 | Additional party |

### Sample Contract Descriptions

Use these examples to test contract generation:

#### Payment Contracts
```
Alice will pay Bob 2 ETH after delivery of the goods
```

```
Dave will pay Alice 1.5 ETH for consulting services
```

#### Time-based Contracts
```
Bob will pay Alice 3 ETH by December 31st for web development
```

#### Multi-party Contracts
```
Charlie will pay Dave 0.5 ETH and Eve will pay Alice 1 ETH for the project
```

### Testing Workflow

1. **Select User Identity**: Choose from Alice, Bob, Charlie, Dave, Eve, Frank, Grace, or Heidi
2. **Generate Contract**: Enter a natural language description using your selected identity
3. **Review Generated Code**: Check the Solidity output
4. **View Contract Details**: Inspect parties, amounts, and functions
5. **Execute Payments**: Click payment buttons to test transactions (uses your selected account)
6. **Switch Users**: Test different perspectives by switching user identities
7. **Verify Payment Status**: Confirm payments are marked as completed

## 📁 Project Structure

```
aicontracts/
├── src/
│   ├── routes/
│   │   ├── +page.svelte          # Main dashboard UI
│   │   ├── +layout.svelte        # App layout
│   │   └── api/
│   │       ├── deploy/
│   │       │   └── +server.ts    # Contract deployment API
│   │       └── payments/
│   │           └── +server.ts    # Payment tracking API
│   ├── app.css                   # Global styles
│   └── app.html                  # HTML template
├── deployed-contracts.json       # Contract storage
├── package.json                  # Dependencies
├── hardhat.config.js             # Hardhat configuration
├── Dockerfile                    # SvelteKit app container
├── Dockerfile.hardhat           # Hardhat blockchain container
├── docker-compose.yml           # Multi-service orchestration
├── .dockerignore                # Docker build exclusions
├── .env                         # Environment variables
└── README.md                    # This file
```

## 🐳 Docker Commands

### Basic Commands
```bash
# Start all services
docker-compose up -d

# Start in development mode (with hot reload)
docker-compose --profile development up -d

# Stop all services
docker-compose down

# View running services
docker-compose ps

# View logs
docker-compose logs
docker-compose logs app
docker-compose logs hardhat

# Restart services
docker-compose restart

# Rebuild and start
docker-compose up --build

# Remove containers and volumes
docker-compose down -v
```

### Development Workflow
```bash
# Start development environment
docker-compose --profile development up -d

# Watch logs in real-time
docker-compose logs -f app

# Execute commands in running container
docker-compose exec app npm run build
docker-compose exec hardhat npx hardhat accounts

# Access container shell
docker-compose exec app sh
docker-compose exec hardhat sh
```

## 🔧 Configuration

### Environment Variables

Required environment variables for the application:

- **OPENAI_API_KEY**: Your OpenAI API key for smart contract generation
- **Hardhat Network**: `http://127.0.0.1:8545`
- **Default Port**: `5173`
- **Storage**: Local JSON file

Create a `.env` file in the root directory:
```env
OPENAI_API_KEY=sk-your-openai-api-key-here
```

### Docker Configuration

The Docker setup includes two services:

**Hardhat Service (`hardhat`)**
- Runs on port `8545`
- Provides 20 pre-funded accounts with 10,000 ETH each
- Includes health checks and automatic restarts
- Accessible internally via `http://hardhat:8545`

**SvelteKit App Service (`app` or `app-dev`)**
- Runs on port `5173`
- Connects to Hardhat service automatically
- Supports both production and development modes
- Includes volume mounts for persistent data

### Hardhat Configuration

The application expects a running Hardhat node with default configuration:
- 20 pre-funded accounts
- Each account has 10,000 ETH
- Gas price and limits set to defaults
- Chain ID: 31337 (Hardhat default)

## 🎯 API Endpoints

### Smart Contract Generation
- **POST** `/api/generate/contract` - Generate Solidity code from natural language using OpenAI

### Contract Deployment
- **POST** `/api/deploy` - Compile and deploy generated contract to blockchain
- **GET** `/api/deploy` - Get all deployed contracts

### Payment Management
- **POST** `/api/payments` - Record and track payment transactions

## 🐛 Troubleshooting

### Common Issues

**1. "OpenAI API Error" or "Failed to generate contract"**
- Check your OpenAI API key is correctly set in `.env` file
- Verify your OpenAI account has sufficient credits
- Check console for detailed error messages

**2. "Cannot connect to Hardhat node"**
- Ensure Hardhat node is running: `npx hardhat node`
- Check network URL: `http://127.0.0.1:8545`

**3. "Contract compilation failed"**
- Verify Solidity syntax in generated contract
- Try regenerating the contract with clearer description
- Check console for detailed error messages

**4. "Payment failed: Only X can pay"**
- Contract requires specific account to execute payment
- Check payment modal for correct paying account

**5. "MetaMask not detected"**
- Application uses Hardhat provider directly
- No MetaMask required for local testing

**6. Docker-related issues**
- Check if services are running: `docker-compose ps`
- View logs: `docker-compose logs app` or `docker-compose logs hardhat`
- Restart services: `docker-compose restart`
- Rebuild containers: `docker-compose up --build`

### Debug Mode

Enable detailed logging by checking browser console for:
- OpenAI API requests and responses
- Contract generation steps
- Solidity compilation process
- Deployment transactions
- Payment execution details

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with sample contracts
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **OpenAI** for providing the GPT API that powers smart contract generation
- **Hardhat** team for the excellent Ethereum development environment
- **SvelteKit** for the amazing full-stack framework
- **Tailwind CSS** for the utility-first styling approach
- **Ethers.js** for seamless blockchain interaction capabilities

---

**Built with ❤️ for the blockchain community**

For support or questions, please open an issue on GitHub.