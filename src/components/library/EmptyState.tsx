import { FileText } from "lucide-react";

import { Button } from "@/components/shared/Button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center rounded-lg border border-line bg-surface/50 px-6 py-16 text-center">
      <span className="grid size-14 place-items-center rounded-xl border border-line bg-accent-soft text-accent">
        <FileText className="size-6" />
      </span>
      <h2 className="mt-5 text-[17px] font-semibold tracking-tight">Bring your PDFs to life.</h2>
      <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted">
        Upload a document and let PDF Copilot explain, summarize, and answer questions about it.
      </p>
      <div className="mt-5 flex gap-2">
        <Button variant="primary">Open PDF</Button>
        <Button variant="outline">Try sample document</Button>
      </div>
    </div>
  );
}
