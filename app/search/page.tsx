import Link from "next/link";
import { searchTrials } from "@/lib/clinical-trials-client";
import { TrialCard } from "@/components/search/trial-card";

interface Props {
  searchParams: Promise<{
    condition?: string;
    location?: string;
    pageToken?: string;
  }>;
}

export async function generateMetadata({ searchParams }: Props) {
  const { condition, location } = await searchParams;
  const query = [condition, location].filter(Boolean).join(" near ");
  return {
    title: query ? `"${query}" — Trials Search` : "Search Clinical Trials — Trials",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { condition, location, pageToken } = await searchParams;

  const hasQuery = Boolean(condition || location);

  let results = { studies: [] as Awaited<ReturnType<typeof searchTrials>>["studies"], nextPageToken: null as string | null };

  if (hasQuery) {
    try {
      results = await searchTrials({ condition, location, pageToken });
    } catch {
      throw new Error("Search temporarily unavailable. Please try again.");
    }
  }

  const nextPageUrl = results.nextPageToken
    ? buildSearchUrl({ condition, location, pageToken: results.nextPageToken })
    : null;

  return (
    <main className="min-h-screen bg-white dark:bg-zinc-950 px-5 lg:px-44 py-10">
      {!hasQuery ? (
        <EmptyPrompt />
      ) : results.studies.length === 0 ? (
        <NoResults condition={condition} location={location} />
      ) : (
        <>
          <ResultsHeader
            count={results.studies.length}
            condition={condition}
            location={location}
            pageToken={pageToken}
          />
          <div className="space-y-4 mt-6">
            {results.studies.map((trial) => (
              <TrialCard key={trial.nctId} trial={trial} />
            ))}
          </div>
          <Pagination nextPageUrl={nextPageUrl} />
        </>
      )}
    </main>
  );
}

function ResultsHeader({
  count,
  condition,
  location,
  pageToken,
}: {
  count: number;
  condition?: string;
  location?: string;
  pageToken?: string;
}) {
  const query = [condition, location].filter(Boolean).join(" near ");
  return (
    <div>
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
        Results for &ldquo;{query}&rdquo;
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
        {pageToken ? "Showing next page of results" : `Showing ${count} results`}
      </p>
    </div>
  );
}

function Pagination({ nextPageUrl }: { nextPageUrl: string | null }) {
  if (!nextPageUrl) return null;
  return (
    <div className="mt-10 flex justify-center">
      <Link
        href={nextPageUrl}
        className="px-6 py-2 text-sm font-medium rounded-md border border-zinc-300 dark:border-zinc-600 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
      >
        Next page →
      </Link>
    </div>
  );
}

function EmptyPrompt() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
        Find a clinical trial
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 max-w-sm">
        Search by condition or location using the URL: <br />
        <code className="text-sm bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
          /search?condition=diabetes
        </code>
      </p>
    </div>
  );
}

function NoResults({ condition, location }: { condition?: string; location?: string }) {
  const query = [condition, location].filter(Boolean).join(" near ");
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
        No results found
      </h1>
      <p className="text-zinc-500 dark:text-zinc-400 mb-6">
        No trials matched &ldquo;{query}&rdquo;. Try different search terms.
      </p>
      <Link
        href="/search"
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        Clear search
      </Link>
    </div>
  );
}

function buildSearchUrl({
  condition,
  location,
  pageToken,
}: {
  condition?: string;
  location?: string;
  pageToken?: string;
}) {
  const params = new URLSearchParams();
  if (condition) params.set("condition", condition);
  if (location) params.set("location", location);
  if (pageToken) params.set("pageToken", pageToken);
  return `/search?${params.toString()}`;
}
