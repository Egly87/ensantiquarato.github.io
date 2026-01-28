Image guide - Brand and Social (assets/brand)
-------------------------------------------

Questo file contiene linee guida semplici per preparare le immagini del brand e le immagini OpenGraph.

Formato consigliato
- WebP o JPG (WebP preferibile per web): qualità 80-85

Dimensioni suggerite
- Logo (vettoriale): `logo.svg` (preferibile)
- OG image: `og.jpg` or `og.webp` — 1200x630 px
- Favicon: `favicon.png` — 512x512 px (per manifest e fallback)

Come esportare da Canva (rapido)
1. Apri il progetto in Canva.
2. Seleziona Esporta -> Immagine -> scegli `WebP` o `JPG`.
3. Imposta le dimensioni a quelle indicate sopra (es. 1200x630 per OG) e qualità 80.
4. Scarica e rinomina i file come indicato qui sotto.

Nomi file consigliati
- `logo.svg` (vettoriale, mantiene qualità)
- `og.webp` (o `og.jpg`) per OpenGraph
- `favicon.png` per manifest (512x512)

Dove copiare
- Metti i file in `assets/brand/` (sovrascrivi i placeholder se presenti).

Aggiornare il sito
- Verifica `index.html`, `catalogo.html`, `prodotto.html` e le meta OG in testa alle pagine; se necessario modifica i percorsi in `<meta property="og:image" ...>`.

Note
- Mantieni una copia originale in un folder di backup.
- Usa nomi minuscoli e senza spazi (es: `og.webp`).
