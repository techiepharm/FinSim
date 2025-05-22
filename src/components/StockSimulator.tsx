
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TrendingUp, Search, ArrowRight, LineChart, BarChart, DollarSign } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TradeEducation from './TradeEducation';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const StockSimulator = () => {
  const [currentStep, setCurrentStep] = useState("market-selection");
  const [searchQuery, setSearchQuery] = useState('');
  const [tradeAmount, setTradeAmount] = useState(0);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  
  // Mock stock data
  const stocks = [
    { symbol: "AAPL", name: "Apple Inc.", price: 182.63, change: 1.25 },
    { symbol: "MSFT", name: "Microsoft Corporation", price: 334.78, change: -0.52 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 131.42, change: 0.87 },
    { symbol: "AMZN", name: "Amazon.com Inc.", price: 178.12, change: 2.13 },
    { symbol: "META", name: "Meta Platforms Inc.", price: 465.20, change: -1.45 },
    { symbol: "TSLA", name: "Tesla Inc.", price: 175.34, change: 3.21 },
    { symbol: "NVDA", name: "NVIDIA Corporation", price: 924.79, change: 5.63 }
  ];
  
  const filteredStocks = stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleStockSelect = (symbol: string) => {
    toast.info("Stock Selected", { description: `You selected ${symbol}` });
    setCurrentStep("asset-research");
  };
  
  const handleTrade = (action: string, symbol: string) => {
    if (tradeAmount <= 0) {
      toast.error("Invalid Amount", { description: "Please enter a valid amount to trade" });
      return;
    }
    
    toast.success(`${action} Order Placed`, { 
      description: `You ${action === 'Buy' ? 'bought' : 'sold'} $${tradeAmount} of ${symbol}`
    });
    setCurrentStep("position-monitoring");
  };
  
  const handleAnalyzeMarket = () => {
    setShowAnalysisModal(true);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold mb-6 finance-accent-gradient">Stock Market Simulator</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Market Overview</CardTitle>
              <CardDescription>Search for stocks to trade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex gap-2">
                <div className="relative flex-grow">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search stocks..."
                    className="pl-8"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => handleAnalyzeMarket()}
                  className="bg-finance-primary"
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Analyze
                </Button>
              </div>
              
              <div className="border rounded-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-2">Symbol</th>
                      <th className="text-left p-2">Name</th>
                      <th className="text-right p-2">Price</th>
                      <th className="text-right p-2">Change</th>
                      <th className="text-center p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStocks.map((stock) => (
                      <tr key={stock.symbol} className="border-t hover:bg-muted/30">
                        <td className="p-2 font-medium">{stock.symbol}</td>
                        <td className="p-2">{stock.name}</td>
                        <td className="p-2 text-right">${stock.price}</td>
                        <td className={`p-2 text-right ${stock.change >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {stock.change >= 0 ? `+${stock.change}%` : `${stock.change}%`}
                        </td>
                        <td className="p-2 flex justify-center gap-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleStockSelect(stock.symbol)}
                            className="text-xs"
                          >
                            Select
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => handleAnalyzeMarket()}
                            className="bg-finance-primary text-xs"
                          >
                            Analyze
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Trading Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="trade">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="trade">Trade</TabsTrigger>
                  <TabsTrigger value="chart">Charts</TabsTrigger>
                  <TabsTrigger value="news">News</TabsTrigger>
                </TabsList>
                <TabsContent value="trade" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div>
                      <Label htmlFor="trade-amount">Amount ($)</Label>
                      <div className="flex mt-1">
                        <span className="inline-flex items-center px-3 bg-muted border border-r-0 border-input rounded-l-md">
                          <DollarSign className="h-4 w-4" />
                        </span>
                        <Input
                          id="trade-amount"
                          type="number"
                          value={tradeAmount || ''}
                          onChange={(e) => setTradeAmount(Number(e.target.value))}
                          className="rounded-l-none"
                          placeholder="Enter amount"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-end gap-2">
                      <Button 
                        onClick={() => handleTrade("Buy", "AAPL")}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Buy
                      </Button>
                      <Button 
                        onClick={() => handleTrade("Sell", "AAPL")}
                        variant="destructive"
                        className="flex-1"
                      >
                        Sell
                      </Button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-medium mb-2">Selected Stock Details</h3>
                    <div className="p-4 bg-muted/30 rounded-md">
                      <p className="text-muted-foreground text-sm">Select a stock to see details</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="chart">
                  <div className="flex justify-center items-center h-64 bg-muted/30 rounded-md">
                    <div className="text-center space-y-2">
                      <LineChart className="h-12 w-12 text-muted-foreground mx-auto" />
                      <p className="text-muted-foreground">Select a stock to view chart data</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="news">
                  <div className="space-y-2 mt-4">
                    <Card className="border-0 shadow-none hover:bg-muted/30 cursor-pointer">
                      <CardContent className="p-3 flex items-center gap-3">
                        <ArrowRight className="h-4 w-4 flex-shrink-0" />
                        <p className="text-sm">Market opens higher on tech stock gains</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-none hover:bg-muted/30 cursor-pointer">
                      <CardContent className="p-3 flex items-center gap-3">
                        <ArrowRight className="h-4 w-4 flex-shrink-0" />
                        <p className="text-sm">Federal Reserve signals potential rate cut</p>
                      </CardContent>
                    </Card>
                    <Card className="border-0 shadow-none hover:bg-muted/30 cursor-pointer">
                      <CardContent className="p-3 flex items-center gap-3">
                        <ArrowRight className="h-4 w-4 flex-shrink-0" />
                        <p className="text-sm">Earnings season shows strong corporate growth</p>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
        
        <div className="col-span-1 space-y-6">
          <Card gradient="light">
            <CardHeader>
              <CardTitle>Trading Education</CardTitle>
              <CardDescription>Learn as you trade</CardDescription>
            </CardHeader>
            <CardContent>
              <TradeEducation 
                currentStep={currentStep}
                onAnalyze={handleAnalyzeMarket}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Portfolio Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Available Cash</span>
                  <span className="font-medium">$12,589.75</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invested Amount</span>
                  <span className="font-medium">$5,420.30</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Profit/Loss</span>
                  <span className="text-green-600 font-medium">+$742.15 (13.7%)</span>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-b pb-2">
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">AAPL</span>
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Buy</span>
                  </div>
                  <span>$182.63</span>
                </div>
                <div className="text-xs text-muted-foreground">May 20, 2025 - 10:32 AM</div>
              </div>
              
              <div className="border-b pb-2">
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">MSFT</span>
                    <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">Sell</span>
                  </div>
                  <span>$334.78</span>
                </div>
                <div className="text-xs text-muted-foreground">May 19, 2025 - 2:15 PM</div>
              </div>
              
              <div>
                <div className="flex justify-between">
                  <div>
                    <span className="font-medium">GOOGL</span>
                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">Buy</span>
                  </div>
                  <span>$131.42</span>
                </div>
                <div className="text-xs text-muted-foreground">May 18, 2025 - 11:05 AM</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Market Analysis Dialog */}
      <Dialog open={showAnalysisModal} onOpenChange={setShowAnalysisModal}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Market Analysis</DialogTitle>
            <DialogDescription>
              Current market trends and technical indicators
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6">
            <div className="space-y-2">
              <h4 className="font-medium">Market Sentiment</h4>
              <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-blue-500" 
                  style={{ width: "65%" }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Bearish</span>
                <span>Neutral</span>
                <span>Bullish</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium">Key Indicators</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted/30 rounded-md">
                  <div className="text-sm text-muted-foreground">RSI (14)</div>
                  <div className="font-medium">58.3 <span className="text-xs text-muted-foreground">(Neutral)</span></div>
                </div>
                <div className="p-3 bg-muted/30 rounded-md">
                  <div className="text-sm text-muted-foreground">MACD</div>
                  <div className="font-medium">2.31 <span className="text-xs text-green-600">(Bullish)</span></div>
                </div>
                <div className="p-3 bg-muted/30 rounded-md">
                  <div className="text-sm text-muted-foreground">50-Day MA</div>
                  <div className="font-medium">179.24 <span className="text-xs text-green-600">(Above)</span></div>
                </div>
                <div className="p-3 bg-muted/30 rounded-md">
                  <div className="text-sm text-muted-foreground">200-Day MA</div>
                  <div className="font-medium">172.51 <span className="text-xs text-green-600">(Above)</span></div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Recommendation</h4>
              <p className="text-sm">Based on current technical analysis, the market shows moderate bullish momentum with strong support at key levels. Consider a balanced approach with selective entry points.</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockSimulator;
