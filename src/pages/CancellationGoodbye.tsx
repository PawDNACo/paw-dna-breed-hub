import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";

const CancellationGoodbye = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-2xl space-y-8">
          <div className="space-y-4">
            <div className="text-8xl mb-6">😢</div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              We noticed your donation was canceled.
            </h1>
          </div>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            We're saddened by this...
            That funding could have directly supported genetic testing and care that makes adoptions safer; losing it reduces our capacity to vet matches and protect animals. If you can reconsider, even a small gift helps keep critical services running.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="default" 
              size="lg"
              onClick={() => window.open("https://www.paypal.com/donate/?hosted_button_id=QLGMH2XWPJKQ4", "_blank")}
            >
              Changed My Mind
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = "/"}
            >
              Return to Home
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CancellationGoodbye;
