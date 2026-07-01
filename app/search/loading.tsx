export default function SearchLoading() {
  return (
    <div className="min-h-screen px-5 lg:px-44 py-10 animate-pulse">
      <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-700 rounded mb-2" />
      <div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800 rounded mb-8" />
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg space-y-3">
            <div className="flex gap-2">
              <div className="h-5 w-20 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
              <div className="h-5 w-16 bg-zinc-100 dark:bg-zinc-800 rounded-full" />
            </div>
            <div className="h-5 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded" />
            <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded" />
            <div className="h-4 w-5/6 bg-zinc-100 dark:bg-zinc-800 rounded" />
            <div className="flex gap-4">
              <div className="h-3 w-24 bg-zinc-100 dark:bg-zinc-800 rounded" />
              <div className="h-3 w-20 bg-zinc-100 dark:bg-zinc-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
