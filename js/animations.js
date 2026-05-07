// Wait for GSAP to be available
document.addEventListener('DOMContentLoaded', function() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);

  // ── 1. HERO ANIMATIONS ──
  const heroTimeline = gsap.timeline({ delay: 0.2 });

  heroTimeline
    .from('.hero-badge', { y: 20, opacity: 0, duration: 0.6, ease: 'power3.out' })
    .from('.title-line', {
      y: 60,
      opacity: 0,
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out'
    }, '-=0.2')
    .from('.hero-subtitle', { y: 30, opacity: 0, duration: 0.6 }, '-=0.3')
    .from('.hero-ctas', { y: 20, opacity: 0, duration: 0.5 }, '-=0.2')
    .from('.hero-proof', { y: 20, opacity: 0, duration: 0.5 }, '-=0.2')
    .from('.hero-visual', { x: 60, opacity: 0, duration: 1, ease: 'power3.out' }, '-=0.8')
    .from('.hero-stats .stat-item', { y: 20, opacity: 0, stagger: 0.1, duration: 0.5 }, '-=0.3');

  // ── 2. FLOATING BADGES ──
  document.querySelectorAll('[data-float]').forEach(badge => {
    const speed = badge.dataset.float === 'slow' ? 3 :
                  badge.dataset.float === 'medium' ? 2 : 1.5;
    gsap.to(badge, {
      y: -12,
      duration: speed,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
  });

  // ── 3. SCROLL REVEAL ──
  gsap.utils.toArray('[data-gsap]').forEach(el => {
    const type = el.dataset.gsap;
    const delay = parseFloat(el.dataset.delay || 0);

    let fromVars = { opacity: 0, duration: 0.9, delay, ease: 'power3.out' };

    if (type === 'fade-up')     fromVars = { ...fromVars, y: 50 };
    if (type === 'fade-down')   fromVars = { ...fromVars, y: -50 };
    if (type === 'slide-left')  fromVars = { ...fromVars, x: -60 };
    if (type === 'slide-right') fromVars = { ...fromVars, x: 60 };
    if (type === 'scale-in')    fromVars = { ...fromVars, scale: 0.92 };

    gsap.from(el, {
      ...fromVars,
      scrollTrigger: {
        trigger: el,
        start: 'top 82%',
        toggleActions: 'play none none none'
      }
    });
  });

  // ── 4. COUNTER ANIMATION ──
  document.querySelectorAll('.counter[data-target]').forEach(counter => {
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        const target = parseInt(counter.dataset.target);
        gsap.to({ val: 0 }, {
          val: target,
          duration: 2.5,
          ease: 'power2.out',
          onUpdate: function() {
            counter.innerHTML = Math.floor(this.targets()[0].val);
          }
        });
      }
    });
  });

  // ── 5. PARALLAX GLOWS ──
  gsap.utils.toArray('.glow').forEach((glow, i) => {
    gsap.to(glow, {
      y: i % 2 === 0 ? -80 : 80,
      ease: 'none',
      scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.5
      }
    });
  });

  // ── 6. HERO IMAGE PARALLAX ──
  if (document.querySelector('.hero-image')) {
    gsap.to('.hero-image', {
      y: 40,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  // ── 7. PLAN CARDS 3D TILT ──
  document.querySelectorAll('.plan-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 18;
      const rotateY = (centerX - x) / 18;

      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        duration: 0.3,
        ease: 'power1.out'
      });
    });

    card.addEventListener('mouseleave', () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: 'power2.out'
      });
    });
  });

  // ── 8. TIMELINE CONNECTORS ──
  gsap.from('.timeline-connector', {
    scaleY: 0,
    transformOrigin: 'top',
    stagger: 0.3,
    duration: 0.6,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.timeline',
      start: 'top 70%',
      toggleActions: 'play none none none'
    }
  });

  // ── 9. SECTION LABELS ──
  gsap.utils.toArray('.section-label').forEach(label => {
    gsap.from(label, {
      x: -20,
      opacity: 0,
      duration: 0.6,
      scrollTrigger: {
        trigger: label,
        start: 'top 85%'
      }
    });
  });

  // ── 10. GLASS CARDS STAGGER ──
  const cardGroups = document.querySelectorAll('.metodologia-split, .sobre-list, .timeline');
  cardGroups.forEach(group => {
    const cards = group.querySelectorAll('.glass-card, li');
    if (cards.length > 1) {
      gsap.from(cards, {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: group,
          start: 'top 80%'
        }
      });
    }
  });
});
