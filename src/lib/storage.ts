import { supabase } from './supabase';

const paymentProofBucket = 'payment-proofs';

export function getPaymentProofPath(registrationId: string, fileName: string) {
  const safeName = fileName.replace(/[^a-zA-Z0-9_.-]/g, '-');
  return `${registrationId}/${Date.now()}-${safeName}`;
}

export async function uploadPaymentProof(registrationId: string, file: File) {
  const path = getPaymentProofPath(registrationId, file.name);
  const { data, error } = await supabase.storage.from(paymentProofBucket).upload(path, file, { upsert: false });

  if (error) return { data: null, error };
  return { data: { file_path: data.path }, error: null };
}
