import { cn } from "@/lib/utils";

interface TabsProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  items: { value: T; label: string }[];
  className?: string;
}

export function Tabs<T extends string>({ value, onChange, items, className }: TabsProps<T>) {
  return (
    <div
      role="tablist"
      className={cn("inline-flex items-center gap-0.5 rounded-lg border border-line p-0.5", className)}
    >
      {items.map((item) => (
        <button
          key={item.value}
          role="tab"
          type="button"
          aria-selected={value === item.value}
          onClick={() => onChange(item.value)}
          className={cn(
            "rounded-[6px] px-2.5 py-1 text-[12px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
            value === item.value ? "bg-accent-soft text-accent" : "text-muted hover:text-ink",
          )}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}
