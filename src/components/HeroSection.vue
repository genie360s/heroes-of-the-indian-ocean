<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
let animationId = null

onMounted(() => {
  const canvas = canvasRef.value
  const ctx = canvas.getContext('2d')
  let width = canvas.width = window.innerWidth
  let height = canvas.height = window.innerHeight

  // Ocean and Sunset Colors
  const colors = {
    deepBlue: '#051e3e',
    oceanBlue: '#006994',
    sunsetOrange: '#FF7F50',
    sunsetYellow: '#FFD700',
    darkBg: '#121212'
  }

  // Particles/Waves
  let particles = []
  const particleCount = 100

  class Particle {
    constructor() {
      this.reset()
    }

    reset() {
      this.x = Math.random() * width
      this.y = Math.random() * height
      this.vx = (Math.random() - 0.5) * 0.5
      this.vy = (Math.random() - 0.5) * 0.5
      this.size = Math.random() * 3
      this.color = Math.random() > 0.5 
        ? colors.oceanBlue 
        : (Math.random() > 0.5 ? colors.sunsetOrange : colors.sunsetYellow)
      this.alpha = Math.random() * 0.5 + 0.1
    }

    update() {
      this.x += this.vx
      this.y += this.vy

      if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
        this.reset()
      }
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

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle())
  }

  // Gradient Background
  function drawBackground() {
    const gradient = ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, '#000000') // Top (Night/Space)
    gradient.addColorStop(0.5, '#051e3e') // Middle (Deep Ocean)
    gradient.addColorStop(1, '#001f3f') // Bottom (Abyss)
    
    // Add a sunset glow at the very top or bottom? User said "orangish yellow from the sea sunset view".
    // Let's put a subtle glow near the horizon (middle-ish if we imagine looking out).
    
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)
  }

  function animate() {
    ctx.clearRect(0, 0, width, height)
    
    // Create a dark ambient background
    drawBackground()
    
    // Draw particles
    particles.forEach(p => {
      p.update()
      p.draw()
    })

    // Draw some connecting lines for "constellation" or "interconnected ecosystem" feel
    ctx.strokeStyle = colors.oceanBlue
    ctx.lineWidth = 0.2
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x
            const dy = particles[i].y - particles[j].y
            const distance = Math.sqrt(dx * dx + dy * dy)
            if (distance < 100) {
                ctx.beginPath()
                ctx.moveTo(particles[i].x, particles[i].y)
                ctx.lineTo(particles[j].x, particles[j].y)
                ctx.stroke()
            }
        }
    }

    animationId = requestAnimationFrame(animate)
  }

  animate()

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth
    height = canvas.height = window.innerHeight
  })
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
})
</script>

<template>
  <section class="hero">
    <canvas ref="canvasRef" class="hero-canvas"></canvas>
    <div class="hero-content">
      <h1 class="title">Heroes of<br/>Indian Ocean</h1>
      <p class="subtitle">Just Because You Don’t See It, It Doesn’t Mean It’s Not Happening</p>
      
      <div class="scroll-wrapper">
        <div class="scroll-indicator">
          <span>Scroll to Explore</span>
          <div class="arrow">↓</div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url('@/assets/images/sunset.png') no-repeat center center/cover;
}

.hero::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(18, 18, 18, 0.6); /* Dark overlay to make canvas pop */
  z-index: 0;
}

.hero-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  padding: 0 1rem;
  mix-blend-mode: normal; 
  /* Push content slightly lower */
  transform: translateY(10vh);
}

.title {
  font-size: clamp(3rem, 10vw, 8rem);
  font-weight: 800; /* Extra bold */
  line-height: 0.9;
  text-transform: uppercase;
  background: linear-gradient(to right, #ffffff, #87CEEB);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 2rem;
  letter-spacing: -2px;
}

.subtitle {
  font-size: clamp(1rem, 2vw, 1.5rem);
  font-weight: 400;
  color: var(--color-text-muted);
  max-width: 600px;
  margin: 0 auto;
  letter-spacing: 1px;
}

.scroll-wrapper {
  margin-top: 4rem; /* Space from subtitle */
  display: flex;
  justify-content: center;
}

.scroll-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.7;
  animation: bounce 2s infinite;
}

.arrow {
  font-size: 1.5rem;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
  40% {transform: translateY(-10px);}
  60% {transform: translateY(-5px);}
}
</style>
