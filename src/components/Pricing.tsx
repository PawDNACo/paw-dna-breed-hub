import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const sellerPlans = [
  {
    name: "Single Gender",
    price: "$4.99",
    period: "/month",
    description: "Perfect for breeders with males or females",
    features: [
      "List male or female pets",
      "Sell puppies & kittens",
      "15% royalty on sales",
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
      "15% royalty on sales",
      "All add-on packages",
      "Priority support",
      "$499.99 refundable deposit",
    ],
    popular: true,
  },
];

const hirerPlan = {
  name: "Breeding Services",
  price: "$9.99",
  period: "/month per gender",
  description: "Access premium breeding partners",
  features: [
    "$1,000 refundable deposit",
    "Small breeds from $1,500",
    "Medium breeds from $2,000",
    "Large breeds from $3,000",
    "Rare breeds from $4,500",
    "Vaccination & care packages",
  ],
};

const addOns = [
  { name: "Vaccination Package", price: "$299" },
  { name: "Care Package", price: "$149" },
  { name: "Cleaning Service", price: "$19.99" },
  { name: "Accessories Bundle", price: "$2.99" },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Transparent <span className="bg-gradient-hero bg-clip-text text-transparent">Pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that works best for your breeding business
          </p>
        </div>

        {/* Seller Plans */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">For Breeders & Sellers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
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
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-primary">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className="w-full" 
                    variant={plan.popular ? "hero" : "default"}
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Hirer Plan */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center mb-8">For Breeding Services</h3>
          <Card className="max-w-2xl mx-auto border-secondary shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{hirerPlan.name}</CardTitle>
              <CardDescription>{hirerPlan.description}</CardDescription>
              <div className="mt-4">
                <span className="text-4xl font-bold text-secondary">{hirerPlan.price}</span>
                <span className="text-muted-foreground">{hirerPlan.period}</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {hirerPlan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button className="w-full" variant="secondary">
                Hire Breeding Partner
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Add-ons */}
        <div>
          <h3 className="text-2xl font-bold text-center mb-8">Premium Add-Ons</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {addOns.map((addon, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <CardTitle className="text-lg">{addon.name}</CardTitle>
                  <div className="text-2xl font-bold text-accent mt-2">
                    {addon.price}
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
