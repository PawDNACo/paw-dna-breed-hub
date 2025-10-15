import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserRole } from "@/hooks/useUserRole";

const breederPlans = [
  {
    name: "Single Gender",
    price: "$4.99",
    period: "/month",
    description: "Perfect for breeders with males or females",
    features: [
      "List male or female pets",
      "Sell puppies & kittens",
      "Earn up to 85% on all sales",
      "Vaccination add-ons",
      "Care packages",
      "$499.99 refundable deposit",
    ],
    popular: false,
  },
  {
    name: "Both Genders",
    price: "$9.99",
    period: "/month",
    description: "For serious breeders managing both",
    features: [
      "List males & females",
      "Sell puppies & kittens",
      "Earn up to 85% on all sales",
      "All add-on packages",
      "Priority support",
      "$499.99 refundable deposit",
    ],
    popular: true,
  },
  {
    name: "Multi-Breed Single",
    price: "$12.99",
    period: "/month",
    description: "Multiple breeds, one gender",
    features: [
      "List multiple breeds",
      "Single gender listings",
      "Sell puppies & kittens",
      "Earn up to 85% on all sales",
      "All add-on packages",
      "Priority support",
      "$499.99 refundable deposit",
    ],
    popular: false,
  },
  {
    name: "Multi-Breed Both",
    price: "$14.99",
    period: "/month",
    description: "Full access for multiple breeds",
    features: [
      "List multiple breeds",
      "Both genders",
      "Sell puppies & kittens",
      "Earn up to 85% on all sales",
      "All add-on packages",
      "Premium support",
      "$499.99 refundable deposit",
    ],
    popular: false,
  },
];

const buyerPlans = [
  {
    name: "Buy Only",
    price: "$5.99",
    period: "/month",
    description: "For buyers who just want puppies or kittens",
    features: [
      "Create requests to breeders",
      "Direct messaging with breeders",
      "Saved favorites",
      "Purchase protection",
      "Access to breeder verification status",
      "Refundable Deposit (Goes towards the final payment)",
      "Average cost: $50+",
      "Specialty breeds: $1,500+",
      "Up to 250 miles delivery/pickup included",
      "Beyond 250 miles: $299.99 refundable deposit",
      "Vaccination & care packages",
    ],
    buttonText: "Buy Puppies"
  },
  {
    name: "Find Breeding Partner",
    price: "$9.99",
    period: "/month",
    description: "Access premium breeding partners",
    features: [
      "Refundable Deposit (Goes towards the final payment)",
      "Average cost: $150+",
      "Specialty breeds: $1,500+",
      "Up to 250 miles delivery/pickup included",
      "Beyond 250 miles: $299.99 refundable deposit",
      "Vaccination & care packages",
    ],
    buttonText: "Find Breeding Partner"
  },
];

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

const bothPlans = [
  {
    name: "Single",
    price: "$14.99",
    period: "/month",
    description: "Combined breeder, buyer & rehomer access",
    features: [
      "All Single Gender breeder features",
      "Full buyer & rehomer access",
      "List male or female pets",
      "Access breeding partners",
      "Rehome pets",
      "Earn up to 85% on all sales",
      "All add-on packages",
      "$499.99 refundable deposit",
    ],
    popular: false,
  },
  {
    name: "Multi",
    price: "$19.99",
    period: "/month",
    description: "Complete access for breeders, buyers & rehomers",
    features: [
      "All Multi-Breed Both features",
      "Full buyer & rehomer access",
      "List multiple breeds",
      "Both genders",
      "Access breeding partners",
      "Rehome pets",
      "Earn up to 85% on all sales",
      "Premium support",
      "$499.99 refundable deposit",
    ],
    popular: true,
  },
];

const PricingPage = () => {
  const [selectedTab, setSelectedTab] = useState("breeder");
  const { isQA, isDeveloper } = useUserRole();
  
  // For QA and Developer roles, display $0.00
  const getDisplayPrice = (originalPrice: string) => {
    return (isQA || isDeveloper) ? "$0.00" : originalPrice;
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              Choose Your <span className="bg-gradient-hero bg-clip-text text-transparent">Plan</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
              Select the role that best fits your needs
            </p>
            <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
              <strong>Subscriptions:</strong> Pay via card, bank, Cash App, Venmo, Zelle, or other popular methods. 
              <strong className="ml-2">Deposits:</strong> Must be paid via checking account and settled before transactions.
            </p>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="max-w-7xl mx-auto">
            <TabsList className="grid w-full max-w-2xl mx-auto grid-cols-4 mb-12">
              <TabsTrigger value="breeder">Breeder</TabsTrigger>
              <TabsTrigger value="buyer">Buyer</TabsTrigger>
              <TabsTrigger value="rehoming">Rehoming</TabsTrigger>
              <TabsTrigger value="both">Multi-Plan</TabsTrigger>
            </TabsList>

            <TabsContent value="breeder" className="mt-0">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-center mb-4">For Breeders & Sellers</h2>
                <p className="text-sm text-muted-foreground max-w-3xl mx-auto text-center">
                  Additional animals: $4.99/mo per animal (after first 2)
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {breederPlans.map((plan, index) => (
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
                      <div className="text-xs text-muted-foreground mt-2 space-y-1">
                        <p className="font-semibold text-primary">✓ 7-day free trial</p>
                        <p>3 reminders before billing</p>
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-primary">{getDisplayPrice(plan.price)}</span>
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
                        onClick={() => window.location.href = "/breeder-subscription"}
                      >
                        Subscribe Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="buyer" className="mt-0">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-center">For Buyers</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {buyerPlans.map((plan, index) => (
                  <Card key={index} className="border-secondary shadow-lg">
                    <CardHeader>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <CardDescription>{plan.description}</CardDescription>
                      <div className="text-sm text-muted-foreground mt-2 space-y-1">
                        <p className="font-semibold text-secondary">✓ 7-day free trial</p>
                        <p className="text-xs">3 reminders before billing</p>
                      </div>
                      <div className="mt-4">
                        <span className="text-4xl font-bold text-secondary">{getDisplayPrice(plan.price)}</span>
                        <span className="text-muted-foreground">{plan.period}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3 mb-6">
                        {plan.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full" variant="secondary" onClick={() => window.location.href = "/buyer-subscription"}>
                        {plan.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="rehoming" className="mt-0">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-center mb-4">For Rehomers</h2>
                <p className="text-sm text-muted-foreground max-w-3xl mx-auto text-center">
                  Affordable rehoming plans to find loving homes for pets
                </p>
              </div>
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
                      <div className="text-xs text-muted-foreground mt-2 space-y-1">
                        <p className="font-semibold text-primary">✓ 7-day free trial</p>
                        <p>3 reminders before billing</p>
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-primary">{getDisplayPrice(plan.price)}</span>
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
                        onClick={() => window.location.href = "/breeder-subscription"}
                      >
                        Subscribe Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="both" className="mt-0">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-center mb-4">For Buyers, Breeders, and Rehomers</h2>
                <p className="text-sm text-muted-foreground max-w-3xl mx-auto text-center">
                  Get complete access across all platform features
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {bothPlans.map((plan, index) => (
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
                      <div className="text-xs text-muted-foreground mt-2 space-y-1">
                        <p className="font-semibold text-primary">✓ 7-day free trial</p>
                        <p>3 reminders before billing</p>
                      </div>
                      <div className="mt-4">
                        <span className="text-3xl font-bold text-primary">{getDisplayPrice(plan.price)}</span>
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
                        onClick={() => window.location.href = "/breeder-subscription"}
                      >
                        Subscribe Now
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>

          {/* Premium Add-Ons */}
          <div className="mt-20">
            <h2 className="text-3xl font-bold text-center mb-4">Premium Add-Ons</h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Enhance your listings and services with our premium add-on packages
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <Card className="text-center border-accent/50 hover:shadow-glow transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Vaccination Package</CardTitle>
                  <div className="text-3xl font-bold text-accent mt-2">
                    $299
                  </div>
                </CardHeader>
              </Card>
              <Card className="text-center border-accent/50 hover:shadow-glow transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Care Package</CardTitle>
                  <div className="text-3xl font-bold text-accent mt-2">
                    Starting at $149
                  </div>
                  <CardDescription className="mt-2">
                    Additional items
                  </CardDescription>
                </CardHeader>
              </Card>
              <Card className="text-center border-accent/50 hover:shadow-glow transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Cleaning Service</CardTitle>
                  <div className="text-3xl font-bold text-accent mt-2">
                    $19.99
                  </div>
                </CardHeader>
              </Card>
              <Card className="text-center border-accent/50 hover:shadow-glow transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">Accessories Bundle</CardTitle>
                  <div className="text-3xl font-bold text-accent mt-2">
                    $2.99 each
                  </div>
                  <CardDescription className="mt-2">
                    Select multiple items
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PricingPage;
