
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { CalendarDays, Filter, Download, ArrowUpDown } from "lucide-react";
import { toast } from "@/components/ui/sonner";

// Mock transaction data
const generateTransactions = (startDate: Date, endDate: Date) => {
  const transactions = [];
  const types = ['BUY', 'SELL', 'DIVIDEND', 'DEPOSIT', 'WITHDRAWAL'];
  const symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA'];
  
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    const randomType = types[Math.floor(Math.random() * types.length)];
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const amount = parseFloat((Math.random() * 1000).toFixed(2));
    
    transactions.push({
      id: transactions.length + 1,
      date: new Date(currentDate),
      type: randomType,
      symbol: randomType === 'DEPOSIT' || randomType === 'WITHDRAWAL' ? null : randomSymbol,
      amount: randomType === 'BUY' || randomType === 'WITHDRAWAL' ? -amount : amount,
      balance: 10000 + Math.random() * 3000,
    });
    
    // Add 1-2 days to the current date
    const daysToAdd = Math.floor(Math.random() * 2) + 1;
    currentDate.setDate(currentDate.getDate() + daysToAdd);
  }
  
  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const TransactionHistory = () => {
  const today = new Date();
  const oneMonthAgo = new Date(today);
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  const [dateRange, setDateRange] = useState<{
    from: Date;
    to: Date;
  }>({
    from: oneMonthAgo,
    to: today,
  });
  
  const [transactions, setTransactions] = useState(() => 
    generateTransactions(oneMonthAgo, today)
  );
  
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  const handleDateRangeChange = (range: { from: Date; to: Date }) => {
    if (range.from && range.to) {
      setDateRange(range);
      setTransactions(generateTransactions(range.from, range.to));
      toast.success("Date range updated", {
        description: `Showing transactions from ${format(range.from, 'MMM d, yyyy')} to ${format(range.to, 'MMM d, yyyy')}`
      });
    }
  };
  
  const handleSortToggle = () => {
    const newOrder = sortOrder === 'desc' ? 'asc' : 'desc';
    setSortOrder(newOrder);
    setTransactions(current => [...current].sort((a, b) => 
      newOrder === 'desc' 
        ? b.date.getTime() - a.date.getTime() 
        : a.date.getTime() - b.date.getTime()
    ));
    toast.info(`Sorted by date (${newOrder === 'desc' ? 'newest first' : 'oldest first'})`);
  };
  
  const handleFilter = (type: string) => {
    const regeneratedTransactions = generateTransactions(dateRange.from, dateRange.to);
    
    if (type === 'ALL') {
      setTransactions(regeneratedTransactions);
      toast.info("Showing all transactions");
    } else {
      const filtered = regeneratedTransactions.filter(transaction => transaction.type === type);
      setTransactions(filtered);
      toast.info(`Filtered to show only ${type.toLowerCase()} transactions`);
    }
  };
  
  const handleDownload = () => {
    toast.success("Statement downloaded", {
      description: `Transaction history from ${format(dateRange.from, 'MMM d, yyyy')} to ${format(dateRange.to, 'MMM d, yyyy')} downloaded successfully.`
    });
  };
  
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-finance-primary mb-2 finance-accent-gradient">Transaction History</h2>
        <p className="text-muted-foreground">Review your account activity and filter by date range</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <Card className="col-span-1 lg:col-span-3 layered-card">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                {format(dateRange.from, 'MMM d, yyyy')} to {format(dateRange.to, 'MMM d, yyyy')}
              </CardDescription>
            </div>
            
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <CalendarDays className="h-4 w-4" />
                    <span>Date Range</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    initialFocus
                    mode="range"
                    defaultMonth={dateRange.from}
                    selected={dateRange}
                    onSelect={(range) => handleDateRangeChange(range as { from: Date; to: Date })}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Filter className="h-4 w-4" />
                    <span>Filter</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="end">
                  <div className="flex flex-col gap-2">
                    <Button variant="ghost" size="sm" onClick={() => handleFilter('ALL')}>All Transactions</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleFilter('BUY')}>Buys</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleFilter('SELL')}>Sells</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleFilter('DEPOSIT')}>Deposits</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleFilter('WITHDRAWAL')}>Withdrawals</Button>
                    <Button variant="ghost" size="sm" onClick={() => handleFilter('DIVIDEND')}>Dividends</Button>
                  </div>
                </PopoverContent>
              </Popover>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <Table>
              <TableCaption>
                Showing {transactions.length} transactions
              </TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead onClick={handleSortToggle} className="cursor-pointer hover:text-primary transition-colors">
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Symbol</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow 
                    key={transaction.id}
                    className="hover:bg-muted/60 transition-colors cursor-pointer"
                    onClick={() => toast.info(`Transaction details for ${format(transaction.date, 'MMM d, yyyy')}`, {
                      description: `${transaction.type}${transaction.symbol ? ' ' + transaction.symbol : ''}: $${Math.abs(transaction.amount).toFixed(2)}`
                    })}
                  >
                    <TableCell className="font-medium">{format(transaction.date, 'MMM d, yyyy')}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getTypeStyle(transaction.type)}`}>
                        {transaction.type}
                      </span>
                    </TableCell>
                    <TableCell>{transaction.symbol || '—'}</TableCell>
                    <TableCell className={`text-right ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount >= 0 ? '+' : '−'}${Math.abs(transaction.amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">${transaction.balance.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        <Card className="col-span-1 gradient-bg-accent glass-card">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Transaction statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Total Transactions</h4>
                <p className="text-2xl font-bold">{transactions.length}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Period</h4>
                <p className="text-sm">From {format(dateRange.from, 'MMM d, yyyy')}</p>
                <p className="text-sm">To {format(dateRange.to, 'MMM d, yyyy')}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Cash In/Out</h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm">In:</span>
                  <span className="text-sm text-green-600 font-medium">
                    +${transactions
                      .filter(t => t.amount > 0)
                      .reduce((sum, t) => sum + t.amount, 0)
                      .toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Out:</span>
                  <span className="text-sm text-red-600 font-medium">
                    −${Math.abs(
                      transactions
                        .filter(t => t.amount < 0)
                        .reduce((sum, t) => sum + t.amount, 0)
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-finance-accent hover:bg-green-700" 
                onClick={() => toast.success("Report generated", {
                  description: "A detailed transaction report has been sent to your email"
                })}
              >
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

function getTypeStyle(type: string) {
  switch (type) {
    case 'BUY':
      return 'bg-blue-100 text-blue-800';
    case 'SELL':
      return 'bg-purple-100 text-purple-800';
    case 'DIVIDEND':
      return 'bg-green-100 text-green-800';
    case 'DEPOSIT':
      return 'bg-teal-100 text-teal-800';
    case 'WITHDRAWAL':
      return 'bg-amber-100 text-amber-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}

export default TransactionHistory;
