<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParticleImage from './ParticleImage.vue'
import octopusImg from '@/assets/images/octopus.png'
import sharkImg from '@/assets/images/shark.png'

gsap.registerPlugin(ScrollTrigger)

const canvasRef = ref(null)
const statCountRef = ref(null)
let animationId = null

onMounted(() => {
  // ── Intro text reveal ─────────────────────────────────────────────
  gsap.fromTo('.intro-line-1',
    { opacity: 0, y: 80 },
    {
      opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.intro', start: 'top 80%', toggleActions: 'play none none reverse' }
    }
  )
  gsap.fromTo('.intro-line-2',
    { opacity: 0, y: 60 },
    {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out', delay: 0.15,
      scrollTrigger: { trigger: '.intro', start: 'top 75%', toggleActions: 'play none none reverse' }
    }
  )

  // ── Problem section ────────────────────────────────────────────────
  gsap.fromTo('.problem-heading',
    { opacity: 0, x: -60 },
    {
      opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '.problem-section', start: 'top 75%', toggleActions: 'play none none reverse' }
    }
  )
  gsap.fromTo('.problem-body',
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.2,
      scrollTrigger: { trigger: '.problem-section', start: 'top 75%', toggleActions: 'play none none reverse' }
    }
  )

  // ── Animated stat counter ─────────────────────────────────────────
  const counter = { val: 0 }
  ScrollTrigger.create({
    trigger: '.stat-section',
    start: 'top 70%',
    once: true,
    onEnter() {
      gsap.to(counter, {
        val: 54,
        duration: 2,
        ease: 'power2.out',
        onUpdate() {
          if (statCountRef.value) statCountRef.value.textContent = Math.round(counter.val) + '%'
        }
      })
      gsap.fromTo('.stat-label',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.5 }
      )
    }
  })

  // ── Canvas section ─────────────────────────────────────────────────
  gsap.fromTo('.connection-heading',
    { opacity: 0, y: 40 },
    {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.canvas-section', start: 'top 75%', toggleActions: 'play none none reverse' }
    }
  )
  gsap.fromTo('.connection-text',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.2,
      scrollTrigger: { trigger: '.canvas-section', start: 'top 75%', toggleActions: 'play none none reverse' }
    }
  )
  gsap.fromTo('.immersive-heading',
    { opacity: 0, scale: 0.9 },
    {
      opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.immersive-block', start: 'top 80%', toggleActions: 'play none none reverse' }
    }
  )
  gsap.fromTo('.immersive-text',
    { opacity: 0, y: 25 },
    {
      opacity: 1, y: 0, duration: 0.9, ease: 'power2.out', delay: 0.2,
      scrollTrigger: { trigger: '.immersive-block', start: 'top 80%', toggleActions: 'play none none reverse' }
    }
  )

  // ── Ocean wave canvas ──────────────────────────────────────────────
  const canvas = canvasRef.value
  if (!canvas) return

  const ctx = canvas.getContext('2d')
  let width = canvas.width = canvas.parentElement.offsetWidth
  let height = canvas.height = canvas.parentElement.offsetHeight
  let increment = 0

  function animate() {
    ctx.clearRect(0, 0, width, height)

    const waveCount = 12
    const waveHeight = 50
    const waveLength = 0.005
    const startY = height * 0.2
    const spacing = (height * 0.8) / waveCount

    for (let i = 0; i < waveCount; i++) {
      ctx.beginPath()
      for (let x = 0; x <= width; x += 10) {
        const y = startY + i * spacing + Math.sin(x * waveLength + increment + i * 1.5) * waveHeight
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      for (let x = width; x >= 0; x -= 10) {
        const y = height - waveHeight + Math.sin(x * waveLength + increment + i * 1.5 + Math.PI) * waveHeight
        ctx.lineTo(x, y)
      }
      ctx.closePath()
      ctx.fillStyle = `rgba(0, 119, 190, ${Math.max(0.05, 0.15 - i * 0.02)})`
      ctx.fill()
    }

    increment += 0.01
    animationId = requestAnimationFrame(animate)
  }
  animate()

  const ro = new ResizeObserver(() => {
    width = canvas.width = canvas.parentElement.offsetWidth
    height = canvas.height = canvas.parentElement.offsetHeight
  })
  ro.observe(canvas.parentElement)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<template>
  <section class="story-container">

    <!-- Intro block -->
    <div class="story-block intro center-block">
      <h2 class="big-text intro-line-1">The Ocean<br>Is Silent</h2>
      <p class="medium-text intro-line-2">
        But just because you don't see it,<br>
        <span class="highlight">it doesn't mean it's not happening.</span>
      </p>
    </div>

    <!-- The Problem (particle image) -->
    <div class="full-width-bg particle-section problem-section">
      <div class="particle-wrapper">
        <ParticleImage :src="sharkImg" :gap="12" />
      </div>
      <div class="content-overlay">
        <h3 class="blue-heading problem-heading">The Problem</h3>
        <p class="body-text problem-body">
          Tanzania's marine ecosystems are under siege.
          Climate change, rising ocean temperatures, and overfishing are bleaching our coral reefs—the beating heart of the ocean.
        </p>
      </div>
    </div>

    <!-- Stat section -->
    <div class="full-width-bg particle-section stat-section">
      <div class="particle-wrapper">
        <ParticleImage :src="octopusImg" :gap="12" />
      </div>
      <div class="content-overlay center-content">
        <span class="number" ref="statCountRef">0%</span>
        <span class="label stat-label">of global reefs experiencing heat stress (>2023)</span>
      </div>
    </div>

    <!-- Canvas animated section -->
    <div class="full-screen-canvas-section canvas-section">
      <canvas ref="canvasRef" class="bg-canvas"></canvas>
      <div class="relative-content">
        <h2 class="medium-text blue-heading connection-heading">A Vital Connection</h2>
        <p class="small-text connection-text">
          Coastal communities depend on these reefs. Fishing, seaweed farming, and tourism all rely on a healthy ecosystem.
          When the reefs die, the livelihood of thousands fades with them.
        </p>

        <div class="section-divider"></div>

        <div class="immersive-block">
          <h2 class="big-text blue-heading immersive-heading">Immersive<br>Action</h2>
          <p class="medium-text immersive-text">
            We use <strong>VR 360° film</strong> and <strong>Augmented Reality</strong> to transport you there.
            To feel the urgency. To see the beauty. To act.
          </p>
        </div>
      </div>
    </div>

  </section>
</template>

<style scoped>
.story-container {
  color: var(--color-text-main);
  width: 100%;
  background: transparent;
}

.story-block {
  padding: 7rem 1.5rem;
  max-width: 1100px;
  margin: 0 auto;
}
.center-block {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.intro {
  min-height: 60vh;
  justify-content: center;
}

/* Typography */
.big-text {
  font-size: clamp(4rem, 10vw, 11rem);
  line-height: 0.88;
  font-weight: 800;
  margin-bottom: 2rem;
  letter-spacing: -3px;
  text-transform: uppercase;
  color: #fff;
  text-shadow: 0 2px 24px rgba(0,0,0,0.6);
  opacity: 0; /* GSAP controls */
}
.medium-text {
  font-size: clamp(1.5rem, 3.5vw, 3rem);
  font-weight: 500;
  line-height: 1.3;
  max-width: 860px;
  color: #fff;
  text-shadow: 0 1px 16px rgba(0,0,0,0.5);
  opacity: 0; /* GSAP controls */
}
.small-text {
  font-size: clamp(1rem, 1.8vw, 1.4rem);
  line-height: 1.7;
  max-width: 760px;
  color: #fff;
  text-shadow: 0 1px 12px rgba(0,0,0,0.5);
}
.body-text {
  font-size: clamp(1.1rem, 2.2vw, 1.7rem);
  line-height: 1.5;
  max-width: 800px;
  color: #fff;
  text-shadow: 0 1px 12px rgba(0,0,0,0.5);
}
.highlight { color: var(--color-accent-orange); font-weight: 700; }
/* Gold replaces blue — stays readable over both the canvas waves and particle images */
.blue-heading { color: #ffbf00 !important; text-shadow: 0 2px 20px rgba(0,0,0,0.6); }

/* Full-width sections */
.full-width-bg {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  height: 85vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.particle-section {
  background: transparent;
}
.particle-wrapper {
  position: absolute;
  inset: 0;
  z-index: 0;
  overflow: hidden;
}
.content-overlay {
  position: relative;
  z-index: 2;
  padding: 4rem 1.5rem;
  max-width: 900px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.center-content { text-align: center; align-items: center; }

.content-overlay h3 {
  font-size: clamp(2.5rem, 6vw, 5rem);
  color: #ffbf00;
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  font-weight: 800;
  text-shadow: 0 2px 20px rgba(0,0,0,0.6);
  opacity: 0;
}

/* Stat counter */
.number {
  font-size: clamp(6rem, 15vw, 11rem);
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(to bottom, #FFD700, #FF7F50);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  display: block;
}
.stat-label {
  font-size: clamp(0.9rem, 2vw, 1.5rem);
  font-weight: 600;
  letter-spacing: 1px;
  color: #fff;
  text-shadow: 0 1px 12px rgba(0,0,0,0.5);
  max-width: 460px;
  opacity: 0;
}

/* Canvas section */
.full-screen-canvas-section {
  position: relative;
  overflow: hidden;
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5rem 1.5rem;
}
.bg-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.55;
  pointer-events: none;
}
.relative-content {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 960px;
  gap: 0;
}

.section-divider { height: 5rem; }
.immersive-block { display: flex; flex-direction: column; align-items: center; }
.immersive-heading { opacity: 0; }
.immersive-text { opacity: 0; }

.connection-heading { opacity: 0; }
.connection-text { opacity: 0; }
.problem-heading { opacity: 0; }
.problem-body { opacity: 0; }
.intro-line-1 { opacity: 0; }
.intro-line-2 { opacity: 0; }

@media (max-width: 640px) {
  .story-block { padding: 4.5rem 1.25rem; }
  .section-divider { height: 3rem; }
  .big-text { letter-spacing: -1px; }
  .full-screen-canvas-section { padding: 3.5rem 1.25rem; }
}
</style>
