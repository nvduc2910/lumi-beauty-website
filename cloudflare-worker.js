/**
 * Cloudflare Worker for Facebook Conversions API (CAPI) + Meta Dataset
 * Lumi Beauty – Final fixed version
 */

const FB_GRAPH_API = "https://graph.facebook.com/v21.0";
const FB_CAPI_ENDPOINT = `${FB_GRAPH_API}/events`;
const FB_DATASET_ENDPOINT = `${FB_GRAPH_API}`;

/* --- Utility Functions --- */

function getClientIP(request) {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0].trim() ||
    request.headers.get("X-Real-IP") ||
    ""
  );
}

async function hashData(data) {
  if (!data) return "";
  const encoder = new TextEncoder();
  const buffer = encoder.encode(data.toLowerCase().trim());
  const hash = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(hash)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function processUserData(ud) {
  const d = { ...ud };
  if (ud.em) d.em = await hashData(ud.em);
  if (ud.ph) d.ph = await hashData(ud.ph);
  return d;
}

/* --- Send to Conversions API --- */

async function sendToCAPI(payload, clientIP) {
  if (!payload.access_token || !payload.pixel_id)
    throw new Error("Missing access_token or pixel_id");

  if (payload.data?.[0]?.user_data) {
    payload.data[0].user_data = await processUserData(
      payload.data[0].user_data
    );
    payload.data[0].user_data.client_ip_address = clientIP;
  }

  const body = {
    data: payload.data,
    access_token: payload.access_token,
    test_event_code: payload.test_event_code || undefined,
  };

  // Use pixel_id in path (recommended by Facebook)
  const apiUrl = `${FB_GRAPH_API}/${payload.pixel_id}/events`;
  const res = await fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const responseText = await res.text();
  if (!res.ok) {
    console.error("Facebook API Error:", {
      status: res.status,
      url: apiUrl,
      response: responseText,
    });
    throw new Error(responseText);
  }
  return JSON.parse(responseText);
}

/* --- Send to Meta Dataset API --- */

async function sendToDataset(payload, clientIP) {
  if (!payload.access_token || !payload.dataset_id)
    throw new Error("Missing access_token or dataset_id");

  const datasetBody = {
    data: [
      {
        ...payload.data,
        client_ip: clientIP,
        timestamp: payload.data.timestamp || new Date().toISOString(),
      },
    ],
  };

  const res = await fetch(
    `${FB_DATASET_ENDPOINT}/${payload.dataset_id}/events`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${payload.access_token}`,
      },
      body: JSON.stringify(datasetBody),
    }
  );

  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

/* --- CORS Handler --- */

function corsHeaders(origin) {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

/* --- Worker --- */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // CORS preflight
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(request.headers.get("Origin")),
      });
    }

    const clientIP = getClientIP(request);

    try {
      /* 📌 1) /api/capi → Send Conversions API */
      if (path === "/api/capi" && method === "POST") {
        const payload = await request.json();

        payload.access_token = payload.access_token || env.FB_ACCESS_TOKEN;
        payload.pixel_id = payload.pixel_id || env.FB_PIXEL_ID;

        const result = await sendToCAPI(payload, clientIP);
        return new Response(JSON.stringify({ success: true, result }), {
          status: 200,
          headers: corsHeaders(request.headers.get("Origin")),
        });
      }

      /* 📌 2) /api/dataset → Send Dataset events */
      if (path === "/api/dataset" && method === "POST") {
        const payload = await request.json();

        payload.access_token = payload.access_token || env.FB_ACCESS_TOKEN;
        payload.dataset_id = payload.dataset_id || env.FB_DATASET_ID;

        const result = await sendToDataset(payload, clientIP);
        return new Response(JSON.stringify({ success: true, result }), {
          status: 200,
          headers: corsHeaders(request.headers.get("Origin")),
        });
      }

      /* 📌 3) /api/health → Worker Health Check */
      if (path === "/api/health") {
        return new Response(
          JSON.stringify({
            status: "ok",
            worker: "Lumi Beauty CAPI Worker",
            timestamp: new Date().toISOString(),
          }),
          {
            status: 200,
            headers: corsHeaders(request.headers.get("Origin")),
          }
        );
      }

      /* 🚫 Not Found */
      return new Response(JSON.stringify({ error: "Not Found", path }), {
        status: 404,
        headers: corsHeaders(request.headers.get("Origin")),
      });
    } catch (err) {
      return new Response(
        JSON.stringify({ success: false, error: err.message }),
        { status: 500, headers: corsHeaders(request.headers.get("Origin")) }
      );
    }
  },
};
