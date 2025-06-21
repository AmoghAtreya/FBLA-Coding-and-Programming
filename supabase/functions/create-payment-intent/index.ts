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

    // Parse request body
    const { amount, currency = 'usd', customerId } = await req.json();
    if (!amount) {
      throw new Error("Missing amount in request body");
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

    // Initialize Stripe with the secret key
    const stripeKey = "sk_test_51RcYjZRvRJBYs5hvdyGNfhYWuaNFKfA5bTA2m2WSOIv3uHpuAKmkj3bhm7uDM3qNIqudFsHwaAxCTCCXXBPjKZYz00mQPLFVFk";
    
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2023-10-16",
    });

    // Get or create customer
    let customer = customerId;
    if (!customer) {
      const customers = await stripe.customers.list({
        email: userData.user.email,
        limit: 1
      });
      
      if (customers.data.length === 0) {
        const newCustomer = await stripe.customers.create({
          email: userData.user.email,
          name: userData.user.user_metadata?.full_name || userData.user.email,
        });
        customer = newCustomer.id;
      } else {
        customer = customers.data[0].id;
      }
    }

    // Create a payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // Amount should already be in cents
      currency: currency,
      customer: customer,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        user_id: userData.user.id,
        user_email: userData.user.email || '',
      },
    });

    // Return the client secret and payment intent ID
    return new Response(JSON.stringify({ 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      customerId: customer,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error in create-payment-intent function:", errorMessage);
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
}); 