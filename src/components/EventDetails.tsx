import { event, mainContact, workshopLocales } from '../content/landing';
import { createWhatsAppUrl } from '../lib/whatsapp';
import { CtaButton } from './CtaButton';
import { Section } from './Section';

export function EventDetails() {
  const registrationUrl = createWhatsAppUrl(mainContact.phone, workshopLocales.ms.registrationMessage);

  return (
    <Section className="bg-page-deep/55">
      <div className="relative overflow-hidden border border-accent/45 bg-surface/70 shadow-soft">
        <div className="absolute left-0 top-0 h-full w-2 bg-accent" aria-hidden="true" />
        <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="border-b border-white/12 p-6 sm:p-8 lg:border-b-0 lg:border-r lg:p-10">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-accent">Invitation</p>
            <h2 className="font-serif text-4xl font-semibold leading-tight tracking-[-0.05em] text-primary sm:text-6xl">
              Waktunya mengambil alih kemudi hidupmu.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
              Kapasitas dibuat terbatas agar proses tetap intim, aman, dan terarah. Jika kamu merasa ini ruang yang kamu butuhkan, mulai dari pesan pendaftaran.
            </p>
          </div>

          <div className="bg-page-deep/65 p-6 sm:p-8 lg:p-10">
            <div className="mb-8 flex items-center justify-between gap-4">
              <p className="font-serif text-3xl font-semibold text-accent">Batch 4</p>
              <p className="border border-accent/45 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">40 Seats</p>
            </div>
            <dl className="divide-y divide-white/12 border-y border-white/12">
              {[
                ['Tempat', event.venue],
                ['Tanggal', event.date],
                ['Waktu', event.time],
                ['Kapasitas', `Hanya untuk ${event.capacity}`],
              ].map(([label, value]) => (
                <div key={label} className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr] sm:gap-4">
                  <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">{label}</dt>
                  <dd className="font-semibold text-primary">{value}</dd>
                </div>
              ))}
            </dl>
            <CtaButton href={registrationUrl} location="event-details" targetName="registration-whatsapp" className="mt-8 w-full sm:w-auto">
              Daftar Batch 4 Sekarang
            </CtaButton>
          </div>
        </div>
      </div>
    </Section>
  );
}
