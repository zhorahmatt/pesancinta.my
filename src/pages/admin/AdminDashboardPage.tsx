import { useEffect, useState, type ReactNode } from 'react';
import type { Session } from '@supabase/supabase-js';
import { AdminLayout } from '../../components/admin/AdminLayout';
import { getSession, onAuthStateChange } from '../../lib/auth';

type ProtectedAdminRouteProps = {
  children: ReactNode;
};

function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    getSession().then(({ data }) => {
      if (!isMounted) return;
      setSession(data.session);
      setIsLoading(false);
    });

    const { data: listener } = onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return <main className="grid min-h-svh place-items-center bg-page-deep text-primary">Loading admin...</main>;
  }

  if (!session) {
    window.location.replace('/admin/login');
    return null;
  }

  return children;
}

export function AdminDashboardPage() {
  return (
    <ProtectedAdminRoute>
      <AdminLayout>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Dashboard</div>
            <h1 className="mt-3 font-serif text-4xl font-semibold tracking-[-0.05em]">Workshops</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-primary/72">
              Manage workshop drafts, registrations, pricing, and payment setup from one protected admin area.
            </p>
          </div>
          <a className="rounded-lg bg-accent px-5 py-3 text-sm font-extrabold text-ink transition hover:bg-accent-deep" href="/admin/workshops/new">
            New workshop
          </a>
        </div>
        <div className="mt-8 rounded-xl border border-dashed border-white/18 p-6 text-sm leading-6 text-primary/70">
          Workshop management will be added in the next task.
        </div>
      </AdminLayout>
    </ProtectedAdminRoute>
  );
}
