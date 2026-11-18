/**
 * STACKLY — Luxury Eyewear Product Catalog
 * File: js/products.js
 */

const STACKLY_DEFAULT_PRODUCTS = [
  {
    id: 'stk-001',
    name: 'Aura Minimalist Acetate',
    category: 'Sunglasses',
    gender: 'Unisex',
    price: 295,
    originalPrice: 340,
    rating: 4.9,
    reviewsCount: 38,
    image: './images/products/product-1.webp',
    badge: 'Bestseller',
    badgeType: 'gold',
    colors: ['#1C1917', '#78350F', '#D97706'],
    colorNames: ['Noir Obsidian', 'Classic Tortoise', 'Amber Honey'],
    description: 'Sculpted from premium Japanese Mazzucchelli bio-acetate with custom 5-barrel hinges and 100% UVA/UVB polarized glass lenses.',
    specs: {
      frameWidth: '142 mm',
      lensWidth: '50 mm',
      bridgeWidth: '21 mm',
      templeLength: '145 mm',
      material: 'Bio-Acetate & German Hinges'
    },
    inStock: true,
    stockCount: 14,
    featured: true,
    newArrival: false,
    trending: true
  },
  {
    id: 'stk-002',
    name: 'Komorebi Titanium Wire',
    category: 'Optical Frames',
    gender: "Men's Eyewear",
    price: 360,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 24,
    image: './images/products/product-2.webp',
    badge: 'New Arrival',
    badgeType: 'dark',
    colors: ['#71717A', '#D4AF37', '#18181B'],
    colorNames: ['Brushed Titanium', 'Champagne Gold', 'Matte Onyx'],
    description: 'Ultra-lightweight Japanese beta-titanium optical frame weighing merely 12 grams. Engineered for featherlight ergonomic balance.',
    specs: {
      frameWidth: '138 mm',
      lensWidth: '49 mm',
      bridgeWidth: '20 mm',
      templeLength: '142 mm',
      material: 'Japanese Beta-Titanium'
    },
    inStock: true,
    stockCount: 8,
    featured: true,
    newArrival: true,
    trending: false
  },
  {
    id: 'stk-003',
    name: 'Solares Bold Navigator',
    category: 'Sunglasses',
    gender: "Men's Eyewear",
    price: 320,
    originalPrice: 380,
    rating: 5.0,
    reviewsCount: 42,
    image: './images/products/product-3.webp',
    badge: 'Limited Edition',
    badgeType: 'gold',
    colors: ['#18181B', '#B45309'],
    colorNames: ['Onyx Black', 'Dark Havana'],
    description: 'A contemporary masculine navigator silhouette featuring a distinctive geometric double bridge and gradient bottle-green lenses.',
    specs: {
      frameWidth: '146 mm',
      lensWidth: '55 mm',
      bridgeWidth: '17 mm',
      templeLength: '148 mm',
      material: 'Milled Acetate & Stainless Inlay'
    },
    inStock: true,
    stockCount: 5,
    featured: true,
    newArrival: false,
    trending: true
  },
  {
    id: 'stk-004',
    name: 'Atelier Cat-Eye Noir',
    category: 'Sunglasses',
    gender: "Women's Eyewear",
    price: 310,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 31,
    image: './images/products/product-4.webp',
    badge: 'Trending',
    badgeType: 'gold',
    colors: ['#09090B', '#B91C1C', '#E2E8F0'],
    colorNames: ['Midnight Jet', 'Bordeaux Wine', 'Crystal Cream'],
    description: 'Sharp, architectural cat-eye silhouette inspired by high-fashion Parisian couture. Beveled browlines catch light from every angle.',
    specs: {
      frameWidth: '144 mm',
      lensWidth: '52 mm',
      bridgeWidth: '18 mm',
      templeLength: '140 mm',
      material: 'Hand-Polished Bio-Acetate'
    },
    inStock: true,
    stockCount: 12,
    featured: true,
    newArrival: true,
    trending: true
  },
  {
    id: 'stk-005',
    name: 'Kyoto Architectural Round',
    category: 'Optical Frames',
    gender: 'Unisex',
    price: 345,
    originalPrice: 390,
    rating: 4.7,
    reviewsCount: 19,
    image: './images/products/product-5.webp',
    badge: 'Crafted',
    badgeType: 'dark',
    colors: ['#D97706', '#52525B', '#CA8A04'],
    colorNames: ['Tokyo Tortoise', 'Gunmetal Slate', 'Antique Gold'],
    description: 'Perfect circular geometry balanced with delicate coin-edge filigree engraving around the eye rims. True vintage heritage.',
    specs: {
      frameWidth: '136 mm',
      lensWidth: '47 mm',
      bridgeWidth: '22 mm',
      templeLength: '145 mm',
      material: 'Titanium & Mazzucchelli Rims'
    },
    inStock: true,
    stockCount: 9,
    featured: false,
    newArrival: false,
    trending: false
  },
  {
    id: 'stk-006',
    name: 'Vanguard Hexagonal Wire',
    category: 'Optical Frames',
    gender: 'Unisex',
    price: 280,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 16,
    image: './images/products/product-6.webp',
    badge: 'Popular',
    badgeType: 'gold',
    colors: ['#D4AF37', '#71717A'],
    colorNames: ['Pale Gold', 'Satin Silver'],
    description: 'Subtle six-sided polygon structure crafted for discerning individuals seeking a modern, intellectual optical profile.',
    specs: {
      frameWidth: '139 mm',
      lensWidth: '50 mm',
      bridgeWidth: '19 mm',
      templeLength: '145 mm',
      material: 'Pure Japanese Titanium'
    },
    inStock: true,
    stockCount: 11,
    featured: false,
    newArrival: true,
    trending: true
  },
  {
    id: 'stk-007',
    name: 'Riviera Square Havana',
    category: 'Sunglasses',
    gender: "Men's Eyewear",
    price: 330,
    originalPrice: 375,
    rating: 4.9,
    reviewsCount: 29,
    image: './images/products/product-7.webp',
    badge: 'Sale',
    badgeType: 'sale',
    colors: ['#78350F', '#1C1917'],
    colorNames: ['Rich Havana', 'Piano Black'],
    description: 'A timeless Italian square silhouette with beveled temples, custom core wire detailing, and mineral brown polarized optics.',
    specs: {
      frameWidth: '145 mm',
      lensWidth: '53 mm',
      bridgeWidth: '20 mm',
      templeLength: '148 mm',
      material: '10mm Milled Acetate'
    },
    inStock: true,
    stockCount: 7,
    featured: true,
    newArrival: false,
    trending: true
  },
  {
    id: 'stk-008',
    name: 'Serena Oval Silhouette',
    category: 'Sunglasses',
    gender: "Women's Eyewear",
    price: 290,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 35,
    image: './images/products/product-8.webp',
    badge: 'New',
    badgeType: 'dark',
    colors: ['#F59E0B', '#18181B', '#F1F5F9'],
    colorNames: ['Butterscotch', 'Solid Black', 'Opaline Bone'],
    description: 'Chic 90s-inspired minimalist oval frames with rich hand-tumbled luster and 100% UV protection smokey gradient lenses.',
    specs: {
      frameWidth: '140 mm',
      lensWidth: '51 mm',
      bridgeWidth: '19 mm',
      templeLength: '140 mm',
      material: 'Cellulose Acetate'
    },
    inStock: true,
    stockCount: 16,
    featured: true,
    newArrival: true,
    trending: false
  },
  {
    id: 'stk-009',
    name: 'Milano Aviator Heritage',
    category: 'Sunglasses',
    gender: "Men's Eyewear",
    price: 350,
    originalPrice: 410,
    rating: 4.8,
    reviewsCount: 51,
    image: './images/products/product-9.webp',
    badge: 'Iconic',
    badgeType: 'gold',
    colors: ['#D4AF37', '#27272A'],
    colorNames: ['Polished Gold', 'Ruthenium Dark'],
    description: 'Precision teardrop aviator frame featuring a sweat bar with hand-stitched Tuscan leather and tempered optical crystal lenses.',
    specs: {
      frameWidth: '148 mm',
      lensWidth: '58 mm',
      bridgeWidth: '15 mm',
      templeLength: '145 mm',
      material: 'Monel Metal & Tuscan Leather'
    },
    inStock: true,
    stockCount: 6,
    featured: false,
    newArrival: false,
    trending: true
  },
  {
    id: 'stk-010',
    name: 'Elysium Oversized Butterfly',
    category: 'Sunglasses',
    gender: "Women's Eyewear",
    price: 340,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 22,
    image: './images/products/product-10.webp',
    badge: 'Luxury',
    badgeType: 'gold',
    colors: ['#18181B', '#9A3412'],
    colorNames: ['Deep Onyx', 'Cognac Amber'],
    description: 'Dramatic feminine glamour with butterfly contour curves and subtle 24k gold-plated accents embedded within the temples.',
    specs: {
      frameWidth: '147 mm',
      lensWidth: '56 mm',
      bridgeWidth: '18 mm',
      templeLength: '142 mm',
      material: 'Bio-Acetate & 24K Accents'
    },
    inStock: true,
    stockCount: 9,
    featured: true,
    newArrival: false,
    trending: false
  },
  {
    id: 'stk-011',
    name: 'Lucent Clear Optical',
    category: 'Optical Frames',
    gender: 'Unisex',
    price: 275,
    originalPrice: 310,
    rating: 4.7,
    reviewsCount: 18,
    image: './images/products/product-11.webp',
    badge: 'Modern',
    badgeType: 'dark',
    colors: ['#F8FAFC', '#FEF3C7'],
    colorNames: ['Crystal Clear', 'Champagne Tint'],
    description: 'Translucent crystalline frame revealing the bespoke engraved brass temple wire beneath. An understated intellectual masterpiece.',
    specs: {
      frameWidth: '139 mm',
      lensWidth: '49 mm',
      bridgeWidth: '20 mm',
      templeLength: '145 mm',
      material: 'Crystal Bio-Acetate'
    },
    inStock: true,
    stockCount: 15,
    featured: false,
    newArrival: true,
    trending: true
  },
  {
    id: 'stk-012',
    name: 'Sartorial Clubmaster',
    category: 'Optical Frames',
    gender: "Men's Eyewear",
    price: 315,
    originalPrice: null,
    rating: 4.9,
    reviewsCount: 33,
    image: './images/products/product-12.webp',
    badge: 'Essential',
    badgeType: 'gold',
    colors: ['#1C1917', '#78350F'],
    colorNames: ['Black & Gold', 'Tortoise & Bronze'],
    description: 'A distinguished browline silhouette crafted with hand-beveled acetate top rims and hypoallergenic titanium lower chassis.',
    specs: {
      frameWidth: '143 mm',
      lensWidth: '51 mm',
      bridgeWidth: '21 mm',
      templeLength: '145 mm',
      material: 'Combination Titanium & Acetate'
    },
    inStock: true,
    stockCount: 8,
    featured: false,
    newArrival: false,
    trending: true
  },
  {
    id: 'stk-013',
    name: 'Geneva Rimless Octagon',
    category: 'Optical Frames',
    gender: 'Unisex',
    price: 390,
    originalPrice: 450,
    rating: 5.0,
    reviewsCount: 14,
    image: './images/products/product-13.webp',
    badge: 'Atelier',
    badgeType: 'gold',
    colors: ['#D4AF37', '#94A3B8'],
    colorNames: ['24K Gold Plated', 'Platinum Silver'],
    description: 'Minimalist rimless construction with beveled octagonal lens edges and tension-mounted flex titanium temples. Weightless luxury.',
    specs: {
      frameWidth: '137 mm',
      lensWidth: '50 mm',
      bridgeWidth: '19 mm',
      templeLength: '142 mm',
      material: 'Solid Beta-Titanium'
    },
    inStock: true,
    stockCount: 4,
    featured: true,
    newArrival: false,
    trending: false
  },
  {
    id: 'stk-014',
    name: 'Bespoke Pilot Polarized',
    category: 'Sunglasses',
    gender: "Men's Eyewear",
    price: 335,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 27,
    image: './images/products/product-14.webp',
    badge: 'New',
    badgeType: 'dark',
    colors: ['#1E293B', '#334155'],
    colorNames: ['Gunmetal Blue', 'Matte Pewter'],
    description: 'Engineered with double-milled titanium brow bar and Japanese nylon polarized lenses offering superior optical clarity and glare elimination.',
    specs: {
      frameWidth: '146 mm',
      lensWidth: '56 mm',
      bridgeWidth: '16 mm',
      templeLength: '146 mm',
      material: 'Forged Titanium'
    },
    inStock: true,
    stockCount: 10,
    featured: false,
    newArrival: true,
    trending: false
  },
  {
    id: 'stk-015',
    name: 'Palazzo Geometric Glamour',
    category: 'Sunglasses',
    gender: "Women's Eyewear",
    price: 325,
    originalPrice: 370,
    rating: 4.9,
    reviewsCount: 30,
    image: './images/products/product-15.webp',
    badge: 'Bestseller',
    badgeType: 'gold',
    colors: ['#78350F', '#18181B'],
    colorNames: ['Venetian Tortoise', 'Ebony Gloss'],
    description: 'Architectural octagonal frame silhouette with thick 8mm profile edges, offering generous sun coverage with refined high-fashion elegance.',
    specs: {
      frameWidth: '145 mm',
      lensWidth: '54 mm',
      bridgeWidth: '18 mm',
      templeLength: '143 mm',
      material: 'Organic Italian Acetate'
    },
    inStock: true,
    stockCount: 11,
    featured: true,
    newArrival: false,
    trending: true
  },
  {
    id: 'stk-016',
    name: 'Oslo Minimalist Keyhole',
    category: 'Optical Frames',
    gender: 'Unisex',
    price: 290,
    originalPrice: null,
    rating: 4.8,
    reviewsCount: 21,
    image: './images/products/product-16.webp',
    badge: 'Nordic',
    badgeType: 'dark',
    colors: ['#475569', '#A16207', '#1E293B'],
    colorNames: ['Slate Grey', 'Amber Tortoise', 'Deep Navy'],
    description: 'Clean Scandinavian aesthetic with an ergonomic keyhole bridge and tapered temple tips for all-day optical comfort.',
    specs: {
      frameWidth: '141 mm',
      lensWidth: '49 mm',
      bridgeWidth: '21 mm',
      templeLength: '145 mm',
      material: 'Eco Cellulose Acetate'
    },
    inStock: true,
    stockCount: 13,
    featured: false,
    newArrival: false,
    trending: true
  }
];

// Initialize and manage product state in localStorage
function getStoredProducts() {
  const stored = localStorage.getItem('stackly_products');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Failed to parse stored products, falling back to default', e);
    }
  }
  localStorage.setItem('stackly_products', JSON.stringify(STACKLY_DEFAULT_PRODUCTS));
  return STACKLY_DEFAULT_PRODUCTS;
}

function saveStoredProducts(products) {
  localStorage.setItem('stackly_products', JSON.stringify(products));
}

function getProductById(id) {
  const products = getStoredProducts();
  return products.find(p => p.id === id) || null;
}

function filterProducts({ category = 'all', gender = 'all', search = '', sortBy = 'featured' } = {}) {
  let products = getStoredProducts();

  if (category && category !== 'all') {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }

  if (gender && gender !== 'all') {
    products = products.filter(p => p.gender.toLowerCase() === gender.toLowerCase());
  }

  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }

  // Sorting
  switch (sortBy) {
    case 'price-asc':
      products.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      products.sort((a, b) => b.price - a.price);
      break;
    case 'rating':
      products.sort((a, b) => b.rating - a.rating);
      break;
    case 'name-asc':
      products.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case 'featured':
    default:
      products.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
      break;
  }

  return products;
}

// Generate Product Card HTML
function createProductCardHTML(product) {
  const isWishlisted = window.STACKLY_WISHLIST && window.STACKLY_WISHLIST.isInWishlist(product.id);
  const badgeHTML = product.badge ? 
    `<span class="product-card-badge ${product.badgeType || ''}">${product.badge}</span>` : '';
  
  const swatchesHTML = (product.colors || []).map((color, idx) => 
    `<span class="swatch-dot" style="background-color: ${color};" title="${product.colorNames ? product.colorNames[idx] : ''}"></span>`
  ).join('');

  const originalPriceHTML = product.originalPrice ? 
    `<span class="original-price">$${product.originalPrice}</span>` : '';

  return `
    <div class="product-card stagger-item" data-id="${product.id}">
      <div class="product-card-media">
        ${badgeHTML}
        <div class="product-card-actions">
          <button class="card-action-btn ${isWishlisted ? 'active' : ''}" 
                  onclick="window.STACKLY_WISHLIST && window.STACKLY_WISHLIST.toggleWishlist('${product.id}', this)"
                  aria-label="Save to Wishlist">
            <svg viewBox="0 0 24 24" style="width:20px" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          
        </div>
        <img src="${product.image}" alt="${product.name} - ${product.category}" class="product-card-img" loading="lazy" />
        <button class="product-card-quick-add" onclick="window.STACKLY_CART && window.STACKLY_CART.addToCart('${product.id}', 1)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <path d="M16 10a4 4 0 0 1-8 0"></path>
          </svg>
          Add To Cart
        </button>
      </div>
      <div class="product-card-body">
        <span class="product-card-category">${product.category} · ${product.gender}</span>
        <h3 class="product-card-title" onclick="window.STACKLY_MAIN && window.STACKLY_MAIN.openQuickView('${product.id}')" style="cursor: pointer;">
          ${product.name}
        </h3>
        <div class="product-card-meta">
          <div class="product-card-price">
            $${product.price} ${originalPriceHTML}
          </div>
          <div class="product-card-swatches">
            ${swatchesHTML}
          </div>
        </div>
      </div>
    </div>
  `;
}

// Expose globally
window.STACKLY_PRODUCTS = {
  getStoredProducts,
  saveStoredProducts,
  getProductById,
  filterProducts,
  createProductCardHTML
};
