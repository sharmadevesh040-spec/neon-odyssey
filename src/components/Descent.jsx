import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParticleBackground from './ParticleBackground'

export default function Descent() {
  const sectionRef    = useRef(null)
  const bgRef         = useRef(null)   // layer 1 – background
  const midRef        = useRef(null)   // layer 2 – midground
  const fgRef         = useRef(null)   // layer 3 – foreground
  const planetRef     = useRef(null)
  const textRef       = useRef(null)
  const galaxiesRef   = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Background stars – 0.1x
      gsap.to(bgRef.current, {
        yPercent: -10,
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 2 },
      })

      // Galaxy sprites – 0.25x (opposite direction trick — feel of depth)
      gsap.to(galaxiesRef.current, {
        yPercent: -25,
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 2.5 },
      })

      // Planet – 0.4x
      gsap.to(planetRef.current, {
        yPercent: -40,
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.8 },
      })

      // Midground – 0.7x
      gsap.to(midRef.current, {
        yPercent: -70,
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1.5 },
      })

      // Foreground particles – 1.2x
      gsap.to(fgRef.current, {
        yPercent: -120,
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 },
      })

      // Text reveal – blur to sharp
      gsap.from(textRef.current, {
        opacity: 0,
        y: 80,
        filter: 'blur(20px)',
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1.5,
        },
      })

      // Text exit
      gsap.to(textRef.current, {
        opacity: 0,
        y: -80,
        scrollTrigger: {
          trigger: section,
          start: '60% top',
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
        height: '180vh',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 30% 70%, #050215 0%, #020408 50%, #000205 100%)',
      }}
    >
      {/* Layer 1 – Background stars */}
      <div ref={bgRef} style={{ position: 'absolute', inset: '-20%', zIndex: 1 }}>
        <ParticleBackground count={250} color="#ffffff" speed={0.08} mouseParallax={false} />
      </div>

      {/* Layer 2 – Distant galaxies (CSS shapes) */}
      <div ref={galaxiesRef} style={{ position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none' }}>
        {/* Galaxy 1 */}
        <div style={{
          position: 'absolute', top: '10%', left: '10%',
          width: '200px', height: '80px',
          background: 'radial-gradient(ellipse at center, rgba(123,47,255,0.25) 0%, rgba(0,50,100,0.1) 50%, transparent 100%)',
          filter: 'blur(8px)',
          transform: 'rotate(-20deg)',
        }} />
        {/* Galaxy 2 */}
        <div style={{
          position: 'absolute', top: '30%', right: '12%',
          width: '160px', height: '60px',
          background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.2) 0%, rgba(0,100,200,0.08) 60%, transparent 100%)',
          filter: 'blur(10px)',
          transform: 'rotate(15deg)',
        }} />
        {/* Galaxy 3 */}
        <div style={{
          position: 'absolute', top: '65%', left: '20%',
          width: '120px', height: '50px',
          background: 'radial-gradient(ellipse at center, rgba(0,255,247,0.15) 0%, transparent 70%)',
          filter: 'blur(6px)',
        }} />
      </div>

      {/* Layer 3 – Large glowing moon/planet */}
      <div ref={planetRef} style={{
        position: 'absolute', top: '15%', right: '8%',
        zIndex: 3, pointerEvents: 'none',
        width: 'clamp(200px, 28vw, 380px)',
        height: 'clamp(200px, 28vw, 380px)',
      }}>
        <div style={{
          width: '100%', height: '100%',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 35%, #0d1a3a 0%, #050d25 50%, #020510 100%)',
          boxShadow: [
            '0 0 60px 15px rgba(0,212,255,0.2)',
            '0 0 120px 40px rgba(0,50,120,0.15)',
            'inset -20px -20px 50px rgba(0,0,0,0.9)',
          ].join(', '),
        }}>
          {/* Crater rings */}
          <div style={{
            position: 'absolute', top: '25%', left: '30%',
            width: '40%', height: '40%',
            borderRadius: '50%',
            border: '1px solid rgba(0,212,255,0.08)',
          }} />
          <div style={{
            position: 'absolute', top: '50%', left: '15%',
            width: '25%', height: '25%',
            borderRadius: '50%',
            border: '1px solid rgba(0,212,255,0.06)',
          }} />
        </div>
        {/* Atmosphere glow */}
        <div style={{
          position: 'absolute', inset: '-20px', borderRadius: '50%',
          boxShadow: '0 0 50px 20px rgba(0,212,255,0.1)',
        }} />
      </div>

      {/* Layer 4 – Midground floating rocks / debris */}
      <div ref={midRef} style={{ position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none' }}>
        {[
          { t: '20%', l: '5%',  s: 20, c: 'rgba(0,212,255,0.5)' },
          { t: '40%', l: '80%', s: 12, c: 'rgba(123,47,255,0.5)' },
          { t: '55%', l: '15%', s: 16, c: 'rgba(0,255,247,0.4)' },
          { t: '70%', l: '70%', s: 10, c: 'rgba(0,212,255,0.4)' },
          { t: '30%', l: '45%', s: 8,  c: 'rgba(123,47,255,0.4)' },
        ].map((d, i) => (
          <div key={i} style={{
            position: 'absolute', top: d.t, left: d.l,
            width: `${d.s}px`, height: `${d.s}px`,
            borderRadius: '50%',
            background: d.c,
            boxShadow: `0 0 ${d.s * 2}px ${d.c}`,
            animation: `float ${4 + i}s ease-in-out ${i * 0.7}s infinite`,
          }} />
        ))}
      </div>

      {/* Layer 5 – Foreground particles */}
      <div ref={fgRef} style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }}>
        {Array.from({ length: 15 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            borderRadius: '50%',
            background: i % 2 === 0 ? 'var(--color-cyan)' : 'var(--color-blue)',
            boxShadow: `0 0 8px currentColor`,
            animation: `float ${3 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite`,
            opacity: 0.7,
          }} />
        ))}
      </div>

      {/* Section content */}
      <div
        ref={textRef}
        style={{
          position: 'sticky',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 6,
          padding: '0 clamp(1rem, 6vw, 8rem)',
          maxWidth: '700px',
          willChange: 'transform, opacity, filter',
        }}
      >
        <div className="label-chip" style={{ marginBottom: '1.5rem' }}>
          SECTOR 02 — DEEP SPACE
        </div>
        <h2 style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 900,
          lineHeight: 1,
          marginBottom: '1.5rem',
          background: 'linear-gradient(135deg, #ffffff 40%, #00d4ff 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          filter: 'drop-shadow(0 0 20px rgba(0,212,255,0.3))',
        }}>
          THE<br />
          <span style={{
            background: 'linear-gradient(135deg, #00d4ff, #7b2fff)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}>DESCENT</span>
        </h2>
        <p style={{ fontSize: '1.05rem', lineHeight: 1.8, maxWidth: '480px' }}>
          Every scroll takes you deeper into the unknown. The void is not empty —
          it breathes, it listens, it waits for those brave enough to fall forward.
        </p>

        {/* HUD data points */}
        <div style={{
          marginTop: '2rem',
          display: 'flex', gap: '2rem', flexWrap: 'wrap',
        }}>
          {[
            { label: 'DEPTH', val: '∞ LY' },
            { label: 'VELOCITY', val: '0.87c' },
            { label: 'SIGNAL', val: 'WEAK' },
          ].map(d => (
            <div key={d.label} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.5rem', letterSpacing: '0.2em', color: 'rgba(0,212,255,0.4)' }}>
                {d.label}
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', color: 'var(--color-blue)', fontWeight: 700 }}>
                {d.val}
              </span>
            </div>
          ))}
        </div>

        {/* HUD corners around the text block */}
        <div style={{ position: 'absolute', inset: '-20px', pointerEvents: 'none' }}>
          <div className="hud-corner hud-corner-tl" />
          <div className="hud-corner hud-corner-tr" />
          <div className="hud-corner hud-corner-bl" />
          <div className="hud-corner hud-corner-br" />
        </div>
      </div>

      {/* Top / bottom gradient */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '200px', zIndex: 7,
        background: 'linear-gradient(180deg, #020408 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px', zIndex: 7,
        background: 'linear-gradient(0deg, #020408 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />
    </div>
  )
}
