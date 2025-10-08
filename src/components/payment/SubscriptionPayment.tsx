import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import StripePaymentForm from "./StripePaymentForm";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

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

  const initializePayment = async () => {
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

        {!clientSecret ? (
          <div className="py-8 text-center">
            <Button onClick={initializePayment} disabled={loading} size="lg">
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
        ) : (
          <StripePaymentForm
            clientSecret={clientSecret}
            amount={amount}
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
