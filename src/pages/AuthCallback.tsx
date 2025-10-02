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
      // Get the session from the URL hash
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error("Auth callback error:", error);
        toast.error("Authentication failed. Please try again.");
        navigate("/auth");
        return;
      }

      if (!session) {
        console.log("No session found in callback");
        navigate("/auth");
        return;
      }

      // Check if user has a profile with username
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
      navigate("/auth");
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
