
import { useState } from 'react';
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import LearningCenter from "@/components/LearningCenter";
import StockSimulator from "@/components/StockSimulator";
import Portfolio from "@/components/Portfolio";
import FinancialBot from "@/components/FinancialBot";
import Goals from "@/components/Goals";
import CalendarView from "@/components/CalendarView";
import TransactionHistory from "@/components/TransactionHistory";
import { Button } from "@/components/ui/button";
import { Bot } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

const Index = () => {
  const [activePage, setActivePage] = useState('dashboard');
  const [showFinancialBot, setShowFinancialBot] = useState(false);
  
  // Map of page IDs to components
  const pageComponents = {
    'dashboard': <Dashboard />,
    'learning': <LearningCenter />,
    'trading': <StockSimulator />,
    'portfolio': <Portfolio />,
    'goals': <Goals />,
    'calendar': <CalendarView />,
    'transactions': <TransactionHistory />
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-white">
      <Header activePage={activePage} setActivePage={setActivePage} />
      
      <main className="flex-1">
        {pageComponents[activePage]}
        
        {/* Financial Bot Button */}
        <Drawer>
          <DrawerTrigger asChild>
            <Button 
              className="fixed bottom-4 right-4 rounded-full w-14 h-14 bg-green-600 hover:bg-green-700 shadow-lg flex items-center justify-center"
              onClick={() => setShowFinancialBot(true)}
            >
              <Bot size={28} />
            </Button>
          </DrawerTrigger>
          <DrawerContent className="bg-slate-800 text-white border-slate-700">
            <DrawerHeader>
              <DrawerTitle className="text-center text-white">Your Financial Assistant</DrawerTitle>
            </DrawerHeader>
            <div className="px-4 pb-8 h-[80vh] overflow-y-auto">
              <FinancialBot />
            </div>
          </DrawerContent>
        </Drawer>
      </main>
    </div>
  );
};

export default Index;
