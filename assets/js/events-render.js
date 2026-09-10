/**
 * events-render.js
 * -------------------------------------------------------------
 * Renders events from /data/events.json wherever
 * [data-events-list] or [data-events-upcoming] exists.
 * Ordering is always strictly chronological, the one ordering
 * that is inherently neutral for a calendar.
 */
(function () {
  'use strict';

  var CATEGORY_LABELS = {
    cultural: 'Cultural', literary: 'Literary & Media', social: 'Social & Wellness',
    sports: 'Sports', technical: 'Technical'
  };

  function eventCardHTML(ev) {
    return (
      '<article class="index-card" data-category="' + ev.category + '">' +
        '<span class="cat cat-' + ev.category + '">' + (CATEGORY_LABELS[ev.category] || ev.category) + '</span>' +
        '<h3>' + ev.name + '</h3>' +
        '<p class="desc">' + ev.blurb + '</p>' +
        '<p class="meta"><span>' + ev.dateLabel + ' \u00b7 ' + ev.venue + '</span><span>' + ev.host + '</span></p>' +
      '</article>'
    );
  }

  function boot() {
    var listEl = document.querySelector('[data-events-list]');
    var upcomingEl = document.querySelector('[data-events-upcoming]');
    if (!listEl && !upcomingEl) return;

    fetch('data/events.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var sorted = data.events.slice().sort(function (a, b) { return a.date.localeCompare(b.date); });

        if (listEl) {
          listEl.innerHTML = sorted.map(eventCardHTML).join('');
          var bar = document.querySelector('[data-filter-bar]');
          if (bar) {
            var cats = Object.keys(CATEGORY_LABELS).sort();
            var buttons = '<button type="button" data-filter="all" aria-pressed="true">All events</button>';
            cats.forEach(function (id) {
              buttons += '<button type="button" data-filter="' + id + '" aria-pressed="false">' + CATEGORY_LABELS[id] + '</button>';
            });
            bar.innerHTML = buttons;
          }
        }
        if (upcomingEl) {
          upcomingEl.innerHTML = sorted.slice(0, 3).map(eventCardHTML).join('');
        }
        if (window.COSA && window.COSA.reinitAfterRender) window.COSA.reinitAfterRender();
      })
      .catch(function (err) { console.error('Could not load event data', err); });
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
