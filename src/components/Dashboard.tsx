
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, TrendingUp, Bell, PiggyBank, Crown, Users, DollarSign, Target, Calendar } from "lucide-react";
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
        
        {/* Header with ATM */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 relative">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-2 text-white">Welcome, {username}</h2>
            <p className="text-slate-400">🎯 Demo Account - Your financial journey at a glance</p>
          </div>
          
          {/* Small ATM positioned at top right */}
          <div className="absolute top-0 right-0 z-30">
            <div className="w-48 h-40 scale-75 origin-top-right">
              <ATMAnimation 
                balance={accountBalance} 
                onBalanceUpdate={handleBalanceUpdate}
              />
            </div>
          </div>
        </div>
        
        {/* Balance and Card Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          <div className="space-y-4">
            <CashCardUpdated availableBalance={accountBalance} />
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-2">💳 Cash Management Feature</p>
              <Button 
                size="sm" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  handleFeatureClick("Cash Management", "Manage your cash balance and view transaction history");
                  toast("💰 Demo Cash", { description: "Your virtual cash balance is ready for trading and savings!" });
                }}
              >
                Click Here to Manage Cash
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <VirtualCard userLevel={userLevel} balance={accountBalance} />
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-2">💳 Virtual Card Feature</p>
              <Button 
                size="sm" 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  handleFeatureClick("Virtual Card", "Use your virtual debit card for demo transactions");
                  toast("💳 Virtual Card Ready", { description: "Your demo card is active and ready to use!" });
                }}
              >
                Click Here to Use Virtual Card
              </Button>
            </div>
          </div>
          
          <div className="space-y-4">
            <SavingsBox 
              availableBalance={accountBalance} 
              onBalanceUpdate={handleBalanceUpdate}
            />
            <div className="text-center">
              <p className="text-sm text-slate-400 mb-2">🏦 Savings Feature</p>
              <Button 
                size="sm" 
                className="w-full bg-green-600 hover:bg-green-700"
                onClick={() => {
                  handleFeatureClick("Savings Account", "Build your savings with automatic deposits and interest");
                  toast("💰 Savings Active", { description: "Your savings account is earning virtual interest!" });
                }}
              >
                Click Here to Manage Savings
              </Button>
            </div>
          </div>
        </div>

        {/* Start Trading Feature */}
        <Card className="bg-gradient-to-r from-green-900/50 to-emerald-800/50 border-green-600/50">
          <CardContent className="p-6 text-center">
            <h3 className="text-3xl font-bold text-green-300 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              📈 Stock Trading Platform
            </h3>
            <p className="text-green-200 mb-6 text-lg">
              Begin your investment journey with our virtual trading platform featuring real-time data and detailed stock charts
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

        {/* Enhanced Savings Groups Section */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-400" />
                💰 Savings Groups Feature
              </div>
              {userLevel === 'basic' && (
                <Crown className="h-5 w-5 text-yellow-400" />
              )}
            </CardTitle>
            <CardDescription className="text-slate-300">
              Join or create savings groups to reach financial goals together
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <SavingsGroups userLevel={userLevel} />
            <div className="text-center pt-4 border-t border-slate-600">
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  handleFeatureClick("Savings Groups", "Collaborate with family and friends to reach savings goals faster");
                  toast("👥 Demo Groups Available", { description: "Join Family or Friends groups, or upgrade for more options!" });
                }}
              >
                Click Here to Join Savings Groups
              </Button>
              {userLevel === 'basic' && (
                <p className="text-xs text-slate-400 mt-2">
                  💎 Upgrade to Premium to create custom groups beyond Family & Friends
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Learning Progress */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                📚 Learning Center
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Progress value={learningProgress} className="h-2 mb-2" />
              <div className="flex justify-between text-sm mb-3">
                <span className="text-slate-400">Completed: {completedLessons}/{totalLessons} lessons</span>
                <span className="text-green-400">{learningProgress}%</span>
              </div>
              <p className="text-sm text-slate-300 mb-3">Interactive financial education with quizzes and real-world examples</p>
              <Button 
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => {
                  handleFeatureClick("Learning Center", "Improve your financial literacy with interactive lessons and quizzes");
                  window.location.href = '/learning';
                }}
              >
                Click Here to Continue Learning
              </Button>
            </CardContent>
          </Card>
          
          {/* Quick Actions */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                ⚡ Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <p className="text-xs text-slate-400">📊 Trading Platform</p>
                <Button 
                  className="w-full bg-green-800 hover:bg-green-700"
                  onClick={() => {
                    handleFeatureClick("Trading Platform", "Access real-time stock data and make virtual trades to learn investing");
                    window.location.href = '/trading';
                  }}
                >
                  Click Here to Trade Stocks
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-400">🎯 Financial Goals</p>
                <Button 
                  className="w-full bg-purple-800 hover:bg-purple-700"
                  onClick={() => {
                    handleFeatureClick("Financial Goals", "Set and track your financial objectives with personalized recommendations");
                    window.location.href = '/goals';
                  }}
                >
                  <Target className="mr-2 h-4 w-4" />
                  Click Here to Set Goals
                </Button>
              </div>
              <div className="space-y-2">
                <p className="text-xs text-slate-400">📅 Calendar & Planning</p>
                <Button 
                  className="w-full bg-indigo-800 hover:bg-indigo-700"
                  onClick={() => {
                    handleFeatureClick("Calendar View", "Track financial events, bill due dates, and investment milestones");
                    window.location.href = '/calendar';
                  }}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Click Here to View Calendar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity and Financial Health Cards */}
          <Card className="md:col-span-2 bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                💼 Recent Activity Feature
              </CardTitle>
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
                    Click Here to View All Transactions
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <p className="mb-4">No transactions yet. Start your financial journey!</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button 
                      size="sm" 
                      onClick={() => {
                        handleFeatureClick("Demo Trading", "Try virtual trading to learn without risk");
                        window.location.href = '/trading';
                      }}
                    >
                      Click Here to Try Trading
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        handleFeatureClick("Add Virtual Funds", "Add demo money to your account");
                        toast("💰 Demo Funds", { description: "Added $500 virtual funds to your account!" });
                        setAccountBalance(prev => prev + 500);
                      }}
                    >
                      Click Here to Add Demo Funds
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
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5" />
                📊 Financial Health Feature
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Demo Progress:</span>
                <span className="text-green-400">Excellent</span>
              </div>
              <Progress value={85} className="h-2 mb-2" />
              <p className="text-sm text-slate-300 mb-3">Get comprehensive analysis of your financial health with actionable insights</p>
              
              <Button 
                onClick={generateFinancialReport}
                className="w-full bg-slate-700 hover:bg-slate-600"
              >
                Click Here to Generate Financial Report
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
                Click Here to Continue Learning
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </CardContent>
          </Card>

          {/* Portfolio Overview */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                📈 Portfolio Feature
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">${accountBalance.toFixed(2)}</p>
                <p className="text-sm text-slate-400">Total Portfolio Value</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Cash</span>
                  <span className="text-white">${accountBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Stocks</span>
                  <span className="text-white">$0.00</span>
                </div>
              </div>
              <p className="text-sm text-slate-300">View detailed portfolio analysis and performance metrics</p>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  handleFeatureClick("Portfolio Management", "Track your investments and analyze performance");
                  window.location.href = '/portfolio';
                }}
              >
                Click Here to View Portfolio
              </Button>
            </CardContent>
          </Card>

          {/* Transaction History */}
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Receipt className="h-5 w-5" />
                📋 Transaction History Feature
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">{recentTransactions.length}</p>
                <p className="text-sm text-slate-400">Recent Transactions</p>
              </div>
              <p className="text-sm text-slate-300">Complete transaction history with filtering and export options</p>
              <Button 
                className="w-full bg-indigo-600 hover:bg-indigo-700"
                onClick={() => {
                  handleFeatureClick("Transaction History", "View complete transaction history with advanced filtering");
                  window.location.href = '/transactions';
                }}
              >
                Click Here to View All Transactions
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Financial Tip Card */}
        <Card className="bg-slate-800 border-slate-700 border-l-4 border-l-green-500">
          <CardContent className="p-4 flex items-start">
            <Bell className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-medium text-white mb-1">💡 Daily Financial Tip Feature</h3>
              <p className="text-slate-300 mb-3">{financialTip}</p>
              <Button 
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  handleFeatureClick("Financial Tips", "Get daily personalized financial advice and tips");
                  toast("💡 More Tips Available", { description: "Visit the Learning Center for comprehensive financial education!" });
                }}
              >
                Click Here for More Financial Tips
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
