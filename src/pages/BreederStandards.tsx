import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, CheckCircle, Users, Home, ClipboardCheck, AlertTriangle, Award } from "lucide-react";

const BreederStandards = () => {
  const standards = [
    {
      icon: Shield,
      title: "Identity Verification",
      description: "All breeders must complete Stripe Identity verification to ensure authenticity and accountability. This comprehensive process validates identity documents and prevents fraud."
    },
    {
      icon: CheckCircle,
      title: "Veterinary Care",
      description: "Every breeder must maintain a formal relationship with a licensed veterinarian. All puppies and kittens must follow minimum vaccination and worming schedules, with complete health records provided."
    },
    {
      icon: Home,
      title: "Housing Standards",
      description: "Living spaces must meet strict requirements including appropriate size, pet-friendly materials, proper ventilation, temperature control, quality flooring, bedding, lighting, and cleanliness standards."
    },
    {
      icon: Users,
      title: "Professional Training",
      description: "Breeders must maintain adequate staffing and conduct comprehensive training to provide regular, quality care for every puppy, kitten, and parent animal."
    },
    {
      icon: ClipboardCheck,
      title: "Regular Monitoring",
      description: "PawDNA stays in regular contact with breeders, monitoring operation quality and compliance with our standards. We expect breeders to provide socialization, human interaction, and proper care."
    },
    {
      icon: Award,
      title: "Transparent Pricing",
      description: "All pricing must be transparent with clear earning percentages (50-85% based on price). Special breeds and higher-priced animals earn breeders up to 85% of the sale price."
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
              Our <span className="bg-gradient-hero bg-clip-text text-transparent">Breeder Standards</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              No scammers. No headaches. PawDNA serves you best by putting the health and well-being of your pet first. 
              We maintain the highest standards for all breeders in our network.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Introduction */}
            <div className="mb-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                What are PawDNA's breeder standards?
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                We follow a rigorous screening process with every breeder in our network to ensure 
                they are following our best-in-class standards for animal welfare and ethical breeding practices.
              </p>
            </div>

            {/* Zero Tolerance Policy */}
            <Card className="mb-12 border-destructive/50 bg-destructive/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-destructive" />
                  <CardTitle className="text-2xl">Zero Tolerance Policy</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg">
                  PawDNA has a zero tolerance policy for any unethical or substandard breeding practices. 
                  Breeders who violate our standards are immediately removed from our platform with frozen funds 
                  for 90 days to protect buyers.
                </p>
              </CardContent>
            </Card>

            {/* Identity Verification Highlight */}
            <Card className="mb-12 border-primary/50 bg-primary/5">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">Stripe Identity Verification Required</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-4">
                  Every breeder on PawDNA must complete comprehensive identity verification through Stripe Identity. 
                  This ensures:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Verified government-issued identification</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Real-time facial recognition matching</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Document authenticity validation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>Background verification and fraud prevention</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Breeder Screening */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-center">
                Breeder Screening, Vetting and Review
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center mb-8">
                PawDNA uses a comprehensive system to evaluate and screen breeders across the nation 
                to create our exclusive network of breeder partners committed to animal welfare.
              </p>
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-4">
                    Our formal breeder application includes:
                  </p>
                  <ul className="grid md:grid-cols-2 gap-3">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Identity verification through Stripe</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Review of ownership history</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Facility documentation review</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Background verification</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Compliance evaluation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Veterinarian relationship verification</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Standards Grid */}
            <div className="mb-16">
              <h2 className="text-3xl font-bold mb-6 text-center">
                PawDNA's Breeder Standards
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto text-center mb-12">
                Our comprehensive screening process has multiple points of emphasis for every animal and 
                their parents, managed by our dedicated platform team.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {standards.map((standard, index) => {
                  const Icon = standard.icon;
                  return (
                    <Card key={index} className="border-border/50 hover:border-primary/50 transition-colors">
                      <CardHeader>
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <CardTitle className="text-xl">{standard.title}</CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground">{standard.description}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Fight Against Scams */}
            <Card className="bg-gradient-subtle border-primary/30">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Our Fight Against Pet Scammers</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-center text-muted-foreground max-w-3xl mx-auto mb-6">
                  The PawDNA Team is dedicated to fighting against online pet scams. Through identity verification, 
                  secure payments, and our reporting system, we ensure all pets come from verified, responsible breeders.
                </p>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Report suspicious activity through our platform or contact us at{" "}
                    <a href="/contact" className="text-primary hover:underline">our contact page</a>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Refundable Deposit Info */}
            <Card className="mt-12 border-secondary/50 bg-secondary/5">
              <CardHeader>
                <CardTitle className="text-2xl text-center">Refundable Deposit Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-center text-muted-foreground max-w-3xl mx-auto">
                  All breeders must maintain a $499.99 refundable deposit. This deposit protects buyers and 
                  ensures breeders maintain high standards. The deposit is returned when breeders leave the 
                  platform in good standing.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BreederStandards;
