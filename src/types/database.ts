import type { PaymentProof, Registration } from './registration';
import type { PaymentMethod, Workshop, WorkshopLocaleContent, WorkshopPrice } from './workshop';

type Table<Row, Insert = Partial<Row>, Update = Partial<Row>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      admin_users: Table<{ user_id: string; created_at: string }>;
      workshops: Table<Workshop>;
      workshop_locales: Table<WorkshopLocaleContent>;
      workshop_prices: Table<WorkshopPrice>;
      payment_methods: Table<PaymentMethod>;
      registrations: Table<Registration>;
      payment_proofs: Table<PaymentProof>;
    };
    Views: Record<string, never>;
    Functions: {
      is_cms_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, string>;
    CompositeTypes: Record<string, never>;
  };
};
