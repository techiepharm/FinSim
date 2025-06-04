
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import LearningCenter from "@/components/LearningCenter";
import EnhancedStockSimulator from "@/components/EnhancedStockSimulator";
import Portfolio from "@/components/Portfolio";
import FinancialBot from "@/components/FinancialBot";
import Goals from "@/components/Goals";
import CalendarView from "@/components/CalendarView";
import TransactionHistory from "@/components/TransactionHistory";
import AuthModal from "@/components/AuthModal";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const Index = ({ activePage: initialPage = 'dashboard' }) => {
  const location = useLocation();
  const [activePage, setActivePage] = useState(initialPage);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    if (storedUser && isLoggedIn === 'true') {
      setCurrentUser(JSON.parse(storedUser));
      setShowAuthModal(false);
    } else {
      setShowAuthModal(true);
    }
    
    // If the URL is /trading, set the active page to 'trading'
    if (location.pathname === '/trading') {
      setActivePage('trading');
    }
    
    setIsLoading(false);
  }, [location.pathname]);

  const handleAuthSuccess = (user: any) => {
    setCurrentUser(user);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    setCurrentUser(null);
    setShowAuthModal(true);
  };
  
  // Map of page IDs to components
  const pageComponents = {
    'dashboard': <Dashboard />,
    'learning': <LearningCenter />,
    'trading': <EnhancedStockSimulator />,
    'portfolio': <Portfolio />,
    'goals': <Goals />,
    'calendar': <CalendarView />,
    'transactions': <TransactionHistory />
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Show auth modal if not logged in
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-white">
        <AuthModal 
          isOpen={showAuthModal}
          onClose={() => {}} // Prevent closing when not authenticated
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <Header 
        activePage={activePage} 
        setActivePage={setActivePage}
        currentUser={currentUser}
        onShowAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />
      
      <main className="flex-1">
        {pageComponents[activePage] || <Dashboard />}
        
        {/* Financial Bot Button */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button 
              className="fixed bottom-4 left-4 rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-lg flex items-center justify-center z-50"
            >
              <Bot size={28} />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-slate-800 text-white border-slate-700">
            <DrawerHeader>
              <DrawerTitle className="text-center text-white">Your Financial Assistant</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-8 h-[80vh] overflow-y-auto">
              <FinancialBot />
            </div>
          </DrawerContent>
        </Drawer>
      </main>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default Index;
