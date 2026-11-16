import { config, esc, up, verseText, refLabel } from './lib.mjs';

const FONTS = 'https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&family=Markazi+Text:wght@400;500;600;700&family=Reem+Kufi:wght@400;500;600;700&display=swap';

export const logo = (size = 40) => `<svg class="logo-mark" width="${size}" height="${size}" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18.5" fill="none" stroke="#C9A96E" stroke-width="1.2"/><circle cx="20" cy="20" r="15" fill="none" stroke="#C9A96E" stroke-width="0.6"/><path d="M13 29c0-6 14-4 14-10s-8-4-8-10" fill="none" stroke="#E9CF96" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="0.1 3.6"/><circle cx="19" cy="9" r="1.8" fill="#E9CF96"/></svg>`;

const NAV = [
  { key: 'home', href: 'index.html', label: 'الرئيسية' },
  { key: 'ot', href: 'ot.html', label: 'العهد القديم' },
  { key: 'nt', href: 'nt.html', label: 'العهد الجديد' },
  { key: 'maps', href: 'maps.html', label: 'الخرائط' },
  { key: 'people', href: 'people.html', label: 'الشخصيات' },
];

export function layout({ title, depth = 0, active = '', body, crumbs = [], bodyClass = '', scripts = [], head = '' }) {
  const u = up(depth);
  const fullTitle = title ? `${title} · ${config.name}` : `${config.name} · ${config.tagline}`;
  const crumbHtml = crumbs.length
    ? `<nav class="crumbs" aria-label="مسار الصفحة"><a href="${u}index.html">الرئيسية</a>${crumbs.map((c) => (c.href ? `<span aria-hidden="true">›</span><a href="${u}${c.href}">${esc(c.label)}</a>` : `<span aria-hidden="true">›</span><span aria-current="page">${esc(c.label)}</span>`)).join('')}</nav>`
    : '';
  return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(config.description)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${u}assets/site.css">
${head}
</head>
<body class="${bodyClass}">
<a class="skip" href="#main">تخطَّ إلى المحتوى</a>
<header class="site-header">
  <div class="wrap header-row">
    <a class="brand" href="${u}index.html">${logo(40)}<span class="brand-text"><span class="brand-name" dir="auto">${esc(config.name)}</span><span class="brand-sub">${esc(config.nameAr)} · ${esc(config.tagline)}</span></span></a>
    <nav class="main-nav" aria-label="القائمة الرئيسية">${NAV.map((n) => `<a href="${u}${n.href}"${n.key === active ? ' aria-current="page"' : ''}>${n.label}</a>`).join('')}</nav>
  </div>
</header>
${crumbHtml ? `<div class="crumb-bar"><div class="wrap">${crumbHtml}</div></div>` : ''}
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap footer-row">
    <p class="footer-verse">«${esc(verseText(config.verseRef).replace(/^مَزْمُورٌ[^،.]*?يَهُوذَا\s+/, '').replace(/\.$/, ''))}» <span>${refLabel(config.verseRef)}</span></p>
    <p class="footer-meta">${esc(config.name)} · نص الكتاب المقدس: ${esc(config.bibleVersion)}</p>
  </div>
</footer>
<script src="${u}assets/site.js"></script>
${scripts.map((s) => `<script src="${u}assets/${s}"></script>`).join('\n')}
</body>
</html>`;
}
