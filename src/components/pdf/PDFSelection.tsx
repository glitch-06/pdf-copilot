import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PDFSelectionProps {
  active: boolean;
  onSelect: () => void;
  children: ReactNode;
  className?: string;
  label: string;
  as?: "span" | "div";
}

/**
 * A selectable region of the mock document. Real PDF.js text layers will
 * replace this later — the contract (active + onSelect) stays the same.
 */
export function PDFSelection({
  active,
  onSelect,
  children,
  className,
  label,
  as = "span",
}: PDFSelectionProps) {
  const Tag = as;
  return (
    <Tag
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={active}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "cursor-text rounded-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-accent/50",
        active ? "hl-pulse bg-highlight" : "hover:bg-highlight/40",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
