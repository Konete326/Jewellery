import React, { useState, useEffect, useRef, useCallback } from 'react'

function wrap(i, n) {
  return n ? ((i % n) + n) % n : 0
}

function clamp(v, a, b) {
  return Math.min(b, Math.max(a, v))
}

function stringY(x, w, y0, sag) {
  const t = clamp(x / w, 0, 1)
  return y0 + 4 * sag * t * (1 - t)
}

function springStep(x, v, target, dt, k = 70) {
  const c = 2 * Math.sqrt(k)
  const nv = v + (k * (target - x) - c * v) * dt
  return [x + nv * dt, nv]
}

function swingStep(a, w, lineVel, dt, gain) {
  const nw = w + (-38 * a - 4.2 * w + lineVel * 0.0034 * gain) * dt
  return [clamp(a + nw * dt, -0.6, 0.6), nw]
}

function nearestAt(off, spacing, n) {
  return clamp(Math.round(off / spacing), 0, Math.max(0, n - 1))
}

function pad2(n) {
  return n < 10 ? '0' + n : String(n)
}

const PALETTES = {
  dawn: { top: '#e7b7a5', bottom: '#f8e8d6', sun: '#fff4df', far: '#d2b2bb', near: '#3a2a3b', mist: '255,240,232' },
  alpine: { top: '#7ea5c8', bottom: '#e3ecf2', sun: '#ffffff', far: '#a9bfd0', near: '#1c3044', mist: '236,244,250' },
  dusk: { top: '#2a2450', bottom: '#ef8d60', sun: '#ffd9a6', far: '#93607c', near: '#18121f', mist: '255,196,160' },
  mist: { top: '#c4d0cb', bottom: '#eef1ec', sun: '#ffffff', far: '#aebcb5', near: '#2c3a33', mist: '246,248,250' }
}

function mulberry32(seed) {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hexRgb(h) {
  const v = parseInt(h.replace('#', ''), 16)
  return [(v >> 16) & 255, (v >> 8) & 255, v & 255]
}

function mixRgb(a, b, t) {
  const A = hexRgb(a)
  const B = hexRgb(b)
  return 'rgb(' + A.map((v, i) => Math.round(v + (B[i] - v) * t)).join(',') + ')'
}

function paintLandscape(seed, palette, w = 1600, h = 1000) {
  if (typeof document === 'undefined') return ''
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  const g = c.getContext('2d')
  if (!g) return ''
  const P = PALETTES[palette] || PALETTES.dawn
  const r = mulberry32(seed * 104729 + 7)

  const sky = g.createLinearGradient(0, 0, 0, h * 0.72)
  sky.addColorStop(0, P.top)
  sky.addColorStop(1, P.bottom)
  g.fillStyle = sky
  g.fillRect(0, 0, w, h)
  const sx = w * (0.22 + r() * 0.56)
  const sy = h * (0.26 + r() * 0.16)
  const halo = g.createRadialGradient(sx, sy, 0, sx, sy, w * 0.45)
  halo.addColorStop(0, 'rgba(' + hexRgb(P.sun).join(',') + ',.85)')
  halo.addColorStop(0.08, 'rgba(' + hexRgb(P.sun).join(',') + ',.55)')
  halo.addColorStop(1, 'rgba(' + hexRgb(P.sun).join(',') + ',0)')
  g.fillStyle = halo
  g.fillRect(0, 0, w, h)
  g.fillStyle = P.sun
  g.beginPath()
  g.arc(sx, sy, h * 0.045, 0, Math.PI * 2)
  g.fill()

  const layers = 5
  for (let L = 0; L < layers; L++) {
    const k = L / (layers - 1)
    const base = h * (0.42 + k * 0.4)
    const amp = h * (0.07 + k * 0.1)
    const ph = [r(), r(), r(), r()].map((v) => v * Math.PI * 2)
    const fr = [1.3 + r(), 3.1 + r() * 2, 7 + r() * 4, 17 + r() * 8]
    const ridge = (x) => {
      const u = x / w
      return (
        base -
        amp *
          (0.55 * Math.sin(u * fr[0] + ph[0]) +
            0.28 * Math.sin(u * fr[1] + ph[1]) +
            0.12 * Math.abs(Math.sin(u * fr[2] + ph[2])) +
            0.05 * Math.sin(u * fr[3] + ph[3]))
      )
    }
    const mist = g.createLinearGradient(0, base - amp * 1.4, 0, base + amp * 0.4)
    mist.addColorStop(0, 'rgba(' + P.mist + ',0)')
    mist.addColorStop(1, 'rgba(' + P.mist + ',' + (0.55 - k * 0.35).toFixed(2) + ')')
    g.fillStyle = mist
    g.fillRect(0, base - amp * 1.4, w, amp * 1.8)
    const body = g.createLinearGradient(0, base - amp, 0, h)
    body.addColorStop(0, mixRgb(P.far, P.near, Math.pow(k, 1.3)))
    body.addColorStop(1, mixRgb(P.far, P.near, Math.min(1, Math.pow(k, 1.3) + 0.18)))
    g.fillStyle = body
    g.beginPath()
    g.moveTo(0, h)
    for (let x = 0; x <= w; x += 6) g.lineTo(x, ridge(x))
    g.lineTo(w, h)
    g.closePath()
    g.fill()
  }

  const vig = g.createRadialGradient(w / 2, h * 0.45, h * 0.3, w / 2, h / 2, w * 0.78)
  vig.addColorStop(0, 'rgba(0,0,0,0)')
  vig.addColorStop(1, 'rgba(0,0,0,.32)')
  g.fillStyle = vig
  g.fillRect(0, 0, w, h)
  return c.toDataURL('image/jpeg', 0.88)
}

const DEFAULT_SLIDES = [
  { title: 'The Florentine Ruby Choker', caption: 'Handcrafted 22K Solid Gold', palette: 'dawn', seed: 3 },
  { title: 'Royal Polki Kada Armlet', caption: 'Heritage Filigree Wirework', palette: 'alpine', seed: 8 },
  { title: 'Archival Aurelian Guluband', caption: 'Certified 22K Pure Gold', palette: 'dusk', seed: 14 },
  { title: 'Imperial Florentine Jhumkas', caption: 'Hand-set Natural Pearls', palette: 'mist', seed: 21 }
]

function useSlideImages(slides) {
  const key = slides.map((s) => s.image || (s.palette || 'dawn') + ':' + (s.seed || 1)).join('|')
  const [painted, setPainted] = useState(() => slides.map(() => ''))
  useEffect(() => {
    setPainted(slides.map((s, i) => (s.image ? '' : paintLandscape(s.seed || i + 1, s.palette || 'dawn'))))
  }, [key])
  return slides.map((s, i) => s.image || painted[i] || '')
}

const PL_CSS = `
.pl-root{position:relative;width:100%;overflow:hidden;background:var(--pl-bg);color:var(--pl-ink);user-select:none;-webkit-user-select:none;touch-action:pan-y;outline:none;cursor:grab}
.pl-root[data-drag='1']{cursor:grabbing}
.pl-root:focus-visible{box-shadow:inset 0 0 0 2px var(--pl-ink)}
.pl-string{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:visible}
.pl-card{position:absolute;left:0;top:0;width:var(--pl-cw);transform-origin:50% 0;will-change:transform;cursor:pointer}
.pl-print{margin-top:10px;background:#ffffff;padding:10px 10px 0;border-radius:12px;border:1px solid rgba(212,175,55,0.25);box-shadow:0 1px 3px rgba(0,0,0,.08),0 16px 28px -14px rgba(0,0,0,.25);transition:transform .5s cubic-bezier(.2,.7,.2,1),filter .5s ease}
.pl-card[data-on='0'] .pl-print{transform:scale(.92);filter:saturate(.75) brightness(.96);opacity:.85}
.pl-card[data-on='1'] .pl-print{border-color:rgba(212,175,55,0.7);box-shadow:0 4px 12px rgba(212,175,55,0.2),0 20px 32px -12px rgba(0,0,0,.35)}
.pl-shot{position:relative;aspect-ratio:1;overflow:hidden;background:#ebeeef;border-radius:8px}
.pl-shot img{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;display:block;pointer-events:none}
.pl-note{height:46px;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:0 6px;text-align:center}
.pl-note-title{font:500 13px/1.2 ui-serif,Georgia,serif;color:#2d3435;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.pl-note-sub{font:400 10px/1.1 ui-sans-serif,system-ui,sans-serif;color:#757c7d;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;margin-top:2px}
.pl-peg{position:absolute;left:50%;top:0;width:12px;height:28px;margin-left:-6px;border-radius:3px;background:linear-gradient(90deg,#9a772c,#d4af37 45%,#816321);box-shadow:0 2px 4px rgba(0,0,0,.3)}
.pl-peg::after{content:'';position:absolute;left:4.5px;top:9px;width:3px;height:8px;background:rgba(60,40,15,.55);border-radius:1px}
.pl-bar{position:absolute;left:clamp(16px,4vw,56px);right:clamp(16px,4vw,56px);bottom:14px;display:flex;align-items:center;gap:clamp(12px,2vw,24px);cursor:default}
.pl-cap{flex:1;min-width:0;overflow:hidden;padding-bottom:.15em}
.pl-cap>*{display:block;animation:pl-in .55s cubic-bezier(.2,.8,.2,1) both}
.pl-title{font:500 clamp(16px,2vw,22px)/1.15 ui-serif,Georgia,serif;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--pl-ink)}
.pl-sub{margin-top:2px;font:400 12px/1.4 ui-sans-serif,system-ui,sans-serif;color:var(--pl-muted)}
.pl-count{font:500 11px/1 ui-monospace,monospace;letter-spacing:.12em;color:var(--pl-muted)}
.pl-count b{color:var(--pl-ink);font-weight:600}
.pl-btn{appearance:none;width:36px;height:36px;border-radius:50%;border:1px solid var(--pl-line);background:rgba(255,255,255,0.7);backdrop-filter:blur(4px);color:inherit;display:grid;place-items:center;cursor:pointer;transition:all .2s ease}
.pl-btn:hover{background:var(--pl-ink);color:var(--pl-bg)}
.pl-btn:focus-visible{outline:2px solid var(--pl-ink);outline-offset:2px}
.pl-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
@keyframes pl-in{from{transform:translateY(100%);opacity:0}to{transform:none;opacity:1}}
@media (prefers-reduced-motion:reduce){.pl-cap>*{animation:none}.pl-print{transition:none}}
`

export function PolaroidLineCarousel({
  slides = DEFAULT_SLIDES,
  height = '420px',
  cardWidth = 240,
  sag = 38,
  swing = 1,
  autoplay = 4000,
  string = '#c5a059',
  background = 'transparent',
  ink = 'var(--foreground, #2d3435)',
  onChange,
  onSlideClick,
  className = '',
  style = {},
  ariaLabel = 'Similar jewellery pieces carousel'
}) {
  const n = slides.length
  const srcs = useSlideImages(slides)
  const [active, setActive] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [size, setSize] = useState({ w: 1200, h: 420, cw: cardWidth })
  const rootRef = useRef(null)
  const pathRef = useRef(null)
  const cards = useRef([])
  const sim = useRef({ off: 0, vel: 0, target: 0, a: [], w: [] })
  const drag = useRef(null)
  const lastTouch = useRef(0)
  const activeRef = useRef(0)
  const opts = useRef({ sag, swing })
  useEffect(() => {
    opts.current = { sag, swing }
  }, [sag, swing])

  const spacing = size.cw * 1.08
  const goTo = useCallback(
    (i) => {
      sim.current.target = clamp(i, 0, n - 1) * spacing
    },
    [n, spacing]
  )

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const ro = new ResizeObserver(() => {
      const r = root.getBoundingClientRect()
      const cw = Math.round(Math.max(160, Math.min(cardWidth, r.width * 0.44, r.height * 0.58)))
      setSize({ w: r.width, h: r.height, cw })
    })
    ro.observe(root)
    return () => ro.disconnect()
  }, [cardWidth])

  useEffect(() => {
    sim.current.target = activeRef.current * spacing
    sim.current.off = activeRef.current * spacing
  }, [spacing])

  useEffect(() => {
    onChange?.(active)
  }, [active, onChange])

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let visible = true
    let raf = 0
    let prev = performance.now()
    const S = sim.current

    const frame = (now) => {
      raf = 0
      if (!visible) return
      const dt = Math.min(0.033, (now - prev) / 1000)
      prev = now
      const { w, h, cw } = size
      const y0 = Math.max(30, h * 0.16)
      const d = drag.current
      let lineVel
      if (d && d.moved) {
        lineVel = d.v * 1000
      } else {
        const before = S.off
        ;[S.off, S.vel] = springStep(S.off, S.vel, S.target, dt)
        lineVel = -(S.off - before) / Math.max(dt, 1e-3)
      }
      const o = opts.current
      const g = reduce ? 0 : o.swing
      const near = nearestAt(S.off, spacing, n)
      for (let i = 0; i < n; i++) {
        const el = cards.current[i]
        if (!el) continue
        const x = w / 2 + i * spacing - S.off
        if (x < -cw * 1.5 || x > w + cw * 1.5) {
          el.style.visibility = 'hidden'
          continue
        }
        el.style.visibility = 'visible'
        let a = S.a[i] || 0
        let av = S.w[i] || 0
        ;[a, av] = swingStep(a, av, lineVel, dt, g)
        if (g) a += Math.sin(now / 1300 + i * 1.7) * 0.0009 * g
        S.a[i] = a
        S.w[i] = av
        const y = stringY(x, w, y0, o.sag) - 6
        el.style.transform = 'translate(' + (x - cw / 2).toFixed(1) + 'px,' + y.toFixed(1) + 'px) rotate(' + a.toFixed(4) + 'rad)'
        el.style.zIndex = String(i === near ? n + 1 : n - Math.abs(i - near))
      }
      pathRef.current?.setAttribute('d', 'M0 ' + y0 + ' Q' + w / 2 + ' ' + (y0 + 2 * o.sag) + ' ' + w + ' ' + y0)
      if (near !== activeRef.current) {
        activeRef.current = near
        setActive(near)
      }
      raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting
      if (visible && !raf) {
        prev = performance.now()
        raf = requestAnimationFrame(frame)
      }
    })
    io.observe(root)
    raf = requestAnimationFrame(frame)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
    }
  }, [size, spacing, n])

  useEffect(() => {
    if (!autoplay || n < 2) return
    const t = window.setInterval(() => {
      if (document.hidden || drag.current || performance.now() - lastTouch.current < autoplay) return
      goTo(activeRef.current >= n - 1 ? 0 : activeRef.current + 1)
    }, autoplay)
    return () => window.clearInterval(t)
  }, [autoplay, n, goTo])

  const onDown = (e) => {
    if (e.target.closest('.pl-bar')) return
    lastTouch.current = performance.now()
    drag.current = { x: e.clientX, off: sim.current.off, lx: e.clientX, lt: e.timeStamp, v: 0, moved: false }
  }

  const onMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 5) {
      d.moved = true
      setDragging(true)
      rootRef.current?.setPointerCapture(e.pointerId)
    }
    if (!d.moved) return
    const dt = Math.max(1, e.timeStamp - d.lt)
    d.v = 0.7 * ((e.clientX - d.lx) / dt) + 0.3 * d.v
    d.lx = e.clientX
    d.lt = e.timeStamp
    const max = (n - 1) * spacing
    let off = d.off - dx
    if (off < 0) off *= 0.35
    if (off > max) off = max + (off - max) * 0.35
    sim.current.off = off
  }

  const onUp = (e) => {
    const d = drag.current
    drag.current = null
    lastTouch.current = performance.now()
    if (!d) return
    if (d.moved) {
      setDragging(false)
      sim.current.vel = -d.v * 1000
      goTo(nearestAt(sim.current.off - d.v * 180, spacing, n))
      return
    }
    const card = e.target.closest('[data-i]')
    if (card) {
      const idx = Number(card.getAttribute('data-i'))
      goTo(idx)
      if (onSlideClick && slides[idx]) {
        onSlideClick(slides[idx], idx)
      }
    }
  }

  const step = (dir) => {
    lastTouch.current = performance.now()
    goTo(clamp(activeRef.current + dir, 0, n - 1))
  }

  const onKey = (e) => {
    if (e.key === 'ArrowRight') step(1)
    else if (e.key === 'ArrowLeft') step(-1)
    else return
    e.preventDefault()
  }

  const s = slides[active] || {}

  return (
    <div
      ref={rootRef}
      className={['pl-root', className].filter(Boolean).join(' ')}
      style={{
        height,
        ['--pl-bg']: background,
        ['--pl-ink']: ink,
        ['--pl-muted']: 'color-mix(in srgb, var(--pl-ink) 60%, transparent)',
        ['--pl-line']: 'color-mix(in srgb, var(--pl-ink) 20%, transparent)',
        ['--pl-cw']: size.cw + 'px',
        ...style
      }}
      data-drag={dragging ? '1' : '0'}
      role="region"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKey}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
    >
      <style>{PL_CSS}</style>
      <svg className="pl-string" aria-hidden="true">
        <path ref={pathRef} fill="none" stroke={string} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {slides.map((sl, i) => (
        <div
          key={sl.id || sl._id || i}
          className="pl-card"
          data-i={i}
          data-on={i === active ? '1' : '0'}
          ref={(el) => {
            cards.current[i] = el
          }}
          aria-hidden={i === active ? undefined : true}
          onClick={() => {
            if (onSlideClick) {
              onSlideClick(sl, i)
            }
          }}
        >
          <div className="pl-print">
            <div className="pl-shot">
              {srcs[i] ? <img src={srcs[i]} alt={sl.alt || sl.title || ''} draggable={false} /> : null}
            </div>
            <div className="pl-note">
              <span className="pl-note-title">{sl.title || ''}</span>
              <span className="pl-note-sub">{sl.caption || sl.category || ''}</span>
            </div>
          </div>
          <div className="pl-peg" />
        </div>
      ))}
      <div className="pl-bar">
        <div className="pl-cap" key={active} aria-hidden="true">
          {s.title ? <span className="pl-title">{s.title}</span> : null}
          {s.caption || s.category ? <span className="pl-sub">{s.caption || s.category}</span> : null}
        </div>
        <span className="pl-count" aria-hidden="true">
          <b>{pad2(active + 1)}</b> / {pad2(n)}
        </span>
        <button type="button" className="pl-btn" aria-label="Previous" onClick={() => step(-1)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3 5 8l5 5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
        <button type="button" className="pl-btn" aria-label="Next" onClick={() => step(1)}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="m6 3 5 5-5 5" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </button>
      </div>
      <div className="pl-sr" aria-live="polite">
        {'Piece ' + (active + 1) + ' of ' + n + (s.title ? ': ' + s.title : '')}
      </div>
    </div>
  )
}

export default PolaroidLineCarousel
