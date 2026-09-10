/**
 * accessibility-toolbar.js
 * -------------------------------------------------------------
 * Drives the three controls in the utility bar:
 *   [data-action="text-smaller|text-default|text-larger"]
 *   [data-action="toggle-theme"]
 *   [data-action="toggle-motion"]
 * All state is persisted to localStorage so a choice made on one
 * page holds across the whole site (UX4G "consistency across
 * pages" + WCAG 1.4.4 resize-text requirement).
 */
(function () {
  'use strict';

  var STORAGE_KEYS = {
    textScale: 'cosa:text-scale',
    theme: 'cosa:theme',
    motion: 'cosa:reduce-motion'
  };

  function applyStoredPreferences() {
    var root = document.documentElement;
    var scale = localStorage.getItem(STORAGE_KEYS.textScale);
    if (scale) root.setAttribute('data-text-scale', scale);

    var theme = localStorage.getItem(STORAGE_KEYS.theme);
    if (theme) root.setAttribute('data-theme', theme);

    var motion = localStorage.getItem(STORAGE_KEYS.motion);
    if (motion === 'reduce') root.classList.add('force-reduce-motion');
  }

  // Apply before header renders, so there's no visible flash of
  // the default theme/size on load.
  applyStoredPreferences();

  function syncPressedStates(bar) {
    var scale = localStorage.getItem(STORAGE_KEYS.textScale) || 'base';
    bar.querySelectorAll('[data-action^="text-"]').forEach(function (btn) {
      var matches = btn.dataset.action === 'text-' + (scale === 'base' ? 'default' : scale);
      btn.setAttribute('aria-pressed', String(matches));
    });
    var theme = localStorage.getItem(STORAGE_KEYS.theme) || 'light';
    var themeBtn = bar.querySelector('[data-action="toggle-theme"]');
    if (themeBtn) {
      themeBtn.setAttribute('aria-pressed', String(theme === 'dark'));
      themeBtn.textContent = theme === 'dark' ? 'Light mode' : 'Dark mode';
    }
  }

  function initToolbar() {
    var bar = document.querySelector('[data-a11y-toolbar]');
    if (!bar) return;

    bar.addEventListener('click', function (evt) {
      var btn = evt.target.closest('[data-action]');
      if (!btn) return;
      var root = document.documentElement;

      switch (btn.dataset.action) {
        case 'text-smaller':
          root.removeAttribute('data-text-scale');
          localStorage.setItem(STORAGE_KEYS.textScale, 'base');
          break;
        case 'text-default':
          root.setAttribute('data-text-scale', 'lg');
          localStorage.setItem(STORAGE_KEYS.textScale, 'lg');
          break;
        case 'text-larger':
          root.setAttribute('data-text-scale', 'xl');
          localStorage.setItem(STORAGE_KEYS.textScale, 'xl');
          break;
        case 'toggle-theme': {
          var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
          if (next === 'light') root.removeAttribute('data-theme'); else root.setAttribute('data-theme', 'dark');
          localStorage.setItem(STORAGE_KEYS.theme, next);
          break;
        }
        default:
          return;
      }
      syncPressedStates(bar);
    });

    syncPressedStates(bar);
  }

  document.addEventListener('header:ready', initToolbar);
})();
