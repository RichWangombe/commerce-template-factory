
// Follow Daraja API documentation: https://developer.safaricom.co.ke/
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Default sandbox credentials
const defaultSandboxCredentials = {
  consumerKey: "2sh71geGOB3UIwAJVIBnuMpQW7BNGpGw",
  consumerSecret: "5wttLijr7XxKJPKe",
  passkey: "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919",
  shortcode: "174379",
  env: "sandbox",
  callbackUrl: "https://example.com/api/mpesa-callback"
};

// Get access token from M-Pesa
async function getAccessToken(consumerKey: string, consumerSecret: string, env: string): Promise<string> {
  try {
    const auth = btoa(`${consumerKey}:${consumerSecret}`);
    const baseUrl = env === "production"
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";
      
    const response = await fetch(`${baseUrl}/oauth/v1/generate?grant_type=client_credentials`, {
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
  credentials: {
    consumerKey: string;
    consumerSecret: string;
    passkey: string;
    shortcode: string;
    env: string;
    callbackUrl: string;
  }
): Promise<any> {
  try {
    const { consumerKey, consumerSecret, passkey, shortcode, env, callbackUrl } = credentials;
    const accessToken = await getAccessToken(consumerKey, consumerSecret, env);
    
    // Format phone number (remove leading 0 or +254)
    let phoneNumber = phone.replace(/^0|^\+254/, "");
    // Add 254 prefix if not present
    if (!phoneNumber.startsWith("254")) {
      phoneNumber = `254${phoneNumber}`;
    }
    
    // Generate timestamp
    const timestamp = new Date().toISOString().replace(/[-:\.]/g, "").slice(0, 14);
    // Generate password (shortcode + passkey + timestamp)
    const password = btoa(`${shortcode}${passkey}${timestamp}`);
    
    // Determine base URL based on environment
    const baseUrl = env === "production"
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";
    
    // STK Push request
    const response = await fetch(`${baseUrl}/mpesa/stkpush/v1/processrequest`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: amount.toString(),
        PartyA: phoneNumber,
        PartyB: shortcode,
        PhoneNumber: phoneNumber,
        CallBackURL: callbackUrl || "https://example.com/api/mpesa-callback",
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
async function checkTransactionStatus(
  checkoutRequestID: string, 
  credentials: {
    consumerKey: string;
    consumerSecret: string;
    passkey: string;
    shortcode: string;
    env: string;
  }
): Promise<any> {
  try {
    const { consumerKey, consumerSecret, passkey, shortcode, env } = credentials;
    const accessToken = await getAccessToken(consumerKey, consumerSecret, env);
    
    // Generate timestamp
    const timestamp = new Date().toISOString().replace(/[-:\.]/g, "").slice(0, 14);
    // Generate password (shortcode + passkey + timestamp)
    const password = btoa(`${shortcode}${passkey}${timestamp}`);
    
    // Determine base URL based on environment
    const baseUrl = env === "production"
      ? "https://api.safaricom.co.ke"
      : "https://sandbox.safaricom.co.ke";
    
    const response = await fetch(`${baseUrl}/mpesa/stkpushquery/v1/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        BusinessShortCode: shortcode,
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

// Get credentials from environment or request
function getCredentials(requestCredentials?: any) {
  // Priority: Request credentials > Environment variables > Default sandbox credentials
  
  // Get from environment if available
  const envCredentials = {
    consumerKey: Deno.env.get("MPESA_CONSUMER_KEY") || "",
    consumerSecret: Deno.env.get("MPESA_CONSUMER_SECRET") || "",
    passkey: Deno.env.get("MPESA_PASSKEY") || "",
    shortcode: Deno.env.get("MPESA_SHORTCODE") || "",
    env: Deno.env.get("MPESA_ENV") || "sandbox",
    callbackUrl: Deno.env.get("PUBLIC_URL") ? `${Deno.env.get("PUBLIC_URL")}/api/mpesa-callback` : ""
  };
  
  // Merge credentials from different sources with priority
  return {
    ...defaultSandboxCredentials,
    ...Object.fromEntries(
      Object.entries(envCredentials).filter(([_, value]) => value)
    ),
    ...Object.fromEntries(
      Object.entries(requestCredentials || {}).filter(([_, value]) => value)
    )
  };
}

// Function to simulate successful M-Pesa payment for demo purposes
function generateDemoResponse(requestType: 'stk' | 'status', checkoutRequestID?: string) {
  const demoRequestId = checkoutRequestID || `ws_CO_${Date.now()}${Math.floor(Math.random() * 10000)}`;
  
  if (requestType === 'stk') {
    return {
      MerchantRequestID: `merc_${Date.now()}${Math.floor(Math.random() * 10000)}`,
      CheckoutRequestID: demoRequestId,
      ResponseCode: "0",
      ResponseDescription: "Success. Request accepted for processing",
      CustomerMessage: "Success. Request accepted for processing"
    };
  } else {
    return {
      ResponseCode: "0",
      ResponseDescription: "The service request has been accepted successfully",
      MerchantRequestID: `merc_${Date.now()}${Math.floor(Math.random() * 10000)}`,
      CheckoutRequestID: demoRequestId,
      ResultCode: "0",
      ResultDesc: "The service request is processed successfully."
    };
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
    const requestBody = await req.json();
    const isDemoMode = url.searchParams.get('demo') === 'true' || Deno.env.get("MPESA_DEMO_MODE") === 'true';

    // Route for initiating payment
    if (path === 'pay' && req.method === 'POST') {
      const { phone, amount, reference, description, credentials: requestCredentials } = requestBody;
      
      if (!phone || !amount || !reference) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // If demo mode is enabled, return a successful demo response
      if (isDemoMode) {
        console.log("Using demo mode for M-Pesa payment");
        return new Response(
          JSON.stringify(generateDemoResponse('stk')),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const credentials = getCredentials(requestCredentials);
      const result = await initiateSTKPush(phone, amount, reference, description || "Payment", credentials);
      
      return new Response(
        JSON.stringify(result),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    // Route for checking status
    else if (path === 'status' && req.method === 'POST') {
      const { checkoutRequestID, credentials: requestCredentials } = requestBody;
      
      if (!checkoutRequestID) {
        return new Response(
          JSON.stringify({ error: "Missing checkoutRequestID" }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // If demo mode is enabled, return a successful demo response
      if (isDemoMode || checkoutRequestID.startsWith('demo-')) {
        console.log("Using demo mode for M-Pesa status check");
        return new Response(
          JSON.stringify(generateDemoResponse('status', checkoutRequestID)),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      const credentials = getCredentials(requestCredentials);
      const result = await checkTransactionStatus(checkoutRequestID, credentials);
      
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
