
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, PlusCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface CashCardUpdatedProps {
  availableBalance: number;
}

const CashCardUpdated = ({ availableBalance }: CashCardUpdatedProps) => {
  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-green-900/50 to-emerald-800/50 pb-2">
        <CardTitle className="text-white flex justify-between items-center">
          <span>Available Cash</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="text-3xl font-bold text-white mb-4">${availableBalance.toFixed(2)}</div>
        
        <div className="space-y-2">
          <Button 
            variant="outline" 
            className="w-full border-green-600 text-green-400 hover:bg-green-800/20"
            asChild
          >
            <Link to="/withdraw">
              <Wallet className="mr-2 h-4 w-4" />
              Withdraw Funds
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full border-blue-600 text-blue-400 hover:bg-blue-800/20"
            asChild
          >
            <Link to="/add-funds">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Funds
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CashCardUpdated;
