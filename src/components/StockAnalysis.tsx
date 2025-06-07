
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, AlertTriangle, Info, Target, DollarSign, BarChart3, LineChart } from "lucide-react";
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

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

  // Generate comprehensive historical data for Nigerian stock
  const generateDetailedChartData = () => {
    const data = [];
    let price = avgCost;
    
    // 6 months of daily data
    for (let i = 180; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      // Nigerian market-specific volatility patterns
      const weekday = date.getDay();
      const isWeekend = weekday === 0 || weekday === 6;
      
      if (!isWeekend) {
        // Simulate Nigerian market patterns
        const nairaVolatility = (Math.random() - 0.5) * (price * 0.025);
        const industryFactor = getIndustryVolatility(industry);
        const marketSentiment = Math.sin(i * 0.05) * (price * 0.01);
        
        price = Math.max(price + nairaVolatility + industryFactor + marketSentiment, price * 0.7);
        
        data.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: price,
          volume: Math.floor(Math.random() * 5000000) + 1000000,
          high: price * (1 + Math.random() * 0.03),
          low: price * (1 - Math.random() * 0.03),
          marketCap: price * getEstimatedShares(symbol),
          rsi: 30 + Math.random() * 40, // RSI between 30-70
          macd: (Math.random() - 0.5) * 2
        });
      }
    }
    
    // Ensure the last data point matches current price
    if (data.length > 0) {
      data[data.length - 1].price = currentPrice;
      data[data.length - 1].high = Math.max(currentPrice, data[data.length - 1].high);
      data[data.length - 1].low = Math.min(currentPrice, data[data.length - 1].low);
    }
    
    return data;
  };

  const getIndustryVolatility = (industry: string) => {
    const volatilityMap: { [key: string]: number } = {
      'Banking': 0.8,
      'Oil & Gas': 1.5,
      'Telecommunications': 0.6,
      'Building Materials': 1.0,
      'Consumer Goods': 0.7,
      'Insurance': 0.9
    };
    return (Math.random() - 0.5) * (volatilityMap[industry] || 1.0);
  };

  const getEstimatedShares = (symbol: string) => {
    const sharesMap: { [key: string]: number } = {
      'DANGCEM': 17040000000,
      'GTCO': 29431127770,
      'MTNN': 21354588559,
      'AIRTELAFRI': 3756912401,
      'BUACEMENT': 17040000000,
      'ZENITHBANK': 31396493786,
      'SEPLAT': 555000000,
      'NESTLE': 1085714286,
      'UBA': 35130000000,
      'FLOURMILL': 2000000000
    };
    return sharesMap[symbol] || 1000000000;
  };

  const chartData = generateDetailedChartData();

  // Advanced analysis and recommendations
  const getAdvancedRecommendation = () => {
    const recentData = chartData.slice(-30); // Last 30 trading days
    const avgVolume = recentData.reduce((sum, d) => sum + d.volume, 0) / recentData.length;
    const priceChange30d = recentData.length > 0 ? ((currentPrice - recentData[0].price) / recentData[0].price) * 100 : 0;
    const avgRSI = recentData.reduce((sum, d) => sum + d.rsi, 0) / recentData.length;
    
    // Nigerian market-specific factors
    const industryStrength = getIndustryStrength(industry);
    const nairaImpact = getNairaImpact(industry);
    const regulatoryRisk = getRegulatoryRisk(industry);
    
    let recommendation = {
      action: 'hold' as 'buy' | 'sell' | 'hold',
      confidence: 50,
      reasoning: '',
      targetPrice: currentPrice,
      stopLoss: currentPrice * 0.9,
      timeHorizon: '3-6 months'
    };

    if (gainPercent > 25 && avgRSI > 70) {
      recommendation = {
        action: 'sell',
        confidence: 85,
        reasoning: 'Stock is significantly overbought with strong gains. Consider profit-taking as RSI indicates potential correction.',
        targetPrice: currentPrice * 0.95,
        stopLoss: currentPrice * 0.85,
        timeHorizon: '1-2 months'
      };
    } else if (gainPercent < -15 && avgRSI < 35 && industryStrength > 0.6) {
      recommendation = {
        action: 'buy',
        confidence: 80,
        reasoning: 'Stock is oversold in a strong industry. Good opportunity to average down or add to position.',
        targetPrice: currentPrice * 1.2,
        stopLoss: currentPrice * 0.9,
        timeHorizon: '6-12 months'
      };
    } else if (priceChange30d > 10 && avgVolume > 2000000) {
      recommendation = {
        action: 'hold',
        confidence: 75,
        reasoning: 'Strong momentum with good volume. Monitor for continuation but be ready to take profits.',
        targetPrice: currentPrice * 1.1,
        stopLoss: currentPrice * 0.92,
        timeHorizon: '3-6 months'
      };
    } else if (industryStrength > 0.8 && gainPercent > -5 && gainPercent < 15) {
      recommendation = {
        action: 'buy',
        confidence: 70,
        reasoning: 'Strong industry fundamentals with reasonable valuation. Good long-term investment.',
        targetPrice: currentPrice * 1.25,
        stopLoss: currentPrice * 0.88,
        timeHorizon: '12+ months'
      };
    }

    // Adjust for Nigerian market factors
    recommendation.confidence = Math.min(95, recommendation.confidence + industryStrength * 10 - regulatoryRisk * 15);
    
    return recommendation;
  };

  const getIndustryStrength = (industry: string) => {
    const strengthMap: { [key: string]: number } = {
      'Banking': 0.8, // Strong digital banking growth
      'Telecommunications': 0.9, // 5G and digital economy boom
      'Building Materials': 0.7, // Infrastructure development
      'Oil & Gas': 0.5, // Volatile due to global factors
      'Consumer Goods': 0.8, // Large population base
      'Insurance': 0.6 // Growing but competitive
    };
    return strengthMap[industry] || 0.5;
  };

  const getNairaImpact = (industry: string) => {
    const impactMap: { [key: string]: number } = {
      'Banking': 0.3,
      'Oil & Gas': 0.8, // High USD exposure
      'Telecommunications': 0.4,
      'Building Materials': 0.6, // Import-dependent
      'Consumer Goods': 0.5,
      'Insurance': 0.2
    };
    return impactMap[industry] || 0.4;
  };

  const getRegulatoryRisk = (industry: string) => {
    const riskMap: { [key: string]: number } = {
      'Banking': 0.4, // CBN regulations
      'Oil & Gas': 0.8, // High regulatory environment
      'Telecommunications': 0.5, // NCC oversight
      'Building Materials': 0.2,
      'Consumer Goods': 0.3,
      'Insurance': 0.4
    };
    return riskMap[industry] || 0.3;
  };

  const recommendation = getAdvancedRecommendation();

  // Technical indicators
  const technicalIndicators = {
    sma20: chartData.slice(-20).reduce((sum, d) => sum + d.price, 0) / 20,
    sma50: chartData.slice(-50).reduce((sum, d) => sum + d.price, 0) / 50,
    avgRSI: chartData.slice(-14).reduce((sum, d) => sum + d.rsi, 0) / 14,
    avgVolume: chartData.slice(-30).reduce((sum, d) => sum + d.volume, 0) / 30
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              {symbol} - Detailed Nigerian Stock Analysis
            </div>
            <Badge variant="outline" className="text-slate-300">
              {industry}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Comprehensive Price Chart */}
          <div className="h-80">
            <h4 className="text-white font-medium mb-3">6-Month Price Movement & Volume</h4>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={10}
                />
                <YAxis 
                  yAxisId="price"
                  stroke="#9CA3AF"
                  fontSize={10}
                  domain={['dataMin - 5', 'dataMax + 5']}
                  tickFormatter={(value) => `₦${value.toFixed(0)}`}
                />
                <YAxis 
                  yAxisId="volume"
                  orientation="right"
                  stroke="#9CA3AF"
                  fontSize={10}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#F9FAFB'
                  }}
                  formatter={(value: any, name: string) => {
                    if (name === 'price') return [`₦${value.toFixed(2)}`, 'Price'];
                    if (name === 'volume') return [`${(value / 1000000).toFixed(2)}M`, 'Volume'];
                    if (name === 'high') return [`₦${value.toFixed(2)}`, 'High'];
                    if (name === 'low') return [`₦${value.toFixed(2)}`, 'Low'];
                    return [value, name];
                  }}
                />
                <Area 
                  yAxisId="volume"
                  type="monotone" 
                  dataKey="volume" 
                  stroke="#6B7280"
                  fill="#6B728015"
                  strokeWidth={1}
                />
                <Area 
                  yAxisId="price"
                  type="monotone" 
                  dataKey="price" 
                  stroke={gain >= 0 ? '#10B981' : '#EF4444'}
                  fill={`${gain >= 0 ? '#10B981' : '#EF4444'}20`}
                  strokeWidth={3}
                />
                <Line 
                  yAxisId="price"
                  type="monotone" 
                  dataKey="high" 
                  stroke="#22C55E" 
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  dot={false}
                />
                <Line 
                  yAxisId="price"
                  type="monotone" 
                  dataKey="low" 
                  stroke="#EF4444" 
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Technical Indicators Chart */}
          <div className="h-64">
            <h4 className="text-white font-medium mb-3">Technical Indicators</h4>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsLineChart data={chartData.slice(-60)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9CA3AF" fontSize={10} />
                <YAxis stroke="#9CA3AF" fontSize={10} />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '6px',
                    color: '#F9FAFB'
                  }}
                />
                <Line type="monotone" dataKey="rsi" stroke="#8B5CF6" strokeWidth={2} dot={false} name="RSI" />
                <Line type="monotone" dataKey="macd" stroke="#F59E0B" strokeWidth={2} dot={false} name="MACD" />
              </RechartsLineChart>
            </ResponsiveContainer>
          </div>

          {/* Position Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-700 rounded-lg">
              <p className="text-slate-400 text-sm">Shares</p>
              <p className="text-white font-bold text-lg">{shares}</p>
            </div>
            <div className="text-center p-3 bg-slate-700 rounded-lg">
              <p className="text-slate-400 text-sm">Avg Cost</p>
              <p className="text-white font-bold text-lg">₦{avgCost.toFixed(2)}</p>
            </div>
            <div className="text-center p-3 bg-slate-700 rounded-lg">
              <p className="text-slate-400 text-sm">Current Price</p>
              <p className="text-white font-bold text-lg">₦{currentPrice.toFixed(2)}</p>
            </div>
            <div className="text-center p-3 bg-slate-700 rounded-lg">
              <p className="text-slate-400 text-sm">Total Value</p>
              <p className="text-white font-bold text-lg">₦{currentValue.toFixed(2)}</p>
            </div>
          </div>

          {/* Advanced Technical Analysis */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-700 rounded-lg">
              <p className="text-slate-400 text-sm">SMA 20</p>
              <p className="text-white font-bold">₦{technicalIndicators.sma20.toFixed(2)}</p>
            </div>
            <div className="text-center p-3 bg-slate-700 rounded-lg">
              <p className="text-slate-400 text-sm">SMA 50</p>
              <p className="text-white font-bold">₦{technicalIndicators.sma50.toFixed(2)}</p>
            </div>
            <div className="text-center p-3 bg-slate-700 rounded-lg">
              <p className="text-slate-400 text-sm">RSI (14)</p>
              <p className={`font-bold ${technicalIndicators.avgRSI > 70 ? 'text-red-400' : technicalIndicators.avgRSI < 30 ? 'text-green-400' : 'text-white'}`}>
                {technicalIndicators.avgRSI.toFixed(1)}
              </p>
            </div>
            <div className="text-center p-3 bg-slate-700 rounded-lg">
              <p className="text-slate-400 text-sm">Avg Volume</p>
              <p className="text-white font-bold">{(technicalIndicators.avgVolume / 1000000).toFixed(1)}M</p>
            </div>
          </div>

          {/* Advanced Recommendation */}
          <div className={`p-4 rounded-lg ${
            recommendation.action === 'buy' ? 'bg-green-900/20 border border-green-600' :
            recommendation.action === 'sell' ? 'bg-red-900/20 border border-red-600' :
            'bg-blue-900/20 border border-blue-600'
          }`}>
            <div className="flex items-start gap-3">
              <div className={`mt-1 ${
                recommendation.action === 'buy' ? 'text-green-400' :
                recommendation.action === 'sell' ? 'text-red-400' :
                'text-blue-400'
              }`}>
                {recommendation.action === 'buy' ? <TrendingUp className="h-5 w-5" /> :
                 recommendation.action === 'sell' ? <TrendingDown className="h-5 w-5" /> :
                 <Target className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h4 className={`font-medium text-lg ${
                    recommendation.action === 'buy' ? 'text-green-400' :
                    recommendation.action === 'sell' ? 'text-red-400' :
                    'text-blue-400'
                  }`}>
                    Recommendation: {recommendation.action.toUpperCase()}
                  </h4>
                  <Badge className="bg-slate-700 text-white">
                    {recommendation.confidence}% Confidence
                  </Badge>
                </div>
                <p className="text-slate-300 text-sm mb-3">{recommendation.reasoning}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-slate-400">Target Price</p>
                    <p className="text-white font-medium">₦{recommendation.targetPrice.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Stop Loss</p>
                    <p className="text-white font-medium">₦{recommendation.stopLoss.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Time Horizon</p>
                    <p className="text-white font-medium">{recommendation.timeHorizon}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Nigerian Market-Specific Insights */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-400 mt-1" />
              <div>
                <h4 className="text-blue-400 font-medium">Nigerian Market Analysis</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                  <div>
                    <p className="text-slate-300 text-sm">Industry Strength</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-green-400 h-2 rounded-full"
                          style={{ width: `${getIndustryStrength(industry) * 100}%` }}
                        />
                      </div>
                      <span className="text-green-400 text-xs">{(getIndustryStrength(industry) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm">Naira Impact Risk</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-yellow-400 h-2 rounded-full"
                          style={{ width: `${getNairaImpact(industry) * 100}%` }}
                        />
                      </div>
                      <span className="text-yellow-400 text-xs">{(getNairaImpact(industry) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-slate-300 text-sm">Regulatory Risk</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-slate-600 rounded-full h-2">
                        <div 
                          className="bg-red-400 h-2 rounded-full"
                          style={{ width: `${getRegulatoryRisk(industry) * 100}%` }}
                        />
                      </div>
                      <span className="text-red-400 text-xs">{(getRegulatoryRisk(industry) * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <Button 
              className={`${recommendation.action === 'buy' ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'}`}
              onClick={() => onTrade?.(symbol, 'buy')}
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Buy More Shares
            </Button>
            <Button 
              variant="outline"
              className={`${recommendation.action === 'sell' ? 'border-red-600 text-red-400 hover:bg-red-600/10' : 'border-orange-600 text-orange-400 hover:bg-orange-600/10'}`}
              onClick={() => onTrade?.(symbol, 'sell')}
            >
              <TrendingDown className="h-4 w-4 mr-2" />
              Sell Position
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StockAnalysis;
