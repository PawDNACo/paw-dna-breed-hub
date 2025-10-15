import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Upload, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import SubscriptionPayment from "@/components/payment/SubscriptionPayment";

const DOG_BREEDS = [
  "Labrador Retriever", "German Shepherd", "Golden Retriever", "French Bulldog",
  "Bulldog", "Poodle", "Beagle", "Rottweiler", "Yorkshire Terrier", "Dachshund", "Cane Corso"
];

const CAT_BREEDS = [
  "Persian", "Maine Coon", "Ragdoll", "British Shorthair", "Siamese",
  "Bengal", "Birman", "American Shorthair", "Scottish Fold", "Sphynx"
];

export default function BreederSubscribe() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isBreeder, loading } = useUserRole();
  const { isQA, isDeveloper } = useUserRole();
  const [showPayment, setShowPayment] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState("");
  const [subscriptionAmount, setSubscriptionAmount] = useState(0);

  const [formData, setFormData] = useState({
    subscriptionType: "",
    animalCount: "1"
  });

  const [animalDetails, setAnimalDetails] = useState<Array<{
    petName: string;
    species: string;
    breed: string;
    gender: string;
    petSize: string;
    price: string;
    description: string;
    photos: File[];
  }>>([{
    petName: "",
    species: "",
    breed: "",
    gender: "",
    petSize: "",
    price: "",
    description: "",
    photos: []
  }]);

  const [openSections, setOpenSections] = useState<number[]>([0]);

  useEffect(() => {
    if (!loading && isBreeder) {
      navigate("/dashboard");
    }
  }, [isBreeder, loading, navigate]);

  useEffect(() => {
    const count = parseInt(formData.animalCount) || 1;
    setAnimalDetails(prev => {
      const newDetails = [...prev];
      while (newDetails.length < count) {
        newDetails.push({
          petName: "",
          species: "",
          breed: "",
          gender: "",
          petSize: "",
          price: "",
          description: "",
          photos: []
        });
      }
      while (newDetails.length > count) {
        newDetails.pop();
      }
      return newDetails;
    });
  }, [formData.animalCount]);

  const updateAnimalDetail = (index: number, field: string, value: string | File[]) => {
    setAnimalDetails(prev => {
      const newDetails = [...prev];
      newDetails[index] = { ...newDetails[index], [field]: value };
      return newDetails;
    });
  };

  const handlePhotoUpload = (index: number, files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      updateAnimalDetail(index, 'photos', fileArray);
    }
  };

  const toggleSection = (index: number) => {
    setOpenSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const getAvailableBreeds = (species: string) => {
    if (species === "dog") return DOG_BREEDS;
    if (species === "cat") return CAT_BREEDS;
    return [];
  };

  const calculateSubscriptionCost = () => {
    // QA and Developer roles get free subscriptions
    if (isQA || isDeveloper) return 0;
    
    const basePrice = formData.subscriptionType === "single-gender" ? 4.99 : 
                      formData.subscriptionType === "both-genders" ? 9.99 :
                      formData.subscriptionType === "multi-single" ? 12.99 :
                      formData.subscriptionType === "multi-both" ? 14.99 : 0;
    
    const animalCount = parseInt(formData.animalCount) || 1;
    const additionalCost = animalCount > 2 ? (animalCount - 2) * 4.99 : 0;
    
    return basePrice + additionalCost;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subscriptionType) {
      toast({
        title: "Subscription Plan Required",
        description: "Please select a subscription plan",
        variant: "destructive"
      });
      return;
    }

    const cost = calculateSubscriptionCost();
    setSubscriptionType("Breeder Subscription");
    setSubscriptionAmount(cost);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    toast({
      title: "Subscription Activated!",
      description: "Your breeder subscription is now active."
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
              Breeder <span className="bg-gradient-hero bg-clip-text text-transparent">Subscription</span>
            </h1>
            <p className="text-muted-foreground">
              Complete your subscription to start listing pets
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>Choose the plan that fits your needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Subscription Type *</Label>
                  <RadioGroup value={formData.subscriptionType} onValueChange={(value) => setFormData({...formData, subscriptionType: value})}>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="single-gender" id="single-gender" />
                      <Label htmlFor="single-gender" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Single Gender - $4.99/month</div>
                        <div className="text-sm text-muted-foreground">For 1-2 animals of the same gender</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg border-primary">
                      <RadioGroupItem value="both-genders" id="both-genders" />
                      <Label htmlFor="both-genders" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Both Genders - $9.99/month</div>
                        <div className="text-sm text-muted-foreground">For 1-2 animals of both genders</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="multi-single" id="multi-single" />
                      <Label htmlFor="multi-single" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Multi Single Gender - $12.99/month</div>
                        <div className="text-sm text-muted-foreground">For 3+ animals, same gender (+$4.99 per additional pet)</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="multi-both" id="multi-both" />
                      <Label htmlFor="multi-both" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Multi Both Genders - $14.99/month</div>
                        <div className="text-sm text-muted-foreground">For 3+ animals, both genders (+$4.99 per additional pet)</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {(formData.subscriptionType === "multi-single" || formData.subscriptionType === "multi-both") && (
                  <div>
                    <Label htmlFor="animalCount">Number of Animals</Label>
                    <Input
                      id="animalCount"
                      type="number"
                      min="3"
                      value={formData.animalCount}
                      onChange={(e) => setFormData({...formData, animalCount: e.target.value})}
                    />
                  </div>
                )}

                {formData.subscriptionType && (
                  <Alert>
                    <AlertDescription>
                      Total Cost: <strong>${calculateSubscriptionCost().toFixed(2)}/month</strong>
                      <br />
                      Includes 7-day free trial
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {(formData.subscriptionType === "multi-single" || formData.subscriptionType === "multi-both") && (
              <Card>
                <CardHeader>
                  <CardTitle>Pet Details</CardTitle>
                  <CardDescription>Provide information for each pet you'll be listing</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {animalDetails.map((animal, index) => (
                    <Collapsible 
                      key={index} 
                      open={openSections.includes(index)}
                      onOpenChange={() => toggleSection(index)}
                    >
                      <div className="border rounded-lg p-4">
                        <CollapsibleTrigger className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Pet {index + 1}</Badge>
                            {animal.petName && (
                              <span className="text-sm font-medium">{animal.petName}</span>
                            )}
                          </div>
                          {openSections.includes(index) ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </CollapsibleTrigger>
                        
                        <CollapsibleContent className="pt-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`petName-${index}`}>Pet Name</Label>
                              <Input
                                id={`petName-${index}`}
                                value={animal.petName}
                                onChange={(e) => updateAnimalDetail(index, 'petName', e.target.value)}
                                placeholder="Enter pet name"
                              />
                            </div>
                            <div>
                              <Label htmlFor={`species-${index}`}>Species</Label>
                              <Select 
                                value={animal.species}
                                onValueChange={(value) => updateAnimalDetail(index, 'species', value)}
                              >
                                <SelectTrigger id={`species-${index}`}>
                                  <SelectValue placeholder="Select species" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="dog">Dog</SelectItem>
                                  <SelectItem value="cat">Cat</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          {animal.species && (
                            <div>
                              <Label htmlFor={`breed-${index}`}>Breed</Label>
                              <Select
                                value={animal.breed}
                                onValueChange={(value) => updateAnimalDetail(index, 'breed', value)}
                              >
                                <SelectTrigger id={`breed-${index}`}>
                                  <SelectValue placeholder="Select breed" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getAvailableBreeds(animal.species).map((breed) => (
                                    <SelectItem key={breed} value={breed}>
                                      {breed}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label htmlFor={`gender-${index}`}>Gender</Label>
                              <Select
                                value={animal.gender}
                                onValueChange={(value) => updateAnimalDetail(index, 'gender', value)}
                              >
                                <SelectTrigger id={`gender-${index}`}>
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor={`petSize-${index}`}>Size</Label>
                              <Select
                                value={animal.petSize}
                                onValueChange={(value) => updateAnimalDetail(index, 'petSize', value)}
                              >
                                <SelectTrigger id={`petSize-${index}`}>
                                  <SelectValue placeholder="Select size" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="small">Small</SelectItem>
                                  <SelectItem value="medium">Medium</SelectItem>
                                  <SelectItem value="large">Large</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>

                          <div>
                            <Label htmlFor={`price-${index}`}>Price ($)</Label>
                            <Input
                              id={`price-${index}`}
                              type="number"
                              value={animal.price}
                              onChange={(e) => updateAnimalDetail(index, 'price', e.target.value)}
                              placeholder="Enter price"
                            />
                          </div>

                          <div>
                            <Label htmlFor={`description-${index}`}>Description</Label>
                            <Textarea
                              id={`description-${index}`}
                              value={animal.description}
                              onChange={(e) => updateAnimalDetail(index, 'description', e.target.value)}
                              placeholder="Describe your pet..."
                              rows={3}
                            />
                          </div>

                          <div>
                            <Label htmlFor={`photos-${index}`}>Pet Photos</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                id={`photos-${index}`}
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handlePhotoUpload(index, e.target.files)}
                                className="cursor-pointer"
                              />
                              <Upload className="h-4 w-4 text-muted-foreground" />
                            </div>
                            {animal.photos.length > 0 && (
                              <p className="text-sm text-muted-foreground mt-1">
                                {animal.photos.length} photo(s) selected
                              </p>
                            )}
                          </div>
                        </CollapsibleContent>
                      </div>
                    </Collapsible>
                  ))}
                </CardContent>
              </Card>
            )}

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
