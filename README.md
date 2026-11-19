# gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/iamsettt1/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/iamsettt1/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline guide and tracker for all 55 Grand Theft Auto VI trophies on PlayStation 5: 1 platinum, 2 gold, 6 silver and 46 bronze, 28 of them hidden on PlayStation until earned. Every trophy carries its official name, description and grade, a guide written in our own words that cites its sources, its kind (story, missable, collectibles, activities or online — the list has no online trophies), and its place in the roadmap to the platinum. The one trophy the guides flag as possibly missable, Positive Mental Attitude, is flagged in the checklist, in the roadmap and in its own guide.

The tracker is a checklist that saves in the browser (localStorage) and can be exported to a file and imported back. It filters by kind and by grade, searches by name, mission or place, and has a spoiler setting that hides the names, descriptions and guides of story trophies until they are earned. Deep links show states directly: `?view=roadmap` for the roadmap, `?trophy=28` to open one trophy's guide, `?spoiler=1` for spoiler mode, `?demo=1` to pre-check a few trophies for a preview.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080. The app is static files under `app/` with no build step, and it works with the network off — every file it loads is its own, and it makes no network request at run time. Source links beside each guide open only when the reader follows them.

## Layout

- `app/index.html` — the page: header and progress, checklist and roadmap views, filters, spoiler setting, export/import.
- `app/app.js` — the tracker: loading the data, rendering, progress, spoiler mode, export/import, deep links.
- `app/filters.js` — the filter helpers: by kind, by grade, by text search.
- `app/roadmap.js` — the road to the platinum: the stages in order, from Chapter 1 to the 100% cleanup.
- `app/data/trophies.json` — all 55 trophies with official names, descriptions and grades, plus a cited guide, kind, missable flag, chapter and roadmap stage each.
- `app/style.css` — the look: an original dusk-and-sunset palette, CSS only.
- `main.ts` — the entrypoint: copies `app/` and `screenshots/` to the output directory and writes `dossier.json`.
- `screenshots/` — four renders of the app in a browser: the checklist, a trophy guide, the roadmap, and the spoiler setting at work.

---

<sub>Entered on [make.fun](https://make.fun/?ref=9j3w1sg2&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
