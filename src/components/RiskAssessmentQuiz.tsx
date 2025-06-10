
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Shield, 
  TrendingUp, 
  AlertTriangle, 
  Target,
  CheckCircle,
  Brain
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Question {
  id: number;
  question: string;
  options: { text: string; score: number }[];
}

interface RiskProfile {
  type: 'Conservative' | 'Moderate' | 'Aggressive';
  description: string;
  allocation: string;
  color: string;
  icon: React.ReactNode;
}

const RiskAssessmentQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [riskProfile, setRiskProfile] = useState<RiskProfile | null>(null);

  const questions: Question[] = [
    {
      id: 1,
      question: "How would you react if your investment portfolio lost 20% of its value in one month?",
      options: [
        { text: "Panic and sell everything immediately", score: 1 },
        { text: "Feel worried but hold and wait for recovery", score: 2 },
        { text: "Stay calm and possibly buy more at lower prices", score: 3 }
      ]
    },
    {
      id: 2,
      question: "What is your primary investment goal?",
      options: [
        { text: "Preserve my capital with minimal risk", score: 1 },
        { text: "Steady growth with moderate risk", score: 2 },
        { text: "Maximum returns, I can handle high risk", score: 3 }
      ]
    },
    {
      id: 3,
      question: "How long do you plan to invest in the Nigerian stock market?",
      options: [
        { text: "Less than 2 years", score: 1 },
        { text: "2-5 years", score: 2 },
        { text: "More than 5 years", score: 3 }
      ]
    },
    {
      id: 4,
      question: "What percentage of your income can you afford to lose without affecting your lifestyle?",
      options: [
        { text: "Less than 5%", score: 1 },
        { text: "5-15%", score: 2 },
        { text: "More than 15%", score: 3 }
      ]
    },
    {
      id: 5,
      question: "How familiar are you with the Nigerian Stock Exchange (NSE)?",
      options: [
        { text: "Complete beginner", score: 1 },
        { text: "Some knowledge and experience", score: 2 },
        { text: "Very experienced trader/investor", score: 3 }
      ]
    },
    {
      id: 6,
      question: "In a volatile market, what would you prefer?",
      options: [
        { text: "Safe government bonds with 8% annual return", score: 1 },
        { text: "Mixed portfolio with potential 12% return", score: 2 },
        { text: "Growth stocks with potential 20%+ return", score: 3 }
      ]
    }
  ];

  const riskProfiles: Record<string, RiskProfile> = {
    Conservative: {
      type: 'Conservative',
      description: 'You prefer stability and capital preservation. Focus on blue-chip Nigerian stocks like DANGCEM, GTCO, and government bonds.',
      allocation: '70% Bonds, 20% Blue-chip stocks, 10% Cash',
      color: 'text-blue-400',
      icon: <Shield className="h-6 w-6 text-blue-400" />
    },
    Moderate: {
      type: 'Moderate',
      description: 'You seek balanced growth with manageable risk. Consider a mix of established companies and some growth stocks.',
      allocation: '40% Blue-chip stocks, 30% Growth stocks, 20% Bonds, 10% Cash',
      color: 'text-green-400',
      icon: <Target className="h-6 w-6 text-green-400" />
    },
    Aggressive: {
      type: 'Aggressive',
      description: 'You are comfortable with high risk for high potential returns. Focus on growth stocks and emerging sectors.',
      allocation: '60% Growth stocks, 25% Blue-chip stocks, 10% Speculative, 5% Cash',
      color: 'text-red-400',
      icon: <TrendingUp className="h-6 w-6 text-red-400" />
    }
  };

  const handleAnswer = (score: number) => {
    const newAnswers = [...answers, score];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateRiskProfile(newAnswers);
    }
  };

  const calculateRiskProfile = (allAnswers: number[]) => {
    const totalScore = allAnswers.reduce((sum, score) => sum + score, 0);
    const maxScore = questions.length * 3;
    const percentage = (totalScore / maxScore) * 100;

    let profileType: keyof typeof riskProfiles;
    if (percentage <= 45) {
      profileType = 'Conservative';
    } else if (percentage <= 75) {
      profileType = 'Moderate';
    } else {
      profileType = 'Aggressive';
    }

    setRiskProfile(riskProfiles[profileType]);
    setShowResults(true);

    toast("🎯 Risk Assessment Complete!", {
      description: `Your risk profile: ${profileType}`,
      className: "bg-green-600 border-green-700 text-white",
      duration: 4000,
    });
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setRiskProfile(null);
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (showResults && riskProfile) {
    return (
      <div className="min-h-screen bg-slate-900 p-4">
        <div className="container mx-auto max-w-3xl">
          <Card className="bg-slate-800 border-slate-700 animate-scale-up">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-16 w-16 text-green-400" />
              </div>
              <CardTitle className="text-white text-2xl">Your Risk Profile Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="flex items-center justify-center gap-3 mb-4">
                  {riskProfile.icon}
                  <h2 className={`text-3xl font-bold ${riskProfile.color}`}>
                    {riskProfile.type} Investor
                  </h2>
                </div>
                <p className="text-slate-300 text-lg leading-relaxed">
                  {riskProfile.description}
                </p>
              </div>

              <Card className="bg-slate-700 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Recommended Allocation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">{riskProfile.allocation}</p>
                </CardContent>
              </Card>

              <Card className="bg-slate-700 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Nigerian Investment Suggestions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {riskProfile.type === 'Conservative' && (
                    <div className="space-y-2">
                      <p className="text-slate-300">• <strong>Blue-chip stocks:</strong> DANGCEM, GTCO, MTNN</p>
                      <p className="text-slate-300">• <strong>Government bonds:</strong> FGN Bonds, Treasury Bills</p>
                      <p className="text-slate-300">• <strong>Banking sector:</strong> ZENITHBANK, UBA, ACCESSCORP</p>
                    </div>
                  )}
                  {riskProfile.type === 'Moderate' && (
                    <div className="space-y-2">
                      <p className="text-slate-300">• <strong>Balanced mix:</strong> DANGCEM, BUACEMENT, SEPLAT</p>
                      <p className="text-slate-300">• <strong>Consumer goods:</strong> NESTLE, UNILEVER, GUINNESS</p>
                      <p className="text-slate-300">• <strong>Some bonds:</strong> Mix with FGN Bonds for stability</p>
                    </div>
                  )}
                  {riskProfile.type === 'Aggressive' && (
                    <div className="space-y-2">
                      <p className="text-slate-300">• <strong>Growth stocks:</strong> AIRTELAFRI, BUAFOODS, FBNH</p>
                      <p className="text-slate-300">• <strong>Oil & Gas:</strong> SEPLAT, OANDO, CONOIL</p>
                      <p className="text-slate-300">• <strong>Emerging sectors:</strong> Fintech, Agriculture, Tech</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex gap-4">
                <Button 
                  onClick={resetQuiz}
                  variant="outline"
                  className="flex-1 border-slate-600"
                >
                  Retake Quiz
                </Button>
                <Button 
                  onClick={() => toast("Portfolio building coming soon!", { description: "We'll help you build a portfolio based on your risk profile" })}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  Build My Portfolio
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="h-8 w-8 text-purple-400" />
            <h1 className="text-3xl font-bold text-white">Risk Assessment Quiz</h1>
          </div>
          <p className="text-slate-400">Discover your investment personality for the Nigerian market</p>
        </div>

        <Card className="bg-slate-800 border-slate-700 mb-6 animate-slide-in-bottom">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-slate-400">Progress</span>
              <span className="text-white">{currentQuestion + 1} of {questions.length}</span>
            </div>
            <Progress value={progress} className="mb-6" />
            
            <div className="space-y-6">
              <h2 className="text-xl font-medium text-white leading-relaxed">
                {questions[currentQuestion].question}
              </h2>
              
              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswer(option.score)}
                    variant="outline"
                    className="w-full text-left justify-start h-auto p-4 border-slate-600 hover:bg-slate-700 transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-slate-400 mt-1">{String.fromCharCode(65 + index)}.</span>
                      <span className="text-white">{option.text}</span>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border-blue-600/50 animate-fade-in delay-300">
          <CardContent className="p-4 text-center">
            <AlertTriangle className="h-5 w-5 text-blue-400 mx-auto mb-2" />
            <p className="text-blue-300 text-sm">
              💡 This assessment helps tailor investment recommendations for your comfort level with Nigerian market volatility.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RiskAssessmentQuiz;
