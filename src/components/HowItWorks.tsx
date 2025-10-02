import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const steps = [
  {
    number: "01",
    title: "Create Your Account",
    description: "Sign up as a breeder or hirer. Choose your subscription plan and complete verification with a refundable deposit.",
  },
  {
    number: "02",
    title: "List or Browse",
    description: "Breeders list their pets with detailed profiles. Hirers browse verified breeding partners by breed, size, and location.",
  },
  {
    number: "03",
    title: "Secure Transaction",
    description: "Connect through our platform. All payments are securely held and include breeding agreements and health guarantees.",
  },
  {
    number: "04",
    title: "Breeding & Care",
    description: "Professional breeding services with optional care packages, vaccinations, and cleaning services included.",
  },
  {
    number: "05",
    title: "Sale & Delivery",
    description: "List and sell puppies or kittens. Earn up to 85% on sales. Funds released after confirmed delivery.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            How <span className="bg-gradient-hero bg-clip-text text-transparent">It Works</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple, secure, and transparent breeding process from start to finish
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {steps.map((step, index) => (
            <Card key={index} className="relative overflow-hidden hover:shadow-glow transition-all duration-300">
              <div className="absolute top-0 left-0 w-2 h-full bg-gradient-hero" />
              <CardHeader>
                <div className="flex flex-col md:flex-row items-center md:items-start gap-4 text-center md:text-left">
                  <div className="text-5xl font-bold text-primary/20">
                    {step.number}
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{step.title}</CardTitle>
                    <CardDescription className="text-base">
                      {step.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
