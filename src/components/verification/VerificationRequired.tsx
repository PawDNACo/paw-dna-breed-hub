import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VerificationRequiredProps {
  action: string;
}

export const VerificationRequired = ({ action }: VerificationRequiredProps) => {
  const navigate = useNavigate();

  return (
    <Alert variant="destructive" className="max-w-2xl mx-auto mt-8">
      <ShieldAlert className="h-5 w-5" />
      <AlertTitle className="text-lg font-semibold">Verification Required</AlertTitle>
      <AlertDescription className="mt-2">
        <p className="mb-4">
          You must verify your identity through Stripe Identity before you can {action}.
        </p>
        <div className="space-y-2">
          <p className="font-semibold">Why is verification required?</p>
          <ul className="list-disc list-inside space-y-1 ml-2 text-sm">
            <li>Protects buyers and breeders from fraud</li>
            <li>Ensures all users are legitimate</li>
            <li>Builds trust in the PawDNA community</li>
            <li>Required by payment regulations</li>
          </ul>
        </div>
        <Button 
          onClick={() => navigate("/breeder-dashboard")} 
          className="mt-4"
        >
          Complete Verification Now
        </Button>
      </AlertDescription>
    </Alert>
  );
};
