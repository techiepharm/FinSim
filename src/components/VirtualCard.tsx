
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Eye, EyeOff, Copy, Smartphone, Shield, Crown } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface VirtualCardProps {
  userLevel: 'basic' | 'premium';
  balance: number;
}

const VirtualCard = ({ userLevel, balance }: VirtualCardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [cardData] = useState({
    number: "4532 1234 5678 9012",
    expiry: "12/28",
    cvv: "123",
    holder: "EZRA FOLORUNSO"
  });

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast(`📋 ${label} Copied`, {
      description: "Card details copied to clipboard",
      className: "bg-blue-600 border-blue-700 text-white",
      duration: 2000,
    });
  };

  const handleCardAction = (action: string) => {
    if (userLevel === 'basic' && action !== 'view') {
      toast("🔒 Premium Feature", {
        description: "Card management features require Premium upgrade!",
        className: "bg-purple-600 border-purple-700 text-white",
        duration: 4000,
      });
      return;
    }

    toast(`💳 Card ${action}`, {
      description: `Demo: ${action} action would be processed in a real app`,
      className: "bg-green-600 border-green-700 text-white",
      duration: 3000,
    });
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-slate-700 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Virtual Debit Card
          </div>
          <div className="flex items-center gap-2">
            {userLevel === 'premium' && (
              <Crown className="h-4 w-4 text-yellow-400" />
            )}
            <Badge className={userLevel === 'premium' ? "bg-yellow-600/20 text-yellow-300" : "bg-blue-600/20 text-blue-300"}>
              {userLevel === 'premium' ? 'Premium' : 'Basic'}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-6">
        {/* Card Visual */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl p-6 mb-4 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
          
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-sm opacity-80">Virtual Card</p>
                <p className="text-lg font-bold">FinSavvy</p>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                <span className="text-sm">Secure</span>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-xl font-mono tracking-wider">
                {showDetails ? cardData.number : "•••• •••• •••• 9012"}
              </p>
            </div>
            
            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs opacity-80">CARD HOLDER</p>
                <p className="text-sm font-medium">{cardData.holder}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">EXPIRES</p>
                <p className="text-sm font-medium">{showDetails ? cardData.expiry : "••/••"}</p>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">CVV</p>
                <p className="text-sm font-medium">{showDetails ? cardData.cvv : "•••"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card Balance */}
        <div className="bg-slate-700 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-sm">Available Balance</p>
              <p className="text-2xl font-bold text-white">${balance.toFixed(2)}</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 text-sm">Card Status</p>
              <Badge className="bg-green-600/20 text-green-300">Active</Badge>
            </div>
          </div>
        </div>

        {/* Card Actions */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="flex-1 border-slate-600"
            >
              {showDetails ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
            
            {showDetails && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(cardData.number, 'Card Number')}
                className="border-slate-600"
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCardAction('freeze')}
              className={`${userLevel === 'basic' ? 'opacity-50' : ''} border-red-600 text-red-400 hover:bg-red-800/20`}
            >
              {userLevel === 'basic' && <Crown className="h-3 w-3 mr-1" />}
              Freeze Card
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCardAction('settings')}
              className={`${userLevel === 'basic' ? 'opacity-50' : ''} border-blue-600 text-blue-400 hover:bg-blue-800/20`}
            >
              {userLevel === 'basic' && <Crown className="h-3 w-3 mr-1" />}
              Settings
            </Button>
          </div>

          <Button
            onClick={() => handleCardAction('mobile payment')}
            className={`w-full ${userLevel === 'basic' ? 'opacity-50' : ''} bg-green-600 hover:bg-green-700`}
          >
            <Smartphone className="h-4 w-4 mr-2" />
            {userLevel === 'basic' && <Crown className="h-3 w-3 mr-1" />}
            Add to Mobile Wallet
          </Button>
        </div>

        {userLevel === 'basic' && (
          <div className="mt-4 p-3 bg-purple-900/30 border border-purple-600/50 rounded-lg text-center">
            <Crown className="h-5 w-5 text-purple-400 mx-auto mb-2" />
            <p className="text-purple-300 text-sm mb-2">
              Unlock full card management with Premium
            </p>
            <Button 
              size="sm" 
              className="bg-purple-600 hover:bg-purple-700"
              onClick={() => toast("Coming Soon!", { description: "Premium features coming soon!" })}
            >
              Upgrade Now
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VirtualCard;
