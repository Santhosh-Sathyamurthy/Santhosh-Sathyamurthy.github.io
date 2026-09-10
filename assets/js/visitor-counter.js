/**
 * visitor-counter.js
 * -------------------------------------------------------------
 * IMPORTANT, read before deploying:
 * A number on a government page ("Visitors: N") is a factual
 * claim, so it must come from somewhere real. This file ships a
 * local, honestly-labelled placeholder: it counts page loads in
 * THIS browser only (via localStorage) and is marked "(local
 * demo count)" in the footer so nobody mistakes it for a true
 * site-wide tally.
 *
 * Before this goes live on the institute's server, replace the
 * body of getCount()/incrementCount() with a call to a real
 * counter, e.g.:
 *   - a tiny backend endpoint that increments a row in a database
 *     and returns the total (a few lines in any stack the
 *     institute already runs), or
 *   - a server log-based counter already used elsewhere on
 *     iisertirupati.ac.in, or
 *   - a privacy-respecting analytics platform's public counter API.
 * Whichever is chosen, keep the aria-live announcement and the
 * "last updated" timestamp below, that part is standards-driven
 * (GIGW transparency + accessible live-region updates), not
 * specific to this placeholder implementation.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'cosa:local-demo-visit-count';
  var SESSION_KEY = 'cosa:counted-this-session';

  function getCount() {
    return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
  }

  function incrementCount() {
    // Only counts once per browser session/tab, so refreshing the
    // same page repeatedly does not inflate the number.
    if (sessionStorage.getItem(SESSION_KEY)) return getCount();
    var next = getCount() + 1;
    localStorage.setItem(STORAGE_KEY, String(next));
    sessionStorage.setItem(SESSION_KEY, '1');
    return next;
  }

  function render() {
    var el = document.querySelector('[data-visitor-count]');
    if (!el) return;
    var count = incrementCount();
    el.textContent = count.toLocaleString('en-IN');
    var dateEl = document.querySelector('[data-last-updated]');
    if (dateEl && !dateEl.textContent.trim()) {
      dateEl.textContent = new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' });
    }
  }

  document.addEventListener('footer:ready', render);
})();
