
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  TrendingDown, 
  TrendingUp, 
  PiggyBank, 
  ShoppingCart,
  Coffee,
  Car,
  Home,
  Smartphone,
  AlertCircle,
  CheckCircle,
  Lightbulb
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

interface SpendingCategory {
  name: string;
  amount: number;
  percentage: number;
  trend: 'up' | 'down' | 'stable';
  icon: React.ReactNode;
  color: string;
}

interface Suggestion {
  id: string;
  type: 'save' | 'reduce' | 'optimize' | 'invest';
  category: string;
  title: string;
  description: string;
  potentialSavings: number;
  priority: 'high' | 'medium' | 'low';
  icon: React.ReactNode;
}

const AISpendingAdvisor = () => {
  const [spendingData, setSpendingData] = useState<SpendingCategory[]>([]);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month'>('month');
  const [totalSpending, setTotalSpending] = useState(0);

  useEffect(() => {
    // Mock spending data - in real app, this would analyze actual transactions
    const mockSpending: SpendingCategory[] = [
      {
        name: 'Food & Dining',
        amount: 45000,
        percentage: 35,
        trend: 'up',
        icon: <Coffee className="h-4 w-4" />,
        color: '#F59E0B'
      },
      {
        name: 'Transportation',
        amount: 25000,
        percentage: 20,
        trend: 'stable',
        icon: <Car className="h-4 w-4" />,
        color: '#3B82F6'
      },
      {
        name: 'Shopping',
        amount: 20000,
        percentage: 15,
        trend: 'up',
        icon: <ShoppingCart className="h-4 w-4" />,
        color: '#8B5CF6'
      },
      {
        name: 'Bills & Utilities',
        amount: 18000,
        percentage: 14,
        trend: 'stable',
        icon: <Home className="h-4 w-4" />,
        color: '#10B981'
      },
      {
        name: 'Entertainment',
        amount: 12000,
        percentage: 9,
        trend: 'down',
        icon: <Smartphone className="h-4 w-4" />,
        color: '#EF4444'
      },
      {
        name: 'Others',
        amount: 8000,
        percentage: 6,
        trend: 'stable',
        icon: <PiggyBank className="h-4 w-4" />,
        color: '#6B7280'
      }
    ];

    setSpendingData(mockSpending);
    setTotalSpending(mockSpending.reduce((sum, cat) => sum + cat.amount, 0));

    // Generate AI suggestions based on spending patterns
    const aiSuggestions: Suggestion[] = [
      {
        id: '1',
        type: 'reduce',
        category: 'Food & Dining',
        title: 'Reduce Food Delivery Expenses',
        description: 'You spent ₦45,000 on food this month. Consider cooking at home 3 more days per week to save money.',
        potentialSavings: 15000,
        priority: 'high',
        icon: <Coffee className="h-5 w-5" />
      },
      {
        id: '2',
        type: 'optimize',
        category: 'Transportation',
        title: 'Optimize Your Commute',
        description: 'Switch to bus/BRT for 2 days a week instead of ride-hailing apps. This can significantly reduce costs.',
        potentialSavings: 8000,
        priority: 'medium',
        icon: <Car className="h-5 w-5" />
      },
      {
        id: '3',
        type: 'save',
        category: 'Shopping',
        title: 'Set Shopping Budget',
        description: 'Your shopping expenses increased by 25%. Set a monthly limit of ₦15,000 and stick to a shopping list.',
        potentialSavings: 5000,
        priority: 'medium',
        icon: <ShoppingCart className="h-5 w-5" />
      },
      {
        id: '4',
        type: 'invest',
        category: 'Savings',
        title: 'Invest Your Savings',
        description: 'With the money saved from these optimizations, consider investing ₦20,000 monthly in NSE blue-chip stocks.',
        potentialSavings: 0,
        priority: 'high',
        icon: <TrendingUp className="h-5 w-5" />
      }
    ];

    setSuggestions(aiSuggestions);
  }, [selectedTimeframe]);

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-4 w-4 text-red-400" />;
      case 'down':
        return <TrendingDown className="h-4 w-4 text-green-400" />;
      default:
        return <div className="h-4 w-4 rounded-full bg-gray-400" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'save':
        return <PiggyBank className="h-4 w-4 text-green-400" />;
      case 'reduce':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      case 'optimize':
        return <Lightbulb className="h-4 w-4 text-yellow-400" />;
      case 'invest':
        return <TrendingUp className="h-4 w-4 text-blue-400" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const applySuggestion = (suggestion: Suggestion) => {
    toast("✅ Suggestion Applied", {
      description: `Great! You've applied the "${suggestion.title}" suggestion. Track your progress next month.`,
      className: "bg-green-600 border-green-700 text-white",
      duration: 4000,
    });
  };

  const chartData = spendingData.map(item => ({
    name: item.name,
    value: item.amount,
    color: item.color
  }));

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">AI Spending Advisor</h1>
          </div>
          <p className="text-slate-400">Smart insights for your Nigerian spending habits</p>
        </div>

        {/* Time Period Selector */}
        <Card className="bg-slate-800 border-slate-700 mb-6 animate-slide-in-bottom">
          <CardContent className="p-4">
            <div className="flex justify-center gap-2">
              {['week', 'month'].map((period) => (
                <button
                  key={period}
                  onClick={() => setSelectedTimeframe(period as any)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedTimeframe === period
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  This {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Spending Overview */}
          <Card className="bg-slate-800 border-slate-700 animate-scale-up">
            <CardHeader>
              <CardTitle className="text-white">Spending Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 mb-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any) => [`₦${value.toLocaleString()}`, 'Amount']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="text-center mb-4">
                <p className="text-slate-400 text-sm">Total Spending</p>
                <p className="text-2xl font-bold text-white">₦{totalSpending.toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>

          {/* Category Details */}
          <Card className="bg-slate-800 border-slate-700 animate-scale-up delay-100">
            <CardHeader>
              <CardTitle className="text-white">Category Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {spendingData.map((category, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-slate-700/50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg" style={{ backgroundColor: `${category.color}20` }}>
                        {category.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{category.name}</h4>
                        <p className="text-slate-400 text-sm">{category.percentage}% of total</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">₦{category.amount.toLocaleString()}</span>
                        {getTrendIcon(category.trend)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Suggestions */}
        <Card className="bg-slate-800 border-slate-700 animate-fade-in delay-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-400" />
              AI Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {suggestions.map((suggestion) => (
                <div
                  key={suggestion.id}
                  className="p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:border-slate-500 transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(suggestion.type)}
                      <Badge className={getPriorityColor(suggestion.priority)}>
                        {suggestion.priority} priority
                      </Badge>
                    </div>
                    {suggestion.potentialSavings > 0 && (
                      <span className="text-green-400 font-medium text-sm">
                        Save ₦{suggestion.potentialSavings.toLocaleString()}
                      </span>
                    )}
                  </div>
                  
                  <h4 className="text-white font-medium mb-2">{suggestion.title}</h4>
                  <p className="text-slate-300 text-sm mb-4">{suggestion.description}</p>
                  
                  <Button
                    size="sm"
                    onClick={() => applySuggestion(suggestion)}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Apply Suggestion
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <Card className="bg-gradient-to-r from-green-900/50 to-green-800/50 border-green-600/50 animate-slide-in-right">
            <CardContent className="p-4 text-center">
              <PiggyBank className="h-8 w-8 text-green-400 mx-auto mb-2" />
              <p className="text-green-300 font-medium">Potential Monthly Savings</p>
              <p className="text-2xl font-bold text-white">₦28,000</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-900/50 to-blue-800/50 border-blue-600/50 animate-slide-in-right delay-100">
            <CardContent className="p-4 text-center">
              <TrendingUp className="h-8 w-8 text-blue-400 mx-auto mb-2" />
              <p className="text-blue-300 font-medium">Investment Potential</p>
              <p className="text-2xl font-bold text-white">₦20,000</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-900/50 to-purple-800/50 border-purple-600/50 animate-slide-in-right delay-200">
            <CardContent className="p-4 text-center">
              <Brain className="h-8 w-8 text-purple-400 mx-auto mb-2" />
              <p className="text-purple-300 font-medium">Optimization Score</p>
              <p className="text-2xl font-bold text-white">7.5/10</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AISpendingAdvisor;
