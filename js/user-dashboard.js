/**
 * STACKLY — User Portal Dashboard Manager
 * File: js/user-dashboard.js
 */

const STACKLY_USER_DASHBOARD = (function () {
  const PROFILE_STORAGE_KEY = 'stackly_user_profile';

  function init() {
    initTabs();
    initSidebarToggle();
    renderUserProfile();
    renderOrders();
    renderWishlist();
    renderRecommended();
    bindProfileForm();
    bindTicketForm();
  }

  function initSidebarToggle() {
    const toggle = document.getElementById('dashboard-sidebar-toggle');
    const sidebar = document.getElementById('dashboard-sidebar');
    const closeBtn = document.getElementById('sidebar-close-btn');

    if (toggle && sidebar) {
      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('is-open');
      });
    }

    if (closeBtn && sidebar) {
      closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('is-open');
      });
    }
  }

  function initTabs() {
    const items = document.querySelectorAll('.sidebar-item[data-tab]');
    items.forEach(item => {
      item.addEventListener('click', () => {
        const tabId = item.getAttribute('data-tab');
        switchTab(tabId);

        // Close sidebar on mobile
        const sidebar = document.getElementById('dashboard-sidebar');
        if (sidebar && window.innerWidth <= 1024) {
          sidebar.classList.remove('is-open');
        }
      });
    });
  }

  function switchTab(tabId) {
    document.querySelectorAll('.sidebar-item[data-tab]').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });

    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.remove('active');
    });

    const activePane = document.getElementById(`tab-${tabId}`);
    if (activePane) {
      activePane.classList.add('active');
    }

    const titleEl = document.getElementById('dashboard-topbar-title');
    if (titleEl) {
      const titles = {
        'overview': 'Account Overview',
        'orders': 'My Orders',
        'wishlist': 'My Wishlist',
        'profile': 'My Profile',
        'support': 'Help & Support',
        'settings': 'Account Settings'
      };
      titleEl.textContent = titles[tabId] || 'Dashboard';
    }
  }

  function getUserProfile() {
    let currentUser = null;
    try {
      const u = localStorage.getItem('stackly_current_user');
      if (u) currentUser = JSON.parse(u);
    } catch (e) {
      console.error(e);
    }

    let storedProfile = null;
    try {
      const stored = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (stored) storedProfile = JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    const defaultProfile = {
      name: (currentUser && currentUser.name) ? currentUser.name : (storedProfile && storedProfile.name ? storedProfile.name : 'Julian Vance'),
      email: (currentUser && currentUser.email) ? currentUser.email : (storedProfile && storedProfile.email ? storedProfile.email : 'user@stackly.com'),
      phone: (storedProfile && storedProfile.phone) ? storedProfile.phone : '+1 (555) 782-9014',
      address: (storedProfile && storedProfile.address) ? storedProfile.address : '742 Evergreen Terrace, Suite 402, New York, NY 10012',
      tier: 'STACKLY Connoisseur',
      memberSince: 'March 2024'
    };

    localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(defaultProfile));
    return defaultProfile;
  }

  function renderUserProfile() {
    const profile = getUserProfile();

    const nameEls = document.querySelectorAll('.user-display-name');
    nameEls.forEach(el => el.textContent = profile.name);

    const emailEls = document.querySelectorAll('.user-display-email');
    emailEls.forEach(el => el.textContent = profile.email);

    // Form inputs
    const nameInput = document.getElementById('profile-name');
    const emailInput = document.getElementById('profile-email');
    const phoneInput = document.getElementById('profile-phone');
    const addressInput = document.getElementById('profile-address');

    if (nameInput) nameInput.value = profile.name;
    if (emailInput) emailInput.value = profile.email;
    if (phoneInput) phoneInput.value = profile.phone;
    if (addressInput) addressInput.value = profile.address;
  }

  function bindProfileForm() {
    const form = document.getElementById('profile-edit-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const updated = {
        name: document.getElementById('profile-name').value.trim(),
        email: document.getElementById('profile-email').value.trim(),
        phone: document.getElementById('profile-phone').value.trim(),
        address: document.getElementById('profile-address').value.trim(),
        tier: 'STACKLY Connoisseur',
        memberSince: 'March 2024'
      };

      localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(updated));
      renderUserProfile();

      if (window.STACKLY_MAIN) {
        window.STACKLY_MAIN.showToast('Profile information updated successfully!', 'success');
      }
    });
  }

  function getOrders() {
    try {
      const stored = localStorage.getItem('stackly_orders');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length >= 3) return parsed;
      }
    } catch (e) {
      console.error(e);
    }

    // Seed comprehensive luxury eyewear order history
    const initialOrders = [
      {
        orderId: 'STK-829104',
        date: 'Nov 12, 2026',
        total: 415,
        status: 'In Transit',
        statusClass: 'in-transit',
        carrier: 'DHL Express Worldwide',
        trackingNumber: 'DHL-9842-1049-21',
        origin: 'Sabae Workshop, Japan',
        destination: 'New York, United States',
        items: [
          {
            id: 'stk-001',
            name: 'Aura Minimalist Acetate (Zeiss DuraVision Rx)',
            price: 295,
            quantity: 1,
            image: './images/products/product-1.webp'
          },
          {
            id: 'lens-addon',
            name: 'High-Index 1.67 Aspheric Zeiss Lens Upgrade',
            price: 120,
            quantity: 1,
            image: './images/services/lens-guidance.webp'
          }
        ]
      },
      {
        orderId: 'STK-784012',
        date: 'Oct 28, 2026',
        total: 455,
        status: 'Delivered',
        statusClass: 'delivered',
        carrier: 'FedEx Priority Secure',
        trackingNumber: 'FDX-7719-0021-US',
        origin: 'Cadore Atelier, Italy',
        destination: 'New York, United States',
        items: [
          {
            id: 'stk-002',
            name: 'Komorebi Titanium Wire (Brushed Platinum)',
            price: 360,
            quantity: 1,
            image: './images/products/product-2.webp'
          },
          {
            id: 'blue-protect',
            name: 'Zeiss BlueGuard Digital Filtration',
            price: 95,
            quantity: 1,
            image: './images/services/prescription.webp'
          }
        ]
      },
      {
        orderId: 'STK-710294',
        date: 'Sep 14, 2026',
        total: 320,
        status: 'Delivered',
        statusClass: 'delivered',
        carrier: 'DHL Express Express',
        trackingNumber: 'DHL-5521-8840-02',
        origin: 'Cadore Atelier, Italy',
        destination: 'New York, United States',
        items: [
          {
            id: 'stk-003',
            name: 'Solares Bold Navigator (Dark Havana)',
            price: 320,
            quantity: 1,
            image: './images/products/product-3.webp'
          }
        ]
      },
      {
        orderId: 'STK-640192',
        date: 'Jul 20, 2026',
        total: 310,
        status: 'Delivered',
        statusClass: 'delivered',
        carrier: 'UPS Worldwide Saver',
        trackingNumber: 'UPS-1Z9999999999',
        origin: 'Cadore Atelier, Italy',
        destination: 'New York, United States',
        items: [
          {
            id: 'stk-004',
            name: 'Atelier Cat-Eye Noir (Midnight Jet)',
            price: 310,
            quantity: 1,
            image: './images/products/product-4.webp'
          }
        ]
      }
    ];
    localStorage.setItem('stackly_orders', JSON.stringify(initialOrders));
    return initialOrders;
  }

  let userOrdersFilter = 'all';

  function renderOrders(filter = 'all') {
    userOrdersFilter = filter;
    let orders = getOrders();
    const ordersContainer = document.getElementById('user-orders-list');
    const recentOrdersContainer = document.getElementById('user-recent-orders-list');

    if (filter === 'in-transit') {
      orders = orders.filter(o => o.status.toLowerCase().includes('transit') || o.status.toLowerCase().includes('progress'));
    } else if (filter === 'delivered') {
      orders = orders.filter(o => o.status.toLowerCase() === 'delivered');
    }

    if (ordersContainer) {
      if (orders.length === 0) {
        ordersContainer.innerHTML = `
          <div style="text-align: center; padding: 3rem; background: #fff; border-radius: var(--radius-sm); border: 1px solid var(--color-border);">
            <p style="color: var(--color-muted); font-size: 0.95rem;">No orders match the selected filter.</p>
          </div>
        `;
      } else {
        ordersContainer.innerHTML = orders.map(order => `
          <div class="user-order-card" style="margin-bottom: 1.5rem; background: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; box-shadow: var(--shadow-subtle);">
            <div class="order-card-header" style="background: var(--color-bg-card-alt); padding: 1.2rem 1.6rem; border-bottom: 1px solid var(--color-border); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem;">
              <div class="order-meta-info" style="display: flex; gap: 2rem; flex-wrap: wrap;">
                <div class="order-meta-item">
                  <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--color-muted); display: block;">Order Reference</span>
                  <strong style="color: var(--color-primary); font-size: 0.95rem;">#${order.orderId}</strong>
                </div>
                <div class="order-meta-item">
                  <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--color-muted); display: block;">Placement Date</span>
                  <strong style="font-size: 0.95rem;">${order.date}</strong>
                </div>
                <div class="order-meta-item">
                  <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--color-muted); display: block;">Insured Total</span>
                  <strong style="color: var(--color-accent-gold-dark); font-size: 0.95rem;">$${order.total.toLocaleString()}</strong>
                </div>
                <div class="order-meta-item">
                  <span style="font-size: 0.72rem; text-transform: uppercase; color: var(--color-muted); display: block;">Carrier Logistics</span>
                  <span style="font-size: 0.85rem; font-weight: 600; color: var(--color-primary);">${order.carrier || 'DHL Express'} · <code>${order.trackingNumber || 'DHL-98421'}</code></span>
                </div>
              </div>
              <div style="display: flex; align-items: center; gap: 0.8rem;">
                <span class="status-badge ${order.statusClass || order.status.toLowerCase().replace(/\s+/g, '-')}">${order.status}</span>
                <button class="btn btn-outline btn-sm" onclick="window.location.href='./404.html'">Invoice PDF</button>
              </div>
            </div>
            <div class="order-card-items" style="padding: 1.2rem 1.6rem; display: flex; flex-direction: column; gap: 1rem;">
              ${order.items.map(item => `
                <div class="order-card-item" style="display: flex; align-items: center; gap: 1.2rem; padding-bottom: 0.8rem; border-bottom: 1px solid var(--color-border-subtle);">
                  <img src="${item.image}" alt="${item.name}" class="order-item-img" style="width: 64px; height: 64px; object-fit: cover; border-radius: var(--radius-sm); border: 1px solid var(--color-border);" />
                  <div style="flex: 1;">
                    <h4 style="font-size: 0.95rem; margin-bottom: 0.2rem; color: var(--color-primary);">${item.name}</h4>
                    <p style="font-size: 0.82rem; color: var(--color-muted); margin: 0;">Quantity: ${item.quantity} · Handcrafted Edition · $${item.price} each</p>
                  </div>
                  <div style="display: flex; gap: 0.6rem;">
                    <button class="btn btn-outline btn-sm" onclick="window.STACKLY_CART && window.STACKLY_CART.addToCart('${item.id}', 1)">Buy Again</button>
                    <button class="btn btn-text btn-sm" onclick="window.location.href='./404.html'">Tune-Up</button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('');
      }
    }

    if (recentOrdersContainer) {
      const allOrders = getOrders();
      recentOrdersContainer.innerHTML = allOrders.slice(0, 3).map(order => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 1rem 0; border-bottom: 1px solid var(--color-border);">
          <div>
            <strong style="display: block; font-size: 0.95rem; color: var(--color-primary);">#${order.orderId}</strong>
            <span style="font-size: 0.8rem; color: var(--color-muted);">${order.date} · ${order.items.length} silhouette(s)</span>
          </div>
          <div style="text-align: right;">
            <div style="font-weight: 700; color: var(--color-primary); font-size: 0.95rem;">$${order.total}</div>
            <span class="status-badge ${order.statusClass || order.status.toLowerCase().replace(/\s+/g, '-')}" style="font-size: 0.68rem; padding: 0.15rem 0.5rem;">${order.status}</span>
          </div>
        </div>
      `).join('');
    }
  }

  function renderWishlist() {
    const container = document.getElementById('user-wishlist-grid');
    const summaryContainer = document.getElementById('user-wishlist-summary-count');
    if (!container) return;

    const wishlistIds = window.STACKLY_WISHLIST ? window.STACKLY_WISHLIST.getWishlist() : [];
    if (summaryContainer) summaryContainer.textContent = `${wishlistIds.length} Saved Items`;

    if (wishlistIds.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; background: #fff; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--color-muted-light); margin-bottom: 1rem;">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <h3>Your Wishlist is Empty</h3>
          <p style="color: var(--color-muted); margin-bottom: 1.5rem;">Save your favorite optical and sunglasses styles for later.</p>
          <a href="collections.html" class="btn btn-primary btn-sm">Explore Eyewear</a>
        </div>
      `;
      return;
    }

    const products = wishlistIds.map(id => window.STACKLY_PRODUCTS ? window.STACKLY_PRODUCTS.getProductById(id) : null).filter(Boolean);

    container.innerHTML = products.map(product => `
      <div class="product-card">
        <div class="product-card-media">
          <img src="${product.image}" alt="${product.name}" class="product-card-img" />
          <button class="card-action-btn active" style="position: absolute; top: 12px; right: 12px; z-index: 2;" 
                  onclick="window.STACKLY_WISHLIST.removeFromWishlist('${product.id}')" title="Remove from Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
        </div>
        <div class="product-card-body">
          <span class="product-card-category">${product.category}</span>
          <h3 class="product-card-title">${product.name}</h3>
          <div class="product-card-meta">
            <span class="product-card-price">$${product.price}</span>
            <button class="btn btn-primary btn-sm" onclick="window.STACKLY_CART.addToCart('${product.id}', 1)">Add to Cart</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderRecommended() {
    const container = document.getElementById('user-recommended-grid');
    if (!container || !window.STACKLY_PRODUCTS) return;

    const products = window.STACKLY_PRODUCTS.getStoredProducts().slice(0, 3);
    container.innerHTML = products.map(product => window.STACKLY_PRODUCTS.createProductCardHTML(product)).join('');
  }

  function bindTicketForm() {
    const form = document.getElementById('support-ticket-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const subject = document.getElementById('ticket-subject').value;
      const message = document.getElementById('ticket-message').value;

      if (!subject || !message) {
        if (window.STACKLY_MAIN) window.STACKLY_MAIN.showToast('Please complete both subject and message.', 'error');
        return;
      }

      const ticketId = 'TCK-' + Math.floor(1000 + Math.random() * 9000);
      if (window.STACKLY_MAIN) {
        window.STACKLY_MAIN.showToast(`Support Ticket #${ticketId} submitted. An optical concierge will respond within 4 hours.`, 'success');
      }

      form.reset();
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    switchTab,
    renderWishlist,
    renderOrders,
    renderUserProfile
  };
})();

function filterUserOrders(status, btn) {
  if (btn && btn.parentElement) {
    btn.parentElement.querySelectorAll('button').forEach(b => {
      b.classList.remove('btn-primary');
      b.classList.add('btn-outline');
    });
    btn.classList.remove('btn-outline');
    btn.classList.add('btn-primary');
  }
  if (window.STACKLY_USER_DASHBOARD) {
    window.STACKLY_USER_DASHBOARD.renderOrders(status);
  }
}

function toggleFaq(btn) {
  const card = btn.closest('.faq-card');
  if (card) {
    card.classList.toggle('open');
  }
}

window.filterUserOrders = filterUserOrders;
window.toggleFaq = toggleFaq;
window.STACKLY_USER_DASHBOARD = STACKLY_USER_DASHBOARD;
