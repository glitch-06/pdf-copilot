import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  children: ReactNode;
  active?: boolean;
  size?: "sm" | "md";
}

export function IconButton({
  label,
  children,
  className,
  active,
  size = "md",
  ...props
}: IconButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={active}
      className={cn(
        "grid place-items-center rounded-md text-muted transition-colors outline-none hover:bg-ink/5 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-40",
        size === "sm" ? "size-6" : "size-7",
        active && "bg-accent-soft text-accent",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
