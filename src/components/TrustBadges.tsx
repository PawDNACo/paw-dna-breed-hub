import { Shield, Lock, CheckCircle, Award, CreditCard, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TrustBadgesProps {
  variant?: "horizontal" | "grid";
  showAll?: boolean;
}

export const TrustBadges = ({ variant = "horizontal", showAll = false }: TrustBadgesProps) => {
  const badges = [
    {
      icon: <Shield className="h-5 w-5" />,
      text: "Verified Secure",
      description: "SSL Encrypted"
    },
    {
      icon: <Lock className="h-5 w-5" />,
      text: "Safe Payments",
      description: "Stripe Verified"
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      text: "ID Verified",
      description: "All Users Verified"
    },
    {
      icon: <Award className="h-5 w-5" />,
      text: "Premium Quality",
      description: "Vetted Breeders"
    },
    {
      icon: <CreditCard className="h-5 w-5" />,
      text: "Secure Checkout",
      description: "PCI Compliant"
    },
    {
      icon: <Users className="h-5 w-5" />,
      text: "Trusted Community",
      description: "1000+ Happy Customers"
    }
  ];

  const displayedBadges = showAll ? badges : badges.slice(0, 4);

  if (variant === "grid") {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {displayedBadges.map((badge, index) => (
          <div
            key={index}
            className="flex items-center gap-3 p-4 rounded-lg border border-border bg-card hover:border-primary/50 transition-colors"
          >
            <div className="flex-shrink-0 text-primary">
              {badge.icon}
            </div>
            <div>
              <div className="font-semibold text-sm">{badge.text}</div>
              <div className="text-xs text-muted-foreground">{badge.description}</div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
      {displayedBadges.map((badge, index) => (
        <div
          key={index}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 hover:bg-card transition-colors"
        >
          <div className="text-primary">
            {badge.icon}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold">{badge.text}</span>
            <span className="text-xs text-muted-foreground">{badge.description}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

export const TrustBadgesCompact = () => {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Badge variant="outline" className="px-3 py-1 gap-1.5">
        <Shield className="h-3 w-3" />
        Verified Secure
      </Badge>
      <Badge variant="outline" className="px-3 py-1 gap-1.5">
        <Lock className="h-3 w-3" />
        Safe Payments
      </Badge>
      <Badge variant="outline" className="px-3 py-1 gap-1.5">
        <CheckCircle className="h-3 w-3" />
        ID Verified
      </Badge>
      <Badge variant="outline" className="px-3 py-1 gap-1.5">
        <Award className="h-3 w-3" />
        Premium Quality
      </Badge>
    </div>
  );
};
