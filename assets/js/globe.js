/* ==========================================================================
   VISITOR GLOBE
   Dependency-free canvas globe: wireframe graticule, pins, and arcs from the
   home location to each pin. No three.js, no geodata, no network requests of
   its own beyond the optional visitor API.

   Data sources, in order of preference:
     1. The visitor API (a Cloudflare Worker) named in data-visitor-api.
     2. The fallback pins baked into data-pins from _data/globe.yml.
   If (1) fails for any reason the globe silently keeps showing (2), so it is
   never empty or broken.

   Honours prefers-reduced-motion (renders a static frame) and pauses entirely
   while scrolled out of view.
   ========================================================================== */
(function () {
  'use strict';

  var stage = document.getElementById('globe-stage');
  if (!stage) return;

  var canvas = document.getElementById('globe-canvas');
  if (!canvas || !canvas.getContext) return;

  var ctx = canvas.getContext('2d');
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------------------------------------------------------- data */

  var pins = [];
  try {
    pins = JSON.parse(stage.getAttribute('data-pins') || '[]');
  } catch (e) {
    pins = [];
  }
  if (!pins.length) return;

  var home = null;
  for (var i = 0; i < pins.length; i++) {
    if (pins[i].home) { home = pins[i]; break; }
  }
  if (!home) home = pins[0];

  /* --------------------------------------------------------------- theme */

  var palette = {};
  function readPalette() {
    var cs = getComputedStyle(document.documentElement);
    function v(name, fallback) {
      var got = cs.getPropertyValue(name);
      return (got && got.trim()) || fallback;
    }
    palette.grid   = v('--border-strong', '#cfcec8');
    palette.rim    = v('--border-strong', '#cfcec8');
    palette.accent = v('--accent', '#1c46b8');
    palette.text   = v('--text-muted', '#5a616c');
    palette.face   = v('--surface', '#ffffff');
  }
  readPalette();

  /* --------------------------------------------------------------- sizing */

  var W = 0, H = 0, R = 0, cx = 0, cy = 0, dpr = 1;

  function resize() {
    var rect = stage.getBoundingClientRect();
    var size = Math.max(180, Math.min(rect.width, rect.height || rect.width));
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = size; H = size;
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    R = size * 0.40;
    cx = size / 2;
    cy = size / 2;
  }

  /* ------------------------------------------------------------ geometry */

  var RAD = Math.PI / 180;
  // Every pin sits between roughly 30 and 52 degrees north, so tilt the globe
  // FORWARD to bring that band to the middle of the disc. A negative tilt
  // (leaning the north pole toward the viewer) shoves the whole cluster up
  // against the top edge, which is what it did before.
  var TILT = 30 * RAD;

  // lat/lon (degrees) -> rotated 3D unit vector. +z faces the viewer.
  function toXYZ(lat, lon, spin) {
    var la = lat * RAD;
    var lo = (lon + spin) * RAD;
    var x = Math.cos(la) * Math.sin(lo);
    var y = Math.sin(la);
    var z = Math.cos(la) * Math.cos(lo);
    // tilt about the X axis
    var y2 = y * Math.cos(TILT) - z * Math.sin(TILT);
    var z2 = y * Math.sin(TILT) + z * Math.cos(TILT);
    return { x: x, y: y2, z: z2 };
  }

  function project(p) {
    return { x: cx + R * p.x, y: cy - R * p.y, z: p.z };
  }

  /* -------------------------------------------------------------- drawing */

  function strokePath(points, color, width, alpha) {
    var started = false;
    ctx.beginPath();
    for (var i = 0; i < points.length; i++) {
      var p = points[i];
      if (p.z <= 0.02) { started = false; continue; } // behind the globe
      var s = project(p);
      if (!started) { ctx.moveTo(s.x, s.y); started = true; }
      else { ctx.lineTo(s.x, s.y); }
    }
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  function drawGraticule(spin) {
    var lat, lon, pts;

    // parallels
    for (lat = -60; lat <= 60; lat += 30) {
      pts = [];
      for (lon = 0; lon <= 360; lon += 4) pts.push(toXYZ(lat, lon, spin));
      strokePath(pts, palette.grid, 1, lat === 0 ? 0.75 : 0.45);
    }

    // meridians
    for (lon = 0; lon < 180; lon += 30) {
      pts = [];
      for (lat = -90; lat <= 90; lat += 4) pts.push(toXYZ(lat, lon, spin));
      strokePath(pts, palette.grid, 1, 0.42);
    }
  }

  function drawFace() {
    // Soft fill so the wireframe reads as a sphere rather than stray arcs.
    var g = ctx.createRadialGradient(cx - R * 0.35, cy - R * 0.35, R * 0.1, cx, cy, R);
    g.addColorStop(0, withAlpha(palette.accent, 0.10));
    g.addColorStop(1, withAlpha(palette.accent, 0.02));
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.fillStyle = g;
    ctx.fill();
  }

  function drawRim() {
    ctx.beginPath();
    ctx.arc(cx, cy, R, 0, Math.PI * 2);
    ctx.strokeStyle = palette.accent;
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1.4;
    ctx.stroke();
    ctx.globalAlpha = 1;
  }

  // Accepts #rgb/#rrggbb/rgb() and returns an rgba() string.
  function withAlpha(color, a) {
    var c = String(color).trim();
    if (c.charAt(0) === '#') {
      if (c.length === 4) c = '#' + c[1] + c[1] + c[2] + c[2] + c[3] + c[3];
      var n = parseInt(c.slice(1), 16);
      return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
    }
    var m = c.match(/rgba?\(([^)]+)\)/);
    if (m) {
      var parts = m[1].split(',').map(function (x) { return parseFloat(x); });
      return 'rgba(' + parts[0] + ',' + parts[1] + ',' + parts[2] + ',' + a + ')';
    }
    return c;
  }

  // Arc from a to b, lifted off the surface so it reads as a connection.
  function drawArc(a, b, spin, alpha) {
    var steps = 36;
    var pts = [];
    for (var i = 0; i <= steps; i++) {
      var t = i / steps;
      var lat = a.lat + (b.lat - a.lat) * t;
      var lon = a.lon + (b.lon - a.lon) * t;
      var p = toXYZ(lat, lon, spin);
      var lift = 1 + 0.22 * Math.sin(Math.PI * t);
      pts.push({ x: p.x * lift, y: p.y * lift, z: p.z });
    }
    strokePath(pts, palette.accent, 1.3, alpha);
  }

  function drawPin(pin, spin, maxCount) {
    var p = toXYZ(pin.lat, pin.lon, spin);
    var s = project(p);
    var front = p.z > 0.02;

    var weight = maxCount > 0 ? (pin.count || 0) / maxCount : 0;
    var r = 3.2 + weight * 3.4 + (pin.home ? 1.8 : 0);
    // Front pins fade toward the limb; back pins stay faint but present.
    var depth = front ? (0.45 + 0.55 * p.z) : 0.14;
    if (!front) r *= 0.75;

    ctx.globalAlpha = 0.16 * depth;
    ctx.beginPath();
    ctx.arc(s.x, s.y, r * 3.1, 0, Math.PI * 2);
    ctx.fillStyle = palette.accent;
    ctx.fill();

    ctx.globalAlpha = depth;
    ctx.beginPath();
    ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
    ctx.fillStyle = palette.accent;
    ctx.fill();

    if (pin.home && front) {
      ctx.globalAlpha = 0.9 * depth;
      ctx.beginPath();
      ctx.arc(s.x, s.y, r + 3, 0, Math.PI * 2);
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  }

  /* ----------------------------------------------------------- animation */

  // Start facing the mean longitude of all pins so the cluster is centred on
  // first paint, rather than showing an empty back face.
  var spin = (function () {
    if (!pins.length) return 96;
    var sx = 0, sy = 0;
    for (var i = 0; i < pins.length; i++) {
      var a = pins[i].lon * RAD;
      sx += Math.cos(a); sy += Math.sin(a);
    }
    return -(Math.atan2(sy, sx) / RAD);
  })();
  var running = false;
  var rafId = null;
  var last = 0;

  function frame(now) {
    if (!running) return;
    var dt = last ? Math.min(now - last, 60) : 16;
    last = now;
    spin = (spin + dt * 0.013) % 360; // ~28s per revolution
    render();
    rafId = window.requestAnimationFrame(frame);
  }

  function render() {
    ctx.clearRect(0, 0, W, H);

    var maxCount = 0;
    for (var i = 0; i < pins.length; i++) {
      if ((pins[i].count || 0) > maxCount) maxCount = pins[i].count || 0;
    }

    drawFace();
    drawGraticule(spin);
    drawRim();

    for (var j = 0; j < pins.length; j++) {
      if (pins[j] !== home) drawArc(home, pins[j], spin, 0.5);
    }
    for (var k = 0; k < pins.length; k++) {
      drawPin(pins[k], spin, maxCount);
    }
  }

  function start() {
    if (running || reduceMotion) { render(); return; }
    running = true;
    last = 0;
    rafId = window.requestAnimationFrame(frame);
  }

  function stop() {
    running = false;
    if (rafId) window.cancelAnimationFrame(rafId);
    rafId = null;
  }

  /* -------------------------------------------------------------- legend */

  function renderLegend() {
    var list = document.getElementById('globe-legend');
    if (!list) return;

    var sorted = pins.slice().sort(function (a, b) {
      return (b.count || 0) - (a.count || 0);
    });

    var html = '';
    for (var i = 0; i < Math.min(sorted.length, 8); i++) {
      var p = sorted[i];
      var right = (p.count || 0) > 0 ? String(p.count) : (p.detail || '');
      html += '<li><span class="dot"></span>' +
              '<span class="place">' + esc(p.place) + '</span>' +
              '<span class="count">' + esc(right) + '</span></li>';
    }
    list.innerHTML = html;
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function setTotal(n, unit) {
    var el = document.getElementById('globe-total');
    if (!el) return;
    el.innerHTML = '<strong>' + esc(n) + '</strong><span>' + esc(unit) + '</span>';
  }

  /* ---------------------------------------------------- live visitor data */

  function loadVisitors() {
    var api = stage.getAttribute('data-visitor-api');
    if (!api) return; // no worker deployed; fallback pins stand

    var done = false;
    var timer = window.setTimeout(function () { done = true; }, 4000);

    fetch(api, { method: 'GET', mode: 'cors', cache: 'no-store' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        window.clearTimeout(timer);
        if (done || !data || !data.locations || !data.locations.length) return;

        var live = data.locations.filter(function (l) {
          return typeof l.lat === 'number' && typeof l.lon === 'number';
        });
        if (!live.length) return;

        // Keep home so the arcs still originate somewhere meaningful.
        var homeCopy = { place: home.place, detail: home.detail, lat: home.lat, lon: home.lon, home: true };
        pins = [homeCopy].concat(live.map(function (l) {
          return { place: l.place || l.country || 'Unknown', lat: l.lat, lon: l.lon, count: l.count || 1 };
        }));
        home = homeCopy;

        renderLegend();
        setTotal(formatCount(data.total || 0), 'visits');
        render();
      })
      .catch(function () { /* offline, blocked, or worker down: fallback stands */ });
  }

  function formatCount(n) {
    n = Number(n) || 0;
    if (n >= 1000000) return (n / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return String(n);
  }

  /* ---------------------------------------------------------------- init */

  resize();
  renderLegend();
  render();
  loadVisitors();

  var resizeTimer = null;
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(function () { resize(); render(); }, 150);
  });

  // Repaint with the new palette when the theme flips.
  window.addEventListener('themechange', function () { readPalette(); render(); });

  // Only animate while actually on screen.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { en.isIntersecting ? start() : stop(); });
    }, { threshold: 0.1 }).observe(stage);
  } else {
    start();
  }

  document.addEventListener('visibilitychange', function () {
    document.hidden ? stop() : start();
  });
})();
