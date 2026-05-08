import { useEffect, useState, type FormEvent } from 'react';
import { listWorkshopPrices, upsertWorkshopPrice, type WorkshopPriceInput } from '../../lib/workshops';
import type { Workshop, WorkshopCurrency } from '../../types/workshop';

type WorkshopPricingFormProps = {
  workshop: Workshop;
};

const currencies: WorkshopCurrency[] = ['MYR', 'IDR'];

export function WorkshopPricingForm({ workshop }: WorkshopPricingFormProps) {
  const [amounts, setAmounts] = useState<Record<WorkshopCurrency, string>>({ MYR: '', IDR: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    listWorkshopPrices(workshop.id).then(({ data, error }) => {
      if (!isMounted) return;
      if (error) setErrorMessage(error.message);
      const nextAmounts: Record<WorkshopCurrency, string> = { MYR: '', IDR: '' };
      for (const price of data ?? []) nextAmounts[price.currency] = String(price.amount);
      setAmounts(nextAmounts);
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

    for (const currency of currencies) {
      const amount = Number(amounts[currency]);
      if (!Number.isFinite(amount) || amount <= 0) continue;
      const input: WorkshopPriceInput = {
        workshop_id: workshop.id,
        currency,
        amount,
        early_bird_amount: null,
        early_bird_ends_at: null,
      };
      const { error } = await upsertWorkshopPrice(input);
      if (error) {
        setErrorMessage(error.message);
        setIsSaving(false);
        return;
      }
    }

    setIsSaving(false);
    setMessage('Pricing saved');
  };

  if (isLoading) return <div className="mt-8 rounded-xl border border-white/10 p-6 text-sm text-primary/68">Loading pricing...</div>;

  return (
    <section className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5">
      <h2 className="font-serif text-2xl font-semibold tracking-[-0.04em]">Pricing</h2>
      <p className="mt-2 text-sm text-primary/62">Set Malaysia and Indonesia workshop prices.</p>
      <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
        {errorMessage && <div className="rounded-lg border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100" role="alert">{errorMessage}</div>}
        {message && <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent" role="status">{message}</div>}
        <div className="grid gap-4 sm:grid-cols-2">
          {currencies.map((currency) => (
            <label className="grid gap-2 text-sm font-semibold text-primary/82" key={currency}>
              {currency}
              <input
                className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-primary outline-none focus:border-accent"
                min="1"
                type="number"
                value={amounts[currency]}
                onChange={(event) => setAmounts((current) => ({ ...current, [currency]: event.target.value }))}
              />
            </label>
          ))}
        </div>
        <div className="flex justify-end">
          <button className="rounded-lg bg-accent px-5 py-3 text-sm font-extrabold text-ink transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60" disabled={isSaving} type="submit">
            {isSaving ? 'Saving pricing...' : 'Save pricing'}
          </button>
        </div>
      </form>
    </section>
  );
}
