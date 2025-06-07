import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  FileText, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Target, 
  AlertTriangle,
  CheckCircle,
  ArrowRight,
  PieChart,
  BarChart3
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Transaction {
  id: number;
  date: string;
  type: string;
  symbol?: string;
  shares?: number;
  price?: number;
  total: number;
  description: string;
}

interface FinancialReportAnalysisProps {
  transactions: Transaction[];
  portfolioValue: number;
  cashBalance: number;
  totalGain: number;
}

const FinancialReportAnalysis = ({ 
  transactions, 
  portfolioValue, 
  cashBalance, 
  totalGain 
}: FinancialReportAnalysisProps) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showFullReport, setShowFullReport] = useState(false);

  const analyzeTransactions = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      setIsAnalyzing(false);
      setShowFullReport(true);
      toast.success("Financial Analysis Complete", {
        description: "Your detailed financial report is ready with personalized recommendations.",
      });
    }, 2000);
  };

  // Calculate transaction patterns
  const buyTransactions = transactions.filter(t => t.type === 'BUY');
  const sellTransactions = transactions.filter(t => t.type === 'SELL');
  const savingsTransactions = transactions.filter(t => t.type.includes('SAVINGS'));
  
  const totalInvested = buyTransactions.reduce((sum, t) => sum + Math.abs(t.total), 0);
  const totalDivested = sellTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalSaved = savingsTransactions.reduce((sum, t) => sum + (t.total > 0 ? t.total : 0), 0);

  // Risk assessment
  const getRiskLevel = () => {
    const investmentRatio = totalInvested / (portfolioValue + cashBalance);
    if (investmentRatio > 0.8) return { level: 'High', color: 'text-red-400', score: 85 };
    if (investmentRatio > 0.6) return { level: 'Moderate', color: 'text-yellow-400', score: 65 };
    return { level: 'Conservative', color: 'text-green-400', score: 35 };
  };

  const riskAssessment = getRiskLevel();

  // Generate recommendations
  const getRecommendations = () => {
    const recommendations = [];
    
    if (cashBalance / portfolioValue > 0.3) {
      recommendations.push({
        type: 'opportunity',
        icon: <TrendingUp className="h-4 w-4" />,
        title: 'Consider Investing Excess Cash',
        description: 'You have significant cash reserves. Consider diversifying into stocks or savings.',
        priority: 'medium'
      });
    }
    
    if (buyTransactions.length > sellTransactions.length * 3) {
      recommendations.push({
        type: 'balance',
        icon: <Target className="h-4 w-4" />,
        title: 'Review Portfolio Balance',
        description: 'You\'ve been primarily buying. Consider taking some profits.',
        priority: 'low'
      });
    }
    
    if (totalSaved < totalInvested * 0.2) {
      recommendations.push({
        type: 'safety',
        icon: <AlertTriangle className="h-4 w-4" />,
        title: 'Build Emergency Savings',
        description: 'Consider increasing your emergency fund before additional investments.',
        priority: 'high'
      });
    }
    
    if (totalGain > totalInvested * 0.1) {
      recommendations.push({
        type: 'success',
        icon: <CheckCircle className="h-4 w-4" />,
        title: 'Strong Performance',
        description: 'Your portfolio is performing well. Consider your exit strategy.',
        priority: 'low'
      });
    }

    return recommendations;
  };

  const recommendations = getRecommendations();

  if (!showFullReport) {
    return (
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            Financial Report & Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="bg-slate-700 p-6 rounded-lg">
            <BarChart3 className="h-12 w-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-white font-medium mb-2">Comprehensive Analysis Ready</h3>
            <p className="text-slate-300 text-sm mb-4">
              Analyze your {transactions.length} transactions and get personalized recommendations
            </p>
            <Button 
              onClick={analyzeTransactions}
              disabled={isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Financial Report
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Report Summary */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-blue-400" />
            Financial Health Report
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-slate-400 text-sm">Portfolio Value</p>
              <p className="text-white font-bold text-lg">₦{portfolioValue.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">Total Gain/Loss</p>
              <p className={`font-bold text-lg ${totalGain >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalGain >= 0 ? '+' : ''}₦{totalGain.toFixed(2)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">Cash Balance</p>
              <p className="text-white font-bold text-lg">₦{cashBalance.toFixed(2)}</p>
            </div>
            <div className="text-center">
              <p className="text-slate-400 text-sm">Risk Level</p>
              <p className={`font-bold text-lg ${riskAssessment.color}`}>
                {riskAssessment.level}
              </p>
            </div>
          </div>

          {/* Risk Assessment */}
          <div className="bg-slate-700 p-4 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-white font-medium">Risk Assessment</h4>
              <Badge className={`${riskAssessment.color.replace('text-', 'bg-').replace('-400', '-600/20')} ${riskAssessment.color}`}>
                {riskAssessment.level}
              </Badge>
            </div>
            <Progress value={riskAssessment.score} className="h-2 mb-2" />
            <p className="text-slate-300 text-sm">
              Based on your investment allocation and transaction patterns
            </p>
          </div>

          {/* Transaction Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-green-400" />
                <span className="text-green-400 font-medium">Purchases</span>
              </div>
              <p className="text-white text-xl font-bold">{buyTransactions.length}</p>
              <p className="text-slate-300 text-sm">₦{totalInvested.toFixed(2)} invested</p>
            </div>
            
            <div className="bg-blue-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-blue-400" />
                <span className="text-blue-400 font-medium">Savings</span>
              </div>
              <p className="text-white text-xl font-bold">{savingsTransactions.length}</p>
              <p className="text-slate-300 text-sm">₦{totalSaved.toFixed(2)} saved</p>
            </div>
            
            <div className="bg-orange-900/20 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-4 w-4 text-orange-400" />
                <span className="text-orange-400 font-medium">Sales</span>
              </div>
              <p className="text-white text-xl font-bold">{sellTransactions.length}</p>
              <p className="text-slate-300 text-sm">₦{totalDivested.toFixed(2)} divested</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Target className="h-5 w-5 text-green-400" />
            Personalized Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.map((rec, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                rec.priority === 'high' 
                  ? 'bg-red-900/20 border-red-500' 
                  : rec.priority === 'medium'
                  ? 'bg-yellow-900/20 border-yellow-500'
                  : 'bg-green-900/20 border-green-500'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-1 ${
                  rec.priority === 'high' 
                    ? 'text-red-400' 
                    : rec.priority === 'medium'
                    ? 'text-yellow-400'
                    : 'text-green-400'
                }`}>
                  {rec.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-medium">{rec.title}</h4>
                    <Badge 
                      className={
                        rec.priority === 'high' 
                          ? 'bg-red-600/20 text-red-300' 
                          : rec.priority === 'medium'
                          ? 'bg-yellow-600/20 text-yellow-300'
                          : 'bg-green-600/20 text-green-300'
                      }
                    >
                      {rec.priority} priority
                    </Badge>
                  </div>
                  <p className="text-slate-300 text-sm">{rec.description}</p>
                </div>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-slate-600">
            <Button 
              className="w-full bg-green-600 hover:bg-green-700"
              onClick={() => {
                toast.success("Action Plan Created", {
                  description: "Your personalized action plan has been generated based on the analysis.",
                });
              }}
            >
              Create Action Plan
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReportAnalysis;
