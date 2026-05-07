document.addEventListener('DOMContentLoaded', function() {

  // ── 1. SCROLL PROGRESS BAR ──
  const scrollProgress = document.getElementById('scrollProgress');

  function updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = progress + '%';
  }

  // ── 2. HEADER SCROLL EFFECT ──
  const header = document.getElementById('header');

  function updateHeader() {
    if (header) {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }
  }

  window.addEventListener('scroll', () => {
    updateScrollProgress();
    updateHeader();
  }, { passive: true });

  // Initial call
  updateScrollProgress();
  updateHeader();

  // ── 3. WHATSAPP FLOAT HOVER ──
  const whatsappBtn = document.querySelector('.whatsapp-float');
  if (whatsappBtn && typeof gsap !== 'undefined') {
    whatsappBtn.addEventListener('mouseenter', () => {
      gsap.to(whatsappBtn, { scale: 1.1, duration: 0.2 });
    });
    whatsappBtn.addEventListener('mouseleave', () => {
      gsap.to(whatsappBtn, { scale: 1, duration: 0.2 });
    });
  }

  // ── 4. REDUCED MOTION ──
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (typeof gsap !== 'undefined') {
      gsap.globalTimeline.timeScale(100);
    }
  }

  // ── 5. LAZY LOAD IMAGES ──
  if ('IntersectionObserver' in window) {
    const imgObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          imgObserver.unobserve(img);
        }
      });
    });
    document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
  }

  // ── 6. ACTIVE NAV LINK STYLE ──
  const style = document.createElement('style');
  style.textContent = '.nav-link.active-link { color: var(--gold); } .nav-link.active-link::after { width: 100%; }';
  document.head.appendChild(style);
});
