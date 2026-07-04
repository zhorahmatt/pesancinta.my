import { supabase } from './supabase';
import type { AdminUser, CreateAdminUserInput } from '../types/user';

export async function listAdminUsers() {
  return supabase.rpc('list_cms_admins').returns<AdminUser[]>();
}

export async function createAdminUser(input: CreateAdminUserInput) {
  return supabase
    .rpc('create_cms_admin', {
      p_email: input.email,
      p_password: input.password,
      p_role: input.role ?? 'admin',
    })
    .returns<AdminUser[]>();
}

export async function deleteAdminUser(userId: string) {
  return supabase.rpc('delete_cms_admin', { p_user_id: userId });
}

export function isStrongEnoughPassword(password: string): boolean {
  return typeof password === 'string' && password.length >= 8;
}
