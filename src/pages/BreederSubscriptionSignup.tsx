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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Upload, AlertCircle, Info, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { SmsOptInDialog } from "@/components/auth/SmsOptInDialog";

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

const US_STATES = [
  { code: "AL", name: "Alabama" }, { code: "AK", name: "Alaska" }, { code: "AZ", name: "Arizona" },
  { code: "AR", name: "Arkansas" }, { code: "CA", name: "California" }, { code: "CO", name: "Colorado" },
  { code: "CT", name: "Connecticut" }, { code: "DE", name: "Delaware" }, { code: "FL", name: "Florida" },
  { code: "GA", name: "Georgia" }, { code: "HI", name: "Hawaii" }, { code: "ID", name: "Idaho" },
  { code: "IL", name: "Illinois" }, { code: "IN", name: "Indiana" }, { code: "IA", name: "Iowa" },
  { code: "KS", name: "Kansas" }, { code: "KY", name: "Kentucky" }, { code: "LA", name: "Louisiana" },
  { code: "ME", name: "Maine" }, { code: "MD", name: "Maryland" }, { code: "MA", name: "Massachusetts" },
  { code: "MI", name: "Michigan" }, { code: "MN", name: "Minnesota" }, { code: "MS", name: "Mississippi" },
  { code: "MO", name: "Missouri" }, { code: "MT", name: "Montana" }, { code: "NE", name: "Nebraska" },
  { code: "NV", name: "Nevada" }, { code: "NH", name: "New Hampshire" }, { code: "NJ", name: "New Jersey" },
  { code: "NM", name: "New Mexico" }, { code: "NY", name: "New York" }, { code: "NC", name: "North Carolina" },
  { code: "ND", name: "North Dakota" }, { code: "OH", name: "Ohio" }, { code: "OK", name: "Oklahoma" },
  { code: "OR", name: "Oregon" }, { code: "PA", name: "Pennsylvania" }, { code: "RI", name: "Rhode Island" },
  { code: "SC", name: "South Carolina" }, { code: "SD", name: "South Dakota" }, { code: "TN", name: "Tennessee" },
  { code: "TX", name: "Texas" }, { code: "UT", name: "Utah" }, { code: "VT", name: "Vermont" },
  { code: "VA", name: "Virginia" }, { code: "WA", name: "Washington" }, { code: "WV", name: "West Virginia" },
  { code: "WI", name: "Wisconsin" }, { code: "WY", name: "Wyoming" }
];

const BreederSubscriptionSignup = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [photos, setPhotos] = useState<File[]>([]);
  const [parentPhotos, setParentPhotos] = useState<File[]>([]);
  const [showSmsOptIn, setShowSmsOptIn] = useState(false);
  const [pendingSignupData, setPendingSignupData] = useState<any>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    city: "",
    state: "",
    zipCode: "",
    subscriptionType: "",
    animalCount: "1"
  });

  const [animalDetails, setAnimalDetails] = useState<Array<{
    petName: string;
    species: string;
    breed: string;
    gender: string;
    birthDate: string;
    expectedDate: string;
    isSpecialBreed: string;
    petSize: string;
    specialBreedSize: string;
    deliveryMethod: string;
    price: string;
    description: string;
  }>>([{
    petName: "",
    species: "",
    breed: "",
    gender: "",
    birthDate: "",
    expectedDate: "",
    isSpecialBreed: "",
    petSize: "",
    specialBreedSize: "",
    deliveryMethod: "",
    price: "",
    description: ""
  }]);

  const [openSections, setOpenSections] = useState<number[]>([0]);

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (formData.zipCode.length === 5) {
      handleGeocodeZip();
    }
  }, [formData.zipCode]);

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
          birthDate: "",
          expectedDate: "",
          isSpecialBreed: "",
          petSize: "",
          specialBreedSize: "",
          deliveryMethod: "",
          price: "",
          description: ""
        });
      }
      while (newDetails.length > count) {
        newDetails.pop();
      }
      return newDetails;
    });
    
    // Open all sections when animal count changes
    if (count > 1) {
      setOpenSections(Array.from({ length: count }, (_, i) => i));
    }
  }, [formData.animalCount]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setCurrentUser(user);
    setLoading(false);
  };

  const handleGeocodeZip = async () => {
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${formData.zipCode}`);
      if (response.ok) {
        const data = await response.json();
        const place = data.places[0];
        setFormData({
          ...formData,
          city: place["place name"],
          state: place["state abbreviation"]
        });
      }
    } catch (error) {
      console.error("Error geocoding ZIP code:", error);
    }
  };

  const generateRandomPassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";
    const allChars = uppercase + lowercase + numbers + symbols;
    
    const length = Math.floor(Math.random() * 5) + 12; // 12-16 characters
    let password = "";
    
    // Ensure at least one of each type
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += symbols[Math.floor(Math.random() * symbols.length)];
    
    // Fill the rest randomly
    for (let i = password.length; i < length; i++) {
      password += allChars[Math.floor(Math.random() * allChars.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setGeneratedPassword(password);
    setFormData({...formData, password: password, confirmPassword: password});
    toast({
      title: "Password Generated",
      description: "A secure password has been generated for you"
    });
  };

  const copyPasswordToClipboard = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      toast({
        title: "Password Copied",
        description: "The password has been copied to your clipboard"
      });
    }
  };

  const validatePassword = (password: string): string | null => {
    if (password.length < 12) {
      return "Password must be at least 12 characters long";
    }
    
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)) {
      return "Password must contain at least one symbol";
    }
    
    // Check if password contains name, username, or email
    const lowerPassword = password.toLowerCase();
    const lowerName = formData.fullName.toLowerCase();
    const lowerUsername = formData.username.toLowerCase();
    const lowerEmail = formData.email.toLowerCase().split('@')[0];
    
    if (lowerName && lowerPassword.includes(lowerName)) {
      return "Password cannot contain your name";
    }
    
    if (lowerUsername && lowerPassword.includes(lowerUsername)) {
      return "Password cannot contain your username";
    }
    
    if (lowerEmail && lowerPassword.includes(lowerEmail)) {
      return "Password cannot contain your email";
    }
    
    return null;
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, isParent: boolean) => {
    const files = Array.from(e.target.files || []);
    if (isParent) {
      setParentPhotos(prev => [...prev, ...files]);
    } else {
      setPhotos(prev => [...prev, ...files]);
    }
  };

  const updateAnimalDetail = (index: number, field: string, value: string) => {
    setAnimalDetails(prev => {
      const newDetails = [...prev];
      newDetails[index] = { ...newDetails[index], [field]: value };
      return newDetails;
    });
  };

  const toggleSection = (index: number) => {
    setOpenSections(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const calculateMinPrice = (animalIndex: number) => {
    const animal = animalDetails[animalIndex];
    if (animal.isSpecialBreed === "yes") {
      switch (animal.specialBreedSize) {
        case "small": return 1500;
        case "medium": return 2000;
        case "large": return 3000;
        case "rare": return 4500;
        default: return 50;
      }
    }
    return 50;
  };

  const getAvailableBreeds = (species: string) => {
    if (species === "dog") return DOG_BREEDS;
    if (species === "cat") return CAT_BREEDS;
    return [];
  };

  const calculateEarnings = (price: number, isSpecial: string) => {
    if (isSpecial === "yes") return 85;
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

  const needsListingFee = (animalIndex: number) => {
    const price = parseFloat(animalDetails[animalIndex]?.price || "0");
    return price < 50;
  };

  const calculateListingFee = () => {
    let totalFee = 0;
    animalDetails.forEach((_, index) => {
      if (needsListingFee(index)) {
        totalFee += 49.99;
      }
    });
    return totalFee;
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

      if (!formData.phone.trim()) {
        toast({
          title: "Phone Number Required",
          description: "Please enter your phone number",
          variant: "destructive"
        });
        return;
      }

      if (!profilePhoto) {
        toast({
          title: "Profile Photo Required",
          description: "Please upload a profile photo",
          variant: "destructive"
        });
        return;
      }

      // Validate password
      const passwordError = validatePassword(formData.password);
      if (passwordError) {
        toast({
          title: "Invalid Password",
          description: passwordError,
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

      // Store signup data temporarily
      setPendingSignupData({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        username: formData.username,
        phone: formData.phone
      });

      // Show SMS opt-in dialog
      setShowSmsOptIn(true);
      return;
    }
    
    // Validate all animal details
    for (let i = 0; i < animalDetails.length; i++) {
      const animal = animalDetails[i];
      
      if (!animal.species) {
        toast({
          title: `Animal ${i + 1}: Species Required`,
          description: "Please select a species",
          variant: "destructive"
        });
        return;
      }

      if (!animal.breed) {
        toast({
          title: `Animal ${i + 1}: Breed Required`,
          description: "Please select a breed",
          variant: "destructive"
        });
        return;
      }

      if (!animal.gender) {
        toast({
          title: `Animal ${i + 1}: Gender Required`,
          description: "Please select a gender",
          variant: "destructive"
        });
        return;
      }

      if (!animal.petSize) {
        toast({
          title: `Animal ${i + 1}: Pet Size Required`,
          description: "Please select a pet size",
          variant: "destructive"
        });
        return;
      }

      if (!animal.birthDate && !animal.expectedDate) {
        toast({
          title: `Animal ${i + 1}: Date Required`,
          description: "Please provide either a birth date or expected date",
          variant: "destructive"
        });
        return;
      }

      if (!animal.isSpecialBreed) {
        toast({
          title: `Animal ${i + 1}: Breed Classification Required`,
          description: "Please indicate if this is a special breed",
          variant: "destructive"
        });
        return;
      }

      if (animal.isSpecialBreed === "yes" && !animal.specialBreedSize) {
        toast({
          title: `Animal ${i + 1}: Special Breed Size Required`,
          description: "Please select a special breed size category",
          variant: "destructive"
        });
        return;
      }

      if (!animal.deliveryMethod) {
        toast({
          title: `Animal ${i + 1}: Delivery Method Required`,
          description: "Please select a delivery method",
          variant: "destructive"
        });
        return;
      }

      const price = parseFloat(animal.price) || 0;
      const minPrice = calculateMinPrice(i);
      
      if (price < minPrice && price !== 0 && !needsListingFee(i)) {
        toast({
          title: `Animal ${i + 1}: Price Too Low`,
          description: `Minimum price for this category is $${minPrice}`,
          variant: "destructive"
        });
        return;
      }
    }

    if (!formData.subscriptionType) {
      toast({
        title: "Subscription Plan Required",
        description: "Please select a subscription plan",
        variant: "destructive"
      });
      return;
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

    toast({
      title: "Subscription Started",
      description: "Your breeder subscription is being processed. You've been assigned the breeder role!"
    });
  };

  const handleSmsOptIn = async (optedIn: boolean) => {
    setShowSmsOptIn(false);
    
    if (!pendingSignupData) return;

    try {
      // Create user account
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: pendingSignupData.email,
        password: pendingSignupData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: {
            full_name: pendingSignupData.fullName,
            username: pendingSignupData.username,
            phone: pendingSignupData.phone,
            sms_opt_in: optedIn
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

      // Store user ID for after email verification
      sessionStorage.setItem('breeder_user_id', authData.user.id);

      toast({
        title: "Verification Email Sent!",
        description: "Please check your email to verify your account before continuing."
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const totalPhotos = photos.length + parentPhotos.length;
  const animalCount = parseInt(formData.animalCount) || 1;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <SmsOptInDialog open={showSmsOptIn} onOptIn={handleSmsOptIn} />
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
            {/* Account Creation Section */}
            <Card>
              <CardHeader>
                <CardTitle>Create Your Account</CardTitle>
                <CardDescription>Sign up to become a breeder</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="profilePhoto">Profile Photo *</Label>
                  <Input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    required
                    disabled={!!currentUser}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setProfilePhoto(file);
                    }}
                    className="cursor-pointer"
                  />
                  {profilePhoto && (
                    <Badge variant="default" className="mt-2">
                      Photo selected: {profilePhoto.name}
                    </Badge>
                  )}
                </div>

                <div>
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    required
                    disabled={!!currentUser}
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
                    disabled={!!currentUser}
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
                    disabled={!!currentUser}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    disabled={!!currentUser}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <p className="text-xs text-muted-foreground mb-2">
                    Must be 12-16+ characters with uppercase, lowercase, numbers, and symbols. Cannot match name, username, or email.
                  </p>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    disabled={!!currentUser}
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    placeholder="Create a secure password"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <Checkbox
                      id="show-password"
                      checked={showPassword}
                      disabled={!!currentUser}
                      onCheckedChange={(checked) => setShowPassword(checked === true)}
                    />
                    <Label htmlFor="show-password" className="text-sm font-normal">Show password</Label>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      disabled={!!currentUser}
                      onClick={generateRandomPassword}
                    >
                      Generate Random Password
                    </Button>
                    {generatedPassword && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        onClick={copyPasswordToClipboard}
                      >
                        Copy Password
                      </Button>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    disabled={!!currentUser}
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    placeholder="Confirm your password"
                  />
                  <div className="flex items-center space-x-2 mt-2">
                    <Checkbox
                      id="show-confirm-password"
                      checked={showConfirmPassword}
                      disabled={!!currentUser}
                      onCheckedChange={(checked) => setShowConfirmPassword(checked === true)}
                    />
                    <Label htmlFor="show-confirm-password" className="text-sm font-normal">Show password</Label>
                  </div>
                  {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <Alert variant="destructive" className="mt-2">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Passwords do not match
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pet Details - Multiple Animals */}
            {animalDetails.map((animal, index) => (
              <Collapsible
                key={index}
                open={animalCount === 1 || openSections.includes(index)}
                onOpenChange={() => animalCount > 1 && toggleSection(index)}
              >
                <Card>
                  <CardHeader>
                    <CollapsibleTrigger className="flex items-center justify-between w-full">
                      <CardTitle>
                        Pet Details {animalCount > 1 && `(Animal ${index + 1})`}
                      </CardTitle>
                      {animalCount > 1 && (
                        <div>
                          {openSections.includes(index) ? (
                            <ChevronUp className="h-5 w-5" />
                          ) : (
                            <ChevronDown className="h-5 w-5" />
                          )}
                        </div>
                      )}
                    </CollapsibleTrigger>
                  </CardHeader>
                  <CollapsibleContent>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label>Pet Name</Label>
                          <Input
                            required
                            value={animal.petName}
                            onChange={(e) => updateAnimalDetail(index, 'petName', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Species</Label>
                          <Select 
                            value={animal.species} 
                            onValueChange={(v) => {
                              updateAnimalDetail(index, 'species', v);
                              updateAnimalDetail(index, 'breed', '');
                            }}
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
                          <Label>Breed</Label>
                          <Select 
                            value={animal.breed} 
                            onValueChange={(v) => updateAnimalDetail(index, 'breed', v)}
                            disabled={!animal.species}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={animal.species ? "Select breed" : "Select species first"} />
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
                        <div>
                          <Label>Gender</Label>
                          <Select value={animal.gender} onValueChange={(v) => updateAnimalDetail(index, 'gender', v)}>
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
                        <Select value={animal.petSize} onValueChange={(v) => updateAnimalDetail(index, 'petSize', v)}>
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
                            value={animal.birthDate}
                            onChange={(e) => updateAnimalDetail(index, 'birthDate', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Expected Date (if not born)</Label>
                          <Input
                            type="date"
                            value={animal.expectedDate}
                            onChange={(e) => updateAnimalDetail(index, 'expectedDate', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <Label>Description</Label>
                        <Textarea
                          required
                          placeholder="Describe your pet (do not include personal or sensitive information)"
                          value={animal.description}
                          onChange={(e) => updateAnimalDetail(index, 'description', e.target.value)}
                          rows={4}
                        />
                        <Alert className="mt-2">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            Do not add any personal or sensitive information in the details box
                          </AlertDescription>
                        </Alert>
                      </div>

                      {/* Breed Classification */}
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-3">Breed Classification</h4>
                        <div>
                          <Label>Is this a special breed?</Label>
                          <RadioGroup value={animal.isSpecialBreed} onValueChange={(v) => updateAnimalDetail(index, 'isSpecialBreed', v)}>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="yes" id={`special-yes-${index}`} />
                              <Label htmlFor={`special-yes-${index}`}>Yes</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="no" id={`special-no-${index}`} />
                              <Label htmlFor={`special-no-${index}`}>No</Label>
                            </div>
                          </RadioGroup>
                        </div>

                        {animal.isSpecialBreed === "yes" && (
                          <div className="mt-4">
                            <Label>Special Breed Size Category</Label>
                            <Select value={animal.specialBreedSize} onValueChange={(v) => updateAnimalDetail(index, 'specialBreedSize', v)}>
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
                      </div>

                      {/* Delivery Method */}
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-3">Delivery Method</h4>
                        <RadioGroup value={animal.deliveryMethod} onValueChange={(v) => updateAnimalDetail(index, 'deliveryMethod', v)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="delivery" id={`delivery-${index}`} />
                            <Label htmlFor={`delivery-${index}`}>Delivery Available</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pickup" id={`pickup-${index}`} />
                            <Label htmlFor={`pickup-${index}`}>Pickup Only</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      {/* Pricing */}
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold mb-3">Pricing {animalCount > 1 && `- Animal ${index + 1}`}</h4>
                        <div>
                          <Label>Price ($)</Label>
                          <Input
                            type="number"
                            required
                            min="0"
                            step="0.01"
                            value={animal.price}
                            onChange={(e) => updateAnimalDetail(index, 'price', e.target.value)}
                            placeholder={`Minimum: $${calculateMinPrice(index)}`}
                          />
                        </div>

                        {animal.isSpecialBreed === "no" && (
                          <Alert className="mt-4">
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

                        {parseFloat(animal.price) > 0 && (
                          <div className="p-4 bg-muted rounded-lg mt-4">
                            <p className="font-semibold">Your Earnings: {calculateEarnings(parseFloat(animal.price), animal.isSpecialBreed)}%</p>
                            <p className="text-sm text-muted-foreground">
                              You earn ${(parseFloat(animal.price) * calculateEarnings(parseFloat(animal.price), animal.isSpecialBreed) / 100).toFixed(2)} per sale
                            </p>
                          </div>
                        )}

                        {needsListingFee(index) && (
                          <Alert variant="destructive" className="mt-4">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>
                              Prices under $50 require a one-time listing fee of $49.99
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}

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

            <Card>
              <CardHeader>
                <CardTitle>Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <Label>Zip Code</Label>
                    <Input
                      required
                      value={formData.zipCode}
                      onChange={(e) => setFormData({...formData, zipCode: e.target.value})}
                      placeholder="Enter zip code"
                      maxLength={5}
                    />
                  </div>
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
                    <Select 
                      value={formData.state} 
                      onValueChange={(v) => setFormData({...formData, state: v})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent>
                        {US_STATES.map((state) => (
                          <SelectItem key={state.code} value={state.code}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
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

                {/* Plan Description */}
                {formData.subscriptionType && (
                  <Alert className="border-primary/50 bg-primary/5">
                    <Info className="h-4 w-4 text-primary" />
                    <AlertDescription>
                      {formData.subscriptionType === "single-gender" && (
                        <div>
                          <p className="font-semibold mb-2">Perfect for breeders with males or females</p>
                          <ul className="space-y-1 text-sm">
                            <li>• List male or female pets</li>
                            <li>• Sell puppies & kittens</li>
                            <li>• Earn up to 85% on all sales</li>
                            <li>• Vaccination add-ons</li>
                            <li>• Care packages</li>
                            <li>• $499.99 refundable deposit</li>
                          </ul>
                        </div>
                      )}
                      {formData.subscriptionType === "both-genders" && (
                        <div>
                          <p className="font-semibold mb-2">For serious breeders managing both</p>
                          <ul className="space-y-1 text-sm">
                            <li>• List males & females</li>
                            <li>• Sell puppies & kittens</li>
                            <li>• Earn up to 85% on all sales</li>
                            <li>• All add-on packages</li>
                            <li>• Priority support</li>
                            <li>• $499.99 refundable deposit</li>
                          </ul>
                        </div>
                      )}
                      {formData.subscriptionType === "multi-single" && (
                        <div>
                          <p className="font-semibold mb-2">Multiple breeds, one gender</p>
                          <ul className="space-y-1 text-sm">
                            <li>• List multiple breeds</li>
                            <li>• Single gender listings</li>
                            <li>• Sell puppies & kittens</li>
                            <li>• Earn up to 85% on all sales</li>
                            <li>• All add-on packages</li>
                            <li>• Priority support</li>
                            <li>• $499.99 refundable deposit</li>
                          </ul>
                        </div>
                      )}
                      {formData.subscriptionType === "multi-both" && (
                        <div>
                          <p className="font-semibold mb-2">Full access for multiple breeds</p>
                          <ul className="space-y-1 text-sm">
                            <li>• List multiple breeds</li>
                            <li>• Both genders</li>
                            <li>• Sell puppies & kittens</li>
                            <li>• Earn up to 85% on all sales</li>
                            <li>• All add-on packages</li>
                            <li>• Premium support</li>
                            <li>• $499.99 refundable deposit</li>
                          </ul>
                        </div>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

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
                  {calculateListingFee() > 0 && (
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
