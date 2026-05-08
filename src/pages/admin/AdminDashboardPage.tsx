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

type AdminDashboardPageProps = {
  page: ReactNode;
};

export function AdminDashboardPage({ page }: AdminDashboardPageProps) {
  return (
    <ProtectedAdminRoute>
      <AdminLayout>{page}</AdminLayout>
    </ProtectedAdminRoute>
  );
}
