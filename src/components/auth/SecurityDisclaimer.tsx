import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const SecurityDisclaimer = () => {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertTriangle className="h-5 w-5" />
      <AlertTitle className="font-bold text-lg">⚠️ Important Security Warning</AlertTitle>
      <AlertDescription className="mt-2 space-y-2">
        <p className="font-semibold">Please be aware of potential scams:</p>
        <ul className="list-disc list-inside space-y-1 ml-2">
          <li>NEVER conduct transactions outside of the PawDNA platform</li>
          <li>NEVER share your banking or payment information directly with buyers/breeders</li>
          <li>NEVER meet someone without proper verification through our platform</li>
          <li>Be cautious of requests to move conversations off-platform</li>
          <li>Report any suspicious activity immediately</li>
        </ul>
        <p className="font-semibold mt-4 text-destructive">
          All transactions must go through PawDNA's secure payment system for your protection.
        </p>
      </AlertDescription>
    </Alert>
  );
};
