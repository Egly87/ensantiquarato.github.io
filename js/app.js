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

    fetch('data/products.json')
      .then(r => r.json())
      .then(data => {
        this.products = data;
        this.filteredProducts = data;
        this.detectPage();
      })
      .catch(e => {
        console.error('Errore caricamento prodotti:', e);
        this.showError('Impossibile caricare il catalogo. Riprova piu tardi.');
      });
  },

  detectPage() {
    const path = window.location.pathname;
    const file = path.split('/').pop();

    if (file === '' || file === 'index.html') {
      this.renderHome();
    } else if (path.includes('catalogo')) {
      this.renderCatalog();
    } else if (path.includes('prodotto')) {
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
  },

  // ========================
  // CATALOG PAGE
  // ========================

  renderCatalog() {
    this.filteredProducts = [...this.products];
    this.applyHashFilters();
    this.applyFilters();
  },

  applyHashFilters() {
    const hash = window.location.hash.replace('#', '');
    if (!hash) return;
    const params = new URLSearchParams(hash);
    const category = params.get('categoria') || params.get('category');
    const status = params.get('status');

    const categoryEl = document.getElementById('category');
    const statusEl = document.getElementById('status');

    if (categoryEl && category) categoryEl.value = category;
    if (statusEl && status) statusEl.value = status;
  },

  applyFilters() {
    const search = document.getElementById('search')?.value.toLowerCase() || '';
    const category = document.getElementById('category')?.value || '';
    const status = document.getElementById('status')?.value || '';
    const sort = document.getElementById('sort')?.value || 'recenti';

    this.filteredProducts = this.products.filter(p => {
      const haystack = [p.name, p.description, p.year, p.dimensions, p.category]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchSearch = !search || haystack.includes(search);
      const matchCategory = !category || p.category === category;
      const matchStatus = !status || p.status === status;
      return matchSearch && matchCategory && matchStatus;
    });

    switch (sort) {
      case 'prezzo-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'prezzo-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'recenti':
      default:
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
    const featured = product.featured ? `<div class="product-badge badge-featured">In evidenza</div>` : '';
    const categoryLabel = this.formatCategory(product.category);

    const imgSrc = product.image || 'assets/brand/og-1200x630.jpg';
    const webpSrc = imgSrc.endsWith('.webp') ? imgSrc : imgSrc.replace(/\.[a-zA-Z0-9]+$/, '.webp');
    const jpgFallback = imgSrc;

    const shortDesc = product.description.length > 110
      ? `${product.description.substring(0, 100)}...`
      : product.description;

    return `
      <div class="product-card" onclick="app.goToProduct(${product.id})">
        <div class="product-image">
          <picture>
            <source type="image/webp" srcset="${webpSrc.replace(/^\//, '')}">
            <img src="${jpgFallback.replace(/^\//, '')}" alt="${product.name}" loading="lazy" width="400" height="300" decoding="async" onerror="this.onerror=null;this.src='assets/brand/og-1200x630.jpg'">
          </picture>
          <div class="product-badge ${statusClass}">${statusText}</div>
          ${featured}
        </div>
        <div class="product-body">
          <div class="product-category">${categoryLabel}</div>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${shortDesc}</p>
          <div class="product-footer">
            <span class="product-price${product.status === 'sold' ? ' sold' : ''}">${priceDisplay}</span>
            <span class="text-muted">${product.year || ''}</span>
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
    this.renderRelatedProducts(product);
    this.setProductSchema(product);
    this.updatePageMeta(product);
  },

  renderProductDetailPage(product) {
    const container = document.getElementById('product-detail');
    if (!container) return;

    const statusClass = `badge-${product.status}`;
    const statusText = this.getStatusText(product.status);
    const priceDisplay = product.status === 'sold' ? '—' : `€ ${product.price.toFixed(2)}`;

    const mainImg = product.image || (product.gallery && product.gallery[0]) || 'assets/brand/og-1200x630.jpg';
    const mainWebp = mainImg.endsWith('.webp') ? mainImg : mainImg.replace(/\.[a-zA-Z0-9]+$/, '.webp');
    const mainJpg = mainImg;

    const galleryList = Array.isArray(product.gallery) && product.gallery.length ? product.gallery : [mainImg];
    const thumbnails = galleryList.map((img, idx) => {
      const imgSrc = img || 'assets/brand/og-1200x630.jpg';
      const imgWebp = imgSrc.endsWith('.webp') ? imgSrc : imgSrc.replace(/\.[a-zA-Z0-9]+$/, '.webp');
      const imgJpg = imgSrc;
      return `
        <div class="thumbnail${idx === 0 ? ' active' : ''}" onclick="app.changeMainImage(this, '${imgSrc}')">
          <picture>
            <source type="image/webp" srcset="${imgWebp.replace(/^\//, '')}">
            <img src="${imgJpg.replace(/^\//, '')}" alt="${product.name} - ${idx + 1}" loading="lazy" width="80" height="80" decoding="async" onerror="this.onerror=null;this.src='assets/brand/og-1200x630.jpg'">
          </picture>
        </div>
      `;
    }).join('');

    const buyButtons = [];
    if (product.status === 'available') {
      buyButtons.push(`<button class="btn btn-primary" onclick="app.addToCart(${product.id})">Aggiungi al carrello</button>`);
      if (product.stripeLinkBuy) buyButtons.push(`<a href="${product.stripeLinkBuy}" class="btn btn-secondary" target="_blank" rel="noopener">Paga con Stripe</a>`);
      if (product.paypalBuy) buyButtons.push(`<a href="${product.paypalBuy}" class="btn btn-secondary" target="_blank" rel="noopener">Paga con PayPal</a>`);
    }

    const inquiryText = product.whatsappText || `Mi interessa ${product.name}`;
    const inquiryBtn = product.status !== 'available'
      ? `<a href="https://wa.me/393296627575?text=${encodeURIComponent(inquiryText)}" class="product-inquiry-btn" target="_blank" rel="noopener">Richiedi informazioni</a>`
      : '';

    const html = `
      <div class="product-gallery">
        <div class="product-main-image">
          <picture>
            <source type="image/webp" srcset="${mainWebp.replace(/^\//, '')}">
            <img src="${mainJpg.replace(/^\//, '')}" alt="${product.name}" loading="lazy" width="800" height="450" decoding="async" onerror="this.onerror=null;this.src='assets/brand/og-1200x630.jpg'">
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
            <span class="spec-value">${this.formatCategory(product.category)}</span>
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
          ${buyButtons.length ? `<div class="action-buttons">${buyButtons.join('')}</div>` : ''}
          ${inquiryBtn}
        </div>

        <div class="product-note">
          <strong>Autenticita e assistenza</strong>
          <p>Ogni pezzo e' descritto con trasparenza. Disponibili foto extra, dettagli su provenienza e supporto dedicato prima e dopo l'acquisto.</p>
        </div>
      </div>
    `;

    container.innerHTML = html;
  },

  renderRelatedProducts(product) {
    const container = document.getElementById('related-products');
    if (!container) return;

    const related = this.products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);
    const fallback = this.products.filter(p => p.id !== product.id).slice(0, 3);
    const list = related.length ? related : fallback;

    container.innerHTML = list.map(p => this.renderProductCard(p)).join('');
  },

  changeMainImage(el, src) {
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    el.classList.add('active');

    const main = document.querySelector('.product-main-image img');
    const source = document.querySelector('.product-main-image source');
    if (main) main.src = `${src.replace(/^\//, '')}`;
    if (source) {
      const webp = src.endsWith('.webp') ? src : src.replace(/\.[a-zA-Z0-9]+$/, '.webp');
      source.srcset = `${webp.replace(/^\//, '')}`;
    }
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
        "name": "ENS Antiquariato"
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

  updatePageMeta(product) {
    document.title = `${product.name} — ENS Antiquariato`;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', product.name);

    const metaDesc = document.querySelector('meta[name="description"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const shortDesc = product.description.length > 160
      ? product.description.substring(0, 157) + '...'
      : product.description;

    if (metaDesc) metaDesc.setAttribute('content', shortDesc);
    if (ogDesc) ogDesc.setAttribute('content', shortDesc);

    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage && product.image) {
      const imgPath = product.image.startsWith('http')
        ? product.image
        : new URL(product.image.replace(/^\//, ''), window.location.href).toString();
      ogImage.setAttribute('content', imgPath);
    }
  },

  // ========================
  // UTILITY
  // ========================

  getStatusText(status) {
    const map = {
      available: 'Disponibile',
      reserved: 'Riservato',
      sold: 'Venduto'
    };
    return map[status] || status;
  },

  formatCategory(category) {
    const map = {
      mobili: 'Mobili',
      arte: 'Arte',
      ceramica: 'Ceramica',
      orologeria: 'Orologeria',
      gioielli: 'Gioielli',
      oggetti: 'Oggetti e curiosita'
    };
    return map[category] || category;
  },

  goToProduct(id) {
    window.location.href = `prodotto.html?id=${id}`;
  },

  showError(msg) {
    console.error(msg);
    const main = document.querySelector('main');
    if (main) {
      main.innerHTML = `<div class="container" style="text-align:center; padding:4rem 0;"><p style="color:#8b2e2e;">${msg}</p></div>`;
    }
  },

  setupEventListeners() {
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

    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
      contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Questo form e' un placeholder. Configura un backend per l'invio email.");
      });
    }
  },

  // ========================
  // CART
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
    this.showNotification(`${product.name} aggiunto al carrello.`);
  },

  showNotification(message) {
    const notif = document.createElement('div');
    notif.style.cssText = `
      position: fixed;
      top: 24px;
      right: 24px;
      background: #fff;
      border: 1px solid var(--line-strong);
      color: var(--ink);
      padding: 14px 18px;
      border-radius: 14px;
      font-weight: 600;
      z-index: 9999;
      box-shadow: var(--shadow-soft);
    `;
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
  }
};

// Init when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});
