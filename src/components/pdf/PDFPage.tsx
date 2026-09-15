import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

interface PDFPageProps {
  pageNumber: number;
  zoom: number;
  children: ReactNode;
  id?: string;
}

export function PDFPage({ pageNumber, zoom, children, id }: PDFPageProps) {
  return (
    <div
      id={id}
      className="relative mx-auto"
      style={{ maxWidth: `${(620 * zoom) / 100}px`, width: "100%" }}
    >
      <div
        className={cn(
          "relative rounded-[10px] bg-document px-6 py-10 text-document-ink ring-1 ring-line sm:px-12 sm:py-12",
        )}
      >
        <div
          className="pointer-events-none absolute left-0 top-0 h-full w-1/2 rounded-l-[10px]"
          style={{
            background:
              "radial-gradient(120% 60% at 40% 42%, color-mix(in oklab, var(--accent) 7%, transparent), transparent 70%)",
          }}
        />
        {children}
      </div>
      <p className="mt-2 mb-6 text-center font-mono text-[10px] text-muted tabular-nums">
        {pageNumber}
      </p>
    </div>
  );
}
