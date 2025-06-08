
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Lock } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const QuickProfileSetup = () => {
  const { user } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleQuickSetup = async () => {
    setIsLoading(true);
    try {
      // Update to the requested email and password
      const { error } = await supabase.auth.updateUser({
        email: 'ezraayo78@gmail.com',
        password: 'Folorunso'
      });

      if (error) throw error;

      toast("✅ Profile Updated Successfully", {
        description: "Your login details have been changed to ezraayo78@gmail.com",
        className: "bg-green-600 border-green-700 text-white",
      });

      // Force a page refresh to ensure auth state is updated
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error: any) {
      toast("❌ Update Failed", {
        description: error.message || "Failed to update profile",
        className: "bg-red-600 border-red-700 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-green-900 to-green-800 border-green-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <User className="h-5 w-5 text-green-400" />
          Quick Profile Update
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-slate-200 space-y-2">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-green-400" />
            <span className="text-sm">New Email: ezraayo78@gmail.com</span>
          </div>
          <div className="flex items-center gap-2">
            <Lock className="h-4 w-4 text-green-400" />
            <span className="text-sm">New Password: Folorunso</span>
          </div>
        </div>
        <Button
          onClick={handleQuickSetup}
          disabled={isLoading}
          className="w-full bg-green-600 hover:bg-green-700"
        >
          {isLoading ? "Updating..." : "Update Login Details"}
        </Button>
        <p className="text-xs text-slate-300">
          This will update your login credentials instantly
        </p>
      </CardContent>
    </Card>
  );
};

export default QuickProfileSetup;
