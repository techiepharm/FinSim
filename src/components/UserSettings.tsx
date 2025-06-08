
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Lock, User, Save, ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useNavigate } from 'react-router-dom';
import QuickProfileSetup from './QuickProfileSetup';

const UserSettings = () => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: 'ezraayo78@gmail.com',
    newPassword: 'Folorunso',
    confirmPassword: 'Folorunso'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleUpdateEmail = async () => {
    if (!formData.email || formData.email === user?.email) {
      toast("ℹ️ No Changes", {
        description: "Email is the same as current email",
        className: "bg-blue-600 border-blue-700 text-white",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: formData.email
      });

      if (error) throw error;

      toast("✅ Email Update Initiated", {
        description: "Check both your old and new email for confirmation links",
        className: "bg-green-600 border-green-700 text-white",
      });
    } catch (error: any) {
      toast("❌ Email Update Failed", {
        description: error.message || "Failed to update email",
        className: "bg-red-600 border-red-700 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!formData.newPassword) {
      toast("⚠️ Missing Password", {
        description: "Please enter a new password",
        className: "bg-yellow-600 border-yellow-700 text-white",
      });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast("⚠️ Passwords Don't Match", {
        description: "New password and confirmation must match",
        className: "bg-yellow-600 border-yellow-700 text-white",
      });
      return;
    }

    if (formData.newPassword.length < 6) {
      toast("⚠️ Password Too Short", {
        description: "Password must be at least 6 characters long",
        className: "bg-yellow-600 border-yellow-700 text-white",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (error) throw error;

      toast("✅ Password Updated", {
        description: "Your password has been successfully updated",
        className: "bg-green-600 border-green-700 text-white",
      });

      // Clear password fields
      setFormData(prev => ({
        ...prev,
        newPassword: '',
        confirmPassword: ''
      }));
    } catch (error: any) {
      toast("❌ Password Update Failed", {
        description: error.message || "Failed to update password",
        className: "bg-red-600 border-red-700 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickUpdate = async () => {
    // Quick update to the specific credentials requested
    setIsLoading(true);
    try {
      // Update email and password together
      const { error } = await supabase.auth.updateUser({
        email: formData.email,
        password: formData.newPassword
      });

      if (error) throw error;

      toast("✅ Login Details Updated", {
        description: `Email changed to ${formData.email} and password updated`,
        className: "bg-green-600 border-green-700 text-white",
      });

      // Navigate back to dashboard after successful update
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error: any) {
      toast("❌ Update Failed", {
        description: error.message || "Failed to update login details",
        className: "bg-red-600 border-red-700 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-4">
      <div className="container mx-auto max-w-2xl space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-slate-400 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-slate-400">Update your login credentials</p>
        </div>

        {/* Quick Setup Component */}
        <QuickProfileSetup />

        {/* Email Update Section */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Mail className="h-5 w-5 text-green-400" />
              Update Email
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-email" className="text-slate-300">Current Email</Label>
              <Input
                id="current-email"
                type="email"
                value={user?.email || ''}
                disabled
                className="bg-slate-700 border-slate-600 text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-email" className="text-slate-300">New Email</Label>
              <Input
                id="new-email"
                type="email"
                placeholder="Enter new email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            <Button
              onClick={handleUpdateEmail}
              disabled={isLoading || !formData.email || formData.email === user?.email}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Updating..." : "Update Email"}
            </Button>
          </CardContent>
        </Card>

        {/* Password Update Section */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Lock className="h-5 w-5 text-green-400" />
              Update Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-slate-300">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={(e) => handleInputChange('newPassword', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                minLength={6}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-slate-300">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="bg-slate-700 border-slate-600 text-white"
                minLength={6}
              />
            </div>
            <Button
              onClick={handleUpdatePassword}
              disabled={isLoading || !formData.newPassword || !formData.confirmPassword}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Updating..." : "Update Password"}
            </Button>
          </CardContent>
        </Card>

        {/* Quick Update Section */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <User className="h-5 w-5 text-blue-400" />
              Update Both Credentials
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-400 mb-4">
              Update both email and password at once with the values above.
            </p>
            <Button
              onClick={handleQuickUpdate}
              disabled={isLoading || !formData.email || !formData.newPassword}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              <Save className="mr-2 h-4 w-4" />
              {isLoading ? "Updating..." : "Update Email & Password"}
            </Button>
          </CardContent>
        </Card>

        <div className="text-center">
          <p className="text-slate-400 text-sm">
            🔒 Your account is secured with Supabase authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
