import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { PieChart, Target, PiggyBank, CreditCard, TrendingUp } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface SplitCategory {
  name: string;
  percentage: number;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface SmartIncomeSplitProps {
  monthlyIncome: number;
  onSplitSaved: (split: SplitCategory[]) => void;
}

const SmartIncomeSplit = ({ monthlyIncome, onSplitSaved }: SmartIncomeSplitProps) => {
  const [income, setIncome] = useState(monthlyIncome);
  const [splitCategories, setSplitCategories] = useState<SplitCategory[]>([
    {
      name: 'Essential Expenses',
      percentage: 50,
      icon: <CreditCard className="h-4 w-4" />,
      color: 'bg-red-500',
      description: 'Rent, utilities, food, transportation'
    },
    {
      name: 'Savings',
      percentage: 20,
      icon: <PiggyBank className="h-4 w-4" />,
      color: 'bg-green-500',
      description: 'Emergency fund and long-term savings'
    },
    {
      name: 'Investments',
      percentage: 15,
      icon: <TrendingUp className="h-4 w-4" />,
      color: 'bg-blue-500',
      description: 'Stocks, bonds, mutual funds'
    },
    {
      name: 'Personal Spending',
      percentage: 15,
      icon: <Target className="h-4 w-4" />,
      color: 'bg-purple-500',
      description: 'Entertainment, dining, hobbies'
    }
  ]);

  const suggestions = [
    {
      name: "Conservative (50/20/15/15)",
      categories: [50, 20, 15, 15],
      description: "Safe approach with strong savings focus"
    },
    {
      name: "Growth-Focused (45/15/25/15)",
      categories: [45, 15, 25, 15],
      description: "Higher investment allocation for growth"
    },
    {
      name: "Aggressive Saver (40/30/20/10)",
      categories: [40, 30, 20, 10],
      description: "Maximum savings for financial security"
    },
    {
      name: "Balanced (50/15/20/15)",
      categories: [50, 15, 20, 15],
      description: "Well-balanced approach for most people"
    }
  ];

  const updatePercentage = (index: number, newPercentage: number) => {
    const newCategories = [...splitCategories];
    const oldPercentage = newCategories[index].percentage;
    const difference = newPercentage - oldPercentage;
    
    newCategories[index].percentage = newPercentage;
    
    // Adjust other categories proportionally
    const otherIndices = newCategories.map((_, i) => i).filter(i => i !== index);
    const totalOtherPercentage = otherIndices.reduce((sum, i) => sum + newCategories[i].percentage, 0);
    
    if (totalOtherPercentage > 0) {
      otherIndices.forEach(i => {
        const proportion = newCategories[i].percentage / totalOtherPercentage;
        newCategories[i].percentage = Math.max(0, newCategories[i].percentage - (difference * proportion));
      });
    }
    
    // Ensure total is 100%
    const total = newCategories.reduce((sum, cat) => sum + cat.percentage, 0);
    if (total !== 100) {
      const adjustment = (100 - total) / newCategories.length;
      newCategories.forEach(cat => cat.percentage += adjustment);
    }
    
    setSplitCategories(newCategories);
  };

  const applySuggestion = (suggestion: typeof suggestions[0]) => {
    const newCategories = splitCategories.map((cat, index) => ({
      ...cat,
      percentage: suggestion.categories[index]
    }));
    setSplitCategories(newCategories);
    
    toast("✅ Split Applied", {
      description: `Applied ${suggestion.name} allocation`,
      className: "bg-green-600 border-green-700 text-white",
    });
  };

  const saveSplit = () => {
    onSplitSaved(splitCategories);
    toast("💰 Income Split Saved", {
      description: "Your smart income allocation has been saved successfully",
      className: "bg-green-600 border-green-700 text-white",
    });
  };

  const totalPercentage = splitCategories.reduce((sum, cat) => sum + cat.percentage, 0);

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <PieChart className="h-5 w-5 text-green-400" />
          Smart Income Split
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label htmlFor="income" className="text-white">Monthly Income (₦)</Label>
          <Input
            id="income"
            type="number"
            value={income}
            onChange={(e) => setIncome(Number(e.target.value))}
            className="bg-slate-700 border-slate-600 text-white mt-1"
            placeholder="Enter your monthly income"
          />
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-medium">Suggested Allocations</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {suggestions.map((suggestion, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => applySuggestion(suggestion)}
                className="border-slate-600 text-left justify-start"
              >
                <div>
                  <div className="font-medium text-xs">{suggestion.name}</div>
                  <div className="text-xs text-slate-400">{suggestion.description}</div>
                </div>
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-white font-medium">Your Allocation</h4>
            <span className={`text-sm ${Math.abs(totalPercentage - 100) < 0.1 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPercentage.toFixed(1)}%
            </span>
          </div>
          
          {splitCategories.map((category, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                  <span className="text-white text-sm">{category.name}</span>
                </div>
                <span className="text-white text-sm">{category.percentage.toFixed(1)}%</span>
              </div>
              
              <Slider
                value={[category.percentage]}
                onValueChange={(value) => updatePercentage(index, value[0])}
                max={100}
                step={1}
                className="w-full"
              />
              
              <div className="flex justify-between text-xs text-slate-400">
                <span>{category.description}</span>
                <span>₦{((income * category.percentage) / 100).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-slate-700 rounded-lg p-4">
          <h5 className="text-white font-medium mb-2">Monthly Breakdown</h5>
          <div className="space-y-1">
            {splitCategories.map((category, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span className="text-slate-300">{category.name}</span>
                <span className="text-white">₦{((income * category.percentage) / 100).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={saveSplit}
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={Math.abs(totalPercentage - 100) > 0.1}
        >
          <PieChart className="h-4 w-4 mr-2" />
          Save Income Split
        </Button>
      </CardContent>
    </Card>
  );
};

export default SmartIncomeSplit;
