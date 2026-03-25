'use client';

import { useEffect, useMemo, useState, type ComponentType } from 'react';
import {
  Background,
  Controls,
  MarkerType,
  MiniMap,
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type NodeProps,
} from '@xyflow/react';
import Form from '@rjsf/core';
import validator from '@rjsf/validator-ajv8';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { PortalPageScaffold } from '@/components/PortalPageScaffold';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Button, Card } from 'usds';

type WorkflowNodeType = 'submission' | 'router' | 'staffReview' | 'finance' | 'moreInfo' | 'approval';

type WorkflowNodeData = {
  label: string;
  role: string;
  description: string;
  nodeType: WorkflowNodeType;
};

type WorkflowNode = Node<WorkflowNodeData, 'workflowNode'>;

type RjsfSchema = {
  title?: string;
  type?: string;
  properties?: Record<string, { type?: string; title?: string }>;
  required?: string[];
};

type RjsfUiSchema = Record<string, unknown>;

function nodeStyleByType(nodeType: WorkflowNodeType): { border: string; background: string } {
  switch (nodeType) {
    case 'submission':
      return { border: '1px solid var(--blue-500)', background: 'var(--blue-950)' };
    case 'router':
      return { border: '1px solid var(--steel-500)', background: 'var(--steel-900)' };
    case 'staffReview':
      return { border: '1px solid #f5c32c', background: 'rgba(245, 195, 44, 0.12)' };
    case 'finance':
      return { border: '1px solid #8dd969', background: 'rgba(141, 217, 105, 0.12)' };
    case 'moreInfo':
      return { border: '1px solid var(--red-500)', background: 'rgba(242, 61, 89, 0.12)' };
    case 'approval':
      return { border: '1px solid #8dd969', background: 'rgba(141, 217, 105, 0.18)' };
    default:
      return { border: '1px solid var(--color-border-strong)', background: 'var(--color-bg-subtle)' };
  }
}

function WorkflowNodeCard({ data, selected }: NodeProps<WorkflowNode>) {
  const style = nodeStyleByType(data.nodeType);

  return (
    <div
      style={{
        minWidth: 220,
        maxWidth: 260,
        borderRadius: 'var(--radius-md)',
        border: selected ? '2px solid var(--color-border-focus)' : style.border,
        background: style.background,
        padding: 'var(--space-sm)',
        boxShadow: 'var(--shadow-sm)',
      }}
    >
      <p className="text-xs uppercase tracking-wide text-[var(--color-text-placeholder)]">{data.role}</p>
      <h3 className="mt-1 text-sm font-semibold text-[var(--color-text)]">{data.label}</h3>
      <p className="mt-2 text-xs text-[var(--color-text-body)]">{data.description}</p>
    </div>
  );
}

const nodeTypes = {
  workflowNode: WorkflowNodeCard,
};

const initialNodes: WorkflowNode[] = [
  {
    id: 'submission',
    type: 'workflowNode',
    position: { x: 60, y: 120 },
    data: {
      label: 'Submission',
      role: 'Applicant',
      description: 'Applicant submits SF-299 and initiates permit workflow.',
      nodeType: 'submission',
    },
  },
  {
    id: 'auto-router',
    type: 'workflowNode',
    position: { x: 340, y: 120 },
    data: {
      label: 'Auto-Router',
      role: 'System',
      description: 'Rules engine routes application based on region, permit type, and risk.',
      nodeType: 'router',
    },
  },
  {
    id: 'staff-review',
    type: 'workflowNode',
    position: { x: 620, y: 40 },
    data: {
      label: 'Staff Review',
      role: 'Regional Manager',
      description: 'Assigned reviewer completes checklist and requests revisions if needed.',
      nodeType: 'staffReview',
    },
  },
  {
    id: 'finance',
    type: 'workflowNode',
    position: { x: 620, y: 220 },
    data: {
      label: 'Finance / Pay.gov',
      role: 'Finance Node',
      description: 'Triggers Pay.gov transaction and waits for webhook confirmation.',
      nodeType: 'finance',
    },
  },
  {
    id: 'more-info',
    type: 'workflowNode',
    position: { x: 900, y: 40 },
    data: {
      label: 'More Info Loop',
      role: 'Applicant + Staff',
      description: 'Re-opens applicant portal for supplemental documentation.',
      nodeType: 'moreInfo',
    },
  },
  {
    id: 'final-approval',
    type: 'workflowNode',
    position: { x: 900, y: 220 },
    data: {
      label: 'Final Approval',
      role: 'Super Admin',
      description: 'Issues decision, updates status, and publishes public outcome.',
      nodeType: 'approval',
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e-sub-router', source: 'submission', target: 'auto-router', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-router-review', source: 'auto-router', target: 'staff-review', label: 'Review lane', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-router-finance', source: 'auto-router', target: 'finance', label: 'Payment lane', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-review-more', source: 'staff-review', target: 'more-info', label: 'Need more info', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-more-review', source: 'more-info', target: 'staff-review', label: 'Resubmitted', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-finance-approval', source: 'finance', target: 'final-approval', markerEnd: { type: MarkerType.ArrowClosed } },
  { id: 'e-review-approval', source: 'staff-review', target: 'final-approval', markerEnd: { type: MarkerType.ArrowClosed } },
];

const starterSchema: RjsfSchema = {
  title: 'Regional Review Checklist',
  type: 'object',
  properties: {
    assignedStaff: { type: 'string', title: 'Assigned Staff' },
    reviewOutcome: { type: 'string', title: 'Review Outcome' },
    requiresMoreInfo: { type: 'string', title: 'Requires More Info (yes/no)' },
    reviewerNotes: { type: 'string', title: 'Reviewer Notes' },
  },
  required: ['assignedStaff', 'reviewOutcome'],
};

const starterUiSchema: RjsfUiSchema = {
  reviewerNotes: {
    'ui:widget': 'textarea',
  },
};

const RjsfForm = Form as unknown as ComponentType<Record<string, unknown>>;

function WorkflowManagerContent() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('staff-review');
  const [schemaJson, setSchemaJson] = useState<string>(JSON.stringify(starterSchema, null, 2));
  const [uiSchemaJson, setUiSchemaJson] = useState<string>(JSON.stringify(starterUiSchema, null, 2));
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  const onConnect = (params: Connection) => {
    setEdges((prevEdges: Edge[]) => addEdge({ ...params, markerEnd: { type: MarkerType.ArrowClosed } }, prevEdges));
  };

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? nodes[0],
    [nodes, selectedNodeId],
  );

  const parsedSchema = useMemo(() => {
    try {
      return JSON.parse(schemaJson) as RjsfSchema;
    } catch {
      return null;
    }
  }, [schemaJson]);

  const parsedUiSchema = useMemo(() => {
    try {
      return JSON.parse(uiSchemaJson) as RjsfUiSchema;
    } catch {
      return null;
    }
  }, [uiSchemaJson]);

  const schemaError = parsedSchema ? null : 'Schema JSON is invalid.';
  const uiSchemaError = parsedUiSchema ? null : 'UI schema JSON is invalid.';
  const isStaffUser = user?.role === 'staff' || user?.role === 'admin';

  useEffect(() => {
    if (token && !isStaffUser) {
      router.replace('/home');
    }
  }, [token, isStaffUser, router]);

  if (!token) return null;

  if (!isStaffUser) {
    return null;
  }

  return (
    <WorkspaceShell
      role={user?.role}
      userSub={user?.sub}
      onSignOut={() => {
        logout();
        router.push('/');
      }}
    >
      <PortalPageScaffold
        eyebrow="Federal Staff Portal"
        title="Workflow Manager"
        subtitle="Design the permit lifecycle from submission through reviews, payment checks, and final approvals. Custom BPMN-style nodes use USDS tokens, and node forms are configured with RJSF schemas."
      >
        <section className="grid grid-cols-1 gap-[var(--space-md)] xl:grid-cols-[1.9fr_1fr]">
          <Card>
            <div className="flex flex-col gap-[var(--space-md)]">
              <h2 className="type-heading-h6 text-[var(--color-text)]">Workflow Canvas</h2>
              <div className="h-[620px] rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)]">
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={(_event: unknown, node: Node) => setSelectedNodeId(node.id)}
                  fitView
                  nodeTypes={nodeTypes}
                >
                  <MiniMap pannable zoomable />
                  <Controls />
                  <Background gap={20} color="var(--color-border-strong)" />
                </ReactFlow>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex flex-col gap-[var(--space-md)]">
              <div className="space-y-[var(--space-xs)]">
                <h2 className="type-heading-h6 text-[var(--color-text)]">Node Configuration</h2>
                <p className="type-body-sm text-[var(--color-text-body)]">
                  Selected node: <span className="font-semibold">{selectedNode?.data.label ?? 'None'}</span>
                </p>
              </div>

              <div className="space-y-[var(--space-xs)]">
                <label className="type-body-xs font-semibold uppercase tracking-wide text-[var(--color-text-placeholder)]">
                  RJSF JSON Schema
                </label>
                <textarea
                  className="h-40 w-full rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-bg)] p-2 font-mono text-xs text-[var(--color-text)]"
                  value={schemaJson}
                  onChange={(event) => setSchemaJson(event.target.value)}
                />
                {schemaError && <p className="text-xs text-[var(--color-error)]">{schemaError}</p>}
              </div>

              <div className="space-y-[var(--space-xs)]">
                <label className="type-body-xs font-semibold uppercase tracking-wide text-[var(--color-text-placeholder)]">
                  RJSF UI Schema
                </label>
                <textarea
                  className="h-32 w-full rounded-[var(--radius-sm)] border border-[var(--color-border-strong)] bg-[var(--color-bg)] p-2 font-mono text-xs text-[var(--color-text)]"
                  value={uiSchemaJson}
                  onChange={(event) => setUiSchemaJson(event.target.value)}
                />
                {uiSchemaError && <p className="text-xs text-[var(--color-error)]">{uiSchemaError}</p>}
              </div>
            </div>
          </Card>
        </section>

        <Card>
          <div className="flex flex-col gap-[var(--space-md)]">
            <div className="space-y-[var(--space-xs)]">
              <h2 className="type-heading-h6 text-[var(--color-text)]">RJSF Form Preview</h2>
              <p className="type-body-sm text-[var(--color-text-body)]">
                This preview represents the staff-facing data capture for the selected workflow step.
              </p>
            </div>

            {parsedSchema && parsedUiSchema ? (
              <RjsfForm
                schema={parsedSchema}
                uiSchema={parsedUiSchema}
                validator={validator}
                formData={formData}
                onChange={(event: { formData?: unknown }) => setFormData((event.formData ?? {}) as Record<string, unknown>)}
                onSubmit={() => {}}
              >
                <div className="mt-[var(--space-md)]">
                  <Button type="submit" variant="secondary" size="sm">
                    Save Step Form
                  </Button>
                </div>
              </RjsfForm>
            ) : (
              <p className="text-sm text-[var(--color-error)]">Provide valid JSON to render the RJSF form preview.</p>
            )}
          </div>
        </Card>
      </PortalPageScaffold>
    </WorkspaceShell>
  );
}

export default function WorkflowManager() {
  return (
    <ReactFlowProvider>
      <WorkflowManagerContent />
    </ReactFlowProvider>
  );
}
