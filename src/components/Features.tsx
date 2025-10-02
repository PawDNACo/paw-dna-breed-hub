import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, DollarSign, Users, Star, Package } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Verified Breeders",
    description: "All breeders are verified with refundable security deposits ensuring trust and quality.",
  },
  {
    icon: Shield,
    title: "Secure Transactions",
    description: "Protected payments with funds held securely until confirmed delivery of puppies and kittens.",
  },
  {
    icon: DollarSign,
    title: "Fair Royalties",
    description: "Breeders earn 15% royalties on every puppy sold through our transparent royalty program.",
  },
  {
    icon: Users,
    title: "Breeding Services",
    description: "Hire premium breeding partners from $1,500 to $4,500 depending on breed and size.",
  },
  {
    icon: Star,
    title: "Premium Care Packages",
    description: "Add vaccinations, cleaning, and care packages to ensure the best start for every pet.",
  },
  {
    icon: Package,
    title: "Complete Service",
    description: "From breeding to delivery, we handle everything with professional care and attention.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Why Choose <span className="bg-gradient-hero bg-clip-text text-transparent">PawDNA</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            The most trusted platform for responsible pet breeding and adoption
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-gradient-card border-border/50 hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
