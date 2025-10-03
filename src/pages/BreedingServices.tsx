import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Check, Heart, Shield, DollarSign, Users, Camera, TrendingUp } from "lucide-react";

const BreedingServices = () => {
  const navigate = useNavigate();

  const scrollToPricing = () => {
    const pricingSection = document.getElementById('pricing-section');
    if (pricingSection) {
      pricingSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const features = [
    {
      icon: Camera,
      title: "Professional Listings",
      description: "Create stunning pet profiles with photos and detailed information"
    },
    {
      icon: Shield,
      title: "Verified & Secure",
      description: "Identity verification and secure payment processing for peace of mind"
    },
    {
      icon: DollarSign,
      title: "Competitive Earnings",
      description: "Earn up to 85% on all sales with transparent pricing"
    },
    {
      icon: Users,
      title: "Direct Communication",
      description: "Built-in messaging system to connect with potential buyers"
    },
    {
      icon: Heart,
      title: "Health Guarantees",
      description: "Showcase health records and vaccination status to build trust"
    },
    {
      icon: TrendingUp,
      title: "Business Growth",
      description: "Analytics and tools to help grow your breeding business"
    }
  ];

  const packages = [
    {
      title: "Single Gender",
      price: "$4.99/month",
      description: "Perfect for breeders with males or females",
      features: [
        "List male or female pets",
        "Sell puppies & kittens",
        "Earn up to 85% on all sales",
        "Vaccination add-ons",
        "Care packages",
        "$499.99 refundable deposit"
      ],
      popular: false
    },
    {
      title: "Both Genders",
      price: "$9.99/month",
      description: "For serious breeders managing both",
      features: [
        "List males & females",
        "Sell puppies & kittens",
        "Earn up to 85% on all sales",
        "All add-on packages",
        "Priority support",
        "$499.99 refundable deposit"
      ],
      popular: true
    },
    {
      title: "Multi-Breed Single",
      price: "$12.99/month",
      description: "Multiple breeds, one gender",
      features: [
        "List multiple breeds",
        "Single gender listings",
        "Sell puppies & kittens",
        "Earn up to 85% on all sales",
        "All add-on packages",
        "Priority support",
        "$499.99 refundable deposit"
      ],
      popular: false
    },
    {
      title: "Multi-Breed Both",
      price: "$14.99/month",
      description: "Full access for multiple breeds",
      features: [
        "List multiple breeds",
        "Both genders",
        "Sell puppies & kittens",
        "Earn up to 85% on all sales",
        "All add-on packages",
        "Premium support",
        "$499.99 refundable deposit"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Professional <span className="bg-gradient-hero bg-clip-text text-transparent">Breeding Services</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join PawDNA's trusted network of professional breeders. List your puppies and kittens, 
              connect with loving families, and grow your breeding business.
            </p>
            <div className="flex justify-center">
              <Button 
                variant="hero" 
                size="lg"
                onClick={scrollToPricing}
              >
                Get Started Today
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to <span className="bg-gradient-hero bg-clip-text text-transparent">Succeed</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful tools and features designed specifically for professional breeders
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing-section" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Choose Your <span className="bg-gradient-hero bg-clip-text text-transparent">Plan</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-2">
              Flexible pricing options to match your breeding business needs
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              Additional animals: $4.99/mo per animal (after first 2)
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {packages.map((pkg, index) => (
              <Card 
                key={index} 
                className={`border-border/50 relative ${pkg.popular ? 'border-primary shadow-lg scale-105' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{pkg.title}</CardTitle>
                  <CardDescription className="text-xs">{pkg.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-3xl font-bold text-primary">{pkg.price}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-xs">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    onClick={() => navigate("/breeder-subscription")}
                    variant={pkg.popular ? "hero" : "default"}
                  >
                    Subscribe Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-hero text-white border-0 max-w-4xl mx-auto">
            <CardContent className="py-12 px-8 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                Ready to Start Breeding with PawDNA?
              </h2>
              <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                Join hundreds of professional breeders who trust PawDNA to connect them 
                with loving families for their puppies and kittens.
              </p>
              <div className="flex justify-center">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={scrollToPricing}
                >
                  Subscribe Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BreedingServices;
