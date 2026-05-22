/* ==========================================
   ANIMATIONS.JS - Scroll Reveals & Highlighters
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
  // IntersectionObserver for staggered scrolling reveals
  const reveals = document.querySelectorAll('.reveal');
  
  if (reveals.length > 0) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.05,
      rootMargin: '0px 0px -50px 0px' // Pre-reveals slightly before viewport exit
    });

    reveals.forEach(el => revealObserver.observe(el));
    
    // Safety fallback: Reveal everything if page loaded fully after 2s
    setTimeout(() => { 
      reveals.forEach(el => el.classList.add('visible')); 
    }, 2000);
  }

  // Active Navigation link highlight based on window scroll offset
  const sections = document.querySelectorAll('section');
  const navLinks = document.querySelectorAll('#navLinks a');

  if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener('scroll', () => {
      let currentSectionId = '';
      const scrollPosition = window.scrollY + 120; // Shifted trigger offset for natural snapping

      sections.forEach(sec => {
        if (scrollPosition >= sec.offsetTop) {
          currentSectionId = sec.id;
        }
      });

      navLinks.forEach(link => {
        const targetHref = link.getAttribute('href');
        const isActive = targetHref === '#' + currentSectionId;
        
        link.classList.toggle('active', isActive);
        // Clean dynamic CSS overrides
        link.style.color = '';
      });
    });
  }
});
