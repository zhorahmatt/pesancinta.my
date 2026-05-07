const quote = 'We stand for a World where love leads, heals and connect us';

export function PesanCintaHomePage() {
  return (
    <main className="pesan-home relative isolate h-svh overflow-hidden bg-page px-5 py-5 text-primary sm:px-8 sm:py-6 lg:px-12">
      <div className="pesan-home-grain absolute inset-0 -z-30" aria-hidden="true" />
      <div className="pesan-home-orb pesan-home-orb-left" aria-hidden="true" />
      <div className="pesan-home-orb pesan-home-orb-right" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-72 bg-linear-to-t from-page-deep to-transparent" aria-hidden="true" />

      <section className="mx-auto flex h-[calc(100svh-2.5rem)] max-w-7xl flex-col items-center justify-between gap-4 text-center sm:h-[calc(100svh-3rem)] sm:gap-5">
        <div className="pesan-home-logo flex w-full items-center justify-center gap-6 sm:gap-10">
          <img className="h-24 w-auto sm:h-32 lg:h-40" src="/pesancinta.png" alt="Pesan Cinta" />
          <img className="h-20 w-auto opacity-95 sm:h-28 lg:h-36" src="/startupglobal.png" alt="Startup Global" />
        </div>

        <div className="pesan-home-copy relative z-10 mx-auto max-w-6xl">
          <h1 className="mx-auto max-w-6xl font-serif text-[clamp(2.3rem,10.2vw,5.9rem)] font-semibold leading-[0.9] tracking-[-0.065em] text-primary drop-shadow-[0_1rem_3rem_rgb(0_0_0/0.28)] sm:text-[clamp(3.2rem,7vw,6.4rem)]">
            {quote}
          </h1>
          <a
            className="mt-4 inline-flex max-w-86 flex-col items-center justify-center rounded-full bg-accent px-6 py-3 text-center text-ink shadow-[0_22px_56px_rgb(243_198_81/0.24)] transition duration-200 hover:-translate-y-0.5 hover:bg-accent-deep sm:mt-6 sm:max-w-none sm:px-8"
            href="/the-inner-compass-workshop"
          >
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-ink/70">Upcoming Class</span>
            <span className="mt-1 text-base font-extrabold leading-5 sm:text-lg">The Inner Compass Workshop · 13-14 Juni 2026</span>
          </a>
        </div>

        <div className="pesan-home-founders relative z-0 grid w-full max-w-4xl grid-cols-2 items-end gap-0 pt-0">
          <figure className="pesan-home-founder pesan-home-founder-left justify-self-end">
            <img src="/mimi.png" alt="Mimi, Pesan Cinta founder" />
            <figcaption className="sr-only">Mimi</figcaption>
          </figure>
          <figure className="pesan-home-founder pesan-home-founder-right justify-self-start">
            <img src="/zai.png" alt="Zai, Pesan Cinta founder" />
            <figcaption className="sr-only">Zai</figcaption>
          </figure>
        </div>
      </section>
    </main>
  );
}
