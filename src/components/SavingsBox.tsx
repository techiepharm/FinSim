
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PiggyBank, Lock, Unlock, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface SavingsBoxProps {
  availableBalance: number;
  onBalanceUpdate: (newBalance: number) => void;
}

const SavingsBox = ({ availableBalance, onBalanceUpdate }: SavingsBoxProps) => {
  const [savings, setSavings] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [amount, setAmount] = useState('');
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  // Load savings data on mount
  useEffect(() => {
    try {
      const savingsData = localStorage.getItem('savingsBox');
      if (savingsData) {
        const data = JSON.parse(savingsData);
        setSavings(data.amount || 0);
        setIsLocked(data.locked || false);
      }
    } catch (e) {
      console.error("Error loading savings:", e);
    }
  }, []);

  const saveSavingsData = (amount: number, locked: boolean) => {
    try {
      const savingsData = { amount, locked };
      localStorage.setItem('savingsBox', JSON.stringify(savingsData));
      
      // Update portfolio cash
      const portfolioData = localStorage.getItem('portfolio');
      const portfolio = portfolioData ? JSON.parse(portfolioData) : { cash: 1000, holdings: [] };
      onBalanceUpdate(portfolio.cash);
      
      // Trigger storage events
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new Event('storageUpdate'));
    } catch (e) {
      console.error("Error saving savings data:", e);
    }
  };

  const handleDeposit = () => {
    const depositAmount = parseFloat(amount);
    
    if (!depositAmount || depositAmount <= 0) {
      toast("❌ Invalid Amount", {
        description: "Please enter a valid amount to deposit",
        className: "bg-red-600 border-red-700 text-white",
        duration: 3000,
      });
      return;
    }

    if (depositAmount > availableBalance) {
      toast("❌ Insufficient Funds", {
        description: `You only have $${availableBalance.toFixed(2)} available`,
        className: "bg-red-600 border-red-700 text-white",
        duration: 3000,
      });
      return;
    }

    // Update portfolio cash
    try {
      const portfolioData = localStorage.getItem('portfolio');
      const portfolio = portfolioData ? JSON.parse(portfolioData) : { cash: 1000, holdings: [] };
      portfolio.cash -= depositAmount;
      localStorage.setItem('portfolio', JSON.stringify(portfolio));

      // Save transaction
      const transaction = {
        id: Date.now(),
        date: new Date().toISOString(),
        type: 'SAVINGS_DEPOSIT',
        amount: -depositAmount,
        description: 'Deposit to Savings Box'
      };

      const existingTransactions = localStorage.getItem('transactions');
      const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
      transactions.unshift(transaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));

      // Update savings
      const newSavings = savings + depositAmount;
      setSavings(newSavings);
      saveSavingsData(newSavings, isLocked);

      setAmount('');
      setShowDeposit(false);

      toast("✅ Deposit Successful", {
        description: `$${depositAmount.toFixed(2)} moved to your savings box`,
        className: "bg-green-600 border-green-700 text-white",
        duration: 3000,
      });
    } catch (e) {
      console.error("Deposit error:", e);
      toast("❌ Deposit Failed", {
        description: "Something went wrong. Please try again.",
        className: "bg-red-600 border-red-700 text-white",
        duration: 3000,
      });
    }
  };

  const handleWithdraw = () => {
    if (isLocked) {
      toast("🔒 Savings Locked", {
        description: "Unlock your savings box first to withdraw funds",
        className: "bg-yellow-600 border-yellow-700 text-white",
        duration: 3000,
      });
      return;
    }

    const withdrawAmount = parseFloat(amount);
    
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast("❌ Invalid Amount", {
        description: "Please enter a valid amount to withdraw",
        className: "bg-red-600 border-red-700 text-white",
        duration: 3000,
      });
      return;
    }

    if (withdrawAmount > savings) {
      toast("❌ Insufficient Savings", {
        description: `You only have $${savings.toFixed(2)} in savings`,
        className: "bg-red-600 border-red-700 text-white",
        duration: 3000,
      });
      return;
    }

    // Update portfolio cash
    try {
      const portfolioData = localStorage.getItem('portfolio');
      const portfolio = portfolioData ? JSON.parse(portfolioData) : { cash: 1000, holdings: [] };
      portfolio.cash += withdrawAmount;
      localStorage.setItem('portfolio', JSON.stringify(portfolio));

      // Save transaction
      const transaction = {
        id: Date.now(),
        date: new Date().toISOString(),
        type: 'SAVINGS_WITHDRAWAL',
        amount: withdrawAmount,
        description: 'Withdrawal from Savings Box'
      };

      const existingTransactions = localStorage.getItem('transactions');
      const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
      transactions.unshift(transaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));

      // Update savings
      const newSavings = savings - withdrawAmount;
      setSavings(newSavings);
      saveSavingsData(newSavings, isLocked);

      setAmount('');
      setShowWithdraw(false);

      toast("✅ Withdrawal Successful", {
        description: `$${withdrawAmount.toFixed(2)} moved to your available balance`,
        className: "bg-green-600 border-green-700 text-white",
        duration: 3000,
      });
    } catch (e) {
      console.error("Withdrawal error:", e);
      toast("❌ Withdrawal Failed", {
        description: "Something went wrong. Please try again.",
        className: "bg-red-600 border-red-700 text-white",
        duration: 3000,
      });
    }
  };

  const toggleLock = () => {
    const newLockState = !isLocked;
    setIsLocked(newLockState);
    saveSavingsData(savings, newLockState);

    if (newLockState) {
      toast("🔒 Savings Locked", {
        description: "Your savings are now protected from withdrawals",
        className: "bg-blue-600 border-blue-700 text-white",
        duration: 3000,
      });
    } else {
      toast("🔓 Savings Unlocked", {
        description: "You can now withdraw from your savings",
        className: "bg-green-600 border-green-700 text-white",
        duration: 3000,
      });
    }
  };

  return (
    <>
      <Card className="bg-slate-800 border-slate-700 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-900/50 to-purple-800/50 pb-2">
          <CardTitle className="text-white flex justify-between items-center">
            <span className="flex items-center">
              <PiggyBank className="mr-2 h-5 w-5" />
              Savings Box
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleLock}
              className={`${isLocked ? 'text-yellow-400 hover:text-yellow-300' : 'text-green-400 hover:text-green-300'}`}
            >
              {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-3xl font-bold text-white mb-4">${savings.toFixed(2)}</div>
          
          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full border-blue-600 text-blue-400 hover:bg-blue-800/20"
              onClick={() => setShowDeposit(true)}
            >
              <ArrowDownToLine className="mr-2 h-4 w-4" />
              Deposit to Savings
            </Button>
            
            <Button 
              variant="outline" 
              className={`w-full ${isLocked 
                ? 'border-gray-600 text-gray-400 cursor-not-allowed opacity-50' 
                : 'border-green-600 text-green-400 hover:bg-green-800/20'
              }`}
              onClick={() => !isLocked && setShowWithdraw(true)}
              disabled={isLocked}
            >
              <ArrowUpFromLine className="mr-2 h-4 w-4" />
              {isLocked ? 'Locked - Cannot Withdraw' : 'Withdraw from Savings'}
            </Button>
          </div>

          {isLocked && (
            <div className="mt-4 p-2 bg-yellow-900/30 border border-yellow-700/50 rounded-md">
              <p className="text-yellow-400 text-xs text-center">
                🔒 Savings locked for protection
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Deposit Dialog */}
      <Dialog open={showDeposit} onOpenChange={setShowDeposit}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Deposit to Savings Box</DialogTitle>
            <DialogDescription className="text-slate-300">
              Move money from your available balance to savings
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Available Balance</label>
              <div className="text-lg font-medium text-white">${availableBalance.toFixed(2)}</div>
            </div>
            
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Amount to Deposit</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeposit(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeposit} className="bg-blue-600 hover:bg-blue-700">
              Deposit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Withdraw Dialog */}
      <Dialog open={showWithdraw} onOpenChange={setShowWithdraw}>
        <DialogContent className="bg-slate-800 text-white border-slate-700">
          <DialogHeader>
            <DialogTitle>Withdraw from Savings Box</DialogTitle>
            <DialogDescription className="text-slate-300">
              Move money from savings to your available balance
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Savings Balance</label>
              <div className="text-lg font-medium text-white">${savings.toFixed(2)}</div>
            </div>
            
            <div>
              <label className="text-sm text-slate-400 mb-1 block">Amount to Withdraw</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                min="0"
                step="0.01"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWithdraw(false)}>
              Cancel
            </Button>
            <Button onClick={handleWithdraw} className="bg-green-600 hover:bg-green-700">
              Withdraw
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SavingsBox;
