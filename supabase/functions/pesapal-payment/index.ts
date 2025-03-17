
// Pesapal payment processing function
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import * as crypto from "https://deno.land/std@0.167.0/node/crypto.ts";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Pesapal API configuration
const PESAPAL_BASE_URL = "https://www.pesapal.com";
const PESAPAL_IFRAME_URL = `${PESAPAL_BASE_URL}/API/PostPesapalDirectOrderV4`;
const CONSUMER_KEY = Deno.env.get("PESAPAL_CONSUMER_KEY");
const CONSUMER_SECRET = Deno.env.get("PESAPAL_CONSUMER_SECRET");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check for API keys
    if (!CONSUMER_KEY || !CONSUMER_SECRET) {
      return new Response(
        JSON.stringify({ 
          error: "Missing Pesapal API keys. Please set the PESAPAL_CONSUMER_KEY and PESAPAL_CONSUMER_SECRET environment variables." 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const requestBody = await req.json();
    
    // Handle create payment request
    if (req.method === 'POST' && !requestBody.action) {
      const { 
        amount, 
        currency = 'USD', 
        description = 'Payment for order', 
        firstName, 
        lastName, 
        email, 
        phone, 
        reference = `ORDER-${Date.now()}` 
      } = requestBody;
      
      if (!amount || !firstName || !lastName || !email) {
        return new Response(
          JSON.stringify({ error: "Missing required fields" }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create OAuth timestamp and nonce
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const nonce = crypto.randomBytes(16).toString('hex');
      
      // Prepare XML for the POST request
      const xml = `<?xml version="1.0" encoding="utf-8"?>
      <PesapalDirectOrderInfo 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
        Amount="${amount}" 
        Description="${description}" 
        Type="MERCHANT" 
        Reference="${reference}" 
        FirstName="${firstName}" 
        LastName="${lastName}" 
        Email="${email}" 
        PhoneNumber="${phone || ''}" 
        Currency="${currency}" 
        xmlns="http://www.pesapal.com" />`;
      
      // URL encode the XML
      const encodedXML = encodeURIComponent(xml);
      
      // Create OAuth signature base string
      const signatureBaseString = 
        `GET&${encodeURIComponent(PESAPAL_IFRAME_URL)}&` + 
        `${encodeURIComponent(
          `oauth_callback=${encodeURIComponent("https://yoursite.com/callback")}&` +
          `oauth_consumer_key=${CONSUMER_KEY}&` +
          `oauth_nonce=${nonce}&` +
          `oauth_signature_method=HMAC-SHA1&` +
          `oauth_timestamp=${timestamp}&` +
          `oauth_version=1.0&` +
          `pesapal_request_data=${encodedXML}`
        )}`;
      
      // Generate OAuth signature
      const hmac = crypto.createHmac('sha1', `${CONSUMER_SECRET}&`);
      hmac.update(signatureBaseString);
      const oauthSignature = hmac.digest('base64');
      
      // Build the iFrame URL with OAuth parameters
      const iframeUrl = 
        `${PESAPAL_IFRAME_URL}?` +
        `oauth_callback=${encodeURIComponent("https://yoursite.com/callback")}&` +
        `oauth_consumer_key=${CONSUMER_KEY}&` +
        `oauth_nonce=${nonce}&` +
        `oauth_signature=${encodeURIComponent(oauthSignature)}&` +
        `oauth_signature_method=HMAC-SHA1&` +
        `oauth_timestamp=${timestamp}&` +
        `oauth_version=1.0&` +
        `pesapal_request_data=${encodedXML}`;
      
      return new Response(
        JSON.stringify({
          iframeUrl,
          reference,
          timestamp
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    // Handle check payment status
    else if (req.method === 'POST' && requestBody.action === 'check') {
      const { reference, transaction_id } = requestBody;
      
      if (!reference) {
        return new Response(
          JSON.stringify({ error: "Missing payment reference" }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Create OAuth timestamp and nonce
      const timestamp = Math.floor(Date.now() / 1000).toString();
      const nonce = crypto.randomBytes(16).toString('hex');
      
      // Construct the status query URL
      const statusUrl = `${PESAPAL_BASE_URL}/API/QueryPaymentStatus`;
      
      // Create OAuth signature base string
      const signatureBaseString = 
        `GET&${encodeURIComponent(statusUrl)}&` + 
        `${encodeURIComponent(
          `oauth_consumer_key=${CONSUMER_KEY}&` +
          `oauth_nonce=${nonce}&` +
          `oauth_signature_method=HMAC-SHA1&` +
          `oauth_timestamp=${timestamp}&` +
          `oauth_version=1.0&` +
          `pesapal_merchant_reference=${reference}` +
          (transaction_id ? `&pesapal_transaction_tracking_id=${transaction_id}` : '')
        )}`;
      
      // Generate OAuth signature
      const hmac = crypto.createHmac('sha1', `${CONSUMER_SECRET}&`);
      hmac.update(signatureBaseString);
      const oauthSignature = hmac.digest('base64');
      
      // Build the status request URL
      const queryUrl = 
        `${statusUrl}?` +
        `oauth_consumer_key=${CONSUMER_KEY}&` +
        `oauth_nonce=${nonce}&` +
        `oauth_signature=${encodeURIComponent(oauthSignature)}&` +
        `oauth_signature_method=HMAC-SHA1&` +
        `oauth_timestamp=${timestamp}&` +
        `oauth_version=1.0&` +
        `pesapal_merchant_reference=${reference}` +
        (transaction_id ? `&pesapal_transaction_tracking_id=${transaction_id}` : '');
      
      try {
        // Fetch the payment status from Pesapal
        const response = await fetch(queryUrl);
        const statusData = await response.text();
        
        return new Response(
          JSON.stringify({ 
            status: statusData,
            reference,
            transaction_id
          }),
          { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ 
            error: "Failed to check payment status",
            message: error.message
          }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
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
