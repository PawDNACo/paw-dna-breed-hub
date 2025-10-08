import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Home, Shield, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const rehomingPlans = [
  {
    name: "Single Gender",
    price: "$2.99",
    period: "/month",
    description: "Perfect for rehomers with males or females",
    features: [
      "List male or female pets",
      "Rehome puppies & kittens",
      "Direct buyer connections",
      "Profile verification",
      "Support center access",
      "No deposit required",
    ],
    popular: false,
  },
  {
    name: "Both Genders",
    price: "$5.99",
    period: "/month",
    description: "For rehomers managing both genders",
    features: [
      "List males & females",
      "Rehome puppies & kittens",
      "Direct buyer connections",
      "Profile verification",
      "Priority support",
      "No deposit required",
    ],
    popular: true,
  },
  {
    name: "Multi-Breed Single",
    price: "$8.99",
    period: "/month",
    description: "Multiple breeds, one gender",
    features: [
      "List multiple breeds",
      "Single gender listings",
      "Rehome puppies & kittens",
      "Direct buyer connections",
      "Profile verification",
      "Priority support",
      "No deposit required",
    ],
    popular: false,
  },
  {
    name: "Multi-Breed Both",
    price: "$11.99",
    period: "/month",
    description: "Full rehoming access",
    features: [
      "List multiple breeds",
      "Both genders",
      "Rehome puppies & kittens",
      "Direct buyer connections",
      "Profile verification",
      "Premium support",
      "No deposit required",
    ],
    popular: false,
  },
];

const RehomingServices = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Rehoming <span className="bg-gradient-hero bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Find loving homes for pets in need of rehoming. Our platform connects responsible rehomers with caring buyers, breeders, and families.
            </p>
          </div>

          {/* Key Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="border-primary/20">
              <CardHeader>
                <Heart className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Compassionate Rehoming</CardTitle>
                <CardDescription>
                  Help pets find new loving homes with verified buyers and families
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Safe & Secure</CardTitle>
                <CardDescription>
                  All users are verified to ensure the safety and wellbeing of pets
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <Home className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Direct Connections</CardTitle>
                <CardDescription>
                  Connect directly with potential adopters without middlemen
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          {/* How It Works */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-12">
              How Rehoming <span className="bg-gradient-hero bg-clip-text text-transparent">Works</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <Card>
                <CardHeader>
                  <div className="text-4xl font-bold text-primary mb-2">1</div>
                  <CardTitle className="text-lg">Choose Your Plan</CardTitle>
                  <CardDescription>
                    Select a rehoming plan that fits your needs
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="text-4xl font-bold text-primary mb-2">2</div>
                  <CardTitle className="text-lg">Create Listings</CardTitle>
                  <CardDescription>
                    List pets that need rehoming with photos and details
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="text-4xl font-bold text-primary mb-2">3</div>
                  <CardTitle className="text-lg">Connect with Buyers</CardTitle>
                  <CardDescription>
                    Receive inquiries from verified interested parties
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card>
                <CardHeader>
                  <div className="text-4xl font-bold text-primary mb-2">4</div>
                  <CardTitle className="text-lg">Complete Rehoming</CardTitle>
                  <CardDescription>
                    Finalize the rehoming process with confidence
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-4">
              Rehoming <span className="bg-gradient-hero bg-clip-text text-transparent">Pricing</span>
            </h2>
            <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              Affordable plans to help you rehome pets responsibly
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {rehomingPlans.map((plan, index) => (
                <Card 
                  key={index} 
                  className={`relative ${
                    plan.popular 
                      ? 'border-primary shadow-glow' 
                      : 'border-border/50'
                  }`}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-hero">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription className="text-xs">{plan.description}</CardDescription>
                    <div className="mt-4">
                      <span className="text-3xl font-bold text-primary">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span className="text-xs">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full" 
                      variant={plan.popular ? "hero" : "default"}
                      onClick={() => window.location.href = "/pricing"}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Why Choose Us */}
          <div className="bg-muted/50 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-center mb-8">
              Why Choose <span className="bg-gradient-hero bg-clip-text text-transparent">PawDNA</span> for Rehoming
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="flex items-start gap-4">
                <Check className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Verified Users</h3>
                  <p className="text-sm text-muted-foreground">
                    All buyers, breeders, and rehomers go through our verification process
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Check className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Direct Messaging</h3>
                  <p className="text-sm text-muted-foreground">
                    Communicate directly with interested parties through our secure platform
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Check className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">No Hidden Fees</h3>
                  <p className="text-sm text-muted-foreground">
                    Transparent pricing with no deposits required for rehomers
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Check className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold mb-2">Support Team</h3>
                  <p className="text-sm text-muted-foreground">
                    Our dedicated support team is here to help throughout the process
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default RehomingServices;
