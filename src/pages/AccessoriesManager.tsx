import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Plus, Pencil, Trash2, ShoppingBag } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

interface Accessory {
  id: string;
  name: string;
  description: string;
  category: string;
  active: boolean;
}

const categories = [
  "Bowls & Feeders",
  "Collars & Leashes",
  "Toys",
  "Beds & Blankets",
  "Grooming",
  "Training",
  "Travel",
  "Other"
];

export default function AccessoriesManager() {
  const [accessories, setAccessories] = useState<Accessory[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingAccessory, setEditingAccessory] = useState<Accessory | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
  });

  useEffect(() => {
    checkAuthAndLoadAccessories();
  }, []);

  const checkAuthAndLoadAccessories = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("accessories")
        .select("*")
        .eq("breeder_id", user.id)
        .order("category", { ascending: true });

      if (error) throw error;
      setAccessories(data || []);
    } catch (error) {
      console.error("Error loading accessories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const accessoryData = {
        ...formData,
        breeder_id: user.id,
      };

      if (editingAccessory) {
        const { error } = await supabase
          .from("accessories")
          .update(accessoryData)
          .eq("id", editingAccessory.id);

        if (error) throw error;
        toast.success("Accessory updated!");
      } else {
        const { error } = await supabase
          .from("accessories")
          .insert([accessoryData]);

        if (error) throw error;
        toast.success("Accessory added!");
      }

      setDialogOpen(false);
      setEditingAccessory(null);
      setFormData({ name: "", description: "", category: "" });
      checkAuthAndLoadAccessories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (accessory: Accessory) => {
    setEditingAccessory(accessory);
    setFormData({
      name: accessory.name,
      description: accessory.description || "",
      category: accessory.category || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this accessory?")) return;

    try {
      const { error } = await supabase
        .from("accessories")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Accessory deleted!");
      checkAuthAndLoadAccessories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from("accessories")
        .update({ active: !currentActive })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Accessory ${!currentActive ? "activated" : "deactivated"}!`);
      checkAuthAndLoadAccessories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const groupedAccessories = accessories.reduce((acc, accessory) => {
    const category = accessory.category || "Other";
    if (!acc[category]) acc[category] = [];
    acc[category].push(accessory);
    return acc;
  }, {} as Record<string, Accessory[]>);

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
          <h1 className="text-4xl font-bold mb-2">Accessories Manager</h1>
          <p className="text-muted-foreground">
            Add items to your accessories bundle - buyers pay $2.99 per item selected
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Accessories ({accessories.length})</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Accessory
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingAccessory ? "Edit" : "Add"} Accessory</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Accessory Name</Label>
                  <Input
                    id="name"
                    required
                    placeholder="e.g., Stainless Steel Food Bowl"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    placeholder="Brief description of the accessory"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    💡 Each accessory selected by a buyer costs <strong className="text-foreground">$2.99</strong>
                  </p>
                </div>
                <Button type="submit" className="w-full">
                  {editingAccessory ? "Update" : "Add"} Accessory
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {Object.keys(groupedAccessories).length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No accessories yet. Add items for buyers to choose from!
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Your First Accessory
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedAccessories).map(([category, items]) => (
              <div key={category}>
                <h3 className="text-xl font-semibold mb-4">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map((accessory) => (
                    <Card key={accessory.id} className={!accessory.active ? "opacity-60" : ""}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <ShoppingBag className="h-6 w-6 text-primary" />
                          <Badge variant={accessory.active ? "default" : "secondary"}>
                            {accessory.active ? "Active" : "Inactive"}
                          </Badge>
                        </div>
                        <CardTitle className="text-lg">{accessory.name}</CardTitle>
                        {accessory.description && (
                          <CardDescription>{accessory.description}</CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <p className="text-xl font-bold text-primary mb-4">$2.99</p>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(accessory)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleActive(accessory.id, accessory.active)}
                          >
                            {accessory.active ? "Deactivate" : "Activate"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(accessory.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
