document.addEventListener('DOMContentLoaded', function() {
  if (typeof gsap === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);
  if (typeof ScrollToPlugin !== 'undefined') gsap.registerPlugin(ScrollToPlugin);

  // Se o usuário ativou reduced-motion (comum em celulares com economia de bateria),
  // mostra tudo imediatamente sem animações e encerra — evita tela em branco.
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    gsap.set(
      '.hero-badge, .title-line, .hero-subtitle, .hero-ctas, .hero-proof, .hero-visual, .hero-stats .stat-item, [data-gsap]',
      { opacity: 1, y: 0, x: 0, scale: 1, clearProps: 'all' }
    );
    return;
  }

  // ── 1. HERO ANIMATIONS (on load) ──
  var heroFallbackTimer;
  var heroTimeline = gsap.timeline({
    delay: 0.2,
    onComplete: function() { clearTimeout(heroFallbackTimer); }
  });

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

  // Fallback: se animações travarem no mobile (throttling do browser), força visibilidade
  heroFallbackTimer = setTimeout(function() {
    gsap.set('.hero-badge, .title-line, .hero-subtitle, .hero-ctas, .hero-proof, .hero-visual, .hero-stats .stat-item', { clearProps: 'all' });
    gsap.set('[data-gsap]', { clearProps: 'all' });
  }, 2000);

  // ── 2. FLOATING BADGES ──
  document.querySelectorAll('[data-float]').forEach(function(badge) {
    var speed = badge.dataset.float === 'slow' ? 3 :
                badge.dataset.float === 'medium' ? 2 : 1.5;
    gsap.to(badge, {
      y: -12,
      duration: speed,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1
    });
  });

  // ── 3. SCROLL REVEAL GENÉRICO (data-gsap) ──
  gsap.utils.toArray('[data-gsap]').forEach(function(el) {
    var type = el.dataset.gsap;
    var delay = parseFloat(el.dataset.delay || 0);
    var fromVars = { opacity: 0, duration: 0.9, delay: delay, ease: 'power3.out' };

    if (type === 'fade-up')     { fromVars.y = 50; }
    if (type === 'fade-down')   { fromVars.y = -50; }
    if (type === 'slide-left')  { fromVars.x = -50; }
    if (type === 'slide-right') { fromVars.x = 50; }
    if (type === 'scale-in')    { fromVars.scale = 0.92; }

    gsap.from(el, Object.assign({}, fromVars, {
      scrollTrigger: {
        trigger: el,
        start: 'top 90%',
        toggleActions: 'play none none none',
        once: true
      }
    }));
  });

  // ── 4. METODOLOGIA: anima os dois cards pelo container ──
  // Usar o container como trigger evita o bug onde overflow-x:hidden
  // corta o card da direita enquanto ele está translateX(60px)
  var metodologiaSplit = document.getElementById('metodologia-split');
  if (metodologiaSplit) {
    var cardLeft  = metodologiaSplit.querySelector('.metodo-card-left');
    var cardRight = metodologiaSplit.querySelector('.metodo-card-right');

    if (cardLeft) {
      gsap.from(cardLeft, {
        x: -60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: metodologiaSplit,
          start: 'top 85%',
          once: true
        }
      });
    }

    if (cardRight) {
      gsap.from(cardRight, {
        x: 60,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: metodologiaSplit,
          start: 'top 85%',
          once: true
        }
      });
    }
  }

  // ── 5. JORNADA: anima todos os steps pelo container ──
  // Usar o container garante que todos os steps animem mesmo
  // quando múltiplos já estão visíveis no viewport
  var jornadaContainer = document.getElementById('jornada-timeline');
  if (jornadaContainer) {
    var steps = jornadaContainer.querySelectorAll('.timeline-step');
    if (steps.length > 0) {
      gsap.from(steps, {
        y: 40,
        opacity: 0,
        duration: 0.7,
        stagger: 0.18,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: jornadaContainer,
          start: 'top 85%',
          once: true
        }
      });
    }

    var connectors = jornadaContainer.querySelectorAll('.timeline-connector');
    if (connectors.length > 0) {
      gsap.from(connectors, {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 0.6,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: jornadaContainer,
          start: 'top 85%',
          once: true
        }
      });
    }
  }

  // ── 6. COUNTER ANIMATION ──
  // Usa IntersectionObserver em vez de ScrollTrigger porque os contadores ficam
  // no hero (sempre visíveis ao carregar). Em PCs lentos, o ScrollTrigger pode
  // não disparar onEnter para elementos já no viewport quando inicializa.
  // O IntersectionObserver é nativo do browser e detecta isso de forma confiável.
  function animateCounter(counter) {
    if (counter.dataset.animated) return;
    counter.dataset.animated = '1';
    var target = parseInt(counter.dataset.target);
    var obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: 2.5,
      ease: 'power2.out',
      onUpdate: function() {
        counter.innerHTML = Math.floor(obj.val);
      }
    });
  }

  var counterEls = document.querySelectorAll('.counter[data-target]');

  if ('IntersectionObserver' in window) {
    var counterObserver = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    counterEls.forEach(function(counter) { counterObserver.observe(counter); });
  } else {
    counterEls.forEach(function(counter) {
      ScrollTrigger.create({
        trigger: counter,
        start: 'top 90%',
        once: true,
        onEnter: function() { animateCounter(counter); }
      });
    });
  }

  // ── 7. PARALLAX GLOWS ──
  gsap.utils.toArray('.glow').forEach(function(glow, i) {
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

  // ── 8. HERO IMAGE PARALLAX ──
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

  // ── 9. SOBRE GRID ──
  // ── 9. SOBRE GRID: anima pelo container para evitar conflito ──
  var sobreGrid = document.querySelector('.sobre-grid');
  if (sobreGrid) {
    var sobreItems = sobreGrid.querySelectorAll('.sobre-visual, .sobre-content');
    if (sobreItems.length > 0) {
      gsap.from(sobreItems, {
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: { trigger: sobreGrid, start: 'top 85%', once: true }
      });
    }
  }

  // ── 10. PLAN CARDS 3D TILT ──
  document.querySelectorAll('.plan-card').forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var rotateX = (e.clientY - rect.top - rect.height / 2) / 18;
      var rotateY = (rect.left + rect.width / 2 - e.clientX) / 18;
      gsap.to(card, { rotateX: rotateX, rotateY: rotateY, transformPerspective: 1000, duration: 0.3, ease: 'power1.out' });
    });
    card.addEventListener('mouseleave', function() {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.5, ease: 'power2.out' });
    });
  });

});

