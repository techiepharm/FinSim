
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from "@/components/Header";
import SupabaseDashboard from "@/components/SupabaseDashboard";
import LearningCenter from "@/components/LearningCenter";
import EnhancedStockSimulator from "@/components/EnhancedStockSimulator";
import Portfolio from "@/components/Portfolio";
import FinancialBotWithLimits from "@/components/FinancialBotWithLimits";
import Goals from "@/components/Goals";
import CalendarView from "@/components/CalendarView";
import TransactionHistory from "@/components/TransactionHistory";
import TransactionNotifications from "@/components/TransactionNotifications";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const IndexSupabase = ({ activePage: initialPage = 'dashboard' }) => {
  const location = useLocation();
  const [activePage, setActivePage] = useState(initialPage);
  const [userLevel] = useState<'basic' | 'premium'>('basic');
  
  // Mock user for demo purposes
  const mockUser = {
    id: 'demo-user-123',
    email: 'demo@finsavvy.ng',
    name: 'Ezra Folorunso',
    user_metadata: {
      full_name: 'Ezra Folorunso'
    }
  };
  
  useEffect(() => {
    // If the URL is /trading, set the active page to 'trading'
    if (location.pathname === '/trading') {
      setActivePage('trading');
    }
  }, [location.pathname]);

  const handleLogout = () => {
    // Mock logout - just reload the page
    window.location.reload();
  };
  
  // Map of page IDs to components
  const pageComponents = {
    'dashboard': <SupabaseDashboard />,
    'learning': <LearningCenter />,
    'trading': <EnhancedStockSimulator />,
    'portfolio': <Portfolio />,
    'goals': <Goals />,
    'calendar': <CalendarView />,
    'transactions': <TransactionHistory />
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <TransactionNotifications />
      <Header 
        activePage={activePage} 
        setActivePage={setActivePage}
        currentUser={mockUser}
        onShowAuth={() => {}} // No auth modal needed
        onLogout={handleLogout}
      />
      
      <main className="flex-1 max-w-7xl mx-auto w-full">
        {pageComponents[activePage] || <SupabaseDashboard />}
        
        {/* Financial Bot Button */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button 
              className="fixed bottom-6 right-6 rounded-full w-16 h-16 bg-green-600 hover:bg-green-700 shadow-lg flex items-center justify-center z-50"
            >
              <Bot size={32} />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-slate-800 text-white border-slate-700">
            <DrawerHeader>
              <DrawerTitle className="text-center text-white">Your Financial Assistant</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-8 h-[80vh] overflow-y-auto">
              <FinancialBotWithLimits />
            </div>
          </DrawerContent>
        </Drawer>
      </main>
    </div>
  );
};

export default IndexSupabase;
