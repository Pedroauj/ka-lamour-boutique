export function Logo({ variant = "dark", className = "" }: { variant?: "dark" | "light"; className?: string }) {
  const rose = "#D9A79B";
  const grafite = variant === "dark" ? "#2D2A29" : "#FAF6F1";
  const stroke = variant === "dark" ? "#4A4644" : "#FAF6F1";
  return (
    <span className={`inline-flex items-center gap-3 ${className}`} aria-label="Ka Lamour Store">
      <svg width="42" height="42" viewBox="0 0 42 42" aria-hidden="true">
        <circle cx="21" cy="21" r="19.5" fill="none" stroke={stroke} strokeWidth="1" />
        <text x="50%" y="56%" textAnchor="middle" dominantBaseline="middle"
              fontFamily="Fraunces, serif" fontStyle="italic" fontWeight="500" fontSize="22" fill={rose}>K</text>
        <text x="34" y="10" fontSize="6" fill={rose}>✦</text>
        <text x="6" y="36" fontSize="5" fill={rose}>✦</text>
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg tracking-tight" style={{ color: rose }}>
          KA <span className="italic">L</span>AMOUR
        </span>
        <span className="caps mt-1" style={{ color: grafite, letterSpacing: "0.32em", fontSize: "0.6rem" }}>
          store
        </span>
      </span>
    </span>
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return <span className={className} aria-hidden="true">✦</span>;
}
