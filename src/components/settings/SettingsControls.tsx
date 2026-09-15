import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-line py-6 first:border-t-0 first:pt-0">
      <h2 className="text-[13px] font-semibold tracking-tight">{title}</h2>
      {description && <p className="mt-1 text-[12.5px] leading-relaxed text-muted">{description}</p>}
      <div className="mt-4 space-y-4">{children}</div>
    </section>
  );
}

export function OptionRow({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-[13px] text-ink/85">{label}</span>
      {children}
    </div>
  );
}

export function SegmentedControl<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <div className="inline-flex items-center gap-0.5 rounded-lg border border-line p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            "rounded-[6px] px-2.5 py-1 text-[12px] font-medium transition-colors outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
            value === option.value ? "bg-accent-soft text-accent" : "text-muted hover:text-ink",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

export function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-ink/85">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="size-3.5 accent-[var(--accent)]"
      />
      {label}
    </label>
  );
}
