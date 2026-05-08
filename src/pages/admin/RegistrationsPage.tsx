import { useEffect, useState } from 'react';
import { listAllRegistrations, listRegistrationsByWorkshop } from '../../lib/registrations';
import type { Registration, RegistrationStatus } from '../../types/registration';

type RegistrationsPageProps = {
  workshopId?: string;
};

const filterStatuses: Array<RegistrationStatus | 'all'> = ['all', 'pending', 'awaiting_payment', 'payment_submitted', 'confirmed', 'cancelled', 'refunded'];

export function RegistrationsPage({ workshopId }: RegistrationsPageProps) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [filterStatus, setFilterStatus] = useState<RegistrationStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const options = { status: filterStatus, limit: 50 };
    const request = workshopId ? listRegistrationsByWorkshop(workshopId, options) : listAllRegistrations(options);

    request.then(({ data, error }) => {
      if (!isMounted) return;
      if (error) setErrorMessage(error.message);
      setRegistrations(data ?? []);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [filterStatus, workshopId]);

  const visibleRegistrations = registrations;

  return (
    <div>
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Operations</div>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em]">Registrations</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-primary/72">Review latest 50 registrations, inspect payment state, and filter by status.</p>
      </div>

      <label className="mt-8 grid max-w-xs gap-2 text-sm font-semibold text-primary/82">
        Filter status
        <select className="rounded-lg border border-white/12 bg-page-deep px-4 py-3 text-primary outline-none focus:border-accent" value={filterStatus} onChange={(event) => setFilterStatus(event.target.value as RegistrationStatus | 'all')}>
          {filterStatuses.map((status) => <option key={status} value={status}>{status}</option>)}
        </select>
      </label>

      {isLoading && <div className="mt-8 rounded-xl border border-white/10 p-6 text-sm text-primary/68">Loading registrations...</div>}
      {errorMessage && <div className="mt-8 rounded-xl border border-red-300/30 bg-red-500/10 p-6 text-sm text-red-100" role="alert">{errorMessage}</div>}

      {!isLoading && visibleRegistrations.length === 0 && <div className="mt-8 rounded-xl border border-dashed border-white/18 p-6 text-sm text-primary/70">No registrations found.</div>}

      {visibleRegistrations.length > 0 && (
        <div className="mt-8 grid gap-3">
          {visibleRegistrations.map((registration) => (
            <article className="rounded-xl border border-white/10 p-4" key={registration.id}>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-bold text-primary">{registration.full_name}</h2>
                  <p className="mt-1 text-xs text-primary/52">{registration.email} · {registration.phone}</p>
                  <p className="mt-1 text-xs text-primary/52">{registration.country} · {registration.status}</p>
                </div>
                <a className="rounded-lg border border-white/14 px-4 py-2 text-center text-sm font-bold text-primary/82 transition hover:border-accent/60" href={`/admin/registrations/${registration.id}`}>Open detail</a>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
