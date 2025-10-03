import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-hero bg-clip-text text-transparent">
            Terms of Service
          </h1>
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing and using PawDNA's platform, you agree to be bound by these Terms of Service. 
                If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Platform Usage</h2>
              <p>
                PawDNA provides a marketplace connecting responsible breeders with pet buyers. All transactions 
                must be conducted through our platform to ensure transparency, security, and proper documentation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Off-Platform Sales Penalty</h2>
              <p className="font-semibold text-primary">
                Any sales conducted outside of the PawDNA platform after initial contact through our service 
                will incur a penalty fee of $499.99. This fee ensures fair compensation for platform services 
                and protects both buyers and breeders.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Breeder Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate information about pets, including breed, health status, and vaccinations</li>
                <li>Maintain active subscription for listing privileges</li>
                <li>Honor all commitments made through the platform</li>
                <li>Comply with all applicable breeding and animal welfare laws</li>
                <li>Pay the $499.99 refundable deposit before listing pets</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Buyer Responsibilities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate location and contact information</li>
                <li>Pay required deposits and fees on time</li>
                <li>Arrange pickup or delivery within agreed timeframes</li>
                <li>Treat pets with proper care and responsibility</li>
                <li>For breeding services, pay Refundable Deposit (Goes towards the final payment)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Distance and Delivery Fees</h2>
              <p>
                Buyers may select breeders up to 250 miles away with standard delivery/pickup options included. 
                For distances beyond 250 miles, an additional refundable deposit of $299.99 is required to cover 
                potential issues such as failed pickups or delivery complications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Payment Structure</h2>
              <p>
                Breeders earn up to 85% of all sales made through the platform. PawDNA retains a small percentage to maintain and 
                improve platform services, provide customer support, and ensure transaction security.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Subscription Plans</h2>
              <p>
                Subscription fees are non-refundable. Cancellation of subscriptions will result in loss of 
                listing privileges but will not affect ongoing transactions initiated before cancellation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Prohibited Activities</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Providing false or misleading information about pets</li>
                <li>Conducting transactions outside the platform after initial contact</li>
                <li>Harassment or abusive behavior toward other users</li>
                <li>Listing pets obtained through illegal means</li>
                <li>Violating animal welfare laws or regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
              <p>
                PawDNA serves as a marketplace platform and is not responsible for the health, behavior, or 
                condition of pets listed. Breeders and buyers are responsible for conducting due diligence 
                and ensuring compliance with all applicable laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Termination</h2>
              <p>
                PawDNA reserves the right to suspend or terminate accounts that violate these terms or engage 
                in prohibited activities. Refundable deposits may be forfeited in cases of severe violations.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
              <p>
                PawDNA may update these Terms of Service at any time. Continued use of the platform after 
                changes constitutes acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Contact Information</h2>
              <p>
                For questions about these Terms of Service, please contact us through our support channels.
              </p>
            </section>

            <p className="text-sm text-muted-foreground mt-8">
              Last updated: January 2025
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
