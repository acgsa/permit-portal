import type { Metadata } from 'next';
import { Navigation } from '@/components/Navigation';
import { Footer } from '@/components/Footer';
import { AnchorNav } from '@/components/AnchorNav';
import { ParallaxImage } from '@/components/ParallaxImage';
import { PillButton } from 'usds';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Use Cases — PERMIT.GOV',
  description:
    'From critical minerals to electricity transmission, explore the federal permitting process for major infrastructure and energy projects.',
};

export default function UseCasesPage() {
  return (
    <>
      <style>{`
        .use-cases-page nav.sticky {
          background-color: rgba(0, 0, 0, 0.85) !important;
          backdrop-filter: blur(12px) !important;
        }
        .use-cases-page [class*="sticky top-14"] {
          background-color: rgba(0, 0, 0, 0.85) !important;
        }
      `}</style>
      <div className="use-cases-page">
        <Navigation />

      {/* Hero */}
      <section className="flex justify-center bg-black text-[var(--color-text-body)] px-2 sm:px-6 lg:px-8" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
        <div className="w-full max-w-7xl" style={{ marginLeft: 'clamp(var(--space-sm), 5vw, var(--space-lg))', marginRight: 'clamp(var(--space-sm), 5vw, var(--space-lg))' }}>
          <p className="type-body-xs uppercase tracking-[0.16em]" style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-text-disabled)' }}>
            Federal Permit Use Cases
          </p>
          <h1 className="max-w-4xl font-[var(--font-primary)] text-[clamp(2.4rem,5.5vw,4.8rem)] font-normal leading-[1.04] text-[var(--color-text-body)]" style={{ marginBottom: 'var(--space-lg)' }}>
            Every project starts with the right permits.
          </h1>
          <p className="max-w-2xl type-body leading-relaxed" style={{ marginBottom: 'var(--space-2xl)', color: 'var(--color-text-body)' }}>
            PERMIT.GOV supports the most complex and high-demand federal permitting workflows — from BLM
            Plans of Operations to FERC Certificates to USACE Section 404 Permits. Select a use case to
            understand what approvals your project requires and how to get started.
          </p>
          <div>
            <Link href="/login">
              <PillButton
                size="lg"
                variant="secondary"
                className="mt-6 !bg-[var(--color-btn-secondary-bg)] !text-[var(--color-btn-secondary-text)] hover:!bg-[var(--color-btn-secondary-bg-hover)] hover:!text-[var(--color-btn-secondary-text-hover)]"
              >
                Start a New Application
              </PillButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick-jump nav */}
      <AnchorNav sections={useCaseSections} />

      {/* Use Case Sections */}
      {useCaseSections.map((section, index) => (
        <section
          key={section.slug}
          id={section.slug}
          className={`scroll-mt-12 flex flex-col text-[var(--color-text-body)] overflow-hidden ${
            index % 2 === 0 ? 'bg-black' : 'bg-[#060708]'
          }`}
        >
          {/* Full-width image with parallax */}
          <ParallaxImage src={section.image} alt={section.title} />

          {/* Content section */}
          <div className="flex justify-center px-2 sm:px-6 lg:px-8 overflow-hidden" style={{ paddingTop: 'var(--space-3xl)', paddingBottom: 'var(--space-3xl)' }}>
            <div className="w-full max-w-7xl" style={{ marginLeft: 'clamp(var(--space-sm), 5vw, var(--space-lg))', marginRight: 'clamp(var(--space-sm), 5vw, var(--space-lg))' }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                {/* Main content - 2 columns on desktop */}
                <div className="lg:col-span-2 flex flex-col max-w-[600px]">
                  <p className="type-body-xs uppercase tracking-[0.16em]" style={{ marginBottom: 'var(--space-sm)', color: 'var(--color-text-disabled)' }}>
                    Use Case
                  </p>
                  <h2 className="font-[var(--font-primary)] text-[clamp(1.8rem,3.5vw,2.8rem)] font-normal leading-[1.2] text-[var(--color-text-body)]" style={{ marginBottom: 'var(--space-md)' }}>
                    {section.title}
                  </h2>
                  <p className="type-body-sm max-w-xl" style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-text-body)' }}>{section.tagline}</p>

                  <div style={{ marginBottom: '0' }}>
                    {section.description.map((para, i) => (
                      <p key={i} className="type-body max-w-2xl leading-relaxed" style={{ marginBottom: i < section.description.length - 1 ? 'var(--space-lg)' : '0', color: 'var(--color-text-body)' }}>
                        {para}
                      </p>
                    ))}
                  </div>
                </div>

                {/* Right sidebar - Permits and Forms */}
                <div className="flex flex-col max-w-sm">
                  {/* Permits list */}
                  <div style={{ marginBottom: 'var(--space-2xl)' }}>
                    <h3 className="type-body-xs uppercase tracking-[0.14em]" style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-text-disabled)' }}>
                      Required Permits
                    </h3>
                    <ul className="flex flex-col" style={{ gap: 'var(--space-md)' }}>
                      {section.permits.map((permit) => (
                        <li key={permit.name} className="flex flex-col">
                          <p className="type-body-sm" style={{ color: 'var(--color-text)' }}>{permit.name}</p>
                          <p className="type-body-xs mt-1" style={{ color: 'var(--color-text-disabled)' }}>{permit.detail}</p>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Forms */}
                  <div>
                    <h3 className="type-body-xs uppercase tracking-[0.14em]" style={{ marginBottom: 'var(--space-lg)', color: 'var(--color-text-disabled)' }}>
                      Key Forms
                    </h3>
                    <ul className="flex flex-col" style={{ gap: 'var(--space-md)' }}>
                      {section.forms.map((form) => (
                        <li key={form} className="flex flex-col">
                          <p className="type-body-sm" style={{ color: 'var(--color-text)' }}>{form}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Final CTA */}
      <section className="flex justify-center bg-black text-[var(--color-text-body)] px-2 sm:px-6 lg:px-8 border-t border-white/10" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
        <div className="w-full max-w-7xl flex flex-col gap-6 items-start" style={{ marginLeft: 'clamp(var(--space-sm), 5vw, var(--space-lg))', marginRight: 'clamp(var(--space-sm), 5vw, var(--space-lg))' }}>
          <h2 className="type-heading-h3 text-[var(--color-text-body)] text-left">
            Ready to move your project forward?
          </h2>
          <Link href="/login" className="w-full sm:w-auto text-left">
            <PillButton
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto !bg-[var(--color-btn-secondary-bg)] !text-[var(--color-btn-secondary-text)] hover:!bg-[var(--color-btn-secondary-bg-hover)] hover:!text-[var(--color-btn-secondary-text-hover)]"
            >
              Start a New Application
            </PillButton>
          </Link>
        </div>
      </section>

      <Footer />
      </div>
    </>
  );
}

const useCaseSections = [
  {
    slug: 'critical-minerals-mining',
    title: 'Critical Minerals Mining',
    tagline: "Securing America's critical mineral supply chain starts with the right permits.",
    image:
      'https://images.unsplash.com/photo-1585427006146-9948883f2a0e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: [
      "America's clean energy and defense technology industries depend on domestic critical minerals—lithium, cobalt, nickel, and rare earth elements predominantly found on federal lands. Bringing a mine to production requires approvals from multiple agencies, and PERMIT.GOV coordinates every review in one secure workspace.",
      'From the initial BLM Plan of Operations through NEPA environmental review, water quality certifications, and species consultations, the platform tracks each agency timeline, required submittals, and approval conditions so nothing falls through the cracks.',
    ],
    permits: [
      {
        name: 'BLM Plan of Operations',
        detail:
          '43 CFR Part 3809 — required for all surface-disturbing activity on BLM-managed federal lands',
      },
      {
        name: 'NEPA Environmental Review',
        detail:
          'Environmental Assessment (EA) or Environmental Impact Statement (EIS) scoped to project scale and significance',
      },
      {
        name: 'USACE Section 404 Permit',
        detail:
          'Clean Water Act authorization for operations impacting jurisdictional wetlands or waters of the United States',
      },
      {
        name: 'EPA NPDES Stormwater Permit',
        detail:
          'National Pollutant Discharge Elimination System permit required for construction sites disturbing one or more acres',
      },
      {
        name: 'ESA Section 7 Consultation',
        detail:
          'Endangered Species Act review coordinated with U.S. Fish & Wildlife Service and/or NOAA Fisheries',
      },
    ],
    forms: ['BLM Form 3809', 'SF-299 (if right-of-way required)', 'ENG Form 4345', 'EPA Form 3510-2F'],
  },
  {
    slug: 'oil-gas-drilling',
    title: 'Oil & Gas Drilling',
    tagline: 'Every federal onshore well starts with an Application for Permit to Drill.',
    image:
      'https://images.unsplash.com/photo-1633155617309-6201a8096e8a?q=80&w=2340&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: [
      'Federal onshore oil and gas development requires Bureau of Land Management authorization before drilling commences. The Application for Permit to Drill (APD) is the core document, but it triggers a cascade of associated reviews — surface use coordination, NEPA analysis, bonding requirements, and well inspections — all managed through PERMIT.GOV.',
      "Whether you're developing a single exploratory well or managing a multi-pad development program, the platform creates a complete digital record of every filing, agency response, and condition of approval.",
    ],
    permits: [
      {
        name: 'Application for Permit to Drill (APD)',
        detail:
          'BLM Form 3160-3 — primary federal authorization for onshore drilling on federal mineral estate',
      },
      {
        name: 'Surface Use Agreement',
        detail:
          'Required when mineral and surface rights are split; coordinates with private surface owner on access and reclamation',
      },
      {
        name: 'NEPA Categorical Exclusion, EA, or EIS',
        detail:
          'Environmental review scoped to project footprint, proximity to sensitive resources, and cumulative impact',
      },
      {
        name: 'Spill Prevention, Control & Countermeasure Plan',
        detail:
          'EPA SPCC Plan required for facilities with aboveground oil storage above regulatory threshold volumes',
      },
      {
        name: 'Surety Bond Filing',
        detail:
          'BLM bonding requirement covering reclamation obligations for all federal lease operations',
      },
    ],
    forms: ['BLM Form 3160-3 (APD)', 'BLM Form 3165-1 (Sundry Notices)', 'EPA SPCC Form'],
  },
  {
    slug: 'natural-gas-pipelines',
    title: 'Natural Gas Pipelines & LNG Facilities',
    tagline: 'Interstate pipelines and LNG terminals require multi-agency coordination from day one.',
    image:
      'https://images.unsplash.com/photo-1714901423336-1884cd3fb50f?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: [
      'Interstate natural gas pipeline projects and LNG export terminals are among the most complex permitting undertakings in the federal system. FERC serves as lead agency and issues the Certificate of Public Convenience and Necessity, but applicants must simultaneously obtain right-of-way grants, water body crossing authorizations, and air quality permits.',
      'PERMIT.GOV manages these parallel tracks — filing queues, agency comment periods, mitigation commitments, and final authorizations — in a single authenticated workspace shared by the applicant and all reviewing agencies.',
    ],
    permits: [
      {
        name: 'FERC Certificate of Public Convenience and Necessity',
        detail:
          "Natural Gas Act Section 7 — FERC's primary authorization for construction and operation of interstate pipeline infrastructure",
      },
      {
        name: 'SF-299 Right-of-Way Grant',
        detail:
          'Standard Form 299 for transportation and utility systems crossing BLM, USFS, or other federally managed lands',
      },
      {
        name: 'USACE Section 404 / Section 10 Permits',
        detail:
          'Army Corps authorization for pipeline crossings of waters of the United States and navigable waterways',
      },
      {
        name: 'EPA Prevention of Significant Deterioration (PSD) Permit',
        detail:
          'Pre-construction air quality permit required for compressor stations and LNG processing equipment above emission thresholds',
      },
      {
        name: 'DOT PHMSA Pipeline Safety Compliance',
        detail:
          'Pipeline and Hazardous Materials Safety Administration design, construction, and operational standards filing',
      },
    ],
    forms: ['SF-299', 'FERC Form 2', 'ENG Form 4345 (USACE)', 'EPA Form 9340-1'],
  },
  {
    slug: 'electricity-transmission-lines',
    title: 'Electricity Transmission Lines',
    tagline: 'Grid expansion is a national priority. PERMIT.GOV accelerates it.',
    image:
      'https://images.unsplash.com/photo-1641236542806-7b20d6617a4b?q=80&w=962&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: [
      'High-voltage transmission lines are essential infrastructure for delivering clean and affordable power across America. Most new routes cross federal land, requiring right-of-way grants from BLM, USFS, or other land management agencies. Water crossings add USACE jurisdiction, and species and historic properties consultations further extend the timeline.',
      "PERMIT.GOV's coordinated review workflow assigns clear agency timelines and tracks every submittal — so project developers and federal review staff always know exactly where each authorization stands.",
    ],
    permits: [
      {
        name: 'SF Right-of-Way Grant (43 CFR Part 2800)',
        detail:
          'BLM or USFS authorization for transmission line corridors across federal lands; initiated through SF-299',
      },
      {
        name: 'NEPA Environmental Assessment or EIS',
        detail:
          'Environmental review covering route selection, viewshed impacts, land disturbance, and sensitive resource avoidance',
      },
      {
        name: 'USACE Section 404 / Section 10 Permit',
        detail:
          'Required for tower footings, access roads, or conductor stringing in or adjacent to waters of the United States',
      },
      {
        name: 'ESA Section 7 Consultation',
        detail:
          'Formal or informal consultation with USFWS and NMFS for listed species or critical habitat within the project area',
      },
      {
        name: 'Section 106 Historic Properties Consultation',
        detail:
          'National Historic Preservation Act review coordinated with State Historic Preservation Officers and tribal nations',
      },
    ],
    forms: ['SF-299', 'ENG Form 4345', 'USFWS Form 3-2178'],
  },
  {
    slug: 'water-resources',
    title: 'Water Resources',
    tagline: 'Water infrastructure projects require USACE authorization before construction begins.',
    image:
      'https://images.unsplash.com/photo-1695218736994-f37352f3e397?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: [
      'Projects that alter, fill, or dredge navigable waters or adjacent wetlands — including dams, levees, flood control structures, water intakes, and irrigation infrastructure — must obtain U.S. Army Corps of Engineers authorization. Depending on scope, individual or nationwide permits may apply, and EPA Water Quality Certification is often required in parallel.',
      'PERMIT.GOV manages the full authorization workflow: pre-application consultation, public notice periods, agency comment resolution, mitigation planning, and final permit issuance with ongoing conditions tracking.',
    ],
    permits: [
      {
        name: 'USACE Section 404 Permit',
        detail:
          'Clean Water Act authorization for discharge of dredged or fill material into waters and wetlands of the United States',
      },
      {
        name: 'USACE Section 10 Permit',
        detail:
          'Rivers and Harbors Act authorization for structures, excavation, or fill in navigable waters of the United States',
      },
      {
        name: 'EPA Section 401 Water Quality Certification',
        detail:
          'State or EPA certification that the proposed project will comply with applicable water quality standards',
      },
      {
        name: 'NEPA Environmental Review',
        detail:
          'Environmental Assessment or EIS scoped to hydrological, ecological, and downstream community effects',
      },
      {
        name: 'Bureau of Reclamation Contract or Approval',
        detail:
          'Required for projects involving federal water service areas, Bureau of Reclamation facilities, or federal storage reservoirs',
      },
    ],
    forms: ['ENG Form 4345 (USACE Individual Permit)', 'EPA Form 7520-6 (401 Certification)'],
  },
  {
    slug: 'advanced-manufacturing',
    title: 'Advanced Manufacturing',
    tagline: 'Building domestic industrial capacity requires navigating a multi-agency permitting landscape.',
    image:
      'https://images.unsplash.com/photo-1725898443195-eac6f4cf11db?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: [
      'Large-scale manufacturing facilities — semiconductor fabs, battery gigafactories, steel mills, chemical plants — frequently trigger federal permitting requirements through new air emissions, wetland impacts from site grading, stormwater discharge, or when federal funding or land creates a NEPA nexus.',
      'PERMIT.GOV coordinates environmental and construction clearances across EPA, USACE, and other federal reviewers, including pre-application coordination to identify the right permit pathways before a single form is filed.',
    ],
    permits: [
      {
        name: 'NEPA Environmental Review',
        detail:
          'Required when a federal nexus exists — federal funding, federal land, or a federal permit that constitutes a major federal action',
      },
      {
        name: 'EPA New Source Review / PSD Air Permit',
        detail:
          'Prevention of Significant Deterioration pre-construction permit for major new stationary air emission sources',
      },
      {
        name: 'EPA Title V Operating Permit',
        detail:
          'Comprehensive operating permit required when regulated air pollutant emissions exceed applicable major source thresholds',
      },
      {
        name: 'USACE Section 404 Wetlands Permit',
        detail:
          'Required for site grading, drainage, or stormwater infrastructure that impacts jurisdictional wetlands',
      },
      {
        name: 'EPA NPDES Construction Stormwater Permit',
        detail:
          'National Pollutant Discharge Elimination System permit required for all construction sites disturbing one or more acres',
      },
    ],
    forms: [
      'EPA Form 9340-1 (Title V)',
      'ENG Form 4345',
      'EPA Form 3510-2A (NPDES)',
      'EPA Form 9000-1 (RCRA)',
    ],
  },
  {
    slug: 'rights-of-way',
    title: 'Rights-of-Way & Linear Infrastructure',
    tagline: 'Roads, fiber, water lines, and every linear project crossing federal land starts with an SF-299.',
    image:
      'https://images.unsplash.com/photo-1543980084-69bffd24b8ce?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    description: [
      'Pipelines, fiber optic cables, access roads, power lines, and other linear infrastructure projects frequently cross federal lands managed by BLM, USFS, NPS, and other agencies. Each land ownership segment requires a right-of-way grant. Water body crossings add USACE jurisdiction. Multi-agency projects can involve dozens of separate authorizations across hundreds of miles.',
      'PERMIT.GOV creates a unified application record for all crossings — mapping each parcel, tracking each managing agency review, and centralizing all grantor conditions in one place so linear project developers can manage complex multi-state routes efficiently.',
    ],
    permits: [
      {
        name: 'SF-299 Right-of-Way Application',
        detail:
          "Standard Form 299 — the federal government's standard application for transportation and utility systems on federal lands",
      },
      {
        name: 'BLM Right-of-Way Grant (Form 2800-1)',
        detail:
          'BLM-specific grantor form issued following SF-299 review for projects crossing BLM-managed public lands',
      },
      {
        name: 'NEPA Categorical Exclusion or Environmental Assessment',
        detail:
          'Environmental review scoped to linear construction footprint, temporary access roads, and vegetation disturbance',
      },
      {
        name: 'USACE Section 404 Permit',
        detail:
          'Required for water body crossings involving discharge of dredged or fill material into waters of the United States',
      },
      {
        name: 'ESA Informal Section 7 Consultation',
        detail:
          'Endangered Species Act review for linear routes traversing potential species habitat or designated critical habitat',
      },
    ],
    forms: ['SF-299', 'BLM Form 2800-1', 'ENG Form 4345'],
  },
];
