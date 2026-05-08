import { useState, type FormEvent } from 'react';
import { signInWithPassword } from '../../lib/auth';

export function AdminLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const { error } = await signInWithPassword(email, password);
    setIsSubmitting(false);

    if (error) {
      setError(error.message);
      return;
    }

    window.location.assign('/admin');
  };

  return (
    <main className="grid min-h-svh place-items-center bg-page-deep px-5 py-10 text-primary">
      <form onSubmit={handleSubmit} className="w-full max-w-md rounded-2xl border border-white/10 bg-page/78 p-6 shadow-soft backdrop-blur-md sm:p-8">
        <div className="text-xs font-bold uppercase tracking-[0.22em] text-accent">Pesan Cinta CMS</div>
        <h1 className="mt-4 font-serif text-4xl font-semibold tracking-[-0.05em]">Admin Login</h1>
        <label className="mt-8 block text-sm font-semibold text-primary/78">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="mt-2 w-full rounded-lg border border-white/14 bg-page-deep px-4 py-3 text-primary outline-none transition focus:border-accent"
          />
        </label>
        <label className="mt-4 block text-sm font-semibold text-primary/78">
          Password
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="mt-2 w-full rounded-lg border border-white/14 bg-page-deep px-4 py-3 text-primary outline-none transition focus:border-accent"
          />
        </label>
        {error ? <p className="mt-4 text-sm font-semibold text-red-200">{error}</p> : null}
        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 w-full rounded-lg bg-accent px-5 py-3 text-sm font-extrabold text-ink transition hover:bg-accent-deep disabled:cursor-wait disabled:opacity-70"
        >
          {isSubmitting ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
