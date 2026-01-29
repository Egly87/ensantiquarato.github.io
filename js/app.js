// ========================
// ANTIQUARIATO SHOP - App.js
// ========================

const app = {
  products: [],
  filteredProducts: [],

  init() {
    this.loadProducts();
    this.setupEventListeners();
    this.detectPage();
  },

  loadProducts() {
    // Carica da localStorage first (admin), fallback a JSON
    const storageKey = 'antiquariato_products';
    const stored = localStorage.getItem(storageKey);
    
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.products = data;
        this.filteredProducts = data;
        this.detectPage();
        return;
      } catch (e) {
        console.warn('Errore parsing localStorage, riprovo con JSON');
      }
    }

    // Fallback a JSON statico
    fetch('/data/products.json')
      .then(r => r.json())
      .then(data => {
        this.products = data;
        this.filteredProducts = data;
        this.detectPage();
      })
      .catch(e => {
        console.error('Errore caricamento prodotti:', e);
        this.showError('Impossibile caricare il catalogo. Riprova più tardi.');
      });
  },

  detectPage() {
    const page = document.body.getAttribute('data-page');
    
    if (window.location.pathname === '/' || window.location.pathname.includes('index')) {
      this.renderHome();
    } else if (window.location.pathname.includes('catalogo')) {
      this.renderCatalog();
    } else if (window.location.pathname.includes('prodotto')) {
      this.renderProductDetail();
    }
  },

  // ========================
  // HOME PAGE
  // ========================

  renderHome() {
    const container = document.getElementById('featured-products');
    if (!container) return;

    const featured = this.products.filter(p => p.featured);
    const html = featured.map(p => this.renderProductCard(p)).join('');
    
    container.innerHTML = html;
    this.attachCardListeners();
  },

  // ========================
  // CATALOG PAGE
  // ========================

  renderCatalog() {
    this.filteredProducts = [...this.products];
    this.applyFilters();
    this.renderCatalogProducts();
    this.attachCardListeners();
  },

  applyFilters() {
    const search = document.getElementById('search')?.value.toLowerCase() || '';
    const category = document.getElementById('category')?.value || '';
    const status = document.getElementById('status')?.value || '';
    const sort = document.getElementById('sort')?.value || 'recenti';

    // Filter
    this.filteredProducts = this.products.filter(p => {
      const matchSearch = !search || p.name.toLowerCase().includes(search) || p.description.toLowerCase().includes(search);
      const matchCategory = !category || p.category === category;
      const matchStatus = !status || p.status === status;
      return matchSearch && matchCategory && matchStatus;
    });

    // Sort
    switch(sort) {
      case 'prezzo-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'prezzo-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'recenti':
      default:
        // Assume ID è inversamente correlato a recency
        this.filteredProducts.sort((a, b) => b.id - a.id);
    }

    this.updateResultCount();
    this.renderCatalogProducts();
  },

  renderCatalogProducts() {
    const container = document.getElementById('catalog-products');
    if (!container) return;

    if (this.filteredProducts.length === 0) {
      container.innerHTML = '<p class="text-center">Nessun prodotto trovato.</p>';
      return;
    }

    const html = this.filteredProducts.map(p => this.renderProductCard(p)).join('');
    container.innerHTML = html;
  },

  updateResultCount() {
    const count = document.getElementById('result-count');
    if (count) {
      count.textContent = `${this.filteredProducts.length} prodotto${this.filteredProducts.length !== 1 ? 'i' : ''} trovato${this.filteredProducts.length !== 1 ? 'i' : ''}`;
    }
  },

  renderProductCard(product) {
    const statusClass = `badge-${product.status}`;
    const statusText = this.getStatusText(product.status);
    const priceDisplay = product.status === 'sold' ? '—' : `€ ${product.price.toFixed(2)}`;
    const featured = product.featured ? `<div class="product-badge badge-featured">In Evidenza</div>` : '';

    const imgSrc = product.image || '/assets/brand/og-1200x630.jpg';
    const webpSrc = imgSrc.endsWith('.webp') ? imgSrc : imgSrc.replace(/\.[a-zA-Z0-9]+$/, '.webp');
    const jpgFallback = imgSrc.endsWith('.webp') ? imgSrc.replace(/\.webp$/i, '.jpg') : imgSrc;
    return `
      <div class="product-card" onclick="app.goToProduct(${product.id})">
        <div class="product-image">
          <picture>
            <source type="image/webp" srcset="${webpSrc}">
            <img src="${jpgFallback}" alt="${product.name}" loading="lazy" class="img--thumb" width="400" height="300" decoding="async" onerror="this.onerror=null;this.src='/assets/brand/og-1200x630.jpg'">
          </picture>
          <div class="product-badge ${statusClass}">${statusText}</div>
          ${featured}
        </div>
        <div class="product-body">
          <div class="product-category">${product.category}</div>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description.substring(0, 100)}...</p>
          <div class="product-footer">
            <span class="product-price${product.status === 'sold' ? ' sold' : ''}">${priceDisplay}</span>
          </div>
        </div>
      </div>
    `;
  },

  // ========================
  // PRODUCT DETAIL PAGE
  // ========================

  renderProductDetail() {
    const params = new URLSearchParams(window.location.search);
    const id = parseInt(params.get('id'), 10);
    const product = this.products.find(p => p.id === id);

    if (!product) {
      this.showError('Prodotto non trovato.');
      return;
    }

    this.renderProductDetailPage(product);
    this.setProductSchema(product);
    this.updatePageTitle(product);
  },

  renderProductDetailPage(product) {
    const container = document.getElementById('product-detail');
    if (!container) return;

    const statusClass = `badge-${product.status}`;
    const statusText = this.getStatusText(product.status);
    const priceDisplay = product.status === 'sold' ? '—' : `€ ${product.price.toFixed(2)}`;

    const mainImg = product.image || (product.gallery && product.gallery[0]) || '/assets/brand/og-1200x630.jpg';
    const mainWebp = mainImg.endsWith('.webp') ? mainImg : mainImg.replace(/\.[a-zA-Z0-9]+$/, '.webp');
    const mainJpg = mainImg.endsWith('.webp') ? mainImg.replace(/\.webp$/i, '.jpg') : mainImg;
    const thumbnails = product.gallery.map((img, idx) => {
      const imgSrc = img || '/assets/brand/og-1200x630.jpg';
      const imgWebp = imgSrc.endsWith('.webp') ? imgSrc : imgSrc.replace(/\.[a-zA-Z0-9]+$/, '.webp');
      const imgJpg = imgSrc.endsWith('.webp') ? imgSrc.replace(/\.webp$/i, '.jpg') : imgSrc;
      return `
        <div class="thumbnail${idx === 0 ? ' active' : ''}" onclick="app.changeMainImage(this, '${imgSrc}')">
          <picture>
            <source type="image/webp" srcset="${imgWebp}">
            <img src="${imgJpg}" alt="${product.name} - ${idx+1}" loading="lazy" width="80" height="80" decoding="async" onerror="this.onerror=null;this.src='/assets/brand/og-1200x630.jpg'">
          </picture>
        </div>
      `;
    }).join('');

    const buySection = product.status === 'available' ? `
      <div class="action-buttons">
        <button class="btn btn-primary" onclick="app.addToCart(${product.id})">🛒 Aggiungi al Carrello</button>
        <a href="${product.stripeLinkBuy}" class="btn btn-secondary" target="_blank">💳 Stripe</a>
        <a href="${product.paypalBuy}" class="btn btn-secondary" target="_blank">🅿️ PayPal</a>
      </div>
    ` : '';

    const inquiryBtn = product.status !== 'available' ? `
      <a href="https://wa.me/39?text=${encodeURIComponent(product.whatsappText)}" class="product-inquiry-btn" target="_blank">💬 Richiedi Informazioni</a>
    ` : '';

    const mainImgEsc = mainImg.replace(/"/g, '&quot;');
    const mainWebpEsc = mainWebp.replace(/"/g, '&quot;');
    const html = `
      <div class="product-gallery">
        <div class="product-main-image">
          <picture>
            <source type="image/webp" srcset="${mainWebpEsc}">
            <img src="${mainJpg}" alt="${product.name}" loading="lazy" class="img--hero" width="800" height="450" decoding="async" onerror="this.onerror=null;this.src='/assets/brand/og-1200x630.jpg'">
          </picture>
        </div>
        <div class="product-gallery-thumbnails">
          ${thumbnails}
        </div>
      </div>

      <div class="product-info">
        <h1>${product.name}</h1>
        <div class="product-year">${product.year}</div>
        <div class="product-badge ${statusClass}">${statusText}</div>
        <div class="product-price-detail${product.status === 'sold' ? ' sold' : ''}">${priceDisplay}</div>
        <p>${product.description}</p>

        <div class="product-specs">
          <div class="spec-row">
            <span class="spec-label">Categoria</span>
            <span class="spec-value">${product.category}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">Periodo</span>
            <span class="spec-value">${product.year}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">Dimensioni</span>
            <span class="spec-value">${product.dimensions}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">Stato</span>
            <span class="spec-value">${statusText}</span>
          </div>
        </div>

        <div class="product-actions">
          ${buySection}
          ${inquiryBtn}
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  changeMainImage(el, src) {
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    el.classList.add('active');
    const main = document.querySelector('.product-main-image img');
    if(main){ main.src = src || '/assets/brand/og-1200x630.jpg'; }
  },

  setProductSchema(product) {
    const schema = {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": product.name,
      "description": product.description,
      "image": product.image,
      "brand": {
        "@type": "Brand",
        "name": "Antiquariato Shop"
      },
      "offers": {
        "@type": "Offer",
        "url": window.location.href,
        "priceCurrency": "EUR",
        "price": product.price,
        "availability": `https://schema.org/${product.status === 'available' ? 'InStock' : 'OutOfStock'}`
      }
    };
    
    const schemaTag = document.getElementById('product-schema');
    if (schemaTag) {
      schemaTag.textContent = JSON.stringify(schema);
    }
  },

  updatePageTitle(product) {
    document.title = `${product.name} — Antiquariato Shop`;
    const meta = document.querySelector('meta[property="og:title"]');
    if (meta) meta.setAttribute('content', product.name);
  },

  // ========================
  // UTILITY
  // ========================

  getStatusText(status) {
    const map = {
      'available': 'Disponibile',
      'reserved': 'Riservato',
      'sold': 'Venduto'
    };
    return map[status] || status;
  },

  goToProduct(id) {
    window.location.href = `/prodotto.html?id=${id}`;
  },

  showError(msg) {
    console.error(msg);
    const main = document.querySelector('main');
    if (main) {
      main.innerHTML = `<div class="container" style="text-align:center; padding:4rem 0;"><p style="color:#e74c3c;">${msg}</p></div>`;
    }
  },

  setupEventListeners() {
    // Catalog filters
    if (window.location.pathname.includes('catalogo')) {
      const search = document.getElementById('search');
      const category = document.getElementById('category');
      const sort = document.getElementById('sort');
      const status = document.getElementById('status');
      const resetBtn = document.getElementById('reset-filters');

      [search, category, sort, status].forEach(el => {
        if (el) el.addEventListener('change', () => this.applyFilters());
      });

      if (search) search.addEventListener('keyup', () => this.applyFilters());
      if (resetBtn) resetBtn.addEventListener('click', () => {
        if (search) search.value = '';
        if (category) category.value = '';
        if (sort) sort.value = 'recenti';
        if (status) status.value = '';
        this.applyFilters();
      });
    }

    // Contact form
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Questo form è un placeholder. Configura un backend per l\'invio email.');
      });
    }
  },

  // ========================
  // CARRELLO
  // ========================

  addToCart(productId) {
    const product = this.products.find(p => p.id === productId);
    if (!product) return;

    const CART_KEY = 'antiquariato_cart';
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || '[]');
    
    const existingItem = cart.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ productId, quantity: 1 });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    this.showNotification(`✅ ${product.name} aggiunto al carrello!`);
  },

  showNotification(message) {
    const notif = document.createElement('div');
    notif.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #d4af37;
      color: #000;
      padding: 15px 20px;
      border-radius: 4px;
      font-weight: 600;
      z-index: 9999;
      animation: slideIn 0.3s ease;
    `;
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
  },

  goToCart() {
    window.location.href = '/carrello.html';
  }
};

// Init when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});