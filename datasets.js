// ─────────────────────────────────────────────────
//  DATASET REGISTRY
//  Add entries here to make new datasets available
//  on the selection screen.
//
//  Each entry requires:
//    id          – unique identifier (slug)
//    name        – display name shown on the card
//    description – short description (~1-2 sentences)
//    emoji       – icon shown on the card
//    tagline     – short stats line, e.g. "40 items · 7 features"
//    dataFile    – path to the dataset JS file (defines ITEMS, FEATURES, ICONS, etc.)
//    testFile    – path to the holdout test data JS file (defines TEST_ITEMS)
// ─────────────────────────────────────────────────
const DATASETS = [
  {
    id:          'fantasy',
    name:        'Fantasy Item Explorer',
    description: 'Explore magical weapons, potions, gems, and creatures — then train an AI to classify them!',
    emoji:       '⚔️',
    tagline:     '40 items · 7 features',
    dataFile:    'data.js',
    testFile:    'test_data.js',
  },

  // ── Add more datasets below ──
  // {
  //   id:          'animals',
  //   name:        'Animal Kingdom',
  //   description: 'Classify animals by habitat, diet, and more!',
  //   emoji:       '🦁',
  //   tagline:     '40 items · 6 features',
  //   dataFile:    'data_animals.js',
  //   testFile:    'test_data_animals.js',
  // },
];
