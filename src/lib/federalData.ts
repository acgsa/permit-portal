import dashboardData from '@/data/dashboard-projects.json';
import ceData from '@/data/categorical-exclusions.json';

/* ── Sector slug → Dashboard sector name(s) ─────────────────────── */
const SECTOR_MAP: Record<string, string[]> = {
  'critical-minerals-mining': ['Mining'],
  'oil-gas-drilling': ['Conventional Energy Production'],
  'natural-gas-pipelines': ['Pipelines'],
  'electricity-transmission-lines': ['Electricity Transmission'],
  'water-resources': ['Water Resources', 'Ports and Waterways'],
  'advanced-manufacturing': ['Manufacturing', 'Renewable Energy Production'],
  'rights-of-way': ['Surface Transportation', 'Broadband'],
};

/* ── Project-type slug → relevant CE agency unit codes ───────────────── */
const CE_AGENCY_MAP: Record<string, string[]> = {
  'critical-minerals-mining': ['DOI - BLM', 'USDA', 'EPA', 'DOI - OSMRE'],
  'oil-gas-drilling': ['DOI - BLM', 'DOE', 'EPA', 'DOI - BSEE'],
  'natural-gas-pipelines': ['FERC', 'DOT - PHMSA', 'DOE', 'DOD - USACE', 'EPA'],
  'electricity-transmission-lines': ['DOE', 'DOI - BLM', 'USDA', 'FERC', 'DOD - USACE'],
  'water-resources': ['DOD - USACE', 'DOI - USBR', 'EPA', 'DOC - NOAA', 'DOI - NPS'],
  'advanced-manufacturing': ['EPA', 'DOE', 'DOD - DLA', 'GSA'],
  'rights-of-way': ['DOT - FHWA', 'DOI - BLM', 'USDA', 'DOT - FRA', 'DOT - FAA'],
};

/* ── Permit-type slug → Dashboard sector name(s) ─────────────────── */
const PERMIT_TYPE_SECTOR_MAP: Record<string, string[]> = {
  'electricity-transmission-lines': ['Electricity Transmission', 'Renewable Energy Production'],
  'critical-minerals-mining': ['Mining'],
  'rights-of-way': ['Surface Transportation', 'Broadband', 'Aviation'],
  'water-resources': ['Water Resources', 'Ports and Waterways'],
};

const PERMIT_TYPE_CE_MAP: Record<string, string[]> = {
  'electricity-transmission-lines': ['DOE', 'FERC', 'DOI - BLM', 'USDA', 'DOD - USACE'],
  'critical-minerals-mining': ['DOI - BLM', 'USDA', 'EPA', 'DOD - USACE'],
  'rights-of-way': ['DOT - FHWA', 'DOT - FRA', 'DOT - FAA', 'DOD - USACE', 'EPA'],
  'water-resources': ['DOD - USACE', 'DOI - USBR', 'EPA', 'DOC - NOAA'],
};

/* ── Public helpers ──────────────────────────────────────────────── */

export interface DashboardStats {
  projectCount: number;
  examples: { title: string; status: string; leadAgency: string }[];
}

export interface CEStats {
  totalCEs: number;
  agencyCount: number;
  agencies: { code: string; longName: string; count: number }[];
}

export interface AggregateStats {
  totalProjects: number;
  totalCEs: number;
  totalAgencyUnits: number;
  dashboardSectors: number;
}

export function getDashboardStats(slug: string): DashboardStats {
  const sectorNames = SECTOR_MAP[slug] ?? [];
  let projectCount = 0;
  const examples: DashboardStats['examples'] = [];

  for (const name of sectorNames) {
    const sector = (dashboardData.sectors as Record<string, { count: number; examples: { title: string; status: string; leadAgency: string }[] }>)[name];
    if (sector) {
      projectCount += sector.count;
      examples.push(...sector.examples);
    }
  }

  return { projectCount, examples: examples.slice(0, 5) };
}

export function getCategoricalExclusions(slug: string): CEStats {
  const agencyCodes = CE_AGENCY_MAP[slug] ?? [];
  const agencies: CEStats['agencies'] = [];
  let totalCEs = 0;

  for (const code of agencyCodes) {
    const agency = (ceData.agencies as Record<string, { longName: string; count: number }>)[code];
    if (agency) {
      agencies.push({ code, longName: agency.longName, count: agency.count });
      totalCEs += agency.count;
    }
  }

  return { totalCEs, agencyCount: agencies.length, agencies };
}

export function getPermitTypeDashboardStats(slug: string): DashboardStats {
  const sectorNames = PERMIT_TYPE_SECTOR_MAP[slug] ?? [];
  let projectCount = 0;
  const examples: DashboardStats['examples'] = [];

  for (const name of sectorNames) {
    const sector = (dashboardData.sectors as Record<string, { count: number; examples: { title: string; status: string; leadAgency: string }[] }>)[name];
    if (sector) {
      projectCount += sector.count;
      examples.push(...sector.examples);
    }
  }

  return { projectCount, examples: examples.slice(0, 5) };
}

export function getPermitTypeCEStats(slug: string): CEStats {
  const agencyCodes = PERMIT_TYPE_CE_MAP[slug] ?? [];
  const agencies: CEStats['agencies'] = [];
  let totalCEs = 0;

  for (const code of agencyCodes) {
    const agency = (ceData.agencies as Record<string, { longName: string; count: number }>)[code];
    if (agency) {
      agencies.push({ code, longName: agency.longName, count: agency.count });
      totalCEs += agency.count;
    }
  }

  return { totalCEs, agencyCount: agencies.length, agencies };
}

export function getAggregateStats(): AggregateStats {
  return {
    totalProjects: dashboardData.totalProjects,
    totalCEs: ceData.total,
    totalAgencyUnits: ceData.agencyUnitCount,
    dashboardSectors: dashboardData.sectorCount,
  };
}
