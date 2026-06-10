import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Content-Type': 'application/json'
};

serve(async (request) => {
  if (request.method === 'OPTIONS') {
    return new Response('ok', {
      headers: corsHeaders
    });
  }

  if (request.method !== 'GET') {
    return new Response(
      JSON.stringify({
        ok: false,
        error: 'Method not allowed. Use GET.'
      }),
      {
        status: 405,
        headers: corsHeaders
      }
    );
  }

  return new Response(
    JSON.stringify({
      ok: true,
      message: 'Client connection to Supabase Edge Functions works.',
      timestamp: new Date().toISOString()
    }),
    {
      status: 200,
      headers: corsHeaders
    }
  );
});
