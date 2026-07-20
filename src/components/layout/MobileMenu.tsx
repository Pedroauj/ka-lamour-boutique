import * as React from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useStore } from "@/lib/store";
import { Logo } from "@/components/brand/Logo";

const NAV = [
  ["/roupas", "Roupas"],
  ["/perfumes", "Perfumes"],
  ["/cosmeticos", "Cosméticos"],
  ["/novidades", "Novidades"],
  ["/ofertas", "Ofertas"],
] as const;

export function MobileMenu() {
  const s = useStore();
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && s.setMobileOpen(false);
    if (s.mobileOpen) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [s.mobileOpen]);
  if (!s.mobileOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-marfim overflow-y-auto lg:hidden">
      <div className="px-6 py-5 flex items-center justify-between border-b border-rose-claro">
        <Logo />
        <button aria-label="Fechar" onClick={() => s.setMobileOpen(false)}><X /></button>
      </div>
      <nav className="px-8 py-10 flex flex-col gap-6">
        {NAV.map(([to, label]) => (
          <Link
            key={to}
            to={to}
            onClick={() => s.setMobileOpen(false)}
            className="font-display text-5xl text-carvao hover:text-terracota"
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="px-8 py-6 border-t border-rose-claro caps text-grafite">
        <p>atendimento@kalamourstore.com.br</p>
        <p className="mt-2">whatsapp (11) 90000-0000</p>
      </div>
    </div>
  );
}
