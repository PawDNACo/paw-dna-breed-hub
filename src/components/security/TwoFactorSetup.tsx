import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { toast } from "sonner";
import { Shield, ShieldCheck, AlertCircle, Copy, CheckCircle } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

export const TwoFactorSetup = () => {
  const [loading, setLoading] = useState(false);
  const [enabled, setEnabled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [verifyCode, setVerifyCode] = useState("");
  const [factorId, setFactorId] = useState<string | null>(null);
  const [copiedSecret, setCopiedSecret] = useState(false);

  useEffect(() => {
    checkMFAStatus();
  }, []);

  const checkMFAStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user has any MFA factors enrolled
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const hasActiveFactor = factors?.totp?.some(f => f.status === 'verified');
      setEnabled(hasActiveFactor || false);

      // Update profile status
      await supabase
        .from("profiles")
        .update({ two_factor_enabled: hasActiveFactor || false })
        .eq("id", user.id);
    } catch (error) {
      console.error("Error checking 2FA status:", error);
    }
  };

  const handleEnroll = async () => {
    setLoading(true);
    setEnrolling(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Enroll a new TOTP factor
      const { data: enrollData, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        friendlyName: 'Authenticator App',
      });

      if (error) throw error;

      setQrCode(enrollData.totp.qr_code);
      setSecret(enrollData.totp.secret);
      setFactorId(enrollData.id);

      toast.success("Scan the QR code with your authenticator app");
    } catch (error: any) {
      toast.error(error.message || "Failed to start 2FA enrollment");
      setEnrolling(false);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!factorId) throw new Error("No factor ID");

      // Challenge and verify the TOTP code
      const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
        factorId,
      });

      if (challengeError) throw challengeError;

      const { data: verifyData, error: verifyError } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: challengeData.id,
        code: verifyCode,
      });

      if (verifyError) throw verifyError;

      // Update profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ two_factor_enabled: true })
          .eq("id", user.id);
      }

      setEnabled(true);
      setEnrolling(false);
      setQrCode(null);
      setSecret(null);
      setVerifyCode("");
      toast.success("Two-Factor Authentication enabled successfully!");
    } catch (error: any) {
      toast.error(error.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleDisable = async () => {
    if (!confirm("Are you sure you want to disable Two-Factor Authentication? This will make your account less secure.")) {
      return;
    }

    setLoading(true);

    try {
      // Get all factors
      const { data: factors } = await supabase.auth.mfa.listFactors();
      
      if (factors?.totp) {
        // Unenroll all TOTP factors
        for (const factor of factors.totp) {
          await supabase.auth.mfa.unenroll({ factorId: factor.id });
        }
      }

      // Update profile
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase
          .from("profiles")
          .update({ two_factor_enabled: false })
          .eq("id", user.id);
      }

      setEnabled(false);
      toast.success("Two-Factor Authentication disabled");
    } catch (error: any) {
      toast.error(error.message || "Failed to disable 2FA");
    } finally {
      setLoading(false);
    }
  };

  const copySecret = async () => {
    if (secret) {
      await navigator.clipboard.writeText(secret);
      setCopiedSecret(true);
      toast.success("Secret key copied to clipboard");
      setTimeout(() => setCopiedSecret(false), 3000);
    }
  };

  if (enrolling) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Set Up Two-Factor Authentication</CardTitle>
          <CardDescription>
            Scan the QR code with your authenticator app (Google Authenticator, Authy, 1Password, etc.)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {qrCode && (
            <div className="flex flex-col items-center space-y-4">
              <div className="bg-white p-4 rounded-lg">
                <QRCodeSVG value={qrCode} size={200} />
              </div>
              
              <div className="w-full">
                <Label>Or enter this secret key manually:</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={secret || ""}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={copySecret}
                  >
                    {copiedSecret ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleVerify} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="verify-code">Enter 6-digit code from your app</Label>
              <Input
                id="verify-code"
                type="text"
                placeholder="123456"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={loading || verifyCode.length !== 6}>
                {loading ? "Verifying..." : "Verify & Enable"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setEnrolling(false);
                  setQrCode(null);
                  setSecret(null);
                  setVerifyCode("");
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {enabled ? (
            <>
              <ShieldCheck className="h-5 w-5 text-green-600" />
              Two-Factor Authentication Enabled
            </>
          ) : (
            <>
              <Shield className="h-5 w-5" />
              Two-Factor Authentication
            </>
          )}
        </CardTitle>
        <CardDescription>
          Add an extra layer of security to your account
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {enabled ? (
          <>
            <Alert>
              <ShieldCheck className="h-4 w-4" />
              <AlertTitle>Your account is protected</AlertTitle>
              <AlertDescription>
                Two-Factor Authentication is currently enabled. You'll need to enter a code from your authenticator app when signing in.
              </AlertDescription>
            </Alert>
            <Button variant="destructive" onClick={handleDisable} disabled={loading}>
              {loading ? "Disabling..." : "Disable Two-Factor Authentication"}
            </Button>
          </>
        ) : (
          <>
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Enhance your security</AlertTitle>
              <AlertDescription>
                Two-Factor Authentication adds an extra layer of protection. You'll need your password and a code from your authenticator app to sign in.
              </AlertDescription>
            </Alert>
            <Button onClick={handleEnroll} disabled={loading}>
              {loading ? "Setting up..." : "Enable Two-Factor Authentication"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};
