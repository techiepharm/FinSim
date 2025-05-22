import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/sonner";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Wallet, CreditCard, DollarSign } from "lucide-react";

const INVESTMENT_TIPS = [
  "Consider investing your withdrawn funds in a diversified ETF portfolio for long-term growth.",
  "Before spending, consider allocating at least 10% of your withdrawn amount to an emergency fund.",
  "If you're withdrawing profits, consider reinvesting a portion back into different market sectors.",
  "Index funds can be a wise choice for reinvesting your trading profits for long-term growth.",
  "Consider using a portion of your withdrawn funds to learn more about investing through courses or books.",
  "Diversifying across asset classes can help manage risk when reinvesting your withdrawn funds.",
  "Dollar-cost averaging your withdrawn funds back into investments can reduce timing risk.",
];

const FINANCIAL_QUOTES = [
  "The stock market is filled with individuals who know the price of everything, but the value of nothing.",
  "In investing, what is comfortable is rarely profitable.",
  "The individual investor should act consistently as an investor and not as a speculator.",
  "The four most dangerous words in investing are: 'This time it's different.'",
  "The best investment you can make is in yourself.",
  "Risk comes from not knowing what you're doing.",
  "The most important quality for an investor is temperament, not intellect.",
  "I will tell you how to become rich. Close the doors. Be fearful when others are greedy. Be greedy when others are fearful.",
];

const WithdrawFunds = () => {
  const [amount, setAmount] = useState(100);
  const [email, setEmail] = useState("");
  const [withdrawalMethod, setWithdrawalMethod] = useState("paypal");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [investmentTip, setInvestmentTip] = useState(INVESTMENT_TIPS[0]);
  const [financialQuote, setFinancialQuote] = useState(FINANCIAL_QUOTES[0]);
  
  // Bank transfer form
  const [accountNumber, setAccountNumber] = useState("");
  const [routingNumber, setRoutingNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  
  // Credit card form
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  
  // PayPal form
  const [paypalId, setPaypalId] = useState("");
  const [paypalAuthToken, setPaypalAuthToken] = useState("");
  const [isPaypalLinked, setIsPaypalLinked] = useState(false);
  
  const availableBalance = 12589.75;
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (isNaN(value)) {
      setAmount(0);
    } else {
      setAmount(value);
    }
  };
  
  const handleLinkPaypal = () => {
    if (!email || !paypalId) {
      toast.error("Please enter your PayPal email and ID");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaypalLinked(true);
      setPaypalAuthToken("PAT-" + Math.random().toString(36).substring(2, 10).toUpperCase());
      toast.success("PayPal account linked successfully", {
        description: "You can now withdraw directly to your PayPal account"
      });
    }, 1500);
  };
  
  const handleWithdraw = () => {
    if (amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }
    
    if (amount > availableBalance) {
      toast.error("Insufficient funds", {
        description: `Maximum available for withdrawal is $${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}`
      });
      return;
    }
    
    if (withdrawalMethod === "paypal" && !isPaypalLinked) {
      toast.error("Please link your PayPal account first");
      return;
    }
    
    if (withdrawalMethod === "bank" && (!accountNumber || !routingNumber || !accountName)) {
      toast.error("Please fill in all bank account details");
      return;
    }
    
    if (withdrawalMethod === "card" && (!cardNumber || !expiryDate || !cvv || !cardholderName)) {
      toast.error("Please fill in all card details");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setInvestmentTip(INVESTMENT_TIPS[Math.floor(Math.random() * INVESTMENT_TIPS.length)]);
      setFinancialQuote(FINANCIAL_QUOTES[Math.floor(Math.random() * FINANCIAL_QUOTES.length)]);
      setShowSuccessDialog(true);
    }, 1500);
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-finance-primary mb-2 finance-accent-gradient">Withdraw Funds</h2>
        <p className="text-muted-foreground">Transfer your profits to your bank account, PayPal, or credit card</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1 lg:col-span-2 layered-card card-with-bg">
          <CardHeader>
            <CardTitle>Withdrawal Options</CardTitle>
            <CardDescription>Choose your preferred withdrawal method</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="paypal" value={withdrawalMethod} onValueChange={setWithdrawalMethod}>
              <TabsList className="grid grid-cols-3 mb-8">
                <TabsTrigger value="paypal" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  <span>PayPal</span>
                </TabsTrigger>
                <TabsTrigger value="bank" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  <span>Bank Transfer</span>
                </TabsTrigger>
                <TabsTrigger value="card" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  <span>Credit Card</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="paypal" className="animate-fade-in">
                <div className="space-y-4">
                  {!isPaypalLinked ? (
                    <>
                      <div className="grid gap-2">
                        <Label htmlFor="paypal-email">PayPal Email</Label>
                        <Input 
                          id="paypal-email" 
                          type="email" 
                          placeholder="your-email@example.com" 
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="transition-all focus:ring-2 focus:ring-finance-accent"
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="paypal-id">PayPal ID</Label>
                        <Input 
                          id="paypal-id" 
                          type="text" 
                          placeholder="Your PayPal ID" 
                          value={paypalId}
                          onChange={(e) => setPaypalId(e.target.value)}
                          className="transition-all focus:ring-2 focus:ring-finance-accent"
                        />
                      </div>
                      
                      <Button 
                        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors"
                        onClick={handleLinkPaypal}
                        disabled={isProcessing || !email || !paypalId}
                      >
                        {isProcessing ? "Linking..." : "Link PayPal Account"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="bg-green-50 p-4 rounded-md border border-green-100 mb-4">
                        <h4 className="font-medium text-green-800 mb-1 flex items-center">
                          <DollarSign className="h-4 w-4 mr-2" />
                          PayPal Account Linked
                        </h4>
                        <p className="text-sm text-green-600">Your PayPal account {email} is linked and ready to use.</p>
                        <p className="text-xs mt-2 text-green-500">Token: {paypalAuthToken}</p>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="paypal-amount">Amount to Withdraw ($)</Label>
                        <Input 
                          id="paypal-amount" 
                          type="number"
                          min="1"
                          step="0.01"
                          value={amount}
                          onChange={handleAmountChange}
                          className="transition-all focus:ring-2 focus:ring-finance-accent"
                        />
                        <p className="text-xs text-muted-foreground">Available: ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                      </div>
                    </>
                  )}
                  
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-1">PayPal Withdrawal Details</h4>
                    <p className="text-sm text-blue-600">Funds typically arrive in your PayPal account within 1-2 business days. No fees for withdrawals over $100.</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="bank" className="animate-fade-in">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="account-name">Account Holder Name</Label>
                    <Input 
                      id="account-name" 
                      type="text" 
                      placeholder="John Doe" 
                      value={accountName}
                      onChange={(e) => setAccountName(e.target.value)}
                      className="transition-all focus:ring-2 focus:ring-finance-accent"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="account-number">Account Number</Label>
                    <Input 
                      id="account-number" 
                      type="text" 
                      placeholder="XXXXXXXXXXXX" 
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="transition-all focus:ring-2 focus:ring-finance-accent"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="routing-number">Routing Number</Label>
                    <Input 
                      id="routing-number" 
                      type="text" 
                      placeholder="XXXXXXXXX" 
                      value={routingNumber}
                      onChange={(e) => setRoutingNumber(e.target.value)}
                      className="transition-all focus:ring-2 focus:ring-finance-accent"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="bank-amount">Amount to Withdraw ($)</Label>
                    <Input 
                      id="bank-amount" 
                      type="number"
                      min="1"
                      step="0.01"
                      value={amount}
                      onChange={handleAmountChange}
                      className="transition-all focus:ring-2 focus:ring-finance-accent"
                    />
                    <p className="text-xs text-muted-foreground">Available: ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-1">Bank Transfer Details</h4>
                    <p className="text-sm text-blue-600">Funds typically arrive in your bank account within 2-3 business days. A $1.50 fee applies to all bank transfers.</p>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="card" className="animate-fade-in">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="cardholder-name">Cardholder Name</Label>
                    <Input 
                      id="cardholder-name" 
                      type="text" 
                      placeholder="John Doe" 
                      value={cardholderName}
                      onChange={(e) => setCardholderName(e.target.value)}
                      className="transition-all focus:ring-2 focus:ring-finance-accent"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="card-number">Card Number</Label>
                    <Input 
                      id="card-number" 
                      type="text" 
                      placeholder="XXXX XXXX XXXX XXXX" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="transition-all focus:ring-2 focus:ring-finance-accent"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="expiry-date">Expiry Date</Label>
                      <Input 
                        id="expiry-date" 
                        type="text" 
                        placeholder="MM/YY" 
                        value={expiryDate}
                        onChange={(e) => setExpiryDate(e.target.value)}
                        className="transition-all focus:ring-2 focus:ring-finance-accent"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input 
                        id="cvv" 
                        type="text" 
                        placeholder="123" 
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value)}
                        className="transition-all focus:ring-2 focus:ring-finance-accent"
                      />
                    </div>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="card-amount">Amount to Withdraw ($)</Label>
                    <Input 
                      id="card-amount" 
                      type="number"
                      min="1"
                      step="0.01"
                      value={amount}
                      onChange={handleAmountChange}
                      className="transition-all focus:ring-2 focus:ring-finance-accent"
                    />
                    <p className="text-xs text-muted-foreground">Available: ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                    <h4 className="font-medium text-blue-800 mb-1">Credit Card Withdrawal Details</h4>
                    <p className="text-sm text-blue-600">Funds typically arrive on your card within 1-2 business days. A 2.5% fee applies to all credit card withdrawals.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          
          <CardFooter>
            <Button 
              className="w-full bg-finance-accent hover:bg-green-700 transition-colors"
              onClick={handleWithdraw}
              disabled={isProcessing || 
                (withdrawalMethod === "paypal" && (!isPaypalLinked || amount <= 0)) ||
                (withdrawalMethod === "bank" && (!accountNumber || !routingNumber || !accountName || amount <= 0)) ||
                (withdrawalMethod === "card" && (!cardNumber || !expiryDate || !cvv || !cardholderName || amount <= 0))}
            >
              {isProcessing ? "Processing..." : `Withdraw $${amount.toFixed(2)}`}
            </Button>
          </CardFooter>
        </Card>
        
        <Card className="col-span-1 glass-card gradient-bg-finance">
          <CardHeader>
            <CardTitle>Withdrawal History</CardTitle>
            <CardDescription>Your recent transactions</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="rounded-lg border bg-white/80 p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">PayPal</p>
                  <p className="text-xs text-muted-foreground">May 15, 2025</p>
                </div>
                <span className="text-red-600">-$250.00</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Status: Completed</div>
            </div>
            
            <div className="rounded-lg border bg-white/80 p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">PayPal</p>
                  <p className="text-xs text-muted-foreground">May 2, 2025</p>
                </div>
                <span className="text-red-600">-$500.00</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Status: Completed</div>
            </div>
            
            <div className="rounded-lg border bg-white/80 p-3">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">PayPal</p>
                  <p className="text-xs text-muted-foreground">Apr 20, 2025</p>
                </div>
                <span className="text-red-600">-$170.00</span>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">Status: Completed</div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full border-primary/20 bg-white/80 hover:bg-white"
              onClick={() => toast.info("View All History", { description: "Opening complete withdrawal history" })}
            >
              View All History
            </Button>
          </CardContent>
        </Card>
      </div>
      
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent className="glass-card gradient-bg-secondary">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl">Withdrawal Request Successful</AlertDialogTitle>
            <AlertDialogDescription className="text-md">
              Your withdrawal request for ${amount.toFixed(2)} to {withdrawalMethod === "paypal" ? "your PayPal account" : withdrawalMethod === "bank" ? `bank account ending in ${accountNumber.slice(-4)}` : `card ending in ${cardNumber.slice(-4)}`} has been submitted successfully.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-4 p-4 bg-indigo-50 border border-indigo-100 rounded-md">
            <h4 className="font-medium text-indigo-800 mb-2">Financial Quote</h4>
            <p className="text-indigo-700 italic">{financialQuote}</p>
          </div>
          
          <div className="my-4 p-4 bg-amber-50 border border-amber-100 rounded-md">
            <h4 className="font-medium text-amber-800 mb-2">Financial Wisdom</h4>
            <p className="text-amber-700">{investmentTip}</p>
          </div>
          
          <AlertDialogFooter className="flex gap-2">
            <AlertDialogAction 
              onClick={() => toast.success("Transaction Completed", { description: "Your withdrawal is being processed" })}
              className="bg-finance-accent hover:bg-green-700"
            >
              Got it, thanks!
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default WithdrawFunds;
