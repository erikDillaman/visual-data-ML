// ITEMS is defined in data.js, loaded before this script

// ── Rarity colors
const RARITY_COLOR = {
  Common:    "#aaaaaa",
  Uncommon:  "#4ade80",
  Rare:      "#60a5fa",
  Legendary: "#fbbf24",
};

// ── Element glow colors (for card backgrounds)
const ELEMENT_GLOW = {
  Nature: "rgba(34,197,94,0.18)",
  Fire:   "rgba(249,115,22,0.18)",
  Water:  "rgba(59,130,246,0.18)",
  Earth:  "rgba(168,133,90,0.18)",
  Dark:   "rgba(168,85,247,0.22)",
  Toxic:     "rgba(163,230,53,0.18)",
  Ice:       "rgba(165,240,255,0.20)",
  Lightning: "rgba(253,224,71,0.18)",
  None:      "rgba(200,200,220,0.06)",
};

// ══════════════════════════════════════════════════
//  SVG ICONS (80×80 viewBox)
// ══════════════════════════════════════════════════
function svgIcon(id) {
  switch(id) {

    case 1: // Wheat Bundle
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="wg1" cx="50%" cy="30%" r="50%">
      <stop offset="0%" stop-color="#f9d45e"/>
      <stop offset="100%" stop-color="#c8860a"/>
    </radialGradient>
  </defs>
  <line x1="40" y1="62" x2="20" y2="22" stroke="#8b5e1a" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="40" y1="62" x2="40" y2="16" stroke="#8b5e1a" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="40" y1="62" x2="60" y2="22" stroke="#8b5e1a" stroke-width="2.5" stroke-linecap="round"/>
  <ellipse cx="20" cy="18" rx="6" ry="10" fill="url(#wg1)" stroke="#c8860a" stroke-width="1"/>
  <ellipse cx="40" cy="12" rx="6" ry="11" fill="url(#wg1)" stroke="#c8860a" stroke-width="1"/>
  <ellipse cx="60" cy="18" rx="6" ry="10" fill="url(#wg1)" stroke="#c8860a" stroke-width="1"/>
  <line x1="40" y1="10" x2="40" y2="22" stroke="#a06010" stroke-width="0.8" opacity="0.6"/>
  <line x1="20" y1="16" x2="20" y2="27" stroke="#a06010" stroke-width="0.8" opacity="0.6"/>
  <line x1="60" y1="16" x2="60" y2="27" stroke="#a06010" stroke-width="0.8" opacity="0.6"/>
  <rect x="30" y="54" width="20" height="7" rx="3.5" fill="#6b3c0a" stroke="#4a2806" stroke-width="0.8"/>
  <rect x="30" y="55" width="20" height="2.5" rx="1.5" fill="rgba(255,200,100,0.25)"/>
</svg>`;

    case 2: // Red Ruby
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="rg1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef5350"/>
      <stop offset="100%" stop-color="#7f0000"/>
    </linearGradient>
  </defs>
  <polygon points="40,10 65,25 65,55 40,70 15,55 15,25" fill="url(#rg1)" stroke="#b71c1c" stroke-width="1.2"/>
  <polygon points="40,10 15,25 40,38" fill="#ef9a9a" opacity="0.35"/>
  <polygon points="40,10 65,25 40,38" fill="#e53935" opacity="0.4"/>
  <polygon points="15,55 40,70 65,55 40,38" fill="#7f0000" opacity="0.5"/>
  <line x1="40" y1="10" x2="40" y2="70" stroke="#b71c1c" stroke-width="0.8" opacity="0.5"/>
  <line x1="15" y1="25" x2="65" y2="55" stroke="#b71c1c" stroke-width="0.8" opacity="0.4"/>
  <line x1="65" y1="25" x2="15" y2="55" stroke="#b71c1c" stroke-width="0.8" opacity="0.4"/>
  <ellipse cx="30" cy="26" rx="8" ry="5" fill="white" opacity="0.28" transform="rotate(-20,30,26)"/>
</svg>`;

    case 3: // Bomb
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bg1" cx="35%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#7b1fa2"/>
      <stop offset="100%" stop-color="#1a0030"/>
    </radialGradient>
  </defs>
  <path d="M44,20 Q52,14 56,8 Q60,4 64,6" stroke="#8b6914" stroke-width="2" fill="none" stroke-linecap="round"/>
  <ellipse cx="65" cy="5" rx="5" ry="6" fill="#f57f17" opacity="0.9"/>
  <ellipse cx="65" cy="6" rx="3" ry="4" fill="#ffee58"/>
  <circle cx="38" cy="44" r="28" fill="url(#bg1)" stroke="#4a0072" stroke-width="1.5"/>
  <circle cx="38" cy="44" r="28" fill="none" stroke="rgba(180,100,220,0.2)" stroke-width="4"/>
  <circle cx="30" cy="40" r="5" fill="#111"/>
  <circle cx="46" cy="40" r="5" fill="#111"/>
  <circle cx="32" cy="38" r="1.8" fill="white"/>
  <circle cx="48" cy="38" r="1.8" fill="white"/>
  <path d="M29,52 Q38,60 47,52" stroke="#111" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <circle cx="44" cy="18" r="3" fill="#5d4037"/>
</svg>`;

    case 4: // Purple Diamond
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="dg1" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#ce93d8"/>
      <stop offset="50%" stop-color="#8e24aa"/>
      <stop offset="100%" stop-color="#4a0072"/>
    </linearGradient>
  </defs>
  <polygon points="40,6 72,34 40,74 8,34" fill="url(#dg1)" stroke="#6a0080" stroke-width="1.2"/>
  <polygon points="40,6 8,34 40,34" fill="rgba(255,255,255,0.15)"/>
  <polygon points="40,6 72,34 40,34" fill="rgba(255,255,255,0.07)"/>
  <polygon points="8,34 40,74 40,34" fill="rgba(0,0,0,0.25)"/>
  <polygon points="72,34 40,74 40,34" fill="rgba(0,0,0,0.15)"/>
  <line x1="40" y1="6" x2="40" y2="74" stroke="#9c27b0" stroke-width="0.8" opacity="0.5"/>
  <line x1="8" y1="34" x2="72" y2="34" stroke="#9c27b0" stroke-width="0.8" opacity="0.4"/>
  <polygon points="40,10 23,30 35,30" fill="white" opacity="0.3"/>
  <path d="M60,18 L62,14 L64,18 L68,20 L64,22 L62,26 L60,22 L56,20 Z" fill="white" opacity="0.7" transform="scale(0.7) translate(28,10)"/>
</svg>`;

    case 5: // Gray Rocks
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="50" cy="52" rx="20" ry="14" fill="#546e7a" stroke="#37474f" stroke-width="1"/>
  <ellipse cx="48" cy="46" rx="8" ry="5" fill="rgba(255,255,255,0.1)"/>
  <ellipse cx="30" cy="52" rx="22" ry="15" fill="#607d8b" stroke="#455a64" stroke-width="1"/>
  <ellipse cx="27" cy="47" rx="9" ry="5" fill="rgba(255,255,255,0.12)"/>
  <ellipse cx="44" cy="60" rx="18" ry="12" fill="#78909c" stroke="#546e7a" stroke-width="1"/>
  <ellipse cx="42" cy="56" rx="7" ry="4" fill="rgba(255,255,255,0.16)"/>
  <ellipse cx="18" cy="62" rx="8" ry="6" fill="#607d8b" stroke="#455a64" stroke-width="0.8"/>
</svg>`;

    case 6: // Cactus Ball
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="cg1" cx="40%" cy="35%" r="55%">
      <stop offset="0%" stop-color="#fdd835"/>
      <stop offset="100%" stop-color="#e65100"/>
    </radialGradient>
  </defs>
  <polygon points="40,8 36,16 44,16" fill="#e65100"/>
  <polygon points="66,20 59,24 63,31" fill="#e65100"/>
  <polygon points="72,46 64,44 64,52" fill="#e65100"/>
  <polygon points="63,68 59,60 52,65" fill="#e65100"/>
  <polygon points="40,74 36,66 44,66" fill="#e65100"/>
  <polygon points="17,68 21,60 28,65" fill="#e65100"/>
  <polygon points="8,46 16,44 16,52" fill="#e65100"/>
  <polygon points="14,20 21,24 17,31" fill="#e65100"/>
  <circle cx="40" cy="42" r="26" fill="url(#cg1)" stroke="#bf360c" stroke-width="1.2"/>
  <ellipse cx="32" cy="34" rx="9" ry="6" fill="rgba(255,255,255,0.28)" transform="rotate(-20,32,34)"/>
  <ellipse cx="26" cy="71" rx="5" ry="3" fill="#5d4037" opacity="0.6"/>
  <ellipse cx="54" cy="73" rx="4" ry="2.5" fill="#5d4037" opacity="0.6"/>
  <ellipse cx="40" cy="72" rx="6" ry="3" fill="#4e342e" opacity="0.5"/>
</svg>`;

    case 7: // Blue Potion
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pg1" x1="30%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#42a5f5"/>
      <stop offset="100%" stop-color="#0d47a1"/>
    </linearGradient>
    <linearGradient id="pg2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.25)"/>
      <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
    </linearGradient>
  </defs>
  <rect x="33" y="8" width="14" height="8" rx="3" fill="#8d6e63" stroke="#6d4c41" stroke-width="1"/>
  <rect x="35" y="15" width="10" height="12" rx="2" fill="#1565c0" stroke="#0d47a1" stroke-width="1"/>
  <path d="M26,27 Q20,30 18,42 Q16,58 18,64 Q22,74 40,74 Q58,74 62,64 Q64,58 62,42 Q60,30 54,27 Z" fill="url(#pg1)" stroke="#0d47a1" stroke-width="1.5"/>
  <path d="M26,27 Q20,30 18,42 Q16,58 18,64 Q22,74 40,74 Q58,74 62,64 Q64,58 62,42 Q60,30 54,27 Z" fill="url(#pg2)"/>
  <path d="M20,46 Q40,50 60,46" stroke="rgba(255,255,255,0.3)" stroke-width="1" fill="none"/>
  <circle cx="33" cy="58" r="3.5" fill="rgba(255,255,255,0.25)" stroke="rgba(255,255,255,0.4)" stroke-width="0.8"/>
  <circle cx="48" cy="52" r="2.5" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.35)" stroke-width="0.7"/>
  <circle cx="38" cy="65" r="2" fill="rgba(255,255,255,0.18)"/>
  <path d="M25,34 Q24,50 26,62" stroke="rgba(255,255,255,0.55)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
</svg>`;

    case 8: // Aloe Plant
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ag1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#66bb6a"/>
      <stop offset="100%" stop-color="#2e7d32"/>
    </linearGradient>
    <linearGradient id="ag2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#81c784"/>
      <stop offset="100%" stop-color="#388e3c"/>
    </linearGradient>
  </defs>
  <ellipse cx="18" cy="46" rx="7" ry="24" fill="url(#ag1)" stroke="#1b5e20" stroke-width="0.8" transform="rotate(-40,18,68)"/>
  <ellipse cx="62" cy="46" rx="7" ry="24" fill="url(#ag1)" stroke="#1b5e20" stroke-width="0.8" transform="rotate(40,62,68)"/>
  <ellipse cx="26" cy="40" rx="7" ry="26" fill="url(#ag2)" stroke="#1b5e20" stroke-width="0.8" transform="rotate(-20,26,68)"/>
  <ellipse cx="54" cy="40" rx="7" ry="26" fill="url(#ag2)" stroke="#1b5e20" stroke-width="0.8" transform="rotate(20,54,68)"/>
  <ellipse cx="32" cy="34" rx="7" ry="28" fill="url(#ag1)" stroke="#1b5e20" stroke-width="0.8" transform="rotate(-8,32,68)"/>
  <ellipse cx="48" cy="34" rx="7" ry="28" fill="url(#ag1)" stroke="#1b5e20" stroke-width="0.8" transform="rotate(8,48,68)"/>
  <ellipse cx="40" cy="30" rx="7" ry="30" fill="url(#ag2)" stroke="#1b5e20" stroke-width="0.8"/>
  <line x1="40" y1="12" x2="40" y2="68" stroke="rgba(200,255,180,0.35)" stroke-width="1.2" stroke-linecap="round"/>
  <line x1="32" y1="15" x2="30" y2="66" stroke="rgba(200,255,180,0.25)" stroke-width="1" stroke-linecap="round"/>
  <line x1="48" y1="15" x2="50" y2="66" stroke="rgba(200,255,180,0.25)" stroke-width="1" stroke-linecap="round"/>
  <ellipse cx="40" cy="72" rx="22" ry="6" fill="#5d4037" opacity="0.55"/>
</svg>`;

    case 9: // Gold Bar
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gg1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fcd34d"/>
      <stop offset="50%" stop-color="#f59e0b"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
    <linearGradient id="gg2" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#fde68a"/>
      <stop offset="100%" stop-color="#d97706"/>
    </linearGradient>
    <linearGradient id="gg3" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#92400e"/>
      <stop offset="100%" stop-color="#b45309"/>
    </linearGradient>
  </defs>
  <ellipse cx="40" cy="70" rx="28" ry="5" fill="rgba(0,0,0,0.3)"/>
  <polygon points="62,26 72,34 72,58 62,52" fill="url(#gg3)"/>
  <polygon points="18,52 62,52 72,58 28,58" fill="#92400e"/>
  <rect x="18" y="26" width="44" height="26" rx="4" fill="url(#gg1)" stroke="#d97706" stroke-width="1"/>
  <polygon points="18,26 62,26 72,34 28,34" fill="url(#gg2)"/>
  <line x1="22" y1="32" x2="58" y2="32" stroke="rgba(255,220,100,0.4)" stroke-width="1"/>
  <line x1="22" y1="38" x2="58" y2="38" stroke="rgba(180,120,0,0.3)" stroke-width="0.8"/>
  <line x1="22" y1="44" x2="58" y2="44" stroke="rgba(180,120,0,0.3)" stroke-width="0.8"/>
  <line x1="30" y1="28" x2="30" y2="32" stroke="white" stroke-width="1.5" opacity="0.7"/>
  <line x1="28" y1="30" x2="32" y2="30" stroke="white" stroke-width="1.5" opacity="0.7"/>
  <line x1="52" y1="42" x2="52" y2="46" stroke="white" stroke-width="1.5" opacity="0.5"/>
  <line x1="50" y1="44" x2="54" y2="44" stroke="white" stroke-width="1.5" opacity="0.5"/>
</svg>`;

    case 10: // Toxic Slime
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="sg1" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#8bc34a"/>
      <stop offset="100%" stop-color="#33691e"/>
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <circle cx="40" cy="40" r="32" fill="rgba(139,195,74,0.15)" filter="url(#glow)"/>
  <path d="M40,12 Q52,8 60,16 Q72,18 74,30 Q78,42 70,52 Q66,62 56,66 Q48,72 40,70 Q30,72 22,66 Q12,60 8,50 Q4,38 10,28 Q14,16 26,12 Q33,9 40,12 Z" fill="url(#sg1)" stroke="#558b2f" stroke-width="1.5"/>
  <circle cx="18" cy="36" r="5" fill="#8bc34a" stroke="#558b2f" stroke-width="0.8"/>
  <circle cx="62" cy="32" r="4" fill="#8bc34a" stroke="#558b2f" stroke-width="0.8"/>
  <circle cx="56" cy="60" r="4.5" fill="#7cb342" stroke="#558b2f" stroke-width="0.8"/>
  <circle cx="31" cy="38" r="7" fill="#1b3a06"/>
  <circle cx="49" cy="38" r="7" fill="#1b3a06"/>
  <ellipse cx="33" cy="36" rx="3" ry="4" fill="#33691e"/>
  <ellipse cx="51" cy="36" rx="3" ry="4" fill="#33691e"/>
  <circle cx="34" cy="35" r="1.5" fill="rgba(255,255,255,0.7)"/>
  <circle cx="52" cy="35" r="1.5" fill="rgba(255,255,255,0.7)"/>
  <ellipse cx="33" cy="28" rx="9" ry="5" fill="rgba(255,255,255,0.2)" transform="rotate(-10,33,28)"/>
  <path d="M40,70 Q38,76 40,80 Q42,76 40,70 Z" fill="#558b2f"/>
  <ellipse cx="40" cy="80" rx="3" ry="2" fill="#33691e"/>
</svg>`;

    case 11: // Iron Sword
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sw1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e0e0e0"/>
      <stop offset="50%" stop-color="#9e9e9e"/>
      <stop offset="100%" stop-color="#546e7a"/>
    </linearGradient>
  </defs>
  <polygon points="40,8 44,58 40,62 36,58" fill="url(#sw1)" stroke="#607d8b" stroke-width="1"/>
  <polygon points="40,8 44,58 40,58" fill="rgba(255,255,255,0.2)"/>
  <rect x="26" y="56" width="28" height="6" rx="2" fill="#8d6e63" stroke="#6d4c41" stroke-width="1"/>
  <rect x="36" y="62" width="8" height="14" rx="3" fill="#6d4c41" stroke="#4e342e" stroke-width="1"/>
  <line x1="40" y1="12" x2="40" y2="54" stroke="rgba(255,255,255,0.4)" stroke-width="1.5" stroke-linecap="round"/>
</svg>`;

    case 12: // Health Potion
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hp1" x1="30%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#ef9a9a"/>
      <stop offset="100%" stop-color="#b71c1c"/>
    </linearGradient>
  </defs>
  <rect x="33" y="8" width="14" height="8" rx="3" fill="#8d6e63" stroke="#6d4c41" stroke-width="1"/>
  <rect x="35" y="15" width="10" height="12" rx="2" fill="#c62828" stroke="#b71c1c" stroke-width="1"/>
  <path d="M26,27 Q20,30 18,42 Q16,58 18,64 Q22,74 40,74 Q58,74 62,64 Q64,58 62,42 Q60,30 54,27 Z" fill="url(#hp1)" stroke="#b71c1c" stroke-width="1.5"/>
  <path d="M26,27 Q20,30 18,42 Q16,58 18,64 Q22,74 40,74 Q58,74 62,64 Q64,58 62,42 Q60,30 54,27 Z" fill="rgba(255,255,255,0.15)"/>
  <path d="M37,42 L37,52 M32,47 L42,47" stroke="white" stroke-width="3" stroke-linecap="round"/>
  <path d="M25,34 Q24,50 26,62" stroke="rgba(255,255,255,0.55)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
</svg>`;

    case 13: // Ice Crystal
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ic1" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#e0f7fa"/>
      <stop offset="50%" stop-color="#4dd0e1"/>
      <stop offset="100%" stop-color="#006064"/>
    </linearGradient>
  </defs>
  <polygon points="40,8 48,30 70,30 53,44 60,66 40,52 20,66 27,44 10,30 32,30" fill="url(#ic1)" stroke="#00838f" stroke-width="1.2"/>
  <polygon points="40,8 48,30 40,28" fill="rgba(255,255,255,0.35)"/>
  <polygon points="40,8 32,30 40,28" fill="rgba(255,255,255,0.2)"/>
  <circle cx="40" cy="38" r="8" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
  <line x1="40" y1="8" x2="40" y2="68" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
  <line x1="10" y1="30" x2="70" y2="30" stroke="rgba(255,255,255,0.3)" stroke-width="1"/>
</svg>`;

    case 14: // Wolf Fang
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wf1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5f5f5"/>
      <stop offset="100%" stop-color="#bdbdbd"/>
    </linearGradient>
  </defs>
  <path d="M32,14 Q28,16 27,20 L36,70 Q38,76 40,76 Q42,76 44,70 L53,20 Q52,16 48,14 Q44,10 40,10 Q36,10 32,14 Z" fill="url(#wf1)" stroke="#9e9e9e" stroke-width="1.2"/>
  <path d="M32,14 Q36,10 40,10 Q38,20 36,70 Q38,76 40,76 Q38,76 36,70 L27,20 Q28,16 32,14 Z" fill="rgba(255,255,255,0.4)"/>
  <ellipse cx="40" cy="18" rx="10" ry="6" fill="#e0e0e0" stroke="#bdbdbd" stroke-width="0.8"/>
</svg>`;

    case 15: // Thunder Stone
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="ts1" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#78909c"/>
      <stop offset="100%" stop-color="#37474f"/>
    </radialGradient>
  </defs>
  <path d="M20,20 Q14,26 14,40 Q14,58 28,66 Q36,72 44,70 Q58,68 64,56 Q70,44 66,30 Q62,18 50,14 Q36,10 28,16 Z" fill="url(#ts1)" stroke="#455a64" stroke-width="1.2"/>
  <ellipse cx="32" cy="26" rx="10" ry="6" fill="rgba(255,255,255,0.15)" transform="rotate(-20,32,26)"/>
  <polygon points="44,22 36,42 42,42 34,60 52,36 44,36" fill="#fdd835" stroke="#f9a825" stroke-width="0.8"/>
  <polygon points="44,22 42,42 52,36" fill="rgba(255,255,255,0.4)"/>
</svg>`;

    case 16: // Dark Dagger
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="dd1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7e57c2"/>
      <stop offset="100%" stop-color="#1a0030"/>
    </linearGradient>
  </defs>
  <polygon points="40,8 44,52 40,56 36,52" fill="url(#dd1)" stroke="#4a148c" stroke-width="1"/>
  <polygon points="40,8 44,52 40,48" fill="rgba(200,150,255,0.2)"/>
  <rect x="28" y="50" width="24" height="5" rx="2" fill="#4a148c" stroke="#311b92" stroke-width="1"/>
  <rect x="37" y="55" width="6" height="16" rx="2" fill="#1a0030" stroke="#4a148c" stroke-width="0.8"/>
  <path d="M60,18 L62,14 L64,18 L68,20 L64,22 L62,26 L60,22 L56,20 Z" fill="#ce93d8" opacity="0.8" transform="scale(0.6) translate(36,8)"/>
  <path d="M60,18 L62,14 L64,18 L68,20 L64,22 L62,26 L60,22 L56,20 Z" fill="#ce93d8" opacity="0.6" transform="scale(0.5) translate(54,72)"/>
</svg>`;

    case 17: // Mushroom Cap
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="mg1" cx="40%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#ef9a9a"/>
      <stop offset="100%" stop-color="#b71c1c"/>
    </radialGradient>
  </defs>
  <rect x="34" y="46" width="12" height="24" rx="4" fill="#f5f5f5" stroke="#e0e0e0" stroke-width="1"/>
  <rect x="30" y="44" width="20" height="6" rx="2" fill="#eeeeee" stroke="#bdbdbd" stroke-width="0.8"/>
  <path d="M10,50 Q10,20 40,16 Q70,20 70,50 Z" fill="url(#mg1)" stroke="#c62828" stroke-width="1.5"/>
  <circle cx="28" cy="38" r="5" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.8)" stroke-width="0.5"/>
  <circle cx="46" cy="30" r="4" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.8)" stroke-width="0.5"/>
  <circle cx="56" cy="40" r="3.5" fill="rgba(255,255,255,0.5)" stroke="rgba(255,255,255,0.8)" stroke-width="0.5"/>
  <ellipse cx="24" cy="48" rx="8" ry="3" fill="rgba(255,255,255,0.18)" transform="rotate(-30,24,48)"/>
</svg>`;

    case 18: // Sapphire
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="sap1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#90caf9"/>
      <stop offset="50%" stop-color="#1565c0"/>
      <stop offset="100%" stop-color="#0d2e6e"/>
    </linearGradient>
  </defs>
  <polygon points="40,8 64,24 64,56 40,72 16,56 16,24" fill="url(#sap1)" stroke="#0d47a1" stroke-width="1.2"/>
  <polygon points="40,8 16,24 40,38" fill="rgba(255,255,255,0.18)"/>
  <polygon points="40,8 64,24 40,38" fill="rgba(255,255,255,0.08)"/>
  <polygon points="16,56 40,72 64,56 40,38" fill="rgba(0,0,0,0.28)"/>
  <line x1="40" y1="8" x2="40" y2="72" stroke="#1976d2" stroke-width="0.8" opacity="0.5"/>
  <line x1="16" y1="24" x2="64" y2="56" stroke="#1976d2" stroke-width="0.8" opacity="0.4"/>
  <ellipse cx="30" cy="26" rx="8" ry="5" fill="white" opacity="0.25" transform="rotate(-20,30,26)"/>
</svg>`;

    case 19: // Steel Ingot
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="si1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#eceff1"/>
      <stop offset="50%" stop-color="#90a4ae"/>
      <stop offset="100%" stop-color="#546e7a"/>
    </linearGradient>
    <linearGradient id="si2" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#607d8b"/>
      <stop offset="100%" stop-color="#78909c"/>
    </linearGradient>
  </defs>
  <ellipse cx="40" cy="70" rx="28" ry="5" fill="rgba(0,0,0,0.25)"/>
  <polygon points="60,28 70,36 70,58 60,52" fill="url(#si2)"/>
  <polygon points="18,52 60,52 70,58 28,58" fill="#455a64"/>
  <rect x="18" y="28" width="42" height="24" rx="4" fill="url(#si1)" stroke="#78909c" stroke-width="1"/>
  <polygon points="18,28 60,28 70,36 28,36" fill="#cfd8dc"/>
  <line x1="22" y1="36" x2="56" y2="36" stroke="rgba(255,255,255,0.5)" stroke-width="1"/>
  <line x1="22" y1="42" x2="56" y2="42" stroke="rgba(150,180,200,0.3)" stroke-width="0.8"/>
  <line x1="22" y1="48" x2="56" y2="48" stroke="rgba(150,180,200,0.3)" stroke-width="0.8"/>
</svg>`;

    case 20: // Fire Scroll
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="fs1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#ffe0b2"/>
      <stop offset="100%" stop-color="#ffcc80"/>
    </linearGradient>
  </defs>
  <rect x="22" y="18" width="36" height="46" rx="4" fill="url(#fs1)" stroke="#e65100" stroke-width="1.2"/>
  <ellipse cx="22" cy="18" rx="6" ry="18" fill="#ffcc80" stroke="#e65100" stroke-width="1" transform="translate(0,18)"/>
  <ellipse cx="58" cy="18" rx="6" ry="18" fill="#ffb74d" stroke="#e65100" stroke-width="1" transform="translate(0,18)"/>
  <line x1="30" y1="30" x2="50" y2="30" stroke="#bf360c" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
  <line x1="30" y1="38" x2="50" y2="38" stroke="#bf360c" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
  <line x1="30" y1="46" x2="44" y2="46" stroke="#bf360c" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
  <path d="M44,52 Q48,44 44,38 Q50,42 50,50 Q50,58 44,62 Q40,60 40,56 Q42,54 44,52 Z" fill="#ff7043" opacity="0.9"/>
  <path d="M44,56 Q46,52 44,48 Q48,50 47,56 Q46,60 44,62 Q42,60 44,56 Z" fill="#ffcc02" opacity="0.9"/>
</svg>`;

    case 21: // Emerald
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="em1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a5d6a7"/>
      <stop offset="50%" stop-color="#2e7d32"/>
      <stop offset="100%" stop-color="#1b5e20"/>
    </linearGradient>
  </defs>
  <polygon points="28,10 52,10 68,28 68,52 52,70 28,70 12,52 12,28" fill="url(#em1)" stroke="#1b5e20" stroke-width="1.2"/>
  <polygon points="28,10 12,28 28,28" fill="rgba(255,255,255,0.2)"/>
  <polygon points="52,10 68,28 52,28" fill="rgba(255,255,255,0.08)"/>
  <polygon points="12,52 28,70 28,52" fill="rgba(0,0,0,0.2)"/>
  <polygon points="68,52 52,70 52,52" fill="rgba(0,0,0,0.15)"/>
  <line x1="28" y1="10" x2="52" y2="70" stroke="#43a047" stroke-width="0.8" opacity="0.4"/>
  <line x1="12" y1="28" x2="68" y2="52" stroke="#43a047" stroke-width="0.8" opacity="0.35"/>
  <ellipse cx="32" cy="26" rx="9" ry="5" fill="white" opacity="0.25" transform="rotate(-20,32,26)"/>
</svg>`;

    case 22: // Poison Arrow
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pa1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#aed581"/>
      <stop offset="100%" stop-color="#558b2f"/>
    </linearGradient>
  </defs>
  <line x1="16" y1="64" x2="58" y2="22" stroke="#6d4c41" stroke-width="3" stroke-linecap="round"/>
  <polygon points="58,22 48,26 54,32" fill="#78909c" stroke="#546e7a" stroke-width="0.8"/>
  <polygon points="58,22 62,14 66,18" fill="#90a4ae"/>
  <polygon points="16,64 10,72 20,68" fill="#8d6e63" stroke="#6d4c41" stroke-width="0.8"/>
  <circle cx="36" cy="44" r="5" fill="url(#pa1)" stroke="#33691e" stroke-width="0.8"/>
  <circle cx="44" cy="36" r="4" fill="url(#pa1)" stroke="#33691e" stroke-width="0.8"/>
  <path d="M36,49 Q32,56 30,58" stroke="#8bc34a" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  <path d="M44,40 Q46,47 46,50" stroke="#8bc34a" stroke-width="1.5" fill="none" stroke-linecap="round"/>
</svg>`;

    case 23: // Healing Herb
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="hh1" x1="0%" y1="100%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#2e7d32"/>
      <stop offset="100%" stop-color="#66bb6a"/>
    </linearGradient>
  </defs>
  <line x1="40" y1="70" x2="40" y2="30" stroke="#4e342e" stroke-width="2.5" stroke-linecap="round"/>
  <path d="M40,50 Q26,44 22,30 Q22,18 32,16 Q38,14 40,22 Q42,14 48,16 Q58,18 58,30 Q54,44 40,50 Z" fill="url(#hh1)" stroke="#1b5e20" stroke-width="1"/>
  <path d="M40,50 Q38,14 40,22" fill="rgba(255,255,255,0.15)"/>
  <line x1="40" y1="22" x2="32" y2="34" stroke="rgba(200,255,180,0.5)" stroke-width="1" stroke-linecap="round"/>
  <line x1="40" y1="28" x2="48" y2="38" stroke="rgba(200,255,180,0.5)" stroke-width="1" stroke-linecap="round"/>
  <path d="M40,58 Q34,54 30,56 Q26,60 30,64 Q34,68 40,66" stroke="#4e342e" stroke-width="2" fill="none" stroke-linecap="round"/>
  <path d="M40,58 Q46,54 50,56 Q54,60 50,64 Q46,68 40,66" stroke="#4e342e" stroke-width="2" fill="none" stroke-linecap="round"/>
</svg>`;

    case 24: // Mana Crystal
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="mc1" x1="20%" y1="0%" x2="80%" y2="100%">
      <stop offset="0%" stop-color="#e8eaf6"/>
      <stop offset="50%" stop-color="#7986cb"/>
      <stop offset="100%" stop-color="#283593"/>
    </linearGradient>
    <filter id="mc-glow">
      <feGaussianBlur stdDeviation="2.5" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <circle cx="40" cy="40" r="26" fill="rgba(121,134,203,0.15)" filter="url(#mc-glow)"/>
  <polygon points="40,8 50,30 40,36 30,30" fill="url(#mc1)" stroke="#3949ab" stroke-width="1"/>
  <polygon points="40,72 50,50 40,44 30,50" fill="url(#mc1)" stroke="#3949ab" stroke-width="1"/>
  <polygon points="40,8 40,36 30,30" fill="rgba(255,255,255,0.3)"/>
  <polygon points="40,72 40,44 50,50" fill="rgba(0,0,0,0.2)"/>
  <ellipse cx="40" cy="40" rx="4" ry="4" fill="white" opacity="0.7"/>
  <line x1="40" y1="8" x2="40" y2="72" stroke="rgba(255,255,255,0.25)" stroke-width="1"/>
</svg>`;

    case 25: // Shadow Orb
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="so1" cx="35%" cy="30%" r="65%">
      <stop offset="0%" stop-color="#7e57c2"/>
      <stop offset="60%" stop-color="#1a0030"/>
      <stop offset="100%" stop-color="#0a0014"/>
    </radialGradient>
    <filter id="so-glow">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <circle cx="40" cy="42" r="34" fill="rgba(100,0,160,0.2)" filter="url(#so-glow)"/>
  <circle cx="40" cy="42" r="28" fill="url(#so1)" stroke="#4a148c" stroke-width="1.5"/>
  <ellipse cx="30" cy="32" rx="9" ry="6" fill="rgba(200,150,255,0.2)" transform="rotate(-20,30,32)"/>
  <circle cx="40" cy="42" r="28" fill="none" stroke="rgba(180,100,255,0.25)" stroke-width="4"/>
  <path d="M60,18 L62,14 L64,18 L68,20 L64,22 L62,26 L60,22 L56,20 Z" fill="#ce93d8" opacity="0.9" transform="scale(0.55) translate(56,14)"/>
  <path d="M60,18 L62,14 L64,18 L68,20 L64,22 L62,26 L60,22 L56,20 Z" fill="#b39ddb" opacity="0.7" transform="scale(0.4) translate(106,110)"/>
  <path d="M60,18 L62,14 L64,18 L68,20 L64,22 L62,26 L60,22 L56,20 Z" fill="#9575cd" opacity="0.6" transform="scale(0.45) translate(14,120)"/>
</svg>`;

    case 26: // Iron Ore
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="io1" cx="40%" cy="35%" r="60%">
      <stop offset="0%" stop-color="#8d6e63"/>
      <stop offset="100%" stop-color="#3e2723"/>
    </radialGradient>
  </defs>
  <path d="M24,20 Q14,26 14,42 Q14,58 26,66 Q34,72 44,70 Q56,68 64,58 Q72,46 68,32 Q64,18 50,14 Q36,8 24,20 Z" fill="url(#io1)" stroke="#4e342e" stroke-width="1.2"/>
  <ellipse cx="32" cy="28" rx="8" ry="5" fill="rgba(255,255,255,0.1)" transform="rotate(-20,32,28)"/>
  <ellipse cx="52" cy="38" rx="7" ry="5" fill="#78909c" opacity="0.7" stroke="#546e7a" stroke-width="0.8"/>
  <ellipse cx="34" cy="50" rx="6" ry="4" fill="#90a4ae" opacity="0.6" stroke="#607d8b" stroke-width="0.8"/>
  <circle cx="44" cy="54" rx="4" r="4" fill="#78909c" opacity="0.5"/>
</svg>`;

    case 27: // Spider Silk
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="ss1" cx="45%" cy="40%" r="55%">
      <stop offset="0%" stop-color="#f5f5f5"/>
      <stop offset="100%" stop-color="#bdbdbd"/>
    </radialGradient>
  </defs>
  <line x1="40" y1="40" x2="40" y2="10" stroke="rgba(200,200,210,0.6)" stroke-width="1"/>
  <line x1="40" y1="40" x2="66" y2="24" stroke="rgba(200,200,210,0.6)" stroke-width="1"/>
  <line x1="40" y1="40" x2="66" y2="56" stroke="rgba(200,200,210,0.6)" stroke-width="1"/>
  <line x1="40" y1="40" x2="40" y2="70" stroke="rgba(200,200,210,0.6)" stroke-width="1"/>
  <line x1="40" y1="40" x2="14" y2="56" stroke="rgba(200,200,210,0.6)" stroke-width="1"/>
  <line x1="40" y1="40" x2="14" y2="24" stroke="rgba(200,200,210,0.6)" stroke-width="1"/>
  <ellipse cx="40" cy="25" rx="13" ry="8" fill="none" stroke="rgba(200,200,210,0.5)" stroke-width="0.8"/>
  <ellipse cx="40" cy="40" rx="22" ry="14" fill="none" stroke="rgba(200,200,210,0.5)" stroke-width="0.8"/>
  <circle cx="40" cy="40" r="14" fill="url(#ss1)" stroke="#9e9e9e" stroke-width="1.2"/>
  <ellipse cx="34" cy="35" rx="6" ry="4" fill="rgba(255,255,255,0.5)" transform="rotate(-20,34,35)"/>
</svg>`;

    case 28: // Lava Rock
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="lr1" cx="45%" cy="40%" r="58%">
      <stop offset="0%" stop-color="#4a4a4a"/>
      <stop offset="100%" stop-color="#1a1a1a"/>
    </radialGradient>
  </defs>
  <path d="M22,22 Q14,30 14,44 Q14,60 28,68 Q38,74 50,70 Q64,64 68,50 Q72,36 64,24 Q56,12 42,12 Q30,12 22,22 Z" fill="url(#lr1)" stroke="#212121" stroke-width="1.2"/>
  <path d="M30,38 Q36,32 44,36 Q40,44 34,46 Z" fill="#ff5722" opacity="0.85"/>
  <path d="M44,36 Q52,30 58,38 Q54,48 46,48 Z" fill="#ff7043" opacity="0.8"/>
  <path d="M30,52 Q38,46 46,52 Q42,60 36,60 Z" fill="#ff8a65" opacity="0.7"/>
  <path d="M36,32 Q40,26 44,32" stroke="#ffab40" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.7"/>
  <ellipse cx="28" cy="28" rx="7" ry="4" fill="rgba(255,255,255,0.06)" transform="rotate(-25,28,28)"/>
</svg>`;

    case 29: // Moonstone
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="ms1" cx="38%" cy="32%" r="62%">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="40%" stop-color="#cfd8dc"/>
      <stop offset="100%" stop-color="#78909c"/>
    </radialGradient>
    <filter id="ms-glow">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feComposite in="SourceGraphic" in2="blur" operator="over"/>
    </filter>
  </defs>
  <circle cx="40" cy="40" r="30" fill="rgba(200,220,240,0.2)" filter="url(#ms-glow)"/>
  <circle cx="40" cy="40" r="26" fill="url(#ms1)" stroke="#90a4ae" stroke-width="1.2"/>
  <ellipse cx="30" cy="30" rx="12" ry="8" fill="rgba(255,255,255,0.4)" transform="rotate(-25,30,30)"/>
  <ellipse cx="48" cy="50" rx="8" ry="5" fill="rgba(200,220,240,0.3)" transform="rotate(10,48,50)"/>
  <circle cx="40" cy="40" r="26" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="3"/>
</svg>`;

    case 30: // Explosive Powder
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="ep1" cx="50%" cy="30%" r="60%">
      <stop offset="0%" stop-color="#ffcc02"/>
      <stop offset="100%" stop-color="#e65100"/>
    </radialGradient>
  </defs>
  <path d="M18,54 Q22,42 30,38 Q28,36 30,30 Q36,26 40,30 Q44,26 50,30 Q52,36 50,38 Q58,42 62,54 Q66,64 64,70 L16,70 Q14,64 18,54 Z" fill="#8d6e63" stroke="#6d4c41" stroke-width="1.2"/>
  <path d="M28,70 Q30,60 40,56 Q50,60 52,70" fill="#795548" opacity="0.5"/>
  <ellipse cx="40" cy="37" rx="12" ry="8" fill="url(#ep1)" opacity="0.9"/>
  <path d="M34,30 Q36,22 40,18 Q44,22 46,30" stroke="#ff8f00" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.8"/>
  <path d="M60,18 L62,14 L64,18 L68,20 L64,22 L62,26 L60,22 L56,20 Z" fill="#ffcc02" opacity="0.9" transform="scale(0.5) translate(62,8)"/>
  <path d="M60,18 L62,14 L64,18 L68,20 L64,22 L62,26 L60,22 L56,20 Z" fill="#ff7043" opacity="0.8" transform="scale(0.45) translate(22,2)"/>
</svg>`;

    case 31: // Bamboo Staff
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bs1" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#558b2f"/>
      <stop offset="50%" stop-color="#8bc34a"/>
      <stop offset="100%" stop-color="#558b2f"/>
    </linearGradient>
  </defs>
  <rect x="36" y="8" width="8" height="64" rx="4" fill="url(#bs1)" stroke="#33691e" stroke-width="1"/>
  <rect x="34" y="22" width="12" height="4" rx="2" fill="#33691e" opacity="0.7"/>
  <rect x="34" y="38" width="12" height="4" rx="2" fill="#33691e" opacity="0.7"/>
  <rect x="34" y="54" width="12" height="4" rx="2" fill="#33691e" opacity="0.7"/>
  <line x1="40" y1="10" x2="40" y2="70" stroke="rgba(200,255,150,0.3)" stroke-width="2" stroke-linecap="round"/>
  <path d="M44,14 Q54,10 56,14 Q52,18 44,18" fill="#66bb6a" opacity="0.8"/>
  <path d="M44,30 Q58,24 60,30 Q54,36 44,34" fill="#66bb6a" opacity="0.7"/>
</svg>`;

    case 32: // Water Vial
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="wv1" x1="30%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#80deea"/>
      <stop offset="100%" stop-color="#006064"/>
    </linearGradient>
  </defs>
  <rect x="36" y="10" width="8" height="6" rx="2" fill="#8d6e63" stroke="#6d4c41" stroke-width="0.8"/>
  <rect x="37" y="16" width="6" height="8" rx="1" fill="#5b8fa8" stroke="#006064" stroke-width="0.8"/>
  <path d="M30,24 Q26,28 26,40 Q26,58 30,64 Q34,70 40,70 Q46,70 50,64 Q54,58 54,40 Q54,28 50,24 Z" fill="url(#wv1)" stroke="#006064" stroke-width="1.2"/>
  <path d="M30,24 Q26,28 26,40 Q26,58 30,64 Q34,70 40,70 Q46,70 50,64 Q54,58 54,40 Q54,28 50,24 Z" fill="rgba(255,255,255,0.15)"/>
  <path d="M28,38 Q40,42 52,38" stroke="rgba(255,255,255,0.35)" stroke-width="1" fill="none"/>
  <circle cx="34" cy="52" r="3" fill="rgba(255,255,255,0.25)"/>
  <circle cx="46" cy="46" r="2" fill="rgba(255,255,255,0.2)"/>
  <path d="M29,30 Q28,46 30,60" stroke="rgba(255,255,255,0.5)" stroke-width="2" stroke-linecap="round" fill="none"/>
</svg>`;

    case 33: // Dragon Scale
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ds1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ef9a9a"/>
      <stop offset="50%" stop-color="#b71c1c"/>
      <stop offset="100%" stop-color="#4a0000"/>
    </linearGradient>
  </defs>
  <path d="M40,8 Q60,10 68,24 Q78,40 70,58 Q62,72 46,74 Q32,76 22,64 Q10,50 14,34 Q18,16 40,8 Z" fill="url(#ds1)" stroke="#7f0000" stroke-width="1.5"/>
  <path d="M40,8 Q32,16 28,28 Q24,42 28,56 Q32,68 46,74 Q32,76 22,64 Q10,50 14,34 Q18,16 40,8 Z" fill="rgba(0,0,0,0.2)"/>
  <path d="M40,8 Q52,18 54,32 Q54,46 46,58 Q40,66 34,68 Q32,68 28,64 Q24,58 22,50" fill="none" stroke="#ff8a80" stroke-width="1" opacity="0.5"/>
  <ellipse cx="34" cy="22" rx="10" ry="6" fill="rgba(255,255,255,0.15)" transform="rotate(-30,34,22)"/>
  <path d="M50,18 Q58,22 60,32" stroke="#ff5252" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.6"/>
  <path d="M54,36 Q60,40 60,50" stroke="#ff5252" stroke-width="1.5" fill="none" stroke-linecap="round" opacity="0.5"/>
</svg>`;

    case 34: // Cursed Totem
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="ct1" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#4a0072"/>
      <stop offset="100%" stop-color="#1a0030"/>
    </linearGradient>
  </defs>
  <rect x="32" y="48" width="16" height="22" rx="2" fill="url(#ct1)" stroke="#4a148c" stroke-width="1"/>
  <path d="M22,16 Q24,8 40,8 Q56,8 58,16 Q64,26 60,38 Q56,48 40,50 Q24,48 20,38 Q16,26 22,16 Z" fill="url(#ct1)" stroke="#4a148c" stroke-width="1.2"/>
  <ellipse cx="32" cy="30" rx="5" ry="6" fill="#ce93d8" opacity="0.8"/>
  <ellipse cx="48" cy="30" rx="5" ry="6" fill="#ce93d8" opacity="0.8"/>
  <ellipse cx="32" cy="29" rx="2.5" ry="3" fill="#1a0030"/>
  <ellipse cx="48" cy="29" rx="2.5" ry="3" fill="#1a0030"/>
  <path d="M32,40 Q40,46 48,40" stroke="#ce93d8" stroke-width="2" fill="none" stroke-linecap="round"/>
  <line x1="20" y1="22" x2="14" y2="16" stroke="#4a148c" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="20" y1="26" x2="12" y2="24" stroke="#4a148c" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="60" y1="22" x2="66" y2="16" stroke="#4a148c" stroke-width="2.5" stroke-linecap="round"/>
  <line x1="60" y1="26" x2="68" y2="24" stroke="#4a148c" stroke-width="2.5" stroke-linecap="round"/>
</svg>`;

    case 35: // Pine Cone
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pc1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#a1887f"/>
      <stop offset="100%" stop-color="#4e342e"/>
    </linearGradient>
  </defs>
  <line x1="40" y1="8" x2="40" y2="18" stroke="#4e342e" stroke-width="2" stroke-linecap="round"/>
  <path d="M40,18 Q32,20 28,26 Q34,22 40,24 Q46,22 52,26 Q48,20 40,18 Z" fill="url(#pc1)"/>
  <path d="M40,24 Q28,26 24,34 Q32,28 40,32 Q48,28 56,34 Q52,26 40,24 Z" fill="url(#pc1)"/>
  <path d="M40,32 Q26,34 22,44 Q30,36 40,40 Q50,36 58,44 Q54,34 40,32 Z" fill="url(#pc1)"/>
  <path d="M40,40 Q26,42 24,54 Q32,44 40,50 Q48,44 56,54 Q54,42 40,40 Z" fill="url(#pc1)"/>
  <path d="M40,50 Q30,52 30,62 Q36,54 40,58 Q44,54 50,62 Q50,52 40,50 Z" fill="url(#pc1)" stroke="#3e2723" stroke-width="0.5"/>
  <path d="M36,24 Q34,26 36,28" stroke="rgba(255,220,180,0.3)" stroke-width="0.8" fill="none" stroke-linecap="round"/>
  <path d="M44,32 Q46,34 44,36" stroke="rgba(255,220,180,0.3)" stroke-width="0.8" fill="none" stroke-linecap="round"/>
</svg>`;

    case 36: // Amethyst
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="am1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#e1bee7"/>
      <stop offset="50%" stop-color="#8e24aa"/>
      <stop offset="100%" stop-color="#4a0072"/>
    </linearGradient>
  </defs>
  <polygon points="40,8 55,24 55,56 40,72 25,56 25,24" fill="url(#am1)" stroke="#6a0080" stroke-width="1.2"/>
  <polygon points="40,8 25,24 40,24" fill="rgba(255,255,255,0.25)"/>
  <polygon points="40,8 55,24 40,24" fill="rgba(255,255,255,0.1)"/>
  <polygon points="25,56 40,72 40,56" fill="rgba(0,0,0,0.3)"/>
  <polygon points="55,56 40,72 40,56" fill="rgba(0,0,0,0.2)"/>
  <line x1="40" y1="8" x2="40" y2="72" stroke="#9c27b0" stroke-width="0.8" opacity="0.5"/>
  <line x1="25" y1="24" x2="55" y2="56" stroke="#9c27b0" stroke-width="0.8" opacity="0.4"/>
  <ellipse cx="33" cy="28" rx="7" ry="4" fill="white" opacity="0.22" transform="rotate(-20,33,28)"/>
</svg>`;

    case 37: // Acid Flask
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="af1" x1="30%" y1="0%" x2="70%" y2="100%">
      <stop offset="0%" stop-color="#f9fbe7"/>
      <stop offset="100%" stop-color="#827717"/>
    </linearGradient>
  </defs>
  <rect x="33" y="8" width="14" height="8" rx="3" fill="#8d6e63" stroke="#6d4c41" stroke-width="1"/>
  <rect x="35" y="15" width="10" height="10" rx="2" fill="#9e9d24" stroke="#827717" stroke-width="1"/>
  <path d="M26,25 Q20,28 18,40 Q16,56 18,62 Q22,72 40,72 Q58,72 62,62 Q64,56 62,40 Q60,28 54,25 Z" fill="url(#af1)" stroke="#827717" stroke-width="1.5"/>
  <path d="M26,25 Q20,28 18,40 Q16,56 18,62 Q22,72 40,72 Q58,72 62,62 Q64,56 62,40 Q60,28 54,25 Z" fill="rgba(180,220,0,0.15)"/>
  <circle cx="30" cy="56" r="4" fill="rgba(180,220,0,0.35)" stroke="rgba(180,220,0,0.6)" stroke-width="0.8"/>
  <circle cx="46" cy="48" r="3" fill="rgba(180,220,0,0.35)" stroke="rgba(180,220,0,0.6)" stroke-width="0.8"/>
  <circle cx="38" cy="62" r="2.5" fill="rgba(180,220,0,0.3)"/>
  <path d="M25,32 Q24,48 26,60" stroke="rgba(240,255,100,0.5)" stroke-width="2.5" stroke-linecap="round" fill="none"/>
</svg>`;

    case 38: // Coal Chunk
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="cc1" cx="38%" cy="32%" r="58%">
      <stop offset="0%" stop-color="#424242"/>
      <stop offset="100%" stop-color="#111111"/>
    </radialGradient>
  </defs>
  <path d="M26,22 Q16,28 16,44 Q16,60 30,68 Q40,74 52,68 Q66,60 66,44 Q66,28 56,20 Q46,12 34,14 Q28,16 26,22 Z" fill="url(#cc1)" stroke="#212121" stroke-width="1.2"/>
  <ellipse cx="32" cy="28" rx="9" ry="5" fill="rgba(255,255,255,0.06)" transform="rotate(-20,32,28)"/>
  <path d="M30,36 Q36,30 46,34 Q48,38 42,42 Q36,44 32,40 Z" fill="#212121" opacity="0.8"/>
  <path d="M42,46 Q50,42 56,48 Q54,56 48,56 Q42,56 40,50 Z" fill="#212121" opacity="0.7"/>
  <ellipse cx="44" cy="28" rx="6" ry="4" fill="rgba(255,255,255,0.05)" transform="rotate(15,44,28)"/>
</svg>`;

    case 39: // Bone Fragment
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bf1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f5f5f5"/>
      <stop offset="100%" stop-color="#d7ccc8"/>
    </linearGradient>
  </defs>
  <circle cx="22" cy="22" r="10" fill="url(#bf1)" stroke="#bcaaa4" stroke-width="1"/>
  <circle cx="58" cy="58" r="10" fill="url(#bf1)" stroke="#bcaaa4" stroke-width="1"/>
  <circle cx="22" cy="36" r="8" fill="url(#bf1)" stroke="#bcaaa4" stroke-width="1"/>
  <circle cx="58" cy="44" r="8" fill="url(#bf1)" stroke="#bcaaa4" stroke-width="1"/>
  <rect x="22" y="22" width="36" height="36" rx="0" fill="url(#bf1)" transform="rotate(45,40,40) scale(0.5,1) translate(0,0)"/>
  <path d="M28,28 L52,52" stroke="url(#bf1)" stroke-width="12" stroke-linecap="round"/>
  <path d="M28,28 L52,52" stroke="rgba(255,255,255,0.4)" stroke-width="4" stroke-linecap="round"/>
  <ellipse cx="22" cy="26" rx="5" ry="3" fill="rgba(255,255,255,0.4)" transform="rotate(-30,22,26)"/>
  <ellipse cx="58" cy="54" rx="5" ry="3" fill="rgba(255,255,255,0.4)" transform="rotate(-30,58,54)"/>
</svg>`;

    case 40: // Lightning Rod
      return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="lrod1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#eceff1"/>
      <stop offset="100%" stop-color="#607d8b"/>
    </linearGradient>
  </defs>
  <rect x="37" y="8" width="6" height="62" rx="3" fill="url(#lrod1)" stroke="#546e7a" stroke-width="1"/>
  <polygon points="40,6 44,14 36,14" fill="#b0bec5" stroke="#78909c" stroke-width="0.8"/>
  <rect x="28" y="56" width="24" height="6" rx="3" fill="#8d6e63" stroke="#6d4c41" stroke-width="1"/>
  <rect x="32" y="62" width="16" height="8" rx="3" fill="#6d4c41" stroke="#4e342e" stroke-width="0.8"/>
  <polygon points="50,16 44,28 48,28 40,46 56,26 50,26" fill="#fdd835" stroke="#f9a825" stroke-width="0.8" opacity="0.9"/>
  <polygon points="50,16 48,28 56,26" fill="rgba(255,255,255,0.4)" opacity="0.8"/>
  <line x1="58" y1="14" x2="62" y2="10" stroke="#fdd835" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
  <line x1="62" y1="20" x2="68" y2="18" stroke="#fdd835" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
</svg>`;

    default: return `<svg viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><circle cx="40" cy="40" r="30" fill="#333"/></svg>`;
  }
}

// ══════════════════════════════════════════════════
//  HELPERS: pill HTML
// ══════════════════════════════════════════════════
function rarityPill(r) {
  const cls = { Common:'pill-common', Uncommon:'pill-uncommon', Rare:'pill-rare', Legendary:'pill-legendary' };
  return `<span class="pill ${cls[r]}">${r}</span>`;
}
function elementPill(e) {
  const cls = { Nature:'pill-nature', Fire:'pill-fire', Water:'pill-water', Earth:'pill-earth', Dark:'pill-dark', Toxic:'pill-toxic', Ice:'pill-ice', Lightning:'pill-lightning', None:'pill-none' };
  return `<span class="pill ${cls[e]||'pill-none'}">${e}</span>`;
}
function dangerPill(d) {
  const cls = { Safe:'pill-safe', Moderate:'pill-moderate', Dangerous:'pill-dangerous' };
  return `<span class="pill ${cls[d]}">${d}</span>`;
}
function weightPill(w) {
  const cls = { Light:'pill-light', Medium:'pill-medium', Heavy:'pill-heavy' };
  return `<span class="pill ${cls[w]}">${w}</span>`;
}
function usableHtml(u) {
  return u
    ? `<span class="usable-yes">✓ Yes</span>`
    : `<span class="usable-no">✗ No</span>`;
}
function valuePill(v) {
  return `<span class="pill pill-value">🪙 ${v}</span>`;
}
function customPill(val) {
  return `<span class="pill pill-custom">${val}</span>`;
}

// ══════════════════════════════════════════════════
//  CUSTOM FEATURE SYSTEM
// ══════════════════════════════════════════════════
let customFeatures = []; // { name, key, categories, values:{itemId:cat} }
const expandedCards = new Set();
let modalFeatureName = '';
let modalCategories = [];

const FEATURE_OPTIONS = {
  rarity:  ['Common','Uncommon','Rare','Legendary'],
  element: ['Nature','Fire','Water','Earth','Dark','Toxic','Ice','Lightning','None'],
  weight:  ['Light','Medium','Heavy'],
  danger:  ['Safe','Moderate','Dangerous'],
  cat:     ['Consumable','Creature Drop','Gem','Material','Plant','Weapon'],
  usable:  ['Yes','No'],
};

const CATEGORY_PRESET_MAP = {
  craft: [
    ['Weapon Crafting','Potion Crafting','Building Material','Decorative','None'],
    ['Ingredient','Tool','Trade Good','Decoration','Waste'],
  ],
  found: [
    ['Forest','Cave','Town Market','Ocean','Dungeon'],
    ['Jungle','Mountains','Desert','Swamp','Plains'],
  ],
  origin: [
    ['Natural','Magical','Crafted','Ancient','Unknown'],
    ['Wild','Enchanted','Forged','Divine','Mysterious'],
  ],
  combat: [
    ['Attack Boost','Defense Boost','Healing','Negative','No Effect'],
    ['Offensive','Defensive','Support','Debuff','Neutral'],
  ],
  season: [
    ['Spring','Summer','Autumn','Winter','Year-Round'],
    ['Rainy Season','Dry Season','Bloom Season','Harvest Season','Any Season'],
  ],
};

function getPresetsForFeature(name) {
  const n = name.toLowerCase();
  if (n.includes('craft') || n.includes('use') || n.includes('purpose')) return CATEGORY_PRESET_MAP.craft;
  if (n.includes('found') || n.includes('location') || n.includes('habitat') || n.includes('region') || n.includes('biome')) return CATEGORY_PRESET_MAP.found;
  if (n.includes('origin') || n.includes('source')) return CATEGORY_PRESET_MAP.origin;
  if (n.includes('combat') || n.includes('effect') || n.includes('battle') || n.includes('power')) return CATEGORY_PRESET_MAP.combat;
  if (n.includes('season') || n.includes('time') || n.includes('when')) return CATEGORY_PRESET_MAP.season;
  return [
    ['Type A','Type B','Type C','Type D','Type E'],
    ['Low','Medium','High'],
  ];
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_|_$/g,'');
}

// ── MODAL CONTROLS ──
function openAddFeature() {
  modalFeatureName = '';
  document.getElementById('feature-name-input').value = '';
  document.querySelectorAll('#feature-chips .chip').forEach(c => c.classList.remove('selected'));
  document.getElementById('modal-step1').classList.remove('hidden-step');
  document.getElementById('modal-step2').classList.add('hidden-step');
  document.getElementById('feature-modal').classList.remove('hidden');
}
function closeFeatureModal() {
  document.getElementById('feature-modal').classList.add('hidden');
}
function selectFeatureSuggestion(name, btn) {
  document.querySelectorAll('#feature-chips .chip').forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('feature-name-input').value = name;
  modalFeatureName = name;
}
function proceedToCategories() {
  const val = document.getElementById('feature-name-input').value.trim();
  if (!val) { alert('Please enter or pick a feature name.'); return; }
  modalFeatureName = val;
  const key = slugify(val);
  if (customFeatures.some(cf => cf.key === key) || FEATURE_OPTIONS[key]) {
    alert(`"${val}" already exists as a feature!`); return;
  }
  const presets = getPresetsForFeature(val);
  const presetsDiv = document.getElementById('category-presets');
  presetsDiv.innerHTML = presets.map((cats, i) => `
    <div class="preset-option${i===0?' selected':''}" id="preset-opt-${i}" onclick="selectPreset(${i})">
      <strong>${i===0 ? '⭐ Recommended' : `Option ${i+1}`}</strong>
      <div class="cats-preview">${cats.map(c=>`<span class="cat-chip">${c}</span>`).join('')}</div>
    </div>`).join('') + `
    <div class="preset-option" id="preset-opt-custom" onclick="selectCustomPreset()">
      <strong>✏ Create Your Own</strong>
      <div id="custom-cats-placeholder" class="cats-preview" style="color:rgba(192,132,252,0.5);font-size:0.7rem;font-style:italic">Click to define your own categories</div>
      <div id="custom-cats-area" class="custom-cats-area" style="display:none">
        <div class="cats-preview" id="custom-cat-tags"></div>
        <div class="custom-cat-input-row" onclick="event.stopPropagation()">
          <input class="custom-cat-input" id="custom-cat-input" placeholder="Add a category…" onkeydown="customCatKeydown(event)"/>
          <button class="btn-add-cat" onclick="addCustomCat()">+ Add</button>
        </div>
      </div>
    </div>`;
  modalCategories = [...presets[0]];
  document.getElementById('modal-feature-name-display').textContent = `"${val}"`;
  document.getElementById('modal-step1').classList.add('hidden-step');
  document.getElementById('modal-step2').classList.remove('hidden-step');
}
function selectPreset(idx) {
  document.querySelectorAll('.preset-option').forEach(el => el.classList.remove('selected'));
  document.getElementById(`preset-opt-${idx}`).classList.add('selected');
  modalCategories = [...getPresetsForFeature(modalFeatureName)[idx]];
}
function selectCustomPreset() {
  document.querySelectorAll('.preset-option').forEach(el => el.classList.remove('selected'));
  document.getElementById('preset-opt-custom').classList.add('selected');
  document.getElementById('custom-cats-placeholder').style.display = 'none';
  document.getElementById('custom-cats-area').style.display = 'block';
  modalCategories = getCustomCats();
  document.getElementById('custom-cat-input').focus();
}
function getCustomCats() {
  return Array.from(document.querySelectorAll('#custom-cat-tags .cat-tag')).map(t => t.dataset.val);
}
function addCustomCat() {
  const input = document.getElementById('custom-cat-input');
  const val = input.value.trim();
  if (!val) return;
  const tag = document.createElement('span');
  tag.className = 'cat-chip cat-tag';
  tag.dataset.val = val;
  tag.innerHTML = `${val} <button class="remove-cat" onclick="removeCustomCat(this);event.stopPropagation()" title="Remove">×</button>`;
  document.getElementById('custom-cat-tags').appendChild(tag);
  input.value = '';
  modalCategories = getCustomCats();
}
function removeCustomCat(btn) {
  btn.closest('.cat-tag').remove();
  modalCategories = getCustomCats();
}
function customCatKeydown(e) {
  if (e.key === 'Enter') { e.preventDefault(); addCustomCat(); }
}
function backToStep1() {
  document.getElementById('modal-step1').classList.remove('hidden-step');
  document.getElementById('modal-step2').classList.add('hidden-step');
}
function confirmAndInfer() {
  if (!modalCategories.length) { alert('Please add at least one category.'); return; }
  const key = slugify(modalFeatureName);
  const values = {};
  ITEMS.forEach(item => { values[item.id] = inferCategory(item, modalFeatureName, modalCategories); });
  customFeatures.push({ name: modalFeatureName, key, categories: modalCategories, values });
  closeFeatureModal();
  buildCards();
  buildTable();
}

// ── INFERENCE ENGINE ──
function inferCategory(item, featureName, categories) {
  const n = featureName.toLowerCase();
  function best(...candidates) {
    for (const c of candidates) {
      const f = categories.find(cat => cat.toLowerCase() === c.toLowerCase());
      if (f) return f;
    }
    return null;
  }
  if (n.includes('craft') || n.includes('use') || n.includes('purpose')) {
    if (item.cat==='Weapon')    return best('Weapon Crafting','Offensive','Tool') || categories[0];
    if (item.cat==='Consumable'||item.cat==='Plant') return best('Potion Crafting','Ingredient','Support') || categories[1%categories.length];
    if (item.cat==='Creature Drop') return best('Potion Crafting','Ingredient','Trade Good') || categories[1%categories.length];
    if (item.cat==='Gem')       return best('Decorative','Decoration','Trade Good') || categories[categories.length-2];
    if (item.cat==='Material')  return best('Building Material','Ingredient','Trade Good') || categories[2%categories.length];
    return best('None','Neutral','Waste') || categories[categories.length-1];
  }
  if (n.includes('found')||n.includes('location')||n.includes('habitat')||n.includes('biome')||n.includes('region')) {
    const m = {Nature:['Forest','Jungle','Plains'],Fire:['Dungeon','Volcano'],Water:['Ocean','Swamp'],
               Earth:['Cave','Mountains'],Dark:['Dungeon','Cave'],Toxic:['Swamp','Cave'],None:['Town Market','Plains']};
    return best(...(m[item.element]||[])) || categories[item.id%categories.length];
  }
  if (n.includes('origin')||n.includes('source')) {
    if (item.rarity==='Legendary')   return best('Ancient','Divine','Enchanted','Magical') || categories[0];
    if (item.cat==='Weapon')         return best('Crafted','Forged','Enchanted') || categories[0];
    if (item.cat==='Creature Drop')  return best('Unknown','Mysterious','Wild') || categories[categories.length-1];
    if (item.element!=='None'&&item.usable) return best('Magical','Enchanted','Wild') || categories[0];
    return best('Natural','Wild') || categories[0];
  }
  if (n.includes('combat')||n.includes('effect')||n.includes('battle')||n.includes('power')) {
    if (item.cat==='Weapon'||item.danger==='Dangerous') return best('Attack Boost','Offensive','Debuff') || categories[0];
    if (item.cat==='Plant'&&item.danger==='Moderate')   return best('Defense Boost','Defensive','Support') || categories[1%categories.length];
    if (item.usable&&item.danger==='Safe')              return best('Healing','Support','Defensive') || categories[Math.floor(categories.length/2)];
    if (item.element==='Toxic')                         return best('Negative','Debuff','Offensive') || categories[3%categories.length];
    return best('No Effect','Neutral','None') || categories[categories.length-1];
  }
  if (n.includes('season')||n.includes('time')||n.includes('when')) {
    const m = {Nature:['Spring','Bloom Season'],Fire:['Summer','Dry Season'],
               Earth:['Autumn','Harvest Season'],Water:['Winter','Rainy Season']};
    return best(...(m[item.element]||[])) || best('Year-Round','Any Season') || categories[item.id%categories.length];
  }
  return categories[item.id%categories.length];
}

// ── EDIT CATEGORICAL VALUE ──
function startEdit(evt, itemId, featureKey, currentVal) {
  evt.stopPropagation();
  const span = document.getElementById(`fv-${itemId}-${featureKey}`);
  if (!span) return;

  if (featureKey === 'value') {
    const inp = document.createElement('input');
    inp.type = 'number'; inp.min = 0; inp.max = 9999;
    inp.value = currentVal;
    inp.className = 'feat-select';
    inp.style.width = '64px';
    const doSave = () => {
      const newVal = Math.max(0, parseInt(inp.value) || 0);
      const item = ITEMS.find(i=>i.id===itemId);
      if (item) item.value = newVal;
      buildCards();
    };
    inp.onblur  = doSave;
    inp.onkeydown = e => { if (e.key==='Enter') inp.blur(); e.stopPropagation(); };
    inp.onclick = e => e.stopPropagation();
    span.replaceWith(inp);
    inp.focus(); inp.select();
    return;
  }

  const options = FEATURE_OPTIONS[featureKey] ||
    (customFeatures.find(cf=>cf.key===featureKey)||{}).categories || [];
  if (!options.length) return;
  const sel = document.createElement('select');
  sel.className = 'feat-select';
  options.forEach(opt => {
    const o = document.createElement('option');
    o.value = opt; o.textContent = opt; o.selected = (opt===currentVal);
    sel.appendChild(o);
  });
  const doSave = () => {
    const newVal = sel.value;
    const item = ITEMS.find(i=>i.id===itemId);
    if (item && FEATURE_OPTIONS[featureKey]) {
      if (featureKey === 'usable') item.usable = (newVal === 'Yes');
      else item[featureKey] = newVal;
    } else { const cf = customFeatures.find(c=>c.key===featureKey); if (cf) cf.values[itemId] = newVal; }
    buildCards();
  };
  sel.onchange = doSave;
  sel.onblur   = doSave;
  sel.onclick  = e => e.stopPropagation();
  span.replaceWith(sel);
  sel.focus();
}

// ── CARD TOGGLE ──
function toggleCard(evt, cardEl) {
  if (evt.target.closest('.feat-edit-btn') || evt.target.tagName==='SELECT') return;
  const id = Number(cardEl.dataset.itemId);
  cardEl.classList.toggle('expanded');
  if (cardEl.classList.contains('expanded')) expandedCards.add(id);
  else expandedCards.delete(id);
}

function updateSectionLabel() {
  const count = 7 + customFeatures.length;
  const lbl = document.getElementById('section-label');
  if (lbl) lbl.textContent = `10 Items \u2022 ${count} Features Each \u2022 Click a card to expand`;
}

// ══════════════════════════════════════════════════
//  BUILD CARDS
// ══════════════════════════════════════════════════
function buildCards() {
  const grid = document.getElementById('card-grid');
  grid.innerHTML = ITEMS.map(item => {
    const rarityColor = RARITY_COLOR[item.rarity] || '#aaa';
    const glowColor   = ELEMENT_GLOW[item.element] || ELEMENT_GLOW.None;
    const customRows = customFeatures.map(cf => {
      const val = cf.values[item.id] || cf.categories[0];
      return `<div class="feature-row">
        <span class="feature-label">${cf.name}</span>
        <span id="fv-${item.id}-${cf.key}">${customPill(val)}</span>
        <button class="feat-edit-btn" onclick="startEdit(event,${item.id},'${cf.key}','${val.replace(/'/g,"\\'")}')" title="Edit value">✏</button>
      </div>`;
    }).join('');
    return `
<div class="item-card" data-item-id="${item.id}" style="--rarity-color:${rarityColor}; --glow-color:${glowColor}" onclick="toggleCard(event,this)">
  <span class="card-chevron">▼</span>
  <div class="card-icon-area">${svgIcon(item.id)}</div>
  <div class="card-body">
    <div>
      <div class="card-name">${item.name}</div>
      <div class="card-category">${item.cat}</div>
    </div>
    <div class="card-hint">▼ Click to see features</div>
    <div class="card-features">
      <div class="feature-row">
        <span class="feature-label">Rarity</span>
        <span id="fv-${item.id}-rarity">${rarityPill(item.rarity)}</span>
        <button class="feat-edit-btn" onclick="startEdit(event,${item.id},'rarity','${item.rarity}')" title="Edit value">✏</button>
      </div>
      <div class="feature-row">
        <span class="feature-label">Value</span>
        <span id="fv-${item.id}-value">${valuePill(item.value)}</span>
        <button class="feat-edit-btn" onclick="startEdit(event,${item.id},'value',${item.value})" title="Edit value">✏</button>
      </div>
      <div class="feature-row">
        <span class="feature-label">Element</span>
        <span id="fv-${item.id}-element">${elementPill(item.element)}</span>
        <button class="feat-edit-btn" onclick="startEdit(event,${item.id},'element','${item.element}')" title="Edit value">✏</button>
      </div>
      <div class="feature-row">
        <span class="feature-label">Type</span>
        <span id="fv-${item.id}-cat">${customPill(item.cat)}</span>
        <button class="feat-edit-btn" onclick="startEdit(event,${item.id},'cat','${item.cat}')" title="Edit value">✏</button>
      </div>
      <div class="feature-row">
        <span class="feature-label">Weight</span>
        <span id="fv-${item.id}-weight">${weightPill(item.weight)}</span>
        <button class="feat-edit-btn" onclick="startEdit(event,${item.id},'weight','${item.weight}')" title="Edit value">✏</button>
      </div>
      <div class="feature-row">
        <span class="feature-label">Danger</span>
        <span id="fv-${item.id}-danger">${dangerPill(item.danger)}</span>
        <button class="feat-edit-btn" onclick="startEdit(event,${item.id},'danger','${item.danger}')" title="Edit value">✏</button>
      </div>
      <div class="feature-row">
        <span class="feature-label">Usable</span>
        <span id="fv-${item.id}-usable">${usableHtml(item.usable)}</span>
        <button class="feat-edit-btn" onclick="startEdit(event,${item.id},'usable','${item.usable ? 'Yes' : 'No'}')" title="Edit value">✏</button>
      </div>
      ${customRows}
    </div>
  </div>
</div>`;
  }).join('');
  document.querySelectorAll('.item-card').forEach(card => {
    if (expandedCards.has(Number(card.dataset.itemId))) card.classList.add('expanded');
  });
  updateSectionLabel();
}

// ══════════════════════════════════════════════════
//  BUILD TABLE
// ══════════════════════════════════════════════════
function buildTableHeaders() {
  const tr = document.querySelector('#data-table thead tr');
  // Remove any previously added custom feature headers
  tr.querySelectorAll('th[data-custom]').forEach(th => th.remove());
  customFeatures.forEach((cf, i) => {
    const col = 8 + i;
    const th = document.createElement('th');
    th.setAttribute('data-custom', cf.key);
    th.setAttribute('data-col', col);
    th.innerHTML = `${cf.name} <span class="sort-indicator">⇅</span>`;
    th.onclick = () => sortTable(col);
    tr.appendChild(th);
  });
}

function buildTable() {
  buildTableHeaders();
  const tbody = document.getElementById('table-body');
  tbody.innerHTML = ITEMS.map(item => {
    const customCols = customFeatures.map(cf => `<td>${customPill(cf.values[item.id] || cf.categories[0])}</td>`).join('');
    return `
<tr data-id="${item.id}">
  <td>
    <div class="td-item">
      ${svgIcon(item.id)}
      <div class="td-item-text">
        <span class="td-item-name">${item.name}</span>
        <span class="td-item-cat">${item.cat}</span>
      </div>
    </div>
  </td>
  <td>${rarityPill(item.rarity)}</td>
  <td>${valuePill(item.value)}</td>
  <td>${elementPill(item.element)}</td>
  <td>${customPill(item.cat)}</td>
  <td>${weightPill(item.weight)}</td>
  <td>${dangerPill(item.danger)}</td>
  <td>${usableHtml(item.usable)}</td>
  ${customCols}
</tr>`;
  }).join('');
}

// ══════════════════════════════════════════════════
//  SORT
// ══════════════════════════════════════════════════
let sortCol = -1;
let sortDir = 1; // 1=asc, -1=desc

const RARITY_ORDER = { Common:1, Uncommon:2, Rare:3, Legendary:4 };

function sortTable(col) {
  if (sortCol === col) sortDir *= -1;
  else { sortCol = col; sortDir = 1; }

  document.querySelectorAll('#data-table th').forEach((th, i) => {
    th.classList.remove('sorted-asc','sorted-desc');
    const ind = th.querySelector('.sort-indicator');
    if (i === col) {
      th.classList.add(sortDir === 1 ? 'sorted-asc' : 'sorted-desc');
      if (ind) ind.textContent = sortDir === 1 ? '↑' : '↓';
    } else {
      if (ind) ind.textContent = '⇅';
    }
  });

  const data = [...ITEMS];
  data.sort((a, b) => {
    let va, vb;
    switch(col) {
      case 0: va = a.name;    vb = b.name;    break;
      case 1: va = RARITY_ORDER[a.rarity] || 0; vb = RARITY_ORDER[b.rarity] || 0; break;
      case 2: va = a.value;   vb = b.value;   break;
      case 3: va = a.element; vb = b.element; break;
      case 4: va = a.cat;     vb = b.cat;     break;
      case 5: va = a.weight;  vb = b.weight;  break;
      case 6: va = a.danger;  vb = b.danger;  break;
      case 7: va = a.usable ? 1 : 0; vb = b.usable ? 1 : 0; break;
      default: {
        const cf = customFeatures[col - 8];
        if (cf) { va = cf.values[a.id] || cf.categories[0]; vb = cf.values[b.id] || cf.categories[0]; }
        else return 0;
      }
    }
    if (typeof va === 'string') return sortDir * va.localeCompare(vb);
    return sortDir * (va - vb);
  });

  const tbody = document.getElementById('table-body');
  tbody.innerHTML = data.map(item => {
    const customCols = customFeatures.map(cf => `<td>${customPill(cf.values[item.id] || cf.categories[0])}</td>`).join('');
    return `
<tr data-id="${item.id}">
  <td>
    <div class="td-item">
      ${svgIcon(item.id)}
      <div class="td-item-text">
        <span class="td-item-name">${item.name}</span>
        <span class="td-item-cat">${item.cat}</span>
      </div>
    </div>
  </td>
  <td>${rarityPill(item.rarity)}</td>
  <td>${valuePill(item.value)}</td>
  <td>${elementPill(item.element)}</td>
  <td>${customPill(item.cat)}</td>
  <td>${weightPill(item.weight)}</td>
  <td>${dangerPill(item.danger)}</td>
  <td>${usableHtml(item.usable)}</td>
  ${customCols}
</tr>`;
  }).join('');
}

// ══════════════════════════════════════════════════
//  VIEW TOGGLE
// ══════════════════════════════════════════════════
function setView(view) {
  document.getElementById('view-card').classList.toggle('active', view === 'card');
  document.getElementById('view-table').classList.toggle('active', view === 'table');
  document.getElementById('btn-card').classList.toggle('active', view === 'card');
  document.getElementById('btn-table').classList.toggle('active', view === 'table');
}

// ══════════════════════════════════════════════════
//  INIT — ITEMS is declared in data.js
// ══════════════════════════════════════════════════
buildCards();
buildTable();
