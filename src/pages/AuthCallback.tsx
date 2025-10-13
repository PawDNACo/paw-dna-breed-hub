import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

/**
 * OAuth Callback Handler
 * Handles the redirect after social login (Google, Facebook, etc.)
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    handleAuthCallback();
  }, []);

  const handleAuthCallback = async () => {
    try {
      // Get the session from the URL hash or after email verification
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error);
        toast.error("Authentication failed. Please try again.");
        navigate("/login");
        return;
      }

      if (!session) {
        console.log("No session found in callback");
        navigate("/login");
        return;
      }

      // Check if there are buyer preferences stored (from buyer signup)
      const preferencesStr = sessionStorage.getItem('buyer_preferences');
      if (preferencesStr) {
        const preferences = JSON.parse(preferencesStr);
        
        // Assign buyer role
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ user_id: session.user.id, role: "buyer" });

        if (roleError && !roleError.message.includes('duplicate')) {
          console.error("Role assignment error:", roleError);
        }

        // Create buyer request with preferences
        const { error: requestError } = await supabase
          .from("buyer_requests")
          .insert({
            user_id: session.user.id,
            species: preferences.species,
            breed: preferences.breed,
            gender: preferences.gender,
            size: preferences.size,
            max_price: preferences.max_price,
            status: "active"
          });

        if (requestError) {
          console.error("Request creation error:", requestError);
        }

        // Clear stored preferences
        sessionStorage.removeItem('buyer_preferences');
        
        toast.success("Email verified! Welcome to PawDNA!");
        navigate("/buyer-dashboard");
        return;
      }

      // Check if this is a breeder signup
      const breederUserId = sessionStorage.getItem('breeder_user_id');
      if (breederUserId) {
        // Assign breeder role
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert({ user_id: session.user.id, role: "breeder" });

        if (roleError && !roleError.message.includes('duplicate')) {
          console.error("Role assignment error:", roleError);
        }

        sessionStorage.removeItem('breeder_user_id');
        
        toast.success("Email verified! Please complete your breeder profile.");
        navigate("/breeder-subscription");
        return;
      }

      // Check for pending role from signup_intents table (secure, server-side)
      const { data: signupIntents, error: intentsError } = await supabase
        .from('signup_intents')
        .select('intended_role')
        .eq('user_id', session.user.id)
        .eq('email_verified', false);

      if (!intentsError && signupIntents && signupIntents.length > 0) {
        // Get unique roles from intents
        const rolesToInsert = signupIntents.map(intent => ({
          user_id: session.user.id,
          role: intent.intended_role
        }));

        // Delete the default 'buyer' role first if needed
        await supabase
          .from("user_roles")
          .delete()
          .eq("user_id", session.user.id);

        // Insert the intended role(s) from database
        const { error: roleError } = await supabase
          .from("user_roles")
          .insert(rolesToInsert);

        if (roleError) {
          console.error("Role assignment error:", roleError);
        }

        // Mark intents as verified
        await supabase
          .from('signup_intents')
          .update({ email_verified: true })
          .eq('user_id', session.user.id);
      }

      // Check if user has a profile with username (OAuth flow)
      const { data: profile } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", session.user.id)
        .single();

      // If no username, redirect to complete profile
      if (!profile?.username) {
        toast.success("Welcome! Please complete your profile.");
        navigate("/complete-profile");
        return;
      }

      // Success - redirect to browse
      toast.success("Successfully signed in!");
      navigate("/browse");
    } catch (error: any) {
      console.error("Error handling auth callback:", error);
      toast.error("Something went wrong. Please try again.");
      navigate("/login");
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30">
      <div className="text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-muted-foreground">
          {checking ? "Completing sign in..." : "Redirecting..."}
        </p>
      </div>
    </div>
  );
}
