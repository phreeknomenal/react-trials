import { MapPin } from "lucide-react";
import type { TrialLocation } from "@/lib/types/trial";
import { Section, borderedCard } from "@/components/primitives";

export function LocationsSection({
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
              key={`${loc}-${i}`}
              className={`flex items-start gap-2 p-3 ${borderedCard}`}
            >
              <MapPin className="h-4 w-4 shrink-0 mt-0.5 text-zinc-400 dark:text-zinc-500" />
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
