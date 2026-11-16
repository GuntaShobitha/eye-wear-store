/**
 * STACKLY — Admin Management Portal Engine
 * File: js/admin-dashboard.js
 */

const STACKLY_ADMIN_DASHBOARD = (function () {
  let customerCurrentPage = 1;
  const customersPerPage = 4;

  const DEMO_CUSTOMERS = [
    { id: 'CUST-001', name: 'Julian Vance', email: 'julian.vance@couture.com', date: 'March 14, 2024', spent: '$1,890', orders: 4 },
    { id: 'CUST-002', name: 'Genevieve Laurent', email: 'genevieve.l@atelier.fr', date: 'January 22, 2024', spent: '$2,450', orders: 6 },
    { id: 'CUST-003', name: 'Marcus Thorne', email: 'm.thorne@architecture.co', date: 'April 05, 2024', spent: '$710', orders: 2 },
    { id: 'CUST-004', name: 'Sora Takahashi', email: 'sora.takahashi@tokyo.jp', date: 'May 18, 2024', spent: '$3,120', orders: 7 },
    { id: 'CUST-005', name: 'Astrid Lindholm', email: 'astrid.nordic@design.se', date: 'June 02, 2024', spent: '$1,240', orders: 3 },
    { id: 'CUST-006', name: 'Dante Moretti', email: 'dante.moretti@milano.it', date: 'July 11, 2024', spent: '$980', orders: 2 },
    { id: 'CUST-007', name: 'Clara Beaumont', email: 'clara.b@london.co.uk', date: 'August 29, 2024', spent: '$1,650', orders: 4 },
    { id: 'CUST-008', name: 'Harrison Blake', email: 'harrison.blake@ny.com', date: 'September 08, 2024', spent: '$2,100', orders: 5 }
  ];

  function init() {
    initTabs();
    initSidebarToggle();
    renderAdminProfile();
    renderOverviewStats();
    renderAdminProductsTable();
    renderAdminOrdersTable();
    renderAdminCustomersTable();
    renderPopularProductsList();
    bindProductForm();
  }

  function renderAdminProfile() {
    let adminUser = null;
    try {
      const u = localStorage.getItem('stackly_current_user');
      if (u) adminUser = JSON.parse(u);
    } catch (e) {
      console.error(e);
    }

    const adminName = (adminUser && adminUser.name) ? adminUser.name : 'Eleanor Sterling';
    const adminEmail = (adminUser && adminUser.email) ? adminUser.email : 'admin@stackly.com';

    document.querySelectorAll('.admin-display-name').forEach(el => el.textContent = adminName);
    document.querySelectorAll('.admin-display-email').forEach(el => el.textContent = adminEmail);
  }

  function initSidebarToggle() {
    const toggle = document.getElementById('admin-sidebar-toggle');
    const sidebar = document.getElementById('admin-sidebar');
    const closeBtn = document.getElementById('admin-sidebar-close-btn');

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

        const sidebar = document.getElementById('admin-sidebar');
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

    const titleEl = document.getElementById('admin-topbar-title');
    if (titleEl) {
      const titles = {
        'overview': 'Executive Overview',
        'products': 'Product Inventory & Catalog',
        'orders': 'Orders Fulfillment',
        'customers': 'Customer Directory',
        'reports': 'Financial & Performance Analytics'
      };
      titleEl.textContent = titles[tabId] || 'Admin Portal';
    }
  }

  function renderOverviewStats() {
    const products = window.STACKLY_PRODUCTS ? window.STACKLY_PRODUCTS.getStoredProducts() : [];
    const orders = getAdminOrders();

    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 18450);

    const totalProdEl = document.getElementById('admin-stat-products');
    const totalOrdersEl = document.getElementById('admin-stat-orders');
    const totalCustEl = document.getElementById('admin-stat-customers');
    const totalRevEl = document.getElementById('admin-stat-revenue');

    if (totalProdEl) totalProdEl.textContent = products.length;
    if (totalOrdersEl) totalOrdersEl.textContent = orders.length + 42;
    if (totalCustEl) totalCustEl.textContent = DEMO_CUSTOMERS.length + 128;
    if (totalRevEl) totalRevEl.textContent = `$${totalRevenue.toLocaleString()}`;
  }

  function renderPopularProductsList() {
    const container = document.getElementById('admin-popular-products');
    if (!container || !window.STACKLY_PRODUCTS) return;

    const products = window.STACKLY_PRODUCTS.getStoredProducts().slice(0, 4);
    container.innerHTML = products.map(p => `
      <div style="display: flex; align-items: center; justify-content: space-between; padding: 0.8rem 0; border-bottom: 1px solid var(--color-border);">
        <div style="display: flex; align-items: center; gap: 0.8rem;">
          <img src="${p.image}" alt="${p.name}" style="width: 44px; height: 44px; border-radius: var(--radius-sm); object-fit: cover;" />
          <div>
            <h5 style="font-size: 0.9rem; margin-bottom: 0.2rem;">${p.name}</h5>
            <span style="font-size: 0.78rem; color: var(--color-muted);">${p.category}</span>
          </div>
        </div>
        <div style="text-align: right;">
          <strong style="font-size: 0.9rem; color: var(--color-primary);">$${p.price}</strong>
          <span style="display: block; font-size: 0.75rem; color: var(--color-accent-green);">★ ${p.rating}</span>
        </div>
      </div>
    `).join('');
  }

  function renderAdminProductsTable(searchTerm = '', categoryFilter = 'all') {
    const tableBody = document.getElementById('admin-products-table-body');
    if (!tableBody || !window.STACKLY_PRODUCTS) return;

    let products = window.STACKLY_PRODUCTS.getStoredProducts();

    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      products = products.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }

    if (categoryFilter !== 'all') {
      products = products.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    if (products.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 2rem; color: var(--color-muted);">No products found matching criteria.</td></tr>`;
      return;
    }

    tableBody.innerHTML = products.map(p => `
      <tr>
        <td>
          <div class="table-product-cell">
            <img src="${p.image}" alt="${p.name}" />
            <div>
              <strong style="display: block;">${p.name}</strong>
              <span style="font-size: 0.78rem; color: var(--color-muted);">ID: ${p.id}</span>
            </div>
          </div>
        </td>
        <td>${p.category}</td>
        <td><strong>$${p.price}</strong></td>
        <td>${p.stockCount || 10} units</td>
        <td>
          <span class="status-badge ${p.inStock ? 'in-stock' : 'out-of-stock'}">
            ${p.inStock ? 'In Stock' : 'Out of Stock'}
          </span>
        </td>
        <td>
          <div class="action-btns-group">
            <button class="btn-icon-action" onclick="STACKLY_ADMIN_DASHBOARD.openEditProductModal('${p.id}')" title="Edit Product">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="btn-icon-action danger" onclick="STACKLY_ADMIN_DASHBOARD.deleteProduct('${p.id}')" title="Delete Product">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </td>
      </tr>
    `).join('');
  }

  function getAdminOrders() {
    try {
      const stored = localStorage.getItem('stackly_admin_orders');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }

    const defaultOrders = [
      { id: 'ORD-9821', customer: 'Julian Vance', email: 'julian.vance@couture.com', product: 'Aura Minimalist Acetate', total: 295, date: 'Nov 12, 2026', status: 'Processing' },
      { id: 'ORD-9820', customer: 'Genevieve Laurent', email: 'genevieve.l@atelier.fr', product: 'Komorebi Titanium Wire', total: 360, date: 'Nov 11, 2026', status: 'Shipped' },
      { id: 'ORD-9819', customer: 'Marcus Thorne', email: 'm.thorne@architecture.co', product: 'Solares Bold Navigator', total: 320, date: 'Nov 09, 2026', status: 'Delivered' },
      { id: 'ORD-9818', customer: 'Sora Takahashi', email: 'sora.takahashi@tokyo.jp', product: 'Kyoto Architectural Round', total: 345, date: 'Nov 08, 2026', status: 'Delivered' },
      { id: 'ORD-9817', customer: 'Astrid Lindholm', email: 'astrid.nordic@design.se', product: 'Vanguard Hexagonal Wire', total: 280, date: 'Nov 06, 2026', status: 'Cancelled' }
    ];

    localStorage.setItem('stackly_admin_orders', JSON.stringify(defaultOrders));
    return defaultOrders;
  }

  function renderAdminOrdersTable() {
    const tableBody = document.getElementById('admin-orders-table-body');
    if (!tableBody) return;

    const orders = getAdminOrders();

    tableBody.innerHTML = orders.map(o => `
      <tr>
        <td><strong>#${o.id}</strong></td>
        <td>
          <strong>${o.customer}</strong>
          <span style="display: block; font-size: 0.78rem; color: var(--color-muted);">${o.email}</span>
        </td>
        <td>${o.product}</td>
        <td><strong>$${o.total}</strong></td>
        <td>${o.date}</td>
        <td>
          <select class="auth-select" style="padding: 0.35rem 0.6rem; font-size: 0.8rem; width: auto;" onchange="STACKLY_ADMIN_DASHBOARD.updateOrderStatus('${o.id}', this.value)">
            <option value="Processing" ${o.status === 'Processing' ? 'selected' : ''}>Processing</option>
            <option value="Shipped" ${o.status === 'Shipped' ? 'selected' : ''}>Shipped</option>
            <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
            <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
          </select>
        </td>
      </tr>
    `).join('');
  }

  function updateOrderStatus(orderId, newStatus) {
    let orders = getAdminOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus;
      localStorage.setItem('stackly_admin_orders', JSON.stringify(orders));
      if (window.STACKLY_MAIN) {
        window.STACKLY_MAIN.showToast(`Order #${orderId} status updated to ${newStatus}`, 'success');
      }
    }
  }

  function renderAdminCustomersTable(search = '') {
    const tableBody = document.getElementById('admin-customers-table-body');
    const paginationEl = document.getElementById('admin-customers-pagination');
    if (!tableBody) return;

    let list = DEMO_CUSTOMERS;
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(c => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q));
    }

    const totalPages = Math.ceil(list.length / customersPerPage) || 1;
    if (customerCurrentPage > totalPages) customerCurrentPage = 1;

    const start = (customerCurrentPage - 1) * customersPerPage;
    const paginated = list.slice(start, start + customersPerPage);

    tableBody.innerHTML = paginated.map(c => `
      <tr>
        <td><strong>${c.id}</strong></td>
        <td><strong>${c.name}</strong></td>
        <td>${c.email}</td>
        <td>${c.date}</td>
        <td><strong>${c.spent}</strong></td>
        <td>${c.orders} orders</td>
      </tr>
    `).join('');

    if (paginationEl) {
      paginationEl.innerHTML = `
        <button class="btn btn-outline btn-sm" ${customerCurrentPage === 1 ? 'disabled style="opacity: 0.5;"' : ''} onclick="STACKLY_ADMIN_DASHBOARD.changeCustomerPage(-1)">Previous</button>
        <span style="font-size: 0.85rem; font-weight: 600;">Page ${customerCurrentPage} of ${totalPages}</span>
        <button class="btn btn-outline btn-sm" ${customerCurrentPage === totalPages ? 'disabled style="opacity: 0.5;"' : ''} onclick="STACKLY_ADMIN_DASHBOARD.changeCustomerPage(1)">Next</button>
      `;
    }
  }

  function changeCustomerPage(delta) {
    customerCurrentPage += delta;
    renderAdminCustomersTable();
  }

  function openAddProductModal() {
    const modal = document.getElementById('admin-product-modal');
    const form = document.getElementById('admin-product-form');
    const title = document.getElementById('admin-product-modal-title');

    if (modal && form) {
      form.reset();
      document.getElementById('admin-prod-id').value = '';
      if (title) title.textContent = 'Add New Eyewear Product';
      modal.classList.add('is-open');
    }
  }

  function openEditProductModal(productId) {
    const modal = document.getElementById('admin-product-modal');
    const form = document.getElementById('admin-product-form');
    const title = document.getElementById('admin-product-modal-title');
    const product = window.STACKLY_PRODUCTS ? window.STACKLY_PRODUCTS.getProductById(productId) : null;

    if (!product || !modal || !form) return;

    if (title) title.textContent = `Edit Product: ${product.name}`;
    document.getElementById('admin-prod-id').value = product.id;
    document.getElementById('admin-prod-name').value = product.name;
    document.getElementById('admin-prod-category').value = product.category;
    document.getElementById('admin-prod-price').value = product.price;
    document.getElementById('admin-prod-stock').value = product.stockCount || 10;
    document.getElementById('admin-prod-desc').value = product.description;

    modal.classList.add('is-open');
  }

  function closeProductModal() {
    const modal = document.getElementById('admin-product-modal');
    if (modal) modal.classList.remove('is-open');
  }

  function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this eyewear product from the catalog?')) return;

    let products = window.STACKLY_PRODUCTS ? window.STACKLY_PRODUCTS.getStoredProducts() : [];
    products = products.filter(p => p.id !== productId);
    window.STACKLY_PRODUCTS.saveStoredProducts(products);

    renderAdminProductsTable();
    renderOverviewStats();

    if (window.STACKLY_MAIN) {
      window.STACKLY_MAIN.showToast('Product deleted from inventory', 'info');
    }
  }

  function bindProductForm() {
    const form = document.getElementById('admin-product-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const id = document.getElementById('admin-prod-id').value;
      const name = document.getElementById('admin-prod-name').value.trim();
      const category = document.getElementById('admin-prod-category').value;
      const price = parseFloat(document.getElementById('admin-prod-price').value);
      const stock = parseInt(document.getElementById('admin-prod-stock').value, 10);
      const description = document.getElementById('admin-prod-desc').value.trim();

      let products = window.STACKLY_PRODUCTS ? window.STACKLY_PRODUCTS.getStoredProducts() : [];

      if (id) {
        // Edit
        const item = products.find(p => p.id === id);
        if (item) {
          item.name = name;
          item.category = category;
          item.price = price;
          item.stockCount = stock;
          item.description = description;
        }
      } else {
        // Create
        const newId = 'stk-0' + (products.length + 1);
        products.unshift({
          id: newId,
          name: name,
          category: category,
          gender: 'Unisex',
          price: price,
          originalPrice: null,
          rating: 5.0,
          reviewsCount: 1,
          image: './images/products/product-1.webp',
          badge: 'New',
          badgeType: 'gold',
          colors: ['#1C1917'],
          colorNames: ['Noir'],
          description: description,
          specs: {
            frameWidth: '142 mm',
            lensWidth: '50 mm',
            bridgeWidth: '20 mm',
            material: 'Bio-Acetate'
          },
          inStock: stock > 0,
          stockCount: stock,
          featured: true
        });
      }

      window.STACKLY_PRODUCTS.saveStoredProducts(products);
      renderAdminProductsTable();
      renderOverviewStats();
      closeProductModal();

      if (window.STACKLY_MAIN) {
        window.STACKLY_MAIN.showToast(id ? 'Product updated successfully!' : 'New product published to store!', 'success');
      }
    });
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    switchTab,
    renderAdminProductsTable,
    renderAdminOrdersTable,
    renderAdminCustomersTable,
    changeCustomerPage,
    updateOrderStatus,
    openAddProductModal,
    openEditProductModal,
    closeProductModal,
    deleteProduct
  };
})();

window.STACKLY_ADMIN_DASHBOARD = STACKLY_ADMIN_DASHBOARD;
