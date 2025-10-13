import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Package } from "lucide-react";

export default function Marketplace() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="text-center min-h-[60vh] flex flex-col items-center justify-center">
            <Package className="w-24 h-24 text-primary mb-6" />
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              PawDNA Marketplace
            </h1>
            <p className="text-xl text-muted-foreground">
              Coming Soon...
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
