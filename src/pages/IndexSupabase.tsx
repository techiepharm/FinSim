
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
import SupabaseAuthModal from "@/components/SupabaseAuthModal";
import PremiumUpgrade from "@/components/PremiumUpgrade";
import TransactionNotifications from "@/components/TransactionNotifications";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
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
  const { user, loading, signOut, isAuthenticated } = useSupabaseAuth();
  const [activePage, setActivePage] = useState(initialPage);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false);
  const [userLevel, setUserLevel] = useState<'basic' | 'premium'>('basic');
  
  useEffect(() => {
    // If the URL is /trading, set the active page to 'trading'
    if (location.pathname === '/trading') {
      setActivePage('trading');
    }

    // Show auth modal if not authenticated and not loading
    if (!loading && !isAuthenticated) {
      setShowAuthModal(true);
    }
  }, [location.pathname, isAuthenticated, loading]);

  const handleAuthSuccess = (user: any) => {
    setShowAuthModal(false);
  };

  const handleLogout = async () => {
    await signOut();
    setUserLevel('basic');
    setShowAuthModal(true);
  };

  const handleUpgradeSuccess = () => {
    setUserLevel('premium');
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

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900">
        <div className="text-white text-lg">Loading your Nigerian account...</div>
      </div>
    );
  }

  // Show auth modal if not logged in
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-900 text-white">
        <SupabaseAuthModal 
          isOpen={showAuthModal}
          onClose={() => {}} // Prevent closing when not authenticated
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <TransactionNotifications />
      <Header 
        activePage={activePage} 
        setActivePage={setActivePage}
        currentUser={user}
        onShowAuth={() => setShowAuthModal(true)}
        onLogout={handleLogout}
      />
      
      <main className="flex-1">
        {pageComponents[activePage] || <SupabaseDashboard />}
        
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
              <FinancialBotWithLimits />
            </div>
          </DrawerContent>
        </Drawer>
      </main>

      <SupabaseAuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      <PremiumUpgrade
        isOpen={showPremiumUpgrade}
        onClose={() => setShowPremiumUpgrade(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
        currentBalance={1000}
      />
    </div>
  );
};

export default IndexSupabase;
