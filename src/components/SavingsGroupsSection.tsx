
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { Users, Crown } from "lucide-react";
import SavingsGroups from './SavingsGroups';

interface SavingsGroupsSectionProps {
  userLevel: 'basic' | 'premium';
  onFeatureClick: (featureName: string, description: string) => void;
}

const SavingsGroupsSection = ({ userLevel, onFeatureClick }: SavingsGroupsSectionProps) => {
  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-400" />
            💰 Savings Groups Feature
          </div>
          {userLevel === 'basic' && (
            <Crown className="h-5 w-5 text-yellow-400" />
          )}
        </CardTitle>
        <CardDescription className="text-slate-300">
          Join or create savings groups to reach financial goals together
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <SavingsGroups userLevel={userLevel} />
        <div className="text-center pt-4 border-t border-slate-600">
          <Button 
            className="w-full bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              onFeatureClick("Savings Groups", "Collaborate with family and friends to reach savings goals faster");
              toast("👥 Demo Groups Available", { description: "Join Family or Friends groups, or upgrade for more options!" });
            }}
          >
            Click Here to Join Savings Groups
          </Button>
          {userLevel === 'basic' && (
            <p className="text-xs text-slate-400 mt-2">
              💎 Upgrade to Premium to create custom groups beyond Family & Friends
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavingsGroupsSection;
