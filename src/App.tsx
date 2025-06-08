
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import IndexSupabase from "./pages/IndexSupabase";
import NotFound from "./pages/NotFound";
import Goals from "./components/Goals";
import CalendarView from "./components/CalendarView";
import TransactionHistory from "./components/TransactionHistory";
import WithdrawFunds from "./components/WithdrawFunds";
import AddFunds from "./components/AddFunds";

// Create the client as a component function
const App = () => {
  // Create a client inside the component function
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner 
          position="top-center"
          expand={true}
          closeButton={true}
          richColors={true}
          className="cursor-pointer" 
          toastOptions={{
            style: {
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              maxWidth: "400px",
              width: "calc(100% - 32px)",
              zIndex: "100",
              cursor: "pointer",
            }
          }}
        />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<IndexSupabase />} />
            <Route path="/goals" element={<Goals />} />
            <Route path="/calendar" element={<CalendarView />} />
            <Route path="/transactions" element={<TransactionHistory />} />
            <Route path="/withdraw" element={<WithdrawFunds />} />
            <Route path="/add-funds" element={<AddFunds />} />
            <Route path="/trading" element={<IndexSupabase activePage="trading" />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
