import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function Signal() {
  const sectionRef   = useRef(null)
  const radarRef     = useRef(null)
  const waveformRef  = useRef(null)
  const textRef      = useRef(null)
  const scanRef      = useRef(null)
  const coordsRef    = useRef(null)
  const [decoded, setDecoded] = useState(false)
  const [decoding, setDecoding] = useState(false)

  /* ── Radar canvas ── */
  useEffect(() => {
    const canvas = radarRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const SIZE = Math.min(canvas.offsetWidth || 280, canvas.offsetHeight || 280)
    canvas.width = SIZE
    canvas.height = SIZE
    const cx = SIZE / 2, cy = SIZE / 2, R = SIZE * 0.46

    let angle = 0
    let rafId

    const draw = () => {
      ctx.clearRect(0, 0, SIZE, SIZE)

      // Background rings
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath()
        ctx.arc(cx, cy, R * (i / 4), 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(0, 212, 255, ${0.08 + i * 0.03})`
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // Cross hairs
      ctx.strokeStyle = 'rgba(0,212,255,0.08)'
      ctx.lineWidth = 0.5
      ctx.setLineDash([4, 4])
      ctx.beginPath(); ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R); ctx.stroke()
      ctx.setLineDash([])

      // Radar sweep
      const sweepAngle = Math.PI / 4  // 45° spread
      const gradient = ctx.createConicalGradient
        ? ctx.createConicalGradient(cx, cy, angle - sweepAngle)
        : null

      // Fallback sweep using arc + clip
      ctx.save()
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.arc(cx, cy, R, angle - sweepAngle, angle)
      ctx.closePath()
      const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, R)
      grd.addColorStop(0, 'rgba(0,212,255,0.25)')
      grd.addColorStop(1, 'rgba(0,212,255,0)')
      ctx.fillStyle = grd
      ctx.fill()
      ctx.restore()

      // Sweep line
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      ctx.lineTo(cx + R * Math.cos(angle), cy + R * Math.sin(angle))
      ctx.strokeStyle = 'rgba(0,212,255,0.7)'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Blip dots (signal contacts)
      const blips = [
        { r: 0.35, a: 1.2 },
        { r: 0.65, a: 3.8 },
        { r: 0.8,  a: 5.1 },
        { r: 0.45, a: 2.7 },
      ]
      blips.forEach(b => {
        const bx = cx + R * b.r * Math.cos(b.a)
        const by = cy + R * b.r * Math.sin(b.a)
        const angleDiff = Math.abs(((angle - b.a) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2))
        const fadeFactor = Math.max(0, 1 - angleDiff / (Math.PI * 2))
        if (fadeFactor > 0.05) {
          ctx.beginPath()
          ctx.arc(bx, by, 3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0,255,247,${fadeFactor * 0.9})`
          ctx.fill()
          ctx.beginPath()
          ctx.arc(bx, by, 6, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(0,255,247,${fadeFactor * 0.2})`
          ctx.fill()
        }
      })

      // Center dot
      ctx.beginPath()
      ctx.arc(cx, cy, 4, 0, Math.PI * 2)
      ctx.fillStyle = '#00d4ff'
      ctx.fill()
      ctx.beginPath()
      ctx.arc(cx, cy, 8, 0, Math.PI * 2)
      ctx.fillStyle = 'rgba(0,212,255,0.2)'
      ctx.fill()

      angle += 0.025
      rafId = requestAnimationFrame(draw)
    }
    draw()

    return () => cancelAnimationFrame(rafId)
  }, [])

  /* ── Waveform canvas ── */
  useEffect(() => {
    const canvas = waveformRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    // Use fallback dimensions if canvas not yet laid out
    canvas.width  = canvas.offsetWidth  || 400
    canvas.height = canvas.offsetHeight || 60
    const W = canvas.width, H = canvas.height
    let t = 0, rafId

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      // Background line
      ctx.strokeStyle = 'rgba(0,212,255,0.1)'
      ctx.lineWidth = 1
      ctx.beginPath(); ctx.moveTo(0, H/2); ctx.lineTo(W, H/2); ctx.stroke()

      // Main waveform
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(0,212,255,0.7)'
      ctx.lineWidth = 1.5
      for (let x = 0; x < W; x++) {
        const freq1 = Math.sin((x / W) * Math.PI * 16 + t) * 0.4
        const freq2 = Math.sin((x / W) * Math.PI * 8  + t * 0.7) * 0.25
        const freq3 = Math.sin((x / W) * Math.PI * 32 + t * 1.3) * 0.1
        const noise = (Math.random() - 0.5) * 0.05
        const envelope = Math.sin((x / W) * Math.PI)
        const y = H/2 + (freq1 + freq2 + freq3 + noise) * H * 0.35 * envelope
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Glow copy
      ctx.beginPath()
      ctx.strokeStyle = 'rgba(123,47,255,0.2)'
      ctx.lineWidth = 4
      for (let x = 0; x < W; x++) {
        const freq1 = Math.sin((x / W) * Math.PI * 16 + t) * 0.4
        const freq2 = Math.sin((x / W) * Math.PI * 8  + t * 0.7) * 0.25
        const envelope = Math.sin((x / W) * Math.PI)
        const y = H/2 + (freq1 + freq2) * H * 0.35 * envelope
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()

      t += 0.04
      rafId = requestAnimationFrame(draw)
    }
    draw()

    return () => cancelAnimationFrame(rafId)
  }, [])

  /* ── Scroll animations ── */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      gsap.from(textRef.current, {
        opacity: 0, y: 60,
        scrollTrigger: { trigger: textRef.current, start: 'top 80%', end: 'top 40%', scrub: 1.5 },
      })
      gsap.from(scanRef.current, {
        opacity: 0, scale: 0.8,
        scrollTrigger: { trigger: section, start: 'top 60%', end: 'top 20%', scrub: 2 },
      })
      gsap.from(coordsRef.current?.children || [], {
        opacity: 0, x: -20, stagger: 0.1,
        scrollTrigger: { trigger: section, start: 'top 50%', end: 'center center', scrub: 1.5 },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const handleDecode = () => {
    if (decoded || decoding) return
    setDecoding(true)
    setTimeout(() => {
      setDecoding(false)
      setDecoded(true)
    }, 2000)
  }

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 80%, #00101a 0%, #020408 50%, #000205 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(5rem, 10vh, 8rem) clamp(1.5rem, 6vw, 8rem)',
        gap: '3rem',
      }}
    >
      {/* Scanning line animation */}
      <div style={{
        position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1, pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '1px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,212,255,0.4) 50%, transparent 100%)',
          animation: 'scan 4s ease-in-out infinite',
        }} />
      </div>

      {/* Digital noise overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none', opacity: 0.03,
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.95\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        backgroundSize: '80px',
        animation: 'data-flicker 8s linear infinite',
      }} />

      {/* Main content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
        gap: '3rem',
        width: '100%',
        maxWidth: '1100px',
        position: 'relative',
        zIndex: 2,
        alignItems: 'center',
      }}>
        {/* Left: Text */}
        <div ref={textRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="label-chip">SECTOR 06 — SIGNAL DETECTED</div>

          <h2 style={{
            fontSize: 'clamp(2rem, 5vw, 4.5rem)',
            fontWeight: 900,
            lineHeight: 1,
          }}>
            <span style={{
              background: 'linear-gradient(135deg, #00fff7, #00d4ff)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
            }}>SIGNAL</span>
            <br />
            <span style={{ color: 'rgba(232,244,255,0.9)' }}>DETECTED</span>
          </h2>

          <p style={{ fontSize: '1rem', lineHeight: 1.8, opacity: 0.65, maxWidth: '380px' }}>
            Something is waiting beyond the horizon. The signal is strong, coherent — and it is not from any known origin.
          </p>

          {/* Floating coordinates */}
          <div ref={coordsRef} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { l: 'SOURCE', v: 'RA 05h 34m 31.9s' },
              { l: 'DECLINATION', v: '+22° 00′ 52″' },
              { l: 'FREQUENCY', v: '1420.406 MHz' },
              { l: 'STRENGTH', v: '6EQUJ5 ██████' },
            ].map(d => (
              <div key={d.l} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '0.5rem 0',
                borderBottom: '1px solid rgba(0,212,255,0.08)',
                fontFamily: 'var(--font-display)',
              }}>
                <span style={{ fontSize: '0.5rem', letterSpacing: '0.2em', color: 'rgba(0,212,255,0.4)' }}>{d.l}</span>
                <span style={{ fontSize: '0.65rem', color: 'rgba(232,244,255,0.8)', letterSpacing: '0.1em' }}>{d.v}</span>
              </div>
            ))}
          </div>

          {/* Decode button */}
          <div style={{ marginTop: '0.5rem' }}>
            <button
              className="btn btn-primary"
              onClick={handleDecode}
              disabled={decoded || decoding}
              style={{
                opacity: decoded ? 0.6 : 1,
                cursor: decoded ? 'default' : 'pointer',
                background: decoding
                  ? 'linear-gradient(135deg, #00fff7, #00d4ff)'
                  : decoded
                    ? 'linear-gradient(135deg, #7b2fff, #00d4ff)'
                    : undefined,
              }}
            >
              {decoded ? '✓ DECODED' : decoding ? 'DECODING...' : 'DECODE SIGNAL'}
            </button>

            {/* Decoded message */}
            {decoded && (
              <div style={{
                marginTop: '1.5rem',
                padding: '1rem 1.5rem',
                border: '1px solid rgba(0,255,247,0.3)',
                borderRadius: '2px',
                background: 'rgba(0,255,247,0.05)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.85rem',
                letterSpacing: '0.1em',
                color: '#00fff7',
                textShadow: '0 0 15px rgba(0,255,247,0.6)',
                animation: 'data-flicker 3s linear 1',
              }}>
                "THE JOURNEY IS JUST BEGINNING."
              </div>
            )}
          </div>
        </div>

        {/* Right: Radar + Waveform */}
        <div ref={scanRef} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center' }}>
          {/* Radar */}
          <div style={{
            position: 'relative',
            background: 'rgba(0,212,255,0.03)',
            border: '1px solid rgba(0,212,255,0.12)',
            borderRadius: '2px',
            padding: '1rem',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.5rem', letterSpacing: '0.2em',
              color: 'rgba(0,212,255,0.4)',
              marginBottom: '0.5rem',
            }}>
              DEEP SPACE ARRAY — ACTIVE SCAN
            </div>
            <canvas
              ref={radarRef}
              style={{ width: 'clamp(200px, 30vw, 280px)', height: 'clamp(200px, 30vw, 280px)', display: 'block' }}
            />
            {/* Radar pulse rings */}
            {[1, 2, 3].map(i => (
              <div key={i} style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: `${i * 60}px`, height: `${i * 60}px`,
                marginLeft: `${-i * 30}px`, marginTop: `${-i * 30}px`,
                borderRadius: '50%',
                border: '1px solid rgba(0,212,255,0.15)',
                animation: `radar-pulse ${i * 1.2}s ease-out ${i * 0.4}s infinite`,
                pointerEvents: 'none',
              }} />
            ))}
          </div>

          {/* Waveform */}
          <div style={{
            background: 'rgba(0,212,255,0.02)',
            border: '1px solid rgba(0,212,255,0.1)',
            borderRadius: '2px',
            padding: '0.8rem 1rem',
            width: '100%',
          }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.5rem', letterSpacing: '0.2em',
              color: 'rgba(0,212,255,0.4)',
              marginBottom: '0.5rem',
            }}>
              SIGNAL WAVEFORM
            </div>
            <canvas
              ref={waveformRef}
              style={{ width: '100%', height: '60px', display: 'block' }}
            />
          </div>
        </div>
      </div>

      {/* Section fades */}
      <div style={{ position: 'absolute', top: 0, inset: '0 0 auto', height: '120px', background: 'linear-gradient(180deg, #020408, transparent)', pointerEvents: 'none', zIndex: 3 }} />
      <div style={{ position: 'absolute', bottom: 0, inset: 'auto 0 0', height: '120px', background: 'linear-gradient(0deg, #020408, transparent)', pointerEvents: 'none', zIndex: 3 }} />
    </div>
  )
}
