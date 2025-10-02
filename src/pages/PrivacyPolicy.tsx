import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8 bg-gradient-hero bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <div className="prose prose-lg max-w-none space-y-6">
            <section>
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <p>
                PawDNA collects information necessary to provide our marketplace services, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Account information (name, email, location)</li>
                <li>Pet listing details (breed, age, health records, photos)</li>
                <li>Payment and transaction information</li>
                <li>Communication between buyers and breeders</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
              <p>
                We use collected information to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Facilitate transactions between breeders and buyers</li>
                <li>Process payments and maintain financial records</li>
                <li>Provide customer support and resolve disputes</li>
                <li>Improve platform features and user experience</li>
                <li>Send important updates about transactions and account status</li>
                <li>Ensure compliance with our Terms of Service</li>
                <li>Prevent fraud and maintain platform security</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
              <p>
                We share your information only in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>With other users as necessary to complete transactions</li>
                <li>With payment processors to facilitate transactions</li>
                <li>With service providers who assist in platform operations</li>
                <li>When required by law or legal process</li>
                <li>To protect the rights and safety of PawDNA and our users</li>
              </ul>
              <p className="mt-4">
                We never sell your personal information to third parties for marketing purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <p>
                We implement industry-standard security measures to protect your information, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Encrypted data transmission (SSL/TLS)</li>
                <li>Secure database storage with access controls</li>
                <li>Regular security audits and updates</li>
                <li>Employee training on data protection</li>
              </ul>
              <p className="mt-4">
                However, no method of transmission over the internet is 100% secure. We cannot guarantee 
                absolute security but strive to use commercially acceptable means to protect your data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
              <p>
                You have the right to:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your account and data</li>
                <li>Opt out of marketing communications</li>
                <li>Export your data in a portable format</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
              <p>
                We use cookies and similar technologies to enhance your experience, including:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Essential cookies for platform functionality</li>
                <li>Analytics cookies to understand usage patterns</li>
                <li>Preference cookies to remember your settings</li>
              </ul>
              <p className="mt-4">
                You can control cookie preferences through your browser settings.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">7. Children's Privacy</h2>
              <p>
                PawDNA is not intended for users under 18 years of age. We do not knowingly collect 
                information from children. If we become aware that a child has provided us with personal 
                information, we will take steps to delete such information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">8. Data Retention</h2>
              <p>
                We retain your information for as long as necessary to provide our services and comply 
                with legal obligations. Transaction records may be retained for up to 7 years for 
                financial and legal compliance purposes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">9. International Users</h2>
              <p>
                If you access PawDNA from outside the United States, your information may be transferred 
                to and processed in the United States. By using our services, you consent to such transfers.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">10. Changes to Privacy Policy</h2>
              <p>
                We may update this Privacy Policy periodically. We will notify users of significant changes 
                via email or platform notification. Continued use after changes constitutes acceptance of 
                the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
              <p>
                For questions about this Privacy Policy or to exercise your rights, please contact us 
                through our support channels.
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
