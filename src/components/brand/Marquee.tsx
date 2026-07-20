import { Sparkle } from "./Logo";

export function Marquee({
  items,
  className = "",
  sparkle = true,
}: {
  items: string[];
  className?: string;
  sparkle?: boolean;
}) {
  const track = [...items, ...items];
  return (
    <div className={`marquee ${className}`}>
      <div className="marquee-track py-3 caps">
        {track.map((t, i) => (
          <span key={i} className="inline-flex items-center gap-6">
            {t}
            {sparkle && <Sparkle className="text-rose" />}
          </span>
        ))}
      </div>
    </div>
  );
}
