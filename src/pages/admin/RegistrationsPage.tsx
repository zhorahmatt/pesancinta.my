import { useEffect, useState } from 'react';
import { listAllRegistrations, listRegistrationsByWorkshop } from '../../lib/registrations';
import { RegistrationStatusSelect } from '../../components/admin/RegistrationStatusSelect';
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

  const handleRowChange = (updated: Registration) => {
    setRegistrations((current) => current.map((row) => (row.id === updated.id ? updated : row)));
  };

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
        <div className="mt-8 grid gap-3 sm:hidden">
          {visibleRegistrations.map((registration) => (
            <article className="rounded-xl border border-white/10 p-4" key={registration.id}>
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-bold text-primary">{registration.full_name}</h2>
                <a className="text-xs font-bold text-accent transition hover:underline" href={`/admin/registrations/${registration.id}`}>Detail</a>
              </div>
              <p className="mt-1 break-all text-xs text-primary/60">{registration.email}</p>
              <p className="mt-1 text-xs text-primary/60">{registration.phone}</p>
              {registration.event_key && (
                <span className="mt-2 inline-block rounded-md bg-accent/15 px-2 py-1 text-xs font-semibold text-accent">{registration.event_key}</span>
              )}
              <div className="mt-3">
                <span className="mb-1 block text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary/50">Payment status</span>
                <RegistrationStatusSelect
                  registration={registration}
                  workshopTitle={registration.event_key ?? 'workshop'}
                  onChange={handleRowChange}
                />
              </div>
            </article>
          ))}
        </div>
      )}

      {visibleRegistrations.length > 0 && (
        <div className="mt-8 hidden overflow-x-auto rounded-xl border border-white/10 sm:block">
          <table className="w-full min-w-[60rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 text-xs font-semibold uppercase tracking-[0.14em] text-primary/55">
                <th className="px-4 py-3">Payment status</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Event key</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {visibleRegistrations.map((registration) => (
                <tr className="border-b border-white/8 align-top last:border-0" key={registration.id}>
                  <td className="px-4 py-3 w-56">
                    <RegistrationStatusSelect
                      registration={registration}
                      workshopTitle={registration.event_key ?? 'workshop'}
                      onChange={handleRowChange}
                    />
                  </td>
                  <td className="px-4 py-3 font-bold text-primary">{registration.full_name}</td>
                  <td className="px-4 py-3 text-primary/72">{registration.email}</td>
                  <td className="px-4 py-3 text-primary/72">{registration.phone}</td>
                  <td className="px-4 py-3">
                    {registration.event_key
                      ? <span className="rounded-md bg-accent/15 px-2 py-1 text-xs font-semibold text-accent">{registration.event_key}</span>
                      : <span className="text-xs text-primary/40">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <a className="text-xs font-bold text-accent transition hover:underline" href={`/admin/registrations/${registration.id}`}>Detail</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
