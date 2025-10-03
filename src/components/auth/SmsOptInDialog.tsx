import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface SmsOptInDialogProps {
  open: boolean;
  onOptIn: (optedIn: boolean) => void;
}

export const SmsOptInDialog = ({ open, onOptIn }: SmsOptInDialogProps) => {
  const [agreed, setAgreed] = useState(false);

  const handleOptIn = (optIn: boolean) => {
    onOptIn(optIn);
    setAgreed(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleOptIn(false)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>SMS Marketing Messages</DialogTitle>
          <DialogDescription>
            Stay connected with PawDNA
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            By opting in, you agree to receive marketing text messages from PawDNA at the phone number provided. 
            You'll receive updates about new pets, breeding services, exclusive offers, and important account notifications.
          </p>
          <p className="text-sm text-muted-foreground">
            Message frequency varies. Message and data rates may apply. Reply STOP to opt out at any time. 
            Reply HELP for help. See our <a href="/terms" className="text-primary underline">Terms of Service</a> and{" "}
            <a href="/privacy" className="text-primary underline">Privacy Policy</a>.
          </p>
          
          <div className="flex items-start space-x-2 pt-4">
            <Checkbox 
              id="sms-agree" 
              checked={agreed}
              onCheckedChange={(checked) => setAgreed(checked === true)}
            />
            <Label htmlFor="sms-agree" className="text-sm leading-relaxed cursor-pointer">
              I agree to receive SMS marketing messages from PawDNA and understand that consent is not a condition of purchase.
            </Label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              variant="hero"
              className="flex-1"
              onClick={() => handleOptIn(true)}
              disabled={!agreed}
            >
              Opt In to SMS
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => handleOptIn(false)}
            >
              Skip for Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
