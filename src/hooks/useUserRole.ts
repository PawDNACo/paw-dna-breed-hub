import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type AppRole = "admin" | "breeder" | "buyer";

interface UserRoleState {
  roles: AppRole[];
  loading: boolean;
  isAdmin: boolean;
  isBreeder: boolean;
  isBuyer: boolean;
}

export const useUserRole = () => {
  const [state, setState] = useState<UserRoleState>({
    roles: [],
    loading: true,
    isAdmin: false,
    isBreeder: false,
    isBuyer: false,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchUserRoles();
  }, []);

  const fetchUserRoles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setState({
          roles: [],
          loading: false,
          isAdmin: false,
          isBreeder: false,
          isBuyer: false,
        });
        return;
      }

      const { data: userRoles, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) throw error;

      const roles = (userRoles || []).map(r => r.role as AppRole);
      
      setState({
        roles,
        loading: false,
        isAdmin: roles.includes("admin"),
        isBreeder: roles.includes("breeder"),
        isBuyer: roles.includes("buyer"),
      });
    } catch (error) {
      console.error("Error fetching user roles:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user roles",
        variant: "destructive",
      });
      setState({
        roles: [],
        loading: false,
        isAdmin: false,
        isBreeder: false,
        isBuyer: false,
      });
    }
  };

  const hasRole = (role: AppRole): boolean => {
    return state.roles.includes(role);
  };

  const hasAnyRole = (roles: AppRole[]): boolean => {
    return roles.some(role => state.roles.includes(role));
  };

  const requireRole = (role: AppRole, action: string = "perform this action"): boolean => {
    if (!hasRole(role)) {
      toast({
        title: "Access Denied",
        description: `You must have ${role} privileges to ${action}.`,
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  return {
    ...state,
    hasRole,
    hasAnyRole,
    requireRole,
    refetch: fetchUserRoles,
  };
};
