export default function BackgroundDecor() {
  return (
    <div className="bg-decor" aria-hidden="true">

      {/* Scallop Shell — top left */}
      <svg className="bg-shape bg-scallop" viewBox="0 0 100 95" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 88 C22 88 5 70 5 50 Q5 22 50 8 Q95 22 95 50 C95 70 78 88 50 88Z"/>
        <line x1="50" y1="88" x2="8" y2="46"/>
        <line x1="50" y1="88" x2="22" y2="18"/>
        <line x1="50" y1="88" x2="50" y2="8"/>
        <line x1="50" y1="88" x2="78" y2="18"/>
        <line x1="50" y1="88" x2="92" y2="46"/>
        <path d="M35 85 Q50 94 65 85"/>
      </svg>

      {/* Starfish — upper right */}
      <svg className="bg-shape bg-starfish" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 10 Q55 28 60 36 Q74 34 88 38 Q74 46 68 54 Q74 68 72 82 Q60 72 50 68 Q40 72 28 82 Q26 68 32 54 Q26 46 12 38 Q26 34 40 36 Q45 28 50 10Z"/>
        <circle cx="50" cy="22" r="2.5" fill="currentColor" stroke="none"/>
        <circle cx="76" cy="42" r="2" fill="currentColor" stroke="none"/>
        <circle cx="65" cy="72" r="2" fill="currentColor" stroke="none"/>
        <circle cx="35" cy="72" r="2" fill="currentColor" stroke="none"/>
        <circle cx="24" cy="42" r="2" fill="currentColor" stroke="none"/>
      </svg>

      {/* Palm Tree — mid left */}
      <svg className="bg-shape bg-palm" viewBox="0 0 80 130" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M40 125 Q38 100 36 80 Q34 60 40 38" strokeWidth="3.5"/>
        <path d="M40 38 Q20 22 2 28 Q12 16 38 32"/>
        <path d="M40 38 Q32 10 52 4 Q54 20 42 34"/>
        <path d="M40 38 Q58 16 76 20 Q68 32 44 36"/>
        <path d="M40 38 Q52 28 66 38 Q58 44 43 40"/>
        <path d="M40 38 Q18 34 8 46 Q16 42 38 40"/>
        <circle cx="40" cy="40" r="4" fill="currentColor" stroke="none"/>
        <circle cx="44" cy="44" r="3" fill="currentColor" stroke="none"/>
      </svg>

      {/* Conch Shell — mid right */}
      <svg className="bg-shape bg-conch" viewBox="0 0 80 120" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M38 8 Q55 5 68 22 Q80 40 75 60 Q70 80 55 90 Q62 102 58 114 Q48 120 40 112 Q36 102 46 90 Q28 78 20 62 Q10 44 18 28 Q26 14 38 8Z"/>
        <path d="M40 14 Q58 26 64 48 Q66 64 56 78" strokeWidth="1.8"/>
        <path d="M30 28 Q46 38 52 58 Q54 72 46 84" strokeWidth="1.4"/>
        <path d="M38 8 Q32 2 40 0 Q48 0 50 8" strokeWidth="1.8"/>
      </svg>

      {/* Spiral Shell — lower left */}
      <svg className="bg-shape bg-spiral" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 8 Q82 8 90 38 Q98 62 80 80 Q62 95 38 88 Q14 80 8 58 Q2 36 18 20 Q32 6 50 8Z"/>
        <path d="M50 50 Q66 34 74 50 Q80 66 66 76 Q52 84 40 74 Q28 62 34 48 Q40 34 53 32" strokeWidth="1.8"/>
        <path d="M50 50 Q56 44 60 50 Q63 57 58 62 Q52 65 47 61 Q43 55 46 50 Q48 44 50 50" strokeWidth="1.4"/>
      </svg>

      {/* Hibiscus — center */}
      <svg className="bg-shape bg-hibiscus" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M50 50 Q38 18 50 5 Q62 18 50 50Z"/>
        <path d="M50 50 Q82 38 95 50 Q82 62 50 50Z"/>
        <path d="M50 50 Q62 82 50 95 Q38 82 50 50Z"/>
        <path d="M50 50 Q18 62 5 50 Q18 38 50 50Z"/>
        <circle cx="50" cy="50" r="8"/>
        <circle cx="50" cy="50" r="3" fill="currentColor" stroke="none"/>
        <path d="M50 42 Q53 36 57 32 M50 42 Q47 36 43 32" strokeWidth="1.5"/>
      </svg>

      {/* Tribal Fish — bottom right */}
      <svg className="bg-shape bg-fish" viewBox="0 0 130 70" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M95 35 Q84 14 52 12 Q20 12 8 35 Q20 58 52 58 Q84 56 95 35Z"/>
        <path d="M95 35 Q110 20 125 28 Q112 35 125 42 Q110 50 95 35Z"/>
        <circle cx="26" cy="30" r="5"/>
        <circle cx="26" cy="30" r="2" fill="currentColor" stroke="none"/>
        <path d="M52 13 L47 22 L54 30 L47 38 L54 46 L49 56" strokeWidth="1.8"/>
        <path d="M66 12 L61 21 L68 29 L61 37 L68 45 L63 56" strokeWidth="1.8"/>
        <path d="M80 16 L75 25 L82 33 L75 41 L82 49 L77 56" strokeWidth="1.8"/>
        <path d="M42 12 Q52 2 62 12" strokeWidth="2"/>
        <path d="M42 58 Q52 68 62 58" strokeWidth="2"/>
      </svg>

    </div>
  )
}
