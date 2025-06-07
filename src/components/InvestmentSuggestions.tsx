
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Play, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from "@/components/ui/sonner";

interface Stock {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  industry: string;
}

interface InvestmentSuggestionsProps {
  stocks: Stock[];
}

const InvestmentSuggestions = ({ stocks }: InvestmentSuggestionsProps) => {
  // Filter stocks safely with proper null checks
  const safeStocks = stocks.filter(stock => 
    stock && 
    typeof stock.change === 'number' && 
    !isNaN(stock.change) &&
    typeof stock.currentPrice === 'number' && 
    !isNaN(stock.currentPrice)
  );

  const suggestions = [
    {
      type: 'bullish',
      title: 'Nigerian Banking Growth',
      description: 'Consider top-tier banks like GTCO and Zenith showing strong fundamentals',
      icon: TrendingUp,
      color: 'text-green-400',
      stocks: safeStocks.filter(s => s.change > 0.5 && s.industry === 'Banking').slice(0, 2)
    },
    {
      type: 'diversification',
      title: 'Sector Diversification',
      description: 'Balance across banking, telecom, and consumer goods for stability',
      icon: Lightbulb,
      color: 'text-blue-400',
      stocks: safeStocks.filter(s => ['Consumer Goods', 'Building Materials', 'Telecommunications'].includes(s.industry)).slice(0, 3)
    },
    {
      type: 'caution',
      title: 'Oil & Gas Volatility',
      description: 'Monitor energy sector due to oil price fluctuations and policy changes',
      icon: AlertTriangle,
      color: 'text-yellow-400',
      stocks: safeStocks.filter(s => s.change < -0.5 || s.industry === 'Oil & Gas').slice(0, 2)
    }
  ];

  const nigerianMarketTips = [
    "🏦 Banking stocks: Focus on tier-1 banks with strong digital presence",
    "📱 Telecom growth: MTN & Airtel benefit from Nigeria's digital economy boom",
    "🏗️ Infrastructure play: Cement companies gain from massive development projects",
    "💰 Currency impact: Monitor Naira movements affecting import-dependent stocks",
    "⚡ Power sector: Energy reforms create opportunities in utility stocks",
    "🛒 Consumer resilience: Large population supports consumer goods demand"
  ];

  const watchVideoTutorial = (topic: string) => {
    toast.success(`🎥 Playing: ${topic}`, {
      description: "Educational video content to help you understand Nigerian market dynamics",
      duration: 4000,
    });
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
            Nigerian Market Investment Insights
          </div>
          <Button
            size="sm"
            onClick={() => watchVideoTutorial("Nigerian Stock Market Overview")}
            className="bg-red-600 hover:bg-red-700"
          >
            <Play className="h-4 w-4 mr-2" />
            Watch Tutorial
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Enhanced Market Suggestions */}
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <div key={index} className="bg-slate-700 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 ${suggestion.color} mt-0.5`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-white font-medium text-sm">{suggestion.title}</h4>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => watchVideoTutorial(suggestion.title)}
                        className="p-1 h-6 w-6"
                      >
                        <Play className="h-3 w-3 text-red-400" />
                      </Button>
                    </div>
                    <p className="text-slate-300 text-xs mb-2">{suggestion.description}</p>
                    
                    {/* Mini chart for suggestion */}
                    {suggestion.stocks.length > 0 && (
                      <div className="h-20 mb-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={[
                            {name: 'Mon', value: Math.random() * 100 + 50},
                            {name: 'Tue', value: Math.random() * 100 + 50},
                            {name: 'Wed', value: Math.random() * 100 + 50},
                            {name: 'Thu', value: Math.random() * 100 + 50},
                            {name: 'Fri', value: Math.random() * 100 + 50},
                          ]}>
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke={suggestion.type === 'bullish' ? '#10B981' : '#EF4444'} 
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    )}
                    
                    {suggestion.stocks.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {suggestion.stocks.map((stock) => (
                          <span
                            key={stock.symbol}
                            className={`px-2 py-1 rounded text-xs cursor-pointer hover:opacity-80 ${
                              suggestion.type === 'bullish' 
                                ? 'bg-green-600/20 text-green-300'
                                : suggestion.type === 'caution'
                                ? 'bg-yellow-600/20 text-yellow-300'
                                : 'bg-blue-600/20 text-blue-300'
                            }`}
                            onClick={() => {
                              toast(`📊 ${stock.symbol}`, {
                                description: `Current Price: ₦${stock.currentPrice} | Change: ${stock.change}%`,
                              });
                            }}
                          >
                            {stock.symbol}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enhanced Nigerian Market Tips */}
        <div className="border-t border-slate-600 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium text-sm">Nigerian Stock Market Insights</h4>
            <Button
              size="sm"
              onClick={() => watchVideoTutorial("Understanding Nigerian Markets")}
              className="bg-red-600 hover:bg-red-700 text-xs px-2 py-1 h-6"
            >
              <Play className="h-3 w-3 mr-1" />
              Video Guide
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {nigerianMarketTips.slice(0, 6).map((tip, index) => (
              <div 
                key={index} 
                className="text-slate-300 text-xs p-2 bg-slate-700/50 rounded hover:bg-slate-700 cursor-pointer transition-colors"
                onClick={() => {
                  toast("💡 Market Insight", {
                    description: tip.replace(/[🏦📱🏗️💰⚡🛒]/g, '').trim(),
                  });
                }}
              >
                {tip}
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Market Status */}
        <div className="bg-slate-900 border border-green-900/50 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-400 text-sm font-medium">NSE Market Active</span>
            </div>
            <Button
              size="sm"
              onClick={() => watchVideoTutorial("NSE Trading Hours & Market Structure")}
              className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 h-6"
            >
              <BarChart3 className="h-3 w-3 mr-1" />
              Learn More
            </Button>
          </div>
          <p className="text-slate-400 text-xs">
            Nigerian Stock Exchange: 10:00 AM - 2:30 PM WAT | Real-time data & analysis
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentSuggestions;
