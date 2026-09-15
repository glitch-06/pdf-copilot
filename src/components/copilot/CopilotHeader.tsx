import { Tabs } from "@/components/shared/Tabs";

export type CopilotMode = "selection" | "document";

export function CopilotHeader({
  mode,
  onModeChange,
  subtitle,
}: {
  mode: CopilotMode;
  onModeChange: (mode: CopilotMode) => void;
  subtitle: string;
}) {
  return (
    <div className="border-b border-line px-5 py-3.5">
      <div className="flex items-center justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted">AI Copilot</p>
        <Tabs
          value={mode}
          onChange={onModeChange}
          items={[
            { value: "selection", label: "Selection" },
            { value: "document", label: "Document" },
          ]}
        />
      </div>
      <h2 className="mt-1 text-[15px] font-semibold tracking-tight">{subtitle}</h2>
    </div>
  );
}
