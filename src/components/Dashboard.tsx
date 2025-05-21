
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, TrendingUp, BookOpen, CalendarDays, Target, Wallet, FileText } from "lucide-react";
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

const Dashboard = () => {
  const [progress, setProgress] = useState(0);
  const [portfolioValue, setPortfolioValue] = useState(103750.42);
  const [animatedChart, setAnimatedChart] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(42);
      setAnimatedChart(true);
    }, 300);
    
    // Display welcome toast
    toast("Welcome back!", {
      description: "Your portfolio has grown by 3.75% since your last visit.",
    });
    
    return () => clearTimeout(timer);
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

  // Add withdrawal navigation
  const handleWithdrawFunds = () => {
    window.location.href = '/withdraw';  // Using window.location since we're not using useNavigate
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-3xl font-bold text-finance-primary mb-6 animate-fade-in finance-accent-gradient">Your Financial Dashboard</h2>
      
      {/* Overall Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card 
          className="hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] cursor-pointer layered-card"
          onClick={() => handleCardClick("Portfolio Value")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Value</CardTitle>
            <DollarIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${portfolioValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}</div>
            <div className="flex items-center text-sm">
              {percentChange >= 0 ? (
                <>
                  <ArrowUp className="mr-1 h-4 w-4 text-finance-accent animate-bounce" />
                  <span className="text-finance-accent">+{percentChange.toFixed(2)}%</span>
                </>
              ) : (
                <>
                  <ArrowDown className="mr-1 h-4 w-4 text-finance-danger" />
                  <span className="text-finance-danger">{percentChange.toFixed(2)}%</span>
                </>
              )}
              <span className="text-muted-foreground ml-2">from initial</span>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] cursor-pointer layered-card"
          onClick={() => handleCardClick("Learning Progress")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Learning Progress</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{learningProgress.percent}%</div>
            <Progress className="h-2 mt-2" value={learningProgress.percent} />
            <div className="text-xs text-muted-foreground mt-2">
              {learningProgress.completed} of {learningProgress.total} lessons completed
            </div>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] cursor-pointer layered-card"
          onClick={() => handleCardClick("Successful Trades")}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Trades</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">67%</div>
            <div className="text-xs text-muted-foreground">
              12 profitable trades out of 18 total
            </div>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] cursor-pointer layered-card"
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
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <div className="text-xs text-muted-foreground">
              Average score across all quizzes
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-all duration-300 glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Financial Goals
            </CardTitle>
            <Link to="/goals" className="text-sm text-finance-primary hover:underline hover:text-finance-secondary transition-colors">
              View All Goals
            </Link>
          </CardHeader>
          <CardContent className="space-y-4">
            {goals.map((goal, index) => (
              <div 
                key={index} 
                className="space-y-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-all duration-200"
                onClick={() => toast(`${goal.name} Goal`, {
                  description: `Current progress: ${((goal.current / goal.target) * 100).toFixed(0)}%`
                })}
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{goal.name}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    goal.type === "profit" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {goal.type === "profit" ? "Profit" : "Trading"}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Current: {goal.type === "profit" ? "$" : ""}{goal.current}</span>
                  <span>Target: {goal.type === "profit" ? "$" : ""}{goal.target}</span>
                </div>
                <Progress value={(goal.current / goal.target) * 100} className="h-2" />
                <div className="text-xs text-muted-foreground text-right">
                  {((goal.current / goal.target) * 100).toFixed(0)}% Complete
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all duration-300 glass-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Upcoming Events
            </CardTitle>
            <Link to="/calendar" className="text-sm text-finance-primary hover:underline hover:text-finance-secondary transition-colors">
              View Calendar
            </Link>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {upcomingEvents.map((event, index) => (
                <div 
                  key={index} 
                  className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded-md cursor-pointer transition-colors"
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
                      event.type === "trading" ? "bg-blue-100 text-blue-800" : 
                      event.type === "goal" ? "bg-purple-100 text-purple-800" : 
                      "bg-gray-100 text-gray-800"
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
        <Card className="col-span-1 hover:shadow-lg transition-all duration-300 glass-card">
          <CardHeader>
            <CardTitle>Recent Lessons</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentLessons.map((lesson) => (
              <div 
                key={lesson.id} 
                className="space-y-2 p-2 rounded-md hover:bg-gray-50 cursor-pointer transition-all duration-200"
                onClick={() => handleLessonClick(lesson.title)}
              >
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{lesson.title}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${getCategoryColor(lesson.category)}`}>
                    {lesson.category}
                  </span>
                </div>
                <Progress value={lesson.progress} className="h-2" />
                <div className="text-xs text-muted-foreground">
                  {lesson.progress}% completed
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="col-span-1 hover:shadow-lg transition-all duration-300 glass-card">
          <CardHeader>
            <CardTitle>Trading Performance</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={tradePerformance}
                className={`${animatedChart ? 'animate-fade-in' : 'opacity-50'}`}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip contentStyle={{ background: "#fff", border: "1px solid #ddd" }} />
                <Bar dataKey="profit" fill="#1C7C54" />
                <Bar dataKey="loss" fill="#D64045" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        {/* New Quick Actions Card */}
        <Card className="col-span-1 hover:shadow-lg transition-all duration-300 glass-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              className="w-full flex items-center justify-between bg-finance-accent hover:bg-green-700"
              onClick={handleWithdrawFunds}
            >
              <span>Withdraw Funds</span>
              <Wallet className="h-4 w-4" />
            </Button>
            
            <Button 
              className="w-full flex items-center justify-between" 
              variant="outline"
              onClick={() => window.location.href = '/transactions'}
            >
              <span>Transaction History</span>
              <FileText className="h-4 w-4" />
            </Button>
            
            <Button 
              className="w-full flex items-center justify-between" 
              variant="outline"
              onClick={() => toast.info("Deposit Funds", { description: "Opening deposit funds page" })}
            >
              <span>Deposit Funds</span>
              <ArrowUp className="h-4 w-4" />
            </Button>
            
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-md">
              <h4 className="font-medium text-amber-800">Financial Tip</h4>
              <p className="text-xs text-amber-700 mt-1">Consistently allocating even small amounts to investments can lead to significant growth over time due to compound interest.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function getCategoryColor(category: string) {
  switch (category) {
    case "Investing":
      return "bg-blue-100 text-blue-800";
    case "Budgeting":
      return "bg-green-100 text-green-800";
    case "Savings":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
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
