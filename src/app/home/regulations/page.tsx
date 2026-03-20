'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { WorkspaceShell } from '@/components/WorkspaceShell';
import { Button } from 'usds';
import { useAuth } from '@/contexts/AuthContext';

const REGULATION_SECTIONS = [
  {
    title: 'Environmental Review',
    authority: 'NEPA, CEQ Implementing Regulations',
    summary:
      'Projects generally require a documented level of NEPA review with interagency coordination and public transparency requirements.',
    image:
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1400&auto=format&fit=crop',
    imageAlt: 'Mountain valley landscape representing environmental review',
    infoUrl: 'https://www.ecfr.gov/current/title-40/chapter-V/part-1500',
  },
  {
    title: 'Water and Wetlands',
    authority: 'Clean Water Act Sections 401 and 404',
    summary:
      'Discharges and dredge/fill activities often require federal-state alignment on permit conditions and mitigation plans.',
    image:
      'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?q=80&w=1400&auto=format&fit=crop',
    imageAlt: 'Wetland reeds and waterway representing water and wetlands regulation',
    infoUrl: 'https://www.epa.gov/cwa-404',
  },
  {
    title: 'Species and Habitat',
    authority: 'Endangered Species Act Section 7',
    summary:
      'Federal actions may require consultation to evaluate impacts on listed species and designated critical habitat.',
    image:
      'https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=1400&auto=format&fit=crop',
    imageAlt: 'Wildlife in natural habitat representing species and habitat consultation',
    infoUrl: 'https://www.fws.gov/law/endangered-species-act/section-7',
  },
  {
    title: 'Historic and Cultural Resources',
    authority: 'NHPA Section 106',
    summary:
      'Agencies assess potential effects on historic properties and engage consulting parties before final decisions.',
    image:
      'https://images.unsplash.com/photo-1472396961693-142e6e269027?q=80&w=1400&auto=format&fit=crop',
    imageAlt: 'Landscape associated with a Native American reservation in the Midwest',
    infoUrl: 'https://www.achp.gov/protecting-historic-properties/section-106-process/introduction-section-106',
  },
];

function ExternalLinkIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M15.75 2.25L21 2.25C21.1989 2.25 21.3897 2.32902 21.5303 2.46967C21.671 2.61032 21.75 2.80109 21.75 3V8.25C21.75 8.66421 21.4142 9 21 9C20.5858 9 20.25 8.66421 20.25 8.25V4.81066L8.03033 17.0303C7.73744 17.3232 7.26256 17.3232 6.96967 17.0303C6.67678 16.7374 6.67678 16.2626 6.96967 15.9697L19.1893 3.75L15.75 3.75C15.3358 3.75 15 3.41421 15 3C15 2.58579 15.3358 2.25 15.75 2.25ZM5.25 6.75C4.42157 6.75 3.75 7.42157 3.75 8.25V18.75C3.75 19.5784 4.42157 20.25 5.25 20.25H15.75C16.5784 20.25 17.25 19.5784 17.25 18.75V10.5C17.25 10.0858 17.5858 9.75 18 9.75C18.4142 9.75 18.75 10.0858 18.75 10.5V18.75C18.75 20.4069 17.4069 21.75 15.75 21.75H5.25C3.59315 21.75 2.25 20.4069 2.25 18.75V8.25C2.25 6.59315 3.59315 5.25 5.25 5.25H13.5C13.9142 5.25 14.25 5.58579 14.25 6C14.25 6.41421 13.9142 6.75 13.5 6.75H5.25Z"
        fill="currentColor"
      />
    </svg>
  );
}

export default function RegulationsPage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!token) router.replace('/login');
  }, [token, router]);

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
      <div className="flex w-full flex-col gap-[var(--space-md)] bg-[var(--color-bg)] p-[var(--space-md)]">
        <header className="flex flex-col gap-[var(--space-xs)]">
          <p className="type-body-xs uppercase tracking-[0.14em] text-[var(--color-text-disabled)]">Applicant Portal</p>
          <h1 className="type-heading-h4">Regulations</h1>
          <p className="type-body-md max-w-4xl text-[var(--color-text-body)]">
            Mock regulatory summaries to help applicants understand review themes before preparing formal submissions.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-[var(--space-xl)] md:grid-cols-2">
          {REGULATION_SECTIONS.map((item) => (
            <a
              key={item.title}
              href={item.infoUrl}
              target="_blank"
              rel="noreferrer"
              className="image-card-link"
            >
              <div className="image-card rounded-[var(--radius-md)] shadow-[var(--shadow-sm)]">
                <div className="image-card-image">
                  <img src={item.image} alt={item.imageAlt} loading="lazy" />
                </div>
                <div className="image-card-content">
                  <div className="image-card-text">
                    <div className="image-card-text-inner">
                      <div className="image-card-title">{item.title}</div>
                      <div className="image-card-subtitle">{item.authority}</div>
                      <p className="type-body-sm mt-[var(--space-xs)] text-[var(--color-text-body)]">{item.summary}</p>
                    </div>
                    <div className="image-card-link-icon">
                      <ExternalLinkIcon />
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="flex flex-wrap gap-[var(--space-sm)]">
          <Link href="/resources">
            <Button variant="secondary" size="sm">Open Resources</Button>
          </Link>
          <Link href="/help-center">
            <Button variant="outline" size="sm">Contact Help Center</Button>
          </Link>
        </div>
      </div>
    </WorkspaceShell>
  );
}
