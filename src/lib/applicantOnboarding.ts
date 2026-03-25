export type ApplicationFormType = 'sf-299';

export type ApplicationDraftStatus = 'draft' | 'submitted';

export type ApplicationDraft = {
  id: string;
  formType: ApplicationFormType;
  title: string;
  agencyCode: string;
  region: string;
  status: ApplicationDraftStatus;
  updatedAt: string;
  route: string;
  workflowId?: number;
  data: Record<string, string>;
};

const DRAFTS_KEY = 'permit_gov_applicant_drafts_v1';

function inBrowser(): boolean {
  return typeof window !== 'undefined';
}

function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `draft_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
}

function parseDrafts(raw: string | null): ApplicationDraft[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ApplicationDraft[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function listApplicationDrafts(): ApplicationDraft[] {
  if (!inBrowser()) return [];
  const drafts = parseDrafts(window.localStorage.getItem(DRAFTS_KEY));
  return drafts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
}

export function getApplicationDraftById(id: string): ApplicationDraft | null {
  return listApplicationDrafts().find((draft) => draft.id === id) ?? null;
}

export function upsertApplicationDraft(
  input: Omit<ApplicationDraft, 'id' | 'updatedAt'> & { id?: string },
): ApplicationDraft {
  if (!inBrowser()) {
    const fallback: ApplicationDraft = {
      ...input,
      id: input.id ?? generateId(),
      updatedAt: new Date().toISOString(),
    };
    return fallback;
  }

  const drafts = listApplicationDrafts();
  const nextDraft: ApplicationDraft = {
    ...input,
    id: input.id ?? generateId(),
    updatedAt: new Date().toISOString(),
  };

  const index = drafts.findIndex((draft) => draft.id === nextDraft.id);
  if (index >= 0) {
    drafts[index] = nextDraft;
  } else {
    drafts.push(nextDraft);
  }

  window.localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
  return nextDraft;
}
