import re
# lon 34.15..36.45, lat 30.85..33.65
LON0,LON1,LAT0,LAT1=34.15,36.45,30.85,33.65
W=600; s=W/((LON1-LON0)*0.85); H=round((LAT1-LAT0)*s)
def P(lon,lat): return ((lon-LON0)*0.85*s,(LAT1-lat)*s)
def path(pts,close=True): return 'M'+' L'.join('%.1f %.1f'%P(*p) for p in pts)+(' Z' if close else '')
coast=[(34.2,31.32),(34.35,31.45),(34.5,31.62),(34.62,31.82),(34.75,32.05),(34.85,32.35),(34.92,32.55),(34.97,32.75),(35.05,32.85),(35.08,32.92),(35.1,33.05),(35.2,33.27),(35.3,33.45),(35.37,33.56),(35.42,33.7)]
land=[(34.0,33.7)]+[(30,30)]
landpoly=coast+[(36.6,33.7),(36.6,30.7),(34.0,30.7),(34.0,31.25)]
galilee=[(35.52,32.88),(35.56,32.9),(35.6,32.89),(35.65,32.85),(35.65,32.78),(35.62,32.72),(35.58,32.71),(35.54,32.76),(35.52,32.82)]
dead=[(35.48,31.77),(35.55,31.76),(35.58,31.6),(35.58,31.4),(35.55,31.2),(35.5,31.08),(35.42,31.12),(35.4,31.3),(35.42,31.55),(35.45,31.7)]
jordan=[(35.6,33.15),(35.62,33.0),(35.6,32.92),(35.58,32.71),(35.57,32.6),(35.6,32.45),(35.55,32.3),(35.57,32.1),(35.52,31.95),(35.55,31.85),(35.52,31.77)]
cities=[('بيت لحم',35.20,31.705,'k',0,16),('أورشليم',35.235,31.778,'k',22,-4),('الناصرة',35.30,32.70,'k',-24,4),('كفرناحوم',35.575,32.88,'k',0,-9),('أريحا',35.444,31.87,'o',20,4),('بيت عنيا',35.26,31.77,'o',0,16),('قانا',35.28,32.80,'o',-18,-4),('بيت صيدا',35.63,32.91,'o',26,-4),('قيصرية فيلبس',35.694,33.248,'o',0,-9),('سوخار',35.28,32.21,'o',-20,4),('صور',35.2,33.27,'o',-14,-6),('صيدا',35.37,33.56,'o',-14,-4),('قيصرية',34.89,32.5,'o',-22,4),('مجدل',35.52,32.82,'o',-18,6)]
regions=[('الجليل',35.32,32.92),('السامرة',35.2,32.28),('اليهودية',35.05,31.6),('بيرية',35.75,32.1),('العشر المدن',35.98,32.6),('أدومية',34.85,31.1),('فينيقية',35.25,33.42)]
seas=[('البحر الكبير',34.45,32.4),('بحر الجليل',35.82,32.8),('البحر الميت',35.72,31.35)]
out=[f'<svg viewBox="0 0 {W} {H}" role="img" aria-label="خريطة فلسطين في زمن المسيح">',
'<rect width="100%" height="100%" fill="#D6E0DC"/>',
f'<g fill="none" stroke-linejoin="round"><path d="{path(landpoly)}" stroke="#A8BCB7" stroke-width="18" opacity="0.4"/><path d="{path(landpoly)}" stroke="#D8E2DE" stroke-width="13"/><path d="{path(landpoly)}" stroke="#A8BCB7" stroke-width="7" opacity="0.7"/></g>',
f'<path d="{path(landpoly)}" fill="#F1E8D4" stroke="#5C4B37" stroke-width="1.2"/>',
f'<path d="{path(jordan,False)}" fill="none" stroke="#7FA2B4" stroke-width="2.2" stroke-linecap="round"/>',
f'<path d="{path(galilee)}" fill="#BCD0D4" stroke="#5C4B37" stroke-width="1"/>',
f'<path d="{path(dead)}" fill="#BCD0D4" stroke="#5C4B37" stroke-width="1"/>',
'<g font-family="Reem Kufi, sans-serif" font-size="15" fill="#8C7556" text-anchor="middle" letter-spacing="4">']
for n,lo,la in regions:
    x,y=P(lo,la); out.append(f'<text x="{x:.0f}" y="{y:.0f}">{n}</text>')
out.append('</g><g font-family="Reem Kufi, sans-serif" font-size="12" fill="#5F7F86" text-anchor="middle" letter-spacing="2">')
for n,lo,la in seas:
    x,y=P(lo,la); out.append(f'<text x="{x:.0f}" y="{y:.0f}">{n}</text>')
out.append('</g>')
for n,lo,la,k,dx,dy in cities:
    x,y=P(lo,la)
    out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{4 if k=="k" else 3}" fill="{"#7E2F25" if k=="k" else "#FBF7EE"}" stroke="#3A332A" stroke-width="1.1"/>')
out.append('<g font-family="Markazi Text, serif" font-size="16" font-weight="600" fill="#2A2620" text-anchor="middle" stroke="#F1E8D4" stroke-width="3.5" paint-order="stroke">')
for n,lo,la,k,dx,dy in cities:
    x,y=P(lo,la); out.append(f'<text x="{x+dx:.0f}" y="{y+dy:.0f}"{" fill=\"#7E2F25\"" if k=="k" else ""}>{n}</text>')
out.append('</g>')
ex,ey=P(34.45,31.0)
out.append(f'<g font-family="Markazi Text, serif" font-size="15" fill="#6A5A43"><path d="M{ex+40:.0f} {ey-20:.0f} L{ex-10:.0f} {ey+10:.0f}" stroke="#6A5A43" stroke-width="1.2" stroke-dasharray="3 3" marker-end="url(#ar)"/><text x="{ex-14:.0f}" y="{ey+30:.0f}" text-anchor="middle">إلى مصر</text></g>')
out.insert(1,'<defs><marker id="ar" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" fill="#6A5A43"/></marker></defs>')
svg=''.join(out)+'</svg>'
svg=re.sub(r'<(\w+)([^<>]*?)/>', r'<\1\2></\1>', svg)
open('data/palestine-map.svg','w',encoding='utf-8').write(svg)
print(W,H)
