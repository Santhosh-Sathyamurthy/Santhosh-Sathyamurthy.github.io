/**
 * theme-lab.js
 * -------------------------------------------------------------
 * Wires up the button controls on theme-lab.html to the
 * .theme-preview sandbox via data-deck / data-font / data-theme
 * attributes (see assets/css/theme-decks.css for what each
 * combination actually looks like). This never touches :root,
 * so it cannot affect the real site chrome around it, only the
 * bordered preview frame on this one page.
 */
(function () {
  'use strict';

  function initThemeLab() {
    var preview = document.querySelector('.theme-preview');
    if (!preview) return;

    function wireGroup(selector, attr, onChange) {
      var group = document.querySelector(selector);
      if (!group) return;
      group.addEventListener('click', function (evt) {
        var btn = evt.target.closest('button[data-value]');
        if (!btn) return;
        group.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', 'false'); });
        btn.setAttribute('aria-pressed', 'true');
        preview.setAttribute(attr, btn.dataset.value);
        if (onChange) onChange(btn.dataset.value);
      });
    }

    var deckNames = {
      notebook: 'Notebook, the palette currently live on the site',
      indigo: 'Indigo Campus, cooler with a coral accent',
      terracotta: 'Terracotta Campus, warm and earthy',
      monsoon: 'Monsoon Slate, muted and formal'
    };
    var announceEl = document.querySelector('[data-theme-lab-status]');

    wireGroup('[data-deck-group]', 'data-deck', function (val) {
      if (announceEl) announceEl.textContent = 'Showing the ' + (deckNames[val] || val) + ' colour deck.';
    });
    wireGroup('[data-font-group]', 'data-font', function (val) {
      if (announceEl) announceEl.textContent = 'Preview font pairing changed.';
    });
    wireGroup('[data-mode-group]', 'data-theme', function (val) {
      if (announceEl) announceEl.textContent = 'Preview switched to ' + val + ' mode.';
    });
  }

  document.addEventListener('DOMContentLoaded', initThemeLab);
})();
