import { useState, useEffect } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, AlertCircle, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

const DOG_BREEDS = [
  "Labrador Retriever", "German Shepherd", "Golden Retriever", "French Bulldog",
  "Bulldog", "Poodle", "Beagle", "Rottweiler", "Yorkshire Terrier", "German Shorthaired Pointer",
  "Boxer", "Dachshund", "Pembroke Welsh Corgi", "Siberian Husky", "Australian Shepherd",
  "Great Dane", "Doberman Pinscher", "Cavalier King Charles Spaniel", "Miniature Schnauzer",
  "Shih Tzu", "Boston Terrier", "Pomeranian", "Havanese", "Shetland Sheepdog", "Brittany",
  "English Springer Spaniel", "Mastiff", "Cocker Spaniel", "Border Collie", "Chihuahua"
];

const CAT_BREEDS = [
  "Persian", "Maine Coon", "Ragdoll", "British Shorthair", "Siamese",
  "Abyssinian", "Bengal", "Birman", "American Shorthair", "Scottish Fold",
  "Sphynx", "Devon Rex", "Russian Blue", "Exotic Shorthair", "Norwegian Forest Cat",
  "Oriental", "Siberian", "Burmese", "Tonkinese", "Cornish Rex"
];

const BreederSubscriptionSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photos, setPhotos] = useState<File[]>([]);
  const [parentPhotos, setParentPhotos] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    petName: "",
    species: "",
    breed: "",
    gender: "",
    birthDate: "",
    expectedDate: "",
    city: "",
    state: "",
    isSpecialBreed: "",
    petSize: "",
    specialBreedSize: "",
    deliveryMethod: "",
    price: "",
    description: "",
    subscriptionType: "",
    animalCount: "1"
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    setLoading(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isParent: boolean) => {
    const files = Array.from(e.target.files || []);
    if (isParent) {
      setParentPhotos(prev => [...prev, ...files]);
    } else {
      setPhotos(prev => [...prev, ...files]);
    }
  };

  const calculateMinPrice = () => {
    if (formData.isSpecialBreed === "yes") {
      switch (formData.specialBreedSize) {
        case "small": return 1500;
        case "medium": return 2000;
        case "large": return 3000;
        case "rare": return 4500;
        default: return 50;
      }
    }
    return 50;
  };

  const getAvailableBreeds = () => {
    if (formData.species === "dog") return DOG_BREEDS;
    if (formData.species === "cat") return CAT_BREEDS;
    return [];
  };

  const calculateEarnings = (price: number) => {
    if (formData.isSpecialBreed === "yes") return 85;
    if (price >= 751) return 85;
    if (price >= 301) return 60;
    if (price >= 50) return 50;
    return 0;
  };

  const calculateSubscriptionCost = () => {
    const basePrice = formData.subscriptionType === "single-gender" ? 4.99 : 
                      formData.subscriptionType === "both-genders" ? 9.99 :
                      formData.subscriptionType === "multi-single" ? 12.99 :
                      formData.subscriptionType === "multi-both" ? 14.99 : 0;
    
    const animalCount = parseInt(formData.animalCount) || 1;
    const additionalCost = animalCount > 2 ? (animalCount - 2) * 4.99 : 0;
    
    return basePrice + additionalCost;
  };

  const needsListingFee = () => {
    const price = parseFloat(formData.price) || 0;
    return price < 50;
  };

  const calculateListingFee = () => {
    if (!needsListingFee()) return 0;
    const animalCount = parseInt(formData.animalCount) || 1;
    return animalCount * 49.99;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // If user is not logged in, validate signup fields
    if (!currentUser) {
      if (!formData.fullName.trim()) {
        toast({
          title: "Full Name Required",
          description: "Please enter your full name",
          variant: "destructive"
        });
        return;
      }

      if (!formData.username.trim()) {
        toast({
          title: "Username Required",
          description: "Please enter a username",
          variant: "destructive"
        });
        return;
      }

      if (!formData.email.trim()) {
        toast({
          title: "Email Required",
          description: "Please enter your email",
          variant: "destructive"
        });
        return;
      }

      if (!formData.password || formData.password.length < 8) {
        toast({
          title: "Password Required",
          description: "Password must be at least 8 characters",
          variant: "destructive"
        });
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Passwords Don't Match",
          description: "Please make sure both passwords match",
          variant: "destructive"
        });
        return;
      }

      // Create user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/breeder-subscription`,
          data: {
            full_name: formData.fullName,
            username: formData.username
          }
        }
      });

      if (signUpError) {
        toast({
          title: "Signup Failed",
          description: signUpError.message,
          variant: "destructive"
        });
        return;
      }

      if (!authData.user) {
        toast({
          title: "Signup Failed",
          description: "Could not create user account",
          variant: "destructive"
        });
        return;
      }

      // Assign breeder role
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert({ user_id: authData.user.id, role: "breeder" });

      if (roleError) {
        console.error("Role assignment error:", roleError);
      }

      setCurrentUser(authData.user);
    }
    
    // Validation
    if (photos.length < 5) {
      toast({
        title: "Photos Required",
        description: "Please upload at least 5 photos of your pet",
        variant: "destructive"
      });
      return;
    }

    if (parentPhotos.length < 2) {
      toast({
        title: "Parent Photos Required",
        description: "Please upload at least 2 photos of the parents",
        variant: "destructive"
      });
      return;
    }

    const price = parseFloat(formData.price) || 0;
    const minPrice = calculateMinPrice();
    
    if (price < minPrice && price !== 0 && !needsListingFee()) {
      toast({
        title: "Price Too Low",
        description: `Minimum price for this category is $${minPrice}`,
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Subscription Started",
      description: "Your breeder subscription is being processed. You've been assigned the breeder role!"
    });
  };

  const totalPhotos = photos.length + parentPhotos.length;
  const price = parseFloat(formData.price) || 0;
  const earningsPercent = calculateEarnings(price);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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
              {currentUser ? "Complete your breeder profile and start listing" : "Create your account and start your breeder subscription"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Account Creation Section - Only show if not logged in */}
            {!currentUser && (
              <Card>
                <CardHeader>
                  <CardTitle>Create Your Account</CardTitle>
                  <CardDescription>Sign up to become a breeder</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      required
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      placeholder="Choose a username"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="Enter your email"
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      placeholder="Create a password (min 8 characters)"
                    />
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="show-password"
                        checked={showPassword}
                        onCheckedChange={(checked) => setShowPassword(checked === true)}
                      />
                      <Label htmlFor="show-password" className="text-sm font-normal">Show password</Label>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                      placeholder="Confirm your password"
                    />
                    <div className="flex items-center space-x-2 mt-2">
                      <Checkbox
                        id="show-confirm-password"
                        checked={showConfirmPassword}
                        onCheckedChange={(checked) => setShowConfirmPassword(checked === true)}
                      />
                      <Label htmlFor="show-confirm-password" className="text-sm font-normal">Show password</Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Photo Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle>Photos</CardTitle>
                <CardDescription>Upload at least 5 photos (including 2 parent photos)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Pet Photos ({photos.length} uploaded)</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handlePhotoUpload(e, false)}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                <div>
                  <Label>Parent Photos ({parentPhotos.length} uploaded) - Required: 2</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <Input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handlePhotoUpload(e, true)}
                      className="cursor-pointer"
                    />
                  </div>
                </div>
                {totalPhotos > 0 && (
                  <Badge variant={totalPhotos >= 5 && parentPhotos.length >= 2 ? "default" : "secondary"}>
                    {totalPhotos} total photos uploaded
                  </Badge>
                )}
              </CardContent>
            </Card>

            {/* Pet Details */}
            <Card>
              <CardHeader>
                <CardTitle>Pet Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Pet Name</Label>
                    <Input
                      required
                      value={formData.petName}
                      onChange={(e) => setFormData({...formData, petName: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Species</Label>
                    <Select value={formData.species} onValueChange={(v) => setFormData({...formData, species: v, breed: ""})}>
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
                    <Label>Breed</Label>
                    <Select 
                      value={formData.breed} 
                      onValueChange={(v) => setFormData({...formData, breed: v})}
                      disabled={!formData.species}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={formData.species ? "Select breed" : "Select species first"} />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableBreeds().map((breed) => (
                          <SelectItem key={breed} value={breed}>
                            {breed}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Gender</Label>
                    <Select value={formData.gender} onValueChange={(v) => setFormData({...formData, gender: v})}>
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

                <div>
                  <Label>Pet Size</Label>
                  <Select value={formData.petSize} onValueChange={(v) => setFormData({...formData, petSize: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select pet size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small Breed</SelectItem>
                      <SelectItem value="medium">Medium Breed</SelectItem>
                      <SelectItem value="large">Large Breed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>Birth Date (if born)</Label>
                    <Input
                      type="date"
                      value={formData.birthDate}
                      onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>Expected Date (if not born)</Label>
                    <Input
                      type="date"
                      value={formData.expectedDate}
                      onChange={(e) => setFormData({...formData, expectedDate: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <Label>Description</Label>
                  <Textarea
                    required
                    placeholder="Describe your pet (do not include personal or sensitive information)"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    rows={4}
                  />
                  <Alert className="mt-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Do not add any personal or sensitive information in the details box
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>

            {/* Location */}
            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label>City</Label>
                    <Input
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({...formData, city: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label>State</Label>
                    <Input
                      required
                      value={formData.state}
                      onChange={(e) => setFormData({...formData, state: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Breed Classification */}
            <Card>
              <CardHeader>
                <CardTitle>Breed Classification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Is this a special breed?</Label>
                  <RadioGroup value={formData.isSpecialBreed} onValueChange={(v) => setFormData({...formData, isSpecialBreed: v})}>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="special-yes" />
                      <Label htmlFor="special-yes">Yes</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="special-no" />
                      <Label htmlFor="special-no">No</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.isSpecialBreed === "yes" && (
                  <div>
                    <Label>Special Breed Size Category</Label>
                    <Select value={formData.specialBreedSize} onValueChange={(v) => setFormData({...formData, specialBreedSize: v})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="small">Small - Min $1,500</SelectItem>
                        <SelectItem value="medium">Medium - Min $2,000</SelectItem>
                        <SelectItem value="large">Large - Min $3,000</SelectItem>
                        <SelectItem value="rare">Rare - Min $4,500</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Delivery Method */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Method</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={formData.deliveryMethod} onValueChange={(v) => setFormData({...formData, deliveryMethod: v})}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="delivery" id="delivery" />
                    <Label htmlFor="delivery">Delivery Available</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="pickup" id="pickup" />
                    <Label htmlFor="pickup">Pickup Only</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Pricing */}
            <Card>
              <CardHeader>
                <CardTitle>Pricing</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    placeholder={`Minimum: $${calculateMinPrice()}`}
                  />
                </div>

                {formData.isSpecialBreed === "no" && (
                  <Alert>
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      <strong>Non-Special Breed Earnings:</strong>
                      <ul className="mt-2 space-y-1">
                        <li>• $50-$300: Earn 50%</li>
                        <li>• $301-$750: Earn 60%</li>
                        <li>• $751 and up: Earn 85%</li>
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                {price > 0 && (
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="font-semibold">Your Earnings: {earningsPercent}%</p>
                    <p className="text-sm text-muted-foreground">
                      You earn ${(price * earningsPercent / 100).toFixed(2)} per sale
                    </p>
                  </div>
                )}

                {needsListingFee() && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Prices under $50 require a one-time listing fee of $49.99 per animal
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Subscription Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Plan</Label>
                  <Select value={formData.subscriptionType} onValueChange={(v) => setFormData({...formData, subscriptionType: v})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select subscription" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="single-gender">Single Gender - $4.99/mo</SelectItem>
                      <SelectItem value="both-genders">Both Genders - $9.99/mo</SelectItem>
                      <SelectItem value="multi-single">Multi-Breed Single Gender - $12.99/mo</SelectItem>
                      <SelectItem value="multi-both">Multi-Breed Both Genders - $14.99/mo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Number of Animals</Label>
                  <Select value={formData.animalCount} onValueChange={(v) => setFormData({...formData, animalCount: v})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <SelectItem key={n} value={n.toString()}>
                          {n} {n === 1 ? "animal" : "animals"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {parseInt(formData.animalCount) > 2 && (
                    <p className="text-sm text-muted-foreground mt-1">
                      +${((parseInt(formData.animalCount) - 2) * 4.99).toFixed(2)} for {parseInt(formData.animalCount) - 2} additional animals
                    </p>
                  )}
                </div>

                <div className="p-4 bg-primary/10 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span>Subscription:</span>
                    <span className="font-semibold">${calculateSubscriptionCost().toFixed(2)}/mo</span>
                  </div>
                  {needsListingFee() && (
                    <div className="flex justify-between text-destructive">
                      <span>Listing Fee:</span>
                      <span className="font-semibold">${calculateListingFee().toFixed(2)} (one-time)</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" size="lg" variant="hero">
              Complete Subscription
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BreederSubscriptionSignup;
