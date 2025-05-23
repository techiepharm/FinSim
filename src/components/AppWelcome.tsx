
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, BookOpen, TrendingUp, LineChart } from "lucide-react";

const AppWelcome = ({ onGetStarted }) => {
  return (
    <div className="px-6 py-10 space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
          Welcome to FinSavvy
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl mx-auto">
          Your all-in-one platform for financial literacy and stock market simulation
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <BookOpen className="h-10 w-10 text-green-400 mb-2" />
            <CardTitle className="text-white">Learn</CardTitle>
            <CardDescription className="text-slate-400">
              Interactive lessons on saving, investing, and more
            </CardDescription>
          </CardHeader>
          <CardContent className="text-slate-300">
            Complete quizzes, watch videos, and earn achievements as you build financial knowledge.
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <TrendingUp className="h-10 w-10 text-green-400 mb-2" />
            <CardTitle className="text-white">Practice</CardTitle>
            <CardDescription className="text-slate-400">
              Risk-free stock trading simulation
            </CardDescription>
          </CardHeader>
          <CardContent className="text-slate-300">
            Start with $1,000 in virtual cash and practice trading strategies without risking real money.
          </CardContent>
        </Card>
        
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <LineChart className="h-10 w-10 text-green-400 mb-2" />
            <CardTitle className="text-white">Track</CardTitle>
            <CardDescription className="text-slate-400">
              Monitor your progress and performance
            </CardDescription>
          </CardHeader>
          <CardContent className="text-slate-300">
            Set goals, track your portfolio, and review your transaction history to improve your skills.
          </CardContent>
        </Card>
      </div>
      
      <div className="text-center">
        <Button 
          size="lg" 
          className="bg-green-600 hover:bg-green-700 text-white"
          onClick={onGetStarted}
        >
          Get Started <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      
      <div className="text-center text-sm text-slate-500">
        <p>Need help navigating the app? Click the assistant button in the bottom right corner anytime.</p>
      </div>
    </div>
  );
};

export default AppWelcome;
