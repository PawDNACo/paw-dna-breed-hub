import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  size: string;
  age_months: number;
  price: number;
  listing_type: string;
  vaccinated: boolean;
}

const Browse = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const { data, error } = await supabase
        .from("pets")
        .select("*")
        .eq("available", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPets(data || []);
    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Browse <span className="bg-gradient-hero bg-clip-text text-transparent">Available Pets</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover quality breeding partners and adorable puppies & kittens
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : pets.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground">No pets available at the moment. Check back soon!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <Card key={pet.id} className="hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl">{pet.name}</CardTitle>
                      <Badge variant={pet.species === "dog" ? "default" : "secondary"}>
                        {pet.species}
                      </Badge>
                    </div>
                    <CardDescription>{pet.breed}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm mb-4">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gender:</span>
                        <span className="font-medium capitalize">{pet.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Size:</span>
                        <span className="font-medium capitalize">{pet.size}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Age:</span>
                        <span className="font-medium">{Math.floor(pet.age_months / 12)}y {pet.age_months % 12}m</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Vaccinated:</span>
                        <span className="font-medium">{pet.vaccinated ? "Yes" : "No"}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          ${pet.price?.toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {pet.listing_type}
                        </div>
                      </div>
                      <Button 
                        variant="default"
                        onClick={() => navigate(`/pet/${pet.id}`)}
                      >
                        View Details
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Browse;
