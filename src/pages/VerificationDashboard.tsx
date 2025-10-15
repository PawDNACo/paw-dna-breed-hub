import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { StripeIdentityVerification } from "@/components/verification/StripeIdentityVerification";
import { SecurityDisclaimer } from "@/components/security/SecurityDisclaimer";
import { CheckCircle2, XCircle, Clock, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserRole } from "@/hooks/useUserRole";

export default function VerificationDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { roles, loading: rolesLoading, isAdmin, isBreeder, isBuyer } = useUserRole();

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error: any) {
      console.error("Error loading profile:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "verified":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case "pending":
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case "unverified":
      default:
        return <XCircle className="h-5 w-5 text-red-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-600">Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-600">Pending</Badge>;
      case "unverified":
      default:
        return <Badge variant="destructive">Not Verified</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 container mx-auto px-4 py-8 pt-24">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Verification Status</h1>
          <p className="text-muted-foreground">
            Manage your account verification and security settings
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  <CardTitle>Identity Verification</CardTitle>
                </div>
                {getStatusIcon(profile?.verification_status || "unverified")}
              </div>
              <CardDescription>
                Verify your identity via Stripe to access all features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Status</span>
                  {getStatusBadge(profile?.verification_status || "unverified")}
                </div>
                
                {profile?.verification_type && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Account Type</span>
                    <Badge variant="outline">{profile.verification_type}</Badge>
                  </div>
                )}

                {profile?.verification_completed_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Verified On</span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(profile.verification_completed_at).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {profile?.verification_status !== "verified" && (
                  <div className="pt-4">
                    <StripeIdentityVerification 
                      userType={profile?.verification_type || "buyer"} 
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Security</CardTitle>
              <CardDescription>
                Your account security settings and status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Two-Factor Auth</span>
                  {profile?.two_factor_enabled ? (
                    <Badge className="bg-green-600">Enabled</Badge>
                  ) : (
                    <Badge variant="outline">Not Enabled</Badge>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Account Status</span>
                  <Badge variant={profile?.account_status === "active" ? "default" : "destructive"}>
                    {profile?.account_status || "Unknown"}
                  </Badge>
                </div>

                {profile?.social_provider && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Login Method</span>
                    <Badge variant="outline">{profile.social_provider}</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account Roles</CardTitle>
              <CardDescription>
                Your permissions and access levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rolesLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {roles.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No roles assigned</p>
                  ) : (
                    <>
                      {isBuyer && (
                        <div className="flex items-center gap-2">
                          <Badge>Buyer</Badge>
                          <span className="text-sm text-muted-foreground">Can purchase pets</span>
                        </div>
                      )}
                      {isBreeder && (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-blue-600">Breeder</Badge>
                          <span className="text-sm text-muted-foreground">Can list pets</span>
                        </div>
                      )}
                      {isAdmin && (
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-600">Admin</Badge>
                          <span className="text-sm text-muted-foreground">Full system access</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <SecurityDisclaimer />
        </div>

        {profile?.verification_status !== "verified" && (
          <Card className="mt-6 border-yellow-500">
            <CardHeader>
              <CardTitle>Why Verify?</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>List and sell pets on the platform</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Purchase pets from verified breeders</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Access messaging with other verified users</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Build trust with other community members</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}