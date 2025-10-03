import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center mb-16">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about PawDNA
            </p>
          </div>

          {/* General Questions */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">General Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is PawDNA?</AccordionTrigger>
                <AccordionContent>
                  PawDNA is like Tinder or Bumble, but for pets! We're a premier pet breeding marketplace that 
                  connects verified breeders with loving pet owners. We provide a secure, transparent platform for 
                  finding your perfect puppy or kitten, as well as accessing quality breeding services.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Is registration really free?</AccordionTrigger>
                <AccordionContent>
                  Yes! Sign-up is completely free with no upfront payment required. Both breeders and 
                  buyers can create accounts and explore the platform at no cost. Fees only apply when 
                  you\'re ready to list pets (breeders) or make purchases (buyers).
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>How does PawDNA ensure safety and trust?</AccordionTrigger>
                <AccordionContent>
                  We verify all breeders, require refundable deposits to ensure commitment, facilitate 
                  all transactions through our secure platform, and offer buyer protections including 
                  refunds for breed misrepresentation within 72 hours.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* For Breeders */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">For Breeders</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="breeder-1">
                <AccordionTrigger>What are the subscription plans for breeders?</AccordionTrigger>
                <AccordionContent>
                  We offer two plans: Single Gender ($4.99/month) to list male or female pets, and 
                  Both Genders ($9.99/month) to list both. Subscriptions can be paid via card, bank, 
                  Cash App, Venmo, Zelle, or other popular methods.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="breeder-2">
                <AccordionTrigger>What is the $499.99 breeder deposit?</AccordionTrigger>
                <AccordionContent>
                  Before listing pets, breeders must pay a $499.99 refundable deposit via checking 
                  account. This ensures commitment to platform standards. The deposit is returned after 
                  successful completion of transactions, provided no violations occur.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="breeder-3">
                <AccordionTrigger>How much do breeders earn per sale?</AccordionTrigger>
                <AccordionContent>
                  Breeders earn up to 85% of all sales made through the platform. PawDNA retains a small percentage to 
                  maintain platform services, security, and support. Payments are processed within 5-7 
                  business days after confirmed delivery or pickup.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="breeder-4">
                <AccordionTrigger>What happens if I sell outside the platform?</AccordionTrigger>
                <AccordionContent>
                  If you conduct a sale outside of PawDNA after initial contact was made through the 
                  platform, you will be charged a $499.99 penalty fee. This may also result in account 
                  termination and forfeiture of your deposit.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="breeder-5">
                <AccordionTrigger>Can I offer add-on services?</AccordionTrigger>
                <AccordionContent>
                  Yes! Breeders can offer vaccination packages ($299), customizable care packages 
                  (starting at $149), cleaning services ($19.99), and accessories bundles ($2.99 each) 
                  to increase revenue and provide value to buyers.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* For Buyers */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">For Buyers</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="buyer-1">
                <AccordionTrigger>How do I purchase a pet?</AccordionTrigger>
                <AccordionContent>
                  Browse available pets, contact breeders through platform messaging, pay required 
                  deposit via checking account, wait for deposit to settle (3-5 business days), complete 
                  purchase through platform, and arrange delivery or pickup with the breeder.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="buyer-2">
                <AccordionTrigger>What payment methods are accepted?</AccordionTrigger>
                <AccordionContent>
                  Subscriptions and add-ons can be paid via card, bank, Cash App, Venmo, Zelle, or other 
                  popular methods. However, deposits MUST be paid via checking account only and must 
                  settle before transactions can be completed.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="buyer-3">
                <AccordionTrigger>What about delivery and distance?</AccordionTrigger>
                <AccordionContent>
                  Delivery or pickup within 250 miles is included. For distances beyond 250 miles, an 
                  additional $299.99 refundable deposit is required. This deposit is refunded within 7 
                  business days after successful delivery/pickup.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="buyer-4">
                <AccordionTrigger>What is your refund policy?</AccordionTrigger>
                <AccordionContent>
                  Refunds are ONLY allowed if the breeder sold a different breed than what was listed. 
                  Refund requests must be submitted within 72 hours of confirmed delivery or pickup. 
                  All other sales are final.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="buyer-5">
                <AccordionTrigger>What are breeding services?</AccordionTrigger>
                <AccordionContent>
                  For buyers seeking breeding services, we offer a $9.99/month per gender subscription 
                  with a $1,000 refundable deposit (goes towards breed cost). Access premium breeding 
                  partners with prices starting at $1,500 for small breeds up to $4,500 for rare breeds.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Payments & Deposits */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Payments & Deposits</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="payment-1">
                <AccordionTrigger>Why must deposits be paid via checking account?</AccordionTrigger>
                <AccordionContent>
                  Deposits must be paid via checking account to ensure proper settlement and verification. 
                  This protects both buyers and breeders by confirming that funds are available before 
                  transactions proceed. Settlement typically takes 3-5 business days.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment-2">
                <AccordionTrigger>When will I receive my refundable deposit back?</AccordionTrigger>
                <AccordionContent>
                  Breeder deposits are returned within 14 business days after completion of all active 
                  transactions. Distance deposits ($299.99) are refunded within 7 business days after 
                  successful delivery/pickup. Breeding service deposits ($1,000) are applied towards 
                  the breed cost.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="payment-3">
                <AccordionTrigger>Are subscription fees refundable?</AccordionTrigger>
                <AccordionContent>
                  No, monthly subscription fees are non-refundable under all circumstances. This includes 
                  subscription cancellations, account terminations, or dissatisfaction with service.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Policies & Rules */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Policies & Rules</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="policy-1">
                <AccordionTrigger>What is the off-platform sales penalty?</AccordionTrigger>
                <AccordionContent>
                  Both buyers and breeders will be charged a $499.99 penalty fee if they conduct sales 
                  outside of the PawDNA platform after initial contact was made through PawDNA. This 
                  ensures fair operation and protects users who lose platform protections in off-platform 
                  transactions.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="policy-2">
                <AccordionTrigger>Can my account be terminated?</AccordionTrigger>
                <AccordionContent>
                  Yes. Accounts can be terminated for violations of Terms of Service, off-platform sales, 
                  fraudulent activity, harassment, animal welfare violations, or multiple complaints. 
                  Upon termination, deposits may be forfeited and access to the platform is revoked.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="policy-3">
                <AccordionTrigger>What breeds can be listed?</AccordionTrigger>
                <AccordionContent>
                  All dog and cat breeds can be listed, provided they comply with local, state, and 
                  federal animal welfare laws. Breeders must maintain proper licensing and permits, 
                  and listings must include accurate breed information, health status, and vaccination 
                  records.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Technical Support */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Technical Support</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="tech-1">
                <AccordionTrigger>How do I contact support?</AccordionTrigger>
                <AccordionContent>
                  You can contact support through our platform messaging system once logged in. For 
                  urgent issues, visit the Contact section in the footer. We aim to respond to all 
                  inquiries within 24 hours.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-2">
                <AccordionTrigger>What if I forgot my password?</AccordionTrigger>
                <AccordionContent>
                  Click the "Forgot Password" link on the login page. Enter your email address and 
                  we\'ll send you instructions to reset your password. Make sure to check your spam 
                  folder if you don\'t see the email.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="tech-3">
                <AccordionTrigger>Can I update my profile information?</AccordionTrigger>
                <AccordionContent>
                  Yes! Log in to your account and navigate to your dashboard. You can update your 
                  location, contact information, and other profile details. Note that some changes 
                  may require verification before taking effect.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </section>

          {/* Still Have Questions? */}
          <section className="text-center bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-4">Still Have Questions?</h2>
            <p className="text-lg text-muted-foreground mb-6">
              Can\'t find the answer you\'re looking for? Our support team is here to help.
            </p>
            <a
              href="/auth"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Contact Support
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
