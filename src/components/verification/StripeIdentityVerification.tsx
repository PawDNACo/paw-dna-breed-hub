import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, AlertTriangle } from "lucide-react";

interface StripeIdentityVerificationProps {
  userType: "buyer" | "breeder";
}

export const StripeIdentityVerification = ({ userType }: StripeIdentityVerificationProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const startVerification = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Call edge function to create Stripe Identity verification session
      // The edge function stores tokens server-side and only returns the redirect URL
      const { data, error } = await supabase.functions.invoke("create-identity-verification", {
        body: { userType },
      });

      if (error) throw error;

      // Only store verification type (no sensitive tokens on client)
      await supabase
        .from("profiles")
        .update({
          verification_type: userType,
        })
        .eq("id", user.id);

      // Redirect to Stripe Identity
      if (data.url) {
        window.open(data.url, "_blank");
        toast({
          title: "Verification Started",
          description: "Please complete the identity verification in the new window.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-green-600" />
          <CardTitle>Identity Verification</CardTitle>
        </div>
        <CardDescription>
          Verify your identity to gain full access as a {userType}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Why verify?</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Build trust with other users</li>
              <li>Get a verified badge next to your name</li>
              <li>{userType === "breeder" ? "List pets and receive payments" : "Contact breeders and make purchases"}</li>
              <li>Protected by Stripe's secure verification</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Alert>
          <AlertDescription>
            <strong>What you'll need:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Government-issued photo ID (driver's license, passport, etc.)</li>
              <li>A device with a camera for selfie verification</li>
              <li>5-10 minutes to complete</li>
            </ul>
          </AlertDescription>
        </Alert>

        <Button onClick={startVerification} disabled={loading} className="w-full">
          {loading ? "Starting Verification..." : "Start Identity Verification"}
        </Button>

        <p className="text-sm text-muted-foreground text-center">
          Your information is securely processed and tokenized by Stripe. We never store your ID documents.
        </p>
      </CardContent>
    </Card>
  );
};
