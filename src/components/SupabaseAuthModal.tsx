
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface SupabaseAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: any) => void;
}

const SupabaseAuthModal = ({ isOpen, onClose, onAuthSuccess }: SupabaseAuthModalProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: ''
  });

  useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          onAuthSuccess(session.user);
          onClose();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [onAuthSuccess, onClose]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName || formData.email.split('@')[0]
          },
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) throw error;

      if (data.user) {
        toast("✅ Account Created Successfully", {
          description: "Welcome to FinSavvy! Your Nigerian demo account is ready.",
          className: "bg-green-600 border-green-700 text-white",
        });
      }
    } catch (error: any) {
      toast("❌ Sign Up Error", {
        description: error.message || "Failed to create account",
        className: "bg-red-600 border-red-700 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      if (data.user) {
        toast("✅ Login Successful", {
          description: "Welcome back to your Nigerian demo account!",
          className: "bg-green-600 border-green-700 text-white",
        });
      }
    } catch (error: any) {
      toast("❌ Login Error", {
        description: error.message || "Failed to sign in",
        className: "bg-red-600 border-red-700 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-900 text-white border-slate-700 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <User className="h-6 w-6 text-green-400" />
            FinSavvy {isSignUp ? 'Sign Up' : 'Login'}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-400">
            {isSignUp ? 'Create your Nigerian fintech account' : 'Sign in to your account'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn} className="space-y-4">
          {isSignUp && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="pl-10 bg-slate-800 border-slate-600"
                  required={isSignUp}
                />
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10 bg-slate-800 border-slate-600"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="pl-10 pr-10 bg-slate-800 border-slate-600"
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          
          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            {isLoading ? (isSignUp ? "Creating Account..." : "Signing In...") : (isSignUp ? "Create Account" : "Sign In")}
          </Button>
        </form>

        <div className="text-center text-sm">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-green-400 hover:text-green-300"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="text-center text-xs text-slate-400 mt-4 p-2 bg-blue-900/30 border border-blue-700/50 rounded-md">
          🇳🇬 Nigerian Demo Account - Start with ₦415,000 virtual balance
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupabaseAuthModal;
