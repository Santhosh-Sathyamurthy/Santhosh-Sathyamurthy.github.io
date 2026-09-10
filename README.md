# Council of Student Activities, IISER Tirupati

Built by **PaCODEah**, the Tech Club of IISER Tirupati. Project lead: Santhosh S, BSMS-2023.

This is the redesigned site for the Council of Student Activities: clubs, events, council governance, gallery and contact, built as plain HTML, CSS and JavaScript with no build step and no framework. It's meant to slot into the institute's web server as-is, or with light server-side changes noted below.

## Running it locally

Because the header and footer are loaded with `fetch()`, this site needs to be served over HTTP, not opened directly as a `file://` path (browsers block `fetch()` on local files). From the project root:

```
python3 -m http.server 8080
```

Then open `http://localhost:8080/` in a browser. Any other static server works the same way (`npx serve`, VS Code's Live Server extension, and so on).

## How the site is put together

```
index.html, clubs.html, events.html, council.html,
gallery.html, contact.html                    - the 6 main pages
accessibility-statement.html, sitemap.html,
terms-of-use.html, privacy-policy.html,
hyperlinking-policy.html, copyright-policy.html - policy/compliance pages
404.html                                        - error page
style-guide.html                                - internal design reference, not linked in nav
theme-lab.html                                  - internal sandbox for trying colour decks/fonts, not linked in nav

partials/header.html                            - the single copy of the header, nav and utility bar
partials/footer.html                            - the single copy of the footer

assets/css/tokens.css                           - every colour, font and spacing value, in one place
assets/css/base.css                             - resets and accessibility fundamentals
assets/css/layout.css                           - header, footer, nav, section scaffolding
assets/css/components.css                       - cards, buttons, forms, filters, and so on
assets/css/utilities.css                        - print styles and small helpers
assets/css/placeholder-swatches.css             - scratch styling for the style guide only
assets/css/theme-decks.css                      - the four candidate colour decks used by theme-lab.html

assets/js/include-partials.js                   - loads header.html/footer.html into every page
assets/js/main.js                                - nav toggle, filters, accordion, back-to-top, generated art
assets/js/accessibility-toolbar.js              - text size, dark mode, saved to localStorage
assets/js/visitor-counter.js                    - the local demo visitor count (read the file header before wiring a real one)
assets/js/clubs-render.js                       - reads data/clubs.json and renders the directory + homepage spotlight
assets/js/events-render.js                      - reads data/events.json and renders the calendar + upcoming list
assets/js/theme-lab.js                          - button controls for theme-lab.html's preview sandbox

data/clubs.json                                 - every club: edit this file to add, remove or update a club
data/events.json                                - every event: edit this file to add, remove or update an event

assets/img/                                     - the site's own SVG mark, the institute-emblem placeholder, favicon
```

## The two-file rule for content

Almost everything a future maintainer will need to change day to day lives in `data/clubs.json` and `data/events.json`. Add a club by adding one object to the `clubs` array; add an event by adding one object to the `events` array. The pages read these files at load time, so there is nothing else to edit or rebuild.

Both files include an `_readme` field at the top explaining the ordering rules for that file. Please read those before changing how items are sorted.

## No-favouritism policy (read this before changing ordering logic)

This was one of the project's explicit requirements: no club, and no category of club, should look favoured over another anywhere on the site. That's implemented as actual logic, not just a promise:

- Councils/categories are always listed alphabetically.
- Clubs are always listed alphabetically within their category.
- Events are always listed strictly by date.
- The homepage "spotlight" shows one club from every category, never a subset, and rotates which club appears using the day of the year as a seed. It's deterministic (won't flicker between refreshes) but changes day to day.
- Every club and event gets the same kind of generated placeholder art until real photography exists for all of them at once. No club gets a real photo while others get a flat box.
- Full details and the reasoning are on `council.html#neutrality`.

If you're asked to "feature" a club, a sponsor, or a specific event more prominently than others, please raise it with the Council as a policy question rather than quietly hardcoding an exception. See `council.html#neutrality` for who to raise it with.

## Design system

The colour palette, type scale and spacing live entirely in `assets/css/tokens.css`. Nothing else in the CSS should hardcode a colour or a font, everything references a CSS custom property so the whole site re-themes from one file. `style-guide.html` (not linked from the main nav on purpose) shows every token and component in one place, useful when handing this project to someone new.

The visual style deliberately avoids the generic "AI website" look: no cream-and-terracotta palette used by default, no stock photography, no scattered hover animations. It borrows instead from library index cards and campus noticeboards, which fits a site about student clubs. Cards use a soft layered shadow and a lift-on-hover effect rather than a thick border, so they read as physical raised objects rather than boxes.

## Trying other colour decks and fonts

Open `theme-lab.html` to compare four full colour decks (Notebook, the one currently live; Indigo Campus; Terracotta Campus; Monsoon Slate) and three font pairings, each with a working light and dark mode, in a live preview panel with button controls. Every combination there already clears WCAG AA contrast (see `COMPLIANCE-AUDIT.md`), so whichever one gets picked is safe to ship as-is. Switching options on that page never touches the real site, only the bordered preview box on that one page.

Once the Council settles on a deck and font pairing, move the matching values from `assets/css/theme-decks.css` into `assets/css/tokens.css` so they become the site's actual defaults, then `theme-lab.html` and `style-guide.html` can either be deleted or just left unlinked as build tools.

## Known placeholders that need real content before launch

- **Institute emblem.** `assets/img/institute-emblem-placeholder.svg` is a plain stand-in. Swap it for the official IISER Tirupati / Ministry of Education emblem asset, which the institute communications office should provide, since the real emblem is protected and shouldn't be recreated from scratch.
- **Club and event data.** `data/clubs.json` and `data/events.json` contain example entries marked as placeholder data. Replace them with real submissions from each club.
- **Gallery photography.** `gallery.html` currently uses generated pattern art. Swap the `<div class="art-block">` markup for real `<img>` tags once photos exist for all the clubs shown together, not one at a time.
- **Council office-bearer names.** `council.html` intentionally leaves names out pending the current election cycle, rather than inventing placeholder names.
- **Contact form backend.** The form on `contact.html` currently just shows a message pointing to the Council's email address. Wire it to a real mailbox, form service, or institute-hosted endpoint before launch.
- **Visitor counter.** `assets/js/visitor-counter.js` counts visits in the visitor's own browser only, and says so in the footer. Read the comment at the top of that file for how to swap in a real, server-side count.
- **Navigation without JavaScript.** The header and footer are currently loaded by `assets/js/include-partials.js`, so they won't appear if a visitor has JavaScript disabled. Before production deployment, consider moving this to whatever server-side include mechanism the institute's web server already supports (PHP includes, SSI, a static-site generator, and so on), keeping the same "one file to edit" benefit without the JavaScript dependency. This is also written up in `accessibility-statement.html`.
- **Legal pages.** `terms-of-use.html`, `privacy-policy.html`, `hyperlinking-policy.html` and `copyright-policy.html` are starting drafts written to match GIGW conventions. The institute administration should review and finalise the actual wording; the design/development credit on the copyright page is the one part meant to stay as written.
- **Accessibility audit.** The build targets WCAG 2.1 AA throughout, but has not yet had a formal screen-reader pass or a third-party STQC audit. Recommended before this goes live on the institute domain; see `accessibility-statement.html`.

## Credit

Please keep the footer credit line ("Designed and developed by PaCODEah, The Tech Club of IISER Tirupati. Project lead: Santhosh S, BSMS-2023.") intact if this codebase is reused, forked or handed to a different maintainer.
