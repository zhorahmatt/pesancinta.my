import type { PaymentProof, Registration } from './registration';
import type { AdminUser } from './user';
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
      admin_users: Table<{ user_id: string; role: string; created_at: string }>;
      workshops: Table<Workshop>;
      workshop_locales: Table<WorkshopLocaleContent>;
      workshop_prices: Table<WorkshopPrice>;
      payment_methods: Table<PaymentMethod>;
      registrations: Table<Registration>;
      payment_proofs: Table<PaymentProof>;
    };
    Views: Record<string, never>;
    Functions: {
      confirm_registration: {
        Args: { registration_id: string };
        Returns: Registration;
      };
      get_confirmed_registration_count: {
        Args: { workshop_id: string };
        Returns: number;
      };
      is_cms_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      create_cms_admin: {
        Args: { p_email: string; p_password: string; p_role?: string };
        Returns: AdminUser[];
      };
      list_cms_admins: {
        Args: Record<string, never>;
        Returns: AdminUser[];
      };
      delete_cms_admin: {
        Args: { p_user_id: string };
        Returns: null;
      };
      get_inner_compass_content: {
        Args: Record<string, never>;
        Returns: unknown;
      };
      save_inner_compass_content: {
        Args: { p_data: unknown };
        Returns: null;
      };
    };
    Enums: Record<string, string>;
    CompositeTypes: Record<string, never>;
  };
};
