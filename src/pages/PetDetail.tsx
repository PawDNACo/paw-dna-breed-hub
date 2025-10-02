import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { ShareButton } from "@/components/social/ShareButton";
import { useVerificationCheck } from "@/hooks/useVerificationCheck";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  size: string;
  age_months: number;
  description: string;
  price: number;
  listing_type: string;
  vaccinated: boolean;
  image_url?: string;
}

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [hasSubscription, setHasSubscription] = useState(false);
  const { isVerified, requireVerification } = useVerificationCheck();

  useEffect(() => {
    fetchPetDetails();
    checkSubscription();
  }, [id]);

  const fetchPetDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setPet(data);
    } catch (error) {
      console.error("Error fetching pet:", error);
      toast.error("Failed to load pet details");
    } finally {
      setLoading(false);
    }
  };

  const checkSubscription = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      if (error) throw error;
      setHasSubscription(!!data);
    } catch (error) {
      console.error("Error checking subscription:", error);
    }
  };

  const handleContact = () => {
    // Check verification first
    if (!requireVerification("contact breeders")) {
      return;
    }

    if (!hasSubscription) {
      toast.error("Subscribe to contact breeders", {
        description: "You need an active subscription to hire or sell pets.",
      });
      return;
    }
    toast.success("Contact feature coming soon!");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!pet) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h2 className="text-2xl font-bold mb-4">Pet not found</h2>
          <Button onClick={() => navigate("/browse")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/browse")}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Browse
          </Button>

          <Card className="overflow-hidden">
            <CardHeader className="bg-gradient-card pb-8">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-3xl mb-2">{pet.name}</CardTitle>
                  <CardDescription className="text-lg">{pet.breed}</CardDescription>
                </div>
                <div className="flex items-center gap-2">
                  <ShareButton 
                    petId={pet.id} 
                    petName={pet.name}
                    petImage={pet.image_url}
                  />
                  <Badge variant={pet.species === "dog" ? "default" : "secondary"} className="text-base px-4 py-1">
                    {pet.species}
                  </Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-6 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold mb-2">About {pet.name}</h3>
                <p className="text-muted-foreground">{pet.description}</p>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Gender</div>
                  <div className="font-medium capitalize">{pet.gender}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Size</div>
                  <div className="font-medium capitalize">{pet.size}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Age</div>
                  <div className="font-medium">
                    {Math.floor(pet.age_months / 12)}y {pet.age_months % 12}m
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Listing Type</div>
                  <div className="font-medium capitalize">{pet.listing_type}</div>
                </div>
              </div>

              {/* Features */}
              {pet.vaccinated && (
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Fully Vaccinated</span>
                </div>
              )}

              {/* Price & Action */}
              <div className="flex items-center justify-between pt-6 border-t">
                <div>
                  <div className="text-3xl font-bold text-primary">
                    ${pet.price?.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {pet.listing_type === "hire" ? "Breeding Fee" : "Purchase Price"}
                  </div>
                </div>
                <Button 
                  variant="hero" 
                  size="lg"
                  onClick={handleContact}
                >
                  Contact Breeder
                </Button>
              </div>

              {!hasSubscription && (
                <Card className="bg-muted/50 border-primary/20">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground mb-4">
                      🔒 Subscribe to contact breeders and access hiring/selling features
                    </p>
                    <Button variant="default" onClick={() => navigate("/#pricing")}>
                      View Pricing Plans
                    </Button>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PetDetail;
