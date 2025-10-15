import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import { Check } from "lucide-react";
import SubscriptionPayment from "@/components/payment/SubscriptionPayment";

const DOG_BREEDS = [
  "Labrador Retriever", "German Shepherd", "Golden Retriever", "French Bulldog",
  "Bulldog", "Poodle", "Beagle", "Rottweiler", "Yorkshire Terrier", "Dachshund", "Cane Corso"
];

const CAT_BREEDS = [
  "Persian", "Maine Coon", "Ragdoll", "British Shorthair", "Siamese",
  "Bengal", "Birman", "American Shorthair", "Scottish Fold", "Sphynx"
];

export default function BuyerSubscribe() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isBuyer, loading } = useUserRole();
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [availableBreeds, setAvailableBreeds] = useState<string[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState("");
  const [subscriptionAmount, setSubscriptionAmount] = useState(0);
  
  const [formData, setFormData] = useState({
    species: "",
    maxPrice: "",
    subscriptionPlan: ""
  });

  useEffect(() => {
    if (!loading && isBuyer) {
      navigate("/dashboard");
    }
  }, [isBuyer, loading, navigate]);

  useEffect(() => {
    if (formData.species === "dog") {
      setAvailableBreeds(DOG_BREEDS);
    } else if (formData.species === "cat") {
      setAvailableBreeds(CAT_BREEDS);
    } else if (formData.species === "both") {
      setAvailableBreeds([...DOG_BREEDS, ...CAT_BREEDS]);
    } else {
      setAvailableBreeds([]);
    }
    setSelectedBreeds([]);
  }, [formData.species]);

  const toggleBreed = (breed: string) => {
    setSelectedBreeds(prev => 
      prev.includes(breed) 
        ? prev.filter(b => b !== breed)
        : [...prev, breed]
    );
  };

  const toggleGender = (gender: string) => {
    setSelectedGenders(prev => 
      prev.includes(gender) 
        ? prev.filter(g => g !== gender)
        : [...prev, gender]
    );
  };

  const toggleSize = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) 
        ? prev.filter(s => s !== size)
        : [...prev, size]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subscriptionPlan) {
      toast({ title: "Subscription Plan Required", variant: "destructive" });
      return;
    }

    if (!formData.species) {
      toast({ title: "Species Required", variant: "destructive" });
      return;
    }

    if (selectedBreeds.length === 0) {
      toast({ title: "Breed Required", description: "Select at least one breed", variant: "destructive" });
      return;
    }

    if (selectedGenders.length === 0) {
      toast({ title: "Gender Required", description: "Select at least one gender", variant: "destructive" });
      return;
    }

    if (selectedSizes.length === 0) {
      toast({ title: "Size Required", description: "Select at least one size", variant: "destructive" });
      return;
    }

    const amount = formData.subscriptionPlan === "buy-only" ? 5.99 : 9.99;
    setSubscriptionType("Buyer Subscription");
    setSubscriptionAmount(amount);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    toast({
      title: "Subscription Activated!",
      description: "Your buyer subscription is now active."
    });
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Buyer <span className="bg-gradient-hero bg-clip-text text-transparent">Subscription</span>
            </h1>
            <p className="text-muted-foreground">
              Subscribe to access premium breeding partners
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription & Pet Details</CardTitle>
                <CardDescription>Select your plan and tell us what you're looking for</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subscriptionPlan">Subscription Plan *</Label>
                  <Select
                    value={formData.subscriptionPlan}
                    onValueChange={(value) => setFormData({...formData, subscriptionPlan: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="buy-only">Buy Only - $5.99/month</SelectItem>
                      <SelectItem value="breeding-services">Find Breeding Partner - $9.99/month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.subscriptionPlan === "breeding-services" && (
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Access premium breeding partners</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Refundable Deposit (Goes towards the final payment)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Average cost: $150+</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Specialty breeds: $1,500+</span>
                      </li>
                    </ul>
                  </div>
                )}

                <div>
                  <Label htmlFor="species">Species *</Label>
                  <Select
                    value={formData.species}
                    onValueChange={(value) => setFormData({...formData, species: value})}
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

                {availableBreeds.length > 0 && (
                  <div>
                    <Label>Breeds * (Select multiple)</Label>
                    <div className="border rounded-md p-4 max-h-48 overflow-y-auto">
                      {availableBreeds.map((breed) => (
                        <div key={breed} className="flex items-center space-x-2 mb-2">
                          <Checkbox
                            id={breed}
                            checked={selectedBreeds.includes(breed)}
                            onCheckedChange={() => toggleBreed(breed)}
                          />
                          <Label htmlFor={breed} className="cursor-pointer">{breed}</Label>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      Selected: {selectedBreeds.length} breed(s)
                    </p>
                  </div>
                )}

                <div>
                  <Label>Gender * (Select multiple)</Label>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id="male"
                        checked={selectedGenders.includes("male")}
                        onCheckedChange={() => toggleGender("male")}
                      />
                      <Label htmlFor="male" className="cursor-pointer">Male</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="female"
                        checked={selectedGenders.includes("female")}
                        onCheckedChange={() => toggleGender("female")}
                      />
                      <Label htmlFor="female" className="cursor-pointer">Female</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Pet Size * (Select multiple)</Label>
                  <div className="border rounded-md p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id="small"
                        checked={selectedSizes.includes("small")}
                        onCheckedChange={() => toggleSize("small")}
                      />
                      <Label htmlFor="small" className="cursor-pointer">Small</Label>
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Checkbox
                        id="medium"
                        checked={selectedSizes.includes("medium")}
                        onCheckedChange={() => toggleSize("medium")}
                      />
                      <Label htmlFor="medium" className="cursor-pointer">Medium</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="large"
                        checked={selectedSizes.includes("large")}
                        onCheckedChange={() => toggleSize("large")}
                      />
                      <Label htmlFor="large" className="cursor-pointer">Large</Label>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="maxPrice">Maximum Price (Optional)</Label>
                  <Input
                    id="maxPrice"
                    type="number"
                    step="0.01"
                    value={formData.maxPrice}
                    onChange={(e) => setFormData({...formData, maxPrice: e.target.value})}
                    placeholder="Enter maximum price"
                  />
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" size="lg">
              Continue to Payment
            </Button>
          </form>
        </div>
      </main>
      <Footer />

      {showPayment && (
        <SubscriptionPayment
          open={showPayment}
          onClose={() => setShowPayment(false)}
          subscriptionType={subscriptionType}
          amount={subscriptionAmount}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
