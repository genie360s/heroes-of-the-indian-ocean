<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  gap: {
    type: Number,
    default: 12
  }
})

const canvasRef = ref(null)
let ctx = null
let width = 0
let height = 0
let particles = []
let animationId = null
const mouse = { x: null, y: null, radius: 150 } // Interaction radius for repulsion

const image = new Image()
image.crossOrigin = "Anonymous"

// Bubble Class
class Bubble {
  constructor() {
    this.reset(true)
  }
  
  reset(init = false) {
    this.x = Math.random() * width
    this.y = init ? Math.random() * height : height + Math.random() * 50
    this.size = Math.random() * 4 + 2
    this.speed = Math.random() * 1 + 0.5
    this.opacity = Math.random() * 0.3 + 0.1
    this.wobble = Math.random() * Math.PI * 2
    this.wobbleSpeed = Math.random() * 0.05 + 0.01
  }

  update() {
    this.y -= this.speed
    this.wobble += this.wobbleSpeed
    this.x += Math.sin(this.wobble) * 0.5
    
    // Interaction check (similar to particles or simpler?)
    // Let's make them avoid mouse too
    if (mouse.x != null) {
        const dx = mouse.x - this.x
        const dy = mouse.y - this.y
        const dist = Math.sqrt(dx*dx + dy*dy)
        if (dist < 100) {
            const force = (100 - dist) / 100
            this.x -= (dx/dist) * force * 5
            this.y -= (dy/dist) * force * 5
        }
    }

    if (this.y < -20) this.reset()
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`
    ctx.fill()
  }
}

let bubbles = []

// Particle Class
class Particle {
  constructor(x, y, color) {
    this.x = x // Current Position
    this.y = y
    this.originX = x // Target/Home Position
    this.originY = y
    this.color = color
    this.size = Math.floor(props.gap * 0.8) // Circle diameter relative to gap (e.g. 12px gap -> ~9-10px dot)
    this.vx = 0
    this.vy = 0
    this.friction = 0.9
    this.ease = 0.1
    // Stream properties
    this.angle = Math.random() * Math.PI * 2
    this.angleSpeed = Math.random() * 0.02 + 0.005
    this.streamRadius = Math.random() * 2 // Small drift radius
  }

  draw() {
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2)
    ctx.fillStyle = this.color
    ctx.fill()
  }

  update() {
    // 1. Stream Flow Effect (Subtle distinct movement)
    // We oscillate slightly around the *current target* position to simulate flow
    this.angle += this.angleSpeed
    const flowX = Math.cos(this.angle) * this.streamRadius
    const flowY = Math.sin(this.angle) * this.streamRadius

    // 2. Mouse Interaction Physics
    // Calculate distance to mouse
    // Mouse coords are now relative to viewport or canvas (handled globally or locally)
    
    // Repulsion (Push) - ONLY if mouse is active
    if (mouse.x !== null && mouse.y !== null) {
        let dx = mouse.x - this.x
        let dy = mouse.y - this.y
        let distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = mouse.radius
        
        if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance
            let forceDirectionX = dx / distance
            let forceDirectionY = dy / distance
            
            // Pushing away harder when close
            const repelStrength = 30 // Strong push
            this.vx -= forceDirectionX * force * repelStrength
            this.vy -= forceDirectionY * force * repelStrength
        }
    }

    // 3. Return to Origin (Pull/Elasticity) - ALWAYS RUNS
    // We want to return to originX + flowX, originY + flowY
    const targetX = this.originX + flowX
    const targetY = this.originY + flowY
    
    const dxOrigin = targetX - this.x
    const dyOrigin = targetY - this.y
    
    // Apply spring force towards origin
    this.vx += dxOrigin * this.ease
    this.vy += dyOrigin * this.ease

    // Apply friction to dampen movement
    this.vx *= this.friction
    this.vy *= this.friction

    // Update position
    this.x += this.vx
    this.y += this.vy
  }
}

function initParticles() {
  particles = []
  bubbles = []
  
  // Create a temporary canvas to draw the image effectively scaled to cover the container
  // We want the image to behave like 'background-size: cover'
  
  // Calculate scaling to cover
  const imgRatio = image.width / image.height
  const canvasRatio = width / height
  let drawWidth, drawHeight, offsetX, offsetY
  
  if (canvasRatio > imgRatio) {
    drawWidth = width
    drawHeight = width / imgRatio
    offsetX = 0
    offsetY = (height - drawHeight) / 2
  } else {
    drawHeight = height
    drawWidth = height * imgRatio
    offsetX = (width - drawWidth) / 2
    offsetY = 0
  }

  // Draw image to offscreen canvas or just use logic?
  // We need to read pixels. It's best to draw to the main canvas once, read data, then clear.
  ctx.drawImage(image, offsetX, offsetY, drawWidth, drawHeight)
  
  // Get Image Data
  const pixels = ctx.getImageData(0, 0, width, height).data
  ctx.clearRect(0, 0, width, height) // Clear to prepare for particles

  // Scan grid
  for (let y = 0; y < height; y += props.gap) {
    for (let x = 0; x < width; x += props.gap) {
      const index = (y * width + x) * 4
      const red = pixels[index]
      const green = pixels[index + 1]
      const blue = pixels[index + 2]
      const alpha = pixels[index + 3]
      
      // Only create particles for visible pixels
      if (alpha > 0) {
        const color = `rgb(${red},${green},${blue})`
        particles.push(new Particle(x, y, color))
      }
    }
  }

  // Init Bubbles
  const bubbleCount = 20
  for(let i=0; i<bubbleCount; i++) bubbles.push(new Bubble())
}

function animate() {
  ctx.clearRect(0, 0, width, height)
  // Re-draw background if needed? User wants "dots moving", usually on black/dark background.
  // The StorySection has its own background styling, but since this canvas replaces the image,
  // we just draw particles. The parent container likely has a dark background color.
  
  particles.forEach(p => {
    p.update()
    p.draw()
  })

  // Draw bubbles on top or behind? Behind might look better depth-wise, but let's do top for visibility.
  bubbles.forEach(b => {
    b.update()
    b.draw()
  })
  
  animationId = requestAnimationFrame(animate)
}

function handleResize() {
  if (!canvasRef.value) return
  const canvas = canvasRef.value
  width = canvas.width = canvas.parentElement.offsetWidth
  height = canvas.height = canvas.parentElement.offsetHeight
  if (image.complete) {
    initParticles()
  }
}

// Global mouse tracker to handle "through text" interaction
function handleGlobalMouseMove(e) {
  if (!canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  
  // Check if mouse is within canvas bounds
  if (
    e.clientX >= rect.left && 
    e.clientX <= rect.right && 
    e.clientY >= rect.top && 
    e.clientY <= rect.bottom
  ) {
    mouse.x = e.clientX - rect.left
    mouse.y = e.clientY - rect.top
  } else {
    mouse.x = null
    mouse.y = null
  }
}

onMounted(() => {
  const canvas = canvasRef.value
  ctx = canvas.getContext('2d', { willReadFrequently: true })
  
  // Set initial size
  width = canvas.width = canvas.parentElement.offsetWidth
  height = canvas.height = canvas.parentElement.offsetHeight

  // Load Image
  image.src = props.src
  image.onload = () => {
    initParticles()
    animate()
  }

  window.addEventListener('resize', handleResize)
  // Listen to window mouse move to capture events through overlays
  window.addEventListener('mousemove', handleGlobalMouseMove)
})

onUnmounted(() => {
  cancelAnimationFrame(animationId)
  window.removeEventListener('resize', handleResize)
  window.removeEventListener('mousemove', handleGlobalMouseMove)
})

// Re-init if prop changes (unlikely but good practice)
watch(() => props.src, (newVal) => {
  image.src = newVal
})
</script>

<template>
  <div class="particle-container">
    <canvas ref="canvasRef" class="particle-canvas"></canvas>
  </div>
</template>

<style scoped>
.particle-container {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  background-color: #051e3e; /* Deep blue base color behind dots to avoid gaps looking like holes? Or keep transparent? */
  /* Actually user wants parallax effect images converted to dots. 
     If it's transparent, we see whatever is behind. 
     Let's keep it transparent or user-defined. The parent section usually has a background color.
     We'll set a default dark bg to match the theme if transparency is an issue.
  */
  background-color: transparent; 
}

.particle-canvas {
  width: 100%;
  height: 100%;
  display: block;
  /* Ensure interaction */
  pointer-events: auto;
}
</style>
