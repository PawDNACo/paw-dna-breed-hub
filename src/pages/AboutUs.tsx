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
              Where pets swipe right. The revolutionary pet matchmaking platform that brings 
              breeders and pet lovers together—just like the apps that changed dating forever.
            </p>
          </div>

          {/* Mission Section */}
          <section className="mb-16">
            <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-6 text-center">Our Mission</h2>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-4xl mx-auto text-center">
                PawDNA was founded with a bold vision: to bring the simplicity and excitement of modern 
                matchmaking to the world of pet breeding and adoption. Just like Tinder, Bumble, and Plenty 
                of Fish revolutionized how people connect, we're transforming how breeders showcase their 
                pets and how families find their perfect companion. Every swipe, every match, and every 
                connection is built on trust, transparency, and a love for animals.
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
                  All breeders are verified, and every transaction is secure—because real matches deserve real protection.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Heart className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Animal Welfare</h3>
                <p className="text-muted-foreground">
                  Every profile represents a healthy, happy pet from responsible breeders who care about animal welfare.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <PawPrint className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Transparency</h3>
                <p className="text-muted-foreground">
                  Every profile shows clear pricing, breed info, and care details—no surprises, just honest connections.
                </p>
              </div>

              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community</h3>
                <p className="text-muted-foreground">
                  Swipe, match, and connect with a community that shares your passion for pets and responsible breeding.
                </p>
              </div>
            </div>
          </section>

          {/* Our Story */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="max-w-4xl mx-auto space-y-4 text-lg text-muted-foreground">
              <p>
                PawDNA was born from a simple observation: if apps like Tinder and Bumble could help millions 
                of people find their perfect match, why couldn't the same concept work for pets? Our founders 
                experienced firsthand the frustration of searching for a family pet—wading through sketchy 
                listings, unclear pricing, and questionable breeders. They knew there had to be a better way.
              </p>
              <p>
                Inspired by the simplicity of modern matchmaking apps, they created PawDNA: a platform where 
                breeders create profiles for their dogs and cats, and buyers swipe through adorable puppies 
                and kittens to find their perfect companion. It's pet adoption meets modern technology—fun, 
                safe, and transparent. Breeders can showcase their animals with photos and details, while 
                buyers can browse, match, and connect with confidence.
              </p>
              <p>
                Today, PawDNA is the go-to platform for responsible breeders and pet lovers nationwide. 
                Whether you're breeding champion bloodlines or searching for your next best friend, PawDNA 
                makes the process as easy as a swipe. Because love isn't just for humans—it's in their genes. 🐾
              </p>
            </div>
          </section>

          {/* Why Choose PawDNA */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold mb-6 text-center">Why Choose PawDNA?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">For Breeders</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Showcase your breeding program professionally</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Earn 85% on sales over $750—fair royalties</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Connect with verified buyers nationwide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Flexible subscription plans for any operation size</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Premium add-ons to maximize revenue</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">For Buyers</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Swipe through verified pets and breeders</span>
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
                    <span>Access to breeding and stud services</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Premium care packages and add-ons</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">For Rehomers</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>No listing fees—just affordable subscriptions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Help pets find loving homes responsibly</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Single or multi-pet plans starting at $2.99/month</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Connect with verified adopters</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Safe, transparent rehoming process</span>
                  </li>
                </ul>
              </div>

              <div className="bg-card border border-border rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-3">All In One</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Full access to breeding and buying features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Best value with combined subscription savings</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Unlimited pet listings and swipes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Priority support and premium features</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">✓</span>
                    <span>Perfect for serious breeders and pet enthusiasts</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="text-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12 mb-16">
            <h2 className="text-3xl font-bold mb-4">Join the PawDNA Community</h2>
            <p className="text-lg text-muted-foreground mb-6 max-w-2xl mx-auto">
              Whether you're a breeder ready to showcase your pets or a buyer looking to swipe right 
              on your perfect companion, PawDNA makes it easy, fun, and safe. Join the matchmaking revolution.
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
