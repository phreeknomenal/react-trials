import Link from "next/link";
import type { Trial } from "@/lib/types/trial";
import { Badge } from "@/components/primitives";
import { StatusBadge } from "@/components/trials/primitives";

export function TrialCard({ trial }: { trial: Trial }) {
  return (
    <Link
      href={`/trials/${trial.nctId}`}
      className="block p-6 border border-zinc-200 dark:border-zinc-800 rounded-lg hover:border-zinc-400 dark:hover:border-zinc-600 hover:shadow-sm transition-all"
    >
      <div className="flex flex-wrap items-center gap-2 mb-2">
        {trial.status && <StatusBadge status={trial.status} />}
        {trial.phase && <Badge label={trial.phase} muted />}
      </div>

      <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-50 leading-snug mb-2">
        {trial.title}
      </h2>

      {trial.summary && (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
          {trial.summary}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-zinc-400 dark:text-zinc-500">
        {trial.sponsor && <span>{trial.sponsor}</span>}
        {trial.conditions.length > 0 && (
          <span>{trial.conditions.slice(0, 2).join(", ")}{trial.conditions.length > 2 ? ` +${trial.conditions.length - 2} more` : ""}</span>
        )}
        {trial.locations.length > 0 && (
          <span>{trial.locations.length} {trial.locations.length === 1 ? "location" : "locations"}</span>
        )}
        <span className="font-mono">{trial.nctId}</span>
      </div>
    </Link>
  );
}
