import type { Trial } from "@/lib/types/trial";
import { Section, DetailItem, Disclosure } from "@/components/primitives";

export function EligibilitySection({ trial }: { trial: Trial }) {
  const hasDemographics = trial.minAge || trial.maxAge || trial.sex;
  const hasCriteria = trial.inclusionCriteria || trial.exclusionCriteria;
  if (!hasDemographics && !hasCriteria) return null;

  return (
    <Section id="eligibility" title="Eligibility Criteria">
      {hasDemographics && (
        <dl className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          {trial.minAge && <DetailItem label="Minimum Age" value={trial.minAge} />}
          {trial.maxAge && <DetailItem label="Maximum Age" value={trial.maxAge} />}
          {trial.sex && <DetailItem label="Sex" value={trial.sex} />}
        </dl>
      )}
      {trial.inclusionCriteria && (
        <Disclosure title="Inclusion Criteria" body={trial.inclusionCriteria} />
      )}
      {trial.exclusionCriteria && (
        <div className="mt-4">
          <Disclosure title="Exclusion Criteria" body={trial.exclusionCriteria} />
        </div>
      )}
    </Section>
  );
}
