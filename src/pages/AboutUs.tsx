import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PawPrint, Heart, Shield, Users } from "lucide-react";
import { TrustBadges } from "@/components/TrustBadges";

export default function AboutUs() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              About PawDNA
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Connecting responsible breeders with loving pet owners through a trusted, 
              transparent marketplace built on integrity and care.
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-16">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto text-center">
                PawDNA was founded with a simple yet powerful mission: to create a safe, transparent 
                marketplace where responsible breeders can connect with loving families seeking their 
                perfect puppy or kitten. We believe that every pet deserves a healthy start in life, 
                and every family deserves transparency and trust when welcoming a new furry member.
              </p>
            </div>
          </section>

          {/* Core Values */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-10 text-center">Our Core Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Trust & Safety</h3>
                <p className="text-muted-foreground">
                  We verify all breeders and ensure secure transactions to protect both buyers and sellers.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Animal Welfare</h3>
                <p className="text-muted-foreground">
                  We promote responsible breeding practices and prioritize the health and happiness of every pet.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <PawPrint className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Transparency</h3>
                <p className="text-muted-foreground">
                  Clear pricing, honest listings, and open communication build trust in our community.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community</h3>
                <p className="text-muted-foreground">
                  We foster connections between breeders and families who share a love for animals.
                </p>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="max-w-4xl mx-auto space-y-4 text-lg text-muted-foreground">
              <p>
                PawDNA was born from a personal experience. Our founders struggled to find a trustworthy 
                platform to connect with responsible breeders when searching for their family pet. Too 
                often, they encountered unclear pricing, questionable breeding practices, and a lack of 
                transparency that made the process stressful and uncertain.
              </p>
              <p>
                Determined to create a better solution, they envisioned a marketplace built on three 
                pillars: transparency, trust, and fair treatment for both breeders and buyers. PawDNA 
                was created to be more than just a listing site—it\'s a community where ethical breeding 
                meets exceptional pet ownership.
              </p>
              <p>
                Today, PawDNA proudly serves hundreds of responsible breeders and thousands of families 
                across the country, facilitating connections that result in happy, healthy pets finding 
                their forever homes.
              </p>
            </div>
          </section>

          {/* Why Choose PawDNA */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Why Choose PawDNA?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">For Breeders</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Free sign-up with no upfront costs</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Earn 85% on all sales—fair royalties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Reach verified buyers nationwide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Flexible payment options</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Premium add-ons to increase revenue</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">For Buyers</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Browse verified, responsible breeders</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Transparent pricing with no hidden fees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Secure platform with buyer protections</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Access to breeding services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Add-ons for complete pet care</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold mb-4">Join the PawDNA Community</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Whether you're a breeder looking to connect with loving families or a buyer seeking 
              your perfect companion, PawDNA is here to make the process transparent, safe, and rewarding.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/auth"
                className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
              >
                Get Started Free
              </a>
              <a
                href="/browse"
                className="inline-flex items-center justify-center px-8 py-3 bg-background border border-border rounded-lg font-semibold hover:bg-muted transition-colors"
              >
                Browse Pets
              </a>
            </div>
          </section>

          {/* Trust Badges */}
          <section className="mb-16">
            <TrustBadges variant="grid" showAll />
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
