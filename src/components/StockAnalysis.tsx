
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, AlertTriangle, Info, Target, DollarSign, BarChart3 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface StockAnalysisProps {
  symbol: string;
  name: string;
  currentPrice: number;
  shares: number;
  avgCost: number;
  industry: string;
  onTrade?: (symbol: string, action: 'buy' | 'sell') => void;
}

const StockAnalysis = ({ symbol, name, currentPrice, shares, avgCost, industry, onTrade }: StockAnalysisProps) => {
  const currentValue = shares * currentPrice;
  const costBasis = shares * avgCost;
  const gain = currentValue - costBasis;
  const gainPercent = avgCost > 0 ? ((currentPrice - avgCost) / avgCost) * 100 : 0;

  // Generate mock historical data for chart
  const generateChartData = () => {
    const data = [];
    let price = avgCost;
    
    for (let i = 30; i >= 0; i--) {
      const randomChange = (Math.random() - 0.5) * 5;
      price = Math.max(price + randomChange, price * 0.8);
      data.push({
        date: `${i}d ago`,
        price: price,
        volume: Math.floor(Math.random() * 1000000) + 500000
      });
    }
    
    // Ensure the last data point is the current price
    data[data.length - 1].price = currentPrice;
    return data;
  };

  const chartData = generateChartData();

  // Analysis and recommendations based on performance
  const getRecommendation = () => {
    if (gainPercent > 10) {
      return {
        action: 'sell',
        icon: <TrendingDown className="h-4 w-4" />,
        color: 'text-orange-400',
        bgColor: 'bg-orange-900/20',
        title: 'Consider Taking Profits',
        description: 'Strong gains achieved. Consider partial profit-taking.',
        confidence: 75
      };
    } else if (gainPercent > 5) {
      return {
        action: 'hold',
        icon: <Target className="h-4 w-4" />,
        color: 'text-blue-400',
        bgColor: 'bg-blue-900/20',
        title: 'Hold Position',
        description: 'Moderate gains. Monitor for continued growth.',
        confidence: 80
      };
    } else if (gainPercent < -10) {
      return {
        action: 'review',
        icon: <AlertTriangle className="h-4 w-4" />,
        color: 'text-red-400',
        bgColor: 'bg-red-900/20',
        title: 'Review Position',
        description: 'Significant losses. Consider stop-loss or averaging down.',
        confidence: 70
      };
    } else {
      return {
        action: 'buy',
        icon: <TrendingUp className="h-4 w-4" />,
        color: 'text-green-400',
        bgColor: 'bg-green-900/20',
        title: 'Consider Adding',
        description: 'Good entry point for additional shares.',
        confidence: 85
      };
    }
  };

  const recommendation = getRecommendation();

  // Industry-specific insights
  const getIndustryInsight = () => {
    const insights = {
      'Banking': 'Nigerian banks benefit from rising interest rates and growing digital banking adoption.',
      'Telecommunications': 'Strong subscriber growth and 5G rollout driving sector performance.',
      'Building Materials': 'Infrastructure development and urbanization supporting cement demand.',
      'Oil & Gas': 'Monitor global oil prices and local policy changes closely.',
      'Consumer Goods': 'Large population and growing middle class support consumer brands.',
      'Insurance': 'Growing insurance penetration presents long-term opportunities.'
    };
    
    return insights[industry] || 'Monitor sector-specific developments and regulatory changes.';
  };

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-400" />
            {symbol} Analysis
          </div>
          <Badge variant="outline" className="text-slate-300">
            {industry}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Enhanced Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="date" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
                domain={['dataMin - 5', 'dataMax + 5']}
                tickFormatter={(value) => `₦${value.toFixed(0)}`}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '6px',
                  color: '#F9FAFB'
                }}
                formatter={(value: any, name: string) => [
                  name === 'price' ? `₦${value.toFixed(2)}` : value.toLocaleString(),
                  name === 'price' ? 'Price' : 'Volume'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="price" 
                stroke={gain >= 0 ? '#10B981' : '#EF4444'}
                fill={`${gain >= 0 ? '#10B981' : '#EF4444'}20`}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Position Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-slate-400 text-sm">Shares</p>
            <p className="text-white font-bold">{shares}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-sm">Avg Cost</p>
            <p className="text-white font-bold">₦{avgCost.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-sm">Current Price</p>
            <p className="text-white font-bold">₦{currentPrice.toFixed(2)}</p>
          </div>
          <div className="text-center">
            <p className="text-slate-400 text-sm">Total Value</p>
            <p className="text-white font-bold">₦{currentValue.toFixed(2)}</p>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className={`p-4 rounded-lg ${recommendation.bgColor}`}>
          <div className="flex items-start gap-3">
            <div className={`${recommendation.color} mt-1`}>
              {recommendation.icon}
            </div>
            <div className="flex-1">
              <h4 className={`font-medium ${recommendation.color}`}>
                {recommendation.title}
              </h4>
              <p className="text-slate-300 text-sm mt-1">
                {recommendation.description}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-xs text-slate-400">Confidence:</span>
                <div className="flex-1 bg-slate-600 rounded-full h-1.5 max-w-24">
                  <div 
                    className="bg-green-400 h-1.5 rounded-full"
                    style={{ width: `${recommendation.confidence}%` }}
                  />
                </div>
                <span className="text-xs text-green-400">{recommendation.confidence}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Industry Insight */}
        <div className="bg-slate-700 p-4 rounded-lg">
          <div className="flex items-start gap-3">
            <Info className="h-4 w-4 text-blue-400 mt-1" />
            <div>
              <h4 className="text-blue-400 font-medium text-sm">Industry Insight</h4>
              <p className="text-slate-300 text-sm mt-1">{getIndustryInsight()}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Button 
            className="bg-green-600 hover:bg-green-700"
            onClick={() => onTrade?.(symbol, 'buy')}
          >
            <DollarSign className="h-4 w-4 mr-2" />
            Buy More
          </Button>
          <Button 
            variant="outline"
            className="border-red-600 text-red-400 hover:bg-red-600/10"
            onClick={() => onTrade?.(symbol, 'sell')}
          >
            <TrendingDown className="h-4 w-4 mr-2" />
            Sell Position
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StockAnalysis;
