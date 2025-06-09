
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import UserProfile from "./UserProfile";
import { 
  Home, 
  BookOpen, 
  TrendingUp, 
  PieChart, 
  User,
  Goal,
  CalendarDays,
  Receipt
} from "lucide-react";

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
  currentUser: any;
  onShowAuth: () => void;
  onLogout: () => void;
}

const Header = ({ activePage, setActivePage, currentUser, onShowAuth, onLogout }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'learning', label: 'Learning Center', icon: <BookOpen size={20} /> },
    { id: 'trading', label: 'Trading', icon: <TrendingUp size={20} /> },
    { id: 'portfolio', label: 'Portfolio', icon: <PieChart size={20} /> },
    { id: 'goals', label: 'Goals', icon: <Goal size={20} /> },
    { id: 'calendar', label: 'Calendar', icon: <CalendarDays size={20} /> },
    { id: 'transactions', label: 'Transactions', icon: <Receipt size={20} /> },
  ];

  // Helper function to get user initials with proper null checking
  const getUserInitials = (user: any) => {
    if (!user) return 'U';
    if (user.name && typeof user.name === 'string') {
      return user.name.charAt(0).toUpperCase();
    }
    if (user.email && typeof user.email === 'string') {
      return user.email.charAt(0).toUpperCase();
    }
    return 'U';
  };

  // Helper function to get display name
  const getDisplayName = (user: any) => {
    if (!user) return 'User';
    return user.name || user.email || 'User';
  };
  
  return (
    <header className="bg-slate-800 border-b border-slate-700 py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-green-400 h-6 w-6" />
          <h1 className="text-xl font-bold text-green-400">FinSavvy</h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activePage === item.id ? "default" : "ghost"}
              className={`flex items-center gap-2 ${
                activePage === item.id ? "bg-green-600 text-white" : "text-gray-300 hover:text-green-400"
              }`}
              onClick={() => setActivePage(item.id)}
            >
              {item.icon}
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>
        
        {/* Mobile Navigation Button */}
        <Button 
          variant="ghost" 
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
          </svg>
        </Button>
        
        {/* User Profile or Login button */}
        {currentUser ? (
          <div className="hidden md:flex">
            <UserProfile user={currentUser} onLogout={onLogout} />
          </div>
        ) : (
          <Button 
            variant="outline" 
            className="rounded-full p-2 hidden md:flex"
            onClick={onShowAuth}
          >
            <User size={20} />
          </Button>
        )}
      </div>
      
      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-slate-700 border-t border-slate-600">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full flex items-center gap-2 justify-start px-6 py-3 ${
                activePage === item.id ? "bg-slate-600 text-green-400 font-medium" : "text-gray-300"
              }`}
              onClick={() => {
                setActivePage(item.id);
                setMenuOpen(false);
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </Button>
          ))}
          
          {/* Mobile User Profile */}
          {currentUser && (
            <div className="border-t border-slate-600 pt-2">
              <div className="px-6 py-3 flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {getUserInitials(currentUser)}
                </div>
                <span className="text-white">{getDisplayName(currentUser)}</span>
              </div>
              <Button
                variant="ghost"
                className="w-full flex items-center gap-2 justify-start px-6 py-3 text-red-400"
                onClick={onLogout}
              >
                <User size={20} />
                <span>Log out</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
