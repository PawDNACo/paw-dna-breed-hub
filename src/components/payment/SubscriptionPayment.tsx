import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import StripePaymentForm from "./StripePaymentForm";
import PayPalPaymentForm from "./PayPalPaymentForm";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface SubscriptionPaymentProps {
  open: boolean;
  onClose: () => void;
  subscriptionType: string;
  amount: number;
  onSuccess: () => void;
}

export default function SubscriptionPayment({ 
  open, 
  onClose, 
  subscriptionType, 
  amount,
  onSuccess 
}: SubscriptionPaymentProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"stripe" | "paypal">("stripe");
  const [paymentInitialized, setPaymentInitialized] = useState(false);

  const initializePayment = async () => {
    if (paymentMethod === "stripe") {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("Not authenticated");

        const { data, error } = await supabase.functions.invoke('create-payment', {
          body: {
            type: 'subscription',
            amount,
            description: `${subscriptionType} Subscription`,
            metadata: {
              userId: user.id,
              subscriptionType,
            },
            paymentMethodTypes: ['card', 'us_bank_account'],
          },
        });

        if (error) throw error;

        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error initializing payment:', error);
        toast.error("Failed to initialize payment");
      } finally {
        setLoading(false);
      }
    } else {
      // PayPal initialization happens in the component
      setPaymentInitialized(true);
    }
  };

  const handleSuccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Store subscription in database
      await supabase.from('subscriptions').insert({
        user_id: user.id,
        subscription_type: subscriptionType,
        status: 'active',
        started_at: new Date().toISOString(),
      });

      toast.success("Subscription activated!");
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error activating subscription:', error);
      toast.error("Failed to activate subscription");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Subscribe to {subscriptionType}</DialogTitle>
          <DialogDescription>
            <div className="space-y-2">
              <p>Start your 7-day free trial. Amount: ${amount.toFixed(2)}/month after trial</p>
              <p className="text-xs text-muted-foreground">
                You'll receive reminders at 48hrs, 24hrs, and on the day before billing. 
                Subscription fees are non-refundable once charged.
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>

        {!clientSecret && !paymentInitialized ? (
          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label className="text-base font-semibold">Select Payment Method</Label>
              <RadioGroup 
                value={paymentMethod} 
                onValueChange={(value) => setPaymentMethod(value as "stripe" | "paypal")}
                className="space-y-3"
              >
                <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="stripe" id="stripe" />
                  <Label htmlFor="stripe" className="cursor-pointer flex-1 font-normal">
                    Credit Card (Stripe)
                  </Label>
                </div>
                <div className="flex items-center space-x-3 rounded-lg border p-4 cursor-pointer hover:bg-accent">
                  <RadioGroupItem value="paypal" id="paypal" />
                  <Label htmlFor="paypal" className="cursor-pointer flex-1 font-normal">
                    PayPal
                  </Label>
                </div>
              </RadioGroup>
            </div>
            <Button 
              onClick={initializePayment} 
              disabled={loading} 
              size="lg"
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Initializing...
                </>
              ) : (
                `Continue to Payment`
              )}
            </Button>
          </div>
        ) : paymentMethod === "stripe" && clientSecret ? (
          <StripePaymentForm
            clientSecret={clientSecret}
            amount={amount}
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        ) : paymentMethod === "paypal" && paymentInitialized ? (
          <PayPalPaymentForm
            amount={amount}
            description={`${subscriptionType} Subscription`}
            onSuccess={handleSuccess}
            onCancel={onClose}
            subscriptionType={subscriptionType}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
