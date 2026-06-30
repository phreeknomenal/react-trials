import type { Intervention } from "@/lib/types/trial";
import { Section, Card, Badge } from "@/components/primitives";

export function InterventionsSection({ interventions }: { interventions: Intervention[] }) {
  return (
    <Section id="interventions" title="Treatments">
      <div className="space-y-4">
        {interventions.map((intervention, i) => (
          <Card key={intervention.name ?? i}>
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
          </Card>
        ))}
      </div>
    </Section>
  );
}
