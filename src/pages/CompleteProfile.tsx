import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { PawPrint } from "lucide-react";
import { LocationInput } from "@/components/LocationInput";
import { profileUpdateSchema, validateData } from "@/utils/validation";

/**
 * Complete Profile Page
 * For users who sign in with social providers and need to set username and location
 */
export default function CompleteProfile() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [step, setStep] = useState<"username" | "location">("username");

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/auth");
      return;
    }

    setUserId(user.id);

    // Check if username already exists
    const { data: profile } = await supabase
      .from("profiles")
      .select("username, city, state")
      .eq("id", user.id)
      .single();

    if (profile?.username && profile?.city) {
      // Profile already complete
      navigate("/browse");
      return;
    }

    if (profile?.username && !profile?.city) {
      // Has username but no location
      setStep("location");
    }
  };

  const handleUsernameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!userId) throw new Error("Not authenticated");

      // Validate username using schema
      const validation = validateData(profileUpdateSchema, { username: username.toLowerCase() });
      if (!validation.success) {
        throw new Error(validation.errors?.[0] || "Invalid username");
      }

      // Check if username already exists
      const { data: usernameExists } = await supabase.rpc('username_exists', {
        _username: username
      });

      if (usernameExists) {
        throw new Error("Username already taken. Please choose another.");
      }

      // Update profile with username
      const { error } = await supabase
        .from("profiles")
        .update({ username: username.toLowerCase() })
        .eq("id", userId);

      if (error) throw error;

      toast.success("Username set! Now add your location.");
      setStep("location");
    } catch (error: any) {
      toast.error(error.message || "Failed to set username");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationUpdate = async (location: any) => {
    if (!userId) return;

    try {
      // Validate location data using schema
      const validation = validateData(profileUpdateSchema, location);
      if (!validation.success) {
        throw new Error(validation.errors?.[0] || "Invalid location data");
      }

      const { error } = await supabase
        .from("profiles")
        .update(validation.data)
        .eq("id", userId);

      if (error) throw error;

      toast.success("Profile complete! Welcome to PawDNA.");
      navigate("/browse");
    } catch (error: any) {
      toast.error(error.message || "Failed to update location");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <PawPrint className="h-10 w-10 text-primary" />
          <span className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
            PawDNA
          </span>
        </div>

        {step === "username" ? (
          <Card>
            <CardHeader>
              <CardTitle>Choose Your Username</CardTitle>
              <CardDescription>
                Pick a unique username for your PawDNA account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleUsernameSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="pawlover123"
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
                <Button type="submit" className="w-full" variant="hero" disabled={loading}>
                  {loading ? "Setting username..." : "Continue"}
                </Button>
              </form>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Add Your Location</CardTitle>
              <CardDescription>
                Help us show you pets and breeders in your area
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LocationInput onLocationUpdate={handleLocationUpdate} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
