# Privacy review — kroeker-family.com

Audit of personal data currently published on the site. Nothing listed here has been
removed or hidden automatically — these are findings and recommendations for the site
owner to decide on. Sources: `de/`, `ru/`, `en/` HTML pages, `script.js`.

## 1. Impressum — real name, home address, email

**Where:** `{de,ru,en}/impressum.html`, `{de,ru,en}/datenschutz.html`
**What:** Full name (Eugen Usachew), home street address, postal code, city, country,
and email (`evusachev30@gmail.com`), published in plain text.
**Status:** Required by German law (§5 DDG / Impressumspflicht) for any site that
accepts donations or is otherwise not purely private correspondence — this is not
optional and should stay public.
**Recommendation:** No action. Keep as-is; this is a legal requirement, not a leak.

## 2. GEDmatch kit ID — weak client-side "reveal" gate

**Where:** `script.js` (`GEDMATCH_KIT`, `revealGedmatch()`), used from
`{de,ru,en}/contact.html`.
**What:** The kit ID is split into three string fragments and joined at runtime
(`["MZ","563","0855"].join("")`), then only written into the DOM when the visitor
clicks "Show DNA details". This looks like access control but isn't one — the full
ID ships in the public `script.js` bundle for every visitor regardless of whether
they click, and is trivially readable via "View Source" or devtools.
**Recommendation:**
- If the kit ID itself is meant to be semi-private (shown only to people who
  bother to click, e.g. to deter scraping/bots, not real confidentiality), current
  behavior is fine — just don't treat it as a privacy control in your own mental
  model.
- If it should be genuinely gated, the only real fix is server-side: serve it from
  an endpoint after some form of request (can't be done with a static site alone).

## 3. Contact email — same weak obfuscation pattern

**Where:** `script.js` (`["evusachev30","gmail.com"].join("@")`).
**What:** Same split-and-join trick as the GEDmatch kit. It doesn't stop scrapers;
it only avoids a plain-text `mailto:` in the rendered HTML source before JS runs.
**Status:** This is the site owner's own contact address, intentionally public for
the site's purpose (people reaching out about genealogy). Not a leak of someone
else's data.
**Recommendation:** No action needed unless spam becomes a problem, in which case
consider a real contact-form backend (see `CONTACT_FORM_ENDPOINT` in `script.js`)
so the address never has to appear client-side at all.

## 4. Leo Dreger — full birthdate, not marked as a living person

**Where:** `ru/tree.html` (`#person-leo-dreger`), referenced with the same full date
on `{de,ru,en}/contact.html` ("* 08.06.1937, Кнорово" / similar).
**What:** Full birthdate (08.06.1937) is shown with no death date. Unlike the three
people explicitly marked `class="person-card living"` with reduced data (Lyudmila
Usacheva, Lyubov Kryshka, Eugen Usachew — birth year only, surnames initialed where
applicable), Leo Dreger is marked as an `ancestor`, not `living`, even though someone
born in 1937 could plausibly still be alive today (age ~89 in 2026).
**Recommendation:** Owner should confirm Leo Dreger's status:
- If deceased and the date is known/documented — leave as is, it's a historical fact.
- If status is unknown or he may be alive — reduce to birth year only and add the
  same `person-card living` / "data reduced" treatment used for the other three
  living relatives, on both `tree.html` and the contact page mention.

## 5. Living relatives — already reasonably handled

**Where:** `ru/tree.html` (and `de`/`en` equivalents), `person-card living` entries.
**What:** Lyudmila Usacheva and Lyubov Kryshka are shown with birth year only (no
month/day), surname reduced to an initial, and a "living person: data reduced" note.
Eugen Usachew (the site owner) shows his full name by his own choice, which is his
call to make about his own data.
**Recommendation:** No action — this is the pattern the rest of the site should
follow (see #4).

## 6. Archival file/case numbers tied to named individuals

**Where:** e.g. `ru/index.html` — Emma Kroeker's case file number and archive fond/
opis/sprava references (ГДА МВС України), EWZ file numbers for Edmund Dreger, EWZ50
Film B019 frame numbers.
**Status:** All individuals with archival numbers currently shown are documented as
deceased decades ago (Emma Kroeker †1987, Edmund Dreger b. 1914, etc.). Historical
archive references for deceased persons are generally fine to publish and are core
to what a genealogy research site does.
**Recommendation:** No action now. If new archival material referencing a living or
possibly-living relative is added later (e.g. more on Leo Dreger, #4), apply the
same reduction pattern before publishing the file/case number.

## 7. Financial/donation identifiers

**Where:** PayPal.me link, Ko-fi link, YooMoney account number
(`4100119578652427`), shown in the contact page's donation section and site footer.
**Status:** Intentionally public, owner-controlled payment handles for accepting
donations — not third-party personal data.
**Recommendation:** No action.

## 8. Google Analytics measurement ID

**Where:** `script.js` (`GA_ID = "G-Z6EYVJ4FVW"`), only loaded after cookie consent
is accepted (see `initCookieConsent()` / `loadTracking()`).
**Status:** Not personal data by itself; already gated correctly behind consent.
**Recommendation:** No action.

---

## Summary for the owner

| Item | Sensitivity | Action needed |
|---|---|---|
| Impressum address/email | Required disclosure | None |
| GEDmatch kit ID | Low (owner's own DNA kit, weak obfuscation only) | None, understand it's not real access control |
| Contact email | Low (owner's own address) | None |
| **Leo Dreger full birthdate** | **Medium — possibly-living relative, not data-reduced** | **Owner should confirm status and reduce if needed** |
| Lyudmila / Lyubov / Eugen (living) | Already reduced | None |
| Deceased relatives' archive file numbers | Low (historical, deceased) | None |
| Donation account handles | Owner's own, intentional | None |
| GA measurement ID | Not personal data, consent-gated | None |
