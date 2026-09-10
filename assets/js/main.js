/**
 * main.js, shared interactive behaviour.
 * Waits for the header/footer partials (see include-partials.js)
 * before wiring up anything that lives inside them.
 */
(function () {
  'use strict';

  /* ---------------- mobile nav toggle ---------------- */
  function initNavToggle() {
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');
    if (!toggle || !links) return;
    toggle.addEventListener('click', function () {
      var isOpen = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        links.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- generic category filter ----------------
     Works on any page that has [data-filter-bar] + a matching
     set of [data-category] items. Used by clubs.html and
     gallery.html. Filtering never reorders items, it only
     shows/hides, so the underlying alphabetical order (set in
     the data files) is preserved regardless of which filter is
     active. This is deliberate: see the no-favouritism note in
     README.md / COMPLIANCE-AUDIT.md. */
  function initFilterBar() {
    var bar = document.querySelector('[data-filter-bar]');
    if (!bar) return;
    var items = document.querySelectorAll('[data-category]');
    bar.querySelectorAll('button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        bar.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        var cat = btn.dataset.filter;
        var visibleCount = 0;
        items.forEach(function (item) {
          var show = (cat === 'all' || item.dataset.category === cat);
          item.style.display = show ? '' : 'none';
          if (show) visibleCount += 1;
        });
        var status = document.querySelector('[data-filter-status]');
        if (status) {
          status.textContent = visibleCount + (visibleCount === 1 ? ' result' : ' results') +
            (cat === 'all' ? '' : ' in ' + btn.textContent.trim());
        }
      });
    });
  }

  /* ---------------- accessible accordion (FAQ) ---------------- */
  function initAccordions() {
    document.querySelectorAll('.accordion-trigger').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var expanded = trigger.getAttribute('aria-expanded') === 'true';
        trigger.setAttribute('aria-expanded', String(!expanded));
        var panelId = trigger.getAttribute('aria-controls');
        var panel = document.getElementById(panelId);
        if (panel) panel.hidden = expanded;
        var plus = trigger.querySelector('.plus');
        if (plus) plus.textContent = expanded ? '+' : '\u2212';
      });
    });
  }

  /* ---------------- back-to-top ---------------- */
  function initBackToTop() {
    var btn = document.querySelector('.to-top');
    if (!btn) return;
    window.addEventListener('scroll', function () {
      btn.classList.toggle('is-visible', window.scrollY > 700);
    }, { passive: true });
    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      document.querySelector('#main-content').focus();
    });
  }

  /* ---------------- generated identicon art blocks ----------------
     Deterministic, seeded-from-name SVG pattern used in place of
     stock photography we do not hold rights to. Every club/event
     gets one automatically and equally, nobody gets a "real
     photo" while others get a flat placeholder, which would read
     as favouritism. Swap for a real photo per entry only once the
     council supplies one, following the same <figure> markup. */
  var PALETTE = ['#0E6B5C', '#F2A900', '#C7401F', '#5B4B8A', '#1758C9'];

  function hashString(str) {
    var h = 0;
    for (var i = 0; i < str.length; i++) {
      h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
    }
    return Math.abs(h);
  }

  function renderArtBlock(container) {
    var seed = container.dataset.seed || container.textContent || 'club';
    var h = hashString(seed);
    var color = PALETTE[h % PALETTE.length];
    var cols = 5, rows = 5, cell = 100 / cols;
    var cellsSvg = '';
    for (var r = 0; r < rows; r++) {
      for (var c = 0; c <= cols / 2; c++) {
        var bit = (h >> ((r * 3 + c) % 30)) & 1;
        if (!bit) continue;
        var x = c * cell, mirroredX = (cols - 1 - c) * cell, y = r * cell;
        cellsSvg += '<rect x="' + x + '" y="' + y + '" width="' + cell + '" height="' + cell + '"/>';
        if (mirroredX !== x) {
          cellsSvg += '<rect x="' + mirroredX + '" y="' + y + '" width="' + cell + '" height="' + cell + '"/>';
        }
      }
    }
    container.innerHTML =
      '<svg viewBox="0 0 100 100" role="img" aria-label="Decorative pattern for ' + (container.dataset.label || seed) + '" preserveAspectRatio="xMidYMid slice">' +
      '<rect width="100" height="100" fill="var(--paper-dim)"/>' +
      '<g fill="' + color + '">' + cellsSvg + '</g>' +
      '</svg>';
  }

  function initArtBlocks() {
    document.querySelectorAll('.art-block[data-seed]').forEach(renderArtBlock);
  }

  /* ---------------- boot ---------------- */
  function boot() {
    initFilterBar();
    initAccordions();
    initBackToTop();
    initArtBlocks();
  }

  // Exposed so async data-render scripts (clubs-render.js,
  // events-render.js) can re-run the bits that depend on content
  // they just injected, without duplicating this logic.
  window.COSA = window.COSA || {};
  window.COSA.reinitAfterRender = function () {
    initFilterBar();
    initArtBlocks();
  };

  document.addEventListener('header:ready', initNavToggle);
  document.addEventListener('DOMContentLoaded', boot);
})();
