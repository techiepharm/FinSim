
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Info } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface TradeStepInfo {
  title: string;
  description: string;
  impact: string;
}

interface TradeEducationProps {
  currentStep: string;
  onAnalyze: () => void;
}

const TradeEducation = ({ currentStep, onAnalyze }: TradeEducationProps) => {
  const [showInfo, setShowInfo] = useState(true);
  
  const tradeSteps: Record<string, TradeStepInfo> = {
    "market-selection": {
      title: "Market Selection",
      description: "Choosing the right market is crucial for your trading strategy. Different markets have varying levels of volatility, liquidity, and trading hours.",
      impact: "The market you choose will impact your risk exposure, potential profit margins, and the strategies you can employ."
    },
    "asset-research": {
      title: "Asset Research",
      description: "Researching assets involves understanding their historical performance, factors that influence their price, and current market sentiment.",
      impact: "Thorough research leads to more informed trading decisions and helps identify potential opportunities and risks."
    },
    "technical-analysis": {
      title: "Technical Analysis",
      description: "Technical analysis uses price charts and market indicators to predict future price movements based on historical patterns.",
      impact: "Effective technical analysis can help you identify entry and exit points for trades, maximizing profit potential."
    },
    "fundamental-analysis": {
      title: "Fundamental Analysis",
      description: "Fundamental analysis evaluates an asset's intrinsic value by examining related economic, financial, and other qualitative and quantitative factors.",
      impact: "Understanding fundamental factors helps predict long-term price movements and identify undervalued or overvalued assets."
    },
    "risk-assessment": {
      title: "Risk Assessment",
      description: "Evaluating the potential risks involved in a trade, including market volatility, leverage implications, and potential loss scenarios.",
      impact: "Proper risk assessment helps protect your capital and ensures that no single trade can significantly damage your portfolio."
    },
    "trade-execution": {
      title: "Trade Execution",
      description: "The process of entering a trade, including setting your position size, entry price, and any limit or stop orders.",
      impact: "Efficient execution minimizes slippage and ensures you enter the market at your intended price point."
    },
    "position-monitoring": {
      title: "Position Monitoring",
      description: "Tracking your open positions, including their performance against expectations and any new market developments.",
      impact: "Regular monitoring allows you to adjust your strategy if market conditions change or your analysis proves incorrect."
    },
    "exit-strategy": {
      title: "Exit Strategy",
      description: "Planning when and how to close a position, either to secure profits or limit losses.",
      impact: "A well-defined exit strategy helps remove emotional decision-making and improves overall trading performance."
    },
    "performance-review": {
      title: "Performance Review",
      description: "Analyzing completed trades to understand what worked, what didn't, and how to improve future trading decisions.",
      impact: "Regular review helps refine your trading strategy and develop as a trader over time."
    },
    "default": {
      title: "Trading Education",
      description: "Trading involves buying and selling financial assets with the goal of making a profit from price movements.",
      impact: "Understanding trading principles helps you make more informed financial decisions and potentially grow your wealth."
    }
  };
  
  const stepInfo = tradeSteps[currentStep] || tradeSteps["default"];
  
  return (
    <div className="space-y-4">
      {showInfo && (
        <Alert className="bg-blue-50 border-blue-100 text-blue-800">
          <Info className="h-4 w-4" />
          <AlertTitle>{stepInfo.title}</AlertTitle>
          <AlertDescription>
            {stepInfo.description}
            <p className="mt-2 font-medium">Impact: {stepInfo.impact}</p>
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => setShowInfo(!showInfo)}
        >
          {showInfo ? "Hide" : "Show"} Info
        </Button>
        
        <Button 
          onClick={onAnalyze}
          className="bg-finance-primary"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Analyze Market
        </Button>
      </div>
    </div>
  );
};

export default TradeEducation;
