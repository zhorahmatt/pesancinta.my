import { contacts, event, investmentText, registrationMessage } from '../content/landing';
import { createWhatsAppUrl } from '../lib/whatsapp';
import { CtaButton } from './CtaButton';

const organizerLogos = ['/startupglobal.png', '/pesancinta.png'];
const sponsorLogos = ['/sponsor1.png', '/sponsor2.png', '/sponsor3.png'];

export function ContactFooter() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-white/10 bg-page-deep px-5 py-18 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent">Investment & Contact</p>
          <h2 className="mt-5 font-serif text-[clamp(2.7rem,5.4vw,5.25rem)] font-semibold leading-[0.94] tracking-[-0.055em] text-primary sm:whitespace-nowrap">
            Tertarik ikut workshop ini?
          </h2>
          <p className="mt-6 max-w-5xl text-lg leading-8 text-muted sm:whitespace-nowrap sm:text-xl sm:leading-9">{investmentText}. Pilih contact person yang paling mudah dihubungi.</p>
        </div>

        <div className="mt-10 grid gap-3 border-y border-white/14 py-5 text-sm font-semibold uppercase tracking-[0.16em] text-muted sm:grid-cols-3">
          <span>13-14 Juni</span>
          <span className="text-accent">40 Kursi</span>
          <span>Makassar</span>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {contacts.map((contact) => (
            <CtaButton
              key={contact.name}
              href={createWhatsAppUrl(contact.phone, registrationMessage)}
              location={`footer-${contact.name.toLowerCase()}`}
              targetName={`contact-${contact.name.toLowerCase()}`}
              variant="secondary"
              className="group min-h-28 flex-col items-start justify-between rounded-none border-white/14 bg-transparent p-4 text-left hover:border-accent/45 hover:bg-page/[0.035]"
            >
              <span className="text-[0.65rem] uppercase tracking-[0.2em] text-accent">WhatsApp</span>
              <span className="font-serif text-2xl font-semibold tracking-[-0.04em] text-primary">{contact.name}</span>
              <span className="text-sm text-muted transition-colors duration-300 group-hover:text-primary">{contact.phone}</span>
            </CtaButton>
          ))}
        </div>

        <div className="mt-12 border-t border-white/14 pt-6">
          <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr] lg:items-stretch">
            <section className="border border-white/14 bg-page/[0.025] p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Organizer</p>
              <div className="mt-4 grid grid-cols-2 gap-3">
                {organizerLogos.map((logo) => (
                  <div key={logo} className="flex h-24 items-center justify-center bg-page px-3 py-4 sm:h-36">
                    <img className="max-h-20 max-w-28 object-contain sm:max-h-32 sm:max-w-40" src={logo} alt="Organizer logo" loading="lazy" />
                  </div>
                ))}
              </div>
            </section>

            <section className="border border-white/14 bg-page/[0.025] p-4 sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">Partners & Sponsors</p>
              <div className="mt-4 grid max-w-2xl grid-cols-3 gap-3">
                {sponsorLogos.map((logo, index) => (
                  <div key={logo} className="flex h-20 items-center justify-center bg-page px-2 py-3 sm:h-28 sm:px-4 sm:py-4">
                    <img className="max-h-10 max-w-20 object-contain sm:max-h-12 sm:max-w-32" src={logo} alt={`Sponsor ${index + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/14 pt-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 The Inner Compass Workshop. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
