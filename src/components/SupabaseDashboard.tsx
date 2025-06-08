
import { useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useUserData } from '@/hooks/useUserData';
import UserGuidance from './UserGuidance';
import DashboardHeader from './DashboardHeader';
import BalanceCardsSection from './BalanceCardsSection';
import TradingSection from './TradingSection';
import SavingsGroupsSection from './SavingsGroupsSection';
import QuickActionsGrid from './QuickActionsGrid';
import PortfolioOverviewGrid from './PortfolioOverviewGrid';
import SavingsManagement from './SavingsManagement';

const SupabaseDashboard = () => {
  const { user } = useSupabaseAuth();
  const { profile, portfolio, creditScore, loading, updatePortfolio } = useUserData();
  const [userLevel] = useState<'basic' | 'premium'>('basic');
  const [showSavingsManagement, setShowSavingsManagement] = useState(false);

  // Use profile data or fallback to default
  const username = profile?.full_name || "User";
  const accountBalance = portfolio?.cash_balance || 415000;
  
  // Learning progress (demo data)
  const learningProgress = 35;
  const completedLessons = 4;
  const totalLessons = 12;
  
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    // Show welcome message for new users
    if (profile && !loading) {
      setTimeout(() => {
        toast("🎯 Nigerian Demo Account Active", {
          description: `Welcome ${profile.full_name}! You're using virtual Nigerian Naira - perfect for learning NSE trading without risk!`,
          className: "bg-blue-600 border-blue-700 text-white",
          duration: 6000,
        });
      }, 2000);
    }
  }, [profile, loading]);

  const handleBalanceUpdate = async (newBalance: number) => {
    try {
      await updatePortfolio({ cash_balance: newBalance });
      toast("💰 Balance Updated", {
        description: `Your Nigerian Naira balance is now ₦${newBalance.toLocaleString()}`,
        className: "bg-green-600 border-green-700 text-white",
      });
    } catch (error) {
      toast("❌ Update Failed", {
        description: "Failed to update balance. Please try again.",
        className: "bg-red-600 border-red-700 text-white",
      });
    }
  };

  const handleFeatureClick = (featureName: string, description: string) => {
    toast(`ℹ️ ${featureName}`, {
      description: description,
      className: "bg-blue-600 border-blue-700 text-white",
      duration: 4000,
    });
  };

  const generateFinancialReport = () => {
    const creditScoreText = creditScore ? creditScore.credit_score : 650;
    handleFeatureClick("Nigerian Financial Report", "Get insights into your Nigerian Naira spending patterns and NSE investment health");
    toast("📊 Nigerian Financial Report Generated", {
      description: `Your credit score: ${creditScoreText}/850. Your demo financial health report shows excellent progress in Nigerian market!`,
      className: "bg-green-600 border-green-700 text-white",
      duration: 4000,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-lg">Loading your Nigerian account...</div>
      </div>
    );
  }
  
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
          financialTip="Track your expenses and save 20% of your income in Nigerian Naira for long-term NSE investments."
          onFeatureClick={handleFeatureClick}
          onGenerateFinancialReport={generateFinancialReport}
        />

        {/* Display user info for demo */}
        {profile && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-4">
            <h3 className="text-white text-lg font-semibold mb-2">🇳🇬 Your Nigerian Account Info</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="text-slate-300">
                <strong>Name:</strong> {profile.full_name}
              </div>
              <div className="text-slate-300">
                <strong>Email:</strong> {profile.email}
              </div>
              <div className="text-slate-300">
                <strong>Cash Balance:</strong> ₦{accountBalance.toLocaleString()}
              </div>
              <div className="text-slate-300">
                <strong>Credit Score:</strong> {creditScore?.credit_score || 650}/850
              </div>
            </div>
          </div>
        )}
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

export default SupabaseDashboard;
