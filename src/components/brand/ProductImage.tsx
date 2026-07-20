import * as React from "react";

interface Props {
  label?: string;
  duotone?: number; // 0..5
  className?: string;
  aspect?: string; // e.g. "3/4"
  arch?: boolean;
  outline?: boolean;
  glyph?: string;
}

const palettes = [
  ["#D9A79B", "#9C4F44"], // rose -> terracota
  ["#ECD3CA", "#B0746A"], // rose-claro -> rosewood
  ["#F1E8E1", "#4A4644"], // porcelana -> grafite
  ["#B0746A", "#2D2A29"], // rosewood -> carvao
  ["#FAF6F1", "#D9A79B"], // marfim -> rose
  ["#9C4F44", "#2D2A29"], // terracota -> carvao
];

export function ProductImage({
  label = "editorial · ka lamour",
  duotone = 0,
  className = "",
  aspect = "3/4",
  arch = true,
  outline = false,
  glyph = "K",
}: Props) {
  const [a, b] = palettes[duotone % palettes.length];
  const gradId = React.useId();
  return (
    <div
      className={`${arch ? "arch" : "rounded-lg overflow-hidden"} ${outline ? "arch-outline" : ""} grain relative w-full transition-transform duration-500 ${className}`}
      style={{ aspectRatio: aspect }}
    >
      <svg viewBox="0 0 300 400" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={a} />
            <stop offset="100%" stopColor={b} />
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill={`url(#${gradId})`} />
        <text
          x="50%" y="52%"
          textAnchor="middle" dominantBaseline="middle"
          fontFamily="Fraunces, serif" fontStyle="italic" fontSize="180"
          fill="rgba(45,42,41,0.18)"
        >
          {glyph}
        </text>
      </svg>
      <span className="caps absolute bottom-3 left-3 right-3 text-marfim/90 mix-blend-difference">
        {label}
      </span>
    </div>
  );
}
