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
  const { toast } = useToast();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    species: "",
    breed: "",
    description: "",
    max_price: "",
  });

  useEffect(() => {
    checkSubscriptionAndLoadRequests();
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
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Buyer Dashboard</h1>
          <p className="text-muted-foreground">
            Post breed requests and connect with breeders in your area
          </p>
        </div>

        {!subscription && (
          <Card className="mb-8 border-destructive">
            <CardHeader>
              <CardTitle>Subscription Required</CardTitle>
              <CardDescription>
                You need an active subscription to post breed requests. Please subscribe to continue.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate("/")}>View Pricing</Button>
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
                      placeholder="e.g., Golden Retriever"
                    />
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
