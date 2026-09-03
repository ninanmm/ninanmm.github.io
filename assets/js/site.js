/* ==========================================================================
   SITE BEHAVIOUR
   Theme toggle, publication search/filter, disclosure buttons, copy-to-
   clipboard, and scroll reveal. Vanilla JS, no dependencies, loaded as its own
   file so it does NOT need `npm run build:js` to take effect.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------------------------------------------------------- theme toggle */

  function systemPrefersDark() {
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  function activeTheme() {
    var set = root.getAttribute('data-theme');
    if (set === 'light' || set === 'dark') return set;
    return systemPrefersDark() ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem('theme', theme); } catch (e) { /* private mode */ }

    var btn = document.getElementById('theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label',
        theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    }
    // Let other components (the globe) repaint with the new palette.
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: theme } }));
  }

  function toggleTheme() {
    applyTheme(activeTheme() === 'dark' ? 'light' : 'dark');
  }

  var toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) toggleBtn.addEventListener('click', toggleTheme);

  // Ctrl/Cmd + Shift + L
  document.addEventListener('keydown', function (e) {
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'L' || e.key === 'l')) {
      e.preventDefault();
      toggleTheme();
    }
  });

  // Follow the OS only while the visitor has not chosen explicitly.
  if (window.matchMedia) {
    var mq = window.matchMedia('(prefers-color-scheme: dark)');
    var onSystemChange = function () {
      var chosen = null;
      try { chosen = localStorage.getItem('theme'); } catch (e) {}
      if (chosen !== 'light' && chosen !== 'dark') {
        window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: activeTheme() } }));
      }
    };
    if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange);
  }

  /* ------------------------------------------------------------- disclosure */

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.js-disclose');
    if (!btn) return;

    var panel = document.getElementById(btn.getAttribute('data-target'));
    if (!panel) return;

    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', open ? 'false' : 'true');
    panel.hidden = open;

    var label = btn.querySelector('.js-disclose-label');
    if (label) label.textContent = open ? 'Abstract' : 'Hide abstract';
  });

  /* -------------------------------------------------------- copy to clipboard */

  document.addEventListener('click', function (e) {
    var btn = e.target.closest && e.target.closest('.js-copy');
    if (!btn) return;

    var text = btn.getAttribute('data-copy') || '';
    var label = btn.querySelector('.js-copy-label');
    var original = label ? label.textContent : '';

    function done(ok) {
      if (!label) return;
      label.textContent = ok ? 'Copied' : 'Copy failed';
      window.setTimeout(function () { label.textContent = original; }, 1600);
    }

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { done(true); }, function () { done(false); });
    } else {
      // Fallback for older browsers and non-secure contexts.
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (err) { ok = false; }
      document.body.removeChild(ta);
      done(ok);
    }
  });

  /* ------------------------------------------------ publication search/filter */

  (function publications() {
    var search = document.getElementById('pub-search');
    var chips = Array.prototype.slice.call(document.querySelectorAll('.js-pub-filter'));
    var cards = Array.prototype.slice.call(document.querySelectorAll('.pub'));
    var sections = Array.prototype.slice.call(document.querySelectorAll('.js-pub-section'));
    var empty = document.getElementById('pub-empty');

    if (!cards.length || (!search && !chips.length)) return;

    var activeType = 'all';
    var query = '';

    function apply() {
      var shown = 0;

      cards.forEach(function (card) {
        var matchesType = activeType === 'all' || card.getAttribute('data-type') === activeType;
        var matchesQuery = !query || (card.getAttribute('data-search') || '').indexOf(query) !== -1;
        var visible = matchesType && matchesQuery;
        card.hidden = !visible;
        if (visible) shown++;
      });

      // Hide a section heading when everything under it is filtered out.
      sections.forEach(function (section) {
        var any = section.querySelector('.pub:not([hidden])');
        section.hidden = !any;
      });

      if (empty) empty.hidden = shown !== 0;
    }

    if (search) {
      var debounce = null;
      search.addEventListener('input', function () {
        window.clearTimeout(debounce);
        debounce = window.setTimeout(function () {
          query = search.value.trim().toLowerCase();
          apply();
        }, 120);
      });
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        activeType = chip.getAttribute('data-filter');
        chips.forEach(function (c) {
          c.setAttribute('aria-pressed', c === chip ? 'true' : 'false');
        });
        apply();
      });
    });
  })();

  /* ---------------------------------------------------------- scroll reveal */

  (function reveal() {
    var targets = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if (!targets.length) return;

    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || !('IntersectionObserver' in window)) return; // stays visible

    // Only now is it safe to hide anything: this class is what activates the
    // hidden state in CSS, and we are about to observe every target.
    root.classList.add('reveal-ready');

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });

    targets.forEach(function (el) { io.observe(el); });
  })();
})();
