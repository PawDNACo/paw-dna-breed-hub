import { TrustBadges } from "@/components/TrustBadges";
import logo from "@/assets/PawDNALogo.png";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Footer = () => {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSubscription = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session?.user) {
        setIsAuthenticated(false);
        return;
      }

      setIsAuthenticated(true);

      const { data: subscription } = await supabase
        .from("subscriptions")
        .select("status")
        .eq("user_id", session.user.id)
        .eq("status", "active")
        .single();

      setIsSubscribed(!!subscription);
    };

    checkSubscription();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkSubscription();
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <footer className="bg-muted/50 border-t border-border py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Trust Badges Section */}
        <div className="mb-12 pb-8 border-b border-border">
          <h3 className="text-center text-lg font-semibold mb-6">Trusted & Secure Platform</h3>
          <TrustBadges variant="horizontal" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8 text-center md:text-left">
          {/* Brand */}
          <div className="flex flex-col items-center md:items-start">
            <div 
              className="flex items-center mb-4 cursor-pointer" 
              onClick={() => window.location.href = "/"}
            >
              <img src={logo} alt="PawDNA Logo" className="h-16" />
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Like Tinder or Bumble, but for pets! The premier marketplace connecting verified breeders with loving pet owners.
            </p>
          </div>

          {/* Services */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/marketplace" className="hover:text-primary transition-colors">Marketplace</a></li>
              <li><a href="/breeding-services" className="hover:text-primary transition-colors">Breeding Services</a></li>
              <li><a href="/rehoming-services" className="hover:text-primary transition-colors">Rehoming Services</a></li>
              <li><a href="/lost-and-found" className="hover:text-primary transition-colors">Lost & Found</a></li>
              <li><a href="/browse" className="hover:text-primary transition-colors">Browse Pets</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/breeder-standards" className="hover:text-primary transition-colors">Breeder Standards</a></li>
              <li><a href="/careers" className="hover:text-primary transition-colors">Careers</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="/faq" className="hover:text-primary transition-colors">FAQ</a></li>
              {!isSubscribed && (
                <li><a href="/waitlist" className="hover:text-primary transition-colors">Join Waitlist</a></li>
              )}
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/breeder-agreement" className="hover:text-primary transition-colors">Breeder Agreement</a></li>
              <li><a href="/buyer-agreement" className="hover:text-primary transition-colors">Buyer Agreement</a></li>
              <li><a href="/refund-policy" className="hover:text-primary transition-colors">Refund Policy</a></li>
            </ul>
          </div>

          {/* Developers */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-4">Developers</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/qa-demo" className="hover:text-primary transition-colors">QA/Demo</a></li>
              <li><a href="/admin" className="hover:text-primary transition-colors">Admin</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 PawDNA. All rights reserved. Connecting responsible breeders since 2025.</p>
        </div>
      </div>
    </footer>
  );
};
