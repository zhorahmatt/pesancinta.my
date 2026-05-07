import { CtaButton } from './CtaButton';

type MobileFloatingCtaProps = {
  href: string;
  label: string;
  isVisible: boolean;
};

export function MobileFloatingCta({ href, label, isVisible }: MobileFloatingCtaProps) {
  return (
    <div
      className={`fixed bottom-6 left-5 right-5 z-50 transition duration-300 sm:hidden ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0 pointer-events-none'
      }`}
    >
      <CtaButton
        href={href}
        location="mobile-floating"
        targetName="registration-whatsapp"
        className="w-full border border-accent/40 px-8 py-5 text-base shadow-[0_18px_48px_rgb(243_198_81/0.28)] backdrop-blur-md"
      >
        {label}
      </CtaButton>
    </div>
  );
}
