/**
 * Visitor globe backend — Cloudflare Worker + Workers KV.
 *
 * Answers GET with a JSON snapshot of visitor locations for the globe on
 * ninanmm.github.io, and counts the current request while doing so.
 *
 * PRIVACY
 *   Stores only a country/region bucket and a coarse lat/lon that Cloudflare
 *   already attaches at the edge. No IP address, no cookie, no identifier, no
 *   user agent, nothing per-person. A bucket is a tally, not a visitor record,
 *   and nothing written here can be traced back to an individual.
 *
 * FREE TIER
 *   Workers: 100,000 requests/day. Workers KV: 100,000 reads and 1,000 writes
 *   per day. Reads are served from the edge cache (cacheTtl), and writes are
 *   batched in the isolate and flushed at most once every FLUSH_MS, so a normal
 *   traffic day costs a couple of dozen writes rather than one per pageview.
 *   That keeps this comfortably inside the free plan.
 */

const KV_KEY = 'visitors:v1';
const FLUSH_MS = 60_000;   // at most one KV write per isolate per minute
const READ_TTL = 300;      // seconds the edge may cache the snapshot
const MAX_BUCKETS = 300;   // hard cap so the value can never grow unbounded

// Per-isolate write-behind buffer. Isolates are short-lived; anything still in
// here when one is recycled is simply not counted, which is an acceptable
// trade for staying inside the write quota.
let pending = Object.create(null);
let lastFlush = 0;

const ALLOWED_ORIGINS = [
  'https://ninanmm.github.io',
  'http://localhost:4000',
  'http://127.0.0.1:4000',
];

function corsHeaders(origin) {
  const allow = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}

function json(body, origin, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=60',
      ...corsHeaders(origin),
    },
  });
}

async function readSnapshot(env) {
  try {
    const raw = await env.VISITORS.get(KV_KEY, { type: 'json', cacheTtl: READ_TTL });
    if (raw && typeof raw === 'object' && raw.buckets) return raw;
  } catch (e) {
    // KV unavailable: fall through to an empty snapshot. The site's baked-in
    // fallback pins keep the globe populated, so this degrades quietly.
  }
  return { buckets: Object.create(null), total: 0 };
}

async function flush(env) {
  const keys = Object.keys(pending);
  if (!keys.length) return;

  const batch = pending;
  pending = Object.create(null);
  lastFlush = Date.now();

  const snap = await readSnapshot(env);

  for (const key of keys) {
    const inc = batch[key];
    const existing = snap.buckets[key];
    if (existing) {
      existing.count += inc.count;
      // Keep the first coordinates seen; they are already coarse.
      if (typeof existing.lat !== 'number') { existing.lat = inc.lat; existing.lon = inc.lon; }
    } else {
      snap.buckets[key] = { place: inc.place, lat: inc.lat, lon: inc.lon, count: inc.count };
    }
    snap.total = (snap.total || 0) + inc.count;
  }

  // Trim to the busiest buckets so the stored value stays small.
  const entries = Object.entries(snap.buckets);
  if (entries.length > MAX_BUCKETS) {
    entries.sort((a, b) => b[1].count - a[1].count);
    const trimmed = Object.create(null);
    for (const [k, v] of entries.slice(0, MAX_BUCKETS)) trimmed[k] = v;
    snap.buckets = trimmed;
  }

  try {
    await env.VISITORS.put(KV_KEY, JSON.stringify(snap));
  } catch (e) {
    // Write quota hit or KV down. Reads still work; we just lose this batch.
  }
}

function record(request) {
  const cf = request.cf || {};
  const country = cf.country || 'XX';
  const city = cf.city || '';
  const key = country + (city ? ':' + city : '');

  const lat = cf.latitude ? Number(cf.latitude) : null;
  const lon = cf.longitude ? Number(cf.longitude) : null;
  if (lat === null || lon === null || Number.isNaN(lat) || Number.isNaN(lon)) return;

  const place = city ? `${city}, ${country}` : country;

  if (pending[key]) {
    pending[key].count += 1;
  } else {
    pending[key] = { place, lat, lon, count: 1 };
  }
}

function shape(snap) {
  const locations = Object.values(snap.buckets || {})
    .filter((b) => typeof b.lat === 'number' && typeof b.lon === 'number')
    .sort((a, b) => b.count - a.count)
    .slice(0, 60)
    .map((b) => ({ place: b.place, lat: b.lat, lon: b.lon, count: b.count }));

  return { total: snap.total || 0, locations, updated: new Date().toISOString() };
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get('Origin') || '';

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin) });
    }

    if (request.method !== 'GET') {
      return json({ error: 'method not allowed' }, origin, 405);
    }

    if (!env.VISITORS) {
      return json({ error: 'KV namespace VISITORS is not bound' }, origin, 500);
    }

    record(request);

    const snap = await readSnapshot(env);

    // Fold the un-flushed buffer into the response so the count a visitor sees
    // includes their own visit without waiting for a write.
    const merged = { buckets: { ...snap.buckets }, total: snap.total || 0 };
    for (const [key, inc] of Object.entries(pending)) {
      if (merged.buckets[key]) {
        merged.buckets[key] = { ...merged.buckets[key], count: merged.buckets[key].count + inc.count };
      } else {
        merged.buckets[key] = { ...inc };
      }
      merged.total += inc.count;
    }

    if (Date.now() - lastFlush > FLUSH_MS) {
      ctx.waitUntil(flush(env));
    }

    return json(shape(merged), origin);
  },
};
