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
import { useVerificationCheck } from "@/hooks/useVerificationCheck";
import { VerificationRequired } from "@/components/verification/VerificationRequired";
import { StripeIdentityVerification } from "@/components/verification/StripeIdentityVerification";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age_months: number;
  gender: string;
  price: number;
  description: string;
  listing_type: string;
  available: boolean;
  image_url?: string;
  city?: string;
  state?: string;
  zip_code?: string;
}

interface Profile {
  zip_code?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
}

export default function BreederDashboard() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isVerified, loading: verificationLoading, requireVerification } = useVerificationCheck();

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age_months: "",
    gender: "",
    price: "",
    description: "",
    listing_type: "sale",
    image_url: "",
  });

  useEffect(() => {
    checkSubscriptionAndLoadPets();
  }, []);

  const checkSubscriptionAndLoadPets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
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

      // Load pets
      const { data: petsData, error } = await supabase
        .from("pets")
        .select("*")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPets(petsData || []);
    } catch (error: any) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check verification first
    if (!requireVerification("list pets")) {
      return;
    }

    if (!subscription) {
      toast({
        title: "Subscription Required",
        description: "You need an active subscription to list pets.",
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

      const petData = {
        ...formData,
        age_months: parseInt(formData.age_months),
        price: parseFloat(formData.price),
        owner_id: user.id,
        zip_code: profile.zip_code,
        city: profile.city,
        state: profile.state,
        latitude: profile.latitude,
        longitude: profile.longitude,
      };

      if (editingPet) {
        const { error } = await supabase
          .from("pets")
          .update(petData)
          .eq("id", editingPet.id);

        if (error) throw error;
        toast({ title: "Pet updated successfully!" });
      } else {
        const { error } = await supabase
          .from("pets")
          .insert([petData]);

        if (error) throw error;
        toast({ title: "Pet listed successfully!" });
      }

      setDialogOpen(false);
      setEditingPet(null);
      setFormData({
        name: "",
        species: "",
        breed: "",
        age_months: "",
        gender: "",
        price: "",
        description: "",
        listing_type: "sale",
        image_url: "",
      });
      checkSubscriptionAndLoadPets();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age_months: pet.age_months.toString(),
      gender: pet.gender,
      price: pet.price.toString(),
      description: pet.description || "",
      listing_type: pet.listing_type,
      image_url: pet.image_url || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (petId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", petId);

      if (error) throw error;
      toast({ title: "Listing deleted successfully!" });
      checkSubscriptionAndLoadPets();
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
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Breeder Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your pet listings and reach buyers in your area
          </p>
        </div>

        {!subscription && (
          <Card className="mb-8 border-destructive">
            <CardHeader>
              <CardTitle>Subscription Required</CardTitle>
              <CardDescription>
                You need an active subscription to list pets. Please subscribe to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")}>View Pricing</Button>
            </CardContent>
          </Card>
        )}

        {!isVerified && (
          <div className="mb-8">
            <StripeIdentityVerification userType="breeder" />
          </div>
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
          <h2 className="text-2xl font-semibold">Your Listings ({pets.length})</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!subscription}>
                <Plus className="mr-2 h-4 w-4" /> Add New Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPet ? "Edit" : "Add New"} Pet Listing</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Pet Name</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
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
                        <SelectItem value="bird">Bird</SelectItem>
                        <SelectItem value="reptile">Reptile</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="breed">Breed</Label>
                    <Input
                      id="breed"
                      required
                      value={formData.breed}
                      onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age_months">Age (months)</Label>
                    <Input
                      id="age_months"
                      type="number"
                      required
                      value={formData.age_months}
                      onChange={(e) => setFormData({ ...formData, age_months: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({ ...formData, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="price">Price ($)</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="listing_type">Listing Type</Label>
                    <Select
                      value={formData.listing_type}
                      onValueChange={(value) => setFormData({ ...formData, listing_type: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="breeding">Breeding Service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="image_url">Image URL (optional)</Label>
                  <Input
                    id="image_url"
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingPet ? "Update" : "Create"} Listing
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <Card key={pet.id}>
              {pet.image_url && (
                <img
                  src={pet.image_url}
                  alt={pet.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <CardHeader>
                <CardTitle>{pet.name}</CardTitle>
                <CardDescription>
                  {pet.breed} • {pet.species} • {pet.age_months} months
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">${pet.price}</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {pet.city}, {pet.state} {pet.zip_code}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(pet)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(pet.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {pets.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                You haven't listed any pets yet.
              </p>
              {subscription && (
                <Button onClick={() => setDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" /> Create Your First Listing
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
