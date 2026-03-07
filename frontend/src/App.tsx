import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import UploadResume from "./pages/UploadResume";
import ThemeSelection from "./pages/ThemeSelection";
import PortfolioEditor from "./pages/PortfolioEditor";
import Analytics from "./pages/Analytics";
import AccountSettings from "./pages/AccountSettings";
import NotFound from "./pages/NotFound";
import PortfolioPage from "./pages/PortfolioPage";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/portfolios" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/dashboard/upload" element={<ProtectedRoute><UploadResume /></ProtectedRoute>} />
          <Route path="/dashboard/themes" element={<ProtectedRoute><ThemeSelection /></ProtectedRoute>} />
          <Route path="/dashboard/editor" element={<ProtectedRoute><PortfolioEditor /></ProtectedRoute>} />
          <Route path="/dashboard/editor/:id" element={<ProtectedRoute><PortfolioEditor /></ProtectedRoute>} />
          <Route path="/dashboard/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
          <Route path="/dashboard/billing" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
          <Route path="/:slug" element={<PortfolioPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

