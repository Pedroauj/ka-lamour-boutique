import * as React from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

// Digita e aperta Enter (ou vírgula) para virar um chip removível. Salva como string[].
export function TagInput({
  value,
  onChange,
  placeholder = "Digite e aperte Enter",
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = React.useState("");

  function commit() {
    const v = draft.trim().replace(/,$/, "").trim();
    if (!v || value.includes(v)) { setDraft(""); return; }
    onChange([...value, v]);
    setDraft("");
  }

  function remove(idx: number) {
    onChange(value.filter((_, i) => i !== idx));
  }

  return (
    <div className="space-y-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 border rounded-full px-2.5 py-1 text-sm bg-secondary">
              {tag}
              <button type="button" onClick={() => remove(i)} className="text-muted-foreground hover:text-destructive">
                <X className="h-3.5 w-3.5" />
              </button>
            </span>
          ))}
        </div>
      )}
      <Input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commit(); }
          else if (e.key === "Backspace" && !draft && value.length) remove(value.length - 1);
        }}
        onBlur={commit}
        placeholder={placeholder}
      />
    </div>
  );
}
