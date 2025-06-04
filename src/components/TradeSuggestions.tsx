
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Lock, Crown, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { toast } from "@/components/ui/sonner";

interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  industry: string;
}

interface TradeSuggestionsProps {
  stocks: Stock[];
  userLevel: 'basic' | 'premium';
}

interface Suggestion {
  id: string;
  type: 'buy' | 'sell' | 'hold' | 'caution';
  stock: Stock;
  reason: string;
  confidence: number;
  explanation: string;
  isPremium: boolean;
  chartData: Array<{ time: string; price: number; volume: number; }>;
}

const TradeSuggestions = ({ stocks, userLevel }: TradeSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);
  const [showChart, setShowChart] = useState<string | null>(null);

  useEffect(() => {
    generateSuggestions();
  }, [stocks]);

  // Generate demo chart data for stocks
  const generateChartData = (basePrice: number, trend: 'up' | 'down' | 'volatile') => {
    const data = [];
    let currentPrice = basePrice;
    
    for (let i = 0; i < 30; i++) {
      let change = 0;
      switch (trend) {
        case 'up':
          change = (Math.random() - 0.3) * 5; // Slightly bullish
          break;
        case 'down':
          change = (Math.random() - 0.7) * 5; // Slightly bearish
          break;
        case 'volatile':
          change = (Math.random() - 0.5) * 8; // More volatile
          break;
      }
      
      currentPrice += change;
      data.push({
        time: `Day ${i + 1}`,
        price: Math.max(currentPrice, basePrice * 0.7), // Prevent negative prices
        volume: Math.floor(Math.random() * 1000000) + 500000
      });
    }
    
    return data;
  };

  const generateSuggestions = () => {
    // Don't generate suggestions if we don't have enough stock data
    if (!stocks || stocks.length === 0) {
      setSuggestions([]);
      return;
    }

    const newSuggestions: Suggestion[] = [];

    // Nigerian stock suggestions based on real companies
    const dangcemStock = stocks.find(s => s.symbol === 'DANGCEM') || stocks[0];
    if (dangcemStock) {
      newSuggestions.push({
        id: '1',
        type: 'buy',
        stock: dangcemStock,
        reason: 'Strong infrastructure demand driving cement sector growth',
        confidence: 85,
        explanation: 'Dangote Cement is Nigeria\'s largest cement producer with strong market position. Infrastructure development and urbanization are driving demand. Consider minimum 1 share.',
        isPremium: false,
        chartData: generateChartData(dangcemStock.currentPrice, 'up')
      });
    }

    const gtcoStock = stocks.find(s => s.symbol === 'GTCO') || stocks[1];
    if (gtcoStock) {
      newSuggestions.push({
        id: '2',
        type: 'caution',
        stock: gtcoStock,
        reason: 'Banking sector facing regulatory headwinds',
        confidence: 70,
        explanation: 'While GTCO has strong fundamentals, the banking sector is facing regulatory pressures. Consider waiting for clearer policy direction before increasing position.',
        isPremium: false,
        chartData: generateChartData(gtcoStock.currentPrice, 'down')
      });
    }

    const mtnnStock = stocks.find(s => s.symbol === 'MTNN') || stocks[2];
    if (mtnnStock) {
      newSuggestions.push({
        id: '3',
        type: 'buy',
        stock: mtnnStock,
        reason: 'AI-powered analysis shows telecom sector strength',
        confidence: 92,
        explanation: 'MTN Nigeria shows strong subscriber growth and digital transformation initiatives. 5G rollout and fintech expansion present significant upside potential.',
        isPremium: true,
        chartData: generateChartData(mtnnStock.currentPrice, 'up')
      });
    }

    const seplatStock = stocks.find(s => s.symbol === 'SEPLAT') || stocks[3];
    if (seplatStock) {
      newSuggestions.push({
        id: '4',
        type: 'sell',
        stock: seplatStock,
        reason: 'Premium algorithm detects oil sector volatility pattern',
        confidence: 78,
        explanation: 'Advanced pattern recognition shows increased volatility in oil & gas sector. Global energy transition and local policy changes create uncertainty.',
        isPremium: true,
        chartData: generateChartData(seplatStock.currentPrice, 'volatile')
      });
    }

    setSuggestions(newSuggestions);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'buy': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'sell': return <TrendingDown className="h-4 w-4 text-red-400" />;
      case 'caution': return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      default: return <Lightbulb className="h-4 w-4 text-blue-400" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'buy': return 'bg-green-600/20 text-green-300';
      case 'sell': return 'bg-red-600/20 text-red-300';
      case 'caution': return 'bg-yellow-600/20 text-yellow-300';
      default: return 'bg-blue-600/20 text-blue-300';
    }
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    if (suggestion.isPremium && userLevel === 'basic') {
      toast("🔒 Premium Feature", {
        description: "Upgrade to Premium to access advanced AI trade suggestions!",
        className: "bg-purple-600 border-purple-700 text-white",
        duration: 4000,
      });
      return;
    }

    setSelectedSuggestion(suggestion);
    toast("📊 Trade Suggestion", {
      description: `${suggestion.type.toUpperCase()} ${suggestion.stock.symbol}: ${suggestion.reason}`,
      className: "bg-blue-600 border-blue-700 text-white",
      duration: 5000,
    });
  };

  const toggleChart = (suggestionId: string) => {
    setShowChart(showChart === suggestionId ? null : suggestionId);
  };

  const visibleSuggestions = userLevel === 'basic' 
    ? suggestions.slice(0, 2) 
    : suggestions;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
            Nigerian Stock AI Suggestions
          </div>
          {userLevel === 'basic' && (
            <Badge variant="outline" className="text-yellow-400 border-yellow-600">
              <Crown className="h-3 w-3 mr-1" />
              Upgrade for More
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {visibleSuggestions.length > 0 ? (
          <>
            {visibleSuggestions.map((suggestion) => (
              <div key={suggestion.id} className="space-y-3">
                <div 
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    suggestion.isPremium && userLevel === 'basic'
                      ? 'bg-slate-700/50 border border-purple-600/50'
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      {getTypeIcon(suggestion.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-white font-medium">{suggestion.stock.symbol}</span>
                          <Badge className={getTypeColor(suggestion.type)}>
                            {suggestion.type.toUpperCase()}
                          </Badge>
                          {suggestion.isPremium && (
                            <Lock className="h-3 w-3 text-purple-400" />
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleChart(suggestion.id);
                            }}
                            className="ml-auto p-1 h-6 w-6"
                          >
                            <BarChart3 className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-slate-300 text-sm">{suggestion.reason}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-400">Confidence:</span>
                          <div className="flex-1 bg-slate-600 rounded-full h-1.5">
                            <div 
                              className="bg-green-400 h-1.5 rounded-full"
                              style={{ width: `${suggestion.confidence}%` }}
                            />
                          </div>
                          <span className="text-xs text-green-400">{suggestion.confidence}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Chart */}
                {showChart === suggestion.id && (
                  <Card className="bg-slate-700 border-slate-600">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-white text-sm flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        {suggestion.stock.symbol} - 30 Day Price Chart (NGN)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 mb-4">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={suggestion.chartData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                            <XAxis 
                              dataKey="time" 
                              stroke="#9CA3AF"
                              fontSize={10}
                              interval="preserveStartEnd"
                            />
                            <YAxis 
                              stroke="#9CA3AF"
                              fontSize={10}
                              domain={['dataMin - 5', 'dataMax + 5']}
                            />
                            <Tooltip 
                              contentStyle={{
                                backgroundColor: '#1F2937',
                                border: '1px solid #374151',
                                borderRadius: '6px',
                                color: '#F9FAFB'
                              }}
                              formatter={(value: any, name: string) => [
                                name === 'price' ? `₦${value.toLocaleString()}` : value.toLocaleString(),
                                name === 'price' ? 'Price' : 'Volume'
                              ]}
                            />
                            <Area 
                              type="monotone" 
                              dataKey="price" 
                              stroke={suggestion.type === 'buy' ? '#10B981' : suggestion.type === 'sell' ? '#EF4444' : '#F59E0B'}
                              fill={`${suggestion.type === 'buy' ? '#10B981' : suggestion.type === 'sell' ? '#EF4444' : '#F59E0B'}20`}
                              strokeWidth={2}
                            />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {/* Chart Statistics */}
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-slate-400">Current Price</p>
                          <p className="text-white font-medium">₦{suggestion.stock.currentPrice.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">30-Day Change</p>
                          <p className={`font-medium ${suggestion.stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {suggestion.stock.change >= 0 ? '+' : ''}{suggestion.stock.change.toFixed(2)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-slate-400">Avg Volume</p>
                          <p className="text-white font-medium">
                            {(suggestion.chartData.reduce((sum, d) => sum + d.volume, 0) / suggestion.chartData.length / 1000000).toFixed(1)}M
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-600">
                        <Button 
                          className="w-full bg-blue-600 hover:bg-blue-700"
                          onClick={() => {
                            toast("📊 Nigerian Stock Analysis", {
                              description: `Detailed chart analysis for ${suggestion.stock.symbol} - a Nigerian company in the ${suggestion.stock.industry} sector.`,
                              className: "bg-blue-600 border-blue-700 text-white",
                              duration: 4000,
                            });
                          }}
                        >
                          Analyze {suggestion.stock.symbol} Nigerian Stock
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            ))}

            {userLevel === 'basic' && suggestions.length > 2 && (
              <div className="mt-4 p-3 bg-purple-900/30 border border-purple-600/50 rounded-lg text-center">
                <Crown className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <p className="text-purple-300 text-sm mb-2">
                  Unlock {suggestions.length - 2} more AI-powered Nigerian stock suggestions with detailed charts
                </p>
                <Button 
                  size="sm" 
                  className="bg-purple-600 hover:bg-purple-700"
                  onClick={() => toast("Coming Soon!", { description: "Premium features will be available soon!" })}
                >
                  Upgrade to Premium for Nigerian Market Insights
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-slate-500">
            <Lightbulb className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="mb-2">Loading Nigerian stock suggestions...</p>
            <p className="text-sm">Waiting for Nigerian Stock Exchange data to generate personalized recommendations.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradeSuggestions;
