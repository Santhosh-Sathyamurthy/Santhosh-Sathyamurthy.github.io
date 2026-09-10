/**
 * clubs-render.js
 * -------------------------------------------------------------
 * Renders club cards from /data/clubs.json wherever a container
 * with [data-clubs-list] or [data-clubs-spotlight] exists.
 *
 * NO-FAVOURITISM RULES (see README.md for the full policy):
 *  1. Full directory (clubs.html): categories in the alphabetical
 *     order given in clubs.json, clubs alphabetical within each
 *     category. No "featured" flag exists in the data model.
 *  2. Homepage spotlight (index.html): shows every category
 *     exactly once (never a subset of categories), and rotates
 *     WHICH club represents a category using the day of the year
 *     as the seed, so no single club sits in the spotlight
 *     every day, but which one appears is fully deterministic
 *     and auditable (not random per page-load, so it doesn't
 *     look broken if you refresh).
 */
(function () {
  'use strict';

  function dayOfYear() {
    var now = new Date();
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = now - start;
    return Math.floor(diff / 86400000);
  }

  function categoryLabel(categories, id) {
    var found = categories.find(function (c) { return c.id === id; });
    return found ? found.label : id;
  }

  function clubCardHTML(club, categoryLabelText) {
    return (
      '<article class="index-card" data-category="' + club.category + '">' +
        '<div class="art-block" data-seed="' + club.id + '" data-label="' + club.name + '" style="height:110px"></div>' +
        '<span class="cat cat-' + club.category + '">' + categoryLabelText + '</span>' +
        '<h3>' + club.name + '</h3>' +
        '<p class="desc">' + club.tagline + '</p>' +
        '<p class="meta"><span>' + club.meets + '</span></p>' +
      '</article>'
    );
  }

  function renderFullDirectory(container, data) {
    var html = '';
    data.categories.forEach(function (cat) {
      var clubsInCat = data.clubs
        .filter(function (c) { return c.category === cat.id; })
        .sort(function (a, b) { return a.name.localeCompare(b.name); });
      clubsInCat.forEach(function (club) {
        html += clubCardHTML(club, cat.label);
      });
    });
    container.innerHTML = html;

    // Build the filter bar from the same category list, "All" first.
    var bar = document.querySelector('[data-filter-bar]');
    if (bar) {
      var buttons = '<button type="button" data-filter="all" aria-pressed="true">All clubs</button>';
      data.categories.forEach(function (cat) {
        buttons += '<button type="button" data-filter="' + cat.id + '" aria-pressed="false">' + cat.label + '</button>';
      });
      bar.innerHTML = buttons;
    }
  }

  function renderSpotlight(container, data) {
    var seed = dayOfYear();
    var html = '';
    data.categories.forEach(function (cat, catIndex) {
      var clubsInCat = data.clubs
        .filter(function (c) { return c.category === cat.id; })
        .sort(function (a, b) { return a.name.localeCompare(b.name); });
      if (!clubsInCat.length) return;
      var pick = clubsInCat[(seed + catIndex) % clubsInCat.length];
      html += clubCardHTML(pick, cat.label);
    });
    container.innerHTML = html;
  }

  function renderChipRow(container, data) {
    var colours = { cultural: '#F2A900', literary: '#5B4B8A', social: '#1758C9', sports: '#C7401F', technical: '#0E6B5C' };
    var html = '';
    data.categories.forEach(function (cat) {
      html +=
        '<a class="chip" href="clubs.html#' + cat.id + '">' +
          '<span class="dot" style="background:' + (colours[cat.id] || '#0E6B5C') + '" aria-hidden="true"></span>' +
          '<h4>' + cat.label + '</h4><p>' + cat.blurb + '</p>' +
        '</a>';
    });
    container.innerHTML = html;
  }

  function boot() {
    var directoryEl = document.querySelector('[data-clubs-list]');
    var spotlightEl = document.querySelector('[data-clubs-spotlight]');
    var chipRowEl = document.querySelector('[data-clubs-chiprow]');
    if (!directoryEl && !spotlightEl && !chipRowEl) return;

    fetch('data/clubs.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (directoryEl) renderFullDirectory(directoryEl, data);
        if (spotlightEl) renderSpotlight(spotlightEl, data);
        if (chipRowEl) renderChipRow(chipRowEl, data);
        document.dispatchEvent(new CustomEvent('clubs:rendered'));
        // Filter bar + art blocks are wired generically in main.js,
        // but that script may have already run its DOMContentLoaded
        // pass before this async render finished, re-invoke the
        // relevant bits here.
        if (window.COSA && window.COSA.reinitAfterRender) window.COSA.reinitAfterRender();
      })
      .catch(function (err) { console.error('Could not load club data', err); });
  }

  document.addEventListener('DOMContentLoaded', boot);
})();
