
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import ATMAnimation from './ATMAnimation';

interface DashboardHeaderProps {
  username: string;
  accountBalance: number;
  onBalanceUpdate: (newBalance: number) => void;
}

const DashboardHeader = ({ username, accountBalance, onBalanceUpdate }: DashboardHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start mb-6 relative">
      <div className="flex-1">
        <h2 className="text-3xl font-bold mb-2 text-white">Welcome, {username}</h2>
        <p className="text-slate-400">🇳🇬 Nigerian Demo Account - Your financial journey at a glance</p>
      </div>
      
      {/* Small ATM positioned at top right */}
      <div className="absolute top-0 right-0 z-30">
        <div className="w-48 h-40 scale-75 origin-top-right">
          <ATMAnimation 
            balance={accountBalance} 
            onBalanceUpdate={onBalanceUpdate}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
