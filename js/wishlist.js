/**
 * STACKLY — Wishlist Architecture & Manager
 * File: js/wishlist.js
 */

const STACKLY_WISHLIST = (function () {
  const STORAGE_KEY = 'stackly_wishlist';

  function getWishlist() {
    try {
      const items = localStorage.getItem(STORAGE_KEY);
      return items ? JSON.parse(items) : [];
    } catch (e) {
      console.error('Error reading wishlist from localStorage', e);
      return [];
    }
  }

  function saveWishlist(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
      updateWishlistUI();
    } catch (e) {
      console.error('Error saving wishlist to localStorage', e);
    }
  }

  function isInWishlist(productId) {
    const list = getWishlist();
    return list.includes(productId);
  }

  function toggleWishlist(productId, btnElement) {
    let list = getWishlist();
    const product = window.STACKLY_PRODUCTS ? window.STACKLY_PRODUCTS.getProductById(productId) : null;
    const productName = product ? product.name : 'Item';

    if (list.includes(productId)) {
      list = list.filter(id => id !== productId);
      if (btnElement) {
        btnElement.classList.remove('active');
        const svg = btnElement.querySelector('svg');
        if (svg) svg.setAttribute('fill', 'none');
      }
      if (window.STACKLY_MAIN) window.STACKLY_MAIN.showToast(`Removed "${productName}" from wishlist`);
    } else {
      list.push(productId);
      if (btnElement) {
        btnElement.classList.add('active');
        const svg = btnElement.querySelector('svg');
        if (svg) svg.setAttribute('fill', 'currentColor');
      }
      if (window.STACKLY_MAIN) window.STACKLY_MAIN.showToast(`Saved "${productName}" to wishlist`, 'success');
    }

    saveWishlist(list);
  }

  function removeFromWishlist(productId) {
    let list = getWishlist();
    list = list.filter(id => id !== productId);
    saveWishlist(list);
    if (window.STACKLY_USER_DASHBOARD) {
      window.STACKLY_USER_DASHBOARD.renderWishlist();
    }
  }

  function getCount() {
    return getWishlist().length;
  }

  function updateWishlistUI() {
    const count = getCount();
    document.querySelectorAll('.wishlist-count-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    updateWishlistUI();
  });

  return {
    getWishlist,
    isInWishlist,
    toggleWishlist,
    removeFromWishlist,
    getCount,
    updateWishlistUI
  };
})();

window.STACKLY_WISHLIST = STACKLY_WISHLIST;
