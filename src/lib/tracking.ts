type CtaClickPayload = {
  location: string;
  target: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackCtaClick(payload: CtaClickPayload) {
  window.dataLayer?.push({ event: 'cta_click', ...payload });
  window.fbq?.('trackCustom', 'CtaClick', payload);
}
