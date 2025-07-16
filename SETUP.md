# Setup Instructions

## Prerequisites

1. **Node.js** (v18 or higher)
2. **OpenAI API Key** - Sign up at https://openai.com/api/
3. **Hardhat Local Network** - Make sure you have a local Hardhat node running

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
# Copy the example env file
cp .env.example .env

# Edit .env and add your OpenAI API key
OPENAI_API_KEY=your_actual_openai_api_key_here
```

## Running the Application

### Option 1: Run everything at once
```bash
npm start
```
This runs both the API server (port 3001) and the React app (port 8080).

### Option 2: Run separately

**Terminal 1 - API Server:**
```bash
npm run api
```

**Terminal 2 - React App:**
```bash
npm run dev
```

### Option 3: Development mode with auto-restart
```bash
# Terminal 1
npm run dev:api

# Terminal 2  
npm run dev
```

## Setting up Hardhat Network

Before using the app, you need to have a Hardhat local network running:

1. Navigate to your Hardhat project directory
2. Run: `npx hardhat node`
3. This will start a local blockchain at `http://127.0.0.1:8545`

## Features

- ✅ **OpenAI Integration**: Real contract generation using GPT-4
- ✅ **Blockchain Deployment**: Deploy contracts to local Hardhat network
- ✅ **JSON Storage**: Contracts are saved to `server/data/contracts.json`
- ✅ **Payment System**: Execute payments through smart contracts
- ✅ **User Management**: Switch between different wallet accounts

## API Endpoints

- `POST /api/generate` - Generate smart contract using OpenAI
- `POST /api/deploy` - Deploy contract to blockchain
- `GET /api/contracts` - Get all contracts
- `POST /api/payments` - Record payment execution

## Troubleshooting

### "Failed to generate contract"
- Check that your OpenAI API key is valid in the `.env` file
- Ensure the API server is running on port 3001

### "Failed to deploy contract"  
- Make sure Hardhat node is running on `http://127.0.0.1:8545`
- Check that the account has sufficient ETH for gas fees

### Contracts not saving
- Ensure the `server/data/` directory exists
- Check write permissions for the data directory

## Development

The application consists of:
- **Frontend**: React + TypeScript + Vite (port 8080)
- **Backend**: Express.js API server (port 3001)
- **Storage**: JSON file in `server/data/contracts.json`
- **Blockchain**: Hardhat local network (port 8545)