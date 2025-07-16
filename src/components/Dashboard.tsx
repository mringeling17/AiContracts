import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  TrendingDown, 
  FileText, 
  Wallet, 
  Activity,
  DollarSign,
  Users,
  Calendar,
  ExternalLink
} from "lucide-react";

interface DashboardProps {
  contracts: any[];
}

export function Dashboard({ contracts }: DashboardProps) {
  // Mock analytics data
  const analytics = {
    totalContracts: contracts.length,
    deployedContracts: contracts.filter(c => c.status === "deployed").length,
    totalValue: contracts.reduce((sum, c) => sum + c.value, 0),
    gasSpent: contracts.reduce((sum, c) => sum + c.gasUsed, 0),
    avgGasPerContract: contracts.length > 0 ? contracts.reduce((sum, c) => sum + c.gasUsed, 0) / contracts.length : 0,
    weeklyGrowth: 12.5,
    monthlyTransactions: 48,
    activeContracts: contracts.filter(c => c.status === "deployed").length,
  };

  const recentActivity = [
    { type: "deploy", name: "PaymentContract", time: "2 hours ago", status: "success" },
    { type: "payment", name: "EscrowService", time: "4 hours ago", status: "success" },
    { type: "deploy", name: "TokenContract", time: "1 day ago", status: "success" },
    { type: "payment", name: "VotingContract", time: "2 days ago", status: "pending" },
    { type: "deploy", name: "NFTContract", time: "3 days ago", status: "success" },
  ];

  const statCards = [
    {
      title: "Total Contracts",
      value: analytics.totalContracts,
      change: "+3 this week",
      trend: "up",
      icon: FileText,
      color: "primary"
    },
    {
      title: "Total Value",
      value: `${analytics.totalValue.toFixed(3)} ETH`,
      change: `+${analytics.weeklyGrowth}% this week`,
      trend: "up",
      icon: DollarSign,
      color: "success"
    },
    {
      title: "Active Contracts",
      value: analytics.activeContracts,
      change: "All operational",
      trend: "neutral",
      icon: Activity,
      color: "accent"
    },
    {
      title: "Gas Spent",
      value: analytics.gasSpent.toLocaleString(),
      change: "Total consumption",
      trend: "neutral",
      icon: Wallet,
      color: "warning"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of your smart contract portfolio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            Last updated: {new Date().toLocaleTimeString()}
          </Badge>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            View on Etherscan
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="shadow-card hover:shadow-glow transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-4 w-4 text-${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {stat.trend === "up" && <TrendingUp className="h-3 w-3 mr-1 text-success" />}
                  {stat.trend === "down" && <TrendingDown className="h-3 w-3 mr-1 text-destructive" />}
                  <span>{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Contract Distribution */}
        <Card className="lg:col-span-2 shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Contract Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gradient-primary/10 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{analytics.deployedContracts}</div>
                  <div className="text-sm text-muted-foreground">Deployed</div>
                </div>
                <div className="p-4 bg-gradient-accent/10 rounded-lg">
                  <div className="text-2xl font-bold text-accent">{analytics.monthlyTransactions}</div>
                  <div className="text-sm text-muted-foreground">Transactions</div>
                </div>
                <div className="p-4 bg-success/10 rounded-lg">
                  <div className="text-2xl font-bold text-success">{Math.round(analytics.avgGasPerContract).toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Avg Gas</div>
                </div>
              </div>
              
              {/* Simple Chart Representation */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Contract Success Rate</span>
                  <span className="font-semibold">98.5%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-primary h-2 rounded-full" style={{ width: "98.5%" }}></div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Gas Efficiency</span>
                  <span className="font-semibold">87.2%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-gradient-accent h-2 rounded-full" style={{ width: "87.2%" }}></div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span>Network Uptime</span>
                  <span className="font-semibold">99.9%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-success h-2 rounded-full" style={{ width: "99.9%" }}></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === "success" ? "bg-success" : 
                    activity.status === "pending" ? "bg-warning" : "bg-destructive"
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.type === "deploy" ? "Deployed" : "Payment to"} {activity.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                  <Badge variant={
                    activity.status === "success" ? "default" : 
                    activity.status === "pending" ? "secondary" : "destructive"
                  } className="text-xs">
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-16 flex flex-col items-center justify-center gap-2">
              <FileText className="h-5 w-5" />
              Create New Contract
            </Button>
            <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
              <Wallet className="h-5 w-5" />
              Connect Wallet
            </Button>
            <Button variant="blockchain" className="h-16 flex flex-col items-center justify-center gap-2">
              <Activity className="h-5 w-5" />
              View Analytics
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}