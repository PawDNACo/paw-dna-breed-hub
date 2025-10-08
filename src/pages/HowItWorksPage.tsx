import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
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

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
              How <span className="bg-gradient-hero bg-clip-text text-transparent">It Works</span>
            </h1>
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

          <div className="mt-16 text-center">
            <p className="text-lg text-muted-foreground mb-6">
              Ready to get started? Join thousands of responsible breeders and buyers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/breeder-subscription" 
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-gradient-hero rounded-lg hover:opacity-90 transition-opacity"
              >
                Start as Breeder
              </a>
              <a 
                href="/buyer-subscription" 
                className="inline-flex items-center justify-center px-8 py-3 text-base font-medium border-2 border-primary rounded-lg hover:bg-primary/10 transition-colors"
              >
                Start as Buyer
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}