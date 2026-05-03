export default function BackgroundDecor() {
  return (
    <div className="bg-decor" aria-hidden="true">
      {/* Coral branch — bottom right */}
      <svg className="bg-decor-shape bg-decor-coral-right" viewBox="0 0 200 220" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 220 C100 220 98 180 95 160 C92 140 80 130 70 110 C60 90 62 70 58 50 C55 35 45 25 40 10" stroke="currentColor" strokeWidth="8" strokeLinecap="round"/>
        <path d="M95 160 C85 150 65 148 50 135 C38 124 35 108 28 98" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/>
        <path d="M50 135 C44 120 46 105 40 92" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
        <path d="M70 110 C80 98 90 85 88 68 C86 55 78 46 80 30" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
        <path d="M88 68 C98 60 112 58 120 45 C126 36 122 22 128 12" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
        <path d="M95 160 C108 155 125 158 138 148 C148 140 150 126 158 118" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
        <path d="M138 148 C142 135 140 120 148 110" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round"/>
        <path d="M58 50 C48 42 36 40 28 28 C22 18 24 6 18 0" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
      </svg>

      {/* Coral branch — top left */}
      <svg className="bg-decor-shape bg-decor-coral-left" viewBox="0 0 180 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M80 200 C80 200 82 165 85 145 C88 125 100 115 108 96 C116 77 112 58 116 40 C119 25 128 15 132 2" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/>
        <path d="M85 145 C95 135 115 133 128 120 C140 109 143 94 150 84" stroke="currentColor" strokeWidth="6" strokeLinecap="round"/>
        <path d="M108 96 C98 84 88 72 90 55 C92 42 100 34 98 18" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round"/>
        <path d="M85 145 C72 140 56 143 44 132 C34 124 32 110 24 102" stroke="currentColor" strokeWidth="5.5" strokeLinecap="round"/>
        <path d="M44 132 C40 118 42 103 36 90" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/>
      </svg>

      {/* Organic blob — bottom left */}
      <svg className="bg-decor-shape bg-decor-blob-left" viewBox="0 0 180 160" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 120 C0 100 5 70 20 55 C35 40 55 45 70 35 C85 25 90 5 110 2 C130 -1 148 15 155 35 C162 55 155 78 145 92 C135 106 115 108 100 118 C85 128 75 148 58 152 C41 156 25 135 20 120Z"/>
      </svg>

      {/* Swallow / bird shape — top right area */}
      <svg className="bg-decor-shape bg-decor-bird" viewBox="0 0 160 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M80 50 C65 35 30 15 5 20 C20 25 35 38 42 50 C35 38 15 30 0 40 C20 42 45 52 55 65 C45 55 25 55 10 65 C30 62 55 70 65 82 C58 70 50 55 55 45 C60 35 75 30 80 50Z"/>
        <path d="M80 50 C95 35 130 15 155 20 C140 25 125 38 118 50 C125 38 145 30 160 40 C140 42 115 52 105 65 C115 55 135 55 150 65 C130 62 105 70 95 82 C102 70 110 55 105 45 C100 35 85 30 80 50Z"/>
      </svg>

      {/* Small sparkle stars */}
      <svg className="bg-decor-shape bg-decor-stars" viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 20 L22 14 L24 20 L30 22 L24 24 L22 30 L20 24 L14 22Z"/>
        <path d="M70 60 L72 54 L74 60 L80 62 L74 64 L72 70 L70 64 L64 62Z"/>
        <path d="M50 10 L51 6 L52 10 L56 11 L52 12 L51 16 L50 12 L46 11Z"/>
      </svg>

      {/* Organic blob — top right */}
      <svg className="bg-decor-shape bg-decor-blob-right" viewBox="0 0 150 130" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M130 20 C148 38 148 68 135 85 C122 102 95 105 78 98 C61 91 50 72 42 55 C34 38 28 18 40 7 C52 -4 72 5 90 8 C108 11 118 8 130 20Z"/>
      </svg>

      {/* Seaweed / wavy stem — bottom center */}
      <svg className="bg-decor-shape bg-decor-seaweed" viewBox="0 0 60 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 200 C30 200 20 175 28 155 C36 135 48 125 40 105 C32 85 18 78 22 58 C26 38 42 30 38 12 C36 4 28 0 28 0" stroke="currentColor" strokeWidth="7" strokeLinecap="round"/>
        <path d="M28 155 C18 145 5 142 2 128 C-1 115 8 104 4 92" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
        <path d="M40 105 C50 95 58 82 54 68" stroke="currentColor" strokeWidth="5" strokeLinecap="round"/>
      </svg>
    </div>
  )
}
