import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn("animate-pulse rounded bg-ink/8", className)} />;
}

export function SkeletonLoader({ lines = 4 }: { lines?: number }) {
  return (
    <div className="space-y-2.5" aria-hidden>
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton key={index} className={index % 3 === 2 ? "h-3 w-2/3" : "h-3 w-full"} />
      ))}
    </div>
  );
}
