import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ShieldAlert } from "lucide-react";

/**
 * Security disclaimer component for screenshot prevention and data protection
 * 
 * This component informs users about security measures and their limitations
 */
export const SecurityDisclaimer = () => {
  return (
    <Alert variant="default" className="border-primary/50">
      <ShieldAlert className="h-4 w-4" />
      <AlertTitle>Security Notice</AlertTitle>
      <AlertDescription className="text-sm space-y-2">
        <p>
          <strong>Screenshot Protection:</strong> While we attempt to prevent screenshots,
          this is not foolproof. Please be aware that determined users may still capture content.
        </p>
        <p>
          <strong>Data Protection:</strong> Never share personal information (phone numbers,
          addresses, financial details) in public listings or messages until you've verified
          the other party's identity.
        </p>
        <p>
          <strong>Location Privacy:</strong> Precise location data is only visible to verified
          users. Always meet in public places for safety.
        </p>
      </AlertDescription>
    </Alert>
  );
};
