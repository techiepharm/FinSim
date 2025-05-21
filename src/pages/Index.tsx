
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
import WithdrawFunds from "@/components/WithdrawFunds";

const Index = () => {
  const [activePage, setActivePage] = useState('dashboard');
  
  // Render the appropriate component based on active page
  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard />;
      case 'learning':
        return <LearningCenter />;
      case 'trading':
        return <StockSimulator />;
      case 'portfolio':
        return <Portfolio />;
      case 'assistant':
        return <FinancialBot />;
      case 'goals':
        return <Goals />;
      case 'calendar':
        return <CalendarView />;
      case 'transactions':
        return <TransactionHistory />;
      case 'withdraw':
        return <WithdrawFunds />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 gradient-bg-primary">
      <Header activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1">
        {renderPage()}
      </main>
    </div>
  );
};

export default Index;
