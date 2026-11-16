/**
 * STACKLY — Global Master Script
 * File: js/main.js
 */

const STACKLY_MAIN = (function () {
  // 1. Toast Notification Manager
  function showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = `
      <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="16" x2="12" y2="12"></line>
        <line x1="12" y1="8" x2="12.01" y2="8"></line>
      </svg>
    `;

    if (type === 'success') {
      iconSvg = `
        <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;
    } else if (type === 'error') {
      iconSvg = `
        <svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      `;
    }

    toast.innerHTML = `
      ${iconSvg}
      <span class="toast-msg">${message}</span>
    `;

    container.appendChild(toast);

    // Trigger entrance
    setTimeout(() => toast.classList.add('show'), 50);

    // Auto remove
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 400);
    }, 3800);
  }

  // 2. Navigation & Header
  function initNavigation() {
    const header = document.querySelector('.site-header');
    const hamburger = document.getElementById('hamburger-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const backdrop = document.getElementById('nav-backdrop');

    // Sticky scroll
    if (header) {
      window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
          header.classList.add('scrolled');
        } else {
          header.classList.remove('scrolled');
        }
      }, { passive: true });
    }

    // Mobile Hamburger
    if (hamburger && mobileNav) {
      hamburger.addEventListener('click', () => {
        const isOpen = mobileNav.classList.contains('is-open');
        if (isOpen) {
          closeMobileNav();
        } else {
          openMobileNav();
        }
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => {
        closeMobileNav();
        if (window.STACKLY_CART) window.STACKLY_CART.closeCartDrawer();
      });
    }

    function openMobileNav() {
      if (mobileNav) mobileNav.classList.add('is-open');
      if (hamburger) hamburger.classList.add('is-active');
      if (backdrop) backdrop.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }

    function closeMobileNav() {
      if (mobileNav) mobileNav.classList.remove('is-open');
      if (hamburger) hamburger.classList.remove('is-active');
      if (backdrop && !document.getElementById('cart-drawer')?.classList.contains('is-open')) {
        backdrop.classList.remove('is-active');
      }
      document.body.style.overflow = '';
    }

    // Set active link based on current page
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // 3. Search Modal
  function openSearchModal() {
    const modal = document.getElementById('search-modal');
    if (modal) {
      modal.classList.add('is-open');
      const input = document.getElementById('global-search-input');
      if (input) {
        input.value = '';
        setTimeout(() => input.focus(), 150);
      }
      handleSearchQuery('');
    }
  }

  function closeSearchModal() {
    const modal = document.getElementById('search-modal');
    if (modal) modal.classList.remove('is-open');
  }

  function handleSearchQuery(query) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer || !window.STACKLY_PRODUCTS) return;

    const filtered = window.STACKLY_PRODUCTS.filterProducts({ search: query });

    if (filtered.length === 0) {
      resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 2rem; color: var(--color-muted);">
          <p>No eyewear found matching "${query}".</p>
        </div>
      `;
      return;
    }

    resultsContainer.innerHTML = filtered.slice(0, 6).map(product => `
      <div class="search-result-item" onclick="STACKLY_MAIN.openQuickView('${product.id}'); STACKLY_MAIN.closeSearchModal();">
        <img src="${product.image}" alt="${product.name}" class="search-result-img" />
        <div class="search-result-info">
          <h4>${product.name}</h4>
          <p>$${product.price} · <span style="color: var(--color-muted); font-weight: 400;">${product.category}</span></p>
        </div>
      </div>
    `).join('');
  }

  // 4. Quick View Modal
  function openQuickView(productId) {
    const modal = document.getElementById('quickview-modal');
    if (!modal || !window.STACKLY_PRODUCTS) return;

    const product = window.STACKLY_PRODUCTS.getProductById(productId);
    if (!product) return;

    const modalBody = document.getElementById('quickview-modal-body');
    if (!modalBody) return;

    modalBody.innerHTML = `
      <div class="quickview-img-side" style="display: flex; align-items: center; justify-content: center; background: var(--color-bg); border-radius: var(--radius-sm); overflow: hidden;">
        <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;" />
      </div>
      <div class="quickview-details-side" style="display: flex; flex-direction: column; justify-content: center;">
        <span class="eyebrow">${product.category} · ${product.gender}</span>
        <h2 style="font-size: 1.8rem; margin-bottom: 0.8rem;">${product.name}</h2>
        <div style="display: flex; align-items: baseline; gap: 0.8rem; margin-bottom: 1.2rem;">
          <span style="font-size: 1.5rem; font-weight: 700; color: var(--color-primary);">$${product.price}</span>
          ${product.originalPrice ? `<span style="font-size: 1rem; color: var(--color-muted-light); text-decoration: line-through;">$${product.originalPrice}</span>` : ''}
          <span style="font-size: 0.85rem; color: var(--color-accent-gold-dark); font-weight: 600; margin-left: 0.5rem;">★ ${product.rating} (${product.reviewsCount} reviews)</span>
        </div>
        <p style="color: var(--color-muted); font-size: 0.95rem; line-height: 1.7; margin-bottom: 1.5rem;">${product.description}</p>
        
        <div style="margin-bottom: 1.5rem; border-top: 1px solid var(--color-border); padding-top: 1rem;">
          <div style="font-size: 0.8rem; text-transform: uppercase; font-weight: 700; color: var(--color-primary); margin-bottom: 0.5rem;">Technical Specifications:</div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.4rem; font-size: 0.85rem; color: var(--color-muted);">
            <div><strong>Frame:</strong> ${product.specs.frameWidth}</div>
            <div><strong>Lens:</strong> ${product.specs.lensWidth}</div>
            <div><strong>Bridge:</strong> ${product.specs.bridgeWidth}</div>
            <div><strong>Material:</strong> ${product.specs.material}</div>
          </div>
        </div>

        <div style="display: flex; gap: 1rem; align-items: center;">
          <button class="btn btn-primary" style="flex: 1;" onclick="window.STACKLY_CART && window.STACKLY_CART.addToCart('${product.id}', 1); STACKLY_MAIN.closeQuickView();">
            Add To Cart · $${product.price}
          </button>
          <button class="card-action-btn" style="width: 46px; height: 46px;" onclick="window.STACKLY_WISHLIST && window.STACKLY_WISHLIST.toggleWishlist('${product.id}', this)" aria-label="Save to Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="${window.STACKLY_WISHLIST && window.STACKLY_WISHLIST.isInWishlist(product.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeQuickView() {
    const modal = document.getElementById('quickview-modal');
    if (modal) modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  // 5. Global Keyboard handlers
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeSearchModal();
      closeQuickView();
      if (window.STACKLY_CART) {
        window.STACKLY_CART.closeCartDrawer();
        window.STACKLY_CART.closeCheckoutDemo();
      }
    }
  });

  // 6. Newsletter Submission
  function handleNewsletterSubmit(e) {
    if (e) e.preventDefault();
    const input = e.target.querySelector('input[type="email"]');
    if (input && input.value) {
      showToast(`Thank you! Subscription confirmed for ${input.value}`, 'success');
      input.value = '';
    } else {
      showToast('Please enter a valid email address', 'error');
    }
  }

  // 7. Go Back safe history fallback
  function goBackSafe() {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = 'index.html';
    }
  }

  // Initialize on DOM load
  document.addEventListener('DOMContentLoaded', () => {
    initNavigation();

    // Attach search input event listener
    const searchInput = document.getElementById('global-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        handleSearchQuery(e.target.value);
      });
    }

    // Attach newsletter forms
    document.querySelectorAll('.newsletter-form-inline, .newsletter-form-large').forEach(form => {
      form.addEventListener('submit', handleNewsletterSubmit);
    });
  });

  return {
    showToast,
    openSearchModal,
    closeSearchModal,
    openQuickView,
    closeQuickView,
    goBackSafe
  };
})();

window.STACKLY_MAIN = STACKLY_MAIN;
