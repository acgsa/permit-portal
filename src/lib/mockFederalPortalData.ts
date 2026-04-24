import type { CaseEvent } from '@/types/pic';

export type StaffAccessRole = 'admin' | 'staff';

export type SF299SubmissionData = {
  projectTitle: string;
  applicantOrganization: string;
  contactName: string;
  contactEmail: string;
  projectLocation: string;
  stateCode: string;
  corridorLengthMiles: string;
  projectDescription: string;
  agencyCode: string;
  region: string;
  legalAuthority: string;
  submittedDate: string;
};

export type StaffProjectNote = {
  id: number;
  author: string;
  date: string;
  body: string;
};

export type PaymentRecord = {
  id: string;
  applicationId: string;
  applicantName: string;
  feeType: string;
  amount: number;
  status: 'pending' | 'paid' | 'waived';
  paymentDate?: string;
  paygovTrackingId?: string;
  agency: string;
};

export type StaffTaskRow = {
  id: number;
  taskName: string;
  applicationId: string;
  applicantName: string;
  projectId: string;
  statusKey: 'in-progress' | 'not-started' | 'complete' | 'overdue';
  updatedLabel: string;
};

export type StaffMessageRow = {
  id: number;
  subject: string;
  sender: string;
  statusKey: 'unread' | 'read' | 'archived';
  receivedLabel: string;
};

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
    id: 'doug-smith',
    displayName: 'Doug Smith',
    email: 'doug.smith@domain.gov',
    role: 'admin',
    title: 'Secretary of the Interior',
    agency: 'Department of the Interior',
    region: 'All Regions',
  },
  {
    id: 'sarah-jones',
    displayName: 'Sarah Jones',
    email: 'sarah.jones@domain.gov',
    role: 'staff',
    title: 'Regional Manager',
    agency: 'Bureau of Reclamation',
    region: 'Upper Colorado',
  },
  {
    id: 'karen-mitchell',
    displayName: 'Karen Mitchell',
    email: 'k.mitchell@domain.gov',
    role: 'staff',
    title: 'Realty Specialist',
    agency: 'Bureau of Reclamation',
    region: 'Upper Colorado',
  },
  {
    id: 'laura-bennett',
    displayName: 'Laura Bennett',
    email: 'l.bennett@domain.gov',
    role: 'staff',
    title: 'Realty Specialist',
    agency: 'Bureau of Reclamation',
    region: 'Upper Colorado',
  },
  {
    id: 'robert-hayes',
    displayName: 'Robert Hayes',
    email: 'r.hayes@domain.gov',
    role: 'staff',
    title: 'Deputy Field Office Manager',
    agency: 'Bureau of Reclamation',
    region: 'Upper Colorado',
  },
  {
    id: 'maria-santos',
    displayName: 'Maria Santos',
    email: 'm.santos@domain.gov',
    role: 'staff',
    title: 'Realty Specialist',
    agency: 'Bureau of Reclamation',
    region: 'Upper Colorado',
  },
  {
    id: 'tanya-brooks',
    displayName: 'Tanya Brooks',
    email: 't.brooks@domain.gov',
    role: 'staff',
    title: 'Realty Specialist',
    agency: 'Bureau of Reclamation',
    region: 'Upper Colorado',
  },
  {
    id: 'derek-walsh',
    displayName: 'Derek Walsh',
    email: 'd.walsh@domain.gov',
    role: 'staff',
    title: 'Realty Specialist',
    agency: 'Bureau of Reclamation',
    region: 'Upper Colorado',
  },
  {
    id: 'brian-foster',
    displayName: 'Brian Foster',
    email: 'b.foster@domain.gov',
    role: 'staff',
    title: 'Realty Specialist',
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
    assignedReviewer: 'Sarah Jones',
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
    assignedReviewer: 'Sarah Jones',
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
    assignedReviewer: 'Sarah Jones',
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
    assignedReviewer: 'Michael Torres',
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
    assignedReviewer: 'J. Williams',
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
    assignedReviewer: 'R. Anderson',
    submittedDate: '2026-01-15',
    updatedDate: '2026-03-08',
  },
];

export const STAFF_SF299_SUBMISSIONS: Record<string, SF299SubmissionData> = {
  'DOI-2026-0012': {
    projectTitle: 'Mesa County Water Infrastructure Modernization',
    applicantOrganization: 'Mesa County Water District',
    contactName: 'Patricia Donovan',
    contactEmail: 'p.donovan@domain.gov',
    projectLocation: 'Mesa County, CO — Grand Valley Canal System',
    stateCode: 'CO',
    corridorLengthMiles: '14.2',
    projectDescription:
      'Replacement of aging concrete-lined irrigation canals with enclosed pipeline infrastructure to reduce seepage losses, improve water delivery efficiency, and restore habitat along the Grand Valley Canal corridor.',
    agencyCode: 'BOR',
    region: 'Upper Colorado',
    legalAuthority: '43 CFR 429 – Use of Bureau of Reclamation Land, Facilities, and Waters',
    submittedDate: '2026-02-04',
  },
  'DOI-2026-0018': {
    projectTitle: 'Hydropower Grid Interconnection — Pueblo South Station',
    applicantOrganization: 'Pueblo Renewable Cooperative',
    contactName: 'Marcus Webb',
    contactEmail: 'm.webb@domain.gov',
    projectLocation: 'Pueblo County, CO — Arkansas River Basin',
    stateCode: 'CO',
    corridorLengthMiles: '6.8',
    projectDescription:
      'Construction of a 6.8-mile transmission line corridor and switchyard upgrades to interconnect the proposed 12 MW run-of-river hydropower facility at Pueblo South Station with the regional grid.',
    agencyCode: 'BOR',
    region: 'Upper Colorado',
    legalAuthority: '43 CFR 429 – Use of Bureau of Reclamation Land, Facilities, and Waters',
    submittedDate: '2026-02-18',
  },
  'DOI-2026-0021': {
    projectTitle: 'Navajo Reservoir Safety Modification Program',
    applicantOrganization: 'Navajo Basin Utilities',
    contactName: 'Christine Yazzie',
    contactEmail: 'c.yazzie@domain.gov',
    projectLocation: 'San Juan County, NM — Navajo Reservoir',
    stateCode: 'NM',
    corridorLengthMiles: '3.1',
    projectDescription:
      'Structural modifications to the auxiliary spillway and abutment remediation work at Navajo Reservoir to address identified deficiencies and bring the structure into compliance with current dam safety standards.',
    agencyCode: 'BOR',
    region: 'Upper Colorado',
    legalAuthority: '43 CFR 429 – Use of Bureau of Reclamation Land, Facilities, and Waters',
    submittedDate: '2026-03-10',
  },
  'DOI-2026-0010': {
    projectTitle: 'Evergreen Corridor Right-of-Way Environmental Review',
    applicantOrganization: 'Evergreen Transit Authority',
    contactName: 'Daniel Park',
    contactEmail: 'd.park@domain.gov',
    projectLocation: 'King County, WA — Cascade Foothills Corridor',
    stateCode: 'WA',
    corridorLengthMiles: '22.5',
    projectDescription:
      'Environmental review and right-of-way authorization for a 22.5-mile light rail extension crossing BLM-administered lands in the Cascade Foothills corridor, including bridge crossings over two perennial streams.',
    agencyCode: 'BLM',
    region: 'Pacific Northwest',
    legalAuthority: '43 CFR 2800 – Rights-of-Way',
    submittedDate: '2026-01-28',
  },
  'DOI-2026-0015': {
    projectTitle: 'Sonoran Desert Protected Species Impact Assessment',
    applicantOrganization: 'Sonoran Habitat Alliance',
    contactName: 'Yolanda Reyes',
    contactEmail: 'y.reyes@domain.gov',
    projectLocation: 'Pima County, AZ — Sonoran Desert NCA',
    stateCode: 'AZ',
    corridorLengthMiles: '0',
    projectDescription:
      'Formal assessment of potential impacts to Saguaro cactus ferruginous pygmy-owl and desert tortoise populations resulting from the proposed Sonoran Solar I facility located adjacent to the National Conservation Area boundary.',
    agencyCode: 'FWS',
    region: 'Southwest',
    legalAuthority: '16 U.S.C. § 1536 – Endangered Species Act Section 7',
    submittedDate: '2026-02-11',
  },
  'DOI-2026-0007': {
    projectTitle: 'Northern Plateau Transmission Corridor Permit',
    applicantOrganization: 'Northern Plateau Energy',
    contactName: 'Brian Colton',
    contactEmail: 'b.colton@domain.gov',
    projectLocation: 'Standing Rock Sioux Tribe Territory, ND/SD',
    stateCode: 'ND',
    corridorLengthMiles: '47.3',
    projectDescription:
      'Right-of-way permit for a 47.3-mile 230kV transmission line crossing BIA-administered trust lands to interconnect the proposed 200 MW wind generation facility with the regional transmission system.',
    agencyCode: 'BIA',
    region: 'Great Plains',
    legalAuthority: '25 CFR 169 – Rights-of-Way Over Indian Land',
    submittedDate: '2026-01-15',
  },
};

export const STAFF_PROJECT_NOTES: Record<string, StaffProjectNote[]> = {
  'DOI-2026-0012': [
    {
      id: 1,
      author: 'Sarah Jones',
      date: '2026-03-04',
      body: 'Application deemed complete. Initiated coordination with BOR Hydraulics Group for seepage modeling review. Expect preliminary comments by end of March.',
    },
    {
      id: 2,
      author: 'Karen Mitchell',
      date: '2026-03-14',
      body: 'Cultural resources survey report received and forwarded to SHPO. No conflicts identified with the proposed pipeline alignment. Recommend proceeding to CX determination.',
    },
    {
      id: 3,
      author: 'Sarah Jones',
      date: '2026-03-21',
      body: 'Fee assessment completed. Applicant notified of $4,200 processing fee. Awaiting Pay.gov payment confirmation before routing to interagency review.',
    },
  ],
  'DOI-2026-0018': [
    {
      id: 1,
      author: 'Robert Hayes',
      date: '2026-03-01',
      body: 'Completeness review identified missing hydraulic study. RFI issued to applicant on Feb 28. Response deadline is March 28.',
    },
    {
      id: 2,
      author: 'Sarah Jones',
      date: '2026-03-19',
      body: 'Hydraulic study received and accepted. Application now complete. Routing to USFWS for informal ESA Section 7 consultation. Pending Interagency status confirmed.',
    },
  ],
};

export const STAFF_APPROVAL_STEPS: Record<string, CaseEvent[]> = {
  'DOI-2026-0012': [
    { id: 1, parent_process_id: 1, name: 'Completeness Review', type: 'Review', tier: 1, status: 'completed', datetime: '2026-02-15T00:00:00Z', assigned_entity: 'Karen Mitchell', description: 'Application reviewed for completeness per 43 CFR 429.' },
    { id: 2, parent_process_id: 1, name: 'Field Office Review', type: 'Review', tier: 1, status: 'completed', datetime: '2026-03-05T00:00:00Z', assigned_entity: 'Sarah Jones', description: 'Technical review by field office realty and engineering staff.' },
    { id: 3, parent_process_id: 1, name: 'Fee Assessment', type: 'Administrative', tier: 1, status: 'completed', datetime: '2026-03-21T00:00:00Z', assigned_entity: 'Sarah Jones', description: 'Processing fee calculated and applicant notified.' },
    { id: 4, parent_process_id: 1, name: 'Applicant Payment', type: 'Payment', tier: 1, status: 'in progress', datetime: '2026-04-04T00:00:00Z', assigned_entity: 'Applicant', description: 'Applicant submits processing fee via Pay.gov.' },
    { id: 5, parent_process_id: 1, name: 'Interagency Consultation', type: 'Consultation', tier: 1, status: 'pending', datetime: '2026-04-18T00:00:00Z', assigned_entity: 'BOR / USFWS', description: 'Coordination with cooperating agencies per NEPA regulations.' },
    { id: 6, parent_process_id: 1, name: 'NEPA Determination', type: 'Decision', tier: 1, status: 'pending', datetime: '2026-05-15T00:00:00Z', assigned_entity: 'BOR NEPA Team', description: 'Categorical exclusion or EA determination.' },
    { id: 7, parent_process_id: 1, name: 'Final Signature', type: 'Decision', tier: 1, status: 'pending', datetime: '2026-06-01T00:00:00Z', assigned_entity: 'Authorized Officer', description: 'Authorized officer signature on right-of-way grant.' },
  ],
  'DOI-2026-0018': [
    { id: 1, parent_process_id: 2, name: 'Completeness Review', type: 'Review', tier: 1, status: 'completed', datetime: '2026-03-01T00:00:00Z', assigned_entity: 'Robert Hayes', description: 'RFI issued for missing hydraulic study.' },
    { id: 2, parent_process_id: 2, name: 'Field Office Review', type: 'Review', tier: 1, status: 'in progress', datetime: '2026-03-22T00:00:00Z', assigned_entity: 'Sarah Jones', description: 'Technical review underway following receipt of hydraulic study.' },
    { id: 3, parent_process_id: 2, name: 'Fee Assessment', type: 'Administrative', tier: 1, status: 'pending', datetime: '2026-04-05T00:00:00Z', assigned_entity: 'Sarah Jones', description: 'Processing fee to be calculated.' },
    { id: 4, parent_process_id: 2, name: 'Applicant Payment', type: 'Payment', tier: 1, status: 'pending', datetime: '2026-04-19T00:00:00Z', assigned_entity: 'Applicant', description: 'Applicant submits processing fee via Pay.gov.' },
    { id: 5, parent_process_id: 2, name: 'Interagency Consultation', type: 'Consultation', tier: 1, status: 'in progress', datetime: '2026-03-19T00:00:00Z', assigned_entity: 'USFWS', description: 'Informal Section 7 consultation in progress with USFWS.' },
    { id: 6, parent_process_id: 2, name: 'NEPA Determination', type: 'Decision', tier: 1, status: 'pending', datetime: '2026-05-20T00:00:00Z', assigned_entity: 'BOR NEPA Team', description: 'EA determination pending consultation outcome.' },
    { id: 7, parent_process_id: 2, name: 'Final Signature', type: 'Decision', tier: 1, status: 'pending', datetime: '2026-06-15T00:00:00Z', assigned_entity: 'Authorized Officer', description: 'Authorized officer signature on right-of-way grant.' },
  ],
  'DOI-2026-0021': [
    { id: 1, parent_process_id: 3, name: 'Completeness Review', type: 'Review', tier: 1, status: 'pending', datetime: '2026-03-25T00:00:00Z', assigned_entity: 'Karen Mitchell', description: 'Initial completeness review not yet started.' },
    { id: 2, parent_process_id: 3, name: 'Field Office Review', type: 'Review', tier: 1, status: 'pending', datetime: '2026-04-08T00:00:00Z', assigned_entity: 'Sarah Jones', description: 'Technical review pending completeness.' },
    { id: 3, parent_process_id: 3, name: 'Fee Assessment', type: 'Administrative', tier: 1, status: 'pending', datetime: '2026-04-22T00:00:00Z', assigned_entity: 'Sarah Jones', description: 'Fee assessment pending.' },
    { id: 4, parent_process_id: 3, name: 'Applicant Payment', type: 'Payment', tier: 1, status: 'pending', datetime: '2026-05-06T00:00:00Z', assigned_entity: 'Applicant', description: 'Applicant submits processing fee via Pay.gov.' },
    { id: 5, parent_process_id: 3, name: 'Interagency Consultation', type: 'Consultation', tier: 1, status: 'pending', datetime: '2026-05-20T00:00:00Z', assigned_entity: 'BOR / USACE', description: 'Agency consultation pending.' },
    { id: 6, parent_process_id: 3, name: 'NEPA Determination', type: 'Decision', tier: 1, status: 'pending', datetime: '2026-06-10T00:00:00Z', assigned_entity: 'BOR NEPA Team', description: 'NEPA determination pending.' },
    { id: 7, parent_process_id: 3, name: 'Final Signature', type: 'Decision', tier: 1, status: 'pending', datetime: '2026-07-01T00:00:00Z', assigned_entity: 'Authorized Officer', description: 'Final authorization pending.' },
  ],
  'DOI-2026-0010': [
    { id: 1, parent_process_id: 4, name: 'Completeness Review', type: 'Review', tier: 1, status: 'completed', datetime: '2026-02-10T00:00:00Z', assigned_entity: 'M. Torres', description: 'Application complete.' },
    { id: 2, parent_process_id: 4, name: 'Field Office Review', type: 'Review', tier: 1, status: 'in progress', datetime: '2026-02-28T00:00:00Z', assigned_entity: 'M. Torres', description: 'Field office review underway.' },
    { id: 3, parent_process_id: 4, name: 'Fee Assessment', type: 'Administrative', tier: 1, status: 'pending', datetime: '2026-03-28T00:00:00Z', assigned_entity: 'M. Torres', description: 'Fee assessment pending.' },
    { id: 4, parent_process_id: 4, name: 'Applicant Payment', type: 'Payment', tier: 1, status: 'pending', datetime: '2026-04-11T00:00:00Z', assigned_entity: 'Applicant', description: 'Applicant submits processing fee via Pay.gov.' },
    { id: 5, parent_process_id: 4, name: 'Interagency Consultation', type: 'Consultation', tier: 1, status: 'pending', datetime: '2026-04-25T00:00:00Z', assigned_entity: 'USACE / USFWS', description: 'Agency consultation pending.' },
    { id: 6, parent_process_id: 4, name: 'NEPA Determination', type: 'Decision', tier: 1, status: 'pending', datetime: '2026-05-20T00:00:00Z', assigned_entity: 'BLM NEPA Team', description: 'NEPA determination pending.' },
    { id: 7, parent_process_id: 4, name: 'Final Signature', type: 'Decision', tier: 1, status: 'pending', datetime: '2026-06-10T00:00:00Z', assigned_entity: 'Authorized Officer', description: 'Final authorization pending.' },
  ],
  'DOI-2026-0015': [
    { id: 1, parent_process_id: 5, name: 'Completeness Review', type: 'Review', tier: 1, status: 'completed', datetime: '2026-02-20T00:00:00Z', assigned_entity: 'J. Williams', description: 'Application complete.' },
    { id: 2, parent_process_id: 5, name: 'Field Office Review', type: 'Review', tier: 1, status: 'completed', datetime: '2026-03-05T00:00:00Z', assigned_entity: 'J. Williams', description: 'Field office review complete.' },
    { id: 3, parent_process_id: 5, name: 'Fee Assessment', type: 'Administrative', tier: 1, status: 'completed', datetime: '2026-03-12T00:00:00Z', assigned_entity: 'J. Williams', description: 'Fee waived — nonprofit applicant.' },
    { id: 4, parent_process_id: 5, name: 'Applicant Payment', type: 'Payment', tier: 1, status: 'completed', datetime: '2026-03-12T00:00:00Z', assigned_entity: 'Applicant', description: 'Fee waived. No payment required.' },
    { id: 5, parent_process_id: 5, name: 'Interagency Consultation', type: 'Consultation', tier: 1, status: 'in progress', datetime: '2026-03-22T00:00:00Z', assigned_entity: 'USFWS Southwest', description: 'Formal Section 7 consultation in progress.' },
    { id: 6, parent_process_id: 5, name: 'NEPA Determination', type: 'Decision', tier: 1, status: 'pending', datetime: '2026-05-10T00:00:00Z', assigned_entity: 'FWS NEPA Team', description: 'Biological Opinion pending.' },
    { id: 7, parent_process_id: 5, name: 'Final Signature', type: 'Decision', tier: 1, status: 'pending', datetime: '2026-06-01T00:00:00Z', assigned_entity: 'Regional Director', description: 'Final authorization pending.' },
  ],
  'DOI-2026-0007': [
    { id: 1, parent_process_id: 6, name: 'Completeness Review', type: 'Review', tier: 1, status: 'completed', datetime: '2026-01-22T00:00:00Z', assigned_entity: 'R. Anderson', description: 'Application complete.' },
    { id: 2, parent_process_id: 6, name: 'Field Office Review', type: 'Review', tier: 1, status: 'completed', datetime: '2026-02-05T00:00:00Z', assigned_entity: 'R. Anderson', description: 'Field office review complete.' },
    { id: 3, parent_process_id: 6, name: 'Fee Assessment', type: 'Administrative', tier: 1, status: 'completed', datetime: '2026-02-12T00:00:00Z', assigned_entity: 'R. Anderson', description: 'Processing fee assessed and paid.' },
    { id: 4, parent_process_id: 6, name: 'Applicant Payment', type: 'Payment', tier: 1, status: 'completed', datetime: '2026-02-19T00:00:00Z', assigned_entity: 'Applicant', description: 'Payment confirmed via Pay.gov.' },
    { id: 5, parent_process_id: 6, name: 'Interagency Consultation', type: 'Consultation', tier: 1, status: 'completed', datetime: '2026-02-28T00:00:00Z', assigned_entity: 'BIA / Tribal Council', description: 'Tribal consultation complete.' },
    { id: 6, parent_process_id: 6, name: 'NEPA Determination', type: 'Decision', tier: 1, status: 'completed', datetime: '2026-03-05T00:00:00Z', assigned_entity: 'BIA NEPA Team', description: 'Categorical exclusion approved.' },
    { id: 7, parent_process_id: 6, name: 'Final Signature', type: 'Decision', tier: 1, status: 'completed', datetime: '2026-03-08T00:00:00Z', assigned_entity: 'Regional Director', description: 'Right-of-way grant signed and issued.' },
  ],
};

export const PAYMENT_MOCK_DATA: PaymentRecord[] = [
  {
    id: 'PAY-2026-0041',
    applicationId: 'DOI-2026-0012',
    applicantName: 'Mesa County Water District',
    feeType: 'ROW Processing Fee',
    amount: 4200,
    status: 'pending',
    agency: 'Bureau of Reclamation',
  },
  {
    id: 'PAY-2026-0052',
    applicationId: 'DOI-2026-0018',
    applicantName: 'Pueblo Renewable Cooperative',
    feeType: 'ROW Processing Fee',
    amount: 3800,
    status: 'pending',
    agency: 'Bureau of Reclamation',
  },
  {
    id: 'PAY-2026-0058',
    applicationId: 'DOI-2026-0021',
    applicantName: 'Navajo Basin Utilities',
    feeType: 'Dam Safety Review Fee',
    amount: 6500,
    status: 'pending',
    agency: 'Bureau of Reclamation',
  },
  {
    id: 'PAY-2026-0033',
    applicationId: 'DOI-2026-0010',
    applicantName: 'Evergreen Transit Authority',
    feeType: 'ROW Processing Fee',
    amount: 5100,
    status: 'pending',
    agency: 'Bureau of Land Management',
  },
  {
    id: 'PAY-2026-0039',
    applicationId: 'DOI-2026-0015',
    applicantName: 'Sonoran Habitat Alliance',
    feeType: 'ESA Consultation Fee',
    amount: 0,
    status: 'waived',
    paymentDate: '2026-03-12',
    agency: 'Fish and Wildlife Service',
  },
  {
    id: 'PAY-2026-0021',
    applicationId: 'DOI-2026-0007',
    applicantName: 'Northern Plateau Energy',
    feeType: 'ROW Processing Fee',
    amount: 7200,
    status: 'paid',
    paymentDate: '2026-02-19',
    paygovTrackingId: 'PG-2026-7741203',
    agency: 'Bureau of Indian Affairs',
  },
];

export const STAFF_TASK_MOCK_ROWS: StaffTaskRow[] = [
  {
    id: 1,
    taskName: 'Review Fee Assessment — Mesa County Water District',
    applicationId: 'DOI-2026-0012',
    applicantName: 'Mesa County Water District',
    projectId: 'DOI-2026-0012',
    statusKey: 'in-progress',
    updatedLabel: 'Mar 21, 2026',
  },
  {
    id: 2,
    taskName: 'Issue RFI Response — Pueblo Renewable Cooperative',
    applicationId: 'DOI-2026-0018',
    applicantName: 'Pueblo Renewable Cooperative',
    projectId: 'DOI-2026-0018',
    statusKey: 'overdue',
    updatedLabel: 'Mar 19, 2026',
  },
  {
    id: 3,
    taskName: 'Begin Completeness Review — Navajo Basin Utilities',
    applicationId: 'DOI-2026-0021',
    applicantName: 'Navajo Basin Utilities',
    projectId: 'DOI-2026-0021',
    statusKey: 'not-started',
    updatedLabel: 'Mar 20, 2026',
  },
  {
    id: 4,
    taskName: 'Confirm Tribal Consultation — Northern Plateau Energy',
    applicationId: 'DOI-2026-0007',
    applicantName: 'Northern Plateau Energy',
    projectId: 'DOI-2026-0007',
    statusKey: 'complete',
    updatedLabel: 'Feb 28, 2026',
  },
  {
    id: 5,
    taskName: 'Route Section 7 Consultation — Sonoran Habitat Alliance',
    applicationId: 'DOI-2026-0015',
    applicantName: 'Sonoran Habitat Alliance',
    projectId: 'DOI-2026-0015',
    statusKey: 'in-progress',
    updatedLabel: 'Mar 22, 2026',
  },
];

export const STAFF_MESSAGE_MOCK_ROWS: StaffMessageRow[] = [
  {
    id: 1,
    subject: 'Payment Received — DOI-2026-0007 (Northern Plateau Energy)',
    sender: 'Pay.gov Notification System',
    statusKey: 'unread',
    receivedLabel: 'Feb 19, 2026',
  },
  {
    id: 2,
    subject: 'USFWS Section 7 Initiation — DOI-2026-0015',
    sender: 'J. Williams, USFWS Southwest',
    statusKey: 'read',
    receivedLabel: 'Mar 22, 2026',
  },
  {
    id: 3,
    subject: 'Hydraulic Study Submitted — DOI-2026-0018',
    sender: 'Robert Hayes, Field Office',
    statusKey: 'read',
    receivedLabel: 'Mar 19, 2026',
  },
  {
    id: 4,
    subject: 'Cultural Resources Clearance — DOI-2026-0012',
    sender: 'SHPO Coordination Office',
    statusKey: 'archived',
    receivedLabel: 'Mar 14, 2026',
  },
];

export function resolveStaffProfile(userSub?: string, role?: string): StaffProfile {
  const normalized = (userSub ?? '').toLowerCase();
  const sarah = STAFF_DEMO_USERS.find((user) => user.id === 'sarah-jones');
  const doug = STAFF_DEMO_USERS.find((user) => user.id === 'doug-smith');

  if (normalized.includes('sarah.jones') && sarah) {
    return sarah;
  }

  if (normalized.includes('doug.smith') && doug) {
    return doug;
  }

  if (role === 'admin' && doug) {
    return doug;
  }

  return sarah ?? STAFF_DEMO_USERS[0];
}

export function getVisibleFederalApplications(profile: StaffProfile): FederalApplicationRecord[] {
  if (profile.role === 'admin') {
    return [...FEDERAL_APPLICATION_MOCK_DATA];
  }

  return FEDERAL_APPLICATION_MOCK_DATA.filter((record) => record.region === profile.region);
}
