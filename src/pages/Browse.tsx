import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRight, Search } from "lucide-react";

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
  city?: string;
  state?: string;
  zip_code?: string;
  latitude?: number;
  longitude?: number;
}

const Browse = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchZip, setSearchZip] = useState("");
  const [searchRadius, setSearchRadius] = useState("250");
  const [searchSpecies, setSearchSpecies] = useState("");
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      let query = supabase
        .from("pets")
        .select("*")
        .eq("available", true);

      if (searchSpecies) {
        query = query.eq("species", searchSpecies);
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;

      let filteredPets = data || [];
      
      // Filter by distance if user location is set
      if (userLocation && filteredPets.length > 0) {
        filteredPets = filteredPets.filter((pet) => {
          if (!pet.latitude || !pet.longitude) return true;
          const distance = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            pet.latitude,
            pet.longitude
          );
          return distance <= parseInt(searchRadius);
        });
      }

      setPets(filteredPets);
    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const handleLocationSearch = async () => {
    if (!searchZip || searchZip.length !== 5) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${searchZip}`);
      if (!response.ok) throw new Error("ZIP code not found");

      const data = await response.json();
      const place = data.places[0];
      
      setUserLocation({
        latitude: parseFloat(place.latitude),
        longitude: parseFloat(place.longitude),
      });

      await fetchPets();
    } catch (error) {
      console.error("Error geocoding ZIP:", error);
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

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search Filters</CardTitle>
              <CardDescription>Find pets within your area (up to 250 miles)</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="zip">Your ZIP Code</Label>
                  <div className="flex gap-2">
                    <Input
                      id="zip"
                      placeholder="12345"
                      maxLength={5}
                      value={searchZip}
                      onChange={(e) => setSearchZip(e.target.value)}
                    />
                    <Button onClick={handleLocationSearch}>
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="radius">Search Radius (miles)</Label>
                  <Select value={searchRadius} onValueChange={setSearchRadius}>
                    <SelectTrigger id="radius">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="50">50 miles</SelectItem>
                      <SelectItem value="100">100 miles</SelectItem>
                      <SelectItem value="150">150 miles</SelectItem>
                      <SelectItem value="200">200 miles</SelectItem>
                      <SelectItem value="250">250 miles</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="species">Species</Label>
                  <Select value={searchSpecies} onValueChange={setSearchSpecies}>
                    <SelectTrigger id="species">
                      <SelectValue placeholder="All species" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All species</SelectItem>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                      <SelectItem value="bird">Bird</SelectItem>
                      <SelectItem value="reptile">Reptile</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={fetchPets} className="w-full">
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

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
                      {pet.city && pet.state && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Location:</span>
                          <span className="font-medium">{pet.city}, {pet.state}</span>
                        </div>
                      )}
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
