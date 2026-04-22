'use client';

import { useEffect, useMemo, useRef, useState, type ComponentType } from 'react';
import {
  Background,
  BackgroundVariant,
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

function nodeToneByType(nodeType: WorkflowNodeType): string {
  switch (nodeType) {
    case 'submission':
      return 'workflow-node--submission';
    case 'router':
      return 'workflow-node--router';
    case 'staffReview':
      return 'workflow-node--staffReview';
    case 'finance':
      return 'workflow-node--finance';
    case 'moreInfo':
      return 'workflow-node--moreInfo';
    case 'approval':
      return 'workflow-node--approval';
    default:
      return 'workflow-node--default';
  }
}

function WorkflowNodeCard({ data, selected }: NodeProps<WorkflowNode>) {
  const toneClass = nodeToneByType(data.nodeType);

  return (
    <div className={`workflow-node ${toneClass} ${selected ? 'workflow-node--selected' : ''}`}>
      <div className="workflow-node__content">
        <p className="workflow-node__role">{data.role}</p>
        <h3 className="workflow-node__label">{data.label}</h3>
        <p className="workflow-node__description">{data.description}</p>
      </div>
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
  {
    id: 'e-sub-router',
    source: 'submission',
    target: 'auto-router',
    label: 'Intake',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e-router-review',
    source: 'auto-router',
    target: 'staff-review',
    label: 'Review lane',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e-router-finance',
    source: 'auto-router',
    target: 'finance',
    label: 'Payment lane',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e-review-more',
    source: 'staff-review',
    target: 'more-info',
    label: 'Need more info',
    markerEnd: { type: MarkerType.ArrowClosed },
    className: 'workflow-edge--alert',
  },
  {
    id: 'e-more-review',
    source: 'more-info',
    target: 'staff-review',
    label: 'Resubmitted',
    markerEnd: { type: MarkerType.ArrowClosed },
    className: 'workflow-edge--alert',
  },
  {
    id: 'e-finance-approval',
    source: 'finance',
    target: 'final-approval',
    label: 'Cleared',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
  {
    id: 'e-review-approval',
    source: 'staff-review',
    target: 'final-approval',
    label: 'Approved',
    markerEnd: { type: MarkerType.ArrowClosed },
  },
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
  const canvasShellRef = useRef<HTMLDivElement | null>(null);

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('staff-review');
  const [schemaJson, setSchemaJson] = useState<string>(JSON.stringify(starterSchema, null, 2));
  const [uiSchemaJson, setUiSchemaJson] = useState<string>(JSON.stringify(starterUiSchema, null, 2));
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isCanvasFullscreen, setIsCanvasFullscreen] = useState<boolean>(false);
  const [isCanvasExpanded, setIsCanvasExpanded] = useState<boolean>(false);

  const onConnect = (params: Connection) => {
    setEdges((prevEdges: Edge[]) =>
      addEdge(
        {
          ...params,
          markerEnd: { type: MarkerType.ArrowClosed },
          type: 'smoothstep',
          style: { strokeWidth: 2 },
          labelStyle: {
            fill: 'var(--color-text-secondary)',
            fontWeight: 600,
            fontSize: 11,
          },
          labelBgPadding: [8, 4],
          labelBgBorderRadius: 999,
          labelBgStyle: {
            fill: 'var(--workflow-edge-label-bg)',
            stroke: 'var(--workflow-edge-label-border)',
            strokeWidth: 1,
          },
        },
        prevEdges,
      ),
    );
  };

  const selectedNode = useMemo(
    () => nodes.find((node) => node.id === selectedNodeId) ?? nodes[0],
    [nodes, selectedNodeId],
  );

  const isCanvasInFullscreenMode = isCanvasFullscreen || isCanvasExpanded;

  const toggleCanvasFullscreen = async () => {
    const shell = canvasShellRef.current;
    if (!shell) return;

    if (document.fullscreenElement === shell) {
      await document.exitFullscreen();
      setIsCanvasExpanded(false);
      return;
    }

    if (isCanvasExpanded) {
      setIsCanvasExpanded(false);
      return;
    }

    if (typeof shell.requestFullscreen === 'function') {
      try {
        await shell.requestFullscreen();
        return;
      } catch {
        // Some environments block fullscreen requests (e.g. embedded views);
        // fall back to a fixed, viewport-sized canvas mode.
      }
    }

    setIsCanvasExpanded(true);
  };

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

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsCanvasFullscreen(document.fullscreenElement === canvasShellRef.current);
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
    };
  }, []);

  useEffect(() => {
    if (!isCanvasExpanded) return;

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCanvasExpanded(false);
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [isCanvasExpanded]);

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
              <div className="flex items-center justify-between gap-[var(--space-sm)]">
                <h2 className="type-heading-h6 text-[var(--color-text)]">Workflow Canvas</h2>
                <Button type="button" variant="secondary" size="sm" onClick={toggleCanvasFullscreen}>
                  {isCanvasInFullscreenMode ? 'Exit Full Screen' : 'Full Screen'}
                </Button>
              </div>

              <div
                ref={canvasShellRef}
                className={`workflow-canvas-shell ${isCanvasInFullscreenMode ? 'workflow-canvas-shell--fullscreen' : ''} ${isCanvasExpanded ? 'workflow-canvas-shell--fullscreen-fallback' : ''} h-[620px]`}
              >
                <div className="workflow-canvas-overlay" aria-hidden>
                  <p className="workflow-canvas-zone workflow-canvas-zone--path">Applicant</p>
                  <p className="workflow-canvas-zone workflow-canvas-zone--risk">Federal Staff</p>
                  <div className="workflow-canvas-divider" />
                </div>
                <ReactFlow
                  className="workflow-flow"
                  nodes={nodes}
                  edges={edges}
                  onNodesChange={onNodesChange}
                  onEdgesChange={onEdgesChange}
                  onConnect={onConnect}
                  onNodeClick={(_event: unknown, node: Node) => setSelectedNodeId(node.id)}
                  fitView
                  nodeTypes={nodeTypes}
                  fitViewOptions={{ padding: 0.2 }}
                  defaultEdgeOptions={{
                    type: 'smoothstep',
                    style: { strokeWidth: 2 },
                    markerEnd: { type: MarkerType.ArrowClosed },
                    labelStyle: {
                      fill: 'var(--color-text-secondary)',
                      fontWeight: 600,
                      fontSize: 11,
                    },
                    labelBgPadding: [8, 4],
                    labelBgBorderRadius: 999,
                    labelBgStyle: {
                      fill: 'var(--workflow-edge-label-bg)',
                      stroke: 'var(--workflow-edge-label-border)',
                      strokeWidth: 1,
                    },
                  }}
                >
                  <MiniMap
                    pannable
                    zoomable
                    className="workflow-minimap"
                    nodeColor="var(--workflow-minimap-node)"
                    maskColor="var(--workflow-minimap-mask)"
                  />
                  <Controls className="workflow-controls" showInteractive={false} />
                  <Background
                    id="workflow-grid"
                    variant={BackgroundVariant.Dots}
                    gap={24}
                    size={1.2}
                    color="var(--workflow-grid-dot)"
                  />
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
