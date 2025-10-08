import { PawPrint } from "lucide-react";
import { TrustBadges } from "@/components/TrustBadges";

export const Footer = () => {
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
              className="flex items-center gap-2 mb-4 cursor-pointer" 
              onClick={() => window.location.href = "/"}
            >
              <PawPrint className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold bg-gradient-hero bg-clip-text text-transparent">
                PawDNA
              </span>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs">
              Like Tinder or Bumble, but for pets! The premier marketplace connecting verified breeders with loving pet owners.
            </p>
          </div>

          {/* Services */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/breeding-services" className="hover:text-primary transition-colors">Breeding Services</a></li>
              <li><a href="/rehoming-services" className="hover:text-primary transition-colors">Rehoming Services</a></li>
              <li><a href="/browse" className="hover:text-primary transition-colors">Buy Puppies</a></li>
              <li><a href="/browse" className="hover:text-primary transition-colors">Buy Kittens</a></li>
            </ul>
          </div>

          {/* Company */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/how-it-works" className="hover:text-primary transition-colors">How It Works</a></li>
              <li><a href="/about" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="/breeder-standards" className="hover:text-primary transition-colors">Breeder Standards</a></li>
              <li><a href="/contact" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="/faq" className="hover:text-primary transition-colors">FAQ</a></li>
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
