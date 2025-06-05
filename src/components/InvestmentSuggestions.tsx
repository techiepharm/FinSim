
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb } from "lucide-react";

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
    "🏦 Banking stocks lead Nigerian market - focus on tier-1 banks",
    "📱 Telecom giants MTN & Airtel benefit from Nigeria's growing digital economy",
    "🏗️ Cement companies gain from infrastructure development projects",
    "💰 Naira devaluation affects import-dependent companies differently",
    "⚡ Power sector reforms create opportunities in energy stocks",
    "🛒 Consumer goods stocks benefit from Nigeria's large population"
  ];

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          Nigerian Market Investment Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Market Suggestions */}
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => {
            const Icon = suggestion.icon;
            return (
              <div key={index} className="bg-slate-700 rounded-lg p-3">
                <div className="flex items-start gap-3">
                  <Icon className={`h-5 w-5 ${suggestion.color} mt-0.5`} />
                  <div className="flex-1">
                    <h4 className="text-white font-medium text-sm">{suggestion.title}</h4>
                    <p className="text-slate-300 text-xs mb-2">{suggestion.description}</p>
                    {suggestion.stocks.length > 0 && (
                      <div className="flex gap-2 flex-wrap">
                        {suggestion.stocks.map((stock) => (
                          <span
                            key={stock.symbol}
                            className={`px-2 py-1 rounded text-xs ${
                              suggestion.type === 'bullish' 
                                ? 'bg-green-600/20 text-green-300'
                                : suggestion.type === 'caution'
                                ? 'bg-yellow-600/20 text-yellow-300'
                                : 'bg-blue-600/20 text-blue-300'
                            }`}
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

        {/* Nigerian Market Tips */}
        <div className="border-t border-slate-600 pt-4">
          <h4 className="text-white font-medium text-sm mb-3">Nigerian Stock Market Tips</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {nigerianMarketTips.slice(0, 4).map((tip, index) => (
              <div key={index} className="text-slate-300 text-xs p-2 bg-slate-700/50 rounded">
                {tip}
              </div>
            ))}
          </div>
        </div>

        {/* Market Status Indicator */}
        <div className="bg-slate-900 border border-green-900/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-green-400 text-sm font-medium">NSE Market Active</span>
          </div>
          <p className="text-slate-400 text-xs">
            Nigerian Stock Exchange trading hours: 10:00 AM - 2:30 PM WAT
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentSuggestions;
