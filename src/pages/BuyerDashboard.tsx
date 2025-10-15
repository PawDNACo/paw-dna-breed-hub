import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";

const DOG_BREEDS = [
  "Labrador Retriever", "German Shepherd", "Golden Retriever", "French Bulldog", 
  "Bulldog", "Poodle", "Beagle", "Rottweiler", "German Shorthaired Pointer",
  "Yorkshire Terrier", "Boxer", "Dachshund", "Siberian Husky", "Great Dane",
  "Doberman Pinscher", "Australian Shepherd", "Miniature Schnauzer", "Cavalier King Charles Spaniel",
  "Shih Tzu", "Boston Terrier", "Pomeranian", "Havanese", "Shetland Sheepdog",
  "Brittany", "Pembroke Welsh Corgi", "Australian Cattle Dog", "English Springer Spaniel",
  "Cocker Spaniel", "Border Collie", "Vizsla", "Cane Corso"
];

const CAT_BREEDS = [
  "Persian", "Maine Coon", "Ragdoll", "British Shorthair", "Siamese",
  "Abyssinian", "Birman", "Oriental Shorthair", "Sphynx", "Devon Rex",
  "American Shorthair", "Scottish Fold", "Exotic Shorthair", "Burmese",
  "Himalayan", "Bengal", "Russian Blue", "Norwegian Forest Cat", "Manx",
  "Cornish Rex", "Selkirk Rex", "Turkish Angora", "Somali", "Tonkinese",
  "Chartreux", "Balinese", "Siberian", "American Curl", "Ragamuffin", "Munchkin"
];

interface BuyerRequest {
  id: string;
  species: string;
  breed: string;
  description: string;
  max_price: number;
  status: string;
  city?: string;
  state?: string;
  zip_code?: string;
  created_at: string;
}

interface Profile {
  zip_code?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
}

export default function BuyerDashboard() {
  const [requests, setRequests] = useState<BuyerRequest[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<BuyerRequest | null>(null);
  const [matchingPets, setMatchingPets] = useState<any[]>([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    species: "",
    breed: "",
    breeds: [] as string[], // For multi-select when "both" is selected
    description: "",
    max_price: "",
  });

  useEffect(() => {
    checkSubscriptionAndLoadRequests();

    // Set up real-time subscription for buyer requests
    const requestsChannel = supabase
      .channel('buyer_requests_realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'buyer_requests',
        },
        () => {
          checkSubscriptionAndLoadRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(requestsChannel);
    };
  }, []);

  const checkSubscriptionAndLoadRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      // Load profile
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      // Check subscription
      const { data: subData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      setSubscription(subData);

      // Load buyer requests
      const { data: requestsData, error } = await supabase
        .from("buyer_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setRequests(requestsData || []);

      // Load matching pets based on buyer preferences
      if (requestsData && requestsData.length > 0) {
        const firstRequest = requestsData[0];
        let query = supabase
          .from("pets")
          .select("*")
          .eq("available", true);

        // Filter by species
        if (firstRequest.species && firstRequest.species !== "both") {
          query = query.eq("species", firstRequest.species);
        }

        const { data: petsData } = await query;
        
        // Further filter by breed, gender, and size on client side if they're arrays
        let filtered = petsData || [];
        
        if (firstRequest.gender && firstRequest.gender.length > 0) {
          filtered = filtered.filter(pet => 
            firstRequest.gender?.includes(pet.gender?.toLowerCase())
          );
        }

        if (firstRequest.size && firstRequest.size.length > 0) {
          filtered = filtered.filter(pet => 
            firstRequest.size?.includes(pet.size?.toLowerCase())
          );
        }

        setMatchingPets(filtered);
      }
    } catch (error: any) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subscription) {
      toast({
        title: "Subscription Required",
        description: "You need an active subscription to post breed requests.",
        variant: "destructive",
      });
      return;
    }

    if (!profile?.zip_code || !profile?.state) {
      toast({
        title: "Location Required",
        description: "Please update your profile with your location information.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const requestData = {
        ...formData,
        max_price: parseFloat(formData.max_price),
        user_id: user.id,
        zip_code: profile.zip_code,
        city: profile.city,
        state: profile.state,
        latitude: profile.latitude,
        longitude: profile.longitude,
      };

      if (editingRequest) {
        const { error } = await supabase
          .from("buyer_requests")
          .update(requestData)
          .eq("id", editingRequest.id);

        if (error) throw error;
        toast({ title: "Request updated successfully!" });
      } else {
        const { error } = await supabase
          .from("buyer_requests")
          .insert([requestData]);

        if (error) throw error;
        toast({ title: "Request posted successfully!" });
      }

      setDialogOpen(false);
      setEditingRequest(null);
      setFormData({
        species: "",
        breed: "",
        breeds: [],
        description: "",
        max_price: "",
      });
      checkSubscriptionAndLoadRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (request: BuyerRequest) => {
    setEditingRequest(request);
    setFormData({
      species: request.species,
      breed: request.breed,
      breeds: [],
      description: request.description || "",
      max_price: request.max_price.toString(),
    });
    setDialogOpen(true);
  };

  const handleDelete = async (requestId: string) => {
    if (!confirm("Are you sure you want to delete this request?")) return;

    try {
      const { error } = await supabase
        .from("buyer_requests")
        .delete()
        .eq("id", requestId);

      if (error) throw error;
      toast({ title: "Request deleted successfully!" });
      checkSubscriptionAndLoadRequests();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Buyer Dashboard</h1>
          <p className="text-muted-foreground">
            Find your perfect pet and connect with breeders
          </p>
        </div>

        {/* Matching Pets Feed */}
        {matchingPets.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Pets Matching Your Preferences ({matchingPets.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {matchingPets.map((pet) => (
                <Card key={pet.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate(`/pet/${pet.id}`)}>
                  <CardHeader>
                    {pet.image_url && (
                      <img src={pet.image_url} alt={pet.name} className="w-full h-48 object-cover rounded-md mb-2" />
                    )}
                    <CardTitle>{pet.name}</CardTitle>
                    <CardDescription>
                      {pet.breed} • {pet.gender}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold mb-2">${pet.price}</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {pet.city}, {pet.state}
                    </p>
                    {pet.description && (
                      <p className="text-sm line-clamp-2">{pet.description}</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {!subscription && (
          <Card className="mb-8 border-destructive">
            <CardHeader>
              <CardTitle>Subscription Required</CardTitle>
              <CardDescription>
                You need an active subscription to post breed requests. Please subscribe to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/subscribe-pricing")}>Subscribe Now</Button>
            </CardContent>
          </Card>
        )}

        {(!profile?.zip_code || !profile?.state) && (
          <Card className="mb-8 border-yellow-500">
            <CardHeader>
              <CardTitle>Location Required</CardTitle>
              <CardDescription>
                Please update your profile with your location to enable location-based features.
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Requests ({requests.length})</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!subscription}>
                <Plus className="mr-2 h-4 w-4" /> Post New Request
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingRequest ? "Edit" : "Post New"} Breed Request</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="species">Species</Label>
                    <Select
                      value={formData.species}
                      onValueChange={(value) => setFormData({ ...formData, species: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select species" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="dog">Dog</SelectItem>
                        <SelectItem value="cat">Cat</SelectItem>
                        <SelectItem value="both">Both</SelectItem>
                        <SelectItem value="bird">Bird</SelectItem>
                        <SelectItem value="reptile">Reptile</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="breed">Breed{formData.species === "both" ? "s" : ""}</Label>
                    {formData.species === "both" ? (
                      <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto bg-background">
                        <div className="space-y-3">
                          <div className="font-medium text-sm text-muted-foreground mb-2">Dogs</div>
                          {DOG_BREEDS.map((breed) => (
                            <div key={breed} className="flex items-center space-x-2">
                              <Checkbox
                                id={`dog-${breed}`}
                                checked={formData.breeds.includes(breed)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFormData({
                                      ...formData,
                                      breeds: [...formData.breeds, breed]
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      breeds: formData.breeds.filter(b => b !== breed)
                                    });
                                  }
                                }}
                              />
                              <label
                                htmlFor={`dog-${breed}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {breed}
                              </label>
                            </div>
                          ))}
                          <div className="font-medium text-sm text-muted-foreground mb-2 mt-4">Cats</div>
                          {CAT_BREEDS.map((breed) => (
                            <div key={breed} className="flex items-center space-x-2">
                              <Checkbox
                                id={`cat-${breed}`}
                                checked={formData.breeds.includes(breed)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setFormData({
                                      ...formData,
                                      breeds: [...formData.breeds, breed]
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      breeds: formData.breeds.filter(b => b !== breed)
                                    });
                                  }
                                }}
                              />
                              <label
                                htmlFor={`cat-${breed}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {breed}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <Select
                        value={formData.breed}
                        onValueChange={(value) => setFormData({ ...formData, breed: value })}
                        disabled={!formData.species || !["dog", "cat"].includes(formData.species)}
                      >
                        <SelectTrigger className="bg-background">
                          <SelectValue placeholder={
                            !formData.species 
                              ? "Select a species first" 
                              : !["dog", "cat"].includes(formData.species)
                              ? "Breed list available for dogs and cats only"
                              : "Select breed"
                          } />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50 max-h-[300px]">
                          {formData.species === "dog" && DOG_BREEDS.map((breed) => (
                            <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                          ))}
                          {formData.species === "cat" && CAT_BREEDS.map((breed) => (
                            <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="max_price">Maximum Price ($)</Label>
                  <Input
                    id="max_price"
                    type="number"
                    step="0.01"
                    required
                    value={formData.max_price}
                    onChange={(e) => setFormData({ ...formData, max_price: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe what you're looking for..."
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingRequest ? "Update" : "Post"} Request
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {requests.map((request) => (
            <Card key={request.id}>
              <CardHeader>
                <CardTitle>{request.breed}</CardTitle>
                <CardDescription>
                  {request.species}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">Up to ${request.max_price}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {request.city}, {request.state} {request.zip_code}
                </p>
                {request.description && (
                  <p className="text-sm mb-4">{request.description}</p>
                )}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(request)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(request.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {requests.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                You haven't posted any breed requests yet.
              </p>
              {subscription && (
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Post Your First Request
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
