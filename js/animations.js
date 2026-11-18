/**
 * STACKLY — Master Animation & Motion Design Engine
 * File: js/animations.js
 * Architecture: Recreating Sandhiya's Coffee Shop Motion & GSAP Architecture
 */

(function () {
  'use strict';

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Add initial loading class to root if not already added
  root.classList.add('js', 'page-loading');

  /* ==========================================================================
     1. PRELOADER (EYEWEAR-INSPIRED ATELIER LOADING EXPERIENCE)
     ========================================================================== */
  (function initPreloader() {
    var el = document.getElementById('page-loader');
    if (!el) {
      root.classList.remove('page-loading');
      document.body.classList.add('page-loaded');
      return;
    }

    // Enhance preloader inner markup if simple spinner was present
    if (!el.querySelector('.page-loader-in')) {
      var existingText = el.querySelector('.loader-text');
      var label = existingText ? existingText.textContent.trim() : 'STACKLY · ATELIER';

      el.innerHTML = [
        '<div class="page-loader-in" role="status" aria-live="polite" aria-label="Loading STACKLY Atelier">',
        '  <div class="loader-eyewear-emblem" aria-hidden="true">',
        '    <svg class="loader-glasses-svg" viewBox="0 0 100 40" fill="none" stroke="currentColor">',
        '      <circle cx="28" cy="20" r="13" stroke="currentColor" stroke-width="2" />',
        '      <circle cx="72" cy="20" r="13" stroke="currentColor" stroke-width="2" />',
        '      <path d="M41 18 Q50 14 59 18" stroke="currentColor" stroke-width="2" fill="none" />',
        '      <path d="M15 18 L5 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />',
        '      <path d="M85 18 L95 16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />',
        '      <circle class="lens-glint lens-glint-1" cx="24" cy="16" r="2.5" fill="currentColor" />',
        '      <circle class="lens-glint lens-glint-2" cx="68" cy="16" r="2.5" fill="currentColor" />',
        '    </svg>',
        '    <span class="loader-reticle-ring"></span>',
        '  </div>',
        '  <img src="./images/logo-dark.webp" alt="STACKLY" class="loader-logo-img" />',
        '  <span class="loader-text">' + label + '</span>',
        '  <span class="loader-progress-bar" aria-hidden="true"><i></i></span>',
        '</div>'
      ].join('');
    }

    var MIN = 1100;
    var MAX = 2200;
    var t0 = Date.now();
    var done = false;

    function hide() {
      if (done) return;
      done = true;
      root.classList.remove('page-loading');
      document.body.classList.add('page-loaded');
      el.classList.add('is-done');
      el.setAttribute('aria-hidden', 'true');

      // Trigger GSAP Navbar & Hero entrance right as preloader clears
      setTimeout(function () {
        triggerHeaderEntrance();
        if (el.parentNode) {
          el.parentNode.removeChild(el);
        }
      }, 750);
    }

    function ready() {
      if (reduceMotion) {
        hide();
        return;
      }
      var elapsed = Date.now() - t0;
      var wait = Math.max(0, MIN - elapsed);
      setTimeout(hide, wait);
    }

    if (document.readyState === 'complete') {
      ready();
    } else {
      window.addEventListener('load', ready);
    }

    setTimeout(hide, MAX);
  })();

  /* ==========================================================================
     2. LENIS SMOOTH MOMENTUM SCROLLING
     ========================================================================== */
  (function initLenis() {
    if (!window.Lenis || reduceMotion) return;

    try {
      var lenis = new window.Lenis({
        duration: 1.15,
        easing: function (t) {
          return Math.min(1, 1.001 - Math.pow(2, -10 * t));
        },
        smoothWheel: true,
        anchors: true,
        autoRaf: true
      });

      window.stacklyLenis = lenis;

      if (window.ScrollTrigger) {
        lenis.on('scroll', window.ScrollTrigger.update);
      }
    } catch (e) {
      console.warn('Lenis scroll error:', e);
    }
  })();

  /* ==========================================================================
     3. NAVBAR ENTRANCE ANIMATION & STICKY SCROLL
     ========================================================================== */
  function triggerHeaderEntrance() {
    if (!window.gsap || reduceMotion) return;

    var headerItems = document.querySelectorAll(
      '.site-header .nav-logo, .site-header .nav-links > a, .site-header .nav-actions > *'
    );

    if (headerItems.length) {
      window.gsap.from(headerItems, {
        y: -12,
        autoAlpha: 0,
        duration: 0.55,
        stagger: 0.05,
        ease: 'power2.out',
        delay: 0.1,
        clearProps: 'transform,opacity,visibility'
      });
    }
  }

  (function initStickyNavbar() {
    var header = document.querySelector('.site-header');
    function onScroll() {
      if (header) {
        header.classList.toggle('scrolled', window.scrollY > 40);
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ==========================================================================
     4. EDITORIAL GSAP HEADLINE WORD STAGGER (COFFEE SHOP SIGNATURE REVEAL)
     ========================================================================== */
  (function initWordStagger() {
    if (!window.gsap || reduceMotion) return;

    var gsap = window.gsap;
    var selector = 'main section h2, main section h3, footer h2, footer h3, footer h4';
    var skip = '.site-header, .hero-headline, [aria-hidden="true"], .search-modal, .quickview-modal, .checkout-modal';

    var headings = Array.prototype.slice.call(document.querySelectorAll(selector)).filter(function (h) {
      return !h.closest(skip);
    });

    if (!headings.length) return;

    function splitIntoWords(heading) {
      var walker = document.createTreeWalker(heading, NodeFilter.SHOW_TEXT, {
        acceptNode: function (node) {
          return node.nodeValue && node.nodeValue.trim()
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      });
      var textNodes = [];
      while (walker.nextNode()) textNodes.push(walker.currentNode);

      var words = [];
      textNodes.forEach(function (node) {
        var fragment = document.createDocumentFragment();
        node.nodeValue.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            fragment.appendChild(document.createTextNode(part));
          } else {
            var mask = document.createElement('span');
            var word = document.createElement('span');
            mask.className = 'ey-stagger-mask';
            word.className = 'ey-stagger-word';
            word.textContent = part;
            mask.appendChild(word);
            fragment.appendChild(mask);
            words.push(word);
          }
        });
        node.parentNode.replaceChild(fragment, node);
      });
      return words;
    }

    function profile(heading) {
      var big = heading.tagName === 'H2';
      return big
        ? { duration: 0.95, stagger: 0.065, ease: 'power4.out', from: 125 }
        : { duration: 0.72, stagger: 0.045, ease: 'power3.out', from: 110 };
    }

    function finish(heading, words) {
      gsap.set(words, { clearProps: 'transform,willChange' });
      heading.classList.add('is-revealed');
    }

    function reveal(heading, words, instant) {
      if (instant) {
        finish(heading, words);
        return;
      }
      var p = profile(heading);
      gsap.to(words, {
        yPercent: 0,
        rotate: 0,
        duration: p.duration,
        stagger: p.stagger,
        ease: p.ease,
        overwrite: 'auto',
        onComplete: function () {
          finish(heading, words);
        }
      });
    }

    var items = [];
    headings.forEach(function (heading) {
      if (heading.dataset.staggerReady === 'true') return;
      heading.dataset.staggerReady = 'true';
      var words = splitIntoWords(heading);
      if (!words.length) return;

      var p = profile(heading);
      gsap.set(words, { yPercent: p.from, rotate: 3.5, transformOrigin: '0% 100%' });
      items.push({ heading: heading, words: words });
    });

    if (!items.length) return;

    function observe() {
      if (!('IntersectionObserver' in window)) {
        items.forEach(function (it) {
          finish(it.heading, it.words);
        });
        return;
      }

      var byEl = new Map();
      items.forEach(function (it) {
        byEl.set(it.heading, it);
      });

      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            var it = byEl.get(entry.target);
            if (!it) return;
            if (entry.isIntersecting) {
              byEl.delete(entry.target);
              io.unobserve(entry.target);
              reveal(it.heading, it.words, false);
            } else if (entry.boundingClientRect.bottom < 0) {
              byEl.delete(entry.target);
              io.unobserve(entry.target);
              reveal(it.heading, it.words, true);
            }
          });
        },
        { threshold: 0, rootMargin: '0px 0px -8% 0px' }
      );

      items.forEach(function (it) {
        io.observe(it.heading);
      });

      // Sweep check for elements already above/in viewport
      var ticking = false;
      function sweep() {
        ticking = false;
        if (!byEl.size) {
          window.removeEventListener('scroll', onScroll);
          window.removeEventListener('resize', onScroll);
          return;
        }
        var vh = window.innerHeight;
        var atBottom = vh + window.pageYOffset >= document.documentElement.scrollHeight - 4;
        byEl.forEach(function (it, el) {
          var r = el.getBoundingClientRect();
          if (!r.width && !r.height) return;
          if (r.bottom < 0) {
            byEl.delete(el);
            io.unobserve(el);
            reveal(it.heading, it.words, true);
          } else if (atBottom && r.top < vh) {
            byEl.delete(el);
            io.unobserve(el);
            reveal(it.heading, it.words, false);
          }
        });
      }

      function onScroll() {
        if (!ticking) {
          ticking = true;
          window.requestAnimationFrame(sweep);
        }
      }

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      sweep();
    }

    if (!root.classList.contains('page-loading')) {
      observe();
    } else {
      var mo = new MutationObserver(function () {
        if (root.classList.contains('page-loading')) return;
        mo.disconnect();
        setTimeout(observe, 100);
      });
      mo.observe(root, { attributes: true, attributeFilter: ['class'] });
    }
  })();

  /* ==========================================================================
     5. HERO SECTION ENHANCEMENT (VISUAL AMBIENCE & STAGGER DELAYS)
     ========================================================================== */
  (function initHeroSection() {
    var hero = document.querySelector('.hero-section');
    if (!hero) return;

    var heroVisual = hero.querySelector('.hero-visual');
    if (heroVisual) {
      if (!heroVisual.querySelector('.hero-ambient-glow')) {
        var glow = document.createElement('div');
        glow.className = 'hero-ambient-glow';
        glow.setAttribute('aria-hidden', 'true');
        heroVisual.prepend(glow);
      }
      if (!heroVisual.querySelector('.hero-reticle-ring')) {
        var ring = document.createElement('div');
        ring.className = 'hero-reticle-ring';
        ring.setAttribute('aria-hidden', 'true');
        heroVisual.prepend(ring);
      }
    }

    // Ensure hero scroll indicator exists
    if (!hero.querySelector('.hero-scroll-indicator')) {
      var scrollLine = document.createElement('div');
      scrollLine.className = 'hero-scroll-indicator';
      scrollLine.setAttribute('aria-hidden', 'true');
      hero.appendChild(scrollLine);
    }

    // Set animated stagger classes on hero content elements
    var heroContent = hero.querySelector('.hero-content');
    if (heroContent) {
      var children = [].slice.call(heroContent.children);
      var delays = ['0.06s', '0.18s', '0.32s', '0.46s', '0.62s'];
      children.forEach(function (child, i) {
        if (!child.classList.contains('ey-anim')) {
          child.classList.add('ey-anim');
          child.style.setProperty('--d', delays[i] || (0.12 * i + 's'));
        }
      });
    }
  })();

  /* ==========================================================================
     6. SCROLL REVEAL OBSERVER FOR CARDS & EDITORIAL SECTIONS
     ========================================================================== */
  (function initScrollReveals() {
    var items = [].slice.call(
      document.querySelectorAll(
        '.reveal, .reveal-parent, .mask-reveal, .category-card, .stagger-item, .editorial-grid, .service-card, .journal-card'
      )
    );

    function showAll() {
      items.forEach(function (el) {
        el.classList.add('is-visible', 'in');
      });
    }

    if (reduceMotion) {
      showAll();
      return;
    }

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (en) {
            if (en.isIntersecting) {
              en.target.classList.add('is-visible', 'in');
              io.unobserve(en.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      items.forEach(function (el) {
        io.observe(el);
      });

      // Safety timeout to ensure all items reveal
      setTimeout(showAll, 4500);
    } else {
      showAll();
    }
  })();

  /* ==========================================================================
     7. 3D PERSPECTIVE CARD TILT ON MOUSEMOVE
     ========================================================================== */
  function init3DCardTilt() {
    if (reduceMotion) return;
    var cards = document.querySelectorAll('.product-card, .category-card, .hero-floating-card');

    cards.forEach(function (card) {
      if (card.dataset.tiltBound === 'true') return;
      card.dataset.tiltBound = 'true';

      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = e.clientX - rect.left;
        var y = e.clientY - rect.top;
        var centerX = rect.width / 2;
        var centerY = rect.height / 2;

        var rotateX = ((y - centerY) / centerY) * -6;
        var rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform =
          'perspective(1000px) rotateX(' +
          rotateX.toFixed(2) +
          'deg) rotateY(' +
          rotateY.toFixed(2) +
          'deg) translateY(-8px)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }

  init3DCardTilt();

  // MutationObserver on product grids for dynamic rendering
  document.querySelectorAll('.products-grid, #bestsellers-grid, #new-arrivals-grid').forEach(function (grid) {
    var mo = new MutationObserver(function () {
      init3DCardTilt();
    });
    mo.observe(grid, { childList: true });
  });

  /* ==========================================================================
     8. SUBTLE PARALLAX ON SCROLL ([data-parallax], banners, visual images)
     ========================================================================== */
  (function initParallax() {
    if (reduceMotion) return;
    var ticking = false;

    function updateParallax() {
      ticking = false;
      var vh = window.innerHeight;

      // 1. Hero visual image
      var heroVisual = document.querySelector('.hero-visual');
      if (heroVisual && window.scrollY < vh) {
        heroVisual.style.transform = 'translate3d(0, ' + (window.scrollY * 0.06).toFixed(1) + 'px, 0)';
      }

      // 2. Page hero backgrounds
      var pageHeroBg = document.querySelector('.page-hero-bg');
      if (pageHeroBg && window.scrollY < vh) {
        pageHeroBg.style.transform = 'translate3d(0, ' + (window.scrollY * 0.12).toFixed(1) + 'px, 0)';
      }

      // 3. Campaign Banner or Editorial Images
      var campaignBg = document.querySelector('.campaign-bg-img');
      if (campaignBg && campaignBg.parentElement) {
        var rect = campaignBg.parentElement.getBoundingClientRect();
        if (rect.top < vh && rect.bottom > 0) {
          var progress = (rect.top + rect.height / 2 - vh / 2);
          campaignBg.style.transform = 'translate3d(0, ' + (progress * -0.08).toFixed(1) + 'px, 0)';
        }
      }

      // 4. Any elements with [data-parallax]
      var parallaxElements = document.querySelectorAll('[data-parallax]');
      parallaxElements.forEach(function (el) {
        var parent = el.parentElement || el;
        var r = parent.getBoundingClientRect();
        if (r.top < vh && r.bottom > 0) {
          var strength = parseFloat(el.getAttribute('data-parallax')) || 0.08;
          var prog = (r.top + r.height / 2 - vh / 2);
          el.style.transform = 'translate3d(0, ' + (prog * strength).toFixed(1) + 'px, 0)';
        }
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(updateParallax);
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
  })();

  /* ==========================================================================
     9. TESTIMONIALS INTERACTIVE CAROUSEL & TRANSITIONS
     ========================================================================== */
  (function initTestimonials() {
    var testimonialsGrid = document.querySelector('.testimonials-grid');
    if (!testimonialsGrid) return;

    var cards = [].slice.call(testimonialsGrid.querySelectorAll('.testimonial-card'));
    if (!cards.length) return;

    // Enhance cards with subtle stagger entrance on scroll
    cards.forEach(function (card, index) {
      card.style.transitionDelay = (index * 0.12) + 's';
    });
  })();

  /* ==========================================================================
     10. BACK TO TOP SMOOTH SCROLL (LENIS & NATIVE SUPPORT)
     ========================================================================== */
  document.addEventListener('click', function (e) {
    var btn = e.target.closest('a.back-to-top, a[href="#top"], .cf-top');
    if (!btn) return;
    e.preventDefault();

    if (window.stacklyLenis) {
      window.stacklyLenis.scrollTo(0, {
        duration: 1.2,
        easing: function (t) {
          return 1 - Math.pow(1 - t, 4);
        }
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  /* ==========================================================================
     11. RE-INITIALIZE TILT & ANIMATIONS ON DYNAMIC PAGE EVENTS
     ========================================================================== */
  window.addEventListener('stackly:productsRendered', function () {
    init3DCardTilt();
  });
})();
