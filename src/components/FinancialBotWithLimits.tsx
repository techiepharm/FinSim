
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Bot, Send, Crown, MessageSquare } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import PremiumUpgrade from "./PremiumUpgrade";

interface Message {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const FinancialBotWithLimits = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [userLevel, setUserLevel] = useState<'basic' | 'premium'>('basic');
  const [messagesUsed, setMessagesUsed] = useState(0);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [accountBalance, setAccountBalance] = useState(1000);

  const MESSAGE_LIMIT = 2;

  useEffect(() => {
    // Load user level and message count
    const storedLevel = localStorage.getItem('userLevel') || 'basic';
    const storedMessages = localStorage.getItem('botMessagesUsed') || '0';
    
    setUserLevel(storedLevel as 'basic' | 'premium');
    setMessagesUsed(parseInt(storedMessages));

    // Load account balance
    const portfolioData = localStorage.getItem('portfolio');
    if (portfolioData) {
      const portfolio = JSON.parse(portfolioData);
      setAccountBalance(portfolio.cash);
    }

    // Add welcome message
    const welcomeMessage: Message = {
      id: '1',
      text: `Hello! I'm your Financial Assistant. ${storedLevel === 'basic' ? `As a basic user, you have ${MESSAGE_LIMIT - parseInt(storedMessages)} messages remaining.` : 'As a premium user, you have unlimited access to my services!'} How can I help you with your finances today?`,
      isBot: true,
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);

    // Listen for storage updates
    const handleStorageUpdate = () => {
      const newLevel = localStorage.getItem('userLevel') || 'basic';
      setUserLevel(newLevel as 'basic' | 'premium');
      
      const portfolioData = localStorage.getItem('portfolio');
      if (portfolioData) {
        const portfolio = JSON.parse(portfolioData);
        setAccountBalance(portfolio.cash);
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('storageUpdate', handleStorageUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('storageUpdate', handleStorageUpdate);
    };
  }, []);

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('invest') || message.includes('stock')) {
      return "Great question about investing! For beginners, I recommend starting with diversified index funds or ETFs. They offer broad market exposure with lower risk. Consider investing 10-15% of your income regularly. Would you like specific stock recommendations based on your risk tolerance?";
    }
    
    if (message.includes('save') || message.includes('saving')) {
      return "Excellent focus on saving! I recommend the 50/30/20 rule: 50% for needs, 30% for wants, and 20% for savings. Start with an emergency fund of 3-6 months of expenses, then focus on long-term goals. Our app's automatic saving features can help you stay consistent!";
    }
    
    if (message.includes('budget') || message.includes('expense')) {
      return "Budgeting is crucial for financial success! Track your expenses for a month to understand your spending patterns. Use our expense tracking features to categorize spending. Focus on reducing unnecessary expenses and redirecting that money to savings and investments.";
    }
    
    if (message.includes('debt') || message.includes('loan')) {
      return "Managing debt is important for financial health. Focus on paying off high-interest debt first (avalanche method) or start with smallest balances for motivation (snowball method). Consider consolidation if it lowers your interest rates. Avoid taking on new debt while paying off existing obligations.";
    }
    
    if (message.includes('emergency') || message.includes('fund')) {
      return "An emergency fund is your financial safety net! Aim for 3-6 months of living expenses. Start small - even $500 can handle many emergencies. Keep it in a high-yield savings account for easy access. Use our automatic savings features to build it gradually!";
    }
    
    return "That's a thoughtful financial question! Based on your demo account activity, I'd recommend focusing on diversification and consistent investing. Remember, successful investing is about time in the market, not timing the market. Consider using our portfolio tracking features to monitor your progress!";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Check message limits for basic users
    if (userLevel === 'basic' && messagesUsed >= MESSAGE_LIMIT) {
      toast("🔒 Message Limit Reached", {
        description: "Upgrade to Premium for unlimited conversations with your Financial Assistant!",
        className: "bg-purple-600 border-purple-700 text-white",
        duration: 4000,
      });
      setShowUpgrade(true);
      return;
    }

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Update message count for basic users
    if (userLevel === 'basic') {
      const newCount = messagesUsed + 1;
      setMessagesUsed(newCount);
      localStorage.setItem('botMessagesUsed', newCount.toString());
    }

    // Generate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputMessage),
        isBot: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);

      // Show limit warning for basic users
      if (userLevel === 'basic' && messagesUsed + 1 >= MESSAGE_LIMIT) {
        setTimeout(() => {
          toast("⚠️ Last Free Message Used", {
            description: "This was your last free message. Upgrade to Premium for unlimited access!",
            className: "bg-yellow-600 border-yellow-700 text-white",
            duration: 5000,
          });
        }, 1000);
      }
    }, 1000);

    setInputMessage('');
  };

  const handleUpgradeSuccess = () => {
    setUserLevel('premium');
    setMessagesUsed(0);
    localStorage.setItem('botMessagesUsed', '0');
  };

  return (
    <>
      <div className="flex flex-col h-full max-h-[70vh]">
        {/* Header */}
        <div className="border-b border-slate-700 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-white">Financial Assistant</h3>
                <div className="flex items-center gap-2">
                  <Badge className={userLevel === 'premium' ? 'bg-purple-600' : 'bg-slate-600'}>
                    {userLevel === 'premium' ? (
                      <>
                        <Crown className="h-3 w-3 mr-1" />
                        Premium
                      </>
                    ) : 'Basic'}
                  </Badge>
                  {userLevel === 'basic' && (
                    <span className="text-xs text-slate-400">
                      {MESSAGE_LIMIT - messagesUsed} messages left
                    </span>
                  )}
                </div>
              </div>
            </div>
            {userLevel === 'basic' && (
              <Button 
                size="sm" 
                onClick={() => setShowUpgrade(true)}
                className="bg-purple-600 hover:bg-purple-700"
              >
                <Crown className="h-4 w-4 mr-1" />
                Upgrade
              </Button>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
              <div className={`max-w-[80%] p-3 rounded-lg ${
                message.isBot 
                  ? 'bg-slate-700 text-white' 
                  : 'bg-green-600 text-white'
              }`}>
                <p className="text-sm">{message.text}</p>
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-slate-700 p-4">
          <div className="flex space-x-2">
            <Input
              placeholder={
                userLevel === 'basic' && messagesUsed >= MESSAGE_LIMIT
                  ? "Upgrade to continue chatting..."
                  : "Ask me about budgeting, investing, saving..."
              }
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={userLevel === 'basic' && messagesUsed >= MESSAGE_LIMIT}
              className="bg-slate-700 border-slate-600 text-white"
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || (userLevel === 'basic' && messagesUsed >= MESSAGE_LIMIT)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          {userLevel === 'basic' && (
            <div className="mt-2 text-center">
              <p className="text-xs text-slate-400">
                💡 Tip: Upgrade to Premium for unlimited conversations and advanced financial insights!
              </p>
            </div>
          )}
        </div>
      </div>

      <PremiumUpgrade
        isOpen={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        onUpgradeSuccess={handleUpgradeSuccess}
        currentBalance={accountBalance}
      />
    </>
  );
};

export default FinancialBotWithLimits;
