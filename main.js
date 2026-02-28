/* ═══════════════════════════════════════════════════
   JANOS BUZAS — PORTFOLIO  |  main.js
   ═══════════════════════════════════════════════════ */

'use strict';

/* ══ 1. CURSOR GLOW ══ */
(function initCursor() {
  const glow = document.getElementById('cursorGlow');
  if (!glow || window.matchMedia('(max-width: 768px)').matches) return;
  let mx = window.innerWidth / 2, my = window.innerHeight / 2, cx = mx, cy = my;
  document.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
  function animate() { cx += (mx - cx) * 0.08; cy += (my - cy) * 0.08; glow.style.left = cx + 'px'; glow.style.top = cy + 'px'; requestAnimationFrame(animate); }
  animate();
})();

/* ══ 2. NAVBAR SCROLL ══ */
(function initNavbar() {
  const nav = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');
  if (!nav) return;
  const onScroll = () => { nav.classList.toggle('scrolled', window.scrollY > 40); };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toggle && mobile) {
    toggle.addEventListener('click', () => {
      const open = nav.classList.toggle('mobile-open');
      toggle.setAttribute('aria-expanded', String(open));
      mobile.setAttribute('aria-hidden', String(!open));
    });
    mobile.querySelectorAll('.nav-mobile-link').forEach(link => {
      link.addEventListener('click', () => { nav.classList.remove('mobile-open'); toggle.setAttribute('aria-expanded', 'false'); mobile.setAttribute('aria-hidden', 'true'); });
    });
  }
})();

/* ══ 3. TYPEWRITER EFFECT ══ */
(function initTypewriter() {
  const el = document.getElementById('typewriter');
  if (!el) return;
  const roles = ['Fintech Developer', 'Automation Builder', 'AI Integration Engineer', 'Full-Stack Developer', 'Tech-Driven Problem Solver'];
  let roleIdx = 0, charIdx = 0, deleting = false;
  const SPEED_TYPE = 65, SPEED_DEL = 35, PAUSE = 2200;
  function tick() {
    const current = roles[roleIdx];
    if (!deleting) { el.textContent = current.slice(0, charIdx + 1); charIdx++; if (charIdx === current.length) { deleting = true; setTimeout(tick, PAUSE); return; } }
    else { el.textContent = current.slice(0, charIdx - 1); charIdx--; if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; } }
    setTimeout(tick, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  setTimeout(tick, 800);
})();

/* ══ 4. HERO PARTICLE CANVAS ══ */
(function initCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const PARTICLE_COUNT = window.innerWidth < 768 ? 40 : 80;
  const MAX_DIST = 140;
  let W, H, particles = [];
  function resize() { W = canvas.width = canvas.offsetWidth; H = canvas.height = canvas.offsetHeight; }
  function rand(min, max) { return Math.random() * (max - min) + min; }
  class Particle {
    constructor() { this.reset(); }
    reset() { this.x = rand(0, W); this.y = rand(0, H); this.vx = rand(-0.35, 0.35); this.vy = rand(-0.35, 0.35); this.r = rand(1, 2.5); this.alpha = rand(0.3, 0.8); }
    update() { this.x += this.vx; this.y += this.vy; if (this.x < 0 || this.x > W) this.vx *= -1; if (this.y < 0 || this.y > H) this.vy *= -1; }
    draw() { ctx.beginPath(); ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2); ctx.fillStyle = `rgba(99, 102, 241, ${this.alpha})`; ctx.fill(); }
  }
  function init() { resize(); particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle()); }
  function drawConnections() {
    for (let i = 0; i < particles.length; i++) for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y;
      const d = Math.sqrt(dx * dx + dy * dy);
      if (d < MAX_DIST) { const opacity = (1 - d / MAX_DIST) * 0.35; ctx.beginPath(); ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`; ctx.lineWidth = 0.8; ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.stroke(); }
    }
  }
  function animate() { ctx.clearRect(0, 0, W, H); particles.forEach(p => { p.update(); p.draw(); }); drawConnections(); requestAnimationFrame(animate); }
  window.addEventListener('resize', () => { resize(); }, { passive: true });
  init(); animate();
})();

/* ══ 5. SCROLL REVEAL ══ */
(function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const siblings = [...entry.target.parentElement.querySelectorAll('.reveal:not(.visible)')];
        const idx = siblings.indexOf(entry.target);
        setTimeout(() => { entry.target.classList.add('visible'); }, idx * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  items.forEach(el => observer.observe(el));
})();

/* ══ 6. STAT COUNTER ══ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (!counters.length) return;
  function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target, target = parseInt(el.dataset.target, 10), dur = 1400, start = performance.now();
      function update(now) { const t = Math.min((now - start) / dur, 1); el.textContent = Math.round(easeOut(t) * target); if (t < 1) requestAnimationFrame(update); }
      requestAnimationFrame(update);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => observer.observe(el));
})();

/* ══ 7. PROJECT FILTER ══ */
(function initProjectFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!btns.length || !cards.length) return;
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;
      btns.forEach(b => { b.classList.remove('active'); b.setAttribute('aria-selected', 'false'); });
      btn.classList.add('active'); btn.setAttribute('aria-selected', 'true');
      cards.forEach(card => {
        const match = filter === 'all' || card.dataset.category === filter;
        if (match) { card.removeAttribute('data-hidden'); card.style.opacity = '0'; card.style.transform = 'translateY(12px)'; requestAnimationFrame(() => { card.style.transition = 'opacity 0.3s ease, transform 0.3s ease'; card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }); }
        else { card.style.transition = 'opacity 0.2s ease'; card.style.opacity = '0'; setTimeout(() => { card.setAttribute('data-hidden', 'true'); }, 200); }
      });
    });
  });
})();

/* ══ 8. CONTACT FORM VALIDATION ══ */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;
  const submitBtn = document.getElementById('submitBtn');
  const btnText = submitBtn?.querySelector('.btn-text');
  const btnLoading = submitBtn?.querySelector('.btn-loading');
  const success = document.getElementById('formSuccess');
  function getField(id) { return document.getElementById(id); }
  function getError(id) { return document.getElementById(id + '-error'); }
  function validate(id, value) {
    const errEl = getError(id); let msg = '';
    if (id === 'name' && !value.trim()) msg = 'Por favor, introduce tu nombre.';
    if (id === 'email') { if (!value.trim()) msg = 'Por favor, introduce tu email.'; else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) msg = 'Introduce un email válido.'; }
    if (id === 'message' && value.trim().length < 10) msg = 'El mensaje debe tener al menos 10 caracteres.';
    if (errEl) errEl.textContent = msg;
    const field = getField(id); if (field) field.classList.toggle('error', !!msg);
    return !msg;
  }
  ['name', 'email', 'message'].forEach(id => { const el = getField(id); if (el) el.addEventListener('blur', () => validate(id, el.value)); });
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const valid = [ validate('name', getField('name')?.value || ''), validate('email', getField('email')?.value || ''), validate('message', getField('message')?.value || '') ].every(Boolean);
    if (!valid) { const firstErr = form.querySelector('.error'); if (firstErr) firstErr.focus(); return; }
    if (btnText) btnText.style.display = 'none'; if (btnLoading) btnLoading.style.display = 'inline-flex'; if (submitBtn) submitBtn.disabled = true;
    setTimeout(() => { if (btnText) btnText.style.display = ''; if (btnLoading) btnLoading.style.display = 'none'; if (submitBtn) submitBtn.disabled = false; if (success) success.style.display = 'flex'; form.reset(); setTimeout(() => { if (success) success.style.display = 'none'; }, 6000); }, 1600);
  });
})();

/* ══ 9. ACTIVE NAV LINK ══ */
(function initActiveNavLink() {
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-link');
  if (!sections.length || !links.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      links.forEach(link => { const active = link.getAttribute('href') === '#' + entry.target.id; link.style.color = active ? 'var(--color-text-primary)' : ''; link.style.background = active ? 'var(--color-brand-muted)' : ''; });
    });
  }, { threshold: 0.3, rootMargin: '-80px 0px 0px 0px' });
  sections.forEach(s => observer.observe(s));
})();