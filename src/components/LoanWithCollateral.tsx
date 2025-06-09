
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, Calculator, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface LoanWithCollateralProps {
  availableBalance: number;
  lockedSavings: number;
  onLoanApproved: (loanDetails: any) => void;
}

const LoanWithCollateral = ({ availableBalance, lockedSavings, onLoanApproved }: LoanWithCollateralProps) => {
  const [loanAmount, setLoanAmount] = useState('');
  const [loanType, setLoanType] = useState('');
  const [termMonths, setTermMonths] = useState('12');
  const [collateralAmount, setCollateralAmount] = useState('');
  const [interestRate, setInterestRate] = useState(12);
  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [maxLoanAmount, setMaxLoanAmount] = useState(0);
  const [loanToValue, setLoanToValue] = useState(0);

  const loanTypes = [
    { value: 'personal', label: 'Personal Loan', rate: 15 },
    { value: 'business', label: 'Business Loan', rate: 12 },
    { value: 'emergency', label: 'Emergency Loan', rate: 18 },
    { value: 'education', label: 'Education Loan', rate: 10 }
  ];

  useEffect(() => {
    const totalCollateral = lockedSavings + Number(collateralAmount || 0);
    const maxLoan = totalCollateral * 0.8; // 80% LTV ratio
    setMaxLoanAmount(maxLoan);
    
    if (Number(loanAmount) > 0 && totalCollateral > 0) {
      setLoanToValue((Number(loanAmount) / totalCollateral) * 100);
    }
  }, [loanAmount, collateralAmount, lockedSavings]);

  useEffect(() => {
    if (loanAmount && termMonths) {
      const principal = Number(loanAmount);
      const monthlyRate = interestRate / 100 / 12;
      const numPayments = Number(termMonths);
      
      if (monthlyRate > 0) {
        const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / 
                       (Math.pow(1 + monthlyRate, numPayments) - 1);
        setMonthlyPayment(payment);
      } else {
        setMonthlyPayment(principal / numPayments);
      }
    }
  }, [loanAmount, termMonths, interestRate]);

  const handleLoanTypeChange = (type: string) => {
    setLoanType(type);
    const selectedType = loanTypes.find(t => t.value === type);
    if (selectedType) {
      setInterestRate(selectedType.rate);
    }
  };

  const handleApplyLoan = () => {
    const totalCollateral = lockedSavings + Number(collateralAmount || 0);
    const loanAmountNum = Number(loanAmount);
    
    if (!loanType) {
      toast("❌ Error", {
        description: "Please select a loan type",
        className: "bg-red-600 border-red-700 text-white",
      });
      return;
    }

    if (loanAmountNum <= 0) {
      toast("❌ Error", {
        description: "Please enter a valid loan amount",
        className: "bg-red-600 border-red-700 text-white",
      });
      return;
    }

    if (loanAmountNum > maxLoanAmount) {
      toast("❌ Insufficient Collateral", {
        description: `Maximum loan amount is ₦${maxLoanAmount.toLocaleString()} based on your collateral`,
        className: "bg-red-600 border-red-700 text-white",
      });
      return;
    }

    if (Number(collateralAmount) > availableBalance) {
      toast("❌ Insufficient Balance", {
        description: "You don't have enough balance to use as additional collateral",
        className: "bg-red-600 border-red-700 text-white",
      });
      return;
    }

    const loanDetails = {
      amount: loanAmountNum,
      type: loanType,
      termMonths: Number(termMonths),
      interestRate,
      monthlyPayment,
      collateralAmount: Number(collateralAmount || 0),
      totalCollateral,
      loanToValue
    };

    onLoanApproved(loanDetails);
    
    toast("✅ Loan Application Submitted", {
      description: `Your ₦${loanAmountNum.toLocaleString()} loan application is being processed`,
      className: "bg-green-600 border-green-700 text-white",
    });

    // Reset form
    setLoanAmount('');
    setLoanType('');
    setCollateralAmount('');
  };

  const getRiskLevel = () => {
    if (loanToValue <= 50) return { level: 'Low', color: 'bg-green-500', textColor: 'text-green-500' };
    if (loanToValue <= 70) return { level: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-500' };
    return { level: 'High', color: 'bg-red-500', textColor: 'text-red-500' };
  };

  const risk = getRiskLevel();

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <PiggyBank className="h-5 w-5 text-green-400" />
          Loan with Savings Collateral
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-blue-400" />
            <span className="text-blue-400 font-medium">Available Collateral</span>
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-300">Locked Savings:</span>
              <span className="text-white">₦{lockedSavings.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Available Balance:</span>
              <span className="text-white">₦{availableBalance.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="loanType" className="text-white">Loan Type</Label>
            <Select value={loanType} onValueChange={handleLoanTypeChange}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                <SelectValue placeholder="Select loan type" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {loanTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <div className="flex justify-between items-center w-full">
                      <span>{type.label}</span>
                      <Badge variant="secondary" className="ml-2">{type.rate}%</Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="termMonths" className="text-white">Loan Term</Label>
            <Select value={termMonths} onValueChange={setTermMonths}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                <SelectItem value="6">6 months</SelectItem>
                <SelectItem value="12">12 months</SelectItem>
                <SelectItem value="18">18 months</SelectItem>
                <SelectItem value="24">24 months</SelectItem>
                <SelectItem value="36">36 months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="loanAmount" className="text-white">Loan Amount (₦)</Label>
          <Input
            id="loanAmount"
            type="number"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white mt-1"
            placeholder="Enter loan amount"
            max={maxLoanAmount}
          />
          <div className="flex justify-between text-xs text-slate-400 mt-1">
            <span>Max loan: ₦{maxLoanAmount.toLocaleString()}</span>
            <span>Based on 80% of collateral</span>
          </div>
        </div>

        <div>
          <Label htmlFor="collateralAmount" className="text-white">Additional Collateral (₦)</Label>
          <Input
            id="collateralAmount"
            type="number"
            value={collateralAmount}
            onChange={(e) => setCollateralAmount(e.target.value)}
            className="bg-slate-700 border-slate-600 text-white mt-1"
            placeholder="Optional: Add from available balance"
            max={availableBalance}
          />
          <p className="text-xs text-slate-400 mt-1">
            Use part of your available balance as additional collateral
          </p>
        </div>

        {Number(loanAmount) > 0 && (
          <div className="space-y-4">
            <div className="bg-slate-700/50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Calculator className="h-4 w-4 text-green-400" />
                <span className="text-white font-medium">Loan Summary</span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-slate-400">Monthly Payment:</span>
                  <p className="text-white font-medium">₦{monthlyPayment.toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-slate-400">Interest Rate:</span>
                  <p className="text-white font-medium">{interestRate}% per annum</p>
                </div>
                <div>
                  <span className="text-slate-400">Total Collateral:</span>
                  <p className="text-white font-medium">₦{(lockedSavings + Number(collateralAmount || 0)).toLocaleString()}</p>
                </div>
                <div>
                  <span className="text-slate-400">Loan-to-Value:</span>
                  <p className={`font-medium ${risk.textColor}`}>{loanToValue.toFixed(1)}%</p>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-400">Risk Level</span>
                  <span className={risk.textColor}>{risk.level}</span>
                </div>
                <Progress value={loanToValue} className="h-2" />
              </div>
            </div>

            {loanToValue > 80 && (
              <div className="bg-red-900/30 border border-red-700/50 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  <span className="text-red-400 text-sm">
                    Loan amount exceeds collateral limit. Reduce loan amount or add more collateral.
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <Button 
          onClick={handleApplyLoan}
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={!loanAmount || !loanType || loanToValue > 80}
        >
          <Clock className="h-4 w-4 mr-2" />
          Apply for Loan
        </Button>

        <div className="text-xs text-slate-400 text-center">
          <p>• Loans are secured by your savings collateral</p>
          <p>• Approval is instant for qualified applications</p>
          <p>• Competitive interest rates based on loan type</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoanWithCollateral;
