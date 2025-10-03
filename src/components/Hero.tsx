import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-pets.jpg";
import { TrustBadgesCompact } from "@/components/TrustBadges";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Happy pets" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/80 to-background/60" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center md:text-left md:mx-0">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              The Premier
              <span className="bg-gradient-hero bg-clip-text text-transparent"> Pet Breeding </span>
              Marketplace
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              Connect with verified breeders, hire quality breeding partners, and find your perfect 
              puppy or kitten. PawDNA is the trusted platform where responsible breeding meets 
              exceptional pet ownership. <strong className="text-primary">Sign up free - no payment required upfront.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button variant="hero" size="xl" onClick={() => window.location.href = "/sign-up?role=breeder"}>
                Start Breeding
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="xl" onClick={() => window.location.href = "/browse"}>
                Browse Pets
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-8 text-sm justify-center md:justify-start">
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold text-primary">Free</div>
                <div className="text-muted-foreground">Sign Up - No Upfront Cost</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold text-primary">$150+</div>
                <div className="text-muted-foreground">Average Breeding Value</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold text-primary">85%</div>
                <div className="text-muted-foreground">Breeder Royalties</div>
              </div>
              <div className="text-center md:text-left">
                <div className="text-2xl font-bold text-primary">Verified</div>
                <div className="text-muted-foreground">Secure Platform</div>
              </div>
            </div>
            
            {/* Trust Badges */}
            <div className="mt-12 pt-8 border-t border-border/50">
              <TrustBadgesCompact />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
