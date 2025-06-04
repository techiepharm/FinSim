
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Crown, CreditCard, CheckCircle, Star, Zap } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface PremiumUpgradeProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeSuccess: () => void;
  currentBalance: number;
}

const PremiumUpgrade = ({ isOpen, onClose, onUpgradeSuccess, currentBalance }: PremiumUpgradeProps) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');
  const [processing, setProcessing] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const plans = {
    monthly: {
      price: 29.99,
      description: 'Billed monthly',
      features: [
        'Unlimited chat with Financial Assistant',
        'Create unlimited savings groups',
        'Advanced portfolio analytics',
        'Premium stock analysis tools',
        'Priority customer support',
        'Advanced financial tracking'
      ]
    },
    yearly: {
      price: 299.99,
      description: 'Billed yearly (Save 17%)',
      features: [
        'All monthly features',
        '2 months free',
        'Exclusive investment insights',
        'Personal finance coach',
        'Tax optimization tools',
        'Early access to new features'
      ]
    }
  };

  const handleUpgrade = async () => {
    if (currentBalance < plans[selectedPlan].price) {
      toast("💰 Insufficient Funds", {
        description: "Please add more funds to your account to upgrade to Premium",
        className: "bg-red-600 border-red-700 text-white",
        duration: 4000,
      });
      return;
    }

    if (!cardNumber || !expiryDate || !cvv) {
      toast("❌ Missing Payment Details", {
        description: "Please fill in all payment information",
        className: "bg-red-600 border-red-700 text-white",
        duration: 3000,
      });
      return;
    }

    setProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      // Deduct amount from balance
      try {
        const portfolioData = localStorage.getItem('portfolio');
        const portfolio = portfolioData ? JSON.parse(portfolioData) : { cash: 1000, holdings: [] };
        
        portfolio.cash -= plans[selectedPlan].price;
        localStorage.setItem('portfolio', JSON.stringify(portfolio));

        // Create transaction record
        const transaction = {
          id: Date.now(),
          date: new Date().toISOString(),
          type: 'PREMIUM_UPGRADE',
          description: `Premium ${selectedPlan} subscription`,
          amount: -plans[selectedPlan].price
        };

        const existingTransactions = localStorage.getItem('transactions');
        const transactions = existingTransactions ? JSON.parse(existingTransactions) : [];
        transactions.unshift(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));

        // Set premium status
        localStorage.setItem('userLevel', 'premium');
        localStorage.setItem('premiumExpiry', new Date(Date.now() + (selectedPlan === 'yearly' ? 365 : 30) * 24 * 60 * 60 * 1000).toISOString());

        // Trigger storage events
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('storageUpdate'));

        setProcessing(false);
        onUpgradeSuccess();
        onClose();

        toast("🎉 Welcome to Premium!", {
          description: `You've successfully upgraded to Premium ${selectedPlan}! Enjoy all the exclusive features.`,
          className: "bg-purple-600 border-purple-700 text-white",
          duration: 6000,
        });

        // Show financial advice notification
        setTimeout(() => {
          toast("💡 Smart Investment", {
            description: "Upgrading to Premium is an investment in your financial education and future success!",
            className: "bg-green-600 border-green-700 text-white",
            duration: 5000,
          });
        }, 2000);

      } catch (error) {
        console.error('Upgrade error:', error);
        setProcessing(false);
        toast("❌ Upgrade Failed", {
          description: "Something went wrong. Please try again.",
          className: "bg-red-600 border-red-700 text-white",
          duration: 3000,
        });
      }
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 text-white border-slate-700 max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white flex items-center gap-2">
            <Crown className="h-6 w-6 text-yellow-400" />
            Upgrade to Premium
          </DialogTitle>
          <DialogDescription className="text-slate-300">
            Unlock advanced features and take your financial journey to the next level
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(plans).map(([key, plan]) => (
              <Card 
                key={key}
                className={`cursor-pointer transition-all ${
                  selectedPlan === key 
                    ? 'bg-purple-900/50 border-purple-500' 
                    : 'bg-slate-700 border-slate-600 hover:border-purple-400'
                }`}
                onClick={() => setSelectedPlan(key as 'monthly' | 'yearly')}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white capitalize">{key}</CardTitle>
                      <p className="text-slate-400 text-sm">{plan.description}</p>
                    </div>
                    {key === 'yearly' && (
                      <Badge className="bg-green-600 text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Best Value
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-4">
                    ${plan.price}
                    <span className="text-lg text-slate-400 font-normal">
                      /{key === 'yearly' ? 'year' : 'month'}
                    </span>
                  </div>
                  <ul className="space-y-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-slate-300">
                        <CheckCircle className="h-4 w-4 text-green-400 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Form */}
          <Card className="bg-slate-700 border-slate-600">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Information (Demo)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">Card Number</label>
                <Input
                  placeholder="1234 5678 9012 3456"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  className="bg-slate-600 border-slate-500 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Expiry Date</label>
                  <Input
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="bg-slate-600 border-slate-500 text-white"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">CVV</label>
                  <Input
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="bg-slate-600 border-slate-500 text-white"
                  />
                </div>
              </div>
              
              <div className="bg-slate-800 p-3 rounded border border-slate-600">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Current Balance:</span>
                  <span className="text-white font-medium">${currentBalance.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Amount to be charged:</span>
                  <span className="text-purple-400 font-medium">${plans[selectedPlan].price}</span>
                </div>
                <div className="border-t border-slate-600 mt-2 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Remaining Balance:</span>
                    <span className="text-white font-bold">
                      ${(currentBalance - plans[selectedPlan].price).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={processing}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpgrade} 
            disabled={processing || currentBalance < plans[selectedPlan].price}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {processing ? (
              <>
                <Zap className="h-4 w-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Crown className="h-4 w-4 mr-2" />
                Upgrade Now - ${plans[selectedPlan].price}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PremiumUpgrade;
