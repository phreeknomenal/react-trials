import type { Trial } from "@/lib/types/trial";
import { Section, Badge, DetailItem } from "@/components/primitives";

export function KeyDetails({ trial }: { trial: Trial }) {
  const details: { label: string; value: string | number | null | undefined }[] = [
    { label: "Study Type", value: trial.studyType },
    { label: "Phase", value: trial.phase },
    { label: "Status", value: trial.status },
    { label: "Enrollment", value: trial.enrollmentCount ? (trial.enrollmentType ? `${trial.enrollmentCount} (${trial.enrollmentType})` : trial.enrollmentCount) : null },
    { label: "Start Date", value: trial.startDate },
    { label: "Primary Completion", value: trial.primaryCompletionDate },
    { label: "Completion Date", value: trial.completionDate },
    { label: "Allocation", value: trial.designAllocation },
    { label: "Intervention Model", value: trial.designInterventionModel },
    { label: "Masking", value: trial.designMasking },
    { label: "Primary Purpose", value: trial.designPrimaryPurpose },
  ].filter((d) => d.value != null && d.value !== "");

  if (details.length === 0) return null;

  return (
    <Section id="key-details" title="Key Details">
      <dl className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
        {details.map(({ label, value }) => (
          <div key={label}>
            <dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
              {label}
            </dt>
            <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">{String(value)}</dd>
          </div>
        ))}
      </dl>
      {trial.conditions.length > 0 && (
        <div className="mt-6">
          <dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide mb-2">
            Conditions
          </dt>
          <div className="flex flex-wrap gap-2">
            {trial.conditions.map((c) => (
              <Badge key={c} label={c} muted />
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}
