import type { ReactNode } from 'react';
import { signOut } from '../../lib/auth';

type AdminLayoutProps = {
  children: ReactNode;
};

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <main className="min-h-svh bg-page-deep px-5 py-6 text-primary sm:px-8 lg:px-10">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[16rem_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-white/10 bg-white/6 p-5 shadow-soft backdrop-blur-md">
          <div className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Pesan Cinta CMS</div>
          <nav className="mt-8 grid gap-2 text-sm font-semibold text-primary/78" aria-label="Admin navigation">
            <a className="rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-primary" href="/admin/users">Users</a>
            <a className="rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-primary" href="/admin/registrations">Registrations</a>
            <a className="rounded-lg px-3 py-2 transition hover:bg-white/10 hover:text-primary" href="/admin/inner-compass">Inner Compass Page</a>
          </nav>
          <button
            type="button"
            onClick={() => void signOut()}
            className="mt-8 rounded-lg border border-white/14 px-4 py-2 text-sm font-bold text-primary/82 transition hover:border-accent hover:text-accent"
          >
            Sign out
          </button>
        </aside>
        <section className="rounded-2xl border border-white/10 bg-page/70 p-5 shadow-soft backdrop-blur-md sm:p-7">{children}</section>
      </div>
    </main>
  );
}
