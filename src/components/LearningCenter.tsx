
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Video, CheckCircle, PlayCircle, Award, DollarSign, PiggyBank, TrendingUp, ArrowLeft, Clock } from "lucide-react";

const LearningCenter = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState(null);
  
  const categories = [
    { id: "all", label: "All Courses" },
    { id: "savings", label: "Savings", icon: <PiggyBank className="h-4 w-4" /> },
    { id: "budgeting", label: "Budgeting", icon: <DollarSign className="h-4 w-4" /> },
    { id: "investing", label: "Investing", icon: <TrendingUp className="h-4 w-4" /> },
  ];
  
  const courses = [
    {
      id: 1,
      title: "Intro to Stock Markets",
      description: "Learn the fundamentals of how stock markets work and how to analyze stocks.",
      category: "investing",
      lessons: 5,
      completedLessons: 3,
      duration: "1h 30m",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RvY2slMjBtYXJrZXR8ZW58MHx8MHx8fDA%3D",
      videos: [
        { id: 1, title: "What is the Stock Market?", duration: "12:30", thumbnail: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&auto=format&fit=crop&q=60", completed: true },
        { id: 2, title: "Types of Stocks", duration: "15:45", thumbnail: "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=400&auto=format&fit=crop&q=60", completed: true },
        { id: 3, title: "Reading Stock Charts", duration: "18:20", thumbnail: "https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=400&auto=format&fit=crop&q=60", completed: true },
        { id: 4, title: "Risk Management", duration: "22:15", thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=60", completed: false },
        { id: 5, title: "Building a Portfolio", duration: "25:10", thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&auto=format&fit=crop&q=60", completed: false }
      ]
    },
    {
      id: 2,
      title: "Creating a Budget",
      description: "Master the basics of budgeting and learn how to track your expenses effectively.",
      category: "budgeting",
      lessons: 4,
      completedLessons: 4,
      duration: "1h 15m",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21ed6c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YnVkZ2V0fGVufDB8fDB8fHww",
      videos: [
        { id: 1, title: "Budget Basics", duration: "10:30", thumbnail: "https://images.unsplash.com/photo-1554224155-8d04cb21ed6c?w=400&auto=format&fit=crop&q=60", completed: true },
        { id: 2, title: "Tracking Expenses", duration: "14:20", thumbnail: "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&auto=format&fit=crop&q=60", completed: true },
        { id: 3, title: "50/30/20 Rule", duration: "16:45", thumbnail: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=400&auto=format&fit=crop&q=60", completed: true },
        { id: 4, title: "Budget Apps & Tools", duration: "12:15", thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=60", completed: true }
      ]
    },
    {
      id: 3,
      title: "Compound Interest Magic",
      description: "Understand how compound interest works and how it can help grow your wealth over time.",
      category: "savings",
      lessons: 3,
      completedLessons: 1,
      duration: "45m",
      image: "https://images.unsplash.com/photo-1579621970590-9d624316904b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29tcG91bmQlMjBpbnRlcmVzdHxlbnwwfHwwfHx8MA%3D%3D",
      videos: [
        { id: 1, title: "Understanding Compound Interest", duration: "15:30", thumbnail: "https://images.unsplash.com/photo-1579621970590-9d624316904b?w=400&auto=format&fit=crop&q=60", completed: true },
        { id: 2, title: "The Power of Time", duration: "18:45", thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=60", completed: false },
        { id: 3, title: "Real-World Examples", duration: "11:20", thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=60", completed: false }
      ]
    }
  ];
  
  const filteredCourses = activeTab === "all" 
    ? courses 
    : courses.filter(course => course.category === activeTab);

  if (selectedCourse) {
    const course = courses.find(c => c.id === selectedCourse);
    return (
      <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => setSelectedCourse(null)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Courses
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white">{course.title}</CardTitle>
                <CardDescription>{course.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="aspect-video bg-slate-900 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    className="w-full h-full object-cover opacity-50"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <PlayCircle className="h-16 w-16 text-white opacity-80" />
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    {course.duration}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-white text-lg">Course Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {course.videos.map((video, index) => (
                  <div 
                    key={video.id}
                    className="flex items-center gap-3 p-3 rounded-lg bg-slate-700 hover:bg-slate-600 cursor-pointer transition-colors"
                  >
                    <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0">
                      <img 
                        src={video.thumbnail} 
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        {video.completed ? (
                          <CheckCircle className="h-4 w-4 text-green-400" />
                        ) : (
                          <PlayCircle className="h-4 w-4 text-white" />
                        )}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white text-sm font-medium truncate">{video.title}</h4>
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="h-3 w-3" />
                        <span>{video.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="p-4 md:p-6 space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-green-400">Learning Center</h2>
          <p className="text-slate-400 mt-1">Enhance your financial knowledge with these courses</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-slate-400">Overall Progress:</span>
          <Progress value={35} className="w-32 md:w-48 h-2" />
          <span className="text-sm font-medium text-white">35%</span>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 bg-slate-800">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              {category.icon}
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredCourses.map((course) => {
              const progress = Math.round((course.completedLessons / course.lessons) * 100);
              const isCompleted = progress === 100;
              
              return (
                <Card key={course.id} className="overflow-hidden bg-slate-800 border-slate-700 hover:border-slate-600 transition-colors">
                  <div className="relative h-32 md:h-48 overflow-hidden">
                    <img 
                      src={course.image} 
                      alt={course.title} 
                      className="w-full h-full object-cover"
                    />
                    {isCompleted && (
                      <div className="absolute top-2 right-2 bg-green-500 text-white p-1 rounded-md flex items-center">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="text-xs font-medium">Completed</span>
                      </div>
                    )}
                  </div>
                  
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-white text-lg">{course.title}</CardTitle>
                      <div className="px-2 py-1 rounded-full text-xs bg-blue-900 text-blue-300">
                        {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2 text-sm">{course.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="flex justify-between text-sm text-slate-400 mb-2">
                      <div className="flex items-center">
                        <Video className="h-4 w-4 mr-1" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-300">Progress</span>
                        <span className="text-white">{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-2">
                    <Button 
                      variant={isCompleted ? "outline" : "default"}
                      className={`w-full ${isCompleted ? "border-green-600 text-green-400" : "bg-green-600 hover:bg-green-700"}`}
                      onClick={() => setSelectedCourse(course.id)}
                    >
                      {isCompleted ? (
                        <><Award className="h-4 w-4 mr-2" /> View Certificate</>
                      ) : (
                        <><PlayCircle className="h-4 w-4 mr-2" /> {course.completedLessons > 0 ? "Continue" : "Start"} Course</>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LearningCenter;
