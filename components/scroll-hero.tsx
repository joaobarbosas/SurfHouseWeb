'use client'

import { useEffect, useRef } from 'react'

const FRAME_COUNT = 193

export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const framesRef = useRef<HTMLImageElement[]>([])
  const currentIndexRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const frames: HTMLImageElement[] = []
    framesRef.current = frames
    let disposed = false
    let raf = 0
    let targetIndex = 0
    let sequenceRequested = false

    const draw = () => {
      raf = 0
      if (disposed) return
      const img = frames[targetIndex]
      if (!img?.complete || !img.naturalWidth) return
      const scale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight)
      const width = img.naturalWidth * scale
      const height = img.naturalHeight * scale
      ctx.drawImage(img, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height)
      canvas.style.opacity = '1'
      currentIndexRef.current = targetIndex
    }
    const scheduleDraw = () => {
      if (!disposed && !raf) raf = requestAnimationFrame(draw)
    }
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      scheduleDraw()
    }
    const loadFrame = (index: number) => {
      const img = new Image()
      frames[index] = img
      img.onload = () => {
        if (index === targetIndex) scheduleDraw()
      }
      img.src = `/frames/frame_${String(index + 1).padStart(4, '0')}.jpg`
    }
    const onScroll = () => {
      const scrollable = container.offsetHeight - window.innerHeight
      const progress = media.matches || scrollable <= 0 ? 0 : Math.min(1,
        Math.max(0, -container.getBoundingClientRect().top / scrollable))
      targetIndex = Math.round(progress * (FRAME_COUNT - 1))
      if (overlayRef.current) {
        overlayRef.current.style.opacity = String(Math.max(0, 1 - progress * 3))
      }
      scheduleDraw()
    }
    const configureMotion = () => {
      // Reduced-motion visitors only request the static first frame.
      if (!media.matches && !sequenceRequested) {
        sequenceRequested = true
        for (let i = 1; i < FRAME_COUNT; i++) loadFrame(i)
      }
      onScroll()
    }

    loadFrame(0)
    resize()
    configureMotion()
    window.addEventListener('resize', resize)
    window.addEventListener('scroll', onScroll, { passive: true })
    media.addEventListener('change', configureMotion)
    return () => {
      disposed = true
      window.removeEventListener('resize', resize)
      window.removeEventListener('scroll', onScroll)
      media.removeEventListener('change', configureMotion)
      cancelAnimationFrame(raf)
      frames.forEach(img => { img.onload = null })
    }
  }, [])

  return (
    <div ref={containerRef} className="scroll-hero" style={{ position: 'relative', height: '300vh' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', width: '100vw', overflow: 'hidden' }}>

        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            opacity: 0,
            transition: 'opacity 400ms ease',
          }}
        />

        {/* Cinematic gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'linear-gradient(to bottom, rgba(12,10,9,0.25) 0%, rgba(12,10,9,0.05) 40%, rgba(12,10,9,0.6) 100%)',
        }} />

        {/* Hero text — fades out as scroll progresses */}
        <div
          ref={overlayRef}
          style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}
        >
          <p style={{ fontFamily: 'var(--font-jost)', color: '#CA8A04', fontSize: '11px', letterSpacing: '0.4em', textTransform: 'uppercase', marginBottom: '24px', animation: 'fadeInUp 1.2s 0.3s both' }}>
            Crystal Point
          </p>
          <h1 style={{ fontFamily: 'var(--font-bodoni)', fontStyle: 'italic', fontSize: 'clamp(3.5rem, 10vw, 9rem)', lineHeight: 0.9, fontWeight: 300, color: '#FAFAF9', textAlign: 'center', animation: 'fadeInUp 1.4s 0.5s both' }}>
            Surf Ranch
          </h1>
          <p style={{ fontFamily: 'var(--font-jost)', fontWeight: 300, fontSize: '13px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(250,250,249,0.65)', marginTop: '32px', animation: 'fadeInUp 1s 0.9s both' }}>
            Malibu, California
          </p>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: '40px', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', animation: 'fadeIn 0.8s 1.6s both', pointerEvents: 'none' }}>
          <p style={{ fontFamily: 'var(--font-jost)', fontSize: '10px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(250,250,249,0.4)' }}>
            Scroll to explore
          </p>
          <div style={{ width: '1px', height: '48px', background: 'rgba(250,250,249,0.15)', overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', top: 0, width: '100%', height: '40%', background: 'rgba(250,250,249,0.6)', animation: 'scrollLine 1.4s linear infinite' }} />
          </div>
        </div>

      </div>
    </div>
  )
}
