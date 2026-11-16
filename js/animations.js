/**
 * STACKLY — 3D Motion & Frontend Animation Engine
 * File: js/animations.js
 */

document.addEventListener('DOMContentLoaded', () => {
  // Check for prefers-reduced-motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Dismiss Page Loader
  const pageLoader = document.getElementById('page-loader');
  if (pageLoader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        pageLoader.classList.add('is-hidden');
        document.body.classList.add('page-loaded');
      }, 350);
    });

    // Fallback in case load already fired
    if (document.readyState === 'complete') {
      setTimeout(() => {
        pageLoader.classList.add('is-hidden');
        document.body.classList.add('page-loaded');
      }, 350);
    }
  } else {
    document.body.classList.add('page-loaded');
  }

  if (prefersReducedMotion) {
    document.querySelectorAll('.reveal, .reveal-parent, .mask-reveal').forEach(el => {
      el.classList.add('is-visible');
    });
    return;
  }

  // 2. Intersection Observer for Scroll Reveals
  const revealOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  };

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, revealOptions);

  document.querySelectorAll('.reveal, .reveal-parent, .mask-reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // 3. 3D Perspective Card Tilt on Mouse Move
  function init3DCardTilt() {
    const cards = document.querySelectorAll('.product-card');

    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  init3DCardTilt();
  // Observe DOM modifications across all product grids to re-bind cards when dynamically rendered
  document.querySelectorAll('.products-grid').forEach(grid => {
    const mo = new MutationObserver(() => init3DCardTilt());
    mo.observe(grid, { childList: true });
  });

  // 4. Subtle Parallax for Background Images
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroBg = document.querySelector('.hero-visual');
    if (heroBg && scrolled < 900) {
      heroBg.style.transform = `translateY(${scrolled * 0.08}px)`;
    }

    const campaignBg = document.querySelector('.campaign-bg-img');
    if (campaignBg) {
      const rect = campaignBg.parentElement.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        campaignBg.style.transform = `translateY(${(rect.top * -0.1)}px)`;
      }
    }
  }, { passive: true });
});
