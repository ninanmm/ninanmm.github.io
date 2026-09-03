/* ==========================================================================
   LIVE METRICS
   Refreshes the citation / h-index tiles at runtime.

   Source is OpenAlex (api.openalex.org), keyed on the author's ORCID.
   Why not Google Scholar: Scholar publishes no API, blocks automated requests,
   and forbids cross-origin reads, so a browser-side Scholar fetch cannot work
   and would just fail silently forever. OpenAlex is free, needs no key, sends
   CORS headers, and indexes the same DOIs.

   This is a progressive enhancement only. The values rendered server-side from
   _data/metrics.yml are authoritative; if this fetch fails, is slow, or returns
   nothing, those numbers stay exactly as they are. Nothing here can leave the
   page showing a zero or a blank where a number used to be.
   ========================================================================== */
(function () {
  'use strict';

  var host = document.querySelector('[data-orcid]');
  if (!host) return;

  var orcid = host.getAttribute('data-orcid');
  if (!orcid) return;

  // Cache for a day so repeat visits don't re-hit the API.
  var CACHE_KEY = 'metrics:openalex';
  var TTL_MS = 24 * 60 * 60 * 1000;

  function paint(stats) {
    if (!stats) return;

    var map = {
      scholar_citations: stats.citations,
      scholar_hindex: stats.hindex,
      scholar_i10: stats.i10
    };

    Object.keys(map).forEach(function (key) {
      var value = map[key];
      if (value === null || value === undefined || value === '') return;

      var el = document.querySelector('[data-metric="' + key + '"]');
      if (!el) return;

      el.textContent = String(value);

      // The tile said "Google Scholar"; say where the live number actually came from.
      var tile = el.closest('.metric');
      var note = tile && tile.querySelector('.metric__note');
      if (note) note.textContent = 'OpenAlex, live';
    });
  }

  function cached() {
    try {
      var raw = localStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      var obj = JSON.parse(raw);
      if (!obj || (Date.now() - obj.at) > TTL_MS) return null;
      return obj.stats;
    } catch (e) { return null; }
  }

  function store(stats) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), stats: stats }));
    } catch (e) { /* quota or private mode; not important */ }
  }

  var hit = cached();
  if (hit) { paint(hit); return; }

  var url = 'https://api.openalex.org/authors/' + encodeURIComponent(orcid);

  var controller = null;
  if ('AbortController' in window) {
    controller = new AbortController();
    window.setTimeout(function () { controller.abort(); }, 5000);
  }

  fetch(url, {
    method: 'GET',
    mode: 'cors',
    cache: 'no-store',
    signal: controller ? controller.signal : undefined
  })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (!data) return;

      var s = data.summary_stats || {};
      var stats = {
        citations: typeof data.cited_by_count === 'number' ? data.cited_by_count : null,
        hindex: typeof s.h_index === 'number' ? s.h_index : null,
        i10: typeof s.i10_index === 'number' ? s.i10_index : null
      };

      // Refuse to overwrite real numbers with an empty or zeroed response.
      if (!stats.citations && !stats.hindex && !stats.i10) return;

      store(stats);
      paint(stats);
    })
    .catch(function () { /* offline, aborted, rate-limited: server-side values stand */ });
})();
