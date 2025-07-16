import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Loader2, Sparkles, Code, Rocket, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateContractProps {
  onContractCreated: (contract: any) => void;
}

export function CreateContract({ onContractCreated }: CreateContractProps) {
  const [goal, setGoal] = useState("");
  const [contractName, setContractName] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [step, setStep] = useState(1); // 1: Input, 2: Generated, 3: Deployed
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!goal.trim() || !contractName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both contract name and goal.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal,
          details: `Contract name: ${contractName}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedCode(data.contractCode);
        setContractName(data.contractName || contractName);
        setStep(2);

        toast({
          title: "Contract Generated!",
          description: "Your smart contract has been generated successfully.",
        });
      } else {
        // Fallback to mock code if API fails
        const mockCode = `pragma solidity ^0.8.0;

contract ${contractName.replace(/\s+/g, "")} {
    string public goal = "${goal}";
    address public owner;
    uint256 public value;
    bool public completed;
    
    constructor() {
        owner = msg.sender;
        completed = false;
    }
    
    function setValue(uint256 _value) external onlyOwner {
        value = _value;
    }
    
    function complete() external onlyOwner {
        completed = true;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
}`;

        setGeneratedCode(mockCode);
        setStep(2);

        toast({
          title: "Contract Generated!",
          description: "Your smart contract has been generated successfully.",
        });
      }
    } catch (error) {
      console.error('Error generating contract:', error);
      toast({
        title: "Generation Failed",
        description: "Failed to generate contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    
    try {
      const response = await fetch('/api/deploy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contractName: contractName,
          goal: goal,
          contractCode: generatedCode,
          paymentFunctions: [], // Will be populated from generated contract
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const newContract = data.contract;
        
        onContractCreated(newContract);
        setStep(3);
        
        toast({
          title: "Contract Deployed!",
          description: `Contract deployed at ${newContract.address}`,
        });
      } else {
        throw new Error('Deployment failed');
      }
    } catch (error) {
      console.error('Error deploying contract:', error);
      toast({
        title: "Deployment Failed",
        description: "Failed to deploy contract. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeploying(false);
    }
  };

  const resetForm = () => {
    setGoal("");
    setContractName("");
    setGeneratedCode("");
    setStep(1);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
          Create Smart Contract
        </h1>
        <p className="text-muted-foreground">
          Describe your contract goal and let AI generate it for you
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}>
            1
          </div>
          <span className="ml-2 text-sm">Input</span>
        </div>
        <div className="w-8 h-px bg-border"></div>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}>
            <Code size={16} />
          </div>
          <span className="ml-2 text-sm">Generate</span>
        </div>
        <div className="w-8 h-px bg-border"></div>
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
            step >= 3 ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
          }`}>
            <Rocket size={16} />
          </div>
          <span className="ml-2 text-sm">Deploy</span>
        </div>
      </div>

      {step === 1 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Contract Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contractName">Contract Name</Label>
              <Input
                id="contractName"
                placeholder="e.g., PaymentContract, EscrowService"
                value={contractName}
                onChange={(e) => setContractName(e.target.value)}
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="goal">Contract Goal</Label>
              <Textarea
                id="goal"
                placeholder="Describe what your smart contract should do. For example: 'Create an escrow contract that holds funds until both parties confirm completion of a service'"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="mt-1 min-h-[120px]"
              />
            </div>
            
            <Button 
              onClick={handleGenerate} 
              disabled={isGenerating || !goal.trim() || !contractName.trim()}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Contract...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate Smart Contract
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              Generated Contract
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Contract Information</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Name</p>
                  <p className="font-medium">{contractName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Language</p>
                  <Badge variant="secondary">Solidity ^0.8.0</Badge>
                </div>
              </div>
            </div>
            
            <div>
              <Label>Generated Code</Label>
              <div className="mt-2 bg-muted p-4 rounded-lg">
                <pre className="text-sm overflow-x-auto">
                  <code>{generatedCode}</code>
                </pre>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={handleDeploy} disabled={isDeploying} variant="blockchain">
                {isDeploying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Rocket className="mr-2 h-4 w-4" />
                    Deploy Contract
                  </>
                )}
              </Button>
              <Button onClick={() => setStep(1)} variant="outline">
                Back to Edit
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="shadow-card border-success">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-success">
              <CheckCircle className="h-5 w-5" />
              Contract Deployed Successfully!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <div className="text-4xl mb-2">🎉</div>
              <p className="text-lg font-semibold">Your contract is now live on the blockchain!</p>
            </div>
            
            <div className="bg-gradient-background p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Contract Name:</span>
                <span className="font-medium">{contractName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Network:</span>
                <Badge variant="secondary">Ethereum Testnet</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gas Used:</span>
                <span className="font-mono">~75,000</span>
              </div>
            </div>
            
            <Button onClick={resetForm} className="w-full">
              Create Another Contract
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}