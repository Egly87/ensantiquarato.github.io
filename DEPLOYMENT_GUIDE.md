# Deployment Guide — Antiquariato Shop

## Overview
This is a **fully static** HTML/CSS/JavaScript site hosted on **Cloudflare Pages**. No backend, no build step required (assets are pre-generated).

---

## Quick Start (5 minutes)

### 1. Prerequisites
- GitHub account (to host the repo)
- Cloudflare account (free tier is sufficient)
- Domain (optional; Cloudflare Pages provides a free `*.pages.dev` subdomain)

### 2. Push to GitHub
```bash
# Configure git (if not already done)
git config --global user.email "your-email@example.com"
git config --global user.name "Your Name"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/antiquariato-shop.git
git branch -M main
git push -u origin main
```

### 3. Connect to Cloudflare Pages
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Select **Workers & Pages** → **Pages** → **Create a project**
3. Choose **Connect to Git** and select your repository
4. Build settings:
   - **Framework preset**: None (static site)
   - **Build command**: (leave empty)
   - **Build output directory**: `/` (root folder)
5. Click **Save and Deploy**

Cloudflare will automatically deploy your site. Default URL: `https://antiquariato-shop.pages.dev`

---

## Directory Structure

```
antiquariato-shop/
├── index.html                  # Home page
├── catalogo.html               # Product catalog
├── prodotto.html               # Product detail (dynamic via JS)
├── contatti.html               # Contact page
├── privacy.html                # Privacy policy
├── termini.html                # Terms of service
├── admin.html                  # Local admin tool (NOT exposed)
├── css/
│   └── styles.css              # Main stylesheet (dark luxury theme)
├── js/
│   └── app.js                  # Product rendering & routing logic
├── data/
│   └── products.json           # Product catalog (JSON)
├── assets/
│   ├── brand/                  # Logo, OG images, favicons
│   ├── products/               # Product images (WebP + thumbnails)
│   ├── templates/              # Design templates for Canva import
│   └── icons/                  # Favicon sets
├── scripts/
│   ├── convert_images.js       # Generate product images from originals
│   ├── convert_svgs.js         # Generate brand/template raster assets
│   └── generate_placeholder_products.js
├── design/
│   └── CANVA_IMPORT_README.txt # SVG template usage guide
├── .github/
│   └── workflows/
│       └── image-conversion.yml # GitHub Actions: auto-generate images on push
├── robots.txt                  # SEO: search engine indexing rules
├── sitemap.xml                 # SEO: site structure
├── manifest.webmanifest        # PWA: install manifest
├── sw.js                       # PWA: service worker (offline support)
├── .gitignore                  # Git ignore patterns
├── package.json                # Node dependencies (sharp for image conversion)
├── package-lock.json           # Dependency lock file
├── CODEX_BRIEF.md              # Project brief
├── DEPLOYMENT_GUIDE.md         # This file
└── README.md                   # Project overview
```

---

## Features

### ✅ SEO-First
- **OpenGraph meta tags** (`og:title`, `og:description`, `og:image`, `og:url`)
- **JSON-LD structured data** (Product schema)
- **robots.txt** & **sitemap.xml** (auto-generated)
- **Semantic HTML5** (proper heading hierarchy, alt text)
- **Mobile-first responsive design**

### ✅ Performance
- **WebP images** with JPG/PNG fallbacks
- **Lazy loading** (`loading="lazy"`)
- **Optimized thumbnails** (400×400px for catalog)
- **Service Worker** for offline capability (PWA)
- **Minimal JavaScript** (vanilla ES6, no frameworks)
- **CSS Grid & Flexbox** (modern layout, no bloat)

### ✅ Accessibility
- **Semantic HTML** (`<header>`, `<nav>`, `<main>`, `<footer>`)
- **Proper color contrast** (dark luxury theme WCAG AA compliant)
- **Keyboard navigation** (all interactive elements accessible)
- **Alt text** on all images
- **ARIA labels** where appropriate

### ✅ Productivity
- **`admin.html`** — offline product JSON generator
  - Create/edit products locally
  - Copy JSON to clipboard
  - Load & append to existing `data/products.json`
  - Download updated file
- **Image automation** — Node scripts to batch-convert originals to WebP/thumbnails
- **GitHub Actions** — auto-convert images on every push (optional)

---

## Environment Variables

**This site requires NO environment variables** (fully static).

Optional: Create a `.env.example` file for future reference:

```env
# Cloudflare Pages (no secrets needed for static sites)
# This file is for documentation only.
```

---

## Building & Testing Locally

### Install Dependencies
```bash
npm install
```

### Start Local Dev Server
```bash
python3 -m http.server 8000
# Then open http://localhost:8000 in your browser
```

Or use Node's `http-server`:
```bash
npx http-server -p 8000
```

### Generate Product Images
Place original product images in `assets/products/originals/` (e.g., `1.jpg`, `2.jpg`, etc.) then run:
```bash
npm run convert-images
```

This generates:
- `assets/products/<id>_1.webp` (full size)
- `assets/products/<id>_2.webp` (variation)
- `assets/products/<id>_thumb.webp` (catalog thumbnail)

### Convert SVG Templates
```bash
node scripts/convert_svgs.js
```

Generates PNG/WebP versions of brand and Canva templates.

---

## Image Management

### Adding New Products
1. Open `/admin.html` locally (in browser)
2. Fill in product details and image URLs
3. Generate JSON block or load existing `data/products.json`
4. Copy updated JSON to clipboard or download file
5. Replace `data/products.json` with updated version

### Image Naming Convention
- **Product images**: `assets/products/<id>_1.webp`, `<id>_2.webp`, `<id>_thumb.webp`
- **Brand images**: `assets/brand/<name>.webp` (e.g., `logo-800.png`, `og-1200x630.webp`)
- **Templates**: `assets/templates/<name>.png` (for Canva import)

### Image Optimization
- **WebP format** (smallest file size, modern browsers)
- **JPG fallback** (older browsers)
- **Lazy loading** (load on demand)
- **Responsive images** (`<picture>` element with multiple sources)
- **Aspect ratio** (CSS `aspect-ratio` property prevents layout shift)

---

## Deployment Checklist

- [ ] **GitHub repository created** and code pushed
- [ ] **Cloudflare Pages project connected** to GitHub repo
- [ ] **Custom domain** assigned (optional, via Cloudflare DNS)
- [ ] **SSL/TLS certificate** auto-provisioned by Cloudflare (enabled by default)
- [ ] **Product images** uploaded and converted
- [ ] **Contact form** email integration tested (via Stripe/PayPal/WhatsApp)
- [ ] **robots.txt** verified (allows search engines)
- [ ] **sitemap.xml** verified (current product list)
- [ ] **PWA manifest** tested (add to home screen on mobile)
- [ ] **Google Analytics** (or Cloudflare Analytics) integrated (optional)
- [ ] **SEO meta tags** verified (Open Graph, JSON-LD)

---

## Troubleshooting

### Build Fails on Cloudflare Pages
**Solution**: This is a static site. Ensure **Build command** is empty and **Build output directory** is `/` (root).

### Images Not Loading
**Solution**: Verify image paths in `data/products.json` start with `assets/products/`. Check file names match `<id>_1.webp` pattern.

### Admin Tool Not Working
**Solution**: `admin.html` is a client-only tool. It stores data in browser localStorage and downloads updated JSON. Open directly in browser, not via server (or use `file://` protocol on localhost).

### PWA Service Worker Issues
**Solution**: Service worker only activates on HTTPS (Cloudflare Pages always uses HTTPS). Clear browser cache and reload.

### Contact Form Not Working
**Solution**: Contact form submits via Stripe/PayPal/WhatsApp links (no backend). Update links in `contatti.html` with real payment/messaging URLs.

---

## Performance Monitoring

### Cloudflare Analytics
1. Cloudflare Dashboard → **Websites** → Select domain
2. View **Analytics** for traffic, cache hit ratio, and performance metrics

### Google PageSpeed Insights
Test at: https://pagespeed.web.dev/
Expected score: **90+** (Lighthouse score for static sites)

### Web Vitals
- **LCP** (Largest Contentful Paint): < 2.5s
- **FID** (First Input Delay): < 100ms
- **CLS** (Cumulative Layout Shift): < 0.1
- **TTL** (Time to First Byte): < 600ms

---

## DNS & Custom Domain

### Cloudflare Nameserver Setup
1. Go to **Cloudflare Dashboard** → **Websites** → **Add site**
2. Enter your domain
3. Select a plan (Free is fine)
4. Copy Cloudflare nameservers
5. Update your domain registrar's nameserver settings
6. Wait 24–48 hours for DNS propagation

### SSL/TLS Certificate
Cloudflare auto-provisions a free SSL certificate. Ensure **SSL/TLS** is set to:
- **Flexible** (recommended for Cloudflare Pages)
- Or **Full** if you have server certificate

---

## Continuous Integration (GitHub Actions)

The repo includes `.github/workflows/image-conversion.yml` which:
1. Runs on every `push` or `pull_request`
2. Executes `scripts/convert_images.js` (requires originals in `assets/products/originals/`)
3. Commits generated images back to the repo
4. Pushes changes to `main` branch

**Note**: This is optional and requires write permissions on the repo.

---

## Backup & Disaster Recovery

### Backup Strategy
1. **Code**: GitHub repo (automatic, distributed)
2. **Images**: Committed to git or stored in `assets/` folder
3. **Product data**: `data/products.json` (JSON file, version-controlled)

### Restore
```bash
git clone https://github.com/YOUR_USERNAME/antiquariato-shop.git
cd antiquariato-shop
git checkout main
# All files restored
```

---

## Support & Maintenance

### Recommended Tools
- **VS Code** with extensions:
  - Prettier (code formatting)
  - Live Server (local preview)
  - SEO Meta Tags Preview
- **Sharp CLI** (`npm install -g sharp-cli`) for manual image conversion
- **Cloudflare Workers** (optional, for serverless functions)

### Regular Tasks
- **Weekly**: Check Cloudflare Analytics for traffic/errors
- **Monthly**: Audit product availability & pricing in `data/products.json`
- **Quarterly**: Run `npm audit` for dependency vulnerabilities
- **Annually**: Review SEO rankings & update sitemap

---

## License & Terms

This site is built with:
- **HTML5 / CSS3 / JavaScript (ES6)**
- **Sharp** (image processing)
- **Cloudflare Pages** (hosting)

All product content, descriptions, and images are owned by Antiquariato Shop. Customize per your business needs.

---

## Next Steps

1. **Push to GitHub** (see "Quick Start" section)
2. **Connect Cloudflare Pages** (see "Quick Start" section)
3. **Update product images** (see "Image Management" section)
4. **Configure custom domain** (see "DNS & Custom Domain" section)
5. **Monitor performance** (see "Performance Monitoring" section)

---

**Last Updated**: 28 January 2026  
**Version**: 1.0
