'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'usds';
import { Card } from '@/components/Card';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { TextInput } from '@/components/TextInput';
import { useAuth } from '@/contexts/AuthContext';
import * as api from '@/lib/api';

type BpmnModelerLike = {
  importXML: (xml: string) => Promise<unknown>;
  saveXML: (options?: { format?: boolean }) => Promise<{ xml?: string }>;
  on: (event: string, callback: () => void) => void;
  get: (service: string) => any;
  destroy: () => void;
};

const DEFAULT_BPMN_TEMPLATE = `<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions
  xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
  xmlns:spiff="http://spiffworkflow.org/bpmn/schema/1.0/core"
  id="permit_process_definitions"
  targetNamespace="http://permit.gov/bpmn"
  exporter="PERMIT.GOV BPMN Editor"
  exporterVersion="0.1.0">

  <bpmn:process id="PermitApplication" name="Federal Permit Application" isExecutable="true">
    <bpmn:startEvent id="start" name="Applicant Submits">
      <bpmn:outgoing>to_intake</bpmn:outgoing>
    </bpmn:startEvent>

    <bpmn:userTask id="intake" name="Intake Review">
      <bpmn:extensionElements>
        <spiff:properties>
          <spiff:property name="formJsonSchemaFilename" value="intake_form.json"/>
        </spiff:properties>
      </bpmn:extensionElements>
      <bpmn:incoming>to_intake</bpmn:incoming>
      <bpmn:outgoing>to_agency_review</bpmn:outgoing>
    </bpmn:userTask>

    <bpmn:userTask id="agency_review" name="Agency Review">
      <bpmn:incoming>to_agency_review</bpmn:incoming>
      <bpmn:outgoing>to_nepa</bpmn:outgoing>
    </bpmn:userTask>

    <bpmn:userTask id="nepa_compliance" name="NEPA Compliance Review">
      <bpmn:incoming>to_nepa</bpmn:incoming>
      <bpmn:outgoing>to_decision</bpmn:outgoing>
    </bpmn:userTask>

    <bpmn:exclusiveGateway id="decision_gate" name="Decision">
      <bpmn:incoming>to_decision</bpmn:incoming>
      <bpmn:outgoing>to_approved</bpmn:outgoing>
      <bpmn:outgoing>to_denied</bpmn:outgoing>
    </bpmn:exclusiveGateway>

    <bpmn:endEvent id="approved" name="Permit Approved">
      <bpmn:incoming>to_approved</bpmn:incoming>
    </bpmn:endEvent>

    <bpmn:endEvent id="denied" name="Permit Denied">
      <bpmn:incoming>to_denied</bpmn:incoming>
    </bpmn:endEvent>

    <bpmn:sequenceFlow id="to_intake" sourceRef="start" targetRef="intake"/>
    <bpmn:sequenceFlow id="to_agency_review" sourceRef="intake" targetRef="agency_review"/>
    <bpmn:sequenceFlow id="to_nepa" sourceRef="agency_review" targetRef="nepa_compliance"/>
    <bpmn:sequenceFlow id="to_decision" sourceRef="nepa_compliance" targetRef="decision_gate"/>
    <bpmn:sequenceFlow id="to_approved" sourceRef="decision_gate" targetRef="approved">
      <bpmn:conditionExpression>approved == true</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
    <bpmn:sequenceFlow id="to_denied" sourceRef="decision_gate" targetRef="denied">
      <bpmn:conditionExpression>approved == false</bpmn:conditionExpression>
    </bpmn:sequenceFlow>
  </bpmn:process>
</bpmn:definitions>
`;

type Step = 'edit' | 'validate' | 'save' | 'deploy';

export function BPMNModeler() {
  const { token, user, logout } = useAuth();
  const router = useRouter();
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const modelerRef = useRef<BpmnModelerLike | null>(null);
  const syncingFromCanvasRef = useRef(false);
  const syncDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [definitionKey, setDefinitionKey] = useState('permit_process');
  const [definitionName, setDefinitionName] = useState('Permit Approval Workflow');
  const [description, setDescription] = useState('Federal permit application workflow');
  const [changelog, setChangelog] = useState('');
  const [deploymentNotes, setDeploymentNotes] = useState('');

  const [xml, setXml] = useState(DEFAULT_BPMN_TEMPLATE);
  const [step, setStep] = useState<Step>('edit');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');
  const [exists, setExists] = useState(false);

  const [latestVersion, setLatestVersion] = useState<number | null>(null);
  const [deployedVersion, setDeployedVersion] = useState<number | null>(null);
  const [validation, setValidation] = useState<api.ProcessDefinitionValidateResponse | null>(null);
  const [editorReady, setEditorReady] = useState(false);
  const [spiffEnabled, setSpiffEnabled] = useState(false);

  const canEditDefinitions = useMemo(() => {
    const role = user?.role ?? '';
    return role === 'admin' || role === 'staff';
  }, [user?.role]);

  const syncXmlFromCanvas = useCallback(async () => {
    if (!modelerRef.current || syncingFromCanvasRef.current) return;
    const result = await modelerRef.current.saveXML({ format: true });
    if (result.xml) {
      setXml(result.xml);
    }
  }, []);

  const importXmlToCanvas = useCallback(async (nextXml: string) => {
    if (!modelerRef.current) return;
    syncingFromCanvasRef.current = true;
    try {
      await modelerRef.current.importXML(nextXml);
      const canvas = modelerRef.current.get('canvas');
      canvas?.zoom?.('fit-viewport');
    } finally {
      syncingFromCanvasRef.current = false;
    }
  }, []);

  const handleZoom = useCallback((delta: number) => {
    const canvas = modelerRef.current?.get('canvas');
    if (!canvas?.zoom) return;
    const currentZoom = canvas.zoom();
    if (typeof currentZoom !== 'number') return;
    const nextZoom = Math.max(0.2, Math.min(4, currentZoom + delta));
    canvas.zoom(nextZoom);
  }, []);

  const handleFitViewport = useCallback(() => {
    const canvas = modelerRef.current?.get('canvas');
    canvas?.zoom?.('fit-viewport');
  }, []);

  useEffect(() => {
    let cancelled = false;

    const setupEditor = async () => {
      if (!canvasRef.current) return;
      try {
        const module = await import('bpmn-js/lib/Modeler');
        if (cancelled || !canvasRef.current) return;

        const BpmnModeler = module.default;
        let additionalModules: any[] = [];

        try {
          const spiffRuntime = await import('bpmn-js-spiffworkflow');
          const rawAddon =
            (spiffRuntime as Record<string, unknown>).default ??
            (spiffRuntime as Record<string, unknown>).spiffworkflow ??
            spiffRuntime;

          if (Array.isArray(rawAddon)) {
            additionalModules = rawAddon;
          } else if (rawAddon && typeof rawAddon === 'object') {
            additionalModules = [rawAddon];
          }
        } catch {
          additionalModules = [];
        }

        let modeler: BpmnModelerLike;
        try {
          modeler = new BpmnModeler({
            container: canvasRef.current,
            keyboard: { bindTo: window },
            additionalModules,
          } as any) as BpmnModelerLike;
          setSpiffEnabled(additionalModules.length > 0);
        } catch {
          modeler = new BpmnModeler({
            container: canvasRef.current,
            keyboard: { bindTo: window },
          }) as BpmnModelerLike;
          setSpiffEnabled(false);
        }

        modelerRef.current = modeler;
        await modeler.importXML(xml);
        modeler.get('canvas')?.zoom?.('fit-viewport');

        modeler.on('commandStack.changed', () => {
          if (syncDebounceRef.current) {
            clearTimeout(syncDebounceRef.current);
          }
          syncDebounceRef.current = setTimeout(() => {
            void syncXmlFromCanvas();
          }, 250);
        });

        setEditorReady(true);
      } catch (err) {
        setStatus(`Canvas initialization failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    void setupEditor();

    return () => {
      cancelled = true;
      if (syncDebounceRef.current) {
        clearTimeout(syncDebounceRef.current);
      }
      modelerRef.current?.destroy();
      modelerRef.current = null;
      setEditorReady(false);
    };
  }, [syncXmlFromCanvas]);

  const loadDefinition = useCallback(async () => {
    if (!token) return;
    setBusy(true);
    setStatus('');
    try {
      const detail = await api.getProcessDefinition(token, definitionKey);
      setExists(true);
      setDefinitionName(detail.name);
      setDescription(detail.description ?? '');
      setLatestVersion(detail.latest_version);
      setDeployedVersion(detail.deployed_version);

      const sourceVersion = detail.deployed_version ?? detail.latest_version;
      if (sourceVersion > 0) {
        const source = await api.getProcessDefinitionVersionSource(token, definitionKey, sourceVersion);
        setXml(source.bpmn_xml);
        await importXmlToCanvas(source.bpmn_xml);
      }
      setStatus(
        `Loaded ${definitionKey}. Latest v${detail.latest_version}` +
          (detail.deployed_version ? `, deployed v${detail.deployed_version}.` : '.'),
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load definition';
      if (message.toLowerCase().includes('not found') || message.includes('404')) {
        setExists(false);
        setLatestVersion(null);
        setDeployedVersion(null);
        setStatus(`No existing definition for ${definitionKey}. Create a new one by saving.`);
      } else {
        setStatus(`Load failed: ${message}`);
      }
    } finally {
      setBusy(false);
    }
  }, [definitionKey, token, importXmlToCanvas]);

  useEffect(() => {
    if (!token) {
      router.replace('/login');
      return;
    }
    void loadDefinition();
  }, [token, router, loadDefinition]);

  const handleValidate = async () => {
    if (!token) return;
    setStep('validate');
    setBusy(true);
    setStatus('');
    try {
      const result = await api.validateProcessDefinition(token, xml);
      setValidation(result);
      if (result.validation_errors.length) {
        setStatus(`Validation completed with warnings: ${result.validation_errors.join('; ')}`);
      } else {
        setStatus(`BPMN is valid. Process ${result.process_name} with ${result.tasks.length} task(s).`);
      }
      setStep('save');
    } catch (err) {
      setStatus(`Validation failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setStep('edit');
    } finally {
      setBusy(false);
    }
  };

  const handleSaveVersion = async () => {
    if (!token) return;
    setStep('save');
    setBusy(true);
    setStatus('');
    try {
      if (exists) {
        const created = await api.createProcessDefinitionVersion(token, definitionKey, {
          bpmn_xml: xml,
          changelog: changelog || undefined,
        });
        setLatestVersion(created.version);
        setStatus(`Saved draft version v${created.version} for ${definitionKey}.`);
      } else {
        const created = await api.createProcessDefinition(token, {
          definition_key: definitionKey,
          name: definitionName || undefined,
          description: description || undefined,
          bpmn_xml: xml,
          changelog: changelog || undefined,
        });
        setExists(true);
        setLatestVersion(created.latest_version);
        setStatus(`Created definition ${definitionKey} with initial version v${created.latest_version}.`);
      }
      setStep('deploy');
    } catch (err) {
      setStatus(`Save failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setStep('save');
    } finally {
      setBusy(false);
    }
  };

  const handleDeploy = async () => {
    if (!token || latestVersion === null) return;
    setStep('deploy');
    setBusy(true);
    setStatus('');
    try {
      const deployment = await api.deployProcessDefinitionVersion(
        token,
        definitionKey,
        latestVersion,
        deploymentNotes || undefined,
      );
      setDeployedVersion(deployment.deployed_version);
      setStatus(`Deployed ${definitionKey} v${deployment.deployed_version} successfully.`);
      setStep('edit');
    } catch (err) {
      setStatus(`Deploy failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setBusy(false);
    }
  };

  if (!token) return null;

  return (
    <WorkspaceShell
      role={user?.role}
      userSub={user?.sub}
      onSignOut={() => {
        logout();
        router.push('/');
      }}
    >
      <div className="w-full space-y-6">
        <Card size="lg" className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">BPMN Workflow Authoring</h1>
              <p className="text-steel-600 dark:text-steel-400">
                Validate, version, and deploy workflow definitions for SpiffWorkflow execution.
              </p>
            </div>

            {!canEditDefinitions && (
              <p className="rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-700 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
                Your account role does not have process definition authoring permissions.
              </p>
            )}

            <div className="grid md:grid-cols-2 gap-4">
              <TextInput
                label="Definition Key"
                value={definitionKey}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDefinitionKey(e.target.value)}
                placeholder="permit_process"
                required
              />
              <TextInput
                label="Definition Name"
                value={definitionName}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDefinitionName(e.target.value)}
                placeholder="Permit Approval Workflow"
                optional
              />
              <TextInput
                label="Description"
                value={description}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDescription(e.target.value)}
                placeholder="Workflow purpose"
                optional
              />
              <div className="flex items-end">
                <Button onClick={() => void loadDefinition()} disabled={busy || !canEditDefinitions}>
                  Load Definition
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-3 text-sm">
              <p className="rounded-md border border-steel-300 dark:border-steel-700 px-3 py-2">
                Step: <span className="font-semibold">{step}</span>
              </p>
              <p className="rounded-md border border-steel-300 dark:border-steel-700 px-3 py-2">
                Latest Version: <span className="font-semibold">{latestVersion ?? 'none'}</span>
              </p>
              <p className="rounded-md border border-steel-300 dark:border-steel-700 px-3 py-2">
                Deployed Version: <span className="font-semibold">{deployedVersion ?? 'none'}</span>
              </p>
              <p className="rounded-md border border-steel-300 dark:border-steel-700 px-3 py-2">
                Spiff Modules: <span className="font-semibold">{spiffEnabled ? 'enabled' : 'base modeler'}</span>
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => void syncXmlFromCanvas()} disabled={busy || !editorReady}>
                  Sync Text From Canvas
                </Button>
                <Button variant="outline" onClick={() => void importXmlToCanvas(xml)} disabled={busy || !editorReady}>
                  Apply Text To Canvas
                </Button>
                <Button variant="ghost" onClick={() => handleZoom(0.1)} disabled={!editorReady}>
                  Zoom In
                </Button>
                <Button variant="ghost" onClick={() => handleZoom(-0.1)} disabled={!editorReady}>
                  Zoom Out
                </Button>
                <Button variant="ghost" onClick={handleFitViewport} disabled={!editorReady}>
                  Fit View
                </Button>
              </div>

              <div className="rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] overflow-hidden">
                <div ref={canvasRef} className="bpmn-canvas min-h-[560px] w-full" />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-[var(--color-text)]">BPMN XML</label>
              <textarea
                value={xml}
                onChange={(e) => {
                  setXml(e.target.value);
                  setStatus('');
                  setValidation(null);
                  if (step !== 'edit') setStep('edit');
                }}
                className="w-full min-h-[420px] rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg)] px-3 py-2 font-mono text-xs leading-5 text-[var(--color-text-body)] focus:outline-none focus:border-[var(--color-border-focus)]"
                spellCheck={false}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <TextInput
                label="Version Changelog"
                value={changelog}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setChangelog(e.target.value)}
                placeholder="What changed in this version"
                optional
              />
              <TextInput
                label="Deployment Notes"
                value={deploymentNotes}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDeploymentNotes(e.target.value)}
                placeholder="Why this deployment is being made"
                optional
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <Button onClick={handleValidate} disabled={busy || !xml || !canEditDefinitions}>
                1. Validate BPMN
              </Button>
              <Button variant="secondary" onClick={handleSaveVersion} disabled={busy || !xml || !canEditDefinitions}>
                2. Save Version
              </Button>
              <Button
                variant="outline"
                onClick={handleDeploy}
                disabled={busy || latestVersion === null || !canEditDefinitions}
              >
                3. Deploy Latest
              </Button>
            </div>

            {validation && (
              <div className="rounded-lg border border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-950/30 px-4 py-3 text-sm">
                <p className="font-semibold text-blue-800 dark:text-blue-200">Validation Summary</p>
                <p className="text-blue-700 dark:text-blue-300 mt-1">
                  {validation.process_name} ({validation.process_id}), first task: {validation.first_task_id}
                </p>
                <p className="text-blue-700 dark:text-blue-300 mt-1">Tasks: {validation.tasks.length}</p>
              </div>
            )}

            {status && (
              <p className="rounded-lg border border-steel-300 dark:border-steel-700 bg-white/70 dark:bg-black/30 px-4 py-3 text-sm">
                {status}
              </p>
            )}
        </Card>
      </div>
    </WorkspaceShell>
  );
}

export default BPMNModeler;
