import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "sonner";
import { PawPrint, RefreshCw } from "lucide-react";
import { LocationInput } from "@/components/LocationInput";
import { SecurityDisclaimer } from "./SecurityDisclaimer";
import { TrustBadgesCompact } from "@/components/TrustBadges";
import { Footer } from "@/components/Footer";

interface AuthPageProps {
  mode?: "signup" | "login";
}

export const AuthPage = ({ mode = "signup" }: AuthPageProps) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [identifier, setIdentifier] = useState(""); // Can be email or username
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [showLocationInput, setShowLocationInput] = useState(false);
  const [signupData, setSignupData] = useState<any>(null);
  const [show2FA, setShow2FA] = useState(false);
  const [mfaCode, setMfaCode] = useState("");
  const [mfaFactorId, setMfaFactorId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(mode === "login" ? "signin" : "signup");
  const [selectedRole, setSelectedRole] = useState<"buyer" | "breeder" | "both">("buyer");

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    setActiveTab(mode === "login" ? "signin" : "signup");
  }, [mode]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      navigate("/");
    }
  };

  const generatePassword = () => {
    const length = 16;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let password = "";
    
    // Ensure at least one of each type
    password += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)];
    password += "abcdefghijklmnopqrstuvwxyz"[Math.floor(Math.random() * 26)];
    password += "0123456789"[Math.floor(Math.random() * 10)];
    password += "!@#$%^&*"[Math.floor(Math.random() * 8)];
    
    // Fill the rest
    for (let i = password.length; i < length; i++) {
      password += charset[Math.floor(Math.random() * charset.length)];
    }
    
    // Shuffle the password
    password = password.split('').sort(() => Math.random() - 0.5).join('');
    
    setPassword(password);
    toast.success("Strong password generated!");
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate username format
      if (!/^[a-z0-9_-]{3,20}$/i.test(username)) {
        throw new Error("Username must be 3-20 characters (letters, numbers, _ or - only)");
      }

      console.log('Checking if username exists:', username);
      // Check if username already exists
      const { data: usernameExists, error: checkError } = await supabase.rpc('username_exists', {
        _username: username
      });

      if (checkError) {
        console.error('Username check error:', checkError);
        throw new Error("Failed to validate username. Please try again.");
      }

      if (usernameExists) {
        throw new Error("Username already taken. Please choose another.");
      }

      const redirectUrl = `${window.location.origin}/auth/callback`;

      console.log('Creating account with email:', email, 'username:', username);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            username: username.toLowerCase(),
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (error) {
        console.error('Signup error:', error);
        throw error;
      }

      if (data?.user) {
        console.log('User created successfully:', data.user.id);
        setSignupData(data.user);
        setShowLocationInput(true);
        toast.success("Account created! Please add your location to continue.");
      }
    } catch (error: any) {
      console.error('Signup failed:', error);
      toast.error(error.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationUpdate = async (location: any) => {
    if (!signupData) return;

    try {
      // Update profile with location
      const { error: profileError } = await supabase
        .from("profiles")
        .update(location)
        .eq("id", signupData.id);

      if (profileError) throw profileError;

      // Assign role(s) based on selection
      const rolesToInsert = selectedRole === "both" 
        ? [
            { user_id: signupData.id, role: "breeder" as const }, 
            { user_id: signupData.id, role: "buyer" as const }
          ]
        : [{ user_id: signupData.id, role: selectedRole as "breeder" | "buyer" }];

      // Delete the default 'buyer' role first if needed
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", signupData.id);

      // Insert the selected role(s)
      const { error: roleError } = await supabase
        .from("user_roles")
        .insert(rolesToInsert);

      if (roleError) throw roleError;

      toast.success("Welcome to PawDNA! Your account is ready.");
      navigate("/browse");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(error.message || "Failed to complete signup");
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let emailToUse = identifier;
      const isEmail = identifier.includes('@');
      
      // If username provided, look up the email
      if (!isEmail) {
        console.log('Looking up email for username:', identifier);
        const { data: emailData, error: emailError } = await supabase.rpc(
          'get_email_from_username',
          { _username: identifier }
        );

        console.log('Email lookup result:', { emailData, emailError });

        if (emailError) {
          console.error('Email lookup error:', emailError);
          throw new Error("Invalid username or password");
        }

        if (!emailData) {
          console.log('No email found for username');
          throw new Error("Invalid username or password");
        }

        emailToUse = emailData;
        console.log('Found email, attempting sign in');
      }

      // Sign in with email and password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: emailToUse,
        password,
      });

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      if (data.user) {
        const { data: factors } = await supabase.auth.mfa.listFactors();
        
        if (factors && factors.totp && factors.totp.length > 0) {
          setMfaFactorId(factors.totp[0].id);
          setShow2FA(true);
          toast.info("Please enter your 2FA code");
          return;
        }

        toast.success("Signed in successfully!");
        navigate("/");
      }
    } catch (error: any) {
      console.error('Sign in failed:', error);
      toast.error(error.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleMFAVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!mfaFactorId) throw new Error("MFA factor not found");

      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId: mfaFactorId,
        code: mfaCode,
      });

      if (error) throw error;

      toast.success("Authentication successful!");
      navigate("/");
    } catch (error: any) {
      toast.error(error.message || "Invalid authentication code");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
    } catch (error: any) {
      toast.error(error.message || "Failed to sign in with Google");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center justify-center gap-2 mb-8 hover:opacity-80 transition-opacity">
            <PawPrint className="h-10 w-10 text-primary" />
            <span className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              PawDNA
            </span>
          </Link>

          {showLocationInput ? (
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Profile</CardTitle>
                <CardDescription>
                  Add your location to see pets and breeders in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LocationInput onLocationUpdate={handleLocationUpdate} />
              </CardContent>
            </Card>
          ) : show2FA ? (
            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
                <CardDescription>
                  Enter the 6-digit code from your authenticator app
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleMFAVerify} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="mfa-code">Authentication Code</Label>
                    <Input
                      id="mfa-code"
                      type="text"
                      placeholder="123456"
                      value={mfaCode}
                      onChange={(e) => setMfaCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      maxLength={6}
                      required
                      autoFocus
                    />
                  </div>
                  <Button type="submit" variant="hero" className="w-full" disabled={loading || mfaCode.length !== 6}>
                    {loading ? "Verifying..." : "Verify Code"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    className="w-full" 
                    onClick={() => setShow2FA(false)}
                  >
                    Back to Sign In
                  </Button>
                </form>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Welcome to PawDNA</CardTitle>
                <CardDescription>
                  Sign in to your account or create a new one
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="signin">Sign In</TabsTrigger>
                    <TabsTrigger value="signup">Sign Up</TabsTrigger>
                  </TabsList>

                  <TabsContent value="signin">
                    <form onSubmit={handleSignIn} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="identifier">Email or Username</Label>
                        <Input
                          id="identifier"
                          type="text"
                          placeholder="you@example.com or username"
                          value={identifier}
                          onChange={(e) => setIdentifier(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="signin-password">Password</Label>
                          <Link 
                            to="/forgot-password" 
                            className="text-xs text-primary hover:underline"
                          >
                            Forgot password?
                          </Link>
                        </div>
                        <Input
                          id="signin-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                        {loading ? "Signing in..." : "Sign In"}
                      </Button>

                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        type="button" 
                        onClick={handleGoogleSignIn}
                        className="w-full"
                      >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Google
                      </Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="signup">
                    <form onSubmit={handleSignUp} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input
                          id="fullName"
                          type="text"
                          placeholder="John Doe"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          type="text"
                          placeholder="johndoe123"
                          value={username}
                          onChange={(e) => setUsername(e.target.value.toLowerCase())}
                          required
                          minLength={3}
                          maxLength={20}
                          pattern="[a-zA-Z0-9_-]+"
                        />
                        <p className="text-xs text-muted-foreground">
                          3-20 characters. Letters, numbers, underscore, or hyphen only.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-email">Email</Label>
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-password">Password</Label>
                        <div className="relative">
                          <Input
                            id="signup-password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={8}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-1 top-1 h-8"
                            onClick={generatePassword}
                            title="Generate strong password"
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Must be at least 8 characters with uppercase, lowercase, and number. Click the refresh icon to generate a strong password.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label>I am signing up as a</Label>
                        <RadioGroup value={selectedRole} onValueChange={(value: any) => setSelectedRole(value)}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="buyer" id="buyer" />
                            <Label htmlFor="buyer" className="font-normal cursor-pointer">Buyer</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="breeder" id="breeder" />
                            <Label htmlFor="breeder" className="font-normal cursor-pointer">Breeder</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="both" id="both" />
                            <Label htmlFor="both" className="font-normal cursor-pointer">Both Buyer & Breeder</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <SecurityDisclaimer />

                      <Button type="submit" variant="hero" className="w-full" disabled={loading}>
                        {loading ? "Creating account..." : "Create Account"}
                      </Button>

                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                        </div>
                      </div>

                      <Button 
                        variant="outline" 
                        type="button" 
                        onClick={handleGoogleSignIn}
                        className="w-full"
                      >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                          <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                          />
                          <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                          />
                        </svg>
                        Google
                      </Button>
                      <p className="mt-4 text-xs text-center text-muted-foreground">
                        Configure providers in backend settings
                      </p>
                    </form>
                  </TabsContent>
                </Tabs>

                <div className="mt-6">
                  <TrustBadgesCompact />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};
