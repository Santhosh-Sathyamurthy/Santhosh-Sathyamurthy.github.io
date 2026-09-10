/**
 * include-partials.js
 * -------------------------------------------------------------
 * Loads /partials/header.html and /partials/footer.html into the
 * placeholder elements every page provides. This is the whole
 * reason the header and footer only need to be edited in ONE
 * place (see /partials/) instead of in all thirteen pages.
 *
 * Requires the page to be served over http(s), fetch() cannot
 * read local files under file://. For local previewing, run a
 * static server from the project root, e.g.:
 *   python3 -m http.server 8080
 * Any real deployment (the institute's web server, GitHub Pages,
 * etc.) serves over http(s) already, so this is production-safe.
 *
 * Each page sets `window.PAGE_ID` before this script runs, e.g.
 *   <script>window.PAGE_ID = 'clubs';</script>
 * so the injected header can mark the correct nav link with
 * aria-current="page" once it lands in the DOM.
 */
(function () {
  'use strict';

  function markCurrentNavLink() {
    var id = window.PAGE_ID;
    if (!id) return;
    var link = document.querySelector('.nav-links a[data-page="' + id + '"]');
    if (link) link.setAttribute('aria-current', 'page');
  }

  function loadPartial(targetSelector, url, afterLoad) {
    var target = document.querySelector(targetSelector);
    if (!target) return;
    fetch(url)
      .then(function (res) {
        if (!res.ok) throw new Error('Failed to load ' + url + ' (' + res.status + ')');
        return res.text();
      })
      .then(function (html) {
        target.innerHTML = html;
        if (typeof afterLoad === 'function') afterLoad(target);
        target.dispatchEvent(new CustomEvent('partial:loaded', { bubbles: true }));
      })
      .catch(function (err) {
        // Fail loud in the console but never blank the page, // the surrounding page-level nav fallback (a plain <noscript>
        // block) remains visible if this errors out.
        console.error(err);
      });
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadPartial('[data-partial="header"]', 'partials/header.html', function () {
      markCurrentNavLink();
      document.dispatchEvent(new CustomEvent('header:ready'));
    });
    loadPartial('[data-partial="footer"]', 'partials/footer.html', function () {
      document.dispatchEvent(new CustomEvent('footer:ready'));
    });
  });
})();
