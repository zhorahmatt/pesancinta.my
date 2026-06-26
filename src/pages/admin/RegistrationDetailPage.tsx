import { useEffect, useState } from 'react';
import { RegistrationStatusSelect } from '../../components/admin/RegistrationStatusSelect';
import { getRegistrationById } from '../../lib/registrations';
import { getAdminWorkshopById } from '../../lib/workshops';
import type { Registration } from '../../types/registration';

type RegistrationDetailPageProps = {
  registrationId: string;
};

export function RegistrationDetailPage({ registrationId }: RegistrationDetailPageProps) {
  const [registration, setRegistration] = useState<Registration | null>(null);
  const [workshopTitle, setWorkshopTitle] = useState('workshop');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getRegistrationById(registrationId).then(async ({ data, error }) => {
      if (!isMounted) return;
      if (error) setErrorMessage(error.message);
      setRegistration(data ?? null);

      if (data?.workshop_id) {
        const workshopResult = await getAdminWorkshopById(data.workshop_id);
        if (!isMounted) return;
        if (workshopResult.error) setErrorMessage(workshopResult.error.message);
        setWorkshopTitle(workshopResult.data?.title ?? 'workshop');
      } else if (data?.event_key) {
        setWorkshopTitle(data.event_key);
      }

      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [registrationId]);

  if (isLoading) return <div className="rounded-xl border border-white/10 p-6 text-sm text-primary/68">Loading registration...</div>;
  if (errorMessage || !registration) return <div className="rounded-xl border border-red-300/30 bg-red-500/10 p-6 text-sm text-red-100">{errorMessage ?? 'Registration not found'}</div>;

  return (
    <div>
      <div>
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Registration detail</div>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em]">{registration.full_name}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-primary/72">Review visitor details and update payment status.</p>
      </div>

      <section className="mt-8 grid gap-4 rounded-xl border border-white/10 bg-white/5 p-5">
        <Info label="Email" value={registration.email} />
        <Info label="Phone" value={registration.phone} />
        <Info label="Country" value={registration.country} />
        <Info label="Notes" value={registration.notes ?? '-'} />
        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          Status
          <RegistrationStatusSelect registration={registration} workshopTitle={workshopTitle} onChange={setRegistration} />
        </label>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary/48">{label}</div>
      <div className="mt-1 text-sm text-primary/78">{value}</div>
    </div>
  );
}
