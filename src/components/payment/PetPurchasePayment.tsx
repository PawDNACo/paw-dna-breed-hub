import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import StripePaymentForm from "./StripePaymentForm";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PetPurchasePaymentProps {
  open: boolean;
  onClose: () => void;
  petId: string;
  petName: string;
  price: number;
  onSuccess: () => void;
}

export default function PetPurchasePayment({ 
  open, 
  onClose, 
  petId, 
  petName,
  price,
  onSuccess 
}: PetPurchasePaymentProps) {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [breederInfo, setBreederInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const platformFee = price * 0.15;
  const breederEarnings = price * 0.85;

  const initializePayment = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase.functions.invoke('process-pet-purchase', {
        body: {
          petId,
          buyerId: user.id,
        },
      });

      if (error) throw error;

      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
      setBreederInfo({
        platformFee: data.platformFee,
        breederEarnings: data.breederEarnings,
      });
    } catch (error: any) {
      console.error('Error initializing payment:', error);
      toast.error(error.message || "Failed to initialize payment");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Get pet details
      const { data: pet } = await supabase
        .from('pets')
        .select('owner_id')
        .eq('id', petId)
        .single();

      if (!pet) throw new Error("Pet not found");

      // Complete purchase
      await supabase.functions.invoke('complete-purchase', {
        body: {
          paymentIntentId,
          petId,
          buyerId: user.id,
          breederId: pet.owner_id,
          salePrice: price,
          platformFee,
          breederEarnings,
        },
      });

      toast.success("Purchase successful! The breeder will receive funds after 72 hours.");
      onSuccess();
      onClose();
    } catch (error: any) {
      console.error('Error completing purchase:', error);
      toast.error(error.message || "Failed to complete purchase");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Purchase {petName}</DialogTitle>
          <DialogDescription>
            Complete your payment to purchase this pet. Total: ${price.toFixed(2)}
          </DialogDescription>
        </DialogHeader>

        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Payment Breakdown:</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>• Total: ${price.toFixed(2)}</li>
              <li>• Breeder receives: ${breederEarnings.toFixed(2)}</li>
              <li>• Platform fee: ${platformFee.toFixed(2)}</li>
              <li>• Funds available to breeder after 72 hours</li>
            </ul>
          </AlertDescription>
        </Alert>

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
            amount={price}
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
