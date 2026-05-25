import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import type { WorkshopContent } from '../content/landing';

type TrainerProfilesProps = {
  content: WorkshopContent['trainers'];
};

const trainerPhotos = ['/nina.png', '/joe.png'];
const trainerProfileImages = ['/tunku-nina-mansur-profile.jpeg', '/jonelle-huang-profile.jpeg'];

function InstagramIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="7" r="1" fill="currentColor" />
    </svg>
  );
}

export function TrainerProfiles({ content }: TrainerProfilesProps) {
  const [selectedTrainerIndex, setSelectedTrainerIndex] = useState<number | null>(null);
  const selectedTrainer = selectedTrainerIndex !== null ? content.items[selectedTrainerIndex] : null;
  const selectedProfileImage = selectedTrainerIndex !== null ? trainerProfileImages[selectedTrainerIndex] : undefined;

  useEffect(() => {
    if (!selectedTrainer) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedTrainerIndex(null);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTrainer]);

  useEffect(() => {
    if (!selectedTrainer) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [selectedTrainer]);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-page px-5 py-18 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-4xl" data-reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">{content.eyebrow}</p>
            <h2 className="mt-5 font-serif text-[clamp(2.7rem,5.4vw,5.25rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-primary sm:whitespace-nowrap">
              {content.headline}
            </h2>
            <p className="mt-6 max-w-4xl text-lg leading-8 text-muted sm:whitespace-nowrap sm:text-xl sm:leading-9">
              {content.subheadline}
            </p>
          </div>

          <div className="mt-14 grid gap-5 lg:grid-cols-2 lg:items-stretch">
            {content.items.map((trainer, index) => {
              const profileImage = trainerProfileImages[index];
              const openProfile = () => {
                if (profileImage) setSelectedTrainerIndex(index);
              };

              return (
                <article key={index} className="border-t border-white/14 pt-6" data-reveal>
                  <div className="grid h-full gap-6 sm:grid-cols-[minmax(8rem,11rem)_1fr] sm:items-stretch">
                    <button
                      type="button"
                      className="aspect-[4/5] overflow-hidden bg-[linear-gradient(145deg,rgb(243_198_81_/_0.16),rgb(255_255_255_/_0.035))] text-left transition duration-300 hover:scale-[1.015] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent disabled:cursor-default disabled:hover:scale-100"
                      onClick={openProfile}
                      disabled={!profileImage}
                      aria-label={profileImage ? `Lihat profil ${trainer.name}` : undefined}
                    >
                      <img className="h-full w-full object-cover" src={trainerPhotos[index]} alt={trainer.name} loading="lazy" />
                    </button>
                    <div className="flex h-full flex-col justify-between">
                      <div>
                        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-accent">{content.roleLabel}</p>
                        <h3 className="mt-4 font-serif text-4xl font-semibold leading-none tracking-[-0.045em] text-primary sm:text-5xl">{trainer.name}</h3>
                      </div>
                      <div className="mt-6 flex flex-wrap items-center gap-4">
                        {profileImage && (
                          <button
                            type="button"
                            className="inline-flex w-fit items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-accent transition-colors duration-200 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
                            onClick={openProfile}
                          >
                            Lihat Profil
                          </button>
                        )}
                        <a className="inline-flex w-fit items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-muted transition-colors duration-200 hover:text-accent" href="#" aria-label={`Instagram ${trainer.name}`}>
                          <InstagramIcon />
                          {content.instagramLabel}
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {selectedTrainer && selectedProfileImage && createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/78 px-4 py-6 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`Profil ${selectedTrainer.name}`}
          onClick={() => setSelectedTrainerIndex(null)}
        >
          <div className="relative max-h-full w-full max-w-[min(28rem,calc(100vw-2rem))]" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="absolute right-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-full bg-black/65 text-2xl leading-none text-white transition hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              onClick={() => setSelectedTrainerIndex(null)}
              aria-label="Tutup profil"
            >
              &times;
            </button>
            <img
              className="max-h-[calc(100vh-3rem)] w-full object-contain shadow-2xl"
              src={selectedProfileImage}
              alt={`Profil ${selectedTrainer.name}`}
            />
          </div>
        </div>,
        document.body,
      )}
    </>
  );
}
