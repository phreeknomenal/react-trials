import type { Trial } from "@/lib/types/trial";
import { Section } from "@/components/trials/primitives";

export function Overview({ trial }: { trial: Trial }) {
  if (!trial.summary && !trial.detailedDescription) return null;
  return (
    <Section id="overview" title="Study Overview">
      {trial.summary && (
        <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
          {trial.summary}
        </p>
      )}
      {trial.detailedDescription && (
        <details className="mt-4 group">
          <summary className="flex items-center justify-between cursor-pointer text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 list-none">
            Detailed description
            <span aria-hidden="true" className="ml-2 transition-transform group-open:rotate-180">▼</span>
          </summary>
          <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
            {trial.detailedDescription}
          </p>
        </details>
      )}
    </Section>
  );
}
