import { loadStripe } from '@stripe/stripe-js';

// Inicializa Stripe con la clave pública
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

export { stripePromise };

export const createCheckoutSession = async (items: any[]) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ items }),
    });

    if (!response.ok) {
      throw new Error('Error al crear la sesión de checkout');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const createPaymentIntent = async (amount: number) => {
  try {
    const response = await fetch('/api/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });

    if (!response.ok) {
      throw new Error('Error al crear el payment intent');
    }

    const data = await response.json();
    return data.clientSecret;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}; 