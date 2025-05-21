
import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Send, User, RefreshCw, Lightbulb } from "lucide-react";

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

const FinancialBot = () => {
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
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Sample questions for inspiration
  const sampleQuestions = [
    "What is compound interest?",
    "How do I build a diversified portfolio?",
    "Should I buy or sell Apple stock?",
    "What's the difference between stocks and bonds?",
    "How can I create an emergency fund?",
    "Explain dollar-cost averaging",
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
    
    if (lowerCaseMessage.includes('compound interest')) {
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
    
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);
    
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
          <h2 className="text-3xl font-bold text-finance-primary">Financial Assistant</h2>
          <p className="text-muted-foreground mt-1">Get answers to your financial questions</p>
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
                className="w-full justify-start text-left h-auto py-2"
                onClick={() => {
                  setInput(question);
                }}
              >
                {question}
              </Button>
            ))}
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
            </CardTitle>
            <CardDescription>
              Ask questions about financial literacy, investing, and trading
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
                placeholder="Type your financial question..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1"
                disabled={isTyping}
              />
              <Button 
                type="submit"
                className="bg-finance-primary"
                disabled={input.trim() === '' || isTyping}
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
