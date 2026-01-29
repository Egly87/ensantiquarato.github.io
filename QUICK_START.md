# 🗺️ MAPPA RAPIDA - Antiquariato Shop

## 🔗 LINK DIRETTI PRINCIPALI

| Cosa Fare | URL | File | Istruzioni |
|-----------|-----|------|-----------|
| **👀 Vedere il sito locale** | http://localhost:8000 | index.html | In terminale: `python3 -m http.server 8000` |
| **📝 Aggiungere prodotti** | /admin-products.html | admin-products.html | Compila form → Salva |
| **🛒 Comprare** | /catalogo.html | catalogo.html | Cerca prodotto → Aggiungi carrello |
| **💳 Pagare** | /carrello.html | carrello.html | Inserisci dati → Scegli metodo pagamento |
| **🚀 Deployare online** | DEPLOY_STEPS.md | - | Segui step 1-10 |
| **📞 Contattare** | /contatti.html | contatti.html | Modifica con email/telefono reali |
| **⚖️ Legal** | /privacy.html, /termini.html | - | Template, modifica per il tuo sito |

---

## 📚 DOCUMENTAZIONE

| Documento | Usa Per |
|-----------|---------|
| `DEPLOY_STEPS.md` | **🔴 LEGGI PRIMA** - Come mettere online il sito |
| `SETUP_GUIDE.md` | Guida completa setup, troubleshooting, database |
| `PAYMENT_SETUP.md` | Configurare Stripe, PayPal, metodi pagamento |
| `CHECKLIST.md` | Pre-launch checklist (domains, SEO, mobile, etc) |
| `FINAL_SUMMARY.md` | Riepilogo cosa è stato fatto e costi |
| `README.md` | Info generali e struttura progetto |

---

## 🛠️ COMANDI GIT UTILI

```bash
# Avvia server locale
cd /Users/selene/Desktop/antiquariato-shop
python3 -m http.server 8000

# Vedi cambiamenti locali
git status

# Pushare online (dopo modifiche)
git add .
git commit -m "descrizione cambio"
git push origin main

# Vedi cronologia
git log --oneline
```

---

## 🎯 FLUSSO OPERATIVO

### Aggiungere Prodotti
1. Vai a http://localhost:8000/admin-products.html
2. Compila il form
3. Click "Salva Prodotto"
4. Prodotto appare in catalogo

### Cliente Compra
1. Va a /catalogo.html
2. Clicca su prodotto interessante
3. "Aggiungi al Carrello"
4. Va a /carrello.html
5. Completa checkout
6. Paga con Stripe/PayPal

### Aggiornare il Sito Online
1. Modifica file locale
2. `git add .` → `git commit -m "..."` → `git push`
3. Cloudflare deploya automaticamente in 1-2 minuti

---

## 💡 QUICK TIPS

| Situazione | Soluzione |
|-----------|-----------|
| "Come faccio a mettere il sito online?" | Leggi `DEPLOY_STEPS.md` |
| "I prodotti non si salvano" | Apri console (F12), controlla localStorage |
| "Stripe non funziona" | Assicurati di usare `pk_live_...` non `sk_...` |
| "Voglio aggiungere un dominio custom" | Cloudflare Pages → Settings → Domains |
| "Come faccio backup dei dati?" | Admin panel → Export JSON (feature non impl.) |
| "Posso aggiungere un database?" | Sì, vedi sezione avanzata di `SETUP_GUIDE.md` |

---

## 📊 NUMERI IMPORTANTI

- **6 Prodotti di demo** in `/data/products.json`
- **2 Categorie di pagamenti** (Stripe + PayPal)
- **3 Metodi di pagamento** (Stripe, PayPal, WhatsApp)
- **0 Costi mensili base** (Cloudflare gratis)
- **2.9% commissione Stripe** su transazioni
- **1.49% commissione PayPal** su transazioni

---

## ✅ CHECKLIST VELOCE DEPLOY

- [ ] Leggi `DEPLOY_STEPS.md` completamente
- [ ] Crea account GitHub
- [ ] Crea account Cloudflare
- [ ] Pushare codice a GitHub
- [ ] Collega a Cloudflare Pages
- [ ] Sito online!
- [ ] Aggiungi 3+ prodotti reali
- [ ] Testa checkout completo
- [ ] Configura pagamenti (Stripe/PayPal)

---

## 🎓 FILE STRUCTURE RAPIDO

```
/Users/selene/Desktop/antiquariato-shop/
├── 🏠 index.html ← HOME (vedi qui per primo!)
├── 📚 catalogo.html ← Tutti i prodotti
├── 📦 prodotto.html ← Dettagli singolo prodotto
├── 🛒 carrello.html ← Checkout & pagamenti
├── 📝 admin-products.html ← Aggiungi prodotti
├── 📞 contatti.html ← Form contatti
├── 💻 js/app.js ← Logica app
├── 🎨 css/styles.css ← Stili (dark theme)
├── 📊 data/products.json ← Prodotti statici
├── 🖼️ assets/products/ ← Foto prodotti
└── 📄 DEPLOY_STEPS.md ← 🔴 INIZIA DA QUI!
```

---

## 🚀 PROSSIMI STEP (IN ORDINE)

```
1️⃣  Leggi DEPLOY_STEPS.md (5 min)
    ↓
2️⃣  Crea account GitHub (5 min)
    ↓
3️⃣  Crea account Cloudflare (5 min)
    ↓
4️⃣  Segui step 3-5 di DEPLOY_STEPS.md (10 min)
    ↓
5️⃣  Il sito è online! 🎉
    ↓
6️⃣  Aggiungi prodotti in admin panel
    ↓
7️⃣  Configura pagamenti (Stripe/PayPal)
    ↓
8️⃣  Testa tutto end-to-end
```

---

## 📞 RISORSE VELOCI

| Cosa Serve | Link |
|-----------|------|
| GitHub | https://github.com/signup |
| Cloudflare Pages | https://pages.cloudflare.com |
| Stripe | https://stripe.com |
| PayPal | https://paypal.com |
| Console Browser | F12 (Chrome, Firefox, Safari) |

---

**Pronto a deployare? Inizia da `DEPLOY_STEPS.md`! 🚀**
