#!/bin/bash

# 🚀 Antiquariato Shop - Deploy Script
# Questo script carica il sito online su GitHub e Cloudflare Pages

set -e

# Colori
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Antiquariato Shop - Deploy Automatico${NC}"
echo "================================================"

# 1. Configurazione Git
echo -e "${YELLOW}1️⃣  Configurazione GitHub...${NC}"
read -p "Inserisci il tuo username GitHub: " GITHUB_USERNAME

# Verificare se remoto esiste
if ! git remote | grep -q "origin"; then
    git remote add origin "https://github.com/${GITHUB_USERNAME}/antiquariato-shop.git"
    echo -e "${GREEN}✅ Remote aggiunto${NC}"
else
    echo -e "${GREEN}✅ Remote già configurato${NC}"
fi

# 2. Commit finale
echo -e "${YELLOW}2️⃣  Creazione commit finale...${NC}"
git add -A
git commit -m "chore: production ready deployment" || echo "Niente da committare"
echo -e "${GREEN}✅ Commit creato${NC}"

# 3. Push a GitHub
echo -e "${YELLOW}3️⃣  Push a GitHub...${NC}"
git branch -M main
git push -u origin main
echo -e "${GREEN}✅ Codice pushato${NC}"

# 4. Istruzioni Cloudflare
echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${GREEN}✅ FATTO! Adesso completa il deploy su Cloudflare${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo "📋 Prossimi step:"
echo ""
echo "1. Vai a: https://pages.cloudflare.com"
echo "2. Login con il tuo account Cloudflare"
echo "3. Clicca 'Create a project' → 'Connect to Git'"
echo "4. Seleziona: $GITHUB_USERNAME / antiquariato-shop"
echo "5. Build command: (lascia vuoto)"
echo "6. Publish directory: ."
echo "7. Clicca 'Deploy'"
echo ""
echo -e "${YELLOW}Il sito sarà disponibile a:${NC}"
echo "https://antiquariato-shop.pages.dev"
echo ""
echo "Oppure con dominio custom:"
echo "https://tuodominio.com"
echo ""
echo -e "${BLUE}Hai domande? Leggi SETUP_GUIDE.md${NC}"
