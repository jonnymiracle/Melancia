'use client'

import { useState } from 'react'
import Link from 'next/link'

type Tab = 'tops' | 'bottoms' | 'onepiece'
type Unit = 'in' | 'cm'

const topsData = [
  { size: 'XS', bust: { in: '32–33"', cm: '81–84 cm' }, band: { in: '27–28"', cm: '68–71 cm' }, waist: { in: '25–26"', cm: '63–66 cm' }, cup: 'A/B', popular: false },
  { size: 'S',  bust: { in: '34–35"', cm: '86–89 cm' }, band: { in: '29–30"', cm: '73–76 cm' }, waist: { in: '27–28"', cm: '68–71 cm' }, cup: 'B/C', popular: true  },
  { size: 'M',  bust: { in: '36–37"', cm: '91–94 cm' }, band: { in: '31–32"', cm: '78–81 cm' }, waist: { in: '29–30"', cm: '73–76 cm' }, cup: 'C/D', popular: false },
  { size: 'L',  bust: { in: '38–40"', cm: '96–101 cm'}, band: { in: '33–35"', cm: '83–89 cm' }, waist: { in: '31–33"', cm: '78–83 cm' }, cup: 'D/DD',popular: false },
]

const bottomsData = [
  { size: 'XS', waist: { in: '24–25"', cm: '61–63 cm' }, hips: { in: '34–35"', cm: '86–89 cm' }, jean: '0 – 2',   popular: false },
  { size: 'S',  waist: { in: '26–27"', cm: '66–68 cm' }, hips: { in: '36–37"', cm: '91–94 cm' }, jean: '4 – 6',   popular: true  },
  { size: 'M',  waist: { in: '28–30"', cm: '71–76 cm' }, hips: { in: '38–40"', cm: '96–101 cm'},jean: '8 – 10',  popular: false },
  { size: 'L',  waist: { in: '31–33"', cm: '78–83 cm' }, hips: { in: '41–43"', cm: '104–109 cm'},jean:'12 – 14', popular: false },
]

const onepieceData = [
  { size: 'XS', bust: { in: '32–33"', cm: '81–84 cm' }, waist: { in: '24–25"', cm: '61–63 cm' }, hips: { in: '34–35"', cm: '86–89 cm' }, torso: { in: '25–26"', cm: '63–66 cm' }, popular: false },
  { size: 'S',  bust: { in: '34–35"', cm: '86–89 cm' }, waist: { in: '26–27"', cm: '66–68 cm' }, hips: { in: '36–37"', cm: '91–94 cm' }, torso: { in: '26–27"', cm: '66–68 cm' }, popular: true  },
  { size: 'M',  bust: { in: '36–37"', cm: '91–94 cm' }, waist: { in: '28–30"', cm: '71–76 cm' }, hips: { in: '38–40"', cm: '96–101 cm'}, torso: { in: '27–28"', cm: '68–71 cm' }, popular: false },
  { size: 'L',  bust: { in: '38–40"', cm: '96–101 cm'}, waist: { in: '31–33"', cm: '78–83 cm' }, hips: { in: '41–43"', cm:'104–109 cm'}, torso: { in: '28–30"', cm: '71–76 cm' }, popular: false },
]

function UnitToggle({ unit, setUnit }: { unit: Unit; setUnit: (u: Unit) => void }) {
  return (
    <div className="unit-toggle">
      {(['in', 'cm'] as Unit[]).map(u => (
        <button key={u} className={`unit-btn${unit === u ? ' active' : ''}`} onClick={() => setUnit(u)}>
          {u === 'in' ? 'Inches' : 'CM'}
        </button>
      ))}
    </div>
  )
}

export default function SizeGuidePage() {
  const [tab, setTab] = useState<Tab>('tops')
  const [unit, setUnit] = useState<Unit>('in')

  return (
    <>
      <div className="sg-hero">
        <span className="eyebrow">Find Your Perfect Fit</span>
        <h1>Size Guide</h1>
        <p>Every body is different. Use this guide to find your best Melancia fit — we want you to feel confident from the moment you put it on.</p>
      </div>

      <div className="sg-body">

        {/* Tabs */}
        <div className="sg-tabs">
          {(['tops', 'bottoms', 'onepiece'] as Tab[]).map(t => (
            <button key={t} className={`sg-tab${tab === t ? ' active' : ''}`} onClick={() => setTab(t)}>
              {t === 'tops' ? 'Tops' : t === 'bottoms' ? 'Bottoms' : 'One Pieces'}
            </button>
          ))}
        </div>

        {/* ── TOPS ── */}
        {tab === 'tops' && (
          <div>
            <div className="measure-section">
              <div className="measure-diagram">
                <svg viewBox="0 0 200 380" width="200" height="340" fill="none">
                  <path d="M100 30 C85 30 75 42 75 55 C75 68 83 78 100 80 C117 78 125 68 125 55 C125 42 115 30 100 30Z" fill="#EAD9F8" stroke="#C9A8E8" strokeWidth="1.5"/>
                  <rect x="93" y="78" width="14" height="14" rx="2" fill="#EAD9F8" stroke="#C9A8E8" strokeWidth="1.5"/>
                  <path d="M70 92 C60 92 52 100 50 110 L44 150 C42 162 46 172 56 176 L72 180 L72 260 L128 260 L128 180 L144 176 C154 172 158 162 156 150 L150 110 C148 100 140 92 130 92 Z" fill="#EAD9F8" stroke="#C9A8E8" strokeWidth="1.5"/>
                  <path d="M72 260 L65 340" stroke="#C9A8E8" strokeWidth="1.5"/>
                  <path d="M128 260 L135 340" stroke="#C9A8E8" strokeWidth="1.5"/>
                  <line x1="30" y1="118" x2="170" y2="118" stroke="#F0856E" strokeWidth="1.5" strokeDasharray="4 3"/>
                  <circle cx="30" cy="118" r="3" fill="#F0856E"/>
                  <circle cx="170" cy="118" r="3" fill="#F0856E"/>
                  <text x="174" y="122" fontFamily="sans-serif" fontSize="10" fill="#F0856E" fontWeight="600">Bust</text>
                  <line x1="34" y1="138" x2="166" y2="138" stroke="#C9A8E8" strokeWidth="1.5" strokeDasharray="4 3"/>
                  <circle cx="34" cy="138" r="3" fill="#C9A8E8"/>
                  <text x="170" y="142" fontFamily="sans-serif" fontSize="10" fill="#C9A8E8" fontWeight="600">Band</text>
                  <line x1="38" y1="170" x2="162" y2="170" stroke="#F0856E" strokeWidth="1.5" strokeDasharray="4 3"/>
                  <circle cx="38" cy="170" r="3" fill="#F0856E"/>
                  <text x="166" y="174" fontFamily="sans-serif" fontSize="10" fill="#F0856E" fontWeight="600">Waist</text>
                </svg>
              </div>
              <div className="measure-steps">
                <h3>How to Measure for Tops</h3>
                {[
                  { n: 1, title: 'Bust', desc: 'Measure around the fullest part of your chest, keeping the tape parallel to the ground.' },
                  { n: 2, title: 'Band / Underbust', desc: 'Measure directly under your bust, where a bra band would sit. Keep the tape snug but comfortable.' },
                  { n: 3, title: 'Waist', desc: 'Measure around your natural waist — the narrowest part, usually just above your belly button.' },
                ].map(s => (
                  <div key={s.n} className="measure-step">
                    <div className="step-num">{s.n}</div>
                    <div className="step-content"><h4>{s.title}</h4><p>{s.desc}</p></div>
                  </div>
                ))}
                <div className="measure-tip"><strong>Tip:</strong> Use a soft measuring tape and wear minimal clothing. Take measurements in front of a mirror to keep the tape level.</div>
              </div>
            </div>

            <UnitToggle unit={unit} setUnit={setUnit} />
            <div className="size-table-wrap">
              <table>
                <thead><tr><th>Size</th><th>Bust</th><th>Band</th><th>Waist</th><th>Cup</th></tr></thead>
                <tbody>
                  {topsData.map(r => (
                    <tr key={r.size} className={r.popular ? 'size-highlight' : ''}>
                      <td>{r.size}</td>
                      <td>{r.bust[unit]}</td>
                      <td>{r.band[unit]}</td>
                      <td>{r.waist[unit]}</td>
                      <td>{r.cup}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="fit-notes">
              <div className="fit-note-card"><h4>Between sizes?</h4><ul><li>Size up for more coverage</li><li>Size down for a more supportive fit</li><li>Fuller busts: size up one</li><li>Triangle tops adjust via ties</li></ul></div>
              <div className="fit-note-card"><h4>Style Notes</h4><ul><li>Bandeau styles fit tighter — size up if unsure</li><li>Halter tops are adjustable</li><li>Padding is removable on all padded styles</li><li>All tops stay secure in the water</li></ul></div>
            </div>
          </div>
        )}

        {/* ── BOTTOMS ── */}
        {tab === 'bottoms' && (
          <div>
            <div className="measure-section">
              <div className="measure-diagram">
                <svg viewBox="0 0 200 380" width="200" height="340" fill="none">
                  <path d="M60 80 L60 160 C60 165 65 168 70 168 L130 168 C135 168 140 165 140 160 L140 80 Z" fill="#EAD9F8" stroke="#C9A8E8" strokeWidth="1.5"/>
                  <path d="M55 160 C48 165 44 175 48 185 L60 220 L90 240 L110 240 L140 220 L152 185 C156 175 152 165 145 160 L130 168 L70 168 Z" fill="#EAD9F8" stroke="#C9A8E8" strokeWidth="1.5"/>
                  <path d="M60 220 L50 340" stroke="#C9A8E8" strokeWidth="1.5"/>
                  <path d="M140 220 L150 340" stroke="#C9A8E8" strokeWidth="1.5"/>
                  <line x1="30" y1="100" x2="170" y2="100" stroke="#F0856E" strokeWidth="1.5" strokeDasharray="4 3"/>
                  <circle cx="30" cy="100" r="3" fill="#F0856E"/>
                  <text x="174" y="104" fontFamily="sans-serif" fontSize="10" fill="#F0856E" fontWeight="600">Waist</text>
                  <line x1="26" y1="178" x2="174" y2="178" stroke="#C9A8E8" strokeWidth="1.5" strokeDasharray="4 3"/>
                  <circle cx="26" cy="178" r="3" fill="#C9A8E8"/>
                  <text x="178" y="182" fontFamily="sans-serif" fontSize="10" fill="#C9A8E8" fontWeight="600">Hips</text>
                </svg>
              </div>
              <div className="measure-steps">
                <h3>How to Measure for Bottoms</h3>
                {[
                  { n: 1, title: 'Waist', desc: 'Measure around your natural waist — the narrowest part, usually 1–2 inches above your belly button.' },
                  { n: 2, title: 'Hips', desc: 'Stand with feet together and measure around the fullest part of your hips and seat.' },
                ].map(s => (
                  <div key={s.n} className="measure-step">
                    <div className="step-num">{s.n}</div>
                    <div className="step-content"><h4>{s.title}</h4><p>{s.desc}</p></div>
                  </div>
                ))}
                <div className="measure-tip"><strong>Tip:</strong> For Brazilian cut, we recommend sizing up if you prefer more coverage.</div>
              </div>
            </div>

            <UnitToggle unit={unit} setUnit={setUnit} />
            <div className="size-table-wrap">
              <table>
                <thead><tr><th>Size</th><th>Waist</th><th>Hips</th><th>US Jean Size</th></tr></thead>
                <tbody>
                  {bottomsData.map(r => (
                    <tr key={r.size} className={r.popular ? 'size-highlight' : ''}>
                      <td>{r.size}</td><td>{r.waist[unit]}</td><td>{r.hips[unit]}</td><td>{r.jean}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="fit-notes">
              <div className="fit-note-card"><h4>Coverage Guide</h4><ul><li>Brazilian cut — minimal, cheeky fit</li><li>Classic cut — moderate coverage</li><li>High-waist — full coverage, elongates legs</li><li>Tie-side — adjustable, great for all hips</li></ul></div>
              <div className="fit-note-card"><h4>Fit Tips</h4><ul><li>Size up for fuller coverage in the back</li><li>High-waist styles run true to size</li><li>Brazilian styles can run small — size up if unsure</li><li>Fabric has light stretch</li></ul></div>
            </div>
          </div>
        )}

        {/* ── ONE PIECES ── */}
        {tab === 'onepiece' && (
          <div>
            <div className="measure-section">
              <div className="measure-diagram">
                <svg viewBox="0 0 200 380" width="200" height="340" fill="none">
                  <ellipse cx="100" cy="48" rx="24" ry="26" fill="#EAD9F8" stroke="#C9A8E8" strokeWidth="1.5"/>
                  <rect x="91" y="72" width="18" height="14" rx="3" fill="#EAD9F8" stroke="#C9A8E8" strokeWidth="1.5"/>
                  <path d="M68 86 C56 86 46 96 44 110 L36 155 C33 170 39 182 52 186 L70 190 L70 270 L130 270 L130 190 L148 186 C161 182 167 170 164 155 L156 110 C154 96 144 86 132 86 Z" fill="#EAD9F8" stroke="#C9A8E8" strokeWidth="1.5"/>
                  <line x1="26" y1="116" x2="174" y2="116" stroke="#F0856E" strokeWidth="1.5" strokeDasharray="4 3"/>
                  <circle cx="26" cy="116" r="3" fill="#F0856E"/>
                  <text x="178" y="120" fontFamily="sans-serif" fontSize="9" fill="#F0856E" fontWeight="600">Bust</text>
                  <line x1="30" y1="168" x2="170" y2="168" stroke="#C9A8E8" strokeWidth="1.5" strokeDasharray="4 3"/>
                  <circle cx="30" cy="168" r="3" fill="#C9A8E8"/>
                  <text x="174" y="172" fontFamily="sans-serif" fontSize="9" fill="#C9A8E8" fontWeight="600">Waist</text>
                  <line x1="26" y1="196" x2="174" y2="196" stroke="#F0856E" strokeWidth="1.5" strokeDasharray="4 3"/>
                  <circle cx="26" cy="196" r="3" fill="#F0856E"/>
                  <text x="178" y="200" fontFamily="sans-serif" fontSize="9" fill="#F0856E" fontWeight="600">Hips</text>
                </svg>
              </div>
              <div className="measure-steps">
                <h3>How to Measure for One Pieces</h3>
                {[
                  { n: 1, title: 'Bust', desc: 'Measure around the fullest part of your chest.' },
                  { n: 2, title: 'Waist', desc: 'Measure your natural waist — the narrowest point above your belly button.' },
                  { n: 3, title: 'Hips', desc: 'Measure around the fullest part of your hips with feet together.' },
                  { n: 4, title: 'Torso Length', desc: 'Measure from your shoulder (at the neck) straight down to your crotch. Key for avoiding pulling.' },
                ].map(s => (
                  <div key={s.n} className="measure-step">
                    <div className="step-num">{s.n}</div>
                    <div className="step-content"><h4>{s.title}</h4><p>{s.desc}</p></div>
                  </div>
                ))}
                <div className="measure-tip"><strong>Tip:</strong> For one-pieces, torso length matters most. Long torso? Size up. Short torso? Size down or look for adjustable strap styles.</div>
              </div>
            </div>

            <UnitToggle unit={unit} setUnit={setUnit} />
            <div className="size-table-wrap">
              <table>
                <thead><tr><th>Size</th><th>Bust</th><th>Waist</th><th>Hips</th><th>Torso</th></tr></thead>
                <tbody>
                  {onepieceData.map(r => (
                    <tr key={r.size} className={r.popular ? 'size-highlight' : ''}>
                      <td>{r.size}</td><td>{r.bust[unit]}</td><td>{r.waist[unit]}</td><td>{r.hips[unit]}</td><td>{r.torso[unit]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="fit-notes">
              <div className="fit-note-card"><h4>One Piece Tips</h4><ul><li>Torso length is the most important measurement</li><li>Long torso? Size up or choose adjustable-strap styles</li><li>Short torso? Size down or choose styles with ruching</li><li>Plunge styles add visual length to the torso</li></ul></div>
              <div className="fit-note-card"><h4>Fit Check</h4><ul><li>Straps should lie flat without digging in</li><li>The crotch lining should sit flush — no pulling</li><li>Sides should be smooth with no gaping</li><li>You should be able to move freely</li></ul></div>
            </div>
          </div>
        )}

        {/* Model Info */}
        <div className="model-info">
          <div className="model-info-text">
            <h3>How our model is styled</h3>
            <p>Our campaign model is wearing size S in tops and S in bottoms.</p>
          </div>
          <div className="model-stats">
            {[["5'8\"", 'Height'], ['34"', 'Bust'], ['26"', 'Waist'], ['36"', 'Hips'], ['Size S', 'Wearing']].map(([val, label]) => (
              <div key={label} className="model-stat"><strong>{val}</strong><span>{label}</span></div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="sg-cta">
          <h3>Still not sure?</h3>
          <p>Our team is happy to help you find the perfect fit — just send us a message.</p>
          <div className="sg-cta-btns">
            <Link href="/shop" className="btn btn-primary">Shop Now</Link>
            <Link href="/contact" className="btn btn-outline">Ask Us</Link>
          </div>
        </div>

      </div>
    </>
  )
}
