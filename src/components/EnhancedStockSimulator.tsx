import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/sonner";
import { TrendingUp, TrendingDown, Search, Plus, Minus, BarChart3, ChartLine, HelpCircle } from "lucide-react";
import TransactionPin from "./TransactionPin";
import TradeChart from "./TradeChart";
import InvestmentSuggestions from "./InvestmentSuggestions";
import TradeSuggestions from "./TradeSuggestions";
import FinancialLiteracyGuide from "./FinancialLiteracyGuide";
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
  const [portfolio, setPortfolio] = useState({ cash: 1000, holdings: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showPinDialog, setShowPinDialog] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<any>(null);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null);
  const [showTradeChart, setShowTradeChart] = useState(false);
  const [userLevel] = useState<'basic' | 'premium'>('basic'); // Demo: user starts as basic
  const [showGuidance, setShowGuidance] = useState(false);
  const [currentGuidance, setCurrentGuidance] = useState('');

  // Mock stock data with realistic prices and movements
  const mockStocks: Stock[] = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 178.72,
      change: -3.41,
      industry: "Technology",
      currentPrice: 171.83,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 180 + Math.sin(i * 0.2) * 10 + Math.random() * 5
      }))
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corporation",
      price: 338.47,
      change: -6.94,
      industry: "Technology",
      currentPrice: 315,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 340 + Math.sin(i * 0.15) * 15 + Math.random() * 8
      }))
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 142.56,
      change: 2.18,
      industry: "Technology",
      currentPrice: 145.23,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 140 + Math.sin(i * 0.25) * 8 + Math.random() * 4
      }))
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: 248.98,
      change: 12.45,
      industry: "Automotive",
      currentPrice: 252.34,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 250 + Math.sin(i * 0.3) * 20 + Math.random() * 10
      }))
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      price: 151.94,
      change: -0.82,
      industry: "E-commerce",
      currentPrice: 149.67,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: 150 + Math.sin(i * 0.18) * 12 + Math.random() * 6
      }))
    }
  ];

  useEffect(() => {
    setStocks(mockStocks);
    
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

    // Update stock prices every 5 seconds
    const interval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => ({
          ...stock,
          currentPrice: Math.max(0, stock.currentPrice + (Math.random() - 0.5) * 2),
          change: stock.change + (Math.random() - 0.5) * 0.5
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const showStepByStepGuidance = (action: string, stock?: Stock) => {
    let guidance = '';
    
    switch (action) {
      case 'buy':
        guidance = `💡 Buying ${stock?.symbol}: This means you're purchasing shares of ${stock?.name}. You'll own a small piece of the company. If the stock price goes up, you make money. If it goes down, you lose money. Always consider the company's fundamentals before buying.`;
        break;
      case 'sell':
        guidance = `💡 Selling ${stock?.symbol}: This means you're selling your shares back to the market. You'll receive cash equal to the current stock price times the number of shares you own. This locks in your profit or loss.`;
        break;
      case 'portfolio':
        guidance = `💡 Your Portfolio: This shows all the stocks you currently own and their current value. The green/red colors show if you're making or losing money on each investment. Diversification across different companies reduces risk.`;
        break;
      case 'market':
        guidance = `💡 Stock Market: Prices change based on supply and demand. When more people want to buy a stock than sell it, the price goes up. When more people want to sell than buy, the price goes down. News, earnings, and economic factors all influence stock prices.`;
        break;
    }
    
    setCurrentGuidance(guidance);
    setShowGuidance(true);
  };

  const filteredStocks = stocks.filter(stock =>
    stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBuyStock = (stock: Stock) => {
    showStepByStepGuidance('buy', stock);
    
    const safeCurrentPrice = stock.currentPrice || stock.price || 0;
    const total = safeCurrentPrice * quantity;
    
    if (total > portfolio.cash) {
      toast("Insufficient Funds", {
        description: `You need $${total.toFixed(2)} but only have $${portfolio.cash.toFixed(2)}`,
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

    // Save transaction
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
      description: `${type === 'buy' ? 'Bought' : 'Sold'} ${shares} shares of ${stock.symbol} for $${total.toFixed(2)}`,
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
      price: basePrice + Math.sin(i * 0.3) * 3 + Math.random() * 2
    }));
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white">Enhanced Stock Trading</h2>
          <p className="text-slate-400">Trade with enhanced security and detailed analytics</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Available Cash</p>
          <p className="text-2xl font-bold text-green-400">${(portfolio.cash || 0).toFixed(2)}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => showStepByStepGuidance('portfolio')}
            className="mt-1 text-blue-400 border-blue-600"
          >
            <HelpCircle className="h-3 w-3 mr-1" />
            Learn About Trading
          </Button>
        </div>
      </div>

      {/* AI Trade Suggestions - New Feature */}
      <TradeSuggestions stocks={stocks} userLevel={userLevel} />

      {/* Financial Literacy Guide - New Feature */}
      <FinancialLiteracyGuide userLevel={userLevel} />

      {/* Investment Suggestions - Now prominently displayed */}
      <InvestmentSuggestions stocks={stocks} />

      {/* Recent Trades with Enhanced Chart Access */}
      {trades.length > 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Recent Trades & Analytics
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
                      <p className="text-slate-400 text-sm">{trade.shares} shares at ${(trade.price || 0).toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white">${(trade.total || 0).toFixed(2)}</p>
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
            <h3 className="text-white font-medium mb-2">No Trades Yet</h3>
            <p className="text-slate-400 text-sm mb-4">
              Start trading to see detailed charts and analytics of your positions
            </p>
            <p className="text-slate-500 text-xs">
              Charts will show profit/loss, price movements, and position details
            </p>
          </CardContent>
        </Card>
      )}

      {/* Stock Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search stocks by symbol or name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-800 border-slate-700 text-white"
        />
      </div>

      {/* Stock List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStocks.slice(0, userLevel === 'basic' ? 3 : filteredStocks.length).map((stock) => {
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
                    <p className="text-lg font-bold text-white">${safeCurrentPrice.toFixed(2)}</p>
                    <div className={`flex items-center text-sm ${safeChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {safeChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {safeChange >= 0 ? '+' : ''}{safeChange.toFixed(2)}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
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
                  Total: ${(safeCurrentPrice * quantity).toFixed(2)}
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
                    onClick={() => {
                      showStepByStepGuidance('sell', stock);
                      // Original sell logic here
                    }}
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

      {userLevel === 'basic' && filteredStocks.length > 3 && (
        <Card className="bg-purple-900/30 border-purple-600/50">
          <CardContent className="text-center py-6">
            <h3 className="text-purple-300 font-medium mb-2">More Stocks Available</h3>
            <p className="text-purple-400 text-sm mb-4">
              Basic users can view {filteredStocks.length - 3} additional stocks with Premium
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Upgrade to Premium
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Guidance Dialog */}
      <Dialog open={showGuidance} onOpenChange={setShowGuidance}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Step-by-Step Guidance</DialogTitle>
            <DialogDescription className="text-slate-300">
              Understanding your financial actions
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

      {/* Trade Chart Dialog - Enhanced */}
      <Dialog open={showTradeChart} onOpenChange={setShowTradeChart}>
        <DialogContent className="max-w-4xl bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Trade Analysis & Performance</DialogTitle>
            <DialogDescription className="text-slate-300">
              Detailed view of your trade performance, price movements, and position analytics
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
