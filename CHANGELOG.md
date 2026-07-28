# Changelog

## 2026-07-28 — Cookie banner over the stats band, search placeholder localization

### Cookie banner no longer covers the stats labels

The `--cookie-banner-h` reserve added in the previous entry works, but it only guarantees
that the *end of the document* is reachable — a fixed bottom bar still covers whatever
happens to sit at the fold. At 1280 × 800 that was the blue `.stats-band`: the numbers
(`15+`, `16`, `9`) stayed visible while the labels beneath them were behind the bar.

- The desktop banner now uses the same one-paragraph compaction that was already applied
  under 560 px: `.cookie-copy` lays its title, text and privacy link out as inline flow
  instead of a wrapping flex row, and `.cookie-consent` no longer wraps. The full text is
  unchanged.
- Measured at 1280 px, the banner height went from **120 px to 58 px (RU)** and
  **72 px to 49 px (DE/EN)**, which clears the stats labels in all three languages.
- The `@media (max-width: 560px)` block keeps only what still differs at mobile widths
  (wrapping, tighter type, full-width buttons); the rules it used to duplicate now live in
  the base declaration. Mobile heights are unchanged — 131 px (RU), 112 px (DE/EN) at
  375 × 667 — so the hero CTA guarantee from the previous entry still holds.

Note: at 1024 × 768 and 768 × 1024 the stats band happens to straddle the viewport fold
(part of it is below the bottom edge with or without the banner), so its last rows are
still behind the bar until you scroll. That is inherent to a fixed consent bar rather than
a layout defect: `body.has-cookie-banner` still reserves the exact banner height, so
nothing is permanently unreachable.

### Search placeholder localization

- `R()` overwrote the pre-rendered placeholders with different, longer strings
  (`"Suche auf der Website..."`, `"Search the website..."`) and fell back to German via
  `sp[lang]||sp.de` whenever `lang` could not be resolved — which is how a German
  `Suche` could end up on a non-German page. The table now holds the same short strings
  the HTML ships (`Suche...` / `Поиск...` / `Search...`), the German fallback is gone, and
  `aria-label` is kept in sync with the placeholder.
- `getSavedLang()` now consults `<html lang>` after the path and `?lang=`, but before
  `localStorage`. The pages are pre-rendered per language, so a stored choice from an
  earlier visit must not make the JS-translated fragments contradict the static markup
  around them.

### Verified in a browser

Headless Chromium, RU/DE/EN at 1440 × 900, 1280 × 800, 1280 × 720 and 375 × 667: no stat
number or label intersects the banner on load, `--cookie-banner-h` matches the measured
height exactly, the banner text is not clipped, the document end clears the bar, the band
is fully clear once scrolled into view, placeholder and `aria-label` are correct per
language, and no page errors are raised. Reject/accept/reopen and resize between 1280 px
and 375 px were re-checked: the height republishes on resize and the custom property and
body padding are cleared once a choice is made.

## 2026-07-28 — Privacy, contact reliability, Russian grammar, mobile layout

Applied across all three language trees (`de/`, `ru/`, `en/`).

### Privacy

- **Removed the GEDmatch kit number from the source entirely.** `script.js` no longer
  contains `GEDMATCH_KIT` (previously assembled from `["MZ","563","0855"].join("")`),
  and the `revealGedmatch()` function was deleted.
- The GEDmatch card on the contact pages is now a direct link to
  `https://t.me/eugen30` instead of a reveal button. Labels:
  - DE — „GEDmatch-Kit über Telegram anfragen“
  - RU — «Запросить GEDmatch-kit в Telegram»
  - EN — “Request GEDmatch kit via Telegram”
- Telegram is now the primary contact route on all contact pages. The email address is
  still assembled in JS (`contactEmailAddress()`), but only as a documented fallback for
  the `mailto:` path and the copy-to-clipboard panel; it is not present in the HTML.

### Contact form reliability

- `submitContactForm()` no longer relies on `mailto:` alone. It now also reveals a
  fallback panel containing the email address plus two buttons:
  *Copy email address* and *Copy message text*.
- Clipboard writes use `navigator.clipboard.writeText()` with a
  `document.execCommand("copy")` textarea fallback, and report success or failure via a
  live region (`#contact-copy-status`).
- A Telegram button sits next to the submit button in a new `.contact-form-actions` row.
- New `CONTACT_FORM_TEXT` keys for DE/RU/EN: `contact-telegram`,
  `contact-fallback-note`, `contact-copy-email`, `contact-copy-message`,
  `contact-copy-ok`, `contact-copy-fail`. All new element ids match these keys, so
  `translateContactForm()` localizes them on language switch.

### Russian grammar in the stat counters

- Added `pluralForm(value, forms)` — Slavic plural selection from a pipe-separated
  `1|2-4|5+` list (e.g. `год|года|лет`): values ending in 1 (but not 11) take the first
  form, 2–4 (but not 12–14) the second, everything else the third.
- Added `applyStatValue(el, value)`, used by both the animated counter and the
  reduced-motion branch, so the label agrees with the number **during** the count-up as
  well as at the final value. `countYears()` now goes through it too.
- Russian stat labels in `ru/index.html` carry the forms in a `data-plural` attribute.
  The German and English labels are unchanged — they need no agreement.
  - Note: the task described the year word as living in `data-suffix`. In the current
    markup every `data-suffix` is `""` or `"+"`, and the word is a sibling
    `<span class="stat-label">`. The pipe-separated mechanism was implemented as
    requested, but read from `data-plural` on that label, so the visual layout is
    unchanged.
  - The `15+ документов из архивов` stat was intentionally left without forms: the `+`
    suffix keeps the genitive plural correct for every value.

### Mobile layout (375 px / iPhone SE)

- **Cookie banner no longer covers the main CTA.** Under 560 px the title, text and
  privacy link now run as one wrapping paragraph instead of three stacked rows, and the
  type, padding and button size are tightened. Measured at 375 × 667 px, the banner went
  from 160 px to 112 px (DE/EN) and 131 px (RU), which clears the hero call-to-action in
  all three languages — no banner text was shortened or removed.
- `script.js` measures the banner and publishes its height as `--cookie-banner-h`;
  `body.has-cookie-banner` pads by that exact value instead of a guessed constant, so
  nothing at the end of the page is unreachable. The height is re-measured on text
  updates, when the settings panel opens, and on resize; the property is cleared when
  the banner closes.
- The banner respects `env(safe-area-inset-bottom)` and is capped at `45vh` with
  internal scrolling, for short landscape viewports.
- The floating Google-cookie toggle is hidden while the banner is open — the banner
  already offers both choices, and the toggle otherwise sat on top of the CTA. It
  reappears once a choice is made.
- **Card sliders no longer clip their content.** `overflow-x: auto` forces a computed
  `overflow-y: auto`, which cut off the cards' hover lift, reveal transform and box
  shadow. `.journey` and the mobile `.timeline-row` now carry vertical padding, plus
  `overscroll-behavior-x: contain` and `scroll-padding-inline` so the first and last
  cards are fully reachable.

### Historical accuracy

- Modern country flags used as shorthand for historical periods are gone. Each journey
  stage now spells out the state that actually existed at the time
  (`.journey-flag` → `.journey-era`):
  - DE — Preußen · Russ. Reich → UdSSR · UdSSR · UdSSR · UdSSR → Russland · Deutschland
  - RU — Пруссия · Рос. империя → СССР · СССР · СССР · СССР → Россия · Германия
  - EN — Prussia · Russian Empire → USSR · USSR · USSR · USSR → Russia · Germany
- Flag emoji were also removed from the `.upd-date[data-country]::after` labels, leaving
  the localized place names.

### Progressive enhancement

- Added a `<noscript>` block to all three `index.html` files, right after
  `<main>`, using the existing `.card` class (no new CSS). It explains which features
  need JavaScript, notes that the family history, tree and documents are readable
  without it, and links to `Telegram @eugen30`.
- Added `<link rel="preload" as="font" type="font/woff2" crossorigin>` hints for the
  above-the-fold faces, matched per locale to avoid preloading unused subsets:
  DE/EN preload Inter latin + Spectral 600 latin; RU preloads Inter cyrillic,
  Inter latin and Spectral 600 cyrillic.

### Verified in a browser

Checked with headless Chromium at 375 × 667 px (iPhone SE) in all three languages:
hero CTA clear of the banner, banner dismiss restores body padding and the toggle,
journey era labels render, timeline cards have no vertical overflow, contact submit
reveals the fallback panel and both copy buttons write the expected text to the
clipboard, the `<noscript>` card renders with a working Telegram link, and no page
errors are raised.

### Investigated, no change needed

- **Duplicate paragraph on the contact pages:** not present. Exact-match and
  near-duplicate (difflib ratio > 0.72) scans over the `p`, `li`, `small`, `strong`,
  `h2`, `h3` and `summary` blocks of all three contact pages found zero duplicates. A
  site-wide scan turned up only `ru/tree.html`, where «Живой человек: данные сокращены»
  appears three times — one legitimate privacy note per living person, so it was kept.
- **Splitting `script.js`:** skipped as instructed; the monolith is fine for a static
  site.
- **`homepage-modern.css` is dead code** — no HTML file references it, so the slider fix
  was applied in `modern.css` only.
- **`build-site.mjs` is stale and was deliberately not run.** It emits
  `<header class="hdr">` and links `style-search-bottom.css`, while the live pages use
  `<header class="preview-header">` and `modern.css`; regenerating from it deletes the
  `sources.html` pages and the EWZ document pages. The published HTML is maintained by
  hand and was edited directly.
