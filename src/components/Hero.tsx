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
              PawDNA —
              <span className="bg-gradient-hero bg-clip-text text-transparent"> Where Pets Swipe Right</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 leading-relaxed">
              Welcome to the future of pet matchmaking.
              Just like Tinder, Bumble, or Plenty of Fish, but for your furry companions.
              Breeders can create profiles for their dogs or cats, browse potential mates, and connect with other verified breeders.
              Buyers can explore litters of puppies and kittens, complete with photos, breed info, and care packages—ready to be loved.
              Whether you're breeding responsibly or looking to adopt your next best friend, PawDNA makes it easy, safe, and fun.
              Add-ons like vaccinations, cleaning, and accessories ensure every match is clean, healthy, and happy.
              Because love isn't just for humans—it's in their genes. 🐾
              {" "}<strong className="text-primary">Sign Up Is FREE - No payment required upfront.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button variant="hero" size="xl" onClick={() => window.location.href = "/breeder-subscription"}>
                Start Breeding
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="hero" size="xl" onClick={() => window.location.href = "/buyer-subscription"}>
                Become a Buyer
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="hero" size="xl" onClick={() => window.location.href = "/rehoming-subscription"}>
                Start Rehoming
                <ArrowRight className="ml-2 h-5 w-5" />
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
