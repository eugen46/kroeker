var lang = "de";
var pageBySection = {"s0":"index.html","s1":"tree.html","s2":"history.html","s3":"timeline.html","s4":"research.html","s5":"updates.html","s6":"resources.html","s7":"map.html","s8":"contact.html"};
var GA_ID = "G-Z6EYVJ4FVW";
var ADS_CLIENT = "ca-pub-2321812148317390";
var CONSENT_KEY = "kroeker-cookie-consent";
var GEDMATCH_KIT = ["MZ","563","0855"].join("");
function validLang(l){ return l === "de" || l === "ru" || l === "en"; }
function getPathLang(){
  try{
    var m = window.location.pathname.match(/^\/(de|ru|en)(\/|$)/);
    return m ? m[1] : "";
  }catch(e){ return ""; }
}
function getSavedLang(){
  var pathLang = getPathLang();
  if(validLang(pathLang)) return pathLang;
  var qLang = "";
  try{ qLang = new URLSearchParams(window.location.search).get("lang") || ""; }catch(e){}
  if(validLang(qLang)) return qLang;
  try{
    var saved = localStorage.getItem("kroeker-lang");
    if(validLang(saved)) return saved;
  }catch(e){}
  return "de";
}
function withLang(url){
  if(!url || /^(https?:|mailto:|tel:|#)/i.test(url)) return url;
  var l = validLang(lang) ? lang : "de";
  var clean = url.replace(/[?&]lang=(de|ru|en)\b/, "").replace(/[?&]$/, "");
  clean = clean.replace(/^\/(de|ru|en)\//, "/").replace(/^\//, "");
  if(clean === "") clean = "index.html";
  return "/" + l + "/" + clean;
}
function syncLanguageLinks(){
  document.querySelectorAll("a[href]").forEach(function(a){
    if(a.classList && a.classList.contains("lang-btn")) return;
    if(a.hasAttribute && a.hasAttribute("hreflang")) return;
    var href = a.getAttribute("href");
    if(href && /\.html(\?|$)/.test(href) && !/^(https?:|mailto:|tel:|#)/i.test(href)) a.setAttribute("href", withLang(href));
  });
}
function getConsent(){
  try{return localStorage.getItem(CONSENT_KEY) || "";}catch(e){return "";}
}
function saveConsent(value){
  try{localStorage.setItem(CONSENT_KEY, value);}catch(e){}
}
function loadScriptOnce(id, src, attrs, onload){
  if(document.getElementById(id)){
    if(onload) onload();
    return;
  }
  var s=document.createElement("script");
  s.id=id;
  s.async=true;
  s.src=src;
  if(attrs){
    Object.keys(attrs).forEach(function(k){s.setAttribute(k, attrs[k]);});
  }
  if(onload) s.onload=onload;
  document.head.appendChild(s);
}
function loadTracking(){
  if(window.__kroekerTrackingLoaded) return;
  window.__kroekerTrackingLoaded=true;
  loadScriptOnce("google-analytics-src","https://www.googletagmanager.com/gtag/js?id="+encodeURIComponent(GA_ID),{},function(){
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments);};
    window.gtag("js",new Date());
    window.gtag("config",GA_ID,{anonymize_ip:true});
  });
  loadScriptOnce("google-adsense-live","https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="+encodeURIComponent(ADS_CLIENT),{"crossorigin":"anonymous"});
}
function cookieTexts(){
  var copy={
    de:{
      title:"Datenschutz & Cookies",
      text:"Diese Website lädt Google Analytics und Google Ads/AdSense erst nach Ihrer Zustimmung. Wenn Sie ablehnen, werden diese Tracking-Skripte nicht geladen.",
      accept:"Akzeptieren",
      reject:"Ablehnen",
      privacy:"Datenschutz"
    },
    ru:{
      title:"Конфиденциальность и cookies",
      text:"Google Analytics и Google Ads/AdSense загружаются только после вашего согласия. Если отклонить, tracking-скрипты не будут включены.",
      accept:"Принять",
      reject:"Отклонить",
      privacy:"Datenschutz"
    },
    en:{
      title:"Privacy & cookies",
      text:"Google Analytics and Google Ads/AdSense load only after your consent. If you reject, these tracking scripts stay disabled.",
      accept:"Accept",
      reject:"Reject",
      privacy:"Privacy"
    }
  };
  return copy[lang] || copy.de;
}
function footerTexts(){
  var copy={
    de:{privacy:"Datenschutz",cookies:"Cookie-Einstellungen"},
    ru:{privacy:"Datenschutz",cookies:"Настройки cookies"},
    en:{privacy:"Privacy",cookies:"Cookie settings"}
  };
  return copy[lang] || copy.de;
}
function updateCookieBannerText(){
  var b=document.getElementById("cookie-consent");
  var t=cookieTexts();
  if(b){
    var title=b.querySelector("[data-cookie-title]");
    var text=b.querySelector("[data-cookie-text]");
    var accept=b.querySelector("[data-cookie-accept]");
    var reject=b.querySelector("[data-cookie-reject]");
    var privacy=b.querySelector("[data-cookie-privacy]");
    if(title) title.textContent=t.title;
    if(text) text.textContent=t.text;
    if(accept) accept.textContent=t.accept;
    if(reject) reject.textContent=t.reject;
    if(privacy) privacy.textContent=t.privacy;
  }
  var ft=footerTexts();
  var footerPrivacy=document.getElementById("footer-privacy-link");
  if(footerPrivacy) footerPrivacy.textContent=ft.privacy;
  var footerCookies=document.getElementById("footer-cookie-settings");
  if(footerCookies) footerCookies.textContent=ft.cookies;
}
function closeCookieBanner(){
  var b=document.getElementById("cookie-consent");
  if(b) b.classList.add("cookie-hidden");
}
function setCookieConsent(value){
  var wasLoaded=!!window.__kroekerTrackingLoaded;
  saveConsent(value);
  closeCookieBanner();
  if(value==="accepted") loadTracking();
  if(value==="rejected" && wasLoaded) window.location.reload();
}
function openCookieSettings(){
  saveConsent("");
  var b=document.getElementById("cookie-consent");
  if(b){
    b.classList.remove("cookie-hidden");
    updateCookieBannerText();
    return;
  }
  initCookieConsent();
}
function revealGedmatch(btn){
  var text = "GEDmatch Kit " + GEDMATCH_KIT;
  if(btn){
    var small = btn.querySelector("small");
    if(small) small.textContent = text;
    btn.setAttribute("aria-label", text);
  }
}
function initCookieConsent(){
  var current=getConsent();
  if(current==="accepted"){
    loadTracking();
    return;
  }
  if(current==="rejected") return;
  if(document.getElementById("cookie-consent")) return;
  var t=cookieTexts();
  var banner=document.createElement("div");
  banner.id="cookie-consent";
  banner.className="cookie-consent";
  banner.setAttribute("role","dialog");
  banner.setAttribute("aria-live","polite");
  banner.innerHTML='<div class="cookie-copy"><strong data-cookie-title>'+t.title+'</strong><p data-cookie-text>'+t.text+'</p><a data-cookie-privacy href="'+withLang("datenschutz.html")+'">'+t.privacy+'</a></div><div class="cookie-actions"><button type="button" class="cookie-btn cookie-reject" data-cookie-reject>'+t.reject+'</button><button type="button" class="cookie-btn cookie-accept" data-cookie-accept>'+t.accept+'</button></div>';
  document.body.appendChild(banner);
  banner.querySelector("[data-cookie-accept]").addEventListener("click",function(){setCookieConsent("accepted");});
  banner.querySelector("[data-cookie-reject]").addEventListener("click",function(){setCookieConsent("rejected");});
}
function initRevealAnimations(){
  if(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var items=document.querySelectorAll(".card,.stat-card,.qbox,.timeline-item,.res-link,.contact-method,.seo-link-list a,.privacy-card");
  if(!items.length) return;
  items.forEach(function(el,i){
    el.classList.add("reveal-card");
    el.style.setProperty("--reveal-delay", Math.min(i%8,7)*60+"ms");
  });
  if(!("IntersectionObserver" in window)){
    items.forEach(function(el){el.classList.add("in-view");});
    return;
  }
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add("in-view");
        obs.unobserve(entry.target);
      }
    });
  },{threshold:.14,rootMargin:"0px 0px -5% 0px"});
  items.forEach(function(el){obs.observe(el);});
}
function currentSection(){return document.body.getAttribute("data-section") || "s0";}
function setActiveNav(){var cs=currentSection();document.querySelectorAll(".nav a").forEach(function(a){a.classList.toggle("on", a.getAttribute("data-sec") === cs);});}
function setPageHero(t){var cs=currentSection();var titleEl=document.getElementById("page-title");var subEl=document.getElementById("page-subtitle");if(titleEl) titleEl.innerHTML = cs === "s0" ? (t["ht"] || "Familie Kröker") : (t[cs] || "Familie Kröker");if(subEl) subEl.innerHTML = t["hx"] || "";}
function closeMainMenu(){
  var nav=document.getElementById("main-nav");
  var btn=document.querySelector(".menu-toggle");
  if(nav) nav.classList.remove("open");
  if(btn){
    btn.classList.remove("open");
    btn.setAttribute("aria-expanded","false");
  }
}
function isMainMenuTarget(target){
  var nav=document.getElementById("main-nav");
  var btn=document.querySelector(".menu-toggle");
  return !!((nav && nav.contains(target)) || (btn && btn.contains(target)));
}
function toggleMainMenu(ev){
  if(ev) ev.stopPropagation();
  var nav=document.getElementById("main-nav");
  var btn=document.querySelector(".menu-toggle");
  if(!nav || !btn) return;
  var open=!nav.classList.contains("open");
  if(open){
    nav.classList.add("open");
    btn.classList.add("open");
  } else {
    nav.classList.remove("open");
    btn.classList.remove("open");
  }
  btn.setAttribute("aria-expanded", open ? "true" : "false");
}
document.addEventListener("pointerdown", function(e){
  if(!isMainMenuTarget(e.target)) closeMainMenu();
}, true);
document.addEventListener("click", function(e){
  var menuLink=e.target.closest ? e.target.closest("#main-nav a") : null;
  if(menuLink){
    closeMainMenu();
    return;
  }
  if(isMainMenuTarget(e.target)) return;
  closeMainMenu();
});
document.addEventListener("keydown", function(e){
  if(e.key === "Escape") closeMainMenu();
});
window.addEventListener("pagehide", closeMainMenu);

var T = {
"de": {
  "hl": "Kr\u00f6ker",
  "hs": "Mennonitische Familiengeschichte \u00b7 1864\u20132026",
  "htg": "Kontakt: @eugen30",
  "pp-label": "PayPal Spende",
  "n0": "STARTSEITE", "n1": "STAMMBAUM", "n2": "GESCHICHTE",
  "n3": "ZEITLEISTE", "n4": "FORSCHUNG", "n5": "AKTUALISIERUNGEN",
  "ht": "Familie Kr\u00f6ker",
  "hx": "Mennonitische Familiengeschichte \u2014 von Preu\u00dfen \u00fcber Wolhynien und Kasachstan nach Deutschland",
  "s0": "Startseite", "s1": "Stammbaum", "s2": "Geschichte der Familie",
  "s3": "Zeitleiste", "s4": "Forschungsstand", "s5": "Aktualisierungen",
  "it": "\u00dcber dieses Projekt",
  "i": "Diese Website dokumentiert die Geschichte der Familie Kroeker \u2014 einer mennonitischen Familie mit Wurzeln in Westpreu\u00dfen, die \u00fcber Wolhynien (Ukraine) nach Kasachstan und schlie\u00dflich nach Deutschland gelangte.",
  "pt": "Der Weg der Familie",
  "p": "Westpreu\u00dfen (vor 1864) \u2192 Wolhynien / Ukraine (1864\u20131941) \u2192 Kasachstan, Dorf Sennoje (1941\u20131955) \u2192 Russland, Schachty (1955\u20132019) \u2192 Deutschland, Berlin (ab 2019)",
  "qt": "\u2753 Hauptfrage der Forschung",
  "q": "Wer ist der biologische Vater von Wladimir Nikolajewitsch Usachew (geb. 08.04.1950, Sennoje, Nordkasachstan)? In der urspr\u00fcnglichen Geburtseintragung steht der Vater nur als \u201eWassili\u201c \u2014 laut Angaben von Emma Iwanowna selbst. Ob er den Familiennamen Kr\u00f6ker trug, ist nicht belegt. Seine Identit\u00e4t ist die Hauptfrage der Familienforschung.",
  "c1n": "Johann Kroeker", "c1d": "* 15.11.1864, Wolhynien (Dorf unbekannt)", "c1r": "Urgro\u00dfvater / \u041f\u0440\u0430\u043f\u0440\u0430\u0434\u0435\u0434",
  "c2n": "Emma Iwanowna Kroeker", "c2d": "* 05.05.1924, Uwarowka/Alexandrowka \u2192 Kasachstan", "c2r": "Gro\u00dfmutter / \u0411\u0430\u0431\u0443\u0448\u043a\u0430",
  "c3n": "Eugen Usachew", "c3d": "* 1979, Schachty \u00b7 Berlin", "c3r": "Projektleiter / \u0410\u0432\u0442\u043e\u0440",
  "mn": "Mennonit", "uk": "Unbekannt",
  "tn-gs": "Gottlieb Schulz", "td-gs": "? \u2013 ? \u00b7 Wolhynien",
  "tn-ka": "??? Kroeker", "td-ka": "? \u2013 ? \u00b7 Westpreu\u00dfen",
  "tn-jo": "Johann Kroeker", "td-jo": "* 15.11.1864\nWolhynien (Dorf unbekannt)", "tt-jo": "Urgro\u00dfvater",
  "tn-es": "Emma geb. Schulz", "td-es": "* 11.11.1884\nWolhynien\n(Wiktorowka, Kiew)", "tt-es": "Urgro\u00dfmutter",
  "tn-wa": "??? Wassili (Nachname unbekannt)", "td-wa": "? \u00b7 Kasachstan ~1949",
  "tn-ei": "Emma Iwanowna Kroeker", "td-ei": "* 05.05.1924\nUwarowka/Alexandrowka\nPulin, Kiew\n\u2020 02.05.1987, Schachty", "tt-ei": "Gro\u00dfmutter",
  "tn-vl": "Vladimir N. Usachew", "td-vl": "* 08.04.1950, Sennoje\n\u2020 06.08.2023, Schachty", "tt-vl": "Vater",
  "tn-lj": "Ljubow K.", "td-lj": "* 1952\nStawropolski kraj", "tt-lj": "Mutter",
  "tn-eu": "Eugen Usachew", "td-eu": "* 1979, Schachty\nBerlin, Deutschland", "tt-eu": "\u2605 Sie",
  "h1t": "Westpreu\u00dfische Wurzeln (vor 1864)",
  "h1": "Die Familie Kroeker ist eine mennonitische Familie friesischer Herkunft. Die Mennoniten stammten aus den Niederlanden und siedelten sich ab dem 16. Jahrhundert in der Region Danzig (Westpreu\u00dfen, heute Polen) an. Sie sprachen Plautdietsch und lebten als friedliche Glaubensgemeinschaft. Johann Kroeker trug den russifizierten Namen Iwan Iwanowitsch \u2014 dies deutet auf mehrere Generationen in Russland hin. Die Stammkolonie war Wolhynien (Dorf unbekannt). Das EWZ-Dokument A3342-EWZ50-B019 aus dem Bundesarchiv Berlin soll die preu\u00dfsischen Wurzeln kl\u00e4ren.",
  "h2t": "Wolhynien \u2014 Ukraine (1864\u20131941)",
  "h2": "Johann Kröker (Iwan Iwanowitsch) wurde am 15. November 1864 in Wolhynien geboren (genaues Dorf unbekannt, laut EWZ-Akte Bundesarchiv Berlin, Film B019, Kader 1340). Er starb auf der Wolhynien — genaues Datum und Ort unbekannt. Laut der Autobiographie seiner Tochter Lydia war sie etwa 7 Jahre alt als er starb, also um 1924. Emma Gotlibowna Schulz wurde am 11. November 1884 in Wolhynien geboren, stammte aus dem Dorf Wiktorowka, Baryschiw-Rayon, Kiewer Oblast. Ihr Vater war Gottlieb Schulz. Laut EWZ-Akte waren die Großeltern von Lydia: väterlicherseits Gottlieb Kröker und (Name unbekannt); mütterlicherseits Gottlieb Schulz und (Name unbekannt). Alle vier Großeltern waren 100% deutschen Ursprungs. Die Familie Kröker war mennonitischen Glaubens — dies belegen die klassischen mennonitischen Familiennamen Kröker und Dreger sowie der spätere Wohnort Halbstadt (Zaporizhzhia Oblast), historisches Zentrum der Mennonitensiedlungen in der Ukraine. Tochter Lydia Iwanowna Kröker wurde am 17. April 1917 in Schiljesna (Dnepropetrowsk Oblast) geboren. Nach dem Tod des Vaters besuchte sie nur 3 Jahre die deutsche Schule in Iwanjowka (1925–1928), danach musste sie arbeiten. Laut der Autobiographie von Lydia (EWZ-Akte, Kader 1344–1346): die Familie lebte auf der Wolhynien in Rischelowka (1918–1935). Die Sowjetbehörden zwangen sie ca. 1935, nach Dorf Peski, Charkiwer Oblast umzusiedeln. Dort erlebten sie die Hungersnot 1932–1933 — täglich starben 3–4 Menschen, es gab kaum Brot, die Familie durfte nicht wegziehen. Am 5. Juni 1935 heiratete Lydia in Peski den Edmund Dreger (geb. 22.07.1914, Chabrowka; Vater: Eduard Dreger geb. 1884; Mutter: Hulda geb. Hintz geb. 1891, Konfession: evangelisch-lutherisch). Ihr Mann musste oft abwesend sein da man ihm nicht erlaubte, zu Hause zu bleiben. Sie zogen über Stalino (Donezk) nach Dorf Knarow wo Sohn Leo Dreger am 8. Juni 1937 geboren wurde. Danach mussten sie wieder umziehen — nach Laakopp, Rayon Groß-Tokmak, Saporischschja Oblast. Lydia erkrankte schwer und unterzog sich zwei Operationen. Ihre Mutter pflegte sie bis zur Genesung. Nach Genesung arbeitete Lydia in Halbstadt, Saporischschja Oblast. Tochter Emma Iwanowna Kröker wurde am 05.05.1924 in Uwarowka (Geburtsurkunde, restauriert 1965) bzw. Alexandrowka (Archivakte), Puliner Rayon, Kiewer Oblast geboren.",
  "h3b-t": "Biographie von Lydia Dreger geb. Kröker — eigenhändig verfasst (EWZ-Akte, 1944)",
  "h3b": "Lydia Dreger, geborene Kröker, schrieb ihre Biographie eigenhändig für die EWZ-Naturalisierungsakte (Kader 1344–1346). Hier ihr Bericht in eigenen Worten:\n\nIch wurde in Schiljesna, Dnepropetrowsk Oblast geboren, bin aber auf der Wolhynien aufgewachsen, in Rischelowka. Als ich 7 Jahre alt war, starb mein Vater. In die Schule bin ich nur 3 Jahre gegangen — in Iwanjowka, 1925–1928 — danach musste ich arbeiten. Als der Kolchos gegründet wurde, mussten wir eintreten.\n\nBis 1935 siedelten uns die bolschewistischen Behörden nach Dorf Peski, Charkiwer Oblast um. Dort waren die Bedingungen sehr schwer. Im Jahr 1933 erlebten wir eine große Hungersnot — jeden Tag starben 3 bis 4 Menschen. Es gab kein Brot und wegziehen durfte man nicht. Wir mussten wieder im Kolchos arbeiten.\n\nAm 5. Juni 1935 heiratete ich in Peski Edmund Dreger. Mein Mann musste oft weg, da man ihm nicht erlaubte zu Hause zu bleiben. Wir zogen über Stalino (Donezk) nach Knarow, wo am 8. Juni 1937 unser Sohn Leo geboren wurde. Später mussten wir wieder umziehen — nach Laakopp, Rayon Groß-Tokmak, Saporischschja Oblast.\n\nIch erkrankte schwer und wurde dreimal operiert. Meine Mutter pflegte mich bis zur Genesung. Nach der Genesung arbeitete ich in Halbstadt, Saporischschja Oblast. Dann kam mein Mann nach Hause und wir lebten in Laakopp.\n\nAm 6. September 1941 wurde mein Mann von den Sowjets deportiert. Seitdem habe ich keine Nachricht mehr von ihm.\n\nAm 30. September 1941 brachten sie mich und meinen Sohn Leo zum Bahnhof zur Deportation. Aber deutsche Soldaten kamen und befreiten uns — und wir konnten nach Hause zurückfahren.\n\nIm Jahr 1943 verließen wir die Ukraine. Wir hatten sehr viel Glück, dass wir es schafften.\n\nIm Februar 1944 kamen wir ins Lager Hermannsbad (Warthegau), wo wir einen Monat blieben. Am 7. März 1944 wurden wir in Quartiere verlegt — Gut Serozki, Gemeinde Koneck, Kreis Hermannsbad.\n\nDas Lebenslauf-Dokument endet mit der Unterschrift von Lydia Dreger.",
  "h3t": "Deportation nach Kasachstan (1941)",
  "h3": "Am 6. September 1941 wurde Edmund Dreger aus dem Dorf Laakopp (Rayon Groß-Tokmak, Saporischschja Oblast) von den Sowjetbehörden deportiert. Lydia erhielt seitdem keinerlei Nachricht mehr von ihm. Am 30. September 1941 wurde Lydia mit Sohn Leo zum Bahnhof gebracht zur Deportation. Deutsche Soldaten verhinderten dies und die Familie konnte nach Hause zurückfahren. Im Oktober 1941 wurden Emma Iwanowna Kröker (geb. 05.05.1924, damals 17 Jahre) und ihre Mutter Emma Gotlibowna aus dem Dorf Peski, Zweretschansky Rayon, Charkiwer Oblast nach Dorf Sennoje, Sowjetski Rayon, Nordkasachstan deportiert. Dies belegen die Archivakte des Charkiwer Innenministeriums und die Rehabilitierungsbescheinigung der Generalstaatsanwaltschaft Kasachstan (1993). Im Jahr 1943 verließ Lydia mit Sohn Leo die Ukraine. Laut ihrer Autobiographie hatten sie sehr viel Glück dass sie es schafften. Im Februar 1944 kamen sie ins Lager Hermannsbad (Warthegau). Am 7. März 1944 wurden sie in Quartiere verlegt — Gut Serozki, Gem. Koneck, Kr. Hermannsbad. Am 28. April 1944 stellte Lydia Dreger geb. Kröker den Einbürgerungsantrag in Hermannsbad (EWZ-Nr. 906 134, Kommission XXX). Die Feststellung: Familie 100% deutschen Ursprungs, gut Deutsch sprechend, mennonitischen Glaubens, keine Einwände gegen Einbürgerung. Das Zeugnis wurde am 12. Juni 1944 in Koneck/Hermannsbad ausgehändigt. Lydia und Leo erhielten die deutsche Staatsbürgerschaft. Die Entscheidung lautete: EINGEBURGERT. Deutsche Familie, hat deutschen Charakter vollständig bewahrt. Emma Iwanowna blieb in Kasachstan unter Sondersiedlungsregime bis 16. Dezember 1955. Sie starb am 02. Mai 1987 in Dubowskoje, Rostower Oblast, Alter 62 Jahre. Im Jahr 1993 rehabilitiert.",
  "h4t": "Kasachstan und Russland (1950\u20132019)",
  "h4": "Im Dorf Sennoje lernte Emma Iwanowna einen Mann namens Wassili kennen. Am 8. April 1950 wurde Sohn Wladimir geboren. Laut Geburtsurkunde (Kasachstan, 2014): Vater \u2014 Kr\u00f6ker Wassili, Mutter \u2014 Kr\u00f6ker Emma Iwanowna, Nationalit\u00e4t: Deutsche.  Ein Wassili Franziskowitsch Kr\u00f6ker (1912, Krim) wurde auf openlist.wiki gefunden, wurde aber 1942 mobilisiert und starb vor 1950 \u2014 er kann nicht der biologische Vater sein. Im Jahr 1952 heiratete Emma Iwanowna den Russen Nikolaj Maximowitsch Usachew (Stiefvater). Wladimir Nikolajewitsch Usachew lebte in Schachty, Rostower Oblast und verstarb am 6. August 2023.",
  "h5t": "Deutschland (ab 2019)",
  "h5": "Eugen Usachew wurde am 1979 in Schachty, Rostower Oblast geboren (Geburtsurkunde mit Apostille). Vater: Wladimir Nikolajewitsch Usachew, Nationalit\u00e4t: Deutsch. Mutter: Ljubow K., geb. 1952, Stawropoler Krai, Nationalit\u00e4t: Russisch. Im Jahr 2019 zog Eugen nach Deutschland und lebt in Berlin, Berlin. Im Dezember 2019 \u00e4nderte er seinen Namen (Bundesverwaltungsamt Friedland, 11.12.2019). Im April 2026 erhielt er die EWZ-Dokumente (Film B019, Kader 1340\u20131353) aus MHSBC Kanada, die die Geschichte der Familie Kroeker-Dreger vollst\u00e4ndig belegen.",
  "tl1": "Vorfahren der Familie Kroeker in Westpreu\u00dfen. Auswanderung nach Wolhynien (Ukraine).",
  "tl2": "Johann Kroeker wird am 15. November in Wolhynien geboren (genaues Dorf unbekannt).",
  "tl3": "Emma Gotlibowna Schulz wird in Wiktorowka, Baryschiw-Rayon, Kiew geboren. Gottlieb Schulz ist ihr Vater.",
  "tl4": "Lydia Iwanowna Kr\u00f6ker wird am 17.04.1917 in Schelesnjak, Kr. Artemowsk geboren.",
  "tl5": "Emma Iwanowna Kr\u00f6ker wird am 05.05.1924 in Uwarowka/Alexandrowka, Puliner Rayon, Kiewer Oblast geboren.",
  "tl6b": "Familie wird von Sowjetbeh\u00f6rden aus Wolhynien nach Dorf Peski, Charkiwer Oblast zwangsumgesiedelt.",
  "tl6c": "Lydia heiratet am 5. Juni 1935 in Peski den Edmund Dreger (geb. 22.07.1914, Chabrowka). Sohn Leo wird am 8. Juni 1937 in Knowrow geboren.",
  "tl6d": "Edmund Dreger (Lydias Ehemann) wird deportiert (laut EWZ-Akte).",
  "tl6": "Oktober: Deportation aus Dorf Peski, Zweretschansky Rayon, Charkiwer Oblast nach Dorf Sennoje, Nordkasachstan. Emma Iwanowna (17 Jahre) und Mutter Emma Gotlibowna. Edmund Dreger ebenfalls deportiert.",
  "tl6e": "Lydia flieht mit Sohn Leo zusammen mit deutschen Truppen aus der Ukraine.",
  "tl6f": "28. April: Lydia und Leo erhalten deutsche Staatsb\u00fcrgerschaft in Hermannsbad (EWZ-Nr. 906 134).",
  "tl7": "8. April: Wladimir wird in Sennoje geboren. Vater in urspr\u00fcnglicher Eintragung nur: \u201eWassili\u201c (Nachname unbekannt).",
  "tl8": "Emma Iwanowna heiratet Nikolaj Maximowitsch Usachew (Stiefvater von Wladimir).",
  "tl9": "16. Dezember: Entlassung aus dem Sondersiedlungsregime.",
  "tl10": "25. Januar: Eugen Usachew wird in Schachty geboren.",
  "tl12": "2. Mai: Emma Iwanowna Kroeker stirbt in Dubowskoje, Rostower Oblast, Alter 62 Jahre.",
  "tl11": "Emma Iwanowna offiziell rehabilitiert (Republik Kasachstan).",
  "tl13": "Eugen zieht nach Deutschland. Namens\u00e4nderung zu \u201eEugen Usachew\u201c (Bundesverwaltungsamt Friedland, 11.12.2019).",
  "tl14": "6. August: Wladimir Usachew stirbt in Schachty.",
  "tl15": "April: EWZ-Dokumente aus MHSBC Kanada erhalten (Film B019, Kader 1340\u20131353). Aktive Familienforschung in 5 Archiven.",
  "ra": "Archiv / Institution", "rw": "Was wird gesucht", "rs": "Status", "rd": "Frist",
  "r-done": "Erhalten", "r-wait": "Wartend", "r-prog": "In Arbeit", "r-deny": "Abgelehnt \u00d72",
  "ul": "Letzte Aktualisierung: 23. April 2026",
  "u0d": "23. April 2026 \u2014 Kasachstan", "u0t": "Antwort des Justizministeriums SKO erhalten. Antrag weitergeleitet an NAO Pravitelstvo dlja grazhdanin SKO (Nr. ZhT-2026-01503067). Frist: ~5. Mai 2026. Erbeten: Erstakt Vladimir Usachew (08.04.1950, Sennoje, Nr. 13) mit Vaterdaten.",
  "u1d": "22. April 2026 \u2014 EWZ-Dokumente", "u1t": "EWZ50 Film B019, Kader 1340\u20131353 erhalten (MHSBC Kanada). Lydia Dreger geb. Kr\u00f6ker, *17.04.1917. Vater Johann *15.11.1864. Mutter Emma geb. Schulz *11.11.1884. Heirat Lydia+Edmund 05.06.1935 in Peski. Sohn Leo *08.06.1937. Edmund Dreger 1941 deportiert. Einb\u00fcrgerung 28.04.1944 Hermannsbad.",
  "u2d": "22. April 2026", "u2t": "Anfrage an MHSBC Kanada gesendet. Website auf GitHub Pages ver\u00f6ffentlicht.",
  "u3d": "21. April 2026", "u3t": "Antrag an Bundesarchiv Berlin \u2014 Akte Edmund Dreger (R 9361-IV/18702).",
  "u4d": "20. April 2026", "u4t": "Neue Anfrage an SBU Ukraine + GUMWS Charkiw.",
  "u5d": "13. April 2026", "u5t": "Beschwerde beim ukrainischen Ombudsmann (Nr. E-25482.3/26).",
  "u6d": "06. April 2026", "u6t": "MWD Charkiw: zweiter Ablehnungsbescheid.",
  "n6": "RESSOURCEN",
  "s6": "Ressourcen & Links",
  "r-search-title": "Suche auf der Website",
  "r-search-desc": "Geben Sie einen Namen, Ort oder ein Jahr ein, um in der Familiengeschichte zu suchen.",
  "r-grandma": "Die gr\u00f6\u00dfte Datenbank mennonitischer Genealogie weltweit. Eugen Usachew hat eine 2-Jahres-Mitgliedschaft. Suche nach: Kr\u00f6ker, Dreger, Schulz.",
  "r-odessa": "Datenbank der Mennoniten aus Russland und der Ukraine. Kostenlos, sehr umfangreich. Suche nach: Kr\u00f6ker, Wolhynien (Dorf unbekannt).",
  "r-other-title": "Weitere Ressourcen",
  "copyright": "&copy; 2026 Eugen Usachew. Diese Website und alle darauf enthaltenen Materialien (Texte, Dokumente, Forschungsergebnisse) wurden ausschlie&szlig;lich zu Informationszwecken erstellt. Die Vervielf&auml;ltigung, Verbreitung oder Verwendung der Inhalte ohne ausdr&uuml;ckliche schriftliche Zustimmung des Autors ist nicht gestattet.",
  "tree-g": "Johann Kroeker * 1864",
  "tree-e": "Emma Iwanowna * 1924",
  "tree-v": "Vladimir Usachew * 1950",
  "hist-1": "Westpreußische Wurzeln",
  "hist-2": "Wolhynien 1864–1941",
  "hist-3": "Deportation 1941",
  "hist-4": "Kasachstan 1950–2019",
  "hist-5": "Deutschland ab 2019",
  "res-mhsbc": "MHSBC Kanada ✔",
  "res-barch": "Bundesarchiv Berlin",
  "res-kaz": "NAO Kasachstan ~05.05",
  "upd-new": "Letzte Aktualisierungen",
  "upd-all": "Alle Einträge",
  "res-other": "Weitere Ressourcen",
  "n7": "KARTE", "n8": "KONTAKT",
  "s7": "Interaktive Karte", "s8": "Kontakt",
  "cnt-years": "Jahre seit 1864",
  "cnt-km": "km Familienreise",
  "cnt-gen": "Generationen",
  "chip-years": "Jahre",
  "chip-km": "km",
  "chip-gen": "Gen.",
  "map-desc": "Die wichtigsten Orte der Familiengeschichte auf einer interaktiven Karte. Klicken Sie auf einen Marker f\u00fcr mehr Informationen.",
  "map-l1": "Ursprung", "map-l2": "Stammkolonie",
  "map-l3": "Zwangsumsiedlung", "map-l4": "Deportation",
  "map-l5": "Sowjetzeit", "map-l6": "Heute",
  "con-why-t": "Warum dieser Kontakt?",
  "con-why": "Wenn Sie Nachkommen der Familie Kr\u00f6ker, Dreger, Schulz oder Usachew kennen oder selbst dazugeh\u00f6ren \u2014 oder wenn Sie Informationen \u00fcber den biologischen Gro\u00dfvater (nur als \u201eWassili\u201c bekannt) haben \u2014 melden Sie sich bitte! Jeder Hinweis ist wertvoll.",
  "con-how-t": "So erreichen Sie mich",
  "con-donate": "Spende / Donate",
  "con-donate-sub": "PayPal — f\u00fcr die Forschung",
  "con-search-t": "Wen suche ich?",
  "con-search": "Ich suche Nachkommen oder Informationen zu folgenden Familiennamen:",
  "con-names": "Kr\u00f6ker / Kroeker / Kröker \u2022 Dreger \u2022 Schulz (aus Wiktorowka, Kiew) \u2022 Usachew / Usachev \u2022 \nBesonders: Leo Dreger (* 08.06.1937, Knowrow) \u2014 Sohn von Lydia Dreger geb. Kr\u00f6ker \u2022 \nWassili (Nachname unbekannt) \u2014 Kasachstan ~1949–1950",
  "map-title": "Der Weg der Familie Kroeker — eine Karte",
  "svg-map-title": "Familie Kroeker",
  "svg-map-sub": "Der Weg der mennonitischen Familie \u00b7 1864\u20132026",
  "visits-label": "Besucherstatistik",
  "visits-sub": "Klicken Sie auf den Link um die vollst\u00e4ndige Statistik zu sehen",
  "ft": "Familie Kroeker \u00b7 Usachew \u00b7 Berlin 2026 \u00b7 Erstellt von Eugen Usachew"
},
"ru": {
  "hl": "\u041a\u0440\u0451\u043a\u0435\u0440",
  "hs": "\u041c\u0435\u043d\u043d\u043e\u043d\u0438\u0442\u0441\u043a\u0430\u044f \u0438\u0441\u0442\u043e\u0440\u0438\u044f \u0441\u0435\u043c\u044c\u0438 \u00b7 1864\u20132026",
  "htg": "\u041a\u043e\u043d\u0442\u0430\u043a\u0442: @eugen30",
  "pp-label": "PayPal \u043f\u043e\u0436\u0435\u0440\u0442\u0432\u043e\u0432\u0430\u043d\u0438\u0435",
  "n0": "\u0413\u041b\u0410\u0412\u041d\u0410\u042f", "n1": "\u0414\u0420\u0415\u0412\u041e", "n2": "\u0418\u0421\u0422\u041e\u0420\u0418\u042f",
  "n3": "\u0425\u0420\u041e\u041d\u041e\u041b\u041e\u0413\u0418\u042f", "n4": "\u0418\u0421\u0421\u041b\u0415\u0414\u041e\u0412\u0410\u041d\u0418\u0415", "n5": "\u041e\u0411\u041d\u041e\u0412\u041b\u0415\u041d\u0418\u042f",
  "ht": "\u0421\u0435\u043c\u044c\u044f \u041a\u0440\u0451\u043a\u0435\u0440",
  "hx": "\u0418\u0441\u0442\u043e\u0440\u0438\u044f \u043c\u0435\u043d\u043d\u043e\u043d\u0438\u0442\u0441\u043a\u043e\u0439 \u0441\u0435\u043c\u044c\u0438 \u2014 \u0438\u0437 \u041f\u0440\u0443\u0441\u0441\u0438\u0438 \u0447\u0435\u0440\u0435\u0437 \u0412\u043e\u043b\u044b\u043d\u044c \u0438 \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d \u0432 \u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044e",
  "s0": "\u0413\u043b\u0430\u0432\u043d\u0430\u044f", "s1": "\u0414\u0440\u0435\u0432\u043e", "s2": "\u0418\u0441\u0442\u043e\u0440\u0438\u044f \u0441\u0435\u043c\u044c\u0438",
  "s3": "\u0425\u0440\u043e\u043d\u043e\u043b\u043e\u0433\u0438\u044f", "s4": "\u0418\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u044f", "s5": "\u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u044f",
  "it": "\u041e \u043f\u0440\u043e\u0435\u043a\u0442\u0435",
  "i": "\u0421\u0430\u0439\u0442 \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u0438\u0440\u0443\u0435\u0442 \u0438\u0441\u0442\u043e\u0440\u0438\u044e \u0441\u0435\u043c\u044c\u0438 \u041a\u0440\u0451\u043a\u0435\u0440 \u2014 \u043c\u0435\u043d\u043d\u043e\u043d\u0438\u0442\u0441\u043a\u043e\u0439 \u0441\u0435\u043c\u044c\u0438 \u0441 \u043a\u043e\u0440\u043d\u044f\u043c\u0438 \u0432 \u0417\u0430\u043f\u0430\u0434\u043d\u043e\u0439 \u041f\u0440\u0443\u0441\u0441\u0438\u0438, \u043f\u0440\u043e\u0448\u0435\u0434\u0448\u0435\u0439 \u0447\u0435\u0440\u0435\u0437 \u0412\u043e\u043b\u044b\u043d\u044c \u0438 \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d \u0432 \u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044e.",
  "pt": "\u041f\u0443\u0442\u044c \u0441\u0435\u043c\u044c\u0438",
  "p": "\u0417\u0430\u043f\u0430\u0434\u043d\u0430\u044f \u041f\u0440\u0443\u0441\u0441\u0438\u044f (\u0434\u043e 1864) \u2192 \u0412\u043e\u043b\u044b\u043d\u044c / \u0423\u043a\u0440\u0430\u0438\u043d\u0430 (1864\u20131941) \u2192 \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d, \u0441. \u0421\u0435\u043d\u043d\u043e\u0435 (1941\u20131955) \u2192 \u0420\u043e\u0441\u0441\u0438\u044f, \u0428\u0430\u0445\u0442\u044b (1955\u20132019) \u2192 \u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044f, \u0411\u0435\u0440\u043b\u0438\u043d (\u0441 2019)",
  "qt": "\u2753 \u0413\u043b\u0430\u0432\u043d\u044b\u0439 \u0432\u043e\u043f\u0440\u043e\u0441 \u0438\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u044f",
  "q": "Кто этот Василий — биологический отец Владимира (р. 08.04.1950, с. Сенное)? В первичной записи отец записан только как «Василий» — со слов Эммы Ивановны. Фамилия неизвестна. Его личность — главный вопрос исследования.",
  "c1n": "\u0418\u043e\u0433\u0430\u043d\u043d \u041a\u0440\u0451\u043a\u0435\u0440", "c1d": "* 15.11.1864, \u0425\u0438\u0440\u0448\u0430\u0443, \u0412\u043e\u043b\u044b\u043d\u044c", "c1r": "\u041f\u0440\u0430\u043f\u0440\u0430\u0434\u0435\u0434",
  "c2n": "\u042d\u043c\u043c\u0430 \u0418\u0432\u0430\u043d\u043e\u0432\u043d\u0430 \u041a\u0440\u0435\u043a\u0435\u0440", "c2d": "* 05.05.1924, \u0423\u0432\u0430\u0440\u043e\u0432\u043a\u0430/\u0410\u043b\u0435\u043a\u0441\u0430\u043d\u0434\u0440\u043e\u0432\u043a\u0430 \u2192 \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d", "c2r": "\u0411\u0430\u0431\u0443\u0448\u043a\u0430",
  "c3n": "\u0415\u0432\u0433\u0435\u043d\u0438\u0439 \u0423\u0441\u0430\u0447\u0435\u0432", "c3d": "* 1979, \u0428\u0430\u0445\u0442\u044b \u00b7 \u0411\u0435\u0440\u043b\u0438\u043d", "c3r": "\u0410\u0432\u0442\u043e\u0440 \u043f\u0440\u043e\u0435\u043a\u0442\u0430",
  "mn": "\u041c\u0435\u043d\u043d\u043e\u043d\u0438\u0442", "uk": "\u041d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u0435\u043d",
  "tn-gs": "\u0413\u043e\u0442\u043b\u0438\u0431 \u0428\u0443\u043b\u044c\u0446", "td-gs": "? \u2013 ? \u00b7 \u0412\u043e\u043b\u044b\u043d\u044c",
  "tn-ka": "??? \u041a\u0440\u0451\u043a\u0435\u0440", "td-ka": "? \u2013 ? \u00b7 \u0417\u0430\u043f. \u041f\u0440\u0443\u0441\u0441\u0438\u044f",
  "tn-jo": "\u0418\u043e\u0433\u0430\u043d\u043d \u041a\u0440\u0451\u043a\u0435\u0440", "td-jo": "* 15.11.1864\n\u0412\u043e\u043b\u044b\u043d\u044c\n(\u0434\u0435\u0440\u0435\u0432\u043d\u044f \u043d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u0430)\n\u2020 \u0434\u0430\u0442\u0430 \u043d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u0430", "tt-jo": "\u041f\u0440\u0430\u043f\u0440\u0430\u0434\u0435\u0434",
  "tn-es": "\u042d\u043c\u043c\u0430 \u0443\u0440\u043e\u0436\u0434. \u0428\u0443\u043b\u044c\u0446", "td-es": "* 11.11.1884\n\u0412\u043e\u043b\u044b\u043d\u044c\n(\u0412\u0438\u043a\u0442\u043e\u0440\u043e\u0432\u043a\u0430, \u041a\u0438\u0435\u0432)", "tt-es": "\u041f\u0440\u0430\u043f\u0440\u0430\u0431\u0430\u0431\u0443\u0448\u043a\u0430",
  "tn-wa": "??? \u0412\u0430\u0441\u0438\u043b\u0438\u0439 \u041a\u0440\u0435\u043a\u0435\u0440", "td-wa": "? \u00b7 \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d ~1949",
  "tn-ei": "\u042d\u043c\u043c\u0430 \u0418\u0432\u0430\u043d\u043e\u0432\u043d\u0430 \u041a\u0440\u0435\u043a\u0435\u0440", "td-ei": "* 05.05.1924\n\u0423\u0432\u0430\u0440\u043e\u0432\u043a\u0430/\u0410\u043b\u0435\u043a\u0441\u0430\u043d\u0434\u0440\u043e\u0432\u043a\u0430\n\u041f\u0443\u043b\u0438\u043d, \u041a\u0438\u0435\u0432\n\u2020 02.05.1987, \u0428\u0430\u0445\u0442\u044b", "tt-ei": "\u0411\u0430\u0431\u0443\u0448\u043a\u0430",
  "tn-vl": "\u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440 \u041d. \u0423\u0441\u0430\u0447\u0435\u0432", "td-vl": "* 08.04.1950, \u0421\u0435\u043d\u043d\u043e\u0435\n\u2020 06.08.2023, \u0428\u0430\u0445\u0442\u044b", "tt-vl": "\u041e\u0442\u0435\u0446",
  "tn-lj": "\u041b\u044e\u0431\u043e\u0432\u044c \u041a.", "td-lj": "* 1952\n\u0421\u0442\u0430\u0432\u0440\u043e\u043f\u043e\u043b\u044c\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439", "tt-lj": "\u041c\u0430\u0442\u044c",
  "tn-eu": "\u0415\u0432\u0433\u0435\u043d\u0438\u0439 \u0423\u0441\u0430\u0447\u0435\u0432", "td-eu": "* 1979, \u0428\u0430\u0445\u0442\u044b\n\u0411\u0435\u0440\u043b\u0438\u043d, \u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044f", "tt-eu": "\u2605 \u0412\u044b",
  "h1t": "\u041f\u0440\u0443\u0441\u0441\u043a\u0438\u0435 \u043a\u043e\u0440\u043d\u0438 (\u0434\u043e 1864)",
  "h1": "\u0421\u0435\u043c\u044c\u044f \u041a\u0440\u0451\u043a\u0435\u0440 \u2014 \u043c\u0435\u043d\u043d\u043e\u043d\u0438\u0442\u0441\u043a\u0430\u044f \u0441\u0435\u043c\u044c\u044f \u0444\u0440\u0438\u0437\u0441\u043a\u043e\u0433\u043e \u043f\u0440\u043e\u0438\u0441\u0445\u043e\u0436\u0434\u0435\u043d\u0438\u044f. \u041c\u0435\u043d\u043d\u043e\u043d\u0438\u0442\u044b \u043f\u0440\u0438\u0448\u043b\u0438 \u0438\u0437 \u041d\u0438\u0434\u0435\u0440\u043b\u0430\u043d\u0434\u043e\u0432 \u0438 \u0441 XVI \u0432\u0435\u043a\u0430 \u0436\u0438\u043b\u0438 \u0432 \u0440\u0430\u0439\u043e\u043d\u0435 \u0414\u0430\u043d\u0446\u0438\u0433\u0430 (\u0417\u0430\u043f\u0430\u0434\u043d\u0430\u044f \u041f\u0440\u0443\u0441\u0441\u0438\u044f). \u0413\u043e\u0432\u043e\u0440\u0438\u043b\u0438 \u043d\u0430 \u043f\u043b\u0430\u0443\u0442\u0434\u0438\u0447, \u0436\u0438\u043b\u0438 \u043c\u0438\u0440\u043d\u043e\u0439 \u043e\u0431\u0449\u0438\u043d\u043e\u0439. \u0418\u043e\u0433\u0430\u043d\u043d \u041a\u0440\u0451\u043a\u0435\u0440 \u043d\u043e\u0441\u0438\u043b \u0440\u0443\u0441\u0441\u0438\u0444\u0438\u0446\u0438\u0440\u043e\u0432\u0430\u043d\u043d\u043e\u0435 \u0438\u043c\u044f \u0418\u0432\u0430\u043d \u0418\u0432\u0430\u043d\u043e\u0432\u0438\u0447 \u2014 \u0437\u043d\u0430\u0447\u0438\u0442 \u0441\u0435\u043c\u044c\u044f \u0436\u0438\u043b\u0430 \u0432 \u0420\u043e\u0441\u0441\u0438\u0438 \u043d\u0435\u0441\u043a\u043e\u043b\u044c\u043a\u043e \u043f\u043e\u043a\u043e\u043b\u0435\u043d\u0438\u0439. \u041f\u0440\u043e\u0438\u0441\u0445\u043e\u0436\u0434\u0435\u043d\u0438\u0435 \u0438\u0437 \u041f\u0440\u0443\u0441\u0441\u0438\u0438 \u0434\u043e\u043b\u0436\u0435\u043d \u043f\u0440\u043e\u044f\u0441\u043d\u0438\u0442\u044c \u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442 EWZ A3342-EWZ50-B019 \u0438\u0437 \u0411\u0443\u043d\u0434\u0435\u0441\u0430\u0440\u0445\u0438\u0432\u0430 \u0411\u0435\u0440\u043b\u0438\u043d\u0430.",
  "h2t": "\u0412\u043e\u043b\u044b\u043d\u044c \u2014 \u0423\u043a\u0440\u0430\u0438\u043d\u0430 (1864\u20131941)",
  "h2": "Иоганн Крёкер (Иван Иванович) родился 15.11.1864 на Волыни (точная деревня неизвестна, подтверждено EWZ-анкетой, фильм B019, кадр 1340). Умер на Волыни — точная дата и место неизвестны. По автобиографии Лидии ей было ок. 7 лет когда он умер, то есть около 1924 г. Эмма Готлибовна Шульц родилась 11.11.1884 на Волыни, родом из с. Викторовка, Барышевский район. Её отец: Готлиб Шульц. Дедушки Лидии: по отцу — Готлиб Крёкер, по матери — Готлиб Шульц (имена бабушек неизвестны). Семья Крёкер была меннонитской — это подтверждают фамилии Крёкер и Дрегер, а также проживание в Гальбштадте (Запорожская обл.) — историческом центре меннонитских колоний. Дочь Лидия родилась 17.04.1917 в Шилесне (Днепропетровская обл.). После смерти отца училась только 3 года в немецкой школе в Иваньовке (1925–1928). Семья жила в Рищелёвке (Волынь) до 1935 г. Ок. 1935 советская власть принудительно переселила семью в с. Пески, Харьковская обл. Голод 1932–1933: ежедневно 3–4 человека умирало, хлеба не было, уехать не разрешалось. 5.06.1935: брак Лидии с Эдмундом Дрегером (р. 22.07.1914, Чабровка; отец: Эдуард Дрегер р. 1884; мать: Хульда урожд. Хинц р. 1891; конфессия: евангельско-лютеранская). Переехали через Сталино (Донецк) в Кнаров, где 08.06.1937 родился сын Лео. Затем переехали в Лаакопп, район Большой Токмак, Запорожская обл. Лидия тяжело заболела — две операции, мать ухаживала её. После выздоровления работала в Гальбштадте. Дочь Эмма Ивановна родилась 05.05.1924 в с. Уваровка/Александровка, Пулинский район, Киевская обл.",
  "h3b-t": "Биография Лидии Дрегер урожд. Крёкер — написана ею собственноручно (EWZ-дело, 1944)",
  "h3b": "Лидия Дрегер, урождённая Крёкер, собстворучно написала свою биографию для EWZ-дела (кадры 1344–1346). Вот её рассказ своими словами:\n\nЯ родилась в Шилесне, Днепропетровская область, но выросла на Волыни, в Рищелёвке. Когда мне было 7 лет, умер отец. В школе я училась всего 3 года — в Иваньовке, 1925–1928 — потом пришлось работать. Когда основали колхоз, мы были обязаны вступить.\n\nДо 1935 года большевистские власти принудительно переселили нас в с. Пески, Харьковская обл. Условия были очень тяжёлыми. В 1933 году мы пережили страшный голод — каждый день умирало 3–4 человека. Хлеба не было, уехать не разрешалось. Снова колхоз.\n\n5 июня 1935 г. я вышла замуж в Песках за Эдмунда Дрегера. Муж часто был вынужден уезжать — ему не разрешали оставаться дома. Мы переехали через Сталино (Донецк) в Кнаров, где 8 июня 1937 родился наш сын Лео. Потом переехали в Лаакопп, район Большой Токмак, Запорожская обл.\n\nЯ тяжело заболела и перенесла две операции. Мать ухаживала меня до выздоровления. После выздоровления работала в Гальбштадте. Потом муж вернулся домой и мы жили в Лаакоппе.\n\n6 сентября 1941 г. мужа депортировали советские власти. С тех пор никаких известий о нём не было.\n\n30 сентября 1941 г. меня с сыном Лео привезли на станцию для депортации. Но пришли немецкие солдаты и освободили нас — мы смогли вернуться домой.\n\nВ 1943 году мы покинули Украину. Нам очень повезло добраться.\n\nВ феврале 1944 г. мы прибыли в лагерь Херманнсбад (Вартегау), где пробыли месяц. 7 марта 1944 г. нас перевели на квартиры — имение Сероцки, община Конек. 28 апреля 1944 г. я подала заявление о принятии в немецкое гражданство. Свидетельство получено 12 июня 1944 г.",
  "h3t": "\u0414\u0435\u043f\u043e\u0440\u0442\u0430\u0446\u0438\u044f \u0432 \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d (1941)",
  "h3": "6 сентября 1941 г. Эдмунд Дрегер депортирован из с. Лаакопп, район Большой Токмак, Запорожская обл. Лидия больше не получала о нём никаких известий. 30 сентября 1941 г. Лидию с сыном Лео привезли на станцию для депортации — немецкие солдаты помешали этому и семья вернулась домой. В октябре 1941 г. Эмма Ивановна (17 лет) и её мать Эмма Готлибовна депортированы из с. Пески, Харьковская обл. в с. Сенное, Северо-Казахстанская обл. В 1943 г. Лидия с Лео ушла на запад. По её словам — им очень повезло добраться. Февраль 1944: лагерь Херманнсбад. 7 марта 1944: переведены в имение Сероцки. 28 апреля 1944 г.: Лидия подала заявление о принятии в немецкое гражданство (EWZ-Nr. 906 134). Заключение: семья 100% немецкого происхождения, хорошо говорит по-немецки, меннонитской веры. Свидетельство вручено 12 июня 1944 г. Решение: НАТУРАЛИЗОВАНА. Немецкая семья, полностью сохранила немецкий характер. Эмма Ивановна осталась в Казахстане на спецпоселении до 16.12.1955. Умерла 02.05.1987 в Дубовском, 62 года. Реабилитирована в 1993 г.",
  "h4t": "\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d \u0438 \u0420\u043e\u0441\u0441\u0438\u044f (1950\u20132019)",
  "h4": "\u0412 \u0441. \u0421\u0435\u043d\u043d\u043e\u0435 \u042d\u043c\u043c\u0430 \u0418\u0432\u0430\u043d\u043e\u0432\u043d\u0430 \u043f\u043e\u0437\u043d\u0430\u043a\u043e\u043c\u0438\u043b\u0430\u0441\u044c \u0441 \u0412\u0430\u0441\u0438\u043b\u0438\u0435\u043c \u041a\u0440\u0435\u043a\u0435\u0440\u043e\u043c. 08.04.1950 \u0440\u043e\u0434\u0438\u043b\u0441\u044f \u0441\u044b\u043d \u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440. \u0421\u0432-\u0432\u043e \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d (2014): \u043e\u0442\u0435\u0446 \u041a\u0440\u0451\u043a\u0435\u0440 \u0412\u0430\u0441\u0438\u043b\u0438\u0439, \u043c\u0430\u0442\u044c \u041a\u0440\u0451\u043a\u0435\u0440 \u042d\u043c\u043c\u0430 \u0418\u0432\u0430\u043d\u043e\u0432\u043d\u0430, \u043d\u0430\u0446.: \u043d\u0435\u043c\u043a\u0430. \u041a\u0442\u043e \u0442\u0430\u043a\u043e\u0439 \u0412\u0430\u0441\u0438\u043b\u0438\u0439 \u041a\u0440\u0435\u043a\u0435\u0440 \u2014 \u0433\u043b\u0430\u0432\u043d\u044b\u0439 \u0432\u043e\u043f\u0440\u043e\u0441 \u0438\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u044f. \u0412 1952 \u0433. \u042d\u043c\u043c\u0430 \u0432\u044b\u0448\u043b\u0430 \u0437\u0430\u043c\u0443\u0436 \u0437\u0430 \u041d\u0438\u043a\u043e\u043b\u0430\u044f \u041c. \u0423\u0441\u0430\u0447\u0435\u0432\u0430 (\u043e\u0442\u0447\u0438\u043c). \u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440 \u0423\u0441\u0430\u0447\u0435\u0432 \u0443\u043c\u0435\u0440 06.08.2023 \u0432 \u0428\u0430\u0445\u0442\u0430\u0445.",
  "h5t": "\u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044f (\u0441 2019)",
  "h5": "\u0415\u0432\u0433\u0435\u043d\u0438\u0439 \u0423\u0441\u0430\u0447\u0435\u0432 (\u0440. 1979, \u0428\u0430\u0445\u0442\u044b). \u041e\u0442\u0435\u0446: \u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440 \u041d. \u0423\u0441\u0430\u0447\u0435\u0432, \u043d\u0430\u0446.: \u043d\u0435\u043c\u0435\u0446. \u041c\u0430\u0442\u044c: \u041b\u044e\u0431\u043e\u0432\u044c \u041a., \u0440. 1952, \u0421\u0442\u0430\u0432\u0440\u043e\u043f\u043e\u043b\u044c\u0441\u043a\u0438\u0439 \u043a\u0440\u0430\u0439. \u0412 2019 \u0433. \u043f\u0435\u0440\u0435\u0435\u0445\u0430\u043b \u0432 \u0411\u0435\u0440\u043b\u0438\u043d, \u0441\u043c\u0435\u043d\u0438\u043b \u0438\u043c\u044f (\u0411\u0443\u043d\u0434\u0435\u0441\u0432\u0435\u0440\u0432\u0430\u043b\u0442\u0443\u043d\u0433\u0441\u0430\u043c\u0442, 11.12.2019). \u0412 \u0430\u043f\u0440\u0435\u043b\u0435 2026 \u043f\u043e\u043b\u0443\u0447\u0438\u043b EWZ-\u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u044b \u0438\u0437 MHSBC \u041a\u0430\u043d\u0430\u0434\u0430 (B019, \u043a\u0430\u0434\u0440\u044b 1340\u20131353).",
  "tl1": "\u041f\u0440\u0435\u0434\u043a\u0438 \u0441\u0435\u043c\u044c\u0438 \u041a\u0440\u0451\u043a\u0435\u0440 \u0436\u0438\u0432\u0443\u0442 \u0432 \u0417\u0430\u043f\u0430\u0434\u043d\u043e\u0439 \u041f\u0440\u0443\u0441\u0441\u0438\u0438. \u041f\u0435\u0440\u0435\u0435\u0437\u0434 \u043d\u0430 \u0412\u043e\u043b\u044b\u043d\u044c.",
  "tl2": "\u0418\u043e\u0433\u0430\u043d\u043d \u041a\u0440\u0451\u043a\u0435\u0440 \u0440\u043e\u0436\u0434\u0430\u0435\u0442\u0441\u044f 15.11.1864 \u043d\u0430 \u0412\u043e\u043b\u044b\u043d\u0438 (\u0434\u0435\u0440\u0435\u0432\u043d\u044f \u043d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u0430). \u0423\u043c\u0435\u0440 \u043d\u0430 \u0412\u043e\u043b\u044b\u043d\u0438 \u2014 \u0434\u0430\u0442\u0430 \u043d\u0435\u0438\u0437\u0432\u0435\u0441\u0442\u043d\u0430. \u041f\u043e \u0430\u0432\u0442\u043e\u0431\u0438\u043e\u0433\u0440\u0430\u0444\u0438\u0438 \u041b\u0438\u0434\u0438\u0438 \u0435\u0439 \u0431\u044b\u043b\u043e \u043e\u043a. 7 \u043b\u0435\u0442 \u043a\u043e\u0433\u0434\u0430 \u043e\u043d \u0443\u043c\u0435\u0440.",
  "tl3": "\u042d\u043c\u043c\u0430 \u0413\u043e\u0442\u043b\u0438\u0431\u043e\u0432\u043d\u0430 \u0428\u0443\u043b\u044c\u0446 \u0440\u043e\u0436\u0434\u0430\u0435\u0442\u0441\u044f \u0432 \u0441. \u0412\u0438\u043a\u0442\u043e\u0440\u043e\u0432\u043a\u0430, \u0411\u0430\u0440\u044b\u0448\u0435\u0432\u0441\u043a\u0438\u0439 \u0440\u0430\u0439\u043e\u043d, \u041a\u0438\u0435\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b.",
  "tl4": "\u041b\u0438\u0434\u0438\u044f \u0418\u0432\u0430\u043d\u043e\u0432\u043d\u0430 \u041a\u0440\u0451\u043a\u0435\u0440 \u0440\u043e\u0436\u0434\u0430\u0435\u0442\u0441\u044f 17.04.1917, \u0416\u0435\u043b\u0435\u0437\u043d\u044f\u043a.",
  "tl5": "\u042d\u043c\u043c\u0430 \u0418\u0432\u0430\u043d\u043e\u0432\u043d\u0430 \u041a\u0440\u0451\u043a\u0435\u0440 \u0440\u043e\u0436\u0434\u0430\u0435\u0442\u0441\u044f 05.05.1924, \u0423\u0432\u0430\u0440\u043e\u0432\u043a\u0430/\u0410\u043b\u0435\u043a\u0441\u0430\u043d\u0434\u0440\u043e\u0432\u043a\u0430, \u041f\u0443\u043b\u0438\u043d\u0441\u043a\u0438\u0439 \u0440\u0430\u0439\u043e\u043d.",
  "tl6b": "\u041f\u0440\u0438\u043d\u0443\u0434\u0438\u0442\u0435\u043b\u044c\u043d\u043e\u0435 \u043f\u0435\u0440\u0435\u0441\u0435\u043b\u0435\u043d\u0438\u0435 \u0441\u0435\u043c\u044c\u0438 \u0432 \u0441. \u041f\u0435\u0441\u043a\u0438, \u0425\u0430\u0440\u044c\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b. \u0413\u043e\u043b\u043e\u0434 1932\u20131933.",
  "tl6c": "\u041b\u0438\u0434\u0438\u044f \u0432\u044b\u0445\u043e\u0434\u0438\u0442 \u0437\u0430\u043c\u0443\u0436 \u0432 \u041f\u0435\u0441\u043a\u0430\u0445 \u0437\u0430 \u042d\u0434\u043c\u0443\u043d\u0434\u0430 \u0414\u0440\u0435\u0433\u0435\u0440\u0430. \u0421\u044b\u043d \u041b\u0435\u043e \u0440\u043e\u0436\u0434\u0430\u0435\u0442\u0441\u044f 08.06.1937.",
  "tl6d": "\u042d\u0434\u043c\u0443\u043d\u0434 \u0414\u0440\u0435\u0433\u0435\u0440 (\u043c\u0443\u0436 \u041b\u0438\u0434\u0438\u0438) \u0434\u0435\u043f\u043e\u0440\u0442\u0438\u0440\u043e\u0432\u0430\u043d (\u0434\u0430\u043d\u043d\u044b\u0435 EWZ).",
  "tl6": "\u041e\u043a\u0442\u044f\u0431\u0440\u044c: \u0434\u0435\u043f\u043e\u0440\u0442\u0430\u0446\u0438\u044f \u0438\u0437 \u0441. \u041f\u0435\u0441\u043a\u0438, \u0414\u0432\u0443\u0440\u0435\u0447\u0430\u043d\u0441\u043a\u0438\u0439 \u0440\u0430\u0439\u043e\u043d, \u0425\u0430\u0440\u044c\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c \u2192 \u0441. \u0421\u0435\u043d\u043d\u043e\u0435, \u0421\u0435\u0432\u0435\u0440\u043e-\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d\u0441\u043a\u0430\u044f \u043e\u0431\u043b\u0430\u0441\u0442\u044c.",
  "tl6e": "\u041b\u0438\u0434\u0438\u044f \u0443\u0445\u043e\u0434\u0438\u0442 \u0441 \u043d\u0435\u043c\u0435\u0446\u043a\u0438\u043c\u0438 \u0432\u043e\u0439\u0441\u043a\u0430\u043c\u0438.",
  "tl6f": "28 \u0430\u043f\u0440\u0435\u043b\u044f: \u041b\u0438\u0434\u0438\u044f \u0438 \u041b\u0435\u043e \u043f\u043e\u043b\u0443\u0447\u0430\u044e\u0442 \u043d\u0435\u043c\u0435\u0446\u043a\u043e\u0435 \u0433\u0440\u0430\u0436\u0434\u0430\u043d\u0441\u0442\u0432\u043e \u0432 \u0425\u0435\u0440\u043c\u0430\u043d\u043d\u0441\u0431\u0430\u0434\u0435.",
  "tl7": "8 \u0430\u043f\u0440\u0435\u043b\u044f: \u0440\u043e\u0436\u0434\u0430\u0435\u0442\u0441\u044f \u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440 \u0432 \u0421\u0435\u043d\u043d\u043e\u043c. \u041e\u0442\u0435\u0446: \u0412\u0430\u0441\u0438\u043b\u0438\u0439 \u041a\u0440\u0435\u043a\u0435\u0440.",
  "tl8": "\u042d\u043c\u043c\u0430 \u0432\u044b\u0445\u043e\u0434\u0438\u0442 \u0437\u0430\u043c\u0443\u0436 \u0437\u0430 \u041d\u0438\u043a\u043e\u043b\u0430\u044f \u0423\u0441\u0430\u0447\u0435\u0432\u0430 (\u043e\u0442\u0447\u0438\u043c).",
  "tl9": "16 \u0434\u0435\u043a\u0430\u0431\u0440\u044f: \u0441\u043d\u044f\u0442\u0438\u0435 \u0441 \u0443\u0447\u0451\u0442\u0430 \u0441\u043f\u0435\u0446\u043f\u043e\u0441\u0435\u043b\u0435\u043d\u0438\u044f.",
  "tl10": "25 \u044f\u043d\u0432\u0430\u0440\u044f: \u0440\u043e\u0436\u0434\u0430\u0435\u0442\u0441\u044f \u0415\u0432\u0433\u0435\u043d\u0438\u0439 \u0423\u0441\u0430\u0447\u0435\u0432 \u0432 \u0428\u0430\u0445\u0442\u0430\u0445.",
  "tl12": "2 \u043c\u0430\u044f: \u0443\u043c\u0438\u0440\u0430\u0435\u0442 \u042d\u043c\u043c\u0430 \u0418\u0432\u0430\u043d\u043e\u0432\u043d\u0430 \u0432 \u0414\u0443\u0431\u043e\u0432\u0441\u043a\u043e\u043c, 62 \u0433\u043e\u0434\u0430.",
  "tl11": "\u0420\u0435\u0430\u0431\u0438\u043b\u0438\u0442\u0430\u0446\u0438\u044f \u042d\u043c\u043c\u044b \u0418\u0432\u0430\u043d\u043e\u0432\u043d\u044b (\u0420\u0435\u0441\u043f\u0443\u0431\u043b\u0438\u043a\u0430 \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d).",
  "tl13": "\u0415\u0432\u0433\u0435\u043d\u0438\u0439 \u043f\u0435\u0440\u0435\u0435\u0437\u0436\u0430\u0435\u0442 \u0432 \u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044e, \u043c\u0435\u043d\u044f\u0435\u0442 \u0438\u043c\u044f \u043d\u0430 Eugen Usachew.",
  "tl14": "6 \u0430\u0432\u0433\u0443\u0441\u0442\u0430: \u0443\u043c\u0438\u0440\u0430\u0435\u0442 \u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440 \u0423\u0441\u0430\u0447\u0435\u0432 \u0432 \u0428\u0430\u0445\u0442\u0430\u0445.",
  "tl15": "\u041f\u043e\u043b\u0443\u0447\u0435\u043d\u044b EWZ-\u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u044b \u0438\u0437 MHSBC \u041a\u0430\u043d\u0430\u0434\u0430.",
  "ra": "\u0410\u0440\u0445\u0438\u0432 / \u0423\u0447\u0440\u0435\u0436\u0434\u0435\u043d\u0438\u0435", "rw": "\u0427\u0442\u043e \u0438\u0449\u0435\u043c", "rs": "\u0421\u0442\u0430\u0442\u0443\u0441", "rd": "\u0421\u0440\u043e\u043a",
  "r-done": "\u041f\u043e\u043b\u0443\u0447\u0435\u043d\u043e", "r-wait": "\u041e\u0436\u0438\u0434\u0430\u0435\u043c", "r-prog": "\u0412 \u0440\u0430\u0431\u043e\u0442\u0435", "r-deny": "\u041e\u0442\u043a\u0430\u0437\u0430\u043d\u043e \u00d72",
  "ul": "\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0435\u0435 \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u0435: 23 \u0430\u043f\u0440\u0435\u043b\u044f 2026",
  "u0d": "23 \u0430\u043f\u0440\u0435\u043b\u044f 2026 \u2014 \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d", "u0t": "\u041f\u043e\u043b\u0443\u0447\u0435\u043d \u043e\u0442\u0432\u0435\u0442 \u0414\u0435\u043f\u0430\u0440\u0442\u0430\u043c\u0435\u043d\u0442\u0430 \u044e\u0441\u0442\u0438\u0446\u0438\u0438 \u0421\u041a\u041e. \u0417\u0430\u043f\u0440\u043e\u0441 \u043f\u0435\u0440\u0435\u043d\u0430\u043f\u0440\u0430\u0432\u043b\u0435\u043d \u0432 \u041d\u0410\u041e \u041f\u0440\u0430\u0432\u0438\u0442\u0435\u043b\u044c\u0441\u0442\u0432\u043e \u0434\u043b\u044f \u0433\u0440\u0430\u0436\u0434\u0430\u043d \u0421\u041a\u041e. \u0421\u0440\u043e\u043a: ~5 \u043c\u0430\u044f 2026. \u0417\u0430\u043f\u0440\u043e\u0448\u0435\u043d\u043e: \u043f\u0435\u0440\u0432\u0438\u0447\u043d\u0430\u044f \u0437\u0430\u043f\u0438\u0441\u044c \u0440\u043e\u0436\u0434\u0435\u043d\u0438\u044f \u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440\u0430 \u0423\u0441\u0430\u0447\u0435\u0432\u0430 (08.04.1950, \u2116 13) \u0441 \u0434\u0430\u043d\u043d\u044b\u043c\u0438 \u043e\u0431 \u043e\u0442\u0446\u0435.",
  "u1d": "22 \u0430\u043f\u0440\u0435\u043b\u044f 2026 \u2014 EWZ-\u0434\u043e\u043a\u0443\u043c\u0435\u043d\u0442\u044b", "u1t": "\u041f\u043e\u043b\u0443\u0447\u0435\u043d\u044b EWZ50 B019, \u043a\u0430\u0434\u0440\u044b 1340\u20131353 \u0438\u0437 MHSBC \u041a\u0430\u043d\u0430\u0434\u0430. \u041b\u0438\u0434\u0438\u044f \u0414\u0440\u0435\u0433\u0435\u0440 \u0443\u0440\u043e\u0436\u0434. \u041a\u0440\u0451\u043a\u0435\u0440, *17.04.1917. \u0411\u0440\u0430\u043a 05.06.1935 \u0432 \u041f\u0435\u0441\u043a\u0430\u0445. \u041b\u0435\u043e *08.06.1937. \u042d\u043c\u043c\u0430 \u0413\u043e\u0442\u043b\u0438\u0431\u043e\u0432\u043d\u0430 \u0434\u0435\u043f. 1937. \u0413\u0440\u0430\u0436\u0434\u0430\u043d\u0441\u0442\u0432\u043e 28.04.1944.",
  "u2d": "22 \u0430\u043f\u0440\u0435\u043b\u044f 2026", "u2t": "\u0417\u0430\u043f\u0440\u043e\u0441 \u0432 MHSBC. \u0421\u0430\u0439\u0442 \u043e\u043f\u0443\u0431\u043b\u0438\u043a\u043e\u0432\u0430\u043d.",
  "u3d": "21 \u0430\u043f\u0440\u0435\u043b\u044f 2026", "u3t": "\u0417\u0430\u043f\u0440\u043e\u0441 \u0432 \u0411\u0443\u043d\u0434\u0435\u0441\u0430\u0440\u0445\u0438\u0432 \u0411\u0435\u0440\u043b\u0438\u043d.",
  "u4d": "20 \u0430\u043f\u0440\u0435\u043b\u044f 2026", "u4t": "\u0417\u0430\u043f\u0440\u043e\u0441 \u0432 \u0421\u0411\u0423 \u0423\u043a\u0440\u0430\u0438\u043d\u044b + \u0413\u0423\u041c\u0412\u0421 \u0425\u0430\u0440\u044c\u043a\u043e\u0432.",
  "u5d": "13 \u0430\u043f\u0440\u0435\u043b\u044f 2026", "u5t": "\u0416\u0430\u043b\u043e\u0431\u0430 \u041e\u043c\u0431\u0443\u0434\u0441\u043c\u0435\u043d\u0443 \u0423\u043a\u0440\u0430\u0438\u043d\u044b.",
  "u6d": "6 \u0430\u043f\u0440\u0435\u043b\u044f 2026", "u6t": "\u041c\u0412\u0414 \u0425\u0430\u0440\u044c\u043a\u043e\u0432: \u043e\u0442\u043a\u0430\u0437.",
  "n6": "\u0420\u0415\u0421\u0423\u0420\u0421\u042b",
  "s6": "\u0420\u0435\u0441\u0443\u0440\u0441\u044b & \u0421\u0441\u044b\u043b\u043a\u0438",
  "r-search-title": "\u041f\u043e\u0438\u0441\u043a \u043f\u043e \u0441\u0430\u0439\u0442\u0443",
  "r-search-desc": "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0438\u043c\u044f, \u043c\u0435\u0441\u0442\u043e \u0438\u043b\u0438 \u0433\u043e\u0434 \u0434\u043b\u044f \u043f\u043e\u0438\u0441\u043a\u0430 \u0432 \u0438\u0441\u0442\u043e\u0440\u0438\u0438 \u0441\u0435\u043c\u044c\u0438.",
  "r-grandma": "\u041a\u0440\u0443\u043f\u043d\u0435\u0439\u0448\u0430\u044f \u0431\u0430\u0437\u0430 \u0434\u0430\u043d\u043d\u044b\u0445 \u043c\u0435\u043d\u043d\u043e\u043d\u0438\u0442\u0441\u043a\u043e\u0439 \u0433\u0435\u043d\u0435\u0430\u043b\u043e\u0433\u0438\u0438. \u0418\u0449\u0438\u0442\u0435: \u041a\u0440\u0451\u043a\u0435\u0440, \u0414\u0440\u0435\u0433\u0435\u0440, \u0428\u0443\u043b\u044c\u0446.",
  "r-odessa": "\u0411\u0430\u0437\u0430 \u0434\u0430\u043d\u043d\u044b\u0445 \u043c\u0435\u043d\u043d\u043e\u043d\u0438\u0442\u043e\u0432 \u0438\u0437 \u0420\u043e\u0441\u0441\u0438\u0438 \u0438 \u0423\u043a\u0440\u0430\u0438\u043d\u044b. \u0411\u0435\u0441\u043f\u043b\u0430\u0442\u043d\u0430\u044f, \u043e\u0447\u0435\u043d\u044c \u043e\u0431\u0448\u0438\u0440\u043d\u0430\u044f.",
  "r-other-title": "\u0414\u0440\u0443\u0433\u0438\u0435 \u0440\u0435\u0441\u0443\u0440\u0441\u044b",
  "copyright": "&copy; 2026 Евгений Усачев. Данный сайт и все материалы на нём (тексты, документы, результаты исследований) созданы исключительно в информационных целях. Копирование, распространение или использование материалов без письменного согласия автора запрещено.",
  "tree-g": "\u0418\u043e\u0433\u0430\u043d\u043d \u041a\u0440\u0451\u043a\u0435\u0440 * 1864",
  "tree-e": "\u042d\u043c\u043c\u0430 \u0418\u0432\u0430\u043d\u043e\u0432\u043d\u0430 * 1924",
  "tree-v": "\u0412\u043b\u0430\u0434\u0438\u043c\u0438\u0440 \u0423\u0441\u0430\u0447\u0435\u0432 * 1950",
  "hist-1": "\u041f\u0440\u0443\u0441\u0441\u043a\u0438\u0435 \u043a\u043e\u0440\u043d\u0438",
  "hist-2": "\u0412\u043e\u043b\u044b\u043d\u044c 1864\u20131941",
  "hist-3": "\u0414\u0435\u043f\u043e\u0440\u0442\u0430\u0446\u0438\u044f 1941",
  "hist-4": "\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d 1950\u20132019",
  "hist-5": "\u0413\u0435\u0440\u043c\u0430\u043d\u0438\u044f \u0441 2019",
  "res-mhsbc": "MHSBC \u041a\u0430\u043d\u0430\u0434\u0430 \u2714",
  "res-barch": "\u0411\u0443\u043d\u0434\u0435\u0441\u0430\u0440\u0445\u0438\u0432 \u0411\u0435\u0440\u043b\u0438\u043d",
  "res-kaz": "\u041d\u0410\u041e \u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d ~05.05",
  "upd-new": "\u041f\u043e\u0441\u043b\u0435\u0434\u043d\u0438\u0435 \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u044f",
  "upd-all": "\u0412\u0441\u0435 \u0437\u0430\u043f\u0438\u0441\u0438",
  "res-other": "\u0414\u0440\u0443\u0433\u0438\u0435 \u0440\u0435\u0441\u0443\u0440\u0441\u044b",
  "n7": "\u041a\u0410\u0420\u0422\u0410", "n8": "\u041a\u041e\u041d\u0422\u0410\u041a\u0422",
  "s7": "\u0418\u043d\u0442\u0435\u0440\u0430\u043a\u0442\u0438\u0432\u043d\u0430\u044f \u043a\u0430\u0440\u0442\u0430", "s8": "\u041a\u043e\u043d\u0442\u0430\u043a\u0442",
  "cnt-years": "\u043b\u0435\u0442 \u0441 1864 \u0433\u043e\u0434\u0430",
  "cnt-km": "\u043a\u043c \u043f\u0443\u0442\u0438 \u0441\u0435\u043c\u044c\u0438",
  "cnt-gen": "\u043f\u043e\u043a\u043e\u043b\u0435\u043d\u0438\u0439",
  "chip-years": "\u043b\u0435\u0442",
  "chip-km": "\u043a\u043c",
  "chip-gen": "\u043f\u043e\u043a.",
  "map-desc": "\u0413\u043b\u0430\u0432\u043d\u044b\u0435 \u043c\u0435\u0441\u0442\u0430 \u0438\u0441\u0442\u043e\u0440\u0438\u0438 \u0441\u0435\u043c\u044c\u0438 \u043d\u0430 \u0438\u043d\u0442\u0435\u0440\u0430\u043a\u0442\u0438\u0432\u043d\u043e\u0439 \u043a\u0430\u0440\u0442\u0435.",
  "map-l1": "\u041f\u0440\u043e\u0438\u0441\u0445\u043e\u0436\u0434\u0435\u043d\u0438\u0435", "map-l2": "\u041a\u043e\u043b\u043e\u043d\u0438\u044f",
  "map-l3": "\u041f\u0435\u0440\u0435\u0441\u0435\u043b\u0435\u043d\u0438\u0435", "map-l4": "\u0414\u0435\u043f\u043e\u0440\u0442\u0430\u0446\u0438\u044f",
  "map-l5": "\u0421\u043e\u0432. \u043f\u0435\u0440\u0438\u043e\u0434", "map-l6": "\u0421\u0435\u0433\u043e\u0434\u043d\u044f",
  "con-why-t": "\u0417\u0430\u0447\u0435\u043c \u0441\u0432\u044f\u0437\u044b\u0432\u0430\u0442\u044c\u0441\u044f?",
  "con-why": "\u0415\u0441\u043b\u0438 \u0432\u044b \u0437\u043d\u0430\u0435\u0442\u0435 \u043f\u043e\u0442\u043e\u043c\u043a\u043e\u0432 \u0441\u0435\u043c\u044c\u0438 \u041a\u0440\u0451\u043a\u0435\u0440, \u0414\u0440\u0435\u0433\u0435\u0440, \u0428\u0443\u043b\u044c\u0446 \u0438\u043b\u0438 \u0423\u0441\u0430\u0447\u0435\u0432 \u2014 \u0438\u043b\u0438 \u0435\u0441\u043b\u0438 \u0443 \u0432\u0430\u0441 \u0435\u0441\u0442\u044c \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u043e \u0412\u0430\u0441\u0438\u043b\u0438\u0438 \u041a\u0440\u0435\u043a\u0435\u0440\u0435 \u2014 \u0441\u0432\u044f\u0436\u0438\u0442\u0435\u0441\u044c! \u041a\u0430\u0436\u0434\u0430\u044f \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044f \u0434\u043e\u0440\u043e\u0433\u0430.",
  "con-how-t": "\u041a\u0430\u043a \u0441\u043e \u043c\u043d\u043e\u0439 \u0441\u0432\u044f\u0437\u0430\u0442\u044c\u0441\u044f",
  "con-donate": "\u041f\u043e\u0436\u0435\u0440\u0442\u0432\u043e\u0432\u0430\u043d\u0438\u0435",
  "con-donate-sub": "PayPal \u2014 \u043d\u0430 \u0438\u0441\u0441\u043b\u0435\u0434\u043e\u0432\u0430\u043d\u0438\u044f",
  "con-search-t": "\u041a\u043e\u0433\u043e \u0438\u0449\u0443?",
  "con-search": "\u0418\u0449\u0443 \u043f\u043e\u0442\u043e\u043c\u043a\u043e\u0432 \u0438\u043b\u0438 \u0438\u043d\u0444\u043e\u0440\u043c\u0430\u0446\u0438\u044e \u043e \u0441\u043b\u0435\u0434\u0443\u044e\u0449\u0438\u0445 \u0444\u0430\u043c\u0438\u043b\u0438\u044f\u0445:",
  "con-names": "\u041a\u0440\u0451\u043a\u0435\u0440 / Kroeker / Kr\u00f6ker \u2022 \u0414\u0440\u0435\u0433\u0435\u0440 \u2022 \u0428\u0443\u043b\u044c\u0446 (\u0438\u0437 \u0412\u0438\u043a\u0442\u043e\u0440\u043e\u0432\u043a\u0438, \u041a\u0438\u0435\u0432) \u2022 \u0423\u0441\u0430\u0447\u0435\u0432 \u2022 \n\u041e\u0441\u043e\u0431\u0435\u043d\u043d\u043e: \u041b\u0435\u043e \u0414\u0440\u0435\u0433\u0435\u0440 (* 08.06.1937, \u041a\u043d\u043e\u0440\u043e\u0432\u043e) \u2022 \u0412\u0430\u0441\u0438\u043b\u0438\u0439 \u041a\u0440\u0435\u043a\u0435\u0440 (\u041a\u0430\u0437\u0430\u0445\u0441\u0442\u0430\u043d ~1949)",
  "map-title": "\u041f\u0443\u0442\u044c \u0441\u0435\u043c\u044c\u044f \u041a\u0440\u0451\u043a\u0435\u0440 \u2014 \u043a\u0430\u0440\u0442\u0430",
  "svg-map-title": "\u0421\u0435\u043c\u044c\u044f \u041a\u0440\u0451\u043a\u0435\u0440",
  "svg-map-sub": "\u041f\u0443\u0442\u044c \u043c\u0435\u043d\u043d\u043e\u043d\u0438\u0442\u0441\u043a\u043e\u0439 \u0441\u0435\u043c\u044c\u0438 \u00b7 1864\u20132026",
  "visits-label": "\u0421\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0430 \u043f\u043e\u0441\u0435\u0449\u0435\u043d\u0438\u0439",
  "visits-sub": "\u041d\u0430\u0436\u043c\u0438\u0442\u0435 \u043d\u0430 \u0441\u0441\u044b\u043b\u043a\u0443 \u0447\u0442\u043e\u0431\u044b \u0443\u0432\u0438\u0434\u0435\u0442\u044c \u043f\u043e\u043b\u043d\u0443\u044e \u0441\u0442\u0430\u0442\u0438\u0441\u0442\u0438\u043a\u0443",
  "ft": "\u0421\u0435\u043c\u044c\u044f \u041a\u0440\u0451\u043a\u0435\u0440 \u00b7 \u0423\u0441\u0430\u0447\u0435\u0432 \u00b7 \u0411\u0435\u0440\u043b\u0438\u043d 2026 \u00b7 \u0410\u0432\u0442\u043e\u0440: \u0415\u0432\u0433\u0435\u043d\u0438\u0439 \u0423\u0441\u0430\u0447\u0435\u0432"
},
"en": {
  "hl": "Kroeker",
  "hs": "Mennonite Family History \u00b7 1864\u20132026",
  "htg": "Contact: @eugen30",
  "pp-label": "PayPal Donate",
  "n0": "HOME", "n1": "TREE", "n2": "HISTORY",
  "n3": "TIMELINE", "n4": "RESEARCH", "n5": "UPDATES",
  "ht": "Kroeker Family",
  "hx": "The story of a Mennonite family \u2014 from Prussia through Volhynia and Kazakhstan to Germany",
  "s0": "Home", "s1": "Family Tree", "s2": "Family History",
  "s3": "Timeline", "s4": "Research Status", "s5": "Updates",
  "it": "About This Project",
  "i": "This website documents the history of the Kroeker family \u2014 a Mennonite family with roots in West Prussia that passed through Volhynia (Ukraine) and Kazakhstan before arriving in Germany.",
  "pt": "The Family Journey",
  "p": "West Prussia (before 1864) \u2192 Volhynia / Ukraine (1864\u20131941) \u2192 Kazakhstan, Sennoje (1941\u20131955) \u2192 Russia, Shakhty (1955\u20132019) \u2192 Germany, Berlin (from 2019)",
  "qt": "\u2753 Main Research Question",
  "q": "Who is the biological father of Vladimir Nikolaevich Usachew (born 08.04.1950, Sennoje, North Kazakhstan)? In the original birth record the father is listed only as \u201cWassili\u201d \u2014 based on the words of Emma Iwanovna herself. Whether he bore the surname Kr\u00f6ker is not documented. His identity is the main question of the research.",
  "c1n": "Johann Kroeker", "c1d": "* 15.11.1864, Volhynia (village unknown)", "c1r": "Great-great-grandfather",
  "c2n": "Emma Iwanovna Kroeker", "c2d": "* 05.05.1924, Uwarowka/Alexandrowka \u2192 Kazakhstan", "c2r": "Grandmother",
  "c3n": "Eugen Usachew", "c3d": "* 1979, Shakhty \u00b7 Berlin", "c3r": "Project author",
  "mn": "Mennonite", "uk": "Unknown",
  "tn-gs": "Gottlieb Schulz", "td-gs": "? \u2013 ? \u00b7 Volhynia",
  "tn-ka": "??? Kroeker", "td-ka": "? \u2013 ? \u00b7 West Prussia",
  "tn-jo": "Johann Kroeker", "td-jo": "* 15.11.1864\nVolhynia (village unknown)", "tt-jo": "Great-great-grandfather",
  "tn-es": "Emma nee Schulz", "td-es": "* 11.11.1884\nVolhynia\n(Wiktorowka, Kyiv)", "tt-es": "Great-great-grandmother",
  "tn-wa": "??? Wassili (Nachname unbekannt)", "td-wa": "? \u00b7 Kazakhstan ~1949",
  "tn-ei": "Emma Iwanovna Kroeker", "td-ei": "* 05.05.1924\nUwarowka/Alexandrowka\nPulin, Kyiv\n\u2020 02.05.1987, Shakhty", "tt-ei": "Grandmother",
  "tn-vl": "Vladimir N. Usachew", "td-vl": "* 08.04.1950, Sennoje\n\u2020 06.08.2023, Shakhty", "tt-vl": "Father",
  "tn-lj": "Ljubow K.", "td-lj": "* 1952\nStavropol krai", "tt-lj": "Mother",
  "tn-eu": "Eugen Usachew", "td-eu": "* 1979, Shakhty\nBerlin, Germany", "tt-eu": "\u2605 You",
  "h1t": "Prussian Roots (before 1864)",
  "h1": "The Kroeker family is a Mennonite family of Frisian origin. Mennonites came from the Netherlands and settled in the Danzig region (West Prussia, now Poland) from the 16th century. They spoke Plautdietsch and lived as a peaceful religious community. Johann Kroeker bore the Russified name Ivan Ivanovich, suggesting the family had lived in Russia for several generations. Their colony was Volhynia (village unknown). The EWZ document A3342-EWZ50-B019 from the Federal Archives Berlin should clarify their Prussian origins.",
  "h2t": "Volhynia \u2014 Ukraine (1864\u20131941)",
  "h2": "Johann Kröker (Ivan Ivanovich) was born 15 November 1864 in Volhynia (exact village unknown, confirmed by EWZ file Bundesarchiv Berlin, Film B019 Frame 1340). He died in Volhynia — exact date and place unknown. According to his daughter Lydia's autobiography she was about 7 years old when he died, so approximately 1924. Emma Gotlibovna Schulz was born 11 November 1884 in Volhynia, from village Wiktorowka, Baryschiw district, Kyiv Oblast. Her father was Gottlieb Schulz. Per the EWZ file, Lydia's grandparents were: paternal — Gottlieb Kröker and (name unknown); maternal — Gottlieb Schulz and (name unknown). All four grandparents were 100% German. The Kroeker family were Mennonites — confirmed by the classic Mennonite surnames Kröker and Dreger, and the family's residence in Halbstadt (Zaporizhzhia Oblast), the historical centre of Mennonite colonies in Ukraine. Daughter Lydia Iwanovna Kröker was born 17 April 1917 in Shylesna (Dnipropetrovsk Oblast). After her father's death she attended German school in Ivanyovka only 3 years (1925-1928), then had to work. The family lived in Ryschelovka (Volhynia) until 1935. Around 1935 Soviet authorities forcibly resettled them to Peski village, Kharkiv Oblast. There they suffered the famine of 1932-1933 — 3-4 people died daily, no bread, not allowed to leave. On 5 June 1935 Lydia married Edmund Dreger (born 22.07.1914, Chabrowka; father: Eduard Dreger b.1884; mother: Hulda nee Hintz b.1891; confession: Evangelical Lutheran). They moved via Stalino (Donetsk) to Knarow where son Leo was born 8 June 1937. Then moved to Laakopp, Rayon Gross-Tokmak, Zaporizhzhia Oblast. Lydia fell seriously ill — two operations, nursed by her mother. After recovery worked in Halbstadt. Daughter Emma Iwanovna Kröker was born 05.05.1924 in Uwarowka/Alexandrowka, Pulin district, Kyiv Oblast.",
  "h3b-t": "Biography of Lydia Dreger nee Kröker — written in her own hand (EWZ file, 1944)",
  "h3b": "Lydia Dreger, nee Kroeker, wrote her autobiography by hand for the EWZ naturalisation file (Frames 1344–1346). Here is her account in her own words:\n\nI was born in Shylesna, Dnipropetrovsk Oblast, but grew up in Volhynia, in Ryschelovka. When I was 7 years old my father died. I attended school for only 3 years — in Ivanyovka, 1925–1928 — then I had to work. When the collective farm was founded we were forced to join.\n\nBefore 1935 the Bolshevik authorities forcibly resettled us to Peski village, Kharkiv Oblast. Conditions were very hard. In 1933 we experienced a terrible famine — every day 3 to 4 people died. There was no bread and we were not allowed to leave. Again we had to work on the collective farm.\n\nOn 5 June 1935 I married Edmund Dreger in Peski. My husband was often forced to be away as he was not allowed to stay at home. We moved via Stalino (Donetsk) to Knarow where our son Leo was born on 8 June 1937. Later we had to move again — to Laakopp, Rayon Gross-Tokmak, Zaporizhzhia Oblast.\n\nI fell seriously ill and had two operations. My mother nursed me until I recovered. After recovery I worked in Halbstadt, Zaporizhzhia Oblast. Then my husband came home and we lived in Laakopp.\n\nOn 6 September 1941 my husband was deported by the Soviets. Since then I have had no news of him.\n\nOn 30 September 1941 they took me and my son Leo to the station for deportation. But German soldiers came and freed us — and we were able to return home.\n\nIn 1943 we left Ukraine. We were very lucky to make it.\n\nIn February 1944 we arrived at the camp in Hermannsbad (Warthegau) where we stayed for a month. On 7 March 1944 we were moved to quarters — Gut Serozki, Gemeinde Koneck, Kreis Hermannsbad. On 28 April 1944 I filed for German citizenship. The certificate was handed to me on 12 June 1944.",
  "h3t": "Deportation to Kazakhstan (1941)",
  "h3": "On 6 September 1941 Edmund Dreger was deported from Laakopp village (Rayon Gross-Tokmak, Zaporizhzhia Oblast) by Soviet authorities. Lydia received no news of him after that. On 30 September 1941 Lydia and son Leo were taken to the station for deportation — German soldiers prevented this and the family returned home. In October 1941 Emma Iwanovna (aged 17) and her mother Emma Gotlibovna were deported from Peski village, Kharkiv Oblast to Sennoje village, North Kazakhstan Oblast. In 1943 Lydia and Leo left Ukraine. According to her autobiography they were very lucky to make it. February 1944: camp Hermannsbad (Warthegau). 7 March 1944: moved to quarters at Gut Serozki, Gem. Koneck. On 28 April 1944 Lydia filed for German citizenship (EWZ-Nr. 906 134). Conclusion: family 100% German origin, speaks good German, Mennonite faith, no objections. Certificate handed over 12 June 1944 in Koneck/Hermannsbad. Decision: NATURALIZED. German family, fully preserved German character. Emma Iwanovna remained in Kazakhstan under special settlement until 16 December 1955. She died 02 May 1987 in Dubowskoje, Rostov Oblast, aged 62. Rehabilitated 1993.",
  "h4t": "Kazakhstan and Russia (1950\u20132019)",
  "h4": "In Sennoje Emma Iwanovna met a man named Wassili. On 8 April 1950 son Vladimir was born. Birth certificate (Kazakhstan, 2014): father \u2014 Kroeker Wassili, mother \u2014 Kroeker Emma Iwanovna, nationality: German.  In 1952 Emma married Nikolaj M. Usachew (stepfather). Vladimir Usachew died 6 August 2023 in Shakhty.",
  "h5t": "Germany (from 2019)",
  "h5": "Eugen Usachew born 1979 in Shakhty (birth certificate with Apostille). Father: Vladimir N. Usachew, nationality: German. Mother: Ljubow K., born 1952, Stavropol Krai, nationality: Russian. In 2019 moved to Germany, lives in Berlin, Berlin. Name changed to Eugen Usachew (Bundesverwaltungsamt Friedland, 11.12.2019). In April 2026 received EWZ documents from MHSBC Canada (Film B019, Frames 1340\u20131353).",
  "tl1": "Kroeker ancestors live in West Prussia. Migration to Volhynia, Ukraine.",
  "tl2": "Johann Kroeker born 15 November in Volhynia (exact village unknown).",
  "tl3": "Emma Gotlibovna Schulz born in Wiktorowka, Baryschiw district, Kyiv Oblast.",
  "tl4": "Lydia Iwanovna Kroeker born 17.04.1917 in Schelesnjak.",
  "tl5": "Emma Iwanovna Kroeker born 05.05.1924, Uwarowka/Alexandrowka, Pulin district.",
  "tl6b": "Family forcibly resettled to Peski village, Kharkiv Oblast. Famine 1932\u20131933.",
  "tl6c": "Lydia marries Edmund Dreger on 5 June 1935 in Peski. Son Leo born 8 June 1937.",
  "tl6d": "Edmund Dreger (Lydia's husband) deported (EWZ data).",
  "tl6": "October: deportation from Peski, Dvurechansky district, Kharkiv Oblast to Sennoje, North Kazakhstan Oblast.",
  "tl6e": "Lydia leaves Ukraine with German forces.",
  "tl6f": "28 April: Lydia and Leo receive German citizenship in Hermannsbad.",
  "tl7": "8 April: Vladimir born in Sennoje. Father in original record only: \u201cWassili\u201d (surname unknown).",
  "tl8": "Emma marries Nikolaj Usachew (stepfather).",
  "tl9": "16 December: release from special settlement regime.",
  "tl10": "25 January: Eugen Usachew born in Shakhty.",
  "tl12": "2 May: Emma Iwanovna dies in Dubowskoje, Rostov Oblast, aged 62.",
  "tl11": "Emma Iwanovna officially rehabilitated (Republic of Kazakhstan).",
  "tl13": "Eugen moves to Germany. Name changed to Eugen Usachew.",
  "tl14": "6 August: Vladimir Usachew dies in Shakhty.",
  "tl15": "April: EWZ documents received from MHSBC Canada (Film B019, Frames 1340\u20131353).",
  "ra": "Archive / Institution", "rw": "What We Are Looking For", "rs": "Status", "rd": "Deadline",
  "r-done": "Received", "r-wait": "Waiting", "r-prog": "In progress", "r-deny": "Denied x2",
  "ul": "Last updated: 23 April 2026",
  "u0d": "23 April 2026 \u2014 Kazakhstan", "u0t": "Reply received from Justice Dept. SKO. Request forwarded to NAO Government for Citizens SKO (No. ZhT-2026-01503067). Deadline: ~5 May 2026. Requested: original birth record Vladimir Usachew (08.04.1950, No. 13) with father details.",
  "u1d": "22 April 2026 \u2014 EWZ Documents", "u1t": "Received EWZ50 B019 Frames 1340\u20131353 from MHSBC Canada. Lydia Dreger nee Kroeker *17.04.1917. Marriage 05.06.1935 Peski. Leo *08.06.1937. Edmund Dreger deported 1941. Citizenship 28.04.1944.",
  "u2d": "22 April 2026", "u2t": "Request sent to MHSBC Canada. Website published on GitHub Pages.",
  "u3d": "21 April 2026", "u3t": "Application to Federal Archives Berlin \u2014 file Edmund Dreger (R 9361-IV/18702).",
  "u4d": "20 April 2026", "u4t": "New request to SBU Ukraine + GUMWS Kharkiv.",
  "u5d": "13 April 2026", "u5t": "Re-complaint to Ukrainian Ombudsman (No. E-25482.3/26).",
  "u6d": "6 April 2026", "u6t": "MWD Kharkiv: second refusal.",
  "n6": "RESOURCES",
  "s6": "Resources & Links",
  "r-search-title": "Search the Website",
  "r-search-desc": "Enter a name, place or year to search the family history.",
  "r-grandma": "The largest Mennonite genealogy database worldwide. Eugen Usachew has a 2-year membership. Search for: Kr\u00f6ker, Dreger, Schulz.",
  "r-odessa": "Database of Mennonites from Russia and Ukraine. Free, very extensive. Search for: Kr\u00f6ker, Volhynia (village unknown).",
  "r-other-title": "Other Resources",
  "copyright": "&copy; 2026 Eugen Usachew. This website and all materials contained herein (texts, documents, research results) were created exclusively for informational purposes. Reproduction, distribution or use of the content without the express written consent of the author is not permitted.",
  "tree-g": "Johann Kroeker * 1864",
  "tree-e": "Emma Iwanovna * 1924",
  "tree-v": "Vladimir Usachew * 1950",
  "hist-1": "Prussian roots",
  "hist-2": "Volhynia 1864–1941",
  "hist-3": "Deportation 1941",
  "hist-4": "Kazakhstan 1950–2019",
  "hist-5": "Germany from 2019",
  "res-mhsbc": "MHSBC Canada ✔",
  "res-barch": "Federal Archives Berlin",
  "res-kaz": "NAO Kazakhstan ~05.05",
  "upd-new": "Latest updates",
  "upd-all": "All entries",
  "res-other": "Other resources",
  "n7": "MAP", "n8": "CONTACT",
  "s7": "Interactive Map", "s8": "Contact",
  "cnt-years": "years since 1864",
  "cnt-km": "km family journey",
  "cnt-gen": "generations",
  "chip-years": "years",
  "chip-km": "km",
  "chip-gen": "gen.",
  "map-desc": "Key locations of the family history on an interactive map. Click a marker for more information.",
  "map-l1": "Origins", "map-l2": "Home colony",
  "map-l3": "Forced resettlement", "map-l4": "Deportation",
  "map-l5": "Soviet era", "map-l6": "Today",
  "con-why-t": "Why contact?",
  "con-why": "If you know descendants of the Kr\u00f6ker, Dreger, Schulz or Usachew families \u2014 or if you have information about the biological grandfather (known only as \u201cWassili\u201d) \u2014 please get in touch! Every piece of information is valuable.",
  "con-how-t": "How to reach me",
  "con-donate": "Donate",
  "con-donate-sub": "PayPal \u2014 support the research",
  "con-search-t": "Who am I looking for?",
  "con-search": "I am looking for descendants or information about the following families:",
  "con-names": "Kr\u00f6ker / Kroeker \u2022 Dreger \u2022 Schulz (from Wiktorowka, Kyiv) \u2022 Usachew \u2022 \nEspecially: Leo Dreger (* 08.06.1937, Knowrow) \u2022 Wassili (surname unknown) \u2014 Kazakhstan ~1949",
  "map-title": "The Kroeker family journey — a map",
  "svg-map-title": "Kroeker Family",
  "svg-map-sub": "Mennonite family journey \u00b7 1864\u20132026",
  "visits-label": "Visitor Statistics",
  "visits-sub": "Click the link to see full statistics",
  "ft": "Kroeker \u00b7 Usachew Family History \u00b7 Berlin 2026 \u00b7 Created by Eugen Usachew"
}
};

function g(id){ return document.getElementById(id); }

var SEO_TEXT = {
  de: {
    "seo-intro-title": "Kroeker Familiengeschichte und Genealogie",
    "seo-intro-p1": "Diese Website dokumentiert die Geschichte der Familie Kroeker von Preußen über Wolhynien, Kasachstan und Deutschland. Sie sammelt genealogische Notizen, Familienzweige, Archivhinweise und Wanderungswege der Familien Kroeker, Schulz, Dreger und Fröhlich.",
    "seo-intro-p2": "Die Forschung konzentriert sich auf mennonitische und wolhyniendeutsche Wurzeln, deutsche Siedler in Kasachstan, EWZ-Unterlagen, Familienerinnerungen und Archivanfragen zu Westpreußen, Wolhynien, Ukraine, Nordkasachstan und Deutschland.",
    "seo-link-tree": "Kroeker Stammbaum",
    "seo-link-history": "Geschichte der Familie Kroeker",
    "seo-link-timeline": "Migrationschronologie",
    "seo-link-research": "Archivforschung",
    "seo-link-contact": "Kontakt und Verwandte",
    "seo-branches-title": "Familiennamen und Zweige",
    "seo-kroeker-title": "Familie Kroeker / Kröker",
    "seo-kroeker-p1": "Die Linie Kroeker ist mit Westpreußen, Wolhynien und später Kasachstan und Deutschland verbunden. Wichtige Namen sind Johann Kroeker / Johann Kröker und Emma Iwanowna Kroeker.",
    "seo-kroeker-link": "Siehe Kroeker Stammbaum",
    "seo-and-1": "und",
    "seo-timeline-link": "Migrationschronologie",
    "seo-schulz-title": "Familie Schulz aus Wolhynien",
    "seo-schulz-p1": "Der Zweig Schulz umfasst Gottlieb Schulz und Emma Gotlibowna Schulz aus Wolhynien. Dieser Zweig ist wichtig für Suchanfragen zu Schulz Wolhynien Genealogie und Wolhyniendeutschen.",
    "seo-schulz-link": "Siehe auch Geschichte der Familie Schulz",
    "seo-dreger-title": "Familie Dreger in Wolhynien",
    "seo-dreger-p1": "Der Zweig Dreger ist mit Lydia Dreger, Edmund Dreger, Leo Dreger und EWZ-Dokumenten von 1944 verbunden. Dieser Abschnitt hilft Verwandten, die nach Dreger-Familienunterlagen aus Wolhynien suchen.",
    "seo-dreger-link": "Siehe Dreger Archivforschung",
    "seo-froehlich-title": "Familie Fröhlich / Froehlich",
    "seo-froehlich-p1": "Der Familienname Fröhlich erscheint im weiteren Forschungs- und Archivkontext. Alternative Schreibweisen wie Froehlich können Verwandten helfen, diese Seite über Google zu finden.",
    "seo-froehlich-link": "Informationen zur Familie Fröhlich senden",
    "seo-relatives-title": "Suchen Sie Verwandte?",
    "seo-relatives-p1": "Wenn Sie zu den Familien Kroeker, Kröker, Schulz, Dreger oder Fröhlich aus Preußen, Wolhynien, Ukraine, Kasachstan, Russland oder Deutschland forschen, melden Sie sich bitte. Familiendokumente, alte Fotos, Archivhinweise und DNA-Treffer können helfen, die Zweige zu verbinden.",
    "seo-telegram-line": "Telegram: <a href=\"https://t.me/eugen30\" target=\"_blank\" rel=\"noopener\">@eugen30</a>",
    "seo-dna-line": "DNA-Forschung: <a href=\"https://www.gedmatch.com/\" target=\"_blank\" rel=\"noopener\">GEDmatch</a> sowie MyHeritage-Treffer sind willkommen.",
    "seo-clues-line": "Hilfreiche Hinweise: Familiennamen, Geburtsdaten, Dörfer, Deportationsunterlagen, EWZ-Akten und Familiengeschichten."
  },
  ru: {
    "seo-intro-title": "История и генеалогия семьи Kroeker / Крёкер",
    "seo-intro-p1": "Этот сайт документирует историю семьи Kroeker / Крёкер от Пруссии через Волынь и Казахстан до Германии. Здесь собраны генеалогические заметки, семейные ветви, архивные сведения и маршруты переселения семей Kroeker, Schulz, Dreger и Fröhlich.",
    "seo-intro-p2": "Исследование посвящено меннонитским и волынско-немецким корням, немецким переселенцам в Казахстане, документам EWZ, семейным воспоминаниям и архивным запросам по Западной Пруссии, Волыни, Украине, Северному Казахстану и Германии.",
    "seo-link-tree": "Древо семьи Kroeker",
    "seo-link-history": "История семьи Kroeker",
    "seo-link-timeline": "Хронология переселения",
    "seo-link-research": "Архивные исследования",
    "seo-link-contact": "Контакт и родственники",
    "seo-branches-title": "Фамилии и семейные ветви",
    "seo-kroeker-title": "Семья Kroeker / Крёкер",
    "seo-kroeker-p1": "Линия Kroeker связана с Западной Пруссией, Волынью, затем Казахстаном и Германией. Важные имена: Johann Kroeker / Johann Kröker и Emma Iwanowna Kroeker.",
    "seo-kroeker-link": "Смотреть древо Kroeker",
    "seo-and-1": "и",
    "seo-timeline-link": "хронологию переселения",
    "seo-schulz-title": "Семья Schulz из Волыни",
    "seo-schulz-p1": "Ветвь Schulz включает Gottlieb Schulz и Emma Gotlibovna Schulz из Волыни. Эта ветвь важна для поиска Schulz Wolhynien genealogy и волынских немцев.",
    "seo-schulz-link": "Смотреть историю семьи Schulz",
    "seo-dreger-title": "Семья Dreger на Волыни",
    "seo-dreger-p1": "Ветвь Dreger связана с Lydia Dreger, Edmund Dreger, Leo Dreger и документами EWZ 1944 года. Этот раздел помогает родственникам, которые ищут сведения о семье Dreger на Волыни.",
    "seo-dreger-link": "Смотреть архивные исследования Dreger",
    "seo-froehlich-title": "Семья Fröhlich / Froehlich",
    "seo-froehlich-p1": "Фамилия Fröhlich встречается в расширенном семейном и архивном контексте. Вариант написания Froehlich помогает родственникам найти страницу через Google.",
    "seo-froehlich-link": "Отправить сведения о семье Fröhlich",
    "seo-relatives-title": "Ищете родственников?",
    "seo-relatives-p1": "Если вы исследуете семьи Kroeker, Крёкер, Schulz, Dreger или Fröhlich из Пруссии, Волыни, Украины, Казахстана, России или Германии, пожалуйста, свяжитесь со мной. Семейные документы, старые фотографии, архивные ссылки и совпадения ДНК помогут соединить ветви.",
    "seo-telegram-line": "Telegram: <a href=\"https://t.me/eugen30\" target=\"_blank\" rel=\"noopener\">@eugen30</a>",
    "seo-dna-line": "ДНК-исследования: <a href=\"https://www.gedmatch.com/\" target=\"_blank\" rel=\"noopener\">GEDmatch</a>, а также совпадения MyHeritage приветствуются.",
    "seo-clues-line": "Полезные сведения: фамилии, даты рождения, деревни, документы о депортации, EWZ-акты и семейные истории."
  },
  en: {
    "seo-intro-title": "Kroeker Family History and Genealogy",
    "seo-intro-p1": "This website documents the Kroeker family history from Prussia to Volhynia, Kazakhstan and Germany. It collects genealogy notes, family branches, archival references and migration routes connected with the Kroeker, Schulz, Dreger and Fröhlich families.",
    "seo-intro-p2": "The research focuses on Mennonite and Volhynian German roots, German settlers in Kazakhstan, EWZ records, family memories and archive requests related to West Prussia, Wolhynien, Ukraine, North Kazakhstan and Germany.",
    "seo-link-tree": "Kroeker family tree",
    "seo-link-history": "Kroeker family history",
    "seo-link-timeline": "Migration timeline",
    "seo-link-research": "Archive research",
    "seo-link-contact": "Contact and relatives",
    "seo-branches-title": "Family Surnames and Branches",
    "seo-kroeker-title": "Kroeker / Kröker Family",
    "seo-kroeker-p1": "The Kroeker family line is connected with West Prussia, Volhynia and later Kazakhstan and Germany. Key names include Johann Kroeker / Johann Kröker and Emma Iwanowna Kroeker.",
    "seo-kroeker-link": "See the Kroeker family tree",
    "seo-and-1": "and",
    "seo-timeline-link": "migration timeline",
    "seo-schulz-title": "Schulz Family from Wolhynien",
    "seo-schulz-p1": "The Schulz branch includes Gottlieb Schulz and Emma Gotlibovna Schulz from Volhynia. This branch is important for searches around Schulz Wolhynien genealogy and Volhynian Germans.",
    "seo-schulz-link": "See also Schulz family history",
    "seo-dreger-title": "Dreger Family in Volhynia",
    "seo-dreger-p1": "The Dreger branch is connected with Lydia Dreger, Edmund Dreger, Leo Dreger and EWZ documents from 1944. This section helps relatives searching for Dreger family Volhynia records.",
    "seo-dreger-link": "See Dreger archive research",
    "seo-froehlich-title": "Fröhlich / Froehlich Family",
    "seo-froehlich-p1": "The Fröhlich surname appears in the wider family research and archival context. Alternative spellings such as Froehlich may help relatives find the page through Google search.",
    "seo-froehlich-link": "Send Fröhlich family information",
    "seo-relatives-title": "Looking for relatives?",
    "seo-relatives-p1": "If you are researching the Kroeker, Kröker, Schulz, Dreger or Fröhlich families from Prussia, Volhynia, Ukraine, Kazakhstan, Russia or Germany, please get in touch. Family documents, old photos, archive references and DNA matches can help connect the branches.",
    "seo-telegram-line": "Telegram: <a href=\"https://t.me/eugen30\" target=\"_blank\" rel=\"noopener\">@eugen30</a>",
    "seo-dna-line": "DNA research: <a href=\"https://www.gedmatch.com/\" target=\"_blank\" rel=\"noopener\">GEDmatch</a> and MyHeritage matches are welcome.",
    "seo-clues-line": "Useful clues: surnames, birth dates, villages, deportation records, EWZ files and family stories."
  }
};

function translateSeoBlock(){
  var t = SEO_TEXT[lang] || SEO_TEXT.de;
  Object.keys(t).forEach(function(id){
    var el = g(id);
    if(el) el.innerHTML = t[id];
  });
}

var CONTACT_FORM_TEXT = {
  de: {
    "contact-form-title": "Nachricht senden",
    "contact-form-note": "Schreiben Sie kurz, zu welcher Familie, welchem Ort oder welchem DNA-Treffer Ihre Nachricht gehört. Beim Absenden wird eine E-Mail an Eugen vorbereitet.",
    "contact-label-name": "Name",
    "contact-label-relation": "Familie / Ort / GEDmatch",
    "contact-label-message": "Nachricht",
    "contact-submit": "Per E-Mail senden",
    "contact-status-ready": "",
    "contact-status-sent": "Das E-Mail-Fenster wurde geöffnet. Bitte die Nachricht dort absenden."
  },
  ru: {
    "contact-form-title": "Отправить сообщение",
    "contact-form-note": "Напишите коротко, к какой семье, месту или ДНК-совпадению относится сообщение. При отправке откроется письмо на email Евгена.",
    "contact-label-name": "Имя",
    "contact-label-relation": "Семья / место / GEDmatch",
    "contact-label-message": "Сообщение",
    "contact-submit": "Отправить на email",
    "contact-status-ready": "",
    "contact-status-sent": "Окно письма открыто. Нажмите отправку в почтовой программе."
  },
  en: {
    "contact-form-title": "Send a message",
    "contact-form-note": "Write briefly which family, place or DNA match your message is about. When you send it, an email to Eugen is prepared.",
    "contact-label-name": "Name",
    "contact-label-relation": "Family / place / GEDmatch",
    "contact-label-message": "Message",
    "contact-submit": "Send by email",
    "contact-status-ready": "",
    "contact-status-sent": "The email window was opened. Please send the message from your mail app."
  }
};

function translateContactForm(){
  var t = CONTACT_FORM_TEXT[lang] || CONTACT_FORM_TEXT.de;
  Object.keys(t).forEach(function(id){
    var el = g(id);
    if(el) el.innerHTML = t[id];
  });
}

function submitContactForm(e){
  if(e) e.preventDefault();
  var t = CONTACT_FORM_TEXT[lang] || CONTACT_FORM_TEXT.de;
  var name = (g("contact-name") && g("contact-name").value || "").trim();
  var relation = (g("contact-relation") && g("contact-relation").value || "").trim();
  var message = (g("contact-message") && g("contact-message").value || "").trim();
  var status = g("contact-status");
  var text = "Kroeker family website contact\n\nName: " + (name || "-") + "\nFamily / place: " + (relation || "-") + "\nMessage:\n" + (message || "-");
  var subject = "Kroeker family website contact";
  var contactAddress = ["evusachev30", "gmail.com"].join("@");
  var mailto = "mailto:" + contactAddress + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(text);
  if(status) status.textContent = t["contact-status-sent"];
  window.location.href = mailto;
}

function R(){
  var t = T[lang];
  var ids = ["hl","hs","htg","pp-label","ht","hx","s0","s1","s2","s3","s4","s5",
    "it","i","pt","p","qt","q","c1n","c1d","c1r","c2n","c2d","c2r","c3n","c3d","c3r",
    "mn","uk",
    "tn-gs","td-gs","tn-ka","td-ka","tn-jo","td-jo","tt-jo","tn-es","td-es","tt-es",
    "tn-wa","td-wa","tn-ei","td-ei","tt-ei","tn-vl","td-vl","tt-vl",
    "tn-lj","td-lj","tt-lj","tn-eu","td-eu","tt-eu",
    "h1t","h1","h2t","h2","h3t","h3","h3b-t","h3b","h4t","h4","h5t","h5",
    "tl1","tl2","tl3","tl4","tl5","tl6b","tl6c","tl6d","tl6","tl6e","tl6f",
    "tl7","tl8","tl9","tl10","tl12","tl11","tl13","tl14","tl15",
    "ra","rw","rs","rd","ul","u0d","u0t","u1d","u1t","u2d","u2t","u3d","u3t","u4d","u4t","u5d","u5t","u6d","u6t",
    "r-done","r-wait","r-prog","r-deny","r-search-title","r-search-desc","r-grandma","r-odessa","r-other-title","copyright",
    "chip-years","chip-km","chip-gen",
    "svg-map-title","svg-map-sub",
    "s6","s7","s8",
    "map-title","map-desc","map-l1","map-l2","map-l3","map-l4","map-l5","map-l6",
    "con-why-t","con-why","con-how-t","con-donate","con-donate-sub","con-search-t","con-search","con-names",
    "ft"
  ];
  for(var i=0;i<ids.length;i++){
    var el = g("t-"+ids[i]) || g(ids[i]);
    if(/^s[0-8]$/.test(ids[i]) && el && el.id === ids[i]) continue;
    if(el && t[ids[i]] !== undefined){
      el.innerHTML = t[ids[i]].replace(/\n/g,"<br>");
    }
  }
  // nav
  for(var j=0;j<9;j++){
    var nEl = g("n"+j);
    if(nEl && t["n"+j]) nEl.innerHTML = t["n"+j];
    var nTxt = g("n"+j+"-txt");
    if(nTxt && t["n"+j]) nTxt.innerHTML = t["n"+j];
  }
  var dd = {
    "dd1": [
      {txt: t["tree-g"], sec: "s1", id:"tn-jo"},
      {txt: t["tree-e"], sec: "s1", id:"tn-ei"},
      {txt: t["tree-v"], sec: "s1", id:"tn-vl"}
    ],
    "dd2": [
      {txt: t["hist-1"], sec: "s2"},
      {txt: t["hist-2"], sec: "s2"},
      {txt: t["hist-3"], sec: "s2"},
      {txt: t["hist-4"], sec: "s2"},
      {txt: t["hist-5"], sec: "s2"}
    ],
    "dd4": [
      {txt: t["res-mhsbc"], sec: "s4"},
      {txt: t["res-barch"], sec: "s4"},
      {txt: t["res-kaz"], sec: "s4"}
    ],
    "dd5": [
      {txt: t["upd-new"], sec: "s5"},
      {txt: t["upd-all"], sec: "s5"}
    ],
    "dd6": [
      {txt: "GRANDMA Online", sec: "s6", url:"https://grandmaonline.org/gmol-7/loginRequired.asp"},
      {txt: "Odessa3", sec: "s6", url:"https://www.odessa3.org/search.html"},
      {txt: t["res-other"], sec: "s6"}
    ]
  };
  for(var ddId in dd){
    var ddEl = g(ddId);
    if(!ddEl) continue;
    var html2 = "";
    var items = dd[ddId];
    for(var k=0;k<items.length;k++){
      var item = items[k];
      if(!item.txt) continue;
      if(item.url){
        html2 += "<a href=\""+item.url+"\" target=\"_blank\">&#128279; "+item.txt+"</a>";
      } else {
        html2 += "<a href=\""+withLang(pageBySection[item.sec]||"index.html")+"\">"+item.txt+"</a>";
      }
    }
    ddEl.innerHTML = html2;
  }
  // status labels
  document.querySelectorAll(".r-done").forEach(function(e){e.innerHTML=t["r-done"]||"";});
  document.querySelectorAll(".r-wait").forEach(function(e){e.innerHTML=t["r-wait"]||"";});
  document.querySelectorAll(".r-prog").forEach(function(e){e.innerHTML=t["r-prog"]||"";});
  document.querySelectorAll(".r-deny").forEach(function(e){e.innerHTML=t["r-deny"]||"";});
  document.documentElement.lang = lang;
  var sp = {"de":"Suche auf der Website...","ru":"\u041f\u043e\u0438\u0441\u043a...","en":"Search the website..."};
  var si = document.getElementById("search-input"); if(si) si.placeholder = sp[lang]||sp.de;
  var paypalHeader = document.getElementById("paypal-header-label");
  if(paypalHeader) paypalHeader.innerHTML = t["pp-label"] || "PayPal Spende";
  var menuLabel = document.getElementById("menu-label");
  if(menuLabel) menuLabel.innerHTML = lang==="ru" ? "Меню" : (lang==="en" ? "Menu" : "Menü");
  updateCookieBannerText();
  translateSeoBlock();
  translateContactForm();
  var sr=document.getElementById("search-results"); if(sr) sr.style.display="none"; syncLanguageLinks(); setActiveNav(); setPageHero(t);
}

function setLang(l){
  if(!validLang(l)) l = "de";
  lang=l;
  try{ localStorage.setItem("kroeker-lang", l); }catch(e){}
  document.querySelectorAll(".lang-btn").forEach(function(b){
    b.classList.toggle("active", b.textContent===l.toUpperCase());
  });
  R();
}

function S(id){ window.location.href = withLang(pageBySection[id] || "index.html"); }


// Search index
var searchIndex = [];
function buildSearchIndex(){
  var t = T[lang];
  var keys = ["h1","h2","h3","h4","h5","tl1","tl2","tl3","tl4","tl5","tl6","tl7","tl8","tl9","tl10","tl11","tl12","tl13","tl14","tl15","i","p","q"];
  var sections = {"h1":"s2","h2":"s2","h3":"s2","h4":"s2","h5":"s2","tl1":"s3","tl2":"s3","tl3":"s3","tl4":"s3","tl5":"s3","tl6":"s3","tl7":"s3","tl8":"s3","tl9":"s3","tl10":"s3","tl11":"s3","tl12":"s3","tl13":"s3","tl14":"s3","tl15":"s3","i":"s0","p":"s0","q":"s0"};
  searchIndex = [];
  for(var i=0;i<keys.length;i++){
    var k = keys[i];
    if(t[k]) searchIndex.push({text: t[k].replace(/<[^>]+>/g,""), section: sections[k]||"s0", key: k});
  }
}

function updateSearchClear(q){
  var clear = document.getElementById("search-clear");
  if(clear) clear.classList.toggle("visible", !!q);
}

function doSearch(q){
  var res = document.getElementById("search-results");
  updateSearchClear(q);
  if(!q || q.length < 2){ res.style.display="none"; return; }
  q = q.toLowerCase();
  buildSearchIndex();
  var hits = [];
  for(var i=0;i<searchIndex.length;i++){
    var idx = searchIndex[i].text.toLowerCase().indexOf(q);
    if(idx >= 0){
      var start = Math.max(0, idx-40);
      var end = Math.min(searchIndex[i].text.length, idx+q.length+80);
      var snippet = (start>0?"...":"")+searchIndex[i].text.slice(start,end)+(end<searchIndex[i].text.length?"...":"");
      var hi = snippet.replace(new RegExp(q,"gi"), function(m){return "<mark style=\"background:#fff3a0\">"+m+"</mark>";});
      hits.push({html: hi, section: searchIndex[i].section});
    }
  }
  if(hits.length === 0){
    res.style.display="block";
    res.innerHTML = "<p style=\"color:#c0392b;font-size:.85rem\">&#128269; " + (lang==="ru"?"Ничего не найдено":lang==="de"?"Keine Ergebnisse":"No results") + "</p>";
    return;
  }
  var html = "";
  for(var j=0;j<Math.min(hits.length,5);j++){
    var sec = hits[j].section;
    var div = document.createElement("div");
    div.className = "s-hit";
    var secNames = {"s0":"Startseite","s1":"Stammbaum","s2":"Geschichte","s3":"Zeitleiste","s4":"Forschung","s5":"Updates","s6":"Ressourcen"};
    if(lang==="ru") secNames = {"s0":"Главная","s1":"Древо","s2":"История","s3":"Хронология","s4":"Исследование","s5":"Обновления","s6":"Ресурсы"};
    if(lang==="en") secNames = {"s0":"Home","s1":"Family Tree","s2":"History","s3":"Timeline","s4":"Research","s5":"Updates","s6":"Resources"};
    var secLabel = secNames[sec] || sec;
    div.innerHTML = "<span style='font-size:.7rem;background:var(--blue5);color:var(--blue);padding:.1rem .4rem;border-radius:4px;margin-right:.5rem;font-weight:500'>→ " + secLabel + "</span>" + hits[j].html;
    div.setAttribute("data-sec", sec);
    div.addEventListener("click", function(){
      var s = this.getAttribute("data-sec");
      window.location.href = withLang(pageBySection[s] || "index.html");
      document.getElementById("search-results").style.display = "none";
      document.getElementById("search-input").value = "";
      var clearBtn = document.getElementById("search-clear");
      if(clearBtn) clearBtn.classList.remove("visible");
      window.scrollTo({top:0, behavior:"smooth"});
    });
    html += div.outerHTML;
  }
  res.style.display = "block";
  res.innerHTML = html;
  // Re-attach click events after innerHTML set
  var divs = res.querySelectorAll(".s-hit");
  divs.forEach(function(div){
    div.addEventListener("click", function(){
      var s = this.getAttribute("data-sec");
      S(s);
      res.style.display = "none";
      document.getElementById("search-input").value = "";
      var clearBtn = document.getElementById("search-clear");
      if(clearBtn) clearBtn.classList.remove("visible");
      window.scrollTo({top:0, behavior:"smooth"});
    });
  });
}

function clearSearch(){
  var input = document.getElementById("search-input");
  var res = document.getElementById("search-results");
  var clear = document.getElementById("search-clear");
  if(input) input.value = "";
  if(res) res.style.display = "none";
  if(clear) clear.classList.remove("visible");
  if(input) input.focus();
}


var mapInitialized = false;
function initMap(){
  if(mapInitialized) return;
  mapInitialized = true;
  if(typeof L === 'undefined'){
    var ml=document.getElementById('map-loading');
    if(ml) ml.innerHTML='&#9888; Leaflet nicht geladen. Bitte Seite neu laden.';
    return;
  }
  var ml=document.getElementById('map-loading');
  if(ml) ml.style.display='none';
  var mapEl=document.getElementById('leaflet-map');
  if(mapEl) mapEl.style.display='block';
  var map = L.map('leaflet-map',{scrollWheelZoom:false}).setView([52,25],4);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    attribution:'&copy; OpenStreetMap',maxZoom:18
  }).addTo(map);
  var pts = [
    {ll:[54.35,18.65], title:'Danzig / Gdańsk', desc:'Westpreußen · Vorfahren ~1820–1864', color:'#0f2d5c'},
    {ll:[50.45,27.8],  title:'Wolhynien (Dorf unbekannt)', desc:'Stammkolonie · 1864–1941 · Johann Kroeker *1864', color:'#1a56db'},
    {ll:[49.85,37.5],  title:'Peski · Charkow Oblast', desc:'Zwangsumsiedlung ~1935 · Deportation 1941', color:'#dc2626'},
    {ll:[54.18,69.12], title:'Sennoje · Kasachstan', desc:'Deportation 1941–1955 · Vladimir *1950', color:'#854d0e'},
    {ll:[47.71,40.22], title:'Schachty · Russland', desc:'Rostower Oblast · 1955–2019', color:'#374151'},
    {ll:[52.55,13.43], title:'Berlin · Deutschland', desc:'ab 2019 · Eugen Usachew', color:'#16a34a'}
  ];
  var path = pts.map(function(p){return p.ll;});
  L.polyline(path,{color:'#1a56db',weight:2,dashArray:'8,5',opacity:0.6}).addTo(map);
  pts.forEach(function(p,i){
    var icon = L.divIcon({
      html:'<div style="width:14px;height:14px;background:'+p.color+';border:2px solid #fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.3)"></div>',
      iconSize:[14,14],iconAnchor:[7,7],className:''
    });
    L.marker(p.ll,{icon:icon}).addTo(map)
      .bindPopup('<strong style="color:'+p.color+'">'+p.title+'</strong><br><span style="font-size:12px;color:#4b6a9b">'+p.desc+'</span>');
  });
}

function countYears(){
  var el = document.getElementById('cnt-years');
  if(!el) return;
  var yr = new Date().getFullYear();
  el.textContent = (yr - 1864).toString();
}
countYears();
if(document.getElementById("leaflet-map")) setTimeout(initMap,300);


setLang(getSavedLang());
initCookieConsent();
initRevealAnimations();
