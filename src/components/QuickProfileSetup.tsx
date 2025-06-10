
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const QuickProfileSetup = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickSetup = async () => {
    setIsLoading(true);
    
    // Simulate profile update
    setTimeout(() => {
      toast("✅ Profile Updated Successfully", {
        description: "Your demo profile is ready to use!",
        className: "bg-green-600 border-green-700 text-white",
      });
      setIsLoading(false);
    }, 1500);
  };

  return (
    <Card className="bg-gradient-to-br from-green-900 to-green-800 border-green-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="h-5 w-5 text-green-400" />
          Demo Profile Ready
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-green-400" />
            <span className="text-sm">Demo User: Ezra Folorunso</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-green-400" />
            <span className="text-sm">Account: Nigerian Demo Account</span>
          </div>
        </div>
        <Button
          onClick={handleQuickSetup}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isLoading ? "Setting up..." : "Start Using FinSavvy"}
        </Button>
        <p className="text-xs text-slate-300">
          Ready to explore Nigerian fintech features with ₦415,000 virtual balance!
        </p>
      </CardContent>
    </Card>
  );
};

export default QuickProfileSetup;
