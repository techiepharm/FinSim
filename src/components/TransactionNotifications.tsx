
import { useEffect } from 'react';
import { toast } from "@/components/ui/sonner";

const TransactionNotifications = () => {
  useEffect(() => {
    // Listen for transaction events
    const handleTransactionNotification = (event: CustomEvent) => {
      const { type, amount, symbol, balance } = event.detail;
      
      setTimeout(() => {
        showTransactionAdvice(type, amount, symbol, balance);
      }, 1500);
    };

    window.addEventListener('transactionComplete', handleTransactionNotification as EventListener);

    return () => {
      window.removeEventListener('transactionComplete', handleTransactionNotification as EventListener);
    };
  }, []);

  const showTransactionAdvice = (type: string, amount: number, symbol?: string, balance?: number) => {
    switch (type) {
      case 'BUY':
        toast("📈 Smart Investment Move!", {
          description: `You bought ${symbol} for $${amount.toFixed(2)}. Consider diversifying across different sectors and holding long-term for best results.`,
          className: "bg-green-600 border-green-700 text-white",
          duration: 6000,
        });
        
        setTimeout(() => {
          toast("💡 Investment Tip", {
            description: "Remember: Don't put all your eggs in one basket. Consider spreading investments across 5-10 different stocks.",
            className: "bg-blue-600 border-blue-700 text-white",
            duration: 5000,
          });
        }, 3000);
        break;

      case 'SELL':
        toast("💰 Sale Completed!", {
          description: `You sold ${symbol} for $${amount.toFixed(2)}. Consider reinvesting gains or adding to your emergency fund.`,
          className: "bg-purple-600 border-purple-700 text-white",
          duration: 6000,
        });
        
        setTimeout(() => {
          toast("🎯 Next Steps", {
            description: "With your profits, consider: 1) Reinvesting in growth stocks, 2) Adding to savings, or 3) Paying down debt.",
            className: "bg-yellow-600 border-yellow-700 text-white",
            duration: 5000,
          });
        }, 3000);
        break;

      case 'SAVINGS_DEPOSIT':
        toast("🏦 Great Saving Habit!", {
          description: `$${amount.toFixed(2)} added to savings! You're building financial security. Keep up the consistent saving.`,
          className: "bg-green-600 border-green-700 text-white",
          duration: 6000,
        });
        
        setTimeout(() => {
          toast("💡 Savings Strategy", {
            description: "Tip: Automate your savings to make it effortless. Even small amounts add up over time with compound interest!",
            className: "bg-blue-600 border-blue-700 text-white",
            duration: 5000,
          });
        }, 3000);
        break;

      case 'SAVINGS_WITHDRAWAL':
        toast("⚠️ Savings Withdrawal", {
          description: `$${amount.toFixed(2)} withdrawn from savings. Try to avoid frequent withdrawals to maintain your financial goals.`,
          className: "bg-orange-600 border-orange-700 text-white",
          duration: 6000,
        });
        
        setTimeout(() => {
          toast("🎯 Stay on Track", {
            description: "Consider: Was this withdrawal necessary? Can you replace this amount soon? Emergency fund should be for true emergencies.",
            className: "bg-yellow-600 border-yellow-700 text-white",
            duration: 5000,
          });
        }, 3000);
        break;

      case 'PREMIUM_UPGRADE':
        toast("👑 Welcome to Premium!", {
          description: `Investment in education pays the best dividends! You now have access to advanced financial tools and unlimited support.`,
          className: "bg-purple-600 border-purple-700 text-white",
          duration: 6000,
        });
        
        setTimeout(() => {
          toast("📚 Maximize Your Investment", {
            description: "Make the most of Premium: Use unlimited chat, create savings groups, and access advanced portfolio analytics!",
            className: "bg-green-600 border-green-700 text-white",
            duration: 5000,
          });
        }, 3000);
        break;

      default:
        if (balance && balance < 100) {
          toast("💰 Low Balance Alert", {
            description: `Your balance is $${balance.toFixed(2)}. Consider adding funds or review your spending to avoid overdrafts.`,
            className: "bg-red-600 border-red-700 text-white",
            duration: 6000,
          });
        }
        break;
    }

    // General financial health reminders
    if (balance) {
      const reminderChance = Math.random();
      
      if (reminderChance < 0.3) { // 30% chance
        setTimeout(() => {
          const tips = [
            "💡 Remember the 50/30/20 rule: 50% needs, 30% wants, 20% savings and debt repayment.",
            "📈 Time in the market beats timing the market. Stay consistent with your investments.",
            "🎯 Set clear financial goals and track your progress monthly.",
            "💳 Pay off high-interest debt first - it's a guaranteed return on investment.",
            "🏦 Keep 3-6 months of expenses in an emergency fund for peace of mind.",
            "📊 Diversification is key - don't put all your money in one investment.",
            "💰 Start investing early, even small amounts. Compound interest is powerful!",
            "📱 Use budgeting apps to track expenses and identify areas to save.",
          ];
          
          const randomTip = tips[Math.floor(Math.random() * tips.length)];
          
          toast("Daily Financial Wisdom", {
            description: randomTip,
            className: "bg-indigo-600 border-indigo-700 text-white",
            duration: 7000,
          });
        }, 8000);
      }
    }
  };

  // Function to trigger notifications from other components
  const triggerNotification = (type: string, amount: number, symbol?: string, balance?: number) => {
    const event = new CustomEvent('transactionComplete', {
      detail: { type, amount, symbol, balance }
    });
    window.dispatchEvent(event);
  };

  // Expose function globally for other components to use
  useEffect(() => {
    (window as any).triggerTransactionNotification = triggerNotification;
  }, []);

  return null; // This component doesn't render anything
};

export default TransactionNotifications;
