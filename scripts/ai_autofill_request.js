#!/usr/bin/env node
/**
 * AI Autofill Worker
 *
 * Triggered by GitHub Actions when a request file is pushed to `data/ai-requests/`.
 * Reads request JSON, calls OpenAI Vision, writes a result JSON to `data/ai-results/`.
 *
 * Env:
 * - OPENAI_API_KEY (recommended in Actions secrets)
 * - OPENAI_KEY or CHATGPT_API_KEY (fallback names supported)
 * - OPENAI_MODEL (optional, default: gpt-4o-mini)
 * - OPENAI_ENDPOINT (optional, default: https://api.openai.com/v1/chat/completions)
 */

const fs = require('fs');
const path = require('path');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  || process.env.OPENAI_KEY
  || process.env.CHATGPT_API_KEY
  || '';
const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';
const OPENAI_ENDPOINT = process.env.OPENAI_ENDPOINT || 'https://api.openai.com/v1/chat/completions';

const ALLOWED_CATEGORIES = new Set([
  'mobili', 'arte', 'ceramica', 'orologeria', 'oggetti', 'gioielli',
  'moda', 'elettronica', 'casa', 'sport', 'auto', 'bimbi',
  'collezionismo', 'libri', 'altro'
]);

const ANTIQUE_CATEGORIES = new Set(['mobili', 'arte', 'ceramica', 'orologeria', 'gioielli', 'oggetti']);

function readJson(filePath) {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function extractJson(text) {
  const t = String(text || '').trim();
  if (!t) return '';
  const first = t.indexOf('{');
  const last = t.lastIndexOf('}');
  if (first === -1 || last === -1 || last <= first) return t;
  return t.slice(first, last + 1);
}

function normalizeCategory(value) {
  const raw = String(value || '').trim().toLowerCase();
  return ALLOWED_CATEGORIES.has(raw) ? raw : '';
}

function normalizeSection(value, category) {
  const raw = String(value || '').trim().toLowerCase();
  if (raw === 'antiquariato' || raw === 'usato') return raw;
  const cat = String(category || '').trim().toLowerCase();
  if (ANTIQUE_CATEGORIES.has(cat)) return 'antiquariato';
  return 'usato';
}

function coercePrice(value) {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  const s = String(value || '').replace(',', '.').replace(/[^0-9.]/g, '');
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
}

function ensureDraftShape(draft, baseDraft) {
  const out = { ...(baseDraft || {}), ...(draft || {}) };
  // IDs are assigned client-side at publish time to avoid accidental overwrites.
  if (Object.prototype.hasOwnProperty.call(out, 'id')) delete out.id;
  out.category = normalizeCategory(out.category) || normalizeCategory(baseDraft && baseDraft.category) || 'altro';
  out.section = normalizeSection(out.section, out.category);
  out.status = 'available';
  out.postedAt = (baseDraft && baseDraft.postedAt) ? baseDraft.postedAt : (out.postedAt || new Date().toISOString().slice(0, 10));
  out.price = coercePrice(out.price);
  out.shippingCost = coercePrice(
    out.shippingCost != null ? out.shippingCost : (baseDraft && baseDraft.shippingCost != null ? baseDraft.shippingCost : 0)
  );

  // Enforce image/gallery from base draft (these are stable file/URL references).
  if (baseDraft && baseDraft.image) out.image = baseDraft.image;
  if (baseDraft && Array.isArray(baseDraft.gallery)) out.gallery = baseDraft.gallery;

  if (!out.name) out.name = (baseDraft && baseDraft.name) ? baseDraft.name : 'Annuncio';
  if (!out.description) out.description = '';

  // Ensure optional fields exist (avoid undefined for JSON consumers).
  out.location = String(out.location || '');
  out.condition = String(out.condition || '');
  out.year = String(out.year || '');
  out.dimensions = String(out.dimensions || '');
  out.featured = !!out.featured;
  out.stripeLinkBuy = String(out.stripeLinkBuy || '');
  out.paypalBuy = String(out.paypalBuy || '');
  out.whatsappText = String(out.whatsappText || '');

  return out;
}

async function callOpenAI({ baseDraft, imageUrls }) {
  const system = [
    'Sei un assistente esperto di annunci per un marketplace italiano (usato, vintage, antiquariato).',
    'Devi rispondere SOLO con JSON valido (nessun testo extra e nessun markdown).',
    'Non inventare dettagli non visibili: se sei incerto, usa "da verificare" e metti price=0.',
    'Mantieni i campi "image" e "gallery" esattamente come nella bozza JSON fornita.'
  ].join(' ');

  const userText = [
    'Compila TUTTI i campi dell\'annuncio in base alle foto.',
    'Regole:',
    `- category deve essere UNA di: ${Array.from(ALLOWED_CATEGORIES).join(', ')}`,
    '- section: "antiquariato" oppure "usato".',
    '- condition: breve (es: "Nuovo", "Ottimo", "Buono", "Da sistemare").',
    '- description: dettagliata, onesta, in italiano.',
    '- price: numero in EUR (se non sicuro, 0).',
    '- shippingCost: costo spedizione in EUR (se non noto, usa 0).',
    '- NON includere il campo "id".',
    '- year: periodo/anni (se stimati, scrivi "da verificare").',
    '- dimensions: dimensioni (se non visibili, "").',
    '- status: "available".',
    '',
    'Bozza JSON (da completare):',
    JSON.stringify(baseDraft, null, 2)
  ].join('\n');

  const content = [
    { type: 'text', text: userText },
    ...imageUrls.map((url) => ({ type: 'image_url', image_url: { url } }))
  ];

  const payload = {
    model: OPENAI_MODEL,
    temperature: 0.2,
    max_tokens: 900,
    messages: [
      { role: 'system', content: system },
      { role: 'user', content }
    ]
  };

  const res = await fetch(OPENAI_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data && data.error && data.error.message
      ? data.error.message
      : (data && data.message ? data.message : `HTTP ${res.status}`);
    throw new Error(msg);
  }

  const text = data && data.choices && data.choices[0] && data.choices[0].message
    ? data.choices[0].message.content
    : '';
  if (!text) throw new Error('Empty response');
  return String(text);
}

async function processRequestFile(reqPath) {
  const absReq = path.resolve(process.cwd(), reqPath);
  const req = readJson(absReq);
  const requestId = String(req.requestId || path.basename(reqPath, '.json'));
  const outputPath = String(req.outputPath || `data/ai-results/${requestId}.json`);
  const absOut = path.resolve(process.cwd(), outputPath);

  const baseDraft = (req && typeof req.baseDraft === 'object' && req.baseDraft) ? req.baseDraft : {};
  const images = Array.isArray(req.images) ? req.images : [];
  const imageUrls = images
    .map((img) => (img && (img.rawUrl || img.pagesUrl || img.url)) ? String(img.rawUrl || img.pagesUrl || img.url) : '')
    .filter(Boolean)
    .slice(0, 10);

  if (!imageUrls.length) {
    const result = {
      requestId,
      ok: false,
      error: 'No image URLs in request.',
      draft: ensureDraftShape(baseDraft, baseDraft)
    };
    writeJson(absOut, result);
    console.log('Wrote', outputPath);
    return;
  }

  if (!OPENAI_API_KEY) {
    const result = {
      requestId,
      ok: false,
      error: 'Missing OpenAI secret in GitHub Actions (OPENAI_API_KEY, OPENAI_KEY or CHATGPT_API_KEY).',
      draft: ensureDraftShape(baseDraft, baseDraft)
    };
    writeJson(absOut, result);
    console.log('Wrote', outputPath);
    return;
  }

  try {
    const rawText = await callOpenAI({ baseDraft, imageUrls });
    const jsonText = extractJson(rawText);
    const parsed = JSON.parse(jsonText);
    const draft = ensureDraftShape(parsed, baseDraft);

    const result = {
      requestId,
      ok: true,
      model: OPENAI_MODEL,
      createdAt: new Date().toISOString(),
      draft
    };
    writeJson(absOut, result);
    console.log('Wrote', outputPath);
  } catch (err) {
    const result = {
      requestId,
      ok: false,
      error: String(err && err.message ? err.message : err),
      createdAt: new Date().toISOString(),
      draft: ensureDraftShape(baseDraft, baseDraft)
    };
    writeJson(absOut, result);
    console.log('Wrote', outputPath);
  }
}

async function main() {
  const files = process.argv.slice(2).filter(Boolean);
  if (!files.length) {
    console.error('Usage: node scripts/ai_autofill_request.js <requestFile1> [requestFile2 ...]');
    process.exit(1);
  }

  for (const f of files) {
    try {
      await processRequestFile(f);
    } catch (err) {
      console.error('Failed:', f, '-', err && err.message ? err.message : err);
      // continue processing other files
    }
  }
}

main();
