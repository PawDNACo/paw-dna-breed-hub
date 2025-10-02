import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useVerificationCheck = () => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    checkVerification();
  }, []);

  const checkVerification = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setIsVerified(false);
        setLoading(false);
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("is_verified")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      setIsVerified(profile?.is_verified || false);
    } catch (error) {
      console.error("Error checking verification:", error);
      setIsVerified(false);
    } finally {
      setLoading(false);
    }
  };

  const requireVerification = (action: string = "perform this action") => {
    if (!isVerified) {
      toast({
        title: "Verification Required",
        description: `You must verify your identity to ${action}. Please complete Stripe Identity verification.`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return { isVerified, loading, requireVerification, checkVerification };
};
