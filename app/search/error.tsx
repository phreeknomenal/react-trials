"use client";

import { useEffect } from "react";

interface Props {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function SearchError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">
          Search unavailable
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6">
          ClinicalTrials.gov may be temporarily unavailable. Please try again in a moment.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
