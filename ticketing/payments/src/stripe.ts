import Stripe from 'stripe';
import { stripeKey } from './stripe-key';

if (!process.env.STRIPE_KEY) {
  process.env.STRIPE_KEY = stripeKey;
}

export const stripe = new Stripe(process.env.STRIPE_KEY, {
  apiVersion: '2020-08-27',
});
