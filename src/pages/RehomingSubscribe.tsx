import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useUserRole } from "@/hooks/useUserRole";
import SubscriptionPayment from "@/components/payment/SubscriptionPayment";

export default function RehomingSubscribe() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isBreeder, loading } = useUserRole();
  const [showPayment, setShowPayment] = useState(false);
  const [subscriptionType, setSubscriptionType] = useState("");
  const [subscriptionAmount, setSubscriptionAmount] = useState(0);
  
  const [formData, setFormData] = useState({
    subscriptionType: "",
    animalCount: "1"
  });

  useEffect(() => {
    if (!loading && isBreeder) {
      navigate("/dashboard");
    }
  }, [isBreeder, loading, navigate]);

  const calculateSubscriptionCost = () => {
    const basePrice = formData.subscriptionType === "single-pet" ? 2.99 : 
                      formData.subscriptionType === "multi-pet" ? 5.99 : 0;
    
    const animalCount = parseInt(formData.animalCount) || 1;
    const additionalCost = animalCount > 2 ? (animalCount - 2) * 2.99 : 0;
    
    return basePrice + additionalCost;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.subscriptionType) {
      toast({
        title: "Subscription Required",
        description: "Please select a subscription plan",
        variant: "destructive"
      });
      return;
    }

    const cost = calculateSubscriptionCost();
    setSubscriptionType("Rehoming Subscription");
    setSubscriptionAmount(cost);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async () => {
    toast({
      title: "Subscription Activated!",
      description: "Your rehoming subscription is now active."
    });
    navigate("/dashboard");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Rehoming <span className="bg-gradient-hero bg-clip-text text-transparent">Subscription</span>
            </h1>
            <p className="text-muted-foreground">
              Help pets find loving homes through our rehoming platform
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>Choose the plan that fits your needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Select Subscription Type *</Label>
                  <RadioGroup 
                    value={formData.subscriptionType} 
                    onValueChange={(value) => setFormData({...formData, subscriptionType: value})}
                  >
                    <div className="flex items-center space-x-2 p-3 border rounded-lg">
                      <RadioGroupItem value="single-pet" id="single-pet" />
                      <Label htmlFor="single-pet" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Single Pet - $2.99/month</div>
                        <div className="text-sm text-muted-foreground">For rehoming 1 pet</div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border rounded-lg border-primary">
                      <RadioGroupItem value="multi-pet" id="multi-pet" />
                      <Label htmlFor="multi-pet" className="flex-1 cursor-pointer">
                        <div className="font-semibold">Multi Pet - $5.99/month</div>
                        <div className="text-sm text-muted-foreground">For rehoming up to 2 pets (+$2.99 per additional)</div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.subscriptionType === "multi-pet" && (
                  <div>
                    <Label htmlFor="animalCount">Number of Pets</Label>
                    <Input
                      id="animalCount"
                      type="number"
                      min="1"
                      value={formData.animalCount}
                      onChange={(e) => setFormData({...formData, animalCount: e.target.value})}
                    />
                  </div>
                )}

                {formData.subscriptionType && (
                  <Alert>
                    <AlertDescription>
                      Total Cost: <strong>${calculateSubscriptionCost().toFixed(2)}/month</strong>
                      <br />
                      Includes 7-day free trial
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" size="lg">
              Continue to Payment
            </Button>
          </form>
        </div>
      </main>
      <Footer />

      {showPayment && (
        <SubscriptionPayment
          open={showPayment}
          onClose={() => setShowPayment(false)}
          subscriptionType={subscriptionType}
          amount={subscriptionAmount}
          onSuccess={handlePaymentSuccess}
        />
      )}
    </div>
  );
}
