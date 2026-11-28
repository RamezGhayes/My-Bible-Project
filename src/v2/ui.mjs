// Shared page shell and small view helpers for the v2 design.
import { config, esc, up, ar } from '../lib.mjs';

const FONTS = 'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+Arabic:wght@400;500;600&family=Noto+Naskh+Arabic:wght@400;600;700&family=Readex+Pro:wght@300;400;500;600&display=swap';

export const IC = {
  back: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6"/></svg>',
  chev: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6"/></svg>',
  close: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
  menu: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  up: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg>',
  read: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H19v15H5.5A1.5 1.5 0 0 0 4 20.5zM4 20.5V5.5"/></svg>',
  list: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/></svg>',
  map: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z"/><path d="M9 4v14M15 6v14"/></svg>',
  person: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="6" y="3" width="12" height="18" rx="2"/><circle cx="12" cy="10" r="2.6"/><path d="M8.5 16c.6-1.6 2-2.4 3.5-2.4s2.9.8 3.5 2.4"/></svg>',
  home: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5.5A1.5 1.5 0 0 1 5.5 4H19v15H5.5A1.5 1.5 0 0 0 4 20.5zM4 20.5V5.5"/></svg>',
  search: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/></svg>',
  time: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h18"/><circle cx="6" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="18" cy="12" r="2"/></svg>',
  shelf: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 4v16M9 4v16M13.5 5l4 15M3 20h18"/></svg>',
  web: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="6" cy="6" r="2.4"/><circle cx="18" cy="7" r="2.4"/><circle cx="12" cy="18" r="2.4"/><path d="M8.2 7l7.5.2M7.2 8.2l3.8 7.7M16.8 9.2L13 15.8"/></svg>',
  key: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="8" cy="12" r="3.5"/><path d="M11.5 12H21M17 12v3.5M20 12v2.5"/></svg>',
  cross: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M6.5 8.5h11"/></svg>',
  pen: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19z"/><path d="M14 7l3 3"/></svg>',
  pray: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v16M8 8h8"/><path d="M5 21h14"/></svg>',
  q: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .8-1 1.5v.7M12 17h.01"/></svg>',
  col: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 9l9-5 9 5M5 9v9M10 9v9M14 9v9M19 9v9M3 20h18"/></svg>',
  bulb: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.5.4.8 1 .8 1.6V16h5.4v-.5c0-.6.3-1.2.8-1.6A6 6 0 0 0 12 3z"/></svg>',
  print: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 9V3h10v6M7 17H4v-7h16v7h-3M7 14h10v7H7z"/></svg>',
  check: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
};

// Four main sections (redesign, Nov 2026). Older section keys fold into them for the "current page" mark.
export const NAVKEY = { ot: 'bible', nt: 'bible', bible: 'bible', overview: 'bible', people: 'explore', maps: 'explore', topics: 'explore', library: 'explore', explore: 'explore', plans: 'plans', home: 'home' };
const NAV = [['index.html', 'home', 'الرئيسية', IC.home], ['plans.html', 'plans', 'خلوة اليوم', IC.check], ['bible.html', 'bible', 'الكتاب المقدس', IC.read], ['explore.html', 'explore', 'استكشف', IC.web]];
export const TOPNAV = NAV.map(([h, k, l]) => [h, k, l]);
export const BRAND = '<svg class="bm" viewBox="0 0 40 32" aria-hidden="true"><path d="M20 7c-4-3-10-4-16-3v22c6-1 12 0 16 3 4-3 10-4 16-3V4c-6-1-12 0-16 3z"/><path d="M20 7v22"/><path d="M8 10c3 0 6 .5 8 1.6M8 15c3 0 6 .5 8 1.6M24 11.6c2-1.1 5-1.6 8-1.6M24 16.6c2-1.1 5-1.6 8-1.6" opacity=".55"/></svg>';

export function page({ title, depth = 0, nav = null, body, cls = '', after = '', head = '' }) {
  const u = up(depth);
  const full = title ? `${title} · ${config.nameAr} | ${config.nameEn}` : `${config.nameAr} | ${config.nameEn} · ${config.tagline}`;
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#FAF8F4">
<title>${esc(full)}</title>
<meta name="description" content="${esc(config.description)}">
<meta name="application-name" content="${esc(config.nameEn)}">
<meta property="og:site_name" content="${esc(config.nameAr)} | ${esc(config.nameEn)}">
<meta property="og:title" content="${esc(full)}">
<meta property="og:description" content="${esc(config.description)}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ar_AR">
<meta name="twitter:card" content="summary">
<link rel="icon" href="${u}assets/icon.svg" type="image/svg+xml">
<link rel="manifest" href="${u}manifest.webmanifest">
<link rel="apple-touch-icon" href="${u}assets/icon-192.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${u}assets/v2.css">
<link rel="stylesheet" href="${u}assets/v3.css">
<link rel="stylesheet" href="${u}assets/v5.css">
${head}
</head>
<body class="${cls}" data-root="${u}" data-auth="${esc(JSON.stringify(config.auth || {}))}">
<header id="top"><div class="in"><a class="brand" href="${u}index.html">${BRAND}<span><b>${esc(config.nameAr)}</b></span></a><nav aria-label="الأقسام">${TOPNAV.map(([h, k, l]) => `<a href="${u}${h}"${k === NAVKEY[nav] ? ' aria-current="page"' : ''}>${l}</a>`).join('')}</nav><button type="button" class="sbtn" data-search aria-label="بحث">${IC.search}<span>ابحث</span></button><a class="acct" href="${u}login.html" data-acct aria-label="حسابي"><svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/></svg><span data-acct-label>حسابي</span></a></div></header>
<div id="app"><main class="main">
${body}
</main>
${nav ? `<nav id="nav" aria-label="التنقل الرئيسي">${NAV.map(([h, k, l, i]) => `<a href="${u}${h}"${k === NAVKEY[nav] ? ' aria-current="page"' : ''}>${i}${l}</a>`).join('')}<button type="button" data-search>${IC.search}بحث</button></nav>` : ''}
</div>
${after}
<div class="srch" id="srch" hidden role="dialog" aria-label="بحث"><div class="sbox"><div class="sin">${IC.search}<input type="search" id="sq" placeholder="ابحث عن سفر، أو أصحاح، أو شخصية، أو اكتب شاهداً مثل يو ٣: ١٦" autocomplete="off" enterkeyhint="search"><button type="button" data-sclose aria-label="إغلاق">${IC.close}</button></div><div class="sres" id="sres"></div></div></div>
<div class="toast" id="toast" role="status"></div>
<script src="${u}assets/v2.js"></script>
<script src="${u}assets/v3.js"></script>
<script src="${u}assets/v5.js"></script>
<script type="module" src="${u}assets/account.js"></script>
</body>
</html>`;
}

export const header = ({ back, title, end = '<span style="width:44px"></span>', backLabel = 'رجوع' }) =>
  `<header class="sh"><a class="b" href="${back}" aria-label="${backLabel}">${IC.back}</a><span class="t">${title}</span>${end}</header>`;

// Plain text from authored strings, then cut on a word boundary.
export const plain = (s) => String(s ?? '').replace(/\*\*/g, '');
export function clip(s, n) {
  const t = plain(s);
  if (t.length <= n) return t;
  return t.slice(0, n).replace(/\s+\S*$/, '') + '…';
}
export const firstSentences = (s, min = 90) => {
  const parts = plain(s).split(/(?<=[.؟!])\s+/);
  let out = '';
  for (const p of parts) { out += (out ? ' ' : '') + p; if (out.length >= min) break; }
  return out;
};
export const countWord = (n, one, two, few, many) => (n === 1 ? one : n === 2 ? two : n <= 10 ? `${ar(n)} ${few}` : `${ar(n)} ${many}`);
export const chWord = (n) => countWord(n, 'أصحاح واحد', 'أصحاحان', 'أصحاحات', 'أصحاحاً');
export const bkWord = (n) => countWord(n, 'سفر واحد', 'سفران', 'أسفار', 'سفراً');
export const vWord = (n) => countWord(n, 'آية واحدة', 'آيتان', 'آيات', 'آية');
export const secWord = (n) => countWord(n, 'قسم واحد', 'قسمان', 'أقسام', 'قسماً');
