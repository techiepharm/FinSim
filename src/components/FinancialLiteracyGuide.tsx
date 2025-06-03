
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Play, CheckCircle, Lock, ArrowRight, HelpCircle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FinancialLiteracyGuideProps {
  userLevel: 'basic' | 'premium';
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isPremium: boolean;
  completed: boolean;
  explanation: string;
}

const FinancialLiteracyGuide = ({ userLevel }: FinancialLiteracyGuideProps) => {
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [showDialog, setShowDialog] = useState(false);

  const lessons: Lesson[] = [
    {
      id: '1',
      title: 'Understanding Stocks',
      description: 'Learn what stocks are and how they work',
      duration: '5 min',
      level: 'beginner',
      isPremium: false,
      completed: true,
      explanation: 'A stock represents ownership in a company. When you buy a stock, you become a shareholder and own a small piece of that company. The value of your stock can go up or down based on the company\'s performance and market conditions.'
    },
    {
      id: '2',
      title: 'Reading Stock Charts',
      description: 'Understand price movements and patterns',
      duration: '8 min',
      level: 'beginner',
      isPremium: false,
      completed: false,
      explanation: 'Stock charts show how a stock\'s price has changed over time. The vertical axis shows the price, and the horizontal axis shows the time. Green usually means the price went up, and red means it went down.'
    },
    {
      id: '3',
      title: 'Risk Management',
      description: 'Learn to protect your investments',
      duration: '10 min',
      level: 'intermediate',
      isPremium: false,
      completed: false,
      explanation: 'Risk management means protecting your money by not putting all your eggs in one basket. Never invest more than you can afford to lose, and always diversify your investments across different stocks and sectors.'
    },
    {
      id: '4',
      title: 'Advanced Technical Analysis',
      description: 'Professional trading strategies and indicators',
      duration: '15 min',
      level: 'advanced',
      isPremium: true,
      completed: false,
      explanation: 'Technical analysis involves studying price patterns, volume, and mathematical indicators to predict future price movements. This includes concepts like moving averages, RSI, MACD, and support/resistance levels.'
    },
    {
      id: '5',
      title: 'Options Trading Fundamentals',
      description: 'Understanding calls, puts, and derivatives',
      duration: '20 min',
      level: 'advanced',
      isPremium: true,
      completed: false,
      explanation: 'Options are contracts that give you the right (but not obligation) to buy or sell a stock at a specific price within a certain timeframe. They can be used for hedging or speculation but require advanced knowledge.'
    }
  ];

  const handleLessonClick = (lesson: Lesson) => {
    if (lesson.isPremium && userLevel === 'basic') {
      toast("🔒 Premium Content", {
        description: "Upgrade to Premium to access advanced financial education!",
        className: "bg-purple-600 border-purple-700 text-white",
        duration: 4000,
      });
      return;
    }

    setSelectedLesson(lesson);
    setShowDialog(true);
  };

  const startLesson = (lesson: Lesson) => {
    toast("📚 Starting Lesson", {
      description: `Beginning "${lesson.title}" - this is a demo simulation`,
      className: "bg-blue-600 border-blue-700 text-white",
      duration: 3000,
    });
    setShowDialog(false);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-600/20 text-green-300';
      case 'intermediate': return 'bg-yellow-600/20 text-yellow-300';
      case 'advanced': return 'bg-red-600/20 text-red-300';
      default: return 'bg-blue-600/20 text-blue-300';
    }
  };

  const accessibleLessons = userLevel === 'basic' 
    ? lessons.filter(l => !l.isPremium) 
    : lessons;

  return (
    <>
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-400" />
            Financial Education Hub
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {accessibleLessons.map((lesson) => (
            <div 
              key={lesson.id}
              className={`p-3 rounded-lg cursor-pointer transition-colors ${
                lesson.isPremium && userLevel === 'basic'
                  ? 'bg-slate-700/50 border border-purple-600/50'
                  : 'bg-slate-700 hover:bg-slate-600'
              }`}
              onClick={() => handleLessonClick(lesson)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {lesson.completed ? (
                    <CheckCircle className="h-5 w-5 text-green-400" />
                  ) : lesson.isPremium && userLevel === 'basic' ? (
                    <Lock className="h-5 w-5 text-purple-400" />
                  ) : (
                    <Play className="h-5 w-5 text-blue-400" />
                  )}
                  <div>
                    <h4 className="text-white font-medium">{lesson.title}</h4>
                    <p className="text-slate-400 text-sm">{lesson.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={getLevelColor(lesson.level)}>
                        {lesson.level}
                      </Badge>
                      <span className="text-xs text-slate-500">{lesson.duration}</span>
                    </div>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          ))}

          {userLevel === 'basic' && (
            <div className="mt-4 p-3 bg-purple-900/30 border border-purple-600/50 rounded-lg text-center">
              <Lock className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-purple-300 text-sm mb-2">
                Unlock advanced courses and personalized learning paths
              </p>
              <Button 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => toast("Coming Soon!", { description: "Premium education features coming soon!" })}
              >
                Upgrade for Full Access
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-400" />
              {selectedLesson?.title}
            </DialogTitle>
            <DialogDescription className="text-slate-300">
              {selectedLesson?.description} • {selectedLesson?.duration}
            </DialogDescription>
          </DialogHeader>
          
          {selectedLesson && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-700 rounded-lg">
                <div className="flex items-start gap-2 mb-3">
                  <HelpCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                  <div>
                    <h4 className="text-white font-medium mb-2">What you'll learn:</h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {selectedLesson.explanation}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Badge className={getLevelColor(selectedLesson.level)}>
                  {selectedLesson.level} level
                </Badge>
                <span className="text-sm text-slate-400">• {selectedLesson.duration} read</span>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={() => startLesson(selectedLesson)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Learning
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowDialog(false)}
                  className="border-slate-600"
                >
                  Later
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FinancialLiteracyGuide;
