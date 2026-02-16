import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Blocks,
  Monitor,
  Image,
  BarChart3,
  Settings,
  LogOut,
  ChevronLeft,
  Zap,
} from 'lucide-react';
import { ROUTES } from '../constants';
import { cn } from '../lib/utils';
import { useSidebarState } from '../context/SidebarContext';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Separator } from '@/components/ui/separator';

const mainNav = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
  { label: 'Users', path: ROUTES.USERS, icon: Users },
  { label: 'Activity Blocks', path: ROUTES.ACTIVITY_BLOCKS, icon: Blocks },
  { label: 'Devices', path: ROUTES.DEVICES, icon: Monitor },
  { label: 'Screenshots', path: ROUTES.SCREENSHOTS, icon: Image },
];

const secondaryNav = [
  { label: 'Analytics', path: ROUTES.ANALYTICS, icon: BarChart3 },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: Settings },
];

const AppSidebar = () => {
  const { collapsed, toggle, setMobileOpen } = useSidebarState();
  const { pathname } = useLocation();

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  const closeMobile = () => setMobileOpen(false);

  const renderLink = (item: { label: string; path: string; icon: React.ElementType }) => {
    const isActive = pathname === item.path;
    const link = (
      <Link
        to={item.path}
        onClick={closeMobile}
        className={cn(
          'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
          collapsed && 'justify-center px-2',
          isActive
            ? 'bg-primary/10 text-primary'
            : 'text-muted-foreground hover:bg-accent hover:text-foreground'
        )}
      >
        <item.icon className={cn('h-[18px] w-[18px] shrink-0', isActive && 'text-primary')} />
        {!collapsed && <span className="truncate">{item.label}</span>}
        {isActive && !collapsed && (
          <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
        )}
      </Link>
    );

    if (collapsed) {
      return (
        <Tooltip key={item.path} delayDuration={0}>
          <TooltipTrigger asChild>{link}</TooltipTrigger>
          <TooltipContent side="right" className="text-xs font-medium">
            {item.label}
          </TooltipContent>
        </Tooltip>
      );
    }

    return <div key={item.path}>{link}</div>;
  };

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-r border-border bg-card transition-all duration-300 ease-in-out',
        collapsed ? 'w-[60px]' : 'w-[250px]'
      )}
    >
      {/* Logo */}
      <div className={cn('flex h-16 items-center gap-3 px-4', collapsed && 'justify-center px-2')}>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary shadow-md shadow-primary/20">
          <Zap className="h-[18px] w-[18px] text-primary-foreground" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-foreground tracking-tight leading-none">
              AdminHub
            </span>
            <span className="text-[10px] text-muted-foreground mt-0.5">Enterprise Suite</span>
          </div>
        )}
      </div>

      <Separator />

      {/* Main nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        <div className="space-y-0.5">
          {!collapsed && (
            <span className="mb-1 block px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              Main
            </span>
          )}
          {mainNav.map(renderLink)}
        </div>

        <div className="my-3">
          <Separator />
        </div>

        <div className="space-y-0.5">
          {!collapsed && (
            <span className="mb-1 block px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              System
            </span>
          )}
          {secondaryNav.map(renderLink)}
        </div>
      </nav>

      <Separator />

      {/* Footer */}
      <div className="space-y-0.5 p-2">
        {/* Collapse toggle */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={toggle}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-accent hover:text-foreground',
                collapsed && 'justify-center px-2'
              )}
            >
              <ChevronLeft
                className={cn(
                  'h-[18px] w-[18px] shrink-0 transition-transform duration-300',
                  collapsed && 'rotate-180'
                )}
              />
              {!collapsed && <span>Collapse</span>}
            </button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="text-xs font-medium">
              Expand
            </TooltipContent>
          )}
        </Tooltip>

        {/* Logout */}
        <Tooltip delayDuration={0}>
          <TooltipTrigger asChild>
            <button
              onClick={handleLogout}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive',
                collapsed && 'justify-center px-2'
              )}
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>Log out</span>}
            </button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" className="text-xs font-medium">
              Log out
            </TooltipContent>
          )}
        </Tooltip>
      </div>
    </aside>
  );
};

export default AppSidebar;
