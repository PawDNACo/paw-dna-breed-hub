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
import { useUserRole } from "@/hooks/useUserRole";

const DOG_BREEDS = [
  "Labrador Retriever", "German Shepherd", "Golden Retriever", "French Bulldog",
  "Bulldog", "Poodle", "Beagle", "Rottweiler", "Yorkshire Terrier", "German Shorthaired Pointer",
  "Boxer", "Dachshund", "Pembroke Welsh Corgi", "Siberian Husky", "Australian Shepherd",
  "Great Dane", "Doberman Pinscher", "Cavalier King Charles Spaniel", "Miniature Schnauzer",
  "Shih Tzu", "Boston Terrier", "Pomeranian", "Havanese", "Shetland Sheepdog", "Brittany",
  "English Springer Spaniel", "Mastiff", "Cocker Spaniel", "Border Collie", "Chihuahua", "Cane Corso"
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

const RehomingSubscription = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isQA, isDeveloper } = useUserRole();
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

  const [openSections, setOpenSections] = useState<{[key: number]: boolean}>({0: true});

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const animalCount = parseInt(formData.animalCount) || 1;
    if (animalDetails.length < animalCount) {
      const newDetails = [...animalDetails];
      for (let i = animalDetails.length; i < animalCount; i++) {
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
      setAnimalDetails(newDetails);
    } else if (animalDetails.length > animalCount) {
      setAnimalDetails(animalDetails.slice(0, animalCount));
    }
  }, [formData.animalCount]);

  useEffect(() => {
    if (formData.zipCode.length === 5) {
      fetchLocationData(formData.zipCode);
    }
  }, [formData.zipCode]);

  const fetchLocationData = async (zipCode: string) => {
    try {
      const response = await fetch(`https://api.zippopotam.us/us/${zipCode}`);
      if (response.ok) {
        const data = await response.json();
        setFormData(prev => ({
          ...prev,
          city: data.places[0]["place name"],
          state: data.places[0]["state abbreviation"]
        }));
      }
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const validatePassword = (password: string) => {
    if (password.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(password)) return "Password must contain an uppercase letter";
    if (!/[a-z]/.test(password)) return "Password must contain a lowercase letter";
    if (!/[0-9]/.test(password)) return "Password must contain a number";
    if (!/[!@#$%^&*]/.test(password)) return "Password must contain a special character (!@#$%^&*)";
    return null;
  };

  const generateStrongPassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const special = "!@#$%^&*";
    const all = uppercase + lowercase + numbers + special;
    
    let password = "";
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];
    password += special[Math.floor(Math.random() * special.length)];
    
    for (let i = 0; i < 8; i++) {
      password += all[Math.floor(Math.random() * all.length)];
    }
    
    return password.split('').sort(() => Math.random() - 0.5).join('');
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Password copied to clipboard"
    });
  };

  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfilePhoto(e.target.files[0]);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  const handleParentPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setParentPhotos(Array.from(e.target.files));
    }
  };

  const updateAnimalDetail = (index: number, field: string, value: any) => {
    const newDetails = [...animalDetails];
    newDetails[index] = { ...newDetails[index], [field]: value };
    setAnimalDetails(newDetails);
  };

  const toggleSection = (index: number) => {
    setOpenSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const getAvailableBreeds = (species: string) => {
    if (species === "dog") return DOG_BREEDS;
    if (species === "cat") return CAT_BREEDS;
    return [];
  };

  const calculateMinPrice = (animalIndex: number) => {
    const animal = animalDetails[animalIndex];
    if (animal.isSpecialBreed === "yes") {
      if (animal.specialBreedSize === "small") return 1500;
      if (animal.specialBreedSize === "medium") return 2000;
      if (animal.specialBreedSize === "large") return 3000;
      if (animal.specialBreedSize === "rare") return 4500;
    }
    return 50;
  };

  const calculateSubscriptionCost = () => {
    // QA and Developer roles get free subscriptions
    if (isQA || isDeveloper) return 0;
    
    const basePrice = formData.subscriptionType === "single-pet" ? 2.99 : 
                      formData.subscriptionType === "multi-pet" ? 5.99 : 0;
    
    const animalCount = parseInt(formData.animalCount) || 1;
    const additionalCost = animalCount > 2 ? (animalCount - 2) * 2.99 : 0;
    
    return basePrice + additionalCost;
  };

  const needsListingFee = (animalIndex: number) => {
    // QA and Developer roles don't pay listing fees
    if (isQA || isDeveloper) return false;
    
    const price = parseFloat(animalDetails[animalIndex]?.price || "0");
    return price < 50;
  };

  const calculateListingFee = () => {
    // QA and Developer roles don't pay listing fees
    if (isQA || isDeveloper) return 0;
    
    let totalFee = 0;
    animalDetails.forEach((_, index) => {
      if (needsListingFee(index)) {
        totalFee += 19.99;
      }
    });
    return totalFee;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
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

      setPendingSignupData({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        username: formData.username,
        phone: formData.phone
      });

      setShowSmsOptIn(true);
      return;
    }
    
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

      // Only require price for non-special breeds
      if (animal.isSpecialBreed === "no") {
        const price = parseFloat(animal.price);
        if (!price || price < calculateMinPrice(i)) {
          toast({
            title: `Animal ${i + 1}: Invalid Price`,
            description: `Minimum price is $${calculateMinPrice(i)}`,
            variant: "destructive"
          });
          return;
        }
      }
    }

    if (!formData.subscriptionType) {
      toast({
        title: "Subscription Required",
        description: "Please select a subscription plan",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success!",
      description: "Your rehoming subscription has been submitted. Animals are labeled as 'rehome'."
    });
    
    navigate("/dashboard");
  };

  const handleSmsOptIn = async (optedIn: boolean) => {
    setShowSmsOptIn(false);

    if (!pendingSignupData) return;

    try {
      const { data, error } = await supabase.auth.signUp({
        email: pendingSignupData.email,
        password: pendingSignupData.password,
        options: {
          data: {
            full_name: pendingSignupData.fullName,
            username: pendingSignupData.username,
            phone: optedIn ? pendingSignupData.phone : null,
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Account Created!",
        description: "Please continue with your subscription"
      });

      setCurrentUser(data.user);
      setPendingSignupData(null);
    } catch (error: any) {
      toast({
        title: "Signup Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const animalCount = parseInt(formData.animalCount) || 1;

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <SmsOptInDialog 
        open={showSmsOptIn}
        onOptIn={handleSmsOptIn}
      />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Rehoming <span className="bg-gradient-hero bg-clip-text text-transparent">Subscription</span>
            </h1>
            <p className="text-muted-foreground">
              Help pets find loving homes through our rehoming platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Your Account</CardTitle>
                <CardDescription>Sign up to start rehoming pets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    required
                    disabled={!!currentUser}
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Username</Label>
                  <Input
                    required
                    disabled={!!currentUser}
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    required
                    disabled={!!currentUser}
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Phone Number</Label>
                  <Input
                    type="tel"
                    required
                    disabled={!!currentUser}
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </div>

                <div>
                  <Label>Profile Photo</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    disabled={!!currentUser}
                    onChange={handleProfilePhotoUpload}
                  />
                </div>

                <div>
                  <Label>Password</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        type={showPassword ? "text" : "password"}
                        required
                        disabled={!!currentUser}
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={!!currentUser}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={!!currentUser}
                      onClick={() => {
                        const pwd = generateStrongPassword();
                        setGeneratedPassword(pwd);
                        setFormData({...formData, password: pwd, confirmPassword: pwd});
                      }}
                    >
                      Generate Strong Password
                    </Button>
                    {generatedPassword && (
                      <div className="flex gap-2 items-center">
                        <code className="text-xs bg-muted p-2 rounded flex-1">{generatedPassword}</code>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(generatedPassword)}
                        >
                          Copy
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label>Confirm Password</Label>
                  <div className="flex gap-2">
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      disabled={!!currentUser}
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={!!currentUser}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {animalDetails.map((animal, index) => (
              <Collapsible key={index} open={openSections[index]} onOpenChange={() => toggleSection(index)}>
                <Card>
                  <CollapsibleTrigger className="w-full">
                    <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <CardTitle>
                            Pet {index + 1} Details
                            {animal.petName && ` - ${animal.petName}`}
                          </CardTitle>
                          <CardDescription>
                            {animal.species && animal.breed ? `${animal.species} - ${animal.breed}` : "Click to add details"}
                          </CardDescription>
                        </div>
                        {openSections[index] ? <ChevronUp /> : <ChevronDown />}
                      </div>
                    </CardHeader>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="space-y-4 pt-4">
                      <div>
                        <Label>Pet Name (Optional)</Label>
                        <Input
                          value={animal.petName}
                          onChange={(e) => updateAnimalDetail(index, 'petName', e.target.value)}
                          placeholder="Enter pet name"
                        />
                      </div>

                      <div>
                        <Label>Species</Label>
                        <Select value={animal.species} onValueChange={(v) => updateAnimalDetail(index, 'species', v)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select species" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="dog">Dog</SelectItem>
                            <SelectItem value="cat">Cat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {animal.species && (
                        <div>
                          <Label>Breed</Label>
                          <Select value={animal.breed} onValueChange={(v) => updateAnimalDetail(index, 'breed', v)}>
                            <SelectTrigger>
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
                          <Label>Birth Date (if known)</Label>
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
                                <SelectItem value="small">Small</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="large">Large</SelectItem>
                                <SelectItem value="rare">Rare</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

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

                      {/* Only show pricing section for non-special breeds */}
                      {animal.isSpecialBreed === "no" && (
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

                          {needsListingFee(index) && (
                            <Alert variant="destructive" className="mt-4">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>
                                Prices under $50 require a one-time listing fee of $19.99
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>
            ))}

            <Card>
              <CardHeader>
                <CardTitle>Upload Photos</CardTitle>
                <CardDescription>Add photos of your pet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Pet Photos (up to 10)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                  />
                  {photos.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {photos.length} photo(s) selected
                    </p>
                  )}
                </div>

                <div>
                  <Label>Parent Photos (optional)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleParentPhotoUpload}
                  />
                  {parentPhotos.length > 0 && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {parentPhotos.length} parent photo(s) selected
                    </p>
                  )}
                </div>
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
                      <SelectItem value="single-pet">Single Pet - $2.99/mo</SelectItem>
                      <SelectItem value="multi-pet">Multiple Pets - $5.99/mo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {formData.subscriptionType && (
                  <Alert className="border-primary/50 bg-primary/5">
                    <Info className="h-4 w-4 text-primary" />
                    <AlertDescription>
                      {formData.subscriptionType === "single-pet" && (
                        <div>
                          <p className="font-semibold mb-2">Perfect for rehoming one pet</p>
                          <ul className="space-y-1 text-sm">
                            <li>• List one pet for rehoming</li>
                            <li>• Connect with verified buyers</li>
                            <li>• Safe and secure platform</li>
                          </ul>
                        </div>
                      )}
                      {formData.subscriptionType === "multi-pet" && (
                        <div>
                          <p className="font-semibold mb-2">For multiple pets</p>
                          <ul className="space-y-1 text-sm">
                            <li>• List multiple pets</li>
                            <li>• Priority support</li>
                            <li>• All platform features</li>
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
                      +${((parseInt(formData.animalCount) - 2) * 2.99).toFixed(2)} for {parseInt(formData.animalCount) - 2} additional animals
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
              Complete Rehoming Subscription
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RehomingSubscription;
