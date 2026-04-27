'use client'

import { useEffect, useRef } from 'react'

export default function HeroFog() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const _canvas = canvasRef.current
    if (!_canvas) return
    const canvas = _canvas
    const ctx = canvas.getContext('2d')!
    if (!ctx) return
    const hero = canvas.parentElement!
    if (!canvas.parentElement) return

    let W = 0, H = 0, DPR = 1
    const particles: Particle[] = []
    const PIXEL = 3
    const DENSITY = 1 / 900
    const mouse = { x: -9999, y: -9999, active: false }

    interface Cluster { x: number; y: number; radius: number; weight: number }
    interface Particle {
      hx: number; hy: number; x: number; y: number
      vx: number; vy: number; size: number
      baseAlpha: number; alpha: number
      hue: number; sat: number; lig: number
      driftPhase: number; driftSpeed: number; driftAmp: number
    }

    let clusters: Cluster[] = []

    function rand(a: number, b: number) { return a + Math.random() * (b - a) }
    function gauss() {
      let u = 0, v = 0
      while (u === 0) u = Math.random()
      while (v === 0) v = Math.random()
      return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
    }

    function makeClusters(): Cluster[] {
      const area = W * H
      const count = Math.max(4, Math.round(area / 38000))
      const out: Cluster[] = []
      for (let i = 0; i < count; i++) {
        out.push({
          x: rand(-W * 0.05, W * 1.05),
          y: rand(-H * 0.05, H * 1.05),
          radius: rand(60, 220),
          weight: rand(0.4, 1.4),
        })
      }
      return out
    }

    function makeParticle(): Particle {
      let x: number, y: number
      if (clusters.length === 0 || Math.random() < 0.08) {
        x = Math.random() * W
        y = Math.random() * H
      } else {
        let total = 0
        for (const c of clusters) total += c.weight
        let pick = Math.random() * total
        let cluster = clusters[0]
        for (const c of clusters) { pick -= c.weight; if (pick <= 0) { cluster = c; break } }
        x = cluster.x + gauss() * cluster.radius * 0.55
        y = cluster.y + gauss() * cluster.radius * 0.55
      }
      const orange = Math.random() < 0.22
      let hue: number, sat: number, lig: number
      if (orange) {
        hue = rand(12, 28); sat = rand(70, 95); lig = rand(55, 72)
      } else {
        hue = rand(20, 40); sat = rand(0, 18); lig = rand(82, 98)
      }
      const size = Math.random() < 0.15 ? PIXEL * 2 : PIXEL
      return {
        hx: x, hy: y, x, y, vx: 0, vy: 0, size,
        baseAlpha: rand(0.25, 0.9) * (orange ? 0.9 : 1),
        alpha: 0, hue, sat, lig,
        driftPhase: Math.random() * Math.PI * 2,
        driftSpeed: rand(0.0006, 0.0015),
        driftAmp: rand(4, 14),
      }
    }

    function resize() {
      const r = hero.getBoundingClientRect()
      DPR = Math.min(window.devicePixelRatio || 1, 2)
      W = Math.max(1, Math.floor(r.width))
      H = Math.max(1, Math.floor(r.height))
      canvas.width = W * DPR
      canvas.height = H * DPR
      canvas.style.width = W + 'px'
      canvas.style.height = H + 'px'
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0)
      clusters = makeClusters()
      const target = Math.round(W * H * DENSITY)
      particles.length = 0
      for (let i = 0; i < target; i++) particles.push(makeParticle())
    }

    function onMouseMove(e: MouseEvent) {
      const r = canvas.getBoundingClientRect()
      mouse.x = e.clientX - r.left
      mouse.y = e.clientY - r.top
      mouse.active = mouse.x >= 0 && mouse.x <= W && mouse.y >= 0 && mouse.y <= H
    }
    function onMouseLeave() { mouse.active = false }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseleave', onMouseLeave)
    window.addEventListener('blur', onMouseLeave)

    const REPEL_R = 110, REPEL_R2 = REPEL_R * REPEL_R
    const REPEL_FORCE = 0.55, RETURN = 0.018, FRICTION = 0.86

    let last = performance.now()
    let rafId: number

    function tick(now: number) {
      const dt = Math.min(2, (now - last) / 16.6667)
      last = now
      ctx.clearRect(0, 0, W, H)
      const mx = mouse.x, my = mouse.y, active = mouse.active
      for (const p of particles) {
        p.driftPhase += p.driftSpeed * dt * 16
        const dxh = (p.hx + Math.cos(p.driftPhase) * p.driftAmp) - p.x
        const dyh = (p.hy + Math.sin(p.driftPhase * 0.83) * p.driftAmp * 0.6) - p.y
        p.vx += dxh * RETURN
        p.vy += dyh * RETURN
        if (active) {
          const dx = p.x - mx, dy = p.y - my
          const d2 = dx * dx + dy * dy
          if (d2 < REPEL_R2 && d2 > 0.5) {
            const d = Math.sqrt(d2)
            const f = (1 - d / REPEL_R)
            const force = f * f * REPEL_FORCE
            p.vx += (dx / d) * force * 12
            p.vy += (dy / d) * force * 12
          }
        }
        p.vx *= FRICTION; p.vy *= FRICTION
        p.x += p.vx * dt; p.y += p.vy * dt
        const ddx = p.x - p.hx, ddy = p.y - p.hy
        const offset = Math.sqrt(ddx * ddx + ddy * ddy)
        const fade = Math.max(0.25, 1 - offset / 220)
        p.alpha += (p.baseAlpha * fade - p.alpha) * 0.12
        ctx.fillStyle = `hsla(${p.hue}, ${p.sat}%, ${p.lig}%, ${p.alpha})`
        const sx = Math.round(p.x / PIXEL) * PIXEL
        const sy = Math.round(p.y / PIXEL) * PIXEL
        ctx.fillRect(sx, sy, p.size, p.size)
      }
      rafId = requestAnimationFrame(tick)
    }

    const ro = new ResizeObserver(resize)
    ro.observe(hero)
    resize()
    rafId = requestAnimationFrame((t) => { last = t; tick(t) })

    return () => {
      cancelAnimationFrame(rafId)
      ro.disconnect()
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('blur', onMouseLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero__fog" aria-hidden="true" />
}
