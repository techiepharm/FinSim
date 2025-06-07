
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";
import UserGuidance from './UserGuidance';
import DashboardHeader from './DashboardHeader';
import BalanceCardsSection from './BalanceCardsSection';
import TradingSection from './TradingSection';
import SavingsGroupsSection from './SavingsGroupsSection';
import QuickActionsGrid from './QuickActionsGrid';
import PortfolioOverviewGrid from './PortfolioOverviewGrid';
import SavingsManagement from './SavingsManagement';

const Dashboard = () => {
  // User info
  const username = "Ezra Folorunso";
  const [userLevel] = useState<'basic' | 'premium'>('basic'); // Demo: starts as basic
  
  // User account info - Nigerian Naira only
  const [accountBalance, setAccountBalance] = useState(415000); // ₦415,000
  const [recentTransactions, setRecentTransactions] = useState([]);
  
  // Learning progress
  const learningProgress = 35;
  const completedLessons = 4;
  const totalLessons = 12;
  
  const [showSavingsManagement, setShowSavingsManagement] = useState(false);

  // Load transactions and account balance from localStorage
  const updateDataFromStorage = () => {
    try {
      // Load portfolio for balance (already in NGN)
      const storedPortfolio = localStorage.getItem('portfolio');
      if (storedPortfolio) {
        const portfolio = JSON.parse(storedPortfolio);
        setAccountBalance(portfolio.cash || 0);
      }
      
      // Load transactions
      const storedTransactions = localStorage.getItem('transactions');
      if (storedTransactions) {
        const transactions = JSON.parse(storedTransactions);
        setRecentTransactions(transactions.slice(0, 5));
      }
    } catch (e) {
      console.error("Error reading data:", e);
    }
  };
  
  // Update data on mount and when localStorage changes
  useEffect(() => {
    updateDataFromStorage();
    
    // Listen for storage events (triggered by other components)
    window.addEventListener('storage', updateDataFromStorage);
    window.addEventListener('storageUpdate', updateDataFromStorage);
    
    return () => {
      window.removeEventListener('storage', updateDataFromStorage);
      window.removeEventListener('storageUpdate', updateDataFromStorage);
    };
  }, []);
  
  // Financial tips and recommendations
  const [financialTip, setFinancialTip] = useState('');
  
  useEffect(() => {
    const tips = [
      "Consider saving 20% of your income for long-term goals and emergencies.",
      "Track your expenses to identify areas where you can cut back.",
      "Try to limit debt repayments to less than 36% of your gross income.",
      "Invest regularly even in small amounts to benefit from compound interest in the Nigerian Stock Exchange.",
      "Consider allocating 50% to needs, 30% to wants, and 20% to savings and debt repayment in Nigerian Naira."
    ];
    
    // Show a tip on load
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    setFinancialTip(randomTip);
    
    // Show demo account reminder
    setTimeout(() => {
      toast("🎯 Nigerian Demo Account Active", {
        description: "You're using virtual Nigerian Naira - perfect for learning NSE trading without risk!",
        className: "bg-blue-600 border-blue-700 text-white",
        duration: 6000,
      });
    }, 8000);
  }, [userLevel]);

  const handleBalanceUpdate = (newBalance: number) => {
    setAccountBalance(newBalance);
    updateDataFromStorage();
    // Trigger custom event to update other components
    window.dispatchEvent(new Event('storageUpdate'));
  };

  const handleFeatureClick = (featureName: string, description: string) => {
    toast(`ℹ️ ${featureName}`, {
      description: description,
      className: "bg-blue-600 border-blue-700 text-white",
      duration: 4000,
    });
  };

  const generateFinancialReport = () => {
    handleFeatureClick("Nigerian Financial Report", "Get insights into your Nigerian Naira spending patterns and NSE investment health");
    toast("📊 Nigerian Financial Report Generated", {
      description: "Your demo financial health report shows excellent progress in Nigerian market! Keep up the great work.",
      className: "bg-green-600 border-green-700 text-white",
      duration: 4000,
    });
  };
  
  return (
    <div className="min-h-screen bg-slate-900 overflow-y-auto relative">
      <div className="container mx-auto p-4 space-y-6 max-h-screen overflow-y-auto pb-20">
        <UserGuidance />
        
        <DashboardHeader 
          username={username}
          accountBalance={accountBalance}
          onBalanceUpdate={handleBalanceUpdate}
        />
        
        <BalanceCardsSection
          accountBalance={accountBalance}
          userLevel={userLevel}
          onBalanceUpdate={handleBalanceUpdate}
          onShowSavingsManagement={() => setShowSavingsManagement(true)}
        />

        <TradingSection onFeatureClick={handleFeatureClick} />

        <SavingsGroupsSection 
          userLevel={userLevel} 
          onFeatureClick={handleFeatureClick} 
        />
        
        <QuickActionsGrid
          learningProgress={learningProgress}
          completedLessons={completedLessons}
          totalLessons={totalLessons}
          recentTransactions={recentTransactions}
          accountBalance={accountBalance}
          onFeatureClick={handleFeatureClick}
          onBalanceUpdate={handleBalanceUpdate}
        />
        
        <PortfolioOverviewGrid
          accountBalance={accountBalance}
          recentTransactions={recentTransactions}
          financialTip={financialTip}
          onFeatureClick={handleFeatureClick}
          onGenerateFinancialReport={generateFinancialReport}
        />
      </div>

      <SavingsManagement
        isOpen={showSavingsManagement}
        onClose={() => setShowSavingsManagement(false)}
        availableBalance={accountBalance}
        onBalanceUpdate={handleBalanceUpdate}
      />
    </div>
  );
};

export default Dashboard;
