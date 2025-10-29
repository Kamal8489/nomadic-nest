// --------------------
// FORM VALIDATION + SUBMIT + POPUP + CONFETTI
// --------------------
const qs = (s) => document.querySelector(s);
const form = qs('.contact-form');
const statusEl = qs('#form-status');
const popup = qs('#popup');
const announcer = qs('#aria-announcer');
const API_URL = 'https://nomadic-nest.onrender.com';

// field validators
const validators = {
  name: (v) => v.trim().length >= 3,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  phone: (v) => v.trim() === '' || /^[0-9+\-\s]{6,20}$/.test(v),
  type: (v) => v.trim() !== '',
  message: (v) => v.trim().length >= 5
};

// accessibility helper
function announce(text) {
  if (!announcer) return;
  announcer.textContent = '';
  setTimeout(() => { announcer.textContent = text; }, 50);
}

// UI validation feedback
function setFieldState(el, state) {
  const wrapper = el.closest('.form-field') || el.parentElement;
  if (!wrapper) return;
  wrapper.classList.remove('valid', 'invalid');
  if (state === 'valid') wrapper.classList.add('valid');
  else if (state === 'invalid') wrapper.classList.add('invalid');
}

// field check
function validateField(el) {
  const name = el.name;
  if (!name || !validators[name]) return true;
  const ok = validators[name](el.value || '');
  setFieldState(el, ok ? 'valid' : 'invalid');
  return ok;
}

// validate all
function validateAll() {
  let ok = true;
  form.querySelectorAll('input[name], textarea[name], select[name]').forEach(el => {
    if (!validateField(el)) ok = false;
  });
  return ok;
}

// live validation
if (form) {
  form.querySelectorAll('input[name], textarea[name], select[name]').forEach(input => {
    const eventType = input.tagName.toLowerCase() === 'select' ? 'change' : 'input';
    input.addEventListener(eventType, () => validateField(input));
    input.addEventListener('blur', () => {
      const msg = validateField(input)
        ? `${input.name} looks good`
        : `${input.name} needs attention`;
      announce(msg);
    });
  });

  // submit
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.textContent = '';

    if (!validateAll()) {
      statusEl.textContent = 'Please fix the highlighted fields';
      statusEl.style.color = '#c0392b';
      statusEl.style.fontWeight = 'bold';
      statusEl.style.fontSize = '20px';
      announce('Form has errors.  Please fix the highlighted fields.');
      return;
    }

    const formData = new FormData(form);
    const payload = {};
    formData.forEach((v, k) => payload[k] = v);

    statusEl.textContent = 'Sending...';
    statusEl.style.color = '#444';
    announce('Sending your message');

    try {
      const res = await fetch(`${API_URL}/send-message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (data && data.success) {
        form.reset();
        form.querySelectorAll('.form-field').forEach(f => f.classList.remove('valid', 'invalid'));
        statusEl.textContent = 'Message sent — thank you!';
        statusEl.style.color = '#1e4b2e';
        announce('Message sent successfully. We will contact you soon.');
        openPopup('We received your message and will contact you soon.');
        launchConfetti();
        // Hide message after 5 seconds (5000 ms)
        setTimeout(() => {
        statusEl.textContent = '';
        }, 5000);
        
      } else {
        statusEl.textContent = 'Sorry, could not send message.';
        statusEl.style.color = '#c0392b';
        announce('Unable to send your message. Please try again later.');
      }
    } catch (err) {
      console.error(err);
      statusEl.textContent = 'Server error. Try again later.';
      statusEl.style.color = '#c0392b';
      announce('Server error. Please try again later.');
    }
  });
}

// --------------------
// POPUP HANDLERS
// --------------------
function openPopup(text) {
  const popupText = document.querySelector('#popup p');
  if (popupText) popupText.textContent = text || 'Thank you — we will be in touch!';
  popup.style.display = 'flex';
  popup.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePopup() {
  popup.style.display = 'none';
  popup.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'auto';
}

qs('#closePopup')?.addEventListener('click', closePopup);

// --------------------
// CONFETTI EFFECT
// --------------------
const confettiCanvas = qs('#confettiCanvas');
const ctx = confettiCanvas?.getContext ? confettiCanvas.getContext('2d') : null;
let confetti = [];

function resizeCanvas() {
  if (!confettiCanvas) return;
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}

function launchConfetti() {
  if (!ctx) return;
  confetti = [];
  for (let i = 0; i < 120; i++) {
    confetti.push({
      x: Math.random() * confettiCanvas.width,
      y: Math.random() * -confettiCanvas.height,
      r: Math.random() * 6 + 2,
      d: Math.random() * 2 + 2,
      color: `hsl(${Math.random() * 360}, 90%, 60%)`,
      tilt: Math.random() * 0.1
    });
  }
  animateConfetti();
  setTimeout(() => confetti = [], 3000);
}

function animateConfetti() {
  if (!ctx) return;
  ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confetti.forEach(c => {
    ctx.beginPath();
    ctx.ellipse(c.x, c.y, c.r, c.r * 0.6, c.tilt, 0, Math.PI * 2);
    ctx.fillStyle = c.color;
    ctx.fill();
    c.y += c.d * 4;
    c.x += Math.sin(c.y * 0.01) * 2;
    c.tilt += 0.02;
  });
  if (confetti.length) requestAnimationFrame(animateConfetti);
}

// Initialize confetti canvas
if (confettiCanvas) {
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();
}

// --------------------
// SMOOTH SCROLLING
// --------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const targetElement = document.querySelector(targetId);
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 80,
        behavior: 'smooth'
      });
      
      // Close mobile menu if open
      document.querySelector('nav').classList.remove('active');
    }
  });
});

console.log("✅ Nomadic Nest main script loaded successfully.");


// --------------------
// INITIALIZE PAGE
// --------------------
document.addEventListener('DOMContentLoaded', function() {
  // Initialize destinations
  renderSearchComponent();
  renderDestinations(destinations);
  
  console.log("✅ Nomadic Nest additional script loaded successfully.");
});