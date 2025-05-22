
import { useState, useEffect } from 'react';
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

// Financial quotes to display after trading
const FINANCIAL_QUOTES = [
  "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
  "In investing, what is comfortable is rarely profitable.",
  "The individual investor should act consistently as an investor and not as a speculator.",
  "The four most dangerous words in investing are: 'This time it's different.'",
  "The best investment you can make is in yourself.",
  "Risk comes from not knowing what you're doing.",
  "The most important quality for an investor is temperament, not intellect.",
  "I will tell you how to become rich. Close the doors. Be fearful when others are greedy. Be greedy when others are fearful.",
];

// Simple stock analysis descriptions in plain language
const STOCK_ANALYSES = {
  "AAPL": {
    trend: "rising",
    sentiment: "positive",
    riskLevel: "moderate",
    description: "Apple stock looks pretty good right now. Their new products are selling well, and people seem excited about what's coming next. The company has lots of cash, which gives them a safety cushion if things get tough.",
    recommendation: "This could be a good time to buy if you're looking for a stable company with growth potential."
  },
  "MSFT": {
    trend: "stable",
    sentiment: "positive",
    riskLevel: "low",
    description: "Microsoft is a steady performer. Their cloud services are growing, and they have reliable income from software subscriptions. They're not the most exciting stock, but they're dependable.",
    recommendation: "This is a solid choice if you want something reliable in your portfolio."
  },
  "GOOGL": {
    trend: "rising",
    sentiment: "positive",
    riskLevel: "moderate",
    description: "Google continues to dominate online advertising. They're investing heavily in AI, which could pay off big in the future. Some regulatory concerns exist, but the company is still growing steadily.",
    recommendation: "Consider buying if you believe in their long-term AI strategy and aren't worried about potential regulations."
  },
  "AMZN": {
    trend: "volatile",
    sentiment: "mixed",
    riskLevel: "moderate",
    description: "Amazon has been up and down lately. Their e-commerce business faces competition, but AWS cloud services continue to grow strongly. They're spending a lot on new initiatives, which might hurt profits in the short term.",
    recommendation: "This could be good for long-term growth, but expect some bumps along the way."
  },
  "META": {
    trend: "volatile",
    sentiment: "mixed",
    riskLevel: "high",
    description: "Meta (Facebook) is making big bets on the metaverse, which is risky. Their core social media business still makes money, but user growth is slowing and there are privacy concerns.",
    recommendation: "This is a higher risk option - might be worth a small position if you believe in their vision."
  },
  "TSLA": {
    trend: "volatile",
    sentiment: "mixed",
    riskLevel: "very high",
    description: "Tesla stock tends to swing wildly based on what Elon Musk says or does. The company is growing and leading in electric vehicles, but competition is increasing and the stock price already assumes a lot of future success.",
    recommendation: "Only invest what you can afford to lose - this stock can go up or down dramatically."
  },
  "NVDA": {
    trend: "strongly rising",
    sentiment: "very positive",
    riskLevel: "moderate",
    description: "NVIDIA is booming due to AI demand for their chips. They're the leader in GPUs needed for AI training. The stock has gone up a lot already, which raises questions about how much growth is already priced in.",
    recommendation: "Strong growth potential, but consider buying in smaller amounts over time rather than all at once."
  }
};

const StockSimulator = () => {
  const [currentStep, setCurrentStep] = useState("market-selection");
  const [searchQuery, setSearchQuery] = useState('');
  const [tradeAmount, setTradeAmount] = useState(0);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [availableBalance, setAvailableBalance] = useState(12589.75);
  const [transactions, setTransactions] = useState([
    { date: new Date("2025-05-20T10:32:00"), type: "BUY", symbol: "AAPL", price: 182.63, amount: 182.63 },
    { date: new Date("2025-05-19T14:15:00"), type: "SELL", symbol: "MSFT", price: 334.78, amount: 334.78 },
    { date: new Date("2025-05-18T11:05:00"), type: "BUY", symbol: "GOOGL", price: 131.42, amount: 131.42 }
  ]);
  const [portfolio, setPortfolio] = useState({
    cash: 12589.75,
    invested: 5420.30,
    holdings: [
      { symbol: "AAPL", shares: 10, avgPrice: 170.45, currentPrice: 182.63 },
      { symbol: "GOOGL", shares: 5, avgPrice: 128.30, currentPrice: 131.42 }
    ]
  });
  const [showQuoteDialog, setShowQuoteDialog] = useState(false);
  const [tradeQuote, setTradeQuote] = useState("");
  
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
  
  // Generate a random quote
  const getRandomQuote = () => {
    return FINANCIAL_QUOTES[Math.floor(Math.random() * FINANCIAL_QUOTES.length)];
  };
  
  // Update user's portfolio after a trade
  const updatePortfolio = (symbol, type, amount, price) => {
    const newPortfolio = {...portfolio};
    
    if (type === "BUY") {
      // Subtract from cash
      newPortfolio.cash -= amount;
      newPortfolio.invested += amount;
      
      // Update holdings
      const shares = amount / price;
      const existingPosition = newPortfolio.holdings.find(h => h.symbol === symbol);
      if (existingPosition) {
        // Update existing position
        const totalShares = existingPosition.shares + shares;
        const totalCost = (existingPosition.shares * existingPosition.avgPrice) + amount;
        existingPosition.shares = totalShares;
        existingPosition.avgPrice = totalCost / totalShares;
        existingPosition.currentPrice = price;
      } else {
        // Add new position
        newPortfolio.holdings.push({
          symbol,
          shares,
          avgPrice: price,
          currentPrice: price
        });
      }
    } else if (type === "SELL") {
      // Add to cash
      newPortfolio.cash += amount;
      
      // Find position
      const existingPosition = newPortfolio.holdings.find(h => h.symbol === symbol);
      if (existingPosition) {
        const shares = amount / price;
        existingPosition.shares -= shares;
        
        // If no shares left, remove from holdings
        if (existingPosition.shares <= 0) {
          newPortfolio.holdings = newPortfolio.holdings.filter(h => h.symbol !== symbol);
        }
        
        // Adjust invested amount
        newPortfolio.invested -= amount;
        if (newPortfolio.invested < 0) newPortfolio.invested = 0;
      }
    }
    
    setPortfolio(newPortfolio);
    setAvailableBalance(newPortfolio.cash);
  }
  
  const filteredStocks = stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) || 
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleStockSelect = (symbol) => {
    const stock = stocks.find(s => s.symbol === symbol);
    setSelectedStock(stock);
    toast.info("Stock Selected", { description: `You selected ${symbol}` });
    setCurrentStep("asset-research");
  };
  
  const handleTrade = (action, symbol) => {
    if (tradeAmount <= 0) {
      toast.error("Invalid Amount", { description: "Please enter a valid amount to trade" });
      return;
    }
    
    const stock = selectedStock || stocks.find(s => s.symbol === symbol);
    
    if (!stock) {
      toast.error("Select a stock first", { description: "Please select a stock to trade" });
      return;
    }
    
    if (action === "Buy" && tradeAmount > availableBalance) {
      toast.error("Insufficient funds", { description: `You only have $${availableBalance.toFixed(2)} available` });
      return;
    }
    
    // Record the transaction
    const newTransaction = {
      date: new Date(),
      type: action.toUpperCase(),
      symbol: stock.symbol,
      price: stock.price,
      amount: tradeAmount
    };
    
    setTransactions([newTransaction, ...transactions]);
    
    // Update portfolio
    updatePortfolio(stock.symbol, action.toUpperCase(), tradeAmount, stock.price);
    
    // Show success message
    toast.success(`${action} Order Placed`, { 
      description: `You ${action === 'Buy' ? 'bought' : 'sold'} $${tradeAmount} of ${stock.symbol}`
    });
    
    // Show random financial quote
    setTradeQuote(getRandomQuote());
    setShowQuoteDialog(true);
    
    setCurrentStep("position-monitoring");
  };
  
  const handleAnalyzeMarket = (symbol = null) => {
    if (symbol) {
      setSelectedStock(stocks.find(s => s.symbol === symbol));
    }
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
                            onClick={() => handleAnalyzeMarket(stock.symbol)}
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
                        onClick={() => handleTrade("Buy", selectedStock ? selectedStock.symbol : null)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        disabled={!selectedStock}
                      >
                        Buy
                      </Button>
                      <Button 
                        onClick={() => handleTrade("Sell", selectedStock ? selectedStock.symbol : null)}
                        variant="destructive"
                        className="flex-1"
                        disabled={!selectedStock}
                      >
                        Sell
                      </Button>
                    </div>
                  </div>

                  <div className="mt-8">
                    <h3 className="font-medium mb-2">Selected Stock Details</h3>
                    {selectedStock ? (
                      <div className="p-4 bg-muted/30 rounded-md">
                        <div className="flex justify-between mb-2">
                          <div>
                            <p className="font-medium text-lg">{selectedStock.symbol}</p>
                            <p className="text-muted-foreground">{selectedStock.name}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-lg">${selectedStock.price}</p>
                            <p className={selectedStock.change >= 0 ? "text-green-600" : "text-red-600"}>
                              {selectedStock.change >= 0 ? "+" : ""}{selectedStock.change}%
                            </p>
                          </div>
                        </div>
                        <Button 
                          className="w-full mt-2 bg-finance-primary"
                          onClick={() => handleAnalyzeMarket(selectedStock.symbol)}
                        >
                          <TrendingUp className="h-4 w-4 mr-2" />
                          Analyze This Stock
                        </Button>
                      </div>
                    ) : (
                      <div className="p-4 bg-muted/30 rounded-md">
                        <p className="text-muted-foreground text-sm">Select a stock to see details</p>
                      </div>
                    )}
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
                  <span className="font-medium">${portfolio.cash.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Invested Amount</span>
                  <span className="font-medium">${portfolio.invested.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Profit/Loss</span>
                  <span className="text-green-600 font-medium">+$742.15 (13.7%)</span>
                </div>
                <div className="flex justify-center mt-4 gap-2">
                  <Button 
                    onClick={() => window.location.href = '/withdraw'}
                    className="flex items-center gap-2"
                  >
                    <Wallet className="h-4 w-4" />
                    <span>Withdraw</span>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => toast.info("Add Funds", { description: "Opening deposit funds page" })}
                    className="flex items-center gap-2"
                  >
                    <ArrowUp className="h-4 w-4" />
                    <span>Add Funds</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Recent Trades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {transactions.slice(0, 3).map((transaction, index) => (
                <div key={index} className="border-b pb-2">
                  <div className="flex justify-between">
                    <div>
                      <span className="font-medium">{transaction.symbol}</span>
                      <span className={`ml-2 text-xs ${
                        transaction.type === "BUY" 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      } px-2 py-0.5 rounded-full`}>
                        {transaction.type}
                      </span>
                    </div>
                    <span>${transaction.price}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {transaction.date.toLocaleString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true
                    })}
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={() => { window.location.href = '/transactions'; }}
              >
                View All Transactions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Market Analysis Dialog */}
      <Dialog open={showAnalysisModal} onOpenChange={setShowAnalysisModal}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>
              {selectedStock ? `${selectedStock.name} (${selectedStock.symbol}) Analysis` : 'Market Analysis'}
            </DialogTitle>
            <DialogDescription>
              {selectedStock 
                ? `Current price: $${selectedStock.price} (${selectedStock.change >= 0 ? '+' : ''}${selectedStock.change}%)`
                : 'Current market trends and technical indicators'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6">
            {selectedStock && STOCK_ANALYSES[selectedStock.symbol] ? (
              <>
                <div className="space-y-2">
                  <h4 className="font-medium">What's happening with this stock?</h4>
                  <p className="text-sm">{STOCK_ANALYSES[selectedStock.symbol].description}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Current Sentiment</h4>
                  <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${
                        STOCK_ANALYSES[selectedStock.symbol].sentiment === "very positive"
                          ? "bg-gradient-to-r from-green-400 to-green-600 w-[85%]" 
                          : STOCK_ANALYSES[selectedStock.symbol].sentiment === "positive"
                            ? "bg-gradient-to-r from-green-300 to-green-500 w-[65%]"
                            : STOCK_ANALYSES[selectedStock.symbol].sentiment === "mixed"
                              ? "bg-gradient-to-r from-yellow-300 to-yellow-500 w-[50%]"
                              : "bg-gradient-to-r from-red-300 to-red-500 w-[25%]"
                      }`}
                    ></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Bearish</span>
                    <span>Neutral</span>
                    <span>Bullish</span>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">Risk Level</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-muted/30 rounded-md">
                      <div className="text-sm text-muted-foreground">Volatility</div>
                      <div className="font-medium">
                        {STOCK_ANALYSES[selectedStock.symbol].trend === "volatile" || 
                         STOCK_ANALYSES[selectedStock.symbol].trend === "strongly rising" ? "High" : "Moderate"}
                      </div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-md">
                      <div className="text-sm text-muted-foreground">Overall Risk</div>
                      <div className="font-medium capitalize">
                        {STOCK_ANALYSES[selectedStock.symbol].riskLevel}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">What should you do?</h4>
                  <p className="text-sm">{STOCK_ANALYSES[selectedStock.symbol].recommendation}</p>
                </div>
              </>
            ) : (
              <>
                {/* General market analysis for when no specific stock is selected */}
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
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Trade Quote Dialog */}
      <Dialog open={showQuoteDialog} onOpenChange={setShowQuoteDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Trade Completed</DialogTitle>
          </DialogHeader>
          
          <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-md border border-blue-100">
            <p className="text-lg italic text-blue-800">{tradeQuote}</p>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={() => setShowQuoteDialog(false)}>
              Continue Trading
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockSimulator;
