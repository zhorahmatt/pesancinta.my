import { useState } from 'react';
import { updateRegistrationStatus } from '../../lib/registrations';
import type { Registration, RegistrationStatus } from '../../types/registration';

type RegistrationStatusSelectProps = {
  registration: Registration;
  onChange?: (registration: Registration) => void;
};

const statuses: RegistrationStatus[] = ['pending', 'awaiting_payment', 'payment_submitted', 'confirmed', 'cancelled', 'refunded'];

export function RegistrationStatusSelect({ registration, onChange }: RegistrationStatusSelectProps) {
  const [status, setStatus] = useState<RegistrationStatus>(registration.status);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = async (nextStatus: RegistrationStatus) => {
    setStatus(nextStatus);
    setIsSaving(true);
    setErrorMessage(null);
    const { data, error } = await updateRegistrationStatus(registration.id, nextStatus);
    setIsSaving(false);
    if (error) {
      setErrorMessage(error.message);
      setStatus(registration.status);
      return;
    }
    onChange?.(data);
  };

  return (
    <div className="grid gap-2">
      <select className="rounded-lg border border-white/12 bg-page-deep px-4 py-3 text-primary outline-none focus:border-accent" disabled={isSaving} value={status} onChange={(event) => void handleChange(event.target.value as RegistrationStatus)}>
        {statuses.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      {errorMessage && <div className="text-sm text-red-100" role="alert">{errorMessage}</div>}
    </div>
  );
}
