import { useState, type FormEvent } from 'react';
import { createPaymentProof, markRegistrationPaymentSubmitted } from '../../lib/registrations';
import { uploadPaymentProof } from '../../lib/storage';

type PaymentProofUploadProps = {
  registrationId: string;
  isEnabled: boolean;
};

export function PaymentProofUpload({ registrationId, isEnabled }: PaymentProofUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isEnabled) return null;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setErrorMessage('Payment proof file is required');
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);
    setMessage(null);

    const uploadResult = await uploadPaymentProof(registrationId, file);
    if (uploadResult.error || !uploadResult.data) {
      setErrorMessage(uploadResult.error?.message ?? 'Upload failed');
      setIsSaving(false);
      return;
    }

    const proofResult = await createPaymentProof(registrationId, uploadResult.data.file_url);
    if (proofResult.error) {
      setErrorMessage(proofResult.error.message);
      setIsSaving(false);
      return;
    }

    const statusResult = await markRegistrationPaymentSubmitted(registrationId);
    if (statusResult.error) {
      setErrorMessage(statusResult.error.message);
      setIsSaving(false);
      return;
    }

    setIsSaving(false);
    setMessage('Payment proof submitted. Registration status: payment_submitted');
  };

  return (
    <form className="mt-6 grid gap-4 rounded-xl border border-white/10 bg-white/5 p-5" onSubmit={handleSubmit}>
      <div>
        <h3 className="font-serif text-xl font-semibold tracking-[-0.04em]">Upload payment proof</h3>
        <p className="mt-2 text-sm text-primary/62">Optional. Admin can still approve payment from external bank or QR checking.</p>
      </div>
      {errorMessage && <div className="rounded-lg border border-red-300/30 bg-red-500/10 px-4 py-3 text-sm text-red-100" role="alert">{errorMessage}</div>}
      {message && <div className="rounded-lg border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent" role="status">{message}</div>}
      <input className="rounded-lg border border-white/12 bg-white/8 px-4 py-3 text-sm text-primary" type="file" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />
      <div className="flex justify-end">
        <button className="rounded-lg bg-accent px-5 py-3 text-sm font-extrabold text-ink transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60" disabled={isSaving} type="submit">
          {isSaving ? 'Uploading...' : 'Submit proof'}
        </button>
      </div>
    </form>
  );
}
