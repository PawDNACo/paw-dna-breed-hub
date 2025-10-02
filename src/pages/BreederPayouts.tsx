import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface Sale {
  id: string;
  pet_id: string;
  sale_price: number;
  platform_fee: number;
  breeder_earnings: number;
  sale_date: string;
  funds_available_date: string;
  payout_status: string;
  payout_date: string | null;
  pets: {
    name: string;
    breed: string;
    species: string;
  };
}

export default function BreederPayouts() {
  const navigate = useNavigate();
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [pendingTotal, setPendingTotal] = useState(0);
  const [availableTotal, setAvailableTotal] = useState(0);

  useEffect(() => {
    checkAuthAndLoadSales();
  }, []);

  const checkAuthAndLoadSales = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast.error("Please log in to view payouts");
      navigate("/auth");
      return;
    }

    await loadSales(user.id);
  };

  const loadSales = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("sales")
        .select(`
          *,
          pets (
            name,
            breed,
            species
          )
        `)
        .eq("breeder_id", userId)
        .order("sale_date", { ascending: false });

      if (error) throw error;

      setSales(data || []);
      calculateTotals(data || []);
    } catch (error) {
      console.error("Error loading sales:", error);
      toast.error("Failed to load sales data");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (salesData: Sale[]) => {
    const now = new Date();
    let pending = 0;
    let available = 0;

    salesData.forEach((sale) => {
      const availableDate = new Date(sale.funds_available_date);
      
      if (sale.payout_status === "paid") {
        // Already paid out
        return;
      } else if (now < availableDate) {
        // Still in 72-hour hold
        pending += Number(sale.breeder_earnings);
      } else if (sale.payout_status !== "cancelled") {
        // Available for payout
        available += Number(sale.breeder_earnings);
      }
    });

    setPendingTotal(pending);
    setAvailableTotal(available);
  };

  const getTimeRemaining = (availableDate: string) => {
    const now = new Date();
    const target = new Date(availableDate);
    const diff = target.getTime() - now.getTime();

    if (diff <= 0) return "Available now";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours}h ${minutes}m remaining`;
  };

  const getStatusBadge = (sale: Sale) => {
    const now = new Date();
    const availableDate = new Date(sale.funds_available_date);

    if (sale.payout_status === "paid") {
      return <Badge variant="default" className="bg-green-500">Paid</Badge>;
    } else if (sale.payout_status === "cancelled") {
      return <Badge variant="destructive">Cancelled</Badge>;
    } else if (now < availableDate) {
      return <Badge variant="secondary">72hr Hold</Badge>;
    } else {
      return <Badge className="bg-primary">Available</Badge>;
    }
  };

  const handleRequestPayout = async () => {
    if (availableTotal <= 0) {
      toast.error("No funds available for payout");
      return;
    }

    toast.success("Payout request submitted! Our team will process it within 5-7 business days.");
    // In a real application, this would trigger a payout process
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Breeder <span className="bg-gradient-hero bg-clip-text text-transparent">Payouts</span>
            </h1>
            <p className="text-muted-foreground">
              Track your earnings and manage payouts. Funds are held for 72 hours after each sale.
            </p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending (72hr Hold)</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${pendingTotal.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Available after 72 hours from sale
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Available for Payout</CardTitle>
                <CheckCircle className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">${availableTotal.toFixed(2)}</div>
                <p className="text-xs text-muted-foreground">
                  Ready to cash out
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{sales.length}</div>
                <p className="text-xs text-muted-foreground">
                  All-time transactions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Payout Request */}
          {availableTotal > 0 && (
            <Card className="mb-8 border-primary/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Ready to Cash Out
                </CardTitle>
                <CardDescription>
                  You have ${availableTotal.toFixed(2)} available for payout
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={handleRequestPayout} size="lg" className="w-full md:w-auto">
                  Request Payout of ${availableTotal.toFixed(2)}
                </Button>
                <p className="text-sm text-muted-foreground mt-4">
                  Payouts are processed within 5-7 business days via your registered checking account.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Sales List */}
          <Card>
            <CardHeader>
              <CardTitle>Sales History</CardTitle>
              <CardDescription>
                All sales are subject to a 72-hour hold period before funds become available
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sales.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No sales yet. Start listing pets to make your first sale!</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate("/breeder-dashboard")}
                  >
                    Go to Dashboard
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sales.map((sale) => (
                    <div
                      key={sale.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{sale.pets.name}</h3>
                          {getStatusBadge(sale)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {sale.pets.breed} • {sale.pets.species}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Sold on {new Date(sale.sale_date).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-1 mt-4 md:mt-0">
                        <div className="text-lg font-bold">
                          ${Number(sale.breeder_earnings).toFixed(2)}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          (${Number(sale.sale_price).toFixed(2)} - 15% fee)
                        </div>
                        {sale.payout_status !== "paid" && sale.payout_status !== "cancelled" && (
                          <div className="text-xs text-primary mt-1">
                            {getTimeRemaining(sale.funds_available_date)}
                          </div>
                        )}
                        {sale.payout_status === "paid" && sale.payout_date && (
                          <div className="text-xs text-green-600">
                            Paid on {new Date(sale.payout_date).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Information Box */}
          <Card className="mt-8 bg-muted/50">
            <CardHeader>
              <CardTitle>Payout Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-primary mt-0.5" />
                <p>
                  <strong>72-Hour Hold:</strong> All funds are held for 72 hours after each sale to allow for buyer disputes and refunds within the refund window.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <DollarSign className="h-4 w-4 text-primary mt-0.5" />
                <p>
                  <strong>Platform Fee:</strong> PawDNA retains 15% of each sale. You earn 85% of the sale price.
                </p>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-primary mt-0.5" />
                <p>
                  <strong>Payout Processing:</strong> Once requested, payouts are processed within 5-7 business days to your registered checking account.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
