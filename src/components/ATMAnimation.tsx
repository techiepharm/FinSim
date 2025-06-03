
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CreditCard, Banknote, ArrowRightLeft, Smartphone } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ATMAnimationProps {
  balance: number;
  onBalanceUpdate: (newBalance: number) => void;
}

const ATMAnimation = ({ balance, onBalanceUpdate }: ATMAnimationProps) => {
  const [showATM, setShowATM] = useState(false);
  const [currentStep, setCurrentStep] = useState<'insert' | 'pin' | 'menu' | 'amount' | 'processing' | 'complete'>('insert');
  const [pin, setPin] = useState('');
  const [amount, setAmount] = useState('');
  const [transactionType, setTransactionType] = useState<'withdraw' | 'deposit'>('withdraw');
  const [isAnimating, setIsAnimating] = useState(false);

  const startATMSession = () => {
    setShowATM(true);
    setCurrentStep('insert');
    setPin('');
    setAmount('');
    setIsAnimating(false);
  };

  const handlePinEntry = (digit: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + digit);
    }
  };

  const clearPin = () => {
    setPin('');
  };

  const submitPin = () => {
    if (pin.length === 4) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep('menu');
        setIsAnimating(false);
      }, 1500);
    } else {
      toast("❌ Invalid PIN", {
        description: "Please enter a 4-digit PIN",
        className: "bg-red-600 border-red-700 text-white",
      });
    }
  };

  const selectTransaction = (type: 'withdraw' | 'deposit') => {
    setTransactionType(type);
    setCurrentStep('amount');
  };

  const processTransaction = () => {
    const transactionAmount = parseFloat(amount);
    
    if (!transactionAmount || transactionAmount <= 0) {
      toast("❌ Invalid Amount", {
        description: "Please enter a valid amount",
        className: "bg-red-600 border-red-700 text-white",
      });
      return;
    }

    if (transactionType === 'withdraw' && transactionAmount > balance) {
      toast("❌ Insufficient Funds", {
        description: `You only have $${balance.toFixed(2)} available`,
        className: "bg-red-600 border-red-700 text-white",
      });
      return;
    }

    setCurrentStep('processing');
    setIsAnimating(true);

    // Simulate processing time
    setTimeout(() => {
      const newBalance = transactionType === 'withdraw' 
        ? balance - transactionAmount 
        : balance + transactionAmount;
      
      onBalanceUpdate(newBalance);
      
      // Save transaction
      const transaction = {
        id: Date.now(),
        date: new Date().toISOString(),
        type: transactionType === 'withdraw' ? 'ATM_WITHDRAWAL' : 'ATM_DEPOSIT',
        total: transactionType === 'withdraw' ? -transactionAmount : transactionAmount,
        description: `ATM ${transactionType.toUpperCase()} - Demo Transaction`
      };

      const existingTransactions = localStorage.getItem('transactions');
      const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
      transactions.unshift(transaction);
      localStorage.setItem('transactions', JSON.stringify(transactions));

      setCurrentStep('complete');
      setIsAnimating(false);

      toast(`✅ ${transactionType === 'withdraw' ? 'Withdrawal' : 'Deposit'} Complete`, {
        description: `$${transactionAmount.toFixed(2)} ${transactionType}n successful`,
        className: "bg-green-600 border-green-700 text-white",
      });

      setTimeout(() => {
        setShowATM(false);
        setCurrentStep('insert');
      }, 3000);
    }, 2500);
  };

  const renderATMScreen = () => {
    switch (currentStep) {
      case 'insert':
        return (
          <div className="text-center space-y-4">
            <div className="text-6xl animate-pulse">💳</div>
            <h3 className="text-xl font-bold text-white">Welcome to FinSavvy ATM</h3>
            <p className="text-slate-300">Insert your card to begin</p>
            <Button 
              onClick={() => setCurrentStep('pin')}
              className="bg-green-600 hover:bg-green-700"
            >
              <CreditCard className="h-4 w-4 mr-2" />
              Insert Card
            </Button>
          </div>
        );

      case 'pin':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white text-center">Enter Your PIN</h3>
            <div className="text-center">
              <div className="text-2xl font-mono mb-4">
                {pin.split('').map((_, i) => '•').join(' ')} {' '.repeat((4 - pin.length) * 2)}
              </div>
              <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
                {[1,2,3,4,5,6,7,8,9,'',0,'C'].map((digit, i) => (
                  <Button
                    key={i}
                    variant="outline"
                    size="sm"
                    className="aspect-square"
                    onClick={() => {
                      if (digit === 'C') clearPin();
                      else if (digit !== '') handlePinEntry(digit.toString());
                    }}
                    disabled={digit === ''}
                  >
                    {digit}
                  </Button>
                ))}
              </div>
              <Button 
                onClick={submitPin}
                className="w-full mt-4 bg-green-600 hover:bg-green-700"
                disabled={pin.length !== 4}
              >
                {isAnimating ? 'Verifying...' : 'Enter'}
              </Button>
            </div>
          </div>
        );

      case 'menu':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white text-center">Select Transaction</h3>
            <div className="space-y-2">
              <Button 
                onClick={() => selectTransaction('withdraw')}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                <Banknote className="h-4 w-4 mr-2" />
                Withdraw Cash
              </Button>
              <Button 
                onClick={() => selectTransaction('deposit')}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                <ArrowRightLeft className="h-4 w-4 mr-2" />
                Deposit Funds
              </Button>
            </div>
            <div className="text-center text-sm text-slate-400">
              Current Balance: ${balance.toFixed(2)}
            </div>
          </div>
        );

      case 'amount':
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-white text-center">
              Enter {transactionType === 'withdraw' ? 'Withdrawal' : 'Deposit'} Amount
            </h3>
            <div className="space-y-4">
              <Input
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="text-center text-lg bg-slate-700 border-slate-600 text-white"
              />
              <div className="grid grid-cols-3 gap-2">
                {[20, 50, 100, 200, 500, 1000].map((preset) => (
                  <Button
                    key={preset}
                    variant="outline"
                    size="sm"
                    onClick={() => setAmount(preset.toString())}
                    disabled={transactionType === 'withdraw' && preset > balance}
                  >
                    ${preset}
                  </Button>
                ))}
              </div>
              <Button 
                onClick={processTransaction}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Continue
              </Button>
            </div>
          </div>
        );

      case 'processing':
        return (
          <div className="text-center space-y-4">
            <div className="text-4xl animate-spin">⚙️</div>
            <h3 className="text-lg font-bold text-white">Processing Transaction</h3>
            <p className="text-slate-300">Please wait...</p>
            <div className="w-full bg-slate-600 rounded-full h-2">
              <div className="bg-green-400 h-2 rounded-full animate-pulse" style={{ width: '70%' }} />
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="text-center space-y-4">
            <div className="text-4xl">✅</div>
            <h3 className="text-lg font-bold text-white">Transaction Complete</h3>
            <p className="text-slate-300">
              {transactionType === 'withdraw' ? 'Withdrawal' : 'Deposit'} of ${amount} successful
            </p>
            <p className="text-sm text-slate-400">
              New Balance: ${(transactionType === 'withdraw' ? balance - parseFloat(amount) : balance + parseFloat(amount)).toFixed(2)}
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-blue-400" />
            Virtual ATM
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-6xl mb-4">🏧</div>
            <p className="text-slate-300 mb-4">Experience our virtual ATM with realistic animations</p>
            <Button 
              onClick={startATMSession}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Smartphone className="h-4 w-4 mr-2" />
              Start ATM Session
            </Button>
          </div>
          
          <div className="bg-slate-700 rounded-lg p-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-400">Available:</span>
              <span className="text-white font-medium">${balance.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showATM} onOpenChange={setShowATM}>
        <DialogContent className="bg-slate-900 text-white border-slate-700 max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center flex items-center justify-center gap-2">
              🏧 FinSavvy ATM
            </DialogTitle>
            <DialogDescription className="text-center text-slate-400">
              Virtual ATM Experience
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-slate-800 rounded-lg p-6 min-h-64">
            {renderATMScreen()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ATMAnimation;
