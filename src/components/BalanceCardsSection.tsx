
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import CashCardUpdated from './CashCardUpdated';
import SavingsBox from './SavingsBox';
import VirtualCard from './VirtualCard';

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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
      <div className="space-y-4">
        <CashCardUpdated availableBalance={accountBalance} />
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-2">🇳🇬 Nigerian Naira Cash Management</p>
          <Button 
            size="sm" 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              handleFeatureClick("Nigerian Cash Management", "Manage your Nigerian Naira balance and view NSE transaction history");
              toast("💰 Demo Nigerian Naira", { description: "Your virtual ₦ balance is ready for NSE trading and savings!" });
            }}
          >
            Click Here to Manage ₦ Cash
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <VirtualCard userLevel={userLevel} balance={accountBalance} />
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-2">💳 Nigerian Virtual Card Feature</p>
          <Button 
            size="sm" 
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={() => {
              handleFeatureClick("Nigerian Virtual Card", "Use your virtual Nigerian debit card for demo transactions");
              toast("💳 Nigerian Virtual Card Ready", { description: "Your demo card is active and ready for ₦ transactions!" });
            }}
          >
            Click Here to Use Nigerian Virtual Card
          </Button>
        </div>
      </div>
      
      <div className="space-y-4">
        <SavingsBox 
          availableBalance={accountBalance} 
          onBalanceUpdate={onBalanceUpdate}
        />
        <div className="text-center">
          <p className="text-sm text-slate-400 mb-2">🇳🇬 Nigerian Naira Savings Feature</p>
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
