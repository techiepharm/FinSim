
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, ArrowRight, TrendingUp, Bell, PiggyBank } from "lucide-react";
import CashCardUpdated from './CashCardUpdated';
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  // User account info
  const [accountBalance, setAccountBalance] = useState(() => {
    try {
      const storedPortfolio = localStorage.getItem('portfolio');
      if (storedPortfolio) {
        const portfolio = JSON.parse(storedPortfolio);
        return portfolio.cash || 1000;
      }
      return 1000; // Default starting amount
    } catch (e) {
      console.error("Error reading portfolio data:", e);
      return 1000;
    }
  });
  
  // Learning progress
  const learningProgress = 35;
  const completedLessons = 4;
  const totalLessons = 12;
  
  // Recent transactions
  const [recentTransactions, setRecentTransactions] = useState([]);
  const { toast } = useToast();
  
  // Load transactions from localStorage
  useEffect(() => {
    try {
      const storedTransactions = localStorage.getItem('transactions');
      if (storedTransactions) {
        const transactions = JSON.parse(storedTransactions);
        setRecentTransactions(transactions.slice(0, 3));
      }
    } catch (e) {
      console.error("Error reading transactions:", e);
    }
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
    
    // Show a financial tip notification after 10 seconds
    const tipTimeout = setTimeout(() => {
      toast({
        title: "Financial Tip",
        description: randomTip,
        duration: 8000,
      });
    }, 10000);
    
    // Show a stock recommendation after 30 seconds
    const stockTimeout = setTimeout(() => {
      toast({
        title: "Investment Opportunity",
        description: "AAPL stock is showing positive momentum. Consider researching this opportunity.",
        duration: 8000,
      });
    }, 30000);
    
    return () => {
      clearTimeout(tipTimeout);
      clearTimeout(stockTimeout);
    };
  }, [toast]);
  
  const generateFinancialReport = () => {
    toast({
      title: "Financial Report Generated",
      description: "Your monthly spending is 15% below average. Great job managing expenses!",
      duration: 5000,
    });
  };
  
  const getSavingsRecommendation = () => {
    toast({
      title: "Savings Recommendation",
      description: "Based on your activity, we recommend increasing your emergency fund by allocating an additional 5% of your income.",
      duration: 5000,
    });
  };
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h2 className="text-3xl font-bold mb-6 text-white">Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CashCardUpdated availableBalance={accountBalance} />
        
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
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Financial Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Savings Rate:</span>
              <span className="text-green-400">20%</span>
            </div>
            <Progress value={20} className="h-2 mb-2" />
            
            <Button 
              onClick={generateFinancialReport}
              className="w-full bg-slate-700 hover:bg-slate-600"
            >
              Generate Report
            </Button>
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              className="w-full bg-blue-800 hover:bg-blue-700"
              onClick={getSavingsRecommendation}
            >
              <PiggyBank className="mr-2 h-4 w-4" />
              Savings Recommendations
            </Button>
            <Button 
              className="w-full bg-purple-800 hover:bg-purple-700"
              onClick={() => window.location.href = '/goals'}
            >
              Set Financial Goals
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <Card className="md:col-span-2 bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length > 0 ? (
              <div className="space-y-4">
                {recentTransactions.map((transaction, index) => (
                  <div key={transaction.id || index} className="flex justify-between items-center border-b border-slate-700 pb-2">
                    <div>
                      <div className="font-medium text-white">
                        {transaction.symbol || 'Cash'} 
                        <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          transaction.type === "BUY" 
                            ? "bg-blue-900/60 text-blue-300" 
                            : transaction.type === "SELL"
                              ? "bg-purple-900/60 text-purple-300"
                              : transaction.type === "DEPOSIT"
                                ? "bg-green-900/60 text-green-300"
                                : "bg-orange-900/60 text-orange-300"
                        }`}>
                          {transaction.type}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400">
                        {new Date(transaction.date).toLocaleString()}
                      </div>
                    </div>
                    <div className={transaction.amount >= 0 ? "text-green-400" : "text-red-400"}>
                      {transaction.amount >= 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
                
                <Button variant="ghost" className="w-full mt-2 text-green-400" onClick={() => window.location.href = '/transactions'}>
                  View All Transactions
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            ) : (
              <div className="text-center py-4 text-slate-500">
                No transactions yet. Start trading to see your history.
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Continue Learning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="bg-green-900/30 p-2 rounded mr-3">
                  <BookOpen className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Budgeting Basics</h4>
                  <p className="text-sm text-slate-400">75% complete</p>
                  <Progress value={75} className="h-1 mt-1" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-start">
                <div className="bg-green-900/30 p-2 rounded mr-3">
                  <TrendingUp className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Intro to Investing</h4>
                  <p className="text-sm text-slate-400">40% complete</p>
                  <Progress value={40} className="h-1 mt-1" />
                </div>
              </div>
            </div>
            
            <Button className="w-full bg-green-600 hover:bg-green-700 mt-2" onClick={() => window.location.href = '/learning'}>
              Go to Learning Center
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
            <h3 className="font-medium text-white mb-1">Financial Tip</h3>
            <p className="text-slate-300">{financialTip}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
