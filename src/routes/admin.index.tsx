import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

function AdminDashboard() {
  const [counts, setCounts] = React.useState<{ products: number; categories: number } | null>(null);

  React.useEffect(() => {
    (async () => {
      const [{ count: products }, { count: categories }] = await Promise.all([
        supabase.from("products").select("*", { count: "exact", head: true }),
        supabase.from("categories").select("*", { count: "exact", head: true }),
      ]);
      setCounts({ products: products ?? 0, categories: categories ?? 0 });
    })();
  }, []);

  return (
    <div>
      <h1 className="font-display text-3xl">Painel</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 max-w-md">
        <Link to="/admin/produtos" className="border rounded-lg p-6 hover:bg-accent">
          <p className="text-3xl font-medium">{counts?.products ?? "…"}</p>
          <p className="text-sm text-muted-foreground">produtos</p>
        </Link>
        <Link to="/admin/categorias" className="border rounded-lg p-6 hover:bg-accent">
          <p className="text-3xl font-medium">{counts?.categories ?? "…"}</p>
          <p className="text-sm text-muted-foreground">categorias</p>
        </Link>
      </div>
    </div>
  );
}
