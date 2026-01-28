# CODEX_BRIEF - Antiquariato Shop

**Progetto**: E-commerce statico per antiquariato (Cloudflare Pages)  
**Data**: 28 gennaio 2026  
**Status**: ✅ Completo (versione MVP)

---

## 📋 SPECIFICA TECNICA

### Stack
- **Frontend**: HTML5, CSS3 (mobile-first, dark theme)
- **JS**: Vanilla JavaScript (zero dipendenze)
- **Data**: JSON statico (`/data/products.json`)
- **Hosting**: Cloudflare Pages
- **PWA**: Service Worker + Manifest

### Struttura

```
antiquariato-shop/
├── index.html              (Home + Featured)
├── catalogo.html           (Catalog + Filters)
├── prodotto.html           (Product Detail + Schema.org)
├── contatti.html           (Contact Form + Social)
├── privacy.html            (Privacy Policy)
├── termini.html            (Terms & Conditions)
├── robots.txt              (SEO)
├── sitemap.xml             (SEO + Paginated)
├── manifest.webmanifest    (PWA)
├── sw.js                   (Service Worker)
├── CODEX_BRIEF.md          (This file)
├── README.md               (Setup + Deployment)
├── CHECKLIST.md            (Pre-launch)
├── css/
│   └── styles.css          (Dark luxury, responsive)
├── js/
│   └── app.js              (Fetch, render, filters)
├── data/
│   └── products.json       (6 demo products + structure)
├── assets/
│   ├── brand/              (logo.svg, favicon.png, og.jpg)
│   └── products/           (Product images - reference only)
```

### Design System

**Colors** (Dark Luxury Theme):
- Primary BG: `#0f0f0f`
- Secondary BG: `#1a1a1a`
- Tertiary BG: `#2a2a2a`
- Text Primary: `#ffffff`
- Text Secondary: `#b0b0b0`
- Accent (Gold): `#D4AF37`
- Borders: `#333333`

**Typography**:
- Font Family: System UI `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto`
- H1: 2.5rem, Bold
- H2: 2rem, Bold
- Body: 1rem, 1.6 line-height

**Responsive Breakpoints**:
- Mobile: < 480px
- Tablet: 480px - 768px
- Desktop: > 768px

---

## 🛍️ PRODOTTI (6 Demo)

| ID | Nome | Categoria | Prezzo | Status | Featured |
|----|------|-----------|--------|--------|----------|
| 1 | Comò Luigi XVI Intarsiato | mobili | €2400 | available | ✅ |
| 2 | Dipinto Olio Romantico | arte | €1800 | available | ✅ |
| 3 | Servizio Porcellana Meissen | ceramica | €950 | reserved | ❌ |
| 4 | Orologio Art Déco | orologeria | €680 | available | ❌ |
| 5 | Candelabro Cristallo Boemia | oggetti | €450 | sold | ❌ |
| 6 | Collana Oro Granati | gioielli | €1200 | available | ❌ |

**Status**:
- `available`: Acquistabile (bottoni Stripe + PayPal visibili)
- `reserved`: Riservato (solo "Richiedi Informazioni" via WhatsApp)
- `sold`: Venduto (prezzo "--", no bottoni acquisto)

**Schema JSON**:
```json
{
  "id": 1,
  "name": "...",
  "category": "mobili|arte|ceramica|orologeria|gioielli|oggetti",
  "description": "...",
  "price": 0.00,
  "year": "YYYY-YYYY",
  "dimensions": "L x H x P",
  "status": "available|reserved|sold",
  "featured": true|false,
  "image": "assets/products/filename.jpg",
  "gallery": ["assets/products/..."],
  "stripeLinkBuy": "https://buy.stripe.com/...",
  "paypalBuy": "https://www.paypal.com/cgi-bin/...",
  "whatsappText": "Mi interessa..."
}
```

---

## 🎨 UI/UX Features

### Home (index.html)
- ✅ Hero sticky navbar con logo + menu
- ✅ Hero section con CTA
- ✅ "In Evidenza" (featured products, 2 pezzi)
- ✅ CTA secondary (link catalogo + contatti)
- ✅ Footer con link rapidi

### Catalogo (catalogo.html)
- ✅ Sidebar filtri: Ricerca testo, Categoria, Ordinamento (recenti/prezzo), Stato
- ✅ Conteggio risultati dinamico
- ✅ Griglia responsiva (2 col mobile, 3 col tablet, 4 col desktop)
- ✅ Badge status per ogni card
- ✅ Hover effect con ombra e lift

### Dettaglio Prodotto (prodotto.html)
- ✅ Querystring: `?id=1` per caricare il prodotto
- ✅ Gallery (main + thumbnails, placeholder SVG)
- ✅ Specs table: categoria, periodo, dimensioni, stato
- ✅ Pulsanti acquisto (Stripe + PayPal) se `available`
- ✅ Pulsante "Richiedi Informazioni" (WhatsApp) se `reserved|sold`
- ✅ JSON-LD schema.org Product per SEO
- ✅ Back link al catalogo

### Contatti (contatti.html)
- ✅ Card: Email, Telefono, WhatsApp
- ✅ Form di contatto (placeholder - configura backend)
- ✅ Link `mailto:`, `tel:`, `wa.me`

### Privacy / Termini
- ✅ Placeholder ordinato e legale (GDPR, T&C, resi, spedizioni)
- ✅ Sezioni numerate
- ✅ Link contatti

---

## 🔍 SEO & Performance

### Meta Tags
- ✅ `<title>` unico per pagina
- ✅ `<meta name="description">`
- ✅ OpenGraph (og:title, og:description, og:url, og:image)
- ✅ `<link rel="canonical">`
- ✅ `<meta name="theme-color">` (dark mode)

### Schema.org
- ✅ Store (homepage)
- ✅ Product (detail page, con price + availability)

### Robots & Sitemap
- ✅ `robots.txt`: Allow all, Sitemap link, Crawl-delay: 1
- ✅ `sitemap.xml`: 11 URL con priority, changefreq, lastmod

### Performance
- ✅ Nessun CDN esterno (solo Font System UI)
- ✅ CSS minificabile (già ottimizzato)
- ✅ JS vanilla, no jQuery/Bootstrap
- ✅ SVG placeholder (non JPEG/PNG, più leggeri)
- ✅ Service Worker per caching offline

### PWA
- ✅ `manifest.webmanifest`: App metadata
- ✅ `sw.js`: Cache-first strategy con network fallback
- ✅ Installabile su mobile

---

## 📱 Responsive Design

| Device | Grid | Navbar | Sidebar |
|--------|------|--------|---------|
| Mobile (< 480px) | 1 col | Vertical | Hidden / Stack |
| Tablet (480-768px) | 2-3 col | Sticky | Side |
| Desktop (> 768px) | 3-4 col | Sticky | Side |

---

## 🔗 Link Pagamenti (Placeholder)

Modifica in `data/products.json`:

### Stripe Payment Links
```
https://buy.stripe.com/test_XXXXXXXXXXXX
```
[Crea link su dashboard.stripe.com](https://dashboard.stripe.com)

### PayPal Standard
```
https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=TUOEMAIL@paypal.com&item_name=NOME+PRODOTTO&amount=PREZZO&currency_code=EUR
```

### WhatsApp
```
https://wa.me/39XXXXX?text=Mi%20interessa...
```

---

## 🚀 Deployment

### Cloudflare Pages (Consigliato)
1. Collega repository GitHub
2. Branch: `main` (default)
3. Build command: (vuoto, è statico)
4. Output directory: `.` (root)
5. Deploy automatico per ogni push

### Alternative
- Netlify (stessa procedura)
- GitHub Pages (stessa procedura)
- S3 + CloudFront
- Surge.sh

---

## 🎯 Checklist Pre-Launch

- [ ] Dominio: aggiorna `TUODOMINIO.com` in:
  - robots.txt
  - sitemap.xml
  - index.html (og:url, canonical)
  - Tutti gli HTML (og:url)
  - Contatti.html (email, tel, WhatsApp)

- [ ] Logo: `/assets/brand/logo.svg` (192x192 min)
- [ ] Favicon: `/assets/brand/favicon.png` (512x512)
- [ ] OG Image: `/assets/brand/og.jpg` (1200x630)

- [ ] Prodotti:
  - Aggiungi foto in `/assets/products/`
  - Aggiorna `data/products.json` con path veri
  - Configura Stripe + PayPal links

- [ ] Contatti:
  - Email: info@tuodominio.com
  - Tel: +39 XXX XXX XXXX
  - WhatsApp link

- [ ] Privacy/Termini:
  - Inserisci indirizzo legale
  - Aggiungi DPO (Data Protection Officer) se > 250 dipendenti
  - Review legale

- [ ] Form contatti:
  - Integrare Formspree, Netlify Forms, o backend custom
  - GDPR consent checkbox

---

## 📝 Note Sviluppo

### Aggiungere un prodotto
Modifica `data/products.json`:
```json
{
  "id": 7,
  "name": "Nuovo Pezzo",
  "category": "mobili",
  "description": "...",
  "price": 999.00,
  "year": "1950-1960",
  "dimensions": "L 100cm × H 80cm × P 50cm",
  "status": "available",
  "featured": false,
  "image": "assets/products/nuovo-pezzo.jpg",
  "gallery": ["assets/products/nuovo-pezzo.jpg"],
  "stripeLinkBuy": "https://buy.stripe.com/...",
  "paypalBuy": "https://www.paypal.com/...",
  "whatsappText": "Mi interessa il Nuovo Pezzo..."
}
```

### Modificare categorie
Aggiorna `<select id="category">` in `catalogo.html`.

### Cambiar colori
Modifica `:root` in `css/styles.css`:
```css
--accent-gold: #D4AF37;  /* Colore principale */
--bg-primary: #0f0f0f;   /* Sfondo scuro */
```

### Test offline
Il Service Worker casha automaticamente. Apri DevTools → Application → Service Workers → Offline → Ricarica.

---

## ⚠️ Limitazioni & Future

### MVP (Attuale)
- ❌ Niente carrello/checkout (solo external payment links)
- ❌ Niente ordini/tracking (comunicazione via email/WhatsApp)
- ❌ Niente recensioni (add later via third-party)
- ❌ Niente ricerca full-text (client-side only)

### Future
- ✨ Backend (ordini, email, SMS)
- ✨ Wishlist (localStorage)
- ✨ Ricerca avanzata (Algolia)
- ✨ Reviews (Trustpilot, Google)
- ✨ Analytics (Google Analytics 4)
- ✨ Notifiche (Firebase)

---

## 📚 Risorse

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Schema.org Product](https://schema.org/Product)
- [MDN Web Docs](https://developer.mozilla.org/)
- [Google Search Central](https://developers.google.com/search)
- [Stripe Payment Links](https://stripe.com/payments/payment-links)
- [PayPal Integration](https://developer.paypal.com/)

---

**Versione**: 1.0.0  
**Ultimoaggiornamento**: 28 gennaio 2026