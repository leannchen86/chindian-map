# Bay Area Cultural Co-Occurrence Map

Standalone map-first prototype for exploring Bay Area cultural signal clusters and how they co-locate on a real Leaflet/OpenStreetMap interface.

Run a local static server, then open the app:

```bash
python3 -m http.server 4178
```

```txt
http://127.0.0.1:4178/
```

There is also a static poster draft:

```txt
http://127.0.0.1:4178/poster.html
```

The current data falls back to seeded city-level counts. If `data/bay-area-clusters.json` exists, the app loads that Diffbot snapshot instead. Most signal layers use coverage-adjusted density:

```txt
cluster matches / all indexed Diffbot organizations in that city * 10,000
```

Raw match counts are still shown in popups and the details drawer. The color response can be switched between `Linear`, `Log`, `Sqrt`, `Sigmoid`, and `Exp` without changing the underlying factual counts.

`Startups` use a hybrid gravity score instead of pure density. The score blends raw city footprint, density per 10k indexed organizations, and the geometric blend of both, so large ecosystem anchors like San Francisco and Palo Alto are not underweighted just because their total indexed organization baseline is also large.

The primary selector is signal-only. Composite indexes are intentionally left out of this menu until they move into a separate layer.

Two earlier experimental signals are now folded into broader fields: Indo-Chinese menu terms live inside `Indian Food`, and language-school terms live inside `Weekend Schools`. The earlier university/research signal was removed because it mostly reflected Stanford and UC Berkeley.

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
