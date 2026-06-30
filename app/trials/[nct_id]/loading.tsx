export default function TrialDetailLoading() {
  return (
    <div className="min-h-screen px-5 lg:px-44 py-10 animate-pulse">
      <div className="h-6 w-32 bg-zinc-200 dark:bg-zinc-700 rounded mb-6" />
      <div className="h-10 w-3/4 bg-zinc-200 dark:bg-zinc-700 rounded mb-4" />
      <div className="flex gap-3 mb-10">
        <div className="h-6 w-24 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
        <div className="h-6 w-20 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} className="mb-8 p-8 border border-zinc-200 dark:border-zinc-700 rounded-lg space-y-4">
          <div className="h-6 w-40 bg-zinc-200 dark:bg-zinc-700 rounded" />
          <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-5/6 bg-zinc-100 dark:bg-zinc-800 rounded" />
          <div className="h-4 w-4/6 bg-zinc-100 dark:bg-zinc-800 rounded" />
        </div>
      ))}
    </div>
  );
}
