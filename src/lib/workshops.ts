import { supabase } from './supabase';
import type { PaymentMethod, Workshop, WorkshopCountry, WorkshopLocale, WorkshopLocaleContent, WorkshopPrice, WorkshopStatus } from '../types/workshop';

export type WorkshopWithContent = Workshop & {
  workshop_locales: WorkshopLocaleContent[];
  workshop_prices: WorkshopPrice[];
  payment_methods: PaymentMethod[];
};

export type WorkshopBasicsInput = {
  slug: string;
  title: string;
  status: WorkshopStatus;
  start_at: string;
  end_at: string | null;
  venue_name: string;
  city: string;
  country: WorkshopCountry;
  capacity: number;
  default_locale: WorkshopLocale;
  show_remaining_seats: boolean;
};

const workshopSelection = '*, workshop_locales(*), workshop_prices(*), payment_methods(*)';
const workshopSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidWorkshopSlug(slug: string) {
  return workshopSlugPattern.test(slug.trim());
}

export function isValidWorkshopCapacity(capacity: number) {
  return Number.isInteger(capacity) && capacity > 0;
}

export async function listPublishedWorkshops() {
  return supabase
    .from('workshops')
    .select(workshopSelection)
    .eq('status', 'published')
    .order('start_at', { ascending: true })
    .returns<WorkshopWithContent[]>();
}

export async function getWorkshopBySlug(slug: string) {
  return supabase
    .from('workshops')
    .select(workshopSelection)
    .eq('slug', slug)
    .eq('status', 'published')
    .maybeSingle()
    .returns<WorkshopWithContent | null>();
}

export async function listAdminWorkshops() {
  return supabase.from('workshops').select('*').order('start_at', { ascending: false }).returns<Workshop[]>();
}

export async function getAdminWorkshopById(id: string) {
  return supabase.from('workshops').select('*').eq('id', id).maybeSingle().returns<Workshop | null>();
}

export async function createWorkshop(input: WorkshopBasicsInput) {
  return supabase.from('workshops').insert(toWorkshopMutation(input)).select('*').single().returns<Workshop>();
}

export async function updateWorkshop(id: string, input: WorkshopBasicsInput) {
  return supabase.from('workshops').update(toWorkshopMutation(input)).eq('id', id).select('*').single().returns<Workshop>();
}

export function getRemainingSeats(capacity: number, confirmedCount: number) {
  return Math.max(capacity - confirmedCount, 0);
}

function toWorkshopMutation(input: WorkshopBasicsInput) {
  return {
    ...input,
    slug: input.slug.trim(),
    title: input.title.trim(),
    venue_name: input.venue_name.trim(),
    city: input.city.trim(),
    end_at: input.end_at || null,
  };
}
