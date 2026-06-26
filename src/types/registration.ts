import type { PaymentMethod, WorkshopCountry, WorkshopLocale } from './workshop';

export type RegistrationStatus = 'pending' | 'awaiting_payment' | 'payment_submitted' | 'confirmed' | 'cancelled' | 'refunded';
export type PaymentProofStatus = 'submitted' | 'approved' | 'rejected';

export type Registration = {
  id: string;
  workshop_id: string | null;
  event_key: string | null;
  full_name: string;
  email: string;
  phone: string;
  country: WorkshopCountry;
  locale: WorkshopLocale;
  payment_method_id: string | null;
  status: RegistrationStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentProof = {
  id: string;
  registration_id: string;
  file_url: string;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  status: PaymentProofStatus;
};

export type CreateRegistrationInput = {
  workshop_id: string;
  full_name: string;
  email: string;
  phone: string;
  country: WorkshopCountry;
  locale: WorkshopLocale;
  payment_method_id: PaymentMethod['id'] | null;
  notes?: string | null;
};

export type CreateEventRegistrationInput = {
  event_key: string;
  full_name: string;
  email: string;
  phone: string;
  country: WorkshopCountry;
  locale: WorkshopLocale;
  notes?: string | null;
};
