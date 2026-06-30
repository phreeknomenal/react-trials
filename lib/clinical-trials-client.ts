// Server-only module — do not import from client components.
import { cache } from "react";
import type {
  Trial,
  SearchResponse,
  Intervention,
  TrialLocation,
  Outcome,
  Contact,
  Official,
  RawStudy,
  RawSearchResponse,
} from "./types/trial";

const BASE_URL = "https://clinicaltrials.gov/api/v2";

export interface SearchParams {
  condition?: string;
  location?: string;
  pageToken?: string;
  pageSize?: number;
}

export async function searchTrials(params: SearchParams): Promise<SearchResponse> {
  const { condition, location, pageToken, pageSize = 10 } = params;

  if (!condition && !location) {
    return { studies: [], nextPageToken: null };
  }

  const query = new URLSearchParams({ format: "json", pageSize: String(pageSize) });
  if (condition) query.set("query.cond", condition);
  if (location) query.set("query.locn", location);
  if (pageToken) query.set("pageToken", pageToken);

  const res = await fetch(`${BASE_URL}/studies?${query}`, { cache: "no-store" });

  if (!res.ok) {
    return { studies: [], nextPageToken: null };
  }

  const data: RawSearchResponse = await res.json();
  const rawStudies = data.studies ?? [];

  return {
    studies: rawStudies.map(formatStudy),
    nextPageToken: data.nextPageToken ?? null,
  };
}

export const getTrialDetail = cache(async function getTrialDetail(nctId: string): Promise<Trial | null> {
  if (!nctId) return null;

  const res = await fetch(`${BASE_URL}/studies/${nctId}?format=json`, {
    cache: "no-store",
  });

  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`ClinicalTrials.gov returned ${res.status}`);

  const data: RawStudy | RawSearchResponse = await res.json();

  // Single-study endpoint returns protocolSection directly;
  // occasionally wraps in a studies array — handle both.
  if ("protocolSection" in data && data.protocolSection) {
    return formatStudy(data as RawStudy);
  }

  const wrapped = data as RawSearchResponse;
  const first = wrapped.studies?.[0];
  return first ? formatStudy(first) : null;
});

function dig<T>(obj: Record<string, unknown>, ...keys: string[]): T | null {
  let cur: unknown = obj;
  for (const key of keys) {
    if (cur == null || typeof cur !== "object") return null;
    cur = (cur as Record<string, unknown>)[key];
  }
  return (cur as T) ?? null;
}

function formatStudy(study: RawStudy): Trial {
  const protocol = (study.protocolSection ?? {}) as Record<string, Record<string, unknown>>;

  const id = (protocol.identificationModule ?? {}) as Record<string, unknown>;
  const status = (protocol.statusModule ?? {}) as Record<string, unknown>;
  const description = (protocol.descriptionModule ?? {}) as Record<string, unknown>;
  const conditions = (protocol.conditionsModule ?? {}) as Record<string, unknown>;
  const contacts = (protocol.contactsLocationsModule ?? {}) as Record<string, unknown>;
  const sponsors = (protocol.sponsorCollaboratorsModule ?? {}) as Record<string, unknown>;
  const eligibility = (protocol.eligibilityModule ?? {}) as Record<string, unknown>;
  const design = (protocol.designModule ?? {}) as Record<string, unknown>;
  const armsInterventions = (protocol.armsInterventionsModule ?? {}) as Record<string, unknown>;
  const outcomes = (protocol.outcomesModule ?? {}) as Record<string, unknown>;

  const rawEligibility = eligibility.eligibilityCriteria as string | null;
  const [inclusionCriteria, exclusionCriteria] = parseEligibilityCriteria(rawEligibility);

  return {
    nctId: (id.nctId as string) ?? "",
    title: (id.briefTitle as string) ?? (id.officialTitle as string) ?? "",
    status: (status.overallStatus as string) ?? null,
    summary: (description.briefSummary as string) ?? null,
    detailedDescription: (description.detailedDescription as string) ?? null,
    conditions: (conditions.conditions as string[]) ?? [],
    phase: (dig<string[]>(design, "phases") ?? []).join(", ") || null,
    startDate: dig<string>(status, "startDateStruct", "date"),
    primaryCompletionDate: dig<string>(status, "primaryCompletionDateStruct", "date"),
    completionDate:
      dig<string>(status, "completionDateStruct", "date") ??
      dig<string>(status, "primaryCompletionDateStruct", "date"),
    sponsor: dig<string>(sponsors, "leadSponsor", "name"),
    minAge: (eligibility.minimumAge as string) ?? null,
    maxAge: (eligibility.maximumAge as string) ?? null,
    sex: (eligibility.sex as string) ?? null,
    inclusionCriteria,
    exclusionCriteria,
    enrollmentCount: dig<number>(design, "enrollmentInfo", "count"),
    enrollmentType: dig<string>(design, "enrollmentInfo", "type"),
    interventions: extractInterventions(armsInterventions),
    locations: extractLocations(contacts),
    locationsDetailed: extractLocationsDetailed(contacts),
    studyType: (design.studyType as string) ?? null,
    designAllocation: dig<string>(design, "designInfo", "allocation"),
    designInterventionModel: dig<string>(design, "designInfo", "interventionModel"),
    designMasking: dig<string>(design, "designInfo", "maskingInfo", "masking"),
    designPrimaryPurpose: dig<string>(design, "designInfo", "primaryPurpose"),
    primaryOutcomes: extractOutcomes(outcomes.primaryOutcomes),
    secondaryOutcomes: extractOutcomes(outcomes.secondaryOutcomes),
    centralContacts: extractContacts(contacts.centralContacts),
    overallOfficials: extractOfficials(contacts.overallOfficials),
    whyStopped: (status.whyStopped as string) ?? null,
  };
}

function parseEligibilityCriteria(raw: string | null): [string | null, string | null] {
  if (!raw) return [null, null];

  const text = raw.trim();
  const exclusionMatch = text.match(/\bexclusion\s+criteria\s*:/i);
  if (!exclusionMatch?.index) return [text, null];

  const inclusion = text
    .slice(0, exclusionMatch.index)
    .replace(/^\s*inclusion\s+criteria\s*:\s*/i, "")
    .trim();
  const exclusion = text.slice(exclusionMatch.index + exclusionMatch[0].length).trim();

  return [inclusion || text, exclusion || null];
}

function extractLocationsDetailed(contacts: Record<string, unknown>): TrialLocation[] {
  const locations = (contacts.locations as Record<string, unknown>[]) ?? [];
  return locations.map((loc) => {
    const city = (loc.city as string) ?? null;
    const state = (loc.state as string) ?? null;
    const country = (loc.country as string) ?? null;
    const display = [city, state, country].filter(Boolean).join(", ");
    return { city, state, country, display };
  });
}

function extractLocations(contacts: Record<string, unknown>): string[] {
  return extractLocationsDetailed(contacts).map((l) => l.display);
}

function extractInterventions(armsInterventions: Record<string, unknown>): Intervention[] {
  const interventions = (armsInterventions.interventions as Record<string, unknown>[]) ?? [];
  return interventions.map((i) => ({
    type: (i.type as string) ?? null,
    name: (i.name as string) ?? null,
    description: (i.description as string) ?? null,
  }));
}

function extractOutcomes(raw: unknown): Outcome[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((o: Record<string, unknown>) => ({
    measure: (o.measure as string) ?? null,
    description: (o.description as string) ?? null,
    timeFrame: (o.timeFrame as string) ?? null,
  }));
}

function extractContacts(raw: unknown): Contact[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((c: Record<string, unknown>) => ({
    name: (c.name as string) ?? null,
    role: (c.role as string) ?? null,
    phone: (c.phone as string) ?? null,
    email: (c.email as string) ?? null,
  }));
}

function extractOfficials(raw: unknown): Official[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((o: Record<string, unknown>) => ({
    name: (o.name as string) ?? null,
    role: (o.role as string) ?? null,
    affiliation: (o.affiliation as string) ?? null,
  }));
}
