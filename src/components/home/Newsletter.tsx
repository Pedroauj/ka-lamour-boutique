import * as React from "react";
import { toast } from "sonner";
import { Sparkle } from "@/components/brand/Logo";
import { Marquee } from "@/components/brand/Marquee";
import { Reveal } from "@/components/brand/Reveal";

export function Newsletter() {
  const [email, setEmail] = React.useState("");
  const [consent, setConsent] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  return (
    <section className="bg-terracota text-marfim">
      <div className="border-b border-marfim/20">
        <Marquee items={["CUPOM LAMOUR10", "10% OFF NA PRIMEIRA COMPRA", "NOVIDADES EM PRIMEIRA MÃO", "RITUAIS EXCLUSIVOS"]} />
      </div>
      <div className="mx-auto max-w-[1000px] px-5 md:px-10 py-24 text-center">
        <Reveal>
          <p className="caps flex items-center justify-center gap-2 text-rose"><Sparkle />clube ka lamour<Sparkle /></p>
          <h2 className="mt-6 font-display text-4xl md:text-6xl">
            Entre para a lista. Ganhe <em className="text-rose">10% off</em> na primeira compra.
          </h2>
          <p className="mt-4 text-marfim/85 max-w-xl mx-auto">
            Cupom LAMOUR10 no seu e-mail. Novidades, pré-vendas e rituais em primeira mão.
          </p>

          {sent ? (
            <p className="mt-10 caps flex items-center justify-center gap-2 text-rose">
              <Sparkle /> Cupom enviado. Confira sua caixa de entrada.
            </p>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!consent) { toast("Precisamos do seu consentimento LGPD."); return; }
                setSent(true);
                toast("Bem-vinda ao clube Ka Lamour ✦");
              }}
              className="mt-10 flex flex-col gap-3 max-w-md mx-auto"
            >
              <div className="flex gap-2 border-b border-marfim/50 pb-2">
                <input
                  type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="flex-1 bg-transparent outline-none placeholder:text-marfim/60"
                />
                <button type="submit" className="caps hover:text-rose">Enviar →</button>
              </div>
              <label className="flex items-start gap-2 text-xs text-marfim/80 text-left">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} className="mt-0.5 accent-rose" />
                <span>Concordo em receber e-mails da Ka Lamour Store conforme a política de privacidade (LGPD).</span>
              </label>
            </form>
          )}
        </Reveal>
      </div>
    </section>
  );
}
