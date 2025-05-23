import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { CheckCircle, BookOpen, ArrowRight, TrendingUp } from "lucide-react";
import OnboardingTutorial from './OnboardingTutorial';
import AppWelcome from './AppWelcome';
import CashCardUpdated from './CashCardUpdated';

const Dashboard = () => {
  // State for onboarding
  const [showWelcome, setShowWelcome] = useState(true);
  const [showTutorial, setShowTutorial] = useState(false);
  
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
  
  // Check if this is the first visit
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    if (hasVisitedBefore) {
      setShowWelcome(false);
    } else {
      setShowWelcome(true);
    }
  }, []);
  
  // Handle getting started
  const handleGetStarted = () => {
    localStorage.setItem('hasVisitedBefore', 'true');
    setShowWelcome(false);
    setShowTutorial(true);
  };
  
  // If welcome screen should be shown
  if (showWelcome) {
    return <AppWelcome onGetStarted={handleGetStarted} />;
  }
  
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
      
      {/* Tutorial Dialog */}
      <OnboardingTutorial 
        isOpen={showTutorial} 
        onClose={() => setShowTutorial(false)} 
      />
      
      {/* Help Button */}
      <Button 
        className="fixed bottom-20 right-4 bg-slate-700 hover:bg-slate-600 text-white shadow-lg"
        onClick={() => setShowTutorial(true)}
      >
        <CheckCircle className="h-4 w-4 mr-2" />
        App Tutorial
      </Button>
    </div>
  );
};

export default Dashboard;
