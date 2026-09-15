import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SectionLabel({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: "muted" | "accent";
  className?: string;
}) {
  return (
    <p
      className={cn(
        "font-mono text-[10px] uppercase tracking-[0.15em]",
        tone === "accent" ? "text-accent" : "text-muted",
        className,
      )}
    >
      {children}
    </p>
  );
}
