import { useEffect, useState, type Dispatch, type FormEvent, type SetStateAction } from 'react';
import {
  hasRequiredDefaultLocaleContent,
  listWorkshopLocaleContent,
  upsertWorkshopLocaleContent,
  type WorkshopContentInput,
} from '../../lib/workshops';
import type { Workshop, WorkshopLocale } from '../../types/workshop';

type WorkshopContentFormProps = {
  workshop: Workshop;
};

type LocaleDraft = {
  headline: string;
  subheadline: string;
  description: string;
  cta_label: string;
  registration_message: string;
  sections_json: string;
};

const localeLabels: Record<WorkshopLocale, string> = {
  ms: 'Bahasa Malaysia',
  id: 'Bahasa Indonesia',
  en: 'English optional',
};

const localeOrder: WorkshopLocale[] = ['ms', 'id', 'en'];

const emptyDraft: LocaleDraft = {
  headline: '',
  subheadline: '',
  description: '',
  cta_label: '',
  registration_message: '',
  sections_json: '{}',
};

export function WorkshopContentForm({ workshop }: WorkshopContentFormProps) {
  const [drafts, setDrafts] = useState<Record<WorkshopLocale, LocaleDraft>>({ ms: emptyDraft, id: emptyDraft, en: emptyDraft });
  const [activeLocale, setActiveLocale] = useState<WorkshopLocale>(workshop.default_locale);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    listWorkshopLocaleContent(workshop.id).then(({ data, error }) => {
      if (!isMounted) return;
      if (error) setErrorMessage(error.message);

      const nextDrafts = { ms: { ...emptyDraft }, id: { ...emptyDraft }, en: { ...emptyDraft } };
      for (const content of data ?? []) {
        nextDrafts[content.locale] = {
          headline: content.headline,
          subheadline: content.subheadline ?? '',
          description: content.description ?? '',
          cta_label: content.cta_label,
          registration_message: content.registration_message,
          sections_json: JSON.stringify(content.sections_json, null, 2),
        };
      }

      setDrafts(nextDrafts);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [workshop.id]);

  const activeDraft = drafts[activeLocale];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setErrorMessage(null);

    const inputs = toContentInputs(workshop.id, drafts);
    if (workshop.status === 'published' && !hasRequiredDefaultLocaleContent(inputs, workshop.default_locale)) {
      setErrorMessage('Default-locale content is required before publishing');
      return;
    }

    setIsSaving(true);
    for (const input of inputs) {
      if (!input.headline.trim() && input.locale === 'en') continue;
      const { error } = await upsertWorkshopLocaleContent(input);
      if (error) {
        setErrorMessage(error.message);
        setIsSaving(false);
        return;
      }
    }

    setIsSaving(false);
    setMessage('Content saved');
  };

  if (isLoading) {
    return <div className="mt-8 rounded-xl border border-white/10 p-6 text-sm text-primary/68">Loading localized content...</div>;
  }

  return (
    <section className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-serif text-2xl font-semibold tracking-[-0.04em]">Localized content</h2>
          <p className="mt-2 text-sm text-primary/62">Edit BM and ID content. English optional for MVP.</p>
        </div>
        <div className="flex rounded-full border border-white/12 p-1">
          {localeOrder.map((locale) => (
            <button
              className={`rounded-full px-3 py-2 text-xs font-bold transition ${activeLocale === locale ? 'bg-accent text-ink' : 'text-primary/68 hover:text-primary'}`}
              key={locale}
              onClick={() => setActiveLocale(locale)}
              type="button"
            >
              {localeLabels[locale]}
            </button>
          ))}
        </div>
      </div>

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        {errorMessage && <div className="rounded-lg border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100" role="alert">{errorMessage}</div>}
        {message && <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent" role="status">{message}</div>}

        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          headline
          <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" value={activeDraft.headline} onChange={(event) => updateDraft(activeLocale, 'headline', event.target.value, setDrafts)} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          subheadline
          <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" value={activeDraft.subheadline} onChange={(event) => updateDraft(activeLocale, 'subheadline', event.target.value, setDrafts)} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          description
          <textarea className="min-h-28 rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" value={activeDraft.description} onChange={(event) => updateDraft(activeLocale, 'description', event.target.value, setDrafts)} />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold text-primary/82">
            cta_label
            <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" value={activeDraft.cta_label} onChange={(event) => updateDraft(activeLocale, 'cta_label', event.target.value, setDrafts)} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-primary/82">
            registration_message
            <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" value={activeDraft.registration_message} onChange={(event) => updateDraft(activeLocale, 'registration_message', event.target.value, setDrafts)} />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          sections_json
          <textarea className="min-h-36 rounded-lg border border-white/12 bg-white/8 px-4 py-3 font-mono text-sm text-primary outline-none focus:border-accent" value={activeDraft.sections_json} onChange={(event) => updateDraft(activeLocale, 'sections_json', event.target.value, setDrafts)} />
        </label>
        <div className="flex justify-end">
          <button className="rounded-lg bg-accent px-5 py-3 text-sm font-extrabold text-ink transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60" disabled={isSaving} type="submit">
            {isSaving ? 'Saving content...' : 'Save localized content'}
          </button>
        </div>
      </form>
    </section>
  );
}

function updateDraft(
  locale: WorkshopLocale,
  field: keyof LocaleDraft,
  value: string,
  setDrafts: Dispatch<SetStateAction<Record<WorkshopLocale, LocaleDraft>>>,
) {
  setDrafts((current) => ({ ...current, [locale]: { ...current[locale], [field]: value } }));
}

function toContentInputs(workshopId: string, drafts: Record<WorkshopLocale, LocaleDraft>): WorkshopContentInput[] {
  return localeOrder.map((locale) => {
    let sectionsJson: Record<string, unknown> = {};
    try {
      sectionsJson = JSON.parse(drafts[locale].sections_json || '{}') as Record<string, unknown>;
    } catch {
      sectionsJson = {};
    }

    return {
      workshop_id: workshopId,
      locale,
      headline: drafts[locale].headline,
      subheadline: drafts[locale].subheadline || null,
      description: drafts[locale].description || null,
      cta_label: drafts[locale].cta_label,
      registration_message: drafts[locale].registration_message,
      sections_json: sectionsJson,
    };
  });
}
