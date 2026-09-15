import { cn } from "@/lib/utils";

interface PageThumbnailsProps {
  pages: number[];
  current: number;
  onSelect: (page: number) => void;
}

export function PageThumbnails({ pages, current, onSelect }: PageThumbnailsProps) {
  return (
    <nav
      aria-label="Page navigation"
      className="hidden w-20 shrink-0 flex-col gap-2 overflow-y-auto border-r border-line bg-surface/40 px-3 py-4 backdrop-blur-md xl:flex"
    >
      {pages.map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => onSelect(page)}
          aria-current={page === current}
          className="group flex flex-col items-center gap-1 outline-none"
        >
          <span
            className={cn(
              "aspect-[3/4] w-full rounded-[4px] border bg-document transition-colors",
              page === current
                ? "border-accent ring-2 ring-accent/25"
                : "border-line group-hover:border-accent/40",
            )}
          >
            <span className="mt-2 block space-y-1 px-1.5">
              <span className="block h-0.5 w-full rounded bg-document-ink/20" />
              <span className="block h-0.5 w-4/5 rounded bg-document-ink/12" />
              <span className="block h-0.5 w-full rounded bg-document-ink/12" />
              <span className="block h-0.5 w-2/3 rounded bg-document-ink/12" />
            </span>
          </span>
          <span
            className={cn(
              "font-mono text-[10px] tabular-nums",
              page === current ? "text-accent" : "text-muted",
            )}
          >
            {page}
          </span>
        </button>
      ))}
    </nav>
  );
}
