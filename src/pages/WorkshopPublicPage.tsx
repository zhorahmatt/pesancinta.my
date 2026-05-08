import { useEffect, useState } from 'react';
import { getWorkshopBySlug, getRemainingSeats, type WorkshopWithContent } from '../lib/workshops';
import type { WorkshopLocaleContent } from '../types/workshop';

type WorkshopPublicPageProps = {
  slug: string;
};

export function WorkshopPublicPage({ slug }: WorkshopPublicPageProps) {
  const [workshop, setWorkshop] = useState<WorkshopWithContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    getWorkshopBySlug(slug).then(({ data, error }) => {
      if (!isMounted) return;
      if (error) setErrorMessage(error.message);
      setWorkshop(data ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) return <main className="grid min-h-svh place-items-center bg-page-deep text-primary">Loading workshop...</main>;

  if (errorMessage || !workshop) {
    return (
      <main className="grid min-h-svh place-items-center bg-page-deep px-5 text-center text-primary">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-[-0.05em]">Workshop not available</h1>
          <p className="mt-3 text-sm text-primary/62">This workshop is unpublished, archived, or unavailable.</p>
        </div>
      </main>
    );
  }

  const content = selectContent(workshop.workshop_locales, workshop.default_locale);
  const activePaymentMethods = workshop.payment_methods.filter((method) => method.is_active);
  const remainingSeats = getRemainingSeats(workshop.capacity, 0);

  return (
    <main className="min-h-svh bg-page-deep px-5 py-10 text-primary sm:px-8 lg:px-10">
      <section className="mx-auto max-w-5xl rounded-3xl border border-white/10 bg-white/6 p-6 sm:p-10">
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Pesan Cinta Workshop</div>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.06em] sm:text-6xl">{content?.headline || workshop.title}</h1>
        {content?.subheadline && <p className="mt-4 max-w-3xl text-lg leading-7 text-primary/72">{content.subheadline}</p>}
        {content?.description && <p className="mt-6 max-w-3xl text-sm leading-7 text-primary/68">{content.description}</p>}

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <InfoCard label="Date" value={new Date(workshop.start_at).toLocaleString()} />
          <InfoCard label="Venue" value={`${workshop.venue_name}, ${workshop.city}`} />
          <InfoCard label="Capacity" value={workshop.show_remaining_seats ? `${remainingSeats} seats remaining` : `${workshop.capacity} seats`} />
        </div>

        {workshop.workshop_prices.length > 0 && (
          <section className="mt-10">
            <h2 className="font-serif text-2xl font-semibold tracking-[-0.04em]">Price</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {workshop.workshop_prices.map((price) => (
                <div className="rounded-xl border border-white/10 p-4" key={price.id}>
                  <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary/48">{price.currency}</div>
                  <div className="mt-2 text-2xl font-bold text-accent">{price.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="font-serif text-2xl font-semibold tracking-[-0.04em]">active payment methods</h2>
          <div className="mt-4 grid gap-3">
            {activePaymentMethods.map((method) => (
              <div className="rounded-xl border border-white/10 p-4" key={method.id}>
                <div className="font-bold text-primary">{method.label}</div>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-primary/64">{method.instructions}</p>
                {method.qr_image_url && <img alt={`${method.label} QR`} className="mt-4 max-h-48 rounded-lg border border-white/10 object-contain" src={method.qr_image_url} />}
              </div>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}

function InfoCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-white/10 p-4">
      <div className="text-xs font-bold uppercase tracking-[0.16em] text-primary/48">{label}</div>
      <div className="mt-2 text-sm font-semibold text-primary/82">{value}</div>
    </div>
  );
}

function selectContent(contents: WorkshopLocaleContent[], defaultLocale: string) {
  return contents.find((content) => content.locale === defaultLocale) ?? contents[0];
}
