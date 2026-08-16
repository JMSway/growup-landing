// Cloudflare Pages Function — принимает события из js/app.js и пробрасывает их
// в Meta Conversions API (server-side), дедуплицируя с браузерным пикселем по event_id.
// Требует секрет META_CAPI_TOKEN, заданный в Cloudflare Pages → Settings → Environment variables.

const PIXEL_ID = '2121462675093372';
const GRAPH_URL = `https://graph.facebook.com/v19.0/${PIXEL_ID}/events`;

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.META_CAPI_TOKEN) {
    return new Response(JSON.stringify({ error: 'META_CAPI_TOKEN not configured' }), {
      status: 501,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'invalid json' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { event_name, event_id, event_source_url, fbp, fbc, custom_data, test_event_code } = body || {};
  if (!event_name || !event_id) {
    return new Response(JSON.stringify({ error: 'event_name and event_id are required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const user_data = {
    client_ip_address: request.headers.get('CF-Connecting-IP') || undefined,
    client_user_agent: request.headers.get('User-Agent') || undefined,
  };
  if (fbp) user_data.fbp = fbp;
  if (fbc) user_data.fbc = fbc;

  const payload = {
    data: [
      {
        event_name,
        event_time: Math.floor(Date.now() / 1000),
        event_id,
        event_source_url,
        action_source: 'website',
        user_data,
        ...(custom_data ? { custom_data } : {}),
      },
    ],
    ...(test_event_code ? { test_event_code } : {}),
  };

  try {
    const upstream = await fetch(`${GRAPH_URL}?access_token=${encodeURIComponent(env.META_CAPI_TOKEN)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ error: 'upstream request failed' }), {
      status: 502,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function onRequestGet() {
  return new Response('Method Not Allowed', { status: 405 });
}
