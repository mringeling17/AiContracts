import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Wallet } from "lucide-react";
import { useUserStore, mockUsers, type User } from "@/stores/userStore";

export function UserSelector() {
  const { setCurrentUser } = useUserStore();

  const handleUserSelect = (user: User) => {
    setCurrentUser(user);
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-6">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-primary rounded-xl flex items-center justify-center">
              <Wallet className="h-8 w-8 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Welcome to SmartChain
          </CardTitle>
          <p className="text-muted-foreground mt-2">
            Select your account to start creating and managing smart contracts
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Users className="h-4 w-4" />
              <span>Choose from available Hardhat accounts</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockUsers.map((user) => (
                <Button
                  key={user.index}
                  variant="outline"
                  className="h-auto p-4 flex flex-col items-center gap-3 hover:bg-accent hover:text-accent-foreground transition-all duration-200 hover:shadow-md"
                  onClick={() => handleUserSelect(user)}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br from-${user.color}-400 to-${user.color}-600 rounded-xl flex items-center justify-center`}>
                    <span className="text-white text-2xl">{user.emoji}</span>
                  </div>
                  
                  <div className="text-center">
                    <div className="font-semibold text-base">{user.name}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Account #{user.index}
                    </div>
                    <div className="text-xs text-muted-foreground font-mono mt-1 truncate max-w-[200px]">
                      {user.address}
                    </div>
                  </div>
                </Button>
              ))}
            </div>
            
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h3 className="font-semibold text-sm mb-2">Network Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-muted-foreground">
                <div>
                  <strong>Network:</strong> Hardhat Local
                </div>
                <div>
                  <strong>RPC URL:</strong> http://127.0.0.1:8545
                </div>
                <div>
                  <strong>Chain ID:</strong> 31337
                </div>
                <div>
                  <strong>Currency:</strong> ETH (Test)
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}