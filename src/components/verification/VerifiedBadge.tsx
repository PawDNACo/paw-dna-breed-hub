import { ShieldCheck } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface VerifiedBadgeProps {
  isVerified: boolean;
  size?: "sm" | "md" | "lg";
}

export const VerifiedBadge = ({ isVerified, size = "md" }: VerifiedBadgeProps) => {
  if (!isVerified) return null;

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <ShieldCheck className={`${sizeClasses[size]} text-green-600 fill-green-100`} />
        </TooltipTrigger>
        <TooltipContent>
          <p>Verified via Stripe Identity</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
