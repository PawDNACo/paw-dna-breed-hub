import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

export default function GeneratePetListings() {
  const [count, setCount] = useState(50);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (count < 1 || count > 500) {
      toast({
        title: "Invalid Count",
        description: "Please enter a number between 1 and 500",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setResult(null);

    try {
      // Generate in batches of 100 to avoid timeouts
      const batchSize = 100;
      const batches = Math.ceil(count / batchSize);
      let totalGenerated = 0;
      let totalFailed = 0;
      let allPets: any[] = [];

      for (let i = 0; i < batches; i++) {
        const batchCount = Math.min(batchSize, count - (i * batchSize));
        console.log(`Starting batch ${i + 1}/${batches}: generating ${batchCount} pets`);

        const { data, error } = await supabase.functions.invoke("generate-pet-listings", {
          body: { count: batchCount }
        });

        if (error) throw error;

        totalGenerated += data.generated || 0;
        totalFailed += data.failed || 0;
        allPets = [...allPets, ...(data.pets || [])];

        setProgress(((i + 1) / batches) * 100);

        toast({
          title: `Batch ${i + 1}/${batches} Complete`,
          description: `Generated ${data.generated} pets in this batch`,
        });
      }

      setResult({
        success: true,
        generated: totalGenerated,
        failed: totalFailed,
        total: count,
        pets: allPets
      });

      toast({
        title: "Generation Complete!",
        description: `Successfully generated ${totalGenerated} pet listings`,
      });

    } catch (error: any) {
      console.error("Generation error:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate pet listings",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Generate AI Pet Listings</CardTitle>
              <CardDescription>
                Create unique pet listings with AI-generated images and descriptions.
                Each pet will have realistic breed information, photos, and details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This feature uses AI to generate original pet images and descriptions.
                  Generation takes approximately 1-2 seconds per pet. Large batches may take several minutes.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="count">Number of Listings (1-500)</Label>
                <Input
                  id="count"
                  type="number"
                  min="1"
                  max="500"
                  value={count}
                  onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  disabled={isGenerating}
                />
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">
                      Generating pet listings... {Math.round(progress)}%
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Listings"
                )}
              </Button>

              {result && (
                <Alert className={result.success ? "border-green-500" : "border-red-500"}>
                  {result.success ? (
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                  ) : (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-semibold">Generation Complete</p>
                      <div className="grid grid-cols-3 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Total:</span>
                          <span className="ml-2 font-medium">{result.total}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Generated:</span>
                          <span className="ml-2 font-medium text-green-600">{result.generated}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Failed:</span>
                          <span className="ml-2 font-medium text-red-600">{result.failed}</span>
                        </div>
                      </div>
                      {result.pets && result.pets.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground mb-2">Sample Generated Pets:</p>
                          <ul className="text-sm space-y-1">
                            {result.pets.slice(0, 5).map((pet: any, i: number) => (
                              <li key={i}>
                                • {pet.name} - {pet.breed} ({pet.species})
                              </li>
                            ))}
                            {result.pets.length > 5 && (
                              <li className="text-muted-foreground">
                                ... and {result.pets.length - 5} more
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="text-sm text-muted-foreground space-y-1">
                <p>ℹ️ All images are 100% AI-generated and original</p>
                <p>ℹ️ Descriptions are created using AI based on breed characteristics</p>
                <p>ℹ️ Pet details (age, gender, location) are randomized for variety</p>
                <p>ℹ️ Generation is done in batches of 100 for reliability</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}