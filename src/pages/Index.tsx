import { useState, useEffect } from "react";
import { Navigation } from "@/components/Navigation";
import { Dashboard } from "@/components/Dashboard";
import { CreateContract } from "@/components/CreateContract";
import { ContractsList } from "@/components/ContractsList";
import { Analytics } from "@/components/Analytics";
import { UserSelector } from "@/components/UserSelector";
import { useUserStore } from "@/stores/userStore";

const Index = () => {
  const { isUserSelected, loadUserFromStorage } = useUserStore();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [contracts, setContracts] = useState([
    {
      id: 1,
      name: "PaymentContract",
      goal: "Handle secure payments between parties with escrow functionality",
      address: "0x1234567890abcdef1234567890abcdef12345678",
      status: "deployed" as const,
      deployedAt: new Date(Date.now() - 86400000).toISOString(),
      gasUsed: 85000,
      value: 0.5,
    },
    {
      id: 2,
      name: "VotingContract",
      goal: "Decentralized voting system for community governance",
      address: "0xabcdef1234567890abcdef1234567890abcdef12",
      status: "deployed" as const,
      deployedAt: new Date(Date.now() - 172800000).toISOString(),
      gasUsed: 120000,
      value: 0.0,
    },
    {
      id: 3,
      name: "TokenContract",
      goal: "Custom ERC-20 token for reward distribution",
      address: "0x567890abcdef1234567890abcdef1234567890ab",
      status: "deployed" as const,
      deployedAt: new Date(Date.now() - 259200000).toISOString(),
      gasUsed: 95000,
      value: 1.2,
    },
  ]);

  useEffect(() => {
    loadUserFromStorage();
  }, [loadUserFromStorage]);

  const handleContractCreated = (newContract: any) => {
    setContracts([...contracts, newContract]);
    setActiveTab("contracts");
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard contracts={contracts} />;
      case "create":
        return <CreateContract onContractCreated={handleContractCreated} />;
      case "contracts":
        return <ContractsList contracts={contracts} />;
      case "analytics":
        return <Analytics contracts={contracts} />;
      case "settings":
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Settings</h2>
            <p className="text-muted-foreground">Settings panel coming soon...</p>
          </div>
        );
      default:
        return <Dashboard contracts={contracts} />;
    }
  };

  if (!isUserSelected) {
    return <UserSelector />;
  }

  return (
    <div className="min-h-screen bg-gradient-background flex">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      <main className="flex-1 md:ml-0">
        <div className="p-6 max-w-7xl mx-auto">
          {renderActiveTab()}
        </div>
      </main>
    </div>
  );
};

export default Index;
