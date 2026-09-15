import { ChevronDown, ChevronUp, Minus, Plus, Search } from "lucide-react";

import { IconButton } from "@/components/shared/IconButton";

interface PDFToolbarProps {
  zoom: number;
  page: number;
  pageCount: number;
  onZoom: (delta: number) => void;
  onFitWidth: () => void;
  onPage: (delta: number) => void;
}

export function PDFToolbar({
  zoom,
  page,
  pageCount,
  onZoom,
  onFitWidth,
  onPage,
}: PDFToolbarProps) {
  return (
    <div className="flex items-center justify-between border-b border-line bg-surface/60 px-4 py-2 text-[12px] text-muted backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <IconButton label="Zoom out" size="sm" onClick={() => onZoom(-10)}>
            <Minus className="size-3" />
          </IconButton>
          <span className="w-10 text-center font-mono tabular-nums">{zoom}%</span>
          <IconButton label="Zoom in" size="sm" onClick={() => onZoom(10)}>
            <Plus className="size-3" />
          </IconButton>
        </div>
        <span className="h-3.5 w-px bg-line" />
        <button
          type="button"
          onClick={onFitWidth}
          className="rounded-md px-1.5 py-0.5 transition-colors hover:bg-ink/5 hover:text-ink"
        >
          Fit to width
        </button>
        <span className="h-3.5 w-px bg-line" />
        <button
          type="button"
          className="flex items-center gap-1 rounded-md px-1.5 py-0.5 transition-colors hover:bg-ink/5 hover:text-ink"
        >
          <Search className="size-3" /> Search
        </button>
      </div>
      <div className="flex items-center gap-2">
        <IconButton label="Previous page" size="sm" onClick={() => onPage(-1)}>
          <ChevronUp className="size-3" />
        </IconButton>
        <span className="font-mono tabular-nums">
          Page {page} / {pageCount}
        </span>
        <IconButton label="Next page" size="sm" onClick={() => onPage(1)}>
          <ChevronDown className="size-3" />
        </IconButton>
      </div>
    </div>
  );
}
