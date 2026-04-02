# Data Makes AI — Project Context

## Purpose
Educational decision tree prototype for middle school students (code.org). Students explore a dataset of items/characters, add custom features, hand-label training data, and build/test a decision tree classifier. There is also an **Explore Mode** where a pre-built "broken" model is loaded for students to trace and debug before rebuilding.

## Tech Stack
- **Vanilla JS only** — no build system, no bundler, no npm, no modules
- All scripts loaded via `<script>` tags in `index.html`; everything is global scope
- No external libraries or frameworks

## File Map
| File | Role |
|------|------|
| `index.html` | Full app HTML — dataset select screen, header, card/table views, all modals |
| `app.js` | Core logic: feature rendering, buildCards(), buildTable(), loadDataset(), save/load/explore |
| `dtree.js` | Decision tree algorithm (_buildDTree, _classify), all 5-phase training UI, tree SVG renderer |
| `style.css` | All styles — dark purple/blue theme, CSS variables in `:root` |
| `datasets.js` | DATASETS registry array — add new datasets here |
| `data.js` | Fantasy Items dataset — defines ITEMS, FEATURES, ICONS, DATASET_META, FEATURE_SUGGESTIONS |
| `data2.js` | Character Alignment dataset — same shape as data.js |
| `test_data.js` | TEST_ITEMS + TEST_ICONS holdout set for fantasy (10 items, IDs separate from training) |
| `test_data2.js` | TEST_ITEMS + TEST_ICONS holdout set for characters |
| `explore_fantasy.dtmodel` | Pre-built "broken" explore model for fantasy dataset (JSON) |
| `explore_characters.dtmodel` | Pre-built "broken" explore model for characters dataset (JSON) |

## Key Globals (set by dataset files at load time)
- `ITEMS` — array of 40 item objects
- `FEATURES` — array of feature definition objects (key, label, type, options, pillClasses, etc.)
- `ICONS` — object keyed by item.id → SVG string
- `DATASET_META` — `{ title, subtitle, footer, subtitleKey }`
- `TEST_ITEMS`, `TEST_ICONS` — holdout set loaded from test file
- `FEATURE_SUGGESTIONS` — array for the "Add Feature" modal chips

## Key Globals (app.js)
- `customFeatures` — `[{ name, key, categories, values:{itemId:cat} }]`
- `currentDatasetId` — string ID of loaded dataset ('fantasy' | 'characters')
- `exploreMode` — boolean; true when loaded via Explore Mode toggle
- `exploreGroundTruth` — `{ "itemId": bool }` from explore .dtmodel file
- `_dsMode` — 'build' | 'explore'; set by dataset select toggle

## Key Globals (dtree.js)
```
dt = {
  question, trainingItems, labels, labelFeature, labelValue,
  currentIndex, tree, showMath, testCorrections,
  selectedFeatures (Set or null), _unclassifiedGroups, _nodeMap, _parentMap
}
_dtMode — 'question' | 'feature'
```

## Decision Tree Node Shape
```javascript
// Leaf
{ isLeaf: true, label: 'yes'|'no', count: {yes, no}, items: [] }
// Split
{ isLeaf: false, feature, splitVal, isNumeric, condition, count, items,
  splitMath: {parentGini,leftGini,rightGini,totalGini,leftN,rightN,totalN,leftYes,rightYes},
  left, right }
```

## .dtmodel File Format (save/load/explore)
```json
{
  "version": 1,
  "datasetId": "fantasy",
  "exploreContext": "narrative string shown above dataset in explore mode",
  "exploreGroundTruth": { "itemId": true/false },
  "itemEdits": { "itemId": { "featureKey": value } },
  "customFeatures": [...],
  "model": {
    "question": "...",
    "labelFeature": null,
    "labelValue": "",
    "selectedFeatures": ["element", "usable"],
    "labels": { "itemId": true/false },
    "tree": null
  }
}
```
`tree: null` in explore files — auto-built from `labels` via `_buildExploreTree()` on load.

## App Flow
1. Page loads → `showDatasetSelect()` renders dataset cards
2. User selects Build or Explore mode toggle, then clicks a dataset card → `loadDataset(id)`
3. `loadDataset` dynamically injects `<script>` tags for testFile + dataFile; in explore mode also `fetch()`es the .dtmodel file; calls `launchApp()` when all loaded
4. `launchApp()` hides dataset select screen; in explore mode calls `_activateExploreMode()`; calls `initDataset()`, `buildCards()`, `buildTable()`
5. In explore mode: `_activateExploreMode` → `_restoreModel(data, true)` → `_buildExploreTree()` → show banner + context box + add `body.explore-mode` class

## Explore Mode Summary
- **Banner** between `</header>` and `<main>` (`#explore-banner`)
- **Context box** inside `<main>` before the views (`#explore-context-box`)
- **Classification badges** on cards (upper-left, `.card-clf-badge`) — green ✓ correct, red ✗ wrong
- **Classification column** in table (leftmost, `.col-classify-header` / `.col-classify-cell`)
- **Hidden via CSS**: `body.explore-mode` hides `#model-actions`, `.dt-header-btn`, `.add-feature-bar`
- `getItemClassification(item)` → `{ correct: bool, predicted: bool }` or null

## Conventions
- Feature values edited inline (click pill → select/input element)
- `slugify(name)` converts feature names to JS-safe keys
- `_fval(item, feat)` reads a feature value from either FEATURES or customFeatures
- `renderFeatureValue(feature, item)` returns pill HTML for built-in features
- `customPill(val)` returns pill HTML for custom features
- Sort indicator uses `data-col` attribute on `<th>` (not DOM index) since explore mode prepends a non-sortable column
- All new styles go in style.css; CSS variables in `:root` are the theme palette

## Datasets Registry (datasets.js)
Each entry: `{ id, name, description, emoji, tagline, dataFile, testFile, exploreFile? }`  
Add a new dataset by adding an entry here + creating the corresponding data files.

## Iterated Features (built so far)
1. Core app: card/table views, inline feature editing, custom features, Add Feature modal
2. Decision tree: 5-phase workflow (question → features → swipe → build → tree → test), SVG visualization, Gini math panel, pruning, retraining
3. Save/Load: `exportModel()` downloads `.dtmodel`, `importModel()` restores full state including tree
4. Explore Mode: pre-built broken models, classification accuracy indicators on every item
