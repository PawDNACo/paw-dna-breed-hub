import { PawPrint } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-muted/50 border-t border-border py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <PawPrint className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold bg-gradient-hero bg-clip-text text-transparent">
                PawDNA
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              The premier pet breeding marketplace connecting responsible breeders with loving pet owners.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Breeding Services</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Buy Puppies</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Buy Kittens</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">FAQ</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="/terms" className="hover:text-primary transition-colors">Terms of Service</a></li>
              <li><a href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</a></li>
              <li><a href="/breeder-agreement" className="hover:text-primary transition-colors">Breeder Agreement</a></li>
              <li><a href="/refund-policy" className="hover:text-primary transition-colors">Refund Policy</a></li>
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
