/* ==========================================
   INTERACTIONS.JS - Easter Egg Bug & Mobile Menu
   ========================================== */

// Mobile navigation drawer toggle (exposed globally for HTML onclick inline attributes)
function toggleNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (hamburger && navLinks) {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Mobile Links drawer close hooks
  const sidebarLinks = document.querySelectorAll('#navLinks a');
  sidebarLinks.forEach(link => {
    link.addEventListener('click', () => {
      const hamburger = document.getElementById('hamburger');
      const navLinks = document.getElementById('navLinks');
      if (hamburger && navLinks) {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      }
    });
  });

  // Spotlight easter egg components initialization
  const spotlightZone = document.getElementById('spotlightZone');
  const spotlightHidden = document.getElementById('spotlightHidden');
  const spotlightMask = document.getElementById('spotlightMask');
  const bugWrapper = document.getElementById('bugWrapper');
  const bugSvg = document.getElementById('bugSvg');
  const spotlightContent = document.getElementById('spotlightContent');

  if (spotlightZone && spotlightMask && bugWrapper && bugSvg && spotlightContent) {
    let startled = false;
    let calmTimeout = null;

    spotlightMask.addEventListener('mousemove', (e) => {
      // Calculate cursor coordinates relative to spotlightZone container
      const rect = spotlightZone.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Spotlight Reveal radius mask adjustment
      const radius = 210; 
      const maskStr = `radial-gradient(circle ${radius}px at ${x}px ${y}px, black 60%, transparent 100%)`;
      spotlightHidden.style.webkitMaskImage = maskStr;
      spotlightHidden.style.maskImage = maskStr;

      // Realtime viewport center calculations of target SVG
      const bugRect = bugSvg.getBoundingClientRect();
      const bugCenterX = bugRect.left + bugRect.width / 2;
      const bugCenterY = bugRect.top + bugRect.height / 2;

      // Distance calculations
      const xDiff = e.clientX - bugCenterX;
      const yDiff = e.clientY - bugCenterY;
      const distance = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

      // 1. Proportional eye tracking (pupil translation direction)
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

      // 2. Proximity Reacting State Machine (Distance Threshold: 220px)
      if (distance < 220) {
        // Scared startled reaction triggers
        if (!startled) {
          startled = true;
          bugSvg.classList.add('startled');
          
          // Cinematic micro screen shake vibration
          spotlightContent.classList.add('shake-zone');
          setTimeout(() => {
            spotlightContent.classList.remove('shake-zone');
          }, 300);

          // Trigger frantic antenna wiggling
          const antennaL = bugSvg.querySelector('.antenna-left');
          const antennaR = bugSvg.querySelector('.antenna-right');
          if (antennaL && antennaR) {
            antennaL.classList.add('frantic-wiggle');
            antennaR.classList.add('frantic-wiggle');
          }
        }

        // Repel Translation (Moves away from mouse pointer)
        const repelForce = Math.max(0, (220 - distance) * 0.4); 
        const rx = -Math.cos(angle) * repelForce;
        const ry = -Math.sin(angle) * repelForce;

        // Angle rotation approach deviation
        const maxRotate = 14;
        const rotVal = (xDiff > 0 ? -1 : 1) * maxRotate * (1 - distance / 220);

        // Apply vector transform matrix
        bugWrapper.style.transform = `translate(${rx}px, ${ry}px)`;
        bugSvg.style.transform = `rotate(${rotVal}deg) scale(1.05)`;

        // Direct Touch elastic bounce (Distance < 80px)
        if (distance < 80) {
          bugSvg.classList.add('bug-hovered');
        } else {
          bugSvg.classList.remove('bug-hovered');
        }

        // Clear and reload calming trigger timeout
        clearTimeout(calmTimeout);
        calmTimeout = setTimeout(() => {
          calmDownBug();
        }, 1200);
      } else {
        // Normal cursor leaving distance
        if (startled && distance > 260) {
          calmDownBug();
        }
      }
    });

    spotlightMask.addEventListener('mouseleave', () => {
      // Instantly collapse spotlight mask render
      spotlightHidden.style.webkitMaskImage = `radial-gradient(circle 0px at -999px -999px, black 100%, transparent 100%)`;
      spotlightHidden.style.maskImage = `radial-gradient(circle 0px at -999px -999px, black 100%, transparent 100%)`;
      
      // Re-center state variables
      calmDownBug();
      
      // Reset pupil vectors
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
  }
});
