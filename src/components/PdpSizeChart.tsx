'use client'

import { useState } from 'react'
import Link from 'next/link'

type Unit = 'in' | 'cm'
type Kind = 'set' | 'top'

const topsData = [
  { size: 'Small',  bust: { in: '34–35"', cm: '86–89 cm' },  band: { in: '29–30"', cm: '73–76 cm' },  waist: { in: '27–28"', cm: '68–71 cm' },  cup: 'B/C'  },
  { size: 'Medium', bust: { in: '36–37"', cm: '91–94 cm' },  band: { in: '31–32"', cm: '78–81 cm' },  waist: { in: '29–30"', cm: '73–76 cm' },  cup: 'C/D'  },
  { size: 'Large',  bust: { in: '38–40"', cm: '96–101 cm' }, band: { in: '33–35"', cm: '83–89 cm' },  waist: { in: '31–33"', cm: '78–83 cm' },  cup: 'D/DD' },
]

const bottomsData = [
  { size: 'Small',  waist: { in: '26–27"', cm: '66–68 cm' }, hips: { in: '36–37"', cm: '91–94 cm' },  jean: '4–6'   },
  { size: 'Medium', waist: { in: '28–30"', cm: '71–76 cm' }, hips: { in: '38–40"', cm: '96–101 cm' }, jean: '8–10'  },
  { size: 'Large',  waist: { in: '31–33"', cm: '78–83 cm' }, hips: { in: '41–43"', cm: '104–109 cm' }, jean: '12–14' },
]

export default function PdpSizeChart({ kind }: { kind: Kind }) {
  const [open, setOpen]   = useState(false)
  const [unit, setUnit]   = useState<Unit>('in')
  const [tab, setTab]     = useState<'top' | 'bottom'>('top')
  const isSet = kind === 'set'

  return (
    <div className="pdp-size-chart">
      <button
        type="button"
        className="pdp-composition-toggle"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
      >
        <span>Size Guide</span>
        <span className="pdp-composition-icon">{open ? '−' : '+'}</span>
      </button>

      {open && (
        <div className="pdp-size-chart-body">
          <div className="pdp-size-chart-controls">
            {isSet && (
              <div className="pdp-size-chart-tabs">
                <button
                  type="button"
                  className={`pdp-size-chart-tab${tab === 'top' ? ' active' : ''}`}
                  onClick={() => setTab('top')}
                >
                  Tops
                </button>
                <button
                  type="button"
                  className={`pdp-size-chart-tab${tab === 'bottom' ? ' active' : ''}`}
                  onClick={() => setTab('bottom')}
                >
                  Bottoms
                </button>
              </div>
            )}
            <div className="pdp-size-chart-unit-toggle">
              {(['in', 'cm'] as Unit[]).map(u => (
                <button
                  key={u}
                  type="button"
                  className={`pdp-size-chart-unit${unit === u ? ' active' : ''}`}
                  onClick={() => setUnit(u)}
                >
                  {u === 'in' ? 'in' : 'cm'}
                </button>
              ))}
            </div>
          </div>

          {/* Tops table — shown for tops and for sets when Tops tab is active */}
          {(!isSet || tab === 'top') && (
            <div className="pdp-size-chart-table-wrap">
              <table className="pdp-size-chart-table">
                <thead>
                  <tr><th>Size</th><th>Bust</th><th>Band</th><th>Waist</th><th>Cup</th></tr>
                </thead>
                <tbody>
                  {topsData.map(r => (
                    <tr key={r.size}>
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
          )}

          {/* Bottoms table — shown for sets when Bottoms tab is active */}
          {isSet && tab === 'bottom' && (
            <div className="pdp-size-chart-table-wrap">
              <table className="pdp-size-chart-table">
                <thead>
                  <tr><th>Size</th><th>Waist</th><th>Hips</th><th>Jean</th></tr>
                </thead>
                <tbody>
                  {bottomsData.map(r => (
                    <tr key={r.size}>
                      <td>{r.size}</td>
                      <td>{r.waist[unit]}</td>
                      <td>{r.hips[unit]}</td>
                      <td>{r.jean}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <Link href="/size-guide" className="pdp-size-chart-fulllink">
            Full size guide →
          </Link>
        </div>
      )}
    </div>
  )
}
