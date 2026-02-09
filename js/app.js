// ========================
// ENS VINTAGE - App.js
// ========================

const app = {
  products: [],
  filteredProducts: [],
  favorites: new Set(),

  init() {
    this.loadFavorites();
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
        this.showError('Impossibile caricare gli annunci. Riprova piu tardi.');
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
    const featuredContainer = document.getElementById('featured-products');
    if (featuredContainer) {
      const featured = this.products.filter(p => p.featured);
      const list = featured.length ? featured : [...this.products].sort((a, b) => this.getPostedTimestamp(b) - this.getPostedTimestamp(a)).slice(0, 8);
      featuredContainer.innerHTML = list.map(p => this.renderProductCard(p)).join('');
    }

    const recentContainer = document.getElementById('recent-products');
    if (recentContainer) {
      const recent = [...this.products]
        .sort((a, b) => this.getPostedTimestamp(b) - this.getPostedTimestamp(a))
        .slice(0, 12);
      recentContainer.innerHTML = recent.map(p => this.renderProductCard(p)).join('');
    }
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
    const query = params.get('q') || params.get('query') || '';
    const category = params.get('categoria') || params.get('category');
    const section = params.get('sezione') || params.get('section');
    const status = params.get('status');
    const location = params.get('zona') || params.get('location') || params.get('citta') || '';
    const onlyFavorites = params.get('preferiti') || params.get('favorites') || params.get('favs') || '';

    const categoryEl = document.getElementById('category');
    const sectionEl = document.getElementById('section');
    const statusEl = document.getElementById('status');
    const searchEl = document.getElementById('search');
    const locationEl = document.getElementById('location');
    const onlyFavoritesEl = document.getElementById('only-favorites');

    if (searchEl && query) searchEl.value = query;
    if (categoryEl && category) categoryEl.value = category;
    if (sectionEl && section) sectionEl.value = section;
    if (statusEl && status) statusEl.value = status;
    if (locationEl && location) locationEl.value = location;
    if (onlyFavoritesEl && onlyFavorites) {
      onlyFavoritesEl.checked = onlyFavorites === '1' || onlyFavorites === 'true' || onlyFavorites === 'yes';
    }
  },

  applyFilters() {
    const search = document.getElementById('search')?.value.toLowerCase() || '';
    const category = document.getElementById('category')?.value || '';
    const section = document.getElementById('section')?.value || '';
    const status = document.getElementById('status')?.value || '';
    const location = document.getElementById('location')?.value.toLowerCase() || '';
    const onlyFavorites = document.getElementById('only-favorites')?.checked || false;
    const sort = document.getElementById('sort')?.value || 'recenti';

    this.filteredProducts = this.products.filter(p => {
      const haystack = [p.name, p.description, p.year, p.dimensions, p.category, p.location, p.condition, p.section]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      const matchSearch = !search || haystack.includes(search);
      const matchCategory = !category || p.category === category;
      const matchSection = !section || this.getProductSection(p) === section;
      const matchStatus = !status || p.status === status;
      const matchLocation = !location || String(p.location || '').toLowerCase().includes(location);
      const matchFav = !onlyFavorites || this.isFavorite(p.id);
      return matchSearch && matchCategory && matchSection && matchStatus && matchLocation && matchFav;
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
        this.filteredProducts.sort((a, b) => this.getPostedTimestamp(b) - this.getPostedTimestamp(a));
    }

    this.updateResultCount();
    this.renderCatalogProducts();
  },

  renderCatalogProducts() {
    const container = document.getElementById('catalog-products');
    if (!container) return;

      if (this.filteredProducts.length === 0) {
      container.innerHTML = '<p class="text-center">Nessun annuncio trovato.</p>';
      return;
    }

    const html = this.filteredProducts.map(p => this.renderProductCard(p)).join('');
    container.innerHTML = html;
  },

  updateResultCount() {
    const count = document.getElementById('result-count');
    if (count) {
      const n = this.filteredProducts.length;
      count.textContent = n === 1 ? '1 annuncio trovato' : `${n} annunci trovati`;
    }
  },

  renderProductCard(product) {
    const statusClass = `badge-${product.status}`;
    const statusText = this.getStatusText(product.status);
    const priceDisplay = product.status === 'sold' ? '—' : `€ ${product.price.toFixed(2)}`;
    const featured = product.featured ? `<div class="product-badge badge-featured">In evidenza</div>` : '';
    const categoryLabel = this.formatCategory(product.category);
    const sectionLabel = this.formatSection(this.getProductSection(product));

    const metaParts = [];
    if (product.location) metaParts.push(product.location);
    if (product.condition) metaParts.push(product.condition);
    const metaLine = metaParts.length ? `<div class="product-meta">${metaParts.join(' · ')}</div>` : '';

    const isFav = this.isFavorite(product.id);
    const favBtn = `
      <button class="fav-btn${isFav ? ' active' : ''}" onclick="event.stopPropagation(); app.toggleFavorite(${product.id});" aria-label="${isFav ? 'Rimuovi dai preferiti' : 'Salva tra i preferiti'}">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 21s-7-4.6-9.4-8.6C.6 9 2.3 5.8 5.6 5.2c1.8-.3 3.5.4 4.6 1.7 1.1-1.3 2.8-2 4.6-1.7 3.3.6 5 3.8 3 7.2C19 16.4 12 21 12 21z"/>
        </svg>
      </button>
    `;

    const imgSrc = String(product.image || 'assets/brand/og-1200x630.jpg').replace(/^\//, '');
    const isWebp = imgSrc.toLowerCase().endsWith('.webp');
    const pictureSource = isWebp ? `<source type="image/webp" srcset="${imgSrc}">` : '';

    const desc = String(product.description || '');
    const shortDesc = desc.length > 110
      ? `${desc.substring(0, 100)}...`
      : desc;

    return `
      <div class="product-card" onclick="app.goToProduct(${product.id})">
        <div class="product-image">
          <picture>
            ${pictureSource}
            <img src="${imgSrc}" alt="${product.name}" loading="lazy" width="400" height="300" decoding="async" onerror="this.onerror=null;this.src='assets/brand/og-1200x630.jpg'">
          </picture>
          <div class="product-badge ${statusClass}">${statusText}</div>
          ${featured}
          ${favBtn}
        </div>
        <div class="product-body">
          <div class="product-category">${sectionLabel} · ${categoryLabel}</div>
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${shortDesc}</p>
          ${metaLine}
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

    const mainImg = String(product.image || (product.gallery && product.gallery[0]) || 'assets/brand/og-1200x630.jpg').replace(/^\//, '');
    const mainSource = mainImg.toLowerCase().endsWith('.webp')
      ? `<source type="image/webp" srcset="${mainImg}">`
      : '';

    const galleryList = Array.isArray(product.gallery) && product.gallery.length ? product.gallery : [mainImg];
    const thumbnails = galleryList.map((img, idx) => {
      const imgSrc = String(img || 'assets/brand/og-1200x630.jpg').replace(/^\//, '');
      const thumbSource = imgSrc.toLowerCase().endsWith('.webp')
        ? `<source type="image/webp" srcset="${imgSrc}">`
        : '';
      return `
        <div class="thumbnail${idx === 0 ? ' active' : ''}" onclick="app.changeMainImage(this, '${imgSrc}')">
          <picture>
            ${thumbSource}
            <img src="${imgSrc}" alt="${product.name} - ${idx + 1}" loading="lazy" width="80" height="80" decoding="async" onerror="this.onerror=null;this.src='assets/brand/og-1200x630.jpg'">
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

    const inquiryText = product.whatsappText || `Ciao! Mi interessa: ${product.name}. E' ancora disponibile?`;
    const inquiryLabel = product.status === 'available' ? 'Scrivi su WhatsApp' : 'Richiedi informazioni';
    const inquiryBtn = `<a href="https://wa.me/393296627575?text=${encodeURIComponent(inquiryText)}" class="product-inquiry-btn" target="_blank" rel="noopener">${inquiryLabel}</a>`;

    const html = `
      <div class="product-gallery">
        <div class="product-main-image">
          <picture>
            ${mainSource}
            <img src="${mainImg}" alt="${product.name}" loading="lazy" width="800" height="450" decoding="async" onerror="this.onerror=null;this.src='assets/brand/og-1200x630.jpg'">
          </picture>
        </div>
        <div class="product-gallery-thumbnails">
          ${thumbnails}
        </div>
      </div>

      <div class="product-info">
        <h1>${product.name}</h1>
        <div class="product-year">${product.year || ''}</div>
        <div class="product-badge ${statusClass}">${statusText}</div>
        <div class="product-price-detail${product.status === 'sold' ? ' sold' : ''}">${priceDisplay}</div>
        <p>${product.description}</p>

        <div class="product-specs">
          <div class="spec-row">
            <span class="spec-label">Sezione</span>
            <span class="spec-value">${this.formatSection(this.getProductSection(product))}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">Categoria</span>
            <span class="spec-value">${this.formatCategory(product.category)}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">Anno / periodo</span>
            <span class="spec-value">${product.year || '—'}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">Dimensioni</span>
            <span class="spec-value">${product.dimensions || '—'}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">Zona</span>
            <span class="spec-value">${product.location || '—'}</span>
          </div>
          <div class="spec-row">
            <span class="spec-label">Condizione</span>
            <span class="spec-value">${product.condition || '—'}</span>
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
          <strong>Annuncio verificato</strong>
          <p>Descrizione chiara, foto reali e contatto diretto. Disponibili foto extra e dettagli aggiuntivi su richiesta.</p>
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
    const safe = String(src || '').replace(/^\//, '');
    if (main) main.src = safe;
    if (source) {
      if (safe.toLowerCase().endsWith('.webp')) source.srcset = safe;
      else source.removeAttribute('srcset');
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
        "name": "ENS Vintage"
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
    document.title = `${product.name} — ENS Vintage`;

    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', product.name);

    const metaDesc = document.querySelector('meta[name="description"]');
    const ogDesc = document.querySelector('meta[property="og:description"]');
    const desc = String(product.description || '');
    const shortDesc = desc.length > 160 ? desc.substring(0, 157) + '...' : desc;

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

  loadFavorites() {
    try {
      const raw = localStorage.getItem('ens_favorites');
      const list = raw ? JSON.parse(raw) : [];
      this.favorites = new Set(Array.isArray(list) ? list : []);
    } catch {
      this.favorites = new Set();
    }
  },

  saveFavorites() {
    localStorage.setItem('ens_favorites', JSON.stringify(Array.from(this.favorites)));
  },

  isFavorite(id) {
    return this.favorites.has(id);
  },

  toggleFavorite(id) {
    if (this.favorites.has(id)) this.favorites.delete(id);
    else this.favorites.add(id);
    this.saveFavorites();
    this.detectPage();
  },

  getProductSection(product) {
    if (product && typeof product.section === 'string' && product.section.trim()) {
      return product.section.trim();
    }
    const antiqueCategories = new Set(['mobili', 'arte', 'ceramica', 'orologeria', 'gioielli', 'oggetti']);
    return antiqueCategories.has(product.category) ? 'antiquariato' : 'usato';
  },

  formatSection(section) {
    const map = {
      antiquariato: 'Antiquariato',
      usato: 'Usato'
    };
    return map[section] || section || '—';
  },

  getPostedTimestamp(product) {
    const raw = product && product.postedAt ? String(product.postedAt) : '';
    const ts = raw ? Date.parse(raw) : NaN;
    if (Number.isFinite(ts)) return ts;
    return (product && typeof product.id === 'number') ? product.id : 0;
  },

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
      oggetti: 'Oggetti e curiosita',
      moda: 'Moda',
      elettronica: 'Elettronica',
      casa: 'Casa',
      sport: 'Sport e tempo libero',
      auto: 'Auto e moto',
      bimbi: 'Bimbi',
      collezionismo: 'Collezionismo',
      libri: 'Libri',
      altro: 'Altro'
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
    const homeSearchForm = document.getElementById('home-search-form');
    if (homeSearchForm) {
      homeSearchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const q = document.getElementById('home-q')?.value.trim() || '';
        const section = document.getElementById('home-section')?.value || '';
        const location = document.getElementById('home-location')?.value.trim() || '';
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (section) params.set('section', section);
        if (location) params.set('location', location);
        const hash = params.toString();
        window.location.href = `catalogo.html${hash ? `#${hash}` : ''}`;
      });
    }

    if (window.location.pathname.includes('catalogo')) {
      const search = document.getElementById('search');
      const section = document.getElementById('section');
      const location = document.getElementById('location');
      const onlyFavorites = document.getElementById('only-favorites');
      const category = document.getElementById('category');
      const sort = document.getElementById('sort');
      const status = document.getElementById('status');
      const resetBtn = document.getElementById('reset-filters');
      const openFiltersBtn = document.getElementById('filters-open');
      const closeFiltersBtn = document.getElementById('filters-close');
      const filtersBackdrop = document.getElementById('filters-backdrop');

      [search, section, location, onlyFavorites, category, sort, status].forEach(el => {
        if (el) el.addEventListener('change', () => this.applyFilters());
      });

      if (search) search.addEventListener('keyup', () => this.applyFilters());
      if (location) location.addEventListener('keyup', () => this.applyFilters());
      if (resetBtn) resetBtn.addEventListener('click', () => {
        if (search) search.value = '';
        if (section) section.value = '';
        if (location) location.value = '';
        if (onlyFavorites) onlyFavorites.checked = false;
        if (category) category.value = '';
        if (sort) sort.value = 'recenti';
        if (status) status.value = '';
        this.applyFilters();
      });

      const openFilters = () => document.body.classList.add('filters-open');
      const closeFilters = () => document.body.classList.remove('filters-open');

      if (openFiltersBtn) openFiltersBtn.addEventListener('click', openFilters);
      if (closeFiltersBtn) closeFiltersBtn.addEventListener('click', closeFilters);
      if (filtersBackdrop) filtersBackdrop.addEventListener('click', closeFilters);
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeFilters();
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
