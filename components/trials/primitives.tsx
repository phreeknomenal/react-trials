export const statusColors: Record<string, string> = {
  "Recruiting":              "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-200",
  "Active, not recruiting":  "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200",
  "Enrolling by invitation": "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/40 dark:text-indigo-200",
  "Not yet recruiting":      "bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200",
  "Completed":               "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
  "Suspended":               "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-200",
  "Terminated":              "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
  "Withdrawn":               "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-200",
};

const fallbackStatusColor = "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300";

export function StatusBadge({ status }: { status: string }) {
  const colors = statusColors[status] ?? fallbackStatusColor;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors}`}>
      {status}
    </span>
  );
}
