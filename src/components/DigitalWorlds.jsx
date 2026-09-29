import React, { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion } from 'framer-motion'
import ParticleBackground from './ParticleBackground'

const CARDS = [
  {
    num: '01',
    title: 'NEBULA',
    subtitle: 'COSMIC CLOUD',
    desc: 'Where light becomes matter. A nursery of stars forged from the collapse of ancient giants, born in the cradle of hydrogen fire.',
    color: '#00d4ff',
    grad: 'linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,100,180,0.06))',
    glow: 'rgba(0,212,255,0.35)',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="12" stroke="#00d4ff" strokeWidth="1" opacity="0.6"/>
        <circle cx="20" cy="20" r="6" fill="rgba(0,212,255,0.2)" stroke="#00d4ff" strokeWidth="1"/>
        <circle cx="20" cy="20" r="2" fill="#00d4ff"/>
        {[0,60,120,180,240,300].map(a => (
          <line key={a}
            x1={20 + 8 * Math.cos(a * Math.PI/180)}
            y1={20 + 8 * Math.sin(a * Math.PI/180)}
            x2={20 + 14 * Math.cos(a * Math.PI/180)}
            y2={20 + 14 * Math.sin(a * Math.PI/180)}
            stroke="#00d4ff" strokeWidth="0.5" opacity="0.4"
          />
        ))}
      </svg>
    ),
    stats: [{ l: 'DENSITY', v: '4.2 g/cm³' }, { l: 'TEMP', v: '12,000 K' }],
  },
  {
    num: '02',
    title: 'VOID',
    subtitle: 'DARK MATTER',
    desc: 'Where silence becomes infinite. A region of absolute emptiness where even the laws of physics bend toward the impossible.',
    color: '#7b2fff',
    grad: 'linear-gradient(135deg, rgba(123,47,255,0.15), rgba(60,0,150,0.06))',
    glow: 'rgba(123,47,255,0.4)',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <circle cx="20" cy="20" r="14" stroke="#7b2fff" strokeWidth="0.5" opacity="0.4" strokeDasharray="3 3"/>
        <circle cx="20" cy="20" r="8" stroke="#7b2fff" strokeWidth="1" opacity="0.6"/>
        <circle cx="20" cy="20" r="3" fill="#7b2fff" opacity="0.8"/>
        <circle cx="20" cy="20" r="1.5" fill="#ffffff"/>
      </svg>
    ),
    stats: [{ l: 'PRESSURE', v: '0.000 atm' }, { l: 'MATTER', v: 'DARK' }],
  },
  {
    num: '03',
    title: 'HORIZON',
    subtitle: 'EVENT BOUNDARY',
    desc: 'Where the unknown begins. The boundary beyond which information ceases to escape — a one-way door at the edge of reality.',
    color: '#00fff7',
    grad: 'linear-gradient(135deg, rgba(0,255,247,0.1), rgba(0,150,180,0.06))',
    glow: 'rgba(0,255,247,0.3)',
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
        <ellipse cx="20" cy="20" rx="16" ry="6" stroke="#00fff7" strokeWidth="1" opacity="0.5"/>
        <ellipse cx="20" cy="20" rx="10" ry="4" stroke="#00fff7" strokeWidth="0.8" opacity="0.4"/>
        <circle cx="20" cy="20" r="4" fill="rgba(0,255,247,0.1)" stroke="#00fff7" strokeWidth="1"/>
        <circle cx="20" cy="20" r="1.5" fill="#00fff7"/>
      </svg>
    ),
    stats: [{ l: 'RADIUS', v: '∞' }, { l: 'ESCAPE', v: 'IMPOSSIBLE' }],
  },
]

function Card({ card, index, containerRef }) {
  const cardRef  = useRef(null)
  const glowRef  = useRef(null)
  const [hovered, setHovered] = useState(false)
  const bounds   = useRef(null)

  // 3D tilt on mouse move
  const handleMouseMove = (e) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width  - 0.5  // -0.5 to 0.5
    const y = (e.clientY - rect.top)  / rect.height - 0.5

    gsap.to(cardRef.current, {
      rotateY: x * 18,
      rotateX: -y * 14,
      transformPerspective: 1000,
      duration: 0.4,
      ease: 'power1.out',
    })
    if (glowRef.current) {
      glowRef.current.style.background = `radial-gradient(circle at ${(x+0.5)*100}% ${(y+0.5)*100}%, ${card.glow} 0%, transparent 65%)`
    }
  }

  const handleMouseLeave = () => {
    setHovered(false)
    gsap.to(cardRef.current, {
      rotateY: 0, rotateX: 0,
      duration: 0.8, ease: 'elastic.out(1, 0.5)',
    })
  }

  // Floating animation
  useEffect(() => {
    if (!cardRef.current) return
    gsap.to(cardRef.current, {
      y: -12,
      duration: 2.5 + index * 0.5,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut',
      delay: index * 0.4,
    })
  }, [index])

  // Scroll parallax (each card at slightly different speed)
  useEffect(() => {
    if (!cardRef.current) return
    const speeds = [0.6, 0.75, 0.9]
    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5,
        onUpdate: (self) => {
          const yShift = (self.progress - 0.5) * 100 * (1 - speeds[index])
          // applied via the floating animation, just shift the container
        },
      })
    })
    return () => ctx.revert()
  }, [index, containerRef])

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        background: card.grad,
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: `1px solid ${hovered ? card.color : 'rgba(255,255,255,0.07)'}`,
        borderRadius: '4px',
        padding: 'clamp(1.5rem, 3vw, 2.5rem)',
        cursor: 'default',
        transition: 'border-color 0.4s ease, box-shadow 0.4s ease',
        boxShadow: hovered
          ? `0 0 40px ${card.glow}, 0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)`
          : '0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.04)',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        minHeight: '360px',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        overflow: 'hidden',
      }}
    >
      {/* Dynamic glow layer */}
      <div ref={glowRef} style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        borderRadius: '4px', transition: 'opacity 0.3s ease',
        opacity: hovered ? 1 : 0,
      }} />

      {/* HUD corners */}
      <div className="hud-corner hud-corner-tl" style={{ borderColor: card.color, opacity: 0.5 }} />
      <div className="hud-corner hud-corner-br" style={{ borderColor: card.color, opacity: 0.5 }} />

      {/* Card number */}
      <div style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.6rem',
        letterSpacing: '0.2em',
        color: `${card.color}66`,
        fontWeight: 700,
      }}>
        {card.num} — {card.subtitle}
      </div>

      {/* Icon */}
      <div style={{ transform: hovered ? 'scale(1.1)' : 'scale(1)', transition: 'transform 0.4s ease' }}>
        {card.icon}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: 'clamp(1.5rem, 3vw, 2.2rem)',
        fontWeight: 800,
        color: card.color,
        textShadow: hovered ? `0 0 20px ${card.glow}` : 'none',
        transition: 'text-shadow 0.4s ease',
        letterSpacing: '0.1em',
      }}>
        {card.title}
      </h3>

      {/* Description */}
      <p style={{
        fontSize: '0.9rem',
        lineHeight: 1.7,
        color: 'rgba(232,244,255,0.6)',
        flex: 1,
      }}>
        {card.desc}
      </p>

      {/* Stats */}
      <div style={{
        display: 'flex', gap: '1.5rem',
        borderTop: `1px solid rgba(255,255,255,0.06)`,
        paddingTop: '1rem',
        marginTop: 'auto',
        opacity: hovered ? 1 : 0.5,
        transition: 'opacity 0.4s ease',
      }}>
        {card.stats.map(s => (
          <div key={s.l} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.45rem', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>
              {s.l}
            </span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', color: card.color, fontWeight: 700 }}>
              {s.v}
            </span>
          </div>
        ))}
      </div>

      {/* Hover reveal bottom bar */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: '3px',
        background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
        opacity: hovered ? 1 : 0,
        transition: 'opacity 0.4s ease',
        boxShadow: `0 0 10px ${card.glow}`,
      }} />
    </div>
  )
}

export default function DigitalWorlds() {
  const sectionRef  = useRef(null)
  const containerRef= useRef(null)
  const headingRef  = useRef(null)
  const cardsRef    = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.from(headingRef.current, {
        opacity: 0, y: 80, filter: 'blur(20px)',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 80%',
          end: 'top 40%',
          scrub: 1.5,
        },
      })

      // Cards stagger in
      gsap.from(cardsRef.current?.children || [], {
        opacity: 0, y: 100, scale: 0.9,
        stagger: 0.15,
        scrollTrigger: {
          trigger: cardsRef.current,
          start: 'top 85%',
          end: 'top 35%',
          scrub: 2,
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
        minHeight: '100vh',
        padding: 'clamp(5rem, 10vh, 10rem) clamp(1.5rem, 6vw, 8rem)',
        overflow: 'hidden',
        background: 'radial-gradient(ellipse at 60% 40%, #08031a 0%, #020408 50%, #000205 100%)',
        display: 'flex',
        flexDirection: 'column',
        gap: '4rem',
      }}
    >
      {/* Star background */}
      <ParticleBackground count={200} color="#ffffff" speed={0.15} mouseParallax={false} />

      {/* Heading */}
      <div ref={headingRef} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <div className="label-chip" style={{ marginBottom: '1.5rem', justifyContent: 'center' }}>
          SECTOR 04 — DIGITAL WORLDS
        </div>
        <h2 style={{
          fontSize: 'clamp(2.5rem, 6vw, 5rem)',
          fontWeight: 900,
          background: 'linear-gradient(135deg, #ffffff 30%, #7b2fff 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          color: 'transparent',
          marginBottom: '1rem',
        }}>
          DIGITAL<br />
          <span style={{
            background: 'linear-gradient(135deg, #00d4ff, #00fff7)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
          }}>WORLDS</span>
        </h2>
        <p style={{ maxWidth: '500px', margin: '0 auto', opacity: 0.6, fontSize: '1rem' }}>
          Three realms at the edge of existence. Choose your dimension.
        </p>
      </div>

      {/* Cards grid */}
      <div
        ref={cardsRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: 'clamp(1rem, 3vw, 2rem)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {CARDS.map((card, i) => (
          <Card key={card.num} card={card} index={i} containerRef={sectionRef} />
        ))}
      </div>

      {/* Ambient glow behind cards */}
      <div style={{
        position: 'absolute',
        top: '50%', left: '50%',
        transform: 'translate(-50%,-50%)',
        width: '80%', height: '60%',
        background: 'radial-gradient(ellipse at center, rgba(123,47,255,0.05) 0%, transparent 70%)',
        filter: 'blur(40px)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      {/* Section fades */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(180deg, #020408, transparent)', pointerEvents: 'none', zIndex: 2 }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '150px', background: 'linear-gradient(0deg, #020408, transparent)', pointerEvents: 'none', zIndex: 2 }} />
    </div>
  )
}
