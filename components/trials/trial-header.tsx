import type { Trial } from "@/lib/types/trial";
import { Badge } from "@/components/trials/primitives";

export function TrialHeader({ trial }: { trial: Trial }) {
  return (
    <header className="px-5 lg:px-44 pt-10 pb-6 border-b border-zinc-200 dark:border-zinc-800">
      <p className="text-sm font-mono text-zinc-500 dark:text-zinc-400 mb-2">{trial.nctId}</p>
      <h1 className="text-2xl lg:text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-4 leading-tight">
        {trial.title}
      </h1>
      <div className="flex flex-wrap gap-2">
        {trial.status && <Badge label={trial.status} />}
        {trial.phase && <Badge label={trial.phase} muted />}
        {trial.sponsor && (
          <span className="text-sm text-zinc-500 dark:text-zinc-400 self-center">
            {trial.sponsor}
          </span>
        )}
      </div>
    </header>
  );
}
