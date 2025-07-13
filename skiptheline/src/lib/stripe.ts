import { loadStripe } from '@stripe/stripe-js';

// This is your test publishable API key.
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_...'
);

export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100); // Convert to cents
};

export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100; // Convert from cents
};

export interface StripePaymentIntent {
  amount: number;
  currency: string;
  eventId: string;
  partySize: number;
  customerEmail?: string;
  customerName?: string;
}