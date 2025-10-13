import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, X, Star, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { validateCity, validateState, validateSpecies } from "@/utils/inputValidation";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age_months: number;
  price: number;
  image_url?: string;
  city?: string;
  state?: string;
}

const SwipeMatch = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [pets, setPets] = useState<Pet[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swiping, setSwiping] = useState(false);

  useEffect(() => {
    fetchPets();
  }, [searchParams]);

  const fetchPets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to use swipe matching");
        navigate("/login");
        return;
      }

      // Get already swiped pet IDs to exclude them
      const { data: swipedData } = await supabase
        .from("swipes")
        .select("swiped_id")
        .eq("swiper_id", user.id)
        .eq("swiped_type", "pet");

      const swipedIds = swipedData?.map(s => s.swiped_id) || [];

      // Build query based on search params
      let query = supabase
        .from("public_pet_listings")
        .select("id, name, species, breed, age_months, price, image_url, city, state");

      // SECURITY: Validate and sanitize all user inputs to prevent SQL injection
      const speciesParam = searchParams.get("species");
      const validatedSpecies = validateSpecies(speciesParam);
      if (validatedSpecies && validatedSpecies !== "all") {
        query = query.eq("species", validatedSpecies);
      }

      const cityParam = searchParams.get("city");
      const validatedCity = validateCity(cityParam);
      if (validatedCity) {
        query = query.ilike("city", `%${validatedCity}%`);
      }

      const stateParam = searchParams.get("state");
      const validatedState = validateState(stateParam);
      if (validatedState) {
        query = query.eq("state", validatedState);
      }

      const breeds = searchParams.get("breeds");
      if (breeds) {
        query = query.in("breed", breeds.split(","));
      }

      if (searchParams.get("special") === "true") {
        query = query.eq("is_special_breed", true);
      }

      const size = searchParams.get("small") === "true" ? "small" 
        : searchParams.get("medium") === "true" ? "medium"
        : searchParams.get("large") === "true" ? "large" : null;
      
      if (size) {
        query = query.eq("size", size);
      }

      // Exclude already swiped pets
      if (swipedIds.length > 0) {
        query = query.not("id", "in", `(${swipedIds.join(",")})`);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;

      setPets(data || []);
    } catch (error) {
      console.error("Error fetching pets:", error);
      toast.error("Failed to load pets");
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction: "left" | "right" | "super") => {
    if (swiping || currentIndex >= pets.length) return;
    
    setSwiping(true);
    const currentPet = pets[currentIndex];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to continue");
        navigate("/login");
        return;
      }

      // Record the swipe
      const { error: swipeError } = await supabase
        .from("swipes")
        .insert({
          swiper_id: user.id,
          swiped_id: currentPet.id,
          swiped_type: "pet",
          swipe_direction: direction
        });

      if (swipeError) throw swipeError;

      // If right swipe or super like, check for match
      if (direction === "right" || direction === "super") {
        // Check if pet owner has also swiped right on this user
        const { data: ownerSwipe } = await supabase
          .from("pets")
          .select("owner_id")
          .eq("id", currentPet.id)
          .single();

        if (ownerSwipe) {
          const { data: reciprocalSwipe } = await supabase
            .from("swipes")
            .select("*")
            .eq("swiper_id", ownerSwipe.owner_id)
            .eq("swiped_id", user.id)
            .eq("swiped_type", "user")
            .eq("swipe_direction", "right")
            .maybeSingle();

          if (reciprocalSwipe) {
            // Create match
            await supabase.from("matches").insert({
              user1_id: user.id,
              user2_id: ownerSwipe.owner_id,
              pet_id: currentPet.id,
              match_type: "user_pet"
            });

            toast.success("🎉 It's a Match! You can now chat with the breeder!");
          }
        }

        if (direction === "super") {
          toast.success("⭐ Super Like sent!");
        }
      }

      // Move to next pet
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error("Error processing swipe:", error);
      toast.error("Failed to process swipe");
    } finally {
      setSwiping(false);
    }
  };

  const handleAddToFavorites = async () => {
    if (currentIndex >= pets.length) return;
    
    const currentPet = pets[currentIndex];

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to add favorites");
        return;
      }

      const { error } = await supabase
        .from("favorites")
        .insert({
          user_id: user.id,
          favorited_id: currentPet.id,
          favorited_type: "pet"
        });

      if (error) {
        if (error.code === "23505") {
          toast.info("Already in favorites");
        } else {
          throw error;
        }
      } else {
        toast.success("Added to favorites!");
      }
    } catch (error) {
      console.error("Error adding to favorites:", error);
      toast.error("Failed to add to favorites");
    }
  };

  const currentPet = pets[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <Button variant="ghost" onClick={() => navigate("/browse")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Browse
            </Button>
            <Button variant="outline" onClick={() => navigate("/favorites")}>
              View Favorites
            </Button>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Find Your <span className="bg-gradient-hero bg-clip-text text-transparent">Perfect Match</span>
            </h1>
            <p className="text-muted-foreground">
              {pets.length - currentIndex} pets remaining
            </p>
          </div>

          {currentIndex >= pets.length ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-lg mb-4">No more pets to show!</p>
                <Button onClick={() => navigate("/browse")}>
                  Adjust Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="relative">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPet.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="overflow-hidden shadow-elegant">
                    {currentPet.image_url && (
                      <div className="h-96 overflow-hidden">
                        <img 
                          src={currentPet.image_url} 
                          alt={currentPet.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl">{currentPet.name}</CardTitle>
                          <CardDescription className="text-lg mt-1">
                            {currentPet.breed}
                          </CardDescription>
                        </div>
                        <Badge variant={currentPet.species === "dog" ? "default" : "secondary"}>
                          {currentPet.species}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3 mb-6">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Age:</span>
                          <span className="font-medium">
                            {Math.floor(currentPet.age_months / 12)}y {currentPet.age_months % 12}m
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Price:</span>
                          <span className="font-medium">${currentPet.price}</span>
                        </div>
                        {currentPet.city && currentPet.state && (
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium">{currentPet.city}, {currentPet.state}</span>
                          </div>
                        )}
                      </div>

                      {/* Swipe Actions */}
                      <div className="flex items-center justify-center gap-4">
                        <Button
                          variant="outline"
                          size="lg"
                          className="rounded-full h-16 w-16"
                          onClick={() => handleSwipe("left")}
                          disabled={swiping}
                        >
                          <X className="h-8 w-8 text-destructive" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="lg"
                          className="rounded-full h-12 w-12"
                          onClick={handleAddToFavorites}
                        >
                          <Star className="h-6 w-6 text-yellow-500" />
                        </Button>
                        
                        <Button
                          variant="default"
                          size="lg"
                          className="rounded-full h-16 w-16"
                          onClick={() => handleSwipe("right")}
                          disabled={swiping}
                        >
                          <Heart className="h-8 w-8" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="lg"
                          className="rounded-full h-12 w-12 border-primary"
                          onClick={() => handleSwipe("super")}
                          disabled={swiping}
                        >
                          <Star className="h-6 w-6 text-primary" />
                        </Button>
                      </div>

                      <div className="mt-6 text-center text-sm text-muted-foreground">
                        <p><X className="inline h-4 w-4 mr-1" />Pass • <Heart className="inline h-4 w-4 mr-1" />Like • <Star className="inline h-4 w-4 mr-1" />Super Like</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SwipeMatch;