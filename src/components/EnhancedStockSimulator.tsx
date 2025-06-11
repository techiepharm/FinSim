
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
import { expandedNigerianStocks, getRandomStocks, searchStocks } from '@/data/expandedNigerianStocks';
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
  sector: string;
  beta: number;
  pe: number;
  dividend: number;
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
  const [userLevel] = useState<'basic' | 'premium'>('premium'); // Enhanced to premium
  const [showGuidance, setShowGuidance] = useState(false);
  const [currentGuidance, setCurrentGuidance] = useState('');
  const [showStockAnalysis, setShowStockAnalysis] = useState(false);
  const [analysisStock, setAnalysisStock] = useState<Stock | null>(null);

  useEffect(() => {
    // Convert expanded Nigerian stocks to our format
    const convertedStocks = expandedNigerianStocks.map(stock => ({
      symbol: stock.symbol,
      name: stock.name,
      price: stock.currentPrice,
      change: stock.changePercent,
      industry: stock.sector,
      currentPrice: stock.currentPrice,
      sector: stock.sector,
      beta: stock.beta,
      pe: stock.pe,
      dividend: stock.dividend,
      data: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: stock.currentPrice + Math.sin(i * 0.2) * (stock.currentPrice * 0.05) + Math.random() * (stock.currentPrice * 0.02)
      }))
    }));

    setStocks(convertedStocks);
    
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

    // Show enhanced notification
    setTimeout(() => {
      toast("🚀 Enhanced Nigerian Stock Exchange", {
        description: `Trading ${convertedStocks.length}+ Nigerian companies with enhanced analytics and real-time simulation. All prices in Nigerian Naira (₦).`,
        className: "bg-purple-600 border-purple-700 text-white",
        duration: 6000,
      });
    }, 1500);

    // Enhanced update stock prices every 3 seconds for more realistic movement
    const interval = setInterval(() => {
      setStocks(prevStocks => 
        prevStocks.map(stock => {
          // More sophisticated price movement based on beta
          const volatilityFactor = stock.beta * 0.008;
          const randomChange = (Math.random() - 0.5) * volatilityFactor;
          const newPrice = Math.max(1, stock.currentPrice * (1 + randomChange));
          
          return {
            ...stock,
            currentPrice: newPrice,
            change: stock.change + (randomChange * 100)
          };
        })
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const showStepByStepGuidance = (action: string, stock?: Stock) => {
    let guidance = '';
    
    switch (action) {
      case 'buy':
        guidance = `💡 Buying ${stock?.symbol} (${stock?.name}): You're purchasing shares of this Nigerian company in the ${stock?.sector} sector. With a beta of ${stock?.beta}, this stock has ${stock?.beta > 1 ? 'higher' : 'lower'} volatility than the market. P/E ratio of ${stock?.pe} suggests ${stock?.pe > 20 ? 'growth' : 'value'} characteristics.`;
        break;
      case 'sell':
        guidance = `💡 Selling ${stock?.symbol}: Converting your ${stock?.sector} sector holding back to cash. Current dividend yield of ${stock?.dividend}% and market dynamics suggest ${stock?.change > 0 ? 'positive' : 'challenging'} sentiment for this Nigerian company.`;
        break;
      case 'portfolio':
        guidance = `💡 Your Enhanced Nigerian Portfolio: Diversified across ${Array.from(new Set(stocks.map(s => s.sector))).length} sectors of the Nigerian economy. Enhanced analytics show real-time beta calculations, P/E ratios, and dividend yields for better investment decisions.`;
        break;
      case 'market':
        guidance = `💡 Enhanced Nigerian Stock Market: Trading ${stocks.length}+ companies across all major sectors. Enhanced features include real-time beta analysis, sector rotation insights, and macro-economic correlation with oil prices, naira exchange rates, and CBN monetary policy.`;
        break;
    }
    
    setCurrentGuidance(guidance);
    setShowGuidance(true);
  };

  const filteredStocks = searchTerm 
    ? searchStocks(searchTerm).map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: stock.currentPrice,
        change: stock.changePercent,
        industry: stock.sector,
        currentPrice: stock.currentPrice,
        sector: stock.sector,
        beta: stock.beta,
        pe: stock.pe,
        dividend: stock.dividend,
        data: Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          price: stock.currentPrice + Math.sin(i * 0.2) * (stock.currentPrice * 0.05) + Math.random() * (stock.currentPrice * 0.02)
        }))
      }))
    : stocks;

  const handleAnalyseStock = (stock: Stock) => {
    setAnalysisStock(stock);
    setShowStockAnalysis(true);
    
    toast("📊 Enhanced Stock Analysis Loading", {
      description: `Analyzing ${stock.symbol} with beta ${stock.beta}, P/E ${stock.pe}, sector trends, and macro-economic correlations...`,
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
        const totalShares = existingHolding.shares + shares;
        const totalCost = (existingHolding.avgCost * existingHolding.shares) + total;
        existingHolding.shares = totalShares;
        existingHolding.avgCost = totalCost / totalShares;
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
          <h2 className="text-3xl font-bold text-white">Enhanced Nigerian Stock Exchange Trading</h2>
          <p className="text-slate-400">Trade {stocks.length}+ Nigerian companies with enhanced analytics and real-time data</p>
          <div className="flex gap-2 mt-2">
            <span className="text-xs text-purple-400 bg-purple-600/20 px-2 py-1 rounded">✨ Enhanced Analytics</span>
            <span className="text-xs text-blue-400 bg-blue-600/20 px-2 py-1 rounded">📊 Real-time Beta</span>
            <span className="text-xs text-green-400 bg-green-600/20 px-2 py-1 rounded">🎯 Sector Analysis</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-400">Available Cash</p>
          <p className="text-2xl font-bold text-green-400">₦{(portfolio.cash || 0).toLocaleString()}</p>
          <Button
            size="sm"
            variant="outline"
            onClick={() => showStepByStepGuidance('portfolio')}
            className="mt-1 text-purple-400 border-purple-600"
          >
            <HelpCircle className="h-3 w-3 mr-1" />
            Enhanced Features Guide
          </Button>
        </div>
      </div>

      {/* Enhanced Financial Literacy Guide */}
      <FinancialLiteracyGuide userLevel={userLevel} />

      {/* Enhanced Investment Suggestions */}
      <InvestmentSuggestions stocks={stocks} />

      {/* Recent Trades with Enhanced Analytics */}
      {trades.length > 0 ? (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Enhanced Nigerian Stock Trades Analytics
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
                className="text-purple-400 hover:text-purple-300 border-purple-600"
              >
                <ChartLine className="h-4 w-4 mr-1" />
                Enhanced Analytics
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {trades.slice(0, 3).map((trade) => {
                const stock = stocks.find(s => s.symbol === trade.symbol);
                const currentPrice = stock?.currentPrice || stock?.price || 0;
                const gainLoss = trade.type === 'buy' 
                  ? (currentPrice - trade.price) * trade.shares
                  : 0;

                return (
                  <div key={trade.id} className="flex items-center justify-between p-3 bg-slate-700 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 rounded text-xs ${
                        trade.type === 'buy' ? 'bg-green-600' : 'bg-red-600'
                      }`}>
                        {trade.type.toUpperCase()}
                      </span>
                      <div>
                        <p className="text-white font-medium">{trade.symbol}</p>
                        <p className="text-slate-400 text-sm">
                          {trade.shares} shares at ₦{(trade.price || 0).toLocaleString()}
                        </p>
                        {stock && (
                          <p className="text-xs text-purple-400">
                            Sector: {stock.sector} | Beta: {stock.beta} | P/E: {stock.pe}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white">₦{(trade.total || 0).toLocaleString()}</p>
                      {trade.type === 'buy' && (
                        <p className={`text-xs ${gainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          P&L: {gainLoss >= 0 ? '+' : ''}₦{gainLoss.toFixed(2)}
                        </p>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => viewTradeChart(trade)}
                        className="text-purple-400 hover:text-purple-300"
                      >
                        <ChartLine className="h-3 w-3 mr-1" />
                        Enhanced Chart
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="text-center py-8">
            <ChartLine className="h-12 w-12 text-slate-500 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">No Enhanced Nigerian Stock Trades Yet</h3>
            <p className="text-slate-400 text-sm mb-4">
              Start trading {stocks.length}+ Nigerian companies to see enhanced analytics
            </p>
            <p className="text-slate-500 text-xs">
              Enhanced features include beta analysis, sector correlation, P/E tracking, and macro-economic impact
            </p>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Nigerian Stock Search */}
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder={`Search ${stocks.length}+ Nigerian stocks by symbol, company name, or sector...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 bg-slate-800 border-slate-700 text-white"
        />
      </div>

      {/* Enhanced Nigerian Stock List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStocks.slice(0, userLevel === 'basic' ? 6 : filteredStocks.length).map((stock) => {
          const safeCurrentPrice = stock.currentPrice || stock.price || 0;
          const safeChange = stock.change || 0;
          
          return (
            <Card key={stock.symbol} className="bg-slate-800 border-slate-700 hover:border-purple-600/50 transition-colors">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg text-white">{stock.symbol}</CardTitle>
                    <p className="text-sm text-slate-400">{stock.name}</p>
                    <div className="flex gap-1 mt-1">
                      <span className="text-xs text-purple-400 bg-purple-600/20 px-1 rounded">{stock.sector}</span>
                      <span className="text-xs text-blue-400 bg-blue-600/20 px-1 rounded">β{stock.beta}</span>
                      <span className="text-xs text-green-400 bg-green-600/20 px-1 rounded">P/E {stock.pe}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-white">₦{safeCurrentPrice.toLocaleString()}</p>
                    <div className={`flex items-center text-sm ${safeChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {safeChange >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                      {safeChange >= 0 ? '+' : ''}{safeChange.toFixed(2)}%
                    </div>
                    <p className="text-xs text-slate-500">Div: {stock.dividend}%</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Enhanced Analyse Stock Button */}
                <Button
                  onClick={() => handleAnalyseStock(stock)}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  size="sm"
                >
                  <BarChart2 className="h-4 w-4 mr-2" />
                  Enhanced Analysis
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

      {/* Enhanced Premium Features Display */}
      {userLevel === 'basic' && filteredStocks.length > 6 && (
        <Card className="bg-purple-900/30 border-purple-600/50">
          <CardContent className="text-center py-6">
            <h3 className="text-purple-300 font-medium mb-2">Enhanced Nigerian Stock Features</h3>
            <p className="text-purple-400 text-sm mb-4">
              Premium users get access to all {filteredStocks.length} Nigerian companies with enhanced analytics including beta analysis, sector rotation insights, and macro-economic correlations
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Upgrade to Enhanced Premium
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Stock Analysis Dialog */}
      <Dialog open={showStockAnalysis} onOpenChange={setShowStockAnalysis}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>
              {analysisStock ? `${analysisStock.symbol} - Enhanced Stock Analysis` : 'Enhanced Stock Analysis'}
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              Comprehensive enhanced analysis including beta correlation, sector trends, P/E analysis, and macro-economic impact
            </DialogDescription>
          </DialogHeader>
          {analysisStock && (
            <StockAnalysis
              symbol={analysisStock.symbol}
              name={analysisStock.name}
              currentPrice={analysisStock.currentPrice || analysisStock.price}
              shares={portfolio.holdings.find((h: any) => h.symbol === analysisStock.symbol)?.shares || 0}
              avgCost={portfolio.holdings.find((h: any) => h.symbol === analysisStock.symbol)?.avgCost || analysisStock.currentPrice || analysisStock.price}
              industry={analysisStock.sector}
              onTrade={handleTradeFromAnalysis}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Enhanced Guidance Dialog */}
      <Dialog open={showGuidance} onOpenChange={setShowGuidance}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Enhanced Nigerian Market Guidance</DialogTitle>
            <DialogDescription className="text-slate-300">
              Advanced understanding of Nigerian stock market investments with enhanced analytics
            </DialogDescription>
          </DialogHeader>
          <div className="p-4 bg-slate-700 rounded-lg">
            <p className="text-slate-200 leading-relaxed">{currentGuidance}</p>
          </div>
          <Button onClick={() => setShowGuidance(false)} className="bg-purple-600 hover:bg-purple-700">
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

      {/* Enhanced Trade Chart Dialog */}
      <Dialog open={showTradeChart} onOpenChange={setShowTradeChart}>
        <DialogContent className="max-w-4xl bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Enhanced Nigerian Stock Trade Analysis</DialogTitle>
            <DialogDescription className="text-slate-300">
              Advanced view of your Nigerian stock performance with enhanced analytics and price movements
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
