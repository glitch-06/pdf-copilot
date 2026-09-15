import { SkeletonLoader } from "@/components/shared/Skeleton";

export function LoadingState({ message }: { message: string }) {
  return (
    <div className="rise" role="status" aria-live="polite">
      <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.15em] text-accent">
        {message}
        <span className="flex gap-0.5">
          {[0, 150, 300].map((delay) => (
            <span
              key={delay}
              className="size-1 animate-pulse rounded-full bg-accent"
              style={{ animationDelay: `${delay}ms` }}
            />
          ))}
        </span>
      </p>
      <div className="mt-3">
        <SkeletonLoader lines={5} />
      </div>
    </div>
  );
}
