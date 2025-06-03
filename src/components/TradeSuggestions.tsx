
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Lock, Crown } from "lucide-react";
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
}

const TradeSuggestions = ({ stocks, userLevel }: TradeSuggestionsProps) => {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<Suggestion | null>(null);

  useEffect(() => {
    generateSuggestions();
  }, [stocks]);

  const generateSuggestions = () => {
    const newSuggestions: Suggestion[] = [
      {
        id: '1',
        type: 'buy',
        stock: stocks.find(s => s.symbol === 'TSLA') || stocks[0],
        reason: 'Strong upward momentum with 12.45% gain',
        confidence: 85,
        explanation: 'Tesla is showing strong bullish signals with high trading volume. The automotive sector is performing well, and the company has positive news flow.',
        isPremium: false
      },
      {
        id: '2',
        type: 'caution',
        stock: stocks.find(s => s.symbol === 'AAPL') || stocks[1],
        reason: 'Recent decline of -3.41% indicates potential weakness',
        confidence: 70,
        explanation: 'Apple has been showing some weakness recently. Consider waiting for a better entry point or implement a dollar-cost averaging strategy.',
        isPremium: false
      },
      {
        id: '3',
        type: 'buy',
        stock: stocks.find(s => s.symbol === 'GOOGL') || stocks[2],
        reason: 'AI-powered analysis suggests strong fundamentals',
        confidence: 92,
        explanation: 'Advanced technical analysis shows multiple bullish indicators converging. The stock has strong fundamentals and is trading below its fair value.',
        isPremium: true
      },
      {
        id: '4',
        type: 'sell',
        stock: stocks.find(s => s.symbol === 'MSFT') || stocks[1],
        reason: 'Premium algorithm detects potential reversal pattern',
        confidence: 78,
        explanation: 'Our advanced pattern recognition system has identified a potential head and shoulders formation, suggesting a possible price reversal.',
        isPremium: true
      }
    ];

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

  const visibleSuggestions = userLevel === 'basic' 
    ? suggestions.slice(0, 2) 
    : suggestions;

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-400" />
            AI Trade Suggestions
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
        {visibleSuggestions.map((suggestion) => (
          <div 
            key={suggestion.id}
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
        ))}

        {userLevel === 'basic' && (
          <div className="mt-4 p-3 bg-purple-900/30 border border-purple-600/50 rounded-lg text-center">
            <Crown className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <p className="text-purple-300 text-sm mb-2">
              Unlock {suggestions.length - 2} more AI-powered suggestions
            </p>
            <Button 
              size="sm" 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => toast("Coming Soon!", { description: "Premium features will be available soon!" })}
            >
              Upgrade to Premium
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TradeSuggestions;
