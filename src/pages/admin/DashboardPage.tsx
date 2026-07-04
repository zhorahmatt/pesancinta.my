import { useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSession } from '../../lib/auth';
import { listAllRegistrations } from '../../lib/registrations';
import type { Registration, RegistrationStatus } from '../../types/registration';

type StatusBucket = {
  status: RegistrationStatus;
  label: string;
  count: number;
};

const STATUS_LABELS: Record<RegistrationStatus, string> = {
  pending: 'Pending',
  awaiting_payment: 'Awaiting payment',
  payment_submitted: 'Payment submitted',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

const STATUS_ORDER: RegistrationStatus[] = [
  'pending',
  'awaiting_payment',
  'payment_submitted',
  'confirmed',
  'cancelled',
  'refunded',
];

export function DashboardPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([listAllRegistrations({ limit: 1000, status: 'all' }), getSession()]).then(
      ([regResult, sessionResult]) => {
        if (!isMounted) return;
        if (regResult.error) setErrorMessage(regResult.error.message);
        setRegistrations(regResult.data ?? []);
        setSession(sessionResult.data.session ?? null);
        setIsLoading(false);
      },
    );

    return () => {
      isMounted = false;
    };
  }, []);

  const stats = useMemo(() => {
    const total = registrations.length;
    const buckets: StatusBucket[] = STATUS_ORDER.map((status) => ({
      status,
      label: STATUS_LABELS[status],
      count: registrations.filter((r) => r.status === status).length,
    }));
    const confirmed = buckets.find((b) => b.status === 'confirmed')?.count ?? 0;
    const awaiting =
      (buckets.find((b) => b.status === 'awaiting_payment')?.count ?? 0) +
      (buckets.find((b) => b.status === 'payment_submitted')?.count ?? 0);

    const sortedByCreated = [...registrations].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
    const latestRegistration = sortedByCreated[0] ?? null;
    const lastRegistrationAt = latestRegistration ? new Date(latestRegistration.created_at) : null;

    const uniqueCountries = new Set(registrations.map((r) => r.country)).size;
    const uniqueWorkshops = new Set(registrations.map((r) => r.workshop_id).filter(Boolean)).size;

    return {
      total,
      confirmed,
      awaiting,
      buckets,
      lastRegistrationAt,
      latestRegistration,
      uniqueCountries,
      uniqueWorkshops,
    };
  }, [registrations]);

  const now = new Date();
  const adminEmail = session?.user?.email ?? 'Unknown';
  const sessionCreatedAt = session?.user?.created_at ? new Date(session.user.created_at) : null;
  const sessionExpiresAt = session?.expires_at ? new Date(session.expires_at * 1000) : null;

  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Dashboard</div>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em]">Overview</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-primary/72">
        Snapshot of registrations, capacity, and admin session activity.
      </p>

      {isLoading && (
        <div className="mt-8 rounded-xl border border-white/10 p-6 text-sm text-primary/68">Loading dashboard...</div>
      )}

      {errorMessage && (
        <div className="mt-8 rounded-xl border border-red-300/30 bg-red-500/10 p-6 text-sm text-red-100" role="alert">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Total registered" value={stats.total} hint="All-time" />
            <KpiCard label="Confirmed" value={stats.confirmed} hint="Seats locked in" />
            <KpiCard
              label="Awaiting payment"
              value={stats.awaiting}
              hint="Needs follow-up"
              hintTone="warning"
            />
            <KpiCard
              label="Countries"
              value={stats.uniqueCountries}
              hint={`Across ${stats.uniqueWorkshops} workshop${stats.uniqueWorkshops === 1 ? '' : 's'}`}
            />
          </div>

          <section className="mt-6 rounded-xl border border-white/10 bg-white/6 p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-primary/60">Status breakdown</h2>
              <span className="text-xs text-primary/48">{stats.total} total</span>
            </div>
            <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {stats.buckets.map((bucket) => {
                const pct = stats.total > 0 ? Math.round((bucket.count / stats.total) * 100) : 0;
                return (
                  <div key={bucket.status} className="rounded-lg border border-white/10 bg-page/40 p-4">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-semibold uppercase tracking-wide text-primary/60">
                        {bucket.label}
                      </span>
                      <span className="font-serif text-2xl font-semibold">{bucket.count}</span>
                    </div>
                    <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
                      <div className="h-full rounded-full bg-accent" style={{ width: `${pct}%` }} aria-hidden="true" />
                    </div>
                    <div className="mt-2 text-[0.7rem] text-primary/48">{pct}% of total</div>
                  </div>
                );
              })}
            </div>
          </section>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            <section className="rounded-xl border border-white/10 bg-white/6 p-5">
              <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-primary/60">Latest registration</h2>
              {stats.latestRegistration ? (
                <div className="mt-4 space-y-3">
                  <div>
                    <div className="font-serif text-xl font-semibold">{stats.latestRegistration.full_name}</div>
                    <div className="mt-1 text-xs text-primary/56">{stats.latestRegistration.email}</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <div className="uppercase tracking-wide text-primary/44">Country</div>
                      <div className="mt-1 text-primary/82">{stats.latestRegistration.country}</div>
                    </div>
                    <div>
                      <div className="uppercase tracking-wide text-primary/44">Status</div>
                      <div className="mt-1 text-primary/82">{STATUS_LABELS[stats.latestRegistration.status]}</div>
                    </div>
                    <div>
                      <div className="uppercase tracking-wide text-primary/44">Submitted</div>
                      <div className="mt-1 text-primary/82">{stats.lastRegistrationAt?.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="uppercase tracking-wide text-primary/44">Channel</div>
                      <div className="mt-1 text-primary/82">
                        {stats.latestRegistration.workshop_id
                          ? 'CMS workshop'
                          : stats.latestRegistration.event_key ?? 'Event'}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-4 text-sm text-primary/56">No registrations yet.</div>
              )}
            </section>

            <section className="rounded-xl border border-white/10 bg-white/6 p-5">
              <h2 className="text-sm font-bold uppercase tracking-[0.16em] text-primary/60">Admin session</h2>
              <dl className="mt-4 grid grid-cols-[10rem_1fr] gap-x-3 gap-y-3 text-xs">
                <dt className="uppercase tracking-wide text-primary/44">Signed in as</dt>
                <dd className="text-primary/82">{adminEmail}</dd>

                <dt className="uppercase tracking-wide text-primary/44">Session expires</dt>
                <dd className="text-primary/82">
                  {sessionExpiresAt ? (
                    <>
                      {sessionExpiresAt.toLocaleString()} ({formatRelative(sessionExpiresAt, now)})
                    </>
                  ) : (
                    'Unknown'
                  )}
                </dd>

                <dt className="uppercase tracking-wide text-primary/44">User created</dt>
                <dd className="text-primary/82">
                  {sessionCreatedAt ? sessionCreatedAt.toLocaleDateString() : 'Unknown'}
                </dd>

                <dt className="uppercase tracking-wide text-primary/44">Last activity</dt>
                <dd className="text-primary/82">
                  {stats.lastRegistrationAt
                    ? `${stats.lastRegistrationAt.toLocaleString()} · ${formatRelative(stats.lastRegistrationAt, now)}`
                    : 'No registrations yet'}
                </dd>
              </dl>
            </section>
          </div>
        </>
      )}
    </div>
  );
}

function KpiCard({
  label,
  value,
  hint,
  hintTone,
}: {
  label: string;
  value: number;
  hint: string;
  hintTone?: 'warning' | 'default';
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/6 p-5">
      <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary/52">{label}</div>
      <div className="mt-3 font-serif text-4xl font-semibold tracking-[-0.04em]">{value}</div>
      <div className={`mt-2 text-xs ${hintTone === 'warning' ? 'text-amber-200/80' : 'text-primary/48'}`}>{hint}</div>
    </div>
  );
}

function formatRelative(date: Date, now: Date): string {
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  const diffMin = Math.round(diffSec / 60);
  const diffHour = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHour / 24);

  if (Math.abs(diffSec) < 60) return diffSec <= 0 ? 'in moments' : `${diffSec}s ago`;
  if (Math.abs(diffMin) < 60) return diffMin < 0 ? `in ${-diffMin}m` : `${diffMin}m ago`;
  if (Math.abs(diffHour) < 24) return diffHour < 0 ? `in ${-diffHour}h` : `${diffHour}h ago`;
  return diffDay < 0 ? `in ${-diffDay}d` : `${diffDay}d ago`;
}
