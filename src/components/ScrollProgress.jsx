import React, { useEffect, useState } from 'react'

const SECTIONS = [
  { id: 'hero',    label: '01', name: 'ENTER' },
  { id: 'descent', label: '02', name: 'DESCENT' },
  { id: 'warp',    label: '03', name: 'WARP' },
  { id: 'worlds',  label: '04', name: 'WORLDS' },
  { id: 'core',    label: '05', name: 'CORE' },
  { id: 'signal',  label: '06', name: 'SIGNAL' },
  { id: 'final',   label: '07', name: 'END' },
]

export default function ScrollProgress() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    // Track overall scroll progress
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? scrollTop / docHeight : 0
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    // Track active section using IntersectionObserver
    const observers = []
    SECTIONS.forEach((sec, idx) => {
      const el = document.getElementById(sec.id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveIndex(idx)
        },
        { threshold: 0.3 }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => {
      window.removeEventListener('scroll', onScroll)
      observers.forEach(o => o.disconnect())
    }
  }, [])

  const scrollToSection = (id) => {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div style={{
      position: 'fixed',
      right: '1.5rem',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0',
    }}>
      {/* Progress track */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        top: 0,
        bottom: 0,
        width: '1px',
        background: 'rgba(0, 212, 255, 0.12)',
        zIndex: -1,
      }} />

      {/* Filled progress */}
      <div style={{
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        top: 0,
        width: '1px',
        height: `${scrollProgress * 100}%`,
        background: 'linear-gradient(180deg, #00d4ff, #7b2fff)',
        zIndex: -1,
        transition: 'height 0.1s linear',
        boxShadow: '0 0 6px rgba(0,212,255,0.6)',
      }} />

      {SECTIONS.map((sec, idx) => {
        const isActive = idx === activeIndex
        return (
          <button
            key={sec.id}
            onClick={() => scrollToSection(sec.id)}
            title={sec.name}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              padding: '0.6rem 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              gap: '0.2rem',
              transition: 'all 0.3s ease',
            }}
          >
            {/* Dot */}
            <div style={{
              width: isActive ? '10px' : '6px',
              height: isActive ? '10px' : '6px',
              borderRadius: '50%',
              background: isActive
                ? 'var(--color-blue)'
                : 'rgba(0, 212, 255, 0.25)',
              border: isActive ? '1px solid rgba(0,212,255,0.8)' : '1px solid rgba(0,212,255,0.2)',
              boxShadow: isActive ? '0 0 10px rgba(0,212,255,0.8), 0 0 20px rgba(0,212,255,0.4)' : 'none',
              transition: 'all 0.3s ease',
            }} />
            {/* Label */}
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.42rem',
              letterSpacing: '0.1em',
              color: isActive ? 'var(--color-blue)' : 'rgba(0,212,255,0.3)',
              transition: 'all 0.3s ease',
              textShadow: isActive ? '0 0 8px rgba(0,212,255,0.8)' : 'none',
            }}>
              {sec.label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
