import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Check, Heart, Shield, DollarSign, Users, Camera, TrendingUp } from "lucide-react";

const BreedingServices = () => {
  const navigate = useNavigate();

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
      title: "Single Breed Breeder",
      price: "$20/month",
      features: [
        "List up to 15 puppies/kittens",
        "One breed category",
        "Professional listings",
        "Secure payments",
        "Direct messaging",
        "Earn 85% on sales"
      ],
      popular: false
    },
    {
      title: "Multiple Breed Breeder",
      price: "$40/month",
      features: [
        "Unlimited listings",
        "Multiple breed categories",
        "Priority placement",
        "Advanced analytics",
        "Featured breeder badge",
        "Earn 85% on sales"
      ],
      popular: true
    },
    {
      title: "Special Breeds",
      price: "$65/month",
      features: [
        "List specialized breeds",
        "Premium positioning",
        "Custom breed categories",
        "Dedicated support",
        "Marketing assistance",
        "Earn 85% on sales"
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
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="hero" 
                size="lg"
                onClick={() => navigate("/breeder-subscription")}
              >
                Get Started Today
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => navigate("/sign-up?role=breeder")}
              >
                Create Free Account
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
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Choose Your <span className="bg-gradient-hero bg-clip-text text-transparent">Plan</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Flexible pricing options to match your breeding business needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
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
                  <CardTitle className="text-2xl">{pkg.title}</CardTitle>
                  <CardDescription className="text-3xl font-bold text-foreground mt-2">
                    {pkg.price}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
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
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="bg-white text-primary hover:bg-white/90"
                  onClick={() => navigate("/breeder-subscription")}
                >
                  View Plans & Pricing
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                  onClick={() => navigate("/contact")}
                >
                  Contact Us
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
