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
              Sorry to see you go
            </h1>
          </div>
          
          <p className="text-lg text-muted-foreground leading-relaxed">
            We're saddened to hear you canceled your donation. Your support helped fuel life-changing genetic verification and safe matches for pets in need, and your absence will be felt by the animals and people who rely on PawDNA. If circumstances change, we'd be grateful to welcome you back.
          </p>

          <div className="pt-4">
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

export default CancellationGoodbye;
