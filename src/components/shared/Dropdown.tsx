import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";

interface DropdownProps {
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode;
  children: ReactNode;
  align?: "left" | "right";
}

export function Dropdown({ trigger, children, align = "right" }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (event: MouseEvent) => {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      {trigger({ open, toggle: () => setOpen((value) => !value) })}
      {open && (
        <div
          role="menu"
          className={cn(
            "rise absolute top-full z-40 mt-1.5 min-w-44 rounded-lg border border-line bg-surface/95 p-1 shadow-sm backdrop-blur-xl",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  children,
  onSelect,
}: {
  children: ReactNode;
  onSelect?: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onSelect}
      className="w-full rounded-md px-2.5 py-1.5 text-left text-[12.5px] text-ink/80 transition-colors hover:bg-ink/5"
    >
      {children}
    </button>
  );
}
