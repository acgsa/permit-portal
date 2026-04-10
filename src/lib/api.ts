import { IS_DEMO_MODE } from '@/lib/appMode';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

const DEMO_PROCESS_SOURCE = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL" id="permit_process_definitions">
  <bpmn:process id="PermitApplication" name="Federal Permit Application" isExecutable="true">
    <bpmn:startEvent id="start" name="Applicant Submits" />
    <bpmn:userTask id="intake" name="Intake Review" />
    <bpmn:endEvent id="approved" name="Permit Approved" />
  </bpmn:process>
</bpmn:definitions>`;

function toBase64Url(value: string): string {
  return btoa(value).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function createDemoJwt(username: string, role: string): string {
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'none', typ: 'JWT' };
  const payload = {
    sub: username,
    role,
    exp: now + 60 * 60 * 24 * 30,
    iat: now,
    iss: 'permit-demo',
  };

  return `${toBase64Url(JSON.stringify(header))}.${toBase64Url(JSON.stringify(payload))}.demo`;
}

function roleFromUsername(username: string): string {
  const normalized = username.toLowerCase();
  if (normalized.includes('doug.smith')) return 'admin';
  if (normalized.includes('sarah.chen')) return 'staff';
  if (normalized.includes('admin')) return 'admin';
  if (normalized.includes('staff') || normalized.includes('federal')) return 'staff';
  return 'applicant';
}

function nowIso(): string {
  return new Date().toISOString();
}

type DemoProcessDef = {
  definition_key: string;
  name: string;
  description: string | null;
  latest_version: number;
  deployed_version: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
  versions: ProcessDefinitionVersionResponse[];
  deployments: ProcessDeploymentResponse[];
};

let demoWorkflowSeq = 6;
let demoPreScreenerDraftSeq = 1;

let demoWorkflows: WorkflowStatus[] = [
  {
    id: 1,
    process_name: 'permit_process',
    status: 'running',
    current_task: 'Intake Review',
    started_by: 'applicant-demo@example.com',
    created_at: nowIso(),
    updated_at: nowIso(),
  },
  {
    id: 2,
    process_name: 'permit_process',
    status: 'completed',
    current_task: null,
    started_by: 'applicant-demo@example.com',
    created_at: nowIso(),
    updated_at: nowIso(),
  },
];

type DemoPreScreenerDraft = {
  id: number;
  owner_sub: string;
  status: string;
  title: string;
  payload: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

let demoPreScreenerDrafts: DemoPreScreenerDraft[] = [];

const demoDefinitions: Record<string, DemoProcessDef> = {
  permit_process: {
    definition_key: 'permit_process',
    name: 'Permit Approval Workflow',
    description: 'Federal permit application workflow',
    latest_version: 1,
    deployed_version: 1,
    created_by: 'staff-demo@example.com',
    created_at: nowIso(),
    updated_at: nowIso(),
    versions: [
      {
        version: 1,
        status: 'active',
        checksum: 'demo-checksum-v1',
        process_id: 'PermitApplication',
        process_name: 'Federal Permit Application',
        tasks: [
          { id: 'intake', name: 'Intake Review', node_type: 'userTask' },
          { id: 'agency_review', name: 'Agency Review', node_type: 'userTask' },
        ],
        validation_errors: [],
        changelog: 'Initial seeded version',
        created_by: 'staff-demo@example.com',
        created_at: nowIso(),
        deployed_at: nowIso(),
      },
    ],
    deployments: [
      {
        deployed_version: 1,
        deployment_status: 'active',
        notes: 'Demo deployment',
        deployed_by: 'staff-demo@example.com',
        deployed_at: nowIso(),
      },
    ],
  },
};

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function assertToken(token?: string): void {
  if (!token) {
    throw new Error('Unauthorized');
  }
}

function ensureDemoDefinition(definitionKey: string): DemoProcessDef {
  const detail = demoDefinitions[definitionKey];
  if (!detail) {
    throw new Error('Not found');
  }
  return detail;
}

async function request<T>(
  path: string,
  options: RequestInit & { token?: string } = {},
): Promise<T> {
  const { token, ...init } = options;
  const headers = new Headers(init.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  const url = `${BASE_URL}${path}`;
  let res: Response;
  try {
    res = await fetch(url, { ...init, headers });
  } catch {
    throw new Error(`Network error: unable to reach API at ${BASE_URL}. Check backend server and CORS settings.`);
  }

  if (!res.ok) {
    const detail = await res.text().catch(() => res.statusText);
    throw new Error(detail || `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export function login(username: string, password: string): Promise<TokenResponse> {
  if (IS_DEMO_MODE) {
    const normalizedUser = username.trim() || 'applicant-demo@example.com';
    const role = roleFromUsername(normalizedUser);
    void password;
    return Promise.resolve({
      access_token: createDemoJwt(normalizedUser, role),
      token_type: 'bearer',
    });
  }

  return request<TokenResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
}

// ── Login.gov OIDC ────────────────────────────────────────────────────────────

export function redirectToLoginGov(): void {
  window.location.href = `${BASE_URL}/auth/logingov`;
}

// ── User Profile & Settings ───────────────────────────────────────────────────

export interface UserProfileResponse {
  username: string;
  email: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address_street: string | null;
  address_city: string | null;
  address_state: string | null;
  address_zip: string | null;
  verified_at: string | null;
  entity_type: string | null;
  organization: string | null;
  role: string;
  needs_profile_completion: boolean;
}

export function fetchProfile(token: string): Promise<import('@/contexts/AuthContext').UserProfile> {
  if (IS_DEMO_MODE) {
    return Promise.resolve({
      username: 'applicant-demo@example.com',
      email: 'applicant-demo@example.com',
      firstName: 'Demo',
      lastName: 'Applicant',
      phone: null,
      addressStreet: null,
      addressCity: null,
      addressState: null,
      addressZip: null,
      entityType: 'individual',
      organization: null,
      needsProfileCompletion: false,
    });
  }

  return request<UserProfileResponse>('/auth/profile', { token }).then((r) => ({
    username: r.username,
    email: r.email,
    firstName: r.first_name,
    lastName: r.last_name,
    phone: r.phone,
    addressStreet: r.address_street,
    addressCity: r.address_city,
    addressState: r.address_state,
    addressZip: r.address_zip,
    entityType: r.entity_type,
    organization: r.organization,
    needsProfileCompletion: r.needs_profile_completion,
  }));
}

export function updateSettings(
  token: string,
  settings: { entity_type?: string; organization?: string },
): Promise<UserProfileResponse> {
  if (IS_DEMO_MODE) {
    return Promise.resolve({
      username: 'applicant-demo@example.com',
      email: 'applicant-demo@example.com',
      first_name: 'Demo',
      last_name: 'Applicant',
      phone: null,
      address_street: null,
      address_city: null,
      address_state: null,
      address_zip: null,
      verified_at: null,
      entity_type: settings.entity_type ?? 'individual',
      organization: settings.organization ?? null,
      role: 'applicant',
      needs_profile_completion: false,
    });
  }

  return request<UserProfileResponse>('/auth/settings', {
    method: 'PUT',
    token,
    body: JSON.stringify(settings),
  });
}

// ── Pre-Screener Drafts ─────────────────────────────────────────────────────

export interface PreScreenerDraftUpsert {
  id?: number;
  status: string;
  title?: string;
  payload: Record<string, unknown>;
}

export interface PreScreenerDraftResponse {
  id: number;
  owner_sub: string;
  status: string;
  title: string;
  payload: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

function getDemoTokenOwner(token: string): string {
  const payload = token.split('.')[1];
  if (!payload) return 'demo-user@example.com';
  try {
    const padded = payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), '=');
    const decoded = JSON.parse(atob(padded)) as { sub?: string };
    return decoded.sub ?? 'demo-user@example.com';
  } catch {
    return 'demo-user@example.com';
  }
}

export function upsertPreScreenerDraft(
  token: string,
  body: PreScreenerDraftUpsert,
): Promise<PreScreenerDraftResponse> {
  if (IS_DEMO_MODE) {
    assertToken(token);
    const ownerSub = getDemoTokenOwner(token);
    const now = nowIso();
    const normalizedTitle = (body.title ?? '').trim() || 'Pre-Screener Draft';

    if (typeof body.id === 'number') {
      const existing = demoPreScreenerDrafts.find((draft) => draft.id === body.id && draft.owner_sub === ownerSub);
      if (!existing) {
        return Promise.reject(new Error('Draft not found'));
      }

      existing.status = body.status;
      existing.title = normalizedTitle;
      existing.payload = clone(body.payload);
      existing.updated_at = now;
      return Promise.resolve(clone(existing));
    }

    const created: DemoPreScreenerDraft = {
      id: demoPreScreenerDraftSeq,
      owner_sub: ownerSub,
      status: body.status,
      title: normalizedTitle,
      payload: clone(body.payload),
      created_at: now,
      updated_at: now,
    };
    demoPreScreenerDraftSeq += 1;
    demoPreScreenerDrafts = [created, ...demoPreScreenerDrafts];
    return Promise.resolve(clone(created));
  }

  return request<PreScreenerDraftResponse>('/pre-screener-drafts', {
    method: 'POST',
    token,
    body: JSON.stringify(body),
  });
}

export function listPreScreenerDrafts(token: string): Promise<PreScreenerDraftResponse[]> {
  if (IS_DEMO_MODE) {
    assertToken(token);
    const ownerSub = getDemoTokenOwner(token);
    const drafts = demoPreScreenerDrafts
      .filter((draft) => draft.owner_sub === ownerSub)
      .sort((a, b) => (a.updated_at < b.updated_at ? 1 : -1));
    return Promise.resolve(clone(drafts));
  }

  return request<PreScreenerDraftResponse[]>('/pre-screener-drafts', { token });
}

export function getPreScreenerDraft(
  token: string,
  draftId: number,
): Promise<PreScreenerDraftResponse> {
  if (IS_DEMO_MODE) {
    assertToken(token);
    const ownerSub = getDemoTokenOwner(token);
    const found = demoPreScreenerDrafts.find((draft) => draft.id === draftId && draft.owner_sub === ownerSub);
    if (!found) {
      return Promise.reject(new Error('Draft not found'));
    }
    return Promise.resolve(clone(found));
  }

  return request<PreScreenerDraftResponse>(`/pre-screener-drafts/${draftId}`, { token });
}

// ── Workflows ─────────────────────────────────────────────────────────────────

export interface WorkflowStatus {
  id: number;
  process_name: string;
  status: string;
  current_task: string | null;
  started_by: string;
  created_at: string;
  updated_at: string;
}

export interface WorkflowCreate {
  process_name: string;
  payload?: Record<string, unknown>;
}

export function createWorkflow(
  token: string,
  body: WorkflowCreate,
): Promise<WorkflowStatus> {
  if (IS_DEMO_MODE) {
    assertToken(token);
    const workflow: WorkflowStatus = {
      id: demoWorkflowSeq,
      process_name: body.process_name,
      status: 'running',
      current_task: 'Initial Screening',
      started_by: 'demo-user@example.com',
      created_at: nowIso(),
      updated_at: nowIso(),
    };
    demoWorkflowSeq += 1;
    demoWorkflows = [workflow, ...demoWorkflows];
    return Promise.resolve(clone(workflow));
  }

  return request<WorkflowStatus>('/workflows', {
    method: 'POST',
    token,
    body: JSON.stringify(body),
  });
}

export function listWorkflows(token: string): Promise<WorkflowStatus[]> {
  if (IS_DEMO_MODE) {
    assertToken(token);
    return Promise.resolve(clone(demoWorkflows));
  }

  return request<WorkflowStatus[]>('/workflows', { token });
}

export function getWorkflow(token: string, id: number): Promise<WorkflowStatus> {
  if (IS_DEMO_MODE) {
    assertToken(token);
    const workflow = demoWorkflows.find((item) => item.id === id);
    if (!workflow) {
      return Promise.reject(new Error('Not found'));
    }
    return Promise.resolve(clone(workflow));
  }

  return request<WorkflowStatus>(`/workflows/${id}`, { token });
}

// ── Tasks ─────────────────────────────────────────────────────────────────────

export function completeTask(
  token: string,
  workflowId: number,
  data?: Record<string, unknown>,
): Promise<WorkflowStatus> {
  if (IS_DEMO_MODE) {
    assertToken(token);
    void data;
    const workflow = demoWorkflows.find((item) => item.id === workflowId);
    if (!workflow) {
      return Promise.reject(new Error('Not found'));
    }

    workflow.status = 'completed';
    workflow.current_task = null;
    workflow.updated_at = nowIso();
    return Promise.resolve(clone(workflow));
  }

  return request<WorkflowStatus>(`/tasks/${workflowId}/complete`, {
    method: 'POST',
    token,
    body: JSON.stringify(data ?? {}),
  });
}

// ── BPMN Process Definitions ────────────────────────────────────────────────

export interface ProcessTaskSummary {
  id: string;
  name: string;
  node_type: string;
}

export interface ProcessDefinitionValidateResponse {
  process_id: string;
  process_name: string;
  first_task_id: string;
  checksum: string;
  tasks: ProcessTaskSummary[];
  validation_errors: string[];
}

export interface ProcessDefinitionSummary {
  definition_key: string;
  name: string;
  description: string | null;
  latest_version: number;
  deployed_version: number | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ProcessDefinitionVersionResponse {
  version: number;
  status: string;
  checksum: string;
  process_id: string;
  process_name: string;
  tasks: ProcessTaskSummary[];
  validation_errors: string[];
  changelog: string | null;
  created_by: string;
  created_at: string;
  deployed_at: string | null;
}

export interface ProcessDeploymentResponse {
  deployed_version: number;
  deployment_status: string;
  notes: string | null;
  deployed_by: string;
  deployed_at: string;
}

export interface ProcessDefinitionDetail extends ProcessDefinitionSummary {
  versions: ProcessDefinitionVersionResponse[];
  deployments: ProcessDeploymentResponse[];
}

export interface ProcessDefinitionCreate {
  definition_key: string;
  name?: string;
  description?: string;
  bpmn_xml: string;
  changelog?: string;
}

export interface ProcessDefinitionVersionCreate {
  bpmn_xml: string;
  changelog?: string;
}

export function validateProcessDefinition(
  token: string,
  bpmnXml: string,
): Promise<ProcessDefinitionValidateResponse> {
  if (IS_DEMO_MODE) {
    assertToken(token);
    const hasProcess = /<bpmn:process\b/.test(bpmnXml);
    return Promise.resolve({
      process_id: 'PermitApplication',
      process_name: 'Federal Permit Application',
      first_task_id: 'intake',
      checksum: `demo-${Math.abs(bpmnXml.length)}`,
      tasks: [
        { id: 'intake', name: 'Intake Review', node_type: 'userTask' },
        { id: 'agency_review', name: 'Agency Review', node_type: 'userTask' },
      ],
      validation_errors: hasProcess ? [] : ['Missing <bpmn:process> node'],
    });
  }

  return request<ProcessDefinitionValidateResponse>('/process-definitions/validate', {
    method: 'POST',
    token,
    body: JSON.stringify({ bpmn_xml: bpmnXml }),
  });
}

export function listProcessDefinitions(token: string): Promise<ProcessDefinitionSummary[]> {
  if (IS_DEMO_MODE) {
    assertToken(token);
    return Promise.resolve(
      Object.values(demoDefinitions).map((definition) => ({
        definition_key: definition.definition_key,
        name: definition.name,
        description: definition.description,
        latest_version: definition.latest_version,
        deployed_version: definition.deployed_version,
        created_by: definition.created_by,
        created_at: definition.created_at,
        updated_at: definition.updated_at,
      })),
    );
  }

  return request<ProcessDefinitionSummary[]>('/process-definitions', { token });
}

export function getProcessDefinition(
  token: string,
  definitionKey: string,
): Promise<ProcessDefinitionDetail> {
  if (IS_DEMO_MODE) {
    assertToken(token);
    const detail = ensureDemoDefinition(definitionKey);
    return Promise.resolve(clone(detail));
  }

  return request<ProcessDefinitionDetail>(`/process-definitions/${definitionKey}`, { token });
}

export function createProcessDefinition(
  token: string,
  body: ProcessDefinitionCreate,
): Promise<ProcessDefinitionDetail> {
  if (IS_DEMO_MODE) {
    assertToken(token);
    const createdAt = nowIso();
    const newDetail: DemoProcessDef = {
      definition_key: body.definition_key,
      name: body.name ?? body.definition_key,
      description: body.description ?? null,
      latest_version: 1,
      deployed_version: null,
      created_by: 'staff-demo@example.com',
      created_at: createdAt,
      updated_at: createdAt,
      versions: [
        {
          version: 1,
          status: 'draft',
          checksum: `demo-checksum-${body.definition_key}-v1`,
          process_id: 'PermitApplication',
          process_name: body.name ?? body.definition_key,
          tasks: [
            { id: 'intake', name: 'Intake Review', node_type: 'userTask' },
            { id: 'agency_review', name: 'Agency Review', node_type: 'userTask' },
          ],
          validation_errors: [],
          changelog: body.changelog ?? null,
          created_by: 'staff-demo@example.com',
          created_at: createdAt,
          deployed_at: null,
        },
      ],
      deployments: [],
    };

    demoDefinitions[body.definition_key] = newDetail;
    return Promise.resolve(clone(newDetail));
  }

  return request<ProcessDefinitionDetail>('/process-definitions', {
    method: 'POST',
    token,
    body: JSON.stringify(body),
  });
}

export function createProcessDefinitionVersion(
  token: string,
  definitionKey: string,
  body: ProcessDefinitionVersionCreate,
): Promise<ProcessDefinitionVersionResponse> {
  if (IS_DEMO_MODE) {
    assertToken(token);
    const detail = ensureDemoDefinition(definitionKey);
    const version = detail.latest_version + 1;
    const createdVersion: ProcessDefinitionVersionResponse = {
      version,
      status: 'draft',
      checksum: `demo-checksum-${definitionKey}-v${version}`,
      process_id: 'PermitApplication',
      process_name: detail.name,
      tasks: [
        { id: 'intake', name: 'Intake Review', node_type: 'userTask' },
        { id: 'agency_review', name: 'Agency Review', node_type: 'userTask' },
      ],
      validation_errors: [],
      changelog: body.changelog ?? null,
      created_by: 'staff-demo@example.com',
      created_at: nowIso(),
      deployed_at: null,
    };

    detail.latest_version = version;
    detail.updated_at = nowIso();
    detail.versions.push(createdVersion);
    return Promise.resolve(clone(createdVersion));
  }

  return request<ProcessDefinitionVersionResponse>(
    `/process-definitions/${definitionKey}/versions`,
    {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    },
  );
}

export function getProcessDefinitionVersion(
  token: string,
  definitionKey: string,
  version: number,
): Promise<ProcessDefinitionVersionResponse> {
  if (IS_DEMO_MODE) {
    assertToken(token);
    const detail = ensureDemoDefinition(definitionKey);
    const found = detail.versions.find((item) => item.version === version);
    if (!found) {
      return Promise.reject(new Error('Not found'));
    }
    return Promise.resolve(clone(found));
  }

  return request<ProcessDefinitionVersionResponse>(
    `/process-definitions/${definitionKey}/versions/${version}`,
    { token },
  );
}

export function getProcessDefinitionVersionSource(
  token: string,
  definitionKey: string,
  version: number,
): Promise<{ definition_key: string; version: number; bpmn_xml: string }> {
  if (IS_DEMO_MODE) {
    assertToken(token);
    void version;
    ensureDemoDefinition(definitionKey);
    return Promise.resolve({
      definition_key: definitionKey,
      version,
      bpmn_xml: DEMO_PROCESS_SOURCE,
    });
  }

  return request<{ definition_key: string; version: number; bpmn_xml: string }>(
    `/process-definitions/${definitionKey}/versions/${version}/source`,
    { token },
  );
}

export function deployProcessDefinitionVersion(
  token: string,
  definitionKey: string,
  version: number,
  notes?: string,
): Promise<ProcessDeploymentResponse> {
  if (IS_DEMO_MODE) {
    assertToken(token);
    const detail = ensureDemoDefinition(definitionKey);
    const found = detail.versions.find((item) => item.version === version);
    if (!found) {
      return Promise.reject(new Error('Not found'));
    }

    const deployment: ProcessDeploymentResponse = {
      deployed_version: version,
      deployment_status: 'active',
      notes: notes ?? null,
      deployed_by: 'staff-demo@example.com',
      deployed_at: nowIso(),
    };

    detail.deployed_version = version;
    detail.updated_at = nowIso();
    detail.deployments.push(deployment);
    found.deployed_at = deployment.deployed_at;

    return Promise.resolve(clone(deployment));
  }

  return request<ProcessDeploymentResponse>(`/process-definitions/${definitionKey}/deployments`, {
    method: 'POST',
    token,
    body: JSON.stringify({ version, notes }),
  });
}

// ── PIC v1 API ────────────────────────────────────────────────────────────────
// Typed CRUD client for all 13 PIC NEPA entities via /api/v1/.

import type { SynopsisResult, IntakeSubmissionResponse } from '@/types/synopsis';
export type { SynopsisResult, IntakeSubmissionResponse };

// ── Synopsis & Submission ─────────────────────────────────────────────────────

type IntakeFormPayload = Record<string, unknown>;

const DEMO_SYNOPSIS: SynopsisResult = {
  nepa_level: 'Environmental Assessment',
  nepa_explanation:
    'Your project may affect one or more environmental resources. An Environmental Assessment (EA) will be prepared to determine whether the impacts are significant enough to require a full EIS.',
  required_reviews: [
    {
      name: 'Clean Water Act Section 404 Permit',
      authority: '33 U.S.C. § 1344',
      agency_code: 'USACE',
      agency_name: 'U.S. Army Corps of Engineers',
      description:
        'Permit required for discharge of dredged or fill material into waters of the United States, including wetlands.',
      estimated_days: 120,
      trigger: 'impactsWaterBodies',
    },
    {
      name: 'Endangered Species Act Section 7 Consultation',
      authority: '16 U.S.C. § 1536',
      agency_code: 'USFWS',
      agency_name: 'U.S. Fish and Wildlife Service',
      description:
        'Formal consultation required when a project may affect listed or proposed endangered/threatened species or designated critical habitat.',
      estimated_days: 135,
      trigger: 'impactsSpeciesHabitat',
    },
  ],
  required_forms: [
    {
      form_id: 'SF-299',
      title:
        'Application for Transportation and Utility Systems and Facilities on Federal Lands',
      agency_code: 'DOI-BLM',
    },
  ],
  lead_agency: {
    code: 'DOI-BLM',
    name: 'Bureau of Land Management',
    role: 'lead',
  },
  cooperating_agencies: [
    {
      code: 'USACE',
      name: 'U.S. Army Corps of Engineers',
      role: 'cooperating',
    },
    {
      code: 'USFWS',
      name: 'U.S. Fish and Wildlife Service',
      role: 'consulting',
    },
  ],
  estimated_timeline_days: 180,
  summary: '',
};

function buildDemoSynopsis(payload: IntakeFormPayload): SynopsisResult {
  const categories = (payload.projectCategories ?? []) as string[];
  const description = ((payload.projectDescription ?? '') as string).toLowerCase();
  const location = ((payload.projectLocation ?? '') as string).toLowerCase();

  // Determine lead agency from category
  const categoryAgencyMap: Record<string, { code: string; name: string }> = {
    'energy-utility': { code: 'DOI-BLM', name: 'Bureau of Land Management' },
    'transportation-road': { code: 'DOT-FHWA', name: 'Federal Highway Administration' },
    'communications-telecommunications': { code: 'FCC', name: 'Federal Communications Commission' },
    'water-canal-irrigation': { code: 'USACE', name: 'U.S. Army Corps of Engineers' },
    other: { code: 'DOI-BLM', name: 'Bureau of Land Management' },
  };

  const firstCat = categories[0] ?? 'other';
  const lead = categoryAgencyMap[firstCat] ?? categoryAgencyMap['other'];

  // Derive reviews from description keywords + categories
  type ReviewEntry = { name: string; authority: string; agency_code: string; agency_name: string; description: string; estimated_days: number; trigger: string };
  const reviews: ReviewEntry[] = [];

  const waterKeywords = ['wetland', 'stream', 'river', 'creek', 'marsh', 'flood', 'water', 'lake', 'pond', 'drainage', 'shore'];
  const speciesKeywords = ['habitat', 'species', 'wildlife', 'endangered', 'bird', 'fish', 'nest', 'migration', 'ecological', 'forest'];
  const historicKeywords = ['historic', 'cultural', 'archaeological', 'heritage', 'tribal', 'monument', 'preservation'];
  const airKeywords = ['emission', 'air quality', 'pollution', 'exhaust', 'smoke', 'dust', 'combustion', 'generator', 'power plant'];
  const navKeywords = ['navigable', 'harbor', 'port', 'channel', 'dock', 'pier', 'bridge', 'dam', 'waterway'];

  const matchesAny = (text: string, keywords: string[]) => keywords.some((kw) => text.includes(kw));

  // Category-based triggers
  const isWaterProject = categories.includes('water-canal-irrigation');
  const isTransportation = categories.includes('transportation-road');
  const isEnergy = categories.includes('energy-utility');

  if (matchesAny(description, waterKeywords) || matchesAny(location, waterKeywords) || isWaterProject) {
    reviews.push({ name: 'Clean Water Act Section 404 Permit', authority: '33 U.S.C. § 1344', agency_code: 'USACE', agency_name: 'U.S. Army Corps of Engineers', description: 'Permit required for discharge of dredged or fill material into waters of the United States.', estimated_days: 120, trigger: 'water' });
  }
  if (matchesAny(description, speciesKeywords) || matchesAny(location, speciesKeywords)) {
    reviews.push({ name: 'Endangered Species Act Section 7 Consultation', authority: '16 U.S.C. § 1536', agency_code: 'USFWS', agency_name: 'U.S. Fish and Wildlife Service', description: 'Consultation required when a project may affect listed endangered/threatened species.', estimated_days: 135, trigger: 'species' });
  }
  if (matchesAny(description, historicKeywords) || matchesAny(location, historicKeywords)) {
    reviews.push({ name: 'NHPA Section 106 Review', authority: '54 U.S.C. § 306108', agency_code: 'ACHP', agency_name: 'Advisory Council on Historic Preservation', description: 'Review to assess effects on historic properties.', estimated_days: 90, trigger: 'historic' });
  }
  if (matchesAny(description, airKeywords) || isEnergy) {
    reviews.push({ name: 'Clean Air Act Conformity Determination', authority: '42 U.S.C. § 7506(c)', agency_code: 'EPA', agency_name: 'Environmental Protection Agency', description: 'Determination that the project conforms to the applicable State Implementation Plan.', estimated_days: 60, trigger: 'air' });
  }
  if (matchesAny(description, navKeywords) || matchesAny(location, navKeywords) || isWaterProject) {
    reviews.push({ name: 'Rivers and Harbors Act Section 10 Permit', authority: '33 U.S.C. § 403', agency_code: 'USACE', agency_name: 'U.S. Army Corps of Engineers', description: 'Permit required for work in navigable waters.', estimated_days: 90, trigger: 'navigable' });
  }
  // Transportation projects often need Section 4(f) evaluation
  if (isTransportation) {
    reviews.push({ name: 'Section 4(f) Evaluation', authority: '49 U.S.C. § 303', agency_code: 'DOT-FHWA', agency_name: 'Federal Highway Administration', description: 'Evaluation required when a transportation project may use publicly owned parks, recreation areas, wildlife refuges, or historic sites.', estimated_days: 90, trigger: 'transportation' });
  }

  // If no keywords matched, add a baseline review based on category
  if (reviews.length === 0 && isEnergy) {
    reviews.push({ name: 'National Environmental Policy Act Review', authority: '42 U.S.C. § 4321', agency_code: lead.code, agency_name: lead.name, description: 'General NEPA review for energy and utility projects on federal lands.', estimated_days: 90, trigger: 'nepa-general' });
  }
  if (reviews.length === 0) {
    reviews.push({ name: 'National Environmental Policy Act Review', authority: '42 U.S.C. § 4321', agency_code: lead.code, agency_name: lead.name, description: 'NEPA review to evaluate potential environmental effects.', estimated_days: 60, trigger: 'nepa-general' });
  }

  // Build cooperating agencies
  const seenAgencies = new Set<string>();
  const cooperating = reviews
    .filter((r) => {
      if (r.agency_code === lead.code || seenAgencies.has(r.agency_code)) return false;
      seenAgencies.add(r.agency_code);
      return true;
    })
    .map((r) => ({ code: r.agency_code, name: r.agency_name, role: 'cooperating' as const }));

  // Determine NEPA level from number and severity of reviews
  const nepaLevel =
    reviews.length >= 4
      ? 'Environmental Impact Statement'
      : reviews.length >= 2
        ? 'Environmental Assessment'
        : 'Categorical Exclusion';

  const nepaExplanation =
    nepaLevel === 'Environmental Impact Statement'
      ? 'Your project involves multiple significant environmental considerations. An EIS is likely required for comprehensive review.'
      : nepaLevel === 'Environmental Assessment'
        ? 'Your project may affect environmental resources. An EA will determine whether a full EIS is needed.'
        : 'Based on the information provided, your project may qualify for a Categorical Exclusion, streamlining the review process.';

  const baseDays = nepaLevel === 'Categorical Exclusion' ? 30 : nepaLevel === 'Environmental Assessment' ? 180 : 365;
  const maxReviewDays = Math.max(0, ...reviews.map((r) => r.estimated_days));
  const timeline = Math.max(baseDays, maxReviewDays);

  const categoryLabel = categories.map((c) => {
    const opt = [
      { value: 'energy-utility', label: 'Energy / Utility' },
      { value: 'transportation-road', label: 'Transportation / Road' },
      { value: 'communications-telecommunications', label: 'Communications / Telecommunications' },
      { value: 'water-canal-irrigation', label: 'Water / Canal / Irrigation' },
      { value: 'other', label: 'Other' },
    ].find((o) => o.value === c);
    return opt?.label ?? c;
  }).join(', ') || 'unspecified';

  const summary = `Based on your project (${categoryLabel}), the lead agency is ${lead.name}. The anticipated NEPA level is ${nepaLevel}. ${reviews.length} review(s) identified. Estimated processing: ~${timeline} days.`;

  return {
    nepa_level: nepaLevel,
    nepa_explanation: nepaExplanation,
    required_reviews: reviews,
    required_forms: [{ form_id: 'SF-299', title: 'Application for Transportation and Utility Systems on Federal Lands', agency_code: lead.code }],
    lead_agency: { code: lead.code, name: lead.name, role: 'lead' },
    cooperating_agencies: cooperating,
    estimated_timeline_days: timeline,
    summary,
  };
}

export function evaluateSynopsis(
  data: IntakeFormPayload,
): Promise<SynopsisResult> {
  if (IS_DEMO_MODE) {
    return Promise.resolve(buildDemoSynopsis(data));
  }

  return request<SynopsisResult>('/synopsis/evaluate', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function submitIntakeProject(
  token: string,
  intake: IntakeFormPayload,
  synopsis: SynopsisResult,
): Promise<IntakeSubmissionResponse> {
  if (IS_DEMO_MODE) {
    assertToken(token);
    return Promise.resolve({
      project_id: Math.floor(Math.random() * 9000) + 1000,
      workflow_id: demoWorkflowSeq++,
      lead_agency: synopsis.lead_agency,
      cooperating_agencies: synopsis.cooperating_agencies,
      message: `Project submitted. Routed to ${synopsis.lead_agency.name} for ${synopsis.nepa_level} review.`,
    });
  }

  return request<IntakeSubmissionResponse>('/synopsis/submit', {
    method: 'POST',
    token,
    body: JSON.stringify({ intake, synopsis }),
  });
}

// ── PIC v1 typed CRUD ─────────────────────────────────────────────────────────

import type {
  Project,
  ProcessInstance,
  Document as PICDocument,
  Comment as PICComment,
  CaseEvent,
  Engagement,
  GisData,
  GisDataElement,
  LegalStructure,
  ProcessModel,
  DecisionElement,
  ProcessDecisionPayload,
  UserRole,
} from '@/types/pic';

export type {
  Project,
  ProcessInstance,
  PICDocument,
  PICComment,
  CaseEvent,
  Engagement,
  GisData,
  GisDataElement,
  LegalStructure,
  ProcessModel,
  DecisionElement,
  ProcessDecisionPayload,
  UserRole,
};

export interface PaginationParams {
  skip?: number;
  limit?: number;
}

function qs(params: PaginationParams): string {
  const parts: string[] = [];
  if (params.skip != null) parts.push(`skip=${params.skip}`);
  if (params.limit != null) parts.push(`limit=${params.limit}`);
  return parts.length ? `?${parts.join('&')}` : '';
}

// Generic CRUD factory for a PIC entity
function picCrud<T>(segment: string) {
  return {
    list(token: string, params: PaginationParams = {}): Promise<T[]> {
      return request<T[]>(`/api/v1/${segment}${qs(params)}`, { token });
    },
    get(token: string, id: number): Promise<T> {
      return request<T>(`/api/v1/${segment}/${id}`, { token });
    },
    create(token: string, body: Partial<T>): Promise<T> {
      return request<T>(`/api/v1/${segment}`, {
        method: 'POST',
        token,
        body: JSON.stringify(body),
      });
    },
    update(token: string, id: number, body: Partial<T>): Promise<T> {
      return request<T>(`/api/v1/${segment}/${id}`, {
        method: 'PATCH',
        token,
        body: JSON.stringify(body),
      });
    },
    remove(token: string, id: number): Promise<void> {
      return request<void>(`/api/v1/${segment}/${id}`, {
        method: 'DELETE',
        token,
      });
    },
  };
}

export const picProjects = picCrud<Project>('projects');
export const picProcessInstances = picCrud<ProcessInstance>('process-instances');
export const picDocuments = picCrud<PICDocument>('documents');
export const picComments = picCrud<PICComment>('comments');
export const picCaseEvents = picCrud<CaseEvent>('case-events');
export const picEngagements = picCrud<Engagement>('engagements');
export const picGisData = picCrud<GisData>('gis-data');
export const picGisDataElements = picCrud<GisDataElement>('gis-data-elements');
export const picLegalStructures = picCrud<LegalStructure>('legal-structures');
export const picProcessModels = picCrud<ProcessModel>('process-models');
export const picDecisionElements = picCrud<DecisionElement>('decision-elements');
export const picProcessDecisionPayloads = picCrud<ProcessDecisionPayload>('process-decision-payloads');
export const picUserRoles = picCrud<UserRole>('user-roles');
