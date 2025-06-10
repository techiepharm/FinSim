
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Newspaper, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle,
  Bell,
  Calendar,
  ExternalLink,
  BarChart3
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  impact: 'positive' | 'negative' | 'neutral';
  severity: 'high' | 'medium' | 'low';
  affectedStocks: string[];
  publishedAt: string;
  source: string;
  priceChange?: number;
}

interface StockImpact {
  symbol: string;
  name: string;
  currentPrice: number;
  priceChange: number;
  percentChange: number;
  newsCount: number;
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

const NewsImpactAnalysis = () => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [stockImpacts, setStockImpacts] = useState<StockImpact[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('today');

  useEffect(() => {
    // Mock news data - in real app, this would come from news APIs
    const mockNews: NewsItem[] = [
      {
        id: '1',
        title: 'Dangote Cement Reports Record Q4 Earnings',
        summary: 'Dangote Cement posts 35% increase in quarterly profits, driven by strong demand across Nigeria and sub-Saharan Africa.',
        impact: 'positive',
        severity: 'high',
        affectedStocks: ['DANGCEM'],
        publishedAt: '2024-01-15T10:30:00Z',
        source: 'BusinessDay',
        priceChange: 8.5
      },
      {
        id: '2',
        title: 'Central Bank Raises Interest Rates to 18.75%',
        summary: 'CBN increases benchmark interest rate by 50 basis points to combat inflation, potentially affecting banking stocks.',
        impact: 'negative',
        severity: 'high',
        affectedStocks: ['GTCO', 'ZENITHBANK', 'UBA', 'ACCESSCORP'],
        publishedAt: '2024-01-15T14:15:00Z',
        source: 'The Nation',
        priceChange: -3.2
      },
      {
        id: '3',
        title: 'Nigerian Government Approves New Oil Blocks',
        summary: 'Federal government announces allocation of new oil exploration blocks, benefiting local oil companies.',
        impact: 'positive',
        severity: 'medium',
        affectedStocks: ['SEPLAT', 'OANDO', 'CONOIL'],
        publishedAt: '2024-01-15T09:45:00Z',
        source: 'Punch',
        priceChange: 4.1
      },
      {
        id: '4',
        title: 'MTN Nigeria Reports Network Expansion',
        summary: 'MTN completes 5G network rollout to 15 additional cities, strengthening market position.',
        impact: 'positive',
        severity: 'medium',
        affectedStocks: ['MTNN'],
        publishedAt: '2024-01-15T11:20:00Z',
        source: 'Vanguard',
        priceChange: 2.8
      },
      {
        id: '5',
        title: 'Consumer Goods Sector Faces Inflation Pressure',
        summary: 'Rising raw material costs affecting profit margins for consumer goods companies.',
        impact: 'negative',
        severity: 'medium',
        affectedStocks: ['NESTLE', 'UNILEVER', 'GUINNESS'],
        publishedAt: '2024-01-15T13:10:00Z',
        source: 'ThisDay',
        priceChange: -1.9
      }
    ];

    setNewsItems(mockNews);

    // Mock stock impact data
    const mockStockImpacts: StockImpact[] = [
      {
        symbol: 'DANGCEM',
        name: 'Dangote Cement',
        currentPrice: 285.50,
        priceChange: 24.30,
        percentChange: 8.5,
        newsCount: 3,
        sentiment: 'bullish'
      },
      {
        symbol: 'GTCO',
        name: 'Guaranty Trust',
        currentPrice: 42.80,
        priceChange: -1.40,
        percentChange: -3.2,
        newsCount: 2,
        sentiment: 'bearish'
      },
      {
        symbol: 'SEPLAT',
        name: 'Seplat Energy',
        currentPrice: 165.20,
        priceChange: 6.50,
        percentChange: 4.1,
        newsCount: 2,
        sentiment: 'bullish'
      },
      {
        symbol: 'MTNN',
        name: 'MTN Nigeria',
        currentPrice: 198.75,
        priceChange: 5.40,
        percentChange: 2.8,
        newsCount: 1,
        sentiment: 'bullish'
      }
    ];

    setStockImpacts(mockStockImpacts);
  }, [selectedTimeframe]);

  const getImpactIcon = (impact: string) => {
    switch (impact) {
      case 'positive':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'negative':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      default:
        return <BarChart3 className="h-4 w-4 text-gray-400" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive':
        return 'bg-green-600/20 text-green-300 border-green-500';
      case 'negative':
        return 'bg-red-600/20 text-red-300 border-red-500';
      default:
        return 'bg-gray-600/20 text-gray-300 border-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-600/20 text-red-300 border-red-500';
      case 'medium':
        return 'bg-yellow-600/20 text-yellow-300 border-yellow-500';
      case 'low':
        return 'bg-green-600/20 text-green-300 border-green-500';
      default:
        return 'bg-gray-600/20 text-gray-300 border-gray-500';
    }
  };

  const setupAlert = (stocks: string[]) => {
    toast("🔔 Alert Set Up", {
      description: `You'll be notified of news affecting ${stocks.join(', ')}`,
      className: "bg-blue-600 border-blue-700 text-white",
      duration: 3000,
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-NG', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Mock chart data for price movements
  const chartData = [
    { time: '09:00', price: 280 },
    { time: '10:00', price: 282 },
    { time: '11:00', price: 285 },
    { time: '12:00', price: 288 },
    { time: '13:00', price: 285 },
    { time: '14:00', price: 287 },
    { time: '15:00', price: 290 }
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Newspaper className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">News Impact Analysis</h1>
          </div>
          <p className="text-slate-400">Track how news affects Nigerian stock prices in real-time</p>
        </div>

        {/* Time Period Selector */}
        <Card className="bg-slate-800 border-slate-700 mb-6 animate-slide-in-bottom">
          <CardContent className="p-4">
            <div className="flex justify-center gap-2">
              {['today', 'week', 'month'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedTimeframe(period as any)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedTimeframe === period
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Latest News */}
          <Card className="bg-slate-800 border-slate-700 animate-scale-up">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Newspaper className="h-5 w-5 text-blue-400" />
                Market Moving News
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {newsItems.map((news) => (
                  <div key={news.id} className="p-4 bg-slate-700/50 rounded-lg border border-slate-600">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        {getImpactIcon(news.impact)}
                        <Badge className={getImpactColor(news.impact)}>
                          {news.impact}
                        </Badge>
                        <Badge className={getSeverityColor(news.severity)}>
                          {news.severity}
                        </Badge>
                      </div>
                      <span className="text-slate-400 text-xs">{formatDate(news.publishedAt)}</span>
                    </div>
                    
                    <h4 className="text-white font-medium mb-2">{news.title}</h4>
                    <p className="text-slate-300 text-sm mb-3">{news.summary}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-xs">Affects:</span>
                        {news.affectedStocks.map((stock) => (
                          <Badge key={stock} variant="outline" className="text-xs border-slate-500">
                            {stock}
                          </Badge>
                        ))}
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setupAlert(news.affectedStocks)}
                        className="border-slate-600"
                      >
                        <Bell className="h-3 w-3 mr-1" />
                        Alert
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stock Impact Dashboard */}
          <Card className="bg-slate-800 border-slate-700 animate-scale-up delay-100">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-400" />
                Stock Price Impact
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stockImpacts.map((stock) => (
                  <div key={stock.symbol} className="p-4 bg-slate-700/50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="text-white font-medium">{stock.symbol}</h4>
                        <p className="text-slate-400 text-sm">{stock.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-white font-medium">₦{stock.currentPrice}</p>
                        <p className={`text-sm ${stock.priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.priceChange >= 0 ? '+' : ''}₦{stock.priceChange} ({stock.percentChange >= 0 ? '+' : ''}{stock.percentChange}%)
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={`text-xs ${
                          stock.sentiment === 'bullish' 
                            ? 'bg-green-600/20 text-green-300 border-green-500'
                            : stock.sentiment === 'bearish'
                            ? 'bg-red-600/20 text-red-300 border-red-500'
                            : 'bg-gray-600/20 text-gray-300 border-gray-500'
                        }`}>
                          {stock.sentiment}
                        </Badge>
                        <span className="text-slate-400 text-xs">{stock.newsCount} news items</span>
                      </div>
                      <Button size="sm" variant="outline" className="border-slate-600">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Price Movement Chart */}
        <Card className="bg-slate-800 border-slate-700 animate-fade-in delay-300">
          <CardHeader>
            <CardTitle className="text-white">Intraday Price Movement - DANGCEM</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#374151', 
                      border: '1px solid #6B7280',
                      borderRadius: '8px'
                    }}
                    formatter={(value: any) => [`₦${value}`, 'Price']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-green-900/30 border border-green-600/50 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-green-300 text-sm">
                  <strong>News Impact:</strong> Stock jumped 8.5% after positive earnings report at 10:30 AM
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card className="bg-gradient-to-r from-green-900/50 to-green-800/50 border-green-600/50 animate-slide-in-right">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-6 w-6 text-green-400 mx-auto mb-2" />
              <p className="text-green-300 text-sm">Positive News</p>
              <p className="text-xl font-bold text-white">
                {newsItems.filter(n => n.impact === 'positive').length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-red-900/50 to-red-800/50 border-red-600/50 animate-slide-in-right delay-100">
            <CardContent className="p-4 text-center">
              <TrendingDown className="h-6 w-6 text-red-400 mx-auto mb-2" />
              <p className="text-red-300 text-sm">Negative News</p>
              <p className="text-xl font-bold text-white">
                {newsItems.filter(n => n.impact === 'negative').length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-900/50 to-yellow-800/50 border-yellow-600/50 animate-slide-in-right delay-200">
            <CardContent className="p-4 text-center">
              <AlertTriangle className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
              <p className="text-yellow-300 text-sm">High Impact</p>
              <p className="text-xl font-bold text-white">
                {newsItems.filter(n => n.severity === 'high').length}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 border-blue-600/50 animate-slide-in-right delay-300">
            <CardContent className="p-4 text-center">
              <Bell className="h-6 w-6 text-blue-400 mx-auto mb-2" />
              <p className="text-blue-300 text-sm">Active Alerts</p>
              <p className="text-xl font-bold text-white">5</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NewsImpactAnalysis;
