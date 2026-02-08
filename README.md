# Antiquariato Shop - README

**E-commerce statico per antiquariato. Nessun backend, nessun database. Pronto per GitHub Pages (gratis).**

---

## 🚀 Quick Start (Locale)

### 1. Avvia server locale
```bash
cd /Users/selene/Desktop/antiquariato-shop
python3 -m http.server 8000
```

Visita: **http://localhost:8000**

---

## 🌐 Pubblicazione Gratis (GitHub Pages)

- Repository: `Egly87/ensantiquarato.github.io`
- URL pubblico: `https://egly87.github.io/ensantiquarato.github.io/`
- Admin annunci: `https://egly87.github.io/ensantiquarato.github.io/admin-products.html`

Il repository include workflow automatico in `.github/workflows/github-pages.yml`: a ogni push su `main` il sito viene pubblicato su GitHub Pages.

### Flusso annunci consigliato
1. Apri `admin-products.html` e crea/modifica i prodotti.
2. Clicca `Scarica products.json`.
3. Sostituisci `data/products.json` con il file scaricato.
4. Esegui `git add data/products.json && git commit -m "Aggiorna annunci" && git push origin main`.

### 2. Alternative per test locale

**Con Node.js (serve)**:
```bash
npm install -g serve
serve -s .
```

**Con PHP**:
```bash
php -S localhost:8000
```

---

## 📁 Struttura File

```
antiquariato-shop/
├── index.html                Home + Featured
├── catalogo.html             Catalog con filtri
├── prodotto.html             Dettaglio prodotto (parametro ?id=1)
├── contatti.html             Contatti + Form
├── privacy.html              Privacy Policy
├── termini.html              Termini e Condizioni
├── robots.txt                Configurazione SEO crawlers
├── sitemap.xml               Mappa sito (per Google)
├── manifest.webmanifest      PWA metadata
├── sw.js                     Service Worker (cache offline)
├── README.md                 Questo file
├── CHECKLIST.md              Checklist pre-launch
├── CODEX_BRIEF.md            Specifica tecnica
├── css/
│   └── styles.css            Stili dark luxury (mobile-first)
├── js/
│   └── app.js                Logica app (fetch, filtri, routing)
├── data/
│   └── products.json         Catalogo prodotti (JSON)
└── assets/
    ├── brand/
    │   ├── logo.svg          (SOSTITUISCI: il tuo logo)
    │   ├── favicon.png       (SOSTITUISCI: favicon 192x192+)
    │   └── og.jpg            (SOSTITUISCI: OpenGraph image 1200x630)
    └── products/
        ├── como-luigi-xvi.jpg        (AGGIUNGI: foto prodotti)
        ├── dipinto-romantico.jpg
        └── ...
```

---

## 🛠️ Modifiche Prima del Deploy

### 1️⃣ Dominio
Sostituisci `TUODOMINIO.com` in questi file:

**robots.txt** (riga 6):
```plaintext
Sitemap: https://TUODOMINIO.com/sitemap.xml  ← Cambia qui
```

**sitemap.xml** (multiple):
```xml
<loc>https://TUODOMINIO.com/</loc>  ← Cambia qui in tutte le URL
```

**index.html** (riga 11):
```html
<meta property="og:url" content="https://TUODOMINIO.com">  ← Cambia
<meta property="og:image" content="https://TUODOMINIO.com/assets/brand/og.jpg">  ← Cambia
```

Fai lo stesso in: `catalogo.html`, `prodotto.html`, `contatti.html`, `privacy.html`, `termini.html`

### 2️⃣ Logo e Favicon
Sostituisci i file in `/assets/brand/`:
- **logo.svg**: SVG del tuo logo (app logo, 40x40 min)
- **favicon.png**: Icona (192x192 e 512x512)
- **og.jpg**: Immagine OpenGraph (1200x630 per social sharing)

### 3️⃣ Contatti
Modifica **contatti.html** (cerca e sostituisci):
- `info@TUODOMINIO.com` → Tua email reale
- `+39 XXX XXX XXXX` → Tuo telefono reale
- `39XXXXXXXXX` → Tuo numero WhatsApp (senza +)

### 4️⃣ Prodotti
Aggiungi/modifica in **data/products.json**:

```json
{
  "id": 1,
  "name": "Nome Prodotto",
  "category": "mobili|arte|ceramica|orologeria|gioielli|oggetti",
  "description": "Descrizione...",
  "price": 1500.00,
  "year": "1950-1970",
  "dimensions": "L 100cm × H 80cm × P 50cm",
  "status": "available|reserved|sold",
  "featured": true/false,
  "image": "assets/products/foto.jpg",
  "gallery": ["assets/products/foto.jpg", "..."],
  "stripeLinkBuy": "https://buy.stripe.com/test_...",
  "paypalBuy": "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&...",
  "whatsappText": "Mi interessa il mio prodotto..."
}
```

**Passi**:
1. Aggiorna `/data/products.json` con i tuoi prodotti
2. Aggiungi foto in `/assets/products/nomefile.jpg`
3. Configura link Stripe + PayPal (vedi sotto)

### 5️⃣ Privacy e Termini
Modifica **privacy.html** e **termini.html**:
- Aggiungi indirizzo legale
- Aggiungi DPO (se obbligatorio)
- Personalizza info GDPR

---

## 💳 Configurare Pagamenti

### Stripe Payment Links
1. Vai a [dashboard.stripe.com](https://dashboard.stripe.com)
2. Crea un "Payment Link" per ogni prodotto
3. Copia il link in `stripeLinkBuy` (example):
   ```
   https://buy.stripe.com/test_4eEeUfaEJcY88000AA
   ```

### PayPal Standard
Sostituisci `TUOEMAIL@paypal.com` e compila i campi:
```
https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=tuoemail@paypal.com&item_name=Comò+Luigi+XVI&amount=2400.00&currency_code=EUR&return=https://tuodominio.com/grazie.html&cancel_return=https://tuodominio.com/catalogo.html
```

---

## 🎯 Aggiungere un Prodotto (Passo Passo)

1. **Apri `data/products.json`** in editor di testo (VS Code, Sublime, etc.)

2. **Copia questo blocco**:
   ```json
   {
     "id": 7,
     "name": "NUOVO NOME PRODOTTO",
     "category": "mobili",
     "description": "Descrizione breve...",
     "price": 1000.00,
     "year": "1950-1970",
     "dimensions": "L 100cm × H 80cm × P 50cm",
     "status": "available",
     "featured": false,
     "image": "assets/products/nuovo-prodotto.jpg",
     "gallery": ["assets/products/nuovo-prodotto.jpg"],
     "stripeLinkBuy": "https://buy.stripe.com/test_...",
     "paypalBuy": "https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&...",
     "whatsappText": "Mi interessa il nuovo prodotto..."
   },
   ```

3. **Aggiungi prima dell'ultima `}`** chiusura dell'array

4. **Salva file**

5. **Aggiungi foto**: Metti la foto in `/assets/products/nuovo-prodotto.jpg`

6. **Ricarica sito** (F5 nel browser)

**Nota**: L'ID deve essere unico. Incrementa da quello precedente.

---

## 📱 Mobile-First (Testare)

Tutti i file sono ottimizzati per mobile (360px+). Testa in:
- Browser desktop (F12 → Responsive Design Mode)
- Vero dispositivo mobile (iPhone, Android)

Breakpoints:
- **Mobile**: < 480px → 1 colonna
- **Tablet**: 480-768px → 2-3 colonne
- **Desktop**: > 768px → 3-4 colonne

---

## 🚀 Deploy su Cloudflare Pages

**→ Leggi [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) per istruzioni complete.**

### Metodo 1: GitHub (Consigliato)
1. **Push su GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/TUOUSERNAME/antiquariato-shop.git
   git push -u origin main
   ```

2. **Collega a Cloudflare**:
   - Vai a [dash.cloudflare.com](https://dash.cloudflare.com)
   - Pages → Connetti repository
   - Seleziona `antiquariato-shop`
   - Build command: (vuoto)
   - Output directory: `.` (root)
   - Deploy!

### Metodo 2: Upload Diretto
1. Vai a [dash.cloudflare.com](https://dash.cloudflare.com) → Pages
2. Crea progetto nuovo
3. Drag & drop cartella intera
4. Deploy automatico

### Metodo 3: Altre Piattaforme
- **Netlify**: [netlify.com](https://netlify.com) → Connect to Git (stessa procedura)
- **Vercel**: [vercel.com](https://vercel.com)
- **GitHub Pages**: Attiva su repository Settings → Pages
- **Surge.sh**: `npm install -g surge && surge`

---

## 🔍 SEO Checklist

- ✅ `robots.txt`: Configurato
- ✅ `sitemap.xml`: Aggiornato con tuo dominio
- ✅ Meta titles: Unici per pagina
- ✅ Meta descriptions: Descrittivi
- ✅ OpenGraph: Immagine 1200x630 in `/assets/brand/og.jpg`
- ✅ Schema.org: Product structured data
- ✅ Canonical URLs: Presenti
- ✅ Mobile-friendly: Responsive design
- ✅ Pagamenti: Link Stripe + PayPal
- ✅ Contatti: Email, telefono, WhatsApp

**Submit a Google Search Console**: [search.google.com/search-console](https://search.google.com/search-console)

---

## 🔧 Troubleshooting

### "Errore caricamento prodotti"
- Controlla che `/data/products.json` esista e sia valid JSON
- Apri Developer Tools (F12) → Console → Cerca errori

### "Pulsanti pagamento non funzionano"
- Verifica che `stripeLinkBuy` e `paypalBuy` siano URL validi
- Copia URL direttamente da Stripe/PayPal dashboard

### "Stili non caricano"
- Controlla path: deve essere `/css/styles.css` (con slash davanti)
- Svuota cache browser: `Ctrl+Shift+Del`

### "Immagini non si vedono"
- Verifica che file esista in `/assets/products/nomefile.jpg`
- Controlla path in `data/products.json` (deve essere `assets/products/...`)

---

## 📞 Supporto

Per domande sulla configurazione, leggi:
1. **CODEX_BRIEF.md** - Specifica tecnica completa
2. **CHECKLIST.md** - Checklist pre-launch

---

## 📝 License

Progetto gratuito per uso personale/commerciale. Nessuna restrizione.

---

**Versione**: 1.0.0  
**Creato**: 28 gennaio 2026  
**Tema**: Dark Luxury Minimalist  
**Stack**: HTML/CSS/JavaScript (Zero Dependencies)

---

## Gestione catalogo con `admin.html`

- `admin.html` è uno strumento locale (offline) per creare blocchi JSON prodotto compatibili con `data/products.json`.
- Non pubblicare `admin.html` su un sito pubblico: il file include un avviso "TOOL LOCALE" e il `meta` `noindex`.
- Uso rapido:
   1. Avvia un server statico nella cartella del progetto:
       ```bash
       cd /Users/selene/Desktop/antiquariato-shop
       python3 -m http.server 8000
       ```
   2. Apri `http://localhost:8000/admin.html` nel browser.
   3. Compila il form e clicca `Genera JSON` per vedere il blocco JSON nella textarea.
   4. Clicca `Copia JSON` per copiarlo negli appunti (o copia manualmente dalla textarea).
   5. (Bonus) Carica il tuo `products.json` nella colonna di destra, poi clicca `Aggiungi prodotto al file` per aggiungerlo all'array in memoria e infine `Scarica products.json aggiornato` per scaricare il file aggiornato sul tuo computer.

Notes:
- L'operazione di aggiornamento è completamente client-side: il file viene scaricato dal browser, non è scrittura sul server.
- Se l'`id` del prodotto rischia di duplicare un `id` esistente nel file caricato, il tool aggiunge un suffisso numerico per renderlo unico e mostra una notifica.
