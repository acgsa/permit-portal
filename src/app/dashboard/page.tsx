'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, ChevronDown, UserPlus } from 'lucide-react';
import { LucideIcon } from '@/components/LucideIcon';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { PortalPageScaffold } from '@/components/PortalPageScaffold';
import { useAuth } from '@/contexts/AuthContext';
import {
  Badge,
  BarChart,
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
  { status: 'NEW', project: 'Right of Way for Lake Mead Parkway', assignee: 'None' },
  { status: 'NEW', project: 'Pine Valley Reservoir Expansion Project', assignee: 'None' },
  { status: 'OVERDUE', project: 'Lower Colorado River Pipeline Crossing', assignee: 'Reece Randal' },
  { status: 'OVERDUE', project: 'Pine Valley Reservoir Expansion Project', assignee: 'Reece Randal' },
  { status: 'OVERDUE', project: 'Rio Grande Diversion Structure Rehab', assignee: 'Reece Randal' },
];

const STAFF_OVERVIEW_ROWS: StaffOverviewRow[] = [
  { name: 'Nancy Coleman', office: 'Bend Field Office', expertise: 'Realty Specialist', role: 'Land Appraisal', projects: 8, availability: 'BUSY' },
  { name: 'Jennifer Hoff', office: 'Columbia-Cascades Area Office', expertise: 'Realty Specialist', role: 'Land Appraisal', projects: 2, availability: 'AVAILABLE' },
  { name: 'Clyde Lay', office: 'Ephrata Field Office', expertise: 'Deputy Field Office Manager', role: 'Land Appraisal', projects: 0, availability: 'AVAILABLE' },
  { name: 'Nasha Flores', office: 'Grand Coulee Dam', expertise: 'Realty Specialist', role: 'Land Appraisal', projects: 23, availability: 'OVERLOADED' },
  { name: 'Malyn Abney', office: 'Middle Snake Field Office', expertise: 'Realty Specialist', role: 'Land Appraisal', projects: 11, availability: 'BUSY' },
  { name: 'Reece Randal', office: 'Snake River Area Office', expertise: 'Realty Specialist', role: 'Land Appraisal', projects: 17, availability: 'OVERLOADED' },
  { name: 'Jason Brunk', office: 'Upper Snake Field Office', expertise: 'Realty Specialist', role: 'Land Appraisal', projects: 7, availability: 'AVAILABLE' },
  { name: 'Jennifer Hoff', office: 'Yakima Field Office', expertise: 'Realty Specialist', role: 'Land Appraisal', projects: 2, availability: 'AVAILABLE' },
  { name: 'Vacant', office: 'Umatilla Field Office', expertise: 'Realty Specialist', role: 'Land Appraisal', projects: 0, availability: 'AVAILABLE' },
];

const ADMIN_BUREAU_BREAKDOWN = [
  { label: 'BLM', value: 155846, colorVar: 'var(--chart-1)' },
  { label: 'BIA', value: 5177, colorVar: 'var(--chart-2)' },
  { label: 'FWS', value: 2364, colorVar: 'var(--chart-3)' },
  { label: 'BSEE', value: 1738, colorVar: 'var(--chart-4)' },
];

const ADMIN_COMPLETION_STATE = [
  { label: 'Submitted', percent: 12, colorVar: 'var(--steel-300)', hoverColorVar: 'var(--steel-400)', texture: 'stripes' as const },
  { label: 'Overdue', percent: 62, colorVar: 'var(--red-500)', hoverColorVar: 'var(--red-600)', texture: 'crosshatch' as const },
  { label: 'Awaiting Info', percent: 12, colorVar: 'var(--gold-400)', hoverColorVar: 'var(--gold-500)', texture: 'dots' as const },
  { label: 'In Progress', percent: 8, colorVar: 'var(--blue-400)', hoverColorVar: 'var(--blue-500)', texture: 'stripes-alt' as const },
  { label: 'Approved', percent: 47, colorVar: 'var(--green-500)', hoverColorVar: 'var(--green-600)', texture: 'stripes' as const },
  { label: 'Rejected', percent: 13, colorVar: 'var(--steel-700)', hoverColorVar: 'var(--steel-800)', texture: 'dots' as const },
];

const ADMIN_LINE_POINTS = [
  { x: 0, y: 170 },
  { x: 42, y: 170 },
  { x: 84, y: 168 },
  { x: 126, y: 44 },
  { x: 168, y: 152 },
  { x: 210, y: 138 },
  { x: 252, y: 122 },
  { x: 294, y: 150 },
  { x: 336, y: 68 },
  { x: 378, y: 150 },
  { x: 420, y: 168 },
  { x: 462, y: 146 },
  { x: 504, y: 166 },
  { x: 546, y: 152 },
  { x: 588, y: 150 },
  { x: 630, y: 149 },
  { x: 672, y: 148 },
  { x: 714, y: 88 },
  { x: 756, y: 150 },
  { x: 798, y: 152 },
  { x: 840, y: 168 },
  { x: 882, y: 150 },
  { x: 924, y: 150 },
  { x: 966, y: 96 },
];

const ADMIN_AVERAGE_DAYS = [
  { label: 'NEPA', value: 2291 },
  { label: 'MLRS', value: 1805 },
  { label: 'ePlanning', value: 1202 },
  { label: 'NFLSS', value: 1167 },
];

const ADMIN_DATE_FILTER_OPTIONS = ['July 20-27, 2025'];
const ADMIN_PERMIT_FILTER_OPTIONS = ['All Permits'];
const ADMIN_BUREAU_FILTER_OPTIONS = ['All Bureaus'];
const QUICK_ASSIGN_ASSIGNEE_OPTIONS = ['None', 'Reece Randal', 'Nancy Coleman', 'Jennifer Hoff', 'Clyde Lay'];

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

export default function DashboardPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const isStaffUser = user?.role === 'staff' || user?.role === 'admin';
  const [adminDateFilter, setAdminDateFilter] = useState(ADMIN_DATE_FILTER_OPTIONS[0]);
  const [adminPermitFilter, setAdminPermitFilter] = useState(ADMIN_PERMIT_FILTER_OPTIONS[0]);
  const [adminBureauFilter, setAdminBureauFilter] = useState(ADMIN_BUREAU_FILTER_OPTIONS[0]);
  const [quickAssignAssignees, setQuickAssignAssignees] = useState<string[]>(() =>
    QUICK_ASSIGN_ROWS.map((row) => row.assignee),
  );

  useEffect(() => {
    if (token && !isStaffUser) {
      router.replace('/home');
    }
  }, [token, isStaffUser, router]);

  if (!token) return null;

  if (!isStaffUser) {
    return null;
  }

  const staffProfile = resolveStaffProfile(user?.sub, user?.role);
  const isAdmin = staffProfile.role === 'admin';
  const chartPath = ADMIN_LINE_POINTS.map((point) => `${point.x},${point.y}`).join(' ');

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
              <Dropdown
                size="sm"
                label={adminPermitFilter}
                items={ADMIN_PERMIT_FILTER_OPTIONS.map((option) => ({
                  label: option,
                  onClick: () => setAdminPermitFilter(option),
                }))}
              />
            </div>
          }
        >
          <section className="grid gap-[var(--space-md)] lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Card>
                <div className="flex flex-col gap-[var(--space-md)]">
                  <div className="flex items-center gap-[var(--space-xs)] text-[var(--color-text-body)]">
                    <p className="type-body-sm font-semibold text-[var(--color-text)]">Total Permits</p>
                    <span aria-hidden="true">|</span>
                    <p className="type-body-sm">Open Permits</p>
                  </div>
                  <p className="mt-[var(--space-2xl)] text-[56px] font-semibold leading-none text-[var(--color-text)]">164,821</p>
                </div>
              </Card>
            </div>

            <div className="lg:col-span-8">
              <Card>
                <div className="flex flex-col gap-[var(--space-md)]">
                  <div className="flex items-center justify-between gap-[var(--space-sm)]">
                    <h3 className="type-heading-h6 text-[var(--color-text)]">Open Permits by Date</h3>
                    <div className="flex items-center gap-[var(--space-sm)]">
                      <Dropdown
                        size="sm"
                        label={adminBureauFilter}
                        items={ADMIN_BUREAU_FILTER_OPTIONS.map((option) => ({
                          label: option,
                          onClick: () => setAdminBureauFilter(option),
                        }))}
                      />
                      <Button variant="outline" size="sm">View report</Button>
                    </div>
                  </div>
                  <div className="h-[220px] rounded-[var(--radius-sm)] border border-[var(--color-border)] bg-[var(--color-bg-subtle)] px-[var(--space-md)] py-[var(--space-sm)]">
                    <svg viewBox="0 0 980 200" className="h-full w-full" role="img" aria-label="Open permits trend line">
                      {[0, 1, 2, 3, 4].map((row) => (
                        <line
                          key={row}
                          x1="0"
                          y1={20 + row * 40}
                          x2="980"
                          y2={20 + row * 40}
                          stroke="var(--color-border)"
                          strokeWidth="1"
                        />
                      ))}
                      <polyline
                        points={chartPath}
                        fill="none"
                        stroke="#243651"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        strokeLinecap="round"
                      />
                      {ADMIN_LINE_POINTS.map((point, index) => (
                        <circle key={`${point.x}-${point.y}-${index}`} cx={point.x} cy={point.y} r="5" fill="#0F3A5A" />
                      ))}
                    </svg>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          <section className="grid gap-[var(--space-md)] md:grid-cols-2 xl:grid-cols-4">
            <BarChart title="Av. Days Since Submission" items={ADMIN_AVERAGE_DAYS} />

            <DonutChart title="Permits by Bureau" segments={ADMIN_BUREAU_BREAKDOWN} size={136} />

            <Card>
              <div className="flex h-full flex-col gap-[var(--space-sm)]">
                <div className="space-y-[var(--space-sm)]">
                  <h3 className="type-body-sm text-[var(--color-text-body)]">Overdue Permits</h3>
                  <p className="type-body-sm text-[var(--color-text-body)]">&gt;200 days in queue</p>
                </div>
                <p className="mt-[var(--space-xl)] text-[56px] font-semibold leading-none text-[var(--color-text)]">3,235</p>
              </div>
            </Card>

            <Card>
              <div className="flex h-full flex-col gap-[var(--space-sm)]">
                <div className="space-y-[var(--space-sm)]">
                  <h3 className="type-body-sm text-[var(--color-text-body)]">Blockage Meter</h3>
                  <p className="type-body-sm text-[var(--color-text-body)]">Based on old queued permits</p>
                </div>
                <div className="mt-[var(--space-md)] flex justify-center">
                  <div
                    aria-hidden="true"
                    className="relative h-[152px] w-[152px] rounded-full"
                    style={{
                      background: 'conic-gradient(from 180deg, #66B548 0deg 110deg, #D9C748 110deg 170deg, #B7315B 170deg 300deg, transparent 300deg 360deg)',
                    }}
                  >
                    <div className="absolute inset-[16px] rounded-full bg-[var(--color-bg)]" />
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[var(--color-bg)]" />
                  </div>
                </div>
                <p className="mt-[var(--space-sm)] type-body-strong-sm text-center text-[var(--color-error)]">Blocked</p>
              </div>
            </Card>
          </section>

          <section>
            <CompletionTracker
              title="Completion State"
              actionLabel="View report"
              description="Distribution of active permits by completion stage."
              segments={ADMIN_COMPLETION_STATE}
              totalApplications={164821}
            />
          </section>

          <section className="flex flex-wrap gap-[var(--space-sm)]">
            <Button variant="outline" size="sm" onClick={() => router.push('/staff/admin-controls')}>
              Open Admin Controls
            </Button>
            <Button variant="outline" size="sm" onClick={() => router.push('/staff/workflow-manager')}>
              Workflow Manager
            </Button>
          </section>
        </PortalPageScaffold>
      ) : (
        <PortalPageScaffold
          eyebrow="Federal Staff Portal"
          title={`Hello, ${managerFirstName(staffProfile.displayName)}!`}
          subtitle={`${staffProfile.title} · ${staffProfile.agency} · ${staffProfile.region} Region`}
        >
          <section className="grid items-start gap-[var(--space-md)] lg:grid-cols-2">
            <Card size="lg">
              <div className="flex flex-col gap-[var(--space-xl)]">
                <div className="flex items-center gap-[var(--space-sm)]">
                  <LucideIcon icon={BarChart3} size={24} className="text-[var(--color-icon)]" />
                  <h3 className="type-heading-h5 text-[var(--color-text)]">Performance Overview</h3>
                </div>
                <div className="relative grid grid-cols-2 gap-x-[var(--space-2xl)] gap-y-[var(--space-3xl)]">
                  <div className="space-y-[var(--space-sm)] pr-[var(--space-sm)]">
                    <p className="type-heading-h1 text-[var(--color-text)]">45</p>
                    <p className="type-body-sm text-[var(--color-text-body)]">Applications in Queue</p>
                  </div>
                  <div className="space-y-[var(--space-sm)] pl-[var(--space-sm)]">
                    <p className="type-heading-h1 text-[var(--color-text)]">32 days</p>
                    <p className="type-body-sm text-[var(--color-text-body)]">Average Processing Time</p>
                  </div>
                  <div className="space-y-[var(--space-sm)] pr-[var(--space-sm)]">
                    <p className="type-heading-h1 text-[var(--color-text)]">87%</p>
                    <p className="type-body-sm text-[var(--color-text-body)]">Staff Utilization</p>
                  </div>
                  <div className="space-y-[var(--space-sm)] pl-[var(--space-sm)]">
                    <p className="type-heading-h1 text-[var(--color-error)]">8</p>
                    <p className="type-body-sm text-[var(--color-text-body)]">Overdue Applications</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card size="lg">
              <div className="flex flex-col gap-[var(--space-lg)]">
                <div className="flex items-center gap-[var(--space-sm)]">
                  <LucideIcon icon={UserPlus} size={24} className="text-[var(--color-icon)]" />
                  <h3 className="type-heading-h5 text-[var(--color-text)]">Quick Assign</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full table-fixed border-collapse">
                    <colgroup>
                      <col style={{ width: '130px' }} />
                      <col style={{ width: 'auto' }} />
                      <col style={{ width: '340px' }} />
                    </colgroup>
                    <thead>
                      <tr className="border-b border-[var(--color-border)]">
                        <th
                          className="text-left type-heading-h6 text-[var(--color-text)]"
                          style={{ padding: 'var(--space-sm) 0' }}
                        >
                          Status
                        </th>
                        <th
                          className="text-left type-heading-h6 text-[var(--color-text)]"
                          style={{ padding: 'var(--space-sm) 0' }}
                        >
                          Project
                        </th>
                        <th
                          className="text-left type-heading-h6 text-[var(--color-text)]"
                          style={{ padding: 'var(--space-sm) 0' }}
                        >
                          Assignee
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {QUICK_ASSIGN_ROWS.map((row, index) => (
                        <tr key={`${row.project}-${index}`} className="border-b border-[var(--color-border)]">
                          <td
                            className="align-middle border-b border-[var(--color-border)]"
                            style={{ padding: 'var(--space-xs) 0' }}
                          >
                            <Badge color={quickAssignStatusColor(row.status)} size="sm">
                              {row.status}
                            </Badge>
                          </td>
                          <td
                            className="align-middle border-b border-[var(--color-border)] type-heading-h5 text-[var(--color-text-body)]"
                            style={{ padding: 'var(--space-xs) 0' }}
                          >
                            <p className="block w-full truncate">{row.project}</p>
                          </td>
                          <td
                            className="align-middle border-b border-[var(--color-border)]"
                            style={{ padding: 'var(--space-xs) 0' }}
                          >
                            <Dropdown
                              size="sm"
                              trigger={
                                <button
                                  type="button"
                                  className="dropdown-trigger dropdown-trigger-sm w-full"
                                  style={{
                                    justifyContent: 'space-between',
                                    gap: 'var(--space-xs)',
                                  }}
                                >
                                  <span>{quickAssignAssignees[index] ?? row.assignee}</span>
                                  <ChevronDown size={16} aria-hidden="true" />
                                </button>
                              }
                              items={QUICK_ASSIGN_ASSIGNEE_OPTIONS.map((option) => ({
                                label: option,
                                onClick: () =>
                                  setQuickAssignAssignees((current) => {
                                    const next = [...current];
                                    next[index] = option;
                                    return next;
                                  }),
                              }))}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
          </section>

          <section>
            <Card>
              <div className="flex flex-col gap-[var(--space-md)]">
                <Table
                  header={
                    <TableHeader
                      title="Staff Overview"
                      dropdown={<Button variant="outline" size="sm">Manage Staff</Button>}
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
        </PortalPageScaffold>
      )}
    </WorkspaceShell>
  );
}
