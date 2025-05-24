import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";

interface CashCardUpdatedProps {
  availableBalance: number;
}

const CashCardUpdated = ({ availableBalance }: CashCardUpdatedProps) => {
  const [balance, setBalance] = useState(availableBalance);
  
  // Keep balance updated
  useEffect(() => {
    setBalance(availableBalance);
    
    // Also listen for storage events to update in real-time
    const handleStorageChange = () => {
      try {
        const portfolioData = localStorage.getItem('portfolio');
        if (portfolioData) {
          const portfolio = JSON.parse(portfolioData);
          setBalance(portfolio.cash);
        }
      } catch (e) {
        console.error("Error updating balance:", e);
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('storageUpdate', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('storageUpdate', handleStorageChange);
    };
  }, [availableBalance]);
  
  const handleAddFunds = () => {
    window.location.href = '/add-funds';
  };
  
  const handleWithdraw = () => {
    window.location.href = '/withdraw';
  };
  
  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-900/50 to-emerald-800/50 pb-2">
        <CardTitle className="text-white flex justify-between items-center">
          <span>Available Cash</span>
          <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">DEMO</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-3xl font-bold text-white mb-4">${balance.toFixed(2)}</div>
        
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full border-green-600 text-green-400 hover:bg-green-800/20"
            onClick={handleWithdraw}
          >
            <Wallet className="mr-2 h-4 w-4" />
            Withdraw Funds
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-blue-600 text-blue-400 hover:bg-blue-800/20"
            onClick={handleAddFunds}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Demo Funds
          </Button>
        </div>
        
        <div className="mt-4 p-2 bg-blue-900/30 border border-blue-700/50 rounded-md">
          <p className="text-blue-400 text-xs text-center">
            💡 Virtual money for safe learning
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashCardUpdated;
