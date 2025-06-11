
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  DollarSign, 
  BarChart3,
  AlertTriangle,
  Target,
  Calendar,
  Clock,
  ExternalLink
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  impact: 'positive' | 'negative' | 'neutral';
  severity: 'low' | 'medium' | 'high';
  category: 'monetary' | 'fiscal' | 'trade' | 'global' | 'sector' | 'regulatory';
  affectedSectors: string[];
  timestamp: string;
  source: string;
  marketImpact: string;
  tradingRecommendation: string;
}

interface MacroIndicator {
  name: string;
  value: number;
  change: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  impact: string;
}

const MacroEconomicNews = () => {
  const [activeTab, setActiveTab] = useState('news');
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [macroIndicators, setMacroIndicators] = useState<MacroIndicator[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    // Mock Nigerian macro-economic news and analysis
    const mockNews: NewsItem[] = [
      {
        id: '1',
        title: 'CBN Raises Interest Rate to 18.75% to Combat Inflation',
        summary: 'The Central Bank of Nigeria increased the monetary policy rate by 25 basis points to tackle rising inflation, currently at 28.2%. This marks the fifth consecutive rate hike this year.',
        impact: 'negative',
        severity: 'high',
        category: 'monetary',
        affectedSectors: ['Banking', 'Real Estate', 'Consumer Goods'],
        timestamp: '2 hours ago',
        source: 'CBN Official Statement',
        marketImpact: 'Banking stocks may benefit from higher lending rates, while consumer and real estate sectors face pressure',
        tradingRecommendation: 'BUY banking stocks (GTCO, ZENITHBANK), SELL real estate and consumer discretionary'
      },
      {
        id: '2',
        title: 'Naira Strengthens to ₦1,485/$1 Following FX Reforms',
        summary: 'The Nigerian naira appreciated 2.8% against the dollar following new foreign exchange policies and increased oil revenue inflows.',
        impact: 'positive',
        severity: 'medium',
        category: 'monetary',
        affectedSectors: ['Oil & Gas', 'Banking', 'Telecommunications'],
        timestamp: '4 hours ago',
        source: 'FMDQ Exchange',
        marketImpact: 'Import-dependent companies benefit, export-oriented firms face margin pressure',
        tradingRecommendation: 'BUY consumer goods with high import content (NESTLE, UNILEVER)'
      },
      {
        id: '3',
        title: 'Nigeria Q3 GDP Growth Accelerates to 3.46%',
        summary: 'Nigerian economy expanded 3.46% year-on-year in Q3 2024, driven by services and agriculture sectors, beating economist forecasts of 3.1%.',
        impact: 'positive',
        severity: 'medium',
        category: 'fiscal',
        affectedSectors: ['Agriculture', 'Technology', 'Banking'],
        timestamp: '6 hours ago',
        source: 'National Bureau of Statistics',
        marketImpact: 'Broad-based economic growth supports equity valuations across sectors',
        tradingRecommendation: 'HOLD diversified portfolio, slight overweight in agriculture (OKOMUOIL, PRESCO)'
      },
      {
        id: '4',
        title: 'Dangote Refinery Reaches 420,000 bpd Capacity',
        summary: 'Dangote Petroleum Refinery achieved 420,000 barrels per day processing capacity, significantly boosting local fuel production and reducing import dependency.',
        impact: 'positive',
        severity: 'high',
        category: 'sector',
        affectedSectors: ['Oil & Gas', 'Industrial Goods'],
        timestamp: '8 hours ago',
        source: 'Dangote Group',
        marketImpact: 'Positive for local oil companies, negative for fuel importers',
        tradingRecommendation: 'BUY local refiners (DANGOTE), SELL fuel importers'
      },
      {
        id: '5',
        title: 'FG Announces ₦2 Trillion Infrastructure Spending Plan',
        summary: 'Federal Government unveiled a ₦2 trillion infrastructure development plan focusing on roads, railways, and digital infrastructure over the next 18 months.',
        impact: 'positive',
        severity: 'high',
        category: 'fiscal',
        affectedSectors: ['Building Materials', 'Industrial Goods', 'Technology'],
        timestamp: '12 hours ago',
        source: 'Ministry of Works',
        marketImpact: 'Major boost for construction and materials companies',
        tradingRecommendation: 'STRONG BUY cement stocks (DANGCEM, LAFARGE), construction materials'
      },
      {
        id: '6',
        title: 'Global Oil Prices Rise 3.2% on OPEC+ Production Cuts',
        summary: 'Brent crude climbed to $87.50/barrel following OPEC+ decision to extend production cuts through Q2 2025, benefiting Nigerian oil revenues.',
        impact: 'positive',
        severity: 'medium',
        category: 'global',
        affectedSectors: ['Oil & Gas'],
        timestamp: '1 day ago',
        source: 'Reuters',
        marketImpact: 'Higher oil prices boost government revenues and oil company margins',
        tradingRecommendation: 'BUY oil & gas stocks (SEPLAT, TOTAL, OANDO)'
      }
    ];

    const mockIndicators: MacroIndicator[] = [
      {
        name: 'Inflation Rate',
        value: 28.2,
        change: 0.8,
        unit: '%',
        trend: 'up',
        lastUpdated: '2024-11-15',
        impact: 'Rising inflation pressures consumer spending and increases input costs'
      },
      {
        name: 'GDP Growth',
        value: 3.46,
        change: 0.36,
        unit: '%',
        trend: 'up',
        lastUpdated: '2024-11-10',
        impact: 'Accelerating growth supports corporate earnings and employment'
      },
      {
        name: 'USD/NGN Exchange Rate',
        value: 1485.50,
        change: -42.30,
        unit: '₦',
        trend: 'down',
        lastUpdated: '2024-11-18',
        impact: 'Naira strength reduces import costs but affects export competitiveness'
      },
      {
        name: 'CBN Policy Rate',
        value: 18.75,
        change: 0.25,
        unit: '%',
        trend: 'up',
        lastUpdated: '2024-11-16',
        impact: 'Higher rates increase borrowing costs but attract foreign investment'
      },
      {
        name: 'Oil Price (Brent)',
        value: 87.50,
        change: 2.75,
        unit: '$',
        trend: 'up',
        lastUpdated: '2024-11-18',
        impact: 'Higher oil prices boost government revenues and current account'
      },
      {
        name: 'Foreign Reserves',
        value: 33.89,
        change: 1.24,
        unit: '$B',
        trend: 'up',
        lastUpdated: '2024-11-15',
        impact: 'Improving reserves support currency stability and investor confidence'
      }
    ];

    setNewsItems(mockNews);
    setMacroIndicators(mockIndicators);

    // Show welcome message
    toast("🇳🇬 Nigerian Macro-Economic Analysis", {
      description: "Real-time analysis of economic indicators and their market impact",
      className: "bg-blue-600 border-blue-700 text-white",
      duration: 4000,
    });
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'bg-green-600/20 text-green-300 border-green-500';
      case 'negative': return 'bg-red-600/20 text-red-300 border-red-500';
      default: return 'bg-gray-600/20 text-gray-300 border-gray-500';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-600/20 text-red-300 border-red-500';
      case 'medium': return 'bg-yellow-600/20 text-yellow-300 border-yellow-500';
      default: return 'bg-blue-600/20 text-blue-300 border-blue-500';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'down': return <TrendingDown className="h-4 w-4 text-red-400" />;
      default: return <BarChart3 className="h-4 w-4 text-gray-400" />;
    }
  };

  const filteredNews = selectedCategory === 'all' 
    ? newsItems 
    : newsItems.filter(item => item.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All News', icon: Globe },
    { id: 'monetary', label: 'Monetary Policy', icon: DollarSign },
    { id: 'fiscal', label: 'Fiscal Policy', icon: BarChart3 },
    { id: 'sector', label: 'Sector News', icon: Target },
    { id: 'global', label: 'Global Impact', icon: Globe },
    { id: 'regulatory', label: 'Regulatory', icon: AlertTriangle }
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Globe className="h-8 w-8 text-blue-400" />
            <h1 className="text-3xl font-bold text-white">🇳🇬 Nigerian Macro-Economic Analysis</h1>
          </div>
          <p className="text-slate-400">Real-time economic indicators and market impact analysis</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="news">Economic News</TabsTrigger>
            <TabsTrigger value="indicators">Key Indicators</TabsTrigger>
            <TabsTrigger value="analysis">Market Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="space-y-6">
            {/* Category Filter */}
            <Card className="bg-slate-800 border-slate-700">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`flex items-center gap-2 ${
                        selectedCategory === category.id 
                          ? 'bg-blue-600 text-white' 
                          : 'text-slate-300 border-slate-600 hover:bg-slate-700'
                      }`}
                    >
                      <category.icon className="h-4 w-4" />
                      {category.label}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* News Items */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredNews.map((item) => (
                <Card key={item.id} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-200">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-white text-lg leading-tight">{item.title}</CardTitle>
                      <div className="flex flex-col gap-2">
                        <Badge className={getImpactColor(item.impact)}>
                          {item.impact.toUpperCase()}
                        </Badge>
                        <Badge className={getSeverityColor(item.severity)}>
                          {item.severity.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                      <Clock className="h-4 w-4" />
                      <span>{item.timestamp}</span>
                      <span>•</span>
                      <span>{item.source}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-slate-300 leading-relaxed">{item.summary}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h4 className="text-white font-medium mb-2">📊 Market Impact:</h4>
                        <p className="text-slate-300 text-sm">{item.marketImpact}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">💡 Trading Recommendation:</h4>
                        <p className="text-blue-300 text-sm font-medium">{item.tradingRecommendation}</p>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium mb-2">🎯 Affected Sectors:</h4>
                        <div className="flex flex-wrap gap-2">
                          {item.affectedSectors.map((sector) => (
                            <Badge key={sector} className="bg-slate-700 text-slate-300 border-slate-600">
                              {sector}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="indicators" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {macroIndicators.map((indicator) => (
                <Card key={indicator.name} className="bg-slate-800 border-slate-700 hover:border-slate-600 transition-all duration-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-white flex items-center justify-between">
                      <span>{indicator.name}</span>
                      {getTrendIcon(indicator.trend)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-white">
                          {indicator.value.toLocaleString()}
                        </span>
                        <span className="text-slate-400">{indicator.unit}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {indicator.change >= 0 ? (
                          <TrendingUp className="h-4 w-4 text-green-400" />
                        ) : (
                          <TrendingDown className="h-4 w-4 text-red-400" />
                        )}
                        <span className={`font-medium ${
                          indicator.change >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {indicator.change >= 0 ? '+' : ''}{indicator.change}
                        </span>
                      </div>
                      
                      <div className="text-slate-400 text-sm">
                        <div className="flex items-center gap-1 mb-2">
                          <Calendar className="h-3 w-3" />
                          <span>Updated: {indicator.lastUpdated}</span>
                        </div>
                        <p className="leading-relaxed">{indicator.impact}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-400" />
                    Bullish Signals
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-green-900/30 border border-green-600/50 rounded-lg">
                    <h4 className="text-green-300 font-medium mb-2">Rising GDP Growth</h4>
                    <p className="text-slate-300 text-sm">Q3 GDP growth of 3.46% signals economic recovery and supports equity valuations</p>
                  </div>
                  <div className="p-3 bg-green-900/30 border border-green-600/50 rounded-lg">
                    <h4 className="text-green-300 font-medium mb-2">Strengthening Naira</h4>
                    <p className="text-slate-300 text-sm">Currency appreciation reduces import costs and inflation pressures</p>
                  </div>
                  <div className="p-3 bg-green-900/30 border border-green-600/50 rounded-lg">
                    <h4 className="text-green-300 font-medium mb-2">Infrastructure Spending</h4>
                    <p className="text-slate-300 text-sm">₦2T infrastructure plan boosts construction and materials sectors</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-red-400" />
                    Bearish Risks
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 bg-red-900/30 border border-red-600/50 rounded-lg">
                    <h4 className="text-red-300 font-medium mb-2">High Inflation</h4>
                    <p className="text-slate-300 text-sm">28.2% inflation rate pressures consumer spending and corporate margins</p>
                  </div>
                  <div className="p-3 bg-red-900/30 border border-red-600/50 rounded-lg">
                    <h4 className="text-red-300 font-medium mb-2">Rising Interest Rates</h4>
                    <p className="text-slate-300 text-sm">18.75% policy rate increases borrowing costs and hurts rate-sensitive sectors</p>
                  </div>
                  <div className="p-3 bg-red-900/30 border border-red-600/50 rounded-lg">
                    <h4 className="text-red-300 font-medium mb-2">Global Uncertainty</h4>
                    <p className="text-slate-300 text-sm">External headwinds could impact foreign investment flows</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Trading Strategy Recommendations */}
            <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-600/50">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-400" />
                  Strategic Trading Recommendations
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-green-300 font-medium mb-3">BUY Recommendations</h4>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      <li>• Banking stocks (GTCO, ZENITHBANK) - benefit from higher rates</li>
                      <li>• Building materials (DANGCEM, LAFARGE) - infrastructure spending</li>
                      <li>• Consumer staples (NESTLE, UNILEVER) - naira strength helps imports</li>
                      <li>• Oil & gas (SEPLAT, TOTAL) - higher crude prices</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-red-300 font-medium mb-3">AVOID/UNDERWEIGHT</h4>
                    <ul className="space-y-2 text-slate-300 text-sm">
                      <li>• Real estate - high interest rates hurt affordability</li>
                      <li>• Consumer discretionary - inflation pressure</li>
                      <li>• Highly leveraged companies - rising borrowing costs</li>
                      <li>• Import-dependent manufacturers - currency volatility</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MacroEconomicNews;
