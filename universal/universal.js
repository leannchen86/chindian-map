let map;
let heatLayer;
let config;
let currentSpec = null;
let currentLayer = null;

const els = {
  promptForm: document.querySelector("#promptForm"),
  promptInput: document.querySelector("#promptInput"),
  labelInput: document.querySelector("#labelInput"),
  termsInput: document.querySelector("#termsInput"),
  runLayer: document.querySelector("#runLayer"),
  saveLayer: document.querySelector("#saveLayer"),
  statusText: document.querySelector("#statusText"),
  activeLayerName: document.querySelector("#activeLayerName"),
  savedLayers: document.querySelector("#savedLayers"),
  rankList: document.querySelector("#rankList"),
  dqlText: document.querySelector("#dqlText"),
};

function formatNumber(value, digits = 1) {
  return Number(value).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits,
  });
}

function setStatus(message, isError = false) {
  els.statusText.textContent = message;
  els.statusText.style.color = isError ? "#a43f30" : "";
}

async function api(path, payload = null) {
  const response = await fetch(path, {
    method: payload ? "POST" : "GET",
    headers: payload ? { "Content-Type": "application/json" } : {},
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const json = await response.json();
  if (!response.ok) throw new Error(json.error ?? "Request failed");
  return json;
}

function heatColor(value) {
  const palette = [
    { stop: 0, color: [47, 127, 182] },
    { stop: 0.28, color: [94, 183, 207] },
    { stop: 0.48, color: [215, 230, 121] },
    { stop: 0.68, color: [243, 178, 77] },
    { stop: 0.86, color: [227, 95, 66] },
    { stop: 1, color: [142, 31, 116] },
  ];
  const t = Math.max(0, Math.min(1, value));
  const upperIndex = palette.findIndex((entry) => entry.stop >= t);
  const upper = palette[Math.max(upperIndex, 1)];
  const lower = palette[Math.max(0, palette.indexOf(upper) - 1)];
  const localT = upper.stop === lower.stop ? 0 : (t - lower.stop) / (upper.stop - lower.stop);
  return lower.color.map((channel, index) => Math.round(channel + (upper.color[index] - channel) * localT));
}

function createHeatLayer() {
  const HeatLayer = L.Layer.extend({
    onAdd(leafletMap) {
      this._map = leafletMap;
      this._canvas = L.DomUtil.create("canvas", "heat-canvas leaflet-zoom-animated");
      leafletMap.getPanes().overlayPane.appendChild(this._canvas);
      leafletMap.on("move zoom resize zoomend moveend", this._reset, this);
      this._reset();
    },
    onRemove(leafletMap) {
      leafletMap.off("move zoom resize zoomend moveend", this._reset, this);
      this._canvas.remove();
    },
    setData(points) {
      this._points = points;
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

      const cell = Math.max(5, Math.round(Math.min(width, height) / 140));
      const sampleWidth = Math.ceil(width / cell);
      const sampleHeight = Math.ceil(height / cell);
      const influenceRadius = Math.max(240, Math.min(width, height) * 0.44);
      const fadeStart = influenceRadius * 0.7;
      const projected = points.map((point) => ({
        ...point,
        pixel: this._map.latLngToContainerPoint([point.lat, point.lon]),
      }));
      const offscreen = document.createElement("canvas");
      offscreen.width = sampleWidth;
      offscreen.height = sampleHeight;
      const offscreenContext = offscreen.getContext("2d");
      const imageData = new ImageData(sampleWidth, sampleHeight);

      for (let sampleY = 0; sampleY < sampleHeight; sampleY += 1) {
        for (let sampleX = 0; sampleX < sampleWidth; sampleX += 1) {
          const x = (sampleX + 0.5) * cell;
          const y = (sampleY + 0.5) * cell;
          let weighted = 0;
          let totalWeight = 0;
          let nearest = Infinity;

          for (const point of projected) {
            const distance = Math.hypot(x - point.pixel.x, y - point.pixel.y);
            nearest = Math.min(nearest, distance);
            const weight = 1 / (distance * distance + 420);
            weighted += point.score * weight;
            totalWeight += weight;
          }

          if (!totalWeight || nearest > influenceRadius) continue;

          const value = Math.max(0, Math.min(1, weighted / totalWeight));
          const color = heatColor(value);
          const fade = nearest <= fadeStart ? 1 : Math.max(0, (influenceRadius - nearest) / (influenceRadius - fadeStart));
          const index = (sampleY * sampleWidth + sampleX) * 4;
          imageData.data[index] = color[0];
          imageData.data[index + 1] = color[1];
          imageData.data[index + 2] = color[2];
          imageData.data[index + 3] = Math.round((0.18 + value * 0.58) * fade * 255);
        }
      }

      offscreenContext.putImageData(imageData, 0, 0);
      ctx.imageSmoothingEnabled = true;
      ctx.drawImage(offscreen, 0, 0, width, height);
    },
  });
  return new HeatLayer();
}

function initMap() {
  map = L.map("labMap", {
    attributionControl: true,
    scrollWheelZoom: true,
    zoomControl: true,
  });

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    className: "base-map-tiles",
    maxZoom: 19,
  }).addTo(map);

  heatLayer = createHeatLayer().addTo(map);
  const bounds = L.latLngBounds(config.cities.map((city) => [city.lat, city.lon]));
  map.fitBounds(bounds, { padding: [42, 42] });
}

function setSpec(spec, dql) {
  currentSpec = spec;
  els.labelInput.value = spec.label;
  els.termsInput.value = spec.terms.join("\n");
  els.dqlText.textContent = dql;
  els.saveLayer.disabled = true;
  setStatus("Review or edit terms, then run Diffbot.");
}

function specFromForm() {
  return {
    label: els.labelInput.value.trim(),
    queryType: "Organization",
    field: "description",
    terms: els.termsInput.value.split(/\n|,/).map((term) => term.trim()).filter(Boolean),
  };
}

function renderLayer(layer) {
  currentLayer = layer;
  els.activeLayerName.textContent = layer.label;
  els.dqlText.textContent = layer.dql;
  const maxDensity = Math.max(...layer.cities.map((city) => city.density), 0);
  const points = layer.cities.map((city) => ({
    lat: city.lat,
    lon: city.lon,
    score: maxDensity ? city.density / maxDensity : 0,
  }));
  heatLayer.setData(points);

  els.rankList.innerHTML = "";
  [...layer.cities]
    .sort((a, b) => b.density - a.density)
    .slice(0, 8)
    .forEach((city, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="index">${index + 1}</span>
        <span>${city.name}</span>
        <span class="score">
          <strong>${city.count.toLocaleString()}</strong>
          <small>${formatNumber(city.density)} /10k</small>
        </span>
      `;
      els.rankList.appendChild(li);
    });

  els.saveLayer.disabled = false;
}

function renderSavedLayers() {
  const current = els.savedLayers.value;
  els.savedLayers.innerHTML = '<option value="">Saved layers</option>';
  for (const layer of config.customLayers ?? []) {
    const option = document.createElement("option");
    option.value = layer.id;
    option.textContent = layer.label;
    els.savedLayers.appendChild(option);
  }
  if ([...els.savedLayers.options].some((option) => option.value === current)) {
    els.savedLayers.value = current;
  }
}

async function refreshConfig() {
  config = await api("/api/config");
  renderSavedLayers();
}

els.promptForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const prompt = els.promptInput.value.trim();
  if (!prompt) return;
  setStatus("Drafting layer spec...");
  try {
    const { spec, dql } = await api("/api/spec", { prompt });
    setSpec(spec, dql);
  } catch (error) {
    setStatus(error.message, true);
  }
});

document.querySelectorAll(".examples button").forEach((button) => {
  button.addEventListener("click", () => {
    els.promptInput.value = button.dataset.prompt;
    els.promptForm.requestSubmit();
  });
});

els.runLayer.addEventListener("click", async () => {
  const spec = specFromForm();
  if (!spec.label || !spec.terms.length) {
    setStatus("Layer name and at least one term are required.", true);
    return;
  }
  setStatus("Running Diffbot facet query...");
  els.runLayer.disabled = true;
  try {
    const { layer } = await api("/api/query", { spec });
    renderLayer(layer);
    setStatus(`Loaded ${layer.label}. Save it if this should stay in the lab.`);
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    els.runLayer.disabled = false;
  }
});

els.saveLayer.addEventListener("click", async () => {
  if (!currentLayer) return;
  setStatus("Saving layer locally...");
  try {
    const { layers } = await api("/api/save", { layer: currentLayer });
    config.customLayers = layers;
    renderSavedLayers();
    els.savedLayers.value = currentLayer.id;
    setStatus(`Saved ${currentLayer.label}.`);
  } catch (error) {
    setStatus(error.message, true);
  }
});

els.savedLayers.addEventListener("change", () => {
  const layer = (config.customLayers ?? []).find((item) => item.id === els.savedLayers.value);
  if (layer) {
    renderLayer(layer);
    setStatus(`Loaded saved layer: ${layer.label}.`);
  }
});

async function boot() {
  await refreshConfig();
  initMap();
  els.promptInput.value = "asian bakeries";
  const { spec, dql } = await api("/api/spec", { prompt: "asian bakeries" });
  setSpec(spec, dql);
}

boot().catch((error) => {
  setStatus(error.message, true);
});
