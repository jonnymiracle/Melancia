export default function BackgroundDecor() {
  return (
    <div className="bg-decor" aria-hidden="true">

      {/* ── Blob 1 — large organic shape, left center (like the flame/smoke left of logo) ── */}
      <svg className="bg-decor-shape bg-blob-1" viewBox="0 0 300 400" xmlns="http://www.w3.org/2000/svg">
        <path d="
          M180 380
          C160 370 130 355 110 330
          C85 300 90 265 75 240
          C55 210 20 200 10 170
          C-5 135 15 95 40 70
          C65 45 100 40 125 20
          C148 2 160 -10 185 8
          C210 25 215 60 220 90
          C225 120 215 145 225 170
          C238 200 268 210 275 240
          C282 268 265 300 248 322
          C228 348 200 390 180 380Z
        " fill="currentColor"/>
      </svg>

      {/* ── Blob 2 — upper right cloud/wave shape ── */}
      <svg className="bg-decor-shape bg-blob-2" viewBox="0 0 350 300" xmlns="http://www.w3.org/2000/svg">
        <path d="
          M340 10
          C320 -5 285 5 260 25
          C235 45 230 75 210 90
          C185 108 150 100 125 118
          C95 138 85 170 65 188
          C40 210 5 215 2 240
          C-2 265 25 285 55 290
          C85 295 115 278 145 268
          C178 256 205 248 235 238
          C265 228 295 220 318 200
          C342 178 355 148 350 118
          C345 88 360 28 340 10Z
        " fill="currentColor"/>
      </svg>

      {/* ── Blob 3 — bottom right organic tendril shape ── */}
      <svg className="bg-decor-shape bg-blob-3" viewBox="0 0 280 320" xmlns="http://www.w3.org/2000/svg">
        <path d="
          M260 320
          C240 305 210 290 195 265
          C178 238 190 208 180 182
          C168 152 138 138 128 108
          C118 78 132 42 115 18
          C100 -5 65 -5 45 15
          C22 38 25 72 18 100
          C10 130 -5 155 2 185
          C10 215 38 230 48 258
          C58 285 48 315 68 328
          C90 342 120 325 148 318
          C178 310 210 320 235 318
          C258 316 278 335 260 320Z
        " fill="currentColor"/>
      </svg>

      {/* ── Blob 4 — small wisp top left ── */}
      <svg className="bg-decor-shape bg-blob-4" viewBox="0 0 220 260" xmlns="http://www.w3.org/2000/svg">
        <path d="
          M30 10
          C55 -5 90 5 112 28
          C135 52 132 85 148 108
          C165 133 195 140 205 168
          C215 196 200 228 178 242
          C155 257 122 250 98 238
          C72 225 55 202 38 178
          C18 150 5 118 2 88
          C-2 55 5 25 30 10Z
        " fill="currentColor"/>
      </svg>

      {/* ── Blob 5 — bottom left tendril ── */}
      <svg className="bg-decor-shape bg-blob-5" viewBox="0 0 260 300" xmlns="http://www.w3.org/2000/svg">
        <path d="
          M10 290
          C-5 265 5 232 22 208
          C40 182 68 172 82 148
          C98 120 92 85 112 62
          C132 38 168 30 192 48
          C218 68 222 105 218 135
          C214 162 198 182 198 210
          C198 238 215 262 205 285
          C195 308 165 318 138 312
          C108 306 80 320 55 312
          C28 304 25 315 10 290Z
        " fill="currentColor"/>
      </svg>

      {/* ── Coral branch right — brand motif from tag sample ── */}
      <svg className="bg-decor-shape bg-coral-right" viewBox="0 0 140 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M70 195 C70 195 68 158 65 138 C62 118 50 108 42 88 C33 67 36 47 32 28 C30 16 22 8 18 0" stroke="currentColor" strokeWidth="7" strokeLinecap="round" fill="none"/>
        <path d="M65 138 C55 128 36 126 23 113 C12 102 10 86 4 76" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <path d="M42 88 C52 76 62 63 60 47 C58 34 50 26 52 12" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d="M60 47 C70 40 82 38 88 26 C94 16 90 4 95 0" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <path d="M65 138 C78 133 94 136 106 126 C115 118 116 105 124 97" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d="M106 126 C110 113 108 99 115 89" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
        <path d="M32 28 C22 20 12 18 6 8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none"/>
      </svg>

      {/* ── Coral branch left — mirrored ── */}
      <svg className="bg-decor-shape bg-coral-left" viewBox="0 0 140 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M70 195 C70 195 72 158 75 138 C78 118 90 108 98 88 C107 67 104 47 108 28 C110 16 118 8 122 0" stroke="currentColor" strokeWidth="7" strokeLinecap="round" fill="none"/>
        <path d="M75 138 C85 128 104 126 117 113 C128 102 130 86 136 76" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none"/>
        <path d="M98 88 C88 76 78 63 80 47 C82 34 90 26 88 12" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d="M75 138 C62 133 46 136 34 126 C25 118 24 105 16 97" stroke="currentColor" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <path d="M34 126 C30 113 32 99 25 89" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
      </svg>

      {/* ── Sparkle stars — brand motif ── */}
      <svg className="bg-decor-shape bg-stars-1" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
        <path d="M40 5 L43 32 L70 35 L43 38 L40 65 L37 38 L10 35 L37 32Z" fill="currentColor"/>
      </svg>

      <svg className="bg-decor-shape bg-stars-2" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 3 L27 20 L44 22 L27 24 L25 41 L23 24 L6 22 L23 20Z" fill="currentColor"/>
      </svg>

      <svg className="bg-decor-shape bg-stars-3" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2 L22 16 L36 18 L22 20 L20 34 L18 20 L4 18 L18 16Z" fill="currentColor"/>
      </svg>

    </div>
  )
}
