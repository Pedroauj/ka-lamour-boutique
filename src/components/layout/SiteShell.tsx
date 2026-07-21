import type { ReactNode } from "react";
import { PromoBar } from "@/components/layout/PromoBar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { FavoritesDrawer } from "@/components/layout/FavoritesDrawer";
import { SearchOverlay } from "@/components/layout/SearchOverlay";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { WhatsAppFab } from "@/components/layout/WhatsAppFab";
import { StoreProvider } from "@/lib/store";
import { CatalogProvider } from "@/lib/catalog-store";
import { Toaster } from "sonner";

export function SiteShell({ children, transparentHeader = false }: { children: ReactNode; transparentHeader?: boolean }) {
  return (
    <CatalogProvider>
    <StoreProvider>
      <PromoBar />
      <Header transparent={transparentHeader} />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <FavoritesDrawer />
      <SearchOverlay />
      <MobileMenu />
      <WhatsAppFab />
      <Toaster position="bottom-center" theme="light" toastOptions={{
        style: { background: "#2D2A29", color: "#FAF6F1", border: "1px solid #9C4F44", borderRadius: 0, fontFamily: "Archivo" }
      }} />
    </StoreProvider>
    </CatalogProvider>
  );
}
