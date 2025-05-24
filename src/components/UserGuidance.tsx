
import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  TrendingUp, 
  PiggyBank, 
  BookOpen, 
  CreditCard, 
  Target,
  ChevronRight,
  Lightbulb
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const UserGuidance = () => {
  const [showGuidance, setShowGuidance] = useState(false);
  const [hasSeenGuidance, setHasSeenGuidance] = useState(false);

  useEffect(() => {
    // Check if user has seen guidance before
    const guidanceSeen = localStorage.getItem('guidanceSeen');
    if (!guidanceSeen) {
      // Show guidance after a short delay
      setTimeout(() => {
        setShowGuidance(true);
      }, 3000);
    } else {
      setHasSeenGuidance(true);
    }
  }, []);

  const markGuidanceSeen = () => {
    localStorage.setItem('guidanceSeen', 'true');
    setHasSeenGuidance(true);
    setShowGuidance(false);
  };

  const handleOptionSelect = (option: string) => {
    markGuidanceSeen();
    
    switch (option) {
      case 'trading':
        window.location.href = '/trading';
        toast("📈 Trading Mode", {
          description: "Start with small amounts to learn. Remember, this is a demo account!",
          className: "bg-blue-600 border-blue-700 text-white",
          duration: 5000,
        });
        break;
      case 'savings':
        toast("💰 Smart Savings", {
          description: "Use the savings box to set aside money. You can lock it to prevent spending!",
          className: "bg-green-600 border-green-700 text-white",
          duration: 5000,
        });
        break;
      case 'learning':
        window.location.href = '/learning';
        toast("📚 Financial Education", {
          description: "Knowledge is power! Learn the basics before investing real money.",
          className: "bg-purple-600 border-purple-700 text-white",
          duration: 5000,
        });
        break;
      case 'goals':
        window.location.href = '/goals';
        toast("🎯 Financial Goals", {
          description: "Set clear goals and track your progress. This keeps you motivated!",
          className: "bg-orange-600 border-orange-700 text-white",
          duration: 5000,
        });
        break;
      case 'funds':
        window.location.href = '/add-funds';
        toast("💳 Demo Funds", {
          description: "Add virtual money to practice with. No real money is involved!",
          className: "bg-indigo-600 border-indigo-700 text-white",
          duration: 5000,
        });
        break;
    }
  };

  const reopenGuidance = () => {
    setShowGuidance(true);
  };

  const options = [
    {
      id: 'trading',
      title: 'Start Trading',
      description: 'Practice buying and selling stocks with virtual money',
      icon: TrendingUp,
      color: 'bg-blue-600 hover:bg-blue-700',
      benefit: 'Learn market basics without risk'
    },
    {
      id: 'savings',
      title: 'Save Money',
      description: 'Put money aside in your savings box and lock it for protection',
      icon: PiggyBank,
      color: 'bg-green-600 hover:bg-green-700',
      benefit: 'Build good saving habits'
    },
    {
      id: 'learning',
      title: 'Learn Finance',
      description: 'Take lessons on budgeting, investing, and financial planning',
      icon: BookOpen,
      color: 'bg-purple-600 hover:bg-purple-700',
      benefit: 'Gain financial knowledge'
    },
    {
      id: 'goals',
      title: 'Set Goals',
      description: 'Create financial goals and track your progress',
      icon: Target,
      color: 'bg-orange-600 hover:bg-orange-700',
      benefit: 'Stay motivated and focused'
    },
    {
      id: 'funds',
      title: 'Add Demo Funds',
      description: 'Add virtual money to your account for practice',
      icon: CreditCard,
      color: 'bg-indigo-600 hover:bg-indigo-700',
      benefit: 'Get more virtual money to experiment'
    }
  ];

  return (
    <>
      {hasSeenGuidance && (
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardContent className="p-4">
            <Button
              onClick={reopenGuidance}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Lightbulb className="mr-2 h-4 w-4" />
              Need Help? Show Me Options
            </Button>
          </CardContent>
        </Card>
      )}

      <Dialog open={showGuidance} onOpenChange={() => {}}>
        <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center">
              Welcome to Your Financial Journey! 🚀
            </DialogTitle>
            <DialogDescription className="text-slate-300 text-center">
              This is a demo account with virtual money. What would you like to do today?
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {options.map((option) => (
              <Card 
                key={option.id} 
                className="bg-slate-700 border-slate-600 hover:border-slate-500 transition-colors cursor-pointer"
                onClick={() => handleOptionSelect(option.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-md ${option.color} flex-shrink-0`}>
                      <option.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-white mb-1">{option.title}</h3>
                      <p className="text-sm text-slate-300 mb-2">{option.description}</p>
                      <div className="flex items-center text-xs text-green-400">
                        <ChevronRight className="h-3 w-3 mr-1" />
                        {option.benefit}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 bg-slate-900/50 rounded-md border border-slate-600">
            <p className="text-sm text-slate-300 text-center">
              💡 <strong>Tip:</strong> This is a safe learning environment. Experiment freely with virtual money!
            </p>
          </div>

          <div className="flex justify-center mt-4">
            <Button
              onClick={markGuidanceSeen}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              I'll explore on my own
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserGuidance;
