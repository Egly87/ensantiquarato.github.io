# 🎨 Antiquariato Shop - Guida Completa Setup Online

Questo è un e-commerce statico completo per antiquariato con:
- ✅ Admin panel per gestire annunci
- ✅ Catalogo con filtri
- ✅ Carrello e checkout
- ✅ Pagamenti online (Stripe/PayPal)
- ✅ PWA (funziona offline)
- ✅ SEO ottimizzato

---

## 🚀 Quick Start Online

### Opzione A: Deploy Automatico (5 min)

**Requisiti:**
- Account GitHub (gratis su github.com)
- Account Cloudflare (gratis su cloudflare.com)

**Steps:**

1. **Crea repo GitHub:**
   ```bash
   # In GitHub.com → New repository
   # Name: antiquariato-shop
   # Public
   # Initialize without README
   ```

2. **Push codice locale:**
   ```bash
   cd /Users/selene/Desktop/antiquariato-shop
   git remote add origin https://github.com/YOUR_USERNAME/antiquariato-shop.git
   git branch -M main
   git push -u origin main
   ```

3. **Deploy su Cloudflare Pages:**
   - Vai a https://pages.cloudflare.com
   - "Create a project" → "Connect to Git"
   - Seleziona `antiquariato-shop`
   - Build: lascia vuoto (è sito statico)
   - Publish: `.`
   - Deploy!

4. **Il sito è online!**
   - URL: `antiquariato-shop.pages.dev`
   - Ogni push a GitHub = auto-deploy

---

## 📝 Usare il Sito

### 1️⃣ Aggiungere Prodotti (Admin Panel)

1. Vai a `https://tuo-sito.pages.dev/admin-products.html`
2. Compila il form:
   - Nome, categoria, prezzo
   - Descrizione, foto
   - Link pagamento (Stripe/PayPal)
3. Click "Salva Prodotto"
4. I prodotti sono salvati nel tuo browser

**⚠️ IMPORTANTE:** I dati admin restano solo nel browser locale. Per sincronizzare tra dispositivi, usa:
- Cloud backup (Google Drive, iCloud)
- O collega un database (vedi sezione avanzata)

### 2️⃣ Clienti Acquistano

1. Vanno al catalogo
2. Aggiungono al carrello
3. Checkout con:
   - **Stripe**: carte creditice
   - **PayPal**: conto PayPal
   - **WhatsApp**: contatto diretto

---

## 💳 Configurare Pagamenti

### Stripe (Consigliato - 2.9% fee)

1. Crea account: https://dashboard.stripe.com
2. Vai a Developers → API Keys
3. Copia la **Publishable Key** (pk_live_...)
4. Due opzioni:

   **Opzione A: Link diretto (facile)**
   ```
   Admin panel → campo "Link Stripe per pagamento"
   Genera link: https://stripe.com/payments/checkout-session
   Incolla nel form
   ```

   **Opzione B: Carrello integrato (pro)**
   ```javascript
   // In carrello.html, cerca:
   // const stripeKey = prompt('Inserisci Stripe Key')
   // Sostituisci con: const stripeKey = 'pk_live_XXX'
   ```

### PayPal (Più economico - 1.49% fee)

1. Crea Business: https://www.paypal.com/business
2. Tools → Checkout Links
3. Genera link per ogni prodotto
4. Incolla in admin panel

---

## 🔧 Configurazione Avanzata

### Abilitare Stripe nel Carrello

```html
<!-- carrello.html -->
<script>
  // Decommentare questa riga:
  initStripe(); // Chiederà la API key al primo pagamento
</script>
```

### Collegare a un Database (Opzionale)

Attualmente i prodotti restano in **localStorage** (browser locale).

Per sincronizzare tra dispositivi, collega a:

**Option 1: Firebase (Gratis)**
```javascript
// Installa: npm install firebase
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const db = getDatabase();
db.ref('products').set(products);
```

**Option 2: Supabase**
```javascript
// Similar to Firebase, ma con PostgreSQL
import { createClient } from '@supabase/supabase-js'
```

**Option 3: Cloudflare Durable Objects (Embedded)**
Incluso in Cloudflare Pages - non serve config!

---

## 📊 Analytics & Monitoraggio

### Cloudflare Analytics (Gratis)
- Visite, traffico, paesi
- Automatico su Pages

### Google Analytics (Opzionale)
```html
<!-- Aggiungi a index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

---

## 🔒 Security

### Proteggere Admin Panel

Attualmente è pubblico! Aggiungere password:

```html
<!-- admin-products.html - all'inizio -->
<script>
  const password = prompt('Inserisci password admin:');
  if (password !== 'TUA_PASSWORD') {
    window.location.href = '/';
  }
</script>
```

### HTTPS (Automatico)
- Cloudflare Pages usa HTTPS per default ✅
- Certificati SSL gratis ✅

---

## 💰 Costi Mensili

| Servizio | Costo | Note |
|----------|-------|------|
| **Cloudflare Pages** | $0 | Hosting statico |
| **Dominio custom** | ~€10 | Opzionale (usa .pages.dev gratis) |
| **Stripe** | 2.9% | Solo per transazioni |
| **PayPal** | 1.49% | Solo per transazioni |
| **Database** | $0-10 | Se usi Firebase/Supabase |

**Budget minimo:** $0 (Cloudflare + Stripe/PayPal a commissione)

---

## 📱 Testare Localmente

```bash
cd /Users/selene/Desktop/antiquariato-shop

# Già avviato:
# python3 -m http.server 8000

# Oppure con Node:
npx serve -s .

# Vai a http://localhost:8000
```

---

## 🐛 Troubleshooting

**Q: I prodotti admin non si salvano?**
- Controlla console (F12 → Console)
- LocalStorage potrebbe essere disabilitato
- Se locale, i dati restano nel browser
- Se online su dominio diverso, localStorage è isolato

**Q: Stripe non funziona?**
- La API key deve essere la `Publishable Key` (pk_live_...)
- Non la Secret Key!
- Testa in modalità test: `pk_test_...`

**Q: Come faccio a cambiare dominio dopo?**
- In Cloudflare Pages: Settings → Domains
- O usa `TUODOMINIO.pages.dev` per sempre (gratis)

**Q: Posso aggiungere un blog?**
- Sì, crea `blog.html`
- O integra una soluzione come Markdown blog

---

## 📞 Contatti & Support

Modifica `contatti.html` con i tuoi dati:
- Email
- Telefono
- WhatsApp
- Indirizzo

---

## 🎯 Prossimi Step Consigliati

1. ✅ **Deploy online** (Cloudflare Pages)
2. ✅ **Aggiungere 5-10 prodotti** (admin panel)
3. ✅ **Configurare pagamenti** (Stripe/PayPal)
4. ⭕ **Collegare dominio custom** (opzionale)
5. ⭕ **Aggiungere newsletter** (Mailchimp)
6. ⭕ **Abilitare notifiche email** (admin → nuovi ordini)

---

## 📚 Ulteriori Risorse

- Docs Cloudflare: https://developers.cloudflare.com/pages/
- Stripe API: https://stripe.com/docs/api
- PayPal: https://developer.paypal.com
- GitHub Pages: https://pages.github.com

---

**Fatto da:** Antiquariato Shop Team
**Ultima modifica:** 29 gennaio 2026
**Versione:** 1.0 - Production Ready
