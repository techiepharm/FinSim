
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { TrendingUp, TrendingDown, AlertCircle, PieChart, Search, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/sonner";

// Generate realistic looking but fake stock data
const generateStockData = (symbol, basePrice) => {
  const data = [];
  let price = basePrice;
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(now.getDate() - i);
    
    // Random price change within a reasonable range
    const change = (Math.random() - 0.48) * (basePrice * 0.03);
    price += change;
    if (price < basePrice * 0.7) price = basePrice * 0.7;
    if (price > basePrice * 1.3) price = basePrice * 1.3;
    
    data.push({
      date: date.toLocaleDateString(),
      price: parseFloat(price.toFixed(2)),
    });
  }
  
  return data;
};

// Initial stock definitions with proper typing
const initialStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 178.72, change: 1.25, industry: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 338.47, change: -0.38, industry: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 134.99, change: 0.73, industry: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.29, change: 2.14, industry: 'E-Commerce' },
  { symbol: 'TSLA', name: 'Tesla, Inc.', price: 237.49, change: -3.25, industry: 'Automotive' },
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', price: 192.70, change: 0.45, industry: 'Financial Services' },
  { symbol: 'JNJ', name: 'Johnson & Johnson', price: 152.36, change: -0.68, industry: 'Healthcare' },
  { symbol: 'V', name: 'Visa Inc.', price: 272.46, change: 1.02, industry: 'Financial Services' },
  { symbol: 'PG', name: 'Procter & Gamble Co.', price: 162.95, change: 0.32, industry: 'Consumer Goods' },
  { symbol: 'DIS', name: 'The Walt Disney Company', price: 112.73, change: 1.85, industry: 'Entertainment' },
];

// Function to update stock price with realistic movement
const updateStockPrice = (stock) => {
  const volatility = 0.015; // 1.5% volatility
  const randomChange = (Math.random() - 0.5) * volatility;
  const newPrice = stock.currentPrice * (1 + randomChange);
  const priceChange = ((newPrice - stock.price) / stock.price) * 100;
  
  return {
    ...stock,
    currentPrice: Math.max(0.01, parseFloat(newPrice.toFixed(2))),
    change: parseFloat(priceChange.toFixed(2))
  };
};

// Function to save transaction and update portfolio
const processTransaction = (symbol, shares, price, type) => {
  try {
    // Get existing portfolio
    const portfolioData = localStorage.getItem('portfolio');
    const portfolio = portfolioData ? JSON.parse(portfolioData) : { cash: 1000, holdings: [] };
    
    const transactionAmount = shares * price;
    
    // Create transaction record
    const transaction = {
      id: Date.now(),
      date: new Date().toISOString(),
      type,
      symbol,
      shares,
      price,
      amount: type === 'BUY' ? -transactionAmount : transactionAmount
    };
    
    // Update portfolio based on transaction type
    if (type === 'BUY') {
      if (portfolio.cash < transactionAmount) {
        return { success: false, message: 'Insufficient funds' };
      }
      
      portfolio.cash -= transactionAmount;
      
      // Update holdings
      const holdingIndex = portfolio.holdings.findIndex(h => h.symbol === symbol);
      if (holdingIndex >= 0) {
        const existing = portfolio.holdings[holdingIndex];
        const totalShares = existing.shares + shares;
        const totalValue = (existing.shares * existing.averagePrice) + (shares * price);
        portfolio.holdings[holdingIndex] = {
          symbol,
          shares: totalShares,
          averagePrice: totalValue / totalShares
        };
      } else {
        portfolio.holdings.push({ symbol, shares, averagePrice: price });
      }
    } else if (type === 'SELL') {
      const holding = portfolio.holdings.find(h => h.symbol === symbol);
      if (!holding || holding.shares < shares) {
        return { success: false, message: 'Insufficient shares' };
      }
      
      portfolio.cash += transactionAmount;
      
      // Update holdings
      const holdingIndex = portfolio.holdings.findIndex(h => h.symbol === symbol);
      portfolio.holdings[holdingIndex].shares -= shares;
      
      // Remove holding if no shares left
      if (portfolio.holdings[holdingIndex].shares <= 0) {
        portfolio.holdings.splice(holdingIndex, 1);
      }
    }
    
    // Save updated portfolio
    localStorage.setItem('portfolio', JSON.stringify(portfolio));
    
    // Save transaction
    const existingTransactions = localStorage.getItem('transactions');
    const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
    transactions.unshift(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    
    // Trigger storage event for other components
    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('storageUpdate'));
    
    return { success: true, portfolio, transaction };
  } catch (error) {
    console.error('Transaction processing error:', error);
    return { success: false, message: 'Transaction failed' };
  }
};

// Main component
const StockSimulator = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [portfolio, setPortfolio] = useState({ cash: 1000, holdings: [] });
  const [shares, setShares] = useState(1);
  const [showReceipt, setShowReceipt] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [marketAnalysis, setMarketAnalysis] = useState(false);
  const [stocks, setStocks] = useState([]);
  
  // Initialize stocks with current prices and data
  useEffect(() => {
    const initializedStocks = initialStocks.map(stock => ({
      ...stock,
      data: generateStockData(stock.symbol, stock.price),
      currentPrice: stock.price
    }));
    setStocks(initializedStocks);
  }, []);
  
  // Update stock prices every 5 seconds for realistic movement
  useEffect(() => {
    if (stocks.length === 0) return;
    
    const interval = setInterval(() => {
      setStocks(prevStocks => prevStocks.map(updateStockPrice));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [stocks.length]);
  
  // Load portfolio on mount
  useEffect(() => {
    try {
      const portfolioData = localStorage.getItem('portfolio');
      if (portfolioData) {
        setPortfolio(JSON.parse(portfolioData));
      }
    } catch (e) {
      console.error("Error loading portfolio:", e);
    }
    
    // Show demo notification
    setTimeout(() => {
      toast("🎯 Demo Trading Account", {
        description: "You're using a demo account with virtual money. Perfect for learning!",
        className: "bg-blue-600 border-blue-700 text-white",
        duration: 6000,
      });
    }, 2000);
  }, []);
  
  const filteredStocks = stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) || 
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleBuy = () => {
    if (!selectedStock || shares < 1) return;
    
    const result = processTransaction(selectedStock.symbol, shares, selectedStock.currentPrice, 'BUY');
    
    if (result.success) {
      setPortfolio(result.portfolio);
      
      const newReceipt = {
        transactionId: result.transaction.id,
        date: new Date(result.transaction.date).toLocaleString(),
        type: result.transaction.type,
        symbol: result.transaction.symbol,
        shares: result.transaction.shares,
        price: result.transaction.price,
        total: Math.abs(result.transaction.amount),
        fee: 0.00
      };
      
      setReceipt(newReceipt);
      setShowReceipt(true);
      
      toast("✅ Purchase Successful", {
        description: `Bought ${shares} shares of ${selectedStock.symbol} for $${(selectedStock.currentPrice * shares).toFixed(2)}`,
        className: "bg-green-600 border-green-700 text-white",
        duration: 4000,
      });
    } else {
      toast("❌ Purchase Failed", {
        description: result.message,
        className: "bg-red-600 border-red-700 text-white",
        duration: 4000,
      });
    }
  };
  
  const handleSell = () => {
    if (!selectedStock || shares < 1) return;
    
    const result = processTransaction(selectedStock.symbol, shares, selectedStock.currentPrice, 'SELL');
    
    if (result.success) {
      setPortfolio(result.portfolio);
      
      const newReceipt = {
        transactionId: result.transaction.id,
        date: new Date(result.transaction.date).toLocaleString(),
        type: result.transaction.type,
        symbol: result.transaction.symbol,
        shares: result.transaction.shares,
        price: result.transaction.price,
        total: Math.abs(result.transaction.amount),
        fee: 0.00
      };
      
      setReceipt(newReceipt);
      setShowReceipt(true);
      
      toast("✅ Sale Successful", {
        description: `Sold ${shares} shares of ${selectedStock.symbol} for $${(selectedStock.currentPrice * shares).toFixed(2)}`,
        className: "bg-green-600 border-green-700 text-white",
        duration: 4000,
      });
    } else {
      toast("❌ Sale Failed", {
        description: result.message,
        className: "bg-red-600 border-red-700 text-white",
        duration: 4000,
      });
    }
  };
  
  const showAnalyzeMarket = () => {
    setMarketAnalysis(true);
  };
  
  const showStockAnalysis = (stock) => {
    setSelectedStock(stock);
    setShowAnalysis(true);
  };
  
  // Analysis data
  const getStockAnalysis = (stock) => {
    const recentData = stock.data.slice(-10);
    const priceChange = recentData[recentData.length - 1].price - recentData[0].price;
    const percentChange = (priceChange / recentData[0].price) * 100;
    
    let recommendation, reasoning;
    
    if (percentChange > 5) {
      recommendation = "Strong Buy";
      reasoning = "The stock has shown significant momentum over the past 10 days with steady price increases.";
    } else if (percentChange > 2) {
      recommendation = "Buy";
      reasoning = "The stock has positive momentum and could present a good entry point.";
    } else if (percentChange >= -2 && percentChange <= 2) {
      recommendation = "Hold";
      reasoning = "The stock is stable with minimal price movement. Wait for clearer signals.";
    } else if (percentChange > -5) {
      recommendation = "Consider Selling";
      reasoning = "The stock shows slight downward momentum. Monitor closely for further weakness.";
    } else {
      recommendation = "Sell";
      reasoning = "The stock has shown significant weakness over the past 10 days. Consider cutting losses.";
    }
    
    return {
      recent: {
        change: priceChange.toFixed(2),
        percentChange: percentChange.toFixed(2)
      },
      volume: "High",
      volatility: Math.abs(percentChange) > 5 ? "High" : Math.abs(percentChange) > 2 ? "Medium" : "Low",
      support: (stock.currentPrice * 0.95).toFixed(2),
      resistance: (stock.currentPrice * 1.05).toFixed(2),
      recommendation,
      reasoning
    };
  };
  
  // Market analysis data
  const getMarketAnalysis = () => {
    const gainers = stocks.filter(s => Number(s.change) > 0);
    const losers = stocks.filter(s => Number(s.change) < 0);
    
    return {
      overview: "The market is showing mixed signals with tech stocks leading gains while healthcare continues to lag.",
      momentum: "Positive",
      gainers: gainers.length,
      losers: losers.length,
      strongestSector: "Technology",
      weakestSector: "Healthcare",
      recommendation: "Consider increasing technology sector exposure while maintaining a diversified portfolio."
    };
  };
  
  return (
    <div className="container mx-auto p-4 max-h-screen overflow-y-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-white">Stock Trading Simulator</h2>
          <p className="text-slate-400">🎯 Demo Account - Practice trading with virtual cash</p>
        </div>
        
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Button 
            className="bg-slate-700 hover:bg-slate-600" 
            onClick={showAnalyzeMarket}
          >
            <PieChart className="mr-2 h-4 w-4" />
            Analyze Market
          </Button>
          <Button className="bg-green-600 hover:bg-green-700" onClick={() => window.location.href = '/'}>
            <PieChart className="mr-2 h-4 w-4" />
            View Dashboard
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">Stock Market</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-500" />
                <Input 
                  placeholder="Search stocks..."
                  className="pl-8 bg-slate-700 border-slate-600 text-white"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="overflow-y-auto max-h-[60vh]">
            <div className="divide-y divide-slate-700">
              {filteredStocks.map((stock) => (
                <div 
                  key={stock.symbol} 
                  className="py-3 flex flex-col md:flex-row justify-between hover:bg-slate-700/30 cursor-pointer rounded-md p-2"
                  onClick={() => setSelectedStock(stock)}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center mb-2 md:mb-0">
                    <div className="font-medium text-white mr-4">{stock.symbol}</div>
                    <div className="text-slate-400">{stock.name}</div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div>
                      <div className="text-white font-medium">${stock.currentPrice.toFixed(2)}</div>
                      <div className={`text-xs flex items-center ${Number(stock.change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {Number(stock.change) >= 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                        {Number(stock.change) >= 0 ? '+' : ''}{Number(stock.change).toFixed(2)}%
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="border-green-600 text-green-400 hover:bg-green-800/20"
                      onClick={(e) => {
                        e.stopPropagation();
                        showStockAnalysis(stock);
                      }}
                    >
                      Analyze Stock
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Demo Account Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white mb-4">${portfolio.cash.toFixed(2)}</div>
              <Button 
                variant="outline" 
                className="w-full border-green-600 text-green-400 hover:bg-green-800/20"
                onClick={() => window.location.href = '/add-funds'}
              >
                Add Demo Funds
              </Button>
            </CardContent>
          </Card>
          
          {selectedStock && (
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">{selectedStock.symbol}: {selectedStock.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-2xl font-bold text-white">${selectedStock.currentPrice.toFixed(2)}</div>
                  <div className={`flex items-center ${Number(selectedStock.change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {Number(selectedStock.change) >= 0 ? <TrendingUp className="mr-1 h-4 w-4" /> : <TrendingDown className="mr-1 h-4 w-4" />}
                    {Number(selectedStock.change) >= 0 ? '+' : ''}{Number(selectedStock.change).toFixed(2)}%
                  </div>
                </div>
                
                <div className="h-32">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={selectedStock.data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="date" tick={{ fill: '#9ca3af' }} stroke="#4b5563" />
                      <YAxis tick={{ fill: '#9ca3af' }} stroke="#4b5563" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }}
                        labelStyle={{ color: '#f9fafb' }}
                      />
                      <Area type="monotone" dataKey="price" stroke="#10b981" fill="url(#colorPrice)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <label className="text-sm text-slate-400 mb-1 block">Shares</label>
                    <Input 
                      type="number" 
                      min="1" 
                      value={shares} 
                      onChange={e => setShares(Math.max(1, parseInt(e.target.value) || 1))}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-sm text-slate-400 mb-1 block">Total</label>
                    <div className="bg-slate-700 border border-slate-600 rounded-md h-10 flex items-center px-3 text-white">
                      ${(selectedStock.currentPrice * shares).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button 
                    className="bg-green-600 hover:bg-green-700" 
                    onClick={handleBuy}
                    disabled={!selectedStock || shares < 1}
                  >
                    Buy
                  </Button>
                  <Button 
                    className="bg-red-600 hover:bg-red-700"
                    onClick={handleSell}
                    disabled={!selectedStock || shares < 1}
                  >
                    Sell
                  </Button>
                </div>
                
                <Button
                  variant="outline"
                  className="w-full border-blue-600 text-blue-400 hover:bg-blue-800/20"
                  onClick={() => setShowAnalysis(true)}
                >
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Detailed Analysis
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      
      {/* Receipt Dialog */}
      <Dialog open={showReceipt} onOpenChange={setShowReceipt}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Transaction Receipt</DialogTitle>
            <DialogDescription className="text-slate-300">
              Transaction #{receipt?.transactionId}
            </DialogDescription>
          </DialogHeader>
          
          {receipt && (
            <div className="space-y-4">
              <div className="bg-slate-700 rounded-md p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="text-white">{receipt.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Type:</span>
                  <span className={`font-medium ${receipt.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                    {receipt.type}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Symbol:</span>
                  <span className="text-white">{receipt.symbol}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shares:</span>
                  <span className="text-white">{receipt.shares}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Price per share:</span>
                  <span className="text-white">${receipt.price.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-600 pt-2 mt-2"></div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction Fee:</span>
                  <span className="text-white">${receipt.fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400 font-bold">Total:</span>
                  <span className="text-white font-bold">${receipt.total.toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-600 pt-2 mt-2"></div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Updated Balance:</span>
                  <span className="text-white font-bold">${portfolio.cash.toFixed(2)}</span>
                </div>
              </div>
              
              <Button className="w-full bg-green-600" onClick={() => setShowReceipt(false)}>
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
      
      {/* Stock Analysis Dialog */}
      <Dialog open={showAnalysis} onOpenChange={setShowAnalysis}>
        {selectedStock && (
          <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                {selectedStock.symbol}: {selectedStock.name} Analysis
              </DialogTitle>
              <DialogDescription className="text-slate-300">
                Detailed technical and fundamental analysis
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-white mb-2">Price Performance</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={selectedStock.data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                        <defs>
                          <linearGradient id="colorAnalysis" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                        <XAxis dataKey="date" tick={{ fill: '#9ca3af' }} stroke="#4b5563" />
                        <YAxis tick={{ fill: '#9ca3af' }} stroke="#4b5563" />
                        <Tooltip
                          contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }}
                          labelStyle={{ color: '#f9fafb' }}
                        />
                        <Area type="monotone" dataKey="price" stroke="#10b981" fill="url(#colorAnalysis)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium text-white mb-2">Key Statistics</h3>
                  {(() => {
                    const analysis = getStockAnalysis(selectedStock);
                    return (
                      <div className="bg-slate-700 rounded-md p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Current Price:</span>
                          <span className="text-white">${selectedStock.currentPrice.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">10-Day Change:</span>
                          <span className={Number(analysis.recent.percentChange) >= 0 ? 'text-green-400' : 'text-red-400'}>
                            {Number(analysis.recent.percentChange) >= 0 ? '+' : ''}{analysis.recent.percentChange}% (${analysis.recent.change})
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Volume:</span>
                          <span className="text-white">{analysis.volume}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Volatility:</span>
                          <span className="text-white">{analysis.volatility}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Support Level:</span>
                          <span className="text-white">${analysis.support}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Resistance Level:</span>
                          <span className="text-white">${analysis.resistance}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Industry:</span>
                          <span className="text-white">{selectedStock.industry}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
              
              {(() => {
                const analysis = getStockAnalysis(selectedStock);
                return (
                  <div className="bg-slate-700 rounded-md p-4">
                    <h3 className="font-medium text-white mb-2">Recommendation</h3>
                    <div className={`inline-block px-3 py-1 rounded-full mb-3 text-sm font-medium 
                      ${analysis.recommendation === 'Strong Buy' ? 'bg-green-900/60 text-green-400' :
                        analysis.recommendation === 'Buy' ? 'bg-emerald-900/60 text-emerald-400' :
                        analysis.recommendation === 'Hold' ? 'bg-blue-900/60 text-blue-400' :
                        analysis.recommendation === 'Consider Selling' ? 'bg-orange-900/60 text-orange-400' :
                        'bg-red-900/60 text-red-400'}`}>
                      {analysis.recommendation}
                    </div>
                    <p className="text-slate-300">{analysis.reasoning}</p>
                  </div>
                );
              })()}
            </div>
            
            <DialogFooter>
              <Button 
                variant="outline" 
                className="border-slate-600 text-slate-300 hover:bg-slate-700"
                onClick={() => setShowAnalysis(false)}
              >
                Close
              </Button>
              <Button 
                className="bg-green-600 hover:bg-green-700" 
                onClick={() => {
                  setShowAnalysis(false);
                  setShares(1);
                }}
              >
                Trade Now
              </Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
      
      {/* Market Analysis Dialog */}
      <Dialog open={marketAnalysis} onOpenChange={setMarketAnalysis}>
        <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-white">Market Analysis</DialogTitle>
            <DialogDescription className="text-slate-300">
              Current market conditions and sector performance
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6 max-h-[60vh] overflow-y-auto">
            <div>
              <h3 className="font-medium text-white mb-3">Market Overview</h3>
              <div className="bg-slate-700 rounded-md p-4">
                <p className="text-slate-300">{getMarketAnalysis().overview}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-white mb-2">Sector Performance</h3>
                <div className="bg-slate-700 rounded-md p-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Technology</span>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">+2.4%</span>
                      <Progress value={85} className="h-2 w-24" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Financial Services</span>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">+1.1%</span>
                      <Progress value={65} className="h-2 w-24" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Consumer Goods</span>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">+0.6%</span>
                      <Progress value={55} className="h-2 w-24" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Entertainment</span>
                    <div className="flex items-center">
                      <span className="text-green-400 mr-2">+0.2%</span>
                      <Progress value={52} className="h-2 w-24" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Automotive</span>
                    <div className="flex items-center">
                      <span className="text-red-400 mr-2">-0.8%</span>
                      <Progress value={35} className="h-2 w-24" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Healthcare</span>
                    <div className="flex items-center">
                      <span className="text-red-400 mr-2">-1.2%</span>
                      <Progress value={25} className="h-2 w-24" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-white mb-2">Key Metrics</h3>
                <div className="bg-slate-700 rounded-md p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Market Momentum:</span>
                    <span className="text-green-400">{getMarketAnalysis().momentum}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Gainers vs Losers:</span>
                    <span className="text-white">{getMarketAnalysis().gainers} / {getMarketAnalysis().losers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Strongest Sector:</span>
                    <span className="text-green-400">{getMarketAnalysis().strongestSector}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Weakest Sector:</span>
                    <span className="text-red-400">{getMarketAnalysis().weakestSector}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Market Volatility:</span>
                    <span className="text-white">Medium</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="font-medium text-white mb-2">Trending Stocks</h3>
              <div className="bg-slate-700 rounded-md divide-y divide-slate-600">
                {stocks.filter(s => Math.abs(Number(s.change)) > 1).slice(0, 4).map(stock => (
                  <div key={stock.symbol} className="p-3 flex justify-between items-center">
                    <div>
                      <div className="font-medium text-white">{stock.symbol}: {stock.name}</div>
                      <div className="text-sm text-slate-400">{stock.industry}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white">${stock.currentPrice.toFixed(2)}</div>
                      <div className={`text-sm ${Number(stock.change) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {Number(stock.change) >= 0 ? '+' : ''}{Number(stock.change).toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-900 border border-green-900/50 rounded-md p-4">
              <h3 className="font-medium text-white flex items-center mb-2">
                <AlertCircle className="h-4 w-4 text-green-400 mr-2" />
                Recommendation
              </h3>
              <p className="text-slate-300">{getMarketAnalysis().recommendation}</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              className="bg-green-600 hover:bg-green-700" 
              onClick={() => setMarketAnalysis(false)}
            >
              Continue Trading
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StockSimulator;
