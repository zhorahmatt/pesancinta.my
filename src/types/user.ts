export type AdminRole = 'admin';

export type AdminUser = {
  user_id: string;
  email: string;
  role: AdminRole;
  created_at: string;
};

export type CreateAdminUserInput = {
  email: string;
  password: string;
  role?: AdminRole;
};
