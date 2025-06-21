
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header from the request
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("Missing authorization header");
    }

    // Get the Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Verify the user is authenticated
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Initialize Stripe with the provided secret key
    const stripeKey = "sk_test_51RcYjZRvRJBYs5hvdyGNfhYWuaNFKfA5bTA2m2WSOIv3uHpuAKmkj3bhm7uDM3qNIqudFsHwaAxCTCCXXBPjKZYz00mQPLFVFk";
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Get customer from Stripe by email
    const customers = await stripe.customers.list({
      email: userData.user.email,
      limit: 1
    });
    
    // If no customer exists, create one
    let customerId;
    if (customers.data.length === 0) {
      const newCustomer = await stripe.customers.create({
        email: userData.user.email,
        name: userData.user.user_metadata?.full_name || userData.user.email,
      });
      customerId = newCustomer.id;
    } else {
      customerId = customers.data[0].id;
    }

    // Get payment methods for the customer
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customerId,
      type: 'card',
    });

    // Get bank accounts if available
    const bankAccounts = await stripe.customers.listSources(
      customerId,
      { object: 'bank_account' }
    );

    // Format the accounts for the frontend
    const formattedAccounts = [
      // Format credit cards
      ...paymentMethods.data.map(method => ({
        id: method.id,
        name: `${method.card?.brand} •••• ${method.card?.last4}`,
        balance: 0, // Credit cards don't have balance in Stripe directly
        accountNumber: `•••• •••• •••• ${method.card?.last4}`,
        type: 'credit',
        icon: 'CreditCard',
        expiryDate: `${method.card?.exp_month}/${method.card?.exp_year}`
      })),
      
      // Format bank accounts
      ...bankAccounts.data.map((account: any) => ({
        id: account.id,
        name: `${account.bank_name || 'Bank'} Account`,
        balance: 0, // Bank accounts don't have balance in Stripe directly
        accountNumber: `•••• •••• •••• ${account.last4}`,
        type: account.object === 'bank_account' ? 'checking' : 'savings',
        icon: 'Wallet',
      })),
    ];

    // Return the formatted accounts
    return new Response(JSON.stringify({ accounts: formattedAccounts, customerId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in get-stripe-accounts function:", errorMessage);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
