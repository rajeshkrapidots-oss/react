import { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useSidebarState } from '../context/SidebarContext';
import {
  Search,
  Bell,
  Moon,
  Sun,
  Menu,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { cn } from '../lib/utils';

const TopNavbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { setMobileOpen } = useSidebarState();
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-4 border-b border-border bg-card/80 backdrop-blur-lg px-4 sm:px-6">
      {/* Left — mobile hamburger + search */}
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="shrink-0 lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className={cn(
          'relative w-full max-w-xs transition-all duration-200',
          searchFocused && 'max-w-sm'
        )}>
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search…"
            className="h-9 pl-9 bg-secondary/50 border-transparent focus:border-border focus:bg-background text-sm rounded-lg"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
        </div>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-1">
        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9 rounded-lg">
          {theme === 'dark' ? (
            <Sun className="h-[18px] w-[18px] text-muted-foreground" />
          ) : (
            <Moon className="h-[18px] w-[18px] text-muted-foreground" />
          )}
        </Button>

        {/* Notifications */}
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-lg">
          <Bell className="h-[18px] w-[18px] text-muted-foreground" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary ring-2 ring-card" />
        </Button>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 rounded-lg pl-2 pr-2 sm:pr-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-semibold">
                JD
              </div>
              <span className="hidden text-sm font-medium text-foreground sm:inline">
                John Doe
              </span>
              <ChevronDown className="hidden h-3.5 w-3.5 text-muted-foreground sm:inline" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium text-foreground">John Doe</p>
              <p className="text-xs text-muted-foreground">john@company.com</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 text-sm">
              <User className="h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem className="gap-2 text-sm">
              <Settings className="h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="gap-2 text-sm text-destructive focus:text-destructive"
              onClick={() => { localStorage.clear(); window.location.href = '/login'; }}
            >
              <LogOut className="h-4 w-4" /> Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default TopNavbar;
