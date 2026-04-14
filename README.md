## PERMIT.GOV
A federal permitting portal built for the Council on Environmental Quality (CEQ). The portal application streamlines NEPA (National Environmental Policy Act) review by guiding applicants through project intake, automating agency routing, and giving federal staff workflow-driven task management — all backed by the PIC v1.2 data standard.



## Pages Preview

**Live demo:** https://acgsa.github.io/permit-portal/



## Tech Stack

**Frontend** — permit-portal/
Framework: Next.js 16 (App Router) with React 19
Language: TypeScript 5
Styling: Tailwind CSS 4 + CSS custom properties (design tokens)
Theming: next-themes (dark / light); dark theme default
Design system: USDS — custom component library (see below)
State: React Context (auth) + React Query (server data)
Workflow visualization: bpmn-js + bpmn-js-spiffworkflow (BPMN modeler); @xyflow/react 12 (React Flow canvas for the staff workflow designer)
Dynamic forms: RJSF (@rjsf/core + @rjsf/validator-ajv8) — JSON Schema–driven form builder for workflow node configuration
Icons: Lucide React, with USDS icon set as primary
Fonts: Geist Sans (geist), Space Mono (@fontsource/space-mono)
Animation: Framer Motion (respects prefers-reduced-motion)

**USDS Design System** — usds/
A standalone React component library built with Vite and distributed as ESM/CJS with TypeScript declarations.

30+ components: Button, Card, Badge, Table, Modal, Alert, Tabs, DonutChart, BarChart, Toggle, SidebarNavigationPanel, and more.
Design tokens: defined in base.tokens.json (typography, color palettes, spacing, radii, borders) with responsive variants.
Consumed by permit-portal as a local file dependency ("usds": "file:./vendor/usds") and via @import "usds/styles" in CSS.
Backend — permit-portal/backend/
Framework: FastAPI (0.115+) with Uvicorn
Language: Python 3.9+
ORM: SQLAlchemy 2 (async-compatible)
Database: PostgreSQL 16 (production) / SQLite (local dev)
Migrations: Alembic
Auth: JWT (python-jose) · Login.gov OIDC (Authlib)
Workflow engine: SpiffWorkflow 3.1 (BPMN execution)
Validation: Pydantic 2 + pydantic-settings
Schema compliance: PIC JSON Schema validation middleware
Rate limiting: slowapi
Pagination/Filtering: fastapi-pagination, fastapi-filter

**Infrastructure**
Docker Compose — three services: db (Postgres 16 Alpine), api (FastAPI), frontend (Next.js)
npm workspaces — monorepo root manages permit-portal and usds packages

## Data Architecture

**PIC v1.2 Standard
**The backend implements the Permitting Information Center (PIC) v1.2 data schema — a federal standard for tracking environmental review processes across agencies. The schema is maintained in permit-portal/backend/pic-standards/.

**Core PIC Entities** (13 tables)
Project — Top-level project with location, sector, lead agency, and participating agencies
ProcessInstance — An individual review process (e.g., NEPA EA, Section 404 review) linked to a project
Document — EIS, EA, NOI, or other NEPA documents tied to a process
Comment — Public comments on documents
CaseEvent — Milestones and events in a review process (e.g., "Application Submitted")
Engagement — Public meetings and hearings
GisData / GisDataElement — Geospatial data and layers associated with any entity
LegalStructure — Laws, regulations, and executive orders governing a process
ProcessModel — BPMN-based process definitions with optional DMN decision models
DecisionElement — Individual screening or evaluation criteria within a process model
ProcessDecisionPayload — Evaluation results for a specific decision element against a project
UserRole — Access control roles and permission policies
All PIC models carry provenance columns: record_owner_agency, data_source_agency, data_source_system, data_record_version, last_updated, retrieved_timestamp.

**Application-Specific Tables**
users — User accounts with Login.gov UUID, profile fields, and role (applicant, staff, admin)
workflow_runs — Active BPMN workflow instances with current task state
pre_screener_drafts — Saved pre-screener questionnaire drafts per user
process_definitions / process_definition_versions / process_deployments — BPMN process authoring with versioning and deployment lifecycle
agency_routing_rules — Rules mapping project categories and impacts to reviewing agencies
agency_api_keys — API key authentication for inter-agency endpoints

**Database Migrations**
Managed by Alembic with four migration revisions:

001 — PIC v1.2 schema (executes schema-v1.2.0.sql)
002 — Custom application tables (users, workflows, drafts, process definitions)
003 — Agency routing rules and API keys
004 — Login.gov profile fields on users

**Data Seeding**
PIC seed data: Loaded from pic-standards/src/database/seed-v1.2.0.sql when SEED_PIC_DATA=true and the project table is empty.
Routing rules: 10 hard-coded rules seeded on first synopsis evaluation, mapping project categories (energy, transportation, telecom, etc.) and environmental impacts to federal agencies (DOI-BLM, USACE, DOT-FHWA, FCC, EPA, USFWS, ACHP).
Default BPMN process: permit_process.bpmn seeded into process definitions on startup.

 

## API

**Legacy Routers** 
POST /auth/login · GET /auth/logingov · GET /auth/callback — JWT login and Login.gov OIDC flow
/pre-screener-drafts — CRUD for user pre-screener drafts
/process-definitions — BPMN validation, definition CRUD, versioning, and deployment (staff/admin)
/workflows — Create and query BPMN workflow instances
/tasks/{workflow_id}/complete — Advance a workflow to its next task
POST /synopsis/evaluate — Evaluate a project intake → NEPA synopsis (unauthenticated)
POST /synopsis/submit — Submit intake → create PIC Project + workflow (authenticated)

**PIC v1 API** — /api/v1/
Factory-generated CRUD routers for all 13 PIC entities. Each entity exposes:

GET /api/v1/{entity}/ — list (paginated)
GET /api/v1/{entity}/{id} — detail
POST /api/v1/{entity}/ — create
PATCH /api/v1/{entity}/{id} — partial update
DELETE /api/v1/{entity}/{id} — delete

**Inter-Agency API** — /api/interagency/
External-facing endpoints for cooperating agencies, authenticated via API key (not JWT):

GET /projects/{project_id} — Fetch project data
PATCH /projects/{project_id}/status — Update review status
POST /documents/{process_id} — Attach a document
POST /webhooks — Receive webhook events

**PIC Compliance Middleware**
When PIC_SCHEMA_VALIDATE_RESPONSES=true, a middleware layer validates all /api/v1/ responses against the PIC JSON Schema.

 

## UI Architecture

**Page Structure**

**Public pages** — wrapped in Navigation + Footer:

/ — Landing page with hero video, cycling headline, and calls to action
/about — Mission statement and modernization benefits
/login — Applicant login (demo credentials or Login.gov)
/staff — Staff login with demo personas (admin and staff roles)
/screener — Pre-intake questionnaire with draft detection
/project-intake — Multi-step project intake form → NEPA synopsis evaluation

**Portal pages** — wrapped in WorkspaceShell (sidebar nav, role-based):

/dashboard — Role-based dashboard (applicant overview, staff task assignment, admin controls)
/home — Applicant home with project summaries, next tasks, status badges
/my-projects — Project list with sector, lead agency, completion progress
/my-tasks — Task table with in-progress / overdue / complete states
/applications/[id] — Application detail: project info, NEPA process, documents, timeline
/projects/[id] — Project detail view
/messages — Messaging interface

**Staff/Admin pages:**

/staff/workflow-manager — React Flow workflow designer + RJSF form editor
/staff/admin-controls — Admin panel
/staff/staff-manager — Regional manager view for staff assignments
Reference pages: /permit-types, /project-types, /regulations, /resources, /help-desk, /partnerships, /api

**Key Components**
WorkspaceShell — Portal layout shell with role-based sidebar navigation
PortalPageScaffold — Standard portal page header (title, subtitle, eyebrow, actions)
OnboardingPageScaffold — Lighter scaffold for intake/screener flows
BPMNModeler — BPMN workflow editor (bpmn-js) for staff process authoring
WorkflowManager — React Flow–based workflow designer (/staff/workflow-manager): interactive node graph with custom styled nodes (submission, router, staffReview, finance, moreInfo, approval), mini-map, controls, and an RJSF form panel for editing each node's JSON Schema and UI Schema in real time
ApplicationDetailClient — Application/project detail with PIC-typed data display
ThemeRouteScope — Switches theme automatically based on route (public → light, portal → dark)
AnimatedCard / AnimatedTableRow — Framer Motion wrappers with reduced-motion support

**Design Tokens**
Defined from USDS in base.tokens.json and mapped to CSS variables in globals.css:

Colors: --steel-50 through --steel-950; semantic tokens for backgrounds, borders, text, and buttons
Typography: Geist Sans (h1–h6, body xs–lg); Space Mono for monospace
Spacing: --space-3xs (2px) through --space-3xl (48px)
Radii: none / sm (4px) / md (8px) / lg (16px) / pill (36px)
Borders: none / sm (1px) / md (2px) / lg (4px)

**Runtime Modes**
Live mode — Next.js frontend + Python backend API
Demo mode (NEXT_PUBLIC_APP_MODE=demo) — Static export with mock JWT auth and mock data; no backend required

