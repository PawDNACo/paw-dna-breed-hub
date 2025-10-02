import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import heroImage from "@/assets/hero-pets.jpg";

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
        <div className="max-w-3xl">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              The Premier
              <span className="bg-gradient-hero bg-clip-text text-transparent"> Pet Breeding </span>
              Marketplace
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              Connect with verified breeders, hire quality breeding partners, and find your perfect 
              puppy or kitten. PawDNA is the trusted platform where responsible breeding meets 
              exceptional pet ownership.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="xl">
                Start Breeding
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="xl">
                Browse Pets
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap gap-8 text-sm">
              <div>
                <div className="text-2xl font-bold text-primary">$1,500+</div>
                <div className="text-muted-foreground">Average Breeding Value</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">15%</div>
                <div className="text-muted-foreground">Breeder Royalties</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">Verified</div>
                <div className="text-muted-foreground">Secure Platform</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
