// ─────────────────────────────────────────────────
//  DATASET 2 — Character Alignment
//  Theme: Is this game character a Friend, Foe, or Neutral?
//  40 training entries (IDs 201–240)
//  5 features: type, disposition, strength, territory, speaks
// ─────────────────────────────────────────────────

const DATASET_META = {
  title:       "Character Alignment",
  subtitle:    "Data Makes AI — Middle School Edition",
  footer:      "Data Makes AI — Every character is defined by its features. That's how AI learns to tell them apart.",
  subtitleKey: "type",
};

// ─────────────────────────────────────────────────
//  FEATURE DEFINITIONS
// ─────────────────────────────────────────────────
const FEATURES = [
  {
    key: 'alignment',
    label: 'Alignment',
    type: 'enum',
    options: ['Friend', 'Foe', 'Neutral'],
    pillClasses: { Friend: 'pill-safe', Foe: 'pill-dangerous', Neutral: 'pill-moderate' },
    cardBorderColors: { Friend: '#4ade80', Foe: '#f87171', Neutral: '#94a3b8' },
    cardGlowColors: {
      Friend:  'rgba(74,222,128,0.18)',
      Foe:     'rgba(248,113,113,0.20)',
      Neutral: 'rgba(148,163,184,0.12)',
    },
    sortWeight: { Friend: 1, Neutral: 2, Foe: 3 },
  },
  {
    key: 'type',
    label: 'Type',
    type: 'enum',
    options: ['Human', 'Beast', 'Spirit', 'Undead', 'Elemental'],
  },
  {
    key: 'disposition',
    label: 'Disposition',
    type: 'enum',
    options: ['Calm', 'Aggressive', 'Wary', 'Curious', 'Menacing'],
    pillClasses: {
      Calm:       'pill-safe',
      Aggressive: 'pill-dangerous',
      Wary:       'pill-moderate',
      Curious:    'pill-uncommon',
      Menacing:   'pill-rare',
    },
  },
  {
    key: 'strength',
    label: 'Strength',
    type: 'enum',
    options: ['Weak', 'Average', 'Strong', 'Powerful'],
    pillClasses: {
      Weak: 'pill-common', Average: 'pill-uncommon',
      Strong: 'pill-rare', Powerful: 'pill-legendary',
    },
    sortWeight: { Weak: 1, Average: 2, Strong: 3, Powerful: 4 },
  },
  {
    key: 'territory',
    label: 'Territory',
    type: 'enum',
    options: ['Village', 'Dungeon', 'Forest', 'Ruins', 'Volcano'],
  },
  {
    key: 'speaks',
    label: 'Speaks',
    type: 'boolean',
    trueLabel:  '✓ Yes',
    falseLabel: '✗ No',
    trueClass:  'usable-yes',
    falseClass: 'usable-no',
  },
];

// ─────────────────────────────────────────────────
//  TRAINING ITEMS
// ─────────────────────────────────────────────────
const ITEMS = [
  // — Friends —
  { id: 201, name: "Village Elder",    type: "Human",     disposition: "Calm",       strength: "Weak",    territory: "Village", speaks: true,  alignment: "Friend"  },
  { id: 202, name: "Guard Captain",    type: "Human",     disposition: "Wary",       strength: "Strong",  territory: "Village", speaks: true,  alignment: "Friend"  },
  { id: 203, name: "Traveling Healer", type: "Human",     disposition: "Calm",       strength: "Weak",    territory: "Village", speaks: true,  alignment: "Friend"  },
  { id: 204, name: "Forest Ranger",    type: "Human",     disposition: "Wary",       strength: "Average", territory: "Forest",  speaks: true,  alignment: "Friend"  },
  { id: 205, name: "Young Knight",     type: "Human",     disposition: "Curious",    strength: "Strong",  territory: "Village", speaks: true,  alignment: "Friend"  },
  { id: 206, name: "River Spirit",     type: "Spirit",    disposition: "Calm",       strength: "Average", territory: "Forest",  speaks: true,  alignment: "Friend"  },
  { id: 207, name: "Fairy Guide",      type: "Spirit",    disposition: "Curious",    strength: "Weak",    territory: "Forest",  speaks: true,  alignment: "Friend"  },
  { id: 208, name: "Wise Owl",         type: "Beast",     disposition: "Calm",       strength: "Weak",    territory: "Forest",  speaks: false, alignment: "Friend"  },
  { id: 209, name: "Dwarf Smith",      type: "Human",     disposition: "Calm",       strength: "Strong",  territory: "Village", speaks: true,  alignment: "Friend"  },
  { id: 210, name: "Ghost Monk",       type: "Undead",    disposition: "Calm",       strength: "Average", territory: "Ruins",   speaks: true,  alignment: "Friend"  },
  { id: 211, name: "Snow Fox",         type: "Beast",     disposition: "Curious",    strength: "Weak",    territory: "Forest",  speaks: false, alignment: "Friend"  },
  { id: 212, name: "Light Elemental",  type: "Elemental", disposition: "Calm",       strength: "Strong",  territory: "Village", speaks: false, alignment: "Friend"  },
  { id: 213, name: "Village Merchant", type: "Human",     disposition: "Curious",    strength: "Weak",    territory: "Village", speaks: true,  alignment: "Friend"  },
  { id: 214, name: "Baby Dragon",      type: "Beast",     disposition: "Curious",    strength: "Average", territory: "Volcano", speaks: false, alignment: "Friend"  },
  // — Foes —
  { id: 215, name: "Dark Wraith",      type: "Undead",    disposition: "Aggressive", strength: "Strong",  territory: "Dungeon", speaks: false, alignment: "Foe"     },
  { id: 216, name: "Goblin Raider",    type: "Beast",     disposition: "Aggressive", strength: "Weak",    territory: "Dungeon", speaks: false, alignment: "Foe"     },
  { id: 217, name: "Orc Warlord",      type: "Human",     disposition: "Aggressive", strength: "Powerful",territory: "Dungeon", speaks: true,  alignment: "Foe"     },
  { id: 218, name: "Shadow Witch",     type: "Human",     disposition: "Menacing",   strength: "Strong",  territory: "Ruins",   speaks: true,  alignment: "Foe"     },
  { id: 219, name: "Lava Serpent",     type: "Beast",     disposition: "Aggressive", strength: "Strong",  territory: "Volcano", speaks: false, alignment: "Foe"     },
  { id: 220, name: "Bone Archer",      type: "Undead",    disposition: "Aggressive", strength: "Average", territory: "Ruins",   speaks: false, alignment: "Foe"     },
  { id: 221, name: "Cursed Knight",    type: "Undead",    disposition: "Menacing",   strength: "Strong",  territory: "Dungeon", speaks: true,  alignment: "Foe"     },
  { id: 222, name: "Fire Demon",       type: "Elemental", disposition: "Aggressive", strength: "Powerful",territory: "Volcano", speaks: false, alignment: "Foe"     },
  { id: 223, name: "Plague Rat",       type: "Beast",     disposition: "Aggressive", strength: "Weak",    territory: "Dungeon", speaks: false, alignment: "Foe"     },
  { id: 224, name: "Stone Golem",      type: "Elemental", disposition: "Aggressive", strength: "Powerful",territory: "Ruins",   speaks: false, alignment: "Foe"     },
  { id: 225, name: "Bandit Chief",     type: "Human",     disposition: "Menacing",   strength: "Strong",  territory: "Forest",  speaks: true,  alignment: "Foe"     },
  { id: 226, name: "Vengeful Spirit",  type: "Spirit",    disposition: "Menacing",   strength: "Average", territory: "Ruins",   speaks: false, alignment: "Foe"     },
  { id: 227, name: "Vampire Lord",     type: "Undead",    disposition: "Menacing",   strength: "Powerful",territory: "Dungeon", speaks: true,  alignment: "Foe"     },
  // — Neutral —
  { id: 228, name: "Wild Boar",        type: "Beast",     disposition: "Wary",       strength: "Average", territory: "Forest",  speaks: false, alignment: "Neutral" },
  { id: 229, name: "Cave Troll",       type: "Beast",     disposition: "Wary",       strength: "Strong",  territory: "Dungeon", speaks: false, alignment: "Neutral" },
  { id: 230, name: "Desert Nomad",     type: "Human",     disposition: "Wary",       strength: "Average", territory: "Ruins",   speaks: true,  alignment: "Neutral" },
  { id: 231, name: "Wandering Mage",   type: "Human",     disposition: "Curious",    strength: "Average", territory: "Forest",  speaks: true,  alignment: "Neutral" },
  { id: 232, name: "Mountain Goat",    type: "Beast",     disposition: "Wary",       strength: "Weak",    territory: "Forest",  speaks: false, alignment: "Neutral" },
  { id: 233, name: "Fog Elemental",    type: "Elemental", disposition: "Wary",       strength: "Average", territory: "Forest",  speaks: false, alignment: "Neutral" },
  { id: 234, name: "Ancient Statue",   type: "Elemental", disposition: "Calm",       strength: "Strong",  territory: "Ruins",   speaks: false, alignment: "Neutral" },
  { id: 235, name: "Lost Child",       type: "Human",     disposition: "Curious",    strength: "Weak",    territory: "Dungeon", speaks: true,  alignment: "Neutral" },
  { id: 236, name: "Sea Turtle",       type: "Beast",     disposition: "Calm",       strength: "Average", territory: "Forest",  speaks: false, alignment: "Neutral" },
  { id: 237, name: "Storm Hawk",       type: "Beast",     disposition: "Wary",       strength: "Average", territory: "Forest",  speaks: false, alignment: "Neutral" },
  { id: 238, name: "Ruin Guard",       type: "Undead",    disposition: "Wary",       strength: "Strong",  territory: "Ruins",   speaks: false, alignment: "Neutral" },
  { id: 239, name: "Sand Spirit",      type: "Spirit",    disposition: "Wary",       strength: "Average", territory: "Ruins",   speaks: false, alignment: "Neutral" },
  { id: 240, name: "Traveling Bard",   type: "Human",     disposition: "Curious",    strength: "Weak",    territory: "Village", speaks: true,  alignment: "Neutral" },
];

// ─────────────────────────────────────────────────
//  ITEM ICONS  (SVG strings keyed by item id)
// ─────────────────────────────────────────────────
const ICONS = {

  // 201 — Village Elder
  201: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g201r" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#c5cae9"/><stop offset="100%" stop-color="#7986cb"/>
    </linearGradient>
  </defs>
  <path d="M26,72 Q22,54 28,42 Q34,34 40,33 Q46,34 52,42 Q58,54 54,72 Z" fill="url(#g201r)" stroke="#5c6bc0" stroke-width="1"/>
  <circle cx="40" cy="24" r="12" fill="#ffe0b2" stroke="#ffb74d" stroke-width="1.2"/>
  <path d="M29,20 Q32,12 40,11 Q48,12 51,20" fill="white" opacity="0.9"/>
  <path d="M32,33 Q40,40 48,33 Q45,42 40,44 Q35,42 32,33 Z" fill="white" opacity="0.85"/>
  <circle cx="36" cy="23" r="1.8" fill="#5d4037"/><circle cx="44" cy="23" r="1.8" fill="#5d4037"/>
  <line x1="56" y1="14" x2="60" y2="72" stroke="#8d6e63" stroke-width="3" stroke-linecap="round"/>
  <circle cx="57" cy="14" r="4" fill="#ffd54f" stroke="#f9a825" stroke-width="1.2"/>
</svg>`,

  // 202 — Guard Captain
  202: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g202a" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#90caf9"/><stop offset="100%" stop-color="#1565c0"/>
    </linearGradient>
  </defs>
  <path d="M30,72 Q26,54 28,40 L52,40 Q54,54 50,72 Z" fill="url(#g202a)" stroke="#1565c0" stroke-width="1"/>
  <path d="M14,40 Q12,28 18,22 Q24,34 28,40 Z" fill="#42a5f5" stroke="#1976d2" stroke-width="1"/>
  <line x1="14" y1="30" x2="28" y2="34" stroke="#1565c0" stroke-width="1.2" opacity="0.6"/>
  <line x1="13" y1="36" x2="28" y2="38" stroke="#1565c0" stroke-width="1" opacity="0.5"/>
  <path d="M14,40 Q12,50 14,58 Q18,62 24,58 L28,54 Q20,50 14,40 Z" fill="#1e88e5"/>
  <path d="M26,10 Q32,6 40,8 Q48,6 54,10 L56,22 Q52,28 40,30 Q28,28 24,22 Z" fill="#546e7a" stroke="#37474f" stroke-width="1.2"/>
  <circle cx="40" cy="18" r="7" fill="#78909c" stroke="#455a64" stroke-width="1"/>
  <line x1="24" y1="18" x2="56" y2="18" stroke="#90a4ae" stroke-width="1.5" opacity="0.7"/>
  <line x1="58" y1="30" x2="62" y2="72" stroke="#78909c" stroke-width="3" stroke-linecap="round"/>
  <polygon points="58,30 55,22 62,24" fill="#ffd54f" stroke="#f9a825" stroke-width="0.8"/>
</svg>`,

  // 203 — Traveling Healer
  203: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g203r" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#b2dfdb"/>
    </linearGradient>
  </defs>
  <path d="M24,72 Q20,54 26,40 Q32,32 40,31 Q48,32 54,40 Q60,54 56,72 Z" fill="url(#g203r)" stroke="#80cbc4" stroke-width="1"/>
  <circle cx="40" cy="22" r="11" fill="#ffe0b2" stroke="#ffb74d" stroke-width="1.2"/>
  <circle cx="36" cy="21" r="1.6" fill="#5d4037"/><circle cx="44" cy="21" r="1.6" fill="#5d4037"/>
  <path d="M36,27 Q40,31 44,27" stroke="#a1887f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <rect x="34" y="44" width="12" height="4" rx="2" fill="#e53935" opacity="0.85"/>
  <rect x="38" y="40" width="4" height="12" rx="2" fill="#e53935" opacity="0.85"/>
  <circle cx="40" cy="46" r="7" fill="none" stroke="#ef9a9a" stroke-width="1" opacity="0.5"/>
</svg>`,

  // 204 — Forest Ranger
  204: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g204r" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#66bb6a"/><stop offset="100%" stop-color="#2e7d32"/>
    </linearGradient>
  </defs>
  <path d="M24,72 Q20,54 26,40 Q32,32 40,31 Q48,32 54,40 Q60,54 56,72 Z" fill="url(#g204r)" stroke="#1b5e20" stroke-width="1"/>
  <path d="M22,32 Q28,14 40,12 Q52,14 58,32 Q52,36 40,37 Q28,36 22,32 Z" fill="#388e3c" stroke="#1b5e20" stroke-width="1"/>
  <circle cx="40" cy="24" r="9" fill="#d7ccc8" stroke="#a1887f" stroke-width="1"/>
  <circle cx="36" cy="23" r="1.6" fill="#4e342e"/><circle cx="44" cy="23" r="1.6" fill="#4e342e"/>
  <line x1="62" y1="10" x2="68" y2="50" stroke="#795548" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="62" y1="10" x2="56" y2="36" stroke="#795548" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <line x1="66" y1="28" x2="56" y2="30" stroke="#bcaaa4" stroke-width="1.2" stroke-linecap="round"/>
</svg>`,

  // 205 — Young Knight
  205: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g205a" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#eceff1"/><stop offset="100%" stop-color="#78909c"/>
    </linearGradient>
  </defs>
  <path d="M28,72 Q24,54 28,40 L52,40 Q56,54 52,72 Z" fill="url(#g205a)" stroke="#546e7a" stroke-width="1"/>
  <path d="M24,40 Q20,34 22,26 Q26,18 30,18 L30,40 Z" fill="#90a4ae" stroke="#546e7a" stroke-width="0.8"/>
  <path d="M56,40 Q60,34 58,26 Q54,18 50,18 L50,40 Z" fill="#90a4ae" stroke="#546e7a" stroke-width="0.8"/>
  <path d="M24,16 Q28,8 40,7 Q52,8 56,16 L54,28 Q50,34 40,35 Q30,34 26,28 Z" fill="#607d8b" stroke="#37474f" stroke-width="1.2"/>
  <line x1="24" y1="20" x2="56" y2="20" stroke="#90a4ae" stroke-width="1.5" opacity="0.6"/>
  <rect x="38" y="16" width="4" height="12" rx="1" fill="#ffd54f" opacity="0.9"/>
  <line x1="62" y1="8" x2="58" y2="50" stroke="#90a4ae" stroke-width="2.5" stroke-linecap="round"/>
  <polygon points="62,8 58,12 65,14" fill="#eceff1" stroke="#78909c" stroke-width="0.8"/>
</svg>`,

  // 206 — River Spirit
  206: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g206r" cx="45%" cy="40%" r="55%">
      <stop offset="0%" stop-color="rgba(178,235,242,0.9)"/>
      <stop offset="60%" stop-color="rgba(0,188,212,0.7)"/>
      <stop offset="100%" stop-color="rgba(0,96,100,0.5)"/>
    </radialGradient>
  </defs>
  <path d="M40,8 Q58,20 62,38 Q64,54 54,64 Q46,72 40,72 Q34,72 26,64 Q16,54 18,38 Q22,20 40,8 Z" fill="url(#g206r)" stroke="rgba(0,188,212,0.6)" stroke-width="1.5"/>
  <path d="M28,32 Q34,26 40,32 Q46,26 52,32" stroke="rgba(255,255,255,0.6)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <path d="M26,44 Q33,38 40,44 Q47,38 54,44" stroke="rgba(255,255,255,0.5)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M28,56 Q34,50 40,56 Q46,50 52,56" stroke="rgba(255,255,255,0.4)" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <circle cx="34" cy="30" r="3" fill="rgba(255,255,255,0.4)"/>
  <circle cx="46" cy="26" r="2" fill="rgba(255,255,255,0.5)"/>
</svg>`,

  // 207 — Fairy Guide
  207: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g207g" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,253,231,0.8)"/>
      <stop offset="100%" stop-color="rgba(255,245,157,0)"/>
    </radialGradient>
  </defs>
  <circle cx="40" cy="40" r="22" fill="url(#g207g)"/>
  <path d="M20,30 Q10,20 16,36 Q22,44 32,38 Z" fill="rgba(225,245,254,0.8)" stroke="rgba(100,181,246,0.5)" stroke-width="1"/>
  <path d="M60,30 Q70,20 64,36 Q58,44 48,38 Z" fill="rgba(225,245,254,0.8)" stroke="rgba(100,181,246,0.5)" stroke-width="1"/>
  <path d="M22,54 Q14,48 18,62 Q24,68 36,58 Z" fill="rgba(225,245,254,0.7)" stroke="rgba(100,181,246,0.4)" stroke-width="1"/>
  <path d="M58,54 Q66,48 62,62 Q56,68 44,58 Z" fill="rgba(225,245,254,0.7)" stroke="rgba(100,181,246,0.4)" stroke-width="1"/>
  <ellipse cx="40" cy="44" rx="7" ry="9" fill="#fff9c4" stroke="#f9a825" stroke-width="1"/>
  <circle cx="40" cy="36" r="8" fill="#ffe0b2" stroke="#ffb74d" stroke-width="1"/>
  <circle cx="37" cy="35" r="1.4" fill="#5d4037"/><circle cx="43" cy="35" r="1.4" fill="#5d4037"/>
  <path d="M37,39 Q40,42 43,39" stroke="#a1887f" stroke-width="1" fill="none" stroke-linecap="round"/>
  <circle cx="22" cy="18" r="2" fill="#fff176" opacity="0.9"/>
  <circle cx="58" cy="22" r="1.5" fill="#fff176" opacity="0.8"/>
  <circle cx="14" cy="44" r="1.5" fill="#fff176" opacity="0.7"/>
  <circle cx="66" cy="46" r="1.8" fill="#fff176" opacity="0.8"/>
</svg>`,

  // 208 — Wise Owl
  208: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g208o" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#bcaaa4"/><stop offset="100%" stop-color="#5d4037"/>
    </radialGradient>
  </defs>
  <ellipse cx="40" cy="46" rx="22" ry="26" fill="url(#g208o)" stroke="#4e342e" stroke-width="1.2"/>
  <path d="M18,46 Q12,36 18,28 Q22,22 28,26 L28,46 Z" fill="#8d6e63" stroke="#4e342e" stroke-width="0.8"/>
  <path d="M62,46 Q68,36 62,28 Q58,22 52,26 L52,46 Z" fill="#8d6e63" stroke="#4e342e" stroke-width="0.8"/>
  <circle cx="40" cy="36" r="18" fill="#a1887f" stroke="#5d4037" stroke-width="1"/>
  <ellipse cx="33" cy="33" rx="8" ry="9" fill="#fff9c4" stroke="#f9a825" stroke-width="1"/>
  <ellipse cx="47" cy="33" rx="8" ry="9" fill="#fff9c4" stroke="#f9a825" stroke-width="1"/>
  <circle cx="33" cy="34" r="5" fill="#ff8f00"/><circle cx="47" cy="34" r="5" fill="#ff8f00"/>
  <circle cx="33" cy="34" r="3" fill="#1a1a1a"/><circle cx="47" cy="34" r="3" fill="#1a1a1a"/>
  <circle cx="32" cy="33" r="1" fill="white"/><circle cx="46" cy="33" r="1" fill="white"/>
  <path d="M36,42 L40,45 L44,42" fill="#ff8f00" stroke="#e65100" stroke-width="0.8"/>
  <path d="M26,26 L28,14 L34,22 Z" fill="#6d4c41"/><path d="M54,26 L52,14 L46,22 Z" fill="#6d4c41"/>
</svg>`,

  // 209 — Dwarf Smith
  209: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g209b" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8d6e63"/><stop offset="100%" stop-color="#4e342e"/>
    </linearGradient>
  </defs>
  <path d="M22,72 Q18,56 22,44 Q26,36 40,34 Q54,36 58,44 Q62,56 58,72 Z" fill="url(#g209b)" stroke="#3e2723" stroke-width="1"/>
  <path d="M28,56 Q26,48 28,44 Z" fill="none"/>
  <line x1="28" y1="44" x2="22" y2="56" stroke="#3e2723" stroke-width="1" opacity="0.4"/>
  <line x1="52" y1="44" x2="58" y2="56" stroke="#3e2723" stroke-width="1" opacity="0.4"/>
  <circle cx="40" cy="26" r="13" fill="#ffe0b2" stroke="#ffb74d" stroke-width="1.2"/>
  <path d="M28,20 Q32,10 40,9 Q48,10 52,20 Q44,26 40,26 Q36,26 28,20 Z" fill="#ff8f00" opacity="0.85"/>
  <path d="M30,32 Q40,42 50,32 Q46,44 40,46 Q34,44 30,32 Z" fill="#ff8f00" opacity="0.8"/>
  <circle cx="36" cy="25" r="1.8" fill="#4e342e"/><circle cx="44" cy="25" r="1.8" fill="#4e342e"/>
  <line x1="58" y1="34" x2="72" y2="28" stroke="#78909c" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="72" cy="26" rx="6" ry="4" fill="#90a4ae" stroke="#546e7a" stroke-width="1"/>
  <ellipse cx="72" cy="28" rx="3" ry="2" fill="#b0bec5"/>
</svg>`,

  // 210 — Ghost Monk
  210: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g210h" cx="50%" cy="30%" r="55%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.95)"/>
      <stop offset="70%" stop-color="rgba(200,230,255,0.75)"/>
      <stop offset="100%" stop-color="rgba(150,200,255,0)"/>
    </radialGradient>
  </defs>
  <ellipse cx="40" cy="60" rx="16" ry="4" fill="rgba(0,0,0,0.1)"/>
  <path d="M22,40 Q20,24 40,14 Q60,24 58,40 Q58,60 52,70 Q46,76 40,72 Q34,76 28,70 Q22,60 22,40 Z" fill="url(#g210h)" stroke="rgba(100,181,246,0.4)" stroke-width="1.5"/>
  <circle cx="40" cy="28" r="12" fill="rgba(255,255,255,0.9)" stroke="rgba(100,181,246,0.3)" stroke-width="1"/>
  <circle cx="36" cy="27" r="2.5" fill="rgba(100,181,246,0.7)"/>
  <circle cx="44" cy="27" r="2.5" fill="rgba(100,181,246,0.7)"/>
  <path d="M35,33 Q40,37 45,33" stroke="rgba(100,181,246,0.6)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <ellipse cx="40" cy="10" rx="10" ry="4" fill="rgba(255,245,157,0.5)" stroke="rgba(255,235,59,0.4)" stroke-width="1"/>
  <path d="M30,46 Q34,42 36,46 Q38,42 40,46 Q42,42 44,46 Q46,42 50,46" stroke="rgba(100,181,246,0.35)" stroke-width="1.5" fill="none"/>
</svg>`,

  // 211 — Snow Fox
  211: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g211f" cx="45%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#b3e5fc"/>
    </radialGradient>
  </defs>
  <path d="M14,62 Q22,44 30,40 Q24,36 22,28 Q28,26 32,32 Q36,28 40,27 Q44,28 48,32 Q52,26 58,28 Q56,36 50,40 Q58,44 66,62 Q54,68 40,68 Q26,68 14,62 Z" fill="url(#g211f)" stroke="#b3e5fc" stroke-width="1.2"/>
  <circle cx="40" cy="32" r="12" fill="white" stroke="#b3e5fc" stroke-width="1"/>
  <circle cx="36" cy="30" r="2.2" fill="#1a237e" opacity="0.8"/>
  <circle cx="44" cy="30" r="2.2" fill="#1a237e" opacity="0.8"/>
  <circle cx="36.8" cy="29.2" r="0.8" fill="white"/>
  <circle cx="44.8" cy="29.2" r="0.8" fill="white"/>
  <ellipse cx="40" cy="35" rx="2" ry="1.2" fill="#f48fb1"/>
  <path d="M37,37 Q40,40 43,37" stroke="#e0e0e0" stroke-width="1" fill="none" stroke-linecap="round"/>
  <path d="M22,28 L26,18 L30,28 Z" fill="white" stroke="#b3e5fc" stroke-width="0.8"/>
  <path d="M50,28 L54,18 L58,28 Z" fill="white" stroke="#b3e5fc" stroke-width="0.8"/>
  <path d="M52,60 Q60,52 70,58 Q64,68 52,66 Z" fill="white" stroke="#b3e5fc" stroke-width="1"/>
</svg>`,

  // 212 — Light Elemental
  212: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g212s" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="#fff9c4"/>
      <stop offset="100%" stop-color="rgba(255,236,64,0)"/>
    </radialGradient>
  </defs>
  <circle cx="40" cy="40" r="28" fill="url(#g212s)"/>
  <line x1="40" y1="8"  x2="40" y2="18" stroke="#ffd54f" stroke-width="3" stroke-linecap="round"/>
  <line x1="40" y1="62" x2="40" y2="72" stroke="#ffd54f" stroke-width="3" stroke-linecap="round"/>
  <line x1="8"  y1="40" x2="18" y2="40" stroke="#ffd54f" stroke-width="3" stroke-linecap="round"/>
  <line x1="62" y1="40" x2="72" y2="40" stroke="#ffd54f" stroke-width="3" stroke-linecap="round"/>
  <line x1="18" y1="18" x2="25" y2="25" stroke="#ffd54f" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="55" y1="55" x2="62" y2="62" stroke="#ffd54f" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="62" y1="18" x2="55" y2="25" stroke="#ffd54f" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="25" y1="55" x2="18" y2="62" stroke="#ffd54f" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="40" cy="40" r="14" fill="#fff9c4" stroke="#ffd54f" stroke-width="1.5"/>
  <circle cx="40" cy="40" r="8"  fill="white"/>
</svg>`,

  // 213 — Village Merchant
  213: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g213m" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffcc80"/><stop offset="100%" stop-color="#e65100"/>
    </linearGradient>
  </defs>
  <path d="M20,72 Q16,52 22,40 Q30,30 40,29 Q50,30 58,40 Q64,52 60,72 Z" fill="url(#g213m)" stroke="#bf360c" stroke-width="1"/>
  <circle cx="40" cy="22" r="12" fill="#ffe0b2" stroke="#ffb74d" stroke-width="1.2"/>
  <circle cx="36" cy="21" r="1.8" fill="#5d4037"/><circle cx="44" cy="21" r="1.8" fill="#5d4037"/>
  <path d="M36,28 Q40,33 44,28" stroke="#a1887f" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <circle cx="40" cy="20" r="3" fill="#bcaaa4"/>
  <path d="M54,44 Q62,40 64,52 Q60,58 54,54 Z" fill="#ffd54f" stroke="#f9a825" stroke-width="1"/>
  <circle cx="58" cy="46" r="3" fill="#ffb300" stroke="#f57f17" stroke-width="0.8"/>
  <circle cx="60" cy="51" r="2.5" fill="#ffb300" stroke="#f57f17" stroke-width="0.8"/>
  <circle cx="55" cy="52" r="2" fill="#ffb300" stroke="#f57f17" stroke-width="0.8"/>
</svg>`,

  // 214 — Baby Dragon
  214: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g214d" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a5d6a7"/><stop offset="100%" stop-color="#2e7d32"/>
    </linearGradient>
  </defs>
  <path d="M54,62 Q66,58 68,48 Q62,46 58,52 Z" fill="#66bb6a" stroke="#2e7d32" stroke-width="0.8"/>
  <path d="M26,62 Q14,58 12,48 Q18,46 22,52 Z" fill="#66bb6a" stroke="#2e7d32" stroke-width="0.8"/>
  <ellipse cx="40" cy="52" rx="20" ry="16" fill="url(#g214d)" stroke="#1b5e20" stroke-width="1.2"/>
  <circle cx="40" cy="34" r="16" fill="#81c784" stroke="#388e3c" stroke-width="1.2"/>
  <path d="M28,24 L30,12 L36,22 Z" fill="#66bb6a" stroke="#2e7d32" stroke-width="0.8"/>
  <path d="M44,22 L50,12 L52,24 Z" fill="#66bb6a" stroke="#2e7d32" stroke-width="0.8"/>
  <circle cx="35" cy="32" r="4" fill="#1a237e" opacity="0.8"/>
  <circle cx="45" cy="32" r="4" fill="#1a237e" opacity="0.8"/>
  <circle cx="36" cy="31" r="1.5" fill="white"/>
  <circle cx="46" cy="31" r="1.5" fill="white"/>
  <path d="M35,40 L40,44 L45,40" fill="#ff8f00" stroke="#e65100" stroke-width="0.8"/>
  <path d="M60,30 Q68,24 70,18 Q66,22 60,26 Z" fill="#ffd54f" opacity="0.8"/>
</svg>`,

  // 215 — Dark Wraith
  215: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g215w" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#37474f"/>
      <stop offset="70%" stop-color="#1a1a2e"/>
      <stop offset="100%" stop-color="rgba(10,10,20,0)"/>
    </radialGradient>
  </defs>
  <path d="M40,8 Q58,18 62,38 Q64,56 58,68 Q52,76 44,72 Q40,68 36,72 Q28,76 22,68 Q16,56 18,38 Q22,18 40,8 Z" fill="url(#g215w)"/>
  <path d="M22,68 Q18,72 14,70 Q18,64 22,68 Z" fill="#263238"/>
  <path d="M36,72 Q34,76 30,76 Q32,70 36,72 Z" fill="#263238"/>
  <path d="M44,72 Q46,76 50,76 Q48,70 44,72 Z" fill="#263238"/>
  <path d="M58,68 Q62,72 66,70 Q62,64 58,68 Z" fill="#263238"/>
  <ellipse cx="34" cy="34" rx="5" ry="4" fill="#b71c1c" opacity="0.9"/>
  <ellipse cx="46" cy="34" rx="5" ry="4" fill="#b71c1c" opacity="0.9"/>
  <circle cx="34" cy="34" r="2.5" fill="#ff1744"/>
  <circle cx="46" cy="34" r="2.5" fill="#ff1744"/>
  <path d="M28,50 Q34,44 40,50 Q46,44 52,50" stroke="rgba(183,28,28,0.4)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
</svg>`,

  // 216 — Goblin Raider
  216: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g216g" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#558b2f"/><stop offset="100%" stop-color="#33691e"/>
    </linearGradient>
  </defs>
  <path d="M26,72 Q20,58 24,46 Q28,36 40,34 Q52,36 56,46 Q60,58 54,72 Z" fill="url(#g216g)" stroke="#1b5e20" stroke-width="1"/>
  <circle cx="40" cy="28" r="14" fill="#689f38" stroke="#33691e" stroke-width="1.2"/>
  <path d="M28,20 L22,10 L30,18 Z" fill="#558b2f" stroke="#33691e" stroke-width="0.8"/>
  <path d="M52,20 L58,10 L50,18 Z" fill="#558b2f" stroke="#33691e" stroke-width="0.8"/>
  <ellipse cx="35" cy="26" rx="5" ry="4" fill="#f57f17" opacity="0.9"/>
  <ellipse cx="45" cy="26" rx="5" ry="4" fill="#f57f17" opacity="0.9"/>
  <circle cx="35" cy="27" r="2.5" fill="#1a1a1a"/>
  <circle cx="45" cy="27" r="2.5" fill="#1a1a1a"/>
  <path d="M34,36 L36,40 L38,36 L40,42 L42,36 L44,40 L46,36" stroke="#1b5e20" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <line x1="20" y1="48" x2="14" y2="36" stroke="#78909c" stroke-width="3" stroke-linecap="round"/>
  <polygon points="14,36 10,30 18,32" fill="#90a4ae" stroke="#546e7a" stroke-width="0.8"/>
</svg>`,

  // 217 — Orc Warlord
  217: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g217o" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#546e7a"/><stop offset="100%" stop-color="#263238"/>
    </linearGradient>
  </defs>
  <path d="M18,72 Q12,52 16,36 Q20,24 40,22 Q60,24 64,36 Q68,52 62,72 Z" fill="#4e342e" stroke="#3e2723" stroke-width="1"/>
  <path d="M18,72 Q12,52 16,36 L26,38 Q22,54 24,72 Z" fill="#37474f"/>
  <path d="M62,72 Q68,52 64,36 L54,38 Q58,54 56,72 Z" fill="#37474f"/>
  <path d="M14,36 Q16,18 28,12 L30,22 Q22,26 22,36 Z" fill="url(#g217o)" stroke="#263238" stroke-width="1"/>
  <path d="M66,36 Q64,18 52,12 L50,22 Q58,26 58,36 Z" fill="url(#g217o)" stroke="#263238" stroke-width="1"/>
  <path d="M16,14 Q20,6 28,12 L28,22 Q22,20 18,26 Z" fill="#546e7a" stroke="#263238" stroke-width="1"/>
  <path d="M64,14 Q60,6 52,12 L52,22 Q58,20 62,26 Z" fill="#546e7a" stroke="#263238" stroke-width="1"/>
  <circle cx="40" cy="30" r="16" fill="#558b2f" stroke="#33691e" stroke-width="1.2"/>
  <ellipse cx="34" cy="28" rx="5" ry="4.5" fill="#f57f17"/>
  <ellipse cx="46" cy="28" rx="5" ry="4.5" fill="#f57f17"/>
  <circle cx="34" cy="29" r="2.8" fill="#1a1a1a"/><circle cx="46" cy="29" r="2.8" fill="#1a1a1a"/>
  <path d="M34,14 L32,6 L38,14 Z" fill="#689f38"/>
  <path d="M46,14 L48,6 L42,14 Z" fill="#689f38"/>
  <path d="M34,38 L36,42 L40,38 L44,42 L46,38" fill="none" stroke="#33691e" stroke-width="1.5"/>
  <line x1="64" y1="30" x2="74" y2="16" stroke="#78909c" stroke-width="4" stroke-linecap="round"/>
  <path d="M70,12 Q76,8 78,14 Q76,20 70,18 Z" fill="#90a4ae" stroke="#546e7a" stroke-width="1"/>
</svg>`,

  // 218 — Shadow Witch
  218: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g218w" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4a148c"/><stop offset="100%" stop-color="#1a0030"/>
    </linearGradient>
  </defs>
  <path d="M22,72 Q18,54 24,40 Q30,30 40,28 Q50,30 56,40 Q62,54 58,72 Z" fill="url(#g218w)" stroke="#4a148c" stroke-width="1"/>
  <path d="M18,32 L40,6 L62,32 Q54,36 40,36 Q26,36 18,32 Z" fill="#1a0030" stroke="#4a148c" stroke-width="1"/>
  <path d="M26,32 L40,10 L54,32 Z" fill="#311b92" stroke="#4a148c" stroke-width="0.8"/>
  <circle cx="40" cy="36" r="10" fill="#512da8" stroke="#4a148c" stroke-width="1"/>
  <ellipse cx="35" cy="35" rx="3.5" ry="3" fill="#ce93d8"/>
  <ellipse cx="45" cy="35" rx="3.5" ry="3" fill="#ce93d8"/>
  <circle cx="35" cy="35.5" r="2" fill="#1a1a1a"/>
  <circle cx="45" cy="35.5" r="2" fill="#1a1a1a"/>
  <path d="M36,42 Q40,46 44,42" stroke="#ce93d8" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <line x1="60" y1="40" x2="70" y2="20" stroke="#4a148c" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="70" cy="19" r="4" fill="#ce93d8" stroke="#9c27b0" stroke-width="1"/>
  <circle cx="18" cy="52" r="2" fill="#ce93d8" opacity="0.7"/>
  <circle cx="22" cy="40" r="1.5" fill="#ce93d8" opacity="0.6"/>
  <circle cx="62" cy="56" r="1.5" fill="#ce93d8" opacity="0.6"/>
</svg>`,

  // 219 — Lava Serpent
  219: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g219s" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#d32f2f"/><stop offset="100%" stop-color="#4a0000"/>
    </linearGradient>
  </defs>
  <path d="M20,64 Q12,52 14,38 Q16,24 28,20 Q38,18 44,24 Q50,30 46,40 Q42,50 50,56 Q58,62 62,52 Q66,42 60,34" stroke="url(#g219s)" stroke-width="14" fill="none" stroke-linecap="round"/>
  <path d="M20,64 Q12,52 14,38 Q16,24 28,20 Q38,18 44,24 Q50,30 46,40 Q42,50 50,56 Q58,62 62,52 Q66,42 60,34" stroke="#ff5722" stroke-width="6" fill="none" stroke-linecap="round" opacity="0.5"/>
  <circle cx="60" cy="32" r="8" fill="#b71c1c" stroke="#7f0000" stroke-width="1.2"/>
  <circle cx="57" cy="30" r="3" fill="#ff8a65" opacity="0.9"/>
  <circle cx="63" cy="30" r="3" fill="#ff8a65" opacity="0.9"/>
  <circle cx="57" cy="30" r="1.5" fill="#1a1a1a"/>
  <circle cx="63" cy="30" r="1.5" fill="#1a1a1a"/>
  <path d="M56,38 L60,44 L64,38" fill="#ff5722" opacity="0.8"/>
  <circle cx="28" cy="52" r="3" fill="#ff8a65" opacity="0.6"/>
  <circle cx="42" cy="44" r="3" fill="#ff8a65" opacity="0.55"/>
  <circle cx="50" cy="28" r="2" fill="#ff8a65" opacity="0.5"/>
</svg>`,

  // 220 — Bone Archer
  220: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <path d="M28,72 Q24,56 28,44 L52,44 Q56,56 52,72 Z" fill="#e0e0e0" stroke="#bdbdbd" stroke-width="1"/>
  <line x1="34" y1="44" x2="34" y2="72" stroke="#9e9e9e" stroke-width="1" opacity="0.5"/>
  <line x1="40" y1="44" x2="40" y2="72" stroke="#9e9e9e" stroke-width="1" opacity="0.5"/>
  <line x1="46" y1="44" x2="46" y2="72" stroke="#9e9e9e" stroke-width="1" opacity="0.5"/>
  <circle cx="40" cy="30" r="14" fill="#eeeeee" stroke="#bdbdbd" stroke-width="1.2"/>
  <ellipse cx="35" cy="28" rx="4" ry="5" fill="#212121" opacity="0.85"/>
  <ellipse cx="45" cy="28" rx="4" ry="5" fill="#212121" opacity="0.85"/>
  <path d="M33,38 L35,36 L37,38 L40,36 L43,38 L45,36 L47,38" fill="none" stroke="#9e9e9e" stroke-width="1.5"/>
  <path d="M14,28 Q16,44 14,60" stroke="#8d6e63" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <line x1="14" y1="28" x2="14" y2="60" stroke="#a1887f" stroke-width="1" opacity="0.5"/>
  <line x1="14" y1="44" x2="36" y2="36" stroke="#bcaaa4" stroke-width="1.2" stroke-linecap="round"/>
  <polygon points="36,36 32,32 38,30" fill="#9e9e9e" stroke="#757575" stroke-width="0.8"/>
</svg>`,

  // 221 — Cursed Knight
  221: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g221k" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#37474f"/><stop offset="100%" stop-color="#0a0a0a"/>
    </linearGradient>
  </defs>
  <path d="M24,72 Q20,52 24,38 L56,38 Q60,52 56,72 Z" fill="url(#g221k)" stroke="#263238" stroke-width="1"/>
  <path d="M20,38 Q16,30 18,20 Q22,12 26,14 L28,38 Z" fill="#37474f" stroke="#263238" stroke-width="1"/>
  <path d="M60,38 Q64,30 62,20 Q58,12 54,14 L52,38 Z" fill="#37474f" stroke="#263238" stroke-width="1"/>
  <path d="M18,12 Q22,6 28,14 L28,24 Q22,22 20,28 Z" fill="#455a64"/>
  <path d="M62,12 Q58,6 52,14 L52,24 Q58,22 60,28 Z" fill="#455a64"/>
  <path d="M18,22 Q20,8 40,6 Q60,8 62,22 L58,34 Q54,40 40,42 Q26,40 22,34 Z" fill="#263238" stroke="#455a64" stroke-width="1.2"/>
  <ellipse cx="34" cy="24" rx="5" ry="4" fill="#7b1fa2" opacity="0.95"/>
  <ellipse cx="46" cy="24" rx="5" ry="4" fill="#7b1fa2" opacity="0.95"/>
  <ellipse cx="34" cy="24" rx="3" ry="2.5" fill="#e040fb"/>
  <ellipse cx="46" cy="24" rx="3" ry="2.5" fill="#e040fb"/>
  <line x1="32" y1="30" x2="35" y2="32" stroke="#7b1fa2" stroke-width="1" opacity="0.6"/>
  <line x1="45" y1="30" x2="48" y2="32" stroke="#7b1fa2" stroke-width="1" opacity="0.6"/>
  <line x1="36" y1="8"  x2="36" y2="16" stroke="#7b1fa2" stroke-width="1.5" opacity="0.7"/>
  <line x1="44" y1="8"  x2="44" y2="16" stroke="#7b1fa2" stroke-width="1.5" opacity="0.7"/>
</svg>`,

  // 222 — Fire Demon
  222: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g222f" cx="50%" cy="55%" r="50%">
      <stop offset="0%" stop-color="#ff6d00"/>
      <stop offset="60%" stop-color="#b71c1c"/>
      <stop offset="100%" stop-color="#1a0000"/>
    </radialGradient>
  </defs>
  <path d="M16,52 Q10,36 18,24 Q24,34 22,44 Z" fill="#b71c1c" stroke="#7f0000" stroke-width="0.8"/>
  <path d="M64,52 Q70,36 62,24 Q56,34 58,44 Z" fill="#b71c1c" stroke="#7f0000" stroke-width="0.8"/>
  <path d="M22,72 Q18,54 22,40 Q28,28 40,24 Q52,28 58,40 Q62,54 58,72 Z" fill="url(#g222f)" stroke="#7f0000" stroke-width="1"/>
  <path d="M30,24 Q28,14 34,8 Q34,18 38,20 Q36,12 42,6 Q42,16 46,18 Q44,10 50,8 Q48,18 46,24" fill="#ff9800" opacity="0.85" stroke="#ff6d00" stroke-width="0.8"/>
  <ellipse cx="34" cy="38" rx="5" ry="4.5" fill="#ff3d00" opacity="0.95"/>
  <ellipse cx="46" cy="38" rx="5" ry="4.5" fill="#ff3d00" opacity="0.95"/>
  <circle cx="34" cy="38.5" r="2.5" fill="#1a1a1a"/>
  <circle cx="46" cy="38.5" r="2.5" fill="#1a1a1a"/>
  <path d="M34,6 L30,0 L36,4 Z"  fill="#b71c1c"/>
  <path d="M46,6 L50,0 L44,4 Z"  fill="#b71c1c"/>
  <path d="M34,48 L36,54 L40,48 L44,54 L46,48" fill="none" stroke="#ff8a65" stroke-width="1.5"/>
</svg>`,

  // 223 — Plague Rat
  223: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g223r" cx="45%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#78909c"/><stop offset="100%" stop-color="#37474f"/>
    </radialGradient>
  </defs>
  <path d="M58,56 Q66,52 68,44 Q62,44 58,50 Z" fill="#78909c"/>
  <ellipse cx="40" cy="52" rx="22" ry="16" fill="url(#g223r)" stroke="#546e7a" stroke-width="1"/>
  <circle cx="28" cy="40" r="16" fill="#607d8b" stroke="#455a64" stroke-width="1.2"/>
  <path d="M20,30 L14,20 L22,28 Z" fill="#607d8b" stroke="#455a64" stroke-width="0.8"/>
  <path d="M36,30 L38,18 L42,28 Z" fill="#607d8b" stroke="#455a64" stroke-width="0.8"/>
  <circle cx="23" cy="38" r="4" fill="#f57f17" opacity="0.9"/>
  <circle cx="33" cy="38" r="4" fill="#f57f17" opacity="0.9"/>
  <circle cx="23" cy="38" r="2.2" fill="#1a1a1a"/><circle cx="33" cy="38" r="2.2" fill="#1a1a1a"/>
  <ellipse cx="28" cy="44" rx="4" ry="2" fill="#546e7a"/>
  <circle cx="46" cy="56" r="4" fill="#76ff03" opacity="0.5" stroke="#558b2f" stroke-width="0.8"/>
  <circle cx="54" cy="48" r="3" fill="#76ff03" opacity="0.45" stroke="#558b2f" stroke-width="0.8"/>
  <circle cx="38" cy="60" r="2.5" fill="#76ff03" opacity="0.4"/>
</svg>`,

  // 224 — Stone Golem
  224: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g224g" x1="10%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#90a4ae"/><stop offset="100%" stop-color="#37474f"/>
    </linearGradient>
  </defs>
  <rect x="20" y="40" width="40" height="32" rx="3" fill="url(#g224g)" stroke="#37474f" stroke-width="1.2"/>
  <rect x="10" y="46" width="14" height="22" rx="2" fill="#78909c" stroke="#455a64" stroke-width="1"/>
  <rect x="56" y="46" width="14" height="22" rx="2" fill="#78909c" stroke="#455a64" stroke-width="1"/>
  <rect x="24" y="14" width="32" height="28" rx="4" fill="url(#g224g)" stroke="#37474f" stroke-width="1.2"/>
  <ellipse cx="34" cy="26" rx="5" ry="4" fill="#212121" opacity="0.8"/>
  <ellipse cx="46" cy="26" rx="5" ry="4" fill="#212121" opacity="0.8"/>
  <line x1="26" y1="36" x2="54" y2="36" stroke="#263238" stroke-width="1.5" opacity="0.6"/>
  <path d="M28,20 Q30,16 34,18" stroke="#263238" stroke-width="1" fill="none" opacity="0.5"/>
  <path d="M42,22 Q46,18 50,20" stroke="#263238" stroke-width="1" fill="none" opacity="0.5"/>
  <line x1="32" y1="48" x2="48" y2="48" stroke="#546e7a" stroke-width="1" opacity="0.5"/>
  <line x1="30" y1="56" x2="50" y2="56" stroke="#546e7a" stroke-width="1" opacity="0.4"/>
  <line x1="32" y1="64" x2="48" y2="64" stroke="#546e7a" stroke-width="1" opacity="0.35"/>
</svg>`,

  // 225 — Bandit Chief
  225: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g225b" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#546e7a"/><stop offset="100%" stop-color="#1c2a30"/>
    </linearGradient>
  </defs>
  <path d="M26,72 Q22,54 26,42 Q30,32 40,30 Q50,32 54,42 Q58,54 54,72 Z" fill="url(#g225b)" stroke="#263238" stroke-width="1"/>
  <circle cx="40" cy="24" r="13" fill="#ffe0b2" stroke="#ffb74d" stroke-width="1.2"/>
  <rect x="28" y="20" width="24" height="10" rx="1" fill="#263238" opacity="0.9"/>
  <rect x="30" y="22" width="20" height="6" rx="1" fill="#37474f"/>
  <ellipse cx="35" cy="25" rx="3" ry="2.5" fill="#ff3d00" opacity="0.8"/>
  <ellipse cx="45" cy="25" rx="3" ry="2.5" fill="#ff3d00" opacity="0.8"/>
  <line x1="16" y1="44" x2="30" y2="56" stroke="#78909c" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="22" y1="38" x2="32" y2="52" stroke="#90a4ae" stroke-width="1.2" opacity="0.7"/>
  <line x1="64" y1="44" x2="50" y2="56" stroke="#78909c" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="58" y1="38" x2="48" y2="52" stroke="#90a4ae" stroke-width="1.2" opacity="0.7"/>
  <path d="M38,32 Q40,36 42,32" stroke="#a1887f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
</svg>`,

  // 226 — Vengeful Spirit
  226: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g226s" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="rgba(149,117,205,0.9)"/>
      <stop offset="55%" stop-color="rgba(74,20,140,0.75)"/>
      <stop offset="100%" stop-color="rgba(26,0,48,0)"/>
    </radialGradient>
  </defs>
  <path d="M40,10 Q62,18 66,40 Q68,58 58,68 Q50,76 40,72 Q30,76 22,68 Q12,58 14,40 Q18,18 40,10 Z" fill="url(#g226s)"/>
  <path d="M22,68 Q16,74 12,72 Q16,66 22,68 Z" fill="#4a148c"/>
  <path d="M58,68 Q64,74 68,72 Q64,66 58,68 Z" fill="#4a148c"/>
  <path d="M34,70 Q34,76 30,78 Q32,72 34,70 Z" fill="#4a148c"/>
  <path d="M46,70 Q46,76 50,78 Q48,72 46,70 Z" fill="#4a148c"/>
  <path d="M32,34 Q34,28 38,30 Q36,36 32,34 Z" fill="#ff3d00" opacity="0.9"/>
  <path d="M48,34 Q46,28 42,30 Q44,36 48,34 Z" fill="#ff3d00" opacity="0.9"/>
  <path d="M34,46 Q40,40 46,46 Q40,52 34,46 Z" fill="rgba(149,117,205,0.4)" stroke="#7b1fa2" stroke-width="1"/>
  <path d="M28,58 Q32,54 36,58 Q32,62 28,58 Z" fill="rgba(149,117,205,0.3)"/>
  <path d="M44,58 Q48,54 52,58 Q48,62 44,58 Z" fill="rgba(149,117,205,0.3)"/>
</svg>`,

  // 227 — Vampire Lord
  227: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g227v" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1a0010"/><stop offset="100%" stop-color="#0a0010"/>
    </linearGradient>
  </defs>
  <path d="M40,38 Q12,44 8,66 Q18,72 26,68 L30,66 Q20,60 22,52 Q28,40 40,38 Z" fill="url(#g227v)" stroke="#4a0020" stroke-width="1"/>
  <path d="M40,38 Q68,44 72,66 Q62,72 54,68 L50,66 Q60,60 58,52 Q52,40 40,38 Z" fill="url(#g227v)" stroke="#4a0020" stroke-width="1"/>
  <path d="M26,68 Q18,74 16,78 Q24,76 28,70 Z" fill="#1a0010"/>
  <path d="M54,68 Q62,74 64,78 Q56,76 52,70 Z" fill="#1a0010"/>
  <path d="M28,34 Q26,20 40,16 Q54,20 52,34 Q50,42 40,44 Q30,42 28,34 Z" fill="url(#g227v)" stroke="#4a0020" stroke-width="1"/>
  <circle cx="40" cy="28" r="10" fill="#c5b8c0" stroke="#9e9e9e" stroke-width="1"/>
  <circle cx="36" cy="26" r="2.5" fill="#7b1fa2" opacity="0.9"/>
  <circle cx="44" cy="26" r="2.5" fill="#7b1fa2" opacity="0.9"/>
  <path d="M36,33 L38,37 L40,33 L42,37 L44,33" fill="none" stroke="#9e9e9e" stroke-width="1.2"/>
  <path d="M34,14 L30,6 L36,12 Z" fill="#4a0020"/>
  <path d="M46,14 L50,6 L44,12 Z" fill="#4a0020"/>
</svg>`,

  // 228 — Wild Boar
  228: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g228b" cx="45%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#8d6e63"/><stop offset="100%" stop-color="#4e342e"/>
    </radialGradient>
  </defs>
  <path d="M56,58 Q64,54 66,46 Q60,46 56,52 Z" fill="#6d4c41"/>
  <ellipse cx="40" cy="50" rx="26" ry="18" fill="url(#g228b)" stroke="#4e342e" stroke-width="1.2"/>
  <circle cx="26" cy="40" r="18" fill="#795548" stroke="#4e342e" stroke-width="1.2"/>
  <ellipse cx="18" cy="42" rx="8" ry="6" fill="#6d4c41" stroke="#4e342e" stroke-width="0.8"/>
  <circle cx="22" cy="38" r="3.5" fill="#5d4037" opacity="0.8"/>
  <circle cx="30" cy="37" r="3.5" fill="#5d4037" opacity="0.8"/>
  <circle cx="22.8" cy="37" r="1.5" fill="#1a1a1a"/>
  <circle cx="30.8" cy="37" r="1.5" fill="#1a1a1a"/>
  <ellipse cx="18" cy="46" rx="4" ry="3" fill="#6d4c41"/>
  <path d="M14,44 L8,46 L10,52 Q14,54 16,50 Z" fill="#e0e0e0" stroke="#bdbdbd" stroke-width="0.8"/>
  <path d="M14,48 L8,52 L10,56 Q14,58 16,54 Z" fill="#e0e0e0" stroke="#bdbdbd" stroke-width="0.8"/>
  <path d="M56,52 Q62,48 68,52 Q66,58 60,60 Z" fill="#795548"/>
</svg>`,

  // 229 — Cave Troll
  229: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g229t" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#78909c"/><stop offset="100%" stop-color="#455a64"/>
    </linearGradient>
  </defs>
  <path d="M16,72 Q10,54 14,40 Q18,28 40,24 Q62,28 66,40 Q70,54 64,72 Z" fill="url(#g229t)" stroke="#37474f" stroke-width="1"/>
  <circle cx="40" cy="28" r="18" fill="#607d8b" stroke="#37474f" stroke-width="1.2"/>
  <path d="M30,14 L26,4 L34,12 Z" fill="#78909c" stroke="#37474f" stroke-width="0.8"/>
  <path d="M50,14 L54,4 L46,12 Z" fill="#78909c" stroke="#37474f" stroke-width="0.8"/>
  <ellipse cx="33" cy="26" rx="6" ry="5" fill="#37474f" opacity="0.85"/>
  <ellipse cx="47" cy="26" rx="6" ry="5" fill="#37474f" opacity="0.85"/>
  <circle cx="33" cy="27" r="3" fill="#ffee58" opacity="0.8"/>
  <circle cx="47" cy="27" r="3" fill="#ffee58" opacity="0.8"/>
  <circle cx="33" cy="27" r="1.5" fill="#1a1a1a"/>
  <circle cx="47" cy="27" r="1.5" fill="#1a1a1a"/>
  <path d="M34,36 L36,40 L38,36 L40,40 L42,36 L44,40 L46,36" fill="none" stroke="#37474f" stroke-width="1.5"/>
  <line x1="62" y1="44" x2="74" y2="30" stroke="#546e7a" stroke-width="5" stroke-linecap="round"/>
  <ellipse cx="74" cy="28" rx="5" ry="3.5" fill="#455a64" stroke="#37474f" stroke-width="1"/>
</svg>`,

  // 230 — Desert Nomad
  230: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g230n" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#d7ccc8"/><stop offset="100%" stop-color="#8d6e63"/>
    </linearGradient>
  </defs>
  <path d="M22,72 Q18,52 24,38 Q30,28 40,26 Q50,28 56,38 Q62,52 58,72 Z" fill="url(#g230n)" stroke="#795548" stroke-width="1"/>
  <circle cx="40" cy="24" r="14" fill="#d7ccc8" stroke="#bcaaa4" stroke-width="1.2"/>
  <path d="M26,20 Q28,8 40,7 Q52,8 54,20 Q50,28 40,30 Q30,28 26,20 Z" fill="#bcaaa4" stroke="#a1887f" stroke-width="1"/>
  <path d="M28,20 Q40,26 52,20" stroke="#8d6e63" stroke-width="1.2" fill="none" opacity="0.6"/>
  <ellipse cx="35" cy="22" rx="3" ry="2.5" fill="#5d4037" opacity="0.7"/>
  <ellipse cx="45" cy="22" rx="3" ry="2.5" fill="#5d4037" opacity="0.7"/>
  <path d="M35,28 Q40,32 45,28" stroke="#a1887f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <line x1="16" y1="40" x2="20" y2="72" stroke="#a1887f" stroke-width="2.5" stroke-linecap="round"/>
  <circle cx="16" cy="38" r="4" fill="#bcaaa4" stroke="#a1887f" stroke-width="1"/>
</svg>`,

  // 231 — Wandering Mage
  231: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g231m" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#90a4ae"/><stop offset="100%" stop-color="#455a64"/>
    </linearGradient>
  </defs>
  <path d="M24,72 Q20,54 26,40 Q32,30 40,28 Q48,30 54,40 Q60,54 56,72 Z" fill="url(#g231m)" stroke="#37474f" stroke-width="1"/>
  <circle cx="40" cy="22" r="11" fill="#ffe0b2" stroke="#ffb74d" stroke-width="1.2"/>
  <path d="M29,14 L40,2 L51,14 Q48,18 40,20 Q32,18 29,14 Z" fill="#546e7a" stroke="#37474f" stroke-width="1"/>
  <circle cx="36" cy="21" r="1.6" fill="#4e342e"/>
  <circle cx="44" cy="21" r="1.6" fill="#4e342e"/>
  <path d="M36,27 Q40,31 44,27" stroke="#a1887f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <line x1="60" y1="38" x2="66" y2="72" stroke="#607d8b" stroke-width="3" stroke-linecap="round"/>
  <circle cx="60" cy="36" r="6" fill="#80deea" stroke="#00bcd4" stroke-width="1.2"/>
  <circle cx="60" cy="36" r="3" fill="white" opacity="0.7"/>
  <circle cx="22" cy="50" r="2" fill="#80deea" opacity="0.6"/>
  <circle cx="18" cy="44" r="1.5" fill="#80deea" opacity="0.5"/>
</svg>`,

  // 232 — Mountain Goat
  232: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <path d="M56,60 Q64,58 66,50 Q60,50 56,56 Z" fill="#eceff1"/>
  <ellipse cx="40" cy="52" rx="22" ry="14" fill="#eceff1" stroke="#bdbdbd" stroke-width="1"/>
  <circle cx="30" cy="42" r="16" fill="#f5f5f5" stroke="#e0e0e0" stroke-width="1.2"/>
  <path d="M24,30 L18,16 L26,28 Z" fill="#e0e0e0" stroke="#bdbdbd" stroke-width="0.8"/>
  <path d="M36,28 L36,14 L40,26 Z" fill="#e0e0e0" stroke="#bdbdbd" stroke-width="0.8"/>
  <circle cx="25" cy="40" r="3.5" fill="#616161" opacity="0.8"/>
  <circle cx="35" cy="40" r="3.5" fill="#616161" opacity="0.8"/>
  <circle cx="25.8" cy="39" r="1.5" fill="#1a1a1a"/>
  <circle cx="35.8" cy="39" r="1.5" fill="#1a1a1a"/>
  <ellipse cx="30" cy="46" rx="4" ry="2.5" fill="#e0e0e0"/>
  <path d="M22,48 L18,54 L22,60 L26,54 Z" fill="#e0e0e0" stroke="#bdbdbd" stroke-width="0.8"/>
  <path d="M38,48 L34,54 L38,60 L42,54 Z" fill="#e0e0e0" stroke="#bdbdbd" stroke-width="0.8"/>
</svg>`,

  // 233 — Fog Elemental
  233: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g233f" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(176,190,197,0.8)"/>
      <stop offset="70%" stop-color="rgba(120,144,156,0.5)"/>
      <stop offset="100%" stop-color="rgba(69,90,100,0)"/>
    </radialGradient>
  </defs>
  <ellipse cx="40" cy="40" r="30" fill="url(#g233f)"/>
  <ellipse cx="28" cy="34" rx="16" ry="12" fill="rgba(176,190,197,0.6)"/>
  <ellipse cx="52" cy="38" rx="14" ry="10" fill="rgba(176,190,197,0.55)"/>
  <ellipse cx="36" cy="50" rx="18" ry="10" fill="rgba(176,190,197,0.5)"/>
  <ellipse cx="44" cy="26" rx="12" ry="8"  fill="rgba(176,190,197,0.45)"/>
  <ellipse cx="22" cy="48" rx="10" ry="7"  fill="rgba(176,190,197,0.4)"/>
  <ellipse cx="56" cy="52" rx="12" ry="8"  fill="rgba(176,190,197,0.4)"/>
  <circle cx="34" cy="36" r="3" fill="rgba(100,120,130,0.4)"/>
  <circle cx="46" cy="36" r="3" fill="rgba(100,120,130,0.4)"/>
  <path d="M34,44 Q40,48 46,44" stroke="rgba(100,120,130,0.35)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
</svg>`,

  // 234 — Ancient Statue
  234: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g234s" x1="10%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#90a4ae"/><stop offset="100%" stop-color="#37474f"/>
    </linearGradient>
  </defs>
  <rect x="28" y="62" width="24" height="10" rx="2" fill="#546e7a" stroke="#37474f" stroke-width="1"/>
  <rect x="32" y="58" width="16" height="6"  rx="1" fill="#607d8b" stroke="#37474f" stroke-width="0.8"/>
  <path d="M28,18 Q32,10 40,8 Q48,10 52,18 L54,58 Q48,62 40,62 Q32,62 26,58 Z" fill="url(#g234s)" stroke="#37474f" stroke-width="1.2"/>
  <path d="M28,18 L26,58" stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
  <ellipse cx="34" cy="30" rx="5" ry="4" fill="#37474f" opacity="0.7"/>
  <ellipse cx="46" cy="30" rx="5" ry="4" fill="#37474f" opacity="0.7"/>
  <path d="M34,40 Q40,44 46,40" stroke="#37474f" stroke-width="1.5" fill="none" opacity="0.6" stroke-linecap="round"/>
  <line x1="30" y1="48" x2="50" y2="46" stroke="#37474f" stroke-width="1" opacity="0.4"/>
  <ellipse cx="32" cy="20" rx="7" ry="4" fill="rgba(255,255,255,0.12)" transform="rotate(-20,32,20)"/>
</svg>`,

  // 235 — Lost Child
  235: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g235c" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ef9a9a"/><stop offset="100%" stop-color="#e57373"/>
    </linearGradient>
  </defs>
  <path d="M28,72 Q24,60 28,50 L52,50 Q56,60 52,72 Z" fill="url(#g235c)" stroke="#e57373" stroke-width="1"/>
  <line x1="28" y1="50" x2="16" y2="40" stroke="#ef9a9a" stroke-width="4" stroke-linecap="round"/>
  <line x1="52" y1="50" x2="64" y2="40" stroke="#ef9a9a" stroke-width="4" stroke-linecap="round"/>
  <circle cx="40" cy="38" r="12" fill="#ffe0b2" stroke="#ffb74d" stroke-width="1.2"/>
  <circle cx="36" cy="37" r="2" fill="#5d4037"/>
  <circle cx="44" cy="37" r="2" fill="#5d4037"/>
  <circle cx="36.6" cy="36.4" r="0.8" fill="white"/>
  <circle cx="44.6" cy="36.4" r="0.8" fill="white"/>
  <path d="M36,43 Q40,40 44,43" stroke="#e57373" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <line x1="28" y1="72" x2="24" y2="72" stroke="#e57373" stroke-width="3" stroke-linecap="round"/>
  <line x1="52" y1="72" x2="56" y2="72" stroke="#e57373" stroke-width="3" stroke-linecap="round"/>
</svg>`,

  // 236 — Sea Turtle
  236: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g236t" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#80cbc4"/><stop offset="100%" stop-color="#00695c"/>
    </radialGradient>
  </defs>
  <ellipse cx="24" cy="40" rx="10" ry="6" fill="#4db6ac" stroke="#00695c" stroke-width="0.8" transform="rotate(-20,24,40)"/>
  <ellipse cx="56" cy="40" rx="10" ry="6" fill="#4db6ac" stroke="#00695c" stroke-width="0.8" transform="rotate(20,56,40)"/>
  <ellipse cx="30" cy="60" rx="8" ry="5" fill="#4db6ac" stroke="#00695c" stroke-width="0.8" transform="rotate(20,30,60)"/>
  <ellipse cx="50" cy="60" rx="8" ry="5" fill="#4db6ac" stroke="#00695c" stroke-width="0.8" transform="rotate(-20,50,60)"/>
  <ellipse cx="40" cy="44" rx="22" ry="18" fill="url(#g236t)" stroke="#00695c" stroke-width="1.5"/>
  <ellipse cx="40" cy="44" rx="16" ry="12" fill="none" stroke="#00897b" stroke-width="1" opacity="0.6"/>
  <line x1="40" y1="32" x2="40" y2="56" stroke="#00897b" stroke-width="1" opacity="0.5"/>
  <line x1="28" y1="38" x2="52" y2="38" stroke="#00897b" stroke-width="1" opacity="0.5"/>
  <line x1="30" y1="33" x2="50" y2="55" stroke="#00897b" stroke-width="0.8" opacity="0.4"/>
  <line x1="50" y1="33" x2="30" y2="55" stroke="#00897b" stroke-width="0.8" opacity="0.4"/>
  <ellipse cx="40" cy="26" rx="7" ry="5" fill="#4db6ac" stroke="#00695c" stroke-width="0.8"/>
  <circle cx="38" cy="25" r="1.5" fill="#1a1a1a"/>
  <circle cx="42" cy="25" r="1.5" fill="#1a1a1a"/>
</svg>`,

  // 237 — Storm Hawk
  237: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g237h" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#90a4ae"/><stop offset="100%" stop-color="#546e7a"/>
    </linearGradient>
  </defs>
  <path d="M8,38 Q18,28 28,34 Q34,36 40,32 Q46,36 52,34 Q62,28 72,38 Q66,50 58,48 L40,58 L22,48 Q14,50 8,38 Z" fill="url(#g237h)" stroke="#455a64" stroke-width="1.2"/>
  <path d="M8,38  Q18,28 28,34 Q34,36 40,32" fill="rgba(255,255,255,0.1)"/>
  <circle cx="40" cy="32" r="8" fill="#607d8b" stroke="#455a64" stroke-width="1"/>
  <circle cx="37" cy="30" r="2.2" fill="#1a1a1a"/>
  <circle cx="43" cy="30" r="2.2" fill="#1a1a1a"/>
  <circle cx="37.6" cy="29.4" r="0.8" fill="white"/>
  <circle cx="43.6" cy="29.4" r="0.8" fill="white"/>
  <path d="M36,37 L40,42 L44,37" fill="#f57f17" stroke="#e65100" stroke-width="0.8"/>
  <line x1="30" y1="50" x2="26" y2="60" stroke="#546e7a" stroke-width="2" stroke-linecap="round"/>
  <line x1="50" y1="50" x2="54" y2="60" stroke="#546e7a" stroke-width="2" stroke-linecap="round"/>
  <path d="M26,60 L22,62 L26,64 L24,66" stroke="#546e7a" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M54,60 L58,62 L54,64 L56,66" stroke="#546e7a" stroke-width="1.5" fill="none" stroke-linecap="round"/>
</svg>`,

  // 238 — Ruin Guard
  238: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g238g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#78909c"/><stop offset="100%" stop-color="#263238"/>
    </linearGradient>
  </defs>
  <path d="M30,72 Q26,54 28,40 L52,40 Q54,54 50,72 Z" fill="url(#g238g)" stroke="#263238" stroke-width="1"/>
  <line x1="36" y1="40" x2="36" y2="72" stroke="#37474f" stroke-width="1" opacity="0.4"/>
  <line x1="44" y1="40" x2="44" y2="72" stroke="#37474f" stroke-width="1" opacity="0.4"/>
  <path d="M24,40 Q20,32 22,22 Q26,14 30,14 L32,40 Z" fill="#546e7a" stroke="#263238" stroke-width="1"/>
  <path d="M56,40 Q60,32 58,22 Q54,14 50,14 L48,40 Z" fill="#546e7a" stroke="#263238" stroke-width="1"/>
  <path d="M20,12 Q24,6 30,14 L32,24 Q26,22 24,28 Z" fill="#607d8b"/>
  <path d="M60,12 Q56,6 50,14 L48,24 Q54,22 56,28 Z" fill="#607d8b"/>
  <path d="M20,20 Q22,8 40,6 Q58,8 60,20 L58,34 Q54,42 40,44 Q26,42 22,34 Z" fill="#455a64" stroke="#37474f" stroke-width="1.2"/>
  <ellipse cx="34" cy="24" rx="5" ry="4.5" fill="#212121" opacity="0.9"/>
  <ellipse cx="46" cy="24" rx="5" ry="4.5" fill="#212121" opacity="0.9"/>
  <ellipse cx="34" cy="24.5" rx="2.5" ry="2" fill="#607d8b" opacity="0.7"/>
  <ellipse cx="46" cy="24.5" rx="2.5" ry="2" fill="#607d8b" opacity="0.7"/>
  <path d="M34,34 L36,36 L40,34 L44,36 L46,34" fill="none" stroke="#37474f" stroke-width="1.2"/>
</svg>`,

  // 239 — Sand Spirit
  239: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g239s" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="rgba(255,224,130,0.85)"/>
      <stop offset="60%" stop-color="rgba(188,143,61,0.6)"/>
      <stop offset="100%" stop-color="rgba(141,110,99,0)"/>
    </radialGradient>
  </defs>
  <path d="M40,10 Q60,18 64,38 Q66,56 56,66 Q48,74 40,72 Q32,74 24,66 Q14,56 16,38 Q20,18 40,10 Z" fill="url(#g239s)"/>
  <path d="M28,60 Q22,66 18,64 Q22,58 28,60 Z" fill="#bc8f3d" opacity="0.7"/>
  <path d="M52,60 Q58,66 62,64 Q58,58 52,60 Z" fill="#bc8f3d" opacity="0.7"/>
  <path d="M34,70 Q32,76 28,76 Q30,70 34,70 Z" fill="#bc8f3d" opacity="0.6"/>
  <path d="M46,70 Q48,76 52,76 Q50,70 46,70 Z" fill="#bc8f3d" opacity="0.6"/>
  <path d="M30,28 Q36,24 40,28 Q44,24 50,28 Q44,34 40,30 Q36,34 30,28 Z" fill="rgba(188,143,61,0.5)"/>
  <circle cx="34" cy="38" r="3.5" fill="rgba(141,110,99,0.5)"/>
  <circle cx="46" cy="38" r="3.5" fill="rgba(141,110,99,0.5)"/>
  <path d="M34,48 Q40,52 46,48" stroke="rgba(141,110,99,0.45)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <circle cx="22" cy="34" r="2" fill="#ffcc80" opacity="0.6"/>
  <circle cx="58" cy="36" r="1.5" fill="#ffcc80" opacity="0.5"/>
  <circle cx="30" cy="20" r="1.5" fill="#ffcc80" opacity="0.5"/>
</svg>`,

  // 240 — Traveling Bard
  240: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g240b" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f48fb1"/><stop offset="100%" stop-color="#ad1457"/>
    </linearGradient>
  </defs>
  <path d="M26,72 Q22,54 26,42 Q32,32 40,30 Q48,32 54,42 Q58,54 54,72 Z" fill="url(#g240b)" stroke="#880e4f" stroke-width="1"/>
  <circle cx="40" cy="22" r="11" fill="#ffe0b2" stroke="#ffb74d" stroke-width="1.2"/>
  <circle cx="36" cy="21" r="1.7" fill="#4e342e"/>
  <circle cx="44" cy="21" r="1.7" fill="#4e342e"/>
  <path d="M36,27 Q40,31 44,27" stroke="#a1887f" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <path d="M29,14 Q32,8 40,7 Q48,8 51,14" fill="none" stroke="#f06292" stroke-width="2" stroke-linecap="round"/>
  <path d="M52,36 Q62,30 66,38 Q64,48 56,50 Q50,50 48,44 Z" fill="#ffe0b2" stroke="#ffb74d" stroke-width="1"/>
  <ellipse cx="58" cy="42" rx="6" ry="9" fill="#795548" stroke="#5d4037" stroke-width="1" transform="rotate(-20,58,42)"/>
  <ellipse cx="58" cy="42" rx="3" ry="5" fill="#a1887f" transform="rotate(-20,58,42)"/>
  <line x1="52" y1="36" x2="66" y2="48" stroke="#5d4037" stroke-width="1" opacity="0.5"/>
  <circle cx="28" cy="50" r="2.5" fill="#ffd54f" opacity="0.8"/>
  <circle cx="24" cy="42" r="2"   fill="#ffd54f" opacity="0.7"/>
  <circle cx="20" cy="54" r="1.5" fill="#ffd54f" opacity="0.65"/>
</svg>`,

};
