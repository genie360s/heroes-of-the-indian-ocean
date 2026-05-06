<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ContactModal from './ContactModal.vue'

gsap.registerPlugin(ScrollTrigger)

const activeModal = ref(null) // null | 'documentary' | 'series'

onMounted(() => {
  // Reveal the CTA title word by word
  const words = document.querySelectorAll('.cta-word')
  if (words.length) {
    gsap.fromTo(words,
      { opacity: 0, y: 60, rotateX: -30 },
      {
        opacity: 1, y: 0, rotateX: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.action-container',
          start: 'top 75%',
          toggleActions: 'play none none reverse'
        }
      }
    )
  }

  // Slide up the buttons
  gsap.fromTo('.action-btn',
    { opacity: 0, y: 50 },
    {
      opacity: 1, y: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.15,
      scrollTrigger: {
        trigger: '.buttons',
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  )

  // Footer fade
  gsap.fromTo('.footer',
    { opacity: 0 },
    {
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: '.footer',
        start: 'top 95%',
        toggleActions: 'play none none none'
      }
    }
  )
})

onUnmounted(() => {
  ScrollTrigger.getAll().forEach(t => t.kill())
})
</script>

<template>
  <section class="action-container">
    <!-- Ambient glow orbs -->
    <div class="orb orb-blue" aria-hidden="true"></div>
    <div class="orb orb-gold" aria-hidden="true"></div>

    <div class="cta-wrapper">
      <h2 class="cta-title">
        <span class="cta-word">Be</span>
        <span class="cta-word">Part</span>
        <span class="cta-word">of</span>
        <span class="cta-word">the</span>
        <span class="cta-word highlight-word">Solution</span>
      </h2>

      <div class="buttons">
        <button class="btn primary action-btn" @click="activeModal = 'documentary'">
          <span class="btn-text">Request Documentary</span>
          <span class="btn-icon">↓</span>
        </button>
        <button class="btn secondary action-btn" @click="activeModal = 'series'">
          <span class="btn-text">Contribute to Next Series</span>
          <span class="btn-icon">→</span>
        </button>
      </div>

      <footer class="footer">
        <p>&copy; 2025 Heroes of Indian Ocean. All Rights Reserved.</p>
        <p class="credits">Producer: Alex G. Mkwizu &nbsp;·&nbsp; SEEDE XR</p>
      </footer>
    </div>

    <!-- Modals -->
    <ContactModal
      type="documentary"
      :show="activeModal === 'documentary'"
      @close="activeModal = null"
    />
    <ContactModal
      type="series"
      :show="activeModal === 'series'"
      @close="activeModal = null"
    />
  </section>
</template>

<style scoped>
.action-container {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, var(--color-bg), #051e3e);
  padding: 5rem 1.5rem 2rem;
  text-align: center;
  position: relative;
  overflow: hidden;
}

/* Ambient glow orbs */
.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  pointer-events: none;
  opacity: 0.15;
}
.orb-blue {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, #0077be, transparent 70%);
  top: -100px;
  left: -150px;
}
.orb-gold {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, #ffbf00, transparent 70%);
  bottom: 100px;
  right: -100px;
}

.cta-wrapper {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 900px;
}

/* Title with perspective on each word */
.cta-title {
  font-size: clamp(2.8rem, 6.5vw, 6.5rem);
  text-transform: uppercase;
  margin-bottom: 4rem;
  line-height: 0.95;
  perspective: 800px;
}
.cta-word {
  display: inline-block;
  margin-right: 0.25em;
  opacity: 0; /* GSAP controls */
}
.highlight-word {
  background: linear-gradient(120deg, #0077be, #00c6ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Buttons */
.buttons {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  align-items: center;
  margin-bottom: 6rem;
}
@media (min-width: 640px) {
  .buttons {
    flex-direction: row;
    justify-content: center;
  }
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 340px;
  padding: 1.25rem 1.75rem;
  border: 1px solid rgba(255,255,255,0.2);
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.35s ease;
  position: relative;
  overflow: hidden;
  cursor: pointer;
  background: transparent;
  color: inherit;
  border-radius: 4px;
  opacity: 0; /* GSAP controls */
}

.btn::before {
  content: '';
  position: absolute;
  inset: 0;
  background: white;
  transform: scaleX(0);
  transform-origin: right;
  transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  z-index: 0;
}
.btn:hover::before {
  transform: scaleX(1);
  transform-origin: left;
}
.btn:hover { color: #0d0d0d; border-color: white; }
.btn-text, .btn-icon { position: relative; z-index: 1; }

.primary {
  background: var(--color-accent-blue);
  border-color: var(--color-accent-blue);
}
.primary:hover { color: #0d0d0d; }

/* Footer */
.footer {
  color: var(--color-text-muted);
  font-size: 0.85rem;
  opacity: 0; /* GSAP controls */
}
.credits {
  margin-top: 0.4rem;
  opacity: 0.5;
  font-size: 0.78rem;
  letter-spacing: 1px;
}

@media (max-width: 480px) {
  .btn { max-width: 100%; }
  .cta-title { margin-bottom: 2.5rem; }
}
</style>
