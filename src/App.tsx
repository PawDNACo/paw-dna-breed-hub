import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Services from "./pages/Services";
import BreedingServices from "./pages/BreedingServices";
import BreederStandards from "./pages/BreederStandards";
import PricingPage from "./pages/PricingPage";
import BreederSubscriptionSignup from "./pages/BreederSubscriptionSignup";
import BuyerSignup from "./pages/BuyerSignup";
import Browse from "./pages/Browse";
import PetDetail from "./pages/PetDetail";
import BreederDashboard from "./pages/BreederDashboard";
import BuyerDashboard from "./pages/BuyerDashboard";
import Dashboard from "./pages/Dashboard";
import CarePackageManager from "./pages/CarePackageManager";
import AccessoriesManager from "./pages/AccessoriesManager";
import AdminDashboard from "./pages/AdminDashboard";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import RefundPolicy from "./pages/RefundPolicy";
import BreederAgreement from "./pages/BreederAgreement";
import BuyerAgreement from "./pages/BuyerAgreement";
import AboutUs from "./pages/AboutUs";
import FAQ from "./pages/FAQ";
import BreederPayouts from "./pages/BreederPayouts";
import VerificationComplete from "./pages/VerificationComplete";
import VerificationDashboard from "./pages/VerificationDashboard";
import ConversationsDashboard from "./pages/ConversationsDashboard";
import DeveloperDashboard from "./pages/DeveloperDashboard";
import SecuritySettings from "./pages/SecuritySettings";
import AuthCallback from "./pages/AuthCallback";
import CompleteProfile from "./pages/CompleteProfile";
import Contact from "./pages/Contact";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
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
          <Route path="/home" element={<Index />} />
          <Route path="/services" element={<Services />} />
          <Route path="/breeding-services" element={<BreedingServices />} />
          <Route path="/breeder-standards" element={<BreederStandards />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/breeder-subscription" element={<BreederSubscriptionSignup />} />
          <Route path="/buyer-signup" element={<BuyerSignup />} />
          <Route path="/sign-up" element={<AuthPage mode="signup" />} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route 
            path="/complete-profile" 
            element={
              <ProtectedRoute>
                <CompleteProfile />
              </ProtectedRoute>
            } 
          />
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
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
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
            path="/breeder-payouts" 
            element={
              <ProtectedRoute>
                <BreederPayouts />
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
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/refund-policy" element={<RefundPolicy />} />
          <Route path="/breeder-agreement" element={<BreederAgreement />} />
          <Route path="/buyer-agreement" element={<BuyerAgreement />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/verification-complete" 
            element={
              <ProtectedRoute>
                <VerificationComplete />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/verification" 
            element={
              <ProtectedRoute>
                <VerificationDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/conversations" 
            element={
              <ProtectedRoute>
                <ConversationsDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/developer" 
            element={
              <ProtectedRoute>
                <DeveloperDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/security-settings" 
            element={
              <ProtectedRoute>
                <SecuritySettings />
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
