import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

interface CarePackage {
  id: string;
  name: string;
  description: string;
  items: string[];
  base_price: number;
  active: boolean;
}

export default function CarePackageManager() {
  const [packages, setPackages] = useState<CarePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<CarePackage | null>(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    items: "",
    base_price: "149.00",
  });

  useEffect(() => {
    checkAuthAndLoadPackages();
  }, []);

  const checkAuthAndLoadPackages = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("care_packages")
        .select("*")
        .eq("breeder_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPackages((data || []).map(pkg => ({
        ...pkg,
        items: Array.isArray(pkg.items) ? pkg.items.map(String) : []
      })));
    } catch (error) {
      console.error("Error loading packages:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const itemsArray = formData.items
        .split("\n")
        .map(item => item.trim())
        .filter(item => item.length > 0);

      const packageData = {
        name: formData.name,
        description: formData.description,
        items: itemsArray,
        base_price: parseFloat(formData.base_price),
        breeder_id: user.id,
      };

      if (editingPackage) {
        const { error } = await supabase
          .from("care_packages")
          .update(packageData)
          .eq("id", editingPackage.id);

        if (error) throw error;
        toast.success("Care package updated!");
      } else {
        const { error } = await supabase
          .from("care_packages")
          .insert([packageData]);

        if (error) throw error;
        toast.success("Care package created!");
      }

      setDialogOpen(false);
      setEditingPackage(null);
      setFormData({ name: "", description: "", items: "", base_price: "149.00" });
      checkAuthAndLoadPackages();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleEdit = (pkg: CarePackage) => {
    setEditingPackage(pkg);
    setFormData({
      name: pkg.name,
      description: pkg.description || "",
      items: pkg.items.join("\n"),
      base_price: pkg.base_price.toString(),
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this care package?")) return;

    try {
      const { error } = await supabase
        .from("care_packages")
        .delete()
        .eq("id", id);

      if (error) throw error;
      toast.success("Care package deleted!");
      checkAuthAndLoadPackages();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const toggleActive = async (id: string, currentActive: boolean) => {
    try {
      const { error } = await supabase
        .from("care_packages")
        .update({ active: !currentActive })
        .eq("id", id);

      if (error) throw error;
      toast.success(`Package ${!currentActive ? "activated" : "deactivated"}!`);
      checkAuthAndLoadPackages();
    } catch (error: any) {
      toast.error(error.message);
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
          <h1 className="text-4xl font-bold mb-2">Care Package Manager</h1>
          <p className="text-muted-foreground">
            Customize care packages for your buyers
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Your Care Packages ({packages.length})</h2>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Create Package
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingPackage ? "Edit" : "Create"} Care Package</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Package Name</Label>
                  <Input
                    id="name"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="items">Items (one per line)</Label>
                  <Textarea
                    id="items"
                    rows={6}
                    required
                    placeholder="Food bowl&#10;Water bowl&#10;Collar&#10;Leash&#10;Toy"
                    value={formData.items}
                    onChange={(e) => setFormData({ ...formData, items: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="base_price">Base Price ($)</Label>
                  <Input
                    id="base_price"
                    type="number"
                    step="0.01"
                    required
                    value={formData.base_price}
                    onChange={(e) => setFormData({ ...formData, base_price: e.target.value })}
                  />
                </div>
                <Button type="submit" className="w-full">
                  {editingPackage ? "Update" : "Create"} Package
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {packages.map((pkg) => (
            <Card key={pkg.id} className={!pkg.active ? "opacity-60" : ""}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <Package className="h-8 w-8 text-primary" />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleActive(pkg.id, pkg.active)}
                  >
                    {pkg.active ? "Active" : "Inactive"}
                  </Button>
                </div>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription>{pkg.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <p className="text-sm font-semibold mb-2">Includes:</p>
                  <ul className="text-sm space-y-1">
                    {pkg.items.map((item, idx) => (
                      <li key={idx} className="text-muted-foreground">• {item}</li>
                    ))}
                  </ul>
                </div>
                <p className="text-2xl font-bold text-primary mb-4">${pkg.base_price}</p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(pkg)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(pkg.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {packages.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No care packages yet. Create one to get started!
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Create Your First Package
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
