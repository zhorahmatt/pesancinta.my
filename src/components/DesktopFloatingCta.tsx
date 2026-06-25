import { CtaButton } from './CtaButton';

type DesktopFloatingCtaProps = {
  href: string;
  label: string;
  isVisible: boolean;
};

export function DesktopFloatingCta({ href, label, isVisible }: DesktopFloatingCtaProps) {
  return (
    <div
      className={`fixed bottom-8 right-8 z-50 hidden sm:flex transition duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <CtaButton
        href={href}
        location="desktop-floating"
        targetName="registration-whatsapp"
        className="min-w-64 border border-accent/40 px-10 py-5 text-base shadow-[0_18px_48px_rgb(243_198_81/0.28)] backdrop-blur-md"
      >
        {label}
      </CtaButton>
    </div>
  );
}
