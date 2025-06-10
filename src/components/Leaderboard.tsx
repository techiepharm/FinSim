
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Trophy, 
  Medal, 
  Award, 
  TrendingUp, 
  Crown,
  Star,
  Target
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface LeaderboardUser {
  id: string;
  name: string;
  totalReturn: number;
  weeklyReturn: number;
  trades: number;
  winRate: number;
  rank: number;
  badge: string;
  isCurrentUser?: boolean;
}

const Leaderboard = () => {
  const [timeframe, setTimeframe] = useState<'weekly' | 'monthly' | 'all'>('weekly');
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardUser[]>([]);

  useEffect(() => {
    // Mock leaderboard data - in real app, this would come from API
    const mockData: LeaderboardUser[] = [
      {
        id: '1',
        name: 'Adebayo Ogundimu',
        totalReturn: 28.5,
        weeklyReturn: 8.2,
        trades: 45,
        winRate: 78,
        rank: 1,
        badge: 'Stock Master',
        isCurrentUser: false
      },
      {
        id: '2',
        name: 'Kemi Ajayi',
        totalReturn: 24.1,
        weeklyReturn: 6.8,
        trades: 38,
        winRate: 72,
        rank: 2,
        badge: 'Rising Star'
      },
      {
        id: '3',
        name: 'Ezra Folorunso',
        totalReturn: 19.3,
        weeklyReturn: 5.2,
        trades: 28,
        winRate: 68,
        rank: 3,
        badge: 'Smart Trader',
        isCurrentUser: true
      },
      {
        id: '4',
        name: 'Chidi Okwu',
        totalReturn: 15.7,
        weeklyReturn: 4.1,
        trades: 32,
        winRate: 65,
        rank: 4,
        badge: 'Steady Investor'
      },
      {
        id: '5',
        name: 'Funmi Lagos',
        totalReturn: 12.8,
        weeklyReturn: 3.5,
        trades: 25,
        winRate: 62,
        rank: 5,
        badge: 'Patient Trader'
      }
    ];
    
    setLeaderboardData(mockData);
  }, [timeframe]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="h-6 w-6 text-yellow-400" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <span className="text-lg font-bold text-slate-400">#{rank}</span>;
    }
  };

  const getBadgeColor = (badge: string) => {
    const colors: Record<string, string> = {
      'Stock Master': 'bg-purple-600/20 text-purple-300 border-purple-500',
      'Rising Star': 'bg-blue-600/20 text-blue-300 border-blue-500',
      'Smart Trader': 'bg-green-600/20 text-green-300 border-green-500',
      'Steady Investor': 'bg-orange-600/20 text-orange-300 border-orange-500',
      'Patient Trader': 'bg-indigo-600/20 text-indigo-300 border-indigo-500'
    };
    return colors[badge] || 'bg-gray-600/20 text-gray-300 border-gray-500';
  };

  const handleTimeframeChange = (newTimeframe: 'weekly' | 'monthly' | 'all') => {
    setTimeframe(newTimeframe);
    toast("📊 Leaderboard Updated", {
      description: `Showing ${newTimeframe} performance rankings`,
      className: "bg-blue-600 border-blue-700 text-white",
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Trophy className="h-8 w-8 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">🇳🇬 NSE Trading Leaderboard</h1>
          </div>
          <p className="text-slate-400">See how Nigerian traders are performing this week!</p>
        </div>

        {/* Timeframe Selector */}
        <Card className="bg-slate-800 border-slate-700 mb-6 animate-slide-in-bottom">
          <CardContent className="p-4">
            <div className="flex justify-center gap-2">
              {['weekly', 'monthly', 'all'].map((period) => (
                <button
                  key={period}
                  onClick={() => handleTimeframeChange(period as any)}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    timeframe === period
                      ? 'bg-green-600 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {leaderboardData.slice(0, 3).map((user, index) => (
            <Card 
              key={user.id} 
              className={`bg-gradient-to-br ${
                index === 0 
                  ? 'from-yellow-900/50 to-yellow-800/50 border-yellow-600' 
                  : index === 1 
                  ? 'from-gray-900/50 to-gray-800/50 border-gray-600'
                  : 'from-amber-900/50 to-amber-800/50 border-amber-600'
              } animate-scale-up delay-${index * 100}`}
            >
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  {getRankIcon(user.rank)}
                </div>
                <Avatar className="w-16 h-16 mx-auto mb-4">
                  <AvatarFallback className="bg-slate-700 text-white text-lg">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-white font-bold mb-2">{user.name}</h3>
                <Badge className={`mb-3 ${getBadgeColor(user.badge)}`}>
                  {user.badge}
                </Badge>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Weekly Return:</span>
                    <span className="text-green-400 font-medium">+{user.weeklyReturn}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Win Rate:</span>
                    <span className="text-white">{user.winRate}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Full Leaderboard */}
        <Card className="bg-slate-800 border-slate-700 animate-fade-in delay-300">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-400" />
              Full Rankings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboardData.map((user, index) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 hover:bg-slate-700/50 ${
                    user.isCurrentUser ? 'bg-green-900/30 border border-green-600/50' : 'bg-slate-700/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 flex justify-center">
                      {getRankIcon(user.rank)}
                    </div>
                    <Avatar className="w-10 h-10">
                      <AvatarFallback className="bg-slate-600 text-white">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="text-white font-medium flex items-center gap-2">
                        {user.name}
                        {user.isCurrentUser && <Star className="h-4 w-4 text-yellow-400" />}
                      </h4>
                      <Badge className={`text-xs ${getBadgeColor(user.badge)}`}>
                        {user.badge}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-green-400 font-medium">+{user.weeklyReturn}%</div>
                    <div className="text-slate-400 text-sm">{user.trades} trades</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Achievement Hints */}
        <Card className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-600/50 mt-6 animate-fade-in delay-500">
          <CardContent className="p-4 text-center">
            <Target className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <p className="text-purple-300 text-sm mb-2">🎯 Next Badge: Complete 50 trades to unlock "Veteran Trader"</p>
            <p className="text-slate-400 text-xs">Trade more Nigerian stocks to climb the leaderboard!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Leaderboard;
