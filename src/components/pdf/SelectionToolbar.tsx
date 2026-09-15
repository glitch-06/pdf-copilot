import { Sparkles } from "lucide-react";

import type { QuickActionId } from "@/types/copilot";

const secondary: {
  id: QuickActionId | "ask";
  label: string;
}[] = [
  {
    id: "simplify",
    label: "Simplify",
  },
  {
    id: "deeper",
    label: "Deeper",
  },
  {
    id: "example",
    label: "Example",
  },
  {
    id: "ask",
    label: "Ask AI",
  },
];

interface SelectionToolbarProps {
  onAction: (
    action: QuickActionId | "ask",
  ) => void;

  className?: string;
}

export function SelectionToolbar({
  onAction,
  className,
}: SelectionToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Selection actions"
      className={`rise z-20 flex items-center gap-0.5 rounded-lg border border-line bg-surface/95 p-1 shadow-md backdrop-blur-xl ${
        className ?? ""
      }`}
    >
      <button
        type="button"
        onClick={() =>
          onAction("explain")
        }
        className="flex items-center gap-1.5 rounded-md bg-accent px-2.5 py-1.5 text-[12px] font-medium text-accent-foreground outline-none transition hover:brightness-105 focus-visible:ring-2 focus-visible:ring-accent/50"
      >
        <Sparkles className="size-3" />
        Explain
      </button>

      {secondary.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() =>
            onAction(item.id)
          }
          className="rounded-md px-2 py-1.5 text-[12px] text-muted outline-none transition-colors hover:bg-ink/5 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/50"
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}