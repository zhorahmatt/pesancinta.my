import { useEffect, useState, type FormEvent } from 'react';
import { createEventRegistration } from '../../lib/registrations';
import { createWhatsAppUrl } from '../../lib/whatsapp';
import type { WorkshopCountry, WorkshopLocale } from '../../types/workshop';

type RegistrationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  eventKey: string;
  locale: WorkshopLocale;
  whatsappPhone: string;
  registrationMessage: string;
};

type Labels = {
  title: string;
  subtitle: string;
  name: string;
  email: string;
  whatsapp: string;
  submit: string;
  submitting: string;
  close: string;
  error: string;
};

const labelsByLocale: Record<WorkshopLocale, Labels> = {
  ms: {
    title: 'Daftar Workshop',
    subtitle: 'Isi maklumat anda. Selepas hantar, anda akan diarahkan ke WhatsApp.',
    name: 'Nama penuh',
    email: 'Emel',
    whatsapp: 'Nombor WhatsApp',
    submit: 'Register Now',
    submitting: 'Menghantar…',
    close: 'Tutup',
    error: 'Gagal menghantar. Sila cuba lagi.',
  },
  id: {
    title: 'Daftar Workshop',
    subtitle: 'Isi data kamu. Setelah dikirim, kamu akan diarahkan ke WhatsApp.',
    name: 'Nama lengkap',
    email: 'Email',
    whatsapp: 'Nomor WhatsApp',
    submit: 'Register Now',
    submitting: 'Mengirim…',
    close: 'Tutup',
    error: 'Gagal mengirim. Silakan coba lagi.',
  },
  en: {
    title: 'Register for the Workshop',
    subtitle: 'Fill in your details. After submitting you will be sent to WhatsApp.',
    name: 'Full name',
    email: 'Email',
    whatsapp: 'WhatsApp number',
    submit: 'Register Now',
    submitting: 'Submitting…',
    close: 'Close',
    error: 'Could not submit. Please try again.',
  },
};

// Malaysian numbers use +60; everything else defaults to Indonesia for the
// registrations.country enum (MY | ID).
function countryFromPhone(phone: string): WorkshopCountry {
  const digits = phone.replace(/\D/g, '');
  return digits.startsWith('60') ? 'MY' : 'ID';
}

const inputCls =
  'w-full rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none transition focus:border-accent';

export function RegistrationModal({ isOpen, onClose, eventKey, locale, whatsappPhone, registrationMessage }: RegistrationModalProps) {
  const labels = labelsByLocale[locale];
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const redirectToWhatsApp = () => {
    const details = `\n\nNama: ${name}\nEmail: ${email}\nWhatsApp: ${whatsapp}`;
    window.location.href = createWhatsAppUrl(whatsappPhone, `${registrationMessage}${details}`);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    if (!name.trim() || !/^\S+@\S+\.\S+$/.test(email) || whatsapp.replace(/\D/g, '').length < 7) {
      setError(labels.error);
      return;
    }

    setIsSaving(true);
    try {
      const { error: saveError } = await createEventRegistration({
        event_key: eventKey,
        full_name: name.trim(),
        email: email.trim(),
        phone: whatsapp.trim(),
        country: countryFromPhone(whatsapp),
        locale,
      });
      if (saveError) throw saveError;
      redirectToWhatsApp();
    } catch {
      setError(labels.error);
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={labels.title}
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-white/12 bg-page-deep p-6 shadow-soft"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-serif text-2xl font-semibold tracking-[-0.04em] text-primary">{labels.title}</h2>
            <p className="mt-1 text-sm text-primary/62">{labels.subtitle}</p>
          </div>
          <button type="button" onClick={onClose} aria-label={labels.close} className="rounded-lg px-2 py-1 text-xl leading-none text-primary/60 transition hover:text-primary">×</button>
        </div>

        {error && <div className="mb-4 rounded-lg border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100" role="alert">{error}</div>}

        <form className="grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-semibold text-primary/82">
            {labels.name}
            <input className={inputCls} required value={name} onChange={(e) => setName(e.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-primary/82">
            {labels.email}
            <input className={inputCls} required type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-primary/82">
            {labels.whatsapp}
            <input className={inputCls} required inputMode="tel" placeholder="+60 / +62 …" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          </label>
          <button
            type="submit"
            disabled={isSaving}
            className="mt-1 rounded-lg bg-accent px-5 py-3 text-sm font-extrabold text-ink transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? labels.submitting : labels.submit}
          </button>
        </form>
      </div>
    </div>
  );
}
