import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  Download,
  Filter,
  RefreshCw,
  FileText,
  Activity,
  DollarSign,
  Wallet,
  Clock,
  Zap
} from "lucide-react";
import { useUserStore } from "@/stores/userStore";

interface AnalyticsProps {
  contracts: any[];
}

export function Analytics({ contracts }: AnalyticsProps) {
  const { currentUser } = useUserStore();
  
  const mockChartData = [
    { month: "Jan", deployments: 4, payments: 12, gasUsed: 850000 },
    { month: "Feb", deployments: 7, payments: 18, gasUsed: 1200000 },
    { month: "Mar", deployments: 5, payments: 15, gasUsed: 950000 },
    { month: "Apr", deployments: 9, payments: 24, gasUsed: 1400000 },
    { month: "May", deployments: 12, payments: 32, gasUsed: 1800000 },
    { month: "Jun", deployments: 8, payments: 28, gasUsed: 1350000 },
  ];

  const totalDeployments = mockChartData.reduce((sum, data) => sum + data.deployments, 0);
  const totalPayments = mockChartData.reduce((sum, data) => sum + data.payments, 0);
  const totalGasUsed = mockChartData.reduce((sum, data) => sum + data.gasUsed, 0);

  // Enhanced analytics calculations
  const analytics = {
    totalContracts: contracts.length,
    deployedContracts: contracts.filter(c => c.status === "deployed").length,
    totalValue: contracts.reduce((sum, c) => sum + c.value, 0),
    gasSpent: contracts.reduce((sum, c) => sum + c.gasUsed, 0),
    avgGasPerContract: contracts.length > 0 ? contracts.reduce((sum, c) => sum + c.gasUsed, 0) / contracts.length : 0,
    weeklyGrowth: 12.5,
    monthlyTransactions: 48,
    activeContracts: contracts.filter(c => c.status === "deployed").length,
    successRate: 98.5,
    avgDeployTime: 1.2,
    gasEfficiency: 87.2,
    networkUptime: 99.9,
    avgCost: 24.50
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Detailed insights into your smart contract portfolio
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            Real-time data
          </Badge>
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card hover:shadow-glow transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Contracts
            </CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalContracts}</div>
            <p className="text-xs text-muted-foreground mt-1">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Contracts
            </CardTitle>
            <Activity className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.activeContracts}</div>
            <p className="text-xs text-muted-foreground mt-1">All operational</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Gas Used
            </CardTitle>
            <Zap className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.gasSpent.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all deployments</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Success Rate
            </CardTitle>
            <Activity className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Deployment success</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Activity Chart */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Monthly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockChartData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{data.month}</span>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Deployments: {data.deployments}</span>
                      <span>Payments: {data.payments}</span>
                    </div>
                  </div>
                  <div className="flex gap-1 h-6">
                    <div 
                      className="bg-gradient-primary rounded-sm"
                      style={{ 
                        width: `${(data.deployments / Math.max(...mockChartData.map(d => d.deployments))) * 100}%` 
                      }}
                    ></div>
                    <div 
                      className="bg-gradient-accent rounded-sm"
                      style={{ 
                        width: `${(data.payments / Math.max(...mockChartData.map(d => d.payments))) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-4 text-xs pt-2 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-primary rounded-sm"></div>
                  <span>Deployments</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gradient-accent rounded-sm"></div>
                  <span>Payments</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Gas Usage Trends */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Gas Usage Trends
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockChartData.map((data, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{data.month}</span>
                    <span className="text-xs text-muted-foreground">
                      {data.gasUsed.toLocaleString()} gas
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-warning h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(data.gasUsed / Math.max(...mockChartData.map(d => d.gasUsed))) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Contract Performance
            </CardTitle>
            <p className="text-sm text-muted-foreground">Gas efficiency metrics over time</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span>Average Gas Usage</span>
                <span className="font-semibold">{Math.round(analytics.avgGasPerContract).toLocaleString()} gas</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full" style={{ width: "75%" }}></div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Optimization Score</span>
                <span className="font-semibold">{analytics.gasEfficiency}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{ width: `${analytics.gasEfficiency}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Network Insights
            </CardTitle>
            <p className="text-sm text-muted-foreground">Blockchain network statistics</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-600">{analytics.avgDeployTime}s</div>
                <div className="text-sm text-muted-foreground">Avg Block Time</div>
              </div>
              <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-600">{analytics.networkUptime}%</div>
                <div className="text-sm text-muted-foreground">Network Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Metrics */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle>Detailed Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analytics.successRate}%</div>
              <div className="text-sm text-muted-foreground">Success Rate</div>
              <Badge variant="secondary" className="mt-2 text-xs bg-green-100 text-green-700">Excellent</Badge>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{analytics.avgDeployTime}s</div>
              <div className="text-sm text-muted-foreground">Avg Deploy Time</div>
              <Badge variant="secondary" className="mt-2 text-xs bg-blue-100 text-blue-700">Fast</Badge>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{analytics.gasEfficiency}%</div>
              <div className="text-sm text-muted-foreground">Gas Efficiency</div>
              <Badge variant="secondary" className="mt-2 text-xs bg-green-100 text-green-700">Good</Badge>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">${analytics.avgCost}</div>
              <div className="text-sm text-muted-foreground">Avg Cost</div>
              <Badge variant="secondary" className="mt-2 text-xs bg-purple-100 text-purple-700">Optimal</Badge>
            </div>
          </div>

          {/* User-specific analytics if user is selected */}
          {currentUser && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <div className={`w-6 h-6 bg-gradient-to-br from-${currentUser.color}-400 to-${currentUser.color}-600 rounded-lg flex items-center justify-center`}>
                  <span className="text-white text-sm">{currentUser.emoji}</span>
                </div>
                {currentUser.name}'s Analytics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-xl font-bold">{contracts.length}</div>
                  <div className="text-sm text-muted-foreground">Your Contracts</div>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-xl font-bold">{analytics.gasSpent.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">Gas Spent</div>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <div className="text-xl font-bold">{analytics.totalValue.toFixed(3)} ETH</div>
                  <div className="text-sm text-muted-foreground">Total Value</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}