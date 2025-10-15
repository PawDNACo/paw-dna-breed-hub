import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface PayPalPaymentFormProps {
  amount: number;
  description: string;
  onSuccess: () => void;
  onCancel: () => void;
  subscriptionType?: string;
}

declare global {
  interface Window {
    paypal?: any;
  }
}

export default function PayPalPaymentForm({ 
  amount, 
  description, 
  onSuccess, 
  onCancel,
  subscriptionType 
}: PayPalPaymentFormProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load PayPal SDK
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD&intent=${subscriptionType ? 'subscription' : 'capture'}`;
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
      setIsLoading(false);
    };
    script.onerror = () => {
      toast.error("Failed to load PayPal SDK");
      setIsLoading(false);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [subscriptionType]);

  useEffect(() => {
    if (!scriptLoaded || !window.paypal) return;

    const paypalButtonsComponent = window.paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'gold',
        shape: 'rect',
        label: 'paypal'
      },
      createOrder: async () => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          const { data, error } = await supabase.functions.invoke(
            subscriptionType ? 'create-paypal-subscription' : 'create-paypal-payment',
            {
              headers: {
                Authorization: `Bearer ${session?.access_token}`,
              },
              body: subscriptionType 
                ? { subscriptionType }
                : { amount, description }
            }
          );

          if (error) throw error;
          return data.orderId || data.subscriptionId;
        } catch (error) {
          console.error('PayPal order creation error:', error);
          toast.error("Failed to create PayPal order");
          throw error;
        }
      },
      onApprove: async (data: any) => {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          
          const { error } = await supabase.functions.invoke('complete-paypal-payment', {
            headers: {
              Authorization: `Bearer ${session?.access_token}`,
            },
            body: { 
              orderId: data.orderID,
              subscriptionId: data.subscriptionID 
            }
          });

          if (error) throw error;
          
          toast.success("Payment successful!");
          onSuccess();
        } catch (error) {
          console.error('PayPal approval error:', error);
          toast.error("Payment verification failed");
        }
      },
      onError: (err: any) => {
        console.error('PayPal error:', err);
        toast.error("PayPal payment failed");
      },
      onCancel: () => {
        toast.info("Payment cancelled");
        onCancel();
      }
    });

    paypalButtonsComponent.render('#paypal-button-container');

    return () => {
      if (paypalButtonsComponent) {
        paypalButtonsComponent.close();
      }
    };
  }, [scriptLoaded, amount, description, onSuccess, onCancel, subscriptionType]);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : (
        <>
          <div id="paypal-button-container"></div>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="w-full"
          >
            Cancel
          </Button>
        </>
      )}
    </div>
  );
}
