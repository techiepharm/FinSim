
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Home, 
  BookOpen, 
  TrendingUp, 
  PieChart, 
  Bot,
  User
} from "lucide-react";

interface HeaderProps {
  activePage: string;
  setActivePage: (page: string) => void;
}

const Header = ({ activePage, setActivePage }: HeaderProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} /> },
    { id: 'learning', label: 'Learning Center', icon: <BookOpen size={20} /> },
    { id: 'trading', label: 'Trading', icon: <TrendingUp size={20} /> },
    { id: 'portfolio', label: 'Portfolio', icon: <PieChart size={20} /> },
    { id: 'assistant', label: 'Financial Assistant', icon: <Bot size={20} /> },
  ];
  
  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-2">
          <TrendingUp className="text-finance-primary h-6 w-6" />
          <h1 className="text-xl font-bold text-finance-primary">FinSavvy</h1>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant={activePage === item.id ? "default" : "ghost"}
              className={`flex items-center gap-2 ${
                activePage === item.id ? "bg-finance-primary text-white" : "text-gray-600 hover:text-finance-primary"
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
        
        {/* User button */}
        <Button variant="outline" className="rounded-full p-2 hidden md:flex">
          <User size={20} />
        </Button>
      </div>
      
      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div className="md:hidden mt-4 bg-white border-t border-gray-200">
          {navItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full flex items-center gap-2 justify-start px-6 py-3 ${
                activePage === item.id ? "bg-finance-light text-finance-primary font-medium" : "text-gray-600"
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
        </div>
      )}
    </header>
  );
};

export default Header;
