import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { ArrowUp, ArrowDown, PieChart, TrendingUp, TrendingDown, FileText } from "lucide-react";
import { 
  ResponsiveContainer, 
  PieChart as RePieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip, 
  Legend,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid
} from "recharts";

// Mock portfolio holdings data
const portfolioHoldings = [
  { symbol: "AAPL", name: "Apple Inc.", shares: 10, avgCost: 170.42, currentPrice: 183.58, value: 1835.80, gain: 131.60, gainPercent: 7.72 },
  { symbol: "MSFT", name: "Microsoft Corp", shares: 5, avgCost: 390.25, currentPrice: 412.72, value: 2063.60, gain: 112.35, gainPercent: 5.76 },
  { symbol: "NVDA", name: "NVIDIA Corp", shares: 3, avgCost: 850.18, currentPrice: 924.79, value: 2774.37, gain: 223.83, gainPercent: 8.77 },
  { symbol: "GOOGL", name: "Alphabet Inc.", shares: 8, avgCost: 145.30, currentPrice: 154.92, value: 1239.36, gain: 76.96, gainPercent: 6.62 },
  { symbol: "AMZN", name: "Amazon.com Inc.", shares: 7, avgCost: 180.25, currentPrice: 176.53, value: 1235.71, gain: -26.04, gainPercent: -2.06 },
];

// Mock transaction history
const transactions = [
  { id: 1, date: "2024-05-20", symbol: "AAPL", type: "BUY", shares: 5, price: 170.42, total: 852.10 },
  { id: 2, date: "2024-05-19", symbol: "MSFT", type: "BUY", shares: 3, price: 390.25, total: 1170.75 },
  { id: 3, date: "2024-05-18", symbol: "NVDA", type: "BUY", shares: 2, price: 850.18, total: 1700.36 },
  { id: 4, date: "2024-05-17", symbol: "AAPL", type: "BUY", shares: 5, price: 170.42, total: 852.10 },
  { id: 5, date: "2024-05-16", symbol: "GOOGL", type: "BUY", shares: 8, price: 145.30, total: 1162.40 },
  { id: 6, date: "2024-05-15", symbol: "AMZN", type: "BUY", shares: 7, price: 180.25, total: 1261.75 },
  { id: 7, date: "2024-05-14", symbol: "MSFT", type: "BUY", shares: 2, price: 390.25, total: 780.50 },
  { id: 8, date: "2024-05-13", symbol: "NVDA", type: "BUY", shares: 1, price: 850.18, total: 850.18 },
];

// Calculate portfolio allocation data for pie chart
const calculateAllocation = () => {
  const total = portfolioHoldings.reduce((sum, stock) => sum + stock.value, 0);
  return portfolioHoldings.map(stock => ({
    name: stock.symbol,
    value: (stock.value / total) * 100
  }));
};

const allocationData = calculateAllocation();

// Performance data for line chart
const performanceData = [
  { date: "May 1", value: 100000 },
  { date: "May 5", value: 100580 },
  { date: "May 10", value: 101235 },
  { date: "May 15", value: 102478 },
  { date: "May 20", value: 103149 },
];

// Colors for pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Portfolio = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [activeTab, setActiveTab] = useState("performance");

  // Initialize animation after component mount
  useEffect(() => {
    setTimeout(() => {
      setAnimate(true);
      
      // Welcome toast
      toast("Portfolio Loaded", {
        description: "View your investments and performance metrics.",
      });
    }, 300);
  }, []);
  
  // Calculate total portfolio value and gain/loss
  const totalValue = portfolioHoldings.reduce((sum, stock) => sum + stock.value, 0);
  const totalGain = portfolioHoldings.reduce((sum, stock) => sum + stock.gain, 0);
  const totalGainPercent = (totalGain / (totalValue - totalGain)) * 100;
  const initialInvestment = 100000;
  const overallReturn = ((totalValue - initialInvestment) / initialInvestment) * 100;
  
  const handleDownloadStatement = () => {
    setIsLoading(true);
    
    // Simulate download
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Statement Downloaded", {
        description: "Your portfolio statement has been downloaded.",
      });
    }, 1000);
  };
  
  const handleStockClick = (symbol: string) => {
    toast.info(`Stock Details: ${symbol}`, {
      description: "Loading detailed analytics for this position...",
    });
  };

  const handleViewAllTransactions = () => {
    // Update to navigate to transactions page
    window.location.href = '/transactions';  // Using window.location since we're not using useNavigate from react-router
  };
  
  const handleViewAnalytics = () => {
    toast.info("Portfolio Analytics", {
      description: "Loading detailed portfolio analytics...",
    });
  };
  
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-finance-primary finance-accent-gradient">Portfolio</h2>
          <p className="text-muted-foreground mt-1">Track your investments and performance</p>
        </div>
        
        <Button 
          className="flex items-center gap-2 bg-finance-primary hover:bg-finance-secondary transition-colors"
          onClick={handleDownloadStatement}
          disabled={isLoading}
        >
          <FileText className="h-4 w-4" />
          {isLoading ? "Generating..." : "Download Statement"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${animate ? 'animate-fade-in' : 'opacity-0'}`} onClick={() => toast.info("Portfolio Value", { description: "Your portfolio has grown by 3.15% since inception." })}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div className="flex items-center text-sm mt-1">
              {overallReturn >= 0 ? (
                <>
                  <ArrowUp className="mr-1 h-4 w-4 text-finance-accent animate-bounce" />
                  <span className="text-finance-accent">+{overallReturn.toFixed(2)}%</span>
                </>
              ) : (
                <>
                  <ArrowDown className="mr-1 h-4 w-4 text-finance-danger" />
                  <span className="text-finance-danger">{overallReturn.toFixed(2)}%</span>
                </>
              )}
              <span className="text-muted-foreground ml-2">from initial</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${animate ? 'animate-fade-in delay-100' : 'opacity-0'}`} onClick={() => toast.info("Day's Change", { description: "Your portfolio is up 0.38% today." })}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Day's Change</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+$412.89</div>
            <div className="flex items-center text-sm mt-1">
              <ArrowUp className="mr-1 h-4 w-4 text-finance-accent" />
              <span className="text-finance-accent">+0.38%</span>
              <span className="text-muted-foreground ml-2">today</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${animate ? 'animate-fade-in delay-200' : 'opacity-0'}`} onClick={() => toast.info("Total Gain/Loss", { description: "Your portfolio is up $518.70 overall." })}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${totalGain >= 0 ? "text-finance-accent" : "text-finance-danger"}`}>
              {totalGain >= 0 ? "+" : ""}${totalGain.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center text-sm mt-1">
              {totalGainPercent >= 0 ? (
                <>
                  <ArrowUp className="mr-1 h-4 w-4 text-finance-accent" />
                  <span className="text-finance-accent">+{totalGainPercent.toFixed(2)}%</span>
                </>
              ) : (
                <>
                  <ArrowDown className="mr-1 h-4 w-4 text-finance-danger" />
                  <span className="text-finance-danger">{totalGainPercent.toFixed(2)}%</span>
                </>
              )}
              <span className="text-muted-foreground ml-2">overall</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`hover:shadow-lg transition-all duration-300 cursor-pointer ${animate ? 'animate-fade-in delay-300' : 'opacity-0'}`} onClick={() => toast.info("Available Cash", { description: "You have $91,000.16 available for trading." })}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Available Cash</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${(initialInvestment - (totalValue - totalGain)).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div className="text-sm text-muted-foreground mt-1">Available for trading</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Portfolio Holdings */}
        <Card className={`lg:col-span-2 hover:shadow-lg transition-all duration-300 ${animate ? 'animate-fade-in' : 'opacity-0'}`}>
          <CardHeader>
            <CardTitle>Holdings</CardTitle>
            <CardDescription>Your current stock positions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <div className="grid grid-cols-7 bg-muted p-3 text-xs font-medium text-muted-foreground">
                <div>Symbol</div>
                <div>Name</div>
                <div className="text-right">Shares</div>
                <div className="text-right">Avg Cost</div>
                <div className="text-right">Price</div>
                <div className="text-right">Value</div>
                <div className="text-right">Gain/Loss</div>
              </div>
              
              <div className="divide-y">
                {portfolioHoldings.map((stock) => (
                  <div 
                    key={stock.symbol} 
                    className="grid grid-cols-7 p-3 text-sm hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleStockClick(stock.symbol)}
                  >
                    <div className="font-medium">{stock.symbol}</div>
                    <div className="text-muted-foreground">{stock.name}</div>
                    <div className="text-right">{stock.shares}</div>
                    <div className="text-right">${stock.avgCost.toFixed(2)}</div>
                    <div className="text-right">${stock.currentPrice.toFixed(2)}</div>
                    <div className="text-right">${stock.value.toFixed(2)}</div>
                    <div className={`text-right ${stock.gain >= 0 ? "text-finance-accent" : "text-finance-danger"} flex items-center justify-end`}>
                      {stock.gain >= 0 ? (
                        <>
                          <ArrowUp className="mr-1 h-3 w-3" />
                          <span>${stock.gain.toFixed(2)} ({stock.gainPercent.toFixed(2)}%)</span>
                        </>
                      ) : (
                        <>
                          <ArrowDown className="mr-1 h-3 w-3" />
                          <span>${Math.abs(stock.gain).toFixed(2)} ({stock.gainPercent.toFixed(2)}%)</span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Portfolio Allocation Chart */}
        <Card className={`hover:shadow-lg transition-all duration-300 ${animate ? 'animate-fade-in' : 'opacity-0'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Allocation
            </CardTitle>
            <CardDescription>Portfolio diversification</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart className={animate ? '' : 'opacity-0'}>
                  <Pie
                    data={allocationData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    animationDuration={1000}
                    animationBegin={200}
                  >
                    {allocationData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={COLORS[index % COLORS.length]} 
                        className="hover:opacity-80 transition-opacity cursor-pointer"
                        onClick={() => {
                          toast.info(`${entry.name} Allocation`, {
                            description: `${entry.name} makes up ${entry.value.toFixed(2)}% of your portfolio.`
                          });
                        }}
                      />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    formatter={(value: any) => {
                      if (typeof value === 'number') {
                        return [`${value.toFixed(2)}%`, 'Allocation'];
                      }
                      return [value, 'Allocation'];
                    }} 
                  />
                  <Legend 
                    onClick={(data) => {
                      toast.info(`${data.value}`, {
                        description: `Showing details for ${data.value}`
                      });
                    }}
                  />
                </RePieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <Card className={`hover:shadow-lg transition-all duration-300 ${animate ? 'animate-fade-in' : 'opacity-0'}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Portfolio Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs 
              defaultValue="performance" 
              value={activeTab} 
              onValueChange={(value) => {
                setActiveTab(value);
                setAnimate(false);
                setTimeout(() => setAnimate(true), 150);
              }}
            >
              <TabsList className="mb-4">
                <TabsTrigger value="performance">Performance</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>
            
              <TabsContent value="performance">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={performanceData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                      className={animate ? 'animate-fade-in' : 'opacity-0'}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <RechartsTooltip 
                        formatter={(value: any) => {
                          if (typeof value === 'number') {
                            return [`$${value.toLocaleString()}`, "Portfolio Value"];
                          }
                          return [value, "Portfolio Value"];
                        }}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#0A2463"
                        activeDot={{ r: 8 }}
                        animationDuration={1500}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="mt-4 flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-2">
                    <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs bg-green-100 text-green-800`}>
                      <TrendingUp className="h-3 w-3" />
                      Overall Growth
                    </span>
                    
                    <span className="text-sm">
                      <span className="font-medium">+3.15%</span> since inception
                    </span>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleViewAnalytics}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    View Detailed Analytics
                  </Button>
                </div>
              </TabsContent>
              
              <TabsContent value="transactions">
                <div className="rounded-md border">
                  <div className="grid grid-cols-6 bg-muted p-3 text-xs font-medium text-muted-foreground">
                    <div>Date</div>
                    <div>Type</div>
                    <div>Symbol</div>
                    <div className="text-right">Shares</div>
                    <div className="text-right">Price</div>
                    <div className="text-right">Total</div>
                  </div>
                  
                  <div className="divide-y">
                    {transactions.map((tx) => (
                      <div 
                        key={tx.id} 
                        className="grid grid-cols-6 p-3 text-sm hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => {
                          toast.info(`Transaction #${tx.id}`, {
                            description: `${tx.type} ${tx.shares} shares of ${tx.symbol} at $${tx.price.toFixed(2)}`
                          });
                        }}
                      >
                        <div>{tx.date}</div>
                        <div className={`${tx.type === "BUY" ? "text-finance-accent font-medium" : "text-finance-danger font-medium"}`}>{tx.type}</div>
                        <div>{tx.symbol}</div>
                        <div className="text-right">{tx.shares}</div>
                        <div className="text-right">${tx.price.toFixed(2)}</div>
                        <div className="text-right">${tx.total.toFixed(2)}</div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex justify-end mt-4">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleViewAllTransactions}
                    className="hover:bg-gray-100 transition-colors"
                  >
                    View All Transactions
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Portfolio;
