import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Plus, Pencil, Trash2, Upload, MessageSquare, Shield } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useVerificationCheck } from "@/hooks/useVerificationCheck";
import { StripeIdentityVerification } from "@/components/verification/StripeIdentityVerification";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { addWatermarkToImage, batchWatermarkImages } from "@/utils/imageWatermark";
import { WatermarkPreview } from "@/components/WatermarkPreview";
import { useUserRole } from "@/hooks/useUserRole";
import { RoleSubscriptionForm } from "@/components/subscription/RoleSubscriptionForm";

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  age_months?: number;
  birth_date?: string;
  expected_date?: string;
  gender: string;
  price: number;
  description: string;
  listing_type: string;
  available: boolean;
  image_url?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  is_special_breed?: boolean;
  delivery_method?: string;
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
  const [buyerRequests, setBuyerRequests] = useState<any[]>([]);
  const [subscription, setSubscription] = useState<any>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [parentImages, setParentImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [watermarkPreview, setWatermarkPreview] = useState<{ original: File; watermarked: Blob } | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isVerified, loading: verificationLoading, requireVerification } = useVerificationCheck();
  const { isBreeder, isBuyer, isBrowser, loading: rolesLoading, refetch: refetchRoles } = useUserRole();

  const [formData, setFormData] = useState({
    name: "",
    species: "",
    breed: "",
    age_months: "",
    birth_date: "",
    expected_date: "",
    gender: "",
    price: "",
    description: "",
    listing_type: "sale",
    is_special_breed: false,
    delivery_method: "",
  });

  useEffect(() => {
    checkSubscriptionAndLoadPets();
    if (isBuyer && !rolesLoading) {
      loadBuyerRequests();
    }
  }, [isBuyer, rolesLoading]);

  const checkSubscriptionAndLoadPets = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      setProfile(profileData);

      const { data: subData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .single();

      setSubscription(subData);

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

  const loadBuyerRequests = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("buyer_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBuyerRequests(data || []);
    } catch (error: any) {
      console.error("Error loading buyer requests:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

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

    if (uploadedImages.length < 5) {
      toast({
        title: "More Photos Required",
        description: "Please upload at least 5 photos of your pet.",
        variant: "destructive",
      });
      return;
    }

    if (parentImages.length < 2) {
      toast({
        title: "Parent Photos Required",
        description: "Please upload at least 2 photos of the parents.",
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
        age_months: formData.age_months ? parseInt(formData.age_months) : null,
        birth_date: formData.birth_date || null,
        expected_date: formData.expected_date || null,
        price: parseFloat(formData.price),
        owner_id: user.id,
        zip_code: profile.zip_code,
        city: profile.city,
        state: profile.state,
        latitude: profile.latitude,
        longitude: profile.longitude,
        image_url: uploadedImages[0],
        parent_images: parentImages,
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
      resetForm();
      checkSubscriptionAndLoadPets();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      species: "",
      breed: "",
      age_months: "",
      birth_date: "",
      expected_date: "",
      gender: "",
      price: "",
      description: "",
      listing_type: "sale",
      is_special_breed: false,
      delivery_method: "",
    });
    setUploadedImages([]);
    setParentImages([]);
  };

  const handleImageUpload = async (
    files: FileList | null,
    type: "pet" | "parent"
  ) => {
    if (!files || files.length === 0) return;

    setUploadingImages(true);
    try {
      const fileArray = Array.from(files);
      
      // Show preview of first image
      if (fileArray.length > 0) {
        const watermarked = await addWatermarkToImage(fileArray[0]);
        setWatermarkPreview({ original: fileArray[0], watermarked });
      }

      // Add watermarks to all images
      const watermarkedBlobs = await batchWatermarkImages(fileArray);

      // Convert to base64 for storage (in production, upload to storage bucket)
      const base64Images = await Promise.all(
        watermarkedBlobs.map(async (blob) => {
          return new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.readAsDataURL(blob);
          });
        })
      );

      if (type === "pet") {
        setUploadedImages((prev) => [...prev, ...base64Images]);
      } else {
        setParentImages((prev) => [...prev, ...base64Images]);
      }

      toast({
        title: "Images Uploaded",
        description: `${fileArray.length} watermarked image(s) added successfully.`,
      });
    } catch (error: any) {
      toast({
        title: "Upload Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploadingImages(false);
    }
  };

  const handleEdit = (pet: Pet) => {
    setEditingPet(pet);
    setFormData({
      name: pet.name,
      species: pet.species,
      breed: pet.breed,
      age_months: pet.age_months?.toString() || "",
      birth_date: pet.birth_date || "",
      expected_date: pet.expected_date || "",
      gender: pet.gender,
      price: pet.price.toString(),
      description: pet.description || "",
      listing_type: pet.listing_type,
      is_special_breed: pet.is_special_breed || false,
      delivery_method: pet.delivery_method || "",
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

  if (loading || rolesLoading) {
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">
                {isBreeder && isBuyer ? "Profile Dashboard" : isBreeder ? "Breeder Dashboard" : "Buyer Dashboard"}
              </h1>
              <p className="text-muted-foreground">
                {isBreeder && isBuyer 
                  ? "Manage your pet listings and buyer requests"
                  : isBreeder 
                  ? "Manage your pet listings and reach buyers in your area"
                  : "Manage your buyer requests and find your perfect pet"}
              </p>
            </div>
            <Button onClick={() => navigate("/conversations")} variant="outline">
              <MessageSquare className="h-4 w-4 mr-2" />
              Conversations
            </Button>
          </div>
        </div>

        {isBrowser && (
          <div className="mb-8">
            <RoleSubscriptionForm 
              onRoleUpdated={async () => {
                refetchRoles();
                checkSubscriptionAndLoadPets();
                if (isBuyer) loadBuyerRequests();
              }}
            />
          </div>
        )}

        {!subscription && !isBrowser && (isBreeder || isBuyer) && (
          <Card className="mb-8 border-destructive">
            <CardHeader>
              <CardTitle>Subscription Required</CardTitle>
              <CardDescription>
                You need an active subscription to access all features. Please subscribe to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/#pricing")}>Subscribe Now</Button>
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

        {/* Breeder Listings Section */}
        {isBreeder && subscription && !isBrowser && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Your Listings ({pets.length})</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!subscription}>
                <Plus className="mr-2 h-4 w-4" /> Add New Listing
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPet ? "Edit" : "Add New"} Pet Listing</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Alert>
                  <AlertDescription>
                    <strong>Important:</strong> Do not include personal information (phone numbers, email, social media) in the description. All communication must happen through our secure messaging system.
                  </AlertDescription>
                </Alert>

                <div>
                  <Label htmlFor="name">Pet Name *</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="species">Species *</Label>
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
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="breed">Breed *</Label>
                    <Input
                      id="breed"
                      required
                      value={formData.breed}
                      onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="is_special_breed"
                    checked={formData.is_special_breed}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_special_breed: checked })}
                  />
                  <Label htmlFor="is_special_breed">Special Breed</Label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="birth_date">Birth Date</Label>
                    <Input
                      id="birth_date"
                      type="date"
                      value={formData.birth_date}
                      onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expected_date">Expected Date (if not born yet)</Label>
                    <Input
                      id="expected_date"
                      type="date"
                      value={formData.expected_date}
                      onChange={(e) => setFormData({ ...formData, expected_date: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="gender">Gender *</Label>
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

                <div>
                  <Label htmlFor="price">Price ($) * (Minimum $50 for non-special breeds)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min={formData.is_special_breed ? "0" : "50"}
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {parseFloat(formData.price) < 50 && !formData.is_special_breed && "Below $50 requires $49.99 listing fee"}
                  </p>
                </div>

                <div>
                  <Label htmlFor="delivery_method">Delivery Method *</Label>
                  <Select
                    value={formData.delivery_method}
                    onValueChange={(value) => setFormData({ ...formData, delivery_method: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pickup">Pickup Only</SelectItem>
                      <SelectItem value="delivery">Will Deliver</SelectItem>
                      <SelectItem value="both">Both Options Available</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Pet Photos * (Minimum 5 required)</Label>
                  <div className="space-y-2">
                    <div className="mt-2 border-2 border-dashed rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                      <input
                        type="file"
                        id="pet-photos"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e.target.files, "pet")}
                        disabled={uploadingImages}
                      />
                      <label htmlFor="pet-photos" className="cursor-pointer flex flex-col items-center gap-2">
                        {uploadingImages ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        ) : (
                          <>
                            <Upload className="h-5 w-5 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Click to upload at least 5 photos</p>
                            <p className="text-xs text-muted-foreground">
                              <Shield className="inline h-3 w-3 mr-1" />
                              All images are automatically watermarked
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Photos uploaded: {uploadedImages.length}/5+
                    </p>
                    {uploadedImages.length > 0 && (
                      <div className="grid grid-cols-5 gap-2">
                        {uploadedImages.map((img, idx) => (
                          <div key={idx} className="relative aspect-square">
                            <img
                              src={img}
                              alt={`Pet ${idx + 1}`}
                              className="w-full h-full object-cover rounded border"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Parent Photos * (Minimum 2 required)</Label>
                  <div className="space-y-2">
                    <div className="mt-2 border-2 border-dashed rounded-lg p-4 cursor-pointer hover:border-primary transition-colors">
                      <input
                        type="file"
                        id="parent-photos"
                        multiple
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e.target.files, "parent")}
                        disabled={uploadingImages}
                      />
                      <label htmlFor="parent-photos" className="cursor-pointer flex flex-col items-center gap-2">
                        {uploadingImages ? (
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                        ) : (
                          <>
                            <Upload className="h-5 w-5 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">Click to upload photos of both parents</p>
                            <p className="text-xs text-muted-foreground">
                              <Shield className="inline h-3 w-3 mr-1" />
                              All images are automatically watermarked
                            </p>
                          </>
                        )}
                      </label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Parent photos uploaded: {parentImages.length}/2+
                    </p>
                    {parentImages.length > 0 && (
                      <div className="grid grid-cols-5 gap-2">
                        {parentImages.map((img, idx) => (
                          <div key={idx} className="relative aspect-square">
                            <img
                              src={img}
                              alt={`Parent ${idx + 1}`}
                              className="w-full h-full object-cover rounded border"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {watermarkPreview && (
                  <WatermarkPreview
                    originalFile={watermarkPreview.original}
                    watermarkedBlob={watermarkPreview.watermarked}
                  />
                )}

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={4}
                    placeholder="Describe your pet's personality, health status, etc. Do NOT include contact information."
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
                  {pet.breed} • {pet.species}
                  {pet.is_special_breed && " • Special Breed"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold mb-2">${pet.price}</p>
                <p className="text-sm text-muted-foreground mb-2">
                  {pet.delivery_method === "pickup" && "Pickup Only"}
                  {pet.delivery_method === "delivery" && "Will Deliver"}
                  {pet.delivery_method === "both" && "Pickup or Delivery"}
                </p>
                <p className="text-sm text-muted-foreground mb-4">
                  {pet.city}, {pet.state}
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
      </>
    )}

    {/* Buyer Requests Section */}
          {isBuyer && subscription && !isBrowser && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-6">Your Requests ({buyerRequests.length})</h2>
        
        {buyerRequests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {buyerRequests.map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <CardTitle>{request.breed}</CardTitle>
                  <CardDescription>
                    {request.species} • {request.city}, {request.state}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm mb-2">
                    <strong>Max Price:</strong> ${request.max_price || "Not specified"}
                  </p>
                  <p className="text-sm mb-2">
                    <strong>Status:</strong> {request.status}
                  </p>
                  {request.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {request.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                You haven't created any buyer requests yet.
              </p>
              <Button onClick={() => navigate("/browse")}>
                Browse Available Pets
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    )}
      </main>
      <Footer />
    </div>
  );
}