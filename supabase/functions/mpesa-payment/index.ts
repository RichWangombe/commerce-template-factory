
// Follow Daraja API documentation: https://developer.safaricom.co.ke/
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const MPESA_CONSUMER_KEY = Deno.env.get("MPESA_CONSUMER_KEY") || "";
const MPESA_CONSUMER_SECRET = Deno.env.get("MPESA_CONSUMER_SECRET") || "";
const MPESA_PASSKEY = Deno.env.get("MPESA_PASSKEY") || "";
const MPESA_SHORTCODE = Deno.env.get("MPESA_SHORTCODE") || "";
const MPESA_ENV = Deno.env.get("MPESA_ENV") || "sandbox"; // sandbox or production

// API URLs based on environment
const BASE_URL = MPESA_ENV === "production"
  ? "https://api.safaricom.co.ke"
  : "https://sandbox.safaricom.co.ke";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get access token from M-Pesa
async function getAccessToken(): Promise<string> {
  try {
    const auth = btoa(`${MPESA_CONSUMER_KEY}:${MPESA_CONSUMER_SECRET}`);
    const response = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    const { access_token } = await response.json();
    return access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
    throw new Error("Failed to get M-Pesa access token");
  }
}

// Initiate STK Push for payment
async function initiateSTKPush(
  phone: string,
  amount: number,
  reference: string,
  description: string,
): Promise<any> {
  try {
    const accessToken = await getAccessToken();
    
    // Format phone number (remove leading 0 or +254)
    let phoneNumber = phone.replace(/^0|^\+254/, "");
    // Add 254 prefix if not present
    if (!phoneNumber.startsWith("254")) {
      phoneNumber = `254${phoneNumber}`;
    }
    
    // Generate timestamp
    const timestamp = new Date().toISOString().replace(/[-:\.]/g, "").slice(0, 14);
    // Generate password (shortcode + passkey + timestamp)
    const password = btoa(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`);
    
    // STK Push request
    const response = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount.toString(),
        PartyA: phoneNumber,
        PartyB: MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: `${Deno.env.get("PUBLIC_URL") || "https://example.com"}/api/mpesa-callback`,
        AccountReference: reference,
        TransactionDesc: description,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error initiating STK push:", error);
    throw new Error("Failed to initiate M-Pesa payment");
  }
}

// Check transaction status
async function checkTransactionStatus(checkoutRequestID: string): Promise<any> {
  try {
    const accessToken = await getAccessToken();
    
    // Generate timestamp
    const timestamp = new Date().toISOString().replace(/[-:\.]/g, "").slice(0, 14);
    // Generate password (shortcode + passkey + timestamp)
    const password = btoa(`${MPESA_SHORTCODE}${MPESA_PASSKEY}${timestamp}`);
    
    const response = await fetch(`${BASE_URL}/mpesa/stkpushquery/v1/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestID,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error("Error checking transaction status:", error);
    throw new Error("Failed to check M-Pesa transaction status");
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.split('/').pop();

    // Route for initiating payment
    if (path === 'pay' && req.method === 'POST') {
      const { phone, amount, reference, description } = await req.json();
      
      if (!phone || !amount || !reference) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await initiateSTKPush(phone, amount, reference, description || "Payment");
      
      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    // Route for checking status
    else if (path === 'status' && req.method === 'POST') {
      const { checkoutRequestID } = await req.json();
      
      if (!checkoutRequestID) {
        return new Response(
          JSON.stringify({ error: "Missing checkoutRequestID" }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const result = await checkTransactionStatus(checkoutRequestID);
      
      return new Response(
        JSON.stringify(result),
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
