# Bay Area Cultural Co-Occurrence Map

Standalone map-first prototype for exploring Bay Area cultural signal clusters and how they co-locate on a real Leaflet/OpenStreetMap interface.

Run a local static server, then open the app:

```bash
python3 -m http.server 4178
```

```txt
http://127.0.0.1:4178/
```

The current data falls back to seeded city-level counts. If `data/bay-area-clusters.json` exists, the app loads that Diffbot snapshot instead. The default heat gradient uses coverage-adjusted density:

```txt
cluster matches / all indexed Diffbot organizations in that city * 10,000
```

Raw match counts are still shown in popups and the details drawer. The color response can be switched between `Linear`, `Log`, `Sqrt`, `Sigmoid`, and `Exp` without changing the underlying factual counts.

Preset layers are equal-weight indexes built from component densities:

- `Saturday Route Optimization`: tutoring, weekend schools, language schools, Asian groceries, and racket sports.
- `Food Crossover`: boba, Indian restaurants, Chinese restaurants, Indo-Chinese menus, and Asian groceries.
- `Tech / Social Gravity`: AI/startups, VC/accelerators, meetups, coworking, and university/research orgs.
- `Indian x Chinese Food`: Indian restaurants, Chinese restaurants, boba, and Indo-Chinese menus.

The DQL panel in the UI shows the intended Diffbot handoff: facet each signal by Bay Area city, then compute densities and pairwise correlations from those city distributions.

The default UI is intentionally sparse: density is conveyed by a weather-map-style heat gradient, subtle contour lines, and a small legend. In pair mode, the first layer is orange, the second layer is blue, and purple marks places where both layers are strong. Exact counts, rankings, pairings, correlations, and DQL are tucked into the `i` details drawer or map popups.

To inspect generated DQL without spending API credits:

```bash
node scripts/fetch-diffbot-data.mjs --dry-run
```

To generate real counts from Diffbot:

```bash
node scripts/fetch-diffbot-data.mjs
```

The prototype deliberately avoids individual profile, face, name, or inferred-ethnicity data. It keeps the joke on aggregate places, businesses, events, and public web signals.
