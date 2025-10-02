import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function RefundPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-hero bg-clip-text text-transparent">
            Refund Policy
          </h1>
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. General Policy</h2>
              <p className="font-semibold text-primary">
                All sales through PawDNA are final. Refunds are only allowed under the specific 
                circumstances outlined in this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. Eligible Refund Circumstances</h2>
              <p>
                Refunds will ONLY be issued if:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li className="font-semibold">
                  The breeder sold a different breed than what was listed on the platform
                </li>
              </ul>
              <p className="mt-4">
                This is the sole circumstance under which a refund will be considered. All other issues, 
                including but not limited to personality differences, minor health issues, or buyer's remorse, 
                are not eligible for refunds.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Refund Request Timeline</h2>
              <p className="font-semibold text-primary">
                Refund requests must be submitted within 72 hours of confirmed delivery or pickup.
              </p>
              <p className="mt-4">
                After the 72-hour window, no refund requests will be accepted, regardless of circumstances. 
                This strict timeline ensures timely resolution and protects both buyers and breeders.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Refund Request Process</h2>
              <p>
                To request a refund, buyers must:
              </p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact PawDNA support within 72 hours of delivery/pickup</li>
                <li>Provide photographic evidence of the pet</li>
                <li>Provide the original listing information</li>
                <li>Submit any veterinary documentation confirming breed (if available)</li>
                <li>Be prepared to return the pet to the breeder</li>
              </ol>
              <p className="mt-4">
                PawDNA will investigate all refund claims thoroughly. The investigation process may take 
                up to 10 business days.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Distance Delivery Deposits</h2>
              <p>
                For distances beyond 250 miles, buyers pay an additional refundable deposit of $299.99. 
                This deposit covers:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Failed pickups by the buyer</li>
                <li>Failed deliveries by the breeder</li>
                <li>Transportation issues or complications</li>
              </ul>
              <p className="mt-4">
                <strong>Refund of Distance Deposit:</strong> The $299.99 distance deposit will be refunded 
                within 7 business days after successful delivery or pickup. If either party fails to fulfill 
                their obligation (buyer fails to pick up or breeder fails to deliver), the deposit is forfeited 
                to the affected party as compensation.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Breeder Deposits</h2>
              <p>
                Breeders pay a $499.99 refundable deposit before listing pets. This deposit:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Is refunded upon successful completion of transactions</li>
                <li>May be forfeited for Terms of Service violations</li>
                <li>May be forfeited for fraudulent breed listings</li>
                <li>Is not refunded if the breeder conducts sales off-platform</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Buyer Breeding Service Deposits</h2>
              <p>
                For breeding services, buyers pay a $1,000 refundable deposit that goes towards the cost 
                of the breed. This deposit:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Is applied to the total breeding service cost</li>
                <li>Is refundable only if the breeder fails to provide agreed services</li>
                <li>Is not refundable if the buyer cancels after services begin</li>
                <li>Must be disputed within 72 hours of service completion</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Subscription Fees</h2>
              <p className="font-semibold">
                Monthly subscription fees are non-refundable under all circumstances.
              </p>
              <p className="mt-4">
                This includes but is not limited to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Subscription cancellations</li>
                <li>Account terminations</li>
                <li>Platform changes or updates</li>
                <li>Dissatisfaction with service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. Add-On Services</h2>
              <p>
                Add-on services (vaccination packages, care packages, cleaning services, accessories) 
                are non-refundable once purchased, unless:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The service was not provided as described</li>
                <li>The refund is part of an approved breed-related refund</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Dispute Resolution</h2>
              <p>
                If a refund request is denied, buyers may appeal the decision within 5 business days. 
                Appeals must include:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Additional evidence supporting the claim</li>
                <li>Detailed explanation of the dispute</li>
                <li>Any relevant veterinary or expert opinions</li>
              </ul>
              <p className="mt-4">
                PawDNA's decision on appeals is final and binding.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Refund Processing</h2>
              <p>
                Approved refunds will be processed within 10-14 business days and returned to the original 
                payment method. Processing times may vary depending on your financial institution.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">12. Contact Information</h2>
              <p>
                For refund requests or questions about this policy, please contact PawDNA support through 
                our platform channels.
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
