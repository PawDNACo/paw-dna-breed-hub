import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

export const BankingChangeRequest = () => {
  const [canRequestChange, setCanRequestChange] = useState(false);
  const [changeCount, setChangeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pendingRequest, setPendingRequest] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkBankingChangeEligibility();
  }, []);

  const checkBankingChangeEligibility = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check how many approved changes in the last 365 days
      const { data: changes, error } = await supabase
        .from("banking_change_requests")
        .select("*")
        .eq("user_id", user.id)
        .gte("approved_date", new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
        .not("approved_date", "is", null);

      if (error) throw error;

      const approvedCount = changes?.length || 0;
      setChangeCount(approvedCount);
      setCanRequestChange(approvedCount < 2);

      // Check for pending requests
      const { data: pending } = await supabase
        .from("banking_change_requests")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "pending")
        .single();

      setPendingRequest(!!pending);
    } catch (error: any) {
      console.error("Error checking eligibility:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestChange = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Create verification request
      const { data: verificationRequest, error: verificationError } = await supabase
        .from("verification_requests")
        .insert({
          user_id: user.id,
          request_type: "banking_change",
        })
        .select()
        .single();

      if (verificationError) throw verificationError;

      // Create banking change request
      const { error: bankingError } = await supabase
        .from("banking_change_requests")
        .insert({
          user_id: user.id,
          verification_request_id: verificationRequest.id,
        });

      if (bankingError) throw bankingError;

      toast({
        title: "Banking Change Request Submitted",
        description: "You will receive instructions via email on how to submit your verification documents (ID, utility bill, and banking information).",
      });

      setPendingRequest(true);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Banking Details Change Request</CardTitle>
        <CardDescription>
          Submit a request to update your banking information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important Security Requirements:</strong>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>You can only change banking details 2 times per 365 days</li>
              <li>You have used {changeCount} of 2 allowed changes in the last year</li>
              <li>Required documents: Government-issued ID, current utility bill, and banking information matching your current account</li>
            </ul>
          </AlertDescription>
        </Alert>

        {pendingRequest ? (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              You have a pending banking change request. Our team will review it and send you instructions via email.
            </AlertDescription>
          </Alert>
        ) : canRequestChange ? (
          <Button onClick={handleRequestChange} className="w-full">
            Submit Banking Change Request
          </Button>
        ) : (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You have reached the maximum number of banking changes (2) for this year. 
              You will be able to request another change after {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString()}.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
