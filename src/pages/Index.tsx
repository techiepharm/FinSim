
import { useState } from 'react';
import Header from "@/components/Header";
import Dashboard from "@/components/Dashboard";
import LearningCenter from "@/components/LearningCenter";
import StockSimulator from "@/components/StockSimulator";
import Portfolio from "@/components/Portfolio";
import FinancialBot from "@/components/FinancialBot";

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
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header activePage={activePage} setActivePage={setActivePage} />
      <main className="flex-1">
        {renderPage()}
      </main>
    </div>
  );
};

export default Index;
