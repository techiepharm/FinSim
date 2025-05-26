
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Target, Plus, Trash2, Edit2, Check } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

const Goals = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Emergency Fund',
      targetAmount: 5000,
      currentAmount: 1200,
      deadline: '2024-12-31',
      category: 'Savings'
    },
    {
      id: '2',
      title: 'Vacation Fund',
      targetAmount: 2500,
      currentAmount: 800,
      deadline: '2024-08-15',
      category: 'Travel'
    },
    {
      id: '3',
      title: 'Investment Portfolio',
      targetAmount: 10000,
      currentAmount: 3200,
      deadline: '2025-06-30',
      category: 'Investment'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: '',
    targetAmount: '',
    deadline: '',
    category: ''
  });

  const handleAddGoal = () => {
    if (!newGoal.title || !newGoal.targetAmount || !newGoal.deadline) {
      toast("❌ Missing Information", {
        description: "Please fill in all fields to create a goal.",
        className: "bg-red-600 border-red-700 text-white",
      });
      return;
    }

    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      targetAmount: parseFloat(newGoal.targetAmount),
      currentAmount: 0,
      deadline: newGoal.deadline,
      category: newGoal.category || 'General'
    };

    setGoals([...goals, goal]);
    setNewGoal({ title: '', targetAmount: '', deadline: '', category: '' });
    setShowAddForm(false);
    
    toast("🎯 Goal Created", {
      description: `Your ${goal.title} goal has been created!`,
      className: "bg-green-600 border-green-700 text-white",
    });
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
    toast("🗑️ Goal Deleted", {
      description: "Goal has been removed from your list.",
      className: "bg-orange-600 border-orange-700 text-white",
    });
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'savings': return 'bg-green-600';
      case 'travel': return 'bg-blue-600';
      case 'investment': return 'bg-purple-600';
      default: return 'bg-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Financial Goals</h1>
            <p className="text-slate-400">🎯 Demo Account - Track your savings and investment targets</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="bg-green-600 hover:bg-green-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Goal
          </Button>
        </div>

        {showAddForm && (
          <Card className="bg-slate-800 border-slate-700 mb-6">
            <CardHeader>
              <CardTitle className="text-white">Create New Goal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                placeholder="Goal title (e.g., Emergency Fund)"
                value={newGoal.title}
                onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Input
                type="number"
                placeholder="Target amount ($)"
                value={newGoal.targetAmount}
                onChange={(e) => setNewGoal({...newGoal, targetAmount: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Input
                type="date"
                value={newGoal.deadline}
                onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <Input
                placeholder="Category (e.g., Savings, Travel, Investment)"
                value={newGoal.category}
                onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
              />
              <div className="flex gap-2">
                <Button onClick={handleAddGoal} className="bg-green-600 hover:bg-green-700">
                  <Check className="h-4 w-4 mr-2" />
                  Create Goal
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {goals.map((goal) => (
            <Card key={goal.id} className="bg-slate-800 border-slate-700">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-white flex items-center">
                      <Target className="h-5 w-5 mr-2 text-green-400" />
                      {goal.title}
                    </CardTitle>
                    <div className={`inline-block px-2 py-1 rounded-full text-xs text-white mt-2 ${getCategoryColor(goal.category)}`}>
                      {goal.category}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white">
                      ${goal.currentAmount.toLocaleString()} / ${goal.targetAmount.toLocaleString()}
                    </span>
                  </div>
                  <Progress 
                    value={getProgressPercentage(goal.currentAmount, goal.targetAmount)} 
                    className="h-2"
                  />
                  <div className="text-right text-xs text-slate-400 mt-1">
                    {getProgressPercentage(goal.currentAmount, goal.targetAmount).toFixed(1)}% complete
                  </div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Target Date:</span>
                  <span className="text-white">{new Date(goal.deadline).toLocaleDateString()}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Remaining:</span>
                  <span className="text-green-400">
                    ${(goal.targetAmount - goal.currentAmount).toLocaleString()}
                  </span>
                </div>

                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Progress
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {goals.length === 0 && (
          <Card className="bg-slate-800 border-slate-700 text-center py-12">
            <CardContent>
              <Target className="h-16 w-16 text-slate-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Goals Yet</h3>
              <p className="text-slate-400 mb-4">Start by creating your first financial goal!</p>
              <Button onClick={() => setShowAddForm(true)} className="bg-green-600 hover:bg-green-700">
                <Plus className="h-4 w-4 mr-2" />
                Create First Goal
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="mt-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">💡 Goal Setting Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-slate-300">
                <p className="mb-2">🎯 <strong>Make it SMART:</strong> Specific, Measurable, Achievable, Relevant, Time-bound</p>
                <p className="mb-2">💰 <strong>Start small:</strong> Begin with achievable goals to build momentum</p>
                <p className="mb-2">📅 <strong>Set deadlines:</strong> Having a target date keeps you motivated</p>
                <p>🔄 <strong>Review regularly:</strong> Check your progress and adjust as needed</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Goals;
