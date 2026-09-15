import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";

import type { DocumentSummary } from "@/types/copilot";

export function DocumentCard({ document }: { document: DocumentSummary }) {
  return (
    <Link
      to="/"
      className="group flex items-center gap-3.5 rounded-lg border border-line bg-surface/70 px-4 py-3.5 transition-colors outline-none hover:border-accent/40 focus-visible:ring-2 focus-visible:ring-accent/40"
    >
      <span className="grid size-9 shrink-0 place-items-center rounded-md bg-accent-soft text-accent">
        <FileText className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-medium text-ink">{document.name}</span>
        <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-[0.12em] text-muted">
          {document.pages} pages · {document.lastOpened}
        </span>
        <span className="mt-2 block h-0.5 w-full overflow-hidden rounded bg-ink/8">
          <span
            className="block h-full rounded bg-accent"
            style={{ width: `${Math.round(document.progress * 100)}%` }}
          />
        </span>
      </span>
      <span className="font-mono text-[10px] text-muted tabular-nums">
        {Math.round(document.progress * 100)}%
      </span>
    </Link>
  );
}
