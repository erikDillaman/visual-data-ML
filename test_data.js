// ─────────────────────────────────────────────────
//  TEST DATA — Step 4 "Test Your Model"
//  10 unseen items for evaluating the decision tree.
//  Same schema as ITEMS in data.js. IDs start at 101
//  to avoid collisions with training data.
// ─────────────────────────────────────────────────

const TEST_ITEMS = [
  { id: 101, name: "Crystal Ball",  cat: "Gem",           rarity: "Legendary", value: 88, weight: "Light",  element: "Ice",       usable: false, danger: "Safe"      },
  { id: 102, name: "Vine Whip",     cat: "Weapon",        rarity: "Uncommon",  value: 28, weight: "Medium", element: "Nature",    usable: true,  danger: "Moderate"  },
  { id: 103, name: "Fire Essence",  cat: "Consumable",    rarity: "Rare",      value: 52, weight: "Light",  element: "Fire",      usable: true,  danger: "Dangerous" },
  { id: 104, name: "Stone Tablet",  cat: "Material",      rarity: "Common",    value: 6,  weight: "Heavy",  element: "Earth",     usable: false, danger: "Safe"      },
  { id: 105, name: "Ghost Tear",    cat: "Creature Drop", rarity: "Rare",      value: 60, weight: "Light",  element: "Dark",      usable: false, danger: "Moderate"  },
  { id: 106, name: "Frost Berry",   cat: "Plant",         rarity: "Common",    value: 11, weight: "Light",  element: "Ice",       usable: true,  danger: "Safe"      },
  { id: 107, name: "Thunder Helm",  cat: "Weapon",        rarity: "Legendary", value: 95, weight: "Heavy",  element: "Lightning", usable: true,  danger: "Dangerous" },
  { id: 108, name: "Amber Resin",   cat: "Material",      rarity: "Uncommon",  value: 24, weight: "Medium", element: "Nature",    usable: false, danger: "Safe"      },
  { id: 109, name: "Venom Gland",   cat: "Creature Drop", rarity: "Uncommon",  value: 33, weight: "Light",  element: "Toxic",     usable: false, danger: "Dangerous" },
  { id: 110, name: "Star Dust",     cat: "Consumable",    rarity: "Rare",      value: 48, weight: "Light",  element: "None",      usable: true,  danger: "Safe"      },
];

const TEST_ICONS = {

  // 101 — Crystal Ball
  101: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="cb1" cx="38%" cy="32%" r="60%">
      <stop offset="0%" stop-color="#e0f7fa"/>
      <stop offset="45%" stop-color="#80deea"/>
      <stop offset="100%" stop-color="#006064"/>
    </radialGradient>
    <radialGradient id="cb2" cx="30%" cy="28%" r="38%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.55)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </radialGradient>
  </defs>
  <ellipse cx="40" cy="60" rx="18" ry="4" fill="rgba(0,0,0,0.25)"/>
  <circle cx="40" cy="34" r="26" fill="url(#cb1)" stroke="#00838f" stroke-width="1.5"/>
  <circle cx="40" cy="34" r="26" fill="url(#cb2)"/>
  <circle cx="29" cy="24" r="2.8" fill="white" opacity="0.55"/>
  <circle cx="45" cy="19" r="1.8" fill="white" opacity="0.75"/>
  <circle cx="56" cy="29" r="1.2" fill="white" opacity="0.5"/>
  <path d="M34,38 Q40,32 46,38 Q40,44 34,38 Z" fill="rgba(178,235,242,0.55)" stroke="rgba(100,200,220,0.5)" stroke-width="0.8"/>
  <path d="M60,18 L62,14 L64,18 L68,20 L64,22 L62,26 L60,22 L56,20 Z" fill="#b2ebf2" opacity="0.85" transform="scale(0.38) translate(112,38)"/>
  <rect x="32" y="59" width="16" height="5" rx="2.5" fill="#546e7a" stroke="#37474f" stroke-width="0.8"/>
  <rect x="28" y="63" width="24" height="4" rx="2" fill="#455a64" stroke="#37474f" stroke-width="0.8"/>
</svg>`,

  // 102 — Vine Whip
  102: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <path d="M24,70 Q20,52 28,38 Q36,24 50,16 Q58,12 64,18" stroke="#2e7d32" stroke-width="5" fill="none" stroke-linecap="round"/>
  <path d="M24,70 Q20,52 28,38 Q36,24 50,16 Q58,12 64,18" stroke="#66bb6a" stroke-width="2.2" fill="none" stroke-linecap="round" opacity="0.6"/>
  <ellipse cx="32" cy="48" rx="10" ry="5.5" fill="#388e3c" stroke="#2e7d32" stroke-width="0.8" transform="rotate(-42,32,48)"/>
  <line x1="30" y1="46" x2="34" y2="50" stroke="#1b5e20" stroke-width="0.8" opacity="0.5"/>
  <ellipse cx="44" cy="31" rx="9" ry="5" fill="#43a047" stroke="#2e7d32" stroke-width="0.8" transform="rotate(18,44,31)"/>
  <line x1="42" y1="29" x2="46" y2="33" stroke="#1b5e20" stroke-width="0.8" opacity="0.5"/>
  <ellipse cx="58" cy="19" rx="7" ry="4" fill="#66bb6a" stroke="#388e3c" stroke-width="0.8" transform="rotate(-12,58,19)"/>
  <path d="M64,18 Q72,12 72,21 Q72,28 65,26" stroke="#81c784" stroke-width="2.8" fill="none" stroke-linecap="round"/>
  <circle cx="72" cy="12" r="2" fill="#a5d6a7"/>
</svg>`,

  // 103 — Fire Essence
  103: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fe1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef9a9a"/>
      <stop offset="100%" stop-color="#b71c1c"/>
    </linearGradient>
    <radialGradient id="fe2" cx="45%" cy="65%" r="50%">
      <stop offset="0%" stop-color="#ff8a65"/>
      <stop offset="55%" stop-color="#e53935"/>
      <stop offset="100%" stop-color="#7f0000"/>
    </radialGradient>
  </defs>
  <rect x="36" y="9" width="8" height="7" rx="2" fill="#78909c" stroke="#546e7a" stroke-width="0.8"/>
  <ellipse cx="40" cy="20" rx="10" ry="4" fill="#90a4ae" stroke="#78909c" stroke-width="0.8"/>
  <path d="M28,25 Q22,30 20,46 Q18,62 20,66 Q24,74 40,74 Q56,74 60,66 Q62,62 60,46 Q58,30 52,25 Z"
        fill="url(#fe1)" stroke="#b71c1c" stroke-width="1.2"/>
  <path d="M28,25 Q24,38 24,50" stroke="rgba(255,255,255,0.22)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M40,62 Q34,52 36,42 Q38,34 40,31 Q42,34 44,42 Q46,52 40,62 Z" fill="url(#fe2)" opacity="0.9"/>
  <path d="M40,58 Q37,50 38,43 Q39,38 40,36 Q41,38 42,43 Q43,50 40,58 Z" fill="#ffa726" opacity="0.8"/>
  <ellipse cx="33" cy="32" rx="6" ry="4" fill="rgba(255,255,255,0.18)" transform="rotate(-20,33,32)"/>
</svg>`,

  // 104 — Stone Tablet
  104: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="st1" x1="10%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#90a4ae"/>
      <stop offset="100%" stop-color="#455a64"/>
    </linearGradient>
  </defs>
  <path d="M20,18 Q40,10 60,18 L64,66 Q40,74 16,66 Z" fill="url(#st1)" stroke="#37474f" stroke-width="1.5"/>
  <path d="M20,18 Q40,10 60,18 L64,66 Q40,74 16,66 Z" fill="rgba(255,255,255,0.07)"/>
  <line x1="28" y1="28" x2="54" y2="26" stroke="#263238" stroke-width="2.2" stroke-linecap="round" opacity="0.7"/>
  <line x1="26" y1="38" x2="55" y2="36" stroke="#263238" stroke-width="1.8" stroke-linecap="round" opacity="0.55"/>
  <line x1="27" y1="48" x2="53" y2="46" stroke="#263238" stroke-width="1.6" stroke-linecap="round" opacity="0.45"/>
  <line x1="29" y1="58" x2="51" y2="56" stroke="#263238" stroke-width="1.2" stroke-linecap="round" opacity="0.35"/>
  <path d="M46,22 L50,34 L46,40" stroke="#263238" stroke-width="1.2" fill="none" opacity="0.5"/>
  <ellipse cx="26" cy="20" rx="5" ry="3" fill="rgba(255,255,255,0.18)" transform="rotate(-22,26,20)"/>
</svg>`,

  // 105 — Ghost Tear
  105: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="gt1" cx="38%" cy="35%" r="58%">
      <stop offset="0%" stop-color="#b39ddb"/>
      <stop offset="50%" stop-color="#4a148c"/>
      <stop offset="100%" stop-color="#1a0030"/>
    </radialGradient>
  </defs>
  <path d="M18,62 Q14,52 20,44 Q26,38 22,30" stroke="rgba(149,117,205,0.35)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M62,60 Q66,50 60,42 Q54,36 58,28" stroke="rgba(149,117,205,0.28)" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M40,8 Q56,24 58,44 Q58,62 40,70 Q22,62 22,44 Q22,24 40,8 Z"
        fill="url(#gt1)" stroke="#4a148c" stroke-width="1.5"/>
  <ellipse cx="32" cy="26" rx="7" ry="4.5" fill="rgba(255,255,255,0.2)" transform="rotate(-28,32,26)"/>
  <circle cx="33" cy="46" r="4" fill="rgba(0,0,0,0.4)"/>
  <circle cx="47" cy="46" r="4" fill="rgba(0,0,0,0.4)"/>
  <circle cx="34" cy="44" r="1.5" fill="rgba(255,255,255,0.5)"/>
  <circle cx="48" cy="44" r="1.5" fill="rgba(255,255,255,0.5)"/>
  <path d="M33,56 Q40,60 47,56" stroke="rgba(255,255,255,0.22)" stroke-width="1.8" fill="none" stroke-linecap="round"/>
</svg>`,

  // 106 — Frost Berry
  106: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="fb1" cx="35%" cy="30%" r="58%">
      <stop offset="0%" stop-color="#e0f7fa"/>
      <stop offset="100%" stop-color="#26c6da"/>
    </radialGradient>
    <radialGradient id="fb2" cx="38%" cy="32%" r="55%">
      <stop offset="0%" stop-color="#b2dfdb"/>
      <stop offset="100%" stop-color="#00897b"/>
    </radialGradient>
  </defs>
  <path d="M40,58 Q37,46 32,36" stroke="#2e7d32" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M40,58 Q43,46 48,38" stroke="#388e3c" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M40,58 Q40,44 40,34" stroke="#43a047" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M40,58 Q28,62 24,70 Q32,68 40,58 Z" fill="#388e3c"/>
  <path d="M40,58 Q52,62 56,70 Q48,68 40,58 Z" fill="#2e7d32"/>
  <circle cx="32" cy="28" r="11" fill="url(#fb1)" stroke="#80cbc4" stroke-width="1.3"/>
  <circle cx="48" cy="30" r="10" fill="url(#fb2)" stroke="#80cbc4" stroke-width="1.2"/>
  <circle cx="40" cy="24" r="9" fill="url(#fb1)" stroke="#80cbc4" stroke-width="1.1"/>
  <circle cx="27" cy="24" r="3.5" fill="rgba(255,255,255,0.45)"/>
  <circle cx="43" cy="25" r="3" fill="rgba(255,255,255,0.4)"/>
  <circle cx="36" cy="20" r="2.5" fill="rgba(255,255,255,0.5)"/>
  <path d="M60,14 L62,10 L64,14 L68,16 L64,18 L62,22 L60,18 L56,16 Z" fill="#b2ebf2" opacity="0.85" transform="scale(0.42) translate(100,8)"/>
</svg>`,

  // 107 — Thunder Helm
  107: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="th1" x1="10%" y1="0%" x2="90%" y2="100%">
      <stop offset="0%" stop-color="#78909c"/>
      <stop offset="100%" stop-color="#263238"/>
    </linearGradient>
  </defs>
  <path d="M16,46 Q14,32 20,22 Q26,10 40,8 Q54,10 60,22 Q66,32 64,46 Z"
        fill="url(#th1)" stroke="#37474f" stroke-width="1.5"/>
  <path d="M18,46 Q20,58 28,62 L52,62 Q60,58 62,46 Z" fill="#37474f" stroke="#263238" stroke-width="1"/>
  <path d="M16,46 Q12,52 14,62 Q18,68 26,64 L28,62 Q20,58 18,46 Z" fill="#455a64" stroke="#37474f" stroke-width="0.8"/>
  <path d="M64,46 Q68,52 66,62 Q62,68 54,64 L52,62 Q60,58 62,46 Z" fill="#455a64" stroke="#37474f" stroke-width="0.8"/>
  <polygon points="46,15 38,30 44,30 35,50 44,50 40,62 50,42 43,42 50,28 44,28"
           fill="#fdd835" stroke="#f9a825" stroke-width="0.6" opacity="0.95"/>
  <ellipse cx="28" cy="20" rx="9" ry="5.5" fill="rgba(255,255,255,0.14)" transform="rotate(-28,28,20)"/>
  <line x1="10" y1="34" x2="16" y2="34" stroke="#546e7a" stroke-width="1.5" stroke-linecap="round"/>
  <line x1="64" y1="34" x2="70" y2="34" stroke="#546e7a" stroke-width="1.5" stroke-linecap="round"/>
</svg>`,

  // 108 — Amber Resin
  108: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="ar1" cx="38%" cy="30%" r="62%">
      <stop offset="0%" stop-color="#fff9c4"/>
      <stop offset="40%" stop-color="#ffb300"/>
      <stop offset="100%" stop-color="#e65100"/>
    </radialGradient>
  </defs>
  <path d="M40,8 Q58,24 60,46 Q60,66 40,74 Q20,66 20,46 Q20,24 40,8 Z"
        fill="url(#ar1)" stroke="#e65100" stroke-width="1.5"/>
  <ellipse cx="35" cy="30" rx="9" ry="6" fill="rgba(255,255,255,0.3)" transform="rotate(-18,35,30)"/>
  <ellipse cx="46" cy="52" rx="6" ry="4" fill="rgba(100,50,0,0.2)" transform="rotate(22,46,52)"/>
  <line x1="44" y1="50" x2="48" y2="54" stroke="rgba(100,50,0,0.3)" stroke-width="1"/>
  <circle cx="50" cy="46" r="2.5" fill="rgba(100,50,0,0.18)"/>
  <path d="M60,14 L62,10 L64,14 L68,16 L64,18 L62,22 L60,18 L56,16 Z" fill="#fff176" opacity="0.75" transform="scale(0.36) translate(136,8)"/>
</svg>`,

  // 109 — Venom Gland
  109: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="vg1" cx="38%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#f4ff81"/>
      <stop offset="45%" stop-color="#76ff03"/>
      <stop offset="100%" stop-color="#33691e"/>
    </radialGradient>
  </defs>
  <path d="M28,22 Q16,28 14,46 Q12,62 24,70 Q32,76 46,74 Q60,70 64,58 Q68,44 62,30 Q56,16 40,14 Q34,14 28,22 Z"
        fill="url(#vg1)" stroke="#558b2f" stroke-width="1.5"/>
  <path d="M28,22 Q16,28 14,46 Q12,62 24,70 Q32,76 46,74 Q60,70 64,58 Q68,44 62,30 Q56,16 40,14 Q34,14 28,22 Z"
        fill="rgba(255,255,255,0.1)"/>
  <path d="M58,28 Q66,22 70,16" stroke="#558b2f" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <circle cx="71" cy="15" r="4.5" fill="#ccff90" stroke="#558b2f" stroke-width="1"/>
  <circle cx="35" cy="42" r="7" fill="rgba(178,255,0,0.22)" stroke="rgba(178,255,0,0.38)" stroke-width="0.8"/>
  <circle cx="50" cy="54" r="5" fill="rgba(178,255,0,0.18)" stroke="rgba(178,255,0,0.32)" stroke-width="0.8"/>
  <circle cx="28" cy="56" r="3.5" fill="rgba(178,255,0,0.16)"/>
  <ellipse cx="28" cy="26" rx="9" ry="5" fill="rgba(255,255,255,0.2)" transform="rotate(-28,28,26)"/>
</svg>`,

  // 110 — Star Dust
  110: `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="sd1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(225,190,255,0.25)"/>
      <stop offset="100%" stop-color="rgba(225,190,255,0)"/>
    </radialGradient>
  </defs>
  <circle cx="40" cy="40" r="26" fill="url(#sd1)"/>
  <path d="M60,16 L62,11 L64,16 L69,18 L64,20 L62,25 L60,20 L55,18 Z" fill="#fff9c4" opacity="0.95"/>
  <path d="M60,16 L62,11 L64,16 L69,18 L64,20 L62,25 L60,20 L55,18 Z" fill="#ffe082" opacity="0.8" transform="scale(0.62) translate(20,44)"/>
  <path d="M60,16 L62,11 L64,16 L69,18 L64,20 L62,25 L60,20 L55,18 Z" fill="#fff9c4" opacity="0.85" transform="scale(0.5) translate(106,86)"/>
  <path d="M60,16 L62,11 L64,16 L69,18 L64,20 L62,25 L60,20 L55,18 Z" fill="#ffe082" opacity="0.7" transform="scale(0.42) translate(30,154)"/>
  <path d="M60,16 L62,11 L64,16 L69,18 L64,20 L62,25 L60,20 L55,18 Z" fill="white"   opacity="0.9" transform="scale(0.72) translate(26,34)"/>
  <circle cx="24" cy="28" r="2.2" fill="#fff9c4" opacity="0.8"/>
  <circle cx="56" cy="20" r="1.8" fill="white"   opacity="0.7"/>
  <circle cx="18" cy="46" r="1.6" fill="#ffe082" opacity="0.65"/>
  <circle cx="60" cy="52" r="2"   fill="white"   opacity="0.65"/>
  <circle cx="28" cy="60" r="1.6" fill="#fff9c4" opacity="0.7"/>
  <circle cx="52" cy="62" r="1.2" fill="white"   opacity="0.5"/>
  <circle cx="40" cy="16" r="1.8" fill="white"   opacity="0.6"/>
  <circle cx="34" cy="38" r="1"   fill="#fff9c4" opacity="0.5"/>
  <circle cx="48" cy="34" r="1"   fill="white"   opacity="0.55"/>
</svg>`,

};
