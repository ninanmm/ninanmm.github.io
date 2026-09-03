# Visitor globe backend

The globe at the bottom of every page works with no backend at all — it shows the
conference venues and research homes in `_data/globe.yml`. Deploy this worker only
when you want it to show **real visitor locations** instead.

## Cost

Free. Cloudflare's free plan gives Workers 100,000 requests/day and Workers KV
100,000 reads + 1,000 writes/day. This worker serves reads from the edge cache and
batches writes (at most one per isolate per minute), so a normal traffic day costs a
few dozen writes. No credit card is required for the free plan.

## What it stores

A country/city tally plus the coarse latitude and longitude that Cloudflare already
attaches at the edge. No IP addresses, no cookies, no identifiers, no user agents.
There is no per-person record to leak, and nothing to put in a privacy policy beyond
"visits are counted by country."

## Deploy

You need a free Cloudflare account and Node (already installed here).

1. Log in:

```bash
npx wrangler login
```

2. Create the KV namespace:

```bash
npx wrangler kv namespace create VISITORS
```

3. Copy the `id` it prints into `cloudflare/wrangler.toml`, replacing
   `PASTE_YOUR_KV_NAMESPACE_ID_HERE`.

4. Deploy from this directory:

```bash
cd cloudflare && npx wrangler deploy
```

5. Wrangler prints a URL like `https://ninanmm-visitors.<your-subdomain>.workers.dev`.
   Put it in `_data/globe.yml`:

```yaml
visitor_api: "https://ninanmm-visitors.<your-subdomain>.workers.dev"
```

6. Commit and push. The globe switches to live data on the next build, and the
   heading text under it changes to say so automatically.

## Checking it

```bash
curl -s https://ninanmm-visitors.<your-subdomain>.workers.dev | head -40
```

You should get `{"total":N,"locations":[...],"updated":"..."}`. If `locations` is
empty you are the first visitor and the first write has not flushed yet — reload
after a minute.

## If it breaks

Nothing on the site breaks. `assets/js/globe.js` gives the fetch 4 seconds, and on
any failure — worker down, quota hit, CORS mismatch, visitor offline — it keeps the
fallback pins from `_data/globe.yml`. To turn live data off, blank out `visitor_api`
in `_data/globe.yml`.

Note that `ALLOWED_ORIGINS` in `visitor-worker.js` is what permits the browser to
read the response. It already lists `https://ninanmm.github.io` and localhost; add
any other domain you serve the site from.
