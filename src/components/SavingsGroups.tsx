
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Target, TrendingUp, UserPlus, Crown } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface SavingsGroup {
  id: string;
  name: string;
  description: string;
  target: number;
  current: number;
  members: number;
  maxMembers: number;
  type: 'family' | 'friends' | 'community';
  isJoined: boolean;
  isPremium: boolean;
}

interface SavingsGroupsProps {
  userLevel: 'basic' | 'premium';
}

const SavingsGroups = ({ userLevel }: SavingsGroupsProps) => {
  const [groups, setGroups] = useState<SavingsGroup[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupTarget, setNewGroupTarget] = useState('');

  useEffect(() => {
    // Generate demo savings groups
    const demoGroups: SavingsGroup[] = [
      {
        id: '1',
        name: 'Family Emergency Fund',
        description: 'Building our family safety net together',
        target: 10000,
        current: 6500,
        members: 4,
        maxMembers: 6,
        type: 'family',
        isJoined: true,
        isPremium: false
      },
      {
        id: '2',
        name: 'College Friends Vacation',
        description: 'Saving for our reunion trip to Hawaii',
        target: 8000,
        current: 3200,
        members: 8,
        maxMembers: 10,
        type: 'friends',
        isJoined: true,
        isPremium: false
      },
      {
        id: '3',
        name: 'Investment Club',
        description: 'Learning and investing together',
        target: 25000,
        current: 15600,
        members: 12,
        maxMembers: 15,
        type: 'community',
        isJoined: false,
        isPremium: true
      },
      {
        id: '4',
        name: 'Startup Fund Pool',
        description: 'Entrepreneurs saving for business ventures',
        target: 50000,
        current: 28000,
        members: 20,
        maxMembers: 25,
        type: 'community',
        isJoined: false,
        isPremium: true
      }
    ];

    setGroups(demoGroups);
  }, []);

  const handleJoinGroup = (group: SavingsGroup) => {
    if (group.isPremium && userLevel === 'basic') {
      toast("🔒 Premium Feature", {
        description: "Upgrade to Premium to join advanced savings groups!",
        className: "bg-purple-600 border-purple-700 text-white",
        duration: 4000,
      });
      return;
    }

    if (userLevel === 'basic' && groups.filter(g => g.isJoined).length >= 2) {
      toast("📊 Limit Reached", {
        description: "Basic users can join up to 2 groups. Upgrade for unlimited access!",
        className: "bg-yellow-600 border-yellow-700 text-white",
        duration: 4000,
      });
      return;
    }

    setGroups(prev => prev.map(g => 
      g.id === group.id 
        ? { ...g, isJoined: true, members: g.members + 1 }
        : g
    ));

    toast("🎉 Joined Group!", {
      description: `You've joined "${group.name}". Start contributing to reach the goal!`,
      className: "bg-green-600 border-green-700 text-white",
      duration: 4000,
    });
  };

  const createGroup = () => {
    if (userLevel === 'basic') {
      toast("🔒 Premium Feature", {
        description: "Creating savings groups is a Premium feature. Upgrade to start your own group!",
        className: "bg-purple-600 border-purple-700 text-white",
        duration: 4000,
      });
      return;
    }

    if (!newGroupName || !newGroupTarget) {
      toast("❌ Missing Information", {
        description: "Please fill in all fields to create a group",
        className: "bg-red-600 border-red-700 text-white",
        duration: 3000,
      });
      return;
    }

    const newGroup: SavingsGroup = {
      id: Date.now().toString(),
      name: newGroupName,
      description: 'Custom savings group for reaching financial goals',
      target: parseFloat(newGroupTarget),
      current: 0,
      members: 1,
      maxMembers: 10,
      type: 'community',
      isJoined: true,
      isPremium: false
    };

    setGroups(prev => [newGroup, ...prev]);
    setShowCreateDialog(false);
    setNewGroupName('');
    setNewGroupTarget('');

    toast("✅ Group Created!", {
      description: `"${newGroupName}" is ready. Invite friends to join and start saving!`,
      className: "bg-green-600 border-green-700 text-white",
      duration: 4000,
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'family': return 'bg-green-600/20 text-green-300';
      case 'friends': return 'bg-blue-600/20 text-blue-300';
      case 'community': return 'bg-purple-600/20 text-purple-300';
      default: return 'bg-slate-600/20 text-slate-300';
    }
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  const accessibleGroups = userLevel === 'basic' 
    ? groups.filter(g => !g.isPremium || g.isJoined)
    : groups;

  return (
    <>
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              Savings Groups
            </div>
            <Button
              size="sm"
              onClick={() => setShowCreateDialog(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-1" />
              Create Group
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {accessibleGroups.map((group) => (
            <div 
              key={group.id}
              className={`p-4 rounded-lg border ${
                group.isPremium && !group.isJoined
                  ? 'bg-slate-700/50 border-purple-600/50'
                  : 'bg-slate-700 border-slate-600'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-white font-medium">{group.name}</h4>
                    <Badge className={getTypeColor(group.type)}>
                      {group.type}
                    </Badge>
                    {group.isPremium && (
                      <Crown className="h-4 w-4 text-purple-400" />
                    )}
                  </div>
                  <p className="text-slate-400 text-sm mb-2">{group.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Target className="h-4 w-4 text-green-400" />
                      <span className="text-slate-300">
                        ${group.current.toLocaleString()} / ${group.target.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UserPlus className="h-4 w-4 text-blue-400" />
                      <span className="text-slate-300">
                        {group.members}/{group.maxMembers} members
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{getProgressPercentage(group.current, group.target).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-slate-600 rounded-full h-2">
                      <div 
                        className="bg-green-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getProgressPercentage(group.current, group.target)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  {group.isJoined ? (
                    <Badge className="bg-green-600/20 text-green-300">
                      Joined
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleJoinGroup(group)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Join Group
                    </Button>
                  )}
                </div>

                {group.isJoined && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => toast("💰 Demo Action", { 
                      description: "This would open the contribution dialog in a real app",
                      className: "bg-blue-600 border-blue-700 text-white"
                    })}
                    className="border-green-600 text-green-400 hover:bg-green-800/20"
                  >
                    Contribute
                  </Button>
                )}
              </div>
            </div>
          ))}

          {userLevel === 'basic' && (
            <div className="mt-4 p-3 bg-purple-900/30 border border-purple-600/50 rounded-lg text-center">
              <Crown className="h-6 w-6 text-purple-400 mx-auto mb-2" />
              <p className="text-purple-300 text-sm mb-2">
                Join unlimited groups and create your own with Premium
              </p>
              <Button 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700"
                onClick={() => toast("Coming Soon!", { description: "Premium features coming soon!" })}
              >
                Upgrade Now
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Create New Savings Group</DialogTitle>
            <DialogDescription className="text-slate-300">
              Start a savings group to reach financial goals together
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Group Name</label>
              <Input
                placeholder="e.g., Family Vacation Fund"
                value={newGroupName}
                onChange={(e) => setNewGroupName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Savings Target ($)</label>
              <Input
                type="number"
                placeholder="e.g., 5000"
                value={newGroupTarget}
                onChange={(e) => setNewGroupTarget(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            {userLevel === 'basic' && (
              <div className="p-3 bg-purple-900/30 border border-purple-600/50 rounded">
                <p className="text-purple-300 text-sm">
                  🔒 Creating groups is a Premium feature
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={createGroup} className="bg-blue-600 hover:bg-blue-700">
              Create Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SavingsGroups;
