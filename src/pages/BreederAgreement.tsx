import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function BreederAgreement() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-hero bg-clip-text text-transparent">
            Breeder Agreement
          </h1>
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Agreement Overview</h2>
              <p>
                This Breeder Agreement ("Agreement") is entered into between the breeder ("Breeder") 
                and PawDNA ("Platform"). By creating an account and listing pets on PawDNA, the Breeder 
                agrees to all terms and conditions outlined in this Agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Registration and Account</h2>
              <p>
                <strong>Free Sign-Up:</strong> Registration on PawDNA is completely free with no upfront 
                payment required. Breeders can create an account and explore the platform at no cost.
              </p>
              <p className="mt-4">
                To begin listing and selling pets, Breeders must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Complete profile registration with accurate information</li>
                <li>Provide valid location details (ZIP code, city, state)</li>
                <li>Select an appropriate subscription plan</li>
                <li>Pay the required $499.99 refundable deposit before first listing</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Refundable Deposit</h2>
              <p>
                Before listing pets for sale, Breeders must pay a <strong>$499.99 refundable deposit</strong>. 
                This deposit:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Ensures commitment to platform standards and policies</li>
                <li>Is fully refundable upon successful completion of transactions</li>
                <li>Protects buyers from fraudulent or misrepresented listings</li>
                <li>May be forfeited for violations of this Agreement or Terms of Service</li>
              </ul>
              <p className="mt-4">
                The deposit will be returned to the Breeder within 14 business days after the completion 
                of all active transactions, provided no violations have occurred.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Subscription Plans</h2>
              <p>
                Breeders must maintain an active subscription to list pets:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Single Gender Plan ($4.99/month):</strong> List male or female pets</li>
                <li><strong>Both Genders Plan ($9.99/month):</strong> List both males and females</li>
              </ul>
              <p className="mt-4">
                Subscription fees are billed monthly and are non-refundable. Cancellation of subscription 
                will result in removal of active listings but will not affect ongoing transactions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Listing Requirements</h2>
              <p>
                All pet listings must include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Accurate breed information</li>
                <li>Correct species (dog or cat)</li>
                <li>Truthful age and health status</li>
                <li>Clear, recent photographs</li>
                <li>Vaccination records (if applicable)</li>
                <li>Honest description of temperament and characteristics</li>
                <li>Fair market pricing</li>
              </ul>
              <p className="mt-4">
                <strong>Misrepresentation of breed information may result in refunds to buyers, 
                forfeiture of deposit, and immediate account termination.</strong>
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Payment and Royalties</h2>
              <p>
                PawDNA operates on a fair royalty structure:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Breeders earn 85%</strong> of all sales made through the platform</li>
                <li><strong>PawDNA retains 15%</strong> to maintain platform services, security, and support</li>
              </ul>
              <p className="mt-4">
                Payments to Breeders are processed within 5-7 business days after successful delivery 
                or pickup confirmation. All transactions must be completed through the PawDNA platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Exclusive Platform Usage</h2>
              <p className="font-semibold text-primary">
                All sales initiated through PawDNA contact must be completed through the platform.
              </p>
              <p className="mt-4">
                <strong>Off-Platform Sales Penalty:</strong> If a Breeder conducts a sale outside of 
                the PawDNA platform after initial contact was made through PawDNA, the Breeder will be 
                charged a penalty fee of <strong>$499.99</strong>.
              </p>
              <p className="mt-4">
                This penalty:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Compensates PawDNA for connecting the buyer and breeder</li>
                <li>Ensures fair operation of the marketplace</li>
                <li>Protects buyers who lose platform protections in off-platform transactions</li>
                <li>Is in addition to any other consequences, including account termination</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Delivery and Distance Requirements</h2>
              <p>
                Breeders agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide delivery or arrange pickup within 250 miles at no additional charge</li>
                <li>For distances beyond 250 miles, buyers pay an additional $299.99 refundable deposit</li>
                <li>Communicate clearly about delivery timelines</li>
                <li>Ensure pets are healthy and ready for transport</li>
                <li>Provide proper documentation for delivery or pickup</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Add-On Services</h2>
              <p>
                Breeders may offer premium add-ons to enhance sales:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Vaccination Packages ($299):</strong> Comprehensive vaccination records and services</li>
                <li><strong>Care Packages (Starting at $149):</strong> Customizable packages with food, toys, and essentials</li>
                <li><strong>Cleaning Service ($19.99):</strong> Pre-delivery grooming and cleaning</li>
                <li><strong>Accessories Bundle ($2.99 each):</strong> Individual accessories buyers can select</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Health and Welfare Standards</h2>
              <p>
                Breeders must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Comply with all local, state, and federal animal welfare laws</li>
                <li>Maintain proper breeding licenses and permits</li>
                <li>Provide veterinary care for all animals</li>
                <li>Ensure humane breeding practices</li>
                <li>Not engage in puppy mill or kitten mill operations</li>
                <li>Report any health issues to buyers immediately</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Communication Requirements</h2>
              <p>
                Breeders must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Respond to buyer inquiries within 24 hours</li>
                <li>Conduct all communications through the PawDNA platform</li>
                <li>Provide honest answers to buyer questions</li>
                <li>Keep buyers updated on pet availability and status</li>
                <li>Arrange mutually agreeable delivery or pickup times</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Prohibited Activities</h2>
              <p>
                Breeders may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>List stolen or illegally obtained animals</li>
                <li>Misrepresent breed, age, or health information</li>
                <li>Conduct sales outside the platform after platform contact</li>
                <li>Engage in discriminatory practices</li>
                <li>Harass or abuse buyers</li>
                <li>Violate animal welfare laws</li>
                <li>Share buyer contact information with third parties</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Refund Obligations</h2>
              <p>
                Breeders agree to issue full refunds if:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>A different breed than listed is delivered</li>
                <li>The refund request is made within 72 hours of delivery/pickup</li>
                <li>The buyer provides evidence supporting the breed discrepancy claim</li>
              </ul>
              <p className="mt-4">
                In such cases, the pet must be returned to the Breeder, and the Breeder\'s deposit may 
                be used to compensate the buyer and cover platform fees.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Account Termination</h2>
              <p>
                PawDNA reserves the right to terminate breeder accounts for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violations of this Agreement or Terms of Service</li>
                <li>Fraudulent listings or misrepresentation</li>
                <li>Off-platform sales after platform contact</li>
                <li>Multiple buyer complaints</li>
                <li>Animal welfare violations</li>
                <li>Harassment or abusive behavior</li>
              </ul>
              <p className="mt-4">
                Upon termination, the Breeder forfeits their deposit and loses access to the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">15. Liability and Indemnification</h2>
              <p>
                Breeders agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Indemnify PawDNA against claims arising from their listings</li>
                <li>Accept full responsibility for the health and welfare of listed pets</li>
                <li>Maintain appropriate insurance coverage for breeding operations</li>
                <li>Hold PawDNA harmless for disputes between breeders and buyers</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">16. Modifications to Agreement</h2>
              <p>
                PawDNA may modify this Agreement at any time. Breeders will be notified of significant 
                changes via email. Continued use of the platform after modifications constitutes 
                acceptance of the updated Agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">17. Acceptance</h2>
              <p>
                By creating an account and listing pets on PawDNA, the Breeder acknowledges that they 
                have read, understood, and agree to be bound by this Breeder Agreement.
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
