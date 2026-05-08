import { supabase } from './supabase';
import type { PaymentMethod, Workshop, WorkshopLocaleContent, WorkshopPrice } from '../types/workshop';

type WorkshopWithContent = Workshop & {
  workshop_locales: WorkshopLocaleContent[];
  workshop_prices: WorkshopPrice[];
  payment_methods: PaymentMethod[];
};

const workshopSelection = '*, workshop_locales(*), workshop_prices(*), payment_methods(*)';

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

export function getRemainingSeats(capacity: number, confirmedCount: number) {
  return Math.max(capacity - confirmedCount, 0);
}
