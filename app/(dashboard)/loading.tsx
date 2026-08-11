export default function Loading() {
  return (
    <div className="space-y-6" role="status" aria-label="Memuat halaman">
      {/* Header skeleton */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded-lg bg-zinc-200" />
          <div className="h-4 w-56 animate-pulse rounded bg-zinc-200" />
        </div>
        <div className="hidden gap-3 sm:flex">
          <div className="h-10 w-36 animate-pulse rounded-xl bg-zinc-200" />
          <div className="h-10 w-40 animate-pulse rounded-xl bg-zinc-200" />
        </div>
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-32 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100"
          />
        ))}
      </div>

      {/* Charts skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="h-80 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100 lg:col-span-2" />
        <div className="h-80 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100" />
      </div>

      {/* Table skeleton */}
      <div className="h-72 animate-pulse rounded-2xl border border-zinc-200 bg-zinc-100" />
    </div>
  );
}
