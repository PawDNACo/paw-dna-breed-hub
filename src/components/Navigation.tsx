import { Button } from "@/components/ui/button";
import { Menu, PawPrint, LogOut } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";

export const Navigation = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <PawPrint className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              PawDNA
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
              Services
            </a>
            <a href="/#pricing" className="text-sm font-medium hover:text-primary transition-colors">
              Pricing
            </a>
            <a href="/#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
              How It Works
            </a>
            <Button variant="ghost" size="sm" onClick={() => navigate("/browse")}>
              Browse Pets
            </Button>
            {user && (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/breeder-dashboard")}>
                  Breeder
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/buyer-dashboard")}>
                  Buyer
                </Button>
              </>
            )}
            {user ? (
              <Button variant="ghost" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/auth")}>Sign In</Button>
                <Button variant="hero" size="sm" onClick={() => navigate("/auth")}>Get Started</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-4">
              <a href="/#features" className="text-sm font-medium hover:text-primary transition-colors">
                Services
              </a>
              <a href="/#pricing" className="text-sm font-medium hover:text-primary transition-colors">
                Pricing
              </a>
              <a href="/#how-it-works" className="text-sm font-medium hover:text-primary transition-colors">
                How It Works
              </a>
              <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate("/browse")}>
                Browse Pets
              </Button>
              {user && (
                <>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate("/breeder-dashboard")}>
                    Breeder Dashboard
                  </Button>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate("/buyer-dashboard")}>
                    Buyer Dashboard
                  </Button>
                </>
              )}
              {user ? (
                <Button variant="ghost" size="sm" className="w-full" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" className="w-full" onClick={() => navigate("/auth")}>Sign In</Button>
                  <Button variant="hero" size="sm" className="w-full" onClick={() => navigate("/auth")}>Get Started</Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
