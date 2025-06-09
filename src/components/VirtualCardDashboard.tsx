
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CreditCard, 
  Eye, 
  EyeOff, 
  Copy, 
  Smartphone, 
  Shield, 
  Crown,
  TrendingUp,
  PiggyBank,
  Target,
  BarChart3,
  History,
  Settings,
  Plus,
  Minus
} from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import SmartIncomeSplit from './SmartIncomeSplit';
import LoanWithCollateral from './LoanWithCollateral';

interface VirtualCardDashboardProps {
  userLevel: 'basic' | 'premium';
  balance: number;
  lockedSavings?: number;
  onBalanceUpdate: (newBalance: number) => void;
}

const VirtualCardDashboard = ({ userLevel, balance, lockedSavings = 0, onBalanceUpdate }: VirtualCardDashboardProps) => {
  const [showDetails, setShowDetails] = useState(false);
  const [activeTab, setActiveTab] = useState('card');
  const [cardData] = useState({
    number: "4532 1234 5678 9012",
    expiry: "12/28",
    cvv: "123",
    holder: "EZRA FOLORUNSO"
  });

  // Mock data for charts
  const spendingData = [
    { name: 'Mon', amount: 1200 },
    { name: 'Tue', amount: 1900 },
    { name: 'Wed', amount: 800 },
    { name: 'Thu', amount: 2400 },
    { name: 'Fri', amount: 1600 },
    { name: 'Sat', amount: 2800 },
    { name: 'Sun', amount: 1400 }
  ];

  const categoryData = [
    { name: 'Food & Dining', value: 35, color: '#10B981' },
    { name: 'Transportation', value: 25, color: '#3B82F6' },
    { name: 'Entertainment', value: 20, color: '#8B5CF6' },
    { name: 'Shopping', value: 15, color: '#F59E0B' },
    { name: 'Others', value: 5, color: '#6B7280' }
  ];

  const recentTransactions = [
    { id: 1, description: 'Online Purchase', amount: -2500, date: '2024-01-15', category: 'Shopping' },
    { id: 2, description: 'Salary Credit', amount: 150000, date: '2024-01-14', category: 'Income' },
    { id: 3, description: 'Restaurant Payment', amount: -3200, date: '2024-01-13', category: 'Food' },
    { id: 4, description: 'Transport', amount: -1500, date: '2024-01-12', category: 'Transport' },
    { id: 5, description: 'Savings Transfer', amount: -25000, date: '2024-01-11', category: 'Savings' }
  ];

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

  const handleQuickTransaction = (type: string, amount: number) => {
    const newBalance = type === 'add' ? balance + amount : balance - amount;
    if (newBalance < 0) {
      toast("❌ Insufficient Funds", {
        description: "You don't have enough balance for this transaction",
        className: "bg-red-600 border-red-700 text-white",
      });
      return;
    }
    
    onBalanceUpdate(newBalance);
    const action = type === 'add' ? 'Added' : 'Deducted';
    toast(`💰 ${action} ₦${amount.toLocaleString()}`, {
      description: `Your new balance is ₦${newBalance.toLocaleString()}`,
      className: "bg-green-600 border-green-700 text-white",
    });
  };

  return (
    <Card className="bg-gradient-to-br from-slate-800 via-slate-800 to-slate-900 border-slate-700 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-900/50 to-purple-900/50">
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Financial Dashboard
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 bg-slate-700">
            <TabsTrigger value="card" className="text-xs">Card</TabsTrigger>
            <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
            <TabsTrigger value="split" className="text-xs">Income Split</TabsTrigger>
            <TabsTrigger value="loans" className="text-xs">Loans</TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="card" className="space-y-4">
            {/* Virtual Card */}
            <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl p-6 text-white relative overflow-hidden">
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
                  <p className="text-2xl font-bold text-white">₦{balance.toLocaleString()}</p>
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
          </TabsContent>

          <TabsContent value="overview" className="space-y-4">
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                onClick={() => handleQuickTransaction('add', 10000)}
                className="bg-green-600 hover:bg-green-700 h-16"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add ₦10,000
              </Button>
              <Button
                onClick={() => handleQuickTransaction('subtract', 5000)}
                variant="outline"
                className="border-red-600 text-red-400 hover:bg-red-800/20 h-16"
              >
                <Minus className="h-5 w-5 mr-2" />
                Spend ₦5,000
              </Button>
            </div>

            {/* Financial Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-slate-700 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Total Balance</p>
                      <p className="text-xl font-bold text-white">₦{balance.toLocaleString()}</p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Locked Savings</p>
                      <p className="text-xl font-bold text-white">₦{lockedSavings.toLocaleString()}</p>
                    </div>
                    <PiggyBank className="h-8 w-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-700 border-slate-600">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Monthly Goal</p>
                      <p className="text-xl font-bold text-white">₦50,000</p>
                    </div>
                    <Target className="h-8 w-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <History className="h-5 w-5" />
                  Recent Transactions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex justify-between items-center p-3 bg-slate-600 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{transaction.description}</p>
                        <p className="text-slate-400 text-sm">{transaction.date} • {transaction.category}</p>
                      </div>
                      <div className={`font-medium ${transaction.amount > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {transaction.amount > 0 ? '+' : ''}₦{Math.abs(transaction.amount).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="split">
            <SmartIncomeSplit 
              monthlyIncome={balance} 
              onSplitSaved={(split) => {
                toast("✅ Income Split Saved", {
                  description: "Your income allocation preferences have been saved",
                  className: "bg-green-600 border-green-700 text-white",
                });
              }}
            />
          </TabsContent>

          <TabsContent value="loans">
            <LoanWithCollateral
              availableBalance={balance}
              lockedSavings={lockedSavings}
              onLoanApproved={(loanDetails) => {
                // Update balance with loan amount
                onBalanceUpdate(balance + loanDetails.amount);
                toast("🎉 Loan Approved!", {
                  description: `₦${loanDetails.amount.toLocaleString()} has been disbursed to your account`,
                  className: "bg-green-600 border-green-700 text-white",
                });
              }}
            />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            {/* Spending Chart */}
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Weekly Spending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={spendingData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="name" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#374151', 
                          border: '1px solid #6B7280',
                          borderRadius: '8px'
                        }}
                      />
                      <Line type="monotone" dataKey="amount" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Category Breakdown */}
            <Card className="bg-slate-700 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white">Spending by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {categoryData.map((category, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: category.color }}
                      ></div>
                      <span className="text-slate-300 text-sm">{category.name}: {category.value}%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {userLevel === 'basic' && (
          <div className="mt-6 p-3 bg-purple-900/30 border border-purple-600/50 rounded-lg text-center">
            <Crown className="h-5 w-5 text-purple-400 mx-auto mb-2" />
            <p className="text-purple-300 text-sm mb-2">
              Unlock advanced analytics and loan features with Premium
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

export default VirtualCardDashboard;
