import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, BarChart3, Wallet, Home, Settings, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/userStore";

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser, clearCurrentUser } = useUserStore();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "create", label: "Create Contract", icon: FileText },
    { id: "contracts", label: "My Contracts", icon: Wallet },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <>
      {/* Mobile Header */}
      <div className="md:hidden bg-card border-b border-border p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          SmartChain
        </h1>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </Button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50">
          <div className="bg-card w-64 h-full border-r border-border p-4">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                SmartChain
              </h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <X />
              </Button>
            </div>
            <nav className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => {
                      onTabChange(item.id);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <Icon className="mr-2 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-card border-r border-border flex-col">
        <div className="p-6 border-b border-border">
          <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            SmartChain
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Smart Contract Platform
          </p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => onTabChange(item.id)}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-border">
          {currentUser && (
            <div className="bg-gradient-background p-4 rounded-lg mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-10 h-10 bg-gradient-to-br from-${currentUser.color}-400 to-${currentUser.color}-600 rounded-lg flex items-center justify-center`}>
                  <span className="text-white text-lg">{currentUser.emoji}</span>
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{currentUser.name}</h3>
                  <p className="text-xs text-muted-foreground">Account #{currentUser.index}</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground font-mono mb-3">
                {currentUser.address.slice(0, 10)}...{currentUser.address.slice(-8)}
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                  <span className="text-xs text-success">Connected</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearCurrentUser}
                  className="h-6 px-2 text-xs"
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  Switch
                </Button>
              </div>
            </div>
          )}
          
          <div className="bg-muted p-3 rounded-lg">
            <h4 className="font-semibold text-xs mb-2">Network</h4>
            <div className="text-xs text-muted-foreground">
              <div>Hardhat Local</div>
              <div className="font-mono">http://127.0.0.1:8545</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}