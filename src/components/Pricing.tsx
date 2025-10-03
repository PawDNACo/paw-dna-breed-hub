import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TrustBadges } from "@/components/TrustBadges";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const sellerPlans = [
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
    name: "Find Breeding Partner",
    price: "$9.99",
    period: "/month",
    description: "Access premium breeding partners",
    features: [
      "$1,000 refundable deposit (goes towards breed cost)",
      "Average cost: $150+",
      "Specialty breeds: $1,500+",
      "Up to 250 miles delivery/pickup included",
      "Beyond 250 miles: $299.99 refundable deposit",
      "Vaccination & care packages",
    ],
    role: "buyer"
  },
  {
    name: "Buy Only",
    price: "$5.99",
    period: "/month",
    description: "For buyers who just want puppies or kittens",
    features: [
      "Browse buyer requests",
      "Direct messaging with breeders",
      "Saved favorites",
      "Purchase protection",
      "Access to breeder verification status",
    ],
    role: "buy_pup_kit"
  },
];

const bothPlans = [
  {
    name: "Single",
    price: "$12.99",
    period: "/month",
    description: "Combined breeder & buyer access",
    features: [
      "All Single Gender breeder features",
      "Full buyer access",
      "List male or female pets",
      "Access breeding partners",
      "Earn up to 85% on all sales",
      "$499.99 refundable deposit",
    ],
    popular: false,
  },
  {
    name: "Multi",
    price: "$19.99",
    period: "/month",
    description: "Complete access for serious breeders & buyers",
    features: [
      "All Multi-Breed Both features",
      "Full buyer access",
      "List multiple breeds",
      "Both genders",
      "Access breeding partners",
      "Earn up to 85% on all sales",
      "Premium support",
      "$499.99 refundable deposit",
    ],
    popular: true,
  },
];

const addOns = [
  { name: "Vaccination Package", price: "$299" },
  { name: "Care Package", price: "Starting at $149", description: "Additional items" },
  { name: "Cleaning Service", price: "$19.99" },
  { name: "Accessories Bundle", price: "$2.99 each", description: "Select multiple items" },
];

export const Pricing = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [userRoles, setUserRoles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUserAndRoles();
  }, []);

  const checkUserAndRoles = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);

    if (user) {
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);
      
      setUserRoles(roles?.map(r => r.role) || []);
    }
    setLoading(false);
  };

  const handleSubscribeClick = (planType: string) => {
    if (planType === "buyer" || planType === "buy_pup_kit") {
      navigate('/buyer-subscription');
    } else {
      navigate(`/breeder-subscription?plan=${planType}`);
    }
  };

  const isCurrentSubscription = (planType: string): boolean => {
    if (planType === "breeder-single") return userRoles.includes("breeder") && !userRoles.includes("buyer");
    if (planType === "breeder-both") return userRoles.includes("breeder") && !userRoles.includes("buyer");
    if (planType === "breeder-multi-single") return userRoles.includes("breeder") && !userRoles.includes("buyer");
    if (planType === "breeder-multi-both") return userRoles.includes("breeder") && !userRoles.includes("buyer");
    if (planType === "buyer") return userRoles.includes("buyer") && !userRoles.includes("breeder");
    if (planType === "buy_pup_kit") return userRoles.includes("buy_pup_kit");
    if (planType === "both-single") return userRoles.includes("both");
    if (planType === "both-multi") return userRoles.includes("both");
    return false;
  };

  const getButtonText = (planType: string): string => {
    if (!user) return "Subscribe Now";
    if (isCurrentSubscription(planType)) return "Current Plan";
    return "Change Subscription";
  };

  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Transparent <span className="bg-gradient-hero bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Choose the plan that works best for your breeding business
          </p>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto">
            <strong>Subscriptions:</strong> Pay via card, bank, Cash App, Venmo, Zelle, or other popular methods. 
            <strong className="ml-2">Deposits:</strong> Must be paid via checking account and settled before transactions.
          </p>
        </div>

        {/* Seller Plans */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-4">For Breeders & Sellers</h3>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto text-center mb-8">
            Additional animals: $4.99/mo per animal (after first 2)
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {sellerPlans.map((plan, index) => (
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
                    onClick={() => handleSubscribeClick(`breeder-${plan.name.toLowerCase().replace(/\s+/g, '-')}`)}
                    disabled={isCurrentSubscription(`breeder-${plan.name.toLowerCase().replace(/\s+/g, '-')}`)}
                  >
                    {getButtonText(`breeder-${plan.name.toLowerCase().replace(/\s+/g, '-')}`)}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Buyer Plans */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">For Buyers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {buyerPlans.map((plan, index) => (
              <Card key={index} className="border-secondary shadow-lg">
                <CardHeader>
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-secondary">{plan.price}</span>
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
                  <Button 
                    className="w-full" 
                    variant="secondary" 
                    onClick={() => handleSubscribeClick(plan.role)}
                    disabled={isCurrentSubscription(plan.role)}
                  >
                    {getButtonText(plan.role)}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Both Plans */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-4">For Breeders & Buyers (Both)</h3>
          <p className="text-sm text-muted-foreground max-w-3xl mx-auto text-center mb-8">
            Get the best of both worlds with combined access
          </p>
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
                    onClick={() => handleSubscribeClick(`both-${plan.name.toLowerCase()}`)}
                    disabled={isCurrentSubscription(`both-${plan.name.toLowerCase()}`)}
                  >
                    {getButtonText(`both-${plan.name.toLowerCase()}`)}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Add-ons */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">Premium Add-Ons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {addOns.map((addon, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">{addon.name}</CardTitle>
                  <div className="text-2xl font-bold text-accent mt-2">
                    {addon.price}
                  </div>
                  {addon.description && (
                    <CardDescription className="mt-2">
                      {addon.description}
                    </CardDescription>
                  )}
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-16 pt-12 border-t border-border">
          <TrustBadges variant="grid" showAll />
        </div>
      </div>
    </section>
  );
};
