import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserRole } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";

const breederPlans = [
  {
    name: "Breeder Basic - Single Gender",
    price: "$4.99/month",
    description: "Perfect for breeders with 1-2 animals of the same gender",
    features: [
      "List up to 2 animals (same gender)",
      "7-day free trial",
      "Basic marketplace visibility",
      "Message buyers",
      "85% earnings on sales $751+",
      "60% earnings on $301-$750",
      "50% earnings on $50-$300"
    ],
    subscriptionType: "breeder-basic"
  },
  {
    name: "Breeder Premium - Both Genders",
    price: "$9.99/month",
    description: "For breeders with 1-2 animals of both genders",
    features: [
      "List up to 2 animals (both genders)",
      "7-day free trial",
      "Enhanced visibility",
      "Priority messaging",
      "85% earnings on sales $751+",
      "60% earnings on $301-$750",
      "50% earnings on $50-$300"
    ],
    popular: true,
    subscriptionType: "breeder-premium"
  },
  {
    name: "Breeder Multi - Single Gender",
    price: "$12.99/month + $4.99/pet",
    description: "For breeders with 3+ animals of the same gender",
    features: [
      "List 3+ animals (same gender)",
      "7-day free trial",
      "$4.99 per additional pet after 2",
      "Premium visibility",
      "85% earnings on sales $751+",
      "60% earnings on $301-$750",
      "50% earnings on $50-$300"
    ],
    subscriptionType: "breeder-multi-single"
  },
  {
    name: "Breeder Elite - Both Genders",
    price: "$14.99/month + $4.99/pet",
    description: "Premium plan for large-scale breeders",
    features: [
      "List 3+ animals (both genders)",
      "7-day free trial",
      "$4.99 per additional pet after 2",
      "Maximum visibility",
      "Priority support",
      "85% earnings on sales $751+",
      "60% earnings on $301-$750",
      "50% earnings on $50-$300"
    ],
    subscriptionType: "breeder-elite"
  }
];

const buyerPlans = [
  {
    name: "Buyer Basic",
    price: "$5.99/month",
    description: "For buyers looking to purchase a pet",
    features: [
      "Browse all listings",
      "Contact breeders",
      "Save favorites",
      "Purchase protection",
      "7-day free trial"
    ],
    subscriptionType: "buyer-basic"
  },
  {
    name: "Buyer Premium - Breeding Services",
    price: "$9.99/month",
    description: "Access premium breeding partners",
    features: [
      "All Basic features",
      "Access breeding services",
      "Find breeding partners",
      "Advanced matching",
      "7-day free trial"
    ],
    popular: true,
    subscriptionType: "buyer-premium"
  }
];

const rehomingPlans = [
  {
    name: "Rehoming Basic",
    price: "$2.99/month",
    description: "For rehoming a single pet",
    features: [
      "List 1 pet for rehoming",
      "Basic visibility",
      "Connect with adopters",
      "Safe messaging",
      "7-day free trial"
    ],
    subscriptionType: "rehoming-basic"
  },
  {
    name: "Rehoming Multi",
    price: "$5.99/month + $2.99/pet",
    description: "For rehoming multiple pets",
    features: [
      "List up to 2 pets",
      "$2.99 per additional pet",
      "Enhanced visibility",
      "Priority placement",
      "7-day free trial"
    ],
    subscriptionType: "rehoming-multi"
  }
];

export default function SubscribePricing() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("breeder");
  const { isBreeder, isBuyer, loading } = useUserRole();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      // Redirect if user already has a subscription role
      if (isBreeder || isBuyer) {
        navigate("/dashboard");
      }
    }
  }, [isBreeder, isBuyer, loading, navigate]);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/login");
    }
    setUser(user);
  };

  const handleSubscribeClick = (subscriptionType: string) => {
    if (subscriptionType.startsWith("breeder")) {
      navigate("/subscribe-breeder");
    } else if (subscriptionType.startsWith("buyer")) {
      navigate("/subscribe-buyer");
    } else if (subscriptionType.startsWith("rehoming")) {
      navigate("/subscribe-rehoming");
    }
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your <span className="bg-gradient-hero bg-clip-text text-transparent">Subscription</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select the plan that best fits your needs. All plans include a 7-day free trial.
          </p>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3 mb-8">
            <TabsTrigger value="breeder">Breeder</TabsTrigger>
            <TabsTrigger value="buyer">Buyer</TabsTrigger>
            <TabsTrigger value="rehoming">Rehoming</TabsTrigger>
          </TabsList>

          <TabsContent value="breeder" className="space-y-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {breederPlans.map((plan) => (
                <Card 
                  key={plan.name}
                  className={plan.popular ? "border-primary shadow-lg relative" : ""}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="text-3xl font-bold mt-4">{plan.price}</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handleSubscribeClick(plan.subscriptionType)}
                    >
                      Subscribe Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="buyer" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {buyerPlans.map((plan) => (
                <Card 
                  key={plan.name}
                  className={plan.popular ? "border-primary shadow-lg relative" : ""}
                >
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="text-3xl font-bold mt-4">{plan.price}</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full"
                      variant={plan.popular ? "default" : "outline"}
                      onClick={() => handleSubscribeClick(plan.subscriptionType)}
                    >
                      Subscribe Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="rehoming" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {rehomingPlans.map((plan) => (
                <Card key={plan.name}>
                  <CardHeader>
                    <CardTitle>{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="text-3xl font-bold mt-4">{plan.price}</div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full"
                      variant="outline"
                      onClick={() => handleSubscribeClick(plan.subscriptionType)}
                    >
                      Subscribe Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <Footer />
    </div>
  );
}
