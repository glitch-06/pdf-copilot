import { Upload } from "lucide-react";

export function UploadArea() {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-line bg-surface/40 px-4 py-6 text-[12.5px] text-muted transition-colors outline-none hover:border-accent/40 hover:text-ink focus-visible:ring-2 focus-visible:ring-accent/40"
    >
      <Upload className="size-3.5" />
      Drop a PDF here, or click to upload
    </button>
  );
}
