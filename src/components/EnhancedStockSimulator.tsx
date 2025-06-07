import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { TrendingUp, TrendingDown, Search, Plus, Minus, BarChart3, ChartLine, HelpCircle, BarChart2 } from "lucide-react";
import TransactionPin from "./TransactionPin";
import TradeChart from "./TradeChart";
import InvestmentSuggestions from "./InvestmentSuggestions";
import FinancialLiteracyGuide from "./FinancialLiteracyGuide";
import StockAnalysis from "./StockAnalysis";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  industry: string;
  currentPrice: number;
  data: Array<{ date: string; price: number; }>;
}

interface Trade {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  total: number;
  timestamp: string;
  currentPrice?: number;
}

const EnhancedStockSimulator = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [portfolio, setPortfolio] = useState({ cash: 100000, holdings: [] }); // Start with ₦100,000
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<any>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [showTradeChart, setShowTradeChart] = useState(false);
  const [userLevel] = useState<'basic' | 'premium'>('basic');
  const [showGuidance, setShowGuidance] = useState(false);
  const [currentGuidance, setCurrentGuidance] = useState('');
  const [showStockAnalysis, setShowStockAnalysis] = useState(false);
  const [analysisStock, setAnalysisStock] = useState<Stock | null>(null);

  // Nigerian Stock Exchange companies with real market data (prices in NGN)
  const nigerianStocks: Stock[] = [
    {
      symbol: "DANGCEM",
      name: "Dangote Cement Plc",
      price: 285.50,
      change: 2.15,
      industry: "Building Materials",
      currentPrice: 287.65,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 285 + Math.sin(i * 0.2) * 15 + Math.random() * 8
      }))
    },
    {
      symbol: "GTCO",
      name: "Guaranty Trust Holding Company Plc",
      price: 32.40,
      change: -1.22,
      industry: "Banking",
      currentPrice: 31.80,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 32 + Math.sin(i * 0.3) * 3 + Math.random() * 2
      }))
    },
    {
      symbol: "MTNN",
      name: "MTN Nigeria Communications Plc",
      price: 178.20,
      change: 0.85,
      industry: "Telecommunications",
      currentPrice: 179.05,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 178 + Math.sin(i * 0.25) * 8 + Math.random() * 4
      }))
    },
    {
      symbol: "AIRTELAFRI",
      name: "Airtel Africa Plc",
      price: 1420.00,
      change: 3.45,
      industry: "Telecommunications",
      currentPrice: 1469.02,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 1420 + Math.sin(i * 0.15) * 50 + Math.random() * 25
      }))
    },
    {
      symbol: "BUACEMENT",
      name: "BUA Cement Plc",
      price: 102.30,
      change: -0.67,
      industry: "Building Materials",
      currentPrice: 101.62,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 102 + Math.sin(i * 0.35) * 6 + Math.random() * 3
      }))
    },
    {
      symbol: "ZENITHBANK",
      name: "Zenith Bank Plc",
      price: 28.15,
      change: 1.78,
      industry: "Banking",
      currentPrice: 28.65,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 28 + Math.sin(i * 0.4) * 2.5 + Math.random() * 1.5
      }))
    },
    {
      symbol: "SEPLAT",
      name: "Seplat Energy Plc",
      price: 3250.00,
      change: 4.20,
      industry: "Oil & Gas",
      currentPrice: 3386.50,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 3250 + Math.sin(i * 0.1) * 150 + Math.random() * 75
      }))
    },
    {
      symbol: "NESTLE",
      name: "Nestle Nigeria Plc",
      price: 1385.00,
      change: -1.15,
      industry: "Consumer Goods",
      currentPrice: 1369.08,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 1385 + Math.sin(i * 0.18) * 40 + Math.random() * 20
      }))
    },
    {
      symbol: "UBA",
      name: "United Bank for Africa Plc",
      price: 22.85,
      change: -0.88,
      industry: "Banking",
      currentPrice: 22.65,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 23 + Math.sin(i * 0.45) * 2 + Math.random() * 1
      }))
    },
    {
      symbol: "FLOURMILL",
      name: "Flour Mills of Nigeria Plc",
      price: 42.80,
      change: 1.65,
      industry: "Consumer Goods",
      currentPrice: 43.51,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 42.8 + Math.sin(i * 0.28) * 3 + Math.random() * 1.5
      }))
    }
  ];

  useEffect(() => {
    setStocks(nigerianStocks);
    
    // Load portfolio from localStorage
    const savedPortfolio = localStorage.getItem('portfolio');
    if (savedPortfolio) {
      setPortfolio(JSON.parse(savedPortfolio));
    }

    // Load trades from localStorage
    const savedTrades = localStorage.getItem('trades');
    if (savedTrades) {
      setTrades(JSON.parse(savedTrades));
    }

    // Show Nigerian market notification
    setTimeout(() => {
      toast("🇳🇬 Nigerian Stock Exchange", {
        description: "Trading Nigerian companies with real-time price simulation. All prices in Nigerian Naira (₦).",
        className: "bg-green-600 border-green-700 text-white",
        duration: 5000,
      });
    }, 1500);

    // Update stock prices every 4 seconds for realistic Nigerian market movement
    const interval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => ({
          ...stock,
          currentPrice: Math.max(1, stock.currentPrice + (Math.random() - 0.5) * (stock.currentPrice * 0.015)),
          change: stock.change + (Math.random() - 0.5) * 0.3
        }))
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const showStepByStepGuidance = (action: string, stock?: Stock) => {
    let guidance = '';
    
    switch (action) {
      case 'buy':
        guidance = `💡 Buying ${stock?.symbol} (${stock?.name}): You're purchasing shares of this Nigerian company. As a shareholder, you own a piece of the business. In the Nigerian market, banking and telecom stocks are popular choices. Always research the company's fundamentals and recent news.`;
        break;
      case 'sell':
        guidance = `💡 Selling ${stock?.symbol}: You're converting your shares back to cash at the current market price. This locks in your profit or loss. Nigerian stocks can be volatile, so timing your exit is important for maximizing returns.`;
        break;
      case 'portfolio':
        guidance = `💡 Your Nigerian Portfolio: This shows your holdings in Nigerian companies and their current NGN values. Diversifying across sectors (banking, telecom, consumer goods) helps reduce risk in the volatile Nigerian market.`;
        break;
      case 'market':
        guidance = `💡 Nigerian Stock Market: The NSE operates Monday-Friday, 10 AM - 2:30 PM WAT. Prices are influenced by oil prices, naira exchange rates, government policies, and global market sentiment. Banking stocks often lead market movements.`;
        break;
    }
    
    setCurrentGuidance(guidance);
    setShowGuidance(true);
  };

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAnalyseStock = (stock: Stock) => {
    setAnalysisStock(stock);
    setShowStockAnalysis(true);
    
    toast("📊 Stock Analysis Loading", {
      description: `Analyzing ${stock.symbol} trends, charts, and recommendations...`,
      className: "bg-blue-600 border-blue-700 text-white",
      duration: 3000,
    });
  };

  const handleBuyStock = (stock: Stock) => {
    showStepByStepGuidance('buy', stock);
    
    const safeCurrentPrice = stock.currentPrice || stock.price || 0;
    const total = safeCurrentPrice * quantity;
    
    if (total > portfolio.cash) {
      toast("Insufficient Funds", {
        description: `You need ₦${total.toLocaleString()} but only have ₦${portfolio.cash.toLocaleString()}`,
        className: "bg-red-600 border-red-700 text-white",
      });
      return;
    }

    setPendingTransaction({
      type: 'buy',
      stock,
      quantity,
      total
    });
    setShowPinDialog(true);
  };

  const handleSellStock = (stock: Stock) => {
    const holding = portfolio.holdings.find((h: any) => h.symbol === stock.symbol);
    
    if (!holding || holding.shares < quantity) {
      toast("Insufficient Shares", {
        description: `You don't have enough ${stock.symbol} shares to sell`,
        className: "bg-red-600 border-red-700 text-white",
      });
      return;
    }

    const safeCurrentPrice = stock.currentPrice || stock.price || 0;
    const total = safeCurrentPrice * quantity;
    
    setPendingTransaction({
      type: 'sell',
      stock,
      quantity,
      total
    });
    setShowPinDialog(true);
  };

  const executeTransaction = () => {
    if (!pendingTransaction) return;

    const { type, stock, quantity: shares, total } = pendingTransaction;
    const safeCurrentPrice = stock.currentPrice || stock.price || 0;
    
    const newTrade: Trade = {
      id: Date.now().toString(),
      symbol: stock.symbol,
      type,
      shares,
      price: safeCurrentPrice,
      total,
      timestamp: new Date().toISOString(),
      currentPrice: safeCurrentPrice
    };

    // Update trades
    const updatedTrades = [newTrade, ...trades];
    setTrades(updatedTrades);
    localStorage.setItem('trades', JSON.stringify(updatedTrades));

    // Update portfolio
    let updatedPortfolio = { ...portfolio };
    
    if (type === 'buy') {
      updatedPortfolio.cash -= total;
      const existingHolding = updatedPortfolio.holdings.find((h: any) => h.symbol === stock.symbol);
      
      if (existingHolding) {
        existingHolding.shares += shares;
        existingHolding.avgCost = ((existingHolding.avgCost * existingHolding.shares) + total) / (existingHolding.shares + shares);
      } else {
        updatedPortfolio.holdings.push({
          symbol: stock.symbol,
          name: stock.name,
          shares,
          avgCost: safeCurrentPrice
        });
      }
    } else {
      updatedPortfolio.cash += total;
      const holding = updatedPortfolio.holdings.find((h: any) => h.symbol === stock.symbol);
      if (holding) {
        holding.shares -= shares;
        if (holding.shares <= 0) {
          updatedPortfolio.holdings = updatedPortfolio.holdings.filter((h: any) => h.symbol !== stock.symbol);
        }
      }
    }

    setPortfolio(updatedPortfolio);
    localStorage.setItem('portfolio', JSON.stringify(updatedPortfolio));

    // Save transaction (amounts already in NGN)
    const transaction = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: type === 'buy' ? 'BUY' : 'SELL',
      symbol: stock.symbol,
      shares,
      price: safeCurrentPrice,
      total: type === 'buy' ? -total : total,
      description: `${type.toUpperCase()} ${shares} shares of ${stock.symbol}`
    };

    const existingTransactions = localStorage.getItem('transactions');
    const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
    transactions.unshift(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    toast(`${type === 'buy' ? 'Purchase' : 'Sale'} Successful`, {
      description: `${type === 'buy' ? 'Bought' : 'Sold'} ${shares} shares of ${stock.symbol} for ₦${total.toLocaleString()}`,
      className: "bg-green-600 border-green-700 text-white",
    });

    setShowPinDialog(false);
    setPendingTransaction(null);
    setQuantity(1);
  };

  const viewTradeChart = (trade: Trade) => {
    const stock = stocks.find(s => s.symbol === trade.symbol);
    if (stock) {
      setSelectedTrade({
        ...trade,
        currentPrice: stock.currentPrice || stock.price || 0
      });
      setShowTradeChart(true);
    }
  };

  const generatePriceHistory = (stock: Stock) => {
    const basePrice = stock.currentPrice || stock.price || 100;
    return Array.from({ length: 20 }, (_, i) => ({
      time: new Date(Date.now() - (19 - i) * 60 * 60 * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      price: basePrice + Math.sin(i * 0.3) * (basePrice * 0.02) + Math.random() * (basePrice * 0.01)
    }));
  };

  const handleTradeFromAnalysis = (symbol: string, action: 'buy' | 'sell') => {
    const stock = stocks.find(s => s.symbol === symbol);
    if (stock) {
      setShowStockAnalysis(false);
      if (action === 'buy') {
        handleBuyStock(stock);
      } else {
        handleSellStock(stock);
      }
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Nigerian Stock Exchange Trading</h2>
          <p className="text-slate-400">Trade Nigerian companies with enhanced security and real-time data</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Available Cash</p>
          <p className="text-2xl font-bold text-green-400">₦{(portfolio.cash || 0).toLocaleString()}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => showStepByStepGuidance('portfolio')}
            className="mt-1 text-blue-400 border-blue-600"
          >
            <HelpCircle className="h-3 w-3 mr-1" />
            Learn About NSE Trading
          </Button>
        </div>
      </div>

      {/* Financial Literacy Guide */}
      <FinancialLiteracyGuide userLevel={userLevel} />

      {/* Investment Suggestions for Nigerian Market */}
      <InvestmentSuggestions stocks={stocks} />

      {/* Recent Trades with Enhanced Chart Access */}
      {trades.length > 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Recent Nigerian Stock Trades
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  showStepByStepGuidance('market');
                  if (trades.length > 0) {
                    const latestTrade = trades[0];
                    const stock = stocks.find(s => s.symbol === latestTrade.symbol);
                    if (stock) {
                      setSelectedTrade({
                        ...latestTrade,
                        currentPrice: stock.currentPrice || stock.price || 0
                      });
                      setShowTradeChart(true);
                    }
                  }
                }}
                className="text-blue-400 hover:text-blue-300 border-blue-600"
              >
                <ChartLine className="h-4 w-4 mr-1" />
                View Latest Chart
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {trades.slice(0, 3).map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs ${
                      trade.type === 'buy' ? 'bg-green-600' : 'bg-red-600'
                    }`}>
                      {trade.type.toUpperCase()}
                    </span>
                    <div>
                      <p className="text-white font-medium">{trade.symbol}</p>
                      <p className="text-slate-400 text-sm">{trade.shares} shares at ₦{(trade.price || 0).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white">₦{(trade.total || 0).toLocaleString()}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => viewTradeChart(trade)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <ChartLine className="h-3 w-3 mr-1" />
                      View Chart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="text-center py-8">
            <ChartLine className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">No Nigerian Stock Trades Yet</h3>
            <p className="text-slate-400 text-sm mb-4">
              Start trading Nigerian companies to see detailed charts and analytics
            </p>
            <p className="text-slate-500 text-xs">
              Charts will show profit/loss, price movements, and position details for NSE stocks
            </p>
          </CardContent>
        </Card>
      )}

      {/* Nigerian Stock Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search Nigerian stocks by symbol or company name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-800 border-slate-700 text-white"
        />
      </div>

      {/* Nigerian Stock List with Analyse Stock Button */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStocks.slice(0, userLevel === 'basic' ? 6 : filteredStocks.length).map((stock) => {
          const safeCurrentPrice = stock.currentPrice || stock.price || 0;
          const safeChange = stock.change || 0;
          
          return (
            <Card key={stock.symbol} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-white">{stock.symbol}</CardTitle>
                    <p className="text-sm text-slate-400">{stock.name}</p>
                    <p className="text-xs text-slate-500">{stock.industry}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">₦{safeCurrentPrice.toLocaleString()}</p>
                    <div className={`flex items-center text-sm ${safeChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {safeChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {safeChange >= 0 ? '+' : ''}{safeChange.toFixed(2)}%
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Analyse Stock Button */}
                <Button
                  onClick={() => handleAnalyseStock(stock)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Analyse Stock
                </Button>
                
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 p-0"
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <Input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-center bg-slate-700 border-slate-600 text-white"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 p-0"
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="text-center text-sm text-slate-400">
                  Total: ₦{(safeCurrentPrice * quantity).toLocaleString()}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    onClick={() => handleBuyStock(stock)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    size="sm"
                  >
                    Buy
                  </Button>
                  <Button
                    onClick={() => handleSellStock(stock)}
                    variant="outline"
                    className="flex-1 border-red-600 text-red-400 hover:bg-red-600/10"
                    size="sm"
                  >
                    Sell
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {userLevel === 'basic' && filteredStocks.length > 6 && (
        <Card className="bg-purple-900/30 border-purple-600/50">
          <CardContent className="text-center py-6">
            <h3 className="text-purple-300 font-medium mb-2">More Nigerian Stocks Available</h3>
            <p className="text-purple-400 text-sm mb-4">
              Basic users can view {filteredStocks.length - 6} additional Nigerian companies with Premium
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Stock Analysis Dialog */}
      <Dialog open={showStockAnalysis} onOpenChange={setShowStockAnalysis}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>
              {analysisStock ? `${analysisStock.symbol} - Complete Stock Analysis` : 'Stock Analysis'}
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              Comprehensive analysis including trends, charts, and financial recommendations
            </DialogDescription>
          </DialogHeader>
          {analysisStock && (
            <StockAnalysis
              symbol={analysisStock.symbol}
              name={analysisStock.name}
              currentPrice={analysisStock.currentPrice || analysisStock.price}
              shares={portfolio.holdings.find((h: any) => h.symbol === analysisStock.symbol)?.shares || 0}
              avgCost={portfolio.holdings.find((h: any) => h.symbol === analysisStock.symbol)?.avgCost || analysisStock.currentPrice || analysisStock.price}
              industry={analysisStock.industry}
              onTrade={handleTradeFromAnalysis}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Guidance Dialog */}
      <Dialog open={showGuidance} onOpenChange={setShowGuidance}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Nigerian Market Guidance</DialogTitle>
            <DialogDescription className="text-slate-300">
              Understanding Nigerian stock market investments
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-slate-700 rounded-lg">
            <p className="text-slate-200 leading-relaxed">{currentGuidance}</p>
          </div>
          <Button onClick={() => setShowGuidance(false)} className="bg-blue-600 hover:bg-blue-700">
            Got it!
          </Button>
        </DialogContent>
      </Dialog>

      {/* Transaction PIN Dialog */}
      {pendingTransaction && (
        <TransactionPin
          isOpen={showPinDialog}
          onClose={() => {
            setShowPinDialog(false);
            setPendingTransaction(null);
          }}
          onSuccess={executeTransaction}
          transactionType={pendingTransaction.type}
          stockSymbol={pendingTransaction.stock.symbol}
          amount={pendingTransaction.total}
          shares={pendingTransaction.quantity}
          price={pendingTransaction.stock.currentPrice || pendingTransaction.stock.price || 0}
        />
      )}

      {/* Trade Chart Dialog */}
      <Dialog open={showTradeChart} onOpenChange={setShowTradeChart}>
        <DialogContent className="max-w-4xl bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Nigerian Stock Trade Analysis</DialogTitle>
            <DialogDescription className="text-slate-300">
              Detailed view of your Nigerian stock performance and price movements
            </DialogDescription>
          </DialogHeader>
          {selectedTrade && (
            <TradeChart
              trade={selectedTrade}
              priceHistory={generatePriceHistory(stocks.find(s => s.symbol === selectedTrade.symbol)!)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EnhancedStockSimulator;
