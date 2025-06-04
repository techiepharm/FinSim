
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Send, User, RefreshCw, Lightbulb, Crown, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/sonner";

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

const FinancialBot = () => {
  // Get user level from localStorage or default to basic
  const [userLevel] = useState<'basic' | 'premium'>(() => {
    try {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return user.level || 'basic';
      }
    } catch (e) {
      console.error('Error reading user level:', e);
    }
    return 'basic';
  });

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your Financial Assistant. I can answer questions about financial literacy, investing, and help you with trading decisions. How can I help you today?",
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Message limits for basic users
  const MAX_MESSAGES_BASIC = 10;
  const userMessages = messages.filter(m => m.sender === 'user').length;
  const canSendMessage = userLevel === 'premium' || userMessages < MAX_MESSAGES_BASIC;
  
  // Sample questions for inspiration - Enhanced with financial analysis
  const sampleQuestions = [
    "What is compound interest?",
    "How do I build a diversified portfolio?",
    "Should I buy or sell Apple stock?",
    "What's the difference between stocks and bonds?",
    "How can I create an emergency fund?",
    "Explain dollar-cost averaging",
    "Analyze my financial history and give me advice", // New suggestion
  ];
  
  // Scroll to bottom of messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Mock bot response function (in a real app, this would call an API)
  const getBotResponse = (userMessage: string) => {
    // This is a simple mock response system
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('analyze') && (lowerCaseMessage.includes('financial') || lowerCaseMessage.includes('history') || lowerCaseMessage.includes('finance'))) {
      return "Based on your demo account activity, here's my financial analysis:\n\n📊 **Current Financial Health**: Excellent\n💰 **Account Balance**: $1,000 (Virtual)\n📈 **Spending Pattern**: Conservative and learning-focused\n🎯 **Recommendation**: You're doing great with virtual trading! Consider:\n\n1. Continue learning with small virtual trades\n2. Set up automatic savings goals\n3. Diversify your virtual portfolio\n4. Track your learning progress\n\n💡 **Next Steps**: Try investing in different sectors to understand market dynamics. Your demo account is perfect for risk-free learning!";
    } else if (lowerCaseMessage.includes('compound interest')) {
      return "Compound interest is when you earn interest on both the money you've saved and the interest you earn. It's like a snowball effect that helps your money grow faster over time. For example, if you invest $1,000 with an annual 5% return, after the first year you'd have $1,050. In the second year, you'd earn 5% on $1,050, which is $52.50, giving you $1,102.50, and so on.";
    } else if (lowerCaseMessage.includes('portfolio') && lowerCaseMessage.includes('diversif')) {
      return "Diversification means spreading your investments across different asset classes to reduce risk. A well-diversified portfolio typically includes a mix of stocks, bonds, cash, and potentially alternative investments like real estate. Within each category, you should diversify further (e.g., stocks from different industries and company sizes). The goal is that when some investments perform poorly, others might perform well, helping to stabilize your overall returns.";
    } else if (lowerCaseMessage.includes('emergency fund')) {
      return "An emergency fund is money set aside for unexpected expenses or financial emergencies, like medical bills, car repairs, or job loss. Financial experts typically recommend saving 3-6 months of living expenses in an easily accessible account. Start by setting a small goal, like $500 or $1,000, then build up from there. Keep your emergency fund in a high-yield savings account where it's liquid but still earning some interest.";
    } else if (lowerCaseMessage.includes('stocks') && lowerCaseMessage.includes('bonds')) {
      return "Stocks represent ownership in a company, while bonds are essentially loans to companies or governments. Stocks generally offer higher potential returns but with higher risk and volatility. Bonds typically provide lower but more stable returns with less risk. Stocks are good for long-term growth, while bonds can provide income and stability to your portfolio. Most investors include both in their portfolio allocation based on their risk tolerance and time horizon.";
    } else if (lowerCaseMessage.includes('dollar-cost averaging')) {
      return "Dollar-cost averaging is an investment strategy where you invest a fixed amount regularly, regardless of market conditions. This approach means you buy more shares when prices are low and fewer when prices are high, potentially lowering your average cost per share over time. It's a disciplined way to invest that removes the emotional challenge of timing the market and can be particularly effective for long-term investors.";
    } else if ((lowerCaseMessage.includes('buy') || lowerCaseMessage.includes('sell')) && lowerCaseMessage.includes('apple')) {
      return "I can't provide specific investment advice on whether to buy or sell Apple stock, as that would depend on your financial situation, goals, and market conditions. Before making any investment decision, consider researching the company's financials, recent performance, growth prospects, and how it fits into your overall portfolio strategy. Remember that past performance doesn't guarantee future results, and it's often wise to consult with a financial advisor for personalized investment advice.";
    } else {
      return "That's a great question about finance! While I'd love to give you a detailed answer, I'm just a simple demo assistant. In a fully implemented version, I'd connect to a financial knowledge base to provide accurate and helpful information on topics like investing, budgeting, retirement planning, and more.";
    }
  };
  
  const handleSendMessage = () => {
    if (input.trim() === '') return;
    
    // Check message limit for basic users
    if (!canSendMessage) {
      toast("🔒 Message Limit Reached", {
        description: `Basic users are limited to ${MAX_MESSAGES_BASIC} messages. Upgrade to Premium for unlimited conversations!`,
        className: "bg-purple-600 border-purple-700 text-white",
        duration: 5000,
      });
      return;
    }
    
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    setMessageCount(prev => prev + 1);
    
    // Simulate bot response delay
    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getBotResponse(input),
        sender: 'bot',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-finance-primary flex items-center gap-2">
            Financial Assistant
            {userLevel === 'basic' && (
              <Badge variant="outline" className="text-yellow-400 border-yellow-600">
                <Crown className="h-3 w-3 mr-1" />
                Basic
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground mt-1">
            Get answers to your financial questions
            {userLevel === 'basic' && (
              <span className="text-yellow-400 ml-2">
                ({userMessages}/{MAX_MESSAGES_BASIC} messages used)
              </span>
            )}
          </p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Suggested Questions */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5" />
              Suggested Questions
            </CardTitle>
            <CardDescription>
              Try asking these financial questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {sampleQuestions.map((question, index) => (
              <Button 
                key={index} 
                variant="outline" 
                className={`w-full justify-start text-left h-auto py-2 ${
                  !canSendMessage ? 'opacity-50' : ''
                }`}
                disabled={!canSendMessage}
                onClick={() => {
                  if (canSendMessage) {
                    setInput(question);
                  }
                }}
              >
                {question === "Analyze my financial history and give me advice" && (
                  <span className="text-blue-400 mr-2">⭐</span>
                )}
                {question}
              </Button>
            ))}
            
            {/* Premium upgrade prompt for basic users */}
            {userLevel === 'basic' && (
              <div className="mt-4 p-3 bg-purple-900/30 border border-purple-600/50 rounded-lg text-center">
                <Crown className="h-5 w-5 text-purple-400 mx-auto mb-2" />
                <p className="text-purple-300 text-xs mb-2">
                  Upgrade for unlimited conversations
                </p>
                <Button 
                  size="sm" 
                  className="w-full bg-purple-600 hover:bg-purple-700"
                  onClick={() => toast("Coming Soon!", { description: "Premium features will be available soon!" })}
                >
                  Upgrade to Premium
                </Button>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button 
              variant="ghost" 
              className="w-full flex items-center gap-2"
              onClick={() => {
                setMessages([{
                  id: 1,
                  text: "Hello! I'm your Financial Assistant. I can answer questions about financial literacy, investing, and help you with trading decisions. How can I help you today?",
                  sender: 'bot',
                  timestamp: new Date(),
                }]);
                setMessageCount(0);
              }}
            >
              <RefreshCw className="h-4 w-4" />
              Reset Conversation
            </Button>
          </CardFooter>
        </Card>
        
        {/* Chat Interface */}
        <Card className="lg:col-span-3 flex flex-col h-[600px]">
          <CardHeader className="border-b pb-3">
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-finance-primary" />
              Financial Assistant
              {userLevel === 'basic' && (
                <Badge className="bg-yellow-600/20 text-yellow-300 text-xs">
                  {MAX_MESSAGES_BASIC - userMessages} messages left
                </Badge>
              )}
            </CardTitle>
            <CardDescription>
              Ask questions about financial literacy, investing, and trading
              {userLevel === 'basic' && (
                <span className="block text-yellow-400 text-sm mt-1">
                  💎 Upgrade to Premium for unlimited conversations and advanced features
                </span>
              )}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="flex-1 overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-finance-primary text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-800 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {message.sender === 'bot' ? (
                        <Bot className="h-4 w-4 mr-2" />
                      ) : (
                        <User className="h-4 w-4 mr-2" />
                      )}
                      <span className="text-xs opacity-70">
                        {message.sender === 'user' ? 'You' : 'Financial Assistant'} • {formatTime(message.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 rounded-lg rounded-bl-none p-3 max-w-[80%]">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse"></div>
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-gray-500 animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Message limit warning */}
              {userLevel === 'basic' && userMessages >= MAX_MESSAGES_BASIC - 2 && userMessages < MAX_MESSAGES_BASIC && (
                <div className="bg-yellow-900/30 border border-yellow-600/50 rounded-lg p-3 text-center">
                  <p className="text-yellow-300 text-sm">
                    ⚠️ You have {MAX_MESSAGES_BASIC - userMessages} message{MAX_MESSAGES_BASIC - userMessages !== 1 ? 's' : ''} remaining
                  </p>
                </div>
              )}
              
              {/* Upgrade prompt when limit reached */}
              {userLevel === 'basic' && !canSendMessage && (
                <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4 text-center">
                  <Lock className="h-8 w-8 text-purple-400 mx-auto mb-2" />
                  <p className="text-purple-300 text-sm mb-3">
                    You've reached your message limit. Upgrade to Premium for unlimited conversations!
                  </p>
                  <Button 
                    className="bg-purple-600 hover:bg-purple-700"
                    onClick={() => toast("Coming Soon!", { description: "Premium upgrade coming soon!" })}
                  >
                    Click Here to Upgrade to Premium
                  </Button>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
          
          <CardFooter className="border-t p-3">
            <form
              className="flex w-full gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
            >
              <Input
                placeholder={canSendMessage ? "Type your financial question..." : "Upgrade to Premium to continue chatting..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
                disabled={isTyping || !canSendMessage}
              />
              <Button 
                type="submit"
                className="bg-finance-primary"
                disabled={input.trim() === '' || isTyping || !canSendMessage}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </form>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

// Helper function to format time
const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

export default FinancialBot;
