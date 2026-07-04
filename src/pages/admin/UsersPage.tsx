import { useEffect, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { getSession } from '../../lib/auth';
import {
  createAdminUser,
  deleteAdminUser,
  isStrongEnoughPassword,
  listAdminUsers,
} from '../../lib/users';
import type { AdminRole, AdminUser } from '../../types/user';

const ROLE_OPTIONS: AdminRole[] = ['admin'];
const MIN_PASSWORD_LENGTH = 8;

export function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<AdminRole>('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [pendingRemoval, setPendingRemoval] = useState<AdminUser | null>(null);

  useEffect(() => {
    let isMounted = true;

    Promise.all([listAdminUsers(), getSession()]).then(([usersResult, sessionResult]) => {
      if (!isMounted) return;
      if (usersResult.error) setErrorMessage(usersResult.error.message);
      setUsers(usersResult.data ?? []);
      setSession(sessionResult.data.session ?? null);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const currentUserId = session?.user?.id ?? null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setRole('admin');
    setShowPassword(false);
    setFormError(null);
  };

  const handleToggleForm = () => {
    setIsFormOpen((open) => {
      if (open) resetForm();
      return !open;
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);

    const trimmedEmail = email.trim();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(trimmedEmail)) {
      setFormError('Enter a valid email address.');
      return;
    }
    if (!isStrongEnoughPassword(password)) {
      setFormError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setIsSubmitting(true);
    const { data, error } = await createAdminUser({ email: trimmedEmail, password, role });
    setIsSubmitting(false);

    if (error) {
      setFormError(error.message);
      return;
    }
    const created = data?.[0];
    if (created) setUsers((current) => [created, ...current]);
    resetForm();
    setIsFormOpen(false);
  };

  const handleRemove = async (user: AdminUser) => {
    const { error } = await deleteAdminUser(user.user_id);
    if (error) {
      setErrorMessage(error.message);
      setPendingRemoval(null);
      return;
    }
    setUsers((current) => current.filter((row) => row.user_id !== user.user_id));
    setPendingRemoval(null);
  };

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Admin</div>
          <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em]">Users</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-primary/72">
            Manage CMS admins. Add a new admin with an email and password, then share the credentials out-of-band.
          </p>
        </div>
        <button
          type="button"
          onClick={handleToggleForm}
          className="rounded-lg bg-accent px-5 py-3 text-center text-sm font-extrabold text-ink transition hover:bg-accent-deep"
        >
          {isFormOpen ? 'Close' : 'Add admin'}
        </button>
      </div>

      {isFormOpen && (
        <form
          onSubmit={handleSubmit}
          className="mt-6 grid gap-4 rounded-xl border border-white/10 bg-white/6 p-5 sm:grid-cols-2"
        >
          <label className="grid gap-2 text-sm font-semibold text-primary/82 sm:col-span-2">
            Email
            <input
              type="email"
              required
              autoComplete="off"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="admin@pesancinta.my"
              className="rounded-lg border border-white/12 bg-page-deep px-4 py-3 text-primary outline-none focus:border-accent"
            />
          </label>

          <label className="grid gap-2 text-sm font-semibold text-primary/82">
            Password
            <div className="flex items-stretch gap-2">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={MIN_PASSWORD_LENGTH}
                autoComplete="new-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder={`At least ${MIN_PASSWORD_LENGTH} characters`}
                className="w-full rounded-lg border border-white/12 bg-page-deep px-4 py-3 text-primary outline-none focus:border-accent"
              />
              <button
                type="button"
                onClick={() => setShowPassword((show) => !show)}
                className="rounded-lg border border-white/14 px-3 text-xs font-bold text-primary/72 transition hover:border-accent hover:text-accent"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </label>

          <label className="grid gap-2 text-sm font-semibold text-primary/82">
            Role
            <select
              value={role}
              onChange={(event) => setRole(event.target.value as AdminRole)}
              className="rounded-lg border border-white/12 bg-page-deep px-4 py-3 text-primary outline-none focus:border-accent"
            >
              {ROLE_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </label>

          {formError && (
            <div className="sm:col-span-2 rounded-lg border border-red-300/30 bg-red-500/10 p-3 text-sm text-red-100" role="alert">
              {formError}
            </div>
          )}

          <div className="sm:col-span-2 flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-lg bg-accent px-5 py-3 text-sm font-extrabold text-ink transition hover:bg-accent-deep disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Creating...' : 'Create admin'}
            </button>
            <button
              type="button"
              onClick={handleToggleForm}
              className="rounded-lg border border-white/14 px-5 py-3 text-sm font-bold text-primary/82 transition hover:border-accent hover:text-accent"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading && <div className="mt-8 rounded-xl border border-white/10 p-6 text-sm text-primary/68">Loading users...</div>}

      {errorMessage && (
        <div className="mt-8 rounded-xl border border-red-300/30 bg-red-500/10 p-6 text-sm text-red-100" role="alert">
          {errorMessage}
        </div>
      )}

      {!isLoading && !errorMessage && users.length === 0 && (
        <div className="mt-8 rounded-xl border border-dashed border-white/18 p-6 text-sm leading-6 text-primary/70">
          No admins yet. Use "Add admin" to create the first one.
        </div>
      )}

      {!isLoading && users.length > 0 && (
        <div className="mt-8 overflow-hidden rounded-xl border border-white/10">
          <div className="grid grid-cols-[1fr_8rem_10rem_auto] gap-3 border-b border-white/10 bg-white/6 px-4 py-3 text-xs font-bold uppercase tracking-[0.16em] text-primary/52">
            <span>Email</span>
            <span>Role</span>
            <span>Added</span>
            <span>Actions</span>
          </div>
          {users.map((row) => {
            const isSelf = row.user_id === currentUserId;
            return (
              <article
                key={row.user_id}
                className="grid grid-cols-[1fr_8rem_10rem_auto] items-center gap-3 border-b border-white/8 px-4 py-4 last:border-b-0"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-bold text-primary">{row.email}</div>
                  {isSelf && (
                    <div className="mt-1 text-xs text-primary/48">That's you</div>
                  )}
                </div>
                <span className="rounded-full border border-white/12 px-3 py-1 text-center text-xs font-bold text-primary/70">
                  {row.role}
                </span>
                <span className="text-sm text-primary/66">{new Date(row.created_at).toLocaleDateString()}</span>
                <button
                  type="button"
                  disabled={isSelf}
                  onClick={() => setPendingRemoval(row)}
                  title={isSelf ? 'You cannot remove your own admin account' : 'Remove this admin'}
                  className="rounded-lg border border-white/14 px-4 py-2 text-sm font-bold text-primary/82 transition hover:border-red-300/60 hover:text-red-200 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-white/14 disabled:hover:text-primary/82"
                >
                  Remove
                </button>
              </article>
            );
          })}
        </div>
      )}

      {pendingRemoval && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-5" role="dialog" aria-modal="true">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-page-deep p-6 shadow-soft">
            <h2 className="font-serif text-2xl font-semibold">Remove admin?</h2>
            <p className="mt-3 text-sm leading-6 text-primary/72">
              This will permanently delete <span className="font-bold text-primary">{pendingRemoval.email}</span> and revoke their access. This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setPendingRemoval(null)}
                className="rounded-lg border border-white/14 px-4 py-2 text-sm font-bold text-primary/82 transition hover:border-accent hover:text-accent"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => void handleRemove(pendingRemoval)}
                className="rounded-lg border border-red-300/40 bg-red-500/15 px-4 py-2 text-sm font-bold text-red-100 transition hover:border-red-300 hover:bg-red-500/25"
              >
                Remove admin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
