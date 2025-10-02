import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Browse from "./pages/Browse";
import PetDetail from "./pages/PetDetail";
import BreederDashboard from "./pages/BreederDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import CarePackageManager from "./pages/CarePackageManager";
import AccessoriesManager from "./pages/AccessoriesManager";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthPage } from "./components/auth/AuthPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/browse" element={<Browse />} />
          <Route 
            path="/pet/:id" 
            element={
              <ProtectedRoute>
                <PetDetail />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/breeder-dashboard" 
            element={
              <ProtectedRoute>
                <BreederDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/buyer-dashboard" 
            element={
              <ProtectedRoute>
                <BuyerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/care-packages" 
            element={
              <ProtectedRoute>
                <CarePackageManager />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/accessories" 
            element={
              <ProtectedRoute>
                <AccessoriesManager />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
