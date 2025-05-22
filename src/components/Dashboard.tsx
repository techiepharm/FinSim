
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, TrendingUp, BookOpen, CalendarDays, Target, Wallet, DollarSign } from "lucide-react";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/sonner";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const FINANCIAL_QUOTES = [
  "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
  "In investing, what is comfortable is rarely profitable.",
  "The individual investor should act consistently as an investor and not as a speculator.",
  "The four most dangerous words in investing are: 'This time it's different.'",
  "The best investment you can make is in yourself.",
  "Risk comes from not knowing what you're doing.",
  "The most important quality for an investor is temperament, not intellect.",
  "I will tell you how to become rich. Close the doors. Be fearful when others are greedy. Be greedy when others are fearful.",
];

const Dashboard = () => {
  const [progress, setProgress] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(103750.42);
  const [animatedChart, setAnimatedChart] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [showQuote, setShowQuote] = useState(false);
  
  // Mock user data
  const userData = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    cardNumber: "**** **** **** 5678",
    cardType: "Visa",
    expiryDate: "09/27"
  };

  const availableBalance = 12589.75;

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(42);
      setAnimatedChart(true);
      setShowQuote(true);
    }, 300);
    
    // Rotate through quotes
    const quoteInterval = setInterval(() => {
      setQuoteIndex(prev => (prev + 1) % FINANCIAL_QUOTES.length);
      setShowQuote(false);
      setTimeout(() => setShowQuote(true), 500);
    }, 10000);
    
    // Display welcome toast
    toast("Welcome back, " + userData.name + "!", {
      description: "Your portfolio has grown by 3.75% since your last visit.",
    });
    
    return () => {
      clearTimeout(timer);
      clearInterval(quoteInterval);
    }
  }, []);

  // Mock data for progress indicators
  const learningProgress = {
    completed: 8,
    total: 20,
    percent: 40,
  };

  const initialValue = 100000.00;
  const percentChange = ((portfolioValue - initialValue) / initialValue) * 100;

  const tradePerformance = [
    { name: 'Mon', profit: 250, loss: -120 },
    { name: 'Tue', profit: 320, loss: -80 },
    { name: 'Wed', profit: 180, loss: -290 },
    { name: 'Thu', profit: 450, loss: -150 },
    { name: 'Fri', profit: 280, loss: -220 },
    { name: 'Sat', profit: 190, loss: -90 },
    { name: 'Sun', profit: 150, loss: -40 },
  ];

  // Mock recent lessons
  const recentLessons = [
    { id: 1, title: "Introduction to Stock Markets", progress: 100, category: "Investing" },
    { id: 2, title: "Creating a Budget", progress: 75, category: "Budgeting" },
    { id: 3, title: "Understanding Compound Interest", progress: 50, category: "Savings" },
    { id: 4, title: "Risk Management", progress: 25, category: "Investing" },
  ];
  
  // Mock goals data
  const goals = [
    { name: "Monthly Profit", current: 3149, target: 5000, type: "profit" },
    { name: "Successful Trades", current: 12, target: 50, type: "trading" },
  ];

  // Mock upcoming events
  const upcomingEvents = [
    { title: "Portfolio Review", date: "May 23, 2025", type: "trading" },
    { title: "Monthly Profit Goal Deadline", date: "May 30, 2025", type: "goal" },
  ];
  
  // Handle card click for interactive feedback
  const handleCardClick = (cardName: string) => {
    toast(`${cardName} details`, {
      description: `You clicked on the ${cardName} card.`,
    });
  };
  
  const handleLessonClick = (lessonTitle: string) => {
    toast("Lesson Selected", {
      description: `Opening lesson: ${lessonTitle}`,
    });
  };

  return (
    <div className="space-y-6 p-6 bg-background dark">
      {/* User greeting section */}
      <div className="mb-8 animate-fade-in">
        <h2 className="text-3xl font-bold text-finance-primary mb-2 finance-accent-gradient">
          Hi, {userData.name}! Welcome to Your Financial Dashboard
        </h2>
        
        {/* PayPal Info */}
        <div className="mt-6 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg p-6 text-white shadow-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-1">Your Account Balance</h3>
              <div className="text-3xl font-bold">${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
              <p className="text-slate-300 mt-2">Link your PayPal account for faster transactions</p>
            </div>
            <div className="bg-slate-600 p-3 rounded-full">
              <DollarSign className="h-8 w-8 text-green-400" />
            </div>
          </div>
          <div className="mt-6">
            <Button 
              onClick={() => window.location.href = '/withdraw'}
              className="bg-green-600 text-white hover:bg-green-700"
            >
              <Wallet className="mr-2 h-5 w-5" /> Withdraw Funds
            </Button>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <div className="mr-4">
              <span className="text-slate-400">Card: </span>
              <span>{userData.cardType} •••• {userData.cardNumber.slice(-4)}</span>
            </div>
            <div>
              <span className="text-slate-400">Expires: </span>
              <span>{userData.expiryDate}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated Financial Quote */}
      <div className={`relative overflow-hidden mb-8 p-5 bg-gradient-to-r from-slate-800 to-slate-700 rounded-lg text-white ${showQuote ? 'animate-fade-in' : 'opacity-0'}`}>
        <p className="italic text-lg md:text-xl relative z-10">"{FINANCIAL_QUOTES[quoteIndex]}"</p>
        <div className="absolute top-0 left-0 w-full h-full bg-white opacity-5 animate-pulse"></div>
      </div>
      
      {/* Overall Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          gradient="green"
          className="hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] cursor-pointer layered-card bg-slate-800 text-white"
          onClick={() => handleCardClick("Portfolio Value")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarIcon className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div className="flex items-center text-sm">
              {percentChange >= 0 ? (
                <>
                  <ArrowUp className="mr-1 h-4 w-4 text-green-400 animate-bounce" />
                  <span className="text-green-400">+{percentChange.toFixed(2)}%</span>
                </>
              ) : (
                <>
                  <ArrowDown className="mr-1 h-4 w-4 text-red-400" />
                  <span className="text-red-400">{percentChange.toFixed(2)}%</span>
                </>
              )}
              <span className="text-white opacity-75 ml-2">from initial</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          gradient="gold"
          className="hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] cursor-pointer layered-card bg-slate-800 text-white"
          onClick={() => handleCardClick("Learning Progress")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningProgress.percent}%</div>
            <Progress className="h-2 mt-2 bg-slate-700" value={learningProgress.percent} />
            <div className="text-xs text-white opacity-75 mt-2">
              {learningProgress.completed} of {learningProgress.total} lessons completed
            </div>
          </CardContent>
        </Card>

        <Card 
          gradient="blue"
          className="hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] cursor-pointer layered-card bg-slate-800 text-white"
          onClick={() => handleCardClick("Successful Trades")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Trades</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <div className="text-xs text-white opacity-75">
              12 profitable trades out of 18 total
            </div>
          </CardContent>
        </Card>

        <Card 
          gradient="premium"
          className="hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] cursor-pointer layered-card bg-slate-800 text-white"
          onClick={() => handleCardClick("Quiz Performance")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Quiz Performance</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-purple-400"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <div className="text-xs text-white opacity-75">
              Average score across all quizzes
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-all duration-300 glass-card bg-slate-800 text-white border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-400" />
                Financial Goals
              </CardTitle>
              <Link to="/goals" className="text-sm text-green-400 hover:underline hover:text-green-300 transition-colors">
                View All Goals
              </Link>
            </CardHeader>
            <CardContent className="space-y-4">
              {goals.map((goal, index) => (
                <div 
                  key={index} 
                  className="space-y-2 p-2 rounded-md hover:bg-slate-700 cursor-pointer transition-all duration-200"
                  onClick={() => toast(`${goal.name} Goal`, {
                    description: `Current progress: ${((goal.current / goal.target) * 100).toFixed(0)}%`
                  })}
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{goal.name}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      goal.type === "profit" ? "bg-green-900 text-green-300" : "bg-blue-900 text-blue-300"
                    }`}>
                      {goal.type === "profit" ? "Profit" : "Trading"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Current: {goal.type === "profit" ? "$" : ""}{goal.current}</span>
                    <span>Target: {goal.type === "profit" ? "$" : ""}{goal.target}</span>
                  </div>
                  <Progress value={(goal.current / goal.target) * 100} className="h-2 bg-slate-700" />
                  <div className="text-xs text-slate-400 text-right">
                    {((goal.current / goal.target) * 100).toFixed(0)}% Complete
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-all duration-300 glass-card bg-slate-800 text-white border-slate-700">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-blue-400" />
                Upcoming Events
              </CardTitle>
              <Link to="/calendar" className="text-sm text-blue-400 hover:underline hover:text-blue-300 transition-colors">
                View Calendar
              </Link>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-slate-700">
                {upcomingEvents.map((event, index) => (
                  <div 
                    key={index} 
                    className="py-3 flex justify-between items-center hover:bg-slate-700 px-2 rounded-md cursor-pointer transition-colors"
                    onClick={() => toast(`${event.title}`, {
                      description: `Event scheduled for ${event.date}`
                    })}
                  >
                    <div>
                      <p className="font-medium">{event.title}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm">{event.date}</div>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        event.type === "trading" ? "bg-blue-900 text-blue-300" : 
                        event.type === "goal" ? "bg-purple-900 text-purple-300" : 
                        "bg-slate-700 text-slate-300"
                      }`}>
                        {event.type}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="col-span-1 hover:shadow-lg transition-all duration-300 glass-card bg-slate-800 text-white border-slate-700">
            <CardHeader>
              <CardTitle>Recent Lessons</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentLessons.map((lesson) => (
                <div 
                  key={lesson.id} 
                  className="space-y-2 p-2 rounded-md hover:bg-slate-700 cursor-pointer transition-all duration-200"
                  onClick={() => handleLessonClick(lesson.title)}
                >
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{lesson.title}</span>
                    <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(lesson.category)}`}>
                      {lesson.category}
                    </span>
                  </div>
                  <Progress value={lesson.progress} className="h-2 bg-slate-700" />
                  <div className="text-xs text-slate-400">
                    {lesson.progress}% completed
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="col-span-1 hover:shadow-lg transition-all duration-300 glass-card bg-slate-800 text-white border-slate-700">
            <CardHeader>
              <CardTitle>Trading Performance</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={tradePerformance}
                  className={`${animatedChart ? 'animate-fade-in' : 'opacity-50'}`}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip contentStyle={{ background: "#1e293b", border: "1px solid #475569", color: "#e2e8f0" }} />
                  <Bar dataKey="profit" fill="#10B981" />
                  <Bar dataKey="loss" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="col-span-1 hover:shadow-lg transition-all duration-300 glass-card bg-slate-800 text-white border-slate-700">
            <CardHeader>
              <CardTitle>Financial Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 bg-amber-900/30 border border-amber-800/30 rounded-md">
                <h4 className="font-medium text-amber-300">Investment Tip</h4>
                <p className="text-xs text-amber-200 mt-1">Consistently allocating even small amounts to investments can lead to significant growth over time due to compound interest.</p>
              </div>
              
              <div className="p-3 bg-blue-900/30 border border-blue-800/30 rounded-md">
                <h4 className="font-medium text-blue-300">Trading Strategy</h4>
                <p className="text-xs text-blue-200 mt-1">Consider dollar-cost averaging instead of trying to time the market. Regular investments can help mitigate market volatility.</p>
              </div>
              
              <div className="p-3 bg-green-900/30 border border-green-800/30 rounded-md">
                <h4 className="font-medium text-green-300">Savings Advice</h4>
                <p className="text-xs text-green-200 mt-1">Aim to save at least 20% of your income each month. Automating these transfers can help ensure consistency.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

function getCategoryColor(category: string) {
  switch (category) {
    case "Investing":
      return "bg-blue-900 text-blue-300";
    case "Budgeting":
      return "bg-green-900 text-green-300";
    case "Savings":
      return "bg-purple-900 text-purple-300";
    default:
      return "bg-slate-700 text-slate-300";
  }
}

function DollarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" y1="1" x2="12" y2="23"></line>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
    </svg>
  );
}

export default Dashboard;
