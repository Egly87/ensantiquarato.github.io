# Guida Setup Pagamenti Online - Antiquariato Shop

## 🚀 Quick Setup

Questo sito è ora pronto per accettare pagamenti online. Ci sono 3 opzioni:

### Opzione 1: Carrello + Stripe (CONSIGLIATO)
**Migliore per:** E-commerce professionali con commissioni basse (2.9%)

1. Crea account Stripe: https://dashboard.stripe.com/register
2. Vai a Settings → API Keys
3. Copia la **Publishable Key** (pk_live_...)
4. In `carrello.html`, cerca la riga `prompt('Inserisci la tua Stripe Publishable Key')`
5. Sostituisci con il tuo valore oppure usalo come prompt

### Opzione 2: Link Stripe Checkout (FACILE)
**Migliore per:** Semplice da configurare

1. In `admin-products.html`, ogni prodotto ha un campo "Link Stripe per pagamento"
2. Genera link in https://stripe.com/payments/checkout-session
3. Incolla il link nel form admin
4. I clienti cliccheranno direttamente al checkout

### Opzione 3: Link PayPal (GRATUITO)
**Migliore per:** Bassissime commissioni (1.49%) + ricevi soldi direttamente

1. Business PayPal: https://www.paypal.com/business
2. Genera link pagamento per ogni prodotto
3. Incolla in admin panel

## 💻 Configurazione Stripe (Backend)

Per pagamenti reali con carte, serve un backend:

### Con Cloudflare Workers (Gratuito):

```typescript
// wrangler.toml - aggiorna con la tua stripeKey
[env.production]
vars = { STRIPE_SECRET_KEY = "sk_live_..." }
```

```typescript
// src/worker.ts
import Stripe from 'stripe';

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const stripe = new Stripe(env.STRIPE_SECRET_KEY);

    if (req.method === 'POST') {
      const { token, amount } = await req.json();

      try {
        const charge = await stripe.charges.create({
          amount: Math.round(amount * 100), // centesimi
          currency: 'eur',
          source: token.id,
          description: 'Antiquariato Shop Order'
        });

        return new Response(JSON.stringify(charge), { status: 200 });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 400 });
      }
    }

    return new Response('Not Found', { status: 404 });
  }
};
```

## 🔐 Variabili d'Ambiente

Crea `.env` nella root (NON in git):

```env
# Stripe
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...

# PayPal
PAYPAL_CLIENT_ID=...
PAYPAL_SECRET=...

# Email (se usi backend)
SMTP_HOST=...
SMTP_USER=...
SMTP_PASS=...
```

## 📝 Aggiungere Prodotti (Admin Panel)

1. Vai a `/admin-products.html`
2. Compila il form:
   - Nome, categoria, descrizione
   - Prezzo, stato (disponibile/prenotato/venduto)
   - Link Stripe (opzionale)
   - Link PayPal (opzionale)
   - Foto
3. Clicca "Salva Prodotto"
4. I prodotti vengono salvati in LocalStorage

**⚠️ IMPORTANTE:** I prodotti in admin panel sono salvati solo nel tuo browser locale. Per sincronizzare con altri dispositivi, serve un database.

## 🌐 Deployment su Cloudflare Pages

### Step 1: Preparare il repo
```bash
cd /Users/selene/Desktop/antiquariato-shop
git add .
git commit -m "feat: add cart, admin panel, payment integration"
git push origin main
```

### Step 2: Cloudflare Pages
1. Vai a https://pages.cloudflare.com
2. Login con account Cloudflare
3. "Create a new project" → "Connect to Git"
4. Seleziona il repo `antiquariato-shop`
5. Build command: (lascia vuoto - è sito statico)
6. Publish directory: `.`
7. Click "Deploy"

### Step 3: Domain Setup (Opzionale)
- Gratis: `antiquariato-shop.pages.dev`
- Dominio custom: Aggiungi in Cloudflare → DNS

## 📱 Guida Utente Clienti

### Acquistare:
1. Vai a `/catalogo.html`
2. Clicca sul prodotto
3. Se disponibile: "Aggiungi al Carrello"
4. Vai a `/carrello.html`
5. Paga con Stripe/PayPal

### Se Riservato/Venduto:
- Click "Richiedi Informazioni" → WhatsApp diretto

## 🛠️ Troubleshooting

**Q: Non vedo i prodotti aggiunti in admin?**
- Refresha la pagina
- Admin panel usa localStorage (solo il tuo browser)
- I prodotti statici son in `/data/products.json`

**Q: PayPal link non funziona?**
- Assicurati il numero WhatsApp sia nel formato internazionale: 39XXXXXXXXX

**Q: Stripe chiede API key?**
- Normale! Il carrello chiede la key al primo pagamento
- O precompila nel codice

## 💰 Costi

| Metodo | Fee | Setup | Note |
|--------|-----|-------|------|
| **Stripe** | 2.9% | 5 min | Migliore per carta |
| **PayPal** | 1.49% | 5 min | Migliore costo |
| **WhatsApp** | 0% | Istante | Pagamento esterno |
| **Cloudflare** | $0 | Gratuito | Hosting |

## 📞 Support

Contatti in `contatti.html` sono placeholder - cambia con i tuoi dati.

---

**Prossimo step:** Decide quale metodo pagamento usare e fornisci le API keys!
