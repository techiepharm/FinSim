
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
      title: 'Nigerian Growth Opportunity',
      description: 'Consider banking and telecom stocks showing strong momentum',
      icon: TrendingUp,
      color: 'text-green-400',
      stocks: safeStocks.filter(s => s.change > 1 && (s.industry === 'Banking' || s.industry === 'Telecommunications')).slice(0, 2)
    },
    {
      type: 'diversification',
      title: 'Diversify Across Nigerian Sectors',
      description: 'Balance holdings across banking, telecom, and consumer goods',
      icon: Lightbulb,
      color: 'text-blue-400',
      stocks: safeStocks.filter(s => s.industry && ['Consumer Goods', 'Building Materials'].includes(s.industry)).slice(0, 2)
    },
    {
      type: 'caution',
      title: 'Nigerian Market Risk Management',
      description: 'Monitor oil & gas sector due to volatility',
      icon: AlertTriangle,
      color: 'text-yellow-400',
      stocks: safeStocks.filter(s => s.change < -1 || s.industry === 'Oil & Gas').slice(0, 2)
    }
  ];

  const tips = [
    "💡 Nigerian market: Focus on banking and telecom leaders",
    "📊 Naira volatility affects all sectors - consider hedging",
    "🎯 Diversify across 5-7 different Nigerian companies",
    "⏰ Monitor CBN policy changes affecting banking stocks",
    "💰 Oil prices significantly impact Nigerian market sentiment",
    "📈 Infrastructure development drives cement and construction stocks"
  ];

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-yellow-400" />
          Nigerian Market Insights & Suggestions
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

        {/* Investment Tips */}
        <div className="border-t border-slate-600 pt-4">
          <h4 className="text-white font-medium text-sm mb-3">Nigerian Market Tips</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {tips.slice(0, 4).map((tip, index) => (
              <div key={index} className="text-slate-300 text-xs p-2 bg-slate-700/50 rounded">
                {tip}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentSuggestions;
