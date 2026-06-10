#!/usr/bin/env node
/**
 * Local Mock API Server für Health Checks während Entwicklung
 * Läuft auf Port 4000 und simuliert die Supabase Edge Functions
 */

const http = require('http');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS, POST',
  'Content-Type': 'application/json'
};

const server = http.createServer((req, res) => {
  // CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200, corsHeaders);
    res.end('ok');
    return;
  }

  // Health Check Endpoint
  if (req.url === '/functions/v1/client-connection-check' && req.method === 'GET') {
    res.writeHead(200, corsHeaders);
    res.end(JSON.stringify({
      ok: true,
      message: 'Client connection to Supabase Edge Functions works (Mock).',
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Not found
  res.writeHead(404, corsHeaders);
  res.end(JSON.stringify({ ok: false, error: 'Not found' }));
});

const PORT = 4000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Mock API Server running on http://0.0.0.0:${PORT}`);
  console.log(`   Local: http://localhost:${PORT}/functions/v1/client-connection-check`);
  console.log(`   Network: http://172.20.10.2:${PORT}/functions/v1/client-connection-check`);
  console.log(`   📱 Für Handy: Nutze http://172.20.10.2:${PORT}`);
});
