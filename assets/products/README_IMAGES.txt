Image guide - Prodotti (assets/products)
---------------------------------------

Standard immagini per prodotti

Formati consigliati
- WebP (preferibile) o JPG. Qualità: 75-85 per bilanciare qualità e peso.

Dimensioni target
- Card catalogo (4:3): es. 1200x900 px (ridimensiona per thumbs)
- Gallery prodotto: immagine principale 1200x1200 px (1:1) e dettagli 1600x1200 px (4:3)
- Hero home: 1600x900 px (16:9)
- OG image: 1200x630 px
- Favicon: 512x512 px

Come nominare i file
- Usa lo `id` del prodotto seguito da un indice:
  - `<id>_1.webp` → immagine principale
  - `<id>_2.webp` → seconda immagine / dettaglio
  - `<id>_3.webp` → terza immagine

Esempio: per prodotto con `id` 12
- `12_1.webp`
- `12_2.webp`

Come esportare da Canva (passaggi rapidi)
1. Seleziona il design.
2. Esporta: scegli `WebP` (o `JPG`) e imposta le dimensioni desiderate (es. 1200x1200).
3. Scarica e rinomina come `12_1.webp`.

Dove copiarli
- Copia i file in `assets/products/`.

Aggiornare `data/products.json`
- Per ogni prodotto imposta `image` e `gallery` in questo modo:
  - `"image": "assets/products/<id>_1.webp"`
  - `"gallery": ["assets/products/<id>_1.webp", "assets/products/<id>_2.webp"]`

Esempio JSON:
```
"image": "assets/products/12_1.webp",
"gallery": ["assets/products/12_1.webp", "assets/products/12_2.webp"]
```

Suggerimenti
- Mantieni sempre almeno `*_1` per ogni prodotto.
- Se non hai più immagini, lascia `gallery` con una sola voce.

Usare lo script di conversione (opzionale)

Se vuoi generare automaticamente WebP e thumbnails dai sorgenti, metti i file originali in:

  `assets/products/originals/`

I file possono chiamarsi ad esempio `12_orig.jpg` oppure `12_anyname.jpg`. Lo script estrae la parte prima del primo `_` come `id`.

Esegui (richiede Node.js e `npm install` per installare `sharp`):

```bash
cd /Users/selene/Desktop/antiquariato-shop
npm install
node scripts/convert_images.js assets/products/originals assets/products
```

Lo script genererà per ogni sorgente:
- `assets/products/<id>_1.webp`  (main, 1200x1200)
- `assets/products/<id>_2.webp`  (dettaglio, 1600x1200)
- `assets/products/<id>_thumb.webp` (miniatura, 400x300)

Dopo la generazione aggiorna `data/products.json` per puntare a `assets/products/<id>_1.webp` e alla `gallery` corrispondente.
