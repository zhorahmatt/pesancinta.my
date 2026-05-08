import { useState, type FormEvent } from 'react';
import { isValidWorkshopCapacity, isValidWorkshopSlug, type WorkshopBasicsInput } from '../../lib/workshops';
import type { Workshop } from '../../types/workshop';

type WorkshopBasicsFormProps = {
  workshop?: Workshop | null;
  isSaving: boolean;
  errorMessage: string | null;
  onSubmit: (input: WorkshopBasicsInput) => Promise<void>;
};

const defaultStartAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16);

export function WorkshopBasicsForm({ workshop, isSaving, errorMessage, onSubmit }: WorkshopBasicsFormProps) {
  const [title, setTitle] = useState(workshop?.title ?? '');
  const [slug, setSlug] = useState(workshop?.slug ?? '');
  const [status, setStatus] = useState(workshop?.status ?? 'draft');
  const [startAt, setStartAt] = useState(toLocalInputValue(workshop?.start_at) ?? defaultStartAt);
  const [endAt, setEndAt] = useState(toLocalInputValue(workshop?.end_at) ?? '');
  const [venueName, setVenueName] = useState(workshop?.venue_name ?? '');
  const [city, setCity] = useState(workshop?.city ?? '');
  const [country, setCountry] = useState(workshop?.country ?? 'MY');
  const [capacity, setCapacity] = useState(String(workshop?.capacity ?? 40));
  const [defaultLocale, setDefaultLocale] = useState(workshop?.default_locale ?? 'ms');
  const [showRemainingSeats, setShowRemainingSeats] = useState(workshop?.show_remaining_seats ?? true);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedCapacity = Number(capacity);

    if (!slug.trim()) {
      setValidationError('Slug is required');
      return;
    }

    if (!isValidWorkshopSlug(slug)) {
      setValidationError('Slug must use lowercase letters, numbers, and hyphens only');
      return;
    }

    if (!isValidWorkshopCapacity(parsedCapacity)) {
      setValidationError('Capacity must be positive');
      return;
    }

    setValidationError(null);
    await onSubmit({
      slug,
      title,
      status,
      start_at: new Date(startAt).toISOString(),
      end_at: endAt ? new Date(endAt).toISOString() : null,
      venue_name: venueName,
      city,
      country,
      capacity: parsedCapacity,
      default_locale: defaultLocale,
      show_remaining_seats: showRemainingSeats,
    });
  };

  return (
    <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
      {(validationError || errorMessage) && (
        <div className="rounded-lg border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100" role="alert">
          {validationError || errorMessage}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          Title
          <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" required value={title} onChange={(event) => setTitle(event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          Slug
          <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" required value={slug} onChange={(event) => setSlug(event.target.value)} placeholder="the-inner-compass" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          Status
          <select className="rounded-lg border border-white/12 bg-page-deep px-4 py-3 text-primary outline-none focus:border-accent" value={status} onChange={(event) => setStatus(event.target.value as typeof status)}>
            <option value="draft">draft</option>
            <option value="published">published</option>
            <option value="archived">archived</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          Default locale
          <select className="rounded-lg border border-white/12 bg-page-deep px-4 py-3 text-primary outline-none focus:border-accent" value={defaultLocale} onChange={(event) => setDefaultLocale(event.target.value as typeof defaultLocale)}>
            <option value="ms">BM</option>
            <option value="id">ID</option>
            <option value="en">EN</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          Capacity
          <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" min="1" required type="number" value={capacity} onChange={(event) => setCapacity(event.target.value)} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          Start
          <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" required type="datetime-local" value={startAt} onChange={(event) => setStartAt(event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          End
          <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" type="datetime-local" value={endAt} onChange={(event) => setEndAt(event.target.value)} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <label className="grid gap-2 text-sm font-semibold text-primary/82 sm:col-span-1">
          Venue
          <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" required value={venueName} onChange={(event) => setVenueName(event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          City
          <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" required value={city} onChange={(event) => setCity(event.target.value)} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          Country
          <select className="rounded-lg border border-white/12 bg-page-deep px-4 py-3 text-primary outline-none focus:border-accent" value={country} onChange={(event) => setCountry(event.target.value as typeof country)}>
            <option value="MY">Malaysia</option>
            <option value="ID">Indonesia</option>
          </select>
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm font-semibold text-primary/82">
        <input className="h-4 w-4 accent-accent" type="checkbox" checked={showRemainingSeats} onChange={(event) => setShowRemainingSeats(event.target.checked)} />
        Show remaining seats publicly
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <a className="rounded-lg border border-white/14 px-5 py-3 text-center text-sm font-bold text-primary/80 transition hover:border-accent/60" href="/admin">
          Cancel
        </a>
        <button className="rounded-lg bg-accent px-5 py-3 text-sm font-extrabold text-ink transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60" disabled={isSaving} type="submit">
          {isSaving ? 'Saving...' : 'Save workshop'}
        </button>
      </div>
    </form>
  );
}

function toLocalInputValue(value?: string | null) {
  if (!value) return null;
  return new Date(value).toISOString().slice(0, 16);
}
