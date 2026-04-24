'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';
import { ArrowUp, BarChart3, ChevronDown, UserPlus } from 'lucide-react';
import { LucideIcon } from '@/components/LucideIcon';
import { AnimatedCard, StaggerContainer } from '@/components/motion';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { PortalPageScaffold } from '@/components/PortalPageScaffold';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { getAggregateStats } from '@/lib/federalData';
import dashboardData from '@/data/dashboard-projects.json';
import ceData from '@/data/categorical-exclusions.json';
import {
  Badge,
  Button,
  Card,
  CompletionTracker,
  DonutChart,
  Dropdown,
  Table,
  TableHeader,
  type BadgeColor,
} from 'usds';
import { resolveStaffProfile } from '@/lib/mockFederalPortalData';

type QuickAssignStatus = 'NEW' | 'OVERDUE';

type QuickAssignRow = {
  status: QuickAssignStatus;
  project: string;
  applicationId: string;
  assignee: string;
};

type StaffAvailability = 'AVAILABLE' | 'BUSY' | 'OVERLOADED';

type StaffOverviewRow = {
  name: string;
  office: string;
  expertise: string;
  role: string;
  projects: number;
  availability: StaffAvailability;
};

const QUICK_ASSIGN_ROWS: QuickAssignRow[] = [
  { status: 'NEW', project: 'Right of Way for Lake Mead Parkway', applicationId: 'C910043198', assignee: 'None' },
  { status: 'NEW', project: 'Pine Valley Reservoir Expansion Project', applicationId: 'C710043238', assignee: 'None' },
  { status: 'OVERDUE', project: 'Lower Colorado River Pipeline Crossing', applicationId: 'C710043197', assignee: 'Derek Walsh' },
  { status: 'OVERDUE', project: 'Pine Valley Reservoir Expansion Project', applicationId: 'C510043277', assignee: 'Derek Walsh' },
  { status: 'OVERDUE', project: 'Rio Grande Diversion Structure Rehab', applicationId: 'C210043823', assignee: 'Derek Walsh' },
];

const STAFF_OVERVIEW_ROWS: StaffOverviewRow[] = [
  { name: 'Karen Mitchell', office: 'Bend Field Office', expertise: 'Realty Specialist', role: 'Land Appraisal', projects: 8, availability: 'BUSY' },
  { name: 'Laura Bennett', office: 'Columbia-Cascades Area Office', expertise: 'Realty Specialist', role: 'Land Appraisal', projects: 2, availability: 'AVAILABLE' },
  { name: 'Robert Hayes', office: 'Ephrata Field Office', expertise: 'Deputy Field Office Manager', role: 'Land Appraisal', projects: 0, availability: 'AVAILABLE' },
  { name: 'Maria Santos', office: 'Grand Coulee Dam', expertise: 'Realty Specialist', role: 'Land Appraisal', projects: 23, availability: 'OVERLOADED' },
  { name: 'Tanya Brooks', office: 'Middle Snake Field Office', expertise: 'Realty Specialist', role: 'Land Appraisal', projects: 11, availability: 'BUSY' },
  { name: 'Derek Walsh', office: 'Snake River Area Office', expertise: 'Realty Specialist', role: 'Land Appraisal', projects: 17, availability: 'OVERLOADED' },
  { name: 'Brian Foster', office: 'Upper Snake Field Office', expertise: 'Realty Specialist', role: 'Land Appraisal', projects: 7, availability: 'AVAILABLE' },
  { name: 'Laura Bennett', office: 'Yakima Field Office', expertise: 'Realty Specialist', role: 'Land Appraisal', projects: 2, availability: 'AVAILABLE' },
  { name: 'Vacant', office: 'Umatilla Field Office', expertise: 'Realty Specialist', role: 'Land Appraisal', projects: 0, availability: 'AVAILABLE' },
];

const ADMIN_AGENCY_BREAKDOWN = [
  { label: 'BLM', value: 155846, colorVar: 'var(--chart-1)' },
  { label: 'USACE', value: 5177, colorVar: 'var(--chart-2)' },
  { label: 'DOE', value: 2364, colorVar: 'var(--chart-3)' },
  { label: 'EPA', value: 1738, colorVar: 'var(--chart-4)' },
];

const ADMIN_COMPLETION_STATE = [
  { label: 'Submitted', percent: 12, colorVar: 'var(--steel-300)', hoverColorVar: 'var(--steel-400)', texture: 'stripes' as const },
  { label: 'Overdue', percent: 62, colorVar: 'var(--red-500)', hoverColorVar: 'var(--red-600)', texture: 'crosshatch' as const },
  { label: 'Awaiting Additional Info', percent: 12, colorVar: 'var(--gold-400)', hoverColorVar: 'var(--gold-500)', texture: 'dots' as const },
  { label: 'In Progress', percent: 8, colorVar: 'var(--blue-400)', hoverColorVar: 'var(--blue-500)', texture: 'stripes-alt' as const },
];

const OPEN_PERMITS_SERIES = [
  { year: 1904, permits: 220 },
  { year: 1911, permits: 220 },
  { year: 1990, permits: 210 },
  { year: 1992, permits: 4200 },
  { year: 1993, permits: 620 },
  { year: 1995, permits: 920 },
  { year: 1997, permits: 1250 },
  { year: 1999, permits: 3214 },
  { year: 2001, permits: 650 },
  { year: 2004, permits: 430 },
  { year: 2005, permits: 760 },
  { year: 2008, permits: 620 },
  { year: 2010, permits: 620 },
  { year: 2016, permits: 2500 },
  { year: 2018, permits: 600 },
  { year: 2020, permits: 260 },
  { year: 2023, permits: 620 },
  { year: 2026, permits: 620 },
  { year: 2027, permits: 2300 },
];
const OPEN_PERMITS_Y_AXIS_TICKS = [0, 1000, 2000, 3000, 4000, 5000];
const OPEN_PERMITS_X_AXIS_TICKS = [1904, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025];
const OPEN_PERMITS_MAX = 5000;
const OPEN_PERMITS_HIGHLIGHT_YEAR = 1999;
const OPEN_PERMITS_LEGACY_END_YEAR = 1990;
const OPEN_PERMITS_LEGACY_WIDTH_RATIO = 0.14;

const ADMIN_AVERAGE_DAYS = [
  { label: 'NEPA', value: 2291 },
  { label: 'MLRS', value: 1805 },
  { label: 'ePlanning', value: 1202 },
  { label: 'NFLSS', value: 1167 },
];

const ADMIN_DATE_FILTER_OPTIONS = ['July 20-27, 2025'];
const QUICK_ASSIGN_ASSIGNEE_OPTIONS = ['None', 'Derek Walsh', 'Karen Mitchell', 'Laura Bennett', 'Robert Hayes'];

function quickAssignStatusColor(status: QuickAssignStatus): BadgeColor {
  return status === 'NEW' ? 'blue' : 'red';
}

function availabilityColor(value: StaffAvailability): BadgeColor {
  if (value === 'AVAILABLE') return 'green';
  if (value === 'BUSY') return 'gold';
  return 'red';
}

function managerFirstName(displayName: string): string {
  return displayName.split(' ')[0] ?? displayName;
}

function formatPermitsTick(value: number): string {
  if (value === 0) return '0';
  return `${Math.round(value / 1000)}K`;
}

type QuickAssignDropdownProps = {
  value: string;
  options: string[];
  onSelect: (value: string) => void;
  widthPx?: number;
};

function getQuickAssignMenuPosition(triggerRect: DOMRect, menuHeight: number, widthPx: number): { top: number; left: number } {
  const gap = 4;
  const viewportPadding = 8;
  let left = triggerRect.right - widthPx;
  let top = triggerRect.bottom + gap;

  if (typeof window !== 'undefined') {
    const minLeft = viewportPadding;
    const maxLeft = window.innerWidth - viewportPadding - widthPx;
    left = Math.min(Math.max(left, minLeft), Math.max(minLeft, maxLeft));

    const maxBottom = window.innerHeight - viewportPadding;
    if (menuHeight > 0 && top + menuHeight > maxBottom) {
      top = Math.max(viewportPadding, triggerRect.top - menuHeight - gap);
    }
  }

  return { top, left };
}

function QuickAssignDropdown({ value, options, onSelect, widthPx = 132 }: QuickAssignDropdownProps) {
  const [open, setOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const menuHeight = menuRef.current?.offsetHeight ?? 0;
      setMenuPos(getQuickAssignMenuPosition(rect, menuHeight, widthPx));
    };

    updatePosition();

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target)) return;
      if (menuRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition, true);
    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition, true);
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [open, widthPx]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        className="dropdown-trigger dropdown-trigger-sm w-full"
        style={{ justifyContent: 'space-between', gap: 'var(--space-xs)' }}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="block min-w-0 flex-1 truncate text-left">{value}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>

      {open && typeof document !== 'undefined'
        ? createPortal(
            <div
              ref={menuRef}
              className="dropdown-menu"
              style={{
                position: 'fixed',
                top: menuPos.top,
                left: menuPos.left,
                width: widthPx,
                minWidth: widthPx,
                maxWidth: widthPx,
                zIndex: 300,
              }}
              role="listbox"
            >
              {options.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="dropdown-item"
                  title={option}
                  onClick={() => {
                    onSelect(option);
                    setOpen(false);
                  }}
                >
                  <span className="block w-full truncate">{option}</span>
                </button>
              ))}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

/* ── Agency bar chart with USDS-style hover tooltip ─────────── */
function AgencyBarChart({ items, max }: { items: { code: string; name: string; count: number }[]; max: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<{ index: number; x: number; y: number } | null>(null);

  const updatePosition = useCallback((e: React.MouseEvent, index: number) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setHovered({ index, x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);

  const handleMouseEnter = useCallback(
    (e: React.MouseEvent, index: number) => updatePosition(e, index),
    [updatePosition],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent, index: number) => {
      if (hovered?.index === index) updatePosition(e, index);
    },
    [hovered?.index, updatePosition],
  );

  const handleMouseLeave = useCallback(() => setHovered(null), []);

  return (
    <Card className="h-full !bg-[var(--steel-950)]">
      <div ref={cardRef} className="relative flex h-full flex-col">
        <div className="space-y-[var(--space-2xs)]">
          <div className="chart-card-title" style={{ marginBottom: 0 }}>Categorical Exclusions by Agency</div>
          <p className="m-0 type-body-sm text-[var(--color-text-body)]">Top agencies by categorical exclusion count</p>
        </div>
        <div aria-hidden="true" style={{ height: 'var(--space-xl)' }} />
        <div className="flex-1 min-h-[180px]" role="img" aria-label="Permits by agency">
          <div className="h-full w-full flex items-end gap-[var(--space-sm)]">
            {items.map((item, i) => {
              const barPercent = Math.max((item.count / max) * 100, 4);
              return (
                <div
                  key={item.code}
                  className="flex h-full min-w-0 flex-1 flex-col cursor-pointer"
                  onMouseEnter={(e) => handleMouseEnter(e, i)}
                  onMouseMove={(e) => handleMouseMove(e, i)}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="flex-1 flex items-end pb-[var(--space-md)]">
                    <div
                      className="w-full rounded-[var(--radius-sm)] transition-colors duration-150"
                      style={{
                        height: `${barPercent}%`,
                        minHeight: '6px',
                        background: hovered?.index === i ? 'var(--blue-300)' : 'var(--chart-bar)',
                      }}
                    />
                  </div>
                  <div style={{ paddingTop: 'var(--space-md)' }}>
                    <p className="m-0 type-body-strong-sm text-center text-[var(--color-text)]">
                      {item.count.toLocaleString()}
                    </p>
                    <p className="m-0 mt-[var(--space-2xs)] type-body-xs text-center text-[var(--color-text-body)]">
                      {item.code}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        {hovered !== null && (
          <div
            className="chart-kpi-card"
            style={{ left: hovered.x + 12, top: hovered.y + 12 }}
          >
            <div className="chart-kpi-card-title">{items[hovered.index].name}</div>
            <div className="chart-kpi-card-row">
              <span className="chart-kpi-card-bullet" style={{ background: 'var(--chart-bar)' }} />
              <span className="chart-kpi-card-label">Exclusions</span>
              <span className="chart-kpi-card-value">{items[hovered.index].count.toLocaleString()}</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const isStaffUser = user?.role === 'staff' || user?.role === 'admin';
  const [adminDateFilter, setAdminDateFilter] = useState(ADMIN_DATE_FILTER_OPTIONS[0]);
  const [hoveredOpenPermitsPoint, setHoveredOpenPermitsPoint] = useState<(typeof OPEN_PERMITS_SERIES)[number] | null>(null);
  const [hoveredOpenPermitsCursor, setHoveredOpenPermitsCursor] = useState<{ x: number; y: number } | null>(null);
  const openPermitsChartRef = useRef<HTMLDivElement>(null);
  const openPermitsTooltipRef = useRef<HTMLDivElement>(null);
  const [quickAssignAssignees, setQuickAssignAssignees] = useState<string[]>(() =>
    QUICK_ASSIGN_ROWS.map((row) => row.assignee),
  );

  /* ── Public / logged-out view ───────────────────────────── */
  if (!token || !isStaffUser) {
    /* ── Derive dashboard data from project JSON + CE data ──── */
    const agg = getAggregateStats();

    const PUBLIC_KPI = [
      { label: 'Total Projects Tracked', value: agg.totalProjects.toLocaleString() },
      { label: 'Categorical Exclusions', value: agg.totalCEs.toLocaleString() },
      { label: 'Agency Units', value: String(agg.totalAgencyUnits) },
      { label: 'Sectors Covered', value: String(agg.dashboardSectors) },
    ];

    /* Top sectors for donut chart — pull from real JSON, group small ones */
    const sectorEntries = Object.entries(
      dashboardData.sectors as Record<string, { count: number }>
    ).sort((a, b) => b[1].count - a[1].count);

    const TOP_N = 5;
    const donutColors = [
      'var(--blue-400)', 'var(--green-400)', 'var(--gold-400)',
      'var(--violet-400)', 'var(--turquoise-400)', 'var(--orange-400)',
    ];
    const topSectors = sectorEntries.slice(0, TOP_N);
    const otherCount = sectorEntries.slice(TOP_N).reduce((sum, [, s]) => sum + s.count, 0);

    const PUBLIC_PERMITS_BY_SECTOR = [
      ...topSectors.map(([name, s], i) => ({
        label: name,
        value: s.count,
        colorVar: donutColors[i],
      })),
      ...(otherCount > 0
        ? [{ label: 'Other', value: otherCount, colorVar: donutColors[TOP_N] }]
        : []),
    ];

    /* Bar chart — top agencies by permit count (from CE data) */
    const agencyEntries = Object.entries(
      ceData.agencies as Record<string, { longName: string; count: number }>
    ).sort((a, b) => b[1].count - a[1].count);
    const PUBLIC_AGENCIES_BAR = agencyEntries.slice(0, 6).map(([code, a]) => ({
      code,
      name: a.longName,
      count: a.count,
    }));
    const pubBarMax = Math.max(...PUBLIC_AGENCIES_BAR.map((d) => d.count));

    /* Status pipeline — map real project statuses to pipeline categories */
    const statusCounts: Record<string, number> = {};
    for (const [, sector] of Object.entries(
      dashboardData.sectors as Record<string, { count: number; examples: { status: string }[] }>
    )) {
      for (const ex of sector.examples) {
        statusCounts[ex.status] = (statusCounts[ex.status] ?? 0) + 1;
      }
    }
    const totalStatusExamples = Object.values(statusCounts).reduce((a, b) => a + b, 0);
    const approved = (statusCounts['Complete'] ?? 0) + (statusCounts['Class of Action Changed'] ?? 0);
    const inReview = statusCounts['In Progress'] ?? 0;
    const awaitingInfo = (statusCounts['Planned'] ?? 0) + (statusCounts['Paused'] ?? 0);
    const rejected = statusCounts['Cancelled'] ?? 0;
    const pct = (n: number) => Math.round((n / totalStatusExamples) * 100);

    const PUBLIC_COMPLETION = [
      { label: 'Approved', percent: pct(approved), colorVar: 'var(--green-500)', hoverColorVar: 'var(--green-600)', texture: 'stripes' as const },
      { label: 'In Review', percent: pct(inReview), colorVar: 'var(--blue-400)', hoverColorVar: 'var(--blue-500)', texture: 'stripes-alt' as const },
      { label: 'Awaiting Info', percent: pct(awaitingInfo), colorVar: 'var(--gold-400)', hoverColorVar: 'var(--gold-500)', texture: 'dots' as const },
      { label: 'Rejected', percent: pct(rejected), colorVar: 'var(--red-400)', hoverColorVar: 'var(--red-500)', texture: 'crosshatch' as const },
    ];

    return (
      <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>
        <Navigation />

        {/* Public dashboard content */}
        <section
          className="flex justify-center bg-black text-white px-2 sm:px-6 lg:px-8"
          style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-3xl)' }}
        >
          <div
            className="w-full max-w-5xl flex flex-col gap-[var(--space-md)]"
            style={{
              marginLeft: 'clamp(var(--space-sm), 5vw, var(--space-lg))',
              marginRight: 'clamp(var(--space-sm), 5vw, var(--space-lg))',
            }}
          >
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <h1 className="type-heading-h1" style={{ color: 'var(--color-text)', marginBottom: 'var(--space-xs)' }}>
                Federal Permit Analytics
              </h1>
              <p className="type-body-md" style={{ color: 'var(--color-text-body)', maxWidth: 700 }}>
                Real-time performance metrics and operational insights for federal permitting staff and administrators.
              </p>
            </div>

            {/* KPI row */}
            <StaggerContainer className="grid items-stretch gap-[var(--space-md)] grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {PUBLIC_KPI.map((kpi, i) => (
                <AnimatedCard key={kpi.label} delay={i * 0.06}>
                  <Card className="h-full !bg-[var(--steel-950)]">
                    <div className="flex flex-col gap-[var(--space-sm)]">
                      <p className="chart-card-title" style={{ marginBottom: 0 }}>{kpi.label}</p>
                      <p className="type-heading-h2 text-[var(--color-text)]">{kpi.value}</p>
                    </div>
                  </Card>
                </AnimatedCard>
              ))}
            </StaggerContainer>

            {/* Permits by Agency bar chart + Permits by Sector donut */}
            <StaggerContainer className="grid items-stretch gap-[var(--space-md)] md:grid-cols-2">
              <AnimatedCard className="h-full">
                <AgencyBarChart items={PUBLIC_AGENCIES_BAR} max={pubBarMax} />
              </AnimatedCard>

              <AnimatedCard className="dashboard-bureau-card h-full" delay={0.08}>
                <DonutChart title="Permits by Sector" segments={PUBLIC_PERMITS_BY_SECTOR} size={160} ringThickness={40} />
              </AnimatedCard>
            </StaggerContainer>

            {/* Completion tracker */}
            <AnimatedCard>
              <CompletionTracker
                title="Permit Review Pipeline"
                actionLabel=""
                description="Distribution of active permit applications by status"
                segments={PUBLIC_COMPLETION}
                totalApplications={agg.totalProjects}
              />
            </AnimatedCard>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  const staffProfile = resolveStaffProfile(user?.sub, user?.role);
  const isAdmin = staffProfile.role === 'admin';
  const chartWidth = 980;
  const chartHeight = 310;
  const chartPadding = { top: 8, right: 24, bottom: 46, left: 56 };
  const openPermitsQuantityLabelX = chartPadding.left - 28;
  const minYear = OPEN_PERMITS_SERIES[0]?.year ?? 1904;
  const maxYear = OPEN_PERMITS_SERIES[OPEN_PERMITS_SERIES.length - 1]?.year ?? 2027;
  const plotWidth = chartWidth - chartPadding.left - chartPadding.right;
  const plotHeight = chartHeight - chartPadding.top - chartPadding.bottom;
  const legacyEndYear = Math.min(OPEN_PERMITS_LEGACY_END_YEAR, maxYear);
  const legacyPlotWidth = plotWidth * OPEN_PERMITS_LEGACY_WIDTH_RATIO;
  const modernPlotWidth = plotWidth - legacyPlotWidth;
  const xForYear = (year: number): number => {
    if (year <= legacyEndYear) {
      if (legacyEndYear === minYear) return chartPadding.left;
      return chartPadding.left + ((year - minYear) / (legacyEndYear - minYear)) * legacyPlotWidth;
    }
    if (maxYear === legacyEndYear) return chartPadding.left + legacyPlotWidth;
    return chartPadding.left + legacyPlotWidth + ((year - legacyEndYear) / (maxYear - legacyEndYear)) * modernPlotWidth;
  };
  const yForPermits = (permits: number): number => {
    return chartPadding.top + (1 - permits / OPEN_PERMITS_MAX) * plotHeight;
  };
  const openPermitsPath = OPEN_PERMITS_SERIES.map((point) => `${xForYear(point.year)},${yForPermits(point.permits)}`).join(' ');
  const openPermitsTooltipPosition = (() => {
    if (!hoveredOpenPermitsPoint || !hoveredOpenPermitsCursor) return null;

    const tooltipGap = 12;
    const viewportPadding = 8;
    const tooltipWidth = openPermitsTooltipRef.current?.offsetWidth ?? 188;
    const tooltipHeight = openPermitsTooltipRef.current?.offsetHeight ?? 88;
    let left = hoveredOpenPermitsCursor.x + tooltipGap;
    let top = hoveredOpenPermitsCursor.y - tooltipHeight - tooltipGap;

    if (openPermitsChartRef.current && typeof window !== 'undefined') {
      const rect = openPermitsChartRef.current.getBoundingClientRect();
      const minLeft = viewportPadding - rect.left;
      const maxLeft = window.innerWidth - viewportPadding - rect.left - tooltipWidth;
      const minTop = viewportPadding - rect.top;
      const maxTop = window.innerHeight - viewportPadding - rect.top - tooltipHeight;
      const clamp = (value: number, boundA: number, boundB: number) => {
        const lower = Math.min(boundA, boundB);
        const upper = Math.max(boundA, boundB);
        return Math.min(Math.max(value, lower), upper);
      };

      if (top < minTop) {
        top = hoveredOpenPermitsCursor.y + tooltipGap;
      }

      left = clamp(left, minLeft, maxLeft);
      top = clamp(top, minTop, maxTop);
    }

    return { left, top };
  })();

  const updateOpenPermitsHover = (point: (typeof OPEN_PERMITS_SERIES)[number], event: { clientX: number; clientY: number }) => {
    if (!openPermitsChartRef.current) return;
    const rect = openPermitsChartRef.current.getBoundingClientRect();
    setHoveredOpenPermitsPoint(point);
    setHoveredOpenPermitsCursor({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const avgDaysMax = Math.max(...ADMIN_AVERAGE_DAYS.map((item) => item.value), 1);

  return (
    <WorkspaceShell
      role={user?.role}
      userSub={user?.sub}
      organizationLabel={staffProfile.agency}
      onSignOut={() => {
        logout();
        router.push('/');
      }}
    >
      {isAdmin ? (
        <PortalPageScaffold
          eyebrow="Federal Staff Portal"
          title="Federal Permit Analytics"
          subtitle={`${staffProfile.displayName} · ${staffProfile.title} · National Performance Overview`}
          actions={
            <div className="flex items-center gap-[var(--space-sm)]">
              <Dropdown
                size="sm"
                label={adminDateFilter}
                items={ADMIN_DATE_FILTER_OPTIONS.map((option) => ({
                  label: option,
                  onClick: () => setAdminDateFilter(option),
                }))}
              />
              <Button variant="primary" size="sm">View report</Button>
            </div>
          }
        >
          <div className="federal-admin-dashboard flex flex-col gap-[var(--space-md)]">
          <StaggerContainer className="grid items-stretch gap-[var(--space-md)] lg:grid-cols-12">
            <AnimatedCard className="lg:col-span-4 lg:h-full">
              <Card className="h-full bg-[var(--steel-950)]">
                <div className="flex h-full flex-col justify-between gap-[var(--space-md)]">
                  <p className="chart-card-title" style={{ marginBottom: 0 }}>Total Active Permits</p>
                  <p className="type-heading-h1 text-[var(--color-text)]">164,821</p>
                </div>
              </Card>
            </AnimatedCard>

            <AnimatedCard className="lg:col-span-8" delay={0.08}>
              <Card className="bg-[var(--color-bg-subtle)]">
                <div className="flex flex-col gap-[var(--space-md)]">
                  <div className="dashboard-open-permits-header">
                    <div className="chart-card-title" style={{ marginBottom: 0 }}>Open Permits by Date</div>
                  </div>
                  <div
                    ref={openPermitsChartRef}
                    className="relative px-[var(--space-sm)] pb-[var(--space-xs)]"
                    onMouseLeave={() => {
                      setHoveredOpenPermitsPoint(null);
                      setHoveredOpenPermitsCursor(null);
                    }}
                  >
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" role="img" aria-label="Open permits by date line chart">
                      {OPEN_PERMITS_Y_AXIS_TICKS.map((tick) => {
                        const y = yForPermits(tick);
                        return (
                          <g key={`y-${tick}`}>
                            <text
                              x={openPermitsQuantityLabelX}
                              y={y + 5}
                              textAnchor="end"
                              className="type-body-sm"
                              fill="var(--color-text-body)"
                            >
                              {formatPermitsTick(tick)}
                            </text>
                            <line
                              x1={chartPadding.left}
                              y1={y}
                              x2={chartWidth - chartPadding.right}
                              y2={y}
                              stroke="var(--color-border)"
                              strokeWidth="1"
                            />
                          </g>
                        );
                      })}

                      <polyline
                        points={openPermitsPath}
                        fill="none"
                        stroke="var(--color-text)"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />

                      {OPEN_PERMITS_SERIES.map((point) => {
                        const x = xForYear(point.year);
                        const y = yForPermits(point.permits);
                        const isHovered = hoveredOpenPermitsPoint?.year === point.year;
                        return (
                          <g key={`point-${point.year}`}>
                            <circle
                              cx={x}
                              cy={y}
                              r={isHovered ? 7 : point.year === OPEN_PERMITS_HIGHLIGHT_YEAR ? 6.5 : 6}
                              fill="var(--color-text-body-hover)"
                              stroke="var(--color-bg)"
                              strokeWidth="1.5"
                            />
                            <circle
                              cx={x}
                              cy={y}
                              r="11"
                              fill="transparent"
                              onMouseEnter={(event) => updateOpenPermitsHover(point, event)}
                              onMouseMove={(event) => updateOpenPermitsHover(point, event)}
                              onMouseLeave={() => {
                                setHoveredOpenPermitsPoint(null);
                                setHoveredOpenPermitsCursor(null);
                              }}
                            />
                          </g>
                        );
                      })}

                      {OPEN_PERMITS_X_AXIS_TICKS.map((tickYear) => (
                        <text
                          key={`x-${tickYear}`}
                          x={xForYear(tickYear)}
                          y={chartHeight - 12}
                          textAnchor="middle"
                          className="type-body-sm"
                          fill="var(--color-text-body)"
                        >
                          {tickYear}
                        </text>
                      ))}
                    </svg>
                    {hoveredOpenPermitsPoint && openPermitsTooltipPosition ? (
                      <div
                        ref={openPermitsTooltipRef}
                        className="absolute z-20 pointer-events-none chart-kpi-card"
                        style={{
                          left: openPermitsTooltipPosition.left,
                          top: openPermitsTooltipPosition.top,
                        }}
                      >
                        <div className="chart-kpi-card-title">Permits Added</div>
                        <div className="chart-kpi-card-row">
                          <span
                            className="chart-kpi-card-bullet"
                            style={{ background: 'var(--color-text-body-hover)' }}
                            aria-hidden="true"
                          />
                          <span className="chart-kpi-card-label">Total</span>
                          <span className="chart-kpi-card-value">
                            {hoveredOpenPermitsPoint.permits.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              </Card>
            </AnimatedCard>
          </StaggerContainer>

          <StaggerContainer className="grid gap-[var(--space-md)] pr-[var(--space-md)] md:pr-0 md:grid-cols-2">
            <AnimatedCard className="dashboard-av-days-card">
              <Card className="h-full bg-[var(--color-bg-subtle)]">
                <div className="flex h-full flex-col">
                  <div className="space-y-[var(--space-2xs)]">
                    <div className="chart-card-title" style={{ marginBottom: 0 }}>Av. Days Since Submission</div>
                    <p className="m-0 type-body-sm text-[var(--color-text-body)]">Target: &lt;180 days</p>
                  </div>
                  <div aria-hidden="true" style={{ height: 'var(--space-xl)' }} />
                  <div className="flex-1 min-h-[180px]" role="img" aria-label="Average days since submission by system">
                    <div className="h-full w-full flex items-end gap-[var(--space-sm)]">
                      {ADMIN_AVERAGE_DAYS.map((item) => {
                        const barPercent = Math.max((item.value / avgDaysMax) * 100, 4);
                        return (
                          <div key={item.label} className="flex h-full min-w-0 flex-1 flex-col">
                            <div className="flex-1 flex items-end pb-[var(--space-md)]">
                              <div
                                className="w-full rounded-[var(--radius-sm)] bg-[var(--chart-bar)]"
                                style={{ height: `${barPercent}%`, minHeight: '6px' }}
                              />
                            </div>
                              <div style={{ paddingTop: 'var(--space-md)' }}>
                                <p className="m-0 type-body-strong-sm text-center text-[var(--color-text)]">
                                {item.value.toLocaleString()}
                              </p>
                                <p className="m-0 mt-[var(--space-2xs)] type-body-xs text-center text-[var(--color-text-body)]">
                                {item.label}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </Card>
            </AnimatedCard>

            <AnimatedCard className="dashboard-bureau-card h-full" delay={0.08}>
              <DonutChart title="Permits by Agency" segments={ADMIN_AGENCY_BREAKDOWN} size={160} ringThickness={40} />
            </AnimatedCard>
          </StaggerContainer>

          <AnimatedCard>
            <Card className="bg-[var(--color-bg-subtle)]">
              <div className="flex items-end justify-between gap-[var(--space-md)]">
                <div className="flex flex-col gap-[var(--space-md)]">
                  <div>
                    <div className="chart-card-title" style={{ marginBottom: 0 }}>Overdue Permits</div>
                    <p className="m-0 type-body-sm text-[var(--color-text-body)]">&gt;200 days in queue</p>
                  </div>
                  <p className="m-0 type-heading-h1 text-[var(--color-error)]">3,235</p>
                </div>
                <div className="flex flex-col items-end gap-[var(--space-2xs)] text-[var(--color-error)] self-end">
                  <ArrowUp size={56} aria-hidden="true" />
                  <p className="m-0 type-body-sm">MoM +6.2%</p>
                </div>
              </div>
            </Card>
          </AnimatedCard>

          <section>
            <CompletionTracker
              title="Completion State"
              actionLabel=""
              description="Distribution of active permits by completion stage"
              segments={ADMIN_COMPLETION_STATE}
              totalApplications={164821}
            />
          </section>

          </div>
        </PortalPageScaffold>
      ) : (
        <PortalPageScaffold
          eyebrow="Federal Staff Portal"
          title={`Hello, ${managerFirstName(staffProfile.displayName)}!`}
          subtitle={`${staffProfile.title} · ${staffProfile.agency} · ${staffProfile.region} Region`}
        >
          <div className="federal-manager-dashboard flex flex-col gap-[var(--space-md)]">
          <StaggerContainer className="grid items-stretch gap-[var(--space-md)] lg:grid-cols-2">
            <AnimatedCard>
              <Card size="lg" className="h-full bg-[var(--color-bg-subtle)]">
              <div className="flex h-full flex-col gap-[var(--space-xl)]">
                <div className="flex items-center gap-[var(--space-sm)]">
                  <LucideIcon icon={BarChart3} size={20} className="text-[var(--color-icon)]" />
                  <div className="chart-card-title" style={{ marginBottom: 0 }}>Performance Overview</div>
                </div>
                <div className="relative grid flex-1 grid-cols-1 items-end gap-y-[var(--space-xl)] sm:grid-cols-2 sm:gap-x-[var(--space-2xl)] sm:gap-y-[var(--space-3xl)]">
                  <div className="space-y-[var(--space-sm)] sm:pr-[var(--space-sm)]">
                    <p className="type-heading-h1 text-[var(--color-text)]">45</p>
                    <p className="type-body-sm text-[var(--color-text-body)]">Applications in Queue</p>
                  </div>
                  <div className="space-y-[var(--space-sm)] sm:pl-[var(--space-sm)]">
                    <p className="type-heading-h1 text-[var(--color-text)]">32</p>
                    <p className="type-body-sm text-[var(--color-text-body)]">Avg Days Processing</p>
                  </div>
                  <div className="space-y-[var(--space-sm)] sm:pr-[var(--space-sm)]">
                    <p className="type-heading-h1 text-[var(--color-text)]">87%</p>
                    <p className="type-body-sm text-[var(--color-text-body)]">Staff Utilization</p>
                  </div>
                  <div className="space-y-[var(--space-sm)] sm:pl-[var(--space-sm)]">
                    <p className="type-heading-h1 text-[var(--color-error)]">8</p>
                    <p className="type-body-sm text-[var(--color-text-body)]">Overdue Applications</p>
                  </div>
                </div>
              </div>
            </Card>
            </AnimatedCard>

            <AnimatedCard delay={0.08}>
            <Card size="lg" className="h-full bg-[var(--color-bg-subtle)] manager-quick-assign-card">
              <div className="flex flex-col gap-[var(--space-lg)]">
                <div className="flex items-center gap-[var(--space-sm)]">
                  <LucideIcon icon={UserPlus} size={20} className="text-[var(--color-icon)]" />
                  <div className="chart-card-title" style={{ marginBottom: 0 }}>Quick Assign</div>
                </div>

                <div className="overflow-x-auto">
                  <table className="manager-quick-assign-table w-full table-fixed border-collapse">
                    <colgroup>
                          <col style={{ width: '68px' }} />
                      <col style={{ width: 'auto' }} />
                            <col style={{ width: '132px' }} />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-[var(--color-border)]">
                        <th className="manager-quick-assign-th text-left">
                          Status
                        </th>
                          <th className="manager-quick-assign-th manager-quick-assign-th-project text-left">
                          Project
                        </th>
                            <th className="manager-quick-assign-th manager-quick-assign-th-assignee text-left">
                          Assignee
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {QUICK_ASSIGN_ROWS.map((row, index) => {
                        const isLastRow = index === QUICK_ASSIGN_ROWS.length - 1;
                        return (
                        <tr key={`${row.project}-${index}`}>
                          <td
                            className={`align-middle ${isLastRow ? '' : 'border-b border-[var(--color-border)]'}`}
                            style={{ padding: 'var(--space-sm) var(--space-md) var(--space-sm) 0' }}
                          >
                            <Badge color={quickAssignStatusColor(row.status)} size="sm">
                              {row.status}
                            </Badge>
                          </td>
                          <td
                              className={`align-middle ${isLastRow ? '' : 'border-b border-[var(--color-border)]'}`}
                              style={{ padding: 'var(--space-sm) var(--space-md) var(--space-sm) var(--space-sm)' }}
                          >
                              <Link
                                href={`/applications/${row.applicationId}`}
                                className="block w-full truncate type-body-md text-[var(--color-text-body)] hover:text-[var(--color-text)] hover:underline focus:underline focus:outline-none"
                                title={row.project}
                              >
                                {row.project}
                              </Link>
                          </td>
                          <td
                              className={`align-middle manager-quick-assign-assignee-cell ${isLastRow ? '' : 'border-b border-[var(--color-border)]'}`}
                              style={{ padding: 'var(--space-sm) 0' }}
                          >
                              <div className="manager-quick-assign-assignee-control">
                                  <QuickAssignDropdown
                                    value={quickAssignAssignees[index] ?? row.assignee}
                                    options={QUICK_ASSIGN_ASSIGNEE_OPTIONS}
                                    onSelect={(option) =>
                                      setQuickAssignAssignees((current) => {
                                        const next = [...current];
                                        next[index] = option;
                                        return next;
                                      })
                                    }
                                    widthPx={132}
                                  />
                              </div>
                          </td>
                        </tr>
                      )})}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
            </AnimatedCard>
          </StaggerContainer>

          <section>
            <Card className="bg-[var(--color-bg-subtle)]">
              <div className="flex flex-col gap-[var(--space-md)] overflow-x-auto">
                <Table
                  header={
                    <TableHeader
                      title="Staff Overview"
                      dropdown={
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => router.push('/f/staff/staff-manager')}
                        >
                          Manage Staff
                        </Button>
                      }
                    />
                  }
                  columns={[
                    { key: 'name', header: 'Name' },
                    { key: 'office', header: 'Office' },
                    { key: 'expertise', header: 'Expertise' },
                    { key: 'role', header: 'Role' },
                    { key: 'projects', header: 'Projects' },
                    {
                      key: 'availability',
                      header: 'Availability',
                      render: (value) => (
                        <Badge color={availabilityColor(value as StaffAvailability)} size="sm">
                          {value as string}
                        </Badge>
                      ),
                    },
                  ]}
                  data={STAFF_OVERVIEW_ROWS.map((row) => ({ ...row }))}
                />
              </div>
            </Card>
          </section>
          </div>
        </PortalPageScaffold>
      )}
    </WorkspaceShell>
  );
}
