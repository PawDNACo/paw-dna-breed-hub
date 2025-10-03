import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

interface RoleSubscriptionFormProps {
  onRoleUpdated?: () => void;
}

export const RoleSubscriptionForm = ({ onRoleUpdated }: RoleSubscriptionFormProps) => {
  const [selectedRole, setSelectedRole] = useState<"buyer" | "breeder" | "both">("buyer");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to subscribe.",
          variant: "destructive",
        });
        return;
      }

      // Delete the browser role
      await supabase
        .from("user_roles")
        .delete()
        .eq("user_id", user.id)
        .eq("role", "browser");

      // Insert the selected role(s)
      const rolesToInsert = selectedRole === "both"
        ? [
            { user_id: user.id, role: "breeder" as const },
            { user_id: user.id, role: "buyer" as const }
          ]
        : [{ user_id: user.id, role: selectedRole }];

      const { error: roleError } = await supabase
        .from("user_roles")
        .insert(rolesToInsert);

      if (roleError) throw roleError;

      toast({
        title: "Success",
        description: "Your role has been updated. Redirecting to subscription...",
      });

      // Navigate to the pricing section
      navigate("/#pricing");
      
      if (onRoleUpdated) {
        onRoleUpdated();
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast({
        title: "Error",
        description: "Failed to update your role. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Choose Your Role</CardTitle>
        <CardDescription>
          Select how you'd like to use PawDNA to continue with your subscription
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <Label>I want to use PawDNA as a</Label>
          <RadioGroup value={selectedRole} onValueChange={(value: any) => setSelectedRole(value)}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="buyer" id="sub-buyer" />
              <Label htmlFor="sub-buyer" className="font-normal cursor-pointer">
                Buyer - Find and purchase pets
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="breeder" id="sub-breeder" />
              <Label htmlFor="sub-breeder" className="font-normal cursor-pointer">
                Breeder - List and sell pets
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="sub-both" />
              <Label htmlFor="sub-both" className="font-normal cursor-pointer">
                Both Buyer & Breeder
              </Label>
            </div>
          </RadioGroup>
        </div>
        <Button onClick={handleSubscribe} disabled={loading} className="w-full">
          {loading ? "Updating..." : "Continue to Subscribe"}
        </Button>
      </CardContent>
    </Card>
  );
};
