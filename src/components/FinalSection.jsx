import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParticleBackground from './ParticleBackground'

export default function FinalSection() {
  const sectionRef  = useRef(null)
  const bgRef       = useRef(null)
  const planetRef   = useRef(null)
  const auroraRef   = useRef(null)
  const textRef     = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Planet parallax – slow
      gsap.to(planetRef.current, {
        yPercent: -30,
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 3 },
      })

      // Aurora parallax
      gsap.to(auroraRef.current, {
        yPercent: -15,
        scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 4 },
      })

      // Text reveal
      gsap.from(textRef.current?.children || [], {
        opacity: 0,
        y: 80,
        stagger: 0.2,
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          end: 'top 20%',
          scrub: 1.5,
        },
      })
    }, section)

    return () => ctx.revert()
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 100%, #0a0520 0%, #020408 40%, #000205 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Star field */}
      <div ref={bgRef} style={{ position: 'absolute', inset: 0, zIndex: 1 }}>
        <ParticleBackground count={350} color="#ffffff" speed={0.1} mouseParallax={true} />
      </div>

      {/* Aurora / neon glow bands */}
      <div ref={auroraRef} style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '60%',
        zIndex: 2, pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-10%', right: '-10%', height: '80%',
          background: 'radial-gradient(ellipse at 30% 100%, rgba(123,47,255,0.25) 0%, transparent 50%)',
          filter: 'blur(60px)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-10%', left: '-10%', right: '-10%', height: '70%',
          background: 'radial-gradient(ellipse at 70% 100%, rgba(0,212,255,0.2) 0%, transparent 50%)',
          filter: 'blur(50px)',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: '20%', right: '20%', height: '40%',
          background: 'radial-gradient(ellipse at 50% 100%, rgba(0,255,247,0.15) 0%, transparent 60%)',
          filter: 'blur(40px)',
        }} />
      </div>

      {/* Giant background planet */}
      <div ref={planetRef} style={{
        position: 'absolute',
        bottom: '-20%', left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 3, pointerEvents: 'none',
        width: 'clamp(400px, 70vw, 900px)',
        height: 'clamp(400px, 70vw, 900px)',
      }}>
        <div style={{
          width: '100%', height: '100%',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 30%, #150a35 0%, #080220 40%, #030112 80%)',
          boxShadow: [
            '0 0 100px 40px rgba(123,47,255,0.2)',
            '0 0 200px 80px rgba(0,50,120,0.15)',
            'inset -40px -40px 100px rgba(0,0,0,0.9)',
          ].join(', '),
        }}>
          {/* Planet surface banding */}
          {[15, 30, 45, 55].map((t, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: `${t}%`, left: '5%', right: '5%',
              height: '4%',
              borderRadius: '50%',
              background: `rgba(${i % 2 === 0 ? '0,100,180' : '80,20,150'},0.06)`,
              filter: 'blur(8px)',
            }} />
          ))}
        </div>
        {/* Planet atmosphere */}
        <div style={{
          position: 'absolute', inset: '-25px', borderRadius: '50%',
          boxShadow: [
            '0 0 60px 30px rgba(0,212,255,0.08)',
            '0 0 120px 60px rgba(123,47,255,0.06)',
          ].join(', '),
        }} />
      </div>

      {/* Galaxy behind the planet */}
      <div style={{
        position: 'absolute', top: '5%', left: '50%',
        transform: 'translateX(-50%)',
        width: '90%', height: '50%',
        background: 'radial-gradient(ellipse at center, rgba(0,50,120,0.1) 0%, transparent 60%)',
        filter: 'blur(30px)',
        zIndex: 2, pointerEvents: 'none',
      }} />

      {/* Main content */}
      <div
        ref={textRef}
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 clamp(1rem, 5vw, 4rem)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        {/* Label */}
        <div className="label-chip" style={{ justifyContent: 'center' }}>
          SECTOR 07 — END OF TRANSMISSION
        </div>

        {/* Heading */}
        <h1 style={{
          fontSize: 'clamp(3.5rem, 10vw, 9rem)',
          fontWeight: 900,
          lineHeight: 0.9,
          background: 'linear-gradient(180deg, #ffffff 20%, rgba(0,212,255,0.8) 70%, rgba(123,47,255,0.6) 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          textShadow: 'none',
          filter: 'drop-shadow(0 0 40px rgba(0,212,255,0.3))',
          letterSpacing: '-0.02em',
        }}>
          KEEP<br />
          <span style={{
            background: 'linear-gradient(135deg, #00d4ff 0%, #7b2fff 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}>EXPLORING.</span>
        </h1>

        {/* Subheading */}
        <p style={{
          fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
          fontWeight: 300,
          color: 'rgba(232,244,255,0.55)',
          maxWidth: '420px',
          letterSpacing: '0.03em',
        }}>
          The universe is bigger than your screen.
        </p>

        {/* Buttons */}
        <div style={{
          display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center',
          marginTop: '0.5rem',
        }}>
          <button className="btn btn-primary" onClick={scrollToTop}>
            ↑ RESTART JOURNEY
          </button>
          <button
            className="btn btn-outline"
            onClick={() => document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })}
          >
            EXPLORE AGAIN
          </button>
        </div>

        {/* Coordinate details */}
        <div style={{
          marginTop: '2rem',
          fontFamily: 'var(--font-display)',
          fontSize: '0.5rem',
          letterSpacing: '0.2em',
          color: 'rgba(0,212,255,0.25)',
          display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center',
        }}>
          <span>NEON ODYSSEY // v1.0</span>
          <span>BEYOND THE VISIBLE</span>
          <span>∞ LY FROM HOME</span>
        </div>
      </div>

      {/* Top gradient */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '200px',
        background: 'linear-gradient(180deg, #020408, transparent)',
        zIndex: 11, pointerEvents: 'none',
      }} />
    </div>
  )
}
