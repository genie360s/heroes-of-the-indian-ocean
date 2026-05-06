<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const canvasRef = ref(null)
const partnerImages = import.meta.glob('@/assets/images/partners/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' })
const partners = Object.values(partnerImages)

let animationId = null
const mouse = { x: null, y: null }

onMounted(() => {
  // Scroll reveal: title
  gsap.fromTo('.partners-title',
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.partners-section', start: 'top 80%', toggleActions: 'play none none reverse' }
    }
  )

  // Staggered reveal for partner logos
  gsap.fromTo('.partner-item',
    { opacity: 0, y: 50, scale: 0.9 },
    {
      opacity: 1, y: 0, scale: 1,
      duration: 0.7,
      ease: 'power3.out',
      stagger: { amount: 0.6, from: 'start' },
      scrollTrigger: { trigger: '.partners-grid', start: 'top 85%', toggleActions: 'play none none reverse' }
    }
  )

  // Canvas bubbles
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let width = canvas.width = canvas.parentElement.offsetWidth
  let height = canvas.height = canvas.parentElement.offsetHeight

  const handleMouseMove = (e) => {
    const rect = canvas.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
  }
  const handleMouseLeave = () => { mouse.x = null; mouse.y = null }
  canvas.addEventListener('mousemove', handleMouseMove)
  canvas.addEventListener('mouseleave', handleMouseLeave)

  const bubbles = []
  const bubbleCount = 50

  class Bubble {
    constructor() { this.reset(true) }
    reset(init = false) {
      this.x = Math.random() * width
      this.y = init ? Math.random() * height : height + Math.random() * 50
      this.speed = Math.random() * 0.7 + 0.25
      this.size = Math.random() * 3.5 + 1
      this.alpha = Math.random() * 0.45 + 0.2
    }
    update() {
      this.y -= this.speed
      if (mouse.x != null) {
        const dx = this.x - mouse.x
        const dy = this.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 100) {
          const force = (100 - dist) / 100
          this.x += (dx / dist) * force * 3
          this.y += (dy / dist) * force * 3
        }
      }
      if (this.y < -10) this.reset()
    }
    draw() {
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(135, 206, 250, ${this.alpha})`
      ctx.shadowBlur = 8
      ctx.shadowColor = 'rgba(135, 206, 250, 0.4)'
      ctx.fill()
      ctx.shadowBlur = 0
    }
  }

  for (let i = 0; i < bubbleCount; i++) bubbles.push(new Bubble())

  function animate() {
    ctx.clearRect(0, 0, width, height)
    bubbles.forEach(b => { b.update(); b.draw() })
    animationId = requestAnimationFrame(animate)
  }
  animate()

  const ro = new ResizeObserver(() => {
    width = canvas.width = canvas.parentElement.offsetWidth
    height = canvas.height = canvas.parentElement.offsetHeight
  })
  ro.observe(canvas.parentElement)
  canvas._cleanup = () => {
    canvas.removeEventListener('mousemove', handleMouseMove)
    canvas.removeEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  canvasRef.value?._cleanup?.()
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<template>
  <section class="partners-section">
    <canvas ref="canvasRef" class="bg-canvas"></canvas>
    <div class="content-wrapper">
      <h2 class="section-title partners-title">Our Partners</h2>
      <div v-if="partners.length" class="partners-grid">
        <div v-for="(img, index) in partners" :key="index" class="partner-item">
          <img :src="img" :alt="`Partner ${index + 1}`" class="partner-logo" />
        </div>
      </div>
      <p v-else class="no-partners">Building partnerships for ocean conservation.</p>
    </div>
  </section>
</template>

<style scoped>
.partners-section {
  position: relative;
  padding: 7rem 2rem;
  background: linear-gradient(to bottom, #0d0d0d, #051e3e 60%, #0d0d0d);
  text-align: center;
  overflow: hidden;
}

.bg-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.25;
  pointer-events: auto;
}

.content-wrapper {
  position: relative;
  z-index: 1;
}

.section-title {
  font-size: clamp(1.25rem, 3vw, 2rem);
  margin-bottom: 4rem;
  color: rgba(255,255,255,0.3);
  text-transform: uppercase;
  letter-spacing: 5px;
  font-weight: 400;
  opacity: 0;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 3rem 4rem;
  max-width: 1100px;
  margin: 0 auto;
  align-items: center;
  justify-items: center;
}

.partner-item {
  opacity: 0; /* GSAP controls */
}

.partner-logo {
  width: 100%;
  max-width: 220px;
  height: auto;
  filter: grayscale(100%) brightness(0.6);
  opacity: 0.5;
  transition: filter 0.4s ease, opacity 0.4s ease, transform 0.4s ease;
  cursor: pointer;
  border-radius: 4px;
}
.partner-logo:hover {
  filter: grayscale(0%) brightness(1);
  opacity: 1;
  transform: scale(1.06);
}

.no-partners {
  color: rgba(255,255,255,0.3);
  font-size: 1.1rem;
  letter-spacing: 1px;
  margin-top: 2rem;
}

@media (max-width: 480px) {
  .partners-section { padding: 5rem 1.5rem; }
  .partners-grid { gap: 2rem; grid-template-columns: repeat(2, 1fr); }
}
</style>
