
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Target, TrendingUp, CalendarDays } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Goal {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: Date;
  type: 'profit' | 'trading';
  created: Date;
}

const Goals = () => {
  const [profitGoals, setProfitGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Monthly Profit',
      target: 5000,
      current: 3149,
      deadline: new Date(2025, 5, 30),
      type: 'profit',
      created: new Date(2025, 4, 1)
    },
    {
      id: '2',
      name: 'Yearly Portfolio Growth',
      target: 15000,
      current: 3750,
      deadline: new Date(2025, 11, 31),
      type: 'profit',
      created: new Date(2025, 0, 1)
    }
  ]);
  
  const [tradingGoals, setTradingGoals] = useState<Goal[]>([
    {
      id: '1',
      name: 'Successful Trades',
      target: 50,
      current: 12,
      deadline: new Date(2025, 6, 30),
      type: 'trading',
      created: new Date(2025, 4, 1)
    },
    {
      id: '2',
      name: 'Diversification',
      target: 10,
      current: 5,
      deadline: new Date(2025, 5, 15),
      type: 'trading',
      created: new Date(2025, 4, 1)
    }
  ]);

  // Form state for adding new goals
  const [newGoal, setNewGoal] = useState({
    name: '',
    target: 0,
    deadline: new Date(),
    type: 'profit' as 'profit' | 'trading'
  });
  
  const handleAddGoal = (type: 'profit' | 'trading') => {
    if (!newGoal.name || newGoal.target <= 0) {
      toast.error("Please fill in all fields correctly");
      return;
    }
    
    const goal: Goal = {
      id: Date.now().toString(),
      name: newGoal.name,
      target: newGoal.target,
      current: 0,
      deadline: newGoal.deadline,
      type,
      created: new Date()
    };
    
    if (type === 'profit') {
      setProfitGoals(prev => [...prev, goal]);
    } else {
      setTradingGoals(prev => [...prev, goal]);
    }
    
    setNewGoal({
      name: '',
      target: 0,
      deadline: new Date(),
      type: 'profit'
    });
    
    toast.success(`New ${type} goal created successfully`);
  };
  
  const calculateProgress = (current: number, target: number) => {
    const progress = (current / target) * 100;
    return Math.min(progress, 100);
  };
  
  return (
    <div className="p-6 space-y-6">
      <h2 className="text-3xl font-bold text-finance-primary">Financial Goals</h2>
      <p className="text-muted-foreground">Track your financial progress with personalized goals</p>
      
      <Tabs defaultValue="profit">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="profit" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Profit Goals
            </TabsTrigger>
            <TabsTrigger value="trading" className="flex items-center gap-1">
              <Target className="h-4 w-4" />
              Trading Goals
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="profit" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {profitGoals.map(goal => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{goal.name}</CardTitle>
                      <CardDescription>
                        Target: ${goal.target.toLocaleString()}
                      </CardDescription>
                    </div>
                    <div className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {format(goal.deadline, "MMM d, yyyy")}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>${goal.current.toLocaleString()}</span>
                      <span>${goal.target.toLocaleString()}</span>
                    </div>
                    <Progress value={calculateProgress(goal.current, goal.target)} />
                    <div className="text-right text-sm text-muted-foreground">
                      {calculateProgress(goal.current, goal.target).toFixed(0)}% Complete
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Add New Profit Goal */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Profit Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <label htmlFor="goal-name" className="text-sm font-medium">Goal Name</label>
                  <Input 
                    id="goal-name" 
                    value={newGoal.name} 
                    onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                    placeholder="e.g., Monthly Return Goal" 
                  />
                </div>
                <div>
                  <label htmlFor="goal-target" className="text-sm font-medium">Target Amount ($)</label>
                  <Input 
                    id="goal-target" 
                    type="number"
                    value={newGoal.target || ''} 
                    onChange={(e) => setNewGoal({...newGoal, target: Number(e.target.value)})}
                    placeholder="5000" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Deadline</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newGoal.deadline && "text-muted-foreground"
                        )}
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {newGoal.deadline ? format(newGoal.deadline, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newGoal.deadline}
                        onSelect={(date) => date && setNewGoal({...newGoal, deadline: date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-finance-accent hover:bg-green-700" 
                onClick={() => handleAddGoal('profit')}
              >
                Create Profit Goal
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="trading" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tradingGoals.map(goal => (
              <Card key={goal.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{goal.name}</CardTitle>
                      <CardDescription>
                        Target: {goal.target} {goal.name.toLowerCase().includes('trade') ? 'trades' : 'stocks'}
                      </CardDescription>
                    </div>
                    <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" />
                      {format(goal.deadline, "MMM d, yyyy")}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{goal.current}</span>
                      <span>{goal.target}</span>
                    </div>
                    <Progress value={calculateProgress(goal.current, goal.target)} />
                    <div className="text-right text-sm text-muted-foreground">
                      {calculateProgress(goal.current, goal.target).toFixed(0)}% Complete
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Add New Trading Goal */}
          <Card>
            <CardHeader>
              <CardTitle>Create New Trading Goal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <label htmlFor="trading-goal-name" className="text-sm font-medium">Goal Name</label>
                  <Input 
                    id="trading-goal-name" 
                    value={newGoal.name} 
                    onChange={(e) => setNewGoal({...newGoal, name: e.target.value})}
                    placeholder="e.g., Weekly Successful Trades" 
                  />
                </div>
                <div>
                  <label htmlFor="trading-goal-target" className="text-sm font-medium">Target Number</label>
                  <Input 
                    id="trading-goal-target" 
                    type="number"
                    value={newGoal.target || ''} 
                    onChange={(e) => setNewGoal({...newGoal, target: Number(e.target.value)})}
                    placeholder="10" 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Deadline</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !newGoal.deadline && "text-muted-foreground"
                        )}
                      >
                        <CalendarDays className="mr-2 h-4 w-4" />
                        {newGoal.deadline ? format(newGoal.deadline, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={newGoal.deadline}
                        onSelect={(date) => date && setNewGoal({...newGoal, deadline: date})}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full bg-finance-primary hover:bg-blue-700" 
                onClick={() => handleAddGoal('trading')}
              >
                Create Trading Goal
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Goals;
