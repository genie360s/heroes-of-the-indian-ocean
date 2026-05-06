<script setup>
import HeroSection from './components/HeroSection.vue'
import StorySection from './components/StorySection.vue'
import PartnersSection from './components/PartnersSection.vue'
import ActionSection from './components/ActionSection.vue'
import seedeLogo from '@/assets/images/logos/seede.png'
</script>

<template>
  <header class="site-header">
    <a href="/" class="logo-link" aria-label="SEEDE XR — Home">
      <img :src="seedeLogo" alt="SEEDE XR" class="site-logo" />
    </a>
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
  z-index: 500;
  padding: 1.25rem 1.5rem;
}

.logo-link {
  display: block;
}

.site-logo {
  height: 36px;
  width: auto;
  display: block;
  /* keep it visible over any background */
  filter: brightness(0) invert(1);
  opacity: 0.9;
  transition: opacity 0.2s;
}

.site-logo:hover {
  opacity: 1;
}

@media (max-width: 480px) {
  .site-header { padding: 1rem 1.25rem; }
  .site-logo { height: 28px; }
}
</style>
