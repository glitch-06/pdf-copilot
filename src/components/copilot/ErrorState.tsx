import { AlertCircle } from "lucide-react";

import { Button } from "@/components/shared/Button";

export function ErrorState({
  message,
  onRetry,
  onCopy,
}: {
  message: string;
  onRetry: () => void;
  onCopy: () => void;
}) {
  return (
    <div className="rise rounded-lg border border-line bg-surface/70 px-4 py-4" role="alert">
      <p className="flex items-center gap-2 text-[13px] font-medium text-ink">
        <AlertCircle className="size-3.5 text-danger" /> Something went wrong.
      </p>
      <p className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{message}</p>
      <div className="mt-3 flex gap-1.5">
        <Button size="sm" variant="primary" onClick={onRetry}>
          Try again
        </Button>
        <Button size="sm" variant="outline" onClick={onCopy}>
          Copy selected text
        </Button>
      </div>
    </div>
  );
}
