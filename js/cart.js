/**
 * STACKLY — Cart Architecture & LocalStorage Manager
 * File: js/cart.js
 */

const STACKLY_CART = (function () {
  const STORAGE_KEY = 'stackly_cart';

  function getCart() {
    try {
      const items = localStorage.getItem(STORAGE_KEY);
      return items ? JSON.parse(items) : [];
    } catch (e) {
      console.error('Error reading cart from localStorage', e);
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      updateCartUI();
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }

  function addToCart(productId, quantity = 1) {
    const product = window.STACKLY_PRODUCTS ? window.STACKLY_PRODUCTS.getProductById(productId) : null;
    if (!product) {
      if (window.STACKLY_MAIN) window.STACKLY_MAIN.showToast('Product not found', 'error');
      return;
    }

    const cart = getCart();
    const existingIndex = cart.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        quantity: quantity
      });
    }

    saveCart(cart);
    if (window.STACKLY_MAIN) {
      window.STACKLY_MAIN.showToast(`Added "${product.name}" to cart`, 'success');
    }
    openCartDrawer();
  }

  function removeFromCart(productId) {
    let cart = getCart();
    const item = cart.find(i => i.id === productId);
    cart = cart.filter(i => i.id !== productId);
    saveCart(cart);
    if (item && window.STACKLY_MAIN) {
      window.STACKLY_MAIN.showToast(`Removed "${item.name}" from cart`);
    }
  }

  function updateQuantity(productId, delta) {
    const cart = getCart();
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    saveCart(cart);
  }

  function getSubtotal() {
    const cart = getCart();
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  function getItemCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
  }

  function clearCart() {
    saveCart([]);
  }

  function updateCartUI() {
    const cart = getCart();
    const count = getItemCount();
    const subtotal = getSubtotal();

    // Update all badge counts
    document.querySelectorAll('.cart-count-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });

    // Render Cart Drawer
    const drawerItemsContainer = document.getElementById('cart-drawer-items');
    const drawerSubtotal = document.getElementById('cart-drawer-subtotal');
    const drawerTotal = document.getElementById('cart-drawer-total');
    const drawerFooter = document.getElementById('cart-drawer-footer');

    if (drawerSubtotal) drawerSubtotal.textContent = `$${subtotal.toLocaleString()}`;
    if (drawerTotal) drawerTotal.textContent = `$${subtotal.toLocaleString()}`;

    if (drawerItemsContainer) {
      if (cart.length === 0) {
        drawerItemsContainer.innerHTML = `
          <div class="cart-empty-state">
            <svg class="cart-empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            <h3>Your Cart is Empty</h3>
            <p>Explore our curated collections of luxury frames and polarized sunglasses.</p>
            <a href="collections.html" class="btn btn-primary btn-sm" onclick="STACKLY_CART.closeCartDrawer()">Explore Collections</a>
          </div>
        `;
        if (drawerFooter) drawerFooter.style.display = 'none';
      } else {
        if (drawerFooter) drawerFooter.style.display = 'block';
        drawerItemsContainer.innerHTML = cart.map(item => `
          <div class="cart-item">
            <div class="cart-item-img">
              <img src="${item.image}" alt="${item.name}" />
            </div>
            <div class="cart-item-info">
              <h4>${item.name}</h4>
              <div class="item-meta">${item.category}</div>
              <div class="item-price">$${item.price}</div>
              <div class="cart-item-qty">
                <button class="qty-btn" onclick="STACKLY_CART.updateQuantity('${item.id}', -1)" aria-label="Decrease quantity">−</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn" onclick="STACKLY_CART.updateQuantity('${item.id}', 1)" aria-label="Increase quantity">+</button>
              </div>
            </div>
            <button class="cart-item-remove" onclick="STACKLY_CART.removeFromCart('${item.id}')" aria-label="Remove item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        `).join('');
      }
    }
  }

  function openCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('nav-backdrop');
    if (drawer) drawer.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';
    updateCartUI();
  }

  function closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const backdrop = document.getElementById('nav-backdrop');
    if (drawer) drawer.classList.remove('is-open');
    if (backdrop && !document.getElementById('mobile-nav')?.classList.contains('is-open')) {
      backdrop.classList.remove('is-active');
    }
    document.body.style.overflow = '';
  }

  function openCheckoutDemo() {
    closeCartDrawer();
    const modal = document.getElementById('checkout-modal');
    if (!modal) {
      window.location.href = 'collections.html';
      return;
    }
    modal.classList.add('is-open');

    // Populate checkout items & total
    const cart = getCart();
    const subtotal = getSubtotal();
    const container = document.getElementById('checkout-items-summary');
    const totalEl = document.getElementById('checkout-final-total');

    if (container) {
      container.innerHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0; border-bottom: 1px solid var(--color-border); font-size: 0.9rem;">
          <div>
            <strong>${item.name}</strong> × ${item.quantity}
          </div>
          <div>$${(item.price * item.quantity).toLocaleString()}</div>
        </div>
      `).join('');
    }

    if (totalEl) totalEl.textContent = `$${subtotal.toLocaleString()}`;
  }

  function closeCheckoutDemo() {
    const modal = document.getElementById('checkout-modal');
    if (modal) modal.classList.remove('is-open');
  }

  function completeOrderDemo(e) {
    if (e) e.preventDefault();
    const cart = getCart();
    if (cart.length === 0) {
      if (window.STACKLY_MAIN) window.STACKLY_MAIN.showToast('Your cart is empty', 'error');
      return;
    }

    const orderId = 'STK-' + Math.floor(100000 + Math.random() * 900000);
    const subtotal = getSubtotal();

    // Store in demo orders for user dashboard
    const newOrder = {
      orderId: orderId,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      total: subtotal,
      status: 'Processing',
      items: cart
    };

    try {
      const storedOrders = JSON.parse(localStorage.getItem('stackly_orders') || '[]');
      storedOrders.unshift(newOrder);
      localStorage.setItem('stackly_orders', JSON.stringify(storedOrders));
    } catch (err) {
      console.error(err);
    }

    // Clear cart
    clearCart();
    closeCheckoutDemo();

    if (window.STACKLY_MAIN) {
      window.STACKLY_MAIN.showToast(`Order #${orderId} placed successfully! Redirecting...`, 'success');
    }

    setTimeout(() => {
      window.location.href = 'user-dashboard.html';
    }, 1200);
  }

  // Initialize on load
  document.addEventListener('DOMContentLoaded', () => {
    updateCartUI();
  });

  return {
    getCart,
    addToCart,
    removeFromCart,
    updateQuantity,
    getSubtotal,
    getItemCount,
    clearCart,
    updateCartUI,
    openCartDrawer,
    closeCartDrawer,
    openCheckoutDemo,
    closeCheckoutDemo,
    completeOrderDemo
  };
})();

window.STACKLY_CART = STACKLY_CART;
