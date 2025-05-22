
import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CreditCard, PlusCircle, MinusCircle, TrendingUp, DollarSign } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { Link } from "react-router-dom";

interface CashCardProps {
  userName: string;
  cardNumber: string;
  cardType: string;
  expiryDate: string;
  availableBalance: number;
}

const CashCard = ({ userName, cardNumber, cardType, expiryDate, availableBalance }: CashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleDeposit = () => {
    toast.info("Deposit Funds", { description: "Opening deposit funds page" });
  };

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className={`relative cursor-pointer transition-all duration-700 ${isFlipped ? 'scale-105' : ''}`} 
      onClick={handleCardClick}
      style={{ perspective: '1000px', height: '250px' }}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front of the card */}
        <Card 
          gradient="blue" 
          className={`absolute w-full h-full backface-hidden ${isFlipped ? 'opacity-0' : 'opacity-100'}`}
          style={{ backfaceVisibility: 'hidden' }}
        >
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-white">
              <DollarSign className="h-5 w-5" />
              Your Cash Card
            </CardTitle>
            <div className="text-sm opacity-90">{cardType}</div>
          </CardHeader>
          
          <CardContent>
            <div className="mt-4 text-2xl font-bold text-white">
              ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
            <div className="mt-1 text-sm opacity-90">Available Balance</div>
            
            <div className="mt-8 flex items-center space-x-2">
              <div className="h-10 w-16 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-md opacity-80"></div>
              <div className="text-white font-mono">
                {cardNumber}
              </div>
            </div>
            
            <div className="mt-4 text-sm opacity-90">
              {userName} • Expires {expiryDate}
            </div>
          </CardContent>
        </Card>

        {/* Back of the card */}
        <Card 
          gradient="premium" 
          className={`absolute w-full h-full backface-hidden rotate-y-180 ${isFlipped ? 'opacity-100' : 'opacity-0'}`}
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          <CardHeader>
            <CardTitle className="text-white">Quick Actions</CardTitle>
          </CardHeader>
          
          <CardContent className="flex flex-col gap-4">
            <div className="h-10 w-full bg-black opacity-80 rounded"></div>
            <div className="text-sm opacity-80 text-center">
              Tap card to flip back
            </div>
          </CardContent>
          
          <CardFooter className="gap-2 justify-center">
            <Button className="w-full" onClick={handleDeposit}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Money
            </Button>
            <Link to="/withdraw" className="w-full">
              <Button className="w-full" variant="outline">
                <MinusCircle className="mr-2 h-4 w-4" />
                Withdraw
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default CashCard;
