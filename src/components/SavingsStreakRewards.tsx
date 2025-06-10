
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Trophy, 
  Flame, 
  Star, 
  Gift, 
  Target, 
  Calendar,
  Award,
  Crown,
  Zap,
  Medal
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  requirement: string;
  earned: boolean;
  progress: number;
  maxProgress: number;
}

interface Streak {
  current: number;
  longest: number;
  lastSaveDate: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  points: number;
  claimed: boolean;
  requirement: number;
  type: 'streak' | 'amount' | 'badge';
}

const SavingsStreakRewards = () => {
  const [streak, setStreak] = useState<Streak>({ current: 12, longest: 15, lastSaveDate: '2024-01-15' });
  const [badges, setBadges] = useState<Badge[]>([]);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [totalPoints, setTotalPoints] = useState(850);
  const [currentLevel, setCurrentLevel] = useState(3);

  useEffect(() => {
    // Initialize badges
    const savingsBadges: Badge[] = [
      {
        id: '1',
        name: 'First Step',
        description: 'Made your first savings deposit',
        icon: <Star className="h-6 w-6" />,
        color: 'text-blue-400',
        requirement: '1 savings deposit',
        earned: true,
        progress: 1,
        maxProgress: 1
      },
      {
        id: '2',
        name: 'Weekly Warrior',
        description: 'Saved money for 7 consecutive days',
        icon: <Calendar className="h-6 w-6" />,
        color: 'text-green-400',
        requirement: '7-day streak',
        earned: true,
        progress: 7,
        maxProgress: 7
      },
      {
        id: '3',
        name: 'Fire Saver',
        description: 'Maintain a 14-day savings streak',
        icon: <Flame className="h-6 w-6" />,
        color: 'text-orange-400',
        requirement: '14-day streak',
        earned: false,
        progress: 12,
        maxProgress: 14
      },
      {
        id: '4',
        name: 'Savings Master',
        description: 'Saved ₦100,000 in total',
        icon: <Crown className="h-6 w-6" />,
        color: 'text-purple-400',
        requirement: '₦100,000 total',
        earned: false,
        progress: 75000,
        maxProgress: 100000
      },
      {
        id: '5',
        name: 'Consistency King',
        description: 'Maintain a 30-day savings streak',
        icon: <Trophy className="h-6 w-6" />,
        color: 'text-yellow-400',
        requirement: '30-day streak',
        earned: false,
        progress: 12,
        maxProgress: 30
      },
      {
        id: '6',
        name: 'Speed Saver',
        description: 'Save ₦10,000 in one day',
        icon: <Zap className="h-6 w-6" />,
        color: 'text-cyan-400',
        requirement: '₦10,000 in 1 day',
        earned: true,
        progress: 1,
        maxProgress: 1
      }
    ];

    setBadges(savingsBadges);

    // Initialize rewards
    const availableRewards: Reward[] = [
      {
        id: '1',
        title: 'Bonus Interest Rate',
        description: 'Get 1% extra interest for next month',
        points: 100,
        claimed: false,
        requirement: 7,
        type: 'streak'
      },
      {
        id: '2',
        title: 'Free Stock Analysis',
        description: 'Get professional analysis of 3 NSE stocks',
        points: 250,
        claimed: true,
        requirement: 10,
        type: 'streak'
      },
      {
        id: '3',
        title: 'Trading Fee Waiver',
        description: 'Free trading for next 5 transactions',
        points: 500,
        claimed: false,
        requirement: 20,
        type: 'streak'
      },
      {
        id: '4',
        title: 'Investment Consultation',
        description: '30-min session with financial advisor',
        points: 750,
        claimed: false,
        requirement: 30,
        type: 'streak'
      }
    ];

    setRewards(availableRewards);
  }, []);

  const claimReward = (reward: Reward) => {
    if (streak.current >= reward.requirement && !reward.claimed) {
      setTotalPoints(prev => prev + reward.points);
      setRewards(prev => prev.map(r => 
        r.id === reward.id ? { ...r, claimed: true } : r
      ));
      
      toast("🎁 Reward Claimed!", {
        description: `You earned ${reward.points} points for "${reward.title}"`,
        className: "bg-green-600 border-green-700 text-white",
        duration: 4000,
      });
    } else {
      toast("🔒 Reward Locked", {
        description: `You need a ${reward.requirement}-day streak to unlock this reward`,
        className: "bg-orange-600 border-orange-700 text-white",
      });
    }
  };

  const extendStreak = () => {
    setStreak(prev => ({
      ...prev,
      current: prev.current + 1,
      longest: Math.max(prev.longest, prev.current + 1)
    }));
    
    toast("🔥 Streak Extended!", {
      description: `Your savings streak is now ${streak.current + 1} days!`,
      className: "bg-green-600 border-green-700 text-white",
    });
  };

  const getBadgeProgress = (badge: Badge) => {
    return (badge.progress / badge.maxProgress) * 100;
  };

  const getStreakColor = (current: number) => {
    if (current >= 30) return 'text-purple-400';
    if (current >= 20) return 'text-yellow-400';
    if (current >= 14) return 'text-orange-400';
    if (current >= 7) return 'text-green-400';
    return 'text-blue-400';
  };

  const levelProgress = (totalPoints % 1000) / 10;

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Flame className="h-8 w-8 text-orange-400" />
            <h1 className="text-3xl font-bold text-white">Savings Streak Rewards</h1>
          </div>
          <p className="text-slate-400">Keep your savings habit alive and earn amazing rewards!</p>
        </div>

        {/* Current Streak & Level */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-orange-900/50 to-red-900/50 border-orange-600/50 animate-scale-up">
            <CardContent className="p-6 text-center">
              <div className="flex justify-center mb-4">
                <div className="relative">
                  <Flame className={`h-16 w-16 ${getStreakColor(streak.current)}`} />
                  <div className="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold rounded-full w-8 h-8 flex items-center justify-center">
                    {streak.current}
                  </div>
                </div>
              </div>
              <h3 className="text-white text-xl font-bold mb-2">Current Streak</h3>
              <p className="text-orange-300">{streak.current} days in a row</p>
              <p className="text-slate-400 text-sm mt-2">Best: {streak.longest} days</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-600/50 animate-scale-up delay-100">
            <CardContent className="p-6 text-center">
              <Crown className="h-16 w-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-2">Level {currentLevel}</h3>
              <p className="text-purple-300">{totalPoints} Points</p>
              <Progress value={levelProgress} className="mt-3" />
              <p className="text-slate-400 text-sm mt-2">{100 - levelProgress}% to Level {currentLevel + 1}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/50 to-emerald-900/50 border-green-600/50 animate-scale-up delay-200">
            <CardContent className="p-6 text-center">
              <Target className="h-16 w-16 text-green-400 mx-auto mb-4" />
              <h3 className="text-white text-xl font-bold mb-2">Next Goal</h3>
              <p className="text-green-300">14-day streak</p>
              <Progress value={(streak.current / 14) * 100} className="mt-3" />
              <p className="text-slate-400 text-sm mt-2">{14 - streak.current} days to go</p>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="text-center mb-8">
          <Button 
            onClick={extendStreak}
            size="lg"
            className="bg-green-600 hover:bg-green-700 px-8 py-4 text-lg animate-pulse"
          >
            <Gift className="h-5 w-5 mr-2" />
            Save Today & Extend Streak
          </Button>
        </div>

        {/* Badges Section */}
        <Card className="bg-slate-800 border-slate-700 mb-8 animate-fade-in delay-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-400" />
              Achievement Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    badge.earned 
                      ? 'bg-slate-700/50 border-green-600/50' 
                      : 'bg-slate-700/30 border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${badge.earned ? 'bg-green-900/50' : 'bg-slate-600/50'}`}>
                      <div className={badge.color}>
                        {badge.icon}
                      </div>
                    </div>
                    {badge.earned && (
                      <Badge className="bg-green-600/20 text-green-300 border-green-500">
                        Earned
                      </Badge>
                    )}
                  </div>
                  
                  <h4 className="text-white font-medium mb-2">{badge.name}</h4>
                  <p className="text-slate-400 text-sm mb-3">{badge.description}</p>
                  
                  {!badge.earned && (
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-400">Progress</span>
                        <span className="text-white">
                          {badge.progress.toLocaleString()}/{badge.maxProgress.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={getBadgeProgress(badge)} className="mb-2" />
                      <p className="text-xs text-slate-500">{badge.requirement}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Rewards Section */}
        <Card className="bg-slate-800 border-slate-700 animate-fade-in delay-400">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Gift className="h-5 w-5 text-green-400" />
              Available Rewards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rewards.map((reward) => (
                <div
                  key={reward.id}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    reward.claimed
                      ? 'bg-green-900/20 border-green-600/50'
                      : streak.current >= reward.requirement
                      ? 'bg-blue-900/20 border-blue-600/50 hover:border-blue-500'
                      : 'bg-slate-700/30 border-slate-600 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="text-white font-medium mb-1">{reward.title}</h4>
                      <p className="text-slate-300 text-sm mb-2">{reward.description}</p>
                      <p className="text-orange-400 text-sm">Requires {reward.requirement}-day streak</p>
                    </div>
                    <div className="text-right">
                      <div className="text-yellow-400 font-bold">+{reward.points} pts</div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => claimReward(reward)}
                    disabled={reward.claimed || streak.current < reward.requirement}
                    size="sm"
                    className={`w-full ${
                      reward.claimed
                        ? 'bg-green-600 text-white cursor-not-allowed'
                        : streak.current >= reward.requirement
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-slate-600 cursor-not-allowed'
                    }`}
                  >
                    {reward.claimed ? (
                      <>
                        <Medal className="h-4 w-4 mr-2" />
                        Claimed
                      </>
                    ) : streak.current >= reward.requirement ? (
                      <>
                        <Gift className="h-4 w-4 mr-2" />
                        Claim Reward
                      </>
                    ) : (
                      `${reward.requirement - streak.current} days to unlock`
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SavingsStreakRewards;
