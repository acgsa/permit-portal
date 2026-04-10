/** Mirrors backend schemas/synopsis.py */

export interface AgencyAssignment {
  code: string;
  name: string;
  role: string; // "lead" | "cooperating" | "consulting"
  region?: string | null;
  office?: string | null;
}

export interface ReviewRequirement {
  name: string;
  authority: string;
  agency_code: string;
  agency_name: string;
  description: string;
  estimated_days?: number | null;
  trigger: string;
}

export interface FormRequirement {
  form_id: string;
  title: string;
  agency_code: string;
}

export interface SynopsisResult {
  nepa_level: string;
  nepa_explanation: string;
  required_reviews: ReviewRequirement[];
  required_forms: FormRequirement[];
  lead_agency: AgencyAssignment;
  cooperating_agencies: AgencyAssignment[];
  estimated_timeline_days?: number | null;
  summary: string;
}

export interface IntakeSubmissionResponse {
  project_id: number;
  workflow_id: number;
  lead_agency: AgencyAssignment;
  cooperating_agencies: AgencyAssignment[];
  message: string;
}
