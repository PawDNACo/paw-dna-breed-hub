import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import bannerImage from "@/assets/banner.png";
import { TrustBadgesCompact } from "@/components/TrustBadges";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-fade-in">
            {/* Banner Image */}
            <div className="mb-8">
              <img 
                src={bannerImage} 
                alt="PawDNA - Where pets swipe right" 
                className="w-full max-w-3xl mx-auto rounded-lg"
              />
            </div>
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            <div className="mt-8 flex flex-wrap gap-8 text-sm justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">Free</div>
                <div className="text-muted-foreground">Sign Up - No Upfront Cost</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">$150+</div>
                <div className="text-muted-foreground">Average Breeding Value</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">85%</div>
                <div className="text-muted-foreground">Breeder Royalties</div>
              </div>
              <div className="text-center">
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
