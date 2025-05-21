import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUp, ArrowDown, Search, TrendingUp, TrendingDown, LineChart } from "lucide-react";
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

const StockSimulator = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState(mockStocks[0]);
  const [quantity, setQuantity] = useState(1);
  const [portfolioValue, setPortfolioValue] = useState(100000);
  
  const filteredStocks = mockStocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleSelectStock = (stock: any) => {
    setSelectedStock(stock);
    setSearchTerm("");
    setQuantity(1);
  };
  
  const handleBuy = () => {
    const cost = selectedStock.price * quantity;
    if (cost <= portfolioValue) {
      setPortfolioValue(prev => prev - cost);
      // Would also add the stock to portfolio in a real app
      alert(`Successfully bought ${quantity} shares of ${selectedStock.symbol} for $${cost.toFixed(2)}`);
    } else {
      alert("Insufficient funds for this transaction");
    }
  };
  
  const handleSell = () => {
    const proceeds = selectedStock.price * quantity;
    setPortfolioValue(prev => prev + proceeds);
    // Would also remove from portfolio in a real app
    alert(`Successfully sold ${quantity} shares of ${selectedStock.symbol} for $${proceeds.toFixed(2)}`);
  };
  
  return (
    <div className="p-6 space-y-6">
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
        
        <Button className="bg-finance-accent hover:bg-green-700">
          View Transaction History
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stock Search */}
        <Card className="lg:col-span-1">
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
                    className={`p-3 rounded-md cursor-pointer hover:bg-gray-100 transition-colors ${
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
        <Card className="lg:col-span-2">
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
                
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <LineChart className="h-4 w-4" />
                  <span>Advanced Chart</span>
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            <Tabs defaultValue="day">
              <div className="flex justify-between items-center mb-4">
                <TabsList>
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="month">Month</TabsTrigger>
                  <TabsTrigger value="year">Year</TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="day" className="mt-0">
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ReLineChart
                      data={chartData}
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
                      />
                    </ReLineChart>
                  </ResponsiveContainer>
                </div>
              </TabsContent>
              
              {/* Other time periods would be implemented similarly */}
              <TabsContent value="week">
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Weekly chart data would be loaded here
                </div>
              </TabsContent>
              <TabsContent value="month">
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Monthly chart data would be loaded here
                </div>
              </TabsContent>
              <TabsContent value="year">
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  Yearly chart data would be loaded here
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
                    className="flex-1 bg-finance-accent hover:bg-green-700"
                    onClick={handleBuy}
                  >
                    Buy
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 text-finance-danger border-finance-danger hover:bg-red-50"
                    onClick={handleSell}
                  >
                    Sell
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
