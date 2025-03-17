
// Stripe payment processing function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@12.0.0";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Stripe API key from environment variable
    const stripeApiKey = Deno.env.get('STRIPE_SECRET_KEY');
    if (!stripeApiKey) {
      return new Response(
        JSON.stringify({ 
          error: "Missing Stripe API key. Please set the STRIPE_SECRET_KEY environment variable." 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const stripe = new Stripe(stripeApiKey, {
      apiVersion: '2022-11-15',
    });
    
    const url = new URL(req.url);
    const requestBody = await req.json();
    
    // Handle create payment intent
    if (req.method === 'POST' && !requestBody.action) {
      const { amount, currency = 'usd', description = 'Payment' } = requestBody;
      
      if (!amount) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
        description,
        automatic_payment_methods: {
          enabled: true,
        },
      });
      
      return new Response(
        JSON.stringify({
          clientSecret: paymentIntent.client_secret,
          id: paymentIntent.id
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    // Handle check payment status
    else if (req.method === 'POST' && requestBody.action === 'check') {
      const { paymentId } = requestBody;
      
      if (!paymentId) {
        return new Response(
          JSON.stringify({ error: "Missing payment ID" }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentId);
      
      return new Response(
        JSON.stringify({ 
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // If no route matches
    return new Response(
      JSON.stringify({ error: "Not found" }),
      { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
