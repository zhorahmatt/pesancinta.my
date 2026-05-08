type WhatsAppNotificationInput = {
  phone: string;
  message: string;
};

type RegistrationNotificationInput = {
  phone: string;
  fullName: string;
  workshopTitle: string;
  paymentInstructions: string;
};

type PaymentConfirmationNotificationInput = {
  phone: string;
  fullName: string;
  workshopTitle: string;
};

export function createWhatsAppNotificationUrl({ phone, message }: WhatsAppNotificationInput) {
  const normalizedPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${normalizedPhone}?text=${encodeURIComponent(message)}`;
}

export function notifyRegistrationSubmitted(input: RegistrationNotificationInput) {
  return createWhatsAppNotificationUrl({
    phone: input.phone,
    message: `Hi ${input.fullName}, registration for ${input.workshopTitle} received. Payment instructions: ${input.paymentInstructions}`,
  });
}

export function notifyPaymentConfirmed(input: PaymentConfirmationNotificationInput) {
  return createWhatsAppNotificationUrl({
    phone: input.phone,
    message: `Hi ${input.fullName}, payment for ${input.workshopTitle} is confirmed. See you at the workshop.`,
  });
}
