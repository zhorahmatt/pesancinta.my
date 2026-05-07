const quote = 'We stand for a World where love leads, heals and connect us';

export function PesanCintaHomePage() {
  return (
    <main className="pesan-home relative isolate h-svh overflow-hidden px-5 py-5 text-[#1f73df] sm:px-8 sm:py-6 lg:px-12">
      <div className="pesan-home-grain absolute inset-0 -z-20" aria-hidden="true" />
      <div className="pesan-home-thread pesan-home-thread-left" aria-hidden="true" />
      <div className="pesan-home-thread pesan-home-thread-right" aria-hidden="true" />

      <section className="mx-auto flex h-[calc(100svh-2.5rem)] max-w-7xl flex-col items-center justify-between gap-4 text-center sm:h-[calc(100svh-3rem)] sm:gap-5">
        <div className="pesan-home-logo flex w-full items-start justify-center gap-3 sm:gap-4">
          <div className="flex h-18 items-center rounded-2xl bg-[#1f73df] px-5 ring-1 ring-[#1f73df]/20 backdrop-blur-sm sm:h-22 sm:px-7">
            <img className="h-15 w-auto drop-shadow-[0_0.35rem_1rem_rgb(31_115_223/0.16)] sm:h-20" src="/pesancinta.png" alt="Pesan Cinta" />
          </div>
          <div className="flex h-18 items-center rounded-2xl bg-[#1f73df] px-5 ring-1 ring-[#1f73df]/20 backdrop-blur-sm sm:h-22 sm:px-7">
            <img className="h-13 w-auto drop-shadow-[0_0.35rem_1rem_rgb(31_115_223/0.16)] sm:h-18" src="/startupglobal.png" alt="Startup Global" />
          </div>
        </div>

        <div className="pesan-home-copy relative z-10 max-w-6xl">
          <h1 className="font-serif text-[clamp(2.45rem,7.6vw,6.15rem)] font-semibold leading-[0.91] tracking-[-0.062em]">
            {quote}
          </h1>
          {/* <p className="mt-2 font-serif text-[clamp(1.7rem,3vw,3.1rem)] font-semibold tracking-[-0.055em] sm:mt-3">Mimi &amp; Zai</p> */}
          <a
            className="mt-4 inline-flex max-w-88 flex-col items-center justify-center rounded-full bg-[#1f73df] px-6 py-3 text-center text-white shadow-[0_1rem_2.5rem_rgb(31_115_223/0.2)] transition duration-200 hover:-translate-y-0.5 hover:bg-[#185fc0] sm:mt-5 sm:max-w-none sm:px-8"
            href="/the-inner-compass-workshop"
          >
            <span className="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-white/80">Upcoming Class: </span>
            <span className="mt-1 text-base font-extrabold leading-5 text-white sm:text-lg">The Inner Compass Workshop · 13-14 Juni 2026</span>
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
