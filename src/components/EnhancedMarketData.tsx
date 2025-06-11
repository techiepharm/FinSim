
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Search,
  BarChart3,
  Clock,
  Activity,
  Volume2,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { expandedNigerianStocks, getTopPerformers, getTopLosers, getHighVolumeStocks, getAllSectors } from '@/data/expandedNigerianStocks';

interface MarketData {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
  high: number;
  low: number;
  open: number;
  beta: number;
  pe: number;
  dividend: number;
  lastUpdated: string;
}

interface MarketSummary {
  totalMarketCap: string;
  totalVolume: number;
  advancers: number;
  decliners: number;
  unchanged: number;
  indexValue: number;
  indexChange: number;
}

const EnhancedMarketData = () => {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('all');
  const [isLive, setIsLive] = useState(true);
  const [marketSummary, setMarketSummary] = useState<MarketSummary>({
    totalMarketCap: "₦45.2T",
    totalVolume: 1250000000,
    advancers: 28,
    decliners: 15,
    unchanged: 7,
    indexValue: 52485.60,
    indexChange: 1.85
  });

  useEffect(() => {
    // Initialize market data with enhanced real-time simulation
    const initializeMarketData = () => {
      const enhancedData = expandedNigerianStocks.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        sector: stock.sector,
        price: stock.currentPrice,
        change: stock.change,
        changePercent: stock.changePercent,
        volume: stock.volume,
        marketCap: stock.marketCap,
        high: stock.currentPrice * (1 + Math.random() * 0.05),
        low: stock.currentPrice * (1 - Math.random() * 0.05),
        open: stock.currentPrice * (0.98 + Math.random() * 0.04),
        beta: stock.beta,
        pe: stock.pe,
        dividend: stock.dividend,
        lastUpdated: new Date().toLocaleTimeString()
      }));
      setMarketData(enhancedData);
    };

    initializeMarketData();

    // Real-time price updates every 3 seconds
    const priceUpdateInterval = setInterval(() => {
      if (isLive) {
        setMarketData(prevData => 
          prevData.map(stock => {
            // Simulate realistic price movements
            const volatilityFactor = stock.beta * 0.008; // Higher beta = more volatile
            const randomChange = (Math.random() - 0.5) * volatilityFactor;
            const newPrice = Math.max(0.1, stock.price * (1 + randomChange));
            const priceChange = newPrice - stock.price;
            const percentChange = (priceChange / stock.price) * 100;
            
            // Simulate volume changes
            const volumeChange = 0.8 + Math.random() * 0.4; // 80% to 120% of previous
            
            return {
              ...stock,
              price: newPrice,
              change: stock.change + priceChange,
              changePercent: stock.changePercent + percentChange,
              volume: Math.floor(stock.volume * volumeChange),
              high: Math.max(stock.high, newPrice),
              low: Math.min(stock.low, newPrice),
              lastUpdated: new Date().toLocaleTimeString()
            };
          })
        );

        // Update market summary
        setMarketSummary(prev => ({
          ...prev,
          indexValue: prev.indexValue * (1 + (Math.random() - 0.5) * 0.002),
          indexChange: prev.indexChange + (Math.random() - 0.5) * 0.1,
          totalVolume: Math.floor(prev.totalVolume * (0.95 + Math.random() * 0.1))
        }));
      }
    }, 3000);

    // Market status updates
    toast("📈 NGX Live Market Data", {
      description: "Real-time simulation of Nigerian Exchange market data with enhanced analytics",
      className: "bg-green-600 border-green-700 text-white",
      duration: 4000,
    });

    return () => clearInterval(priceUpdateInterval);
  }, [isLive]);

  const filteredData = marketData.filter(stock => {
    const matchesSearch = stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         stock.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSector = selectedSector === 'all' || stock.sector === selectedSector;
    return matchesSearch && matchesSector;
  });

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-green-400';
    if (change < 0) return 'text-red-400';
    return 'text-gray-400';
  };

  const getChangeBgColor = (change: number) => {
    if (change > 0) return 'bg-green-900/30 border-green-600/50';
    if (change < 0) return 'bg-red-900/30 border-red-600/50';
    return 'bg-gray-900/30 border-gray-600/50';
  };

  const sectors = ['all', ...getAllSectors()];

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-8 w-8 text-green-400" />
              <h1 className="text-3xl font-bold text-white">🇳🇬 NGX Live Market Data</h1>
              <Badge className={`${isLive ? 'bg-green-600' : 'bg-red-600'} text-white animate-pulse`}>
                {isLive ? 'LIVE' : 'PAUSED'}
              </Badge>
            </div>
            <p className="text-slate-400">Real-time Nigerian Exchange market simulation with enhanced analytics</p>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setIsLive(!isLive)}
              variant={isLive ? "default" : "outline"}
              className={isLive ? "bg-green-600 hover:bg-green-700" : "border-red-600 text-red-400"}
            >
              {isLive ? 'Pause Updates' : 'Resume Updates'}
            </Button>
          </div>
        </div>

        {/* Market Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8 animate-slide-in-bottom">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-lg font-bold text-white">NGX ASI</div>
              <div className="text-xl font-bold text-green-400">
                {marketSummary.indexValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className={`text-sm ${getChangeColor(marketSummary.indexChange)}`}>
                {marketSummary.indexChange >= 0 ? '+' : ''}{marketSummary.indexChange.toFixed(2)}%
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-sm text-slate-400">Market Cap</div>
              <div className="text-lg font-bold text-white">{marketSummary.totalMarketCap}</div>
              <div className="text-xs text-slate-500">Total</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-sm text-slate-400">Volume</div>
              <div className="text-lg font-bold text-white">
                {(marketSummary.totalVolume / 1000000).toFixed(1)}M
              </div>
              <div className="text-xs text-slate-500">Shares</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-sm text-green-400">Advancers</div>
              <div className="text-lg font-bold text-green-400">{marketSummary.advancers}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-sm text-red-400">Decliners</div>
              <div className="text-lg font-bold text-red-400">{marketSummary.decliners}</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 text-center">
              <div className="text-sm text-gray-400">Unchanged</div>
              <div className="text-lg font-bold text-gray-400">{marketSummary.unchanged}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all-stocks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all-stocks">All Stocks</TabsTrigger>
            <TabsTrigger value="gainers">Top Gainers</TabsTrigger>
            <TabsTrigger value="losers">Top Losers</TabsTrigger>
            <TabsTrigger value="volume">High Volume</TabsTrigger>
          </TabsList>

          <TabsContent value="all-stocks" className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search stocks by symbol or name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-700 text-white"
                />
              </div>
              
              <select
                value={selectedSector}
                onChange={(e) => setSelectedSector(e.target.value)}
                className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-md text-white"
              >
                {sectors.map(sector => (
                  <option key={sector} value={sector}>
                    {sector === 'all' ? 'All Sectors' : sector}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock Table */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="border-b border-slate-700">
                      <tr className="text-slate-400 text-sm">
                        <th className="text-left p-4">Symbol/Name</th>
                        <th className="text-right p-4">Price (₦)</th>
                        <th className="text-right p-4">Change</th>
                        <th className="text-right p-4">%Change</th>
                        <th className="text-right p-4">Volume</th>
                        <th className="text-right p-4">Market Cap</th>
                        <th className="text-right p-4">P/E</th>
                        <th className="text-center p-4">Updated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredData.map((stock) => (
                        <tr 
                          key={stock.symbol} 
                          className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="p-4">
                            <div>
                              <div className="font-medium text-white">{stock.symbol}</div>
                              <div className="text-sm text-slate-400 truncate max-w-[200px]">
                                {stock.name}
                              </div>
                              <Badge className="bg-slate-700 text-slate-300 text-xs mt-1">
                                {stock.sector}
                              </Badge>
                            </div>
                          </td>
                          <td className="text-right p-4">
                            <span className="font-medium text-white">
                              {stock.price.toFixed(2)}
                            </span>
                          </td>
                          <td className="text-right p-4">
                            <span className={`font-medium ${getChangeColor(stock.change)}`}>
                              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}
                            </span>
                          </td>
                          <td className="text-right p-4">
                            <div className={`inline-block px-2 py-1 rounded text-sm font-medium ${getChangeBgColor(stock.changePercent)}`}>
                              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                            </div>
                          </td>
                          <td className="text-right p-4">
                            <span className="text-slate-300">
                              {(stock.volume / 1000000).toFixed(1)}M
                            </span>
                          </td>
                          <td className="text-right p-4">
                            <span className="text-slate-300">{stock.marketCap}</span>
                          </td>
                          <td className="text-right p-4">
                            <span className="text-slate-300">{stock.pe.toFixed(1)}</span>
                          </td>
                          <td className="text-center p-4">
                            <div className="flex items-center justify-center gap-1">
                              <Clock className="h-3 w-3 text-slate-500" />
                              <span className="text-xs text-slate-500">{stock.lastUpdated}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="gainers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getTopPerformers(9).map((stock, index) => (
                <Card key={stock.symbol} className="bg-slate-800 border-slate-700 hover:border-green-600/50 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-600/20 text-green-300 border-green-500">
                        #{index + 1} Gainer
                      </Badge>
                      <TrendingUp className="h-5 w-5 text-green-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-white">{stock.symbol}</h3>
                        <p className="text-sm text-slate-400 truncate">{stock.name}</p>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-2xl font-bold text-white">₦{stock.currentPrice.toFixed(2)}</span>
                        <span className="text-lg font-bold text-green-400">
                          +{stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-sm text-slate-400">
                        Volume: {(stock.volume / 1000000).toFixed(1)}M
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="losers" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getTopLosers(9).map((stock, index) => (
                <Card key={stock.symbol} className="bg-slate-800 border-slate-700 hover:border-red-600/50 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-red-600/20 text-red-300 border-red-500">
                        #{index + 1} Loser
                      </Badge>
                      <TrendingDown className="h-5 w-5 text-red-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-white">{stock.symbol}</h3>
                        <p className="text-sm text-slate-400 truncate">{stock.name}</p>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-2xl font-bold text-white">₦{stock.currentPrice.toFixed(2)}</span>
                        <span className="text-lg font-bold text-red-400">
                          {stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-sm text-slate-400">
                        Volume: {(stock.volume / 1000000).toFixed(1)}M
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="volume" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getHighVolumeStocks(9).map((stock, index) => (
                <Card key={stock.symbol} className="bg-slate-800 border-slate-700 hover:border-blue-600/50 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <Badge className="bg-blue-600/20 text-blue-300 border-blue-500">
                        #{index + 1} Volume
                      </Badge>
                      <Volume2 className="h-5 w-5 text-blue-400" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-bold text-white">{stock.symbol}</h3>
                        <p className="text-sm text-slate-400 truncate">{stock.name}</p>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-2xl font-bold text-white">₦{stock.currentPrice.toFixed(2)}</span>
                        <span className={`text-lg font-bold ${getChangeColor(stock.changePercent)}`}>
                          {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                        </span>
                      </div>
                      <div className="text-sm text-blue-400 font-medium">
                        Volume: {(stock.volume / 1000000).toFixed(1)}M shares
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default EnhancedMarketData;
