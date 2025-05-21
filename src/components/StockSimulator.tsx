
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, Search, TrendingUp, TrendingDown, LineChart } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { 
  LineChart as ReLineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";

// Mock stock data
const mockStocks = [
  { symbol: "AAPL", name: "Apple Inc.", price: 183.58, change: 1.24, changePercent: 0.68 },
  { symbol: "MSFT", name: "Microsoft Corp", price: 412.72, change: -2.31, changePercent: -0.56 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 154.92, change: 0.87, changePercent: 0.56 },
  { symbol: "AMZN", name: "Amazon.com Inc.", price: 176.53, change: -1.42, changePercent: -0.80 },
  { symbol: "META", name: "Meta Platforms", price: 467.12, change: 5.23, changePercent: 1.13 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 183.48, change: -3.29, changePercent: -1.76 },
  { symbol: "NVDA", name: "NVIDIA Corp", price: 924.79, change: 15.32, changePercent: 1.68 },
  { symbol: "JPM", name: "JPMorgan Chase", price: 198.47, change: 0.89, changePercent: 0.45 },
  { symbol: "V", name: "Visa Inc.", price: 276.39, change: -1.02, changePercent: -0.37 },
  { symbol: "WMT", name: "Walmart Inc.", price: 68.92, change: 0.34, changePercent: 0.50 },
];

const chartData = [
  { name: "9:30", price: 180.25 },
  { name: "10:00", price: 181.46 },
  { name: "10:30", price: 182.01 },
  { name: "11:00", price: 181.87 },
  { name: "11:30", price: 182.34 },
  { name: "12:00", price: 182.56 },
  { name: "12:30", price: 182.48 },
  { name: "13:00", price: 182.93 },
  { name: "13:30", price: 183.12 },
  { name: "14:00", price: 183.48 },
  { name: "14:30", price: 183.25 },
  { name: "15:00", price: 183.58 },
];

const weekData = [
  { name: "Mon", price: 178.85 },
  { name: "Tue", price: 179.46 },
  { name: "Wed", price: 180.21 },
  { name: "Thu", price: 181.87 },
  { name: "Fri", price: 183.58 },
];

const monthData = [
  { name: "Week 1", price: 175.25 },
  { name: "Week 2", price: 177.46 },
  { name: "Week 3", price: 180.01 },
  { name: "Week 4", price: 183.58 },
];

const yearData = [
  { name: "Jan", price: 165.25 },
  { name: "Feb", price: 168.46 },
  { name: "Mar", price: 170.01 },
  { name: "Apr", price: 172.87 },
  { name: "May", price: 183.58 },
];

const StockSimulator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState(mockStocks[0]);
  const [quantity, setQuantity] = useState(1);
  const [portfolioValue, setPortfolioValue] = useState(100000);
  const [currentTab, setCurrentTab] = useState("day");
  const [isLoading, setIsLoading] = useState(false);
  const [chartVisible, setChartVisible] = useState(false);
  
  // Add animation effect when component loads
  useEffect(() => {
    setTimeout(() => setChartVisible(true), 300);
    
    // Welcome toast
    toast("Stock Simulator Loaded", {
      description: "Start trading with your $100,000 virtual portfolio!",
    });
  }, []);
  
  const filteredStocks = mockStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelectStock = (stock: any) => {
    setIsLoading(true);
    setSelectedStock(stock);
    setSearchTerm("");
    setQuantity(1);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      toast(`${stock.symbol} Selected`, {
        description: `Current price: $${stock.price.toFixed(2)}`,
      });
    }, 500);
  };
  
  const handleBuy = () => {
    const cost = selectedStock.price * quantity;
    if (cost <= portfolioValue) {
      setIsLoading(true);
      
      // Simulate transaction processing
      setTimeout(() => {
        setPortfolioValue(prev => prev - cost);
        setIsLoading(false);
        toast.success(`Purchase Successful`, {
          description: `Bought ${quantity} shares of ${selectedStock.symbol} for $${cost.toFixed(2)}`
        });
      }, 800);
    } else {
      toast.error("Insufficient Funds", {
        description: `You need $${cost.toFixed(2)} but have $${portfolioValue.toFixed(2)} available.`
      });
    }
  };
  
  const handleSell = () => {
    const proceeds = selectedStock.price * quantity;
    setIsLoading(true);
    
    // Simulate transaction processing
    setTimeout(() => {
      setPortfolioValue(prev => prev + proceeds);
      setIsLoading(false);
      toast.success(`Sale Successful`, {
        description: `Sold ${quantity} shares of ${selectedStock.symbol} for $${proceeds.toFixed(2)}`
      });
    }, 800);
  };
  
  const handleViewHistory = () => {
    toast.info("Transaction History", {
      description: "Opening transaction history...",
    });
  };
  
  const handleAdvancedChart = () => {
    toast.info("Advanced Chart", {
      description: `Loading advanced chart for ${selectedStock.symbol}...`,
    });
  };
  
  const getCurrentChartData = () => {
    switch (currentTab) {
      case "day": return chartData;
      case "week": return weekData;
      case "month": return monthData;
      case "year": return yearData;
      default: return chartData;
    }
  };
  
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-finance-primary">Stock Trading Simulator</h2>
          <p className="text-muted-foreground mt-1">
            Practice trading with your $
            <span className="font-medium">
              {portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </span> demo account
          </p>
        </div>
        
        <Button 
          className="bg-finance-accent hover:bg-green-700 transition-colors"
          onClick={handleViewHistory}
        >
          View Transaction History
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Search */}
        <Card className="lg:col-span-1 hover:shadow-lg transition-all duration-300">
          <CardHeader>
            <CardTitle>Markets</CardTitle>
            <CardDescription>Search and select stocks to trade</CardDescription>
            
            <div className="relative mt-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by symbol or company name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </CardHeader>
          
          <CardContent className="max-h-[500px] overflow-y-auto">
            <div className="space-y-2">
              {searchTerm === "" && <div className="text-sm text-muted-foreground mb-2">Popular Stocks</div>}
              
              {filteredStocks.length === 0 ? (
                <div className="text-center py-4 text-muted-foreground">No stocks found</div>
              ) : (
                filteredStocks.map(stock => (
                  <div 
                    key={stock.symbol}
                    className={`p-3 rounded-md cursor-pointer transition-colors hover:bg-gray-100 ${
                      selectedStock.symbol === stock.symbol ? "bg-gray-100 border border-gray-200" : ""
                    }`}
                    onClick={() => handleSelectStock(stock)}
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium">{stock.symbol}</div>
                      <div className="font-medium">${stock.price}</div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <div className="text-sm text-muted-foreground">{stock.name}</div>
                      <div className={`flex items-center text-sm ${
                        stock.change >= 0 ? "text-finance-accent" : "text-finance-danger"
                      }`}>
                        {stock.change >= 0 ? (
                          <ArrowUp className="h-3 w-3 mr-1" />
                        ) : (
                          <ArrowDown className="h-3 w-3 mr-1" />
                        )}
                        {Math.abs(stock.changePercent).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Stock Detail and Chart */}
        <Card className="lg:col-span-2 hover:shadow-lg transition-all duration-300">
          <CardHeader className="border-b">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2">
                  <CardTitle>{selectedStock.symbol}</CardTitle>
                  <div className="text-lg">${selectedStock.price}</div>
                  <div className={`flex items-center text-sm ${
                    selectedStock.change >= 0 ? "text-finance-accent" : "text-finance-danger"
                  }`}>
                    {selectedStock.change >= 0 ? (
                      <ArrowUp className="h-3 w-3 mr-1" />
                    ) : (
                      <ArrowDown className="h-3 w-3 mr-1" />
                    )}
                    {Math.abs(selectedStock.changePercent).toFixed(2)}%
                  </div>
                </div>
                <CardDescription>{selectedStock.name}</CardDescription>
              </div>
              
              <div className="flex items-center gap-2">
                <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs ${
                  selectedStock.changePercent >= 0 
                    ? "bg-green-100 text-green-800" 
                    : "bg-red-100 text-red-800"
                }`}>
                  {selectedStock.changePercent >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {selectedStock.changePercent >= 0 ? "Bullish" : "Bearish"}
                </span>
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="flex items-center gap-1 hover:bg-gray-100 transition-colors"
                  onClick={handleAdvancedChart}
                >
                  <LineChart className="h-4 w-4" />
                  <span>Advanced Chart</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <Tabs 
              defaultValue="day" 
              value={currentTab}
              onValueChange={(value) => {
                setCurrentTab(value);
                setChartVisible(false);
                setTimeout(() => setChartVisible(true), 300);
              }}
            >
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value={currentTab} className="mt-0">
                <div className="h-64">
                  {isLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <div className="animate-pulse text-gray-400">Loading chart data...</div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%" className={chartVisible ? "animate-fade-in" : "opacity-0"}>
                      <ReLineChart
                        data={getCurrentChartData()}
                        margin={{
                          top: 5,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={['auto', 'auto']} />
                        <Tooltip />
                        <Legend />
                        <Line 
                          type="monotone" 
                          dataKey="price" 
                          stroke={selectedStock.changePercent >= 0 ? "#1C7C54" : "#D64045"} 
                          activeDot={{ r: 8 }} 
                          animationDuration={1000}
                        />
                      </ReLineChart>
                    </ResponsiveContainer>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="w-full border-t pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground">Quantity</label>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    className="transition-all focus:ring-2 focus:ring-finance-primary focus:border-finance-primary"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Estimated Cost</label>
                  <div className="p-2 border rounded-md bg-gray-50">
                    ${(selectedStock.price * quantity).toFixed(2)}
                  </div>
                </div>
                <div className="flex items-end gap-2">
                  <Button 
                    className="flex-1 bg-finance-accent hover:bg-green-700 transition-colors"
                    onClick={handleBuy}
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Buy"}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 text-finance-danger border-finance-danger hover:bg-red-50 transition-colors"
                    onClick={handleSell}
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Sell"}
                  </Button>
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default StockSimulator;
