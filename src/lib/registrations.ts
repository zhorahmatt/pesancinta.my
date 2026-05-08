import { supabase } from './supabase';
import type { CreateRegistrationInput, Registration } from '../types/registration';

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

export function isConfirmedRegistration(registration: Pick<Registration, 'status'>) {
  return registration.status === 'confirmed';
}

export function canAcceptRegistration(capacity: number, confirmedCount: number) {
  return confirmedCount < capacity;
}
