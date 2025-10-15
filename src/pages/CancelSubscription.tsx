import { Footer } from "@/components/Footer";
import { Navigation } from "@/components/Navigation";
import { Button } from "@/components/ui/button";

const CancelSubscription = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="text-center max-w-2xl space-y-8">
          <div className="space-y-4">
            <div className="text-8xl mb-6">😢</div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground">
              Sorry to see you go
            </h1>
          </div>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            Thank you for the support you've given so far. We're saddened by your cancellation and would love to understand if there's anything we can address. If you'd like lower-cost options to stay involved or to discuss next steps, we're here to help.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => window.location.href = "/subscribe-pricing"}
            >
              Resubscribe
            </Button>
            <Button 
              variant="default" 
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

export default CancelSubscription;
