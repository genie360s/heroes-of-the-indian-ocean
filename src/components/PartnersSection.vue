<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const canvasRef = ref(null)
// Load partner images dynamically
const partnerImages = import.meta.glob('@/assets/images/partners/*.{png,jpg,jpeg,svg}', { eager: true, import: 'default' })
const partners = Object.values(partnerImages)

let animationId = null
const mouse = { x: null, y: null }

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let width = canvas.width = canvas.parentElement.offsetWidth
  let height = canvas.height = canvas.parentElement.offsetHeight

  // Track mouse
  const handleMouseMove = (e) => {
    const rect = canvas.getBoundingClientRect()
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
  }
  
  const handleMouseLeave = () => {
    mouse.x = null
    mouse.y = null
  }

  canvas.addEventListener('mousemove', handleMouseMove)
  canvas.addEventListener('mouseleave', handleMouseLeave)

  const bubbles = []
  const bubbleCount = 60 // Increased count

  class Bubble {
    constructor() {
      this.reset(true)
    }
    reset(init = false) {
      this.x = Math.random() * width
      this.y = init ? Math.random() * height : height + Math.random() * 50
      this.speed = Math.random() * 0.8 + 0.3
      this.size = Math.random() * 4 + 1
      this.alpha = Math.random() * 0.5 + 0.3 // More vivid
    }
    update() {
      this.y -= this.speed
      
      // Mouse interaction (Repulsion)
      if (mouse.x != null && mouse.y != null) {
        const dx = this.x - mouse.x
        const dy = this.y - mouse.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDist = 100
        
        if (distance < maxDist) {
            const forceDirectionX = dx / distance
            const forceDirectionY = dy / distance
            const force = (maxDist - distance) / maxDist
            const directionX = forceDirectionX * force * 3
            const directionY = forceDirectionY * force * 3
            
            this.x += directionX
            this.y += directionY
        }
      }

      if (this.y < -10) this.reset()
    }
    draw() {
      // Vivid bubbles
      ctx.fillStyle = `rgba(135, 206, 250, ${this.alpha})` // LightSkyBlue with alpha
      ctx.shadowBlur = 10
      ctx.shadowColor = "white"
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
      ctx.fill()
      ctx.shadowBlur = 0 // Reset
    }
  }

  for (let i = 0; i < bubbleCount; i++) bubbles.push(new Bubble())

  function animate() {
    ctx.clearRect(0, 0, width, height)
    bubbles.forEach(b => { b.update(); b.draw() })
    animationId = requestAnimationFrame(animate)
  }
  animate()
  
  const resizeObserver = new ResizeObserver(() => {
    width = canvas.width = canvas.parentElement.offsetWidth
    height = canvas.height = canvas.parentElement.offsetHeight
  })
  resizeObserver.observe(canvas.parentElement)

  // Cleanup event listeners ref
  canvas._cleanup = () => {
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
  }
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  if (canvasRef.value && canvasRef.value._cleanup) {
      canvasRef.value._cleanup()
  }
})
</script>

<template>
  <section class="partners-section">
    <canvas ref="canvasRef" class="bg-canvas"></canvas>
    <div class="content-wrapper">
      <h2 class="section-title">Our Partners</h2>
      <div class="partners-grid">
        <div v-for="(img, index) in partners" :key="index" class="partner-item">
          <img 
            :src="img" 
            :alt="`Partner ${index + 1}`" 
            class="partner-logo"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.partners-section {
  position: relative;
  padding: 6rem 2rem;
  background-color: #0d0d0d;
  text-align: center;
  overflow: hidden;
}

.bg-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  opacity: 0.3;
  pointer-events: auto; /* Enable mouse interaction */
}

.content-wrapper {
  position: relative;
  z-index: 1;
}

.section-title {
  font-size: 2.5rem;
  margin-bottom: 4rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 2px;
}

.partners-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
  align-items: center;
  justify-items: center;
}

.partner-logo {
  width: 100%;
  max-width: 250px;
  height: auto;
  filter: grayscale(100%);
  opacity: 0.5;
  transition: all 0.4s ease;
  cursor: pointer;
  border-radius: 4px;
}

.partner-logo:hover {
  filter: grayscale(0%);
  opacity: 1;
  transform: scale(1.05);
}
</style>
