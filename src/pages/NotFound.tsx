import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import logo from "@/assets/PawDNALogo.png";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-muted/30 px-4">
        <div className="text-center space-y-6 max-w-md">
          <Link to="/" className="inline-flex items-center hover:opacity-80 transition-opacity">
            <img src={logo} alt="PawDNA Logo" className="h-16" />
          </Link>
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold">Oops! Page not found</h2>
            <p className="text-muted-foreground">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </div>
          <Button variant="hero" size="lg" onClick={() => window.location.href = "/"}>
            Return to Home
          </Button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;