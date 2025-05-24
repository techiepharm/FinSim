
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, TrendingUp, Bell, PiggyBank } from "lucide-react";
import CashCardUpdated from './CashCardUpdated';
import SavingsBox from './SavingsBox';
import UserGuidance from './UserGuidance';
import { toast } from "@/components/ui/sonner";

const Dashboard = () => {
  // User info
  const username = "Ezra Folorunso";
  
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
  }, []);
  
  // Get financial advice based on transaction history
  const getFinancialAdvice = () => {
    if (recentTransactions.length > 0) {
      const buyTransactions = recentTransactions.filter(t => t.type === 'BUY').length;
      const sellTransactions = recentTransactions.filter(t => t.type === 'SELL').length;
      const savingsTransactions = recentTransactions.filter(t => 
        t.type === 'SAVINGS_DEPOSIT' || t.type === 'SAVINGS_WITHDRAWAL'
      ).length;
      
      if (savingsTransactions > 0) {
        toast("💡 Smart Saving", {
          description: "Great job using the savings feature! This builds good financial habits.",
          className: "bg-green-600 border-green-700 text-white",
          duration: 5000,
        });
      } else if (buyTransactions > sellTransactions * 2) {
        toast("📈 Trading Tip", {
          description: "You're buying frequently. Consider a more balanced approach to lock in profits.",
          className: "bg-yellow-600 border-yellow-700 text-white",
          duration: 5000,
        });
      } else if (sellTransactions > buyTransactions) {
        toast("📊 Investment Advice", {
          description: "You're selling frequently. Consider longer holding periods for potential growth.",
          className: "bg-yellow-600 border-yellow-700 text-white",
          duration: 5000,
        });
      } else {
        toast("🎯 Financial Advice", {
          description: "Try using the savings box to set aside money for your goals!",
          className: "bg-blue-600 border-blue-700 text-white",
          duration: 5000,
        });
      }
    } else {
      toast("🚀 Get Started", {
        description: "Start by trying the trading simulator or setting up your savings goals!",
        className: "bg-purple-600 border-purple-700 text-white",
        duration: 5000,
      });
    }
  };
  
  const generateFinancialReport = () => {
    toast("📊 Financial Report", {
      description: "Your demo account shows good activity. Keep practicing these skills!",
      className: "bg-green-600 border-green-700 text-white",
      duration: 5000,
    });
  };
  
  const getSavingsRecommendation = () => {
    toast("💰 Savings Tip", {
      description: "Use the savings box to practice setting aside money. Try locking it for discipline!",
      className: "bg-green-600 border-green-700 text-white",
      duration: 5000,
    });
  };

  const handleBalanceUpdate = (newBalance: number) => {
    setAccountBalance(newBalance);
    updateDataFromStorage();
  };
  
  return (
    <div className="min-h-screen bg-slate-900 overflow-y-auto">
      <div className="container mx-auto p-4 space-y-6 max-h-screen overflow-y-auto pb-20">
        <UserGuidance />
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-white">Welcome, {username}</h2>
            <p className="text-slate-400">🎯 Demo Account - Your financial journey at a glance</p>
          </div>
          <Button 
            onClick={getFinancialAdvice}
            className="mt-2 md:mt-0 bg-blue-600 hover:bg-blue-700"
          >
            Get Financial Advice
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <CashCardUpdated availableBalance={accountBalance} />
          
          <SavingsBox 
            availableBalance={accountBalance} 
            onBalanceUpdate={handleBalanceUpdate}
          />
          
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
                onClick={() => window.location.href = '/learning'}
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
                onClick={() => window.location.href = '/trading'}
              >
                <TrendingUp className="mr-2 h-4 w-4" />
                Start Trading
              </Button>
              <Button 
                className="w-full bg-blue-800 hover:bg-blue-700"
                onClick={getSavingsRecommendation}
              >
                <PiggyBank className="mr-2 h-4 w-4" />
                Savings Tips
              </Button>
              <Button 
                className="w-full bg-purple-800 hover:bg-purple-700"
                onClick={() => window.location.href = '/goals'}
              >
                Set Goals
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
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
                  
                  <Button variant="ghost" className="w-full mt-2 text-green-400" onClick={() => window.location.href = '/transactions'}>
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
              
              <Button className="w-full bg-green-600 hover:bg-green-700 mt-2" onClick={() => window.location.href = '/learning'}>
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
    </div>
  );
};

export default Dashboard;
