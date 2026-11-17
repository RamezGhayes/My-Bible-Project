// Renders authored content blocks (book introductions and chapter studies) to HTML.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, esc, md, ar, refLabel, refHref, verseText } from './lib.mjs';

const P = (t) => `<p>${md(t)}</p>`;
const paras = (x) => (Array.isArray(x) ? x : [x]).map(P).join('');
let uid = 0;
const id = (p) => `${p}-${++uid}`;

export function verseFigure(ref, { depth, dark = false, label = '', text } = {}) {
  const refs = Array.isArray(ref) ? ref : [ref];
  const body = text ?? refs.map((r) => verseText(r)).join(' … ');
  const cap = refs.map((r) => `<a href="${refHref(r, depth)}">${refLabel(r)}</a>`).join('، ');
  let clean = body.replace(/[.،:؛,]\s*$/, '');
  clean = clean.includes('«') ? clean : `«${clean}»`;
  if (dark) return `<figure class="verse-dark">${label ? `<span class="eyebrow">${esc(label)}</span>` : ''}<blockquote>${esc(clean)}</blockquote><figcaption>${cap}</figcaption></figure>`;
  return `<figure class="verse-block">${label ? `<span class="eyebrow">${esc(label)}</span>` : ''}<blockquote>${esc(clean)}</blockquote><figcaption>${cap}</figcaption></figure>`;
}

const ERA = { r: 'الإصلاح', p: 'البيوريتان والأرثوذكسية المُصلَحة', d: 'القرنان التاسع عشر والعشرون', m: 'المعاصرون' };

export function block(b, ctx) {
  const { depth } = ctx;
  if (typeof b === 'string') return P(b);
  if (b.p) return paras(b.p);
  if (b.h3) return `<h3>${md(b.h3)}</h3>`;
  if (b.verse) return verseFigure(b.verse, { depth, dark: b.dark, label: b.label });
  if (b.list) return `<${b.ordered ? 'ol' : 'ul'} class="plain">${b.list.map((i) => `<li>${md(i)}</li>`).join('')}</${b.ordered ? 'ol' : 'ul'}>`;
  if (b.cards) return `<div class="grid-cards">${b.cards.map((c) => `<div class="card"><h4>${md(c.t)}</h4>${paras(c.d)}</div>`).join('')}</div>`;
  if (b.callout) {
    const c = b.callout;
    return `<div class="callout ${c.tone || ''}">${c.title ? `<span class="callout-title">${md(c.title)}</span>` : ''}${paras(c.text)}</div>`;
  }
  if (b.terms) return `<div class="ruled-grid">${b.terms.map((t) => `<div><span class="t">${md(t.t)}</span><span class="d">${md(t.d)}</span>${t.r ? `<span class="r">${md(t.r)}</span>` : ''}</div>`).join('')}</div>`;
  if (b.table) {
    const t = b.table;
    return `<div class="table-scroll"><table class="data"><thead><tr>${t.cols.map((c) => `<th>${md(c)}</th>`).join('')}</tr></thead><tbody>${t.rows.map((r) => `<tr>${r.map((c, i) => (i === (t.refCol ?? -1) ? `<td class="ref">${md(c)}</td>` : `<td>${md(c)}</td>`)).join('')}</tr>`).join('')}</tbody></table></div>`;
  }
  if (b.timeline) return `<ol class="timeline">${b.timeline.map((t) => `<li class="${t.now ? 'now' : ''}"><span class="when">${md(t.when)}</span><span class="t">${md(t.t)}</span><span class="d">${md(t.d)}</span></li>`).join('')}</ol>`;
  if (b.views) {
    const ids = b.views.map(() => id('view'));
    return `<div class="tabs" role="tablist" data-tabs>${b.views.map((v, i) => `<button type="button" role="tab" aria-selected="${i === 0}" data-panel="${ids[i]}">${md(v.label)}</button>`).join('')}</div>${b.views.map((v, i) => `<div id="${ids[i]}" role="tabpanel" class="prose" style="display:flex;flex-direction:column;gap:12px"${i ? ' hidden' : ''}>${v.paras ? paras(v.paras) : ''}${v.list ? `<ul class="plain">${v.list.map((x) => `<li>${md(x)}</li>`).join('')}</ul>` : ''}</div>`).join('')}`;
  }
  if (b.figure) {
    const svg = fs.readFileSync(path.join(ROOT, 'data', b.figure), 'utf8');
    return `<figure class="figure-map"><div class="frame">${svg}</div>${b.caption ? `<figcaption>${md(b.caption)}</figcaption>` : ''}</figure>`;
  }
  if (b.outline) {
    const ids = b.outline.map(() => id('part'));
    const sel = b.select ?? 0;
    return `<div data-outline style="display:flex;flex-direction:column;gap:12px"><div class="outline-parts">${b.outline.map((p, i) => `<button type="button" data-part="${ids[i]}" aria-pressed="${i === sel}"><span class="r">${md(p.ref)}</span><span class="t">${md(p.t)}</span><span class="k">${md(p.kind)}</span></button>`).join('')}</div>${b.outline.map((p, i) => `<div class="outline-detail" id="${ids[i]}"${i === sel ? '' : ' hidden'}><div class="head"><span class="t">${md(p.t)} <small>${md(p.ref)}</small></span><p>${md(p.intro)}</p></div>${p.items.map((it) => `<div class="row"><span class="r">${it.ref ? `<a href="${refHref(it.ref, depth)}">${md(it.r)}</a>` : md(it.r)}</span><span class="t">${md(it.t)}</span></div>`).join('')}</div>`).join('')}</div>`;
  }
  if (b.theo) return `<div class="theo-grid">${b.theo.map((t) => `<div><h4>${md(t.h)}</h4>${paras(t.b)}</div>`).join('')}</div>`;
  if (b.voices) {
    const vid = id('voices');
    const used = [...new Set(b.voices.map((v) => v.e))];
    return `<div class="pills" role="tablist" data-filter="${vid}"><button type="button" aria-selected="true" data-value="all">الكل</button>${used.map((e) => `<button type="button" aria-selected="false" data-value="${e}">${ERA[e]}</button>`).join('')}</div><div class="voices" id="${vid}">${b.voices.map((v) => `<div class="voice" data-group="${v.e}"><div class="who"><b>${md(v.n)}</b><span>${md(v.y)} · ${ERA[v.e]}</span></div><div class="what">${paras(v.b)}<span class="src"><i>المصدر: </i>${md(v.w)}</span></div></div>`).join('')}</div>`;
  }
  if (b.confessions) return `<div class="callout" style="background:var(--paper-2);border:1px solid var(--rule)"><span class="callout-title" style="color:var(--ink-2);font-size:19px">${md(b.title || 'وفي الإقرارات المُصلَحة')}</span>${b.confessions.map((c) => `<p><b>${md(c.t)}:</b> ${md(c.b)}</p>`).join('')}</div>`;
  if (b.checklist) {
    const { book, items } = b.checklist;
    return `<ol class="check-grid">${items.map((t, i) => `<li><span class="k">الأصحاح ${ar(i + 1)}</span><span class="t">${md(t)}</span></li>`).join('')}</ol>`;
  }
  if (b.reflect) return `<label for="reflect-${depth}" style="font-family:var(--f-display);font-size:15px">تأمّلي الشخصي</label><textarea id="reflect-${depth}" class="reflect" rows="5" placeholder="${esc(b.reflect === true ? 'اكتب ما تعلّمته، أو صلاة قصيرة' : b.reflect)}"></textarea><small class="nosave">لا يُحفظ ما تكتبه هنا. انسخه إلى دفترك إن أردت الاحتفاظ به.</small>`;
  if (b.html) return b.html;
  throw new Error('Unknown block: ' + JSON.stringify(b).slice(0, 80));
}

export const blocks = (list, ctx) => list.map((b) => block(b, ctx)).join('\n');
