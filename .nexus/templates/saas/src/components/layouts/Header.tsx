import React from 'react';
import { Button } from '@nexus/components/ui/Button';
import { Avatar, AvatarFallback, AvatarImage } from '@nexus/components/ui/Avatar';
import { Bell, Search, Menu } from 'lucide-react';

interface HeaderProps {
  user: any;
  signOut: () => void;
}

export function Header({ user, signOut }: HeaderProps) {
  return (
    <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="lg:hidden">
          <Menu className="h-5 w-5" />
        </Button>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <Bell className="h-5 w-5" />
        </Button>

        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-900">
              {user?.signInDetails?.loginId || 'User'}
            </p>
            <p className="text-xs text-gray-500">Free Plan</p>
          </div>
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
            <AvatarFallback>
              {user?.signInDetails?.loginId?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
