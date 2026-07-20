import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-marfim px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-terracota">404</h1>
        <h2 className="mt-4 font-display text-2xl">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          A página que você procura não existe ou foi movida.
        </p>
        <Link to="/" className="mt-6 inline-block caps bg-terracota text-marfim px-6 py-3">
          Voltar para a home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-marfim px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-2xl">Algo saiu do lugar por aqui.</h1>
        <p className="mt-2 text-sm text-muted-foreground">Tente novamente ou volte para a home.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="caps bg-terracota text-marfim px-6 py-3">
            Tentar de novo
          </button>
          <a href="/" className="caps border border-carvao text-carvao px-6 py-3">Ir para a home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Ka Lamour Store — Moda, Perfumaria e Cosméticos" },
      { name: "description", content: "Vista o que você sente. Perfume o resto. Boutique digital com curadoria editorial de moda feminina, perfumes e cosméticos." },
      { name: "theme-color", content: "#FAF6F1" },
      { property: "og:title", content: "Ka Lamour Store — Moda, Perfumaria e Cosméticos" },
      { property: "og:description", content: "Vista o que você sente. Perfume o resto. Boutique digital com curadoria editorial de moda feminina, perfumes e cosméticos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ka Lamour Store — Moda, Perfumaria e Cosméticos" },
      { name: "twitter:description", content: "Vista o que você sente. Perfume o resto. Boutique digital com curadoria editorial de moda feminina, perfumes e cosméticos." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5f18660b-a2bc-46f9-97e0-8eb9e28a2a81/id-preview-8a437e82--abbc54b0-0fb6-4584-99fb-58636b8bd4a3.lovable.app-1784566429747.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5f18660b-a2bc-46f9-97e0-8eb9e28a2a81/id-preview-8a437e82--abbc54b0-0fb6-4584-99fb-58636b8bd4a3.lovable.app-1784566429747.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=Archivo:wght@300;400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
