import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParticleBackground from './ParticleBackground'

export default function Hero() {
  const sectionRef    = useRef(null)
  const starsRef      = useRef(null)
  const nebulaRef     = useRef(null)
  const planetRef     = useRef(null)
  const ringsRef      = useRef(null)
  const particlesRef  = useRef(null)
  const textRef       = useRef(null)
  const mouseLayerRef = useRef(null)
  const mouseRef      = useRef({ x: 0, y: 0 })
  const rafRef        = useRef(null)

  /* ── Mouse parallax ── */
  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = {
        x: (e.clientX / window.innerWidth  - 0.5),
        y: (e.clientY / window.innerHeight - 0.5),
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })

    const tick = () => {
      const { x, y } = mouseRef.current
      if (nebulaRef.current)   gsap.to(nebulaRef.current,   { x: x * -18, y: y * -12, duration: 1.5, ease: 'power1.out' })
      if (planetRef.current)   gsap.to(planetRef.current,   { x: x * -35, y: y * -25, duration: 1.2, ease: 'power1.out' })
      if (ringsRef.current)    gsap.to(ringsRef.current,    { x: x * -50, y: y * -35, duration: 1.0, ease: 'power1.out' })
      if (particlesRef.current)gsap.to(particlesRef.current,{ x: x * -70, y: y * -50, duration: 0.8, ease: 'power1.out' })
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  /* ── Scroll parallax ── */
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Stars scroll at 0.1x
      gsap.to(starsRef.current, {
        yPercent: -10,
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 1 },
      })
      // Nebula at 0.2x
      gsap.to(nebulaRef.current, {
        yPercent: -20,
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 1.5 },
      })
      // Planet at 0.4x — moves up and fades, but only starts after 15% scroll
      gsap.to(planetRef.current, {
        yPercent: -40,
        scale: 0.8,
        opacity: 0,
        scrollTrigger: { trigger: section, start: '15% top', end: 'bottom top', scrub: 1.2 },
      })
      // Rings at 0.55x — starts after 15% scroll
      gsap.to(ringsRef.current, {
        yPercent: -55,
        opacity: 0,
        scrollTrigger: { trigger: section, start: '15% top', end: 'bottom top', scrub: 1 },
      })
      // Text at 0.85x — move up and fade (start after 20% scroll so it's visible on load)
      gsap.to(textRef.current, {
        yPercent: -30,
        opacity: 0,
        scrollTrigger: { trigger: section, start: '20% top', end: '70% top', scrub: 1 },
      })
      // Foreground particles at 1.2x
      gsap.to(particlesRef.current, {
        yPercent: -80,
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom top', scrub: 0.8 },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  /* ── Entrance animation ── */
  useEffect(() => {
    // Set initial states explicitly so elements are visible even if animation is interrupted
    gsap.set(planetRef.current, { scale: 0.5, opacity: 0 })
    gsap.set(ringsRef.current, { scale: 0.6, opacity: 0 })
    // Set each child of textRef to start invisible
    if (textRef.current) {
      gsap.set(textRef.current.children, { y: 60, opacity: 0 })
    }

    const tl = gsap.timeline({ delay: 0.3 })
    tl.to(planetRef.current, { scale: 1, opacity: 1, duration: 2.5, ease: 'power3.out' })
      .to(ringsRef.current,  { scale: 1, opacity: 1, duration: 2,   ease: 'power2.out' }, '-=2')
      .to(textRef.current ? Array.from(textRef.current.children) : [],
          { y: 0, opacity: 1, duration: 1.2, stagger: 0.12, ease: 'power3.out' }, '-=1.5')

    return () => { tl.kill() }
  }, [])

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '600px',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 60%, #0a0520 0%, #020408 50%, #000205 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Layer 1: Star canvas – 0.1x */}
      <div ref={starsRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <ParticleBackground count={400} color="#ffffff" speed={0.1} mouseParallax={false} />
      </div>

      {/* Layer 2: Nebula – 0.2x */}
      <div ref={nebulaRef} style={{ position: 'absolute', inset: '-20%', zIndex: 2, pointerEvents: 'none' }}>
        {/* Violet nebula cloud left */}
        <div style={{
          position: 'absolute',
          top: '10%', left: '-5%',
          width: '60%', height: '80%',
          background: 'radial-gradient(ellipse at center, rgba(123,47,255,0.12) 0%, transparent 65%)',
          filter: 'blur(40px)',
        }} />
        {/* Blue nebula cloud right */}
        <div style={{
          position: 'absolute',
          top: '20%', right: '-5%',
          width: '55%', height: '70%',
          background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.08) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }} />
        {/* Center glow */}
        <div style={{
          position: 'absolute',
          top: '30%', left: '25%',
          width: '50%', height: '50%',
          background: 'radial-gradient(ellipse at center, rgba(0,100,180,0.1) 0%, transparent 70%)',
          filter: 'blur(30px)',
        }} />
      </div>

      {/* Layer 3: Planet – 0.4x */}
      <div ref={planetRef} style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 3, pointerEvents: 'none',
      }}>
        {/* Planet body */}
        <div style={{
          width: 'clamp(280px, 40vw, 520px)',
          height: 'clamp(280px, 40vw, 520px)',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, #1a0a4a 0%, #0d0525 40%, #05021a 100%)',
          boxShadow: [
            '0 0 80px 20px rgba(123,47,255,0.3)',
            '0 0 160px 60px rgba(0,50,100,0.2)',
            'inset -30px -30px 60px rgba(0,0,0,0.8)',
            'inset 15px 15px 40px rgba(123,47,255,0.1)',
          ].join(', '),
          animation: 'float-slow 8s ease-in-out infinite',
          position: 'relative',
        }}>
          {/* Surface texture overlay */}
          <div style={{
            position: 'absolute', inset: 0, borderRadius: '50%',
            background: 'radial-gradient(circle at 30% 25%, rgba(0,212,255,0.08) 0%, transparent 50%)',
          }} />
          {/* Atmosphere rim */}
          <div style={{
            position: 'absolute', inset: '-12px', borderRadius: '50%',
            background: 'transparent',
            boxShadow: '0 0 40px 15px rgba(0,212,255,0.12), 0 0 80px 30px rgba(123,47,255,0.08)',
          }} />
        </div>
      </div>

      {/* Layer 4: Orbital rings – 0.55x */}
      <div ref={ringsRef} style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 4, pointerEvents: 'none',
        width: 'clamp(380px, 55vw, 700px)',
        height: 'clamp(380px, 55vw, 700px)',
      }}>
        {/* Ring 1 */}
        <div style={{
          position: 'absolute', inset: 0,
          borderRadius: '50%',
          border: '1px solid rgba(0,212,255,0.25)',
          boxShadow: '0 0 15px rgba(0,212,255,0.15)',
          animation: 'orbit 12s linear infinite',
          transformOrigin: 'center',
        }} />
        {/* Ring 2 – tilted */}
        <div style={{
          position: 'absolute', inset: '8%',
          borderRadius: '50%',
          border: '1px solid rgba(123,47,255,0.2)',
          animation: 'orbit2 18s linear infinite',
        }} />
        {/* Ring 3 – smaller, faster */}
        <div style={{
          position: 'absolute', inset: '18%',
          borderRadius: '50%',
          border: '1px solid rgba(0,255,247,0.15)',
          animation: 'orbit 8s linear infinite reverse',
        }} />
        {/* Orbital dot on ring 1 */}
        <div style={{
          position: 'absolute',
          top: 0, left: '50%',
          width: '8px', height: '8px',
          marginLeft: '-4px', marginTop: '-4px',
          borderRadius: '50%',
          background: 'var(--color-blue)',
          boxShadow: '0 0 15px rgba(0,212,255,0.8)',
          animation: 'orbit 12s linear infinite',
          transformOrigin: '4px calc(50vw * 0.275 + 4px)',
        }} />
      </div>

      {/* Layer 5: Foreground floating particles – 1.2x */}
      <div ref={particlesRef} style={{
        position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none',
      }}>
        {Array.from({ length: 20 }, (_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${Math.random() * 4 + 2}px`,
            height: `${Math.random() * 4 + 2}px`,
            borderRadius: '50%',
            background: i % 3 === 0 ? 'var(--color-cyan)' : i % 3 === 1 ? 'var(--color-blue)' : 'var(--color-violet)',
            boxShadow: `0 0 ${Math.random() * 10 + 5}px currentColor`,
            animation: `float ${4 + Math.random() * 4}s ease-in-out ${Math.random() * 4}s infinite`,
            opacity: Math.random() * 0.6 + 0.3,
          }} />
        ))}
        {/* HUD floating elements */}
        <div style={{
          position: 'absolute', top: '15%', left: '8%',
          fontFamily: 'var(--font-display)', fontSize: '0.55rem',
          color: 'rgba(0,212,255,0.4)', letterSpacing: '0.15em',
          animation: 'float 6s ease-in-out infinite',
        }}>
          <div>SYS // 00.001</div>
          <div style={{ color: 'rgba(123,47,255,0.3)' }}>SIGNAL — LOCKED</div>
        </div>
        <div style={{
          position: 'absolute', top: '20%', right: '8%',
          fontFamily: 'var(--font-display)', fontSize: '0.55rem',
          color: 'rgba(0,212,255,0.3)', letterSpacing: '0.15em', textAlign: 'right',
          animation: 'float 7s ease-in-out 1s infinite',
        }}>
          <div>LAT: 34.0522° N</div>
          <div>LON: 118.2437° W</div>
          <div style={{ color: 'rgba(123,47,255,0.3)', marginTop: '2px' }}>ALT: ∞</div>
        </div>
        <div style={{
          position: 'absolute', bottom: '25%', left: '5%',
          fontFamily: 'var(--font-display)', fontSize: '0.5rem',
          color: 'rgba(0,255,247,0.3)', letterSpacing: '0.1em',
          animation: 'float 5s ease-in-out 2s infinite',
        }}>
          SECTOR // 7G-ALPHA
        </div>
      </div>

      {/* Layer 6: Hero text – 0.85x */}
      <div ref={textRef} style={{
        position: 'relative', zIndex: 6,
        textAlign: 'center', padding: '0 1rem',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem',
      }}>
        {/* Label chip */}
        <div className="label-chip" style={{ marginBottom: '0.5rem' }}>
          ENTER THE UNKNOWN
        </div>

        {/* Main heading */}
        <h1 style={{
          fontSize: 'clamp(3.5rem, 10vw, 8rem)',
          fontWeight: 900,
          lineHeight: 0.95,
          letterSpacing: '-0.02em',
          background: 'linear-gradient(180deg, #ffffff 30%, rgba(0,212,255,0.7) 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          textShadow: 'none',
          filter: 'drop-shadow(0 0 30px rgba(0,212,255,0.3))',
        }}>
          BEYOND<br />
          <span style={{
            background: 'linear-gradient(135deg, #00d4ff, #7b2fff)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}>THE VISIBLE</span>
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
          fontWeight: 300,
          letterSpacing: '0.05em',
          color: 'rgba(232,244,255,0.6)',
          maxWidth: '400px',
        }}>
          Scroll deeper. Discover another dimension.
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
          <button
            className="btn btn-primary"
            onClick={() => document.getElementById('descent')?.scrollIntoView({ behavior: 'smooth' })}
          >
            START JOURNEY
          </button>
          <button
            className="btn btn-outline"
            onClick={() => document.getElementById('worlds')?.scrollIntoView({ behavior: 'smooth' })}
          >
            EXPLORE WORLD
          </button>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute',
          bottom: '-120px',
          left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.55rem', letterSpacing: '0.3em',
            color: 'rgba(0,212,255,0.5)',
          }}>SCROLL TO EXPLORE</span>
          <div style={{
            width: '1px', height: '50px',
            background: 'linear-gradient(180deg, rgba(0,212,255,0.5), transparent)',
            animation: 'pulse-dot 2s ease-in-out infinite',
          }} />
          <span style={{ color: 'rgba(0,212,255,0.5)', fontSize: '0.8rem' }}>↓</span>
        </div>
      </div>

      {/* Bottom gradient fade into next section */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '200px',
        background: 'linear-gradient(0deg, #020408 0%, transparent 100%)',
        zIndex: 7, pointerEvents: 'none',
      }} />
    </div>
  )
}
