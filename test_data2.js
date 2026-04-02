// ─────────────────────────────────────────────────
//  TEST DATA — Dataset 2 "Character Alignment"
//  10 unseen items for evaluating the decision tree.
//  Same schema as ITEMS in data2.js. IDs start at 301
//  to avoid collisions with training data.
// ─────────────────────────────────────────────────

const TEST_ITEMS = [
  { id: 301, name: "Village Priest",   type: "Human",     disposition: "Calm",       strength: "Weak",    territory: "Village", speaks: true, alignment: "Friend"  },
  { id: 302, name: "Skeletal Warrior", type: "Undead",    disposition: "Curious", strength: "Average", territory: "Dungeon", speaks: false, alignment: "Foe"  },
  { id: 303, name: "Baby Slime",       type: "Beast",     disposition: "Curious",    strength: "Weak",    territory: "Dungeon", speaks: false, alignment: "Friend"  },
  { id: 304, name: "Thunder Bird",     type: "Beast",     disposition: "Aggressive", strength: "Strong",  territory: "Forest",  speaks: false, alignment: "Friend"  },
  { id: 305, name: "Magma Crab",       type: "Beast",     disposition: "Menacing",   strength: "Average", territory: "Volcano", speaks: false, alignment: "Neutral"  },
  { id: 306, name: "Ruins Scholar",    type: "Human",     disposition: "Curious",    strength: "Average", territory: "Ruins",   speaks: true, alignment: "Neutral"   },
  { id: 307, name: "Wind Elemental",   type: "Elemental", disposition: "Wary",       strength: "Strong",  territory: "Forest",  speaks: false, alignment: "Foe"  },
  { id: 308, name: "Spirit Dancer",    type: "Spirit",    disposition: "Calm",       strength: "Average", territory: "Village", speaks: true, alignment: "Neutral"   },
  { id: 309, name: "Forest Witch",     type: "Human",     disposition: "Wary",       strength: "Average", territory: "Forest",  speaks: true, alignment: "Foe"   },
  { id: 310, name: "Plague Zombie",    type: "Undead",    disposition: "Aggressive", strength: "Weak",    territory: "Dungeon", speaks: false, alignment: "Foe"  },
];

const TEST_ICONS = {

  // 301 — Village Priest
  301: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g301p" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff"/><stop offset="100%" stop-color="#e3f2fd"/>
    </linearGradient>
  </defs>
  <path d="M24,72 Q20,54 26,40 Q32,30 40,28 Q48,30 54,40 Q60,54 56,72 Z" fill="url(#g301p)" stroke="#90caf9" stroke-width="1"/>
  <circle cx="40" cy="22" r="11" fill="#ffe0b2" stroke="#ffb74d" stroke-width="1.2"/>
  <circle cx="36" cy="21" r="1.7" fill="#5d4037"/>
  <circle cx="44" cy="21" r="1.7" fill="#5d4037"/>
  <path d="M36,27 Q40,31 44,27" stroke="#a1887f" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <rect x="36" y="36" width="8" height="3" rx="1.5" fill="#e53935" opacity="0.9"/>
  <rect x="38.5" y="33" width="3" height="9" rx="1.5" fill="#e53935" opacity="0.9"/>
  <path d="M28,10 Q32,6 40,6 Q48,6 52,10" fill="none" stroke="#90caf9" stroke-width="2" stroke-linecap="round"/>
  <circle cx="16" cy="52" r="5" fill="#ffd54f" stroke="#f9a825" stroke-width="1" opacity="0.85"/>
  <line x1="16" y1="44" x2="16" y2="60" stroke="#ffd54f" stroke-width="2" opacity="0.6"/>
  <line x1="8"  y1="52" x2="24" y2="52" stroke="#ffd54f" stroke-width="2" opacity="0.6"/>
</svg>`,

  // 302 — Skeletal Warrior
  302: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <path d="M28,72 Q24,54 28,40 L52,40 Q56,54 52,72 Z" fill="#e0e0e0" stroke="#bdbdbd" stroke-width="1"/>
  <line x1="34" y1="40" x2="34" y2="72" stroke="#9e9e9e" stroke-width="1" opacity="0.5"/>
  <line x1="46" y1="40" x2="46" y2="72" stroke="#9e9e9e" stroke-width="1" opacity="0.5"/>
  <line x1="28" y1="56" x2="52" y2="56" stroke="#bdbdbd" stroke-width="1" opacity="0.5"/>
  <path d="M24,40 Q18,32 20,22 Q24,14 28,14 L30,40 Z" fill="#eeeeee" stroke="#bdbdbd" stroke-width="1"/>
  <path d="M56,40 Q62,32 60,22 Q56,14 52,14 L50,40 Z" fill="#eeeeee" stroke="#bdbdbd" stroke-width="1"/>
  <circle cx="40" cy="26" r="14" fill="#f5f5f5" stroke="#bdbdbd" stroke-width="1.2"/>
  <ellipse cx="34" cy="23" rx="5" ry="6" fill="#212121" opacity="0.85"/>
  <ellipse cx="46" cy="23" rx="5" ry="6" fill="#212121" opacity="0.85"/>
  <path d="M34,34 L36,36 L38,34 L40,38 L42,34 L44,36 L46,34" fill="none" stroke="#9e9e9e" stroke-width="1.5"/>
  <line x1="62" y1="16" x2="58" y2="60" stroke="#90a4ae" stroke-width="3" stroke-linecap="round"/>
  <polygon points="62,16 58,20 66,20" fill="#90a4ae" stroke="#546e7a" stroke-width="0.8"/>
</svg>`,

  // 303 — Baby Slime
  303: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g303s" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="rgba(178,255,89,0.9)"/>
      <stop offset="60%" stop-color="rgba(100,221,23,0.85)"/>
      <stop offset="100%" stop-color="rgba(51,105,30,0.8)"/>
    </radialGradient>
  </defs>
  <ellipse cx="40" cy="66" rx="20" ry="6" fill="rgba(0,0,0,0.12)"/>
  <path d="M16,50 Q14,34 22,24 Q30,14 40,14 Q50,14 58,24 Q66,34 64,50 Q62,62 54,66 Q46,70 40,68 Q34,70 26,66 Q18,62 16,50 Z" fill="url(#g303s)" stroke="#558b2f" stroke-width="1.2"/>
  <path d="M28,18 Q24,10 28,14 Z" fill="#76ff03" opacity="0.7"/>
  <path d="M40,14 Q40,6 42,12 Z" fill="#76ff03" opacity="0.65"/>
  <path d="M52,18 Q56,10 52,14 Z" fill="#76ff03" opacity="0.7"/>
  <circle cx="34" cy="42" r="6" fill="rgba(0,60,0,0.5)"/>
  <circle cx="46" cy="42" r="6" fill="rgba(0,60,0,0.5)"/>
  <circle cx="35" cy="41" r="2.5" fill="white" opacity="0.5"/>
  <circle cx="47" cy="41" r="2.5" fill="white" opacity="0.5"/>
  <path d="M34,54 Q40,58 46,54" stroke="rgba(0,60,0,0.4)" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse cx="28" cy="28" rx="8" ry="5" fill="rgba(255,255,255,0.2)" transform="rotate(-22,28,28)"/>
</svg>`,

  // 304 — Thunder Bird
  304: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g304b" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#546e7a"/><stop offset="100%" stop-color="#1c313a"/>
    </linearGradient>
  </defs>
  <path d="M6,44 Q14,26 28,28 Q34,30 40,26 Q46,30 52,28 Q66,26 74,44 Q64,58 52,52 L40,66 L28,52 Q16,58 6,44 Z" fill="url(#g304b)" stroke="#263238" stroke-width="1.2"/>
  <ellipse cx="26" cy="38" rx="12" ry="6" fill="#ffd54f" opacity="0.3" transform="rotate(-10,26,38)"/>
  <ellipse cx="54" cy="38" rx="12" ry="6" fill="#ffd54f" opacity="0.3" transform="rotate(10,54,38)"/>
  <circle cx="40" cy="28" r="10" fill="#455a64" stroke="#263238" stroke-width="1"/>
  <circle cx="36" cy="26" r="2.5" fill="#fff176" opacity="0.9"/>
  <circle cx="44" cy="26" r="2.5" fill="#fff176" opacity="0.9"/>
  <circle cx="36.5" cy="25.5" r="1" fill="#1a1a1a"/>
  <circle cx="44.5" cy="25.5" r="1" fill="#1a1a1a"/>
  <path d="M36,34 L40,38 L44,34" fill="#f9a825" stroke="#e65100" stroke-width="0.8"/>
  <polygon points="46,18 42,8 44,18 40,10 42,20 38,12 40,22" fill="#ffd54f" opacity="0.85"/>
  <line x1="28" y1="54" x2="22" y2="66" stroke="#37474f" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="52" y1="54" x2="58" y2="66" stroke="#37474f" stroke-width="2.5" stroke-linecap="round"/>
</svg>`,

  // 305 — Magma Crab
  305: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g305c" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="#ff8a65"/><stop offset="100%" stop-color="#4a0000"/>
    </radialGradient>
  </defs>
  <line x1="16" y1="36" x2="8"  y2="26" stroke="#bf360c" stroke-width="3" stroke-linecap="round"/>
  <line x1="18" y1="42" x2="8"  y2="38" stroke="#bf360c" stroke-width="3" stroke-linecap="round"/>
  <line x1="20" y1="50" x2="10" y2="52" stroke="#bf360c" stroke-width="3" stroke-linecap="round"/>
  <line x1="64" y1="36" x2="72" y2="26" stroke="#bf360c" stroke-width="3" stroke-linecap="round"/>
  <line x1="62" y1="42" x2="72" y2="38" stroke="#bf360c" stroke-width="3" stroke-linecap="round"/>
  <line x1="60" y1="50" x2="70" y2="52" stroke="#bf360c" stroke-width="3" stroke-linecap="round"/>
  <ellipse cx="40" cy="48" rx="26" ry="18" fill="url(#g305c)" stroke="#7f0000" stroke-width="1.5"/>
  <line x1="16" y1="48" x2="64" y2="48" stroke="#7f0000" stroke-width="1" opacity="0.5"/>
  <line x1="18" y1="38" x2="62" y2="38" stroke="#7f0000" stroke-width="1" opacity="0.4"/>
  <path d="M28,32 Q18,24 14,18 Q20,22 24,28 Z" fill="#d84315" stroke="#bf360c" stroke-width="1"/>
  <path d="M52,32 Q62,24 66,18 Q60,22 56,28 Z" fill="#d84315" stroke="#bf360c" stroke-width="1"/>
  <ellipse cx="34" cy="42" rx="5" ry="4" fill="#ff3d00" opacity="0.9"/>
  <ellipse cx="46" cy="42" rx="5" ry="4" fill="#ff3d00" opacity="0.9"/>
  <circle cx="34" cy="42.5" r="2.5" fill="#1a1a1a"/>
  <circle cx="46" cy="42.5" r="2.5" fill="#1a1a1a"/>
  <ellipse cx="40" cy="56" rx="12" ry="5" fill="#ff8a65" opacity="0.3"/>
</svg>`,

  // 306 — Ruins Scholar
  306: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g306s" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#bcaaa4"/><stop offset="100%" stop-color="#6d4c41"/>
    </linearGradient>
  </defs>
  <path d="M24,72 Q20,54 26,40 Q32,30 40,28 Q48,30 54,40 Q60,54 56,72 Z" fill="url(#g306s)" stroke="#5d4037" stroke-width="1"/>
  <circle cx="40" cy="22" r="11" fill="#ffe0b2" stroke="#ffb74d" stroke-width="1.2"/>
  <path d="M30,16 Q32,10 40,9 Q48,10 50,16" fill="#8d6e63" stroke="#6d4c41" stroke-width="0.8"/>
  <circle cx="36" cy="22" r="4" fill="none" stroke="#78909c" stroke-width="1.5"/>
  <circle cx="44" cy="22" r="4" fill="none" stroke="#78909c" stroke-width="1.5"/>
  <line x1="40" y1="22" x2="40" y2="22" stroke="#78909c" stroke-width="1.5"/>
  <circle cx="36" cy="22" r="2" fill="#b3e5fc" opacity="0.7"/>
  <circle cx="44" cy="22" r="2" fill="#b3e5fc" opacity="0.7"/>
  <path d="M36,29 Q40,33 44,29" stroke="#a1887f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <path d="M54,36 Q62,32 66,44 Q64,54 56,54 L54,50 Q60,48 60,42 Q58,38 54,40 Z" fill="#f5f5f5" stroke="#e0e0e0" stroke-width="1"/>
  <line x1="56" y1="38" x2="64" y2="40" stroke="#9e9e9e" stroke-width="0.8" opacity="0.6"/>
  <line x1="55" y1="42" x2="63" y2="44" stroke="#9e9e9e" stroke-width="0.8" opacity="0.5"/>
  <line x1="55" y1="46" x2="62" y2="48" stroke="#9e9e9e" stroke-width="0.8" opacity="0.4"/>
</svg>`,

  // 307 — Wind Elemental
  307: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g307w" cx="50%" cy="45%" r="55%">
      <stop offset="0%" stop-color="rgba(224,247,250,0.85)"/>
      <stop offset="55%" stop-color="rgba(128,222,234,0.6)"/>
      <stop offset="100%" stop-color="rgba(0,151,167,0)"/>
    </radialGradient>
  </defs>
  <path d="M40,10 Q60,16 66,36 Q70,54 60,66 Q52,74 40,72 Q28,74 20,66 Q10,54 14,36 Q20,16 40,10 Z" fill="url(#g307w)"/>
  <path d="M14,30 Q22,22 32,28 Q40,32 48,26 Q58,20 66,28" stroke="rgba(0,188,212,0.55)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M12,42 Q20,34 30,40 Q40,44 50,38 Q60,32 68,40" stroke="rgba(0,188,212,0.5)" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M14,54 Q22,46 32,52 Q40,56 48,50 Q58,44 66,52" stroke="rgba(0,188,212,0.4)" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <circle cx="36" cy="34" r="4" fill="rgba(0,188,212,0.45)"/>
  <circle cx="46" cy="34" r="4" fill="rgba(0,188,212,0.45)"/>
  <path d="M34,44 Q40,48 46,44" stroke="rgba(0,188,212,0.4)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  <circle cx="22" cy="20" r="2.5" fill="rgba(224,247,250,0.7)"/>
  <circle cx="58" cy="18" r="2"   fill="rgba(224,247,250,0.65)"/>
  <circle cx="14" cy="62" r="2"   fill="rgba(224,247,250,0.6)"/>
  <circle cx="66" cy="60" r="2.5" fill="rgba(224,247,250,0.65)"/>
</svg>`,

  // 308 — Spirit Dancer
  308: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g308d" cx="50%" cy="40%" r="55%">
      <stop offset="0%" stop-color="rgba(240,230,255,0.95)"/>
      <stop offset="55%" stop-color="rgba(186,104,200,0.7)"/>
      <stop offset="100%" stop-color="rgba(106,27,154,0)"/>
    </radialGradient>
  </defs>
  <path d="M18,48 Q14,36 20,26 Q24,18 30,22 Q34,26 32,36 Z" fill="rgba(206,147,216,0.6)" stroke="rgba(156,39,176,0.4)" stroke-width="0.8"/>
  <path d="M62,48 Q66,36 60,26 Q56,18 50,22 Q46,26 48,36 Z" fill="rgba(206,147,216,0.6)" stroke="rgba(156,39,176,0.4)" stroke-width="0.8"/>
  <path d="M26,72 Q18,56 22,40 Q28,26 40,22 Q52,26 58,40 Q62,56 54,72 Z" fill="url(#g308d)" stroke="rgba(156,39,176,0.4)" stroke-width="1.2"/>
  <circle cx="40" cy="26" r="11" fill="rgba(240,230,255,0.9)" stroke="rgba(186,104,200,0.5)" stroke-width="1"/>
  <circle cx="36" cy="25" r="2.2" fill="rgba(106,27,154,0.7)"/>
  <circle cx="44" cy="25" r="2.2" fill="rgba(106,27,154,0.7)"/>
  <path d="M36,31 Q40,35 44,31" stroke="rgba(156,39,176,0.5)" stroke-width="1.3" fill="none" stroke-linecap="round"/>
  <circle cx="22" cy="16" r="2.5" fill="#fff176" opacity="0.8"/>
  <circle cx="58" cy="18" r="2"   fill="#fff176" opacity="0.75"/>
  <circle cx="14" cy="38" r="1.8" fill="#fff176" opacity="0.65"/>
  <circle cx="66" cy="40" r="1.8" fill="#fff176" opacity="0.65"/>
  <circle cx="30" cy="10" r="1.5" fill="#fff176" opacity="0.6"/>
  <circle cx="50" cy="12" r="1.5" fill="#fff176" opacity="0.6"/>
</svg>`,

  // 309 — Forest Witch
  309: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g309w" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#2e7d32"/><stop offset="100%" stop-color="#1b5e20"/>
    </linearGradient>
  </defs>
  <path d="M22,72 Q18,54 24,40 Q30,30 40,28 Q50,30 56,40 Q62,54 58,72 Z" fill="url(#g309w)" stroke="#1b5e20" stroke-width="1"/>
  <circle cx="40" cy="22" r="11" fill="#ffe0b2" stroke="#ffb74d" stroke-width="1.2"/>
  <path d="M20,24 L40,4 L60,24 Q54,30 40,32 Q26,30 20,24 Z" fill="#1b5e20" stroke="#388e3c" stroke-width="1"/>
  <path d="M28,24 L40,6 L52,24 Z" fill="#2e7d32" stroke="#388e3c" stroke-width="0.8"/>
  <circle cx="36" cy="21" r="2" fill="#4e342e"/>
  <circle cx="44" cy="21" r="2" fill="#4e342e"/>
  <path d="M36,28 Q40,32 44,28" stroke="#a1887f" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  <line x1="60" y1="36" x2="68" y2="72" stroke="#5d4037" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="60" cy="34" rx="5" ry="4" fill="#a5d6a7" stroke="#388e3c" stroke-width="1"/>
  <ellipse cx="60" cy="34" rx="2.5" ry="2" fill="#c8e6c9"/>
  <circle cx="14" cy="44" r="2" fill="#a5d6a7" opacity="0.65"/>
  <circle cx="18" cy="54" r="1.5" fill="#a5d6a7" opacity="0.55"/>
  <circle cx="66" cy="50" r="1.5" fill="#a5d6a7" opacity="0.55"/>
</svg>`,

  // 310 — Plague Zombie
  310: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="g310z" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#78909c"/><stop offset="100%" stop-color="#33691e"/>
    </linearGradient>
  </defs>
  <path d="M24,72 Q18,52 24,38 L42,36 Q56,38 58,52 Q56,64 50,72 Z" fill="url(#g310z)" stroke="#263238" stroke-width="1"/>
  <line x1="24" y1="52" x2="14" y2="44" stroke="#546e7a" stroke-width="4" stroke-linecap="round"/>
  <line x1="56" y1="46" x2="66" y2="38" stroke="#546e7a" stroke-width="4" stroke-linecap="round"/>
  <circle cx="36" cy="26" r="14" fill="#8d9e88" stroke="#37474f" stroke-width="1.2"/>
  <ellipse cx="30" cy="23" rx="5" ry="5.5" fill="#212121" opacity="0.85"/>
  <ellipse cx="42" cy="23" rx="5" ry="5.5" fill="#212121" opacity="0.85"/>
  <ellipse cx="30" cy="23.5" rx="2.5" ry="2" fill="#76ff03" opacity="0.7"/>
  <ellipse cx="42" cy="23.5" rx="2.5" ry="2" fill="#76ff03" opacity="0.7"/>
  <path d="M29,33 L31,35 L33,32 L35,36 L37,32 L39,35 L41,33" fill="none" stroke="#546e7a" stroke-width="1.5"/>
  <circle cx="46" cy="48" r="4" fill="#76ff03" opacity="0.4" stroke="#558b2f" stroke-width="0.8"/>
  <circle cx="34" cy="58" r="3" fill="#76ff03" opacity="0.35" stroke="#558b2f" stroke-width="0.8"/>
  <circle cx="52" cy="58" r="2.5" fill="#76ff03" opacity="0.3"/>
</svg>`,

};
