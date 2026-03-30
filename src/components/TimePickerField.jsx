import { useState, useEffect, useRef } from 'react'

const HOURS   = Array.from({ length: 24 }, (_, i) => i)
const MINUTES = Array.from({ length: 12 }, (_, i) => i * 5)
const ITEM_H  = 44   // px — height of each wheel item

function pad(n) { return String(n).padStart(2, '0') }

function toDisplay(val) {
  if (!val) return ''
  const [hStr, mStr] = val.split(':')
  const h      = parseInt(hStr, 10)
  const period = h < 12 ? 'AM' : 'PM'
  const h12    = h === 0 ? 12 : h > 12 ? h - 12 : h
  return `${h12}:${mStr} ${period}`
}

function parseVal(val) {
  if (!val) return { h: 9, mIdx: 0 }
  const [hStr, mStr] = val.split(':')
  const h    = parseInt(hStr, 10)
  const m    = parseInt(mStr, 10)
  const mIdx = MINUTES.indexOf(Math.round(m / 5) * 5 % 60)
  return { h: isNaN(h) ? 9 : h, mIdx: mIdx >= 0 ? mIdx : 0 }
}

export default function TimePickerField({
  id, value, onChange, hasError, placeholder = 'Select time',
}) {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)
  const hRef    = useRef(null)
  const mRef    = useRef(null)

  /* scroll columns to the value's position whenever popup opens */
  useEffect(() => {
    if (!open) return
    const { h, mIdx } = parseVal(value)
    requestAnimationFrame(() => {
      if (hRef.current) hRef.current.scrollTop = h    * ITEM_H
      if (mRef.current) mRef.current.scrollTop = mIdx * ITEM_H
    })
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  /* lock body scroll on mobile when open */
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else      document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  /* close on outside click (desktop) */
  useEffect(() => {
    if (!open) return
    const fn = e => { if (!wrapRef.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', fn)
    return () => document.removeEventListener('mousedown', fn)
  }, [open])

  /* close on Escape */
  useEffect(() => {
    if (!open) return
    const fn = e => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', fn)
    return () => document.removeEventListener('keydown', fn)
  }, [open])

  function confirm() {
    const hIdx  = Math.min(Math.round((hRef.current?.scrollTop ?? 0) / ITEM_H), HOURS.length   - 1)
    const mIdx_ = Math.min(Math.round((mRef.current?.scrollTop ?? 0) / ITEM_H), MINUTES.length - 1)
    onChange(`${pad(HOURS[hIdx])}:${pad(MINUTES[mIdx_])}`)
    setOpen(false)
  }

  return (
    <div className="tp-wrap" ref={wrapRef}>
      {/* Trigger */}
      <button
        type="button"
        id={id}
        className={`tp-trigger bk-input${hasError ? ' bk-input--err' : ''}`}
        onClick={() => setOpen(o => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span className={value ? 'tp-value' : 'tp-placeholder'}>
          {value ? toDisplay(value) : placeholder}
        </span>
      </button>

      {open && (
        <>
          {/* Backdrop (mobile) */}
          <div className="tp-backdrop" onClick={() => setOpen(false)} aria-hidden="true" />

          {/* Popup */}
          <div className="tp-popup" role="dialog" aria-modal="true" aria-label="Pick a time">
            {/* Header */}
            <div className="tp-popup-hdr">
              <span className="tp-popup-title">Select Time</span>
            </div>

            {/* Wheel */}
            <div className="tp-wheel-area">
              <div className="tp-sel-bar" aria-hidden="true" />
              <div className="tp-fade tp-fade--top"    aria-hidden="true" />
              <div className="tp-fade tp-fade--bottom" aria-hidden="true" />

              {/* Hours column */}
              <div className="tp-col" ref={hRef}>
                <div className="tp-spacer" aria-hidden="true" />
                {HOURS.map(h => (
                  <div
                    key={h}
                    className="tp-item"
                    onClick={() => {
                      if (hRef.current) hRef.current.scrollTo({ top: h * ITEM_H, behavior: 'smooth' })
                    }}
                  >
                    {pad(h)}
                  </div>
                ))}
                <div className="tp-spacer" aria-hidden="true" />
              </div>

              <div className="tp-colon" aria-hidden="true">:</div>

              {/* Minutes column */}
              <div className="tp-col" ref={mRef}>
                <div className="tp-spacer" aria-hidden="true" />
                {MINUTES.map((m, i) => (
                  <div
                    key={m}
                    className="tp-item"
                    onClick={() => {
                      if (mRef.current) mRef.current.scrollTo({ top: i * ITEM_H, behavior: 'smooth' })
                    }}
                  >
                    {pad(m)}
                  </div>
                ))}
                <div className="tp-spacer" aria-hidden="true" />
              </div>
            </div>

            <button type="button" className="tp-confirm-btn" onClick={confirm}>
              Confirm
            </button>
          </div>
        </>
      )}
    </div>
  )
}
