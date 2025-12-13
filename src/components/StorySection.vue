<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ParticleImage from './ParticleImage.vue'
import coralReefImg from '@/assets/images/coral_reef.png'
import diverImg from '@/assets/images/diver.png'

gsap.registerPlugin(ScrollTrigger)

const canvasRef = ref(null)
let animationId = null

onMounted(() => {
  // GSAP Animations
  const textElements = document.querySelectorAll('.animate-text')
  textElements.forEach(el => {
    gsap.fromTo(el, 
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  })

  // Canvas Animation: Ocean Waves
  const canvas = canvasRef.value
  if (!canvas) return
  
  const ctx = canvas.getContext('2d')
  let width = canvas.width = canvas.parentElement.offsetWidth
  let height = canvas.height = canvas.parentElement.offsetHeight

  let increment = 0
  
  function animate() {
    ctx.clearRect(0, 0, width, height)
    
    // Wave settings
    const waveCount = 12
    const waveHeight = 50
    const waveLength = 0.005
    // Start slightly higher to allow waves to cascade down
    const startY = height * 0.2 
    const spacing = height * 0.8 / waveCount

    for (let i = 0; i < waveCount; i++) {
        ctx.beginPath()
        
        // Top edge (Left to Right)
        for (let x = 0; x <= width; x += 10) { // Step optimization
             // sin(kx + wt) moves left (right-to-left phase shift)
            const y = startY + (i * spacing) + Math.sin(x * waveLength + increment + i * 1.5) * waveHeight
            // First point move, others line
            if (x === 0) ctx.moveTo(x, y)
            else ctx.lineTo(x, y)
        }
        
        // Bottom edge (Right to Left)
        for (let x = width; x >= 0; x -= 10) {
             // Oscillate above the bottom edge so it's visible (height - waveHeight)
             // Use a different phase for organic look
             const y = (height - waveHeight) + Math.sin(x * waveLength + increment + i * 1.5 + Math.PI) * waveHeight 
             ctx.lineTo(x, y)
        }
        
        ctx.closePath()
        ctx.fillStyle = `rgba(0, 119, 190, ${0.15 - (i * 0.02)})` // Slightly more visible
        ctx.fill()
    }

    increment += 0.01 // Reduced speed from 0.03
    animationId = requestAnimationFrame(animate)
  }
  animate()

  const resizeObserver = new ResizeObserver(() => {
    width = canvas.width = canvas.parentElement.offsetWidth
    height = canvas.height = canvas.parentElement.offsetHeight
  })
  resizeObserver.observe(canvas.parentElement)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<template>
  <section class="story-container">
    <!-- Intro: Centered -->
    <div class="story-block intro center-block animate-text">
      <h2 class="big-text">The Ocean<br>Is Silent</h2>
      <p class="medium-text">
        But just because you don’t see it,<br>
        <span class="highlight">it doesn’t mean it’s not happening.</span>
      </p>
    </div>

    <!-- Particle Image Sections replacing backgrounds -->
    <div class="full-width-bg particle-section">
      <div class="particle-wrapper">
        <ParticleImage :src="coralReefImg" :gap="12" />
        <div class="particle-overlay-gradient"></div>
      </div>
      <div class="content-overlay animate-text">
        <h3 class="blue-heading">The Problem</h3>
        <p class="body-text">
          Tanzania’s marine ecosystems are under siege. 
          Climate change, rising ocean temperatures, and overfishing are bleaching our coral reefs—the beating heart of the ocean.
        </p>
      </div>
    </div>

    <div class="full-width-bg particle-section">
      <div class="particle-wrapper">
        <ParticleImage :src="diverImg" :gap="12" />
        <div class="particle-overlay-gradient"></div>
      </div>
      <div class="content-overlay center-content animate-text">
        <span class="number">54%</span>
        <span class="label">of global reefs experiencing heat stress (>2023)</span>
      </div>
    </div>

    <!-- Canvas Animated Section -->
    <div class="full-screen-canvas-section relative-canvas">
      <canvas ref="canvasRef" class="bg-canvas"></canvas>
      <div class="relative-content animate-text">
        <h2 class="medium-text blue-heading">A Vital Connection</h2>
        <p class="small-text">
          Coastal communities depend on these reefs. Fishing, seaweed farming, and tourism all rely on a healthy ecosystem.
          When the reefs die, the livelihood of thousands fades with them.
        </p>

        <div class="spacer"></div>

        <h2 class="big-text blue-heading">Immersive<br>Action</h2>
        <p class="medium-text">
          We use <strong>VR 360° film</strong> and <strong>Augmented Reality</strong> to transport you there.
          To feel the urgency. To see the beauty. To act.
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.story-container {
  color: var(--color-text-main);
  width: 100%;
}

.story-block {
  padding: 6rem 1rem;
  max-width: 1200px;
  margin: 0 auto;
}

.center-block {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.intro {
  margin-bottom: 4rem;
  min-height: 60vh; /* Give it space */
  justify-content: center;
}

/* Typography Updates */
.big-text {
  font-size: clamp(5rem, 10vw, 12rem);
  line-height: 0.85;
  font-weight: 800;
  margin-bottom: 2rem;
  letter-spacing: -4px;
  text-transform: uppercase;
  color: #fff;
}

.medium-text {
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: 400;
  line-height: 1.2;
  max-width: 900px;
  color: var(--color-text-muted);
}

.small-text {
  font-size: 1.5rem;
  line-height: 1.6;
  max-width: 800px;
  color: rgba(255,255,255,0.9);
}

.body-text {
  font-size: 1.8rem;
  line-height: 1.4;
  max-width: 800px;
}

.highlight {
  color: var(--color-accent-orange);
  font-weight: 600;
}

/* Headings */
.blue-heading {
  color: var(--color-accent-blue) !important;
}

/* Full Width Backgrounds */
.full-width-bg {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  /* Removed margin-bottom to close gap */
  margin-bottom: 0;
}

/* Full Width Backgrounds */
.full-width-bg {
  width: 100vw;
  margin-left: calc(-50vw + 50%);
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  /* Removed background-image styles as they are now handled by particles */
  margin-bottom: 0;
}

.particle-section {
  position: relative;
  overflow: hidden;
  background-color: #051e3e; /* Fallback/Base */
}

.particle-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.particle-overlay-gradient {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  /* Re-apply the gradient overlay */
  background: linear-gradient(
    135deg,
    rgba(5, 30, 62, 0.85),
    rgba(0, 0, 0, 0.7),
    rgba(255, 191, 0, 0.3)
  );
  pointer-events: none; /* Let clicks pass through to particles */
  z-index: 1;
}

.content-overlay {
  position: relative;
  z-index: 2; /* Still above particles and gradient */
  padding: 4rem;
  max-width: 1000px;
  /* Centering logic */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.center-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content-overlay h3 {
  /* Increased size from 3rem to 5rem */
  font-size: clamp(3rem, 6vw, 5rem);
  color: var(--color-accent-blue);
  margin-bottom: 1.5rem;
  text-transform: uppercase;
  font-weight: 800;
}

.number {
  font-size: 10rem;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(to bottom, #FFD700, #FF7F50);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.label {
  font-size: 1.8rem;
  font-weight: 500;
  letter-spacing: 1px;
}

/* Canvas Area */
.full-screen-canvas-section {
  position: relative;
  overflow: hidden;
  width: 100vw;
  margin-left: calc(-50vw + 50%); /* Force full width breakout */
  min-height: 100vh; /* Full screen height */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 1rem; /* Padding for content only, canvas is absolute */
}

.bg-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.6;
  pointer-events: none;
}

.relative-content {
  position: relative;
  z-index: 1;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1000px;
}

.spacer {
  height: 6rem;
}
</style>
