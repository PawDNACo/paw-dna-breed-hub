import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2, Heart } from "lucide-react";
import { toast } from "sonner";

interface Favorite {
  id: string;
  favorited_id: string;
  favorited_type: string;
  created_at: string;
  pet?: {
    id: string;
    name: string;
    species: string;
    breed: string;
    age_months: number;
    price: number;
    image_url?: string;
    city?: string;
    state?: string;
  };
}

const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please log in to view favorites");
        navigate("/login");
        return;
      }

      // Get favorites with pet details
      const { data: favData, error: favError } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .eq("favorited_type", "pet")
        .order("created_at", { ascending: false });

      if (favError) throw favError;

      // Fetch pet details for each favorite
      const favoritesWithPets = await Promise.all(
        (favData || []).map(async (fav) => {
          const { data: petData } = await supabase
            .from("public_pet_listings")
            .select("id, name, species, breed, age_months, price, image_url, city, state")
            .eq("id", fav.favorited_id)
            .single();

          return {
            ...fav,
            pet: petData
          };
        })
      );

      setFavorites(favoritesWithPets.filter(f => f.pet !== null));
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFavorite = async (favoriteId: string) => {
    try {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", favoriteId);

      if (error) throw error;

      setFavorites(prev => prev.filter(f => f.id !== favoriteId));
      toast.success("Removed from favorites");
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove favorite");
    }
  };

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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              Your <span className="bg-gradient-hero bg-clip-text text-transparent">Favorites</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              {favorites.length} {favorites.length === 1 ? "pet" : "pets"} saved
            </p>
          </div>

          {favorites.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg mb-4">No favorites yet</p>
                <Button onClick={() => navigate("/browse")}>
                  Start Browsing
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite) => (
                favorite.pet && (
                  <Card key={favorite.id} className="hover:shadow-glow transition-all duration-300">
                    {favorite.pet.image_url && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={favorite.pet.image_url} 
                          alt={favorite.pet.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <CardTitle className="text-xl">{favorite.pet.name}</CardTitle>
                          <CardDescription>{favorite.pet.breed}</CardDescription>
                        </div>
                        <Badge variant={favorite.pet.species === "dog" ? "default" : "secondary"}>
                          {favorite.pet.species}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm mb-4">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Age:</span>
                          <span className="font-medium">
                            {Math.floor(favorite.pet.age_months / 12)}y {favorite.pet.age_months % 12}m
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price:</span>
                          <span className="font-medium">${favorite.pet.price}</span>
                        </div>
                        {favorite.pet.city && favorite.pet.state && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Location:</span>
                            <span className="font-medium">
                              {favorite.pet.city}, {favorite.pet.state}
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="flex gap-2">
                        <Button 
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => navigate(`/pet/${favorite.pet?.id}`)}
                        >
                          View Details
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveFavorite(favorite.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;