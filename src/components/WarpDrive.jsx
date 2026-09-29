import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function WarpDrive() {
  const sectionRef     = useRef(null)
  const shipRef        = useRef(null)
  const starsRef       = useRef(null)
  const textRef        = useRef(null)
  const canvasRef      = useRef(null)
  const rafRef         = useRef(null)
  const progressRef    = useRef(0)   // 0→1 scroll progress
  const warpIntensityRef = useRef(0) // shared between two useEffects

  /* ── Warp streak canvas ── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Generate streak data
    const STREAK_COUNT = 80
    const streaks = Array.from({ length: STREAK_COUNT }, () => ({
      angle: (Math.random() - 0.5) * 0.3,   // slight angle variation
      x: Math.random(),                       // normalised 0-1
      y: Math.random(),
      length: Math.random() * 0.15 + 0.05,
      speed: Math.random() * 0.004 + 0.002,
      opacity: Math.random() * 0.6 + 0.2,
      color: Math.random() > 0.5 ? '#00d4ff' : '#7b2fff',
      pos: Math.random(),                     // current position along x-axis
      width: Math.random() * 1.5 + 0.3,
    }))

    let warpIntensity = 0  // local canvas variable, driven by ref polling

    const pollWarp = () => {
      warpIntensity = warpIntensityRef.current
    }

    const draw = () => {
      pollWarp()
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const intensity = warpIntensity
      if (intensity < 0.05) {
        rafRef.current = requestAnimationFrame(draw)
        return
      }

      streaks.forEach(s => {
        s.pos += s.speed * (1 + intensity * 8)
        if (s.pos > 1.2) s.pos = -0.2

        const cx = w * 0.5  // vanishing point x
        const cy = h * 0.5  // vanishing point y

        // Star-warp: streaks radiate outward from center
        const angle = Math.atan2(s.y * h - cy, s.x * w - cx)
        const dist  = Math.sqrt(Math.pow(s.x * w - cx, 2) + Math.pow(s.y * h - cy, 2))
        const maxDist = Math.sqrt(cx * cx + cy * cy)
        const t     = dist / maxDist  // 0 at center, 1 at edge

        const streakLen = s.length * t * w * (0.3 + intensity * 0.7)

        const sx = s.x * w
        const sy = s.y * h
        const ex = sx + Math.cos(angle) * streakLen * s.pos
        const ey = sy + Math.sin(angle) * streakLen * s.pos

        const alpha = s.opacity * intensity * t
        const grd = ctx.createLinearGradient(sx, sy, ex, ey)
        grd.addColorStop(0, 'transparent')
        grd.addColorStop(1, s.color)

        ctx.save()
        ctx.globalAlpha = alpha
        ctx.strokeStyle = grd
        ctx.lineWidth   = s.width * (1 + intensity)
        ctx.beginPath()
        ctx.moveTo(sx, sy)
        ctx.lineTo(ex, ey)
        ctx.stroke()
        ctx.restore()
      })

      rafRef.current = requestAnimationFrame(draw)
    }
    draw()

    // Expose warp control via shared ref (safe across React strict-mode double-invoke)
    warpIntensityRef._bound = true

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  /* ── GSAP scroll animations ── */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.5,
          onUpdate: (self) => {
            progressRef.current = self.progress
            // Drive warp intensity from scroll progress via shared ref
            warpIntensityRef.current = self.progress
          },
        },
      })

      // Ship: left → center → right
      tl.fromTo(shipRef.current,
        { x: '-60vw', scale: 0.4, opacity: 0 },
        { x: '0vw',   scale: 1,   opacity: 1, duration: 0.4, ease: 'power2.out' }
      )
      .to(shipRef.current,
        { x: '0vw', scale: 1.15, duration: 0.2, ease: 'power1.inOut' }
      )
      .to(shipRef.current,
        { x: '60vw', scale: 1.6, opacity: 0, duration: 0.4, ease: 'power2.in' }
      )

      // Background stars accelerate (scale from center)
      tl.fromTo(starsRef.current,
        { scale: 1, opacity: 0.4 },
        { scale: 2.5, opacity: 0, duration: 1 },
        0
      )

      // Text reveal then exit
      gsap.from(textRef.current, {
        opacity: 0, y: 60, filter: 'blur(15px)',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'top 30%',
          scrub: 1.5,
        },
      })
      gsap.to(textRef.current, {
        opacity: 0, y: -60,
        scrollTrigger: {
          trigger: section,
          start: '70% top',
          end: 'bottom top',
          scrub: 1,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '160vh',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 50%, #060110 0%, #020408 40%, #000205 100%)',
      }}
    >
      {/* Warp streak canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          zIndex: 2, pointerEvents: 'none',
        }}
      />

      {/* Radial stars bg layer */}
      <div ref={starsRef} style={{
        position: 'absolute', inset: '-10%',
        background: 'radial-gradient(ellipse at center, rgba(0,50,120,0.3) 0%, transparent 60%)',
        zIndex: 1, pointerEvents: 'none',
        transformOrigin: 'center center',
      }}>
        {/* Static star dots */}
        {Array.from({ length: 60 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 0.5}px`,
            height: `${Math.random() * 2 + 0.5}px`,
            borderRadius: '50%',
            background: '#ffffff',
            opacity: Math.random() * 0.5 + 0.1,
          }} />
        ))}
      </div>

      {/* Spaceship (SVG-based) */}
      <div
        ref={shipRef}
        style={{
          position: 'sticky',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 5,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
      >
        <svg
          width="clamp(200px, 30vw, 400px)"
          height="clamp(100px, 15vw, 200px)"
          viewBox="0 0 400 180"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0 0 20px rgba(0,212,255,0.6)) drop-shadow(0 0 40px rgba(123,47,255,0.3))' }}
        >
          {/* Engine glow trail */}
          <ellipse cx="30" cy="90" rx="60" ry="18" fill="url(#engineGlow)" opacity="0.8" />
          <ellipse cx="30" cy="90" rx="90" ry="12" fill="url(#engineGlow2)" opacity="0.5" />

          {/* Main body */}
          <path
            d="M80 90 L160 60 L320 75 L380 90 L320 105 L160 120 Z"
            fill="url(#shipBody)"
            stroke="rgba(0,212,255,0.4)"
            strokeWidth="0.5"
          />
          {/* Cockpit dome */}
          <ellipse cx="300" cy="90" rx="55" ry="28" fill="url(#cockpit)" stroke="rgba(0,212,255,0.6)" strokeWidth="0.5" />
          <ellipse cx="310" cy="85" rx="30" ry="16" fill="rgba(0,212,255,0.1)" />

          {/* Top wing */}
          <path d="M200 70 L260 40 L320 75 L200 70 Z" fill="url(#wing)" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />
          {/* Bottom wing */}
          <path d="M200 110 L260 140 L320 105 L200 110 Z" fill="url(#wing)" stroke="rgba(0,212,255,0.3)" strokeWidth="0.5" />

          {/* Engine nozzle */}
          <ellipse cx="85" cy="90" rx="18" ry="22" fill="rgba(10,5,30,0.9)" stroke="rgba(123,47,255,0.5)" strokeWidth="1" />
          <ellipse cx="82" cy="90" rx="12" ry="15" fill="url(#engineCore)" />

          {/* Hull details */}
          <line x1="160" y1="70" x2="310" y2="75" stroke="rgba(0,212,255,0.15)" strokeWidth="0.5" />
          <line x1="160" y1="110" x2="310" y2="105" stroke="rgba(0,212,255,0.15)" strokeWidth="0.5" />
          <rect x="220" y="82" width="30" height="16" rx="2" fill="rgba(0,212,255,0.05)" stroke="rgba(0,212,255,0.2)" strokeWidth="0.5" />

          {/* Defs */}
          <defs>
            <linearGradient id="shipBody" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%"   stopColor="#05021a" />
              <stop offset="50%"  stopColor="#0d0830" />
              <stop offset="100%" stopColor="#060220" />
            </linearGradient>
            <radialGradient id="cockpit" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#1a0850" />
              <stop offset="100%" stopColor="#050215" />
            </radialGradient>
            <linearGradient id="wing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0a0530" />
              <stop offset="100%" stopColor="#050215" />
            </linearGradient>
            <radialGradient id="engineGlow" cx="80%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#7b2fff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="engineGlow2" cx="80%" cy="50%" r="80%">
              <stop offset="0%" stopColor="#7b2fff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00d4ff" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="engineCore" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#00fff7" />
              <stop offset="50%" stopColor="#00d4ff" />
              <stop offset="100%" stopColor="#7b2fff" stopOpacity="0.3" />
            </radialGradient>
          </defs>
        </svg>

        {/* Motion blur overlay on the ship */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(90deg, rgba(0,212,255,0.05) 0%, transparent 40%, transparent 60%, rgba(123,47,255,0.05) 100%)',
          pointerEvents: 'none',
        }} />
      </div>

      {/* Text overlay */}
      <div
        ref={textRef}
        style={{
          position: 'absolute',
          bottom: '22%',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 6,
          textAlign: 'center',
          width: 'min(600px, 90vw)',
          willChange: 'transform, opacity',
        }}
      >
        <div className="label-chip" style={{ marginBottom: '1rem', justifyContent: 'center' }}>
          SECTOR 03 — WARP DRIVE
        </div>
        <h2 style={{
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #ffffff 30%, #00d4ff 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: '1rem',
          letterSpacing: '0.08em',
        }}>
          WARP DRIVE
        </h2>
        <p style={{ fontSize: '1rem', opacity: 0.7, maxWidth: '400px', margin: '0 auto' }}>
          Distance is only a limitation of perception.
        </p>

        {/* Speed readout */}
        <div style={{
          display: 'inline-flex', gap: '2rem', marginTop: '1.5rem',
          fontFamily: 'var(--font-display)', fontSize: '0.6rem',
          color: 'rgba(0,212,255,0.5)', letterSpacing: '0.15em',
        }}>
          <span>SPEED: WARP 9.7</span>
          <span>ETA: ∞</span>
          <span>HULL: NOMINAL</span>
        </div>
      </div>

      {/* Section fades */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '150px', zIndex: 7, background: 'linear-gradient(180deg, #020408, transparent)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', zIndex: 7, background: 'linear-gradient(0deg, #020408, transparent)', pointerEvents: 'none' }} />
    </div>
  )
}
