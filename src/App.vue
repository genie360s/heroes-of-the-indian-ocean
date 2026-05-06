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
const blocked = ref(false) // autoplay was blocked — show hint
let audio = null

// Valid user-activation events (scroll does NOT count in any browser)
const ACTIVATION_EVENTS = ['pointerdown', 'keydown']

function startAudio() {
  if (started.value) return
  audio.play().then(() => {
    started.value = true
    blocked.value = false
  }).catch(() => {})
}

function toggleMute() {
  muted.value = !muted.value
  audio.muted = muted.value
  // If muted was blocking start (some browsers allow muted autoplay), unmuting triggers play
  if (!muted.value && !started.value) startAudio()
}

function onFirstInteraction() {
  startAudio()
  ACTIVATION_EVENTS.forEach(e => window.removeEventListener(e, onFirstInteraction))
}

onMounted(() => {
  audio = new Audio(ambientSound)
  audio.loop = true
  audio.volume = 0.35
  audio.preload = 'auto'

  audio.play().then(() => {
    started.value = true
  }).catch(() => {
    // Blocked — wait for a real user-activation gesture
    blocked.value = true
    ACTIVATION_EVENTS.forEach(e => window.addEventListener(e, onFirstInteraction, { once: true }))
  })
})

onUnmounted(() => {
  audio?.pause()
  ACTIVATION_EVENTS.forEach(e => window.removeEventListener(e, onFirstInteraction))
})
</script>

<template>
  <header class="site-header">
    <a href="/" class="logo-link" aria-label="SEEDE XR — Home">
      <img :src="seedeLogo" alt="SEEDE XR" class="site-logo" />
    </a>

    <Transition name="hint-fade">
      <span v-if="blocked && !started" class="sound-hint" aria-live="polite">tap anywhere for audio</span>
    </Transition>

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

/* Autoplay blocked hint */
.sound-hint {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  color: rgba(255, 255, 255, 0.45);
  white-space: nowrap;
}

.hint-fade-enter-active,
.hint-fade-leave-active { transition: opacity 0.5s ease; }
.hint-fade-enter-from,
.hint-fade-leave-to { opacity: 0; }

@media (max-width: 480px) {
  .site-header { padding: 1rem 1.25rem; }
  .site-logo { height: 28px; }
  .sound-btn { width: 32px; height: 32px; }
  .sound-btn svg { width: 15px; height: 15px; }
  .sound-hint { display: none; }
}
</style>
