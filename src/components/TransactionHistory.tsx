import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Download, 
  TrendingUp, 
  TrendingDown, 
  PiggyBank,
  CreditCard,
  ArrowUpCircle,
  ArrowDownCircle
} from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface Transaction {
  id: string;
  date: string;
  type: string;
  symbol?: string;
  description: string;
  amount: number;
  balance?: number;
}

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Demo transactions if no real ones exist
  const demoTransactions: Transaction[] = [
    {
      id: 'demo-1',
      date: new Date().toISOString(),
      type: 'DEPOSIT',
      description: 'Initial Demo Balance',
      amount: 415000,
      balance: 415000
    },
    {
      id: 'demo-2',
      date: new Date(Date.now() - 86400000).toISOString(),
      type: 'BUY',
      symbol: 'GTCO',
      description: 'Demo Stock Purchase - Guaranty Trust',
      amount: -25000,
      balance: 390000
    },
    {
      id: 'demo-3',
      date: new Date(Date.now() - 172800000).toISOString(),
      type: 'SAVINGS_DEPOSIT',
      description: 'Demo Savings Deposit',
      amount: -50000,
      balance: 340000
    },
    {
      id: 'demo-4',
      date: new Date(Date.now() - 259200000).toISOString(),
      type: 'SELL',
      symbol: 'DANGCEM',
      description: 'Demo Stock Sale - Dangote Cement',
      amount: 75000,
      balance: 415000
    },
    {
      id: 'demo-5',
      date: new Date(Date.now() - 345600000).toISOString(),
      type: 'WITHDRAWAL',
      description: 'ATM Withdrawal',
      amount: -15000,
      balance: 400000
    }
  ];

  useEffect(() => {
    // Load transactions from localStorage
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      try {
        const parsed = JSON.parse(storedTransactions);
        if (parsed.length > 0) {
          setTransactions(parsed);
        } else {
          setTransactions(demoTransactions);
        }
      } catch (e) {
        console.error("Error parsing transactions:", e);
        setTransactions(demoTransactions);
      }
    } else {
      setTransactions(demoTransactions);
    }
  }, []);

  useEffect(() => {
    let filtered = transactions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(transaction =>
        transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.symbol?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== 'all') {
      filtered = filtered.filter(transaction => transaction.type === filterType);
    }

    // Sort by date
    filtered.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    setFilteredTransactions(filtered);
  }, [transactions, searchTerm, filterType, sortOrder]);

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'BUY':
        return <ArrowDownCircle className="h-4 w-4 text-red-400" />;
      case 'SELL':
        return <ArrowUpCircle className="h-4 w-4 text-green-400" />;
      case 'DEPOSIT':
      case 'ADD_FUNDS':
        return <TrendingUp className="h-4 w-4 text-green-400" />;
      case 'WITHDRAWAL':
        return <TrendingDown className="h-4 w-4 text-red-400" />;
      case 'SAVINGS_DEPOSIT':
      case 'SAVINGS_WITHDRAWAL':
        return <PiggyBank className="h-4 w-4 text-blue-400" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTransactionColor = (amount: number) => {
    return amount >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const formatAmount = (amount: number) => {
    return `${amount >= 0 ? '+' : ''}₦${Math.abs(amount).toLocaleString()}`;
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case 'BUY': return 'Stock Purchase';
      case 'SELL': return 'Stock Sale';
      case 'DEPOSIT': return 'Deposit';
      case 'WITHDRAWAL': return 'Withdrawal';
      case 'ADD_FUNDS': return 'Add Funds';
      case 'SAVINGS_DEPOSIT': return 'Savings Deposit';
      case 'SAVINGS_WITHDRAWAL': return 'Savings Withdrawal';
      default: return type.replace('_', ' ');
    }
  };

  const handleExport = () => {
    toast("📊 Export Feature", {
      description: "Transaction export coming soon! This is a demo account.",
      className: "bg-blue-600 border-blue-700 text-white",
      duration: 3000,
    });
  };

  const calculateTotal = (type: 'income' | 'expense') => {
    return filteredTransactions
      .filter(t => type === 'income' ? t.amount > 0 : t.amount < 0)
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="container mx-auto max-w-6xl">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Transaction History</h1>
            <p className="text-slate-400">📊 Demo Account - View all your financial activities</p>
          </div>
          <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Income</p>
                  <p className="text-2xl font-bold text-green-400">
                    ₦{calculateTotal('income').toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-400">
                    ₦{calculateTotal('expense').toLocaleString()}
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Net Flow</p>
                  <p className={`text-2xl font-bold ${
                    calculateTotal('income') - calculateTotal('expense') >= 0 
                      ? 'text-green-400' 
                      : 'text-red-400'
                  }`}>
                    ₦{(calculateTotal('income') - calculateTotal('expense')).toLocaleString()}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-slate-800 border-slate-700 mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-700 border-slate-600 text-white"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="BUY">Stock Purchases</SelectItem>
                  <SelectItem value="SELL">Stock Sales</SelectItem>
                  <SelectItem value="DEPOSIT">Deposits</SelectItem>
                  <SelectItem value="WITHDRAWAL">Withdrawals</SelectItem>
                  <SelectItem value="SAVINGS_DEPOSIT">Savings</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                <SelectTrigger className="bg-slate-700 border-slate-600 text-white">
                  <SelectValue placeholder="Sort order" />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600">
                  <SelectItem value="desc">Newest First</SelectItem>
                  <SelectItem value="asc">Oldest First</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                  setSortOrder('desc');
                }}
                className="border-slate-600"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">
              Transactions ({filteredTransactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg border border-slate-600 hover:bg-slate-700 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      {getTransactionIcon(transaction.type)}
                      <div>
                        <h4 className="font-medium text-white">
                          {transaction.symbol ? `${transaction.symbol} - ` : ''}
                          {getTransactionTypeLabel(transaction.type)}
                        </h4>
                        <p className="text-sm text-slate-400">{transaction.description}</p>
                        <p className="text-xs text-slate-500">
                          {new Date(transaction.date).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-medium ${getTransactionColor(transaction.amount)}`}>
                        {formatAmount(transaction.amount)}
                      </p>
                      {transaction.balance !== undefined && (
                        <p className="text-xs text-slate-400">
                          Balance: ₦{transaction.balance.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  <CreditCard className="h-16 w-16 mx-auto mb-4 text-slate-600" />
                  <p className="mb-2">No transactions found</p>
                  <p className="text-sm">Try adjusting your search filters</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionHistory;
