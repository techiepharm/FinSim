
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Lock, Shield, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface TransactionPinProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  transactionType: 'buy' | 'sell';
  stockSymbol: string;
  amount: number;
  shares: number;
  price: number;
}

const TransactionPin = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  transactionType, 
  stockSymbol, 
  amount, 
  shares, 
  price 
}: TransactionPinProps) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [step, setStep] = useState<'check' | 'create' | 'verify'>('check');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (isOpen) {
      const savedPin = localStorage.getItem('transactionPin');
      if (!savedPin) {
        setIsFirstTime(true);
        setStep('create');
      } else {
        setStep('verify');
      }
      setPin('');
      setConfirmPin('');
      setAttempts(0);
    }
  }, [isOpen]);

  const handleCreatePin = () => {
    if (pin.length !== 6) {
      toast("Invalid PIN", {
        description: "PIN must be 6 digits long",
        className: "bg-red-600 border-red-700 text-white",
      });
      return;
    }

    if (pin !== confirmPin) {
      toast("PIN Mismatch", {
        description: "PINs do not match. Please try again.",
        className: "bg-red-600 border-red-700 text-white",
      });
      setConfirmPin('');
      return;
    }

    // Save PIN (in a real app, this would be hashed)
    localStorage.setItem('transactionPin', pin);
    toast("PIN Created", {
      description: "Your transaction PIN has been created successfully!",
      className: "bg-green-600 border-green-700 text-white",
    });
    onSuccess();
  };

  const handleVerifyPin = () => {
    const savedPin = localStorage.getItem('transactionPin');
    
    if (pin === savedPin) {
      toast("Transaction Authorized", {
        description: "PIN verified successfully!",
        className: "bg-green-600 border-green-700 text-white",
      });
      onSuccess();
    } else {
      setAttempts(prev => prev + 1);
      setPin('');
      
      if (attempts >= 2) {
        toast("Too Many Attempts", {
          description: "Transaction blocked. Please try again later.",
          className: "bg-red-600 border-red-700 text-white",
        });
        onClose();
      } else {
        toast("Incorrect PIN", {
          description: `Invalid PIN. ${2 - attempts} attempts remaining.`,
          className: "bg-red-600 border-red-700 text-white",
        });
      }
    }
  };

  const getFinancialAdvice = () => {
    const advice = {
      buy: [
        "💡 Consider diversifying your portfolio across different sectors",
        "📊 Review the company's fundamentals before investing",
        "⏰ Dollar-cost averaging can reduce market timing risk",
        "🎯 Set clear profit targets and stop-loss levels"
      ],
      sell: [
        "💰 Consider tax implications of your sale",
        "📈 Review if this aligns with your investment strategy",
        "🔄 Think about rebalancing your portfolio after this sale",
        "💡 Consider partial selling instead of full position exit"
      ]
    };
    
    return advice[transactionType][Math.floor(Math.random() * advice[transactionType].length)];
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-blue-400" />
            {step === 'create' ? 'Create Transaction PIN' : 'Verify Transaction'}
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            {step === 'create' 
              ? 'Set up a 6-digit PIN to secure your transactions'
              : 'Enter your PIN to authorize this transaction'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Transaction Details */}
          <Card className="bg-slate-700 border-slate-600">
            <CardContent className="pt-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Action:</span>
                  <span className={`font-medium ${transactionType === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                    {transactionType.toUpperCase()} {stockSymbol}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Shares:</span>
                  <span className="text-white">{shares}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Price per share:</span>
                  <span className="text-white">${price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between border-t border-slate-600 pt-2">
                  <span className="text-slate-400">Total amount:</span>
                  <span className="text-white font-medium">${amount.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Advice */}
          <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-blue-200 text-sm">{getFinancialAdvice()}</p>
            </div>
          </div>

          {/* PIN Input */}
          {step === 'create' ? (
            <div className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Create PIN (6 digits)</label>
                <InputOTP maxLength={6} value={pin} onChange={setPin}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-2 block">Confirm PIN</label>
                <InputOTP maxLength={6} value={confirmPin} onChange={setConfirmPin}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          ) : (
            <div>
              <label className="text-sm text-slate-400 mb-2 block flex items-center gap-2">
                <Lock className="h-4 w-4" />
                Enter Transaction PIN
              </label>
              <InputOTP maxLength={6} value={pin} onChange={setPin}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
              {attempts > 0 && (
                <p className="text-red-400 text-xs mt-1">
                  {3 - attempts} attempts remaining
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={step === 'create' ? handleCreatePin : handleVerifyPin}
            disabled={pin.length !== 6 || (step === 'create' && confirmPin.length !== 6)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            {step === 'create' ? 'Create PIN' : 'Authorize Transaction'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionPin;
