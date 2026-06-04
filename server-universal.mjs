import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { extname, resolve } from "node:path";

const ROOT = resolve(new URL(".", import.meta.url).pathname);
const PUBLIC_DIR = resolve(ROOT, "universal");
const DATA_PATH = resolve(ROOT, "data", "bay-area-clusters.json");
const ENV_PATH = resolve(ROOT, ".env.local");
const CUSTOM_LAYERS_PATH = resolve(PUBLIC_DIR, "custom-layers.json");
const DQL_ENDPOINT = "https://kg.diffbot.com/kg/v3/dql";
const PORT = Number(process.env.PORT ?? 4188);

const cityNames = [
  "San Francisco",
  "Oakland",
  "Berkeley",
  "Daly City",
  "San Mateo",
  "Redwood City",
  "Menlo Park",
  "Palo Alto",
  "Mountain View",
  "Sunnyvale",
  "Santa Clara",
  "Cupertino",
  "Milpitas",
  "Fremont",
  "Hayward",
  "Pleasanton",
  "San Ramon",
  "San Jose",
];

const cityCoords = {
  "San Francisco": { lat: 37.7749, lon: -122.4194 },
  Oakland: { lat: 37.8044, lon: -122.2712 },
  Berkeley: { lat: 37.8715, lon: -122.273 },
  "Daly City": { lat: 37.6879, lon: -122.4702 },
  "San Mateo": { lat: 37.563, lon: -122.3255 },
  "Redwood City": { lat: 37.4852, lon: -122.2364 },
  "Menlo Park": { lat: 37.453, lon: -122.1817 },
  "Palo Alto": { lat: 37.4419, lon: -122.143 },
  "Mountain View": { lat: 37.3861, lon: -122.0839 },
  Sunnyvale: { lat: 37.3688, lon: -122.0363 },
  "Santa Clara": { lat: 37.3541, lon: -121.9552 },
  Cupertino: { lat: 37.323, lon: -122.0322 },
  Milpitas: { lat: 37.4323, lon: -121.8996 },
  Fremont: { lat: 37.5485, lon: -121.9886 },
  Hayward: { lat: 37.6688, lon: -122.0808 },
  Pleasanton: { lat: 37.6624, lon: -121.8747 },
  "San Ramon": { lat: 37.7799, lon: -121.978 },
  "San Jose": { lat: 37.3382, lon: -121.8863 },
};

const bayAreaFilter =
  'locations.{isCurrent:true country.name:"United States" region.name:"California" city.name:or(' +
  cityNames.map((city) => JSON.stringify(city)).join(",") +
  ")}";

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function parseEnv(text) {
  return Object.fromEntries(
    text
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line && !line.startsWith("#"))
      .map((line) => {
        const index = line.indexOf("=");
        return [line.slice(0, index), line.slice(index + 1)];
      }),
  );
}

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48) || "custom-layer";
}

function titleCase(text) {
  return text
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

function uniqueTerms(terms) {
  return [...new Set(terms.map((term) => term.trim()).filter(Boolean))].slice(0, 20);
}

function inferLayerSpec(prompt) {
  const cleanPrompt = String(prompt ?? "").replace(/\s+/g, " ").trim();
  const lower = cleanPrompt.toLowerCase();

  const recipes = [
    {
      test: /asian.*baker|baker.*asian|bakery|bakeries|egg tart|pineapple bun/,
      label: "Asian Bakeries",
      terms: [
        "Asian bakery",
        "Chinese bakery",
        "Taiwanese bakery",
        "Hong Kong bakery",
        "Japanese bakery",
        "Korean bakery",
        "egg tart",
        "pineapple bun",
        "mochi donut",
        "bakery cafe",
      ],
    },
    {
      test: /pilates|reformer/,
      label: "Pilates Studios",
      terms: ["Pilates", "Pilates studio", "reformer Pilates", "fitness studio"],
    },
    {
      test: /hot pot|hotpot|shabu/,
      label: "Hot Pot",
      terms: ["hot pot", "hotpot", "shabu shabu", "Chinese hot pot"],
    },
    {
      test: /south asian dance|bollywood dance|bharatanatyam|dance class/,
      label: "South Asian Dance",
      terms: ["Bollywood dance", "Bharatanatyam", "Kathak", "Indian dance", "dance school"],
    },
    {
      test: /mahjong|mah-jong/,
      label: "Mahjong",
      terms: ["mahjong", "mah-jong", "mahjong club", "game club"],
    },
    {
      test: /korean bbq|kbbq/,
      label: "Korean BBQ",
      terms: ["Korean BBQ", "Korean barbecue", "KBBQ"],
    },
    {
      test: /matcha|mochi|dessert/,
      label: "Asian Desserts",
      terms: ["matcha", "mochi", "Asian dessert", "dessert cafe", "shaved ice"],
    },
  ];

  const recipe = recipes.find((entry) => entry.test.test(lower));
  if (recipe) {
    return {
      id: slugify(recipe.label),
      label: recipe.label,
      queryType: "Organization",
      field: "description",
      terms: recipe.terms,
    };
  }

  const commaTerms = cleanPrompt.split(",").map((term) => term.trim()).filter(Boolean);
  const terms = commaTerms.length > 1
    ? commaTerms
    : uniqueTerms([
      cleanPrompt,
      `${cleanPrompt} business`,
      `${cleanPrompt} organization`,
      `${cleanPrompt} service`,
    ]);

  return {
    id: slugify(cleanPrompt),
    label: titleCase(cleanPrompt),
    queryType: "Organization",
    field: "description",
    terms,
  };
}

function normalizeSpec(input) {
  const base = inferLayerSpec(input?.label || input?.prompt || "Custom Layer");
  const queryType = input?.queryType === "Event" ? "Event" : "Organization";
  const field = input?.field === "name" ? "name" : "description";
  const terms = uniqueTerms(Array.isArray(input?.terms) ? input.terms : base.terms);
  return {
    id: slugify(input?.id || input?.label || base.label),
    label: titleCase(input?.label || base.label),
    queryType,
    field,
    terms,
  };
}

function dqlForSpec(spec) {
  const cityFacet = cityNames.map((city) => JSON.stringify(city)).join(",");
  const terms = spec.terms.map((term) => JSON.stringify(term)).join(",");
  return `type:${spec.queryType}
${bayAreaFilter}
${spec.field}:or(${terms})
facet[${cityFacet}]:locations.city.name`;
}

function collectFacetRows(value, rows = []) {
  if (!value) return rows;
  if (Array.isArray(value)) {
    value.forEach((item) => collectFacetRows(item, rows));
    return rows;
  }
  if (typeof value === "object") {
    if (Object.hasOwn(value, "value") && Object.hasOwn(value, "count")) {
      rows.push(value);
      return rows;
    }
    Object.values(value).forEach((item) => collectFacetRows(item, rows));
  }
  return rows;
}

async function readSnapshot() {
  const snapshot = JSON.parse(await readFile(DATA_PATH, "utf8"));
  return snapshot;
}

async function readCustomLayers() {
  try {
    return JSON.parse(await readFile(CUSTOM_LAYERS_PATH, "utf8"));
  } catch {
    return { layers: [] };
  }
}

async function writeCustomLayers(payload) {
  await mkdir(PUBLIC_DIR, { recursive: true });
  await writeFile(CUSTOM_LAYERS_PATH, JSON.stringify(payload, null, 2));
}

async function queryDiffbot(query) {
  const env = parseEnv(await readFile(ENV_PATH, "utf8"));
  if (!env.DIFFBOT_TOKEN) {
    throw new Error(`Missing DIFFBOT_TOKEN in ${ENV_PATH}`);
  }

  const url = new URL(DQL_ENDPOINT);
  url.searchParams.set("token", env.DIFFBOT_TOKEN);
  url.searchParams.set("type", "query");
  url.searchParams.set("size", "0");
  url.searchParams.set("query", query);

  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`DQL request failed: ${response.status} ${body.slice(0, 420)}`);
  }
  return response.json();
}

async function readJsonBody(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  const text = Buffer.concat(chunks).toString("utf8");
  return text ? JSON.parse(text) : {};
}

function jsonResponse(response, status, payload) {
  response.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  response.end(JSON.stringify(payload));
}

function methodNotAllowed(response) {
  jsonResponse(response, 405, { error: "Method not allowed" });
}

async function handleApi(request, response, url) {
  if (url.pathname === "/api/config") {
    if (request.method !== "GET") return methodNotAllowed(response);
    const snapshot = await readSnapshot();
    const custom = await readCustomLayers();
    const cities = snapshot.cities.map((city) => ({
      name: city.name,
      ...cityCoords[city.name],
      baseline: city.baseline,
    }));
    return jsonResponse(response, 200, {
      generatedAt: snapshot.generatedAt,
      cities,
      customLayers: custom.layers ?? [],
    });
  }

  if (url.pathname === "/api/spec") {
    if (request.method !== "POST") return methodNotAllowed(response);
    const body = await readJsonBody(request);
    const spec = normalizeSpec({ prompt: body.prompt, label: body.label, terms: body.terms });
    return jsonResponse(response, 200, { spec, dql: dqlForSpec(spec) });
  }

  if (url.pathname === "/api/query") {
    if (request.method !== "POST") return methodNotAllowed(response);
    const body = await readJsonBody(request);
    const spec = normalizeSpec(body.spec ?? body);
    const dql = dqlForSpec(spec);
    const [snapshot, diffbotJson] = await Promise.all([readSnapshot(), queryDiffbot(dql)]);
    const rows = collectFacetRows(diffbotJson.data);
    const countsByCity = new Map(rows.map((row) => [String(row.value), Number(row.count) || 0]));
    const cities = snapshot.cities.map((city) => {
      const count = countsByCity.get(city.name) ?? 0;
      const organizations = Number(city.baseline?.organizations ?? 0);
      return {
        name: city.name,
        ...cityCoords[city.name],
        count,
        baseline: organizations,
        density: organizations ? (count / organizations) * 10000 : count,
      };
    });
    return jsonResponse(response, 200, {
      layer: {
        id: spec.id,
        label: spec.label,
        spec,
        dql,
        generatedAt: new Date().toISOString(),
        cities,
      },
    });
  }

  if (url.pathname === "/api/save") {
    if (request.method !== "POST") return methodNotAllowed(response);
    const body = await readJsonBody(request);
    if (!body.layer?.id || !Array.isArray(body.layer?.cities)) {
      return jsonResponse(response, 400, { error: "Missing layer payload" });
    }
    const custom = await readCustomLayers();
    const layers = (custom.layers ?? []).filter((layer) => layer.id !== body.layer.id);
    layers.unshift({ ...body.layer, savedAt: new Date().toISOString() });
    await writeCustomLayers({ layers });
    return jsonResponse(response, 200, { ok: true, layers });
  }

  return jsonResponse(response, 404, { error: "Unknown API route" });
}

async function serveStatic(request, response, url) {
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = resolve(PUBLIC_DIR, `.${decodeURIComponent(pathname)}`);
  if (!filePath.startsWith(PUBLIC_DIR)) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const fileStat = await stat(filePath);
    if (!fileStat.isFile()) throw new Error("Not a file");
    response.writeHead(200, {
      "Content-Type": contentTypes[extname(filePath)] ?? "application/octet-stream",
      "Cache-Control": "no-store",
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Not found");
  }
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://${request.headers.host}`);
  try {
    if (url.pathname.startsWith("/api/")) {
      await handleApi(request, response, url);
      return;
    }
    await serveStatic(request, response, url);
  } catch (error) {
    jsonResponse(response, 500, { error: error.message });
  }
});

server.listen(PORT, () => {
  console.log(`Universal heatmap experiment running at http://127.0.0.1:${PORT}/`);
});
