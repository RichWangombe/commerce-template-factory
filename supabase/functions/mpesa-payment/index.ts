
// Simple payment processing function (no Daraja API dependency)
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();
    const requestBody = await req.json();

    // Route for initiating payment
    if (path === 'pay' && req.method === 'POST') {
      const { phone, amount, reference, description } = requestBody;
      
      if (!phone || !amount || !reference) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Generate a mock transaction ID
      const transactionId = `txn_${Date.now()}${Math.floor(Math.random() * 10000)}`;
      
      return new Response(
        JSON.stringify({
          success: true,
          transactionId,
          message: "Payment initiated successfully"
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    // Route for checking status
    else if (path === 'status' && req.method === 'POST') {
      const { transactionId } = requestBody;
      
      if (!transactionId) {
        return new Response(
          JSON.stringify({ error: "Missing transactionId" }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Always return success for the simplified implementation
      return new Response(
        JSON.stringify({ 
          success: true,
          resultCode: "0",
          resultDesc: "Payment completed successfully",
          transactionId
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
