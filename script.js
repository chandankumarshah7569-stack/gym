/* ============================
   NOVA FITNESS GYM – JAVASCRIPT
   Interactive Brochure Logic
   ============================ */

'use strict';

// ===== INTERSECTION OBSERVER FOR ANIMATIONS =====
const animObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-up, .fade-left, .fade-right, .zoom-in').forEach(el => {
  animObserver.observe(el);
});

// ===== ANIMATED COUNTERS =====
function animateCounter(el, target, duration = 1800) {
  const start = performance.now();
  const startVal = 0;

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // cubic ease out
    const current = Math.floor(startVal + (target - startVal) * eased);
    el.textContent = current.toLocaleString();
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString();
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target, 10);
      if (!isNaN(target) && !el.dataset.animated) {
        el.dataset.animated = 'true';
        animateCounter(el, target);
      }
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ===== PROGRESS BARS =====
const progressObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const width = el.dataset.width;
      if (width && !el.dataset.animated) {
        el.dataset.animated = 'true';
        setTimeout(() => {
          el.style.width = width + '%';
        }, 200);
      }
    }
  });
}, { threshold: 0.3 });

document.querySelectorAll('.why-progress, .prog-fill').forEach(el => progressObserver.observe(el));

// ===== NAVIGATION SCROLL BEHAVIOR =====
const nav = document.getElementById('mainNav');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.page');

let activeNavTimeout;

window.addEventListener('scroll', () => {
  // Shrink nav on scroll
  if (window.scrollY > 60) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }

  // Active nav link
  clearTimeout(activeNavTimeout);
  activeNavTimeout = setTimeout(() => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').replace('#', '');
      if (href === current) link.classList.add('active');
    });

    // Update page indicator
    updatePageIndicator(current);
  }, 50);
}, { passive: true });

// ===== PAGE INDICATOR =====
const piDots = document.getElementById('piDots');

function buildPageIndicator() {
  for (let i = 1; i <= 15; i++) {
    const dot = document.createElement('div');
    dot.className = 'pi-dot';
    dot.dataset.page = i;
    dot.title = `Page ${i}`;
    dot.addEventListener('click', () => {
      const section = document.getElementById(`page${i}`);
      if (section) section.scrollIntoView({ behavior: 'smooth' });
    });
    piDots.appendChild(dot);
  }
}

function updatePageIndicator(sectionId) {
  if (!sectionId) return;
  const pageNum = sectionId.replace('page', '');
  document.querySelectorAll('.pi-dot').forEach(dot => {
    dot.classList.toggle('active', dot.dataset.page === pageNum);
  });
}

buildPageIndicator();

// ===== MOBILE NAV TOGGLE =====
function toggleNav() {
  const menu = document.getElementById('navMenu');
  menu.classList.toggle('open');
}

// Close mobile nav on link click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navMenu').classList.remove('open');
  });
});

// ===== PARTICLES ON COVER =====
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const colors = ['#D4AF37', '#CC0000', '#FFFFFF', '#F0D060'];
  const sizes = [2, 3, 4, 5, 6];

  for (let i = 0; i < 35; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = Math.random() * 4;
    const duration = 5 + Math.random() * 6;
    const opacity = 0.2 + Math.random() * 0.6;

    particle.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      left: ${left}%;
      top: ${top}%;
      animation-delay: ${delay}s;
      animation-duration: ${duration}s;
      opacity: ${opacity};
      box-shadow: 0 0 ${size * 2}px ${color};
    `;
    container.appendChild(particle);
  }
}

createParticles();

// ===== GALLERY FILTER =====
function filterGallery(category, btn) {
  // Update button state
  document.querySelectorAll('.gal-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  // Filter items
  const items = document.querySelectorAll('.gal-item');
  items.forEach(item => {
    if (category === 'all' || item.dataset.cat === category) {
      item.classList.remove('hidden');
      item.style.animation = 'fadeIn 0.4s ease';
    } else {
      item.classList.add('hidden');
    }
  });
}

// ===== CONTACT FORM SUBMIT =====
function sendEnquiry() {
  const name = document.getElementById('contactName').value.trim();
  const phone = document.getElementById('contactPhone').value.trim();
  const interest = document.getElementById('contactInterest').value;
  const msg = document.getElementById('contactMsg').value.trim();

  if (!name || !phone) {
    showToast('Please fill in your name and phone number.', 'error');
    return;
  }

  const waText = encodeURIComponent(
    `*Nova Fitness Gym Enquiry*\n\n` +
    `👤 Name: ${name}\n` +
    `📞 Phone: ${phone}\n` +
    `🎯 Interest: ${interest}\n` +
    `💬 Message: ${msg || 'N/A'}\n\n` +
    `_Sent from Nova Fitness Brochure_`
  );

  window.open(`https://wa.me/918125801743?text=${waText}`, '_blank');
  showToast('Redirecting to WhatsApp...', 'success');

  // Clear form
  document.getElementById('contactName').value = '';
  document.getElementById('contactPhone').value = '';
  document.getElementById('contactMsg').value = '';
}

// ===== TOAST NOTIFICATION =====
function showToast(message, type = 'success') {
  const existing = document.querySelector('.nova-toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'nova-toast';
  toast.textContent = message;
  toast.style.cssText = `
    position: fixed;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%) translateY(20px);
    background: ${type === 'success' ? 'linear-gradient(135deg, #27ae60, #16a085)' : 'linear-gradient(135deg, #e74c3c, #c0392b)'};
    color: white;
    padding: 0.8rem 2rem;
    border-radius: 50px;
    font-family: 'Outfit', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 8px 30px rgba(0,0,0,0.4);
    opacity: 0;
    transition: all 0.4s ease;
  `;
  document.body.appendChild(toast);

  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(() => toast.remove(), 400);
  }, 3000);
}

// ===== SMOOTH PAGE TRANSITIONS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ===== TILT EFFECT ON CARDS =====
document.querySelectorAll('.glass-card, .plan-card, .prog-card, .trainer-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -3;
    const rotateY = ((x - centerX) / centerX) * 3;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ===== KEYBOARD NAVIGATION =====
document.addEventListener('keydown', (e) => {
  const sections = Array.from(document.querySelectorAll('.page'));
  const scrollPos = window.scrollY + window.innerHeight / 2;
  let currentIdx = 0;

  sections.forEach((section, idx) => {
    if (section.offsetTop <= scrollPos) currentIdx = idx;
  });

  if (e.key === 'ArrowDown' || e.key === 'PageDown') {
    if (currentIdx < sections.length - 1) {
      e.preventDefault();
      sections[currentIdx + 1].scrollIntoView({ behavior: 'smooth' });
    }
  } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
    if (currentIdx > 0) {
      e.preventDefault();
      sections[currentIdx - 1].scrollIntoView({ behavior: 'smooth' });
    }
  }
});

// ===== IMAGE FADE-IN ON ENTER (safe for cached images) =====
const imgObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const img = entry.target;
      // Only animate if not already visible
      if (img.style.opacity === '1') return;

      const reveal = () => {
        img.style.opacity = '1';
      };

      img.style.transition = 'opacity 0.5s ease';

      if (img.complete && img.naturalHeight !== 0) {
        // Already cached – reveal immediately
        reveal();
      } else {
        img.style.opacity = '0';
        img.addEventListener('load', reveal, { once: true });
        img.addEventListener('error', reveal, { once: true }); // show even on error
      }

      imgObserver.unobserve(img);
    }
  });
}, { threshold: 0.05 });

document.querySelectorAll('img').forEach(img => {
  // Pre-set opacity only if not already loaded
  if (!img.complete || img.naturalHeight === 0) {
    img.style.opacity = '0';
  }
  imgObserver.observe(img);
});

// ===== INITIALIZE ON LOAD =====
window.addEventListener('load', () => {
  // Trigger animations for first page
  document.querySelectorAll('#page1 .fade-up').forEach(el => {
    el.classList.add('visible');
  });

  // Animate cover counter stats
  document.querySelectorAll('.cstat-num').forEach(el => {
    const target = parseInt(el.dataset.target, 10);
    if (!isNaN(target)) animateCounter(el, target, 2000);
  });

  // Build page indicator
  updatePageIndicator('page1');

  console.log('%c⚡ NOVA FITNESS GYM', 'color: #D4AF37; font-size: 20px; font-weight: 900; font-family: Outfit, sans-serif;');
  console.log('%cDesigned by Nova Web Studio | 📞 8125801743', 'color: #888; font-size: 12px;');
});

// ===== PARALLAX EFFECTS =====
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;

  // Parallax on cover background
  const coverBg = document.querySelector('.cover-bg-img');
  if (coverBg && scrollY < window.innerHeight) {
    coverBg.style.transform = `translateY(${scrollY * 0.25}px)`;
  }
}, { passive: true });

// ===== GLOW EFFECT ON HOVER FOR CTA BUTTONS =====
document.querySelectorAll('.btn-glow').forEach(btn => {
  btn.addEventListener('mouseenter', function() {
    this.style.animation = 'none';
  });
  btn.addEventListener('mouseleave', function() {
    this.style.animation = 'pulse-glow 2.5s ease-in-out infinite';
  });
});
