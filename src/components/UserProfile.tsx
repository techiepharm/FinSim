
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface UserProfileProps {
  user: {
    name?: string;
    email: string;
  };
  onLogout: () => void;
}

const UserProfile = ({ user, onLogout }: UserProfileProps) => {
  const navigate = useNavigate();

  // Get initials from name (first letter of first name) with proper null checking
  const getInitials = (name: string | undefined | null) => {
    if (!name || typeof name !== 'string') {
      // Fallback to first letter of email if name is not available
      return user.email ? user.email.charAt(0).toUpperCase() : 'U';
    }
    const firstName = name.split(' ')[0];
    return firstName.charAt(0).toUpperCase();
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  // Use fallback display name if user.name is not available
  const displayName = user.name || user.email || 'User';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-green-600 text-white font-semibold">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 bg-slate-800 border-slate-700 text-white" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{displayName}</p>
            <p className="text-xs leading-none text-slate-400">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-slate-700" />
        <DropdownMenuItem onClick={handleSettingsClick} className="hover:bg-slate-700">
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onLogout} className="text-red-400 hover:text-red-300 hover:bg-slate-700">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfile;
