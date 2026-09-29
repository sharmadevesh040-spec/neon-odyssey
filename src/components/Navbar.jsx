import React, { useEffect, useState, useRef } from 'react'
import { motion } from 'framer-motion'

const NAV_LINKS = [
  { label: 'JOURNEY',  href: '#hero' },
  { label: 'WORLDS',   href: '#worlds' },
  { label: 'CORE',     href: '#core' },
  { label: 'SIGNAL',   href: '#signal' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 900,
        padding: '0 2rem',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        background: scrolled
          ? 'rgba(2, 4, 8, 0.8)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled
          ? '1px solid rgba(0, 212, 255, 0.1)'
          : '1px solid transparent',
      }}
    >
      {/* Logo */}
      <a
        href="#hero"
        onClick={(e) => handleNavClick(e, '#hero')}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.9rem',
          fontWeight: 800,
          letterSpacing: '0.2em',
          textDecoration: 'none',
          color: 'transparent',
          backgroundImage: 'linear-gradient(90deg, #00d4ff, #7b2fff)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          textShadow: 'none',
          filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.5))',
          display: 'flex',
          flexDirection: 'column',
          lineHeight: 1,
          gap: '2px',
        }}
      >
        <span>NEON ODYSSEY</span>
        <span style={{
          fontSize: '0.45rem',
          letterSpacing: '0.35em',
          color: 'rgba(0, 212, 255, 0.5)',
          backgroundImage: 'none',
          WebkitTextFillColor: 'rgba(0, 212, 255, 0.5)',
          fontWeight: 400,
        }}>
          BEYOND THE VISIBLE
        </span>
      </a>

      {/* Desktop Nav Links */}
      <div style={{
        display: 'flex',
        gap: '2.5rem',
        alignItems: 'center',
      }} className="desktop-nav">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={(e) => handleNavClick(e, link.href)}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.65rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              color: 'rgba(232, 244, 255, 0.6)',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              position: 'relative',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = 'var(--color-blue)'
              e.currentTarget.style.textShadow = '0 0 15px rgba(0,212,255,0.6)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(232, 244, 255, 0.6)'
              e.currentTarget.style.textShadow = 'none'
            }}
          >
            {link.label}
          </a>
        ))}

        {/* CTA button */}
        <button
          className="btn btn-outline"
          style={{ padding: '0.5rem 1.2rem', fontSize: '0.6rem' }}
          onClick={(e) => handleNavClick(e, '#hero')}
        >
          LAUNCH
        </button>
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          flexDirection: 'column',
          gap: '5px',
          padding: '4px',
        }}
        className="mobile-menu-btn"
        aria-label="Toggle menu"
      >
        {[0,1,2].map(i => (
          <div key={i} style={{
            width: '22px',
            height: '1.5px',
            background: menuOpen ? 'var(--color-blue)' : 'rgba(232,244,255,0.7)',
            transition: 'all 0.3s ease',
            transform: menuOpen
              ? (i === 0 ? 'rotate(45deg) translate(5px, 5px)' : i === 2 ? 'rotate(-45deg) translate(5px, -5px)' : 'scaleX(0)')
              : 'none',
          }} />
        ))}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          style={{
            position: 'absolute',
            top: '70px',
            left: 0,
            right: 0,
            background: 'rgba(2, 4, 8, 0.95)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(0,212,255,0.15)',
            padding: '1.5rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
          }}
        >
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.75rem',
                letterSpacing: '0.2em',
                color: 'rgba(232,244,255,0.8)',
                textDecoration: 'none',
              }}
            >
              {link.label}
            </a>
          ))}
        </motion.div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-menu-btn { display: flex !important; }
        }
      `}</style>
    </motion.nav>
  )
}
