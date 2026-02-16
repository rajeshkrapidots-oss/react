import { Outlet } from 'react-router-dom';
import { SidebarStateProvider, useSidebarState } from '../context/SidebarContext';
import AppSidebar from './AppSidebar';
import TopNavbar from './TopNavbar';
import { cn } from '../lib/utils';

const AdminLayoutInner = () => {
  const { mobileOpen, setMobileOpen } = useSidebarState();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar — desktop: static, mobile: overlay */}
      <div
        className={cn(
          'shrink-0 hidden lg:block h-screen',
        )}
      >
        <AppSidebar />
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 z-50 h-screen transition-transform duration-300 ease-in-out lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <AppSidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col min-w-0 h-screen">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

const AdminLayout = () => (
  <SidebarStateProvider>
    <AdminLayoutInner />
  </SidebarStateProvider>
);

export default AdminLayout;
