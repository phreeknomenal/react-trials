import { SearchForm } from "@/components/search/search-form";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-5 bg-white dark:bg-zinc-950">
      <div className="w-full max-w-2xl flex flex-col items-center text-center gap-8">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
            Find a clinical trial
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Search ClinicalTrials.gov by condition or location to find studies that are recruiting.
          </p>
        </div>
        <SearchForm />
      </div>
    </main>
  );
}
