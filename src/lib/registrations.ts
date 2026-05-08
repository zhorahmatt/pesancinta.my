import { supabase } from './supabase';
import type { CreateRegistrationInput, PaymentProof, Registration, RegistrationStatus } from '../types/registration';

type RegistrationListOptions = {
  status?: RegistrationStatus | 'all';
  limit?: number;
  offset?: number;
};

const defaultRegistrationListLimit = 50;

export async function createRegistration(input: CreateRegistrationInput) {
  return supabase
    .from('registrations')
    .insert({
      ...input,
      notes: input.notes ?? null,
      status: 'awaiting_payment',
    })
    .select()
    .single()
    .returns<Registration>();
}

export async function listRegistrationsByWorkshop(workshopId: string, options: RegistrationListOptions = {}) {
  const limit = options.limit ?? defaultRegistrationListLimit;
  let query = supabase
    .from('registrations')
    .select('*')
    .eq('workshop_id', workshopId)
    .order('created_at', { ascending: false })
    .range(options.offset ?? 0, (options.offset ?? 0) + limit - 1);

  if (options.status && options.status !== 'all') query = query.eq('status', options.status);

  return query.returns<Registration[]>();
}

export async function listAllRegistrations(options: RegistrationListOptions = {}) {
  const limit = options.limit ?? defaultRegistrationListLimit;
  let query = supabase
    .from('registrations')
    .select('*')
    .order('created_at', { ascending: false })
    .range(options.offset ?? 0, (options.offset ?? 0) + limit - 1);

  if (options.status && options.status !== 'all') query = query.eq('status', options.status);

  return query.returns<Registration[]>();
}

export async function getRegistrationById(id: string) {
  return supabase.from('registrations').select('*').eq('id', id).maybeSingle().returns<Registration | null>();
}

export async function getConfirmedRegistrationCount(workshopId: string) {
  return supabase.rpc('get_confirmed_registration_count', { workshop_id: workshopId });
}

export async function updateRegistrationStatus(id: string, status: Registration['status']) {
  if (status === 'confirmed') return confirmRegistration(id);
  return supabase.from('registrations').update({ status }).eq('id', id).select('*').single().returns<Registration>();
}

export async function confirmRegistration(id: string) {
  return supabase.rpc('confirm_registration', { registration_id: id });
}

export async function createPaymentProof(registrationId: string, fileUrl: string) {
  return supabase
    .from('payment_proofs')
    .insert({ registration_id: registrationId, file_url: fileUrl, status: 'submitted' })
    .select('*')
    .single()
    .returns<PaymentProof>();
}

export async function markRegistrationPaymentSubmitted(registrationId: string) {
  return supabase.from('registrations').update({ status: 'payment_submitted' }).eq('id', registrationId).select('*').single().returns<Registration>();
}

export function isConfirmedRegistration(registration: Pick<Registration, 'status'>) {
  return registration.status === 'confirmed';
}

export function canAcceptRegistration(capacity: number, confirmedCount: number) {
  return confirmedCount < capacity;
}
