import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <HowItWorks />
      
      {/* Button at the bottom of How It Works */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8 -mt-8">
        <div className="text-center">
          <Link to="/how-it-works">
            <Button variant="hero" size="lg">
              Learn More About Our Process
            </Button>
          </Link>
        </div>
      </div>

      {/* Transparent Pricing Section with Pricing Button */}
      <section id="pricing" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Transparent <span className="bg-gradient-hero bg-clip-text text-transparent">Pricing</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Choose the plan that works best for you. All plans include a 7-day free trial with reminders before billing.
            </p>
            <Link to="/pricing">
              <Button variant="hero" size="lg">
                View Pricing Plans
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
