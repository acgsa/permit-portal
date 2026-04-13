'use client';

/* ------------------------------------------------------------------ */
/*  ApiEndpointList – API endpoint reference component              */
/* ------------------------------------------------------------------ */

import { useState } from 'react';

/* ── Endpoint data ──────────────────────────────────────────────── */

type Param = { name: string; description: string; required?: boolean };
type Endpoint = {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'WS';
  path: string;
  title: string;
  description: string;
  params?: Param[];
  curl: string;
  response?: string;
  note?: string;
};
type Section = { id: string; title: string; description: string; endpoints: Endpoint[] };

const API_SECTIONS: Section[] = [
  /* ─── 1. Authentication ──────────────────────────────────────── */
  {
    id: 'auth',
    title: 'Auth',
    description:
      'PERMIT.GOV supports two authentication modes: a JWT demo mode for local development and login.gov OIDC for production. All authenticated endpoints expect an Authorization: Bearer <token> header.',
    endpoints: [
      {
        method: 'POST',
        path: '/auth/login',
        title: 'JWT login (demo mode)',
        description:
          'Authenticate with username and password. Available when AUTH_MODE=jwt. Auto-provisions a user on first login — staff.demo@agency.gov receives the staff role; others default to applicant.',
        curl: `curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"username":"alex@example.gov","password":"any"}' \\
  "{BASE_URL}/auth/login"`,
        response: `{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}`,
        note: 'Demo mode only. In production (AUTH_MODE=oidc) this endpoint returns 400.',
      },
      {
        method: 'GET',
        path: '/auth/logingov',
        title: 'Login.gov redirect',
        description:
          'Initiates the OIDC authorization code flow by redirecting the browser to login.gov. Available when AUTH_MODE=oidc.',
        curl: `# Browser redirect — not typically called via curl
curl -v "{BASE_URL}/auth/logingov"
# → 307 redirect to https://idp.int.identitysandbox.gov/openid_connect/authorize?...`,
        note: 'The redirect includes a generated state and nonce stored server-side for CSRF protection.',
      },
      {
        method: 'GET',
        path: '/auth/callback',
        title: 'Login.gov callback',
        description:
          'Handles the OAuth2 callback from login.gov, exchanges the authorization code for an ID token using private_key_jwt, upserts the user, and returns a local JWT.',
        params: [
          { name: 'code', description: 'Authorization code from login.gov.', required: true },
          { name: 'state', description: 'State parameter for CSRF validation.', required: true },
        ],
        curl: `curl "{BASE_URL}/auth/callback?code=abc123&state=xyz789"`,
        response: `{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer"
}`,
      },
      {
        method: 'GET',
        path: '/auth/profile',
        title: 'Get user profile',
        description:
          'Returns the authenticated user\'s profile, including login.gov identity claims and app settings.',
        curl: `curl \\
  -H "Authorization: Bearer $TOKEN" \\
  "{BASE_URL}/auth/profile"`,
        response: `{
  "username": "alex@example.gov",
  "email": "alex@example.gov",
  "first_name": "Alex",
  "last_name": "Johnson",
  "role": "applicant",
  "entity_type": "private",
  "organization": "River Corp",
  "needs_profile_completion": false
}`,
      },
      {
        method: 'PUT',
        path: '/auth/settings',
        title: 'Update user settings',
        description:
          'Update app-managed profile fields (entity_type, organization). Login.gov identity fields are read-only.',
        curl: `curl -X PUT \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"entity_type":"private","organization":"River Corp"}' \\
  "{BASE_URL}/auth/settings"`,
      },
    ],
  },

  /* ─── 2. Pre-Screening ──────────────────────────────────────── */
  {
    id: 'pre-screening',
    title: 'Project Routing',
    description:
      'The pre-screening flow lets applicants describe a project and receive an instant NEPA-level assessment, required reviews, lead/cooperating agencies, and estimated timelines — no account required for the evaluation endpoint.',
    endpoints: [
      {
        method: 'POST',
        path: '/synopsis/evaluate',
        title: 'Evaluate project synopsis',
        description:
          'Submit project details and receive a NEPA-level determination, required reviews and forms, agency assignments, and an estimated timeline. No authentication required.',
        curl: `curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{
    "projectCategories": ["water-resources"],
    "projectDescription": "Riverbank stabilization along 2.3 miles...",
    "projectLocation": "Montana",
    "locationNotes": "Adjacent to Clark Fork River",
    "impactsWaterBodies": {"answer":"yes","details":"bank stabilization"},
    "impactsSpeciesHabitat": {"answer":"no","details":""},
    "impactsHistoricCultural": {"answer":"no","details":""},
    "impactsAirEnvironmental": {"answer":"no","details":""},
    "impactsWaterways": {"answer":"yes","details":"navigable waterway"}
  }' \\
  "{BASE_URL}/synopsis/evaluate"`,
        response: `{
  "nepa_level": "Environmental Assessment",
  "nepa_explanation": "The project involves impacts to...",
  "required_reviews": [
    {
      "name": "Clean Water Act Section 404 Permit",
      "authority": "33 U.S.C. § 1344",
      "agency_code": "USACE",
      "agency_name": "U.S. Army Corps of Engineers",
      "estimated_days": 120,
      "trigger": "water"
    }
  ],
  "lead_agency": {
    "code": "USACE",
    "name": "U.S. Army Corps of Engineers",
    "role": "lead"
  },
  "cooperating_agencies": [...],
  "estimated_timeline_days": 365,
  "summary": "Based on the project description..."
}`,
        note: 'This endpoint is unauthenticated to encourage exploration before commitment.',
      },
      {
        method: 'POST',
        path: '/synopsis/submit',
        title: 'Submit project intake',
        description:
          'Submit the confirmed synopsis and intake data. Creates a PIC Project record, starts a routing workflow, assigns agencies, and logs case events for an audit trail.',
        curl: `curl -X POST \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "intake": { ...synopsisRequest },
    "synopsis": { ...synopsisResult }
  }' \\
  "{BASE_URL}/synopsis/submit"`,
        response: `{
  "project_id": 42,
  "workflow_id": 7,
  "lead_agency": {"code":"USACE","name":"U.S. Army Corps of Engineers","role":"lead"},
  "cooperating_agencies": [...],
  "message": "Project submitted and routed successfully"
}`,
        note: 'Requires authentication. Internally creates PIC Project and ProcessInstance records, CaseEvents, and seeds routing rules.',
      },
      {
        method: 'POST',
        path: '/pre-screener-drafts',
        title: 'Save or update a pre-screener draft',
        description:
          'Upsert a draft of the pre-screening form. Pass id: null to create a new draft, or include an existing ID to update.',
        curl: `curl -X POST \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"id":null,"title":"Riverbank project","status":"draft","payload":{...}}' \\
  "{BASE_URL}/pre-screener-drafts"`,
        response: `{
  "id": 12,
  "owner_sub": "alex@example.gov",
  "status": "draft",
  "title": "Riverbank project",
  "payload": {...},
  "created_at": "2025-03-15T14:22:00Z",
  "updated_at": "2025-03-15T14:22:00Z"
}`,
      },
      {
        method: 'GET',
        path: '/pre-screener-drafts',
        title: 'List pre-screener drafts',
        description:
          'Retrieve all drafts belonging to the current user, ordered by most recently updated.',
        curl: `curl \\
  -H "Authorization: Bearer $TOKEN" \\
  "{BASE_URL}/pre-screener-drafts"`,
      },
      {
        method: 'GET',
        path: '/pre-screener-drafts/{draft_id}',
        title: 'Get a specific draft',
        description:
          'Fetch a single pre-screener draft by ID. Returns 404 if not found or not owned by the current user.',
        curl: `curl \\
  -H "Authorization: Bearer $TOKEN" \\
  "{BASE_URL}/pre-screener-drafts/12"`,
      },
    ],
  },

  /* ─── 3. PIC Data Standard v1 ───────────────────────────────── */
  {
    id: 'pic-v1',
    title: 'PIC Data Standards (v1 CRUD)',
    description:
      'The Permitting Information Center (PIC) NEPA data standard defines 13 entities. Each entity exposes five standard CRUD operations at /api/v1/{entity}. The examples below use Projects — the same pattern applies to all entities listed after.',
    endpoints: [
      {
        method: 'GET',
        path: '/api/v1/projects',
        title: 'List projects',
        description:
          'Paginated list of PIC Project records. Supports skip and limit query parameters.',
        params: [
          { name: 'skip', description: 'Number of records to skip (default 0).', required: false },
          { name: 'limit', description: 'Max records to return (default 100, max 1000).', required: false },
        ],
        curl: `curl "{BASE_URL}/api/v1/projects?skip=0&limit=25"`,
        response: `[
  {
    "id": 42,
    "title": "Riverbank stabilization",
    "description": "Bank stabilization along Clark Fork River...",
    "sector": "water-resources",
    "lead_agency": "USACE",
    "location_text": "Montana",
    "current_status": "screening"
  }
]`,
      },
      {
        method: 'GET',
        path: '/api/v1/projects/{item_id}',
        title: 'Get project by ID',
        description: 'Retrieve a single PIC Project record. Returns 404 if not found.',
        curl: `curl "{BASE_URL}/api/v1/projects/42"`,
      },
      {
        method: 'POST',
        path: '/api/v1/projects',
        title: 'Create a project',
        description: 'Create a new PIC Project record.',
        curl: `curl -X POST \\
  -H "Content-Type: application/json" \\
  -d '{"title":"New solar farm","sector":"electricity-transmission-lines","lead_agency":"DOE"}' \\
  "{BASE_URL}/api/v1/projects"`,
      },
      {
        method: 'PATCH',
        path: '/api/v1/projects/{item_id}',
        title: 'Update a project',
        description: 'Partially update a PIC Project record. All fields are optional.',
        curl: `curl -X PATCH \\
  -H "Content-Type: application/json" \\
  -d '{"current_status":"in-review"}' \\
  "{BASE_URL}/api/v1/projects/42"`,
      },
      {
        method: 'DELETE',
        path: '/api/v1/projects/{item_id}',
        title: 'Delete a project',
        description: 'Remove a PIC Project record. Returns 204 No Content on success.',
        curl: `curl -X DELETE "{BASE_URL}/api/v1/projects/42"`,
        note: 'The same five-operation pattern (GET list, GET by ID, POST, PATCH, DELETE) is available for all 13 PIC entities: projects, process-instances, documents, comments, case-events, engagements, gis-data, gis-data-elements, legal-structures, process-models, decision-elements, process-decision-payloads, and user-roles.',
      },
    ],
  },

  /* ─── 4. Process Definitions ────────────────────────────────── */
  {
    id: 'process-definitions',
    title: 'Process Definitions',
    description:
      'Staff and admin users manage BPMN process definitions — validating XML, creating versioned definitions, and deploying them for use by the workflow engine. All endpoints require the admin or staff role.',
    endpoints: [
      {
        method: 'POST',
        path: '/process-definitions/validate',
        title: 'Validate BPMN definition',
        description:
          'Parse and validate a BPMN XML document. Returns the extracted process metadata, task catalog, and any validation errors.',
        curl: `curl -X POST \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"bpmn_xml":"<?xml version=\\"1.0\\"?>..."}' \\
  "{BASE_URL}/process-definitions/validate"`,
        response: `{
  "process_id": "intake-review",
  "process_name": "Intake Review Process",
  "first_task_id": "task_completeness",
  "checksum": "a3f8...",
  "tasks": [
    {"id": "task_completeness", "name": "Completeness Review", "node_type": "userTask"}
  ],
  "validation_errors": []
}`,
      },
      {
        method: 'GET',
        path: '/process-definitions',
        title: 'List process definitions',
        description:
          'Returns all process definitions with their latest and deployed version numbers.',
        curl: `curl \\
  -H "Authorization: Bearer $TOKEN" \\
  "{BASE_URL}/process-definitions"`,
      },
      {
        method: 'POST',
        path: '/process-definitions',
        title: 'Create process definition',
        description:
          'Register a new process definition with an initial BPMN version. Returns 409 if the definition_key already exists.',
        curl: `curl -X POST \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"definition_key":"intake-review","name":"Intake Review","bpmn_xml":"...","changelog":"Initial version"}' \\
  "{BASE_URL}/process-definitions"`,
      },
      {
        method: 'GET',
        path: '/process-definitions/{definition_key}',
        title: 'Get process definition detail',
        description:
          'Retrieve a process definition including its version history and deployment records.',
        curl: `curl \\
  -H "Authorization: Bearer $TOKEN" \\
  "{BASE_URL}/process-definitions/intake-review"`,
      },
      {
        method: 'POST',
        path: '/process-definitions/{definition_key}/versions',
        title: 'Create a new version',
        description:
          'Upload new BPMN XML as a new auto-incremented version of an existing definition.',
        curl: `curl -X POST \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"bpmn_xml":"...","changelog":"Added parallel gateway"}' \\
  "{BASE_URL}/process-definitions/intake-review/versions"`,
      },
      {
        method: 'GET',
        path: '/process-definitions/{definition_key}/versions/{version}/source',
        title: 'Get BPMN source XML',
        description: 'Download the raw BPMN XML for a specific version of a definition.',
        curl: `curl \\
  -H "Authorization: Bearer $TOKEN" \\
  "{BASE_URL}/process-definitions/intake-review/versions/2/source"`,
        response: `{
  "definition_key": "intake-review",
  "version": 2,
  "bpmn_xml": "<?xml version=\\"1.0\\"?>..."
}`,
      },
      {
        method: 'POST',
        path: '/process-definitions/{definition_key}/deployments',
        title: 'Deploy a version',
        description:
          'Mark a specific version as the active deployment. New workflows will use this version.',
        curl: `curl -X POST \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"version":2,"notes":"Promoted after QA"}' \\
  "{BASE_URL}/process-definitions/intake-review/deployments"`,
        response: `{
  "deployed_version": 2,
  "deployment_status": "active",
  "deployed_by": "admin@agency.gov",
  "deployed_at": "2025-03-20T09:00:00Z"
}`,
      },
    ],
  },

  /* ─── 5. Workflows & Tasks ──────────────────────────────────── */
  {
    id: 'workflows',
    title: 'Workflows & Tasks',
    description:
      'Workflows instantiate a deployed process definition and advance through its BPMN tasks. Applicants see only their own workflows; staff and admin can view all.',
    endpoints: [
      {
        method: 'POST',
        path: '/workflows',
        title: 'Create a workflow',
        description:
          'Start a new workflow instance from a deployed process definition. The initial payload is stored with the workflow and advanced through the first task.',
        curl: `curl -X POST \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"process_name":"intake-review","payload":{"project_id":42}}' \\
  "{BASE_URL}/workflows"`,
        response: `{
  "id": 7,
  "process_name": "intake-review",
  "status": "active",
  "current_task": "task_completeness",
  "started_by": "alex@example.gov",
  "created_at": "2025-03-20T10:00:00Z"
}`,
      },
      {
        method: 'GET',
        path: '/workflows',
        title: 'List workflows',
        description:
          'Retrieve all workflow instances. Applicants see only their own; staff/admin see all. Ordered by newest first.',
        curl: `curl \\
  -H "Authorization: Bearer $TOKEN" \\
  "{BASE_URL}/workflows"`,
      },
      {
        method: 'GET',
        path: '/workflows/{workflow_id}',
        title: 'Get workflow status',
        description:
          'Retrieve a single workflow by ID. Returns 403 if the user is not the owner and lacks the admin/staff role.',
        curl: `curl \\
  -H "Authorization: Bearer $TOKEN" \\
  "{BASE_URL}/workflows/7"`,
      },
      {
        method: 'POST',
        path: '/tasks/{workflow_id}/complete',
        title: 'Complete current task',
        description:
          'Advance the workflow to the next BPMN task. The request body is merged into the workflow payload. Only the owner, admin, or staff can complete tasks.',
        curl: `curl -X POST \\
  -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"decision":"approved","reviewer_notes":"All documents received"}' \\
  "{BASE_URL}/tasks/7/complete"`,
        response: `{
  "workflow_id": 7,
  "status": "active",
  "current_task": "task_agency_review"
}`,
      },
    ],
  },

  /* ─── 6. Inter-Agency API ───────────────────────────────────── */
  {
    id: 'interagency',
    title: 'Inter-Agency API',
    description:
      'Machine-to-machine endpoints for cooperating and consulting agencies. Authenticated with a per-agency API key passed in the X-API-Key header. Keys are issued by admins and hashed (SHA-256) before storage.',
    endpoints: [
      {
        method: 'GET',
        path: '/api/interagency/projects/{project_id}',
        title: 'Get project referral',
        description:
          'Retrieve full project details and associated process instances for an incoming referral.',
        curl: `curl \\
  -H "X-API-Key: $AGENCY_KEY" \\
  "{BASE_URL}/api/interagency/projects/42"`,
        response: `{
  "project_id": 42,
  "title": "Riverbank stabilization",
  "description": "...",
  "sector": "water-resources",
  "lead_agency": "USACE",
  "process_instances": [
    {"id": 1, "type": "Section 404 Review", "status": "underway", "lead_agency": "USACE"}
  ]
}`,
      },
      {
        method: 'PATCH',
        path: '/api/interagency/projects/{project_id}/status',
        title: 'Update review status',
        description:
          'Update the status of a process instance and optionally record an outcome. Creates a CaseEvent audit record.',
        curl: `curl -X PATCH \\
  -H "X-API-Key: $AGENCY_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"process_instance_id":1,"status":"completed","outcome":"approved","notes":"No further review needed"}' \\
  "{BASE_URL}/api/interagency/projects/42/status"`,
        response: `{
  "message": "Status updated",
  "process_instance_id": 1,
  "status": "completed"
}`,
      },
      {
        method: 'POST',
        path: '/api/interagency/projects/{project_id}/documents',
        title: 'Submit document',
        description:
          'Attach a document or decision record to a process instance on a cooperating project.',
        curl: `curl -X POST \\
  -H "X-API-Key: $AGENCY_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"process_instance_id":1,"document_type":"finding","title":"No Significant Impact","url":"https://...","prepared_by":"USACE","public_access":true}' \\
  "{BASE_URL}/api/interagency/projects/42/documents"`,
        response: `{
  "message": "Document submitted",
  "document_id": 15
}`,
      },
      {
        method: 'POST',
        path: '/api/interagency/webhooks',
        title: 'Register webhook',
        description:
          'Register a callback URL to receive status change notifications for projects routed to your agency.',
        curl: `curl -X POST \\
  -H "X-API-Key: $AGENCY_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"webhook_url":"https://agency.gov/hooks/permit","events":["status_change"]}' \\
  "{BASE_URL}/api/interagency/webhooks"`,
        response: `{
  "message": "Webhook registered",
  "agency_code": "USACE",
  "webhook_url": "https://agency.gov/hooks/permit"
}`,
      },
    ],
  },

  /* ─── 7. System ─────────────────────────────────────────────── */
  {
    id: 'system',
    title: 'System',
    description:
      'Health checks and real-time notification delivery.',
    endpoints: [
      {
        method: 'GET',
        path: '/health',
        title: 'Health check',
        description:
          'Returns server status and the active authentication mode. No authentication required.',
        curl: `curl "{BASE_URL}/health"`,
        response: `{
  "status": "ok",
  "auth_mode": "jwt"
}`,
      },
      {
        method: 'WS',
        path: '/ws/notifications',
        title: 'Real-time notifications',
        description:
          'WebSocket endpoint for live notifications. Connect with a JWT token as a query parameter. The server sends JSON messages when workflow state changes or new tasks are assigned.',
        params: [
          { name: 'token', description: 'JWT access token for authentication.', required: true },
        ],
        curl: `# Using websocat:
websocat "ws://{BASE_URL}/ws/notifications?token=$TOKEN"`,
        note: 'Unauthorized connections are closed with code 4401.',
      },
    ],
  },
];

/** Sections shaped for AnchorNav */
export const API_NAV_SECTIONS = API_SECTIONS.map((s) => ({ slug: s.id, title: s.title }));

/** Exported for external left-nav use */
export { API_SECTIONS };

/* ── Method badge ────────────────────────────────────────────────── */

function MethodBadge({ method }: { method: Endpoint['method'] }) {
  const config: Record<string, { bg: string; dark?: boolean }> = {
    GET: { bg: 'var(--color-success)', dark: true },
    POST: { bg: 'var(--color-warning)', dark: true },
    PUT: { bg: 'var(--color-info)', dark: true },
    PATCH: { bg: 'var(--color-info)', dark: true },
    DELETE: { bg: 'var(--color-error)' },
    WS: { bg: '#7b1fa2' },
  };
  const { bg, dark } = config[method] ?? { bg: '#555' };
  return (
    <span
      className="type-body-xs font-semibold uppercase tracking-wider shrink-0 rounded"
      style={{ background: bg, color: dark ? '#000' : '#fff', padding: 'var(--space-3xs) var(--space-xs)' }}
    >
      {method}
    </span>
  );
}

/* ── Collapsible code block ──────────────────────────────────────── */

function CodeBlock({ label, code }: { label: string; code: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="type-body-xs text-[var(--color-text-link)] hover:text-[var(--color-text-link-hover)] transition-colors cursor-pointer"
      >
        {open ? '▾' : '▸'} {label}
      </button>
      {open && (
        <pre className="mt-[var(--space-xs)] overflow-x-auto rounded-[var(--radius-md)] p-[var(--space-sm)] type-body-xs leading-relaxed" style={{ background: 'var(--color-bg)', color: 'var(--color-text-body)' }}>
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}

/* ── Single endpoint card ────────────────────────────────────────── */

function EndpointCard({ endpoint }: { endpoint: Endpoint }) {
  return (
    <div
      className="rounded-[var(--radius-md)] border border-[var(--color-border)] shadow-[var(--shadow-sm)]"
      style={{ background: 'var(--color-bg-subtle)', padding: 'var(--space-lg)' }}
    >
      {/* Header row: method badge + path */}
      <div className="flex items-center gap-[var(--space-sm)] flex-wrap" style={{ marginBottom: 'var(--space-sm)' }}>
        <MethodBadge method={endpoint.method} />
        <code className="type-body-sm font-semibold text-[var(--color-text)]">{endpoint.path}</code>
      </div>

      {/* Title + description */}
      <h4 className="type-heading-h6 text-[var(--color-text)]" style={{ marginBottom: 'var(--space-2xs)' }}>
        {endpoint.title}
      </h4>
      <p className="type-body-sm text-[var(--color-text-body)]" style={{ marginBottom: 'var(--space-sm)' }}>
        {endpoint.description}
      </p>

      {/* Parameters */}
      {endpoint.params && endpoint.params.length > 0 && (
        <div style={{ marginBottom: 'var(--space-sm)' }}>
          <p className="type-body-xs uppercase tracking-[0.12em] text-[var(--color-text-disabled)]" style={{ marginBottom: 'var(--space-2xs)' }}>
            Query Parameters
          </p>
          <div className="space-y-[var(--space-2xs)]">
            {endpoint.params.map((p) => (
              <div key={p.name} className="flex flex-col sm:flex-row sm:items-baseline gap-x-[var(--space-sm)]">
                <code className="type-body-xs text-[var(--color-text)] shrink-0">{p.name}</code>
                {p.required && <span className="type-body-xs font-semibold text-[var(--color-error,#d32f2f)]">REQUIRED</span>}
                <span className="type-body-xs text-[var(--color-text-disabled)]">{p.description}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Collapsible code blocks */}
      <div className="flex flex-col gap-[var(--space-xs)]">
        <CodeBlock label="Request example" code={endpoint.curl} />
        {endpoint.response && <CodeBlock label="Sample response" code={endpoint.response} />}
      </div>

      {/* Note */}
      {endpoint.note && (
        <p className="type-body-xs text-[var(--color-text-disabled)] mt-[var(--space-sm)]" style={{ borderLeft: '2px solid var(--color-border)', paddingLeft: 'var(--space-sm)' }}>
          {endpoint.note}
        </p>
      )}
    </div>
  );
}

/* ── Main exported component ─────────────────────────────────────── */

export function ApiEndpointList() {
  return (
    <div className="max-w-[900px]">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3xl)' }}>
        {API_SECTIONS.map((section) => (
          <section key={section.id} id={section.id} className="scroll-mt-28">
            <h2 className="type-heading-h4 text-[var(--color-text)]" style={{ marginBottom: 'var(--space-sm)' }}>
              {section.title}
            </h2>
            <p className="type-body text-[var(--color-text-body)]" style={{ marginBottom: 'var(--space-xl)' }}>
              {section.description}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
              {section.endpoints.map((ep) => (
                <EndpointCard key={`${ep.method}-${ep.path}-${ep.title}`} endpoint={ep} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
