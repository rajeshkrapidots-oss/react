import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "../src/components/context/ThemeContext";
import { AuthProvider } from "../src/components/context/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import AdminLayout from "../src/components//layouts/AdminLayout";
import Dashboard from "../src/components/pages/Dashboard";
import AnalyticsPage from "../src/components/pages/Analytics";
import UsersPage from "../src/components/pages/Users";
import SettingsPage from "../src/components/pages/Settings";
import ActivityBlocksPage from "../src/components/pages/ActivityBlocks"; 
import DevicesPage from "../src/components/pages/Devices";
import ScreenshotsPage from "../src/components/pages/Screenshots";
import LoginPage from "../src/components/pages/Login";
import NotFound from "../src/components/pages/NotFound";
import UserWorkDiary from "../src/components/pages/UserWorkDiary";


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
    },
  },
});

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<AdminLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/users" element={<UsersPage />} />
                  <Route path="/activity-blocks" element={<ActivityBlocksPage />} />
                  <Route path="/devices" element={<DevicesPage />} />
                  <Route path="/screenshots" element={<ScreenshotsPage />} />
                  <Route path="/analytics" element={<AnalyticsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/users/:id/work-diary" element={<UserWorkDiary />} />

                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </AuthProvider>
    </ThemeProvider>
  </ErrorBoundary>
);

export default App;
