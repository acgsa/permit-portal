'use client';

import { Bird, Building2, Cloud, Clock, FileText, Landmark, Layers, Users, Waves } from 'lucide-react';
import { LucideIcon } from '@/components/LucideIcon';
import { Card } from 'usds';
import type { SynopsisResult } from '@/types/synopsis';

const TRIGGER_ICONS: Record<string, typeof Waves> = {
  water: Waves,
  species: Bird,
  historic: Landmark,
  air: Cloud,
  navigable: Waves,
  transportation: Building2,
  'nepa-general': Layers,
  // Legacy triggers
  impactsWaterBodies: Waves,
  impactsSpeciesHabitat: Bird,
  impactsHistoricCultural: Landmark,
  impactsAirEnvironmental: Cloud,
  impactsWaterways: Building2,
};

const NEPA_COLORS: Record<string, string> = {
  'Categorical Exclusion': 'var(--color-success, #2e7d32)',
  'Environmental Assessment': 'var(--color-warning, #ed6c02)',
  'Environmental Impact Statement': 'var(--color-error, #d32f2f)',
};

interface SynopsisCardProps {
  synopsis: SynopsisResult;
}

export function SynopsisCard({ synopsis }: SynopsisCardProps) {
  const nepaColor = NEPA_COLORS[synopsis.nepa_level] ?? 'var(--color-text)';

  return (
    <Card size="lg">
      <div className="page-card-body">
        {/* NEPA Determination */}
        <div className="grid grid-cols-[28px_1fr] gap-x-[var(--space-sm)]">
          <LucideIcon icon={Layers} size={24} className="mt-0.5" style={{ color: nepaColor }} />
          <p className="type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)] self-center">
            NEPA Review Level
          </p>
          <div />
          <h3 className="type-heading-h5 text-[var(--color-text)]" style={{ color: nepaColor }}>
            {synopsis.nepa_level}
          </h3>
          <div />
          <p className="type-body-md text-[var(--color-text-body)] mt-[var(--space-xs)]">
            {synopsis.nepa_explanation}
          </p>
        </div>

        {/* Lead Agency */}
        <div className="pt-[var(--space-sm)] border-t border-[var(--color-border)]">
          <div className="grid grid-cols-[28px_1fr] gap-x-[var(--space-sm)]">
            <LucideIcon icon={Users} size={24} className="mt-0.5 text-[var(--color-text-body)]" />
            <p className="type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)] self-center">
              Lead Federal Agency
            </p>
            <div />
            <h3 className="type-heading-h5 text-[var(--color-text)]">{synopsis.lead_agency.name}</h3>
            <div />
            <p className="type-body-sm text-[var(--color-text-body)]">Agency Code: {synopsis.lead_agency.code}</p>

            {synopsis.cooperating_agencies.length > 0 && (<>
              <div className="col-span-2 mt-[var(--space-md)] pt-[var(--space-md)] border-t border-[var(--color-border)]" />
              <div />
              <div>
                <p className="type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)] mb-[var(--space-xs)]">
                  Cooperating & Consulting Agencies
                </p>
                <div className="space-y-[var(--space-2xs)]">
                  {synopsis.cooperating_agencies.map((agency) => (
                    <div key={agency.code} className="flex items-center justify-between">
                      <p className="type-body-md text-[var(--color-text-body)]">{agency.name}</p>
                      <span className="type-body-xs text-[var(--color-text-disabled)] capitalize">{agency.role}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>)}
          </div>
        </div>

        {/* Required Reviews */}
        {synopsis.required_reviews.length > 0 && (
          <div className="pt-[var(--space-sm)] border-t border-[var(--color-border)]">
            <div className="grid grid-cols-[28px_1fr] gap-x-[var(--space-sm)] mb-[var(--space-sm)]">
              <div />
              <p className="type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)]">
                Required Reviews ({synopsis.required_reviews.length})
              </p>
            </div>
            <div className="space-y-[var(--space-md)]">
              {synopsis.required_reviews.map((review, idx) => {
                const Icon = TRIGGER_ICONS[review.trigger] ?? FileText;
                return (
                  <div key={idx} className="grid grid-cols-[28px_1fr] gap-x-[var(--space-sm)]">
                    <LucideIcon icon={Icon} size={24} className="mt-0.5 text-[var(--color-text-body)]" />
                    <h4 className="type-heading-h5 text-[var(--color-text)] self-center">{review.name}</h4>
                    <div />
                    <p className="type-body-sm text-[var(--color-text-body)]">{review.description}</p>
                    <div />
                    <div className="flex flex-wrap gap-x-[var(--space-md)] gap-y-[var(--space-2xs)] mt-[var(--space-2xs)]">
                      <span className="type-body-xs text-[var(--color-text-disabled)]">
                        {review.authority}
                      </span>
                      <span className="type-body-xs text-[var(--color-text-disabled)]">
                        {review.agency_name}
                      </span>
                      {review.estimated_days && (
                        <span className="type-body-xs text-[var(--color-text-disabled)]">
                          ~{review.estimated_days} days
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Required Forms */}
        {synopsis.required_forms.length > 0 && (
          <div className="pt-[var(--space-sm)] border-t border-[var(--color-border)]">
            <div className="grid grid-cols-[28px_1fr] gap-x-[var(--space-sm)]">
              <LucideIcon icon={FileText} size={24} className="mt-0.5 text-[var(--color-text-body)]" />
              <p className="type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)] self-center">
                Required Forms
              </p>
              <div />
              <div className="space-y-[var(--space-2xs)]">
                {synopsis.required_forms.map((form, idx) => (
                  <p key={idx} className="type-heading-h5 text-[var(--color-text)]">
                    {form.form_id} <span className="type-body-md font-normal">— {form.title}</span>
                  </p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Estimated Timeline */}
        {synopsis.estimated_timeline_days && (
          <div className="pt-[var(--space-sm)] border-t border-[var(--color-border)]">
            <div className="grid grid-cols-[28px_1fr] gap-x-[var(--space-sm)]">
              <LucideIcon icon={Clock} size={24} className="mt-0.5 text-[var(--color-text-body)]" />
              <p className="type-body-xs uppercase tracking-[0.16em] text-[var(--color-text-disabled)] self-center">
                Estimated Timeline
              </p>
              <div />
              <h3 className="type-heading-h5 text-[var(--color-text)]">
                ~{synopsis.estimated_timeline_days} days
              </h3>
              <div />
              <p className="type-body-sm text-[var(--color-text-body)]">
                This is an estimate based on the NEPA review level and required consultations. Actual timelines vary by project complexity and agency workload.
              </p>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
