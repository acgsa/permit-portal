/**
 * React Query hooks for all PIC NEPA entities.
 *
 * Each entity exposes: useList, useDetail, useCreate, useUpdate, useRemove.
 * Query keys follow the pattern: ['pic', entitySlug, ...params].
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import type { PaginationParams } from '@/lib/api';
import * as api from '@/lib/api';

// ---------------------------------------------------------------------------
// Generic factory
// ---------------------------------------------------------------------------

type PicCrud<T> = {
  list(token: string, params?: PaginationParams): Promise<T[]>;
  get(token: string, id: number): Promise<T>;
  create(token: string, body: Partial<T>): Promise<T>;
  update(token: string, id: number, body: Partial<T>): Promise<T>;
  remove(token: string, id: number): Promise<void>;
};

function makeHooks<T>(key: string, crud: PicCrud<T>) {
  function useList(params?: PaginationParams) {
    const { token } = useAuth();
    return useQuery({
      queryKey: ['pic', key, params ?? {}],
      queryFn: () => crud.list(token!, params),
      enabled: !!token,
    });
  }

  function useDetail(id: number | null | undefined) {
    const { token } = useAuth();
    return useQuery({
      queryKey: ['pic', key, id],
      queryFn: () => crud.get(token!, id!),
      enabled: !!token && id != null,
    });
  }

  function useCreate() {
    const { token } = useAuth();
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (body: Partial<T>) => crud.create(token!, body),
      onSuccess: () => qc.invalidateQueries({ queryKey: ['pic', key] }),
    });
  }

  function useUpdate() {
    const { token } = useAuth();
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, body }: { id: number; body: Partial<T> }) =>
        crud.update(token!, id, body),
      onSuccess: () => qc.invalidateQueries({ queryKey: ['pic', key] }),
    });
  }

  function useRemove() {
    const { token } = useAuth();
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: number) => crud.remove(token!, id),
      onSuccess: () => qc.invalidateQueries({ queryKey: ['pic', key] }),
    });
  }

  return { useList, useDetail, useCreate, useUpdate, useRemove };
}

// ---------------------------------------------------------------------------
// Entity hooks
// ---------------------------------------------------------------------------

export const projects = makeHooks('projects', api.picProjects);
export const processInstances = makeHooks('process-instances', api.picProcessInstances);
export const documents = makeHooks('documents', api.picDocuments);
export const comments = makeHooks('comments', api.picComments);
export const caseEvents = makeHooks('case-events', api.picCaseEvents);
export const engagements = makeHooks('engagements', api.picEngagements);
export const gisData = makeHooks('gis-data', api.picGisData);
export const gisDataElements = makeHooks('gis-data-elements', api.picGisDataElements);
export const legalStructures = makeHooks('legal-structures', api.picLegalStructures);
export const processModels = makeHooks('process-models', api.picProcessModels);
export const decisionElements = makeHooks('decision-elements', api.picDecisionElements);
export const processDecisionPayloads = makeHooks('process-decision-payloads', api.picProcessDecisionPayloads);
export const userRoles = makeHooks('user-roles', api.picUserRoles);
