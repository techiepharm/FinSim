
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, TrendingUp, DollarSign, Target, Calendar, ArrowRight } from "lucide-react";

interface QuickActionsGridProps {
  learningProgress: number;
  completedLessons: number;
  totalLessons: number;
  recentTransactions: any[];
  accountBalance: number;
  onFeatureClick: (featureName: string, description: string) => void;
  onBalanceUpdate: (newBalance: number) => void;
}

const QuickActionsGrid = ({ 
  learningProgress, 
  completedLessons, 
  totalLessons, 
  recentTransactions,
  accountBalance,
  onFeatureClick,
  onBalanceUpdate
}: QuickActionsGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Learning Progress */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            📚 Nigerian Financial Learning Center
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={learningProgress} className="h-2 mb-2" />
          <div className="flex justify-between text-sm mb-3">
            <span className="text-slate-400">Completed: {completedLessons}/{totalLessons} lessons</span>
            <span className="text-green-400">{learningProgress}%</span>
          </div>
          <p className="text-sm text-slate-300 mb-3">Interactive Nigerian financial education with NSE trading quizzes and real-world examples</p>
          <Button 
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={() => {
              onFeatureClick("Nigerian Learning Center", "Improve your Nigerian financial literacy with interactive NSE lessons and quizzes");
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
            ⚡ Quick NSE Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            <p className="text-xs text-slate-400">📊 NSE Trading Platform</p>
            <Button 
              className="w-full bg-green-800 hover:bg-green-700"
              onClick={() => {
                onFeatureClick("NSE Trading Platform", "Access real-time Nigerian Stock Exchange data and make virtual trades to learn investing");
                window.location.href = '/trading';
              }}
            >
              Click Here to Trade NSE Stocks
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-400">🎯 Nigerian Financial Goals</p>
            <Button 
              className="w-full bg-purple-800 hover:bg-purple-700"
              onClick={() => {
                onFeatureClick("Nigerian Financial Goals", "Set and track your Nigerian financial objectives with personalized recommendations");
                window.location.href = '/goals';
              }}
            >
              <Target className="mr-2 h-4 w-4" />
              Click Here to Set ₦ Goals
            </Button>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-slate-400">📅 Nigerian Calendar & Planning</p>
            <Button 
              className="w-full bg-indigo-800 hover:bg-indigo-700"
              onClick={() => {
                onFeatureClick("Nigerian Calendar View", "Track Nigerian financial events, bill due dates, and NSE investment milestones");
                window.location.href = '/calendar';
              }}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Click Here to View Nigerian Calendar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="md:col-span-2 bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            💼 Recent Nigerian Activity Feature
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
                    {transaction.amount >= 0 ? '+' : ''}₦{Math.abs(Number(transaction.amount)).toFixed(2)}
                  </div>
                </div>
              ))}
              
              <Button 
                variant="ghost" 
                className="w-full mt-2 text-green-400" 
                onClick={() => {
                  onFeatureClick("Nigerian Transaction History", "View all your past Nigerian transactions and NSE account activity");
                  window.location.href = '/transactions';
                }}
              >
                Click Here to View All Nigerian Transactions
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-500">
              <p className="mb-4">No Nigerian transactions yet. Start your NSE financial journey!</p>
              <div className="grid grid-cols-2 gap-2">
                <Button 
                  size="sm" 
                  onClick={() => {
                    onFeatureClick("Demo NSE Trading", "Try virtual Nigerian Stock Exchange trading to learn without risk");
                    window.location.href = '/trading';
                  }}
                >
                  Click Here to Try NSE Trading
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    onFeatureClick("Add Virtual Nigerian Funds", "Add demo Nigerian Naira to your account");
                    onBalanceUpdate(accountBalance + 207500);
                  }}
                >
                  Click Here to Add Demo ₦ Funds
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickActionsGrid;
