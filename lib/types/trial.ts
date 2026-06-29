export interface Intervention {
  type: string | null;
  name: string | null;
  description: string | null;
}

export interface TrialLocation {
  city: string | null;
  state: string | null;
  country: string | null;
  display: string;
}

export interface Outcome {
  measure: string | null;
  description: string | null;
  timeFrame: string | null;
}

export interface Contact {
  name: string | null;
  role: string | null;
  phone: string | null;
  email: string | null;
}

export interface Official {
  name: string | null;
  role: string | null;
  affiliation: string | null;
}

export interface Trial {
  nctId: string;
  title: string;
  status: string | null;
  summary: string | null;
  detailedDescription: string | null;
  conditions: string[];
  phase: string | null;
  startDate: string | null;
  primaryCompletionDate: string | null;
  completionDate: string | null;
  sponsor: string | null;
  minAge: string | null;
  maxAge: string | null;
  sex: string | null;
  inclusionCriteria: string | null;
  exclusionCriteria: string | null;
  enrollmentCount: number | null;
  enrollmentType: string | null;
  interventions: Intervention[];
  locations: string[];
  locationsDetailed: TrialLocation[];
  studyType: string | null;
  designAllocation: string | null;
  designInterventionModel: string | null;
  designMasking: string | null;
  designPrimaryPurpose: string | null;
  primaryOutcomes: Outcome[];
  secondaryOutcomes: Outcome[];
  centralContacts: Contact[];
  overallOfficials: Official[];
  whyStopped: string | null;
}

export interface SearchResponse {
  studies: Trial[];
  nextPageToken: string | null;
}

// Raw API response shapes — typed just enough for safe navigation
export interface RawStudy {
  protocolSection?: Record<string, Record<string, unknown>>;
}

export interface RawSearchResponse {
  studies?: RawStudy[];
  nextPageToken?: string;
}
