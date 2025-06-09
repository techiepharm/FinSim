
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import CashCardUpdated from './CashCardUpdated';
import SavingsBox from './SavingsBox';
import VirtualCardDashboard from './VirtualCardDashboard';

interface BalanceCardsSectionProps {
  accountBalance: number;
  userLevel: 'basic' | 'premium';
  onBalanceUpdate: (newBalance: number) => void;
  onShowSavingsManagement: () => void;
}

const BalanceCardsSection = ({ 
  accountBalance, 
  userLevel, 
  onBalanceUpdate, 
  onShowSavingsManagement 
}: BalanceCardsSectionProps) => {
  const handleFeatureClick = (featureName: string, description: string) => {
    toast(`ℹ️ ${featureName}`, {
      description: description,
      className: "bg-blue-600 border-blue-700 text-white",
      duration: 4000,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mt-16">
      <div className="space-y-4">
        <CashCardUpdated availableBalance={accountBalance} />
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-2">💰 Cash Management</p>
          <Button 
            size="sm" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              handleFeatureClick("Cash Management", "Manage your balance and view transaction history");
              toast("💰 Demo Cash", { description: "Your virtual ₦ balance is ready for trading and savings!" });
            }}
          >
            Click Here to Manage ₦ Cash
          </Button>
        </div>
      </div>
      
      <div className="lg:col-span-2 xl:col-span-1 space-y-4">
        <VirtualCardDashboard 
          userLevel={userLevel} 
          balance={accountBalance}
          lockedSavings={50000} // Demo locked savings
          onBalanceUpdate={onBalanceUpdate}
        />
      </div>
      
      <div className="space-y-4">
        <SavingsBox 
          availableBalance={accountBalance} 
          onBalanceUpdate={onBalanceUpdate}
        />
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-2">💸 Savings Feature</p>
          <Button 
            size="sm" 
            className="w-full bg-green-600 hover:bg-green-700"
            onClick={onShowSavingsManagement}
          >
            Click Here to Manage ₦ Savings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BalanceCardsSection;
