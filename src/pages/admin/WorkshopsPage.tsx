import { useEffect, useState } from 'react';
import { listAdminWorkshops } from '../../lib/workshops';
import type { Workshop } from '../../types/workshop';

export function WorkshopsPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    listAdminWorkshops().then(({ data, error }) => {
      if (!isMounted) return;
      if (error) setErrorMessage(error.message);
      setWorkshops(data ?? []);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Dashboard</div>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em]">Workshops</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-primary/72">
            Manage workshop drafts, registrations, pricing, and payment setup from one protected admin area.
          </p>
        </div>
        <a className="rounded-lg bg-accent px-5 py-3 text-center text-sm font-extrabold text-ink transition hover:bg-accent-deep" href="/admin/workshops/new">
          New workshop
        </a>
      </div>

      {isLoading && <div className="mt-8 rounded-xl border border-white/10 p-6 text-sm text-primary/68">Loading workshops...</div>}

      {errorMessage && (
        <div className="mt-8 rounded-xl border border-red-300/30 bg-red-500/10 p-6 text-sm text-red-100" role="alert">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && workshops.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-white/18 p-6 text-sm leading-6 text-primary/70">
          No workshops yet. Create first draft workshop to start CMS setup.
        </div>
      )}

      {!isLoading && workshops.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-xl border border-white/10">
          <div className="grid grid-cols-[1fr_auto] gap-3 border-b border-white/10 bg-white/6 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-primary/52 sm:grid-cols-[1fr_7rem_10rem_8rem_auto]">
            <span>Workshop</span>
            <span className="hidden sm:block">Status</span>
            <span className="hidden sm:block">Start</span>
            <span className="hidden sm:block">Seats</span>
            <span>Edit</span>
          </div>
          {workshops.map((workshop) => (
            <article className="grid grid-cols-[1fr_auto] gap-3 border-b border-white/8 px-4 py-4 last:border-b-0 sm:grid-cols-[1fr_7rem_10rem_8rem_auto] sm:items-center" key={workshop.id}>
              <div>
                <h2 className="text-base font-bold text-primary">{workshop.title}</h2>
                <p className="mt-1 text-xs text-primary/52">/{workshop.slug} · {workshop.city}, {workshop.country}</p>
              </div>
              <span className="hidden rounded-full border border-white/12 px-3 py-1 text-center text-xs font-bold text-primary/70 sm:block">{workshop.status}</span>
              <span className="hidden text-sm text-primary/66 sm:block">{new Date(workshop.start_at).toLocaleDateString()}</span>
              <span className="hidden text-sm text-primary/66 sm:block">{workshop.capacity}</span>
              <a className="rounded-lg border border-white/14 px-4 py-2 text-sm font-bold text-primary/82 transition hover:border-accent/60" href={`/admin/workshops/${workshop.id}`}>
                Edit
              </a>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
