
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { PiggyBank, Settings, TrendingUp, Calendar, DollarSign, Target } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface SavingsSettings {
  autoSaveEnabled: boolean;
  autoSaveAmount: number;
  autoSaveFrequency: 'weekly' | 'monthly';
  savingsGoal: number;
  currentSavings: number;
  interestRate: number;
}

interface SavingsManagementProps {
  isOpen: boolean;
  onClose: () => void;
  availableBalance: number;
  onBalanceUpdate: (newBalance: number) => void;
}

const SavingsManagement = ({ isOpen, onClose, availableBalance, onBalanceUpdate }: SavingsManagementProps) => {
  const [settings, setSettings] = useState<SavingsSettings>({
    autoSaveEnabled: false,
    autoSaveAmount: 50,
    autoSaveFrequency: 'weekly',
    savingsGoal: 5000,
    currentSavings: 0,
    interestRate: 2.5
  });
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [depositAmount, setDepositAmount] = useState('');

  useEffect(() => {
    // Load savings settings from localStorage
    const savedSettings = localStorage.getItem('savingsSettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const saveSettings = (newSettings: SavingsSettings) => {
    setSettings(newSettings);
    localStorage.setItem('savingsSettings', JSON.stringify(newSettings));
    
    toast("✅ Settings Saved", {
      description: "Your savings preferences have been updated successfully!",
      className: "bg-green-600 border-green-700 text-white",
      duration: 3000,
    });
  };

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (!amount || amount <= 0) {
      toast("❌ Invalid Amount", {
        description: "Please enter a valid deposit amount",
        className: "bg-red-600 border-red-700 text-white",
        duration: 3000,
      });
      return;
    }

    if (amount > availableBalance) {
      toast("💰 Insufficient Funds", {
        description: "You don't have enough balance for this deposit",
        className: "bg-red-600 border-red-700 text-white",
        duration: 3000,
      });
      return;
    }

    // Update balances
    const newAvailableBalance = availableBalance - amount;
    const newSavings = settings.currentSavings + amount;
    
    const newSettings = { ...settings, currentSavings: newSavings };
    saveSettings(newSettings);
    onBalanceUpdate(newAvailableBalance);

    // Create transaction record
    const transaction = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: 'SAVINGS_DEPOSIT',
      description: 'Savings deposit',
      amount: -amount
    };

    const existingTransactions = localStorage.getItem('transactions');
    const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
    transactions.unshift(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Update portfolio
    try {
      const portfolioData = localStorage.getItem('portfolio');
      const portfolio = portfolioData ? JSON.parse(portfolioData) : { cash: 1000, holdings: [] };
      portfolio.cash = newAvailableBalance;
      localStorage.setItem('portfolio', JSON.stringify(portfolio));
    } catch (e) {
      console.error('Portfolio update error:', e);
    }

    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('storageUpdate'));

    setDepositAmount('');
    
    toast("💰 Deposit Successful", {
      description: `$${amount.toFixed(2)} has been added to your savings. Keep building your financial future!`,
      className: "bg-green-600 border-green-700 text-white",
      duration: 4000,
    });

    // Financial advice
    setTimeout(() => {
      toast("💡 Smart Choice!", {
        description: "Regular savings deposits are key to building wealth. Consider setting up automatic deposits!",
        className: "bg-blue-600 border-blue-700 text-white",
        duration: 4000,
      });
    }, 2000);
  };

  const handleWithdrawal = () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      toast("❌ Invalid Amount", {
        description: "Please enter a valid withdrawal amount",
        className: "bg-red-600 border-red-700 text-white",
        duration: 3000,
      });
      return;
    }

    if (amount > settings.currentSavings) {
      toast("💰 Insufficient Savings", {
        description: "You don't have enough in savings for this withdrawal",
        className: "bg-red-600 border-red-700 text-white",
        duration: 3000,
      });
      return;
    }

    // Update balances
    const newAvailableBalance = availableBalance + amount;
    const newSavings = settings.currentSavings - amount;
    
    const newSettings = { ...settings, currentSavings: newSavings };
    saveSettings(newSettings);
    onBalanceUpdate(newAvailableBalance);

    // Create transaction record
    const transaction = {
      id: Date.now(),
      date: new Date().toISOString(),
      type: 'SAVINGS_WITHDRAWAL',
      description: 'Savings withdrawal',
      amount: amount
    };

    const existingTransactions = localStorage.getItem('transactions');
    const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
    transactions.unshift(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Update portfolio
    try {
      const portfolioData = localStorage.getItem('portfolio');
      const portfolio = portfolioData ? JSON.parse(portfolioData) : { cash: 1000, holdings: [] };
      portfolio.cash = newAvailableBalance;
      localStorage.setItem('portfolio', JSON.stringify(portfolio));
    } catch (e) {
      console.error('Portfolio update error:', e);
    }

    window.dispatchEvent(new Event('storage'));
    window.dispatchEvent(new Event('storageUpdate'));

    setWithdrawAmount('');
    
    toast("💸 Withdrawal Successful", {
      description: `$${amount.toFixed(2)} has been withdrawn from your savings.`,
      className: "bg-blue-600 border-blue-700 text-white",
      duration: 4000,
    });

    // Financial advice for withdrawal
    setTimeout(() => {
      toast("⚠️ Consider Your Goals", {
        description: "Try to avoid frequent withdrawals from savings. Consider if this expense is truly necessary.",
        className: "bg-yellow-600 border-yellow-700 text-white",
        duration: 4000,
      });
    }, 2000);
  };

  const progressPercentage = (settings.currentSavings / settings.savingsGoal) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <PiggyBank className="h-6 w-6 text-green-400" />
            Savings Management
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Manage your savings, set goals, and automate your financial growth
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Savings Overview */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-400" />
                Savings Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Current Savings</p>
                  <p className="text-2xl font-bold text-green-400">${settings.currentSavings.toFixed(2)}</p>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 text-sm">Available Balance</p>
                  <p className="text-2xl font-bold text-white">${availableBalance.toFixed(2)}</p>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Progress to Goal</span>
                  <span className="text-green-400">{progressPercentage.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-600 rounded-full h-3">
                  <div 
                    className="bg-green-400 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  />
                </div>
                <p className="text-slate-400 text-sm mt-1">
                  Goal: ${settings.savingsGoal.toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white text-lg">Deposit Funds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="bg-slate-600 border-slate-500 text-white"
                />
                <Button 
                  onClick={handleDeposit} 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={!depositAmount}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Deposit to Savings
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white text-lg">Withdraw Funds</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  className="bg-slate-600 border-slate-500 text-white"
                />
                <Button 
                  onClick={handleWithdrawal} 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!withdrawAmount}
                >
                  <DollarSign className="h-4 w-4 mr-2" />
                  Withdraw from Savings
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Automatic Savings Settings */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Automatic Savings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium">Enable Auto-Save</p>
                  <p className="text-slate-400 text-sm">Automatically transfer funds to savings</p>
                </div>
                <Switch
                  checked={settings.autoSaveEnabled}
                  onCheckedChange={(checked) => {
                    const newSettings = { ...settings, autoSaveEnabled: checked };
                    saveSettings(newSettings);
                  }}
                />
              </div>

              {settings.autoSaveEnabled && (
                <div className="space-y-4 border-t border-slate-600 pt-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Auto-Save Amount</label>
                    <Input
                      type="number"
                      value={settings.autoSaveAmount}
                      onChange={(e) => {
                        const newSettings = { ...settings, autoSaveAmount: parseFloat(e.target.value) || 0 };
                        saveSettings(newSettings);
                      }}
                      className="bg-slate-600 border-slate-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Frequency</label>
                    <div className="flex gap-2">
                      <Button
                        variant={settings.autoSaveFrequency === 'weekly' ? 'default' : 'outline'}
                        onClick={() => {
                          const newSettings = { ...settings, autoSaveFrequency: 'weekly' as const };
                          saveSettings(newSettings);
                        }}
                        className="flex-1"
                      >
                        Weekly
                      </Button>
                      <Button
                        variant={settings.autoSaveFrequency === 'monthly' ? 'default' : 'outline'}
                        onClick={() => {
                          const newSettings = { ...settings, autoSaveFrequency: 'monthly' as const };
                          saveSettings(newSettings);
                        }}
                        className="flex-1"
                      >
                        Monthly
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Savings Goal */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="h-5 w-5 text-purple-400" />
                Savings Goal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Target Amount</label>
                <Input
                  type="number"
                  value={settings.savingsGoal}
                  onChange={(e) => {
                    const newSettings = { ...settings, savingsGoal: parseFloat(e.target.value) || 0 };
                    saveSettings(newSettings);
                  }}
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
              
              <div className="bg-slate-800 p-3 rounded">
                <p className="text-slate-400 text-sm">
                  💡 <strong>Tip:</strong> Based on your current progress, you'll reach your goal in approximately{' '}
                  {settings.autoSaveEnabled && settings.autoSaveAmount > 0
                    ? Math.ceil((settings.savingsGoal - settings.currentSavings) / settings.autoSaveAmount)
                    : '∞'}{' '}
                  {settings.autoSaveFrequency === 'weekly' ? 'weeks' : 'months'} with automatic savings enabled.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button onClick={onClose} className="bg-slate-600 hover:bg-slate-500">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SavingsManagement;
