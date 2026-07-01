import { useEffect, useMemo, useState, type ReactNode } from 'react';
import type {
  InnerCompassData,
  SectionKey,
  WorkshopLocale,
} from '../../content/landing';

const inputCls =
  'w-full rounded-lg border border-white/12 bg-white/8 px-3 py-2 text-sm text-primary outline-none transition focus:border-accent';
const labelCls = 'mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-primary/60';
const cardCls = 'rounded-xl border border-white/10 bg-white/4 p-4';
const btnCls =
  'rounded-lg border border-white/14 px-3 py-1.5 text-xs font-semibold text-primary/82 transition hover:border-accent hover:text-accent disabled:opacity-40';

const sectionLabels: Record<SectionKey, string> = {
  empathy: 'Empathy',
  pillars: 'Pillars / Benefits',
  photoProof: 'Photo Proof',
  testimonials: 'Testimonials',
  trainers: 'Trainers',
  fasilitas: 'Fasilitas',
};

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Field({
  label,
  value,
  onChange,
  textarea,
  rows = 2,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className={labelCls}>{label}</span>
      {textarea ? (
        <textarea className={inputCls} rows={rows} value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} />
      )}
    </label>
  );
}

function ImageInput({
  label,
  value,
  onChange,
  onUpload,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onUpload: (file: File) => Promise<void>;
}) {
  return (
    <div>
      <span className={labelCls}>{label}</span>
      <div className="flex items-center gap-3">
        {value ? (
          <img src={value} alt="" className="h-12 w-12 rounded-md object-cover ring-1 ring-white/15" />
        ) : (
          <div className="grid h-12 w-12 place-items-center rounded-md bg-white/6 text-[0.6rem] text-primary/40">none</div>
        )}
        <input className={inputCls} value={value} onChange={(e) => onChange(e.target.value)} placeholder="/path/to/image.jpeg" />
        <label className={`${btnCls} cursor-pointer whitespace-nowrap`}>
          Upload
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void onUpload(file);
              e.target.value = '';
            }}
          />
        </label>
      </div>
    </div>
  );
}

function Group({
  id,
  title,
  isCollapsed,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  isCollapsed: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  const bodyId = `inner-compass-editor-${id}`;

  return (
    <section className={cardCls}>
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-bold uppercase tracking-[0.16em] text-accent">{title}</h3>
        <button
          type="button"
          className={btnCls}
          aria-controls={bodyId}
          aria-expanded={!isCollapsed}
          onClick={onToggle}
        >
          {isCollapsed ? 'Expand' : 'Collapse'}
        </button>
      </div>
      {!isCollapsed && (
        <div id={bodyId} className="mt-3 grid gap-3">
          {children}
        </div>
      )}
    </section>
  );
}

export function InnerCompassEditorPage() {
  const [data, setData] = useState<InnerCompassData | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [locale, setLocale] = useState<WorkshopLocale>('ms');
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetch('/__editor/inner-compass')
      .then(async (res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: InnerCompassData) => setData(json))
      .catch(() => setLoadError('Live editing is only available when running `npm run dev` locally.'));
  }, []);

  const update = (mutator: (draft: InnerCompassData) => void) => {
    setData((prev) => {
      if (!prev) return prev;
      const next = structuredClone(prev);
      mutator(next);
      return next;
    });
    setStatus(null);
  };

  const localeOptions = useMemo(() => data?.localeOrder ?? (['ms', 'id', 'en'] as WorkshopLocale[]), [data]);

  const toggleGroup = (groupId: string) => {
    setCollapsedGroups((prev) => ({ ...prev, [groupId]: !(prev[groupId] ?? true) }));
  };

  const groupProps = (groupId: string) => ({
    id: groupId,
    isCollapsed: collapsedGroups[groupId] ?? true,
    onToggle: () => toggleGroup(groupId),
  });

  async function uploadTo(set: (path: string) => void, file: File) {
    try {
      const dataBase64 = await fileToDataUrl(file);
      const res = await fetch('/__editor/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: file.name, dataBase64 }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Upload failed');
      set(json.path);
      setStatus(`Uploaded ${json.path}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Upload failed');
    }
  }

  async function save() {
    if (!data) return;
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/__editor/inner-compass', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Save failed');
      setStatus('Saved. The live page will hot-reload.');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  if (loadError) {
    return (
      <div className="rounded-xl border border-amber-300/30 bg-amber-300/10 p-5 text-sm text-amber-100">
        {loadError}
      </div>
    );
  }

  if (!data) {
    return <div className="text-sm text-primary/70">Loading content…</div>;
  }

  const L = data.locales[locale];

  return (
    <div className="grid gap-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-primary">Inner Compass Page</h1>
          <p className="mt-1 text-xs text-primary/60">
            Edits write to <code>src/content/innerCompass.json</code> — commit the file to publish.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {status && <span className="text-xs text-primary/70">{status}</span>}
          <button type="button" onClick={() => void save()} disabled={saving} className="rounded-lg bg-accent px-5 py-2 text-sm font-bold text-ink transition hover:bg-accent-deep disabled:opacity-50">
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </header>

      {/* Section layout */}
      <Group title="Sections — order & visibility" {...groupProps('section-layout')}>
        <div className="grid gap-2">
          {data.layout.map((section, index) => (
            <div key={section.key} className="flex items-center justify-between rounded-lg border border-white/10 bg-white/4 px-3 py-2">
              <label className="flex items-center gap-2 text-sm text-primary">
                <input
                  type="checkbox"
                  checked={section.visible}
                  onChange={(e) => update((d) => { d.layout[index].visible = e.target.checked; })}
                />
                {sectionLabels[section.key]}
              </label>
              <div className="flex gap-1">
                <button type="button" className={btnCls} disabled={index === 0} onClick={() => update((d) => { const a = d.layout; [a[index - 1], a[index]] = [a[index], a[index - 1]]; })}>↑</button>
                <button type="button" className={btnCls} disabled={index === data.layout.length - 1} onClick={() => update((d) => { const a = d.layout; [a[index + 1], a[index]] = [a[index], a[index + 1]]; })}>↓</button>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-primary/50">Hero stays first and the footer stays last; the sections above are reorderable.</p>
      </Group>

      {/* Event */}
      <Group title="Event details (shared across languages)" {...groupProps('event-details')}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Name" value={data.event.name} onChange={(v) => update((d) => { d.event.name = v; })} />
          <Field label="City" value={data.event.city} onChange={(v) => update((d) => { d.event.city = v; })} />
          <Field label="Venue" value={data.event.venue} onChange={(v) => update((d) => { d.event.venue = v; })} />
          <Field label="Date" value={data.event.date} onChange={(v) => update((d) => { d.event.date = v; })} />
          <Field label="Time" value={data.event.time} onChange={(v) => update((d) => { d.event.time = v; })} />
          <Field label="Capacity" value={data.event.capacity} onChange={(v) => update((d) => { d.event.capacity = v; })} />
        </div>
      </Group>

      {/* Contacts */}
      <Group title="WhatsApp contacts" {...groupProps('whatsapp-contacts')}>
        {data.contacts.map((contact, index) => (
          <div key={index} className="flex items-end gap-2">
            <div className="flex-1"><Field label="Name" value={contact.name} onChange={(v) => update((d) => { d.contacts[index].name = v; })} /></div>
            <div className="flex-1"><Field label="Phone" value={contact.phone} onChange={(v) => update((d) => { d.contacts[index].phone = v; })} /></div>
            <button type="button" className={btnCls} onClick={() => update((d) => { d.contacts.splice(index, 1); })}>Remove</button>
          </div>
        ))}
        <button type="button" className={btnCls} onClick={() => update((d) => { d.contacts.push({ name: '', phone: '' }); })}>+ Add contact</button>
      </Group>

      {/* Photo gallery groups (shared) */}
      {(['proof', 'batchThree'] as const).map((groupKey) => (
        <Group key={groupKey} title={groupKey === 'proof' ? 'Photo gallery — Batch 2 (shared)' : 'Photo gallery — Batch 3 (shared)'} {...groupProps(`photo-gallery-${groupKey}`)}>
          {data.photoGroups[groupKey].map((group, gi) => (
            <div key={gi} className="rounded-lg border border-white/8 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs font-semibold text-primary/60">Group {gi + 1}</span>
                <button type="button" className={btnCls} onClick={() => update((d) => { d.photoGroups[groupKey].splice(gi, 1); })}>Remove group</button>
              </div>
              <div className="grid gap-2">
                {group.map((src, si) => (
                  <div key={si} className="flex items-end gap-2">
                    <div className="flex-1">
                      <ImageInput
                        label={`Image ${si + 1}`}
                        value={src}
                        onChange={(v) => update((d) => { d.photoGroups[groupKey][gi][si] = v; })}
                        onUpload={(file) => uploadTo((path) => update((d) => { d.photoGroups[groupKey][gi][si] = path; }), file)}
                      />
                    </div>
                    <button type="button" className={btnCls} onClick={() => update((d) => { d.photoGroups[groupKey][gi].splice(si, 1); })}>×</button>
                  </div>
                ))}
                <button type="button" className={btnCls} onClick={() => update((d) => { d.photoGroups[groupKey][gi].push(''); })}>+ Add image</button>
              </div>
            </div>
          ))}
          <button type="button" className={btnCls} onClick={() => update((d) => { d.photoGroups[groupKey].push([]); })}>+ Add group</button>
        </Group>
      ))}

      {/* Locale tabs */}
      <div className="flex gap-2">
        {localeOptions.map((code) => (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            className={`rounded-lg px-4 py-2 text-sm font-bold transition ${locale === code ? 'bg-accent text-ink' : 'border border-white/14 text-primary/75 hover:border-accent'}`}
          >
            {data.locales[code].label}
          </button>
        ))}
      </div>

      <Group title={`Hero — ${L.label}`} {...groupProps('hero')}>
        <Field label="Registration WhatsApp message" textarea value={L.registrationMessage} onChange={(v) => update((d) => { d.locales[locale].registrationMessage = v; })} />
        <Field label="Eyebrow" value={L.hero.eyebrow} onChange={(v) => update((d) => { d.locales[locale].hero.eyebrow = v; })} />
        <Field label="Kicker" value={L.hero.kicker} onChange={(v) => update((d) => { d.locales[locale].hero.kicker = v; })} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Headline line 1" value={L.hero.headlineLines[0] ?? ''} onChange={(v) => update((d) => { d.locales[locale].hero.headlineLines[0] = v; })} />
          <Field label="Headline line 2 (accent)" value={L.hero.headlineLines[1] ?? ''} onChange={(v) => update((d) => { d.locales[locale].hero.headlineLines[1] = v; })} />
        </div>
        <Field label="Subheadline" textarea value={L.hero.subheadline} onChange={(v) => update((d) => { d.locales[locale].hero.subheadline = v; })} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Badge" value={L.hero.badge} onChange={(v) => update((d) => { d.locales[locale].hero.badge = v; })} />
          <Field label="CTA label" value={L.hero.ctaLabel} onChange={(v) => update((d) => { d.locales[locale].hero.ctaLabel = v; })} />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Label: date" value={L.hero.eventLabels.date} onChange={(v) => update((d) => { d.locales[locale].hero.eventLabels.date = v; })} />
          <Field label="Label: venue" value={L.hero.eventLabels.venue} onChange={(v) => update((d) => { d.locales[locale].hero.eventLabels.venue = v; })} />
          <Field label="Label: city" value={L.hero.eventLabels.city} onChange={(v) => update((d) => { d.locales[locale].hero.eventLabels.city = v; })} />
        </div>
      </Group>

      <Group title={`Empathy — ${L.label}`} {...groupProps('empathy')}>
        <Field label="Eyebrow" value={L.empathy.eyebrow} onChange={(v) => update((d) => { d.locales[locale].empathy.eyebrow = v; })} />
        <Field label="Headline" value={L.empathy.headline} onChange={(v) => update((d) => { d.locales[locale].empathy.headline = v; })} />
        <Field label="Subheadline" textarea value={L.empathy.subheadline} onChange={(v) => update((d) => { d.locales[locale].empathy.subheadline = v; })} />
        {L.empathy.paragraphs.map((p, i) => (
          <div key={i} className="flex items-end gap-2">
            <div className="flex-1"><Field label={`Paragraph ${i + 1}`} textarea value={p} onChange={(v) => update((d) => { d.locales[locale].empathy.paragraphs[i] = v; })} /></div>
            <button type="button" className={btnCls} onClick={() => update((d) => { d.locales[locale].empathy.paragraphs.splice(i, 1); })}>Remove</button>
          </div>
        ))}
        <button type="button" className={btnCls} onClick={() => update((d) => { d.locales[locale].empathy.paragraphs.push(''); })}>+ Add paragraph</button>
      </Group>

      <Group title={`Pillars — ${L.label}`} {...groupProps('pillars')}>
        <Field label="Eyebrow" value={L.pillars.eyebrow} onChange={(v) => update((d) => { d.locales[locale].pillars.eyebrow = v; })} />
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Headline prefix" value={L.pillars.headlinePrefix} onChange={(v) => update((d) => { d.locales[locale].pillars.headlinePrefix = v; })} />
          <Field label="Headline accent" value={L.pillars.headlineAccent} onChange={(v) => update((d) => { d.locales[locale].pillars.headlineAccent = v; })} />
          <Field label="Headline suffix" value={L.pillars.headlineSuffix} onChange={(v) => update((d) => { d.locales[locale].pillars.headlineSuffix = v; })} />
        </div>
        <Field label="Subheadline" textarea value={L.pillars.subheadline} onChange={(v) => update((d) => { d.locales[locale].pillars.subheadline = v; })} />
        {L.pillars.items.map((item, i) => (
          <div key={i} className="rounded-lg border border-white/8 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-primary/60">Item {i + 1}</span>
              <button type="button" className={btnCls} onClick={() => update((d) => { d.locales[locale].pillars.items.splice(i, 1); })}>Remove</button>
            </div>
            <div className="grid gap-3">
              <Field label="Title" value={item.title} onChange={(v) => update((d) => { d.locales[locale].pillars.items[i].title = v; })} />
              <Field label="Text" textarea value={item.text} onChange={(v) => update((d) => { d.locales[locale].pillars.items[i].text = v; })} />
            </div>
          </div>
        ))}
        <button type="button" className={btnCls} onClick={() => update((d) => { d.locales[locale].pillars.items.push({ title: '', text: '' }); })}>+ Add pillar</button>
      </Group>

      <Group title={`Photo Proof — ${L.label}`} {...groupProps('photo-proof')}>
        <Field label="Eyebrow" value={L.photoProof.eyebrow} onChange={(v) => update((d) => { d.locales[locale].photoProof.eyebrow = v; })} />
        <Field label="Headline" value={L.photoProof.headline} onChange={(v) => update((d) => { d.locales[locale].photoProof.headline = v; })} />
        <Field label="Subheadline" textarea value={L.photoProof.subheadline} onChange={(v) => update((d) => { d.locales[locale].photoProof.subheadline = v; })} />
      </Group>

      <Group title={`Testimonials — ${L.label}`} {...groupProps('testimonials')}>
        <Field label="Eyebrow" value={L.testimonials.eyebrow} onChange={(v) => update((d) => { d.locales[locale].testimonials.eyebrow = v; })} />
        <Field label="Headline" value={L.testimonials.headline} onChange={(v) => update((d) => { d.locales[locale].testimonials.headline = v; })} />
        <Field label="Subheadline" textarea value={L.testimonials.subheadline} onChange={(v) => update((d) => { d.locales[locale].testimonials.subheadline = v; })} />
        {L.testimonials.items.map((item, i) => (
          <div key={i} className="rounded-lg border border-white/8 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-primary/60">Testimonial {i + 1}</span>
              <button type="button" className={btnCls} onClick={() => update((d) => { d.locales[locale].testimonials.items.splice(i, 1); })}>Remove</button>
            </div>
            <div className="grid gap-3">
              <Field label="Quote" textarea value={item.text} onChange={(v) => update((d) => { d.locales[locale].testimonials.items[i].text = v; })} />
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Name" value={item.name} onChange={(v) => update((d) => { d.locales[locale].testimonials.items[i].name = v; })} />
                <Field label="Role" value={item.role} onChange={(v) => update((d) => { d.locales[locale].testimonials.items[i].role = v; })} />
              </div>
              <ImageInput
                label="Image"
                value={item.image}
                onChange={(v) => update((d) => { d.locales[locale].testimonials.items[i].image = v; })}
                onUpload={(file) => uploadTo((path) => update((d) => { d.locales[locale].testimonials.items[i].image = path; }), file)}
              />
            </div>
          </div>
        ))}
        <button type="button" className={btnCls} onClick={() => update((d) => { d.locales[locale].testimonials.items.push({ text: '', image: '', name: '', role: '' }); })}>+ Add testimonial</button>
      </Group>

      <Group title={`Trainers — ${L.label}`} {...groupProps('trainers')}>
        <Field label="Eyebrow" value={L.trainers.eyebrow} onChange={(v) => update((d) => { d.locales[locale].trainers.eyebrow = v; })} />
        <Field label="Headline" value={L.trainers.headline} onChange={(v) => update((d) => { d.locales[locale].trainers.headline = v; })} />
        <Field label="Subheadline" textarea value={L.trainers.subheadline} onChange={(v) => update((d) => { d.locales[locale].trainers.subheadline = v; })} />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Role label" value={L.trainers.roleLabel} onChange={(v) => update((d) => { d.locales[locale].trainers.roleLabel = v; })} />
          <Field label="Instagram label" value={L.trainers.instagramLabel} onChange={(v) => update((d) => { d.locales[locale].trainers.instagramLabel = v; })} />
        </div>
        {L.trainers.items.map((item, i) => (
          <div key={i} className="rounded-lg border border-white/8 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-primary/60">Trainer {i + 1}</span>
              <button type="button" className={btnCls} onClick={() => update((d) => { d.locales[locale].trainers.items.splice(i, 1); })}>Remove</button>
            </div>
            <div className="grid gap-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Name" value={item.name} onChange={(v) => update((d) => { d.locales[locale].trainers.items[i].name = v; })} />
                <Field label="Initials" value={item.initials} onChange={(v) => update((d) => { d.locales[locale].trainers.items[i].initials = v; })} />
              </div>
              <Field label="Quote" textarea value={item.quote} onChange={(v) => update((d) => { d.locales[locale].trainers.items[i].quote = v; })} />
            </div>
          </div>
        ))}
        <button type="button" className={btnCls} onClick={() => update((d) => { d.locales[locale].trainers.items.push({ name: '', quote: '', initials: '' }); })}>+ Add trainer</button>
      </Group>

      <Group title={`Footer — ${L.label}`} {...groupProps('footer')}>
        <Field label="Eyebrow" value={L.footer.eyebrow} onChange={(v) => update((d) => { d.locales[locale].footer.eyebrow = v; })} />
        <Field label="Headline" value={L.footer.headline} onChange={(v) => update((d) => { d.locales[locale].footer.headline = v; })} />
        <Field label="Investment text" value={L.footer.investmentText} onChange={(v) => update((d) => { d.locales[locale].footer.investmentText = v; })} />
        <Field label="Contact prompt" value={L.footer.contactPrompt} onChange={(v) => update((d) => { d.locales[locale].footer.contactPrompt = v; })} />
        <div className="grid gap-3 sm:grid-cols-3">
          <Field label="Date label" value={L.footer.dateLabel} onChange={(v) => update((d) => { d.locales[locale].footer.dateLabel = v; })} />
          <Field label="Capacity label" value={L.footer.capacityLabel} onChange={(v) => update((d) => { d.locales[locale].footer.capacityLabel = v; })} />
          <Field label="City label" value={L.footer.cityLabel} onChange={(v) => update((d) => { d.locales[locale].footer.cityLabel = v; })} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="WhatsApp label" value={L.footer.whatsappLabel} onChange={(v) => update((d) => { d.locales[locale].footer.whatsappLabel = v; })} />
          <Field label="Organizer label" value={L.footer.organizerLabel} onChange={(v) => update((d) => { d.locales[locale].footer.organizerLabel = v; })} />
        </div>
        <Field label="Copyright" value={L.footer.copyright} onChange={(v) => update((d) => { d.locales[locale].footer.copyright = v; })} />
      </Group>

      <div className="flex justify-end">
        <button type="button" onClick={() => void save()} disabled={saving} className="rounded-lg bg-accent px-6 py-2.5 text-sm font-bold text-ink transition hover:bg-accent-deep disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}
