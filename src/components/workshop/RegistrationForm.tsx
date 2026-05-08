import { useState, type FormEvent } from 'react';
import { notifyRegistrationSubmitted } from '../../lib/notifications';
import { canAcceptRegistration, createRegistration } from '../../lib/registrations';
import type { PaymentMethod, Workshop, WorkshopCountry, WorkshopLocale } from '../../types/workshop';
import { PaymentInstructions } from './PaymentInstructions';

type RegistrationFormProps = {
  workshop: Workshop;
  paymentMethods: PaymentMethod[];
  confirmedCount?: number;
};

type RegistrationDraft = {
  full_name: string;
  email: string;
  phone: string;
  country: WorkshopCountry;
  notes: string;
  payment_method_id: string;
};

const initialDraft: RegistrationDraft = {
  full_name: '',
  email: '',
  phone: '',
  country: 'MY',
  notes: '',
  payment_method_id: '',
};

export function RegistrationForm({ workshop, paymentMethods, confirmedCount = 0 }: RegistrationFormProps) {
  const [draft, setDraft] = useState<RegistrationDraft>({ ...initialDraft, payment_method_id: paymentMethods[0]?.id ?? '' });
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);

  const filteredMethods = paymentMethods.filter((method) => method.country === draft.country && method.is_active);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage(null);

    const validationError = validateRegistrationForm(draft);
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    if (!canAcceptRegistration(workshop.capacity, confirmedCount)) {
      setErrorMessage('Workshop capacity is full');
      return;
    }

    const paymentMethod = paymentMethods.find((method) => method.id === draft.payment_method_id) ?? null;
    setIsSaving(true);
    const { error } = await createRegistration({
      workshop_id: workshop.id,
      full_name: draft.full_name,
      email: draft.email,
      phone: draft.phone,
      country: draft.country,
      locale: workshop.default_locale as WorkshopLocale,
      payment_method_id: draft.payment_method_id || null,
      notes: draft.notes || null,
    });
    setIsSaving(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    if (paymentMethod) {
      notifyRegistrationSubmitted({
        phone: draft.phone,
        fullName: draft.full_name,
        workshopTitle: workshop.title,
        paymentInstructions: paymentMethod.instructions,
      });
    }
    setSelectedMethod(paymentMethod);
  };

  if (selectedMethod) return <PaymentInstructions method={selectedMethod} />;

  return (
    <form className="mt-10 grid gap-4 rounded-xl border border-white/10 bg-white/5 p-5" onSubmit={handleSubmit}>
      <div>
        <h2 className="font-serif text-2xl font-semibold tracking-[-0.04em]">Register</h2>
        <p className="mt-2 text-sm text-primary/62">Submit your details, then follow manual payment instructions.</p>
      </div>
      {errorMessage && <div className="rounded-lg border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100" role="alert">{errorMessage}</div>}

      <label className="grid gap-2 text-sm font-semibold text-primary/82">
        Full name
        <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" required value={draft.full_name} onChange={(event) => setDraft((current) => ({ ...current, full_name: event.target.value }))} />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          Email
          <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" required type="email" value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.target.value }))} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          Phone with country code
          <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" required value={draft.phone} onChange={(event) => setDraft((current) => ({ ...current, phone: event.target.value }))} />
        </label>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          country
          <select className="rounded-lg border border-white/12 bg-page-deep px-4 py-3 text-primary outline-none focus:border-accent" value={draft.country} onChange={(event) => setDraft((current) => ({ ...current, country: event.target.value as WorkshopCountry, payment_method_id: '' }))}>
            <option value="MY">Malaysia</option>
            <option value="ID">Indonesia</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          payment_method_id
          <select className="rounded-lg border border-white/12 bg-page-deep px-4 py-3 text-primary outline-none focus:border-accent" required value={draft.payment_method_id} onChange={(event) => setDraft((current) => ({ ...current, payment_method_id: event.target.value }))}>
            <option value="">Select payment method</option>
            {filteredMethods.map((method) => <option key={method.id} value={method.id}>{method.label}</option>)}
          </select>
        </label>
      </div>
      <label className="grid gap-2 text-sm font-semibold text-primary/82">
        notes
        <textarea className="min-h-24 rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" value={draft.notes} onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))} />
      </label>
      <div className="flex justify-end">
        <button className="rounded-lg bg-accent px-5 py-3 text-sm font-extrabold text-ink transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60" disabled={isSaving} type="submit">
          {isSaving ? 'Submitting...' : 'Submit registration'}
        </button>
      </div>
    </form>
  );
}

function validateRegistrationForm(draft: RegistrationDraft) {
  if (!draft.full_name.trim()) return 'Full name is required';
  if (!/^\S+@\S+\.\S+$/.test(draft.email)) return 'Valid email is required';
  if (draft.phone.trim().length < 7) return 'Phone is required';
  if (!draft.payment_method_id) return 'Payment method is required';
  return null;
}
