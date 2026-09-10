# Compliance audit: UX4G, GIGW 3.0, WCAG 2.1 AA

This document records what this build was checked against and where it stands, so a future maintainer (or an actual government audit) has a starting point rather than having to reconstruct the reasoning from scratch. It is a self-audit done during development, not a substitute for a formal STQC or third-party accessibility audit, which is still recommended before this goes live on the institute domain.

## 1. UX4G Handbook

The UX4G (User Experience for Government) Handbook, published by the Ministry of Electronics and Information Technology, sets usability and design expectations for Indian government digital products. Points addressed in this build:

| Area | What was done |
|---|---|
| Consistency | One shared header/footer (`partials/`) and one design-token file (`tokens.css`) so every page looks and behaves the same way. |
| Clarity of navigation | A flat, six-item primary nav; breadcrumbs on every inner page; a full HTML sitemap. |
| Feedback and status | Form validation messages, filter result counts, and an `aria-live` region confirming what happened after a form submit. |
| Readability | Body text capped at a comfortable measure (68 characters), a type scale with clear size steps, and a font pairing chosen for screen legibility (Inter for body text). |
| Mobile-first / responsive | Every layout uses fluid grids and flexbox with breakpoints down to small phones; the nav collapses to a toggled menu under 880px. |
| Minimal cognitive load | Category filters instead of nested menus; one clear primary action per page (browse clubs, see events, get in touch). |
| Avoiding dark patterns | No autoplaying media, no forced newsletter modals, no manufactured urgency; the visitor counter is honestly labelled as a local, non-authoritative figure rather than presented as an official statistic. |
| Testing before launch | Documented in `README.md` and this file as an open item: a manual usability pass with real students, and a formal accessibility audit, are recommended before production deployment. |

## 2. GIGW 3.0 (Guidelines for Indian Government Websites and Apps)

GIGW 3.0 compliance points and how each is addressed:

**Mandatory content and disclosures**
- Content ownership statement in the footer of every page.
- "Last updated" date shown in the footer (currently populated client-side from the page load date; recommend switching to a server-side last-modified date at deployment).
- Screen Reader Access link in the utility bar.
- Sitemap page, linked from the footer of every page.
- Accessibility Statement, linked from the utility bar and the footer.
- Terms of Use, Privacy Policy, Hyperlinking Policy and Copyright Policy, all linked from the footer of every page. These are drafted to match GIGW conventions and flagged throughout as pending final review by the institute administration.
- Visitor count shown in the footer, clearly labelled as a local demo count rather than a verified statistic (see "Known placeholders" in `README.md`).
- Design and development credit for PaCODEah, with project lead named, on every page footer and on the Copyright Policy page.

**Security-adjacent practices**
- No inline event handlers or `eval()`-style code anywhere in the JavaScript.
- Forms use native HTML5 validation plus `checkValidity()` before any submit handling runs.
- No third-party analytics, tracking pixels or embedded third-party widgets anywhere in the site; external services (Google Maps, social media) are linked out to explicitly rather than embedded, specifically to avoid loading trackers without visitor awareness (see `hyperlinking-policy.html`).
- All outbound links to external domains use `rel="noopener noreferrer"`.
- No secrets, API keys or credentials anywhere in the client-side code (there is currently no backend to hold any).
- Recommendation for deployment: serve over HTTPS with HSTS, add a Content-Security-Policy header restricting script/style sources, and run the contact form through server-side sanitisation once a backend is wired up.

**National identity elements**
- A masthead row shows "Ministry of Education, Government of India" and the institute's full name, matching the pattern used on the main IISER Tirupati site, so this sub-site reads as clearly affiliated with the institute.
- The actual Government of India / institute emblem is not reproduced in this build. A labelled placeholder (`assets/img/institute-emblem-placeholder.svg`) stands in for it, since the real emblem asset should come from the institute's communications office rather than be recreated here. This is flagged in `README.md` as a pre-launch item.

**Content quality**
- No stock photography of unclear licensing anywhere in the build; all imagery is either an original SVG mark or generated placeholder pattern art, both created for this project.
- Language is plain and direct throughout; no unexplained jargon or acronyms without a first-use expansion (for example, "GIGW 3.0 (Guidelines for Indian Government Websites and Apps)" here).

## 3. WCAG 2.1 Level AA

| Success criterion (selected, most relevant to this build) | Status |
|---|---|
| 1.1.1 Non-text content | All meaningful images have `alt` text; the generated placeholder art is marked decorative to assistive technology except where it's the primary content (gallery), where it carries a descriptive label. |
| 1.3.1 Info and relationships | Semantic landmarks (`header`, `nav`, `main`, `footer`), real heading hierarchy, `fieldset`/`legend` grouping on forms. |
| 1.4.3 Contrast (minimum) | Every text/background colour pairing used in the design system was checked programmatically; results are in the table below. All pass 4.5:1 for normal text and 3:1 for large text. |
| 1.4.4 Resize text | The utility bar's A / A+ / A++ controls scale the whole page via `rem` units; nothing is set in fixed pixels for type. |
| 1.4.10 Reflow | Layouts are fluid down to 320px width without horizontal scrolling; verified in `utilities.css`. |
| 1.4.13 Content on hover or focus | No content appears only on hover; all interactive affordances are also keyboard-reachable. |
| 2.1.1 Keyboard | Every interactive element (nav, filters, accordion, forms, buttons) is reachable and operable by keyboard alone. |
| 2.4.1 Bypass blocks | A "Skip to main content" link is the first focusable element on every page. |
| 2.4.3 Focus order | Focus order follows the visual and DOM order on every page; no `tabindex` values greater than 0 are used anywhere. |
| 2.4.7 Focus visible | A high-contrast custom focus outline is applied globally and never suppressed. |
| 2.5.3 Label in name | Visible button and link text matches or is contained within the accessible name in every case. |
| 3.2.4 Consistent identification | The same icon, colour and label are used for the same purpose across every page (for example, category colour coding). |
| 3.3.1 / 3.3.2 Error identification and labels | Every form field has a visible, programmatically associated label; required fields are marked both visually and with `aria-required`. |
| 4.1.2 Name, role, value | Custom controls (accordion, filter buttons, nav toggle) use correct ARIA states (`aria-expanded`, `aria-pressed`, `aria-current`) that update with their visual state. |

### Contrast ratios actually measured

Calculated with the standard WCAG relative luminance formula against the exact hex values in `tokens.css`:

| Pairing | Ratio | Passes |
|---|---|---|
| Ink text on paper background | 16.1:1 | Yes (AA and AAA) |
| Ink text on white cards | 17.7:1 | Yes (AA and AAA) |
| Teal links on paper | 5.8:1 | Yes (AA) |
| Flame accent on paper | 4.6:1 | Yes (AA, narrowly; avoid using it for small body text, it's used for tags and accents) |
| Violet accent on paper | 6.8:1 | Yes (AA) |
| Ink on signal-yellow accent | 8.8:1 | Yes (AA and AAA) |
| Signal-yellow footer accent on ink background | 8.8:1 | Yes (AA and AAA) |
| Focus ring blue on paper | 5.8:1 | Yes (AA) |
| Dark-mode text on dark background | 15.9:1 | Yes (AA and AAA) |

### Known gaps against WCAG, disclosed rather than hidden

- No formal manual screen-reader testing (NVDA, JAWS, VoiceOver) has been done yet.
- No testing with real users who rely on assistive technology.
- Navigation and footer currently depend on JavaScript (see `README.md`); a no-JavaScript visitor will not see them at all, which is itself an accessibility gap until the server-side include change is made.

## 4. This site's specific "no favouritism" requirement

Not a standard from any of the three frameworks above, but a specific requirement for this project, so it's audited here too:

- Verified: category order in `data/clubs.json` is alphabetical (Cultural, Literary & Media, Social & Wellness, Sports, Technical).
- Verified: club order within each category in `data/clubs.json` is alphabetical.
- Verified: event order in `data/events.json` is chronological.
- Verified: no "featured" or "priority" field exists anywhere in either data file.
- Verified: the homepage spotlight (`assets/js/clubs-render.js`, `renderSpotlight`) always shows exactly one club per category, using a deterministic day-of-year rotation rather than a fixed or randomly-reshuffled pick.
- Verified: every club and event uses the same generated placeholder art mechanism (`assets/js/main.js`, `renderArtBlock`); no club has a real photo while others do not.

## 5. Visual design pass (this revision)

A second pass focused specifically on the site feeling modern and giving the Council real colour and font choices, rather than one fixed look with no alternatives.

- **Cards now read as physical, raised objects.** `index-card`, `chip`, `notice` and `gallery-item` moved from a flat background plus a heavy solid border to a layered elevation model: a soft two-layer shadow (`--shadow-card`), a larger corner radius, a hairline border for definition rather than the visual weight, and a hover state that lifts the card and deepens its shadow. Buttons keep their bolder "pop" shadow style (`--shadow-pop`) since that's a deliberate, different affordance (an action, not a content container).
- **Dark mode has its own shadow values**, not just inverted colours: `--shadow-card` and `--shadow-card-hover` are redefined under `:root[data-theme="dark"]` in `tokens.css` with darker, higher-opacity shadows, since a light shadow is invisible against a dark background.
- **Forced-colours / high-contrast mode is still handled explicitly.** Since box-shadow disappears under a forced colour palette, `@media (forced-colors: active)` in `components.css` restores a real 2px border on cards so they don't lose their boundary for users in that mode.
- **A theme lab page (`theme-lab.html`)** lets the Council try four full colour decks (Notebook, Indigo Campus, Terracotta Campus, Monsoon Slate) and three font pairings (Modern Technical, Editorial Warm, Clean Geometric), each with working light and dark modes, live in one preview panel with button controls. This is a sandbox: switching options there only affects the bordered preview box on that one page, never the real header, footer or any other page, so it's safe to leave live for as long as the Council is deciding.
- **Every deck was contrast-checked before being included**, the same way the live "Notebook" palette was in the previous audit. The table below covers the three new decks; see section 3 above for Notebook's numbers, which are unchanged.

### Contrast ratios for the three new theme-lab decks

| Deck | Pairing | Ratio | Passes AA |
|---|---|---|---|
| Indigo Campus (light) | Ink on paper | 14.1:1 | Yes |
| Indigo Campus (light) | Signal-ink on signal (coral) | 6.0:1 | Yes |
| Indigo Campus (light) | Teal on paper | 5.2:1 | Yes |
| Indigo Campus (light) | Flame on paper | 4.5:1 | Yes |
| Indigo Campus (dark) | Ink on paper | 15.0:1 | Yes |
| Terracotta Campus (light) | Ink on paper | 14.5:1 | Yes |
| Terracotta Campus (light) | Signal-ink (white) on signal | 4.5:1 | Yes |
| Terracotta Campus (light) | Teal (deepened from the first draft) on paper | 5.1:1 | Yes |
| Terracotta Campus (dark) | Ink on paper | 15.0:1 | Yes |
| Monsoon Slate (light) | Ink on paper | 13.8:1 | Yes |
| Monsoon Slate (light) | Violet (deepened from the first draft) on paper | 5.2:1 | Yes |
| Monsoon Slate (light) | Signal-ink (white) on signal (cyan-teal) | 5.0:1 | Yes |
| Monsoon Slate (dark) | Ink on paper | 15.4:1 | Yes |

Two colours in the first draft of these decks (Terracotta's teal and Monsoon's violet) measured just under the 4.5:1 line and were darkened slightly before being finalised here; the values above are the corrected ones actually shipped in `theme-decks.css`.

## 6. Suggested next steps before production launch

1. Formal accessibility audit (STQC-empanelled auditor or equivalent), including manual screen-reader and keyboard-only testing.
2. Replace the institute emblem placeholder with the official asset from the institute's communications office.
3. Move header/footer inclusion from client-side `fetch()` to a server-side include, so the site works fully with JavaScript disabled.
4. Have the institute administration review and finalise the four legal/policy pages.
5. Replace placeholder club, event and gallery data with real submissions.
6. Wire the contact form and visitor counter to real backends.
7. Add HTTPS, HSTS and a Content-Security-Policy header at the server level.
8. Once the Council picks a deck and font pairing on `theme-lab.html`, move those values into `tokens.css` as the site's real defaults, and either delete `theme-lab.html` and `style-guide.html` or leave them unlinked as build tools.

