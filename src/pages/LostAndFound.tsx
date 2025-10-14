import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, PawPrint, Calendar, MapPin, Phone, Mail } from "lucide-react";
import { format } from "date-fns";

export default function LostAndFound() {
  const [showForm, setShowForm] = useState(false);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchSpecies, setSearchSpecies] = useState("");
  const [searchCity, setSearchCity] = useState("");
  const [formData, setFormData] = useState({
    pet_name: "",
    species: "",
    breed: "",
    description: "",
    last_seen_location: "",
    last_seen_date: "",
    contact_name: "",
    contact_phone: "",
    contact_email: "",
    city: "",
    state: "",
    zip_code: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from("lost_pets")
        .insert([formData]);

      if (error) throw error;

      toast.success("Lost pet listing created successfully!");
      setFormData({
        pet_name: "",
        species: "",
        breed: "",
        description: "",
        last_seen_location: "",
        last_seen_date: "",
        contact_name: "",
        contact_phone: "",
        contact_email: "",
        city: "",
        state: "",
        zip_code: "",
      });
      setShowForm(false);
      handleSearch();
    } catch (error: any) {
      toast.error(error.message || "Failed to create listing");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("lost_pets")
        .select("*")
        .eq("status", "lost")
        .order("created_at", { ascending: false });

      if (searchSpecies) {
        query = query.ilike("species", `%${searchSpecies}%`);
      }
      if (searchCity) {
        query = query.ilike("city", `%${searchCity}%`);
      }

      const { data, error } = await query;

      if (error) throw error;
      setListings(data || []);
    } catch (error: any) {
      toast.error("Failed to search listings");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent">
              Lost & Found Pets
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Help reunite lost pets with their families. List a lost pet or search for found animals.
            </p>
          </div>

          <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => setShowForm(!showForm)}
              size="lg"
              className="bg-gradient-hero"
            >
              <PawPrint className="mr-2 h-5 w-5" />
              {showForm ? "Cancel" : "Report Lost Pet"}
            </Button>
            <Button
              onClick={handleSearch}
              size="lg"
              variant="outline"
            >
              <Search className="mr-2 h-5 w-5" />
              Search Listings
            </Button>
          </div>

          {showForm && (
            <Card className="mb-8 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle>Report a Lost Pet</CardTitle>
                <CardDescription>
                  Fill out the details below to create a lost pet listing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pet_name">Pet Name *</Label>
                      <Input
                        id="pet_name"
                        value={formData.pet_name}
                        onChange={(e) => setFormData({ ...formData, pet_name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="species">Species *</Label>
                      <Select
                        value={formData.species}
                        onValueChange={(value) => setFormData({ ...formData, species: value })}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select species" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="dog">Dog</SelectItem>
                          <SelectItem value="cat">Cat</SelectItem>
                          <SelectItem value="bird">Bird</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="breed">Breed</Label>
                    <Input
                      id="breed"
                      value={formData.breed}
                      onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Physical characteristics, distinguishing features..."
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="last_seen_location">Last Seen Location *</Label>
                    <Input
                      id="last_seen_location"
                      value={formData.last_seen_location}
                      onChange={(e) => setFormData({ ...formData, last_seen_location: e.target.value })}
                      placeholder="Street address or general area"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip_code">ZIP Code</Label>
                      <Input
                        id="zip_code"
                        value={formData.zip_code}
                        onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="last_seen_date">Last Seen Date *</Label>
                    <Input
                      id="last_seen_date"
                      type="date"
                      value={formData.last_seen_date}
                      onChange={(e) => setFormData({ ...formData, last_seen_date: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="contact_name">Your Name *</Label>
                      <Input
                        id="contact_name"
                        value={formData.contact_name}
                        onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_phone">Phone *</Label>
                      <Input
                        id="contact_phone"
                        type="tel"
                        value={formData.contact_phone}
                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="contact_email">Email *</Label>
                      <Input
                        id="contact_email"
                        type="email"
                        value={formData.contact_email}
                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Submitting..." : "Submit Lost Pet Report"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          <div className="mb-8 max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Search Lost Pets</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="search_species">Species</Label>
                    <Input
                      id="search_species"
                      placeholder="Dog, Cat, Bird..."
                      value={searchSpecies}
                      onChange={(e) => setSearchSpecies(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="search_city">City</Label>
                    <Input
                      id="search_city"
                      placeholder="City name"
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PawPrint className="h-5 w-5 text-primary" />
                    {listing.pet_name}
                  </CardTitle>
                  <CardDescription>
                    {listing.species} {listing.breed && `- ${listing.breed}`}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">{listing.description}</p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-primary mt-0.5" />
                      <div>
                        <p className="font-medium">Last Seen:</p>
                        <p className="text-muted-foreground">{listing.last_seen_location}</p>
                        <p className="text-muted-foreground">
                          {listing.city}, {listing.state} {listing.zip_code}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-primary" />
                      <span className="text-muted-foreground">
                        {format(new Date(listing.last_seen_date), "MMM d, yyyy")}
                      </span>
                    </div>

                    <div className="pt-3 border-t space-y-1">
                      <p className="font-medium">Contact:</p>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <a href={`tel:${listing.contact_phone}`} className="hover:text-primary">
                          {listing.contact_phone}
                        </a>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <a href={`mailto:${listing.contact_email}`} className="hover:text-primary">
                          {listing.contact_email}
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {listings.length === 0 && !loading && (
            <div className="text-center py-12">
              <PawPrint className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No listings found. Click "Search Listings" to view all lost pets.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
