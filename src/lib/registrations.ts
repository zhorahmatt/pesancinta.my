import { supabase } from './supabase';
import type { CreateRegistrationInput, PaymentProof, Registration } from '../types/registration';

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

export async function listRegistrationsByWorkshop(workshopId: string) {
  return supabase
    .from('registrations')
    .select('*')
    .eq('workshop_id', workshopId)
    .order('created_at', { ascending: false })
    .returns<Registration[]>();
}

export async function listAllRegistrations() {
  return supabase.from('registrations').select('*').order('created_at', { ascending: false }).returns<Registration[]>();
}

export async function getRegistrationById(id: string) {
  return supabase.from('registrations').select('*').eq('id', id).maybeSingle().returns<Registration | null>();
}

export async function updateRegistrationStatus(id: string, status: Registration['status']) {
  return supabase.from('registrations').update({ status }).eq('id', id).select('*').single().returns<Registration>();
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
