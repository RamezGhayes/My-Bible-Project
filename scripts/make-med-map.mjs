// Builds data/med-map.json: a real-geography base map of the eastern Mediterranean for Paul's journeys.
// Land: Natural Earth 1:10m (public domain) via the world-atlas package. Run once:
//   cd /tmp/geo && npm i world-atlas@2 topojson-client d3-geo
//   NODE_PATH=/tmp/geo/node_modules node scripts/make-med-map.mjs
// City coordinates are the ancient sites (decimal degrees, lat/lon), most from the Pleiades gazetteer / site locations.
import fs from 'fs';
import { createRequire } from 'module';
const req = createRequire(process.env.NODE_PATH + '/');
const { feature } = req('topojson-client');
const d3 = req('d3-geo');
const land = feature(req('world-atlas/land-' + (process.env.RES || '50m') + '.json'), req('world-atlas/land-' + (process.env.RES || '50m') + '.json').objects.land);

const W = 1200, H = 680;
const box = { type: 'Polygon', coordinates: [[[11.0, 30.0], [11.0, 43.4], [37.6, 43.4], [37.6, 30.0], [11.0, 30.0]]] };
const proj = d3.geoAzimuthalEqualArea().rotate([-24.3, -36.7]).clipAngle(22).fitExtent([[0, 0], [W, H]], box);
proj.clipExtent([[-320, -320], [W + 320, H + 320]]);
const path = d3.geoPath(proj).digits(1);

// [lat, lon]
const C = {
  antioch: [36.202, 36.160], seleucia: [36.123, 35.922], salamis: [35.185, 33.901], paphos: [34.756, 32.407],
  perga: [36.961, 30.854], attalia: [36.885, 30.704], pantioch: [38.306, 31.189], iconium: [37.872, 32.485],
  lystra: [37.577, 32.452], derbe: [37.351, 33.365], galatia: [38.95, 32.4], troas: [39.751, 26.159],
  neapolis: [40.937, 24.412], philippi: [41.013, 24.286], thessalonica: [40.632, 22.944], berea: [40.523, 22.203],
  athens: [37.972, 23.727], corinth: [37.906, 22.880], cenchreae: [37.884, 22.993], ephesus: [37.940, 27.341],
  jerusalem: [31.778, 35.235], caesarea: [32.500, 34.892], macedonia: [40.75, 22.55], assos: [39.490, 26.337],
  miletus: [37.530, 27.278], rhodes: [36.443, 28.226], tyre: [33.271, 35.196], ptolemais: [32.923, 35.069],
  sidon: [33.563, 35.371], myra: [36.259, 29.985], fairhavens: [34.930, 24.810], storm: [35.2, 19.6],
  malta: [35.948, 14.405], syracuse: [37.075, 15.287], rhegium: [38.111, 15.647], puteoli: [40.823, 14.122],
  rome: [41.890, 12.492], tarsus: [36.918, 34.893], damascus: [33.511, 36.306], alexandria: [31.200, 29.918]
};
const cities = Object.fromEntries(Object.entries(C).map(([k, [la, lo]]) => [k, proj([lo, la]).map((v) => Math.round(v * 10) / 10)]));
const R = { // region labels [lat, lon, name]
  syria: [35.4, 37.0, 'سورية'], cilicia: [37.25, 35.0, 'كيليكية'], galatia2: [39.6, 33.0, 'غلاطية'], asia: [38.7, 28.6, 'أسيا'],
  macedonia2: [41.15, 22.3, 'مكدونية'], achaia: [37.55, 22.2, 'أخائية'], cyprus: [35.05, 33.25, 'قبرس'], crete: [35.25, 24.9, 'كريت'],
  italy: [41.0, 15.6, 'إيطاليا'], sicily: [37.55, 14.2, 'صقلية'], judea: [31.55, 35.55, 'اليهودية'], egypt: [30.6, 30.5, 'مصر'],
  sea: [34.0, 22.0, 'البحر الكبير']
};
const regions = Object.fromEntries(Object.entries(R).map(([k, [la, lo, n]]) => [k, { n, xy: proj([lo, la]).map((v) => Math.round(v)) }]));
fs.writeFileSync(new URL('../data/med-map.json', import.meta.url), JSON.stringify({ W, H, land: path(land), cities, regions, source: 'Natural Earth 1:10m land (public domain)' }));
console.log('ok', path(land).length, Object.keys(cities).length);
