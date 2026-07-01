export function SearchForm() {
  return (
    <form
      action="/search"
      method="GET"
      className="w-full max-w-2xl flex flex-col sm:flex-row gap-3"
    >
      <input
        type="text"
        name="condition"
        placeholder="Condition (e.g. diabetes)"
        className="flex-1 px-4 py-3 text-sm rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        name="location"
        placeholder="Location (e.g. Boston)"
        className="flex-1 px-4 py-3 text-sm rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="px-6 py-3 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
      >
        Search
      </button>
    </form>
  );
}
