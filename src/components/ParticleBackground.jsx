import React, { useEffect, useRef, useCallback } from 'react'

/**
 * Canvas-based star field with optional parallax depth.
 * Stars are distributed across 3 depth layers:
 *   - layer 0 (far): slow, tiny, dim
 *   - layer 1 (mid): medium
 *   - layer 2 (near): fast, larger, bright
 *
 * Props:
 *   count      – total stars (default 300)
 *   color      – base star color (default '#00d4ff')
 *   speed      – base scroll parallax multiplier (default 0.3)
 *   mouseParallax – enable mouse movement parallax (default true)
 */
export default function ParticleBackground({
  count = 300,
  color = '#ffffff',
  speed = 0.3,
  mouseParallax = true,
  style = {},
}) {
  const canvasRef = useRef(null)
  const starsRef = useRef([])
  const mouseRef = useRef({ x: 0, y: 0 })
  const rafRef = useRef(null)
  const scrollRef = useRef(0)

  // Reduce particles on mobile for performance
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768
  const actualCount = isMobile ? Math.floor(count * 0.4) : count

  const initStars = useCallback((w, h) => {
    starsRef.current = Array.from({ length: actualCount }, () => {
      const layer = Math.floor(Math.random() * 3) // 0=far, 1=mid, 2=near
      return {
        x: Math.random() * w,
        y: Math.random() * h,
        baseX: Math.random() * w,
        baseY: Math.random() * h,
        r: layer === 0 ? Math.random() * 0.8 + 0.2
           : layer === 1 ? Math.random() * 1.2 + 0.5
           : Math.random() * 2 + 0.8,
        alpha: layer === 0 ? Math.random() * 0.4 + 0.1
               : layer === 1 ? Math.random() * 0.5 + 0.2
               : Math.random() * 0.6 + 0.4,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        twinkleOffset: Math.random() * Math.PI * 2,
        layer,
        // parallax multiplier per layer
        parallaxX: layer === 0 ? 0.1 : layer === 1 ? 0.25 : 0.5,
        parallaxY: layer === 0 ? 0.05 : layer === 1 ? 0.15 : 0.3,
      }
    })
  }, [actualCount])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w = canvas.offsetWidth
    let h = canvas.offsetHeight
    let frame = 0

    const resize = () => {
      w = canvas.offsetWidth
      h = canvas.offsetHeight
      canvas.width = w
      canvas.height = h
      initStars(w, h)
    }
    resize()

    const onMouseMove = (e) => {
      if (!mouseParallax) return
      mouseRef.current = {
        x: (e.clientX / w - 0.5) * 2, // -1 to 1
        y: (e.clientY / h - 0.5) * 2,
      }
    }

    const onScroll = () => {
      scrollRef.current = window.scrollY
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      frame++

      const mx = mouseRef.current.x
      const my = mouseRef.current.y

      starsRef.current.forEach(star => {
        // Mouse parallax offset
        const offsetX = mx * star.parallaxX * 30
        const offsetY = my * star.parallaxY * 20

        // Scroll parallax: stars shift up as user scrolls
        const scrollOffsetY = -(scrollRef.current * star.parallaxY * speed)

        const x = (star.baseX + offsetX) % w
        const y = ((star.baseY + offsetY + scrollOffsetY) % h + h) % h

        // Twinkle
        const twinkle = 0.5 + 0.5 * Math.sin(frame * star.twinkleSpeed + star.twinkleOffset)
        const alpha = star.alpha * (0.6 + 0.4 * twinkle)

        ctx.save()
        ctx.globalAlpha = alpha

        // Glow for near-layer stars
        if (star.layer === 2 && star.r > 1.5) {
          const grd = ctx.createRadialGradient(x, y, 0, x, y, star.r * 4)
          grd.addColorStop(0, color)
          grd.addColorStop(1, 'transparent')
          ctx.fillStyle = grd
          ctx.beginPath()
          ctx.arc(x, y, star.r * 4, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(x, y, star.r, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', resize)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', resize)
    }
  }, [initStars, mouseParallax, color, speed])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        ...style,
      }}
    />
  )
}
