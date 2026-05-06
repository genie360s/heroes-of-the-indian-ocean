<script setup>
import { ref, watch, nextTick } from 'vue'

const props = defineProps({
  type: { type: String, required: true }, // 'documentary' | 'series'
  show: { type: Boolean, default: false }
})

const emit = defineEmits(['close'])

const state = ref('idle') // idle | loading | success | error
const errorMessage = ref('')
const formRef = ref(null)

const docForm = ref({ name: '', email: '', organization: '', country: '', purpose: '' })
const seriesForm = ref({ name: '', email: '', contributionType: '', amount: '', message: '' })

const contributionTypes = [
  'Financial Support',
  'Equipment / Gear',
  'Expertise / Skills',
  'Distribution Network',
  'Community Outreach',
  'Other'
]

function close() {
  if (state.value === 'loading') return
  emit('close')
}

function resetForms() {
  docForm.value = { name: '', email: '', organization: '', country: '', purpose: '' }
  seriesForm.value = { name: '', email: '', contributionType: '', amount: '', message: '' }
  state.value = 'idle'
  errorMessage.value = ''
}

async function submit() {
  state.value = 'loading'
  errorMessage.value = ''

  const payload =
    props.type === 'documentary'
      ? { formType: 'documentary', ...docForm.value }
      : { formType: 'series', ...seriesForm.value }

  try {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message || 'Something went wrong.')
    state.value = 'success'
  } catch (err) {
    state.value = 'error'
    errorMessage.value = err.message || 'Something went wrong. Please try again.'
  }
}

watch(
  () => props.show,
  (val) => { if (val) { resetForms(); nextTick(() => formRef.value?.querySelector('input')?.focus()) } }
)
</script>

<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="show" class="modal-backdrop" @click.self="close" role="dialog" aria-modal="true">
        <Transition name="modal-scale">
          <div v-if="show" class="modal-panel">

            <!-- Close button -->
            <button class="modal-close" @click="close" aria-label="Close">
              <span></span><span></span>
            </button>

            <!-- Header -->
            <div class="modal-header" :class="type">
              <p class="modal-label">Heroes of Indian Ocean</p>
              <h2 class="modal-title">
                {{ type === 'documentary' ? 'Request the Documentary' : 'Contribute to Next Series' }}
              </h2>
              <p class="modal-sub">
                {{ type === 'documentary'
                  ? 'Fill in your details and we\'ll get back to you with screening access.'
                  : 'Tell us how you\'d like to contribute to the next chapter.' }}
              </p>
            </div>

            <!-- Form ref -->
            <div ref="formRef">

              <!-- SUCCESS STATE -->
              <div v-if="state === 'success'" class="success-state">
                <div class="success-icon">
                  <svg viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="26" cy="26" r="25" stroke="currentColor" stroke-width="2"/>
                    <path d="M14 26L22 34L38 18" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div>
                <h3>Message Received</h3>
                <p>Thank you, {{ type === 'documentary' ? docForm.name : seriesForm.name }}.<br/>We'll be in touch at your email shortly.</p>
                <button class="btn-submit" @click="close">Close</button>
              </div>

              <!-- DOCUMENTARY FORM -->
              <form v-else-if="type === 'documentary'" @submit.prevent="submit" class="modal-form" novalidate>
                <div class="form-row">
                  <div class="form-group">
                    <label>Full Name <span class="req">*</span></label>
                    <input v-model="docForm.name" type="text" placeholder="Jane Smith" required :disabled="state === 'loading'" />
                  </div>
                  <div class="form-group">
                    <label>Email Address <span class="req">*</span></label>
                    <input v-model="docForm.email" type="email" placeholder="jane@example.com" required :disabled="state === 'loading'" />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Organization</label>
                    <input v-model="docForm.organization" type="text" placeholder="University, NGO, Media..." :disabled="state === 'loading'" />
                  </div>
                  <div class="form-group">
                    <label>Country</label>
                    <input v-model="docForm.country" type="text" placeholder="Tanzania, Kenya, USA..." :disabled="state === 'loading'" />
                  </div>
                </div>
                <div class="form-group full">
                  <label>Purpose / Message <span class="req">*</span></label>
                  <textarea v-model="docForm.purpose" rows="4" placeholder="How do you intend to screen or use the documentary?" required :disabled="state === 'loading'"></textarea>
                </div>
                <p v-if="state === 'error'" class="error-msg">{{ errorMessage }}</p>
                <button type="submit" class="btn-submit" :disabled="state === 'loading' || !docForm.name || !docForm.email || !docForm.purpose">
                  <span v-if="state === 'loading'" class="loading-dots">Sending<span>.</span><span>.</span><span>.</span></span>
                  <span v-else>Send Request &nbsp;→</span>
                </button>
              </form>

              <!-- SERIES FORM -->
              <form v-else-if="type === 'series'" @submit.prevent="submit" class="modal-form" novalidate>
                <div class="form-row">
                  <div class="form-group">
                    <label>Full Name <span class="req">*</span></label>
                    <input v-model="seriesForm.name" type="text" placeholder="Jane Smith" required :disabled="state === 'loading'" />
                  </div>
                  <div class="form-group">
                    <label>Email Address <span class="req">*</span></label>
                    <input v-model="seriesForm.email" type="email" placeholder="jane@example.com" required :disabled="state === 'loading'" />
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Contribution Type <span class="req">*</span></label>
                    <select v-model="seriesForm.contributionType" required :disabled="state === 'loading'">
                      <option value="" disabled>Select type...</option>
                      <option v-for="t in contributionTypes" :key="t" :value="t">{{ t }}</option>
                    </select>
                  </div>
                  <div class="form-group" v-if="seriesForm.contributionType === 'Financial Support'">
                    <label>Amount (USD)</label>
                    <input v-model="seriesForm.amount" type="number" placeholder="500" min="1" :disabled="state === 'loading'" />
                  </div>
                </div>
                <div class="form-group full">
                  <label>Message</label>
                  <textarea v-model="seriesForm.message" rows="4" placeholder="Tell us more about how you'd like to be involved..." :disabled="state === 'loading'"></textarea>
                </div>
                <p v-if="state === 'error'" class="error-msg">{{ errorMessage }}</p>
                <button type="submit" class="btn-submit series" :disabled="state === 'loading' || !seriesForm.name || !seriesForm.email || !seriesForm.contributionType">
                  <span v-if="state === 'loading'" class="loading-dots">Sending<span>.</span><span>.</span><span>.</span></span>
                  <span v-else>Submit Contribution &nbsp;→</span>
                </button>
              </form>

            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Backdrop */
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 1000;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  overflow-y: auto;
}

/* Panel */
.modal-panel {
  position: relative;
  background: #0f0f0f;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  width: 100%;
  max-width: 680px;
  padding: 2.5rem;
  box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
  margin: auto;
}

/* Close */
.modal-close {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 36px;
  height: 36px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 5px;
  transition: background 0.2s;
}
.modal-close:hover { background: rgba(255,255,255,0.15); }
.modal-close span {
  display: block;
  width: 14px;
  height: 1.5px;
  background: #fff;
  transition: transform 0.2s;
}
.modal-close span:first-child { transform: translateY(3.25px) rotate(45deg); }
.modal-close span:last-child  { transform: translateY(-3.25px) rotate(-45deg); }

/* Header */
.modal-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255,255,255,0.07);
}
.modal-label {
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 3px;
  color: rgba(255,255,255,0.3);
  margin: 0 0 0.75rem;
}
.modal-title {
  font-size: clamp(1.4rem, 4vw, 1.9rem);
  font-weight: 800;
  color: #fff;
  margin: 0 0 0.75rem;
  line-height: 1.1;
}
.modal-header.documentary .modal-title { color: #0077be; }
.modal-header.series .modal-title { color: #ffbf00; }
.modal-sub {
  font-size: 0.95rem;
  font-weight: 500;
  color: rgba(255,255,255,0.45);
  margin: 0;
  line-height: 1.5;
}

/* Form */
.modal-form { display: flex; flex-direction: column; gap: 1.25rem; }
.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
@media (max-width: 560px) {
  .form-row { grid-template-columns: 1fr; }
}

.form-group { display: flex; flex-direction: column; gap: 0.5rem; }
.form-group.full { grid-column: 1 / -1; }

label {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  color: rgba(255,255,255,0.5);
}
.req { color: #ff6b6b; }

input, textarea, select {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px;
  color: #fff;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  padding: 0.85rem 1rem;
  transition: border-color 0.2s, background 0.2s;
  width: 100%;
  box-sizing: border-box;
  -webkit-appearance: none;
}
input::placeholder, textarea::placeholder { color: rgba(255,255,255,0.2); font-weight: 400; }
input:focus, textarea:focus, select:focus {
  outline: none;
  border-color: rgba(0, 119, 190, 0.6);
  background: rgba(0, 119, 190, 0.05);
}
textarea { resize: vertical; min-height: 100px; }
select { cursor: pointer; }
select option { background: #1a1a1a; }
input:disabled, textarea:disabled, select:disabled { opacity: 0.5; cursor: not-allowed; }

/* Submit button */
.btn-submit {
  margin-top: 0.5rem;
  padding: 1rem 2rem;
  background: #0077be;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;
  align-self: flex-start;
}
.btn-submit.series { background: #ffbf00; color: #0d0d0d; }
.btn-submit:hover:not(:disabled) { filter: brightness(1.15); transform: translateY(-1px); }
.btn-submit:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

/* Loading dots */
.loading-dots span {
  animation: blink 1.2s infinite;
  display: inline-block;
}
.loading-dots span:nth-child(2) { animation-delay: 0.2s; }
.loading-dots span:nth-child(3) { animation-delay: 0.4s; }
@keyframes blink { 0%, 100% { opacity: 0.2 } 50% { opacity: 1 } }

/* Error */
.error-msg {
  color: #ff6b6b;
  font-size: 0.9rem;
  margin: 0;
  padding: 0.75rem 1rem;
  background: rgba(255, 107, 107, 0.08);
  border-radius: 6px;
  border: 1px solid rgba(255, 107, 107, 0.2);
}

/* Success */
.success-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 0 1rem;
  gap: 1rem;
}
.success-icon {
  width: 60px;
  height: 60px;
  color: #0077be;
}
.success-icon svg { width: 100%; height: 100%; }
.success-state h3 { font-size: 1.5rem; margin: 0; }
.success-state p { color: rgba(255,255,255,0.5); line-height: 1.6; margin: 0; }

/* Transitions */
.modal-fade-enter-active,
.modal-fade-leave-active { transition: opacity 0.3s ease; }
.modal-fade-enter-from,
.modal-fade-leave-to { opacity: 0; }

.modal-scale-enter-active { transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-scale-leave-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.modal-scale-enter-from { opacity: 0; transform: scale(0.92) translateY(20px); }
.modal-scale-leave-to   { opacity: 0; transform: scale(0.96) translateY(10px); }

/* Mobile panel adjustments */
@media (max-width: 600px) {
  .modal-panel { padding: 1.75rem 1.25rem; }
}
</style>
