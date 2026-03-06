import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface Props {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function ProtectedRoute({ allowedRoles, children }: Props) {
  const { user, loading: authLoading } = useAuth();
  const [role, setRole] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setChecking(false); return; }

    const fetchRole = async () => {
      // Check profile role
      const { data: prof } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .maybeSingle();

      // Check admin role
      const { data: adminData } = await supabase.rpc("has_admin_role", { _user_id: user.id });

      setRole(prof?.role ?? null);
      setIsAdmin(!!adminData);
      setChecking(false);
    };

    fetchRole();
  }, [user, authLoading]);

  if (authLoading || checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return <Navigate to="/auth" replace />;

  const effectiveRole = isAdmin ? "admin" : role;
  if (!effectiveRole || !allowedRoles.includes(effectiveRole)) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}
