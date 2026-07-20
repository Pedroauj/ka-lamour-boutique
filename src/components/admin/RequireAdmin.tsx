import * as React from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAdminSession } from "@/lib/admin-auth";

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { loading, session, isAdmin } = useAdminSession();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!loading && (!session || !isAdmin)) {
      navigate({ to: "/admin/login" });
    }
  }, [loading, session, isAdmin, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-muted-foreground">
        Carregando…
      </div>
    );
  }

  if (!session || !isAdmin) return null;

  return <>{children}</>;
}
