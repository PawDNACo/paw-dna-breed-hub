import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function BuyerAgreement() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-hero bg-clip-text text-transparent">
            Buyer Agreement
          </h1>
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Agreement Overview</h2>
              <p>
                This Buyer Agreement ("Agreement") is entered into between the buyer ("Buyer") 
                and PawDNA ("Platform"). By creating an account and purchasing pets or breeding services 
                on PawDNA, the Buyer agrees to all terms and conditions outlined in this Agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Registration and Account</h2>
              <p>
                <strong>Free Sign-Up:</strong> Registration on PawDNA is completely free with no upfront 
                payment required. Buyers can create an account and browse available pets at no cost.
              </p>
              <p className="mt-4">
                To complete purchases or access breeding services, Buyers must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Complete profile registration with accurate information</li>
                <li>Provide valid location details (ZIP code, city, state)</li>
                <li>For breeding services: Select appropriate subscription plan ($9.99/month per gender)</li>
                <li>Pay required deposits via checking account before transactions</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Payment Methods</h2>
              <p>
                <strong>Monthly Subscriptions:</strong> Can be paid using multiple convenient methods:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Credit or debit card</li>
                <li>Bank account (ACH)</li>
                <li>Cash App</li>
                <li>Venmo</li>
                <li>Zelle</li>
                <li>Other popular financial institutions</li>
              </ul>
              <p className="mt-4 font-semibold text-primary">
                <strong>Deposits:</strong> MUST be paid via checking account only. Buyers can only purchase 
                pets or access breeding services after the deposit amount has fully settled in the platform account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Breeding Services Subscription</h2>
              <p>
                For buyers seeking breeding services:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>$9.99/month per gender</strong> subscription fee</li>
                <li><strong>$1,000 refundable deposit</strong> (goes towards breed cost) - must be paid via checking account</li>
                <li>Access to premium breeding partners</li>
                <li>Small breeds from $1,500</li>
                <li>Medium breeds from $2,000</li>
                <li>Large breeds from $3,000</li>
                <li>Rare breeds from $4,500</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Pet Purchase Process</h2>
              <p>
                When purchasing pets directly:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Browse available pets on the platform</li>
                <li>Contact breeders through platform messaging</li>
                <li>Pay required deposit via checking account</li>
                <li>Wait for deposit to settle (typically 3-5 business days)</li>
                <li>Complete purchase through platform</li>
                <li>Arrange delivery or pickup with breeder</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Distance and Delivery Fees</h2>
              <p>
                <strong>Standard Distance (Up to 250 miles):</strong> Delivery or pickup is included with 
                no additional fees.
              </p>
              <p className="mt-4">
                <strong>Extended Distance (Beyond 250 miles):</strong> An additional refundable deposit of 
                $299.99 is required (must be paid via checking account). This deposit:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Covers potential issues with long-distance transactions</li>
                <li>Protects both buyer and breeder from failed pickups/deliveries</li>
                <li>Is refunded within 7 business days after successful delivery/pickup</li>
                <li>May be forfeited if buyer fails to complete pickup as scheduled</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Exclusive Platform Usage</h2>
              <p className="font-semibold text-primary">
                All purchases initiated through PawDNA contact must be completed through the platform.
              </p>
              <p className="mt-4">
                <strong>Off-Platform Purchase Penalty:</strong> If a Buyer conducts a purchase outside of 
                the PawDNA platform after initial contact was made through PawDNA, the Buyer will be 
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
              <h2 className="text-2xl font-semibold mb-4">8. Buyer Responsibilities</h2>
              <p>
                Buyers agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Provide accurate location and contact information</li>
                <li>Pay all required fees and deposits on time via specified payment methods</li>
                <li>Arrange pickup or delivery within agreed timeframes</li>
                <li>Inspect the pet upon delivery/pickup</li>
                <li>Report any breed discrepancies within 72 hours</li>
                <li>Treat pets with proper care and responsibility</li>
                <li>Comply with all local pet ownership laws and regulations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Refund Rights</h2>
              <p>
                Buyers are eligible for refunds ONLY if:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="font-semibold">The breeder sold a different breed than what was listed</li>
              </ul>
              <p className="mt-4">
                <strong>Refund Request Timeline:</strong> Must be submitted within 72 hours of confirmed 
                delivery or pickup. See our Refund Policy for complete details.
              </p>
              <p className="mt-4">
                <strong>All sales are final</strong> outside of breed misrepresentation. Issues including 
                personality differences, minor health issues, or buyer remorse are not eligible for refunds.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Add-On Services</h2>
              <p>
                Buyers may purchase optional add-ons to enhance their pet ownership experience:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Vaccination Package ($299):</strong> Comprehensive vaccination records and services</li>
                <li><strong>Care Package (Starting at $149):</strong> Food, toys, and pet essentials</li>
                <li><strong>Cleaning Service ($19.99):</strong> Pre-delivery grooming and cleaning</li>
                <li><strong>Accessories Bundle ($2.99 each):</strong> Individual accessories to select</li>
              </ul>
              <p className="mt-4">
                Add-on purchases can be paid using the same flexible payment methods as subscriptions 
                (card, bank, Cash App, Venmo, Zelle, etc.).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Communication Requirements</h2>
              <p>
                Buyers must:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Conduct all communications through the PawDNA platform</li>
                <li>Respond to breeder messages within 24 hours when transaction is pending</li>
                <li>Provide clear availability for pickup or delivery</li>
                <li>Not share personal contact information to bypass platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Prohibited Activities</h2>
              <p>
                Buyers may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Conduct purchases outside the platform after platform contact</li>
                <li>Provide false location or contact information</li>
                <li>Attempt to resell pets for profit without proper licensing</li>
                <li>Harass or abuse breeders</li>
                <li>Attempt fraudulent refund claims</li>
                <li>Share breeder contact information with third parties</li>
                <li>Violate animal welfare or pet ownership laws</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">13. Delivery and Pickup</h2>
              <p>
                Buyers agree to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be available at scheduled delivery or pickup time</li>
                <li>Inspect the pet immediately upon receipt</li>
                <li>Confirm delivery/pickup through the platform</li>
                <li>Have appropriate pet carrier or transportation ready</li>
                <li>Report any immediate concerns within 72 hours</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">14. Account Termination</h2>
              <p>
                PawDNA reserves the right to terminate buyer accounts for:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Violations of this Agreement or Terms of Service</li>
                <li>Off-platform purchases after platform contact</li>
                <li>Fraudulent activity or payment disputes</li>
                <li>Harassment or abusive behavior</li>
                <li>Animal welfare violations</li>
                <li>Multiple unsubstantiated refund requests</li>
              </ul>
              <p className="mt-4">
                Upon termination, pending deposits may be forfeited and the buyer loses access to the platform.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">15. Liability</h2>
              <p>
                Buyers acknowledge that:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>PawDNA is a marketplace platform and not the seller of pets</li>
                <li>Breeders are responsible for pet health and accuracy of listings</li>
                <li>PawDNA facilitates connections but does not guarantee pet health or temperament</li>
                <li>Buyers should conduct due diligence when selecting breeders and pets</li>
                <li>PawDNA is not liable for disputes between buyers and breeders beyond platform resolution</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">16. Modifications to Agreement</h2>
              <p>
                PawDNA may modify this Agreement at any time. Buyers will be notified of significant 
                changes via email. Continued use of the platform after modifications constitutes 
                acceptance of the updated Agreement.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">17. Acceptance</h2>
              <p>
                By creating an account and making purchases on PawDNA, the Buyer acknowledges that they 
                have read, understood, and agree to be bound by this Buyer Agreement.
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
