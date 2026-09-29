import React, { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Descent from './components/Descent'
import WarpDrive from './components/WarpDrive'
import DigitalWorlds from './components/DigitalWorlds'
import Core from './components/Core'
import Signal from './components/Signal'
import FinalSection from './components/FinalSection'
import ScrollProgress from './components/ScrollProgress'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const appRef = useRef(null)

  useEffect(() => {
    // Configure ScrollTrigger defaults for smoother experience
    ScrollTrigger.config({
      limitCallbacks: true,
      syncInterval: 40,
    })

    // Refresh on load to ensure correct positions
    ScrollTrigger.refresh()

    return () => {
      // Cleanup all ScrollTrigger instances on unmount
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <div ref={appRef} id="app-root">
      {/* Fixed UI Layer */}
      <Navbar />
      <ScrollProgress />

      {/* Scrollable Sections */}
      <main>
        <section id="hero">
          <Hero />
        </section>

        <section id="descent">
          <Descent />
        </section>

        <section id="warp">
          <WarpDrive />
        </section>

        <section id="worlds">
          <DigitalWorlds />
        </section>

        <section id="core">
          <Core />
        </section>

        <section id="signal">
          <Signal />
        </section>

        <section id="final">
          <FinalSection />
        </section>
      </main>
    </div>
  )
}
