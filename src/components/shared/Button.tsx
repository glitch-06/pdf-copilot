import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-accent text-accent-foreground hover:brightness-105",
        soft: "bg-accent-soft text-accent hover:bg-accent/15",
        outline: "border border-line bg-surface/70 text-ink/80 hover:bg-ink/5",
        ghost: "text-muted hover:bg-ink/5 hover:text-ink",
      },
      size: {
        sm: "h-7 px-2.5 text-[12px]",
        md: "h-9 px-3.5 text-[13px]",
        lg: "h-10 px-4 text-[13.5px]",
      },
      shape: {
        rect: "",
        pill: "rounded-full",
      },
    },
    defaultVariants: { variant: "outline", size: "md", shape: "rect" },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, shape, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant, size, shape }), className)}
      {...props}
    />
  );
}
