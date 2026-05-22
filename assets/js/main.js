/**
 * Saifallah Basem — SW Tester Portfolio
 * Main JavaScript File
 */

// ==========================================
// PRELOADER
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  const preloader = document.querySelector('.preloader');
  if (preloader) {
    // Wait for fonts and basic resources
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        setTimeout(() => preloader.classList.add('hidden'), 400);
      });
    } else {
      setTimeout(() => preloader.classList.add('hidden'), 600);
    }
  }
});

// ==========================================
// PARTICLE BACKGROUND
// ==========================================
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let isActive = true;

  const PARTICLE_COUNT = 40;
  const CONNECTION_DIST = 120;
  const MAX_CONNECTIONS = 3;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.radius = Math.random() * 1.5 + 0.5;
      this.alpha = Math.random() * 0.3 + 0.1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
      if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(245, 168, 0, ${this.alpha})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push(new Particle());
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      let connections = 0;
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < CONNECTION_DIST && connections < MAX_CONNECTIONS) {
          const alpha = (1 - dist / CONNECTION_DIST) * 0.12;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(245, 168, 0, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
          connections++;
        }
      }
    }
  }

  function animate() {
    if (!isActive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.update();
      p.draw();
    });

    drawConnections();
    animationId = requestAnimationFrame(animate);
  }

  // Pause when tab is hidden
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isActive = false;
      cancelAnimationFrame(animationId);
    } else {
      isActive = true;
      animate();
    }
  });

  window.addEventListener('resize', () => {
    resize();
  });

  init();
  animate();
})();

// ==========================================
// EMAIL DISPLAY
// ==========================================
(function initEmail() {
  const emailDisplay = document.getElementById('emailDisplay');
  if (emailDisplay) {
    emailDisplay.textContent = 'saifallahbasem2' + '@' + 'gmail.com';
  }
})();

// ==========================================
// EMAILJS INITIALIZATION
// ==========================================
(function initEmailJS() {
  if (typeof emailjs !== 'undefined') {
    emailjs.init('9bUeWzRMy6z7zcwt0');
  }
})();

// ==========================================
// SPOTLIGHT EASTER EGG
// ==========================================
(function initSpotlight() {
  const spotlightZone = document.getElementById('spotlightZone');
  const spotlightHidden = document.getElementById('spotlightHidden');
  const spotlightMask = document.getElementById('spotlightMask');
  const bugWrapper = document.getElementById('bugWrapper');
  const bugSvg = document.getElementById('bugSvg');
  const spotlightContent = document.getElementById('spotlightContent');

  if (!spotlightZone || !spotlightMask || !bugWrapper || !bugSvg || !spotlightContent) return;

  let startled = false;
  let calmTimeout = null;

  spotlightMask.addEventListener('mousemove', (e) => {
    const rect = spotlightZone.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const radius = 210;

    spotlightHidden.style.webkitMaskImage = `radial-gradient(circle ${radius}px at ${x}px ${y}px, black 60%, transparent 100%)`;
    spotlightHidden.style.maskImage = `radial-gradient(circle ${radius}px at ${x}px ${y}px, black 60%, transparent 100%)`;

    // Interactive bug tracking
    const bugRect = bugSvg.getBoundingClientRect();
    const bugCenterX = bugRect.left + bugRect.width / 2;
    const bugCenterY = bugRect.top + bugRect.height / 2;

    const xDiff = e.clientX - bugCenterX;
    const yDiff = e.clientY - bugCenterY;
    const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

    // Eye movement
    const angle = Math.atan2(yDiff, xDiff);
    const maxEyeOffset = 4.5;
    const eyeDx = Math.cos(angle) * maxEyeOffset;
    const eyeDy = Math.sin(angle) * maxEyeOffset;

    const pupilLeft = bugSvg.querySelector('.pupil-left');
    const pupilRight = bugSvg.querySelector('.pupil-right');
    if (pupilLeft && pupilRight) {
      pupilLeft.style.transform = `translate(${eyeDx}px, ${eyeDy}px)`;
      pupilRight.style.transform = `translate(${eyeDx}px, ${eyeDy}px)`;
    }

    // State Machine behavior
    if (distance < 220) {
      // Cursor is close -> Scared reaction
      if (!startled) {
        startled = true;
        bugSvg.classList.add('startled');

        // Micro camera shake
        spotlightContent.classList.add('shake-zone');
        setTimeout(() => {
          spotlightContent.classList.remove('shake-zone');
        }, 300);

        // Wiggle antennae
        const antennaL = bugSvg.querySelector('.antenna-left');
        const antennaR = bugSvg.querySelector('.antenna-right');
        if (antennaL && antennaR) {
          antennaL.classList.add('frantic-wiggle');
          antennaR.classList.add('frantic-wiggle');
        }
      }

      // Repel translation
      const repelForce = Math.max(0, (220 - distance) * 0.4);
      const rx = -Math.cos(angle) * repelForce;
      const ry = -Math.sin(angle) * repelForce;

      const maxRotate = 14;
      const rotVal = (xDiff > 0 ? -1 : 1) * maxRotate * (1 - distance / 220);

      bugWrapper.style.transform = `translate(${rx}px, ${ry}px)`;
      bugSvg.style.transform = `rotate(${rotVal}deg) scale(1.05)`;

      if (distance < 80) {
        bugSvg.classList.add('bug-hovered');
      } else {
        bugSvg.classList.remove('bug-hovered');
      }

      clearTimeout(calmTimeout);
      calmTimeout = setTimeout(() => {
        calmDownBug();
      }, 1200);
    } else {
      if (startled && distance > 260) {
        calmDownBug();
      }
    }
  });

  spotlightMask.addEventListener('mouseleave', () => {
    spotlightHidden.style.webkitMaskImage = `radial-gradient(circle 0px at -999px -999px, black 100%, transparent 100%)`;
    spotlightHidden.style.maskImage = `radial-gradient(circle 0px at -999px -999px, black 100%, transparent 100%)`;

    calmDownBug();

    const pupilLeft = bugSvg.querySelector('.pupil-left');
    const pupilRight = bugSvg.querySelector('.pupil-right');
    if (pupilLeft && pupilRight) {
      pupilLeft.style.transform = '';
      pupilRight.style.transform = '';
    }
  });

  function calmDownBug() {
    if (!startled) return;
    startled = false;
    bugSvg.classList.remove('startled');
    bugSvg.classList.remove('bug-hovered');

    const antennaL = bugSvg.querySelector('.antenna-left');
    const antennaR = bugSvg.querySelector('.antenna-right');
    if (antennaL && antennaR) {
      antennaL.classList.remove('frantic-wiggle');
      antennaR.classList.remove('frantic-wiggle');
    }

    bugWrapper.style.transform = '';
    bugSvg.style.transform = '';
  }
})();

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
        ticking = false;
      });
      ticking = true;
    }
  });
})();

// ==========================================
// MOBILE NAVIGATION
// ==========================================
(function initMobileNav() {
  window.toggleNav = function () {
    document.getElementById('hamburger').classList.toggle('open');
    document.getElementById('navLinks').classList.toggle('open');
  };

  document.querySelectorAll('#navLinks a').forEach(a => {
    a.addEventListener('click', () => {
      document.getElementById('hamburger').classList.remove('open');
      document.getElementById('navLinks').classList.remove('open');
    });
  });
})();

// ==========================================
// SCROLL REVEAL ANIMATIONS
// ==========================================
(function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const staggerContainers = document.querySelectorAll('.stagger-children');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.05 });

  reveals.forEach(r => observer.observe(r));
  staggerContainers.forEach(c => observer.observe(c));

  // Fallback: show all after 2 seconds
  setTimeout(() => {
    reveals.forEach(r => r.classList.add('visible'));
    staggerContainers.forEach(c => c.classList.add('visible'));
  }, 2000);
})();

// ==========================================
// ACTIVE NAV HIGHLIGHT
// ==========================================
(function initActiveNav() {
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        let current = '';
        const sections = document.querySelectorAll('section[id]');

        sections.forEach(s => {
          if (window.scrollY >= s.offsetTop - 100) {
            current = s.id;
          }
        });

        document.querySelectorAll('#navLinks a').forEach(a => {
          const href = a.getAttribute('href');
          if (href === '#' + current) {
            a.classList.add('active');
          } else {
            a.classList.remove('active');
          }
        });

        ticking = false;
      });
      ticking = true;
    }
  });
})();

// ==========================================
// TYPING EFFECT
// ==========================================
(function initTyping() {
  const heroTag = document.querySelector('.hero-tag');
  if (!heroTag) return;

  const text = heroTag.textContent;
  heroTag.textContent = '';
  heroTag.style.animation = 'none';
  heroTag.style.opacity = '1';

  let i = 0;
  setTimeout(() => {
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        heroTag.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 40);
  }, 500);
})();

// ==========================================
// BACK TO TOP BUTTON
// ==========================================
(function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        btn.classList.toggle('visible', window.scrollY > 500);
        ticking = false;
      });
      ticking = true;
    }
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

// ==========================================
// CONTACT FORM
// ==========================================
function sendMessage() {
  const nameInput = document.getElementById('formName');
  const emailInput = document.getElementById('formEmail');
  const msgInput = document.getElementById('formMessage');
  const btn = document.getElementById('sendBtn');
  const statusEl = document.getElementById('formStatus');

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();
  const msg = msgInput.value.trim();

  // Validation
  if (!name || !email || !msg) {
    showStatus('Please fill in all fields.', 'error');
    return;
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    showStatus('Please enter a valid email address.', 'error');
    return;
  }

  btn.textContent = 'Sending...';
  btn.disabled = true;
  hideStatus();

  if (typeof emailjs === 'undefined') {
    showStatus('Email service unavailable. Please email directly.', 'error');
    btn.textContent = 'Send Message \u2192';
    btn.disabled = false;
    return;
  }

  emailjs.send('service_ym3834h', 'template_2o8v2dd', {
    from_name: name,
    from_email: email,
    message: msg
  }).then(() => {
    showToast(`Thanks ${name}! Message received ✓`);
    nameInput.value = '';
    emailInput.value = '';
    msgInput.value = '';
    btn.textContent = 'Send Message \u2192';
    btn.disabled = false;
  }).catch(() => {
    showStatus('Failed to send. Please try again or email directly.', 'error');
    btn.textContent = 'Send Message \u2192';
    btn.disabled = false;
  });
}

function showStatus(message, type) {
  const statusEl = document.getElementById('formStatus');
  if (!statusEl) return;
  statusEl.textContent = message;
  statusEl.className = `form-status ${type} visible`;
}

function hideStatus() {
  const statusEl = document.getElementById('formStatus');
  if (statusEl) {
    statusEl.classList.remove('visible');
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// ==========================================
// KEYBOARD SHORTCUTS
// ==========================================
document.addEventListener('keydown', (e) => {
  // ESC to close mobile nav
  if (e.key === 'Escape') {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (hamburger && navLinks && navLinks.classList.contains('open')) {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    }
  }
});
