import { Button } from "@/components/ui/button";
import { Menu, LogOut, X } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { useUserRole } from "@/hooks/useUserRole";
import logo from "@/assets/PawDNALogo.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export const Navigation = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const { isAdmin, isBreeder, isBuyer, hasAnyRole } = useUserRole();

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
    setMobileMenuOpen(false);
    toast.success("Signed out successfully");
    navigate("/");
  };

  const handleNavigation = (path: string) => {
    setMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer" 
            onClick={() => navigate("/")}
          >
            <img src={logo} alt="PawDNA Logo" className="h-24" />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Button variant="ghost" size="sm" onClick={() => navigate("/pricing")}>
              Pricing
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/how-it-works")}>
              How It Works
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/browse")}>
              Browse
            </Button>
            {hasAnyRole(["breeder", "buyer"]) && (
              <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
            )}
            {isAdmin && (
              <>
                <Button variant="ghost" size="sm" onClick={() => navigate("/admin")}>
                  Admin
                </Button>
                <Button variant="ghost" size="sm" onClick={() => navigate("/developer")}>
                  Developer
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
                <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>Sign In</Button>
                <Button variant="hero" size="sm" onClick={() => navigate("/sign-up")}>Get Started</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="flex items-center justify-center">
                  <img src={logo} alt="PawDNA Logo" className="h-16" />
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/pricing")}>
                  Pricing
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/how-it-works")}>
                  How It Works
                </Button>
                <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/browse")}>
                  Browse
                </Button>
                {hasAnyRole(["breeder", "buyer"]) && (
                  <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/dashboard")}>
                    Dashboard
                  </Button>
                )}
                {user && (
                  <>
                    <div className="my-2 border-t border-border" />
                    <div className="font-semibold text-sm text-muted-foreground px-4 mb-2">Profile</div>
                    <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/breeder-dashboard")}>
                      Breeder Dashboard
                    </Button>
                    <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/breeder-payouts")}>
                      Breeder Payouts
                    </Button>
                    <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/buyer-dashboard")}>
                      Buyer Dashboard
                    </Button>
                    <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/care-packages")}>
                      Care Packages
                    </Button>
                    <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/accessories")}>
                      Accessories
                    </Button>
                    <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/security-settings")}>
                      Security
                    </Button>
                    {isAdmin && (
                      <>
                        <div className="my-2 border-t border-border" />
                        <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/admin")}>
                          Admin
                        </Button>
                        <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/developer")}>
                          Developer
                        </Button>
                      </>
                    )}
                    <div className="my-2 border-t border-border" />
                  </>
                )}
                {user ? (
                  <Button variant="ghost" className="justify-start" onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start" onClick={() => handleNavigation("/login")}>
                      Sign In
                    </Button>
                    <Button variant="hero" onClick={() => handleNavigation("/sign-up")}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};
