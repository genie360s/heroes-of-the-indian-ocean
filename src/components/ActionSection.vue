<script setup>
</script>

<template>
  <section class="action-container">
    <div class="cta-wrapper">
      <h2 class="cta-title">Be Part of the Solution</h2>
      
      <div class="buttons">
        <a href="#" class="btn primary">
          <span class="btn-text">Download Documentary</span>
          <span class="btn-icon">↓</span>
        </a>
        <a href="#" class="btn secondary">
          <span class="btn-text">Contribute to Next Series</span>
          <span class="btn-icon">→</span>
        </a>
      </div>

      <footer class="footer">
        <p>&copy; 2025 Heroes of Indian Ocean. All Rights Reserved.</p>
        <p class="credits">Producer: Alex G. Mkwizu | SEEDE XR</p>
      </footer>
    </div>
  </section>
</template>

<style scoped>
.action-container {
  min-height: 80vh; /* Takes up substantial space */
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(to bottom, var(--color-bg), #051e3e);
  padding: 4rem 1rem;
  text-align: center;
  position: relative; /* Context for absolute footer */
}

.cta-title {
  font-size: clamp(3rem, 6vw, 6rem);
  text-transform: uppercase;
  margin-bottom: 4rem;
  line-height: 0.9;
}

.buttons {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  margin-bottom: 6rem;
}

@media (min-width: 768px) {
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
  max-width: 350px;
  padding: 1.5rem 2rem;
  border: 1px solid rgba(255,255,255,0.2);
  font-size: 1.5rem;
  font-weight: 600;
  text-transform: uppercase;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

.btn:hover {
  color: var(--color-bg); 
  border-color: white;
}

.btn-text, .btn-icon {
  position: relative;
  z-index: 1;
}

.primary {
  background: var(--color-accent-blue);
  border-color: var(--color-accent-blue);
}

.primary:hover {
  color: white; /* Keep white on blue, maybe lighten blue? */
  /* Let's actually make the hover effect slide in white, so text becomes black/dark */
  color: var(--color-bg);
}

.secondary {
  /* Transparent with border */
}

.footer {
  position: absolute;
  bottom: 0px;
  left: 0;
  width: 100%;
  text-align: center;
  color: var(--color-text-muted);
  font-size: 0.9rem;
  padding-bottom: 1rem; /* Some breathing room */
}

.credits {
  margin-top: 0.5rem;
  opacity: 0.6;
}
</style>
