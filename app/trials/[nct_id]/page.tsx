import { notFound } from "next/navigation";
import { getTrialDetail } from "@/lib/clinical-trials-client";
import type { Trial, Contact, Official, Intervention, TrialLocation, Outcome } from "@/lib/types/trial";

interface Props {
  params: {
    nct_id: string;
  };
}

export async function generateMetadata({ params }: Props) {
  const { nct_id } = params;
  const trial = await getTrialDetail(nct_id);
  return {
    title: trial ? `${trial.title} — Trials` : "Trial Not Found — Trials",
  };
}

export default async function TrialDetailPage({ params }: Props) {
  const { nct_id } = params;
  const trial = await getTrialDetail(nct_id);

  if (!trial) notFound();

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950">
      <TrialHeader trial={trial} />
      <div className="px-5 lg:px-44 py-10 space-y-8">
        <Overview trial={trial} />
        <KeyDetails trial={trial} />
        <EligibilitySection trial={trial} />
        {trial.interventions.length > 0 && <InterventionsSection interventions={trial.interventions} />}
        <LocationsSection locations={trial.locationsDetailed} fallback={trial.locations} />
        {(trial.centralContacts.length > 0 || trial.overallOfficials.length > 0) && (
          <ContactsSection contacts={trial.centralContacts} officials={trial.overallOfficials} />
        )}
        <CtaSection nctId={trial.nctId} />
      </div>
    </main>
  );
}

function TrialHeader({ trial }: { trial: Trial }) {
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

function Overview({ trial }: { trial: Trial }) {
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

function KeyDetails({ trial }: { trial: Trial }) {
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

function EligibilitySection({ trial }: { trial: Trial }) {
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

function InterventionsSection({ interventions }: { interventions: Intervention[] }) {
  return (
    <Section id="interventions" title="Treatments">
      <div className="space-y-4">
        {interventions.map((intervention, i) => (
          <div key={intervention.name ?? i} className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-2">
              {intervention.type && <Badge label={intervention.type} muted />}
              {intervention.name && (
                <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {intervention.name}
                </h3>
              )}
            </div>
            {intervention.description && (
              <p className="text-sm text-zinc-600 dark:text-zinc-400">{intervention.description}</p>
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}

function LocationsSection({
  locations,
  fallback,
}: {
  locations: TrialLocation[];
  fallback: string[];
}) {
  const displayLocations = locations.length > 0 ? locations.map((l) => l.display) : fallback;

  return (
    <Section id="locations" title="Trial Locations">
      {displayLocations.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {displayLocations.map((loc, i) => (
            <div
              key={loc || i}
              className="flex items-start gap-2 p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg"
            >
              <span className="text-zinc-400 dark:text-zinc-500 mt-0.5">📍</span>
              <span className="text-sm text-zinc-800 dark:text-zinc-200">{loc}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-2">
          No location information available.
        </p>
      )}
    </Section>
  );
}

function ContactsSection({
  contacts,
  officials,
}: {
  contacts: Contact[];
  officials: Official[];
}) {
  return (
    <Section id="contact-information" title="Contact Information">
      {contacts.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            Study Contacts
          </h3>
          <div className="space-y-3">
            {contacts.map((c, i) => (
              <ContactCard key={c.email ?? c.name ?? i} name={c.name} role={c.role} phone={c.phone} email={c.email} />
            ))}
          </div>
        </div>
      )}
      {officials.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-3">
            Principal Investigators
          </h3>
          <div className="space-y-3">
            {officials.map((o, i) => (
              <ContactCard key={o.name ?? i} name={o.name} role={o.role} affiliation={o.affiliation} />
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

function CtaSection({ nctId }: { nctId: string }) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-1">
        Interested in this trial?
      </h3>
      <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
        Visit ClinicalTrials.gov for contact information and to learn more about participating.
      </p>
      <a
        href={`https://clinicaltrials.gov/study/${nctId}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
      >
        View on ClinicalTrials.gov ↗
      </a>
    </div>
  );
}

// ── Shared primitives ──────────────────────────────────────────────────────────

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-lg">
      <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">{title}</h2>
      {children}
    </section>
  );
}

function Badge({ label, muted = false }: { label: string; muted?: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
        muted
          ? "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300"
          : "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200"
      }`}
    >
      {label}
    </span>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-zinc-900 dark:text-zinc-100">{value}</dd>
    </div>
  );
}

function Disclosure({ title, body }: { title: string; body: string }) {
  return (
    <details className="border border-zinc-200 dark:border-zinc-700 rounded-lg group">
      <summary className="flex items-center justify-between px-4 py-3 cursor-pointer text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-900 rounded-lg list-none">
        {title}
        <span aria-hidden="true" className="ml-2 transition-transform group-open:rotate-180">▼</span>
      </summary>
      <div className="px-4 pb-4 pt-2 text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-line">
        {body}
      </div>
    </details>
  );
}

function ContactCard({
  name,
  role,
  phone,
  email,
  affiliation,
}: {
  name: string | null;
  role: string | null;
  phone?: string | null;
  email?: string | null;
  affiliation?: string | null;
}) {
  return (
    <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-4">
      {name && <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{name}</p>}
      {role && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{role}</p>}
      {affiliation && (
        <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">{affiliation}</p>
      )}
      {(phone || email) && (
        <div className="mt-2 space-y-0.5">
          {phone && <p className="text-xs text-zinc-600 dark:text-zinc-400">📞 {phone}</p>}
          {email && <p className="text-xs text-zinc-600 dark:text-zinc-400">✉️ {email}</p>}
        </div>
      )}
    </div>
  );
}
