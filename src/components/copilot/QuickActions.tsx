import { Button } from "@/components/shared/Button";
import type { QuickActionId } from "@/types/copilot";

const actions: { id: QuickActionId; label: string }[] = [
  { id: "explain", label: "Explain" },
  { id: "simplify", label: "Simplify" },
  { id: "example", label: "Give an example" },
  { id: "deeper", label: "Go deeper" },
  { id: "summarize", label: "Summarize" },
  { id: "flashcards", label: "Create flashcards" },
];

export function QuickActions({
  active,
  onAction,
  disabled,
}: {
  active?: QuickActionId;
  onAction: (action: QuickActionId) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {actions.map((action) => (
        <Button
          key={action.id}
          size="sm"
          shape="pill"
          disabled={disabled}
          variant={action.id === (active ?? "explain") ? "soft" : "outline"}
          onClick={() => onAction(action.id)}
        >
          {action.label}
        </Button>
      ))}
    </div>
  );
}
