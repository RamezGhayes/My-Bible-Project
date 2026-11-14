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
  check: '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'
};

const NAV = [['index.html', 'home', 'الرئيسية', IC.home], ['people.html', 'people', 'الشخصيات', IC.person], ['maps.html', 'maps', 'الخرائط', IC.map]];

export function page({ title, depth = 0, nav = null, body, cls = '', after = '' }) {
  const u = up(depth);
  const full = title ? `${title} · ${config.nameAr}` : `${config.nameAr} · ${config.tagline}`;
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#FAF8F4">
<title>${esc(full)}</title>
<meta name="description" content="${esc(config.description)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${u}assets/v2.css">
</head>
<body class="${cls}" data-root="${u}">
<div id="app"><main class="main">
${body}
</main>
${nav ? `<nav id="nav" aria-label="التنقل الرئيسي">${NAV.map(([h, k, l, i]) => `<a href="${u}${h}"${k === nav ? ' aria-current="page"' : ''}>${i}${l}</a>`).join('')}</nav>` : ''}
</div>
${after}
<div class="toast" id="toast" role="status"></div>
<script src="${u}assets/v2.js"></script>
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
