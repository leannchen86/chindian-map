const BAY_AREA_FILTER =
  'locations.{isCurrent:true country.name:"United States" region.name:"California" city.name:or("San Francisco","Oakland","Berkeley","Daly City","San Mateo","Redwood City","Menlo Park","Palo Alto","Mountain View","Sunnyvale","Santa Clara","Cupertino","Milpitas","Fremont","Hayward","Pleasanton","San Ramon","San Jose")}';

const clusters = [
  {
    id: "kumon",
    label: "Kumon Gravity",
    color: "#e26f5a",
    copy: "Tutoring, test prep, coding schools, and the unmistakable scent of Saturday morning optimization.",
    labelForHigh: "After-School Pressure Zone",
    dqlTerms: '"Kumon","Mathnasium","Russian School of Mathematics","AoPS","Code Ninjas","coding classes","SAT","ACT","tutoring"',
    queryType: "Organization",
  },
  {
    id: "boba",
    label: "Boba Liquidity",
    color: "#168c8c",
    copy: "Milk tea, dessert cafes, and the informal caffeine rails of Silicon Valley social life.",
    labelForHigh: "Pearl-Adjusted Caffeine Corridor",
    dqlTerms: '"boba","bubble tea","milk tea","tea house","dessert cafe"',
    queryType: "Organization",
  },
  {
    id: "chai",
    label: "Chai / Dosa Coverage",
    color: "#d49a3a",
    copy: "Indian food, chai spots, dosa places, chaat counters, and parental dinner diplomacy.",
    labelForHigh: "Masala Logistics Hub",
    dqlTerms: '"chai","dosa","chaat","biryani","Indian restaurant","South Indian","Gujarati","Punjabi"',
    queryType: "Organization",
  },
  {
    id: "indoChinese",
    label: "Indo-Chinese Menus",
    color: "#8a5a84",
    copy: "The literal fusion layer: Hakka noodles, Gobi Manchurian, chili paneer, and Schezwan spelling variations.",
    labelForHigh: "Gobi Manchurian Belt",
    dqlTerms: '"Indo Chinese","Indian Chinese","Hakka noodles","Gobi Manchurian","chili paneer","Schezwan"',
    queryType: "Organization",
  },
  {
    id: "grocery",
    label: "Grocery Triangle",
    color: "#6b8f71",
    copy: "Asian grocery errand infrastructure: 99 Ranch, Marina, India Cash & Carry, Patel Brothers, and friends.",
    labelForHigh: "Parent Errand Stack",
    dqlTerms: '"99 Ranch","Marina Food","India Cash & Carry","Patel Brothers","Apna Bazar","New India Bazar","Asian grocery"',
    queryType: "Organization",
  },
  {
    id: "ai",
    label: "AI / Startup Gravity",
    color: "#315f8f",
    copy: "AI companies, software orgs, accelerators, venture-adjacent offices, and places where people say agentic out loud.",
    labelForHigh: "Seed Round Weather System",
    dqlTerms: '"artificial intelligence","machine learning","LLM","startup","venture capital","accelerator","software company"',
    queryType: "Organization",
  },
  {
    id: "weekend",
    label: "Weekend Schools",
    color: "#b35648",
    copy: "Mandarin, Tamil, Telugu, Hindi, chess, piano, Bharatanatyam, and the general disappearance of free Saturdays.",
    labelForHigh: "Saturday Never Happened",
    dqlTerms: '"Chinese School","Mandarin School","Hindi School","Tamil School","Telugu School","Bharatanatyam","tabla","piano","chess"',
    queryType: "Organization",
  },
  {
    id: "festivals",
    label: "Festival Overlap",
    color: "#c48d28",
    copy: "Diwali, Holi, Navratri, Lunar New Year, Mid-Autumn, dragon boats, and the civic calendar doing crossover episodes.",
    labelForHigh: "Shared Calendar Density",
    dqlTerms: '"Diwali","Holi","Navratri","Lunar New Year","Chinese New Year","Mid-Autumn","Dragon Boat","cultural festival"',
    queryType: "Organization",
  },
  {
    id: "weddings",
    label: "Wedding Vendors",
    color: "#b75f7d",
    copy: "Banquet halls, mehndi, mandaps, vegetarian catering, photographers, and the highest-stakes family logistics stack.",
    labelForHigh: "Banquet Feasibility Zone",
    dqlTerms: '"wedding planner","banquet hall","mehndi","henna","mandap","sari","lehenga","qipao","cheongsam","vegetarian catering"',
    queryType: "Organization",
  },
  {
    id: "sports",
    label: "Badminton / Cricket",
    color: "#517a50",
    copy: "Badminton, cricket, table tennis, pickleball, and chess clubs: the underrated social graph.",
    labelForHigh: "Weekend League Diplomacy",
    dqlTerms: '"badminton","table tennis","cricket","pickleball","chess club","ping pong"',
    queryType: "Organization",
  },
];

let cities = [
  {
    name: "San Francisco",
    lat: 37.7749,
    lon: -122.4194,
    values: { kumon: 48, boba: 76, chai: 62, indoChinese: 24, grocery: 34, ai: 96, weekend: 28, festivals: 58, weddings: 42, sports: 28 },
  },
  {
    name: "Oakland",
    lat: 37.8044,
    lon: -122.2712,
    values: { kumon: 32, boba: 48, chai: 56, indoChinese: 18, grocery: 28, ai: 44, weekend: 36, festivals: 50, weddings: 36, sports: 30 },
  },
  {
    name: "Berkeley",
    lat: 37.8715,
    lon: -122.273,
    values: { kumon: 26, boba: 42, chai: 34, indoChinese: 12, grocery: 20, ai: 52, weekend: 30, festivals: 36, weddings: 18, sports: 28 },
  },
  {
    name: "Daly City",
    lat: 37.6879,
    lon: -122.4702,
    values: { kumon: 28, boba: 36, chai: 24, indoChinese: 10, grocery: 26, ai: 16, weekend: 18, festivals: 20, weddings: 18, sports: 18 },
  },
  {
    name: "San Mateo",
    lat: 37.563,
    lon: -122.3255,
    values: { kumon: 52, boba: 54, chai: 42, indoChinese: 20, grocery: 34, ai: 46, weekend: 38, festivals: 34, weddings: 40, sports: 36 },
  },
  {
    name: "Redwood City",
    lat: 37.4852,
    lon: -122.2364,
    values: { kumon: 42, boba: 38, chai: 34, indoChinese: 16, grocery: 22, ai: 58, weekend: 32, festivals: 28, weddings: 28, sports: 30 },
  },
  {
    name: "Menlo Park",
    lat: 37.453,
    lon: -122.1817,
    values: { kumon: 36, boba: 28, chai: 30, indoChinese: 10, grocery: 18, ai: 72, weekend: 26, festivals: 22, weddings: 22, sports: 24 },
  },
  {
    name: "Palo Alto",
    lat: 37.4419,
    lon: -122.143,
    values: { kumon: 58, boba: 46, chai: 40, indoChinese: 18, grocery: 26, ai: 92, weekend: 42, festivals: 30, weddings: 30, sports: 36 },
  },
  {
    name: "Mountain View",
    lat: 37.3861,
    lon: -122.0839,
    values: { kumon: 64, boba: 68, chai: 56, indoChinese: 26, grocery: 40, ai: 88, weekend: 46, festivals: 42, weddings: 38, sports: 44 },
  },
  {
    name: "Sunnyvale",
    lat: 37.3688,
    lon: -122.0363,
    values: { kumon: 82, boba: 78, chai: 86, indoChinese: 34, grocery: 64, ai: 76, weekend: 72, festivals: 58, weddings: 62, sports: 68 },
  },
  {
    name: "Santa Clara",
    lat: 37.3541,
    lon: -121.9552,
    values: { kumon: 72, boba: 70, chai: 78, indoChinese: 30, grocery: 56, ai: 78, weekend: 62, festivals: 52, weddings: 52, sports: 60 },
  },
  {
    name: "Cupertino",
    lat: 37.323,
    lon: -122.0322,
    values: { kumon: 96, boba: 82, chai: 70, indoChinese: 30, grocery: 72, ai: 80, weekend: 92, festivals: 54, weddings: 56, sports: 74 },
  },
  {
    name: "Milpitas",
    lat: 37.4323,
    lon: -121.8996,
    values: { kumon: 70, boba: 66, chai: 80, indoChinese: 32, grocery: 78, ai: 58, weekend: 66, festivals: 52, weddings: 62, sports: 72 },
  },
  {
    name: "Fremont",
    lat: 37.5485,
    lon: -121.9886,
    values: { kumon: 84, boba: 62, chai: 94, indoChinese: 38, grocery: 86, ai: 54, weekend: 82, festivals: 76, weddings: 84, sports: 86 },
  },
  {
    name: "Hayward",
    lat: 37.6688,
    lon: -122.0808,
    values: { kumon: 34, boba: 34, chai: 48, indoChinese: 14, grocery: 38, ai: 20, weekend: 30, festivals: 34, weddings: 42, sports: 34 },
  },
  {
    name: "Pleasanton",
    lat: 37.6624,
    lon: -121.8747,
    values: { kumon: 56, boba: 38, chai: 60, indoChinese: 16, grocery: 46, ai: 36, weekend: 52, festivals: 44, weddings: 48, sports: 54 },
  },
  {
    name: "San Ramon",
    lat: 37.7799,
    lon: -121.978,
    values: { kumon: 50, boba: 30, chai: 54, indoChinese: 12, grocery: 36, ai: 30, weekend: 46, festivals: 38, weddings: 38, sports: 42 },
  },
  {
    name: "San Jose",
    lat: 37.3382,
    lon: -121.8863,
    values: { kumon: 88, boba: 92, chai: 88, indoChinese: 44, grocery: 82, ai: 86, weekend: 74, festivals: 70, weddings: 78, sports: 78 },
  },
];

const pairLabels = {
  "boba|kumon": {
    title: "After-School Caffeine Corridor",
    body: "Milk tea and tutoring show up together where the school-night logistics are most optimized.",
  },
  "chai|ai": {
    title: "Seed Round Over Masala Dosa",
    body: "Indian food coverage and startup gravity overlap in the places where dinner can become a pitch deck.",
  },
  "grocery|kumon": {
    title: "Parent Errand Stack",
    body: "Tutoring centers and grocery anchors cluster into the most efficient Saturday route possible.",
  },
  "indoChinese|weddings": {
    title: "Fusion Banquet Feasibility",
    body: "The places with Indo-Chinese menus also tend to have enough event infrastructure to host the discourse in person.",
  },
  "sports|weekend": {
    title: "Saturday Was Never Free",
    body: "Weekend schools and racket sports form the extracurricular backbone of suburban Asian logistics.",
  },
  "chai|grocery": {
    title: "Masala Supply Chain",
    body: "Indian food and grocery infrastructure rise together where dinner plans and pantry restocking merge.",
  },
  "boba|ai": {
    title: "Founder Hydration Layer",
    body: "Caffeine density follows the office clusters where people are most likely to say they are still pre-launch.",
  },
};

const scaleOptions = [
  { id: "linear", label: "Linear" },
  { id: "log", label: "Log" },
  { id: "sqrt", label: "Sqrt" },
  { id: "sigmoid", label: "Sigmoid" },
  { id: "exp", label: "Exp" },
];

let activeClusterId = "kumon";
let activePair = null;
let activeScaleId = "linear";
let selectedCityName = null;
let dataModeLabel = "seed data";
let popupCityName = null;

const clusterById = new Map(clusters.map((cluster) => [cluster.id, cluster]));
let cityByName = new Map(cities.map((city) => [city.name, city]));
let ranges = {};

function recomputeRanges() {
  ranges = {};
  cityByName = new Map(cities.map((city) => [city.name, city]));

  for (const cluster of clusters) {
    const rawValues = cities.map((city) => rawMeasure(city, cluster.id));
    const densityValues = cities.map((city) => densityMeasure(city, cluster.id));
    ranges[cluster.id] = {
      min: Math.min(...rawValues),
      max: Math.max(...rawValues),
      densityMin: Math.min(...densityValues),
      densityMax: Math.max(...densityValues),
    };
  }
}

recomputeRanges();

let leafletMap = null;
let hotspotLayer = null;
let selectedPinLayer = null;
let heatLayer = null;

const els = {
  dataMode: document.querySelector("#dataMode"),
  clusterSelect: document.querySelector("#clusterSelect"),
  scaleSelect: document.querySelector("#scaleSelect"),
  secondaryClusterSelect: document.querySelector("#secondaryClusterSelect"),
  pairFields: document.querySelector("#pairFields"),
  singleMode: document.querySelector("#singleMode"),
  pairMode: document.querySelector("#pairMode"),
  detailsToggle: document.querySelector("#detailsToggle"),
  drawerClose: document.querySelector("#drawerClose"),
  detailDrawer: document.querySelector("#detailDrawer"),
  realMap: document.querySelector("#realMap"),
  mapTitle: document.querySelector("#mapTitle"),
  legendHigh: document.querySelector("#legendHigh"),
  selectionTitle: document.querySelector("#selectionTitle"),
  currentRead: document.querySelector("#currentRead"),
  currentReadBody: document.querySelector("#currentReadBody"),
  rankList: document.querySelector("#rankList"),
  correlationMatrix: document.querySelector("#correlationMatrix"),
  clearPair: document.querySelector("#clearPair"),
  insightList: document.querySelector("#insightList"),
  queryText: document.querySelector("#queryText"),
  copyQuery: document.querySelector("#copyQuery"),
};

function rawMeasure(city, clusterId) {
  return Number(city.values[clusterId] ?? 0);
}

function baselineOrganizations(city) {
  return Number(city.baseline?.organizations ?? 0);
}

function densityMeasure(city, clusterId) {
  const baseline = baselineOrganizations(city);
  if (!baseline) return rawMeasure(city, clusterId);
  return (rawMeasure(city, clusterId) / baseline) * 10000;
}

function norm(city, clusterId) {
  const { min, max } = ranges[clusterId];
  if (max === min) return 0;
  return (rawMeasure(city, clusterId) - min) / (max - min);
}

function scaledMeasure(city, clusterId) {
  const max = ranges[clusterId]?.densityMax ?? ranges[clusterId]?.max ?? 0;
  if (!max) return 0;
  return densityMeasure(city, clusterId) / max;
}

function pairMeasure(city, a, b) {
  return Math.sqrt(densityMeasure(city, a) * densityMeasure(city, b));
}

function pairScore(city, a, b) {
  const values = cities.map((candidate) => pairMeasure(candidate, a, b));
  const max = Math.max(...values);
  if (!max) return 0;
  return pairMeasure(city, a, b) / max;
}

function baseScore(city) {
  if (activePair) return pairScore(city, activePair[0], activePair[1]);
  return scaledMeasure(city, activeClusterId);
}

function score(city) {
  return scaleValue(baseScore(city));
}

function pearson(aId, bId) {
  const xs = cities.map((city) => norm(city, aId));
  const ys = cities.map((city) => norm(city, bId));
  const xMean = average(xs);
  const yMean = average(ys);
  const numerator = xs.reduce((sum, value, index) => sum + (value - xMean) * (ys[index] - yMean), 0);
  const xDenom = Math.sqrt(xs.reduce((sum, value) => sum + (value - xMean) ** 2, 0));
  const yDenom = Math.sqrt(ys.reduce((sum, value) => sum + (value - yMean) ** 2, 0));
  if (!xDenom || !yDenom) return 0;
  return numerator / (xDenom * yDenom);
}

function average(values) {
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function scaleValue(value) {
  const t = Math.max(0, Math.min(1, value));
  if (activeScaleId === "log") {
    return Math.log1p(t * 9) / Math.log1p(9);
  }
  if (activeScaleId === "sqrt") {
    return Math.sqrt(t);
  }
  if (activeScaleId === "sigmoid") {
    const logistic = (x) => 1 / (1 + Math.exp(-x));
    const midpoint = 0.45;
    const steepness = 10;
    const low = logistic((0 - midpoint) * steepness);
    const high = logistic((1 - midpoint) * steepness);
    return (logistic((t - midpoint) * steepness) - low) / (high - low);
  }
  if (activeScaleId === "exp") {
    return (Math.exp(t * 3) - 1) / (Math.exp(3) - 1);
  }
  return t;
}

function heatColor(value) {
  const palette = [
    { stop: 0, color: [47, 127, 182] },
    { stop: 0.24, color: [94, 183, 207] },
    { stop: 0.45, color: [215, 230, 121] },
    { stop: 0.66, color: [243, 178, 77] },
    { stop: 0.84, color: [227, 95, 66] },
    { stop: 1, color: [142, 31, 116] },
  ];
  const t = Math.max(0, Math.min(1, value));
  const upperIndex = palette.findIndex((entry) => entry.stop >= t);
  const upper = palette[Math.max(upperIndex, 1)];
  const lower = palette[Math.max(0, palette.indexOf(upper) - 1)];
  const localT = upper.stop === lower.stop ? 0 : (t - lower.stop) / (upper.stop - lower.stop);
  return lower.color.map((channel, index) => Math.round(channel + (upper.color[index] - channel) * localT));
}

function contourPoint(level, a, b, ax, ay, bx, by) {
  const span = b - a;
  const t = span === 0 ? 0.5 : (level - a) / span;
  return {
    x: ax + (bx - ax) * t,
    y: ay + (by - ay) * t,
  };
}

function contourIntersections(level, corners) {
  const [topLeft, topRight, bottomRight, bottomLeft] = corners;
  const edges = [
    [topLeft, topRight],
    [topRight, bottomRight],
    [bottomLeft, bottomRight],
    [topLeft, bottomLeft],
  ];
  return edges.flatMap(([a, b]) => {
    if ((a.value < level && b.value < level) || (a.value > level && b.value > level)) return [];
    if (a.value === b.value) return [];
    return [contourPoint(level, a.value, b.value, a.x, a.y, b.x, b.y)];
  });
}

function drawContourLines(ctx, field, sampleWidth, sampleHeight, cell) {
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  ctx.strokeStyle = "rgba(23, 33, 36, 0.16)";
  ctx.lineWidth = 0.8;

  for (const level of [0.28, 0.42, 0.56, 0.7, 0.84]) {
    ctx.beginPath();
    for (let sampleY = 0; sampleY < sampleHeight - 1; sampleY += 1) {
      for (let sampleX = 0; sampleX < sampleWidth - 1; sampleX += 1) {
        const index = sampleY * sampleWidth + sampleX;
        const values = [
          field[index],
          field[index + 1],
          field[index + sampleWidth + 1],
          field[index + sampleWidth],
        ];
        if (values.some((value) => !Number.isFinite(value))) continue;

        const x0 = (sampleX + 0.5) * cell;
        const y0 = (sampleY + 0.5) * cell;
        const x1 = (sampleX + 1.5) * cell;
        const y1 = (sampleY + 1.5) * cell;
        const points = contourIntersections(level, [
          { value: values[0], x: x0, y: y0 },
          { value: values[1], x: x1, y: y0 },
          { value: values[2], x: x1, y: y1 },
          { value: values[3], x: x0, y: y1 },
        ]);

        for (let pointIndex = 0; pointIndex + 1 < points.length; pointIndex += 2) {
          ctx.moveTo(points[pointIndex].x, points[pointIndex].y);
          ctx.lineTo(points[pointIndex + 1].x, points[pointIndex + 1].y);
        }
      }
    }
    ctx.stroke();
  }
  ctx.restore();
}

function pairKey(a, b) {
  return [a, b].sort().join("|");
}

function fallbackSecondCluster(primaryId) {
  return clusters.find((cluster) => cluster.id !== primaryId)?.id ?? primaryId;
}

function formatNumber(value, digits = 0) {
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function metricText(city, clusterId) {
  if (!baselineOrganizations(city)) return `${formatNumber(rawMeasure(city, clusterId))} matches`;
  return `${formatNumber(densityMeasure(city, clusterId), 1)} / 10k orgs`;
}

function metricShort(city, clusterId) {
  if (!baselineOrganizations(city)) return formatNumber(rawMeasure(city, clusterId));
  return formatNumber(densityMeasure(city, clusterId), 1);
}

function clusterMeasureLine(city, clusterId) {
  const raw = rawMeasure(city, clusterId);
  if (!baselineOrganizations(city)) return `${formatNumber(raw)} matches`;
  return `${metricText(city, clusterId)} (${formatNumber(raw)} matches)`;
}

function selectedMeasureLine(city) {
  if (!activePair) return clusterMeasureLine(city, activeClusterId);
  const [a, b] = activePair;
  return `${clusterById.get(a).label}: ${clusterMeasureLine(city, a)}; ${clusterById.get(b).label}: ${clusterMeasureLine(city, b)}`;
}

function rankMeasureText(city) {
  if (!activePair) return metricText(city, activeClusterId);
  return `${metricShort(city, activePair[0])} x ${metricShort(city, activePair[1])}`;
}

function legendMaxText() {
  if (!activePair) {
    const max = ranges[activeClusterId]?.densityMax ?? ranges[activeClusterId]?.max ?? 0;
    return baselineOrganizations(cities[0]) ? `${formatNumber(max, 1)} / 10k` : formatNumber(max);
  }
  const maxPair = Math.max(...cities.map((city) => pairMeasure(city, activePair[0], activePair[1])));
  return baselineOrganizations(cities[0]) ? `${formatNumber(maxPair, 1)} / 10k` : formatNumber(Math.round(maxPair));
}

function getSelectionMeta() {
  if (!activePair) {
    const cluster = clusterById.get(activeClusterId);
    return {
      title: cluster.label,
      copy: cluster.copy,
      color: cluster.color,
      queryCluster: cluster,
      pairTitle: null,
      body: cluster.copy,
    };
  }

  const [a, b] = activePair;
  const first = clusterById.get(a);
  const second = clusterById.get(b);
  const label = pairLabels[pairKey(a, b)];
  return {
    title: label?.title ?? `${first.label} x ${second.label}`,
    copy: label?.body ?? `Overlap score between ${first.label.toLowerCase()} and ${second.label.toLowerCase()}.`,
    color: first.color,
    queryCluster: first,
    pairTitle: `${first.label} x ${second.label}`,
    body: label?.body,
  };
}

function fillSelect(select, options) {
  const current = select.value;
  select.innerHTML = "";
  for (const cluster of options) {
    const option = document.createElement("option");
    option.value = cluster.id;
    option.textContent = cluster.label;
    select.appendChild(option);
  }
  if (options.some((cluster) => cluster.id === current)) {
    select.value = current;
  }
}

function renderScaleControl() {
  const current = activeScaleId;
  els.scaleSelect.innerHTML = "";
  for (const option of scaleOptions) {
    const item = document.createElement("option");
    item.value = option.id;
    item.textContent = option.label;
    els.scaleSelect.appendChild(item);
  }
  els.scaleSelect.value = scaleOptions.some((option) => option.id === current) ? current : "linear";
}

function renderClusterControls() {
  fillSelect(els.clusterSelect, clusters);
  fillSelect(els.secondaryClusterSelect, clusters.filter((cluster) => cluster.id !== activeClusterId));
  els.clusterSelect.value = activeClusterId;
  els.pairFields.hidden = !activePair;
  if (activePair) {
    const secondId = activePair[1] === activeClusterId ? fallbackSecondCluster(activeClusterId) : activePair[1];
    activePair = [activeClusterId, secondId];
    els.secondaryClusterSelect.value = secondId;
  }
}

function initLeafletMap() {
  if (leafletMap || !window.L) return;

  leafletMap = L.map(els.realMap, {
    attributionControl: true,
    scrollWheelZoom: true,
    zoomControl: true,
  });

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    className: "base-map-tiles",
    maxZoom: 19,
  }).addTo(leafletMap);

  heatLayer = createHeatLayer().addTo(leafletMap);
  hotspotLayer = L.layerGroup().addTo(leafletMap);
  selectedPinLayer = L.layerGroup().addTo(leafletMap);
  const bayBounds = L.latLngBounds(cities.map((city) => [city.lat, city.lon]));
  leafletMap.fitBounds(bayBounds, { padding: [38, 38] });
}

function createHeatLayer() {
  const HeatLayer = L.Layer.extend({
    onAdd(map) {
      this._map = map;
      this._canvas = L.DomUtil.create("canvas", "heat-canvas leaflet-zoom-animated");
      map.getPanes().overlayPane.appendChild(this._canvas);
      map.on("move zoom resize zoomend moveend", this._reset, this);
      this._reset();
    },
    onRemove(map) {
      map.off("move zoom resize zoomend moveend", this._reset, this);
      this._canvas.remove();
    },
    setData(points, maxValue) {
      this._points = points;
      this._maxValue = maxValue;
      this._reset();
      return this;
    },
    _reset() {
      if (!this._map || !this._canvas) return;
      const size = this._map.getSize();
      const topLeft = this._map.containerPointToLayerPoint([0, 0]);
      L.DomUtil.setPosition(this._canvas, topLeft);
      this._canvas.width = size.x;
      this._canvas.height = size.y;
      this._canvas.style.width = `${size.x}px`;
      this._canvas.style.height = `${size.y}px`;
      this._draw();
    },
    _draw() {
      const ctx = this._canvas.getContext("2d");
      const { width, height } = this._canvas;
      ctx.clearRect(0, 0, width, height);
      const points = this._points ?? [];
      if (!points.length) return;

      const projectedPoints = points.map((point) => ({
        ...point,
        pixel: this._map.latLngToContainerPoint([point.lat, point.lon]),
      }));
      const cell = Math.max(4, Math.round(Math.min(width, height) / 150));
      const influenceRadius = Math.max(260, Math.min(width, height) * 0.48);
      const fadeStart = influenceRadius * 0.68;
      const sampleWidth = Math.ceil(width / cell);
      const sampleHeight = Math.ceil(height / cell);
      const offscreen = document.createElement("canvas");
      offscreen.width = sampleWidth;
      offscreen.height = sampleHeight;
      const offscreenContext = offscreen.getContext("2d");
      const imageData = offscreenContext.createImageData(sampleWidth, sampleHeight);
      const field = new Float32Array(sampleWidth * sampleHeight);
      field.fill(Number.NaN);

      ctx.globalCompositeOperation = "source-over";
      for (let sampleY = 0; sampleY < sampleHeight; sampleY += 1) {
        for (let sampleX = 0; sampleX < sampleWidth; sampleX += 1) {
          const x = (sampleX + 0.5) * cell;
          const y = (sampleY + 0.5) * cell;
          let weighted = 0;
          let totalWeight = 0;
          let nearest = Infinity;

          for (const point of projectedPoints) {
            const dx = x - point.pixel.x;
            const dy = y - point.pixel.y;
            const distance = Math.hypot(dx, dy);
            nearest = Math.min(nearest, distance);
            const weight = 1 / (distance * distance + 420);
            weighted += point.score * weight;
            totalWeight += weight;
          }

          if (!totalWeight || nearest > influenceRadius) continue;

          const interpolated = Math.max(0, Math.min(1, weighted / totalWeight));
          const visualValue = scaleValue(interpolated);
          field[sampleY * sampleWidth + sampleX] = visualValue;
          const fade = nearest <= fadeStart
            ? 1
            : Math.max(0, (influenceRadius - nearest) / (influenceRadius - fadeStart));
          const color = heatColor(visualValue);
          const alpha = (0.22 + visualValue * 0.64) * fade;
          const index = (sampleY * sampleWidth + sampleX) * 4;
          imageData.data[index] = color[0];
          imageData.data[index + 1] = color[1];
          imageData.data[index + 2] = color[2];
          imageData.data[index + 3] = Math.round(alpha * 255);
        }
      }
      offscreenContext.putImageData(imageData, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(offscreen, 0, 0, width, height);
      drawContourLines(ctx, field, sampleWidth, sampleHeight, cell);
    },
  });
  return new HeatLayer();
}

function popupHtml(city, value, meta) {
  const signalName = activePair ? meta.pairTitle : meta.title;
  const popupScore = activePair
    ? `${metricText(city, activePair[0])} x ${metricText(city, activePair[1])}`
    : metricText(city, activeClusterId);
  return `
    <div class="map-popup-title">
      <span>${city.name}</span>
      <span class="map-popup-score">${popupScore}</span>
    </div>
    <p class="map-popup-copy">${signalName}</p>
    <p class="map-popup-detail">${selectedMeasureLine(city)}</p>
  `;
}

function openDrawer(shouldOpen = true) {
  els.detailDrawer.classList.toggle("open", shouldOpen);
  els.detailDrawer.setAttribute("aria-hidden", String(!shouldOpen));
}

function renderMap() {
  const meta = getSelectionMeta();
  initLeafletMap();
  if (!leafletMap || !hotspotLayer || !selectedPinLayer || !heatLayer) return;

  hotspotLayer.clearLayers();
  selectedPinLayer.clearLayers();
  const heatPoints = cities.map((city) => ({
    lat: city.lat,
    lon: city.lon,
    score: baseScore(city),
  }));
  heatLayer.setData(heatPoints);

  for (const city of cities) {
    const value = score(city);
    const hotspotRadius = 18 + value * 30;
    const marker = L.circleMarker([city.lat, city.lon], {
      keyboard: true,
      title: `${city.name}: ${rankMeasureText(city)}`,
      radius: hotspotRadius,
      stroke: false,
      fill: true,
      fillOpacity: 0.01,
      className: "city-hotspot",
    }).addTo(hotspotLayer);

    marker.bindPopup(popupHtml(city, value, meta));

    marker.on("click", () => {
      selectedCityName = city.name;
      popupCityName = city.name;
      renderSelection();
      renderMap();
      openDrawer(false);
    });

    if (city.name === popupCityName) {
      marker.openPopup();
    }
  }

  const selectedCity = cityByName.get(selectedCityName);
  if (selectedCity) {
    L.marker([selectedCity.lat, selectedCity.lon], {
      interactive: false,
      icon: L.divIcon({
        className: "",
        html: '<div class="selected-pin"></div>',
        iconSize: [18, 18],
        iconAnchor: [9, 9],
      }),
    }).addTo(selectedPinLayer);
  }

  popupCityName = null;
  window.requestAnimationFrame(() => leafletMap.invalidateSize());
}

function topCities(limit = 6) {
  return [...cities]
    .sort((a, b) => baseScore(b) - baseScore(a))
    .slice(0, limit)
    .map((city) => ({ ...city, activeScore: baseScore(city) }));
}

function renderSelection() {
  const meta = getSelectionMeta();
  const selectedCity = cityByName.get(selectedCityName) ?? topCities()[0];

  els.mapTitle.textContent = activePair ? meta.title : `${meta.title} Density`;
  els.legendHigh.textContent = legendMaxText();
  els.selectionTitle.textContent = activePair ? meta.pairTitle : meta.title;
  els.currentRead.textContent = activePair
    ? selectedCity.name
    : `${selectedCity.name}: ${metricText(selectedCity, activeClusterId)}`;
  els.currentReadBody.textContent = activePair
    ? selectedMeasureLine(selectedCity)
    : selectedMeasureLine(selectedCity);

  els.rankList.innerHTML = "";
  topCities().forEach((city, index) => {
    const li = document.createElement("li");
    li.title = selectedMeasureLine(city);
    li.innerHTML = `
      <span class="rank-index">${index + 1}</span>
      <span class="rank-city">${city.name}</span>
      <span class="rank-score">${rankMeasureText(city)}</span>
    `;
    li.addEventListener("click", () => {
      selectedCityName = city.name;
      renderSelection();
      renderMap();
    });
    els.rankList.appendChild(li);
  });
}

function renderMatrix() {
  els.correlationMatrix.style.setProperty("--cluster-total", clusters.length);
  els.correlationMatrix.innerHTML = "";

  const corner = document.createElement("div");
  corner.className = "matrix-corner";
  els.correlationMatrix.appendChild(corner);

  for (const cluster of clusters) {
    const label = document.createElement("div");
    label.className = "matrix-label col";
    label.textContent = cluster.label;
    els.correlationMatrix.appendChild(label);
  }

  for (const row of clusters) {
    const rowLabel = document.createElement("div");
    rowLabel.className = "matrix-label row";
    rowLabel.textContent = row.label;
    els.correlationMatrix.appendChild(rowLabel);

    for (const col of clusters) {
      const value = row.id === col.id ? 1 : pearson(row.id, col.id);
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = `matrix-cell ${row.id === col.id ? "self" : ""}`;
      if (activePair && pairKey(row.id, col.id) === pairKey(activePair[0], activePair[1])) {
        cell.classList.add("active");
      }
      cell.style.background = correlationColor(value, row.id === col.id);
      cell.textContent = value.toFixed(2);
      cell.title = `${row.label} x ${col.label}: ${value.toFixed(2)}`;
      cell.disabled = row.id === col.id;
      cell.addEventListener("click", () => {
        activePair = [row.id, col.id];
        activeClusterId = row.id;
        selectedCityName = null;
        render();
      });
      els.correlationMatrix.appendChild(cell);
    }
  }
}

function correlationColor(value, self) {
  if (self) return "#eef2ef";
  const clamped = Math.max(-1, Math.min(1, value));
  if (clamped >= 0) {
    const opacity = 0.15 + clamped * 0.85;
    return `rgba(226, 111, 90, ${opacity})`;
  }
  const opacity = 0.15 + Math.abs(clamped) * 0.85;
  return `rgba(49, 95, 143, ${opacity})`;
}

function strongestPairs() {
  const pairs = [];
  for (let i = 0; i < clusters.length; i += 1) {
    for (let j = i + 1; j < clusters.length; j += 1) {
      const a = clusters[i];
      const b = clusters[j];
      pairs.push({ a, b, value: pearson(a.id, b.id) });
    }
  }
  return pairs.sort((a, b) => b.value - a.value).slice(0, 6);
}

function renderInsights() {
  els.insightList.innerHTML = "";
  for (const pair of strongestPairs()) {
    const key = pairKey(pair.a.id, pair.b.id);
    const label = pairLabels[key];
    const card = document.createElement("article");
    card.className = "insight-card";
    card.innerHTML = `
      <button type="button">
        <span class="insight-title">
          <span>${label?.title ?? `${pair.a.label} x ${pair.b.label}`}</span>
          <span class="insight-score">${pair.value.toFixed(2)}</span>
        </span>
        <p>${label?.body ?? `${pair.a.label} and ${pair.b.label} are moving together across the Bay Area Diffbot snapshot.`}</p>
      </button>
    `;
    card.querySelector("button").addEventListener("click", () => {
      activePair = [pair.a.id, pair.b.id];
      activeClusterId = pair.a.id;
      selectedCityName = null;
      render();
    });
    els.insightList.appendChild(card);
  }
}

function buildQuery() {
  if (activePair) {
    const a = clusterById.get(activePair[0]);
    const b = clusterById.get(activePair[1]);
    return `# Run these as separate Bay Area facets, then join by city and compute overlap.

type:${a.queryType}
${BAY_AREA_FILTER}
description:or(${a.dqlTerms})
facet:locations.city.name

type:${b.queryType}
${BAY_AREA_FILTER}
description:or(${b.dqlTerms})
facet:locations.city.name`;
  }

  const cluster = clusterById.get(activeClusterId);
  const searchableField = cluster.queryType === "Event" ? "name" : "description";
  return `type:${cluster.queryType}
${BAY_AREA_FILTER}
${searchableField}:or(${cluster.dqlTerms})
facet:locations.city.name`;
}

function renderQuery() {
  els.queryText.textContent = buildQuery();
}

function renderModeButtons() {
  els.singleMode.classList.toggle("active", !activePair);
  els.pairMode.classList.toggle("active", Boolean(activePair));
}

function renderStats() {
  els.dataMode.textContent = dataModeLabel;
}

function render() {
  renderStats();
  renderModeButtons();
  renderScaleControl();
  renderClusterControls();
  renderSelection();
  renderMap();
  renderMatrix();
  renderInsights();
  renderQuery();
}

async function loadExternalData() {
  try {
    const response = await fetch("./data/bay-area-clusters.json", { cache: "no-store" });
    if (!response.ok) return;

    const snapshot = await response.json();
    if (!Array.isArray(snapshot.cities) || snapshot.cities.length === 0) return;

    const liveCityByName = new Map((snapshot.cities ?? []).map((city) => [city.name, city]));
    cities = cities.map((city) => {
      const liveCity = liveCityByName.get(city.name);
      if (!liveCity) return city;
      return {
        ...city,
        baseline: {
          ...city.baseline,
          ...liveCity.baseline,
        },
        values: {
          ...city.values,
          ...liveCity.values,
        },
      };
    });
    dataModeLabel = snapshot.generatedAt ? `Diffbot ${new Date(snapshot.generatedAt).toLocaleDateString()}` : "Diffbot data";
    recomputeRanges();
  } catch {
    dataModeLabel = "seed data";
  }
}

async function boot() {
  await loadExternalData();
  selectedCityName = null;
  render();
}

els.clusterSelect.addEventListener("change", () => {
  activeClusterId = els.clusterSelect.value;
  if (activePair) {
    activePair = [activeClusterId, fallbackSecondCluster(activeClusterId)];
  }
  selectedCityName = null;
  render();
});

els.scaleSelect.addEventListener("change", () => {
  activeScaleId = els.scaleSelect.value;
  render();
});

els.secondaryClusterSelect.addEventListener("change", () => {
  activePair = [activeClusterId, els.secondaryClusterSelect.value];
  selectedCityName = null;
  render();
});

els.singleMode.addEventListener("click", () => {
  activePair = null;
  selectedCityName = null;
  render();
});

els.pairMode.addEventListener("click", () => {
  if (!activePair) activePair = [activeClusterId, fallbackSecondCluster(activeClusterId)];
  activeClusterId = activePair[0];
  selectedCityName = null;
  render();
});

els.clearPair.addEventListener("click", () => {
  activePair = null;
  selectedCityName = null;
  render();
});

els.detailsToggle.addEventListener("click", () => {
  openDrawer(!els.detailDrawer.classList.contains("open"));
});

els.drawerClose.addEventListener("click", () => {
  openDrawer(false);
});

els.copyQuery.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(buildQuery());
    els.copyQuery.textContent = "Copied";
    setTimeout(() => {
      els.copyQuery.textContent = "Copy query";
    }, 1100);
  } catch {
    els.copyQuery.textContent = "Select text";
    setTimeout(() => {
      els.copyQuery.textContent = "Copy query";
    }, 1100);
  }
});

boot();
