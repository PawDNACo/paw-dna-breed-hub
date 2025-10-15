import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useRef } from "react";
import html2pdf from "html2pdf.js";

export default function BusinessPlan() {
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = () => {
    if (!contentRef.current) return;

    const opt = {
      margin: 0.5,
      filename: 'PawDNA-Business-Plan.pdf',
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' as const }
    };

    html2pdf().set(opt).from(contentRef.current).save();
  };

  const financialData = [
    { year: "2025", turnover: "$0", profit: "$0" },
    { year: "2026", turnover: "$60,000", profit: "-$60,000" },
    { year: "2027", turnover: "$220,000", profit: "-$10,000" },
    { year: "2028", turnover: "$650,000", profit: "$80,000" },
    { year: "2029", turnover: "$1,150,000", profit: "$260,000" },
    { year: "2030", turnover: "$2,200,000", profit: "$620,000" },
    { year: "2031", turnover: "$3,600,000", profit: "$1,020,000" },
    { year: "2032", turnover: "$5,200,000", profit: "$1,560,000" },
    { year: "2033", turnover: "$7,000,000", profit: "$2,100,000" },
    { year: "2034", turnover: "$9,000,000", profit: "$2,700,000" },
    { year: "2035", turnover: "$10,500,000", profit: "$3,150,000" },
  ];

  const tags = [
    "Pet Tech", "DNA Verification", "Pet Matchmaking", "Marketplace",
    "Pet Adoption", "Breeder Tools", "Animal Welfare", "E-commerce",
    "Community Platform", "Crowdfunding"
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
          <div className="mb-6 flex justify-end">
            <Button onClick={handleDownloadPDF} size="lg" className="gap-2">
              <Download className="w-5 h-5" />
              Download PDF
            </Button>
          </div>
          <div ref={contentRef} className="space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                PawDNA Business Plan
              </h1>
              <p className="text-xl text-muted-foreground">
                Launch Date: December 1, 2025
              </p>
            </div>

            {/* Executive Summary */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Executive Summary</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-sm max-w-none dark:prose-invert">
                <p>
                  PawDNA is a pet-first tech marketplace launching December 1, 2025, that verifies genetics and health to match adopters, breeders, shelters, and pet owners. We combine consumer DNA kits, membership subscriptions, breeder verification tools, and a curated marketplace to solve trust and compatibility problems in pet adoption and breeding. Initial U.S. focus with global expansion potential. Seeking seed funding to complete product, scale user acquisition, and launch marketplace features.
                </p>
              </CardContent>
            </Card>

            {/* Problem and Opportunity */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Problem and Opportunity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">The Problem</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Online pet listings and informal marketplaces have low trust, leading to unsafe, unhealthy, or mismatched adoptions.</li>
                    <li>Breeders and shelters lack scalable verification and discovery tools that build buyer confidence.</li>
                    <li>Pet owners lack a centralized, science-backed platform that combines verification, matchmaking, and community.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">The Opportunity</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Pet industry is a large, growing market with major unmet needs in trust, verification, and scalable discovery.</li>
                    <li>PawDNA's verification layer (DNA + health) differentiates against classifieds and general marketplaces.</li>
                    <li>Multi-channel monetization (B2C kits and memberships, B2B breeder tools, marketplace transactions, enterprise contracts) creates diversified revenue and defensible economics.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Product and Technology */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Product and Technology</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Core Offerings</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Consumer DNA kit with lab integration and secure results ingestion.</li>
                    <li>Verified pet profiles: genetics, health history, temperament flags, and lineage where available.</li>
                    <li>Matchmaking engine that weights genetics, health, temperament, lifestyle, and location.</li>
                    <li>Marketplace for pet supplies, subscriptions, and branded products.</li>
                    <li>B2B dashboard for breeder/shelter verification, analytics, bulk kit ordering, and listing management.</li>
                    <li>Community features: profiles, messaging, forums, and reviews to increase retention.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Technology Stack & Data</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Web-first platform; mobile-responsive with eventual native app.</li>
                    <li>Secure data architecture with encrypted storage and role-based access.</li>
                    <li>API integrations to partner labs, payment processors, and shipping/logistics.</li>
                    <li>Machine learning roadmap: ranking, recommendations, fraud detection, and LTV prediction.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Market Analysis */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Market Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Market Size</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>U.S. pet industry &gt; $140B annually.</li>
                    <li>Bottom-up Serviceable Available Market (SAM) estimate: ~$2.06B (verified matching, breeder services, marketplace buyers).</li>
                    <li>Total Addressable Market (TAM) larger when including global pet owners, insurance, and veterinary services.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Customer Segments</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>B2C:</strong> Pet adopters and owners seeking verified matches and health insights.</li>
                    <li><strong>B2B:</strong> Responsible breeders and shelters seeking verified listings and trust signals.</li>
                    <li><strong>B2B2C/Enterprise:</strong> Pet service providers, municipal shelters, and larger agencies seeking verification workflows.</li>
                    <li><strong>Marketplace customers:</strong> Pet product buyers inclined to purchase trusted, curated goods.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Competitive Landscape</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>General marketplaces/classifieds (e.g., Craigslist, Facebook Marketplace) — low trust, not verification-led.</li>
                    <li>Pet marketplaces (e.g., Petfinder, Adopt-a-Pet) — shelter-focused, limited genetic verification.</li>
                    <li>Emerging pet tech players (DNA test companies) — single-product focus, not matchmaking + marketplace.</li>
                    <li><strong>Differentiator:</strong> unique combination of DNA verification, matchmaking algorithm, marketplace, and community.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Go-to-Market Strategy */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Go-to-Market Strategy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Launch Phase (0–12 months)</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Launch date: December 1, 2025.</li>
                    <li>Crowdfunding campaign to fund initial kit run and secure early adopters.</li>
                    <li>Social media activation (Instagram, TikTok, YouTube) with storytelling, breeder spotlights, and user testimonials.</li>
                    <li>Local pilot partnerships with shelters and reputable breeders for case studies and co-promotion.</li>
                    <li>PR push targeting pet and local press to drive waitlist signups.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Growth Phase (12–36 months)</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Onboard breeders and shelters via B2B outreach and incentives (first-year discounts; referral credits).</li>
                    <li>Introduce marketplace MVP with high-margin branded products and subscription boxes.</li>
                    <li>Launch referral and ambassador programs to lower CAC.</li>
                    <li>Implement paid digital campaigns focused on lookalike audiences and interest targets.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Scale Phase (36+ months)</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Expand geographically across the U.S. and launch international pilots.</li>
                    <li>Negotiate enterprise and government contracts with municipal shelters and rescue programs.</li>
                    <li>Add revenue streams: advertising, data services, white-label verification for third-party platforms.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Traction & Milestones */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Traction & Milestones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Current Status (pre-launch)</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Website near completion; launch planned Dec 1, 2025.</li>
                    <li>Active social strategy and content calendar in development.</li>
                    <li>Crowdfunding campaign assets in creation; local outreach underway with friends, family, and community partners.</li>
                    <li>Pipeline development: early conversations with breeders and local shelters for pilot onboarding.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">12–24 Month Milestones</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Achieve 10,000 registered users and 500 verified breeder/shelter profiles.</li>
                    <li>Fulfill initial DNA kit orders and complete first 3,000 verifications.</li>
                    <li>Launch marketplace MVP and achieve marketplace GMV targets.</li>
                    <li>Secure at least two small enterprise or municipal pilots.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Business Model & Monetization */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Business Model & Monetization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Revenue Streams</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>DNA kit sales (one-time product).</li>
                    <li>Subscription memberships (monthly/annual tiers with perks and match credits).</li>
                    <li>B2B subscriptions and verification bundles for breeders and shelters.</li>
                    <li>Marketplace transaction fees and product margins.</li>
                    <li>Enterprise contracts and white-label services.</li>
                    <li>Advertising and sponsored placements as community scale grows.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Pricing (indicative)</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>DNA kit + processing: $79–$129 per kit.</li>
                    <li>Breeder, Buyer, Rehomer subscription: $2.99–$14.99 / month or $35–$180 / year depending on tier and features.</li>
                    <li>Marketplace transaction fee: 8–12% or fixed commission per sale.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Team and Operations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Team and Operations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Core Team</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li><strong>Founder & CEO:</strong> Chelsey Morgan — GTM, branding, development, and product vision.</li>
                    <li><strong>Lead Engineer:</strong> Chelsey Morgan - Platform, data architecture.</li>
                    <li><strong>Veterinary/Genetics Advisor(s):</strong> Scientific validity and lab partnerships.</li>
                    <li><strong>Head of Growth:</strong> Social, content, and acquisition strategy.</li>
                    <li><strong>Head of Partnerships & Sales:</strong> B2B onboarding, shelter relationships.</li>
                    <li><strong>Operations & Fulfillment Lead:</strong> Kit logistics and customer support.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Hiring Roadmap</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Hire product manager, and operations specialist in first 6 months post-launch.</li>
                    <li>Build out sales team for B2B outreach during months 6–18.</li>
                    <li>Add data scientist and marketplace manager by year 2.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Financials */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Financials</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3">Assumptions (key)</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Launch date: December 1, 2025; 2025 treated as pre-revenue year.</li>
                    <li>Initial crowdfunding funds covers partial kit manufacturing and launch marketing.</li>
                    <li>CAC initially high during launch; declines with referral programs and partnerships.</li>
                    <li>Average DNA kit price: $99; gross margin after lab costs and fulfillment ~40%.</li>
                    <li>Membership adoption: 5–10% of registered users within first 18 months.</li>
                    <li>B2B onboarding ramp: slow first year, accelerating in year 2–3.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3">Projected Turnover and Profit (Annual)</h3>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="font-bold">Year</TableHead>
                          <TableHead className="font-bold">Turnover</TableHead>
                          <TableHead className="font-bold">Profit</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {financialData.map((row) => (
                          <TableRow key={row.year}>
                            <TableCell className="font-medium">{row.year}</TableCell>
                            <TableCell>{row.turnover}</TableCell>
                            <TableCell className={row.profit.startsWith('-') ? 'text-destructive' : 'text-green-600 dark:text-green-400'}>
                              {row.profit}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Revenue Breakdown (example for 2028)</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>DNA kit sales: 3,000 kits × $99 = $297,000</li>
                    <li>Memberships & fees: 7,000 users × $30 avg/year = $210,000</li>
                    <li>B2B subscriptions & services: $80,000</li>
                    <li>Marketplace sales (net revenue): $63,000</li>
                    <li><strong>Total 2028 turnover estimate ≈ $650,000</strong></li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Cost Structure (high-level)</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>COGS: lab processing, kit materials, fulfillment, and shipping.</li>
                    <li>Ops & Support: customer service, returns, and QA.</li>
                    <li>Tech & Product: hosting, dev, analytics.</li>
                    <li>Sales & Marketing: paid acquisition, content, PR.</li>
                    <li>G&A: legal, finance, office, insurance.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Break-even & Cash Needs</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Projected break-even: 2029–2030 timeframe depending on speed of B2B adoption and marketplace monetization.</li>
                    <li>Seed funding: Self funded, grants, crowdfunding, and possible loans to cover product completion, kit production, marketing, and operational runway through initial scale. Equity offer: 10–15% depending on investor value-add.</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Use of Funds</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Product development & engineering: 25%</li>
                    <li>DNA kit manufacturing & lab setup: 20%</li>
                    <li>Marketing & user acquisition (launch + 12 months): 25%</li>
                    <li>Operations & fulfillment: 10%</li>
                    <li>B2B sales & partnerships: 10%</li>
                    <li>Legal, compliance, insurance, misc: 10%</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Risks and Mitigations */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Risks and Mitigations</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Operational Risks</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Lab delays or supply chain issues — Mitigate by contracting multiple vetted labs and phased inventory planning.</li>
                    <li>Data privacy and regulatory compliance — Mitigate with strong encryption, clear consent flows, and vendor contracts that meet best-practice standards.</li>
                    <li>Higher-than-expected CAC — Use localized partnerships, referral incentives, and PR to reduce paid CAC.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Market Risks</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Slow breeder or shelter adoption — Offer pilot programs, subsidized early tiers, and testimonials to accelerate trust.</li>
                    <li>Competitive product entrants — Maintain differentiation via verification depth, community, and marketplace integration.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Financial Risks</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Cash runway constraints — Prioritize runway management, staged hiring, and milestone-based spending; consider convertible notes or SAFE instruments to bridge rounds.</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Go-forward Plan & Funding Ask */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Go-forward Plan & Funding Ask</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Immediate Priorities (0–6 months)</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Finalize website and checkout flows.</li>
                    <li>Execute crowdfunding campaign and early kit fulfillment plan.</li>
                    <li>Complete lab partnerships and test end-to-end kit processing.</li>
                    <li>Launch social campaigns and initial PR.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">6–18 Months</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Onboard breeders/shelters and B2B pilot customers.</li>
                    <li>Launch marketplace MVP and subscription tiers.</li>
                    <li>Optimize product/market fit through feedback loops.</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Funding</h3>
                  <p className="text-muted-foreground">
                    Self funded, grants, crowdfunding, and possible loans seed to cover product completion, kit production, marketing, and operational runway through initial scale. Equity offer: 10–15% depending on investor value-add.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Appendix */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Appendix</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-3">10 Suggested Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Key Metrics to Track (first 24 months)</h3>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>Registered users, verified profiles, and active monthly users (MAU)</li>
                    <li>DNA kits sold and verification completion rate</li>
                    <li>Membership conversion rate and churn</li>
                    <li>B2B signups, ARPA (average revenue per account) for breeders/shelters</li>
                    <li>Marketplace GMV and take rate</li>
                    <li>Customer acquisition cost (CAC) and lifetime value (LTV)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
