import * as React from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Package, Tags, ShoppingBag, Ticket, LogOut } from "lucide-react";
import { Toaster } from "sonner";
import { signOutAdmin } from "@/lib/admin-auth";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/admin/produtos", label: "Produtos", icon: Package },
  { to: "/admin/categorias", label: "Categorias", icon: Tags },
] as const;

const SOON = [
  { label: "Pedidos", icon: ShoppingBag },
  { label: "Cupons", icon: Ticket },
] as const;

export function AdminShell({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      <aside className="w-60 shrink-0 border-r bg-card p-4 flex flex-col gap-1">
        <p className="font-display text-lg px-2 mb-4">Ka Lamour · Admin</p>
        {NAV.map((n) => (
          <Link
            key={n.to}
            to={n.to}
            className="flex items-center gap-2 rounded-md px-2 py-2 text-sm hover:bg-accent [&.active]:bg-accent [&.active]:font-medium"
            activeProps={{ className: "active" }}
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </Link>
        ))}
        {SOON.map((n) => (
          <div key={n.label} className="flex items-center gap-2 rounded-md px-2 py-2 text-sm text-muted-foreground/50 cursor-not-allowed">
            <n.icon className="h-4 w-4" />
            {n.label}
            <span className="ml-auto text-[10px] uppercase tracking-wide">em breve</span>
          </div>
        ))}
        <Button
          variant="ghost"
          className="mt-auto justify-start gap-2 text-muted-foreground"
          onClick={async () => {
            await signOutAdmin();
            navigate({ to: "/admin/login" });
          }}
        >
          <LogOut className="h-4 w-4" />
          Sair
        </Button>
      </aside>
      <main className="flex-1 p-8 overflow-x-auto">{children}</main>
      <Toaster position="bottom-center" richColors />
    </div>
  );
}
