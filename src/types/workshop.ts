export type WorkshopStatus = 'draft' | 'published' | 'archived';
export type WorkshopLocale = 'ms' | 'id' | 'en';
export type WorkshopCurrency = 'MYR' | 'IDR';
export type WorkshopCountry = 'MY' | 'ID';
export type PaymentMethodType = 'bank_transfer' | 'static_qr';

export type Workshop = {
  id: string;
  slug: string;
  title: string;
  status: WorkshopStatus;
  theme_key: string;
  default_locale: WorkshopLocale;
  start_at: string;
  end_at: string | null;
  venue_name: string;
  city: string;
  country: WorkshopCountry;
  capacity: number;
  show_remaining_seats: boolean;
  created_at: string;
  updated_at: string;
};

export type WorkshopLocaleContent = {
  id: string;
  workshop_id: string;
  locale: WorkshopLocale;
  headline: string;
  subheadline: string | null;
  description: string | null;
  cta_label: string;
  sections_json: Record<string, unknown>;
  registration_message: string;
  created_at: string;
  updated_at: string;
};

export type WorkshopPrice = {
  id: string;
  workshop_id: string;
  currency: WorkshopCurrency;
  amount: number;
  early_bird_amount: number | null;
  early_bird_ends_at: string | null;
  created_at: string;
  updated_at: string;
};

export type PaymentMethod = {
  id: string;
  workshop_id: string;
  country: WorkshopCountry;
  type: PaymentMethodType;
  label: string;
  currency: WorkshopCurrency;
  instructions: string;
  account_name: string | null;
  account_number: string | null;
  bank_name: string | null;
  qr_image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
