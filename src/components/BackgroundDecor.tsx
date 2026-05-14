export default function BackgroundDecor() {
  return (
    <div className="bg-decor" aria-hidden="true">

      {/* Watermelon slice — top left */}
      <svg className="bg-shape bg-scallop" viewBox="0 0 120 80" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 70 Q60 5 110 70 Z" fill="none"/>
        <path d="M10 70 Q60 5 110 70" strokeWidth="3"/>
        <path d="M18 70 Q60 18 102 70" strokeWidth="1.2" opacity="0.5"/>
        <line x1="35" y1="65" x2="30" y2="45" strokeWidth="1.5"/>
        <line x1="50" y1="68" x2="47" y2="38" strokeWidth="1.5"/>
        <line x1="65" y1="68" x2="63" y2="38" strokeWidth="1.5"/>
        <line x1="80" y1="65" x2="78" y2="45" strokeWidth="1.5"/>
        <circle cx="33" cy="48" r="2.5" fill="currentColor" stroke="none"/>
        <circle cx="52" cy="40" r="2.5" fill="currentColor" stroke="none"/>
        <circle cx="68" cy="40" r="2.5" fill="currentColor" stroke="none"/>
        <circle cx="83" cy="48" r="2.5" fill="currentColor" stroke="none"/>
      </svg>

      {/* Wave — upper right */}
      <svg className="bg-shape bg-starfish" viewBox="0 0 120 60" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
        <path d="M5 40 Q20 20 35 40 Q50 60 65 40 Q80 20 95 40 Q110 60 120 45"/>
        <path d="M0 25 Q15 8 30 25 Q45 42 60 25 Q75 8 90 25 Q105 42 118 30" strokeWidth="1.5" opacity="0.55"/>
        <path d="M8 52 Q20 42 32 52 Q44 62 56 52 Q68 42 80 52" strokeWidth="1.2" opacity="0.35"/>
      </svg>

      {/* Sun — mid left */}
      <svg className="bg-shape bg-palm" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
        <circle cx="50" cy="50" r="18"/>
        <line x1="50" y1="8" x2="50" y2="20"/>
        <line x1="50" y1="80" x2="50" y2="92"/>
        <line x1="8" y1="50" x2="20" y2="50"/>
        <line x1="80" y1="50" x2="92" y2="50"/>
        <line x1="21" y1="21" x2="29" y2="29"/>
        <line x1="71" y1="71" x2="79" y2="79"/>
        <line x1="79" y1="21" x2="71" y2="29"/>
        <line x1="29" y1="71" x2="21" y2="79"/>
        <line x1="50" y1="14" x2="50" y2="20" strokeWidth="1"/>
        <circle cx="50" cy="50" r="9" strokeWidth="1.2" opacity="0.45"/>
      </svg>

      {/* Flamingo — mid right */}
      <svg className="bg-shape bg-conch" viewBox="0 0 70 130" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M35 12 Q42 8 46 14 Q48 20 40 22 Q34 22 32 18 Q30 13 35 12Z"/>
        <path d="M40 22 Q52 28 52 44 Q52 58 38 62 Q32 64 28 58"/>
        <path d="M38 62 Q36 80 38 98 Q40 112 36 118"/>
        <path d="M36 118 Q30 122 26 118 Q28 116 36 118Z"/>
        <path d="M38 98 Q44 108 50 104 Q52 100 48 96"/>
        <path d="M28 58 Q18 54 16 44 Q14 36 22 34"/>
        <circle cx="43" cy="14" r="2" fill="currentColor" stroke="none"/>
      </svg>

      {/* Hibiscus flower — lower left */}
      <svg className="bg-shape bg-spiral" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 50 Q44 30 50 12 Q56 30 50 50Z"/>
        <path d="M50 50 Q70 44 88 50 Q70 56 50 50Z"/>
        <path d="M50 50 Q56 70 50 88 Q44 70 50 50Z"/>
        <path d="M50 50 Q30 56 12 50 Q30 44 50 50Z"/>
        <path d="M50 50 Q38 38 26 26 Q40 36 50 50Z" opacity="0.7"/>
        <path d="M50 50 Q62 38 74 26 Q60 36 50 50Z" opacity="0.7"/>
        <path d="M50 50 Q62 62 74 74 Q60 64 50 50Z" opacity="0.7"/>
        <path d="M50 50 Q38 62 26 74 Q40 64 50 50Z" opacity="0.7"/>
        <circle cx="50" cy="50" r="7" strokeWidth="2.2"/>
        <circle cx="50" cy="50" r="3" fill="currentColor" stroke="none"/>
      </svg>

      {/* Hibiscus — center faint */}
      <svg className="bg-shape bg-hibiscus" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 50 Q44 30 50 12 Q56 30 50 50Z"/>
        <path d="M50 50 Q70 44 88 50 Q70 56 50 50Z"/>
        <path d="M50 50 Q56 70 50 88 Q44 70 50 50Z"/>
        <path d="M50 50 Q30 56 12 50 Q30 44 50 50Z"/>
        <circle cx="50" cy="50" r="6"/>
        <circle cx="50" cy="50" r="2.5" fill="currentColor" stroke="none"/>
      </svg>

      {/* Watermelon full — bottom right */}
      <svg className="bg-shape bg-fish" viewBox="0 0 160 100" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 85 Q80 5 145 85 Z"/>
        <path d="M15 85 Q80 5 145 85" strokeWidth="3.5"/>
        <path d="M25 85 Q80 18 135 85" strokeWidth="1.5" opacity="0.5"/>
        <path d="M35 85 Q80 32 125 85" strokeWidth="1" opacity="0.3"/>
        <line x1="45" y1="80" x2="40" y2="55" strokeWidth="1.8"/>
        <line x1="65" y1="84" x2="61" y2="50" strokeWidth="1.8"/>
        <line x1="85" y1="85" x2="82" y2="50" strokeWidth="1.8"/>
        <line x1="105" y1="84" x2="103" y2="55" strokeWidth="1.8"/>
        <line x1="118" y1="80" x2="118" y2="58" strokeWidth="1.8"/>
        <circle cx="43" cy="60" r="3" fill="currentColor" stroke="none"/>
        <circle cx="65" cy="53" r="3" fill="currentColor" stroke="none"/>
        <circle cx="85" cy="52" r="3" fill="currentColor" stroke="none"/>
        <circle cx="105" cy="58" r="3" fill="currentColor" stroke="none"/>
        <circle cx="120" cy="62" r="3" fill="currentColor" stroke="none"/>
      </svg>

    </div>
  )
}
