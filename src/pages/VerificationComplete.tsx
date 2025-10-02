import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function VerificationComplete() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<"checking" | "verified" | "failed">("checking");

  useEffect(() => {
    checkVerificationStatus();
  }, []);

  const checkVerificationStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("check-verification-status");

      if (error) throw error;

      if (data.verified) {
        setStatus("verified");
      } else {
        setStatus("failed");
      }
    } catch (error) {
      console.error("Error checking verification:", error);
      setStatus("failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-muted/30 p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle className="text-center">Identity Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {status === "checking" && (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-center text-muted-foreground">
                  Checking your verification status...
                </p>
              </div>
            )}

            {status === "verified" && (
              <div className="flex flex-col items-center gap-4">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Verification Successful!</h3>
                  <p className="text-muted-foreground">
                    Your identity has been verified. You now have full access to the platform.
                  </p>
                </div>
                <Button onClick={() => navigate("/")} className="w-full">
                  Continue to Dashboard
                </Button>
              </div>
            )}

            {status === "failed" && (
              <div className="flex flex-col items-center gap-4">
                <XCircle className="h-12 w-12 text-destructive" />
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold">Verification Incomplete</h3>
                  <p className="text-muted-foreground">
                    Your verification could not be completed. Please try again or contact support.
                  </p>
                </div>
                <div className="flex gap-2 w-full">
                  <Button onClick={() => navigate("/")} variant="outline" className="flex-1">
                    Go Home
                  </Button>
                  <Button onClick={checkVerificationStatus} className="flex-1">
                    Check Again
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}