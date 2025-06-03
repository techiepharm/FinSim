
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, TrendingUp, Bell, PiggyBank, Crown, Users } from "lucide-react";
import CashCardUpdated from './CashCardUpdated';
import SavingsBox from './SavingsBox';
import VirtualCard from './VirtualCard';
import ATMAnimation from './ATMAnimation';
import SavingsGroups from './SavingsGroups';
import UserGuidance from './UserGuidance';
import { toast } from "@/components/ui/sonner";

const Dashboard = () => {
  // User info
  const username = "Ezra Folorunso";
  const [userLevel] = useState<'basic' | 'premium'>('basic'); // Demo: starts as basic
  
  // User account info
  const [accountBalance, setAccountBalance] = useState(1000);
  const [recentTransactions, setRecentTransactions] = useState([]);
  
  // Learning progress
  const learningProgress = 35;
  const completedLessons = 4;
  const totalLessons = 12;
  
  // Load transactions and account balance from localStorage
  const updateDataFromStorage = () => {
    try {
      // Load portfolio for balance
      const storedPortfolio = localStorage.getItem('portfolio');
      if (storedPortfolio) {
        const portfolio = JSON.parse(storedPortfolio);
        setAccountBalance(portfolio.cash);
      }
      
      // Load transactions
      const storedTransactions = localStorage.getItem('transactions');
      if (storedTransactions) {
        const transactions = JSON.parse(storedTransactions);
        setRecentTransactions(transactions.slice(0, 5));
      }
    } catch (e) {
      console.error("Error reading data:", e);
    }
  };
  
  // Update data on mount and when localStorage changes
  useEffect(() => {
    updateDataFromStorage();
    
    // Listen for storage events (triggered by other components)
    window.addEventListener('storage', updateDataFromStorage);
    window.addEventListener('storageUpdate', updateDataFromStorage);
    
    return () => {
      window.removeEventListener('storage', updateDataFromStorage);
      window.removeEventListener('storageUpdate', updateDataFromStorage);
    };
  }, []);
  
  // Financial tips and recommendations
  const [financialTip, setFinancialTip] = useState('');
  
  useEffect(() => {
    const tips = [
      "Consider saving 20% of your income for long-term goals and emergencies.",
      "Track your expenses to identify areas where you can cut back.",
      "Try to limit debt repayments to less than 36% of your gross income.",
      "Invest regularly even in small amounts to benefit from compound interest.",
      "Consider allocating 50% to needs, 30% to wants, and 20% to savings and debt repayment."
    ];
    
    // Show a tip on load
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setFinancialTip(randomTip);
    
    // Show demo account reminder
    setTimeout(() => {
      toast("🎯 Demo Account Active", {
        description: "You're using virtual money - perfect for learning without risk!",
        className: "bg-blue-600 border-blue-700 text-white",
        duration: 6000,
      });
    }, 8000);
  }, [userLevel]);

  const handleBalanceUpdate = (newBalance: number) => {
    setAccountBalance(newBalance);
    updateDataFromStorage();
    // Trigger custom event to update other components
    window.dispatchEvent(new Event('storageUpdate'));
  };

  const handleFeatureClick = (featureName: string, description: string) => {
    toast(`ℹ️ ${featureName}`, {
      description: description,
      className: "bg-blue-600 border-blue-700 text-white",
      duration: 4000,
    });
  };

  const generateFinancialReport = () => {
    handleFeatureClick("Financial Report", "Get insights into your spending patterns and financial health");
    toast("📊 Financial Report Generated", {
      description: "Your demo financial health report shows excellent progress! Keep up the great work.",
      className: "bg-green-600 border-green-700 text-white",
      duration: 4000,
    });
  };
  
  return (
    <div className="min-h-screen bg-slate-900 overflow-y-auto relative">
      <div className="container mx-auto p-4 space-y-6 max-h-screen overflow-y-auto pb-20">
        <UserGuidance />
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-white">Welcome, {username}</h2>
            <p className="text-slate-400">🎯 Demo Account - Your financial journey at a glance</p>
          </div>
        </div>
        
        {/* Balance and Card Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CashCardUpdated availableBalance={accountBalance} />
          <VirtualCard userLevel={userLevel} balance={accountBalance} />
          <SavingsBox 
            availableBalance={accountBalance} 
            onBalanceUpdate={handleBalanceUpdate}
          />
        </div>

        {/* Start Trading Feature */}
        <Card className="bg-gradient-to-r from-green-900/50 to-emerald-800/50 border-green-600/50">
          <CardContent className="p-6 text-center">
            <h3 className="text-3xl font-bold text-green-300 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Ready to Start Trading?
            </h3>
            <p className="text-green-200 mb-6 text-lg">
              Begin your investment journey with our virtual trading platform
            </p>
            <Button 
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg font-semibold"
              onClick={() => {
                handleFeatureClick("Start Trading", "Begin your investment journey with virtual money to learn without risk");
                window.location.href = '/trading';
              }}
            >
              Click Here to Start Trading
            </Button>
          </CardContent>
        </Card>

        {/* New Savings Groups Section */}
        <SavingsGroups userLevel={userLevel} />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Learning Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={learningProgress} className="h-2 mb-2" />
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Completed: {completedLessons}/{totalLessons} lessons</span>
                <span className="text-green-400">{learningProgress}%</span>
              </div>
              <Button 
                className="w-full mt-3 bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  handleFeatureClick("Learning Center", "Improve your financial literacy with interactive lessons and quizzes");
                  window.location.href = '/learning';
                }}
              >
                Continue Learning
              </Button>
            </CardContent>
          </Card>
          
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button 
                className="w-full bg-green-800 hover:bg-green-700"
                onClick={() => {
                  handleFeatureClick("Trading Platform", "Access real-time stock data and make virtual trades to learn investing");
                  window.location.href = '/trading';
                }}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Start Trading
              </Button>
              <Button 
                className="w-full bg-blue-800 hover:bg-blue-700"
                onClick={() => {
                  handleFeatureClick("Savings Groups", "Join or create savings groups to reach financial goals together with friends and family");
                  toast("💰 Tip", { 
                    description: "Use savings groups to reach goals faster with friends and family!",
                    className: "bg-green-600 border-green-700 text-white"
                  });
                }}
              >
                <Users className="mr-2 h-4 w-4" />
                Join Groups
              </Button>
              <Button 
                className="w-full bg-purple-800 hover:bg-purple-700"
                onClick={() => {
                  handleFeatureClick("Financial Goals", "Set and track your financial objectives with personalized recommendations");
                  window.location.href = '/goals';
                }}
              >
                Set Goals
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity and Financial Health Cards */}
          <Card className="md:col-span-2 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent className="max-h-80 overflow-y-auto">
              {recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions.map((transaction, index) => (
                    <div key={transaction.id || index} className="flex justify-between items-center border-b border-slate-700 pb-2">
                      <div>
                        <div className="font-medium text-white">
                          {transaction.symbol || transaction.description || 'Transaction'} 
                          <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                            transaction.type === "BUY" 
                              ? "bg-blue-900/60 text-blue-300" 
                              : transaction.type === "SELL"
                                ? "bg-purple-900/60 text-purple-300"
                                : transaction.type === "SAVINGS_DEPOSIT"
                                  ? "bg-green-900/60 text-green-300"
                                  : transaction.type === "SAVINGS_WITHDRAWAL"
                                    ? "bg-orange-900/60 text-orange-300"
                                    : "bg-gray-900/60 text-gray-300"
                          }`}>
                            {transaction.type.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400">
                          {new Date(transaction.date).toLocaleString()}
                        </div>
                      </div>
                      <div className={transaction.amount >= 0 ? "text-green-400" : "text-red-400"}>
                        {transaction.amount >= 0 ? '+' : ''}${Math.abs(Number(transaction.amount)).toFixed(2)}
                      </div>
                    </div>
                  ))}
                  
                  <Button 
                    variant="ghost" 
                    className="w-full mt-2 text-green-400" 
                    onClick={() => {
                      handleFeatureClick("Transaction History", "View all your past transactions and account activity");
                      window.location.href = '/transactions';
                    }}
                  >
                    View All Transactions
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p className="mb-4">No transactions yet. Start your financial journey!</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button size="sm" onClick={() => window.location.href = '/trading'}>
                      Try Trading
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => window.location.href = '/add-funds'}>
                      Add Funds
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Financial Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Demo Progress:</span>
                <span className="text-green-400">Excellent</span>
              </div>
              <Progress value={85} className="h-2 mb-2" />
              
              <Button 
                onClick={generateFinancialReport}
                className="w-full bg-slate-700 hover:bg-slate-600"
              >
                View Demo Report
              </Button>

              <div className="mt-4 space-y-2">
                <div className="flex items-start">
                  <div className="bg-green-900/30 p-2 rounded mr-3">
                    <BookOpen className="h-5 w-5 text-green-400" />
                  </div>
                  <div>
                    <h4 className="font-medium text-white">Next Lesson</h4>
                    <p className="text-sm text-slate-400">Budgeting Basics</p>
                    <Progress value={75} className="h-1 mt-1" />
                  </div>
                </div>
              </div>
              
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 mt-2" 
                onClick={() => {
                  handleFeatureClick("Continue Learning", "Resume your financial education journey with the next lesson");
                  window.location.href = '/learning';
                }}
              >
                Continue Learning
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Financial Tip Card */}
        <Card className="bg-slate-800 border-slate-700 border-l-4 border-l-green-500">
          <CardContent className="p-4 flex items-start">
            <Bell className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-white mb-1">💡 Daily Financial Tip</h3>
              <p className="text-slate-300">{financialTip}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ATM positioned at bottom right corner */}
      <div className="fixed bottom-4 right-4 z-40">
        <div className="w-80">
          <ATMAnimation 
            balance={accountBalance} 
            onBalanceUpdate={handleBalanceUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
