# ✅ CHECKLIST PRE-LAUNCH - Antiquariato Shop

Usa questa checklist per preparare il sito prima del deploy in produzione.

---

## 🎨 BRAND & VISUAL

- [ ] **Logo**: `/assets/brand/logo.svg` caricato (40x40 minimo, SVG preferred)
- [ ] **Favicon**: `/assets/brand/favicon.png` (192x192 + 512x512 recommended)
- [ ] **OG Image**: `/assets/brand/og.jpg` (1200x630 esatto per social sharing)
- [ ] **Dark theme testato**: Colori visibili su sfondo scuro
- [ ] **Font system UI**: No custom font da CDN (performance)

---

## 🛍️ CATALOGO PRODOTTI

- [ ] **6+ prodotti in `/data/products.json`**
- [ ] **Foto prodotti aggiunte**: `/assets/products/*.jpg` (almeno la prima per ogni pezzo)
- [ ] **Prezzi reali**: Non placeholder
- [ ] **Descrizioni complete**: Minimo 50 caratteri
- [ ] **Status verificati**: Almeno 1 `available`, 1 `reserved`, 1 `sold`
- [ ] **Featured**: Minimo 2 prodotti con `"featured": true`
- [ ] **Gallery**: Almeno 2 foto per prodotto se possibile
- [ ] **Dimensioni/Periodo**: Compilati per SEO
- [ ] **JSON valido**: Testa su [jsonlint.com](https://jsonlint.com)

---

## 💳 PAGAMENTI

- [ ] **Link Stripe**: Ogni prodotto `available` ha link valido
  - [ ] Testato il link (apre pagina pagamento)
  - [ ] Test mode (test card: 4242 4242 4242 4242)
- [ ] **Link PayPal**: Ogni prodotto `available` ha link valido
  - [ ] Testato il link (apre pagina PayPal)
- [ ] **WhatsApp**: Numero compilato per `reserved` e `sold`
  - [ ] Numero nel formato corretto: `39XXXXXXXXX` (senza +, senza spazi)

---

## 📧 CONTATTI

- [ ] **Email**: `info@TUODOMINIO.com` → Sostituita con vera email
- [ ] **Telefono**: `+39 XXX XXX XXXX` → Numero reale
- [ ] **WhatsApp**: Numero reale
- [ ] **Form di contatto**: Placeholder dichiarato (nota visibile)
- [ ] **Backend email**: Configurato (Formspree/Netlify Forms/Backend custom) OPPURE nota chiara che è placeholder

---

## 🌐 DOMINIO & SEO

- [ ] **Dominio registrato**: Vero dominio (non `example.com`)
- [ ] **`robots.txt`**: Dominio aggiornato
- [ ] **`sitemap.xml`**: Dominio aggiornato + incluso tutti prodotti
- [ ] **Meta titles**: Unici e descrittivi per ogni pagina
  - [ ] Home: "Antiquariato Shop — Pezzi unici..."
  - [ ] Catalogo: "Catalogo — Antiquariato Shop"
  - [ ] Dettagli: "[Nome Prodotto] — Antiquariato Shop"
  - [ ] Contatti: "Contatti — Antiquariato Shop"
  - [ ] Privacy: "Privacy — Antiquariato Shop"
  - [ ] Termini: "Termini — Antiquariato Shop"

- [ ] **Meta descriptions**: Compilate (120-160 char) per ogni pagina
- [ ] **OpenGraph**: Immagini configurate per social sharing
- [ ] **Canonical URLs**: Presenti in tutti HTML (con vero dominio)
- [ ] **Schema.org Product**: JSON-LD nella pagina dettagli prodotto
- [ ] **Struttura URL**: Clean (no parametri querystring strane)

---

## 📱 MOBILE & RESPONSIVE

- [ ] **Testato su 360px** (mobile small)
- [ ] **Testato su 480px** (mobile)
- [ ] **Testato su 768px** (tablet)
- [ ] **Testato su 1200px** (desktop)
- [ ] **Navbar sticky**: Funziona su mobile
- [ ] **Filtri catalogo**: Leggibili su mobile (sidebar not overlapping)
- [ ] **Immagini**: Scalano correttamente (no overflow)
- [ ] **Bottoni**: Tappatili con dito (minimo 48x48px)
- [ ] **Form**: Input leggibili, label visibili
- [ ] **Colori contrasto**: WCAG AA (contrast ratio >= 4.5:1 for text)

---

## ⚡ PERFORMANCE

- [ ] **CSS**: Minificato (o rimarrà così, è già efficiente)
- [ ] **JavaScript**: Vanilla (zero dipendenze)
- [ ] **Immagini**: Compresse (no >500KB)
  - [ ] JPG/PNG optimizzati con TinyPNG o ImageOptim
- [ ] **SVG placeholder**: Non convertiti a raster
- [ ] **Font**: System UI (no @import da Google)
- [ ] **Caricamento lazy**: Non necessario per questa scala

---

## 🔐 PRIVACY & LEGAL

- [ ] **Privacy Policy**: Completata con:
  - [ ] Titolare trattamento (nome, indirizzo, email, telefono)
  - [ ] Dati raccolti (nome, email, indirizzo, pagamenti)
  - [ ] Finalità del trattamento
  - [ ] Base legale (GDPR articoli)
  - [ ] Diritti interessato (accesso, rettifica, cancellazione)
  - [ ] Cookie policy
  - [ ] Conservazione dati

- [ ] **Termini & Condizioni**: Completati con:
  - [ ] Descrizione prodotti e disponibilità
  - [ ] Prezzi in EUR
  - [ ] Condizioni acquisto
  - [ ] Spedizioni e consegne
  - [ ] Resi e rimborsi (7 giorni?)
  - [ ] Garanzie e non-garanzie
  - [ ] Limitazione responsabilità
  - [ ] Legge applicabile (italiana?)

- [ ] **Cookie consent**: Banner visibile (opzionale, non obbligatorio per sito statico)

---

## 🧪 FUNZIONALITÀ

- [ ] **Link Home → Catalogo**: Funziona
- [ ] **Link Catalogo → Dettagli**: Funziona (`?id=N` corretto)
- [ ] **Filtri catalogo**: 
  - [ ] Ricerca testo: filtra per nome + descrizione
  - [ ] Filtro categoria: mostra solo categoria selezionata
  - [ ] Ordinamento: recenti, prezzo asc, prezzo desc
  - [ ] Filtro stato: available, reserved, sold
  - [ ] Reset filtri: azzera tutto
- [ ] **Featured products**: 2 prodotti in home
- [ ] **Pagina dettagli prodotto**:
  - [ ] Gallery thumbnails (placeholder SVG funziona)
  - [ ] Specs table: categoria, periodo, dimensioni, stato
  - [ ] Badge status colore giusto
  - [ ] Bottoni acquisto visible solo se `available`
  - [ ] "Richiedi Informazioni" visible solo se `reserved`|`sold`
  - [ ] Back link funziona
  - [ ] JSON-LD schema presente (Inspector Dev)
- [ ] **Contatti**:
  - [ ] Email link funziona (mailto:)
  - [ ] Telefono link funziona (tel:)
  - [ ] WhatsApp link funziona (wa.me)
  - [ ] Form submit (alert placeholder OK per MVP)
- [ ] **Footer**: Link navigazione funzionano
- [ ] **Service Worker**: Registrato (visibile in DevTools → Application)

---

## 🔍 VALIDATION & ERRORS

- [ ] **HTML valido**: Nessun errore su [w3.org/validator](https://validator.w3.org)
  - [ ] Testa almeno: index.html, catalogo.html, prodotto.html
  
- [ ] **CSS valido**: Nessun errore su [jigsaw.w3.org/css-validator](https://jigsaw.w3.org/css-validator/)
  
- [ ] **JavaScript**: Nessun errore in console (F12 → Console)
  - [ ] Warn su Service Worker OK (ignore)
  - [ ] No red errors
  
- [ ] **JSON prodotti**: Valido su [jsonlint.com](https://jsonlint.com)
  
- [ ] **Links rotti**: No 404 per asset (F12 → Network, carica tutto)
  - [ ] CSS carica: `/css/styles.css` ✓
  - [ ] JS carica: `/js/app.js` ✓
  - [ ] JSON carica: `/data/products.json` ✓
  - [ ] Logo carica: `/assets/brand/logo.svg` ✓

---

## 📊 ANALYTICS (OPZIONALE)

- [ ] **Google Analytics**: Tag installato (opzionale, raccomandata se vuoi tracciare)
- [ ] **Google Search Console**: Sitemap submitted (opzionale ma consigliata)

---

## 🚀 DEPLOYMENT

- [ ] **Repository Git**: Creato (GitHub / GitLab)
- [ ] **Build command**: Vuoto (è statico, no build step)
- [ ] **Output directory**: `.` (root directory)
- [ ] **Cloudflare Pages**: Connesso e primo deploy OK
- [ ] **Domini**: DNS configurati (se dominio esterno)
  - [ ] `@` punti a Cloudflare Pages
  - [ ] `www` redirecta a root
- [ ] **HTTPS**: Automatico su Cloudflare (predefinito)
- [ ] **Certificato SSL**: Valido (Cloudflare gestisce)
- [ ] **Production URL**: Testato e accessibile

---

## 🎯 FINAL CHECKS

- [ ] **Sito visibile in incognito** (no cache issues)
- [ ] **Link social sharing**: Immagine OG visibile su Facebook/Twitter
- [ ] **Velocità**: PageSpeed Insights >= 80/100 (oppure 70+ OK per MVP)
- [ ] **Sito non broken** dopo deploy: Visita tutte le pagine

---

## ✅ READY FOR LAUNCH!

Se tutto è checked:
1. Annuncia sui social
2. Submitti sitemap a Google Search Console
3. Attendi indicizzazione (1-2 settimane)
4. Monitora Analytics
5. Raccogli feedback clienti

---

**Data di check**: _______________  
**Chi ha controllato**: _______________  
**Note**: _______________

---

*Per dubbi, vedi README.md e CODEX_BRIEF.md*