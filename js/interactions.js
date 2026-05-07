document.addEventListener('DOMContentLoaded', function() {

  // ── 1. FAQ ACCORDION ──
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.parentElement;
      const answer = item.querySelector('.faq-answer');
      const icon = question.querySelector('.faq-icon');
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.faq-item').forEach(i => {
        i.classList.remove('active');
        i.querySelector('.faq-answer').style.maxHeight = '0';
        i.querySelector('.faq-icon').textContent = '+';
      });

      if (!isOpen) {
        item.classList.add('active');
        answer.style.maxHeight = answer.scrollHeight + 'px';
        icon.textContent = '−';
      }
    });
  });

  // ── 2. HAMBURGER MOBILE MENU ──
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
    });

    document.querySelectorAll('.mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      });
    });

    document.addEventListener('click', e => {
      if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
      }
    });
  }

  // ── 3. PLANS TOGGLE ──
  const toggleBtns = document.querySelectorAll('.toggle-btn');

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      toggleBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const isTrimestral = btn.dataset.plan === 'trimestral';
      document.querySelectorAll('.price-value').forEach(price => {
        const target = isTrimestral ? price.dataset.trimestral : price.dataset.mensal;
        if (target) {
          if (typeof gsap !== 'undefined') {
            gsap.to(price, {
              opacity: 0,
              y: -8,
              duration: 0.15,
              onComplete: () => {
                price.textContent = target;
                gsap.to(price, { opacity: 1, y: 0, duration: 0.15 });
              }
            });
          } else {
            price.textContent = target;
          }
        }
      });
    });
  });

  // ── 4. SWIPER DEPOIMENTOS ──
  if (typeof Swiper !== 'undefined' && document.querySelector('.depo-swiper')) {
    new Swiper('.depo-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev'
      },
      breakpoints: {
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 }
      }
    });
  }

  // ── 5. SMOOTH SCROLL ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      e.preventDefault();
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;

      const headerH = document.getElementById('header')?.offsetHeight || 80;
      const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerH;

      if (typeof gsap !== 'undefined' && typeof ScrollToPlugin !== 'undefined') {
        gsap.to(window, { duration: 1, scrollTo: { y: targetPos }, ease: 'power3.inOut' });
      } else {
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  });

  // ── 6. ACTIVE NAV LINK ON SCROLL ──
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observerOptions = { threshold: 0.3 };
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active-link');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active-link');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => observer.observe(section));
});
