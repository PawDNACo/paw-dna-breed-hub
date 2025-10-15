import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  CreditCard, 
  Bell, 
  MessageSquare, 
  FileText, 
  Heart, 
  HelpCircle,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DOG_BREEDS = [
  "Labrador Retriever", "German Shepherd", "Golden Retriever", "French Bulldog", 
  "Bulldog", "Poodle", "Beagle", "Rottweiler", "German Shorthaired Pointer",
  "Yorkshire Terrier", "Boxer", "Dachshund", "Siberian Husky", "Great Dane",
  "Doberman Pinscher", "Australian Shepherd", "Miniature Schnauzer", "Cavalier King Charles Spaniel",
  "Shih Tzu", "Boston Terrier", "Pomeranian", "Havanese", "Shetland Sheepdog",
  "Brittany", "Pembroke Welsh Corgi", "Australian Cattle Dog", "English Springer Spaniel",
  "Cocker Spaniel", "Border Collie", "Vizsla"
];

const CAT_BREEDS = [
  "Persian", "Maine Coon", "Ragdoll", "British Shorthair", "Siamese",
  "Abyssinian", "Birman", "Oriental Shorthair", "Sphynx", "Devon Rex",
  "American Shorthair", "Scottish Fold", "Exotic Shorthair", "Burmese",
  "Himalayan", "Bengal", "Russian Blue", "Norwegian Forest Cat", "Manx",
  "Cornish Rex", "Selkirk Rex", "Turkish Angora", "Somali", "Tonkinese",
  "Chartreux", "Balinese", "Siberian", "American Curl", "Ragamuffin", "Munchkin"
];

interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  zip_code?: string;
  city?: string;
  state?: string;
  latitude?: number;
  longitude?: number;
}

interface BuyerRequest {
  id: string;
  species: string;
  breed: string;
  description: string;
  max_price: number;
  status: string;
  gender?: string[];
  size?: string[];
  city?: string;
  state?: string;
  created_at: string;
}

interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  gender: string;
  price: number;
  description: string;
  available: boolean;
  image_url?: string;
  city?: string;
  state?: string;
}

export default function Dashboard() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [buyerRequests, setBuyerRequests] = useState<BuyerRequest[]>([]);
  const [petListings, setPetListings] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("overview");
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [listingDialogOpen, setListingDialogOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<BuyerRequest | null>(null);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);
  
  const { isBreeder, isBuyer, loading: rolesLoading } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [requestFormData, setRequestFormData] = useState({
    species: "",
    breed: "",
    breeds: [] as string[], // For multi-select when "both" is selected
    description: "",
    max_price: "",
  });

  const [petFormData, setPetFormData] = useState({
    name: "",
    species: "",
    breed: "",
    gender: "",
    price: "",
    description: "",
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    const section = location.hash.replace("#", "") || "overview";
    setActiveSection(section);
  }, [location]);

  const loadDashboardData = async () => {
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

      // Load buyer requests if user is a buyer
      if (isBuyer && !rolesLoading) {
        const { data: requestsData } = await supabase
          .from("buyer_requests")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });
        
        setBuyerRequests(requestsData || []);
      }

      // Load pet listings if user is a breeder
      if (isBreeder && !rolesLoading) {
        const { data: petsData } = await supabase
          .from("pets")
          .select("*")
          .eq("owner_id", user.id)
          .order("created_at", { ascending: false });
        
        setPetListings(petsData || []);
      }
    } catch (error: any) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm("Are you sure you want to delete this request?")) return;

    try {
      const { error } = await supabase
        .from("buyer_requests")
        .delete()
        .eq("id", requestId);

      if (error) throw error;
      toast({ title: "Request deleted successfully!" });
      loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDeleteListing = async (petId: string) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;

    try {
      const { error } = await supabase
        .from("pets")
        .delete()
        .eq("id", petId);

      if (error) throw error;
      toast({ title: "Listing deleted successfully!" });
      loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const sidebarItems = [
    { id: "account", label: "Account Settings", icon: Settings },
    { id: "payment", label: "Payment Settings", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "messages", label: "Messages", icon: MessageSquare, onClick: () => navigate("/conversations") },
    { id: "applications", label: "Applications", icon: FileText },
    { id: "favorites", label: "Favorites", icon: Heart },
    { id: "help", label: "Help", icon: HelpCircle },
  ];

  if (loading || rolesLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeSection) {
      case "account":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Account Settings</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Account settings coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case "payment":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Payment Settings</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Payment settings coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case "notifications":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Notifications</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Notifications coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case "applications":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Applications</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Applications coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case "favorites":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Favorites</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Favorites coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      case "help":
        return (
          <div>
            <h2 className="text-2xl font-semibold mb-4">Help & Support</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">Help resources coming soon...</p>
              </CardContent>
            </Card>
          </div>
        );
      default:
        return (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Dashboard Overview</h2>
              <p className="text-muted-foreground mb-6">Welcome back, {profile?.full_name || "User"}!</p>
            </div>

            {/* Buyer Requests Section */}
            {isBuyer && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Your Requests ({buyerRequests.length})</h3>
                  <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
                    <DialogTrigger asChild>
                      <Button>
                        <Plus className="mr-2 h-4 w-4" /> New Request
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Breed Request</DialogTitle>
                      </DialogHeader>
                      <form className="space-y-4">
                        <div>
                          <Label htmlFor="species">Species</Label>
                          <Select
                            value={requestFormData.species}
                            onValueChange={(value) => setRequestFormData({ ...requestFormData, species: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select species" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="dog">Dog</SelectItem>
                              <SelectItem value="cat">Cat</SelectItem>
                              <SelectItem value="both">Both</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="breed">Breed{requestFormData.species === "both" ? "s" : ""}</Label>
                          {requestFormData.species === "both" ? (
                            <div className="border rounded-md p-4 max-h-[300px] overflow-y-auto bg-background">
                              <div className="space-y-3">
                                <div className="font-medium text-sm text-muted-foreground mb-2">Dogs</div>
                                {DOG_BREEDS.map((breed) => (
                                  <div key={breed} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`dog-${breed}`}
                                      checked={requestFormData.breeds.includes(breed)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setRequestFormData({
                                            ...requestFormData,
                                            breeds: [...requestFormData.breeds, breed]
                                          });
                                        } else {
                                          setRequestFormData({
                                            ...requestFormData,
                                            breeds: requestFormData.breeds.filter(b => b !== breed)
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
                                      checked={requestFormData.breeds.includes(breed)}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setRequestFormData({
                                            ...requestFormData,
                                            breeds: [...requestFormData.breeds, breed]
                                          });
                                        } else {
                                          setRequestFormData({
                                            ...requestFormData,
                                            breeds: requestFormData.breeds.filter(b => b !== breed)
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
                              value={requestFormData.breed}
                              onValueChange={(value) => setRequestFormData({ ...requestFormData, breed: value })}
                              disabled={!requestFormData.species}
                            >
                              <SelectTrigger className="bg-background">
                                <SelectValue placeholder={
                                  !requestFormData.species 
                                    ? "Select a species first" 
                                    : "Select breed"
                                } />
                              </SelectTrigger>
                              <SelectContent className="bg-popover z-50 max-h-[300px]">
                                {requestFormData.species === "dog" && DOG_BREEDS.map((breed) => (
                                  <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                                ))}
                                {requestFormData.species === "cat" && CAT_BREEDS.map((breed) => (
                                  <SelectItem key={breed} value={breed}>{breed}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                        <div>
                          <Label htmlFor="max_price">Maximum Price ($)</Label>
                          <Input
                            id="max_price"
                            type="number"
                            value={requestFormData.max_price}
                            onChange={(e) => setRequestFormData({ ...requestFormData, max_price: e.target.value })}
                          />
                        </div>
                        <div>
                          <Label htmlFor="description">Description</Label>
                          <Textarea
                            id="description"
                            value={requestFormData.description}
                            onChange={(e) => setRequestFormData({ ...requestFormData, description: e.target.value })}
                            rows={4}
                          />
                        </div>
                        <Button type="submit" className="w-full">Submit Request</Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {buyerRequests.map((request) => (
                    <Card key={request.id}>
                      <CardHeader>
                        <CardTitle>{request.breed}</CardTitle>
                        <CardDescription>{request.species}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold mb-2">Up to ${request.max_price}</p>
                        {request.city && request.state && (
                          <p className="text-sm text-muted-foreground mb-4">
                            {request.city}, {request.state}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteRequest(request.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {buyerRequests.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-muted-foreground mb-4">You haven't posted any requests yet.</p>
                      <Button onClick={() => setRequestDialogOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" /> Post Your First Request
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {/* Pet Listings Section */}
            {isBreeder && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-semibold">Your Listings ({petListings.length})</h3>
                  <Button onClick={() => navigate("/breeder-dashboard")}>
                    <Plus className="mr-2 h-4 w-4" /> New Listing
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {petListings.map((pet) => (
                    <Card key={pet.id}>
                      <CardHeader>
                        {pet.image_url && (
                          <img src={pet.image_url} alt={pet.name} className="w-full h-48 object-cover rounded-md mb-2" />
                        )}
                        <CardTitle>{pet.name}</CardTitle>
                        <CardDescription>{pet.breed} • {pet.gender}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold mb-2">${pet.price}</p>
                        {pet.city && pet.state && (
                          <p className="text-sm text-muted-foreground mb-4">
                            {pet.city}, {pet.state}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => navigate(`/pet/${pet.id}`)}>
                            View
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteListing(pet.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {petListings.length === 0 && (
                  <Card>
                    <CardContent className="text-center py-12">
                      <p className="text-muted-foreground mb-4">You haven't created any listings yet.</p>
                      <Button onClick={() => navigate("/breeder-dashboard")}>
                        <Plus className="mr-2 h-4 w-4" /> Create Your First Listing
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1 flex pt-16">
        {/* Sidebar */}
        <aside className="w-64 border-r bg-card p-6 hidden lg:block">
          <div className="mb-8">
            <div className="flex flex-col items-center mb-6">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || "User"} />
                <AvatarFallback className="text-2xl">
                  {profile?.full_name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-lg text-center">{profile?.full_name}</h3>
              <p className="text-sm text-muted-foreground text-center">{profile?.email}</p>
            </div>
          </div>
          <nav className="space-y-2">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.onClick) {
                      item.onClick();
                    } else {
                      navigate(`/dashboard#${item.id}`);
                      setActiveSection(item.id);
                    }
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeSection === item.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}
