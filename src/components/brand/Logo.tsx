import logoAsset from "@/assets/ka-lamour-logo.png.asset.json";

export function Logo({ variant = "dark", className = "", size = 44 }: { variant?: "dark" | "light"; className?: string; size?: number }) {
  return (
    <span className={`inline-flex items-center ${className}`} aria-label="Ka Lamour Store">
      <img
        src={logoAsset.url}
        alt="Ka Lamour Store"
        style={{ height: size, width: "auto", filter: variant === "light" ? "brightness(0) invert(1)" : undefined }}
        className="object-contain select-none"
        draggable={false}
      />
    </span>
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return <span className={className} aria-hidden="true">✦</span>;
}
