import { notFound } from "next/navigation";
import { getTrialDetail } from "@/lib/clinical-trials-client";
import { TrialHeader } from "@/components/trials/trial-header";
import { Overview } from "@/components/trials/overview";
import { KeyDetails } from "@/components/trials/key-details";
import { EligibilitySection } from "@/components/trials/eligibility-section";
import { InterventionsSection } from "@/components/trials/interventions-section";
import { LocationsSection } from "@/components/trials/locations-section";
import { ContactsSection } from "@/components/trials/contacts-section";
import { CtaSection } from "@/components/trials/cta-section";

interface Props {
  params: Promise<{ nct_id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { nct_id } = await params;
  const trial = await getTrialDetail(nct_id);
  return {
    title: trial ? `${trial.title} — Trials` : "Trial Not Found — Trials",
  };
}

export default async function TrialDetailPage({ params }: Props) {
  const { nct_id } = await params;

  let trial;
  try {
    trial = await getTrialDetail(nct_id);
  } catch {
    throw new Error("Unable to load trial details. The service may be temporarily unavailable.");
  }

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
