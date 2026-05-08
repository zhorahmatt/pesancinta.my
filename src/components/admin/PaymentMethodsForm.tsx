import { useEffect, useState, type FormEvent } from 'react';
import { listWorkshopPaymentMethods, upsertWorkshopPaymentMethod, type PaymentMethodInput } from '../../lib/workshops';
import type { PaymentMethod, PaymentMethodType, Workshop, WorkshopCountry, WorkshopCurrency } from '../../types/workshop';

type PaymentMethodsFormProps = {
  workshop: Workshop;
};

type PaymentDraft = {
  id?: string;
  country: WorkshopCountry;
  currency: WorkshopCurrency;
  type: PaymentMethodType;
  label: string;
  instructions: string;
  account_name: string;
  account_number: string;
  bank_name: string;
  qr_image_url: string;
  is_active: boolean;
};

const defaultDraft: PaymentDraft = {
  country: 'MY',
  currency: 'MYR',
  type: 'bank_transfer',
  label: 'Bank transfer',
  instructions: '',
  account_name: '',
  account_number: '',
  bank_name: '',
  qr_image_url: '',
  is_active: true,
};

export function PaymentMethodsForm({ workshop }: PaymentMethodsFormProps) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [draft, setDraft] = useState<PaymentDraft>(defaultDraft);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    listWorkshopPaymentMethods(workshop.id).then(({ data, error }) => {
      if (!isMounted) return;
      if (error) setErrorMessage(error.message);
      setMethods(data ?? []);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [workshop.id]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setMessage(null);
    setErrorMessage(null);

    const input: PaymentMethodInput = {
      id: draft.id,
      workshop_id: workshop.id,
      country: draft.country,
      currency: draft.currency,
      type: draft.type,
      label: draft.label,
      instructions: draft.instructions,
      account_name: draft.account_name || null,
      account_number: draft.account_number || null,
      bank_name: draft.bank_name || null,
      qr_image_url: draft.qr_image_url || null,
      is_active: draft.is_active,
    };

    const { data, error } = await upsertWorkshopPaymentMethod(input);
    setIsSaving(false);

    if (error) {
      setErrorMessage(error.message);
      return;
    }

    setMethods((current) => [data, ...current.filter((method) => method.id !== data.id)]);
    setDraft(defaultDraft);
    setMessage('Payment method saved');
  };

  if (isLoading) return <div className="mt-8 rounded-xl border border-white/10 p-6 text-sm text-primary/68">Loading payment methods...</div>;

  return (
    <section className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5">
      <h2 className="font-serif text-2xl font-semibold tracking-[-0.04em]">Manual payment methods</h2>
      <p className="mt-2 text-sm text-primary/62">Configure Malaysia and Indonesia bank transfer or static QR instructions.</p>

      {methods.length > 0 && (
        <div className="mt-5 grid gap-3">
          {methods.map((method) => (
            <button className="rounded-lg border border-white/10 p-4 text-left transition hover:border-accent/50" key={method.id} onClick={() => setDraft(toDraft(method))} type="button">
              <div className="flex items-center justify-between gap-3">
                <span className="font-bold text-primary">{method.label}</span>
                <span className="text-xs font-bold uppercase text-primary/52">{method.is_active ? 'active' : 'inactive'}</span>
              </div>
              <p className="mt-1 text-xs text-primary/58">{method.country} · {method.currency} · {method.type}</p>
            </button>
          ))}
        </div>
      )}

      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        {errorMessage && <div className="rounded-lg border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100" role="alert">{errorMessage}</div>}
        {message && <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent" role="status">{message}</div>}

        <div className="grid gap-4 sm:grid-cols-4">
          <label className="grid gap-2 text-sm font-semibold text-primary/82">
            Country
            <select className="rounded-lg border border-white/12 bg-page-deep px-4 py-3 text-primary outline-none focus:border-accent" value={draft.country} onChange={(event) => setDraft((current) => ({ ...current, country: event.target.value as WorkshopCountry }))}>
              <option value="MY">Malaysia</option>
              <option value="ID">Indonesia</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-primary/82">
            Currency
            <select className="rounded-lg border border-white/12 bg-page-deep px-4 py-3 text-primary outline-none focus:border-accent" value={draft.currency} onChange={(event) => setDraft((current) => ({ ...current, currency: event.target.value as WorkshopCurrency }))}>
              <option value="MYR">MYR</option>
              <option value="IDR">IDR</option>
            </select>
          </label>
          <label className="grid gap-2 text-sm font-semibold text-primary/82">
            Type
            <select className="rounded-lg border border-white/12 bg-page-deep px-4 py-3 text-primary outline-none focus:border-accent" value={draft.type} onChange={(event) => setDraft((current) => ({ ...current, type: event.target.value as PaymentMethodType }))}>
              <option value="bank_transfer">bank_transfer</option>
              <option value="static_qr">static_qr</option>
            </select>
          </label>
          <label className="flex items-center gap-3 pt-7 text-sm font-semibold text-primary/82">
            <input className="h-4 w-4 accent-accent" checked={draft.is_active} type="checkbox" onChange={(event) => setDraft((current) => ({ ...current, is_active: event.target.checked }))} />
            is_active
          </label>
        </div>

        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          Label
          <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" required value={draft.label} onChange={(event) => setDraft((current) => ({ ...current, label: event.target.value }))} />
        </label>
        <div className="grid gap-4 sm:grid-cols-3">
          <label className="grid gap-2 text-sm font-semibold text-primary/82">
            Bank name
            <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" value={draft.bank_name} onChange={(event) => setDraft((current) => ({ ...current, bank_name: event.target.value }))} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-primary/82">
            Account name
            <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" value={draft.account_name} onChange={(event) => setDraft((current) => ({ ...current, account_name: event.target.value }))} />
          </label>
          <label className="grid gap-2 text-sm font-semibold text-primary/82">
            Account number
            <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" value={draft.account_number} onChange={(event) => setDraft((current) => ({ ...current, account_number: event.target.value }))} />
          </label>
        </div>
        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          qr_image_url
          <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" value={draft.qr_image_url} onChange={(event) => setDraft((current) => ({ ...current, qr_image_url: event.target.value }))} />
        </label>
        <label className="grid gap-2 text-sm font-semibold text-primary/82">
          Instructions
          <textarea className="min-h-28 rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent" required value={draft.instructions} onChange={(event) => setDraft((current) => ({ ...current, instructions: event.target.value }))} />
        </label>
        <div className="flex justify-end">
          <button className="rounded-lg bg-accent px-5 py-3 text-sm font-extrabold text-ink transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60" disabled={isSaving} type="submit">
            {isSaving ? 'Saving method...' : 'Save payment method'}
          </button>
        </div>
      </form>
    </section>
  );
}

function toDraft(method: PaymentMethod): PaymentDraft {
  return {
    id: method.id,
    country: method.country,
    currency: method.currency,
    type: method.type,
    label: method.label,
    instructions: method.instructions,
    account_name: method.account_name ?? '',
    account_number: method.account_number ?? '',
    bank_name: method.bank_name ?? '',
    qr_image_url: method.qr_image_url ?? '',
    is_active: method.is_active,
  };
}
