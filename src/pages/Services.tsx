import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Check } from "lucide-react";

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      title: "Breeder Services",
      description: "List your puppies and kittens, manage sales, and grow your breeding business",
      features: [
        "Professional pet listings",
        "Secure payment processing",
        "Buyer management tools",
        "Earn up to 85% on sales",
        "Multi-breed support",
        "Parent photo showcase"
      ],
      buttonText: "Subscribe Now",
      buttonAction: () => navigate("/breeder-subscription")
    },
    {
      title: "Buyer Services",
      description: "Find your perfect companion from verified breeders nationwide",
      features: [
        "Browse verified breeders",
        "Secure transactions",
        "Health guarantees",
        "Delivery options",
        "Direct messaging",
        "Purchase protection"
      ],
      buttonText: "Browse Pets",
      buttonAction: () => navigate("/browse")
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Our <span className="bg-gradient-hero bg-clip-text text-transparent">Services</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're a breeder or looking for a new companion, PawDNA has you covered
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {services.map((service, index) => (
            <Card key={index} className="border-border/50">
              <CardHeader>
                <CardTitle className="text-2xl">{service.title}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  onClick={service.buttonAction}
                  variant={index === 0 ? "hero" : "default"}
                >
                  {service.buttonText}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Services;
