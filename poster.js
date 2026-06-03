const cityCoords = {
  "San Francisco": [37.7749, -122.4194],
  Oakland: [37.8044, -122.2712],
  Berkeley: [37.8715, -122.273],
  "Daly City": [37.6879, -122.4702],
  "San Mateo": [37.563, -122.3255],
  "Redwood City": [37.4852, -122.2364],
  "Menlo Park": [37.453, -122.1817],
  "Palo Alto": [37.4419, -122.143],
  "Mountain View": [37.3861, -122.0839],
  Sunnyvale: [37.3688, -122.0363],
  "Santa Clara": [37.3541, -121.9552],
  Cupertino: [37.323, -122.0322],
  Milpitas: [37.4323, -121.8996],
  Fremont: [37.5485, -121.9886],
  Hayward: [37.6688, -122.0808],
  Pleasanton: [37.6624, -121.8747],
  "San Ramon": [37.7799, -121.978],
  "San Jose": [37.3382, -121.8863],
};

const systems = [
  {
    className: "startup",
    fill: "#496cae",
    stroke: "#2e477d",
    points: ["San Francisco", "Palo Alto", "Mountain View", "Sunnyvale", "Santa Clara", "San Jose"],
    blobs: [
      { city: "San Francisco", rx: 180, ry: 128, rotate: -18 },
      { city: "Palo Alto", rx: 150, ry: 92, rotate: -24 },
      { city: "Mountain View", rx: 180, ry: 96, rotate: -20 },
      { city: "San Jose", rx: 165, ry: 110, rotate: -10 },
    ],
  },
  {
    className: "vc",
    fill: "#7d579b",
    stroke: "#5c3c76",
    points: ["Menlo Park", "Palo Alto", "San Francisco"],
    blobs: [
      { city: "Menlo Park", rx: 130, ry: 70, rotate: -28 },
      { city: "Palo Alto", rx: 140, ry: 76, rotate: -28 },
    ],
  },
  {
    className: "weekend",
    fill: "#e38a52",
    stroke: "#a65c32",
    points: ["Daly City", "Cupertino", "Milpitas", "Fremont", "Sunnyvale"],
    blobs: [
      { city: "Cupertino", rx: 170, ry: 118, rotate: -12 },
      { city: "Milpitas", rx: 140, ry: 105, rotate: 12 },
      { city: "Fremont", rx: 180, ry: 128, rotate: 18 },
      { city: "Daly City", rx: 105, ry: 86, rotate: -24 },
    ],
  },
  {
    className: "sports",
    fill: "#5fa16b",
    stroke: "#386b42",
    points: ["Cupertino", "Milpitas", "Fremont", "San Ramon", "Pleasanton"],
    blobs: [
      { city: "Milpitas", rx: 136, ry: 78, rotate: 20 },
      { city: "Fremont", rx: 180, ry: 92, rotate: 20 },
      { city: "Cupertino", rx: 118, ry: 70, rotate: -18 },
    ],
  },
  {
    className: "food",
    fill: "#d8b451",
    stroke: "#9c7d2f",
    points: ["Daly City", "Cupertino", "Sunnyvale", "Santa Clara", "Milpitas", "Fremont"],
    blobs: [
      { city: "Daly City", rx: 120, ry: 85, rotate: -20 },
      { city: "Sunnyvale", rx: 170, ry: 105, rotate: -10 },
      { city: "Milpitas", rx: 150, ry: 112, rotate: 7 },
      { city: "Fremont", rx: 165, ry: 108, rotate: 15 },
    ],
  },
];

const labels = [
  {
    city: "San Francisco",
    dx: 10,
    dy: -70,
    title: "Founder Fog Advisory",
    detail: "startups, meetups, pitch decks",
    className: "big",
  },
  {
    city: "Palo Alto",
    dx: -68,
    dy: -86,
    title: "VC Pressure Ridge",
    detail: "Palo Alto + Menlo Park",
  },
  {
    city: "Cupertino",
    dx: -112,
    dy: 44,
    title: "Weekend School Front",
    detail: "Saturday has left the chat",
    className: "big",
  },
  {
    city: "Milpitas",
    dx: 158,
    dy: -88,
    title: "Food + Boba Humidity",
    detail: "dinner-plan probability rising",
  },
  {
    city: "Fremont",
    dx: 132,
    dy: 64,
    title: "Asian Sports Current",
    detail: "strong weekend crosswind",
  },
  {
    city: "Daly City",
    dx: -86,
    dy: -12,
    title: "Chinese Food Crosswind",
    detail: "dim sum pressure rising",
    className: "compact",
  },
];

let map;
let snapshot;

function pointForCity(cityName) {
  return map.latLngToContainerPoint(cityCoords[cityName]);
}

function svgEl(name, attrs = {}) {
  const node = document.createElementNS("http://www.w3.org/2000/svg", name);
  Object.entries(attrs).forEach(([key, value]) => node.setAttribute(key, value));
  return node;
}

function cityValue(cityName, signal) {
  const city = snapshot?.cities?.find((item) => item.name === cityName);
  if (!city) return 0;
  const baseline = city.baseline?.organizations || 1;
  return ((city.values?.[signal] ?? 0) / baseline) * 10000;
}

function systemStrength(system) {
  const signalsBySystem = {
    startup: ["ai", "meetups"],
    vc: ["vc"],
    weekend: ["weekend"],
    sports: ["sports"],
    food: ["chai", "chineseFood", "boba", "grocery"],
  };
  const signals = signalsBySystem[system.className] ?? [];
  const values = system.points.flatMap((city) => signals.map((signal) => cityValue(city, signal)));
  const finite = values.filter((value) => Number.isFinite(value) && value > 0);
  if (!finite.length) return 0.55;
  return Math.max(0.48, Math.min(0.86, 0.46 + Math.sqrt(Math.max(...finite)) / 24));
}

function renderWeatherOverlay() {
  const overlay = document.querySelector("#weatherOverlay");
  const { width, height } = overlay.getBoundingClientRect();
  overlay.setAttribute("viewBox", `0 0 ${width} ${height}`);
  overlay.innerHTML = "";

  for (const system of systems) {
    const group = svgEl("g", { class: `system ${system.className}` });
    const strength = systemStrength(system);

    for (const blob of system.blobs) {
      const center = pointForCity(blob.city);
      group.appendChild(svgEl("ellipse", {
        class: "blob",
        cx: center.x,
        cy: center.y,
        rx: blob.rx,
        ry: blob.ry,
        fill: system.fill,
        opacity: strength.toFixed(2),
        transform: `rotate(${blob.rotate} ${center.x} ${center.y})`,
      }));
      group.appendChild(svgEl("ellipse", {
        class: "blob-ring",
        cx: center.x,
        cy: center.y,
        rx: blob.rx * 0.86,
        ry: blob.ry * 0.86,
        stroke: system.stroke,
        transform: `rotate(${blob.rotate} ${center.x} ${center.y})`,
      }));
    }

    const linePoints = system.points.map((city) => pointForCity(city));
    if (linePoints.length > 1) {
      group.appendChild(svgEl("polyline", {
        class: "front-line",
        points: linePoints.map((point) => `${point.x},${point.y}`).join(" "),
        stroke: system.stroke,
      }));
    }

    overlay.appendChild(group);
  }

  for (const city of ["San Francisco", "Palo Alto", "Cupertino", "Milpitas", "Fremont"]) {
    const center = pointForCity(city);
    overlay.appendChild(svgEl("ellipse", {
      class: "isobar",
      cx: center.x,
      cy: center.y,
      rx: 78,
      ry: 45,
      transform: `rotate(-18 ${center.x} ${center.y})`,
    }));
  }
}

function renderLabels() {
  const layer = document.querySelector("#labelLayer");
  layer.innerHTML = "";

  for (const label of labels) {
    const point = pointForCity(label.city);
    const node = document.createElement("div");
    node.className = `map-label ${label.className ?? ""}`;
    node.style.left = `${point.x + label.dx}px`;
    node.style.top = `${point.y + label.dy}px`;
    node.innerHTML = `<strong>${label.title}</strong><span>${label.detail}</span>`;
    layer.appendChild(node);
  }
}

function renderPoster() {
  renderWeatherOverlay();
  renderLabels();
}

async function boot() {
  map = L.map("posterMap", {
    attributionControl: false,
    dragging: false,
    doubleClickZoom: false,
    scrollWheelZoom: false,
    zoomControl: false,
    boxZoom: false,
    keyboard: false,
    tap: false,
  });

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    maxZoom: 19,
  }).addTo(map);

  map.setView([37.58, -122.12], 10);

  try {
    const response = await fetch("./data/bay-area-clusters.json", { cache: "no-store" });
    snapshot = response.ok ? await response.json() : null;
  } catch {
    snapshot = null;
  }

  map.whenReady(() => {
    renderPoster();
    setTimeout(renderPoster, 650);
  });
  window.addEventListener("resize", () => {
    map.invalidateSize();
    setTimeout(renderPoster, 80);
  });
}

boot();
