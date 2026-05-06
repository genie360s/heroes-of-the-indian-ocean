<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import HeroSection from './components/HeroSection.vue'
import StorySection from './components/StorySection.vue'
import PartnersSection from './components/PartnersSection.vue'
import ActionSection from './components/ActionSection.vue'
import seedeLogo from '@/assets/images/logos/seede.png'
import ambientSound from '@/assets/sound/ambient_fit_intro.mp3'

const muted = ref(false)
const started = ref(false)
let audio = null

function startAudio() {
  if (started.value) return
  audio.play().then(() => {
    started.value = true
  }).catch(() => {})
}

function toggleMute() {
  muted.value = !muted.value
  audio.muted = muted.value
}

function onFirstInteraction() {
  startAudio()
  window.removeEventListener('click', onFirstInteraction)
  window.removeEventListener('scroll', onFirstInteraction)
  window.removeEventListener('keydown', onFirstInteraction)
}

onMounted(() => {
  audio = new Audio(ambientSound)
  audio.loop = true
  audio.volume = 0.35

  // Try immediate autoplay
  audio.play().then(() => {
    started.value = true
  }).catch(() => {
    // Blocked by browser policy — start on first interaction
    window.addEventListener('click', onFirstInteraction, { once: true })
    window.addEventListener('scroll', onFirstInteraction, { once: true })
    window.addEventListener('keydown', onFirstInteraction, { once: true })
  })
})

onUnmounted(() => {
  audio?.pause()
  window.removeEventListener('click', onFirstInteraction)
  window.removeEventListener('scroll', onFirstInteraction)
  window.removeEventListener('keydown', onFirstInteraction)
})
</script>

<template>
  <header class="site-header">
    <a href="/" class="logo-link" aria-label="SEEDE XR — Home">
      <img :src="seedeLogo" alt="SEEDE XR" class="site-logo" />
    </a>

    <button class="sound-btn" @click="toggleMute" :aria-label="muted ? 'Unmute' : 'Mute'">
      <!-- Sound on -->
      <svg v-if="!muted" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
      <!-- Muted -->
      <svg v-else viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11 5L6 9H2v6h4l5 4V5z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>
        <path d="M23 9l-6 6M17 9l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>
  </header>
  <main>
    <HeroSection />
    <StorySection />
    <PartnersSection />
    <ActionSection />
  </main>
</template>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 500;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-link {
  display: block;
}

.site-logo {
  height: 36px;
  width: auto;
  display: block;
  filter: brightness(0) invert(1);
  opacity: 0.9;
  transition: opacity 0.2s;
}
.site-logo:hover { opacity: 1; }

/* Sound toggle */
.sound-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  flex-shrink: 0;
}
.sound-btn svg {
  width: 18px;
  height: 18px;
}
.sound-btn:hover {
  background: rgba(255, 255, 255, 0.16);
  color: #fff;
}

@media (max-width: 480px) {
  .site-header { padding: 1rem 1.25rem; }
  .site-logo { height: 28px; }
  .sound-btn { width: 32px; height: 32px; }
  .sound-btn svg { width: 15px; height: 15px; }
}
</style>
