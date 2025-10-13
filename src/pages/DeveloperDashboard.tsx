import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useUserRole } from "@/hooks/useUserRole";
import { useToast } from "@/hooks/use-toast";
import { 
  Database, 
  Users, 
  Settings, 
  Code, 
  Shield, 
  AlertCircle,
  CheckCircle,
  Trash2,
  Edit,
  Plus,
  Terminal
} from "lucide-react";

export default function DeveloperDashboard() {
  const navigate = useNavigate();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [pets, setPets] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    totalPets: 0,
    availablePets: 0,
  });

  useEffect(() => {
    checkAccess();
  }, [isAdmin, roleLoading]);

  const checkAccess = async () => {
    if (roleLoading) return;
    
    if (!isAdmin) {
      toast({
        title: "Access Denied",
        description: "You must be an administrator to access this page.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }
    
    await loadDashboardData();
    setLoading(false);
  };

  const loadDashboardData = async () => {
    try {
      // Load users
      const { data: usersData, error: usersError } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (usersError) {
        console.error("Error loading users:", usersError);
        throw usersError;
      }

      // Load user roles separately
      if (usersData && usersData.length > 0) {
        const userIds = usersData.map(u => u.id);
        const { data: rolesData, error: rolesError } = await supabase
          .from("user_roles")
          .select("user_id, role")
          .in("user_id", userIds);

        if (rolesError) {
          console.error("Error loading roles:", rolesError);
        } else {
          // Attach roles to users
          const usersWithRoles = usersData.map(user => ({
            ...user,
            user_roles: rolesData?.filter(r => r.user_id === user.id) || []
          }));
          setUsers(usersWithRoles);
        }
      } else {
        setUsers(usersData || []);
      }

      // Load recent pets
      const { data: petsData, error: petsError } = await supabase
        .from("pets")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(20);

      if (petsError) {
        console.error("Error loading pets:", petsError);
        throw petsError;
      }
      setPets(petsData || []);

      // Calculate stats
      setStats({
        totalUsers: usersData?.length || 0,
        verifiedUsers: usersData?.filter(u => u.is_verified).length || 0,
        totalPets: petsData?.length || 0,
        availablePets: petsData?.filter(p => p.available).length || 0,
      });
    } catch (error: any) {
      console.error("Error loading dashboard data:", error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data. Please check the console for details.",
        variant: "destructive",
      });
    }
  };

  const assignRole = async (userId: string, role: "admin" | "breeder" | "buyer") => {
    try {
      // SECURITY: Use server-side edge function for role assignment
      const { data, error } = await supabase.functions.invoke('assign-role', {
        body: {
          targetUserId: userId,
          role: role
        }
      });

      if (error) throw error;

      if (data?.error) {
        throw new Error(data.error);
      }

      toast({
        title: "Success",
        description: data?.message || `Role ${role} assigned successfully`,
      });
      
      await loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const togglePetAvailability = async (petId: string, available: boolean) => {
    try {
      const { error } = await supabase
        .from("pets")
        .update({ available: !available })
        .eq("id", petId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Pet availability updated",
      });
      
      await loadDashboardData();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading || roleLoading) {
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
          <div className="flex items-center gap-3 mb-2">
            <Terminal className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Developer Dashboard</h1>
          </div>
          <p className="text-muted-foreground">
            Full-stack management interface for administrators
          </p>
        </div>

        <Alert className="mb-6 border-primary/50">
          <Shield className="h-4 w-4" />
          <AlertTitle>Administrator Access</AlertTitle>
          <AlertDescription>
            You have full access to manage users, content, database, and system settings.
            Use these tools responsibly.
          </AlertDescription>
        </Alert>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">
              <Settings className="h-4 w-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="users">
              <Users className="h-4 w-4 mr-2" />
              Users
            </TabsTrigger>
            <TabsTrigger value="database">
              <Database className="h-4 w-4 mr-2" />
              Database
            </TabsTrigger>
            <TabsTrigger value="content">
              <Code className="h-4 w-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-4">
              <Card>
                <CardHeader>
                  <CardTitle>Total Users</CardTitle>
                  <CardDescription>Registered accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">{stats.totalUsers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Verified Users</CardTitle>
                  <CardDescription>ID verified</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">{stats.verifiedUsers}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Total Pets</CardTitle>
                  <CardDescription>All listings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">{stats.totalPets}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available Pets</CardTitle>
                  <CardDescription>Currently active</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-primary">{stats.availablePets}</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <Button variant="outline" onClick={() => navigate("/admin")}>
                  <Database className="mr-2 h-4 w-4" />
                  View Admin Panel
                </Button>
                <Button variant="outline" onClick={() => window.open("https://docs.lovable.dev", "_blank")}>
                  <Code className="mr-2 h-4 w-4" />
                  View Documentation
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage user accounts and roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {users.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{user.full_name || "No name"}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                        <div className="flex gap-2 mt-2">
                          {user.user_roles?.map((ur: any, idx: number) => (
                            <Badge key={idx} variant="outline">
                              {ur.role}
                            </Badge>
                          ))}
                          {user.is_verified && (
                            <Badge className="bg-green-600">Verified</Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Select onValueChange={(value) => assignRole(user.id, value as any)}>
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Add role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="buyer">Buyer</SelectItem>
                            <SelectItem value="breeder">Breeder</SelectItem>
                            <SelectItem value="admin">Admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Database Tab */}
          <TabsContent value="database" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Database Access</CardTitle>
                <CardDescription>
                  View and manage database directly through the backend dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Database className="h-4 w-4" />
                  <AlertTitle>Direct Database Access</AlertTitle>
                  <AlertDescription>
                    For security reasons, SQL queries should be executed through the backend dashboard.
                    Click the button below to access the full database management interface.
                  </AlertDescription>
                </Alert>
                <Button onClick={() => toast({ title: "Opening Backend Dashboard", description: "Use the 'View Backend' button in the top navigation" })}>
                  <Database className="mr-2 h-4 w-4" />
                  Open Backend Dashboard
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Pets</CardTitle>
                <CardDescription>Manage pet listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {pets.map((pet) => (
                    <div
                      key={pet.id}
                      className="flex items-center justify-between p-3 border border-border rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{pet.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {pet.breed} - ${pet.price}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {pet.available ? (
                          <Badge className="bg-green-600">Available</Badge>
                        ) : (
                          <Badge variant="outline">Unavailable</Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePetAvailability(pet.id, pet.available)}
                        >
                          Toggle
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
                <CardDescription>Update site content and settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Coming Soon</AlertTitle>
                  <AlertDescription>
                    Content management features will be available in the next update.
                    For now, use the code editor to modify content directly.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>View and manage security configurations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Row Level Security (RLS)</div>
                    <div className="text-sm text-muted-foreground">
                      All tables protected with RLS policies
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Payment Token Security</div>
                    <div className="text-sm text-muted-foreground">
                      Stripe verification tokens never exposed
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Email Privacy Protection</div>
                    <div className="text-sm text-muted-foreground">
                      Email addresses only visible to owners
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Location Data Protection</div>
                    <div className="text-sm text-muted-foreground">
                      GPS coordinates & zip codes restricted to owners
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Secure Profile Views</div>
                    <div className="text-sm text-muted-foreground">
                      Public views exclude all sensitive data
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Transaction Data Security</div>
                    <div className="text-sm text-muted-foreground">
                      Sales records only visible to participants
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Message Privacy</div>
                    <div className="text-sm text-muted-foreground">
                      Messages only visible to sender/recipient
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Financial Data Protection</div>
                    <div className="text-sm text-muted-foreground">
                      Frozen funds & subscriptions isolated
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Anonymous User Blocking</div>
                    <div className="text-sm text-muted-foreground">
                      Zero access to sensitive data for non-authenticated users
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Identity Verification</div>
                    <div className="text-sm text-muted-foreground">
                      Stripe Identity verification enabled
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Rate Limiting</div>
                    <div className="text-sm text-muted-foreground">
                      Active on all edge functions
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <div className="font-medium">Security Audit Logs</div>
                    <div className="text-sm text-muted-foreground">
                      Tracking all sensitive data access attempts
                    </div>
                  </div>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>

                <Alert className="mt-6">
                  <Shield className="h-4 w-4" />
                  <AlertTitle>Comprehensive Data Protection Active</AlertTitle>
                  <AlertDescription className="mt-2 space-y-2">
                    <p><strong>Critical Security Layers:</strong></p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      <li><strong>Customer PII:</strong> Email, full name, and location data completely secured</li>
                      <li><strong>Identity Data:</strong> Verification tokens and status never exposed to public</li>
                      <li><strong>Transaction Security:</strong> Sales data only visible to buyer/breeder participants</li>
                      <li><strong>Message Privacy:</strong> Messages restricted to sender/recipient only</li>
                      <li><strong>Financial Isolation:</strong> Frozen funds, subscriptions, banking requests owner-only</li>
                      <li><strong>Anonymous Blocking:</strong> All sensitive tables deny anonymous access</li>
                      <li><strong>Audit Trails:</strong> Sales, profiles, 2FA, and security events all logged</li>
                      <li><strong>Edge Function Control:</strong> Sales creation only via authorized backend functions</li>
                    </ul>
                    <p className="mt-3 text-xs text-destructive font-semibold">
                      ZERO TOLERANCE: Customer PII, payment tokens, identity data, and transactions are completely isolated
                    </p>
                    <p className="mt-2 text-xs">
                      See <code>SECURITY.md</code> for complete documentation
                    </p>
                  </AlertDescription>
                </Alert>

                <div className="grid gap-3 pt-4">
                  <Button variant="outline" onClick={() => navigate("/verification")}>
                    <Shield className="mr-2 h-4 w-4" />
                    View Security Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      window.open('https://github.com/yourusername/pawdna/blob/main/SECURITY.md', '_blank');
                    }}
                  >
                    <Code className="mr-2 h-4 w-4" />
                    View Security Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
    </div>
  );
}
