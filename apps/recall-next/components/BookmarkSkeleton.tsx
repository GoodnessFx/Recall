export function BookmarkSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden bg-[#0F0F1A] border border-white/5">
      {/* Shimmer thumbnail */}
      <div className="relative w-full aspect-[16/9] bg-white/4 overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/6 to-transparent" />
      </div>
      {/* Shimmer content */}
      <div className="p-4 flex flex-col gap-2">
        <div className="h-3 w-16 rounded-full bg-white/6 overflow-hidden relative">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/8 to-transparent" />
        </div>
        <div className="h-4 w-4/5 rounded-lg bg-white/4 overflow-hidden relative">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/6 to-transparent" />
        </div>
        <div className="h-3 w-3/5 rounded-lg bg-white/3" />
      </div>
    </div>
  )
}
