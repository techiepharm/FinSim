
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Wallet, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const AddFunds = () => {
  const [amount, setAmount] = useState("100");
  const [paymentMethod, setPaymentMethod] = useState("credit-card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const { toast } = useToast();
  
  const handleAmountChange = (e) => {
    // Only allow numbers and validate
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAmount(value);
  };
  
  const formatCardNumber = (value) => {
    // Format card number with spaces every 4 digits
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0; i < match.length; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };
  
  const handleCardNumberChange = (e) => {
    const formatted = formatCardNumber(e.target.value);
    setCardNumber(formatted);
  };
  
  const formatExpiry = (value) => {
    // Format expiry as MM/YY
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };
  
  const handleExpiryChange = (e) => {
    const formatted = formatExpiry(e.target.value);
    setExpiry(formatted);
  };
  
  const handleCvvChange = (e) => {
    // Only allow numbers and limit to 3-4 digits
    const value = e.target.value.replace(/[^0-9]/g, '').substring(0, 4);
    setCvv(value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid amount greater than 0.",
        variant: "destructive"
      });
      return;
    }
    
    if (paymentMethod === "credit-card") {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 16) {
        toast({
          title: "Invalid Card Number",
          description: "Please enter a valid 16-digit card number.",
          variant: "destructive"
        });
        return;
      }
      
      if (!cardName) {
        toast({
          title: "Missing Name",
          description: "Please enter the cardholder's name.",
          variant: "destructive"
        });
        return;
      }
      
      if (!expiry || expiry.length < 5) {
        toast({
          title: "Invalid Expiry Date",
          description: "Please enter a valid expiry date (MM/YY).",
          variant: "destructive"
        });
        return;
      }
      
      if (!cvv || cvv.length < 3) {
        toast({
          title: "Invalid CVV",
          description: "Please enter a valid CVV code.",
          variant: "destructive"
        });
        return;
      }
    }
    
    // Process payment
    setIsProcessing(true);
    
    setTimeout(() => {
      // Update portfolio balance
      try {
        const portfolioData = localStorage.getItem('portfolio');
        const portfolio = portfolioData ? JSON.parse(portfolioData) : { cash: 1000, holdings: [] };
        
        const amountNum = parseFloat(amount);
        portfolio.cash += amountNum;
        
        localStorage.setItem('portfolio', JSON.stringify(portfolio));
        
        // Save transaction
        const transaction = {
          type: 'DEPOSIT',
          symbol: 'CASH',
          amount: amountNum,
          date: new Date().toISOString(),
          id: Date.now()
        };
        
        const transactionsData = localStorage.getItem('transactions');
        const transactions = transactionsData ? JSON.parse(transactionsData) : [];
        transactions.unshift(transaction);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        setIsProcessing(false);
        setIsComplete(true);
      } catch (e) {
        console.error("Error updating balance:", e);
        setIsProcessing(false);
        toast({
          title: "Error",
          description: "There was an error processing your payment. Please try again.",
          variant: "destructive"
        });
      }
    }, 2000);
  };
  
  if (isComplete) {
    return (
      <div className="max-w-md mx-auto p-6">
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader className="pb-4">
            <div className="mx-auto bg-green-900/30 p-3 rounded-full mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <CardTitle className="text-center text-white">Funds Added Successfully!</CardTitle>
            <CardDescription className="text-center text-slate-300">
              Your account has been credited with ${parseFloat(amount).toFixed(2)}
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="bg-slate-700 rounded-md p-4 mb-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Amount Added:</span>
                  <span className="text-white">${parseFloat(amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Method:</span>
                  <span className="text-white">
                    {paymentMethod === "credit-card" ? "Credit/Debit Card" : "PayPal"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Transaction ID:</span>
                  <span className="text-white">{Date.now().toString().substring(0, 10)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Date:</span>
                  <span className="text-white">{new Date().toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-slate-300 mb-4">
                Your funds are now available in your account for trading.
              </p>
              
              <div className="space-y-3">
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700"
                  onClick={() => window.location.href = '/trading'}
                >
                  Start Trading
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full border-slate-600 text-slate-300 hover:bg-slate-700"
                  onClick={() => window.location.href = '/'}
                >
                  Return to Dashboard
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="max-w-md mx-auto p-6">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="text-slate-400 hover:text-white p-0"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>
      
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white">Add Funds</CardTitle>
          <CardDescription className="text-slate-400">
            Add funds to your account for trading
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">Amount ($)</Label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-slate-400">$</span>
                  <Input
                    id="amount"
                    placeholder="0.00"
                    className="pl-8 bg-slate-700 border-slate-600 text-white"
                    value={amount}
                    onChange={handleAmountChange}
                  />
                </div>
                
                <div className="flex justify-between mt-2">
                  {[50, 100, 200, 500].map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      type="button"
                      variant="outline"
                      size="sm"
                      className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      onClick={() => setAmount(quickAmount.toString())}
                    >
                      ${quickAmount}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label className="text-white">Payment Method</Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="flex flex-col space-y-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="credit-card" id="credit-card" />
                    <Label htmlFor="credit-card" className="flex items-center cursor-pointer">
                      <CreditCard className="h-4 w-4 mr-2 text-slate-400" />
                      Credit / Debit Card
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center cursor-pointer">
                      <Wallet className="h-4 w-4 mr-2 text-slate-400" />
                      PayPal
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {paymentMethod === "credit-card" && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="card-number" className="text-white">Card Number</Label>
                    <Input
                      id="card-number"
                      placeholder="0000 0000 0000 0000"
                      className="bg-slate-700 border-slate-600 text-white"
                      value={cardNumber}
                      onChange={handleCardNumberChange}
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="card-name" className="text-white">Cardholder Name</Label>
                    <Input
                      id="card-name"
                      placeholder="John Doe"
                      className="bg-slate-700 border-slate-600 text-white"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry" className="text-white">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        className="bg-slate-700 border-slate-600 text-white"
                        value={expiry}
                        onChange={handleExpiryChange}
                        maxLength={5}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="cvv" className="text-white">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        className="bg-slate-700 border-slate-600 text-white"
                        value={cvv}
                        onChange={handleCvvChange}
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {paymentMethod === "paypal" && (
                <div className="bg-slate-700 rounded-md p-4 text-center">
                  <p className="text-slate-300 mb-3">
                    You'll be redirected to PayPal to complete your payment.
                  </p>
                  <img 
                    src="https://www.paypalobjects.com/digitalassets/c/website/marketing/apac/C2/logos-buttons/optimize/26_Blue_PayPal_Pill_Button.png" 
                    alt="PayPal" 
                    className="h-10 mx-auto"
                  />
                </div>
              )}
              
              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 mt-2"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : `Add $${amount || 0}`}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddFunds;
