// 3D tabernacle (three.js, MIT). Court coordinates are in cubits: x 0–50 (south→north),
// y 0–100 (west→east, the gate is at y=100). World: X = x-25, Z = y-50, Y = up.
import * as THREE from './three.module.min.js';

const host = document.querySelector('.t3d');
if (host) init(host);

function init(host) {
  const vp = host.querySelector('.t3v'), info = host.querySelector('.t3i');
  const items = JSON.parse(host.dataset.items || '[]'), steps = JSON.parse(host.dataset.steps || '[]');
  const W = (x, y, h = 0) => new THREE.Vector3(x - 25, h, y - 50);

  // ---------- renderer ----------
  let R;
  try { R = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' }); }
  catch (e) { vp.innerHTML = '<p class="t3err">المتصفح لا يدعم العرض ثلاثي الأبعاد. جرّب متصفحاً آخر.</p>'; return; }
  R.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  R.outputColorSpace = THREE.SRGBColorSpace;
  R.toneMapping = THREE.ACESFilmicToneMapping; R.toneMappingExposure = 1.05;
  R.shadowMap.enabled = true; R.shadowMap.type = THREE.PCFSoftShadowMap;
  vp.appendChild(R.domElement);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xe9dcc0, 160, 520);
  const cam3 = new THREE.PerspectiveCamera(40, 1, 0.3, 1500);

  // ---------- procedural textures ----------
  const canvasTex = (w, h, draw, rep) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
    if (rep) { t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); }
    return t;
  };
  const rnd = (() => { let s = 7; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();
  const sky = canvasTex(16, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, 0, h);
    gr.addColorStop(0, '#6E9BC2'); gr.addColorStop(0.38, '#B9D0DE'); gr.addColorStop(0.5, '#F1E6CF'); gr.addColorStop(0.52, '#D8C49C'); gr.addColorStop(1, '#B89C6E');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
  });
  const sand = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#D6C29A'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 2600; i++) { const v = 150 + rnd() * 70 | 0; g.fillStyle = `rgba(${v + 30},${v + 12},${v - 20},${0.08 + rnd() * 0.12})`; g.fillRect(rnd() * w, rnd() * h, 1 + rnd() * 3, 1 + rnd() * 2); }
    for (let i = 0; i < 18; i++) { g.strokeStyle = 'rgba(160,130,90,.10)'; g.lineWidth = 6 + rnd() * 10; g.beginPath(); const y = rnd() * h; g.moveTo(0, y); g.bezierCurveTo(w * .3, y + 12, w * .6, y - 12, w, y + 4); g.stroke(); }
  }, [60, 60]);
  const linen = canvasTex(128, 64, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, 0);
    for (let i = 0; i <= 8; i++) gr.addColorStop(i / 8, i % 2 ? '#F7F3EA' : '#E4DDCF');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.fillStyle = 'rgba(0,0,0,.05)'; g.fillRect(0, h - 4, w, 4);
  }, [1, 1]);
  const weave = (rep) => canvasTex(512, 256, (g, w, h) => {
    const cols = ['#1E3F8A', '#5B2A6E', '#A3222A', '#F2EEE4'];
    for (let x = 0; x < w; x += 16) { g.fillStyle = cols[(x / 16) % 4]; g.fillRect(x, 0, 16, h); }
    g.globalAlpha = .55; g.strokeStyle = '#E2C26A'; g.lineWidth = 3;
    for (let y = 30; y < h; y += 64) for (let x = 20; x < w; x += 64) { g.beginPath(); g.moveTo(x, y + 16); g.quadraticCurveTo(x + 16, y - 10, x + 32, y + 16); g.quadraticCurveTo(x + 16, y + 6, x, y + 16); g.stroke(); }
    g.globalAlpha = 1;
  }, rep);
  const veilTex = canvasTex(512, 512, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, h); gr.addColorStop(0, '#203E86'); gr.addColorStop(.5, '#4E2A6A'); gr.addColorStop(1, '#8E1F2A');
    g.fillStyle = gr; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(232,201,120,.85)'; g.lineWidth = 5;
    [[150, 220], [362, 220]].forEach(([cx, cy], k) => { // stylised cherub wings, embroidered
      for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(cx, cy + 70); g.quadraticCurveTo(cx + (k ? -1 : 1) * (40 + i * 22), cy - 60 + i * 10, cx + (k ? -1 : 1) * (110 + i * 6), cy - 120 + i * 30); g.stroke(); }
      g.beginPath(); g.ellipse(cx, cy + 110, 26, 46, 0, 0, Math.PI * 2); g.stroke();
    });
    g.fillStyle = 'rgba(242,238,228,.18)'; for (let x = 0; x < w; x += 8) g.fillRect(x, 0, 2, h);
  });
  const leather = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#4A3A2C'; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 1600; i++) { g.fillStyle = `rgba(${30 + rnd() * 50},${25 + rnd() * 35},${20 + rnd() * 25},.35)`; g.fillRect(rnd() * w, rnd() * h, 2 + rnd() * 6, 1 + rnd() * 3); }
    g.strokeStyle = 'rgba(20,14,8,.5)'; g.lineWidth = 2; for (let y = 0; y < h; y += 64) { g.beginPath(); g.moveTo(0, y); g.lineTo(w, y); g.stroke(); }
  }, [3, 3]);
  const boards = canvasTex(256, 256, (g, w, h) => {
    const gr = g.createLinearGradient(0, 0, w, 0); gr.addColorStop(0, '#C9A04A'); gr.addColorStop(.5, '#E8C870'); gr.addColorStop(1, '#C9A04A');
    for (let x = 0; x < w; x += 32) { g.fillStyle = gr; g.fillRect(x, 0, 32, h); g.fillStyle = 'rgba(90,60,10,.45)'; g.fillRect(x, 0, 2, h); }
  }, [6, 1]);
  const ceiling = canvasTex(256, 256, (g, w, h) => {
    g.fillStyle = '#2B3F7E'; g.fillRect(0, 0, w, h);
    g.strokeStyle = 'rgba(232,201,120,.7)'; g.lineWidth = 3;
    for (let y = 32; y < h; y += 64) for (let x = 32; x < w; x += 64) { g.beginPath(); g.moveTo(x - 20, y + 10); g.quadraticCurveTo(x, y - 16, x + 20, y + 10); g.stroke(); }
  }, [3, 6]);
  const glowTex = canvasTex(128, 128, (g, w) => {
    const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); gr.addColorStop(0, 'rgba(255,248,220,1)'); gr.addColorStop(.35, 'rgba(255,226,150,.55)'); gr.addColorStop(1, 'rgba(255,220,140,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, w);
  });
  const puffTex = canvasTex(128, 128, (g, w) => {
    const gr = g.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2); gr.addColorStop(0, 'rgba(255,255,255,.9)'); gr.addColorStop(.6, 'rgba(245,242,235,.35)'); gr.addColorStop(1, 'rgba(240,236,228,0)');
    g.fillStyle = gr; g.fillRect(0, 0, w, w);
  });

  // ---------- lights & environment ----------
  const envScene = new THREE.Scene();
  envScene.add(new THREE.Mesh(new THREE.SphereGeometry(10, 32, 16), new THREE.MeshBasicMaterial({ map: sky, side: THREE.BackSide })));
  const sun0 = new THREE.Mesh(new THREE.SphereGeometry(1.2, 16, 8), new THREE.MeshBasicMaterial({ color: 0xfff1d0 })); sun0.position.set(5, 6, 4); envScene.add(sun0);
  const pm = new THREE.PMREMGenerator(R); scene.environment = pm.fromScene(envScene, 0.035).texture;
  const skyMesh = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.MeshBasicMaterial({ map: sky, side: THREE.BackSide, fog: false }));
  scene.add(skyMesh);
  scene.add(new THREE.HemisphereLight(0xdbe6f0, 0xb79a6a, 0.55));
  const sun = new THREE.DirectionalLight(0xfff0d6, 2.4);
  sun.position.set(60, 90, 40); sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048); Object.assign(sun.shadow.camera, { left: -75, right: 75, top: 75, bottom: -75, near: 10, far: 260 });
  sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03;
  scene.add(sun);

  // ---------- materials ----------
  const M = {
    gold: new THREE.MeshStandardMaterial({ color: 0xd8ac3e, metalness: 0.9, roughness: 0.28 }),
    goldB: new THREE.MeshStandardMaterial({ map: boards, color: 0xffffff, metalness: 0.75, roughness: 0.35 }),
    bronze: new THREE.MeshStandardMaterial({ color: 0x9c5e2c, metalness: 0.75, roughness: 0.42 }),
    silver: new THREE.MeshStandardMaterial({ color: 0xd9dde2, metalness: 0.9, roughness: 0.3 }),
    acacia: new THREE.MeshStandardMaterial({ color: 0x8a5a2b, roughness: 0.8 }),
    linen: new THREE.MeshStandardMaterial({ map: linen, roughness: 0.95, side: THREE.DoubleSide }),
    gate: new THREE.MeshStandardMaterial({ map: weave([2, 1]), roughness: 0.9, side: THREE.DoubleSide }),
    door: new THREE.MeshStandardMaterial({ map: weave([1, 1]), roughness: 0.9, side: THREE.DoubleSide }),
    veil: new THREE.MeshStandardMaterial({ map: veilTex, roughness: 0.85, side: THREE.DoubleSide }),
    tachash: new THREE.MeshStandardMaterial({ map: leather, roughness: 0.95 }),
    ram: new THREE.MeshStandardMaterial({ color: 0x8e2a22, roughness: 0.85 }),
    goatHair: new THREE.MeshStandardMaterial({ color: 0x2b2622, roughness: 1 }),
    ceil: new THREE.MeshStandardMaterial({ map: ceiling, roughness: 0.9, side: THREE.DoubleSide }),
    sand: new THREE.MeshStandardMaterial({ map: sand, roughness: 1 }),
    floor: new THREE.MeshStandardMaterial({ color: 0xe0d0ad, roughness: 1 }),
    water: new THREE.MeshStandardMaterial({ color: 0x7fb3bd, metalness: 0.2, roughness: 0.08 }),
    bread: new THREE.MeshStandardMaterial({ color: 0xd9a25e, roughness: 0.9 }),
    flame: new THREE.MeshBasicMaterial({ color: 0xffb347, transparent: true, opacity: 0.9 }),
    white: new THREE.MeshStandardMaterial({ color: 0xf6f3ec, roughness: 0.9 }),
    blood: new THREE.MeshBasicMaterial({ color: 0x8a0f14 })
  };
  const shadowy = (o) => { o.traverse((m) => { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } }); return o; };
  const box = (w, h, d, mat, x, y, z, parent = scene) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m; };
  const cyl = (rt, rb, h, mat, x, y, z, parent = scene, seg = 16) => { const m = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, seg), mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; parent.add(m); return m; };

  // ---------- ground, mountains ----------
  const ground = new THREE.Mesh(new THREE.CircleGeometry(700, 64), M.sand); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
  const courtFloor = new THREE.Mesh(new THREE.PlaneGeometry(50, 100), M.floor); courtFloor.rotation.x = -Math.PI / 2; courtFloor.position.y = 0.02; courtFloor.receiveShadow = true; scene.add(courtFloor);
  const mtnMat = new THREE.MeshStandardMaterial({ color: 0x9c7552, roughness: 1, flatShading: true });
  for (let i = 0; i < 26; i++) {
    const a = (i / 26) * Math.PI * 2 + rnd() * 0.2, r = 330 + rnd() * 120, h = 40 + rnd() * 90;
    const m = new THREE.Mesh(new THREE.ConeGeometry(50 + rnd() * 60, h, 5 + (rnd() * 3 | 0)), mtnMat);
    m.position.set(Math.cos(a) * r, h / 2 - 2, Math.sin(a) * r); m.rotation.y = rnd() * 3; scene.add(m);
  }

  // ---------- the camp: tents of the tribes around the court ----------
  {
    const tentGeo = new THREE.ConeGeometry(2.6, 3.2, 4); tentGeo.rotateY(Math.PI / 4); tentGeo.translate(0, 1.6, 0);
    const N = 168, inst = new THREE.InstancedMesh(tentGeo, new THREE.MeshStandardMaterial({ roughness: 0.95 }), N);
    const cols = [0x6d4f36, 0x7b5d3e, 0x5b4632, 0x8a6a48, 0x4f3d2c].map((c) => new THREE.Color(c));
    const mtx = new THREE.Matrix4(); let k = 0;
    const put = (x, z) => { if (k >= N) return; const s = 0.8 + rnd() * 0.5; mtx.compose(new THREE.Vector3(x, 0, z), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), rnd() * 0.6), new THREE.Vector3(s, s, s)); inst.setMatrixAt(k, mtx); inst.setColorAt(k, cols[k % cols.length]); k++; };
    for (let i = 0; i < 6; i++) for (let j = 0; j < 7; j++) { put(-55 - i * 8 + rnd() * 2, -48 + j * 14 + rnd() * 3); put(55 + i * 8 + rnd() * 2, -48 + j * 14 + rnd() * 3); }
    for (let i = 0; i < 6; i++) for (let j = 0; j < 7; j++) { put(-42 + j * 14 + rnd() * 3, -78 - i * 8 + rnd() * 2); if (Math.abs(-42 + j * 14) > 18) put(-42 + j * 14 + rnd() * 3, 80 + i * 8 + rnd() * 2); }
    inst.count = k; inst.castShadow = inst.receiveShadow = true; scene.add(inst);
  }

  // ---------- court fence: 60 posts, linen hangings, the gate ----------
  const fence = new THREE.Group(); scene.add(fence);
  const posts = [];
  for (let k = 0; k <= 20; k++) { posts.push([0, k * 5], [50, k * 5]); }
  for (let k = 1; k < 10; k++) { posts.push([k * 5, 0], [k * 5, 100]); }
  posts.forEach(([x, y]) => {
    const p = W(x, y);
    cyl(0.22, 0.22, 5, M.acacia, p.x, 2.5, p.z, fence, 10);
    cyl(0.42, 0.48, 0.5, M.bronze, p.x, 0.25, p.z, fence, 10);
    cyl(0.3, 0.26, 0.35, M.silver, p.x, 5.05, p.z, fence, 10);
  });
  const hang = (x0, y0, x1, y1, mat, h = 5) => {
    const a = W(x0, y0), b = W(x1, y1), len = a.distanceTo(b);
    const m = new THREE.Mesh(new THREE.PlaneGeometry(len, h), mat);
    m.position.set((a.x + b.x) / 2, h / 2 + 0.1, (a.z + b.z) / 2); m.rotation.y = Math.atan2(-(b.z - a.z), b.x - a.x);
    m.castShadow = m.receiveShadow = true; fence.add(m);
    if (mat === M.linen) { mat.map.repeat.set(len / 5, 1); }
    // silver rod
    const r = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, len, 6), M.silver); r.rotation.z = Math.PI / 2; r.rotation.y = m.rotation.y; r.position.set(m.position.x, h + 0.1, m.position.z); fence.add(r);
    return m;
  };
  const lin = (len) => { const t = linen.clone(); t.needsUpdate = true; t.repeat.set(len / 5, 1); return new THREE.MeshStandardMaterial({ map: t, roughness: 0.95, side: THREE.DoubleSide }); };
  hang(0, 0, 0, 100, lin(100)); hang(50, 0, 50, 100, lin(100)); hang(0, 0, 50, 0, lin(50));
  hang(0, 100, 15, 100, lin(15)); hang(35, 100, 50, 100, lin(15));
  const gateMesh = hang(15, 100, 35, 100, M.gate);

  // ---------- altar of burnt offering ----------
  const altar = new THREE.Group(); altar.position.copy(W(25, 70)); scene.add(altar);
  box(5, 3, 5, M.bronze, 0, 1.5, 0, altar);
  box(5.15, 0.35, 5.15, M.bronze, 0, 1.6, 0, altar); // the grate ledge
  [[-2.3, -2.3], [2.3, -2.3], [-2.3, 2.3], [2.3, 2.3]].forEach(([x, z]) => { const h = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.8, 6), M.bronze); h.position.set(x, 3.35, z); h.castShadow = true; altar.add(h); });
  [-1.8, 1.8].forEach((z) => box(7.6, 0.18, 0.18, M.bronze, 0, 1.6, z, altar));
  const coals = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.2, 4.4), new THREE.MeshStandardMaterial({ color: 0x3a1a0a, emissive: 0xff5a1a, emissiveIntensity: 0.9 })); coals.position.y = 3.02; altar.add(coals);
  const fire = new THREE.Group(); altar.add(fire); fire.position.y = 3.1;
  for (let i = 0; i < 7; i++) { const f = new THREE.Mesh(new THREE.ConeGeometry(0.45 + rnd() * 0.3, 1.6 + rnd() * 1.4, 8), M.flame.clone()); f.position.set((rnd() - 0.5) * 3, 0.8, (rnd() - 0.5) * 3); f.userData.p = rnd() * 6; fire.add(f); }
  const fireLight = new THREE.PointLight(0xff8a3a, 30, 22, 2); fireLight.position.y = 5; altar.add(fireLight);

  // ---------- laver ----------
  const laver = new THREE.Group(); laver.position.copy(W(25, 52)); scene.add(laver);
  cyl(0.9, 1.2, 1.3, M.bronze, 0, 0.65, 0, laver);
  cyl(1.7, 1.1, 0.9, M.bronze, 0, 1.75, 0, laver, 24);
  const wtr = new THREE.Mesh(new THREE.CircleGeometry(1.6, 24), M.water); wtr.rotation.x = -Math.PI / 2; wtr.position.y = 2.15; laver.add(wtr);

  // ---------- the tent: boards on silver sockets, coverings, door, veil ----------
  const tent = new THREE.Group(); scene.add(tent);
  const T0 = W(20, 10), T1 = W(30, 40); // x -5..5, z -40..-10
  const wallN = box(0.6, 10, 30, M.goldB, T0.x - 0.3, 5, (T0.z + T1.z) / 2, tent);
  const wallS = box(0.6, 10, 30, M.goldB, T1.x + 0.3, 5, (T0.z + T1.z) / 2, tent);
  const wallW = box(10.6, 10, 0.6, M.goldB, 0, 5, T0.z - 0.3, tent);
  for (let z = T0.z; z <= T1.z - 0.7; z += 1.5) { box(0.62, 0.5, 0.7, M.silver, T0.x - 0.3, 0.27, z + 0.75, tent); box(0.62, 0.5, 0.7, M.silver, T1.x + 0.3, 0.27, z + 0.75, tent); }
  // door: five gold pillars and the embroidered screen
  for (let i = 0; i < 5; i++) cyl(0.2, 0.2, 10, M.gold, -4.6 + i * 2.3, 5, T1.z - 0.2, tent, 12);
  const door = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), M.door); door.position.set(0, 5, T1.z - 0.05); tent.add(door); door.castShadow = true;
  // inner ceiling (cherubim curtain) and the outer coverings
  const ceil = new THREE.Mesh(new THREE.PlaneGeometry(10, 30), M.ceil); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, 9.95, (T0.z + T1.z) / 2); tent.add(ceil);
  const cover = new THREE.Group(); tent.add(cover);
  const drape = (w, d, h, mat, lift) => { // roof slab plus side drapes hanging down
    const g = new THREE.Group();
    box(w, 0.25, d, mat, 0, 10.2 + lift, 0, g);
    box(0.22, h, d, mat, -w / 2, 10.2 + lift - h / 2, 0, g); box(0.22, h, d, mat, w / 2, 10.2 + lift - h / 2, 0, g);
    box(w, h, 0.22, mat, 0, 10.2 + lift - h / 2, -d / 2, g);
    g.position.z = (T0.z + T1.z) / 2 - 0.1; cover.add(g); return g;
  };
  drape(12.4, 31.4, 8.6, M.goatHair, 0);
  drape(12.8, 31.8, 8.2, M.ram, 0.25);
  drape(13.2, 32.2, 7.9, M.tachash, 0.5);
  // the veil and four pillars
  for (let i = 0; i < 4; i++) cyl(0.2, 0.2, 10, M.gold, -3.75 + i * 2.5, 5, W(25, 20).z, tent, 12);
  const veil = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), M.veil); veil.position.set(0, 5, W(25, 20).z + 0.1); tent.add(veil);

  // ---------- furniture inside ----------
  const table = new THREE.Group(); table.position.copy(W(28.25, 26.5)); scene.add(table);
  box(1.5, 0.12, 3, M.gold, 0, 1.5, 0, table);
  [[-0.65, -1.4], [0.65, -1.4], [-0.65, 1.4], [0.65, 1.4]].forEach(([x, z]) => box(0.12, 1.45, 0.12, M.gold, x, 0.73, z, table));
  [-0.7, 0.7].forEach((z) => { for (let i = 0; i < 6; i++) { const l = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.11, 18), M.bread); l.position.set(0, 1.62 + i * 0.12, z); l.castShadow = true; table.add(l); } });
  const lamp = new THREE.Group(); lamp.position.copy(W(21.75, 26.5)); scene.add(lamp);
  cyl(0.5, 0.65, 0.25, M.gold, 0, 0.12, 0, lamp, 16);
  cyl(0.07, 0.09, 3, M.gold, 0, 1.6, 0, lamp, 10);
  const flames = [];
  for (let i = 1; i <= 3; i++) { // branches: torus arcs on each side
    const r = i * 0.38, arc = new THREE.Mesh(new THREE.TorusGeometry(r, 0.055, 6, 18, Math.PI), M.gold); arc.rotation.z = Math.PI; arc.rotation.y = Math.PI / 2; arc.position.y = 2.95 - 0.05; arc.scale.y = 1.25; lamp.add(arc);
    [-r, r].forEach((z) => { cyl(0.06, 0.06, 0.25, M.gold, 0, 3.0, z, lamp, 8); flames.push([0, 3.2, z]); });
  }
  flames.push([0, 3.2, 0]);
  flames.forEach(([x, y, z]) => { const f = new THREE.Mesh(new THREE.ConeGeometry(0.07, 0.28, 8), M.flame.clone()); f.position.set(x, y, z); f.userData.p = rnd() * 6; lamp.add(f); f.userData.small = true; });
  const lampLight = new THREE.PointLight(0xffc070, 14, 16, 2); lampLight.position.set(0, 3.6, 0); lamp.add(lampLight);
  const incense = new THREE.Group(); incense.position.copy(W(25, 22)); scene.add(incense);
  box(1, 2, 1, M.gold, 0, 1, 0, incense);
  [[-0.45, -0.45], [0.45, -0.45], [-0.45, 0.45], [0.45, 0.45]].forEach(([x, z]) => { const h = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.25, 6), M.gold); h.position.set(x, 2.12, z); incense.add(h); });
  const ark = new THREE.Group(); ark.position.copy(W(25, 15)); scene.add(ark);
  box(2.5, 1.5, 1.5, M.gold, 0, 0.75, 0, ark);
  box(2.6, 0.12, 1.6, M.gold, 0, 1.56, 0, ark); // mercy seat
  [-0.6, 0.6].forEach((z) => box(4.2, 0.1, 0.1, M.gold, 0, 0.45, z, ark));
  [-1, 1].forEach((s) => { // cherubim: kneeling forms, wings arched over the mercy seat
    const c = new THREE.Group(); c.position.set(s * 1.05, 1.6, 0); ark.add(c);
    box(0.32, 0.6, 0.32, M.gold, 0, 0.3, 0, c);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 8), M.gold); head.position.set(-s * 0.06, 0.72, 0); c.add(head);
    [-0.36, 0.36].forEach((z) => { const wg = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.06, 0.34), M.gold); wg.position.set(-s * 0.42, 0.95, z); wg.rotation.z = s * 0.55; c.add(wg); });
  });
  const glory = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); glory.scale.set(3.2, 3.2, 1); glory.position.copy(W(25, 15, 3.2)); scene.add(glory);
  const gloryLight = new THREE.PointLight(0xffe7b0, 12, 12, 2); gloryLight.position.copy(W(25, 15, 3)); scene.add(gloryLight);
  [table, lamp, incense, ark, laver, altar, tent].forEach(shadowy);

  // ---------- pillar of cloud over the tent ----------
  const cloud = new THREE.Group(); scene.add(cloud);
  for (let i = 0; i < 26; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffTex, transparent: true, depthWrite: false, opacity: 0.55 })); const k = 6 + rnd() * 7; s.scale.set(k, k, 1); s.position.set((rnd() - 0.5) * 6, 16 + i * 1.6, -25 + (rnd() - 0.5) * 6); s.userData.p = rnd() * 6; cloud.add(s); }

  // ---------- Day of Atonement props ----------
  const priest = new THREE.Group(); scene.add(priest); priest.visible = false;
  { const robe = new THREE.Mesh(new THREE.CapsuleGeometry(0.42, 1.3, 4, 12), M.white); robe.position.y = 1.1; priest.add(robe);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.28, 14, 10), new THREE.MeshStandardMaterial({ color: 0xc89b72, roughness: 0.8 })); head.position.y = 2.15; priest.add(head);
    const turban = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.32, 0.3, 14), M.white); turban.position.y = 2.38; priest.add(turban);
    const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, opacity: 0.6 })); halo.scale.set(3, 3, 1); halo.position.y = 1; priest.add(halo); shadowy(priest); }
  const goat = (col) => { const g = new THREE.Group(); const m = new THREE.MeshStandardMaterial({ color: col, roughness: 0.95 });
    box(1.2, 0.55, 0.45, m, 0, 0.75, 0, g); box(0.35, 0.35, 0.3, m, 0.7, 1.05, 0, g);
    [[-0.45, -0.15], [0.45, -0.15], [-0.45, 0.15], [0.45, 0.15]].forEach(([x, z]) => cyl(0.05, 0.05, 0.5, m, x, 0.25, z, g, 6));
    [-0.08, 0.08].forEach((z) => { const h = new THREE.Mesh(new THREE.ConeGeometry(0.04, 0.3, 6), M.goatHair); h.position.set(0.66, 1.3, z); h.rotation.z = 0.5; g.add(h); });
    g.visible = false; scene.add(shadowy(g)); return g; };
  const goatA = goat(0x5a4a3c), goatB = goat(0xcbbba0);
  const tag = (g, c) => { const r = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.05, 6, 16), new THREE.MeshBasicMaterial({ color: c })); r.position.set(0.55, 0.95, 0); r.rotation.y = Math.PI / 2; g.add(r); };
  tag(goatA, 0x8c1d2a); tag(goatB, 0xd2a53a);
  const smoke = new THREE.Group(); scene.add(smoke); smoke.position.copy(W(25, 16, 1.6));
  for (let i = 0; i < 16; i++) { const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffTex, transparent: true, depthWrite: false, opacity: 0 })); s.userData.p = i / 16; smoke.add(s); }
  const blood = new THREE.Group(); scene.add(blood); blood.position.copy(W(25, 15, 1.63)); blood.visible = false;
  for (let i = 0; i < 7; i++) { const d = new THREE.Mesh(new THREE.CircleGeometry(0.09 + rnd() * 0.06, 10), M.blood); d.rotation.x = -Math.PI / 2; d.position.set(-0.6 + i * 0.2, 0, 0.9 + (i % 2) * 0.12); blood.add(d); }
  const outFire = new THREE.Group(); outFire.position.copy(W(6, 120)); scene.add(outFire); outFire.visible = false;
  for (let i = 0; i < 6; i++) { const f = new THREE.Mesh(new THREE.ConeGeometry(0.6, 2 + rnd() * 1.5, 8), M.flame.clone()); f.position.set((rnd() - 0.5) * 2, 1, (rnd() - 0.5) * 2); f.userData.p = rnd() * 6; outFire.add(f); }
  outFire.add(new THREE.PointLight(0xff7a2a, 25, 25, 2));

  // ---------- hotspots (HTML pins projected from 3D) ----------
  const PIN = { gate: W(25, 100, 6.2), altar: W(25, 70, 5.4), laver: W(25, 52, 3.6), table: W(28.25, 26.5, 3), lamp: W(21.75, 26.5, 4.3), incense: W(25, 22, 3), veil: W(25, 20, 10.8), ark: W(25, 15, 3.4) };
  const inside = { table: 1, lamp: 1, incense: 1, veil: 1, ark: 1 };
  const layer = document.createElement('div'); layer.className = 'p3l'; vp.appendChild(layer);
  const pins = items.filter((it) => PIN[it.id]).map((it) => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'p3'; b.style.setProperty('--c', it.color);
    b.innerHTML = '<b>' + it.num + '</b><span>' + it.name + '</span>'; b.setAttribute('data-it', it.id); b.setAttribute('aria-label', it.name);
    layer.appendChild(b); return { b, p: PIN[it.id], id: it.id };
  });

  // ---------- camera (orbit with damping) ----------
  const HOME = { tx: 0, ty: 2, tz: 2, r: 125, th: 0.62, ph: 0.92 };
  let cur = Object.assign({}, HOME), tgt = Object.assign({}, HOME);
  const narrow = () => vp.clientWidth < 600;
  const homeFor = () => Object.assign({}, HOME, narrow() ? { r: 190, th: 0.3, ph: 0.88 } : { r: 125 });
  tgt = homeFor(); cur = Object.assign({}, tgt);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  function placeCam() {
    const s = Math.sin(cur.ph);
    cam3.position.set(cur.tx + cur.r * s * Math.sin(cur.th), cur.ty + cur.r * Math.cos(cur.ph), cur.tz + cur.r * s * Math.cos(cur.th));
    cam3.lookAt(cur.tx, cur.ty, cur.tz);
  }
  function resize() { const w = vp.clientWidth, h = vp.clientHeight; R.setSize(w, h, false); R.domElement.style.width = w + 'px'; R.domElement.style.height = h + 'px'; cam3.aspect = w / h; cam3.updateProjectionMatrix(); }
  resize(); window.addEventListener('resize', resize);

  const ptrs = new Map(); let st = null, moved = false;
  const dist = () => { const a = [...ptrs.values()]; return a.length < 2 ? 0 : Math.hypot(a[0][0] - a[1][0], a[0][1] - a[1][1]); };
  vp.addEventListener('pointerdown', (e) => { if (e.target.closest('.p3')) return; ptrs.set(e.pointerId, [e.clientX, e.clientY]); moved = false; st = { x: e.clientX, y: e.clientY, th: tgt.th, ph: tgt.ph, r: tgt.r, d: dist(), tx: tgt.tx, tz: tgt.tz }; });
  vp.addEventListener('pointermove', (e) => {
    if (!ptrs.has(e.pointerId) || !st) return; ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (ptrs.size >= 2) { const d = dist(); if (st.d) { tgt.r = clamp(st.r * st.d / d, 8, 260); moved = true; } return; }
    const dx = e.clientX - st.x, dy = e.clientY - st.y;
    if (!moved && Math.abs(dx) + Math.abs(dy) > 5) { moved = true; try { vp.setPointerCapture(e.pointerId); } catch (er) {} }
    if (!moved) return;
    if (e.shiftKey || e.button === 2) { const k = tgt.r / 400; tgt.tx = st.tx - (dx * Math.cos(tgt.th) + dy * Math.sin(tgt.th)) * k; tgt.tz = st.tz - (-dx * Math.sin(tgt.th) + dy * Math.cos(tgt.th)) * k; return; }
    tgt.th = st.th - dx * 0.006; tgt.ph = clamp(st.ph - dy * 0.005, 0.18, 1.45);
  });
  const up = (e) => { ptrs.delete(e.pointerId); st = ptrs.size ? { x: [...ptrs.values()][0][0], y: [...ptrs.values()][0][1], th: tgt.th, ph: tgt.ph, r: tgt.r, d: dist(), tx: tgt.tx, tz: tgt.tz } : null; };
  vp.addEventListener('pointerup', up); vp.addEventListener('pointercancel', up);
  vp.addEventListener('contextmenu', (e) => e.preventDefault());
  vp.addEventListener('wheel', (e) => { e.preventDefault(); tgt.r = clamp(tgt.r * (e.deltaY < 0 ? 0.88 : 1.13), 8, 260); }, { passive: false });

  // ---------- roof / selection ----------
  let open = false;
  const setOpen = (v) => { open = v; cover.visible = !v; ceil.visible = !v; host.classList.toggle('open', v); };
  const focus = (p, r, ph, th) => { tgt.tx = p.x; tgt.ty = Math.max(1.5, p.y * 0.6); tgt.tz = p.z; tgt.r = r; if (ph != null) tgt.ph = ph; if (th != null) tgt.th = th; };
  function select(id) {
    pins.forEach((p) => p.b.classList.toggle('on', p.id === id));
    const it = items.find((x) => x.id === id);
    if (!it) { info.hidden = true; return; }
    if (inside[id]) setOpen(true);
    focus(PIN[id], id === 'gate' || id === 'altar' ? 30 : id === 'laver' ? 22 : 20, inside[id] ? 0.5 : 1.0);
    info.hidden = false; info.style.setProperty('--c', it.color);
    info.innerHTML = '<div class="t3h"><b>' + it.num + '</b><span><strong>' + it.name + '</strong><small>' + it.mat + '</small></span><button type="button" data-c="close" aria-label="إغلاق">×</button></div><p>' + it.what + '</p><p class="t3x">' + it.christ + '</p>' + (it.href ? '<a href="' + it.href + '">التفاصيل والشواهد</a>' : '');
  }

  host.addEventListener('click', (e) => {
    const b = e.target.closest('[data-c]');
    if (b) {
      const c = b.dataset.c;
      if (c === 'in') tgt.r = clamp(tgt.r / 1.35, 8, 260);
      if (c === 'out') tgt.r = clamp(tgt.r * 1.35, 8, 260);
      if (c === 'roof') setOpen(!open);
      if (c === 'top') { tgt.ph = tgt.ph > 0.4 ? 0.2 : 0.98; }
      if (c === 'reset') { tgt = homeFor(); setOpen(false); select(null); }
      if (c === 'close') { select(null); }
      if (c === 'atone') startTour();
      if (c === 'exit') endTour();
      if (c === 'next') go(si + 1);
      if (c === 'prev') go(si - 1);
      return;
    }
    const p = e.target.closest('.p3');
    if (p && !host.classList.contains('tour')) select(p.dataset.it);
  });

  // ---------- Day of Atonement walk-through ----------
  let si = -1; const tourBox = host.querySelector('.t3tour');
  const lerpTo = new Map(); const moveTo = (o, v) => { lerpTo.set(o, v.clone()); };
  function startTour() { host.classList.add('tour'); info.hidden = true; select(null); priest.visible = goatA.visible = goatB.visible = true; priest.position.copy(W(25, 58)); goatA.position.copy(W(23.5, 47)); goatB.position.copy(W(26.5, 47)); go(0); }
  function endTour() { host.classList.remove('tour'); si = -1; priest.visible = goatA.visible = goatB.visible = false; blood.visible = outFire.visible = false; smokeOn = false; fireBoost = 1; lerpTo.clear(); tgt = homeFor(); setOpen(false); }
  let smokeOn = false, fireBoost = 1;
  function go(k) {
    if (!steps.length) return;
    si = clamp(k, 0, steps.length - 1);
    const s = steps[si], at = W(s.at[0], s.at[1]);
    smokeOn = si >= 3 && si <= 5; blood.visible = si >= 4 && si <= 6; outFire.visible = si === 9;
    fireBoost = si === 1 || si === 6 || si === 8 ? 1.8 : 1;
    setOpen(si >= 3 && si <= 5);
    moveTo(priest, s.zone === 'wild' ? W(25, 98) : s.zone === 'out' ? W(10, 112) : W(s.at[0], s.at[1] + (s.zone === 'most' ? 2.2 : 3)));
    moveTo(goatA, si < 2 ? W(23.5, 47) : si < 5 ? W(23, 43.5) : W(25, 70, -8));
    moveTo(goatB, si < 2 ? W(26.5, 47) : si < 7 ? W(27, 43.5) : W(26, 135));
    goatA.visible = si < 5;
    focus(at, s.zone === 'most' ? 21 : s.zone === 'wild' || s.zone === 'out' ? 85 : 34, s.zone === 'most' ? 0.5 : 1.0);
    if (s.zone === 'most') { tgt.ty = 2.2; }
    tourBox.querySelector('.n').textContent = s.num; tourBox.querySelector('.tt').textContent = s.t;
    tourBox.querySelector('.d').textContent = s.d; tourBox.querySelector('.v').innerHTML = s.v + '<small>' + s.ref + '</small>';
    tourBox.style.setProperty('--c', s.color);
    tourBox.querySelector('[data-c="prev"]').disabled = si === 0;
    tourBox.querySelector('[data-c="next"]').disabled = si === steps.length - 1;
    tourBox.querySelectorAll('.dots i').forEach((d, n) => d.classList.toggle('on', n === si));
  }
  document.addEventListener('keydown', (e) => { if (!host.classList.contains('tour')) return; if (e.key === 'ArrowLeft') go(si + 1); if (e.key === 'ArrowRight') go(si - 1); if (e.key === 'Escape') endTour(); });

  // ---------- render loop (paused when off-screen) ----------
  let visible = true;
  new IntersectionObserver((en) => { visible = en[0].isIntersecting; if (visible) loop(); }).observe(vp);
  const v3 = new THREE.Vector3(); let last = 0, raf = 0;
  function loop(t = performance.now()) {
    cancelAnimationFrame(raf);
    if (!visible || document.hidden) return;
    raf = requestAnimationFrame(loop);
    const dt = Math.min(0.05, (t - last) / 1000 || 0.016); last = t; const k = 1 - Math.pow(0.0015, dt);
    for (const key of ['tx', 'ty', 'tz', 'r', 'th', 'ph']) cur[key] += (tgt[key] - cur[key]) * k;
    placeCam();
    const time = t / 1000;
    fire.children.forEach((f) => { const s = (0.8 + 0.25 * Math.sin(time * 9 + f.userData.p)) * fireBoost; f.scale.set(1, s, 1); f.material.opacity = 0.75 + 0.2 * Math.sin(time * 13 + f.userData.p); });
    fireLight.intensity = (26 + 8 * Math.sin(time * 11)) * fireBoost;
    lamp.children.forEach((f) => { if (f.userData.small) f.scale.y = 0.85 + 0.2 * Math.sin(time * 12 + f.userData.p); });
    outFire.children.forEach((f) => { if (f.isMesh) f.scale.y = 0.8 + 0.3 * Math.sin(time * 10 + f.userData.p); });
    cloud.children.forEach((s, i) => { s.position.x += Math.sin(time * 0.3 + s.userData.p) * 0.004; s.material.opacity = 0.42 + 0.12 * Math.sin(time * 0.5 + i); });
    cloud.visible = !open;
    glory.material.opacity = open ? 0.55 : 0.0; gloryLight.intensity = open ? 12 + 2 * Math.sin(time * 2) : 0;
    smoke.children.forEach((s) => { const p = (s.userData.p + time * 0.12) % 1; s.position.set(Math.sin(p * 9) * 0.6, p * 6, Math.cos(p * 7) * 0.5); const sc = 1 + p * 4; s.scale.set(sc, sc, 1); s.material.opacity = smokeOn ? (1 - p) * 0.7 : 0; });
    lerpTo.forEach((v, o) => { o.position.lerp(v, 1 - Math.pow(0.02, dt)); });
    // with the roof off, hide whichever wall stands between the eye and the furniture
    const cp = cam3.position;
    wallN.visible = !(open && cp.x < T0.x); wallS.visible = !(open && cp.x > T1.x); wallW.visible = !(open && cp.z < T0.z);
    door.visible = !(open && cp.z > T1.z && cur.r < 60);
    R.render(scene, cam3);
    // pins
    const w = vp.clientWidth, h = vp.clientHeight, tour = host.classList.contains('tour');
    pins.forEach(({ b, p, id }) => {
      v3.copy(p).project(cam3);
      const hidden = tour || v3.z > 1 || (inside[id] && !open && cur.r > 60);
      b.style.display = hidden ? 'none' : '';
      if (!hidden) b.style.transform = `translate(${((v3.x + 1) / 2) * w}px,${((1 - v3.y) / 2) * h}px)`;
    });
  }
  document.addEventListener('visibilitychange', () => loop());
  loop();
  if (host.dataset.mode === 'atone') setTimeout(startTour, 500);
}
