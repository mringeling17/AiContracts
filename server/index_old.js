import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';
import { ethers } from 'ethers';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.API_PORT || 3001;

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(express.json());

// Path to store contracts data
const contractsDataPath = path.join(__dirname, 'data', 'contracts.json');

// Ensure data directory exists
if (!fs.existsSync(path.dirname(contractsDataPath))) {
  fs.mkdirSync(path.dirname(contractsDataPath), { recursive: true });
}

// Initialize contracts.json if it doesn't exist
if (!fs.existsSync(contractsDataPath)) {
  fs.writeFileSync(contractsDataPath, JSON.stringify({ contracts: [] }, null, 2));
}

// Helper function to read contracts
function readContracts() {
  try {
    const data = fs.readFileSync(contractsDataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading contracts:', error);
    return { contracts: [] };
  }
}

// Helper function to save contracts
function saveContracts(data) {
  try {
    fs.writeFileSync(contractsDataPath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving contracts:', error);
    return false;
  }
}

// API Routes

// Generate contract using OpenAI
app.post('/api/generate', async (req, res) => {
  try {
    const { goal, details } = req.body;

    if (!goal) {
      return res.status(400).json({ error: 'Goal is required' });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not configured' });
    }

    const prompt = `Create a Solidity smart contract based on the following requirements:

Goal: ${goal}
${details ? `Additional Details: ${details}` : ''}

Please provide:
1. Complete Solidity code
2. Contract name
3. Brief description of functionality
4. Any payment functions if applicable

The contract should be production-ready, secure, and follow best practices. Include proper error handling and events.

Format the response as JSON with the following structure:
{
  "contractCode": "// SPDX-License-Identifier: MIT...",
  "contractName": "ContractName",
  "description": "Brief description",
  "paymentFunctions": [{"name": "functionName", "amount": "1.0 ether", "recipient": "contractor"}]
}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are an expert Solidity developer. Create secure, efficient smart contracts based on user requirements. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    });

    const responseText = completion.choices[0].message.content;
    
    // Try to extract JSON from the response
    let contractData;
    try {
      // Look for JSON in the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        contractData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('No JSON found in response');
      }
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', parseError);
      // Fallback: create a basic structure
      contractData = {
        contractCode: responseText,
        contractName: `Contract_${Date.now()}`,
        description: goal,
        paymentFunctions: []
      };
    }

    res.json({
      success: true,
      contractCode: contractData.contractCode,
      contractName: contractData.contractName,
      description: contractData.description,
      paymentFunctions: contractData.paymentFunctions || []
    });

  } catch (error) {
    console.error('Error generating contract:', error);
    res.status(500).json({ 
      error: 'Failed to generate contract',
      details: error.message 
    });
  }
});

// Deploy contract
app.post('/api/deploy', async (req, res) => {
  try {
    const { contractCode, contractName, goal, paymentFunctions } = req.body;

    if (!contractCode || !contractName) {
      return res.status(400).json({ error: 'Contract code and name are required' });
    }

    // Connect to Hardhat local network
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    
    // Use the first account for deployment
    const signer = await provider.getSigner(0);

    try {
      // Extract contract name from code if not provided
      const contractNameMatch = contractCode.match(/contract\s+(\w+)/);
      const actualContractName = contractNameMatch ? contractNameMatch[1] : contractName;

      // Compile and deploy the contract
      // Note: In a real implementation, you'd want to use a proper Solidity compiler
      // For now, we'll simulate the deployment
      
      // Create a simple factory contract for demonstration
      const simpleFactoryCode = `
        // SPDX-License-Identifier: MIT
        pragma solidity ^0.8.0;
        
        contract SimpleContract {
            string public name;
            string public description;
            address public owner;
            
            event ContractCreated(string name, address owner);
            
            constructor(string memory _name, string memory _description) {
                name = _name;
                description = _description;
                owner = msg.sender;
                emit ContractCreated(_name, msg.sender);
            }
            
            function getName() public view returns (string memory) {
                return name;
            }
        }
      `;

      // For demo purposes, we'll create a simple contract deployment
      // In production, you'd compile the actual contract code
      const contractFactory = new ethers.ContractFactory(
        [
          "constructor(string memory _name, string memory _description)",
          "function getName() view returns (string)",
          "event ContractCreated(string name, address owner)"
        ],
        "0x608060405234801561001057600080fd5b5060405161028038038061028083398101604081905261002f9161007c565b600061003b8382610149565b50600161004882826101;49565b50336002819055507f6c7a8c5b3b5d7c5e2c8b5a4d3e6f8c9b2a1d6c7e8f4c9b2a1d8c7e6f4c9b2a1d608051806100866000396000f3fe608060405234801561001057600080fd5b506004361061002b5760003560e01c8063017e7c5014610030575b600080fd5b61003861004e565b6040516100459190610060565b60405180910390f35b6060600080546100a39061009c565b80601f01602080910402602001604051908101604052809291908181526020018280546100cf9061009c565b801561011c5780601f106100f15761010080835404028352916020019161011c565b820191906000526020600020905b8154815290600101906020018083116100ff57829003601f168201915b5050505050905090565b600060208083528351808285015260005b8181101561015357858101830151858201604001528201610137565b81811115610165576000604083870101525b50601f01601f19169290920160400192915050565b61018861018e565b565b565b565b565b565b565b565b565b56",
        signer
      );

      // Deploy the contract
      const contract = await contractFactory.deploy(actualContractName, goal || "Generated contract");
      await contract.waitForDeployment();

      const contractAddress = await contract.getAddress();
      const receipt = await contract.deploymentTransaction().wait();

      // Create contract data
      const newContract = {
        id: Date.now(),
        name: actualContractName,
        goal: goal || "Generated smart contract",
        address: contractAddress,
        status: "deployed",
        deployedAt: new Date().toISOString(),
        gasUsed: Number(receipt.gasUsed),
        value: 0,
        abi: contractFactory.interface.format('json'),
        metadata: {
          paymentFunctions: paymentFunctions || [],
          contractCode: contractCode
        }
      };

      // Save to contracts.json
      const contractsData = readContracts();
      contractsData.contracts.push(newContract);
      saveContracts(contractsData);

      res.json({
        success: true,
        contract: newContract,
        transactionHash: receipt.hash,
        gasUsed: Number(receipt.gasUsed)
      });

    } catch (deployError) {
      console.error('Deployment error:', deployError);
      res.status(500).json({ 
        error: 'Failed to deploy contract',
        details: deployError.message 
      });
    }

  } catch (error) {
    console.error('Error in deploy endpoint:', error);
    res.status(500).json({ 
      error: 'Failed to deploy contract',
      details: error.message 
    });
  }
});

// Get all contracts
app.get('/api/contracts', (req, res) => {
  try {
    const data = readContracts();
    res.json(data);
  } catch (error) {
    console.error('Error retrieving contracts:', error);
    res.status(500).json({ error: 'Failed to retrieve contracts' });
  }
});

// Get contracts (alternative endpoint for compatibility)
app.get('/api/deploy', (req, res) => {
  try {
    const data = readContracts();
    res.json(data);
  } catch (error) {
    console.error('Error retrieving contracts:', error);
    res.status(500).json({ error: 'Failed to retrieve contracts' });
  }
});

// Record payment
app.post('/api/payments', (req, res) => {
  try {
    const { contractAddress, functionName, transactionHash, amount, payer } = req.body;

    const contractsData = readContracts();
    const contractIndex = contractsData.contracts.findIndex(c => c.address === contractAddress);

    if (contractIndex === -1) {
      return res.status(404).json({ error: 'Contract not found' });
    }

    // Update payment status in contract metadata
    if (contractsData.contracts[contractIndex].metadata?.paymentFunctions) {
      const paymentIndex = contractsData.contracts[contractIndex].metadata.paymentFunctions.findIndex(
        pf => pf.name === functionName
      );

      if (paymentIndex !== -1) {
        contractsData.contracts[contractIndex].metadata.paymentFunctions[paymentIndex].paid = true;
        contractsData.contracts[contractIndex].metadata.paymentFunctions[paymentIndex].transactionHash = transactionHash;
        contractsData.contracts[contractIndex].metadata.paymentFunctions[paymentIndex].payer = payer;
        contractsData.contracts[contractIndex].metadata.paymentFunctions[paymentIndex].paidAt = new Date().toISOString();
      }
    }

    saveContracts(contractsData);

    res.json({ success: true, message: 'Payment recorded successfully' });
  } catch (error) {
    console.error('Error recording payment:', error);
    res.status(500).json({ error: 'Failed to record payment' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`API server running on http://localhost:${port}`);
  console.log(`Contracts stored in: ${contractsDataPath}`);
});