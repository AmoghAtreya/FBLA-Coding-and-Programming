import { loadStripe } from '@stripe/stripe-js';
import { supabase } from '@/integrations/supabase/client';

// Initialize Stripe with the provided publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51RcYjZRvRJBYs5hvVRiTsQn5ZejEdOSdu77h8CtoNuF5kwrC6tmPVx27IdSOnfPBwJjxmQDegIiU0rhqs4vWQt1k00ChztNPfk';

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export interface StripeAccount {
  id: string;
  name: string;
  balance: number;
  accountNumber: string;
  type: 'credit' | 'checking' | 'savings';
  icon: string;
  expiryDate?: string;
}

// Fetch Stripe accounts for the current user
export const fetchStripeAccounts = async (): Promise<{ accounts: StripeAccount[], customerId?: string }> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('get-stripe-accounts', {
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      throw error;
    }

    return {
      accounts: data.accounts || [],
      customerId: data.customerId
    };
  } catch (error) {
    console.error('Error fetching Stripe accounts:', error);
    return { accounts: [] };
  }
};

// Add a payment method using Stripe
export const addPaymentMethod = async (customerId: string) => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('add-payment-method', {
      body: { customerId },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      throw error;
    }

    return data.clientSecret;
  } catch (error) {
    console.error('Error adding payment method:', error);
    throw error;
  }
};

// Create a payment intent for processing payments
export const createPaymentIntent = async (amount: number, currency: string = 'usd') => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase.functions.invoke('create-payment-intent', {
      body: { 
        amount: Math.round(amount * 100), // Convert to cents
        currency 
      },
      headers: {
        Authorization: `Bearer ${session.access_token}`,
      },
    });

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
}; 