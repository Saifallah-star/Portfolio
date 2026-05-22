/* ==========================================
   MAIN.JS - Setup, Forms, Typewriter, Scroll
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Decode and show real email address (prevents simple crawler harvesting)
  const emailDisplay = document.getElementById('emailDisplay');
  if (emailDisplay) {
    emailDisplay.textContent = 'saifallahbasem2' + '@' + 'gmail.com';
  }

  // EmailJS Initialization
  if (typeof emailjs !== 'undefined') {
    emailjs.init('9bUeWzRMy6z7zcwt0');
  }

  // Sticky Navbar Scroll effect
  const navbar = document.getElementById('navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
  }

  // Typing Effect for Hero Subtitle
  const heroTag = document.querySelector('.hero-tag');
  if (heroTag) {
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
  }
});

// Contact Form with EmailJS Submission
function sendMessage() {
  const nameField = document.getElementById('formName');
  const emailField = document.getElementById('formEmail');
  const msgField = document.getElementById('formMessage');

  if (!nameField || !emailField || !msgField) return;

  const name = nameField.value.trim();
  const email = emailField.value.trim();
  const msg = msgField.value.trim();

  if (!name || !email || !msg) {
    alert('Please fill in all fields.');
    return;
  }

  const btn = document.getElementById('sendBtn');
  if (!btn) return;

  btn.textContent = 'Sending...';
  btn.disabled = true;

  emailjs.send('service_ym3834h', 'template_2o8v2dd', {
    from_name: name,
    from_email: email,
    message: msg
  }).then(() => {
    const toast = document.getElementById('toast');
    if (toast) {
      toast.textContent = `Thanks ${name}! Message received ✓`;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 3000);
    }
    nameField.value = '';
    emailField.value = '';
    msgField.value = '';
    btn.textContent = 'Send Message →';
    btn.disabled = false;
  }).catch(() => {
    alert('Failed to send. Please try again or email directly.');
    btn.textContent = 'Send Message →';
    btn.disabled = false;
  });
}
