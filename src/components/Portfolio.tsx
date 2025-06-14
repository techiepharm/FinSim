
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";
import { ArrowUp, ArrowDown, PieChart, FileText, Play, BarChart3, TrendingUp } from "lucide-react";
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
  CartesianGrid,
  AreaChart,
  Area
} from "recharts";
import StockAnalysis from './StockAnalysis';
import FinancialReportAnalysis from './FinancialReportAnalysis';
import VideoEducation from './VideoEducation';

interface Holding {
  symbol: string;
  name: string;
  shares: number;
  avgCost: number;
}

interface PortfolioData {
  cash: number;
  holdings: Holding[];
}

interface Transaction {
  id: number;
  date: string;
  type: string;
  symbol?: string;
  shares?: number;
  price?: number;
  total: number;
  description: string;
}

// Current prices for Nigerian stocks in NGN
const nigerianStockPrices: { [key: string]: number } = {
  'DANGCEM': 287.65,
  'GTCO': 31.80,
  'MTNN': 179.05,
  'AIRTELAFRI': 1469.02,
  'BUACEMENT': 101.62,
  'ZENITHBANK': 28.65,
  'SEPLAT': 3386.50,
  'NESTLE': 1369.08,
  'UBA': 22.65,
  'FLOURMILL': 43.51
};

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const Portfolio = () => {
  const [portfolio, setPortfolio] = useState<PortfolioData>({ cash: 100000, holdings: [] });
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [activeTab, setActiveTab] = useState("performance");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [showFinancialReport, setShowFinancialReport] = useState(false);

  useEffect(() => {
    // Load portfolio data
    const savedPortfolio = localStorage.getItem('portfolio');
    if (savedPortfolio) {
      try {
        const parsedPortfolio = JSON.parse(savedPortfolio);
        const safePortfolio = {
          cash: typeof parsedPortfolio.cash === 'number' ? parsedPortfolio.cash : 100000,
          holdings: Array.isArray(parsedPortfolio.holdings) ? parsedPortfolio.holdings.filter(holding => 
            holding && 
            typeof holding.symbol === 'string' &&
            typeof holding.shares === 'number' &&
            typeof holding.avgCost === 'number' &&
            !isNaN(holding.shares) &&
            !isNaN(holding.avgCost) &&
            nigerianStockPrices[holding.symbol] // Only Nigerian stocks
          ) : []
        };
        setPortfolio(safePortfolio);
      } catch (e) {
        console.error('Error parsing portfolio data:', e);
        setPortfolio({ cash: 100000, holdings: [] });
      }
    }

    // Load transactions
    const savedTransactions = localStorage.getItem('transactions');
    if (savedTransactions) {
      try {
        const parsedTransactions = JSON.parse(savedTransactions);
        setTransactions(Array.isArray(parsedTransactions) ? parsedTransactions : []);
      } catch (e) {
        console.error('Error parsing transactions:', e);
        setTransactions([]);
      }
    }

    setTimeout(() => {
      setAnimate(true);
      toast("Nigerian Portfolio Loaded", {
        description: "View your Nigerian stock investments and performance metrics in NGN.",
        className: "bg-green-600 border-green-700 text-white",
      });
    }, 300);
  }, []);

  // Calculate portfolio metrics with Nigerian stock prices
  const calculatePortfolioValue = () => {
    const holdingsValue = portfolio.holdings.reduce((total, holding) => {
      if (!holding || typeof holding.shares !== 'number' || typeof holding.avgCost !== 'number') {
        return total;
      }
      
      const currentPrice = nigerianStockPrices[holding.symbol] || holding.avgCost;
      return total + (holding.shares * currentPrice);
    }, 0);
    
    const cashValue = typeof portfolio.cash === 'number' ? portfolio.cash : 0;
    return cashValue + holdingsValue;
  };

  const calculateTotalGain = () => {
    return portfolio.holdings.reduce((total, holding) => {
      if (!holding || typeof holding.shares !== 'number' || typeof holding.avgCost !== 'number') {
        return total;
      }
      
      const currentPrice = nigerianStockPrices[holding.symbol] || holding.avgCost;
      const currentValue = holding.shares * currentPrice;
      const costBasis = holding.shares * holding.avgCost;
      return total + (currentValue - costBasis);
    }, 0);
  };

  const calculateDayChange = () => {
    // Simulate day change in NGN
    return 8750.50;
  };

  const totalValue = calculatePortfolioValue();
  const totalGain = calculateTotalGain();
  const totalGainPercent = portfolio.holdings.length > 0 && totalValue > 0 ? (totalGain / (totalValue - totalGain)) * 100 : 0;
  const dayChange = calculateDayChange();
  const dayChangePercent = 1.25;

  // Prepare allocation data for pie chart
  const allocationData = portfolio.holdings
    .filter(holding => holding && typeof holding.shares === 'number' && typeof holding.avgCost === 'number')
    .map(holding => {
      const currentPrice = nigerianStockPrices[holding.symbol] || holding.avgCost;
      const value = holding.shares * currentPrice;
      return {
        name: holding.symbol,
        value: totalValue > 0 ? (value / totalValue) * 100 : 0,
        actualValue: value
      };
    });

  // Add cash allocation
  if (portfolio.cash > 0 && totalValue > 0) {
    allocationData.push({
      name: 'CASH',
      value: (portfolio.cash / totalValue) * 100,
      actualValue: portfolio.cash
    });
  }

  // Performance data for Nigerian market simulation
  const generateEnhancedPerformanceData = () => {
    const data = [];
    let value = 100000; // Starting with ₦100,000
    const today = new Date();
    
    for (let i = 90; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      // Nigerian market volatility simulation
      const change = (Math.random() - 0.47) * 2500; // Slight upward bias with Nigerian market volatility
      value = Math.max(value + change, 80000); // Floor at ₦80,000
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        value: value,
        benchmark: 100000 + (90 - i) * 850 // NSE benchmark growth
      });
    }
    
    // Ensure current value matches portfolio
    data[data.length - 1].value = totalValue;
    return data;
  };

  const enhancedPerformanceData = generateEnhancedPerformanceData();

  const handleDownloadStatement = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Nigerian Portfolio Statement Downloaded", {
        description: "Your portfolio statement with NGN values has been downloaded.",
      });
    }, 1000);
  };

  const handleViewAllTransactions = () => {
    window.location.href = '/transactions';
  };

  const handleStockClick = (symbol: string) => {
    setSelectedStock(symbol);
  };

  const handleTrade = (symbol: string, action: 'buy' | 'sell') => {
    toast(`${action.toUpperCase()} ${symbol}`, {
      description: `Redirecting to Nigerian stock trading for ${symbol}...`,
      className: "bg-blue-600 border-blue-700 text-white",
    });
    window.location.href = '/trading';
  };

  // Get Nigerian stock industry mapping
  const getNigerianStockIndustry = (symbol: string) => {
    const industries: { [key: string]: string } = {
      'DANGCEM': 'Building Materials',
      'GTCO': 'Banking',
      'MTNN': 'Telecommunications',
      'AIRTELAFRI': 'Telecommunications',
      'BUACEMENT': 'Building Materials',
      'ZENITHBANK': 'Banking',
      'SEPLAT': 'Oil & Gas',
      'NESTLE': 'Consumer Goods',
      'UBA': 'Banking',
      'FLOURMILL': 'Consumer Goods'
    };
    return industries[symbol] || 'Other';
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in min-h-screen bg-slate-900">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">Nigerian Stock Portfolio</h2>
          <p className="text-slate-400 mt-1">Track your Nigerian investments and performance in NGN</p>
        </div>
        
        <Button 
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
          onClick={handleDownloadStatement}
          disabled={isLoading}
        >
          <FileText className="h-4 w-4" />
          {isLoading ? "Generating..." : "Download NGN Statement"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className={`hover:shadow-lg transition-all duration-300 bg-slate-800 border-slate-700 ${animate ? 'animate-fade-in' : 'opacity-0'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Portfolio Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₦{(totalValue || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div className="flex items-center text-sm mt-1">
              {(totalGain || 0) >= 0 ? (
                <>
                  <ArrowUp className="mr-1 h-4 w-4 text-green-400 animate-bounce" />
                  <span className="text-green-400">+{(totalGainPercent || 0).toFixed(2)}%</span>
                </>
              ) : (
                <>
                  <ArrowDown className="mr-1 h-4 w-4 text-red-400" />
                  <span className="text-red-400">{(totalGainPercent || 0).toFixed(2)}%</span>
                </>
              )}
              <span className="text-slate-400 ml-2">overall</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`hover:shadow-lg transition-all duration-300 bg-slate-800 border-slate-700 ${animate ? 'animate-fade-in delay-100' : 'opacity-0'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Day's Change</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">+₦{(dayChange || 0).toFixed(2)}</div>
            <div className="flex items-center text-sm mt-1">
              <ArrowUp className="mr-1 h-4 w-4 text-green-400" />
              <span className="text-green-400">+{(dayChangePercent || 0).toFixed(2)}%</span>
              <span className="text-slate-400 ml-2">today</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`hover:shadow-lg transition-all duration-300 bg-slate-800 border-slate-700 ${animate ? 'animate-fade-in delay-200' : 'opacity-0'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Total Gain/Loss</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${(totalGain || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
              {(totalGain || 0) >= 0 ? "+" : ""}₦{(totalGain || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center text-sm mt-1">
              {(totalGainPercent || 0) >= 0 ? (
                <>
                  <ArrowUp className="mr-1 h-4 w-4 text-green-400" />
                  <span className="text-green-400">+{(totalGainPercent || 0).toFixed(2)}%</span>
                </>
              ) : (
                <>
                  <ArrowDown className="mr-1 h-4 w-4 text-red-400" />
                  <span className="text-red-400">{(totalGainPercent || 0).toFixed(2)}%</span>
                </>
              )}
              <span className="text-slate-400 ml-2">overall</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className={`hover:shadow-lg transition-all duration-300 bg-slate-800 border-slate-700 ${animate ? 'animate-fade-in delay-300' : 'opacity-0'}`}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">Available Cash</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">₦{(portfolio.cash || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div className="text-sm text-slate-400 mt-1">Available for NSE trading</div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enhanced Holdings with Nigerian Stock Analysis */}
        <Card className={`lg:col-span-2 hover:shadow-lg transition-all duration-300 bg-slate-800 border-slate-700 ${animate ? 'animate-fade-in' : 'opacity-0'}`}>
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>Nigerian Stock Holdings & Analysis</span>
              <Button 
                size="sm"
                onClick={() => setShowFinancialReport(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <FileText className="h-4 w-4 mr-2" />
                Financial Report
              </Button>
            </CardTitle>
            <CardDescription className="text-slate-400">
              Click on any Nigerian stock for detailed analysis and recommendations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {portfolio.holdings.length > 0 ? (
              <div className="space-y-4">
                {/* Nigerian Stock Holdings Table */}
                <div className="rounded-md border border-slate-600">
                  <div className="grid grid-cols-6 bg-slate-700 p-3 text-xs font-medium text-slate-400">
                    <div>NSE Symbol</div>
                    <div className="text-right">Shares</div>
                    <div className="text-right">Price (₦)</div>
                    <div className="text-right">Value (₦)</div>
                    <div className="text-right">Gain/Loss</div>
                    <div className="text-right">Action</div>
                  </div>
                  
                  <div className="divide-y divide-slate-600">
                    {portfolio.holdings
                      .filter(holding => holding && typeof holding.shares === 'number' && typeof holding.avgCost === 'number')
                      .map((holding) => {
                        const currentPrice = nigerianStockPrices[holding.symbol] || holding.avgCost;
                        const currentValue = (holding.shares || 0) * (currentPrice || 0);
                        const costBasis = (holding.shares || 0) * (holding.avgCost || 0);
                        const gain = currentValue - costBasis;
                        const gainPercent = (holding.avgCost && holding.avgCost > 0) 
                          ? ((currentPrice - holding.avgCost) / holding.avgCost) * 100 
                          : 0;
                        
                        return (
                          <div 
                            key={holding.symbol} 
                            className="grid grid-cols-6 p-3 text-sm hover:bg-slate-700 cursor-pointer transition-colors"
                            onClick={() => handleStockClick(holding.symbol)}
                          >
                            <div className="font-medium text-white">{holding.symbol || 'N/A'}</div>
                            <div className="text-right text-white">{holding.shares || 0}</div>
                            <div className="text-right text-white">₦{(currentPrice || 0).toFixed(2)}</div>
                            <div className="text-right text-white">₦{(currentValue || 0).toFixed(2)}</div>
                            <div className={`text-right ${(gain || 0) >= 0 ? "text-green-400" : "text-red-400"} flex items-center justify-end`}>
                              {(gain || 0) >= 0 ? (
                                <>
                                  <ArrowUp className="mr-1 h-3 w-3" />
                                  <span>+₦{(gain || 0).toFixed(2)}</span>
                                </>
                              ) : (
                                <>
                                  <ArrowDown className="mr-1 h-3 w-3" />
                                  <span>-₦{Math.abs(gain || 0).toFixed(2)}</span>
                                </>
                              )}
                            </div>
                            <div className="text-right">
                              <Button 
                                size="sm"
                                variant="outline"
                                className="h-6 px-2"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStockClick(holding.symbol);
                                }}
                              >
                                <BarChart3 className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Nigerian Stock Analysis Dialog */}
                <Dialog open={!!selectedStock} onOpenChange={() => setSelectedStock(null)}>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-white">Nigerian Stock Analysis - {selectedStock}</DialogTitle>
                    </DialogHeader>
                    {selectedStock && (
                      <StockAnalysis
                        symbol={selectedStock}
                        name={portfolio.holdings.find(h => h.symbol === selectedStock)?.name || selectedStock}
                        currentPrice={nigerianStockPrices[selectedStock] || 0}
                        shares={portfolio.holdings.find(h => h.symbol === selectedStock)?.shares || 0}
                        avgCost={portfolio.holdings.find(h => h.symbol === selectedStock)?.avgCost || 0}
                        industry={getNigerianStockIndustry(selectedStock)}
                        onTrade={handleTrade}
                      />
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 mb-4">No Nigerian stock holdings yet. Start trading NSE stocks to build your portfolio!</p>
                <Button 
                  onClick={() => window.location.href = '/trading'}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Start NSE Trading
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Video Education in Sidebar */}
        <div className="space-y-6">
          <VideoEducation topic="trading" compact={true} />
          
          {/* Portfolio Allocation Chart */}
          <Card className={`hover:shadow-lg transition-all duration-300 bg-slate-800 border-slate-700 ${animate ? 'animate-fade-in' : 'opacity-0'}`}>
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Nigerian Portfolio Allocation
              </CardTitle>
            </CardHeader>
            <CardContent>
              {allocationData.length > 0 ? (
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={allocationData}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name} ${(value || 0).toFixed(1)}%`}
                      >
                        {allocationData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={COLORS[index % COLORS.length]} 
                          />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value: any, name: any, props: any) => [
                          `${(value || 0).toFixed(2)}% (₦${(props.payload.actualValue || 0).toFixed(2)})`, 
                          'Allocation'
                        ]} 
                      />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <div className="h-[200px] flex items-center justify-center">
                  <p className="text-slate-400">No Nigerian stock data to display</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Enhanced Portfolio Analysis */}
      <Card className={`hover:shadow-lg transition-all duration-300 bg-slate-800 border-slate-700 ${animate ? 'animate-fade-in' : 'opacity-0'}`}>
        <CardHeader>
          <CardTitle className="text-white">Nigerian Stock Portfolio Performance & Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="performance">NSE Performance</TabsTrigger>
              <TabsTrigger value="transactions">Recent Activity</TabsTrigger>
              <TabsTrigger value="education">Learning</TabsTrigger>
            </TabsList>
          
            <TabsContent value="performance">
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={enhancedPerformanceData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" tickFormatter={(value) => `₦${value.toLocaleString()}`} />
                    <RechartsTooltip 
                      contentStyle={{
                        backgroundColor: '#1F2937',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        color: '#F9FAFB'
                      }}
                      formatter={(value: any, name: string) => [
                        `₦${value.toLocaleString()}`, 
                        name === 'value' ? 'Portfolio Value' : 'NSE Benchmark'
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="benchmark"
                      stackId="1"
                      stroke="#6B7280"
                      fill="#6B728020"
                      strokeWidth={1}
                      strokeDasharray="5 5"
                    />
                    <Area
                      type="monotone"
                      dataKey="value"
                      stackId="2"
                      stroke="#10B981"
                      fill="#10B98120"
                      strokeWidth={3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              {/* Performance Metrics in NGN */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-3 bg-slate-700 rounded-lg">
                  <p className="text-slate-400 text-sm">90-Day Return</p>
                  <p className="text-green-400 font-bold text-lg">
                    +{((totalValue - 100000) / 100000 * 100).toFixed(2)}%
                  </p>
                </div>
                <div className="text-center p-3 bg-slate-700 rounded-lg">
                  <p className="text-slate-400 text-sm">Best Day</p>
                  <p className="text-green-400 font-bold text-lg">+₦12,750</p>
                </div>
                <div className="text-center p-3 bg-slate-700 rounded-lg">
                  <p className="text-slate-400 text-sm">Worst Day</p>
                  <p className="text-red-400 font-bold text-lg">-₦8,930</p>
                </div>
                <div className="text-center p-3 bg-slate-700 rounded-lg">
                  <p className="text-slate-400 text-sm">NSE Volatility</p>
                  <p className="text-yellow-400 font-bold text-lg">15.2%</p>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="transactions">
              {transactions.length > 0 ? (
                <div className="space-y-3">
                  {transactions.slice(0, 5).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          tx.type === 'BUY' ? 'bg-green-600' : 
                          tx.type === 'SELL' ? 'bg-red-600' : 'bg-blue-600'
                        }`}>
                          {tx.type}
                        </span>
                        <div>
                          <p className="text-white font-medium">{tx.description}</p>
                          <p className="text-slate-400 text-sm">{new Date(tx.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${tx.total >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {tx.total >= 0 ? '+' : ''}₦{Math.abs(tx.total).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-end mt-4">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleViewAllTransactions}
                      className="hover:bg-slate-700"
                    >
                      View All NGN Transactions
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-400">No Nigerian stock transactions yet</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="education">
              <VideoEducation topic="trading" compact={false} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Financial Report Dialog */}
      <Dialog open={showFinancialReport} onOpenChange={setShowFinancialReport}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">Comprehensive Nigerian Stock Financial Report</DialogTitle>
          </DialogHeader>
          <FinancialReportAnalysis
            transactions={transactions}
            portfolioValue={totalValue}
            cashBalance={portfolio.cash}
            totalGain={totalGain}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Portfolio;
