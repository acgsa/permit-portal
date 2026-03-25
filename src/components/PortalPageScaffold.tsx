import type { ReactNode } from 'react';

type PortalPageScaffoldProps = {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  actions?: ReactNode;
  children: ReactNode;
};

/**
 * Shared page scaffold for WorkspaceShell routes.
 * Keeps spacing and typography aligned with USDS token conventions.
 */
export function PortalPageScaffold({ title, subtitle, eyebrow, actions, children }: PortalPageScaffoldProps) {
  return (
    <div className="flex w-full flex-col gap-[var(--space-xl)] bg-[var(--color-bg)] p-[var(--space-xl)]">
      <header className="flex flex-wrap items-start justify-between gap-[var(--space-xl)]">
        <div className="space-y-[var(--space-md)]">
          {eyebrow ? (
            <p className="type-body-xs uppercase tracking-[0.14em] text-[var(--color-text-disabled)]">{eyebrow}</p>
          ) : null}
          <h1 className="type-heading-h4 text-[var(--color-text)]">{title}</h1>
          {subtitle ? (
            <p className="type-body-md max-w-4xl text-[var(--color-text-body)]">{subtitle}</p>
          ) : null}
        </div>
        {actions ? <div className="shrink-0">{actions}</div> : null}
      </header>

      {children}
    </div>
  );
}

export default PortalPageScaffold;
