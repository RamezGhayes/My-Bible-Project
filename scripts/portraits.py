# Illustrated scenes for biblical people (never Christ). Flat, warm, faceless figures in the site palette.
# Each scene shows the person in a moment the Bible describes, with age and dress the text implies.
import os
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'src', 'v2', 'assets')
W, H = 480, 360
SKIN = '#B98A5E'; SKIN2 = '#A2774F'
INK = '#17191E'; NAVY = '#1F2A44'; GOLD = '#D7C49A'; GOLD2 = '#B39459'; RED = '#8C2F1E'; PAPER = '#FAF8F4'; CREAM = '#F2EEE6'

def defs(sky_top, sky_bot, extra=''):
    return f'''<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="{sky_top}"/><stop offset="1" stop-color="{sky_bot}"/></linearGradient>
<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFF4D6" stop-opacity=".9"/><stop offset="1" stop-color="#FFF4D6" stop-opacity="0"/></radialGradient>
<linearGradient id="shade" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".22"/></linearGradient>{extra}</defs>
<rect width="{W}" height="{H}" fill="url(#sky)"/>'''

def person(x, g, h=150, robe='#6B4A2F', sash=None, beard=None, hair='#2B211A', cover=None, cover2=None, arms='down', face_dir=0, woman=False, extra='', stoop=0):
    """x = center, g = ground y, h = height. beard: None|'dark'|'gray'|'white'. cover: headcloth color.
    arms: 'down' | 'up' (both raised) | 'staff' (right arm holds staff up) | 'out' (one arm forward) | 'chest'"""
    s = h / 150.0
    hr = 13 * s; hy = g - h + hr  # head center
    sh = hy + hr + 6 * s          # shoulder line
    sw = 22 * s; bw = 34 * s      # shoulder half-width, hem half-width
    lean = stoop * s
    p = []
    # robe
    p.append(f'<path d="M{x-sw+lean:.1f} {sh:.1f} Q{x-sw-4*s+lean:.1f} {(sh+g)/2:.1f} {x-bw:.1f} {g:.1f} L{x+bw:.1f} {g:.1f} Q{x+sw+4*s+lean:.1f} {(sh+g)/2:.1f} {x+sw+lean:.1f} {sh:.1f} Q{x+lean:.1f} {sh-6*s:.1f} {x-sw+lean:.1f} {sh:.1f}Z" fill="{robe}"/>')
    p.append(f'<path d="M{x+lean:.1f} {sh:.1f} Q{x+sw*0.9+lean:.1f} {(sh+g)/2:.1f} {x+bw:.1f} {g:.1f} L{x+bw*0.35:.1f} {g:.1f}Z" fill="url(#shade)"/>')
    if sash:
        sy = sh + (g - sh) * 0.32
        p.append(f'<path d="M{x-sw*1.02+lean:.1f} {sy:.1f} L{x+sw*1.02+lean:.1f} {sy:.1f} L{x+sw*1.04+lean:.1f} {sy+7*s:.1f} L{x-sw*1.04+lean:.1f} {sy+7*s:.1f}Z" fill="{sash}"/>')
    p.append(extra.format(x=x, g=g, s=s, sh=sh, hy=hy, lean=lean) if extra else '')
    # arms
    def arm(x1, y1, x2, y2, col=robe):
        p.append(f'<path d="M{x1:.1f} {y1:.1f} L{x2:.1f} {y2:.1f}" stroke="{col}" stroke-width="{11*s:.1f}" stroke-linecap="round"/>')
        p.append(f'<circle cx="{x2:.1f}" cy="{y2:.1f}" r="{4.6*s:.1f}" fill="{SKIN}"/>')
    L = x - sw + 3 * s + lean; R = x + sw - 3 * s + lean; ay = sh + 4 * s
    if arms == 'down':
        arm(L, ay, L - 4 * s, ay + 46 * s); arm(R, ay, R + 4 * s, ay + 46 * s)
    elif arms == 'up':
        arm(L, ay, L - 22 * s, ay - 40 * s); arm(R, ay, R + 22 * s, ay - 40 * s)
    elif arms == 'staff':
        arm(L, ay, L - 4 * s, ay + 46 * s); arm(R, ay, R + 26 * s, ay - 22 * s)
    elif arms == 'out':
        arm(L, ay, L - 4 * s, ay + 46 * s); arm(R, ay, R + 34 * s, ay + 14 * s)
    elif arms == 'chest':
        arm(L, ay, x - 2 * s + lean, ay + 26 * s); arm(R, ay, x + 2 * s + lean, ay + 26 * s)
    elif arms == 'write':
        arm(L, ay, x - 10 * s + lean, ay + 30 * s); arm(R, ay, x + 26 * s + lean, ay + 34 * s)
    # neck + head
    hx = x + lean + face_dir * 2 * s
    p.append(f'<rect x="{hx-4*s:.1f}" y="{hy+hr-3*s:.1f}" width="{8*s:.1f}" height="{8*s:.1f}" fill="{SKIN2}"/>')
    if cover and woman:
        # veil falling to the shoulders
        p.append(f'<path d="M{hx-hr-5*s:.1f} {sh+16*s:.1f} Q{hx-hr-6*s:.1f} {hy-hr-4*s:.1f} {hx:.1f} {hy-hr-5*s:.1f} Q{hx+hr+6*s:.1f} {hy-hr-4*s:.1f} {hx+hr+5*s:.1f} {sh+16*s:.1f}Z" fill="{cover}"/>')
    p.append(f'<circle cx="{hx:.1f}" cy="{hy:.1f}" r="{hr:.1f}" fill="{SKIN}"/>')
    p.append(f'<path d="M{hx+hr*0.25:.1f} {hy-hr:.1f} A{hr:.1f} {hr:.1f} 0 0 1 {hx+hr*0.25:.1f} {hy+hr:.1f} A{hr*1.05:.1f} {hr:.1f} 0 0 0 {hx+hr*0.25:.1f} {hy-hr:.1f}" fill="#000" opacity=".12"/>')
    if beard:
        bc = {'dark': '#2B211A', 'gray': '#8D877E', 'white': '#E9E4DA'}[beard]
        blen = {'dark': 12, 'gray': 16, 'white': 22}[beard] * s
        p.append(f'<path d="M{hx-hr*0.9:.1f} {hy+hr*0.1:.1f} Q{hx-hr*0.8:.1f} {hy+hr+blen*0.6:.1f} {hx:.1f} {hy+hr+blen:.1f} Q{hx+hr*0.8:.1f} {hy+hr+blen*0.6:.1f} {hx+hr*0.9:.1f} {hy+hr*0.1:.1f} Q{hx:.1f} {hy+hr*0.55:.1f} {hx-hr*0.9:.1f} {hy+hr*0.1:.1f}Z" fill="{bc}"/>')
    if cover and not woman:
        # headcloth with a band
        p.append(f'<path d="M{hx-hr-3*s:.1f} {hy+hr*0.9:.1f} Q{hx-hr-4*s:.1f} {hy-hr-6*s:.1f} {hx:.1f} {hy-hr-6*s:.1f} Q{hx+hr+4*s:.1f} {hy-hr-6*s:.1f} {hx+hr+3*s:.1f} {hy+hr*0.9:.1f} L{hx+hr+6*s:.1f} {sh+10*s:.1f} L{hx+hr-1*s:.1f} {hy+hr*0.2:.1f} Q{hx:.1f} {hy-hr*0.55:.1f} {hx-hr+1*s:.1f} {hy+hr*0.2:.1f} L{hx-hr-6*s:.1f} {sh+10*s:.1f}Z" fill="{cover}"/>')
        if cover2:
            p.append(f'<path d="M{hx-hr-1*s:.1f} {hy-hr*0.45:.1f} Q{hx:.1f} {hy-hr*0.85:.1f} {hx+hr+1*s:.1f} {hy-hr*0.45:.1f}" stroke="{cover2}" stroke-width="{3.2*s:.1f}" fill="none"/>')
    elif not cover:
        p.append(f'<path d="M{hx-hr:.1f} {hy-hr*0.1:.1f} A{hr:.1f} {hr:.1f} 0 0 1 {hx+hr:.1f} {hy-hr*0.1:.1f} Q{hx:.1f} {hy-hr*0.65:.1f} {hx-hr:.1f} {hy-hr*0.1:.1f}Z" fill="{hair}"/>')
    return '\n'.join(p)

def staff(x1, y1, x2, y2, s=1):
    return f'<path d="M{x1} {y1} L{x2} {y2}" stroke="#5A3E25" stroke-width="{4*s}" stroke-linecap="round"/><path d="M{x2} {y2} q-6 -6 -2 -12" stroke="#5A3E25" stroke-width="{4*s}" fill="none" stroke-linecap="round"/>'

def stars(n, seed, ymax=200, color='#F4EFE6'):
    import random
    r = random.Random(seed); out = []
    for _ in range(n):
        x, y = r.uniform(4, W - 4), r.uniform(4, ymax); rr = r.choice([0.7, 0.9, 1.1, 1.4, 1.8])
        out.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rr}" fill="{color}" opacity="{r.uniform(.45,1):.2f}"/>')
    return ''.join(out)

def save(name, body):
    svg = f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{W}" height="{H}">{body}</svg>'
    open(os.path.join(OUT, f'person-{name}.svg'), 'w').write(svg)

# ---------- Noah: the ark at rest, the rainbow, the dove (Gen 8:4, 8:11, 9:13) ----------
rb = ''.join(f'<path d="M40 300 A200 200 0 0 1 440 300" stroke="{c}" stroke-width="7" fill="none" opacity=".55" transform="translate(0 {i*7})"/>' for i, c in enumerate(['#C0504D', '#D9894A', '#E2C15A', '#6FA36A', '#4F7FB0', '#6B5AA8']))
save('noah', defs('#41587A', '#C9B79A') + rb +
     f'<path d="M0 300 L120 190 L190 240 L260 170 L360 250 L480 210 L480 360 L0 360Z" fill="#5E6B5A"/><path d="M0 360 L0 320 Q240 290 480 320 L480 360Z" fill="#4A5547"/>'
     '<g transform="translate(150 158)"><path d="M0 40 L210 40 L190 74 L20 74Z" fill="#6B4A2F"/><rect x="40" y="10" width="130" height="30" fill="#7E5A3A"/><path d="M30 10 L105 -14 L180 10Z" fill="#5A3E25"/>'
     + ''.join(f'<rect x="{50+i*26}" y="20" width="12" height="9" fill="#3A2818"/>' for i in range(5)) + '<path d="M8 52 L202 52" stroke="#5A3E25" stroke-width="2"/></g>'
     '<g transform="translate(370 80)"><path d="M0 8 Q10 -2 22 6 Q12 6 8 14Z" fill="#F4EFE6"/><path d="M6 6 Q-4 -10 -14 -2 Q-4 0 4 10Z" fill="#E6E0D4"/><path d="M22 6 l14 -2" stroke="#5E7A3A" stroke-width="2"/><ellipse cx="38" cy="-4" rx="5" ry="2.5" fill="#6FA36A" transform="rotate(-25 38 -4)"/></g>'
     + person(110, 318, 132, robe='#6E5A44', sash='#A88A5C', beard='white', cover='#D9CDB6', cover2='#8C7A5A', arms='up'))

# ---------- Abraham: "Look now toward heaven, and tell the stars" (Gen 15:5) ----------
save('abraham', defs('#0E1426', '#2A3350') + stars(150, 7, 250) +
     '<circle cx="380" cy="70" r="70" fill="url(#glow)" opacity=".25"/>'
     '<path d="M0 300 Q120 280 240 296 T480 290 L480 360 L0 360Z" fill="#2A2620"/>'
     '<g transform="translate(300 230)"><path d="M0 70 L60 0 L120 70Z" fill="#4C3B2A"/><path d="M60 0 L60 70 L40 70Z" fill="#2E241A"/><path d="M60 0 L90 70" stroke="#6B553C" stroke-width="2"/></g>'
     + staff(208, 330, 222, 205) +
     person(190, 332, 140, robe='#5B4A3A', sash='#8C2F1E', beard='white', cover='#CFC2A8', cover2='#7A6748', arms='staff', face_dir=1))

# ---------- Sarah: old, at the tent, holding the son of the promise (Gen 18:10-12; 21:2, 6) ----------
baby = '<g><ellipse cx="{bx}" cy="{by}" rx="17" ry="11" fill="#F2EEE6"/><circle cx="{hx}" cy="{hy}" r="7" fill="#C9A27A"/></g>'
save('sarah', defs('#E9C48A', '#C98E5A') +
     '<circle cx="380" cy="90" r="46" fill="#F6E2B4" opacity=".85"/>'
     '<path d="M0 290 Q200 270 480 290 L480 360 L0 360Z" fill="#9B6B42"/>'
     '<g transform="translate(40 150)"><path d="M0 150 L120 0 L250 150Z" fill="#5A3E28"/><path d="M120 0 L170 150 L95 150Z" fill="#2E2016"/><path d="M60 75 L190 75" stroke="#7A5A3A" stroke-width="3"/></g>'
     + person(300, 330, 142, robe='#6A3B2E', sash='#C9A24A', cover='#E3D6BF', woman=True, arms='chest',
              extra='<ellipse cx="{x}" cy="{sh}" rx="0" ry="0"/>') +
     '<ellipse cx="300" cy="244" rx="18" ry="11" fill="#F2EEE6"/><circle cx="314" cy="238" r="7.5" fill="#C9A27A"/>'
     '<path d="M283 258 Q300 270 317 258" stroke="#F2EEE6" stroke-width="3" fill="none"/>')

# ---------- Jacob: the ladder at Bethel, the stone under his head (Gen 28:11-12) ----------
ladder = '<g opacity=".95"><path d="M210 300 L300 20 M250 300 L330 20" stroke="#F1D79A" stroke-width="4"/>' + ''.join(f'<path d="M{210+i*9.2:.1f} {300-i*28.6:.1f} L{250+i*8.2:.1f} {300-i*28.6:.1f}" stroke="#F1D79A" stroke-width="3"/>' for i in range(1, 10)) + '</g>'
def angel(x, y, s=1):
    return f'<g transform="translate({x} {y}) scale({s})" opacity=".9"><path d="M0 -6 Q-14 -2 -18 8 Q-8 6 -2 8Z" fill="#FFF4D6"/><path d="M0 -6 Q14 -2 18 8 Q8 6 2 8Z" fill="#FFF4D6"/><path d="M-5 0 L5 0 L8 20 L-8 20Z" fill="#FFFBF0"/><circle cx="0" cy="-8" r="4.5" fill="#FFFBF0"/></g>'
save('jacob', defs('#0F1630', '#2C2A48') + stars(90, 3, 240) +
     '<ellipse cx="320" cy="20" rx="160" ry="70" fill="url(#glow)" opacity=".55"/>' + ladder + angel(262, 190, 1) + angel(288, 110, .85) + angel(312, 46, .7) +
     '<path d="M0 300 Q240 284 480 300 L480 360 L0 360Z" fill="#3B3328"/>'
     '<ellipse cx="96" cy="300" rx="24" ry="13" fill="#7B7366"/>'
     # a young man lying asleep, wrapped in his cloak, head on the stone
     '<path d="M112 300 Q180 278 290 296 Q296 312 280 318 Q180 324 116 314Z" fill="#5C4632"/><path d="M150 292 Q220 284 286 300" stroke="#8C2F1E" stroke-width="5" fill="none"/>'
     f'<circle cx="104" cy="285" r="14" fill="{SKIN}"/><path d="M90 282 A14 14 0 0 1 118 280 Q104 274 90 282Z" fill="#2B211A"/><path d="M93 292 Q104 304 116 291" fill="#2B211A"/>')

# ---------- Joseph: seventeen, in the coat of many colours; the sheaves bow (Gen 37:2-3, 7) ----------
coat = '<g clip-path="url(#coatc)">' + ''.join(f'<rect x="{150+i*12}" y="0" width="12" height="360" fill="{c}"/>' for i, c in enumerate(['#8C2F1E', '#D9A441', '#2E6E86', '#5E8A4A', '#8C2F1E', '#7A4E8C', '#D9A441', '#2E6E86', '#5E8A4A', '#8C2F1E'])) + '</g>'
def sheaf(x, g, bow=0, s=1):
    return f'<g transform="translate({x} {g}) rotate({bow}) scale({s})"><path d="M-14 0 L-6 -46 L6 -46 L14 0Z" fill="#D9B45A"/>' + ''.join(f'<path d="M{-6+i*3} -46 L{-14+i*7} -66" stroke="#E7C76E" stroke-width="2.4"/>' for i in range(5)) + '<path d="M-9 -24 L9 -24" stroke="#8C6A2A" stroke-width="3"/></g>'
save('joseph', defs('#8FB3CF', '#E8D9B0', '<clipPath id="coatc"><path d="M220 223 Q213 272 210 322 L270 322 Q267 272 260 223 Q240 218 220 223Z"/></clipPath>') +
     '<path d="M0 300 Q240 280 480 300 L480 360 L0 360Z" fill="#B99A55"/>'
     + sheaf(70, 312, 22, .9) + sheaf(120, 318, 18, .95) + sheaf(380, 314, -20, .95) + sheaf(430, 310, -24, .9) + sheaf(330, 320, -14, 1) +
     person(240, 322, 128, robe='#7A4E8C', arms='out', hair='#2B211A') + coat +
     '<path d="M218 196 Q212 260 200 320 L280 320 Q268 260 262 196" fill="none" stroke="#00000033"/>')

# ---------- Moses: eighty, the rod stretched out over the sea (Exod 14:21; 7:7) ----------
wave = lambda x, d: f'<path d="M{x} 360 L{x} 120 Q{x+d*30} 80 {x+d*60} 112 Q{x+d*70} 200 {x+d*80} 360Z" fill="#2E6E86"/><path d="M{x} 360 L{x} 120 Q{x+d*30} 80 {x+d*60} 112" stroke="#BFE3EC" stroke-width="3" fill="none"/>'
save('moses', defs('#3B4766', '#C9A97A') +
     '<path d="M0 360 L0 100 Q60 70 120 110 Q140 200 150 360Z" fill="#2E6E86"/><path d="M0 100 Q60 70 120 110" stroke="#BFE3EC" stroke-width="3" fill="none"/>'
     '<path d="M480 360 L480 100 Q420 70 360 110 Q340 200 330 360Z" fill="#2E6E86"/><path d="M480 100 Q420 70 360 110" stroke="#BFE3EC" stroke-width="3" fill="none"/>'
     '<path d="M150 360 L190 160 L290 160 L330 360Z" fill="#C7A673"/><path d="M200 200 L280 200 M180 260 L300 260" stroke="#B08E5E" stroke-width="2"/>'
     + staff(262, 330, 300, 152) +
     person(240, 334, 146, robe='#5B4433', sash='#2E6E86', beard='white', cover='#D9CDB6', cover2='#8C7A5A', arms='staff', face_dir=1))

# ---------- Aaron: high priest in the holy garments (Exod 28: ephod, breastplate of twelve stones, mitre with the gold plate) ----------
stones = ''.join(f'<rect x="{-15+c*11}" y="{-20+r*10}" width="8" height="7" rx="1.5" fill="{col}"/>' for r, row in enumerate([['#B33A3A', '#D9A441', '#3E8A5A'], ['#2E6E86', '#3A4E9A', '#E8E4DA'], ['#C47A3A', '#7A4E8C', '#9A2A5A'], ['#5EA3A0', '#3A3A3A', '#7FA36A']]) for c, col in enumerate(row))
save('aaron', defs('#2C2318', '#5A4630') +
     '<rect x="0" y="0" width="480" height="360" fill="#4A3826"/>' + ''.join(f'<rect x="{i*48}" y="0" width="22" height="300" fill="#B39459" opacity=".18"/>' for i in range(10)) +
     '<path d="M0 300 L480 300 L480 360 L0 360Z" fill="#2A2018"/>'
     # altar of incense with smoke
     '<g transform="translate(330 220)"><rect x="0" y="0" width="56" height="80" fill="#C9A24A"/><rect x="-4" y="-6" width="64" height="8" fill="#E3C46A"/><path d="M28 -10 Q10 -50 32 -80 Q50 -110 28 -150" stroke="#EDE6D6" stroke-width="10" fill="none" opacity=".5" stroke-linecap="round"/></g>'
     + person(200, 326, 150, robe='#2E4E8C', arms='chest', beard='gray', cover='#F4EFE6', cover2='#D7C49A',
              extra='<g transform="translate({x} {sh})"><path d="M-22 6 L22 6 L20 70 L-20 70Z" fill="#C9A24A" opacity=".9"/><path d="M-22 6 L-8 0 M22 6 L8 0" stroke="#C9A24A" stroke-width="6"/><g transform="translate(0 40)"><rect x="-19" y="-24" width="38" height="44" rx="3" fill="#B39459"/>' + stones + '</g></g>') +
     '<rect x="187" y="182" width="26" height="5" fill="#D7C49A"/>'
     '<g transform="translate(200 400)">' + ''.join(f'<circle cx="{-30+i*10}" cy="-74" r="3" fill="#D7C49A"/>' for i in range(7)) + '</g>')

# ---------- Miriam: the prophetess, a timbrel in her hand, by the sea (Exod 15:20) ----------
tim = '<g transform="translate(312 150)"><circle r="17" fill="#D9B45A"/><circle r="12" fill="#EED79A"/>' + ''.join(f'<circle cx="{17*__import__("math").cos(a/6*6.283):.1f}" cy="{17*__import__("math").sin(a/6*6.283):.1f}" r="3" fill="#B39459"/>' for a in range(6)) + '</g>'
save('miriam', defs('#E2B77A', '#9DB7C2') +
     '<path d="M0 230 Q240 214 480 232 L480 290 L0 290Z" fill="#2E6E86"/><path d="M0 240 Q120 232 240 240 T480 238" stroke="#BFE3EC" stroke-width="2" fill="none"/>'
     '<path d="M0 286 Q240 270 480 286 L480 360 L0 360Z" fill="#D8B98A"/>'
     + person(110, 322, 104, robe='#6E5A44', cover='#CFC2A8', woman=True, arms='up') +
     person(400, 318, 100, robe='#5E4A3A', cover='#BFAF92', woman=True, arms='up') +
     person(260, 334, 148, robe='#8C2F1E', sash='#D7C49A', cover='#E9E0CE', woman=True, arms='up') + tim)

# ---------- Peter: the fisherman, nets so full they break (Luke 5:6; Matt 4:18) ----------
net = '<g stroke="#E8E2D2" stroke-width="1.4" opacity=".85">' + ''.join(f'<path d="M{300+i*12} 236 L{280+i*14} 312"/>' for i in range(10)) + ''.join(f'<path d="M{296-j*2} {244+j*12} L{430+j*2} {244+j*12}"/>' for j in range(6)) + '</g>'
fish = ''.join(f'<path d="M{x} {y} q10 -6 20 0 q-10 6 -20 0Z M{x+20} {y} l6 -5 l0 10Z" fill="#C8D3D6"/>' for x, y in [(310, 280), (340, 296), (372, 274), (396, 300), (322, 304), (360, 286)])
save('peter', defs('#7FA3B8', '#E9D8B4') +
     '<path d="M0 230 Q240 216 480 232 L480 360 L0 360Z" fill="#2E6E86"/>' + ''.join(f'<path d="M{i*60} {260+i%3*20} q15 -6 30 0" stroke="#BFE3EC" stroke-width="2" fill="none"/>' for i in range(8)) +
     '<path d="M60 250 L300 250 L270 300 L90 300Z" fill="#6B4A2F"/><path d="M60 250 L300 250" stroke="#4A3220" stroke-width="5"/><path d="M180 250 L180 80" stroke="#4A3220" stroke-width="5"/><path d="M182 88 L262 236 L182 236Z" fill="#E9E0CE" opacity=".9"/>'
     + person(140, 252, 112, robe='#4A5A6A', sash='#8C6A4A', beard='dark', cover=None, hair='#3A2A1E', arms='out') + net + fish)

# ---------- Paul: in chains, writing to the churches (Eph 6:20; Phil 1:13; Col 4:18) ----------
save('paul', defs('#2A2420', '#4A3E32') +
     '<rect x="0" y="0" width="480" height="360" fill="#3A3029"/>' + ''.join(f'<rect x="{(i%6)*80+(i//6%2)*40}" y="{(i//6)*40}" width="78" height="38" fill="#433830"/>' for i in range(54)) +
     '<rect x="330" y="50" width="80" height="90" fill="#1A1A22"/><path d="M350 50 L350 140 M370 50 L370 140 M390 50 L390 140" stroke="#2B2B2B" stroke-width="5"/><rect x="330" y="50" width="80" height="90" fill="#9DB7C2" opacity=".18"/>'
     '<path d="M0 320 L480 320 L480 360 L0 360Z" fill="#2A221C"/>'
     '<rect x="250" y="250" width="150" height="12" fill="#6B4A2F"/><rect x="262" y="262" width="10" height="58" fill="#5A3E25"/><rect x="378" y="262" width="10" height="58" fill="#5A3E25"/>'
     '<g transform="translate(300 236)"><rect x="0" y="0" width="70" height="14" rx="4" fill="#E9DFC6"/><path d="M8 5 h50 M8 9 h40" stroke="#7A6A50" stroke-width="1.4"/></g>'
     '<g transform="translate(380 238)"><path d="M0 12 L4 0 L10 0 L14 12Z" fill="#8C6A3A"/><ellipse cx="7" cy="-2" rx="3" ry="6" fill="#F5C76A"/></g><circle cx="387" cy="232" r="40" fill="url(#glow)" opacity=".35"/>'
     + person(220, 320, 136, robe='#5E3A2E', sash='#8C7A5A', beard='gray', hair='#5A4A3A', arms='write', face_dir=1) +
     '<path d="M246 248 q8 10 16 4 q8 -6 16 4 q8 10 16 4 q8 -6 16 6 q10 16 -10 40 L280 330" stroke="#8D877E" stroke-width="3.2" fill="none"/><rect x="236" y="240" width="14" height="10" rx="3" fill="#6E6A63"/>')
print('ok')
