
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { 
  Menu, 
  BarChart3, 
  BookOpen, 
  Target, 
  Calendar, 
  History, 
  Settings, 
  LogOut,
  Trophy,
  Brain,
  PiggyBank,
  Flame,
  Newspaper,
  TrendingUp,
  Activity,
  Globe
} from "lucide-react";
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
  currentUser: any;
  onShowAuth: () => void;
  onLogout: () => void;
}

const Header = ({ activePage, setActivePage, currentUser, onShowAuth, onLogout }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/' },
    { id: 'learning', label: 'Learning', icon: BookOpen },
    { id: 'trading', label: 'Trading', icon: TrendingUp, path: '/trading' },
    { id: 'portfolio', label: 'Portfolio', icon: BarChart3 },
    { id: 'goals', label: 'Goals', icon: Target, path: '/goals' },
    { id: 'calendar', label: 'Calendar', icon: Calendar, path: '/calendar' },
    { id: 'transactions', label: 'Transactions', icon: History, path: '/transactions' }
  ];

  const enhancedFeatures = [
    { id: 'market-data', label: 'Live Market Data', icon: Activity, path: '/market-data', badge: 'ENHANCED' },
    { id: 'macro-news', label: 'Economic News', icon: Globe, path: '/macro-news', badge: 'NEW' },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy, path: '/leaderboard' },
    { id: 'risk-assessment', label: 'Risk Quiz', icon: Brain, path: '/risk-assessment' },
    { id: 'spending-advisor', label: 'AI Advisor', icon: PiggyBank, path: '/spending-advisor' },
    { id: 'savings-rewards', label: 'Rewards', icon: Flame, path: '/savings-rewards' },
    { id: 'news-impact', label: 'News Impact', icon: Newspaper, path: '/news-impact' }
  ];

  const handleNavigation = (item: any) => {
    if (item.path) {
      navigate(item.path);
    } else {
      setActivePage(item.id);
    }
    setIsMobileMenuOpen(false);
  };

  const userInitials = currentUser?.user_metadata?.full_name
    ?.split(' ')
    .map((name: string) => name[0])
    .join('') || 'U';

  return (
    <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50 animate-slide-in-bottom">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FS</span>
            </div>
            <span className="text-white font-bold text-xl">FinSavvy</span>
            <Badge className="bg-green-600/20 text-green-300 border-green-500 text-xs">
              🇳🇬 Nigerian Demo
            </Badge>
            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500 text-xs animate-pulse">
              ENHANCED
            </Badge>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant={activePage === item.id ? "default" : "ghost"}
              size="sm"
              onClick={() => handleNavigation(item)}
              className={`flex items-center space-x-2 transition-all duration-200 hover-scale ${
                activePage === item.id 
                  ? 'bg-green-600 text-white' 
                  : 'text-slate-300 hover:text-white hover:bg-slate-700'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Button>
          ))}
          
          {/* Enhanced Features Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-700">
                <Flame className="w-4 h-4 mr-2" />
                Enhanced Features
                <Badge className="ml-2 bg-purple-600 text-white text-xs animate-pulse">ENHANCED</Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-slate-800 border-slate-700 w-64" align="end">
              <DropdownMenuLabel className="text-slate-300">🚀 Enhanced Nigerian Features</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-slate-700" />
              {enhancedFeatures.map((feature) => (
                <DropdownMenuItem
                  key={feature.id}
                  onClick={() => handleNavigation(feature)}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  <feature.icon className="w-4 h-4 mr-2" />
                  <span className="flex-1">{feature.label}</span>
                  {feature.badge && (
                    <Badge className={`ml-2 text-xs ${
                      feature.badge === 'NEW' ? 'bg-red-600 text-white' : 
                      feature.badge === 'ENHANCED' ? 'bg-purple-600 text-white' : 
                      'bg-blue-600 text-white'
                    }`}>
                      {feature.badge}
                    </Badge>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-3">
          {currentUser ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full hover-scale">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-green-600 text-white">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-slate-800 border-slate-700" align="end">
                <DropdownMenuLabel className="text-slate-300">
                  {currentUser.user_metadata?.full_name || currentUser.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-slate-700" />
                <DropdownMenuItem 
                  onClick={() => navigate('/settings')}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={onLogout}
                  className="text-slate-300 hover:bg-slate-700 hover:text-white cursor-pointer"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button onClick={onShowAuth} className="bg-green-600 hover:bg-green-700">
              Login
            </Button>
          )}

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden text-slate-300">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-slate-800 border-slate-700">
              <div className="py-4">
                <div className="space-y-2">
                  <h3 className="text-white font-medium mb-4">Navigation</h3>
                  {navigationItems.map((item) => (
                    <Button
                      key={item.id}
                      variant={activePage === item.id ? "default" : "ghost"}
                      className={`w-full justify-start ${
                        activePage === item.id 
                          ? 'bg-green-600 text-white' 
                          : 'text-slate-300'
                      }`}
                      onClick={() => handleNavigation(item)}
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {item.label}
                    </Button>
                  ))}
                  
                  <div className="pt-4 border-t border-slate-700">
                    <h4 className="text-white font-medium mb-2">🚀 Enhanced Features</h4>
                    {enhancedFeatures.map((feature) => (
                      <Button
                        key={feature.id}
                        variant="ghost"
                        className="w-full justify-start text-slate-300"
                        onClick={() => handleNavigation(feature)}
                      >
                        <feature.icon className="mr-2 h-4 w-4" />
                        <span className="flex-1">{feature.label}</span>
                        {feature.badge && (
                          <Badge className={`ml-auto text-xs ${
                            feature.badge === 'NEW' ? 'bg-red-600 text-white' : 
                            feature.badge === 'ENHANCED' ? 'bg-purple-600 text-white' : 
                            'bg-blue-600 text-white'
                          }`}>
                            {feature.badge}
                          </Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
