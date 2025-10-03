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
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight } from "lucide-react";

const DOG_BREEDS = [
  "Labrador Retriever", "German Shepherd", "Golden Retriever", "French Bulldog",
  "Bulldog", "Poodle", "Beagle", "Rottweiler", "Yorkshire Terrier", "German Shorthaired Pointer",
  "Boxer", "Dachshund", "Pembroke Welsh Corgi", "Siberian Husky", "Australian Shepherd",
  "Great Dane", "Doberman Pinscher", "Cavalier King Charles Spaniel", "Miniature Schnauzer",
  "Shih Tzu", "Boston Terrier", "Pomeranian", "Havanese", "Shetland Sheepdog", "Brittany",
  "English Springer Spaniel", "Mastiff", "Cocker Spaniel", "Border Collie", "Chihuahua"
];

const CAT_BREEDS = [
  "Persian", "Maine Coon", "Ragdoll", "British Shorthair", "Siamese",
  "Abyssinian", "Bengal", "Birman", "American Shorthair", "Scottish Fold",
  "Sphynx", "Devon Rex", "Russian Blue", "Exotic Shorthair", "Norwegian Forest Cat",
  "Oriental", "Siberian", "Burmese", "Tonkinese", "Cornish Rex"
];

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
  // Removed sensitive location fields for privacy protection
  // zip_code, county, latitude, longitude are not displayed to public
}

const Browse = () => {
  const navigate = useNavigate();
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchSpecies, setSearchSpecies] = useState("all");
  const [searchCity, setSearchCity] = useState("");
  const [searchState, setSearchState] = useState("");
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [showSpecialBreeds, setShowSpecialBreeds] = useState(false);
  const [showSmallBreeds, setShowSmallBreeds] = useState(false);
  const [showMediumBreeds, setShowMediumBreeds] = useState(false);
  const [showLargeBreeds, setShowLargeBreeds] = useState(false);

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      // SECURITY: Use public_pet_listings view which excludes exact coordinates
      // This protects breeders from stalkers by only showing city/state
      let query = supabase
        .from("public_pet_listings")
        .select("id, name, species, breed, gender, size, age_months, price, listing_type, vaccinated, city, state, image_url");

      if (searchSpecies && searchSpecies !== "all") {
        query = query.eq("species", searchSpecies);
      }

      if (searchCity) {
        query = query.ilike("city", `%${searchCity}%`);
      }

      if (searchState) {
        query = query.ilike("state", `%${searchState}%`);
      }

      if (selectedBreeds.length > 0) {
        query = query.in("breed", selectedBreeds);
      }

      if (showSpecialBreeds) {
        query = query.eq("is_special_breed", true);
      }

      if (showSmallBreeds) {
        query = query.eq("size", "small");
      }

      if (showMediumBreeds) {
        query = query.eq("size", "medium");
      }

      if (showLargeBreeds) {
        query = query.eq("size", "large");
      }

      const { data, error } = await query.order("created_at", { ascending: false });

      if (error) throw error;

      setPets(data || []);
    } catch (error) {
      console.error("Error fetching pets:", error);
    } finally {
      setLoading(false);
    }
  };


  const handleBreedToggle = (breed: string) => {
    setSelectedBreeds(prev => 
      prev.includes(breed) 
        ? prev.filter(b => b !== breed)
        : [...prev, breed]
    );
  };

  const getAvailableBreeds = () => {
    if (searchSpecies === "dog") return DOG_BREEDS;
    if (searchSpecies === "cat") return CAT_BREEDS;
    return [...DOG_BREEDS, ...CAT_BREEDS];
  };

  const handleSpeciesChange = (value: string) => {
    setSearchSpecies(value);
    setSelectedBreeds([]); // Clear breed selections when species changes
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
              Discover quality breeding partners and adorable puppies & kittens. Search by city and state.
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Search Filters</CardTitle>
              <CardDescription>Find pets by city, state, species, and breed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Location Filters */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      placeholder="Enter state"
                      value={searchState}
                      onChange={(e) => setSearchState(e.target.value)}
                    />
                  </div>
                </div>

                {/* Species Filter */}
                <div>
                  <Label htmlFor="species">Species</Label>
                  <Select value={searchSpecies} onValueChange={handleSpeciesChange}>
                    <SelectTrigger id="species">
                      <SelectValue placeholder="All species" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All species</SelectItem>
                      <SelectItem value="dog">Dog</SelectItem>
                      <SelectItem value="cat">Cat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Size Filters */}
                <div>
                  <Label className="mb-3 block">Size & Classification</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="special-breeds"
                        checked={showSpecialBreeds}
                        onCheckedChange={(checked) => setShowSpecialBreeds(checked as boolean)}
                      />
                      <label
                        htmlFor="special-breeds"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Special Breeds
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="small-breeds"
                        checked={showSmallBreeds}
                        onCheckedChange={(checked) => setShowSmallBreeds(checked as boolean)}
                      />
                      <label
                        htmlFor="small-breeds"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Small Breeds
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="medium-breeds"
                        checked={showMediumBreeds}
                        onCheckedChange={(checked) => setShowMediumBreeds(checked as boolean)}
                      />
                      <label
                        htmlFor="medium-breeds"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Medium Breeds
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="large-breeds"
                        checked={showLargeBreeds}
                        onCheckedChange={(checked) => setShowLargeBreeds(checked as boolean)}
                      />
                      <label
                        htmlFor="large-breeds"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        Large Breeds
                      </label>
                    </div>
                  </div>
                </div>

                {/* Breed Multi-Select */}
                <div>
                  <Label className="mb-3 block">
                    Breeds {selectedBreeds.length > 0 && `(${selectedBreeds.length} selected)`}
                  </Label>
                  <div className="max-h-64 overflow-y-auto border border-border rounded-lg p-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {getAvailableBreeds().map((breed) => (
                        <div key={breed} className="flex items-center space-x-2">
                          <Checkbox
                            id={breed}
                            checked={selectedBreeds.includes(breed)}
                            onCheckedChange={() => handleBreedToggle(breed)}
                          />
                          <label
                            htmlFor={breed}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {breed}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  {selectedBreeds.length > 0 && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setSelectedBreeds([])}
                      className="mt-2"
                    >
                      Clear breed selections
                    </Button>
                  )}
                </div>

                {/* Apply Filters Button */}
                <div className="flex justify-end">
                  <Button onClick={fetchPets} size="lg">
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
