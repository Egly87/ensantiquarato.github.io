## 🚀 COME METTERE IL SITO ONLINE - Istruzioni Passo Passo

Seguire questi step nell'ordine per deployare su Cloudflare Pages (GRATIS)

---

### **STEP 1: Creare Account GitHub** (5 min)

1. Vai a https://github.com/signup
2. Email → Username → Password
3. Seleziona "Free" plan
4. Verifica email
5. Fatto! ✅

---

### **STEP 2: Creare Repository GitHub** (2 min)

1. Vai a https://github.com/new
2. **Repository name:** `antiquariato-shop`
3. **Visibility:** Public
4. **Initialize:** Non mettere niente (README, etc)
5. Click **"Create repository"**
6. Copia l'URL che appare (tipo: https://github.com/TUONOME/antiquariato-shop.git)

---

### **STEP 3: Pushare Codice a GitHub** (3 min)

Apri terminale e esegui:

```bash
cd /Users/selene/Desktop/antiquariato-shop

# Configura il remote (sostituisci TUONOME e URL)
git remote add origin https://github.com/TUONOME/antiquariato-shop.git

# Rinomina branch (se necessario)
git branch -M main

# Push del codice
git push -u origin main
```

Vedrai output come:
```
Enumerating objects: 100%
...
To https://github.com/TUONOME/antiquariato-shop.git
 * [new branch]      main -> main
```

✅ **Il codice è su GitHub!**

Verifica visitando: https://github.com/TUONOME/antiquariato-shop

---

### **STEP 4: Creare Account Cloudflare** (5 min)

1. Vai a https://dash.cloudflare.com/sign-up
2. Email → Password
3. Clicca link verifica email
4. Accetto i termini
5. Skip le opzioni iniziali
6. **Fatto!** ✅

---

### **STEP 5: Deployare su Cloudflare Pages** (3 min)

1. In Cloudflare dashboard, vai a **Pages** (sinistra)
2. Click **"Create a project"**
3. Click **"Connect to Git"**
4. Autorizza GitHub (click "Authorize Cloudflare Pages")
5. Seleziona l'account GitHub
6. Scegli repository: `antiquariato-shop`
7. Clicca **"Begin setup"**
8. Configurazione build:
   - **Project name:** `antiquariato-shop`
   - **Production branch:** `main`
   - **Build command:** (LASCIA VUOTO)
   - **Build output directory:** `.`
9. Click **"Save and Deploy"**

⏳ Aspetta 1-2 minuti per il deploy...

---

### **STEP 6: Verificare che Funzioni** (1 min)

Dopo il deploy, Cloudflare ti darà l'URL:
```
https://antiquariato-shop.pages.dev
```

Visitalo e verifica:
- ✅ Homepage carica
- ✅ Catalogo mostra prodotti
- ✅ Admin panel accessibile
- ✅ Carrello funziona

---

### **STEP 7: Aggiungere Prodotti** (5 min)

1. Vai a `https://antiquariato-shop.pages.dev/admin-products.html`
2. Riempi il form:
   - Nome prodotto
   - Categoria
   - Prezzo
   - Descrizione
   - Foto (URL o path)
   - Link pagamento
3. Click "Salva Prodotto"

**IMPORTANTE:** I prodotti si salvano nel tuo browser locale!
- Se cambio device, i dati non sincronizzano
- Soluzione: scaricare backup o collegare database (vedi SETUP_GUIDE.md)

---

### **STEP 8: Configurare Pagamenti** (10 min, opzionale)

**Opzione A: Link Stripe Diretto** (PIÙ SEMPLICE)
1. Vai a https://stripe.com/payments/checkout-session
2. Crea session per ogni prodotto
3. Copia il link (tipo: https://buy.stripe.com/...)
4. Incolla in admin panel nel campo "Link Stripe per pagamento"

**Opzione B: Carrello con Stripe**
1. Account Stripe: https://dashboard.stripe.com/register
2. Vai a Developers → API Keys
3. Copia **Publishable Key** (pk_live_...)
4. In `carrello.html`, cerca `const stripeKey = prompt(...)`
5. Sostituisci con il tuo key

**Opzione C: PayPal** (1.49% fee, più economico)
1. PayPal Business: https://www.paypal.com/business
2. Tools → Checkout Links
3. Genera link
4. Incolla in admin panel

---

### **STEP 9: Dominio Custom** (OPZIONALE, €10-15/anno)

Se vuoi `www.tuodominio.com` al posto di `.pages.dev`:

1. Compra dominio su: Namecheap, GoDaddy, etc
2. In Cloudflare Pages → Settings → Domains
3. Click "Add custom domain"
4. Inserisci il tuo dominio
5. Segui istruzioni per i DNS

---

### **STEP 10: Aggiornare il Sito**

Ogni volta che modifichi il codice:

```bash
cd /Users/selene/Desktop/antiquariato-shop

git add .
git commit -m "Descrizione del cambio"
git push origin main
```

Cloudflare deploya automaticamente! (1-2 minuti)

---

## ✅ **CHECKLIST FINALE**

- [ ] Account GitHub creato
- [ ] Repository GitHub creato
- [ ] Codice pushato (git push origin main)
- [ ] Account Cloudflare creato
- [ ] Sito deployato su Cloudflare Pages
- [ ] URL funzionante: https://antiquariato-shop.pages.dev
- [ ] Admin panel accessibile
- [ ] Prodotti aggiunti
- [ ] Pagamenti configurati (Stripe/PayPal)
- [ ] Dominio custom? (opzionale)

---

## 🆘 PROBLEMI COMUNI

**Errore: "fatal: remote origin already exists"**
```bash
git remote remove origin
git remote add origin https://github.com/TUONOME/antiquariato-shop.git
```

**Errore: "Permission denied"**
- Controlla che il token GitHub sia valido
- Oppure usa HTTPS al posto di SSH

**Deploy bloccato "Queued"**
- Attendi 10 minuti
- Se ancora bloccato: Cloudflare → Pages → Retry Deploy

**Prodotti non si salvano**
- Apri console (F12 → Console)
- LocalStorage potrebbe essere disabilitato
- I dati restano nel browser locale, non online

**Stripe non funziona**
- Verifica che la key inizi con `pk_` (publishable)
- Non usare `sk_` (secret key)
- Testa in mode test: `pk_test_...`

---

## 📞 PROSSIMO STEP

Una volta online, leggi:
- `SETUP_GUIDE.md` - Guida completa
- `PAYMENT_SETUP.md` - Configurare pagamenti
- `CHECKLIST.md` - Pre-launch checklist

---

**Domande? Tutto funziona? Congratulazioni! 🎉**

Il tuo e-commerce antiquariato è ONLINE!
