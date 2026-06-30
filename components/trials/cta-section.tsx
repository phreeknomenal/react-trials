export function CtaSection({ nctId }: { nctId: string }) {
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
