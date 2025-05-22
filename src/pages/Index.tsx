
import { useState, useRef } from 'react';
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
  const [swipePosition, setSwipePosition] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  
  // Define pages array for swiping functionality
  const pages = [
    { id: 'dashboard', name: 'Dashboard', component: <Dashboard /> },
    { id: 'learning', name: 'Learning Center', component: <LearningCenter /> },
    { id: 'trading', name: 'Trading', component: <StockSimulator /> },
    { id: 'portfolio', name: 'Portfolio', component: <Portfolio /> },
    { id: 'goals', name: 'Goals', component: <Goals /> },
    { id: 'calendar', name: 'Calendar', component: <CalendarView /> },
    { id: 'transactions', name: 'Transactions', component: <TransactionHistory /> },
  ];

  // Find current page index
  const currentPageIndex = pages.findIndex(page => page.id === activePage);
  
  // Handle touch start
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  
  // Handle touch end
  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].clientX;
    handleSwipe();
  };

  // Calculate swipe direction and navigate
  const handleSwipe = () => {
    const swipeDistance = touchEndX.current - touchStartX.current;
    const minSwipeDistance = 50;
    
    if (swipeDistance > minSwipeDistance && currentPageIndex > 0) {
      // Swiped right, go to previous page
      setActivePage(pages[currentPageIndex - 1].id);
      setSwipePosition(1); // Enter from left
      setTimeout(() => setSwipePosition(0), 10);
    } else if (swipeDistance < -minSwipeDistance && currentPageIndex < pages.length - 1) {
      // Swiped left, go to next page
      setActivePage(pages[currentPageIndex + 1].id);
      setSwipePosition(-1); // Enter from right
      setTimeout(() => setSwipePosition(0), 10);
    }
  };
  
  // Handle direct navigation
  const handleNavigate = (pageId) => {
    const targetIndex = pages.findIndex(page => page.id === pageId);
    const currentIndex = pages.findIndex(page => page.id === activePage);
    
    if (targetIndex > currentIndex) {
      setSwipePosition(-1); // Enter from right
    } else if (targetIndex < currentIndex) {
      setSwipePosition(1); // Enter from left
    }
    
    setActivePage(pageId);
    setTimeout(() => setSwipePosition(0), 10);
  };
  
  return (
    <div 
      className="min-h-screen flex flex-col bg-slate-900 text-white"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Header activePage={activePage} onNavigate={handleNavigate} />
      
      <main 
        className="flex-1 relative overflow-hidden"
      >
        <div 
          className={`absolute inset-0 transition-transform duration-300 ease-in-out`}
          style={{ 
            transform: `translateX(${swipePosition * 100}%)` 
          }}
        >
          {pages[currentPageIndex].component}
        </div>
        
        {/* Pagination Indicator */}
        <div className="fixed bottom-20 left-0 right-0 flex justify-center gap-2 py-4">
          {pages.map((page, index) => (
            <button
              key={page.id}
              className={`w-2 h-2 rounded-full transition-all ${
                currentPageIndex === index 
                  ? 'bg-green-400 w-6' 
                  : 'bg-slate-600'
              }`}
              onClick={() => handleNavigate(page.id)}
              aria-label={`Go to ${page.name}`}
            />
          ))}
        </div>
        
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
