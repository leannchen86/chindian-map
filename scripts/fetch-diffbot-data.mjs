import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const ROOT = resolve(new URL("..", import.meta.url).pathname);
const ENV_PATH = resolve(ROOT, ".env.local");
const OUT_PATH = resolve(ROOT, "data", "bay-area-clusters.json");
const DQL_ENDPOINT = "https://kg.diffbot.com/kg/v3/dql";

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

const bayAreaFilter =
  'locations.{isCurrent:true country.name:"United States" region.name:"California" city.name:or(' +
  cityNames.map((city) => JSON.stringify(city)).join(",") +
  ")}";

const clusters = [
  {
    id: "kumon",
    type: "Organization",
    field: "description",
    terms: ["Kumon", "Mathnasium", "Russian School of Mathematics", "AoPS", "Code Ninjas", "coding classes", "SAT", "ACT", "tutoring"],
  },
  {
    id: "boba",
    type: "Organization",
    field: "description",
    terms: ["boba", "bubble tea", "milk tea", "tea house", "dessert cafe"],
  },
  {
    id: "chai",
    type: "Organization",
    field: "description",
    terms: [
      "chai",
      "dosa",
      "chaat",
      "biryani",
      "Indian restaurant",
      "South Indian",
      "Gujarati",
      "Punjabi",
      "Indo Chinese",
      "Indian Chinese",
      "Hakka noodles",
      "Gobi Manchurian",
      "chili paneer",
      "Schezwan",
    ],
  },
  {
    id: "chineseFood",
    type: "Organization",
    field: "description",
    terms: ["Chinese restaurant", "dim sum", "hot pot", "Sichuan", "Cantonese", "Taiwanese restaurant", "Shanghainese", "noodle house"],
  },
  {
    id: "grocery",
    type: "Organization",
    field: "description",
    terms: ["99 Ranch", "Marina Food", "India Cash & Carry", "Patel Brothers", "Apna Bazar", "New India Bazar", "Asian grocery"],
  },
  {
    id: "ai",
    type: "Organization",
    field: "description",
    terms: ["artificial intelligence", "machine learning", "LLM", "computer vision", "natural language processing", "AI startup", "software company"],
  },
  {
    id: "weekend",
    type: "Organization",
    field: "description",
    terms: [
      "language school",
      "Chinese School",
      "Mandarin School",
      "Chinese language",
      "Cantonese",
      "Hindi School",
      "Hindi class",
      "Tamil School",
      "Tamil class",
      "Telugu School",
      "Telugu class",
      "Korean school",
      "Japanese school",
      "Bharatanatyam",
      "tabla",
      "piano",
      "chess",
    ],
  },
  {
    id: "sports",
    type: "Organization",
    field: "description",
    terms: ["badminton", "table tennis", "cricket", "pickleball", "chess club", "ping pong"],
  },
  {
    id: "vc",
    type: "Organization",
    field: "description",
    terms: ["venture capital", "startup accelerator", "incubator", "seed fund", "angel investor", "venture studio"],
  },
  {
    id: "meetups",
    type: "Organization",
    field: "description",
    terms: ["meetup", "hackathon", "networking event", "founder community", "startup community", "developer community"],
  },
  {
    id: "coworking",
    type: "Organization",
    field: "description",
    terms: ["coworking", "co-working", "shared office", "flexible workspace", "WeWork", "Regus", "Industrious"],
  },
  {
    id: "research",
    type: "Organization",
    field: "description",
    terms: ["university", "research institute", "research center", "laboratory", "Stanford", "UC Berkeley", "NASA Ames"],
  },
];

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

function dqlForCluster(cluster) {
  const terms = cluster.terms.map((term) => JSON.stringify(term)).join(",");
  const cityFacet = cityNames.map((city) => JSON.stringify(city)).join(",");
  return `type:${cluster.type}
${bayAreaFilter}
${cluster.field}:or(${terms})
facet[${cityFacet}]:locations.city.name`;
}

function baselineDql() {
  const cityFacet = cityNames.map((city) => JSON.stringify(city)).join(",");
  return `type:Organization
${bayAreaFilter}
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

async function queryFacet(token, query) {
  const url = new URL(DQL_ENDPOINT);
  url.searchParams.set("token", token);
  url.searchParams.set("type", "query");
  url.searchParams.set("size", "0");
  url.searchParams.set("query", query);

  const response = await fetch(url, { headers: { Accept: "application/json" } });
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`DQL request failed: ${response.status} ${body.slice(0, 400)}`);
  }
  return response.json();
}

async function main() {
  const env = parseEnv(await readFile(ENV_PATH, "utf8"));
  const token = env.DIFFBOT_TOKEN;
  if (!token) throw new Error(`Missing DIFFBOT_TOKEN in ${ENV_PATH}`);

  const dryRun = process.argv.includes("--dry-run");
  const selectedIds = process.argv
    .find((arg) => arg.startsWith("--only="))
    ?.replace("--only=", "")
    .split(",")
    .filter(Boolean);
  const selectedClusters = selectedIds ? clusters.filter((cluster) => selectedIds.includes(cluster.id)) : clusters;

  const cities = cityNames.map((name) => ({
    name,
    baseline: {
      organizations: 0,
    },
    values: Object.fromEntries(clusters.map((cluster) => [cluster.id, 0])),
  }));
  const cityByName = new Map(cities.map((city) => [city.name, city]));
  const queries = [{ id: "baseline.organizations", query: baselineDql() }];

  if (!dryRun) {
    process.stdout.write("Querying baseline.organizations... ");
    const json = await queryFacet(token, baselineDql());
    const rows = collectFacetRows(json.data);
    for (const row of rows) {
      const cityName = String(row.value);
      if (cityByName.has(cityName)) {
        cityByName.get(cityName).baseline.organizations = Number(row.count) || 0;
      }
    }
    process.stdout.write(`${rows.length} facets\n`);
  }

  for (const cluster of selectedClusters) {
    const query = dqlForCluster(cluster);
    queries.push({ id: cluster.id, query });
    if (dryRun) continue;

    process.stdout.write(`Querying ${cluster.id}... `);
    const json = await queryFacet(token, query);
    const rows = collectFacetRows(json.data);
    for (const row of rows) {
      const cityName = String(row.value);
      if (cityByName.has(cityName)) {
        cityByName.get(cityName).values[cluster.id] = Number(row.count) || 0;
      }
    }
    process.stdout.write(`${rows.length} facets\n`);
  }

  if (dryRun) {
    console.log(JSON.stringify(queries, null, 2));
    return;
  }

  await mkdir(resolve(ROOT, "data"), { recursive: true });
  await writeFile(
    OUT_PATH,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        source: "diffbot-dql-facet",
        cities,
        queries,
      },
      null,
      2,
    ),
  );
  console.log(`Wrote ${OUT_PATH}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
