import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.dirname(fileURLToPath(import.meta.url));
const SITE = "https://kroeker-family.com";
const CACHE = "20260501-headerfix";
const LANGS = ["de", "ru", "en"];
const PAGES = ["index", "tree", "history", "timeline", "research", "updates", "resources", "map", "contact", "datenschutz", "impressum"];
const SECTION = { index: "s0", tree: "s1", history: "s2", timeline: "s3", research: "s4", updates: "s5", resources: "s6", map: "s7", contact: "s8", datenschutz: "privacy", impressum: "impressum" };
const PAGE_FILE = (page) => `${page}.html`;

const UI = {
  de: {
    skip: "Zum Hauptinhalt",
    nav: "Hauptnavigation",
    menu: "Menü",
    search: "Suche auf der Website...",
    home: "Startseite",
    privacy: "Datenschutz",
    impressum: "Impressum",
    cookies: "Cookie-Einstellungen",
    footer: "Familie Kröker · Berlin 2026 · Familiengeschichte und Archivforschung",
    living: "Lebende Person: Daten reduziert",
    photo: "Foto folgt",
    showDna: "DNA-Daten anzeigen",
    dnaDisclaimer: "Bitte verwenden Sie DNA-Daten nur für private Familienforschung und schreiben Sie zuerst über die Kontaktform.",
    contactMail: "Nachricht per E-Mail vorbereiten",
    noteDecision: "Treu nach Quellen: offene Punkte sind als TODO markiert."
  },
  ru: {
    skip: "К основному содержанию",
    nav: "Главное меню",
    menu: "Меню",
    search: "Поиск...",
    home: "Главная",
    privacy: "Datenschutz",
    impressum: "Impressum",
    cookies: "Настройки cookies",
    footer: "Семья Крёкер · Берлин 2026 · история семьи и архивное исследование",
    living: "Живой человек: данные сокращены",
    photo: "Фото будет добавлено",
    showDna: "Показать DNA-данные",
    dnaDisclaimer: "Используйте DNA-данные только для личного семейного исследования и сначала напишите через форму контакта.",
    contactMail: "Подготовить письмо",
    noteDecision: "Без вымысла: неизвестные места оставлены как TODO."
  },
  en: {
    skip: "Skip to main content",
    nav: "Main navigation",
    menu: "Menu",
    search: "Search the website...",
    home: "Home",
    privacy: "Privacy",
    impressum: "Impressum",
    cookies: "Cookie settings",
    footer: "Kroeker family · Berlin 2026 · family history and archive research",
    living: "Living person: data reduced",
    photo: "Photo coming later",
    showDna: "Show DNA details",
    dnaDisclaimer: "Please use DNA details only for private family research and contact first through the form.",
    contactMail: "Prepare email message",
    noteDecision: "No invented facts: unknown places remain marked as TODO."
  }
};

const META = {
  index: {
    de: ["Familie Kröker — Mennoniten aus Westpreußen, Wolhynien, Kasachstan", "Familiengeschichte der Mennoniten Kröker / Kroeker aus Westpreußen, Wolhynien und Nordkasachstan. Genealogie, EWZ-Akten, Archivforschung Schulz, Dreger, Fröhlich."],
    ru: ["Семья Крёкер — меннониты из Пруссии, Волыни и Казахстана", "История семьи Крёкер / Кроекер: меннониты из Западной Пруссии, Волыни, депортация в Северный Казахстан 1941, переселение в Германию. Генеалогия Шульц, Дрегер, Фрёлих."],
    en: ["Kroeker Family — Mennonites from Prussia, Volhynia, Kazakhstan", "Mennonite family history of the Kroeker / Kröker family from West Prussia through Volhynia to Kazakhstan and Germany. Genealogy, EWZ records, archive research on Schulz, Dreger, Froehlich families."]
  },
  tree: {
    de: ["Stammbaum Kröker — 5 Generationen 1864–2026 | Wolhynien, Kasachstan", "Familienstammbaum der Familie Kröker / Kroeker mit fünf Generationen aus Wolhynien, Nordkasachstan und Deutschland."],
    ru: ["Родословная Крёкер — 5 поколений 1864–2026 | Волынь, Казахстан", "Семейное древо Крёкер / Кроекер: пять поколений от Волыни и Северного Казахстана до Германии. Шульц, Дрегер, Фрёлих."],
    en: ["Kroeker Family Tree — 5 Generations 1864–2026 | Volhynia, Kazakhstan", "Kroeker family genealogy tree spanning five generations from Volhynia and northern Kazakhstan to Germany."]
  },
  history: {
    de: ["Geschichte der Familie Kröker — Mennoniten Wolhynien", "Geschichte der Mennonitenfamilie Kröker: Wanderung Westpreußen → Wolhynien → Kasachstan → Deutschland."],
    ru: ["История семьи Крёкер — меннониты Волыни и Казахстана", "История меннонитской семьи Крёкер: путь из Западной Пруссии через Волынь в Северный Казахстан и Германию."],
    en: ["Kroeker Family History — Volhynian Mennonites", "History of the Kroeker Mennonite family: migration from West Prussia through Volhynia to Kazakhstan and Germany."]
  },
  timeline: {
    de: ["Zeitleiste der Familie Kröker 1820–2026", "Chronologie der Familie Kröker mit allen wichtigen Ereignissen von 1820 bis 2026."],
    ru: ["Хронология семьи Крёкер 1820–2026", "Хронология семьи Крёкер: все ключевые события с 1820 по 2026 год."],
    en: ["Kroeker Family Timeline 1820–2026", "Complete chronology of the Kroeker family from 1820 to 2026."]
  },
  research: {
    de: ["Archivforschung Kröker — EWZ, Bundesarchiv, SBU", "Archivanfragen zur Familie Kröker: EWZ-Akten, Bundesarchiv Berlin, SBU Ukraine, NAO Kasachstan, MHSBC Kanada."],
    ru: ["Архивные исследования семьи Крёкер — EWZ, СБУ, Бундесархив", "Архивные запросы по семье Крёкер: EWZ, Бундесархив Берлин, СБУ Украины, НАО Казахстан, MHSBC Канада."],
    en: ["Kroeker Archive Research — EWZ, Bundesarchiv, SBU", "Archive research on the Kroeker family: EWZ files, Bundesarchiv Berlin, Ukrainian SBU, Kazakhstan NAO, MHSBC Canada."]
  },
  contact: {
    de: ["Kontakt Familie Kröker — Verwandte gesucht", "Kontakt zum Familienprojekt Kröker. Verwandte aus Wolhynien, Kasachstan und Deutschland gesucht. Telegram, GEDmatch."],
    ru: ["Контакт — семья Крёкер ищет родственников", "Контакты семейного проекта Крёкер. Ищем родственников из Волыни, Казахстана и Германии. Telegram, GEDmatch."],
    en: ["Contact — Kroeker Family Project", "Contact the Kroeker family project. Looking for relatives from Volhynia, Kazakhstan and Germany. Telegram, GEDmatch DNA matches welcome."]
  },
  updates: {
    de: ["Aktualisierungen Familie Kröker — Archivforschung 2026", "Neue Archivantworten, EWZ-Funde und Forschungsnotizen zur Familie Kröker / Kroeker."],
    ru: ["Обновления семьи Крёкер — архивные находки 2026", "Новые ответы архивов, документы EWZ и заметки исследования по семье Крёкер / Кроекер."],
    en: ["Kroeker Family Updates — Archive Research 2026", "New archive replies, EWZ findings and research notes for the Kroeker / Kröker family."]
  },
  resources: {
    de: ["Ressourcen Kröker Genealogie — Mennoniten, Wolhynien", "Links zu Datenbanken, Archiven und mennonitischen Ressourcen für die Forschung zur Familie Kröker, Schulz und Dreger."],
    ru: ["Ресурсы по генеалогии Крёкер — меннониты, Волынь", "Ссылки на базы данных, архивы и меннонитские ресурсы для исследования семьи Крёкер, Шульц и Дрегер."],
    en: ["Kroeker Genealogy Resources — Mennonites, Volhynia", "Links to databases, archives and Mennonite resources for researching the Kroeker, Schulz and Dreger families."]
  },
  map: {
    de: ["Karte der Familie Kröker — Preußen, Wolhynien, Kasachstan", "Interaktive Karte der wichtigsten Orte der Familie Kröker von Westpreußen über Wolhynien und Kasachstan bis Berlin."],
    ru: ["Карта семьи Крёкер — Пруссия, Волынь, Казахстан", "Интерактивная карта важных мест семьи Крёкер: Западная Пруссия, Волынь, Казахстан, Шахты и Берлин."],
    en: ["Kroeker Family Map — Prussia, Volhynia, Kazakhstan", "Interactive map of the main Kroeker family places from West Prussia through Volhynia and Kazakhstan to Berlin."]
  },
  datenschutz: {
    de: ["Datenschutz — Familie Kröker", "Datenschutzerklärung für kroeker-family.com: Hosting, Server-Logs, Kontakt, Cookies, Google Analytics, Google Ads und OpenStreetMap."],
    ru: ["Datenschutz — семья Крёкер", "Политика конфиденциальности kroeker-family.com: хостинг, server logs, контакт, cookies, Google Analytics, Google Ads и OpenStreetMap."],
    en: ["Privacy — Kroeker Family", "Privacy information for kroeker-family.com: hosting, server logs, contact, cookies, Google Analytics, Google Ads and OpenStreetMap."]
  },
  impressum: {
    de: ["Impressum — Familie Kröker", "Impressum und Anbieterkennzeichnung der privaten Familienwebsite kroeker-family.com."],
    ru: ["Impressum — семья Крёкер", "Юридическая информация и сведения о владельце частного семейного сайта kroeker-family.com."],
    en: ["Impressum — Kroeker Family", "Legal notice and provider information for the private family website kroeker-family.com."]
  }
};

const KEYWORDS = "Kroeker, Kröker, Kreker, Кроекер, Крёкер, Крекер, Schulz, Шульц, Dreger, Дрегер, Fröhlich, Froehlich, Фрёлих, Фрелих, Usachew, Усачёв, Усачев, Mennoniten, Wolhynien, Volhynia, Westpreußen, Kazakhstan, Kasachstan, genealogy, Genealogie";

function extractObject(source, name) {
  const marker = `var ${name} =`;
  const start = source.indexOf(marker);
  if (start === -1) return {};
  const open = source.indexOf("{", start);
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let i = open; i < source.length; i++) {
    const ch = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === quote) quote = "";
      continue;
    }
    if (ch === '"' || ch === "'" || ch === "`") {
      quote = ch;
      continue;
    }
    if (ch === "{") depth++;
    if (ch === "}") {
      depth--;
      if (depth === 0) {
        const literal = source.slice(open, i + 1);
        return vm.runInNewContext(`(${literal})`);
      }
    }
  }
  throw new Error(`Cannot parse ${name}`);
}

const originalScript = fs.readFileSync(path.join(ROOT, "script.js"), "utf8");
const T = scrubObject(extractObject(originalScript, "T"));
const SEO_TEXT = scrubObject(extractObject(originalScript, "SEO_TEXT"));
const CONTACT_FORM_TEXT = scrubObject(extractObject(originalScript, "CONTACT_FORM_TEXT"));
const CONTACT_BOT_TEXT = scrubObject(extractObject(originalScript, "CONTACT_BOT_TEXT"));

function scrubObject(value) {
  if (typeof value === "string") return scrubText(value);
  if (Array.isArray(value)) return value.map(scrubObject);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, scrubObject(v)]));
  }
  return value;
}

function scrubText(text) {
  return text
    .replace(/\b\d{2}\.\d{2}\.(1952|1979)\b/g, "$1")
    .replace(/\b\d{1,2}\s+(Januar|January|января)\s+1979\b/g, "1979")
    .replace(/Eugen\s+(Wladimirowitsch|Vladimirovich)\s+Usachew/g, "Eugen Usachew")
    .replace(/Ljubow\s+([A-Z][a-z]+|[A-Z]\.)\s+Kr[yi]schka/g, "Ljubow K.")
    .replace(/Любовь\s+([А-ЯЁа-яё]+|[А-ЯЁ]\.)\s+Крышка/g, "Любовь К.")
    .replace(/Евгений\s+[А-ЯЁа-яё]+\s+Усач[её]в/g, "Евгений Усачев")
    .replace(/[A-ZÄÖÜ][A-Za-zÄÖÜäöüß-]+\s+Str\.\s*\d+(,\s*\d{5})?/g, "Berlin")
    .replace(/GEDmatch Kit\s+[A-Z0-9-]+/g, "GEDmatch")
    .replace(/Kit Number\s+[A-Z0-9-]+/g, "Kit-Daten auf Anfrage");
}

function esc(text = "") {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

const LINK_ENTRIES = [
  { terms: ["Johann Kröker", "Johann Kroeker", "Иоганн Крёкер"], href: "tree.html#person-johann-kroeker" },
  { terms: ["Emma Iwanowna Kröker", "Emma Iwanowna Kroeker", "Эмма Ивановна Крёкер", "Эмма Ивановна Крекер"], href: "tree.html#person-emma-iwanowna-kroeker" },
  { terms: ["Lydia Dreger", "Lydia Iwanowna Kröker", "Lydia Iwanowna Kroeker", "Лидия Дрегер", "Лидия Ивановна Крёкер"], href: "tree.html#person-lydia-dreger" },
  { terms: ["Edmund Dreger", "Эдмунд Дрегер"], href: "tree.html#person-edmund-dreger" },
  { terms: ["Leo Dreger", "Лео Дрегер"], href: "tree.html#person-leo-dreger" },
  { terms: ["Gottlieb Schulz", "Готлиб Шульц"], href: "tree.html#person-gottlieb-schulz" },
  { terms: ["Emma Gotlibowna Schulz", "Emma Gotlibovna Schulz", "Эмма Готлибовна Шульц"], href: "tree.html#person-emma-schulz" },
  { terms: ["Wladimir Usachew", "Vladimir Usachew", "Владимир Усачев"], href: "tree.html#person-wladimir-usachew" },
  { terms: ["Eugen Usachew", "Евгений Усачев"], href: "tree.html#person-eugen-usachew" },
  { terms: ["Westpreußen", "West Prussia", "Западная Пруссия"], href: "places/danzig.html" },
  { terms: ["Danzig", "Gdańsk", "Данциг"], href: "places/danzig.html" },
  { terms: ["Wolhynien", "Volhynia", "Волынь"], href: "places/peski.html" },
  { terms: ["Peski", "Пески"], href: "places/peski.html" },
  { terms: ["Sennoje", "Сенное"], href: "places/sennoje.html" },
  { terms: ["Schachty", "Shakhty", "Шахты"], href: "places/schachty.html" },
  { terms: ["EWZ50 Film B019", "Film B019"], href: "documents/ewz50-film-b019.html" },
  { terms: ["EWZ-Akte Edmund Dreger", "R 9361-IV/18702"], href: "documents/ewz-edmund-dreger.html" }
];

const LINK_MAP = new Map();
for (const entry of LINK_ENTRIES) {
  for (const term of entry.terms) LINK_MAP.set(term, entry.href);
}
const LINK_RE = new RegExp([...LINK_MAP.keys()].sort((a, b) => b.length - a.length).map(escapeRegExp).join("|"), "g");

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function localHref(lang, href) {
  if (/^(https?:|mailto:|tel:|#)/.test(href)) return href;
  return `/${lang}/${href}`;
}

function linkify(html, lang) {
  return html.split(/(<[^>]+>)/g).map((part, index) => {
    if (index % 2) return part;
    return part.replace(LINK_RE, (match) => `<a href="${localHref(lang, LINK_MAP.get(match))}">${match}</a>`);
  }).join("");
}

function paragraphs(text, lang) {
  return String(text || "")
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((part) => `<p>${linkify(esc(part).replace(/\n/g, "<br>"), lang)}</p>`)
    .join("");
}

function pageUrl(lang, page) {
  return `${SITE}/${lang}/${PAGE_FILE(page)}`;
}

function relPage(lang, page) {
  return `/${lang}/${PAGE_FILE(page)}`;
}

function head(lang, page, extra = "") {
  const [title, description] = META[page]?.[lang] || META.index[lang];
  const alternate = LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${pageUrl(l, page)}">`).join("");
  return `<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="keywords" content="${esc(KEYWORDS)}"><meta name="author" content="Kroeker Family"><meta name="robots" content="index, follow"><link rel="canonical" href="${pageUrl(lang, page)}">${alternate}<link rel="alternate" hreflang="x-default" href="${pageUrl("de", page)}"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}"><meta property="og:url" content="${pageUrl(lang, page)}"><meta property="og:type" content="website"><link rel="icon" href="/favicon.ico" sizes="any"><link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest"><link rel="sitemap" type="application/xml" title="Sitemap" href="/sitemap.xml"><link rel="stylesheet" href="/style-search-bottom.css?v=${CACHE}">${extra}<script defer src="/script.js?v=${CACHE}"></script></head>`;
}

function header(lang, page) {
  const t = T[lang];
  const navItems = [
    ["index", t.n0 || UI[lang].home, "s0"],
    ["tree", t.n1 || "Tree", "s1"],
    ["history", t.n2 || "History", "s2"],
    ["timeline", t.n3 || "Timeline", "s3"],
    ["research", t.n4 || "Research", "s4"],
    ["updates", t.n5 || "Updates", "s5"],
    ["resources", t.n6 || "Resources", "s6"],
    ["map", t.n7 || "Map", "s7"],
    ["contact", t.n8 || "Contact", "s8"]
  ];
  const nav = navItems.map(([target, label, sec]) => `<li class="nav-item"><a data-sec="${sec}" class="${target === page ? "on" : ""}" href="${relPage(lang, target)}">${esc(label)}</a></li>`).join("");
  const langs = LANGS.map((l) => `<a class="lang-btn ${l === lang ? "active" : ""}" href="${relPage(l, page)}" hreflang="${l}" aria-label="${l.toUpperCase()}">${l.toUpperCase()}</a>`).join("");
  return `<a class="skip-link" href="#main-content">${UI[lang].skip}</a><header class="hdr"><a class="brand brand-link" href="${relPage(lang, "index")}" aria-label="${UI[lang].home}"><div class="brand-mark">K</div><span class="brand-arrow" aria-hidden="true">→</span><div class="brand-copy"><div class="hdr-logo" id="hl">${esc(t.hl || "Kröker")}</div></div></a><button class="menu-toggle" type="button" onclick="toggleMainMenu(event)" aria-expanded="false" aria-controls="main-nav" aria-label="${UI[lang].menu}"><span class="menu-icon" aria-hidden="true">☰</span><span id="menu-label">${UI[lang].menu}</span></button><nav class="nav nav-inline" aria-label="${UI[lang].nav}"><ul>${nav}</ul></nav><nav class="nav nav-dropdown" id="main-nav" aria-label="${UI[lang].nav}"><ul>${nav}</ul></nav><div class="hdr-right"><div class="top-search"><div class="search-wrap"><input class="search-input" id="search-input" type="search" placeholder="${UI[lang].search}" oninput="updateSearchClear(this.value);doSearch(this.value)" aria-label="${UI[lang].search}"><button class="search-clear" id="search-clear" type="button" onclick="clearSearch()" aria-label="Clear search">×</button></div><div id="search-results"></div></div><div class="header-actions"><a class="home-btn" href="${relPage(lang, "index")}" aria-label="${UI[lang].home}"><span class="home-icon" aria-hidden="true">⌂</span></a><div class="header-support" aria-label="Telegram and PayPal"><a class="support-btn telegram" href="https://t.me/eugen30" target="_blank" rel="noopener"><span class="support-mark">TG</span> eugen30</a><a class="support-btn paypal" href="https://www.paypal.com/paypalme/eugenusachew" target="_blank" rel="noopener"><span id="paypal-header-label">${esc(t["pp-label"] || "PayPal")}</span></a></div></div><div class="lang-group">${langs}</div></div></header>`;
}

function footer(lang) {
  const t = T[lang];
  return `<footer class="footer"><div class="footer-main">${esc(UI[lang].footer)}</div><div class="footer-links"><a id="footer-privacy-link" href="${relPage(lang, "datenschutz")}">${UI[lang].privacy}</a><a href="${relPage(lang, "impressum")}">${UI[lang].impressum}</a><button id="footer-cookie-settings" type="button" onclick="openCookieSettings()">${UI[lang].cookies}</button></div><div class="footer-copy">${t.copyright || ""}</div></footer><button class="google-cookie-toggle" type="button" onclick="openCookieSettings()" aria-label="Google Analytics / Cookies"><span aria-hidden="true"></span><span class="sr-only">Google Analytics / Cookies</span></button>`;
}

function layout(lang, page, main, extraHead = "") {
  return `<!doctype html><html lang="${lang}">${head(lang, page, extraHead)}<body data-section="${SECTION[page] || "s0"}">${header(lang, page)}<main class="main" id="main-content">${main}</main>${footer(lang)}</body></html>`;
}

function renderIndex(lang) {
  const t = T[lang], seo = SEO_TEXT[lang] || {};
  const schema = `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kroeker Family History",
    url: SITE,
    inLanguage: ["de", "ru", "en"],
    about: { "@type": "Person", name: "Eugen Usachew", alternateName: ["Евгений Усачев"], birthDate: "1979", birthPlace: "Schachty", homeLocation: "Berlin" }
  })}</script>`;
  return layout(lang, "index", `<section class="sec" id="s0"><h1 class="sec-title">${esc(t.s0)}</h1><section class="seo-intro card" aria-labelledby="seo-intro-title"><h2 id="seo-intro-title">${esc(seo["seo-intro-title"] || META.index[lang][0])}</h2>${paragraphs(seo["seo-intro-p1"], lang)}${paragraphs(seo["seo-intro-p2"], lang)}<nav class="seo-link-list" aria-label="${UI[lang].nav}"><a href="${relPage(lang, "tree")}">${esc(seo["seo-link-tree"] || t.s1)}</a><a href="${relPage(lang, "history")}">${esc(seo["seo-link-history"] || t.s2)}</a><a href="${relPage(lang, "timeline")}">${esc(seo["seo-link-timeline"] || t.s3)}</a><a href="${relPage(lang, "research")}">${esc(seo["seo-link-research"] || t.s4)}</a><a href="${relPage(lang, "contact")}">${esc(seo["seo-link-contact"] || t.s8)}</a></nav></section><div class="g2"><article class="card"><h2>${esc(t.it)}</h2>${paragraphs(t.i, lang)}${projectVisual(lang)}</article><article class="card"><h2>${esc(t.pt)}</h2>${paragraphs(t.p, lang)}<div class="route-strip" aria-label="${esc(t.p)}">${routeStages(lang)}</div></article></div><section class="qbox" aria-labelledby="main-question"><h2 id="main-question">${esc(t.qt)}</h2>${paragraphs(t.q, lang)}</section>${branchCards(lang)}${relativesCard(lang)}<div class="g3">${statCard(t.c1r, t.c1n, t.c1d)}${statCard(t.c2r, t.c2n, t.c2d)}${statCard(t.c3r, t.c3n, t.c3d)}</div></section>`, schema);
}

function projectVisual(lang) {
  const alt = {
    de: "Historische Familienforschung mit Karte und Archivdokumenten",
    ru: "Историческое семейное исследование с картой и архивными документами",
    en: "Historical family research with a map and archive documents"
  };
  return `<figure class="project-visual-frame"><img class="project-visual" src="/assets/family-archive-journey.jpg" alt="${esc(alt[lang] || alt.de)}" loading="lazy"><span class="project-visual-glow" aria-hidden="true"></span></figure>`;
}

function routeStages(lang) {
  const labels = {
    de: ["Westpreußen", "Wolhynien", "Peski", "Sennoje", "Schachty", "Berlin"],
    ru: ["Западная Пруссия", "Волынь", "Пески", "Сенное", "Шахты", "Берлин"],
    en: ["West Prussia", "Volhynia", "Peski", "Sennoje", "Shakhty", "Berlin"]
  }[lang];
  const hrefs = ["danzig", "peski", "peski", "sennoje", "schachty", "danzig"];
  return labels.map((label, i) => `<a class="route-stage" href="${i === 5 ? relPage(lang, "map") : `/${lang}/places/${hrefs[i]}.html`}"><span>${label}</span></a>`).join("<span class=\"route-arrow\">→</span>");
}

function statCard(label, name, dates) {
  return `<article class="stat-card"><div class="sc-label">${esc(label || "")}</div><div class="sc-name">${esc(name || "")}</div><div class="sc-dates">${esc(dates || "")}</div></article>`;
}

function branchCards(lang) {
  const seo = SEO_TEXT[lang] || {};
  const cards = [
    ["branch-kroeker", "seo-kroeker-title", "seo-kroeker-p1", "seo-kroeker-link", "tree"],
    ["branch-schulz", "seo-schulz-title", "seo-schulz-p1", "seo-schulz-link", "history"],
    ["branch-dreger", "seo-dreger-title", "seo-dreger-p1", "seo-dreger-link", "research"],
    ["branch-froehlich", "seo-froehlich-title", "seo-froehlich-p1", "seo-froehlich-link", "contact"]
  ];
  return `<section class="seo-branches" aria-labelledby="seo-branches-title"><h2 id="seo-branches-title">${esc(seo["seo-branches-title"] || "")}</h2><div class="g2">${cards.map(([id, title, p, link, page]) => `<article class="card" id="${id}"><h3>${esc(seo[title] || "")}</h3>${paragraphs(seo[p], lang)}<p><a href="${relPage(lang, page)}">${esc(seo[link] || "")}</a></p></article>`).join("")}</div></section>`;
}

function relativesCard(lang) {
  const seo = SEO_TEXT[lang] || {};
  const dnaLine = (seo["seo-dna-line"] || "")
    .replace(/<[^>]+>/g, "")
    .replace(/\b[A-Z]{1,3}\d{5,}\b/g, "")
    .trim();
  return `<section class="seo-relatives card" aria-labelledby="seo-relatives-title"><h2 id="seo-relatives-title">${esc(seo["seo-relatives-title"] || "")}</h2>${paragraphs(seo["seo-relatives-p1"], lang)}<ul><li>${seo["seo-telegram-line"] || ""}</li><li>${esc(dnaLine)}</li><li>${esc((seo["seo-clues-line"] || "").replace(/<[^>]+>/g, ""))}</li></ul></section>`;
}

let activePersonLang = "de";

function renderTree(lang) {
  activePersonLang = lang;
  const t = T[lang];
  const schema = personSchema();
  const generations = [
    [generationTitle(lang, 1), [
      person("person-gottlieb-schulz", "Gottlieb Schulz", "", "? – ?", "Wolhynien", "ancestor"),
      person("person-gottlieb-kroeker", "Gottlieb Kröker", "Gottlieb Kroeker, Готлиб Крёкер", "? – ?", "Wolhynien", "ancestor")
    ]],
    [generationTitle(lang, 2), [
      person("person-johann-kroeker", t["tn-jo"], "Johann Kroeker, Johann Kröker, Иоганн Крёкер", "15.11.1864 – ca. 1924", "Wolhynien", "ancestor", "1864-11-15"),
      person("person-emma-schulz", t["tn-es"], "Emma Gotlibowna Schulz, Emma Frelich", "11.11.1884 – ?", "Wolhynien / Wiktorowka", "ancestor", "1884-11-11")
    ]],
    [generationTitle(lang, 3), [
      person("person-lydia-dreger", "Lydia Dreger geb. Kröker", "Lydia Iwanowna Kroeker, Лидия Дрегер", "17.04.1917 – ?", "Schiljesna / Wolhynien", "ancestor", "1917-04-17"),
      person("person-emma-iwanowna-kroeker", t["tn-ei"], "Emma Iwanowna Kroeker, Эмма Ивановна Крёкер", "05.05.1924 – 02.05.1987", "Uwarowka / Alexandrowka", "ancestor", "1924-05-05", "1987-05-02"),
      person("person-edmund-dreger", "Edmund Dreger", "Эдмунд Дрегер", "22.07.1914 – ?", "Chabrowka", "ancestor", "1914-07-22"),
      person("person-leo-dreger", "Leo Dreger", "Лео Дрегер", "08.06.1937 – ?", "Knarow / Knowrow", "ancestor", "1937-06-08")
    ]],
    [generationTitle(lang, 4), [
      person("person-wladimir-usachew", t["tn-vl"], "Vladimir Usachew, Владимир Усачев", "08.04.1950 – 06.08.2023", "Sennoje / Schachty", "ancestor", "1950-04-08", "2023-08-06"),
      `<!-- TODO: получить письменное согласие у Любови К. на публикацию имени и года рождения, иначе заменить на инициалы -->${person("person-ljubow-kryschka", lang === "ru" ? "Любовь К." : "Ljubow K.", "Ljubow Kryschka, Любовь К.", "1952", lang === "ru" ? "Ставропольский край" : "Stavropol krai", "living", "1952")}`,
      person("person-wassili-unknown", "Wassili", "Василий", "~1949–1950", "Kasachstan", "ancestor")
    ]],
    [generationTitle(lang, 5), [
      person("person-eugen-usachew", lang === "ru" ? "Евгений Усачев" : "Eugen Usachew", "Eugen Usachew, Евгений Усачев", "1979", "Schachty / Berlin", "living", "1979")
    ]]
  ];
  return layout(lang, "tree", `<section class="sec" id="s1"><h1 class="sec-title">${esc(t.s1)}</h1><p class="lead">${esc(META.tree[lang][1])}</p><div class="family-tree">${generations.map(([title, people], i) => `<section class="generation generation-${i + 1}" aria-labelledby="generation-${i + 1}"><h2 id="generation-${i + 1}">${esc(title)}</h2><div class="generation-grid">${people.join("")}</div></section>`).join("")}</div><section class="card"><h2>${esc(UI[lang].noteDecision)}</h2>${paragraphs(t.h2, lang)}</section></section>`, schema);
}

function generationTitle(lang, n) {
  const labels = {
    de: ["1. Generation — Urur-Urgroßeltern", "2. Generation — Urgroßeltern", "3. Generation — Großmutter und Geschwister", "4. Generation — Eltern", "5. Generation — Gegenwart"],
    ru: ["1 поколение — прапрапредки", "2 поколение — прадеды", "3 поколение — бабушка и её родные", "4 поколение — родители", "5 поколение — современная линия"],
    en: ["1st generation — earliest known ancestors", "2nd generation — great-grandparents", "3rd generation — grandmother and siblings", "4th generation — parents", "5th generation — present line"]
  };
  return labels[lang][n - 1];
}

function person(id, name, alt, dates, place, kind, birthDate = "", deathDate = "") {
  const living = kind === "living";
  return `<article class="person-card ${living ? "living" : "ancestor"}" id="${id}" itemscope itemtype="https://schema.org/Person"><div class="person-photo photo-placeholder" aria-label="${esc(UI[activePersonLang].photo)}"></div><h3 itemprop="name">${esc(name)}</h3>${alt ? `<meta itemprop="alternateName" content="${esc(alt)}">` : ""}${birthDate ? `<meta itemprop="birthDate" content="${esc(birthDate)}">` : ""}${deathDate ? `<meta itemprop="deathDate" content="${esc(deathDate)}">` : ""}<p class="person-dates">${esc(dates)}</p><p class="person-place" itemprop="birthPlace" itemscope itemtype="https://schema.org/Place"><span itemprop="name">${esc(place)}</span></p>${living ? `<p class="privacy-note">${esc(UI[activePersonLang].living)}</p>` : ""}</article>`;
}

function personSchema() {
  return `<script type="application/ld+json">${JSON.stringify({
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Person", "@id": `${SITE}/de/tree.html#person-johann-kroeker`, name: "Johann Kröker", alternateName: ["Johann Kroeker", "Иоганн Крёкер"], birthDate: "1864-11-15", birthPlace: "Wolhynien" },
      { "@type": "Person", "@id": `${SITE}/de/tree.html#person-emma-schulz`, name: "Emma Gotlibowna Schulz", alternateName: ["Emma Frelich", "Emma Fröhlich"], birthDate: "1884-11-11", birthPlace: "Wolhynien" },
      { "@type": "Person", "@id": `${SITE}/de/tree.html#person-emma-iwanowna-kroeker`, name: "Emma Iwanowna Kröker", alternateName: ["Emma Iwanowna Kroeker", "Эмма Ивановна Крёкер"], birthDate: "1924-05-05", deathDate: "1987-05-02" },
      { "@type": "Person", "@id": `${SITE}/de/tree.html#person-wladimir-usachew`, name: "Wladimir Usachew", alternateName: ["Vladimir Usachew", "Владимир Усачев"], birthDate: "1950-04-08", deathDate: "2023-08-06", birthPlace: "Sennoje" },
      { "@type": "Person", "@id": `${SITE}/de/tree.html#person-eugen-usachew`, name: "Eugen Usachew", alternateName: ["Евгений Усачев"], birthDate: "1979", birthPlace: "Schachty" }
    ]
  })}</script>`;
}

function renderHistory(lang) {
  const t = T[lang];
  const sections = [["h1t", "h1"], ["h2t", "h2"], ["h3t", "h3"], ["h3b-t", "h3b"], ["h4t", "h4"], ["h5t", "h5"]];
  return layout(lang, "history", `<section class="sec" id="s2"><h1 class="sec-title">${esc(t.s2)}</h1>${sections.map(([title, body]) => `<article class="card"><h2>${esc(t[title])}</h2>${paragraphs(t[body], lang)}<div class="photo-placeholder" aria-label="${UI[lang].photo}"></div></article>`).join("")}</section>`);
}

function renderTimeline(lang) {
  const t = T[lang];
  const items = [["~1820–1860", "tl1"], ["1864", "tl2"], ["1877 / 1884", "tl3"], ["1917", "tl4"], ["1924", "tl5"], ["~1935", "tl6b"], ["1935", "tl6c"], ["1941", "tl6d"], ["1941", "tl6"], ["1943", "tl6e"], ["1944", "tl6f"], ["1950", "tl7"], ["1952", "tl8"], ["1955", "tl9"], ["1979", "tl10"], ["1987", "tl12"], ["1993", "tl11"], ["2019", "tl13"], ["2023", "tl14"], ["2026", "tl15"]];
  return layout(lang, "timeline", `<section class="sec" id="s3"><h1 class="sec-title">${esc(t.s3)}</h1><div class="card"><ol class="tl">${items.map(([year, key]) => `<li class="tli"><time class="tly">${year}</time><div class="tlt">${linkify(esc(t[key] || ""), lang)}</div></li>`).join("")}</ol></div></section>`);
}

function renderResearch(lang) {
  const t = T[lang];
  const rows = [
    ["MHSBC (Kanada)", "EWZ50 Film B019, Kader 1340–1353", t["r-done"], "April 2026", "badge-green"],
    ["Bundesarchiv Berlin", "EWZ-Akte Edmund Dreger (R 9361-IV/18702)", t["r-wait"], "~22.05.2026", ""],
    ["Ombudsmann Ukraine", "Nr. E-25482.3/26 — Kroeker E.I.", t["r-wait"], "~13.05.2026", ""],
    ["SBU + GUMWS Charkiw", "Archivakte Kroeker E.I.", t["r-wait"], "~20.05.2026", ""],
    ["SBU Ukraine", "Akte Kroeker E.I. — Anfrage: 20.04.2026", t["r-wait"], "~03.06.2026", ""],
    ["NAO Gov. (SKO)", "Erstakt Vladimir Usachew 08.04.1950, Nr.13", t["r-wait"], "~05.05.2026", ""],
    ["Kasachstan (Marina)", "Deportationsunterlagen Familie Kroeker", t["r-prog"], "—", ""],
    ["Justizbeh. Nordkasachstan", "Geburtsurkunde Vladimir Usachew 1950", t["r-wait"], "—", ""],
    ["MWD Charkiw", "Kopien Archivakte Kroeker E.I.", t["r-deny"], "—", "badge-red"]
  ];
  return layout(lang, "research", `<section class="sec" id="s4"><h1 class="sec-title">${esc(t.s4)}</h1><div class="card table-card"><table class="stbl"><thead><tr><th>${esc(t.ra)}</th><th>${esc(t.rw)}</th><th>${esc(t.rs)}</th><th>${esc(t.rd)}</th></tr></thead><tbody>${rows.map((r) => `<tr><td><strong>${esc(r[0])}</strong></td><td>${linkify(esc(r[1]), lang)}</td><td><span class="badge ${r[4]}">${esc(r[2])}</span></td><td>${esc(r[3])}</td></tr>`).join("")}</tbody></table></div></section>`);
}

function renderUpdates(lang) {
  const t = T[lang];
  return layout(lang, "updates", `<section class="sec" id="s5"><h1 class="sec-title">${esc(t.s5)}</h1><article class="card"><p class="muted">${esc(t.ul)}</p>${[0, 1, 2, 3, 4, 5, 6].map((i) => `<div class="upd-item"><div class="upd-dot upd-dot-${i === 0 ? "info" : i === 1 ? "done" : "new"}"></div><div class="upd-content"><h2 class="upd-date">${esc(t[`u${i}d`])}</h2><p class="upd-text">${linkify(esc(t[`u${i}t`]), lang)}</p></div></div>`).join("")}</article></section>`);
}

function renderResources(lang) {
  const t = T[lang];
  return layout(lang, "resources", `<section class="sec" id="s6"><h1 class="sec-title">${esc(t.s6)}</h1><div class="card"><h2>${esc(t["r-search-title"])}</h2>${paragraphs(t["r-search-desc"], lang)}</div><div class="g2"><article class="card"><h2>GRANDMA Online</h2>${paragraphs(t["r-grandma"], lang)}<a class="res-btn" href="https://grandmaonline.org/gmol-7/loginRequired.asp" target="_blank" rel="noopener">grandmaonline.org</a></article><article class="card"><h2>Odessa3 — Mennonite Database</h2>${paragraphs(t["r-odessa"], lang)}<a class="res-btn" href="https://www.odessa3.org/search.html" target="_blank" rel="noopener">odessa3.org</a></article></div><article class="card"><h2>${esc(t["r-other-title"])}</h2><div class="resource-list">${["https://www.bundesarchiv.de", "https://www.mhsbc.com", "https://www.archion.de", "https://www.matricula-online.eu", "https://openlist.wiki", "https://www.gameo.org"].map((url) => `<a class="res-link" href="${url}" target="_blank" rel="noopener">${url.replace("https://www.", "").replace("https://", "")}</a>`).join("")}</div></article></section>`);
}

function renderMap(lang) {
  const t = T[lang];
  const extra = `<link rel="preconnect" href="https://cdnjs.cloudflare.com"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css"><script defer src="https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.js"></script>`;
  return layout(lang, "map", `<section class="sec" id="s7"><h1 class="sec-title">${esc(t.s7)}</h1><div class="card"><p>${esc(t["map-desc"])}</p><div id="leaflet-map" class="leaflet-shell"><div id="map-loading">Karte wird geladen...</div></div></div><div class="g3">${["l1", "l2", "l3", "l4", "l5", "l6"].map((n, i) => statCard(t[`map-${n}`], ["Danzig / Gdańsk", "Wolhynien", "Peski", "Sennoje", "Schachty", "Berlin"][i], ["~1820–1864", "1864–1941", "~1935–1941", "1941–1955", "1955–2019", "ab 2019"][i])).join("")}</div></section>`, extra);
}

function renderContact(lang) {
  const t = T[lang], form = CONTACT_FORM_TEXT[lang] || CONTACT_FORM_TEXT.de;
  const bot = CONTACT_BOT_TEXT[lang] || CONTACT_BOT_TEXT.de;
  const botTopics = ["relatives", "dna", "archive", "correction"].map((topic) => `<button type="button" onclick="contactBotPick('${topic}')">${esc(bot.topics[topic])}</button>`).join("");
  return layout(lang, "contact", `<section class="sec" id="s8"><h1 class="sec-title">${esc(t.s8)}</h1><div class="g2"><article class="card"><h2>${esc(t["con-why-t"])}</h2>${paragraphs(t["con-why"], lang)}</article><article class="card"><h2>${esc(t["con-how-t"])}</h2><div class="contact-actions"><a class="contact-action telegram" href="https://t.me/eugen30" target="_blank" rel="noopener"><span class="contact-action-icon">TG</span><span><strong>Telegram</strong><small>@eugen30</small></span></a><button class="contact-action dna" type="button" onclick="revealGedmatch(this)"><span class="contact-action-icon">DNA</span><span><strong>GEDmatch</strong><small>${esc(UI[lang].showDna)}</small></span></button><a class="contact-action paypal" href="https://www.paypal.com/paypalme/eugenusachew" target="_blank" rel="noopener"><span class="contact-action-icon">PP</span><span><strong>${esc(t["con-donate"])}</strong><small>${esc(t["con-donate-sub"])}</small></span></a></div><p class="privacy-note">${esc(UI[lang].dnaDisclaimer)}</p></article></div><section class="card contact-bot-card" aria-labelledby="contact-bot-title"><h2 id="contact-bot-title">${esc(bot.title)}</h2><p>${esc(bot.note)}</p><div class="contact-bot"><div class="bot-messages" id="contact-bot-log" aria-live="polite"><div class="bot-message bot-message-assistant">${esc(bot.hello)}</div></div><div class="bot-quick" aria-label="${esc(bot.hello)}">${botTopics}</div><label class="bot-input-label"><span>${esc(bot.input)}</span><textarea id="contact-bot-input" rows="4" placeholder="${esc(bot.placeholder)}"></textarea></label><div class="bot-actions"><button type="button" class="bot-action primary" onclick="contactBotPrepare()">${esc(bot.prepare)}</button><button type="button" class="bot-action" onclick="contactBotEmail()">${esc(bot.email)}</button><a class="bot-action telegram" href="https://t.me/eugen30" target="_blank" rel="noopener">${esc(bot.telegram)}</a></div><p class="contact-status" id="contact-bot-status" aria-live="polite"></p></div></section><section class="card contact-form-card" aria-labelledby="contact-form-title"><h2 id="contact-form-title">${esc(form["contact-form-title"])}</h2><p>${esc(form["contact-form-note"])}</p><form class="contact-form" onsubmit="submitContactForm(event)"><label><span>${esc(form["contact-label-name"])}</span><input id="contact-name" type="text" autocomplete="name"></label><label><span>${esc(form["contact-label-relation"])}</span><input id="contact-relation" type="text" autocomplete="off"></label><label class="contact-form-wide"><span>${esc(form["contact-label-message"])}</span><textarea id="contact-message" rows="5" required></textarea></label><button class="contact-submit" type="submit">${esc(form["contact-submit"] || UI[lang].contactMail)}</button><p class="contact-status" id="contact-status" aria-live="polite"></p></form></section><article class="card"><h2>${esc(t["con-search-t"])}</h2>${paragraphs(t["con-search"], lang)}<div class="contact-name-box">${paragraphs(t["con-names"], lang)}</div></article></section>`);
}

function renderDatenschutz(lang) {
  const copy = {
    de: ["Datenschutzerklärung", "Diese private Familienwebsite verarbeitet so wenig personenbezogene Daten wie möglich.", "Beim Aufruf der Website können beim Hosting-Anbieter technisch notwendige Server-Logs entstehen. Google Analytics und Google Ads/AdSense werden erst nach Ihrer Einwilligung geladen. Sie können die Einwilligung jederzeit über Cookie-Einstellungen widerrufen.", "Die Kontaktform bereitet eine E-Mail vor. Erst wenn Sie die E-Mail absenden, werden Ihre Angaben übertragen. Die Karte verwendet OpenStreetMap/Leaflet."],
    ru: ["Datenschutz", "Этот частный семейный сайт обрабатывает как можно меньше персональных данных.", "При открытии сайта у хостера могут создаваться технические server logs. Google Analytics и Google Ads/AdSense загружаются только после согласия. Согласие можно отозвать через настройки cookies.", "Форма контакта только подготавливает письмо. Данные передаются только если вы отправите письмо сами. Карта использует OpenStreetMap/Leaflet."],
    en: ["Privacy", "This private family website processes as little personal data as possible.", "When the website is opened, the hosting provider may create technically necessary server logs. Google Analytics and Google Ads/AdSense load only after consent. Consent can be withdrawn through cookie settings.", "The contact form prepares an email. Data is transferred only if you send the email yourself. The map uses OpenStreetMap/Leaflet."]
  }[lang];
  return layout(lang, "datenschutz", `<section class="sec privacy-page"><h1 class="sec-title">${esc(copy[0])}</h1>${copy.slice(1).map((p) => `<article class="card privacy-card">${paragraphs(p, lang)}</article>`).join("")}</section>`);
}

function renderImpressum(lang) {
  const title = lang === "ru" ? "Impressum / Юридическая информация" : lang === "en" ? "Impressum / Legal Notice" : "Impressum";
  return layout(lang, "impressum", `<section class="sec"><h1 class="sec-title">${title}</h1><article class="card"><h2>Angaben gemäß § 5 TMG</h2><p>Eugen Usachew<br>EUGEN_ADDRESS_PLACEHOLDER<br>EUGEN_EMAIL_PLACEHOLDER</p><h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2><p>Eugen Usachew<br>EUGEN_ADDRESS_PLACEHOLDER</p><h2>Haftungsausschluss</h2><p>Die Inhalte dieser privaten Familienseite wurden mit größter Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann jedoch keine Gewähr übernommen werden.</p></article></section>`);
}

const RENDERERS = { index: renderIndex, tree: renderTree, history: renderHistory, timeline: renderTimeline, research: renderResearch, updates: renderUpdates, resources: renderResources, map: renderMap, contact: renderContact, datenschutz: renderDatenschutz, impressum: renderImpressum };

function redirectPage(page) {
  const target = `/de/${PAGE_FILE(page)}`;
  const langChoice = page === "index"
    ? "q.get('lang')||((navigator.language||'de').toLowerCase().startsWith('ru')?'ru':(navigator.language||'de').toLowerCase().startsWith('en')?'en':'de')"
    : "q.get('lang')||'de'";
  return `<!doctype html><html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Weiterleitung</title><meta name="robots" content="noindex, follow"><link rel="canonical" href="${SITE}${target}"><meta http-equiv="refresh" content="0; url=${target}"><script>var p=location.pathname.split('/').pop()||'index.html';var q=new URLSearchParams(location.search);var l=${langChoice};if(!/^(de|ru|en)$/.test(l))l='de';location.replace('/'+l+'/'+p);</script></head><body><p><a href="${target}">Weiter zu kroeker-family.com</a></p></body></html>`;
}

function storyTemplate(lang, slug, title, dateText) {
  return layout(lang, "history", `<article class="sec story-template"><h1 class="sec-title">${esc(title)}</h1><section class="card"><h2>${lang === "ru" ? "Дата события" : lang === "en" ? "Event date" : "Datum des Ereignisses"}</h2><p>${esc(dateText)}</p></section><section class="card"><h2>${lang === "ru" ? "Локация" : lang === "en" ? "Location" : "Ort"}</h2><p>TODO: Koordinaten / координаты / coordinates.</p></section><section class="card"><h2>${lang === "ru" ? "Главные герои" : lang === "en" ? "Main people" : "Hauptpersonen"}</h2><p>TODO: Links zu Personen in tree.html.</p></section><section class="card"><h2>${lang === "ru" ? "Текст истории" : lang === "en" ? "Story text" : "Text der Geschichte"}</h2><p>TODO: Nur belegte Familienerinnerungen und Archivdaten ergänzen.</p></section><section class="card"><h2>${lang === "ru" ? "Источники" : lang === "en" ? "Sources" : "Quellen"}</h2><p>TODO: Archivsignaturen, EWZ-Nummern, Dokumente.</p></section></article>`);
}

function placeTemplate(lang, slug, title) {
  return layout(lang, "map", `<article class="sec place-template"><h1 class="sec-title">${esc(title)}</h1><section class="card"><h2>${lang === "ru" ? "Исторические варианты названия" : lang === "en" ? "Historical names" : "Historische Namen"}</h2><p>TODO: Varianten auf Deutsch, Russisch, Englisch.</p></section><section class="card"><h2>OpenStreetMap</h2><p>TODO: Koordinaten ergänzen und OSM-Karte einbetten.</p></section><section class="card"><h2>${lang === "ru" ? "Период проживания семьи" : lang === "en" ? "Family residence period" : "Zeitraum der Familie"}</h2><p>TODO: Nur belegte Zeiträume ergänzen.</p></section><section class="card"><h2>${lang === "ru" ? "Связанные предки" : lang === "en" ? "Related ancestors" : "Verbundene Vorfahren"}</h2><p>TODO: Links zu Personen in tree.html.</p></section></article>`);
}

function documentTemplate(lang, slug, title) {
  return layout(lang, "research", `<article class="sec document-template"><h1 class="sec-title">${esc(title)}</h1><section class="card"><h2>${lang === "ru" ? "Скан документа" : lang === "en" ? "Document scan" : "Dokumentenscan"}</h2><div class="photo-placeholder" aria-label="${UI[lang].photo}"></div></section><section class="card"><h2>${lang === "ru" ? "Расшифровка" : lang === "en" ? "Transcription" : "Transkription"}</h2><p>TODO: Originaltext eintragen.</p></section><section class="card"><h2>${lang === "ru" ? "Перевод" : lang === "en" ? "Translation" : "Übersetzung"}</h2><p>TODO: Übersetzung ergänzen.</p></section></article>`);
}

function writeGeneratedSite() {
  for (const lang of LANGS) {
    const dir = path.join(ROOT, lang);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    for (const page of PAGES) {
      fs.writeFileSync(path.join(dir, PAGE_FILE(page)), RENDERERS[page](lang), "utf8");
    }
    fs.mkdirSync(path.join(dir, "stories"), { recursive: true });
    fs.mkdirSync(path.join(dir, "places"), { recursive: true });
    fs.mkdirSync(path.join(dir, "documents"), { recursive: true });
    fs.writeFileSync(path.join(dir, "stories", "_template.html"), storyTemplate(lang, "_template", "TODO: Story title", "TODO"), "utf8");
    fs.writeFileSync(path.join(dir, "stories", "deportation-1942.html"), storyTemplate(lang, "deportation-1942", "Deportation 12.06.1942 nach Sennoje", "12.06.1942"), "utf8");
    fs.writeFileSync(path.join(dir, "stories", "umsiedlung-1935.html"), storyTemplate(lang, "umsiedlung-1935", "Umsiedlung aus Wolhynien 1935", "1935"), "utf8");
    fs.writeFileSync(path.join(dir, "stories", "rückkehr-deutschland-2019.html"), storyTemplate(lang, "rückkehr-deutschland-2019", "Rückkehr nach Deutschland 2019", "2019"), "utf8");
    fs.writeFileSync(path.join(dir, "places", "_template.html"), placeTemplate(lang, "_template", "TODO: Ort"), "utf8");
    fs.writeFileSync(path.join(dir, "places", "peski.html"), placeTemplate(lang, "peski", "Peski / Пески"), "utf8");
    fs.writeFileSync(path.join(dir, "places", "sennoje.html"), placeTemplate(lang, "sennoje", "Sennoje / Сенное"), "utf8");
    fs.writeFileSync(path.join(dir, "places", "danzig.html"), placeTemplate(lang, "danzig", "Danzig / Westpreußen"), "utf8");
    fs.writeFileSync(path.join(dir, "places", "schachty.html"), placeTemplate(lang, "schachty", "Schachty / Шахты"), "utf8");
    fs.writeFileSync(path.join(dir, "documents", "_template.html"), documentTemplate(lang, "_template", "TODO: Dokument"), "utf8");
    fs.writeFileSync(path.join(dir, "documents", "ewz50-film-b019.html"), documentTemplate(lang, "ewz50-film-b019", "EWZ50 Film B019, Kader 1340–1353"), "utf8");
    fs.writeFileSync(path.join(dir, "documents", "ewz-edmund-dreger.html"), documentTemplate(lang, "ewz-edmund-dreger", "EWZ-Akte Edmund Dreger (R 9361-IV/18702)"), "utf8");
  }
  for (const page of PAGES) fs.writeFileSync(path.join(ROOT, PAGE_FILE(page)), redirectPage(page), "utf8");
}

function sitemap() {
  const urls = [];
  const allPages = [...PAGES, "stories/deportation-1942", "stories/umsiedlung-1935", "stories/rückkehr-deutschland-2019", "places/peski", "places/sennoje", "places/danzig", "places/schachty", "documents/ewz50-film-b019", "documents/ewz-edmund-dreger"];
  for (const page of allPages) {
    const file = page.endsWith(".html") ? page : `${page}.html`;
    for (const lang of LANGS) {
      const loc = `${SITE}/${lang}/${file}`;
      const alternates = LANGS.map((l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${SITE}/${l}/${file}"/>`).join("");
      urls.push(`<url><loc>${loc}</loc>${alternates}<xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/de/${file}"/><priority>${page === "index" && lang === "de" ? "1.0" : "0.7"}</priority></url>`);
    }
  }
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`;
}

function migrationNotes() {
  return `# MIGRATION NOTES

## Отчёт обследования

- Стек: статический HTML/CSS/JS, без Jekyll/Hugo/Eleventy/Vite/Gulp.
- Деплой: GitHub Pages, репозиторий \`kroeker-family/kroeker\`, ветка \`main\`, стандартный workflow \`pages-build-deployment\`.
- Переводы: объект \`T\` в \`script.js\`, дополнительные SEO/контактные строки там же.
- Шаблонов не было: шапка, меню и футер были продублированы в HTML. Добавлен \`build-site.mjs\` как лёгкий статический генератор.

## Что изменено

- Созданы статические языковые версии \`/de/\`, \`/ru/\`, \`/en/\` для основных страниц.
- Основной контент теперь находится в HTML до запуска JavaScript.
- Добавлены \`hreflang\`, canonical, уникальные title/description, расширенные keywords.
- Добавлены \`sitemap.xml\`, \`robots.txt\`, \`impressum.html\`, \`datenschutz.html\`.
- Cookie consent оставлен до загрузки Google Analytics / Google Ads.
- Точные даты рождения живых людей и отчества убраны из HTML. GEDmatch Kit ID не публикуется в открытом HTML.
- Добавлены шаблоны \`stories\`, \`places\`, \`documents\`.
- Добавлен словарь внутренней перелинковки \`link-dictionary.json\`.

## Требуется решение

- Заменить \`EUGEN_ADDRESS_PLACEHOLDER\` и \`EUGEN_EMAIL_PLACEHOLDER\` в Impressum на реальные данные или согласованный юридический вариант.
- Получить письменное согласие у Любови К. на публикацию имени и года рождения, иначе оставить инициалы.
- Проверить текст Datenschutz у немецкого юриста или через сервис генерации Datenschutz/Impressum.
- Зарегистрировать сайт в Google Search Console и отправить новый \`sitemap.xml\`.
- GitHub Pages не даёт настоящие 301-редиректы без дополнительного сервера; старые URL сделаны через meta/JS redirect.
- Внешние валидаторы W3C/schema.org и Lighthouse нужно запускать после публикации, потому что они проверяют публичный URL.
`;
}

writeGeneratedSite();
fs.writeFileSync(path.join(ROOT, "sitemap.xml"), sitemap(), "utf8");
fs.writeFileSync(path.join(ROOT, "robots.txt"), "User-agent: *\nAllow: /\nSitemap: https://kroeker-family.com/sitemap.xml\n", "utf8");
fs.writeFileSync(path.join(ROOT, "link-dictionary.json"), JSON.stringify(LINK_ENTRIES, null, 2), "utf8");
fs.writeFileSync(path.join(ROOT, "MIGRATION_NOTES.md"), migrationNotes(), "utf8");
console.log("Generated static /de /ru /en site.");
