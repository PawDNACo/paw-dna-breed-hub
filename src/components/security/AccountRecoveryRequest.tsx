import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, ShieldAlert } from "lucide-react";

export const AccountRecoveryRequest = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your account email address.",
        variant: "destructive",
      });
      return;
    }

    // In a real implementation, this would trigger an email with instructions
    toast({
      title: "Recovery Request Submitted",
      description: "If an account exists with this email, you will receive instructions on how to verify your identity.",
    });
    
    setSubmitted(true);
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-2">
          <ShieldAlert className="h-6 w-6 text-destructive" />
          <CardTitle>Account Recovery</CardTitle>
        </div>
        <CardDescription>
          Request access to your account if you've lost your credentials
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Strict Verification Required</strong>
            <p className="mt-2">To recover your account, you must provide:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Government-issued photo ID</li>
              <li>Current utility bill (within 90 days)</li>
              <li>Full checking account number that matches the account on file</li>
            </ul>
            <p className="mt-3 font-semibold">
              If you cannot provide these documents, your account will be frozen and any funds will be held for 90 days before being released to the original payment method. After 90 days, the account will be permanently deleted.
            </p>
          </AlertDescription>
        </Alert>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Account Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Submit Recovery Request
            </Button>
          </form>
        ) : (
          <Alert>
            <AlertDescription>
              Recovery request submitted. If an account exists with this email, you will receive detailed instructions on how to submit your verification documents.
            </AlertDescription>
          </Alert>
        )}

        <Alert>
          <AlertDescription className="text-sm text-muted-foreground">
            <strong>No Exceptions Policy:</strong> This verification process is mandatory and cannot be bypassed. This is to protect your account and funds from unauthorized access.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
};
