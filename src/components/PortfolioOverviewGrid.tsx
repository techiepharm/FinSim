
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Target, PieChart, Receipt, BookOpen, ArrowRight, Bell } from "lucide-react";

interface PortfolioOverviewGridProps {
  accountBalance: number;
  recentTransactions: any[];
  financialTip: string;
  onFeatureClick: (featureName: string, description: string) => void;
  onGenerateFinancialReport: () => void;
}

const PortfolioOverviewGrid = ({ 
  accountBalance, 
  recentTransactions, 
  financialTip, 
  onFeatureClick, 
  onGenerateFinancialReport 
}: PortfolioOverviewGridProps) => {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        {/* Financial Health card */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Target className="h-5 w-5" />
              📊 Nigerian Financial Health Feature
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Nigerian Demo Progress:</span>
              <span className="text-green-400">Excellent</span>
            </div>
            <Progress value={85} className="h-2 mb-2" />
            <p className="text-sm text-slate-300 mb-3">Get comprehensive analysis of your Nigerian financial health with actionable NSE insights</p>
            
            <Button 
              onClick={onGenerateFinancialReport}
              className="w-full bg-slate-700 hover:bg-slate-600"
            >
              Click Here to Generate Nigerian Financial Report
            </Button>

            <div className="mt-4 space-y-2">
              <div className="flex items-start">
                <div className="bg-green-900/30 p-2 rounded mr-3">
                  <BookOpen className="h-5 w-5 text-green-400" />
                </div>
                <div>
                  <h4 className="font-medium text-white">Next Lesson</h4>
                  <p className="text-sm text-slate-400">Nigerian Budgeting Basics</p>
                  <Progress value={75} className="h-1 mt-1" />
                </div>
              </div>
            </div>
            
            <Button 
              className="w-full bg-green-600 hover:bg-green-700 mt-2" 
              onClick={() => {
                onFeatureClick("Continue Nigerian Learning", "Resume your Nigerian financial education journey with the next lesson");
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
              📈 Nigerian Portfolio Feature
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">₦{accountBalance.toLocaleString()}</p>
              <p className="text-sm text-slate-400">Total Nigerian Portfolio Value</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Cash (₦)</span>
                <span className="text-white">₦{accountBalance.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">NSE Stocks</span>
                <span className="text-white">₦0.00</span>
              </div>
            </div>
            <p className="text-sm text-slate-300">View detailed Nigerian portfolio analysis and NSE performance metrics</p>
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                onFeatureClick("Nigerian Portfolio Management", "Track your NSE investments and analyze performance in Nigerian Naira");
                window.location.href = '/portfolio';
              }}
            >
              Click Here to View Nigerian Portfolio
            </Button>
          </CardContent>
        </Card>

        {/* Transaction History */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Receipt className="h-5 w-5" />
              📋 Nigerian Transaction History Feature
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{recentTransactions.length}</p>
              <p className="text-sm text-slate-400">Recent Nigerian Transactions</p>
            </div>
            <p className="text-sm text-slate-300">Complete Nigerian transaction history with filtering and export options</p>
            <Button 
              className="w-full bg-indigo-600 hover:bg-indigo-700"
              onClick={() => {
                onFeatureClick("Nigerian Transaction History", "View complete Nigerian transaction history with advanced filtering");
                window.location.href = '/transactions';
              }}
            >
              Click Here to View All Nigerian Transactions
            </Button>
          </CardContent>
        </Card>
      </div>
      
      {/* Financial Tip Card */}
      <Card className="bg-slate-800 border-slate-700 border-l-4 border-l-green-500">
        <CardContent className="p-4 flex items-start">
          <Bell className="h-6 w-6 text-green-400 mr-3 mt-1 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-medium text-white mb-1">💡 Daily Nigerian Financial Tip Feature</h3>
            <p className="text-slate-300 mb-3">{financialTip}</p>
            <Button 
              size="sm"
              className="bg-green-600 hover:bg-green-700"
              onClick={() => {
                onFeatureClick("Nigerian Financial Tips", "Get daily personalized Nigerian financial advice and NSE tips");
              }}
            >
              Click Here for More Nigerian Financial Tips
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default PortfolioOverviewGrid;
