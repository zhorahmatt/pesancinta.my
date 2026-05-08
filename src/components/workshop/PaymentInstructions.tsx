import type { PaymentMethod } from '../../types/workshop';

type PaymentInstructionsProps = {
  method: PaymentMethod;
};

export function PaymentInstructions({ method }: PaymentInstructionsProps) {
  return (
    <div className="rounded-xl border border-accent/30 bg-accent/10 p-4" role="status">
      <h3 className="font-serif text-xl font-semibold tracking-[-0.04em] text-primary">Payment instructions</h3>
      <p className="mt-2 text-sm font-bold text-accent">{method.label}</p>
      <p className="mt-3 whitespace-pre-line text-sm leading-6 text-primary/72">{method.instructions}</p>
      {method.bank_name && <p className="mt-3 text-sm text-primary/68">Bank: {method.bank_name}</p>}
      {method.account_name && <p className="text-sm text-primary/68">Account name: {method.account_name}</p>}
      {method.account_number && <p className="text-sm text-primary/68">Account number: {method.account_number}</p>}
      {method.qr_image_url && <img alt={`${method.label} QR code`} className="mt-4 max-h-56 rounded-lg border border-white/10 object-contain" src={method.qr_image_url} />}
    </div>
  );
}
