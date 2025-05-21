
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Video, CheckCircle, PlayCircle, Award, DollarSign, PiggyBank, TrendingUp } from "lucide-react";

const LearningCenter = () => {
  const [activeTab, setActiveTab] = useState("all");
  
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
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3RvY2slMjBtYXJrZXR8ZW58MHx8MHx8fDA%3D"
    },
    {
      id: 2,
      title: "Creating a Budget",
      description: "Master the basics of budgeting and learn how to track your expenses effectively.",
      category: "budgeting",
      lessons: 4,
      completedLessons: 4,
      duration: "1h 15m",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21ed6c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8YnVkZ2V0fGVufDB8fDB8fHww"
    },
    {
      id: 3,
      title: "Compound Interest Magic",
      description: "Understand how compound interest works and how it can help grow your wealth over time.",
      category: "savings",
      lessons: 3,
      completedLessons: 1,
      duration: "45m",
      image: "https://images.unsplash.com/photo-1579621970590-9d624316904b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Y29tcG91bmQlMjBpbnRlcmVzdHxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      id: 4,
      title: "Risk Management",
      description: "Learn strategies to manage risk in your investment portfolio.",
      category: "investing",
      lessons: 6,
      completedLessons: 0,
      duration: "2h",
      image: "https://images.unsplash.com/photo-1633158829875-e5316a358c6f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmlzayUyMG1hbmFnZW1lbnR8ZW58MHx8MHx8fDA%3D"
    },
    {
      id: 5,
      title: "Emergency Fund Basics",
      description: "Learn how to build and maintain an emergency fund for financial security.",
      category: "savings",
      lessons: 4,
      completedLessons: 2,
      duration: "1h",
      image: "https://images.unsplash.com/photo-1579621970795-87facc2f976d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZW1lcmdlbmN5JTIwZnVuZHxlbnwwfHwwfHx8MA%3D%3D"
    },
    {
      id: 6,
      title: "Debt Management Strategies",
      description: "Effective strategies for managing and paying off debt.",
      category: "budgeting",
      lessons: 5,
      completedLessons: 0,
      duration: "1h 45m",
      image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZGVidHxlbnwwfHwwfHx8MA%3D%3D"
    },
  ];
  
  const filteredCourses = activeTab === "all" 
    ? courses 
    : courses.filter(course => course.category === activeTab);
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-finance-primary">Learning Center</h2>
          <p className="text-muted-foreground mt-1">Enhance your financial knowledge with these courses</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Overall Progress:</span>
          <Progress value={35} className="w-48 h-2" />
          <span className="text-sm font-medium">35%</span>
        </div>
      </div>
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              {category.icon}
              {category.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value={activeTab} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const progress = Math.round((course.completedLessons / course.lessons) * 100);
              const isCompleted = progress === 100;
              
              return (
                <Card key={course.id} className="overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
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
                  
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle>{course.title}</CardTitle>
                      <div className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        {course.category.charAt(0).toUpperCase() + course.category.slice(1)}
                      </div>
                    </div>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex justify-between text-sm text-muted-foreground mb-2">
                      <div className="flex items-center">
                        <BookOpen className="h-4 w-4 mr-1" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center">
                        <Video className="h-4 w-4 mr-1" />
                        <span>{course.duration}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2" />
                    </div>
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      variant={isCompleted ? "outline" : "default"}
                      className={`w-full ${isCompleted ? "" : "bg-finance-primary"}`}
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
