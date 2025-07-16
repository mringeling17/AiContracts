import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  ExternalLink, 
  Eye, 
  CreditCard, 
  Copy, 
  Calendar,
  Fuel,
  Wallet,
  Search,
  Play,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserStore } from "@/stores/userStore";

interface PaymentFunction {
  name: string;
  amount?: string;
  recipient?: string;
  requiresValue: boolean;
  paid?: boolean;
}

interface Contract {
  id: number;
  name: string;
  goal: string;
  address: string;
  status: "deployed" | "pending" | "failed";
  deployedAt: string | Date;
  gasUsed: number;
  value: number;
  abi?: any[];
  metadata?: {
    parties?: string[];
    amount?: string;
    dueDate?: string;
    paymentFunctions?: PaymentFunction[];
  };
}

interface ContractsListProps {
  contracts: Contract[];
}

export function ContractsList({ contracts }: ContractsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [allContracts, setAllContracts] = useState<Contract[]>(contracts);
  const { toast } = useToast();
  const { currentUser } = useUserStore();

  // Update contracts when prop changes
  useEffect(() => {
    setAllContracts(contracts);
  }, [contracts]);

  // Fetch contracts from API
  useEffect(() => {
    fetchContracts();
  }, []);

  const fetchContracts = async () => {
    try {
      const res = await fetch('/api/deploy');
      const data = await res.json();
      if (!res.ok || !Array.isArray(data.contracts)) {
        throw new Error('Failed to fetch deployed contracts');
      }
      setAllContracts(data.contracts.reverse());
    } catch (err) {
      console.error('Failed to fetch deployed contracts:', err);
      toast({
        title: "Error",
        description: "Failed to fetch contracts",
        variant: "destructive",
      });
    }
  };

  const filteredContracts = allContracts.filter(contract =>
    contract.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.goal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contract.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address);
    toast({
      title: "Address Copied",
      description: "Contract address copied to clipboard",
    });
  };

  const handlePayment = (contract: Contract) => {
    const unpaidFunction = contract.metadata?.paymentFunctions?.find(pf => !pf.paid);
    if (unpaidFunction) {
      initiatePayment(contract.address, contract.abi || [], unpaidFunction.name, unpaidFunction.amount || '0 ether', unpaidFunction.recipient || 'unknown');
    } else {
      toast({
        title: "Payment Initiated",
        description: `Payment for ${contract.name} is being processed`,
      });
    }
  };

  const initiatePayment = async (contractAddress: string, abi: any[], functionName: string, amount: string, recipient: string) => {
    setSelectedPayment({ contractAddress, functionName, amount, recipient, abi });
    setShowPaymentModal(true);
  };

  const executePayment = async () => {
    if (!selectedPayment) return;

    try {
      const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
      const signer = await provider.getSigner(currentUser?.index || 0); // Use current user's account
      const contract = new ethers.Contract(selectedPayment.contractAddress, selectedPayment.abi, signer);

      const etherAmount = selectedPayment.amount.replace(/[^\d.]/g, '');
      const tx = await contract[selectedPayment.functionName]({ 
        value: ethers.parseEther(etherAmount) 
      });
      
      const receipt = await tx.wait();
      
      // Record the payment in the backend
      await fetch('/api/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contractAddress: selectedPayment.contractAddress,
          functionName: selectedPayment.functionName,
          transactionHash: receipt.hash,
          amount: selectedPayment.amount,
          payer: 'User'
        })
      });
      
      toast({
        title: "Payment Successful",
        description: `Payment of ${selectedPayment.amount} to ${selectedPayment.recipient} completed successfully!`
      });
      
      setShowPaymentModal(false);
      setSelectedPayment(null);
      
      // Refresh the contracts list to show updated payment status
      await fetchContracts();
    } catch (err: any) {
      console.error("Payment error:", err);
      toast({
        title: "Payment Failed",
        description: err.message || "Unknown error",
        variant: "destructive",
      });
    }
  };

  const cancelPayment = () => {
    setShowPaymentModal(false);
    setSelectedPayment(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "deployed": return "success";
      case "pending": return "warning";
      case "failed": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Contracts</h1>
          <p className="text-muted-foreground">
            Manage and interact with your deployed smart contracts
          </p>
        </div>
        <Badge variant="secondary" className="text-sm">
          {contracts.length} Total Contracts
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search contracts by name, goal, or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Contracts Grid */}
      {filteredContracts.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Wallet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Contracts Found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "No contracts match your search." : "You haven't created any contracts yet."}
            </p>
            {!searchTerm && (
              <Button>Create Your First Contract</Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContracts.map((contract) => (
            <Card key={contract.id} className="shadow-card hover:shadow-glow transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{contract.name}</CardTitle>
                  <Badge variant={getStatusColor(contract.status) as any}>
                    {contract.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {contract.goal}
                </p>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      Deployed
                    </span>
                    <span>{new Date(contract.deployedAt).toLocaleDateString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Fuel className="h-3 w-3" />
                      Gas Used
                    </span>
                    <span>{contract.gasUsed.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Value</span>
                    <span className="font-mono">{contract.value} ETH</span>
                  </div>
                </div>
                
                <div className="bg-muted p-2 rounded text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-muted-foreground">
                      {contract.address.slice(0, 10)}...{contract.address.slice(-8)}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyAddress(contract.address)}
                      className="h-6 w-6 p-0"
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                {contract.metadata?.paymentFunctions && contract.metadata.paymentFunctions.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Payment Functions
                    </h4>
                    <div className="space-y-2">
                      {contract.metadata.paymentFunctions.map((payFunc, index) => (
                        <button
                          key={index}
                          className={`flex items-center justify-between p-3 rounded-lg border transition-colors w-full ${
                            payFunc.paid 
                              ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                              : 'hover:bg-accent hover:text-accent-foreground'
                          }`}
                          disabled={payFunc.paid}
                          onClick={() => !payFunc.paid && initiatePayment(
                            contract.address, 
                            contract.abi || [], 
                            payFunc.name, 
                            payFunc.amount || '0 ether', 
                            payFunc.recipient || 'unknown'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            {payFunc.paid ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <Play className="w-4 h-4" />
                            )}
                            <div className="text-left">
                              <div className="font-medium">{payFunc.name}</div>
                              {(payFunc.amount || payFunc.recipient) && (
                                <div className="text-xs text-muted-foreground">
                                  {payFunc.amount && payFunc.amount}
                                  {payFunc.recipient && ` → ${payFunc.recipient}`}
                                </div>
                              )}
                            </div>
                          </div>
                          {payFunc.paid ? (
                            <span className="text-xs font-semibold text-green-500">Completed</span>
                          ) : (
                            <span className="text-xs text-muted-foreground">Execute</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedContract(contract)}
                  >
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                  
                  {contract.metadata?.paymentFunctions?.some(pf => !pf.paid) && (
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      onClick={() => handlePayment(contract)}
                    >
                      <CreditCard className="h-3 w-3 mr-1" />
                      Pay
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="ghost"
                    className="px-2"
                    onClick={() => window.open(`https://etherscan.io/address/${contract.address}`, '_blank')}
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Contract Details Modal/Panel would go here */}
      {selectedContract && (
        <Card className="mt-6 border-primary shadow-glow">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Contract Details: {selectedContract.name}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSelectedContract(null)}
              >
                Close
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Contract Information</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Goal:</strong> {selectedContract.goal}</div>
                  <div><strong>Address:</strong> <code className="bg-muted px-2 py-1 rounded text-xs">{selectedContract.address}</code></div>
                  <div><strong>Status:</strong> <Badge variant={getStatusColor(selectedContract.status) as any}>{selectedContract.status}</Badge></div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Deployment Details</h4>
                <div className="space-y-2 text-sm">
                  <div><strong>Deployed:</strong> {new Date(selectedContract.deployedAt).toLocaleString()}</div>
                  <div><strong>Gas Used:</strong> {selectedContract.gasUsed.toLocaleString()}</div>
                  <div><strong>Current Value:</strong> {selectedContract.value} ETH</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedPayment && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <Card className="p-6 max-w-md w-full mx-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Play className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Confirm Payment</h3>
                <p className="text-sm text-muted-foreground">Review transaction details</p>
              </div>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Function</div>
                <div className="font-mono text-sm">{selectedPayment.functionName}</div>
              </div>
              
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Amount</div>
                <div className="font-mono text-lg font-semibold">{selectedPayment.amount}</div>
              </div>
              
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Paying Account</div>
                <div className="font-semibold">{currentUser?.name || 'Unknown'}</div>
                <div className="font-mono text-xs text-muted-foreground">
                  {currentUser?.address}
                </div>
              </div>
              
              <div className="bg-muted rounded-lg p-3">
                <div className="text-xs text-muted-foreground">Recipient</div>
                <div className="capitalize">{selectedPayment.recipient}</div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-yellow-800">
                  <strong>Warning:</strong> This transaction cannot be reversed. Please verify all details are correct.
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                className="flex-1"
                variant="outline"
                onClick={cancelPayment}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={executePayment}
              >
                Execute Payment
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}