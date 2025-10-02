import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { TwoFactorSetup } from "@/components/security/TwoFactorSetup";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Shield, Key, Lock } from "lucide-react";

export default function SecuritySettings() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Security Settings</h1>
            <p className="text-muted-foreground">
              Manage your account security and authentication methods
            </p>
          </div>

          <Alert>
            <Shield className="h-4 w-4" />
            <AlertTitle>Your Security Matters</AlertTitle>
            <AlertDescription>
              We take security seriously. Enable Two-Factor Authentication to add an extra layer of protection to your PawDNA account.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6">
            {/* Two-Factor Authentication */}
            <TwoFactorSetup />

            {/* Security Best Practices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Best Practices
                </CardTitle>
                <CardDescription>
                  Tips to keep your account secure
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <Key className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Use a strong, unique password that you don't use anywhere else</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Enable Two-Factor Authentication for maximum security</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Key className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Never share your password or 2FA codes with anyone</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Shield className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Sign out from public or shared devices after use</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Key className="h-4 w-4 mt-0.5 text-primary" />
                    <span>Review your account activity regularly</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
