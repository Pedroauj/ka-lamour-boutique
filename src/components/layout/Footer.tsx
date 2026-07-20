import { Link } from "@tanstack/react-router";
import { Logo, Sparkle } from "@/components/brand/Logo";
import { Marquee } from "@/components/brand/Marquee";

export function Footer() {
  return (
    <footer className="bg-carvao text-marfim">
      <div className="border-y border-marfim/10">
        <Marquee
          items={["KA LAMOUR STORE", "DESDE 2024", "MODA · PERFUMES · COSMÉTICOS", "FEITO NO BRASIL"]}
        />
      </div>
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 py-16 grid gap-12 md:grid-cols-4">
        <div>
          <Logo variant="light" />
          <p className="mt-6 text-sm text-marfim/70 leading-relaxed max-w-xs">
            Boutique digital de moda feminina, perfumaria e cosméticos.
            Peças que despertam, aromas que ficam, rituais que cuidam.
          </p>
        </div>
        <FooterCol title="Institucional" items={[
          ["Sobre a Ka Lamour", "/"],
          ["Nosso manifesto", "/"],
          ["Imprensa", "/"],
          ["Trabalhe conosco", "/"],
        ]} />
        <FooterCol title="Ajuda" items={[
          ["Trocas e devoluções", "/"],
          ["Prazos de entrega", "/"],
          ["Formas de pagamento", "/"],
          ["Política de privacidade", "/"],
          ["Termos de uso", "/"],
        ]} />
        <FooterCol title="Contato" items={[
          ["atendimento@kalamourstore.com.br", "mailto:atendimento@kalamourstore.com.br"],
          ["WhatsApp (11) 90000-0000", "https://wa.me/5511900000000"],
          ["@kalamourstore", "https://instagram.com"],
        ]} />
      </div>
      <div className="border-t border-marfim/10">
        <div className="mx-auto max-w-[1400px] px-5 md:px-10 py-6 flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-marfim/60">
          <span>© {new Date().getFullYear()} Ka Lamour Store <Sparkle className="text-rose mx-2" /> CNPJ 00.000.000/0001-00</span>
          <div className="flex gap-3 caps text-marfim/70">
            <span>Pix</span><span>·</span><span>Visa</span><span>·</span><span>Master</span><span>·</span><span>Amex</span><span>·</span><span>Elo</span><span>·</span><span>Boleto</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <h4 className="caps text-rose">{title}</h4>
      <ul className="mt-5 space-y-3 text-sm text-marfim/80">
        {items.map(([label, href]) => (
          <li key={label}>
            {href.startsWith("http") || href.startsWith("mailto") ? (
              <a href={href} className="hover:text-rose transition-colors">{label}</a>
            ) : (
              <Link to={href} className="hover:text-rose transition-colors">{label}</Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
