<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const canvasRef = ref(null)
const heroRef = ref(null)
let animationId = null

onMounted(() => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  const isMobile = window.innerWidth < 768
  let width = canvas.width = window.innerWidth
  let height = canvas.height = window.innerHeight

  const colors = {
    oceanBlue: '#006994',
    sunsetOrange: '#FF7F50',
    sunsetYellow: '#FFD700'
  }

  let particles = []
  const particleCount = isMobile ? 50 : 100

  class Particle {
    constructor() { this.reset() }
    reset() {
      this.x = Math.random() * width
      this.y = Math.random() * height
      this.vx = (Math.random() - 0.5) * 0.5
      this.vy = (Math.random() - 0.5) * 0.5
      this.size = Math.random() * 2.5 + 0.5
      this.color = Math.random() > 0.5 ? colors.oceanBlue
        : (Math.random() > 0.5 ? colors.sunsetOrange : colors.sunsetYellow)
      this.alpha = Math.random() * 0.5 + 0.1
    }
    update() {
      this.x += this.vx
      this.y += this.vy
      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) this.reset()
    }
    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.globalAlpha = this.alpha
      ctx.fill()
      ctx.globalAlpha = 1.0
    }
  }

  for (let i = 0; i < particleCount; i++) particles.push(new Particle())

  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#000000')
    gradient.addColorStop(0.5, '#051e3e')
    gradient.addColorStop(1, '#001f3f')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  const maxDist = isMobile ? 80 : 100

  function animate() {
    ctx.clearRect(0, 0, width, height)
    drawBackground()
    particles.forEach(p => { p.update(); p.draw() })

    if (!isMobile) {
      ctx.lineWidth = 0.2
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < maxDist) {
            ctx.globalAlpha = (1 - dist / maxDist) * 0.25
            ctx.strokeStyle = colors.oceanBlue
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
            ctx.globalAlpha = 1
          }
        }
      }
    }

    animationId = requestAnimationFrame(animate)
  }

  animate()

  // Entry animations
  const tl = gsap.timeline({ delay: 0.2 })
  tl.fromTo('.hero-eyebrow',
    { opacity: 0, y: 20, letterSpacing: '8px' },
    { opacity: 1, y: 0, letterSpacing: '4px', duration: 0.8, ease: 'power2.out' }
  )
  .fromTo('.title',
    { opacity: 0, y: 80, skewY: 3 },
    { opacity: 1, y: 0, skewY: 0, duration: 1.1, ease: 'power3.out' }, '-=0.3'
  )
  .fromTo('.subtitle',
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.9, ease: 'power2.out' }, '-=0.5'
  )
  .fromTo('.scroll-indicator',
    { opacity: 0, y: 10 },
    { opacity: 0.65, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.3'
  )

  // Parallax on scroll — title moves up, fades
  gsap.to('.hero-content', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1
    },
    y: '-18vh',
    opacity: 0,
    ease: 'none'
  })

  // Canvas subtle parallax
  gsap.to('.hero-canvas', {
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 2
    },
    y: '8vh',
    ease: 'none'
  })

  const onResize = () => {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
  }
  window.addEventListener('resize', onResize)

  // Store cleanup ref
  canvas._onResize = onResize
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  if (canvasRef.value?._onResize) window.removeEventListener('resize', canvasRef.value._onResize)
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<template>
  <section class="hero" ref="heroRef">
    <canvas ref="canvasRef" class="hero-canvas"></canvas>
    <div class="hero-content">
      <p class="hero-eyebrow" style="font-weight: 800;">A Documentary Film by SEEDE XR</p>
      <h1 class="title">Heroes of<br/>Indian Ocean</h1>
      <p class="subtitle">Just Because You Don't See It,<br class="mobile-br"> It Doesn't Mean It's Not Happening</p>

      <div class="scroll-wrapper">
        <div class="scroll-indicator">
          <span>Scroll to Explore</span>
          <div class="scroll-line"><div class="scroll-dot"></div></div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 100dvh;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #000;
}

.hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(10, 10, 20, 0.6);
  z-index: 0;
}

.hero-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.hero-eyebrow {
  font-size: clamp(0.65rem, 1.5vw, 0.8rem);
  text-transform: uppercase;
  letter-spacing: 4px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0 0 1.5rem;
  opacity: 0;
}

.title {
  font-size: clamp(3rem, 11vw, 9rem);
  font-weight: 800;
  line-height: 0.88;
  text-transform: uppercase;
  background: linear-gradient(160deg, #ffffff 30%, #87CEEB 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1.75rem;
  letter-spacing: -2px;
  opacity: 0;
}

.subtitle {
  font-size: clamp(0.85rem, 2vw, 1.15rem);
  font-weight: 400;
  color: rgba(255, 255, 255, 0.55);
  max-width: 520px;
  letter-spacing: 0.5px;
  line-height: 1.7;
  margin: 0;
  opacity: 0;
}

.scroll-wrapper {
  margin-top: 3.5rem;
  display: flex;
  justify-content: center;
}

.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  opacity: 0;
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: rgba(255,255,255,0.4);
}

.scroll-line {
  width: 1px;
  height: 44px;
  background: rgba(255,255,255,0.15);
  position: relative;
  overflow: hidden;
  border-radius: 1px;
}

.scroll-dot {
  width: 100%;
  height: 40%;
  background: rgba(255,255,255,0.7);
  position: absolute;
  top: -40%;
  animation: scrollDrop 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes scrollDrop {
  0%   { top: -40%; }
  100% { top: 140%; }
}

.mobile-br { display: none; }
@media (max-width: 480px) {
  .mobile-br { display: block; }
  .title { letter-spacing: -1px; }
}
</style>
