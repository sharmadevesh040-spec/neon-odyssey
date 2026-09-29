import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParticleBackground from './ParticleBackground'

export default function Core() {
  const sectionRef = useRef(null)
  const coreRef    = useRef(null)
  const ringsRef   = useRef([])
  const textRef    = useRef(null)
  const particlesRef = useRef(null)
  const gridRef    = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Core grows from small to large as you scroll
      gsap.fromTo(coreRef.current,
        { scale: 0.15, opacity: 0 },
        {
          scale: 1, opacity: 1,
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            end: 'center center',
            scrub: 2,
          },
        }
      )

      // Core expands dramatically at the end of the section
      gsap.to(coreRef.current, {
        scale: 2.5,
        opacity: 0.4,
        filter: 'blur(40px)',
        scrollTrigger: {
          trigger: section,
          start: '70% center',
          end: 'bottom top',
          scrub: 1.5,
        },
      })

      // Rings rotate speed increases with scroll
      ringsRef.current.forEach((ring, i) => {
        if (!ring) return
        // Just ensure they're visible with scroll
        gsap.from(ring, {
          opacity: 0, scale: 0.3,
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'top 20%',
            scrub: 2,
          },
          delay: i * 0.1,
        })
      })

      // Grid appears
      gsap.from(gridRef.current, {
        opacity: 0, scale: 0.8,
        scrollTrigger: {
          trigger: section,
          start: 'top 60%',
          end: 'top 20%',
          scrub: 2,
        },
      })

      // Particle field
      gsap.from(particlesRef.current, {
        opacity: 0,
        scrollTrigger: {
          trigger: section,
          start: 'top 50%',
          end: 'center center',
          scrub: 2,
        },
      })

      // Text reveal
      gsap.from(textRef.current, {
        opacity: 0, y: 60,
        scrollTrigger: {
          trigger: textRef.current,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1.5,
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
        height: '200vh',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 50% 50%, #060020 0%, #020408 40%, #000205 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Star field */}
      <ParticleBackground count={180} color="#ffffff" speed={0.1} mouseParallax={false} />

      {/* Digital grid (background) */}
      <div ref={gridRef} style={{
        position: 'absolute',
        inset: 0,
        zIndex: 1,
        pointerEvents: 'none',
        backgroundImage: [
          'linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px)',
          'linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)',
        ].join(', '),
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)',
      }} />

      {/* Core + rings — sticky for dramatic reveal */}
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,
        pointerEvents: 'none',
      }}>
        {/* Energy particles */}
        <div ref={particlesRef} style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          {Array.from({ length: 30 }, (_, i) => {
            const angle = (i / 30) * 360
            const dist  = 120 + Math.random() * 80
            return (
              <div key={i} style={{
                position: 'absolute',
                top: '50%', left: '50%',
                width: `${Math.random() * 4 + 2}px`,
                height: `${Math.random() * 4 + 2}px`,
                borderRadius: '50%',
                background: i % 3 === 0 ? 'var(--color-cyan)' : i % 3 === 1 ? 'var(--color-blue)' : 'var(--color-violet)',
                boxShadow: `0 0 10px currentColor`,
                transform: `translate(${dist * Math.cos(angle * Math.PI/180)}px, ${dist * Math.sin(angle * Math.PI/180)}px)`,
                animation: `float ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite, rotate-slow ${8 + Math.random() * 12}s linear ${Math.random() * -10}s infinite`,
                transformOrigin: `${-dist * Math.cos(angle * Math.PI/180)}px ${-dist * Math.sin(angle * Math.PI/180)}px`,
              }} />
            )
          })}
        </div>

        {/* Rings container */}
        <div style={{ position: 'absolute', width: '500px', height: '500px', zIndex: 3 }}>
          {/* Ring 1 – outer, slow */}
          <div
            ref={el => ringsRef.current[0] = el}
            style={{
              position: 'absolute', inset: 0,
              borderRadius: '50%',
              border: '1px solid rgba(0,212,255,0.3)',
              boxShadow: '0 0 20px rgba(0,212,255,0.15)',
              animation: 'orbit 15s linear infinite',
            }}
          >
            {/* Ring dot */}
            <div style={{
              position: 'absolute',
              top: 0, left: '50%',
              width: '10px', height: '10px',
              marginLeft: '-5px', marginTop: '-5px',
              borderRadius: '50%',
              background: '#00d4ff',
              boxShadow: '0 0 20px rgba(0,212,255,1)',
            }} />
          </div>

          {/* Ring 2 – tilted, medium */}
          <div
            ref={el => ringsRef.current[1] = el}
            style={{
              position: 'absolute', inset: '8%',
              borderRadius: '50%',
              border: '1px solid rgba(123,47,255,0.4)',
              boxShadow: '0 0 15px rgba(123,47,255,0.2)',
              animation: 'orbit2 10s linear infinite',
            }}
          />

          {/* Ring 3 – inner fast */}
          <div
            ref={el => ringsRef.current[2] = el}
            style={{
              position: 'absolute', inset: '20%',
              borderRadius: '50%',
              border: '1px solid rgba(0,255,247,0.35)',
              animation: 'orbit 6s linear infinite reverse',
            }}
          >
            <div style={{
              position: 'absolute',
              top: 0, left: '50%',
              width: '6px', height: '6px',
              marginLeft: '-3px', marginTop: '-3px',
              borderRadius: '50%',
              background: '#00fff7',
              boxShadow: '0 0 15px rgba(0,255,247,0.9)',
            }} />
          </div>

          {/* Ring 4 – outermost */}
          <div
            ref={el => ringsRef.current[3] = el}
            style={{
              position: 'absolute', inset: '-8%',
              borderRadius: '50%',
              border: '0.5px solid rgba(0,212,255,0.15)',
              animation: 'orbit 25s linear infinite',
            }}
          />
        </div>

        {/* The Core sphere */}
        <div
          ref={coreRef}
          style={{
            position: 'absolute',
            width: 'clamp(180px, 22vw, 280px)',
            height: 'clamp(180px, 22vw, 280px)',
            borderRadius: '50%',
            zIndex: 4,
            willChange: 'transform, opacity',
            background: [
              'radial-gradient(circle at 35% 35%, #3a1060 0%, #1a0540 30%, #0a0225 60%, #050015 100%)',
            ].join(', '),
            boxShadow: [
              '0 0 60px 20px rgba(0,212,255,0.4)',
              '0 0 120px 50px rgba(123,47,255,0.3)',
              '0 0 200px 80px rgba(0,100,200,0.15)',
              'inset -20px -20px 50px rgba(0,0,0,0.8)',
              'inset 10px 10px 30px rgba(123,47,255,0.2)',
            ].join(', '),
            animation: 'core-pulse 3s ease-in-out infinite',
          }}
        >
          {/* Inner core light */}
          <div style={{
            position: 'absolute',
            top: '25%', left: '25%',
            width: '50%', height: '50%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,212,255,0.3) 0%, transparent 70%)',
          }} />
          {/* Surface energy lines */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', borderRadius: '50%', opacity: 0.3 }} viewBox="0 0 100 100">
            {[0,30,60,90,120,150].map(a => (
              <ellipse key={a}
                cx="50" cy="50"
                rx="30" ry="10"
                fill="none"
                stroke={a % 60 === 0 ? '#00d4ff' : '#7b2fff'}
                strokeWidth="0.3"
                opacity="0.5"
                transform={`rotate(${a} 50 50)`}
              />
            ))}
          </svg>
        </div>

        {/* HUD elements around the core */}
        {[0, 90, 180, 270].map(angle => (
          <div key={angle} style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: `translate(-50%, -50%) rotate(${angle}deg) translateY(-200px)`,
            fontFamily: 'var(--font-display)',
            fontSize: '0.45rem',
            letterSpacing: '0.2em',
            color: 'rgba(0,212,255,0.3)',
            whiteSpace: 'nowrap',
            zIndex: 5,
          }}>
            {angle === 0   && 'CORE TEMP: 1.4×10³² K'}
            {angle === 90  && 'OUTPUT: MAX'}
            {angle === 180 && 'ENERGY: STABLE'}
            {angle === 270 && 'FIELD: ACTIVE'}
          </div>
        ))}
      </div>

      {/* Text content */}
      <div ref={textRef} style={{
        position: 'absolute',
        top: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        textAlign: 'center',
        zIndex: 10,
        width: 'min(600px, 90vw)',
        willChange: 'transform, opacity',
      }}>
        <div className="label-chip" style={{ marginBottom: '1.5rem', justifyContent: 'center' }}>
          SECTOR 05 — THE CORE
        </div>
        <h2 style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #7b2fff 0%, #00d4ff 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: '1rem',
          letterSpacing: '0.05em',
        }}>
          THE CORE
        </h2>
        <p style={{ fontSize: '1rem', opacity: 0.6, lineHeight: 1.8 }}>
          Everything begins here. The source of all energy, all light, all possibility — compressed into a single point of infinite potential.
        </p>
      </div>

      {/* Section fades */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(180deg, #020408, transparent)', pointerEvents: 'none', zIndex: 20 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(0deg, #020408, transparent)', pointerEvents: 'none', zIndex: 20 }} />
    </div>
  )
}
