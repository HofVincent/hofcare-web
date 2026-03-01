/* ═══════════════════════════════════════════════════════════════
   HofCare Capital — Main JS
   ═══════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  // ── STICKY NAV ──────────────────────────────────────────────
  const nav = document.getElementById('nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('nav--scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ── MOBILE HAMBURGER ────────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      navLinks.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', open);
    });
    // Close on link click
    navLinks.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
      });
    });
  }

  // ── SCROLL ANIMATIONS ───────────────────────────────────────
  const animateEls = document.querySelectorAll('.animate-up');
  if (animateEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    animateEls.forEach(el => observer.observe(el));
  }

  // ── FAQ ACCORDION ────────────────────────────────────────────
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer   = item.querySelector('.faq-answer');
    const inner    = item.querySelector('.faq-answer__inner');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      // Close all
      faqItems.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer');
        if (a) a.style.maxHeight = '0';
      });
      // Open this one if it was closed
      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = inner.scrollHeight + 'px';
      }
    });
  });

  // ── ACTIVE NAV LINK ──────────────────────────────────────────
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav__links a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });

  // ── ANIMATED STATS COUNTER ──────────────────────────────────
  // Triggers when the stats bar enters the viewport
  const statNums = document.querySelectorAll('.stat__num[data-target]');
  if (statNums.length) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el     = entry.target;
        const target = +el.dataset.target;
        const prefix = el.dataset.prefix || '';
        const suffix = el.dataset.suffix || '';
        const duration = 1200; // ms
        const step     = 16;   // ~60fps
        const steps    = Math.round(duration / step);
        let current    = 0;
        const inc      = target / steps;
        const timer = setInterval(() => {
          current += inc;
          if (current >= target) {
            clearInterval(timer);
            el.textContent = prefix + target + suffix;
          } else {
            el.textContent = prefix + Math.round(current) + suffix;
          }
        }, step);
        statsObserver.unobserve(el);
      });
    }, { threshold: 0.5 });

    statNums.forEach(el => statsObserver.observe(el));
  }


  // ── CAL.COM INTEGRATION ──────────────────────────────────────
  (function (C, A, L) {
    let p = function (a, ar) { a.q.push(ar); };
    let d = C.document;
    C.Cal = C.Cal || function () { let cal = C.Cal; let ar = arguments;
      if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || [];
        d.head.appendChild(d.createElement("script")).src = A;
        cal.loaded = true; }
      if (ar[0] === L) { const api = function () { p(api, arguments); };
        const namespace = ar[1]; api.q = api.q || [];
        typeof namespace === "string" ? (cal.ns[namespace] = api) && p(api, ar) : p(cal, ar);
        return; }
      p(cal, ar);
    };
  })(window, "https://app.cal.com/embed/embed.js", "init");

  Cal("init", { origin: "https://cal.eu" });

  Cal("ui", {
    theme: "light",
    styles: { branding: { brandColor: "#0B1F3A" } },
    hideEventTypeDetails: false,
  });

});
