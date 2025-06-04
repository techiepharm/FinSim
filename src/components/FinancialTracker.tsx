
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, DollarSign, PieChart, Calendar } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface Transaction {
  id: number;
  date: string;
  type: string;
  symbol?: string;
  description?: string;
  amount: number;
}

interface FinancialMetrics {
  totalIncome: number;
  totalExpenses: number;
  netFlow: number;
  savingsRate: number;
  investmentGains: number;
  monthlyData: Array<{
    month: string;
    income: number;
    expenses: number;
    savings: number;
  }>;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
}

const FinancialTracker = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [metrics, setMetrics] = useState<FinancialMetrics>({
    totalIncome: 0,
    totalExpenses: 0,
    netFlow: 0,
    savingsRate: 0,
    investmentGains: 0,
    monthlyData: [],
    categoryBreakdown: []
  });

  useEffect(() => {
    loadTransactions();
    
    // Listen for new transactions
    const handleStorageUpdate = () => {
      loadTransactions();
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('storageUpdate', handleStorageUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('storageUpdate', handleStorageUpdate);
    };
  }, []);

  const loadTransactions = () => {
    try {
      const storedTransactions = localStorage.getItem('transactions');
      if (storedTransactions) {
        const txns = JSON.parse(storedTransactions);
        setTransactions(txns);
        calculateMetrics(txns);
      }
    } catch (e) {
      console.error('Error loading transactions:', e);
    }
  };

  const calculateMetrics = (txns: Transaction[]) => {
    const now = new Date();
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 6, 1);
    
    // Filter transactions from last 6 months
    const recentTxns = txns.filter(txn => new Date(txn.date) >= sixMonthsAgo);
    
    let totalIncome = 0;
    let totalExpenses = 0;
    let investmentGains = 0;
    const monthlyData = new Map();
    const categoryData = new Map();

    // Initialize monthly data for last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      monthlyData.set(monthKey, { month: monthKey, income: 0, expenses: 0, savings: 0 });
    }

    recentTxns.forEach(txn => {
      const txnDate = new Date(txn.date);
      const monthKey = txnDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      const monthData = monthlyData.get(monthKey) || { month: monthKey, income: 0, expenses: 0, savings: 0 };
      
      const amount = Math.abs(txn.amount);
      
      if (txn.amount > 0) {
        totalIncome += amount;
        monthData.income += amount;
        
        if (txn.type === 'SELL') {
          investmentGains += amount;
        }
      } else {
        totalExpenses += amount;
        monthData.expenses += Math.abs(amount);
        
        // Categorize expenses
        let category = 'Other';
        if (txn.type === 'BUY') category = 'Investments';
        else if (txn.type === 'SAVINGS_DEPOSIT') category = 'Savings';
        else if (txn.type === 'PREMIUM_UPGRADE') category = 'Subscriptions';
        
        const categoryAmount = categoryData.get(category) || 0;
        categoryData.set(category, categoryAmount + Math.abs(amount));
      }
      
      if (txn.type === 'SAVINGS_DEPOSIT') {
        monthData.savings += Math.abs(amount);
      }
      
      monthlyData.set(monthKey, monthData);
    });

    const netFlow = totalIncome - totalExpenses;
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    // Convert category data to array with percentages
    const totalCategoryExpenses = Array.from(categoryData.values()).reduce((sum, amount) => sum + amount, 0);
    const categoryBreakdown = Array.from(categoryData.entries()).map(([category, amount]) => ({
      category,
      amount,
      percentage: totalCategoryExpenses > 0 ? (amount / totalCategoryExpenses) * 100 : 0
    })).sort((a, b) => b.amount - a.amount);

    setMetrics({
      totalIncome,
      totalExpenses,
      netFlow,
      savingsRate,
      investmentGains,
      monthlyData: Array.from(monthlyData.values()),
      categoryBreakdown
    });
  };

  const getMetricColor = (value: number) => {
    return value >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const getMetricIcon = (value: number) => {
    return value >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Income (6M)</p>
                <p className="text-2xl font-bold text-green-400">${metrics.totalIncome.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-green-900/30 rounded-full flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Total Expenses */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Total Expenses (6M)</p>
                <p className="text-2xl font-bold text-red-400">${metrics.totalExpenses.toFixed(2)}</p>
              </div>
              <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-red-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Net Cash Flow */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Net Cash Flow</p>
                <p className={`text-2xl font-bold ${getMetricColor(metrics.netFlow)}`}>
                  ${metrics.netFlow.toFixed(2)}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                metrics.netFlow >= 0 ? 'bg-green-900/30' : 'bg-red-900/30'
              }`}>
                {getMetricIcon(metrics.netFlow)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Savings Rate */}
        <Card className="bg-slate-800 border-slate-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">Savings Rate</p>
                <p className={`text-2xl font-bold ${getMetricColor(metrics.savingsRate)}`}>
                  {metrics.savingsRate.toFixed(1)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center">
                <PieChart className="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trends Chart */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Monthly Financial Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.monthlyData}>
                <defs>
                  <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" tick={{ fill: '#9ca3af' }} stroke="#4b5563" />
                <YAxis tick={{ fill: '#9ca3af' }} stroke="#4b5563" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', borderColor: '#374151', color: '#f9fafb' }}
                  labelStyle={{ color: '#f9fafb' }}
                />
                <Area type="monotone" dataKey="income" stroke="#10b981" fill="url(#colorIncome)" />
                <Area type="monotone" dataKey="expenses" stroke="#ef4444" fill="url(#colorExpenses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Expense Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Expense Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {metrics.categoryBreakdown.map((category, index) => (
                <div key={category.category} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ 
                        backgroundColor: [
                          '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'
                        ][index % 6]
                      }}
                    />
                    <span className="text-white">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-medium">${category.amount.toFixed(2)}</div>
                    <div className="text-slate-400 text-sm">{category.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Health Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <span className="text-slate-300">Emergency Fund Status</span>
                <Badge className={metrics.savingsRate > 20 ? 'bg-green-600' : 'bg-yellow-600'}>
                  {metrics.savingsRate > 20 ? 'Good' : 'Needs Work'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <span className="text-slate-300">Investment Activity</span>
                <Badge className={metrics.investmentGains > 0 ? 'bg-green-600' : 'bg-slate-600'}>
                  {metrics.investmentGains > 0 ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-700 rounded">
                <span className="text-slate-300">Spending Trend</span>
                <Badge className={metrics.netFlow >= 0 ? 'bg-green-600' : 'bg-red-600'}>
                  {metrics.netFlow >= 0 ? 'Under Control' : 'Overspending'}
                </Badge>
              </div>
            </div>

            <div className="mt-4 p-3 bg-blue-900/30 border border-blue-600/50 rounded">
              <p className="text-blue-300 text-sm">
                💡 <strong>Recommendation:</strong> {
                  metrics.savingsRate < 10 
                    ? "Try to save at least 10% of your income. Consider reducing expenses in your highest category."
                    : metrics.savingsRate < 20
                    ? "Great start! Aim for 20% savings rate to build wealth faster."
                    : "Excellent savings rate! Consider increasing your investment allocation for long-term growth."
                }
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialTracker;
