export type StaffAccessRole = 'admin' | 'staff';

export type StaffProfile = {
  id: string;
  displayName: string;
  email: string;
  role: StaffAccessRole;
  title: string;
  agency: string;
  region: string;
};

export type FederalApplicationRecord = {
  id: string;
  applicantName: string;
  permitType: string;
  agency: string;
  region: string;
  status: 'Submitted' | 'In Review' | 'Pending Interagency' | 'Approved';
  assignedReviewer: string;
  submittedDate: string;
  updatedDate: string;
};

export const STAFF_DEMO_USERS: ReadonlyArray<StaffProfile> = [
  {
    id: 'doug-burgum',
    displayName: 'Doug Burgum',
    email: 'doug.burgum@doi.gov',
    role: 'admin',
    title: 'Secretary of the Interior',
    agency: 'Department of the Interior',
    region: 'All Regions',
  },
  {
    id: 'harmony-munro',
    displayName: 'Harmony Munro',
    email: 'harmony.munro@usbr.gov',
    role: 'staff',
    title: 'Regional Manager',
    agency: 'Bureau of Reclamation',
    region: 'Upper Colorado',
  },
];

export const FEDERAL_APPLICATION_MOCK_DATA: ReadonlyArray<FederalApplicationRecord> = [
  {
    id: 'DOI-2026-0012',
    applicantName: 'Mesa County Water District',
    permitType: 'Water Infrastructure Modernization',
    agency: 'Bureau of Reclamation',
    region: 'Upper Colorado',
    status: 'In Review',
    assignedReviewer: 'Harmony Munro',
    submittedDate: '2026-02-04',
    updatedDate: '2026-03-21',
  },
  {
    id: 'DOI-2026-0018',
    applicantName: 'Pueblo Renewable Cooperative',
    permitType: 'Hydropower Grid Interconnection',
    agency: 'Bureau of Reclamation',
    region: 'Upper Colorado',
    status: 'Pending Interagency',
    assignedReviewer: 'Harmony Munro',
    submittedDate: '2026-02-18',
    updatedDate: '2026-03-19',
  },
  {
    id: 'DOI-2026-0021',
    applicantName: 'Navajo Basin Utilities',
    permitType: 'Reservoir Safety Modification',
    agency: 'Bureau of Reclamation',
    region: 'Upper Colorado',
    status: 'Submitted',
    assignedReviewer: 'Harmony Munro',
    submittedDate: '2026-03-10',
    updatedDate: '2026-03-20',
  },
  {
    id: 'DOI-2026-0010',
    applicantName: 'Evergreen Transit Authority',
    permitType: 'Right-of-Way Environmental Review',
    agency: 'Bureau of Land Management',
    region: 'Pacific Northwest',
    status: 'In Review',
    assignedReviewer: 'Avery Ellis',
    submittedDate: '2026-01-28',
    updatedDate: '2026-03-18',
  },
  {
    id: 'DOI-2026-0015',
    applicantName: 'Sonoran Habitat Alliance',
    permitType: 'Protected Species Impact Assessment',
    agency: 'Fish and Wildlife Service',
    region: 'Southwest',
    status: 'Pending Interagency',
    assignedReviewer: 'J. Patel',
    submittedDate: '2026-02-11',
    updatedDate: '2026-03-22',
  },
  {
    id: 'DOI-2026-0007',
    applicantName: 'Northern Plateau Energy',
    permitType: 'Transmission Corridor Permit',
    agency: 'Bureau of Indian Affairs',
    region: 'Great Plains',
    status: 'Approved',
    assignedReviewer: 'R. Chavez',
    submittedDate: '2026-01-15',
    updatedDate: '2026-03-08',
  },
];

export function resolveStaffProfile(userSub?: string, role?: string): StaffProfile {
  const normalized = (userSub ?? '').toLowerCase();
  const harmony = STAFF_DEMO_USERS.find((user) => user.id === 'harmony-munro');
  const doug = STAFF_DEMO_USERS.find((user) => user.id === 'doug-burgum');

  if (normalized.includes('harmony.munro') && harmony) {
    return harmony;
  }

  if (normalized.includes('doug.burgum') && doug) {
    return doug;
  }

  if (role === 'admin' && doug) {
    return doug;
  }

  return harmony ?? STAFF_DEMO_USERS[0];
}

export function getVisibleFederalApplications(profile: StaffProfile): FederalApplicationRecord[] {
  if (profile.role === 'admin') {
    return [...FEDERAL_APPLICATION_MOCK_DATA];
  }

  return FEDERAL_APPLICATION_MOCK_DATA.filter((record) => record.region === profile.region);
}
