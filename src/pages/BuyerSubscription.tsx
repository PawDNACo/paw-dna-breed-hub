import { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { SmsOptInDialog } from "@/components/auth/SmsOptInDialog";

const DOG_BREEDS = [
  "Labrador Retriever", "German Shepherd", "Golden Retriever", "French Bulldog",
  "Bulldog", "Poodle", "Beagle", "Rottweiler", "Yorkshire Terrier", "Dachshund", "Cane Corso"
];

const CAT_BREEDS = [
  "Persian", "Maine Coon", "Ragdoll", "British Shorthair", "Siamese",
  "Bengal", "Birman", "American Shorthair", "Scottish Fold", "Sphynx"
];

export default function BuyerSubscription() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [selectedBreeds, setSelectedBreeds] = useState<string[]>([]);
  const [selectedGenders, setSelectedGenders] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [availableBreeds, setAvailableBreeds] = useState<string[]>([]);
  const [showSmsOptIn, setShowSmsOptIn] = useState(false);
  const [pendingSignupData, setPendingSignupData] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    species: "",
    maxPrice: "",
    subscriptionPlan: ""
  });

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
      setPasswordCopied(true);
      toast({
        title: "Password Copied",
        description: "The password has been copied to your clipboard"
      });
      setTimeout(() => setPasswordCopied(false), 2000);
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
    
    // Validate all required fields
    if (!formData.fullName.trim()) {
      toast({ title: "Full Name Required", variant: "destructive" });
      return;
    }

    if (!formData.username.trim()) {
      toast({ title: "Username Required", variant: "destructive" });
      return;
    }

    if (!formData.email.trim()) {
      toast({ title: "Email Required", variant: "destructive" });
      return;
    }

    if (!profilePhoto) {
      toast({ title: "Profile Photo Required", variant: "destructive" });
      return;
    }

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      toast({ title: "Invalid Password", description: passwordError, variant: "destructive" });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast({ title: "Passwords Don't Match", variant: "destructive" });
      return;
    }

    // Validate subscription plan
    if (!formData.subscriptionPlan) {
      toast({ title: "Subscription Plan Required", variant: "destructive" });
      return;
    }

    // Validate pet details
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

    try {
      // Store signup data temporarily
      setPendingSignupData({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        username: formData.username,
        species: formData.species,
        selectedBreeds,
        selectedGenders,
        selectedSizes,
        maxPrice: formData.maxPrice
      });

      // Show SMS opt-in dialog
      setShowSmsOptIn(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
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
            phone: "",
            sms_opt_in: optedIn
          }
        }
      });

      if (signUpError) {
        toast({ title: "Signup Failed", description: signUpError.message, variant: "destructive" });
        return;
      }

      if (!authData.user) {
        toast({ title: "Signup Failed", description: "Could not create user account", variant: "destructive" });
        return;
      }

      // Store preferences to be added after email verification
      sessionStorage.setItem('buyer_preferences', JSON.stringify({
        userId: authData.user.id,
        species: pendingSignupData.species,
        breed: pendingSignupData.selectedBreeds.join(", "),
        gender: pendingSignupData.selectedGenders,
        size: pendingSignupData.selectedSizes,
        max_price: parseFloat(pendingSignupData.maxPrice) || null
      }));

      toast({
        title: "Verification Email Sent!",
        description: "Please check your email to verify your account before signing in."
      });

      navigate("/login");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      <SmsOptInDialog open={showSmsOptIn} onOptIn={handleSmsOptIn} />
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
            {/* Account Creation Section */}
            <Card>
              <CardHeader>
                <CardTitle>Create Your Account</CardTitle>
                <CardDescription>Sign up to start finding pets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="username">Username *</Label>
                  <Input
                    id="username"
                    required
                    value={formData.username}
                    onChange={(e) => setFormData({...formData, username: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>

                <div>
                  <Label htmlFor="profilePhoto">Profile Photo *</Label>
                  <Input
                    id="profilePhoto"
                    type="file"
                    accept="image/*"
                    required
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setProfilePhoto(file);
                    }}
                    className="cursor-pointer"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    12-16+ characters with uppercase, lowercase, numbers, and symbols
                  </p>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={generateRandomPassword}>
                    Generate Password
                  </Button>
                  {generatedPassword && (
                    <Button type="button" variant="outline" onClick={copyPasswordToClipboard}>
                      {passwordCopied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                      {passwordCopied ? "Copied!" : "Copy"}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pet Details Section */}
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
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Up to 250 miles delivery/pickup included</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Beyond 250 miles: $299.99 refundable deposit</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Vaccination & care packages</span>
                      </li>
                    </ul>
                  </div>
                )}

                {formData.subscriptionPlan === "buy-only" && (
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">For buyers who just want puppies or kittens</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Create requests to breeders</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Direct messaging with breeders</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Saved favorites</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Purchase protection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Access to breeder verification status</span>
                      </li>
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
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Up to 250 miles delivery/pickup included</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Beyond 250 miles: $299.99 refundable deposit</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span>Vaccination & care packages</span>
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
              Create Account
            </Button>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
