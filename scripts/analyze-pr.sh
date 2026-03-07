#!/bin/bash

# Script para analisar Pull Requests
# Uso: ./scripts/analyze-pr.sh [PR_NUMBER]

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 PR Analysis Tool${NC}"
echo ""

# Verifica se gh está instalado
if ! command -v gh &> /dev/null; then
    echo -e "${RED}❌ GitHub CLI (gh) não está instalado${NC}"
    echo "Instale com: brew install gh"
    exit 1
fi

# Verifica se está autenticado
if ! gh auth status &> /dev/null; then
    echo -e "${RED}❌ Você não está autenticado no GitHub${NC}"
    echo "Execute: gh auth login"
    exit 1
fi

# Se um número de PR foi fornecido, faz checkout
if [ -n "$1" ]; then
    echo -e "${BLUE}📥 Fazendo checkout da PR #$1...${NC}"
    gh pr checkout "$1"
fi

# Pega informações da PR atual
PR_NUMBER=$(gh pr view --json number --jq '.number' 2>/dev/null || echo "")

if [ -z "$PR_NUMBER" ]; then
    echo -e "${RED}❌ Não foi possível encontrar uma PR na branch atual${NC}"
    echo "Use: ./scripts/analyze-pr.sh [PR_NUMBER]"
    exit 1
fi

echo -e "${GREEN}✅ Analisando PR #${PR_NUMBER}${NC}"
echo ""

# Pega informações da PR
PR_TITLE=$(gh pr view --json title --jq '.title')
PR_AUTHOR=$(gh pr view --json author --jq '.author.login')
PR_URL=$(gh pr view --json url --jq '.url')

echo -e "${BLUE}Título:${NC} $PR_TITLE"
echo -e "${BLUE}Autor:${NC} $PR_AUTHOR"
echo -e "${BLUE}URL:${NC} $PR_URL"
echo ""

# Lista arquivos alterados
echo -e "${BLUE}📝 Arquivos alterados:${NC}"
gh pr view --json files --jq '.files[].path' | while read -r file; do
    echo "  - $file"
done
echo ""

# Estatísticas
ADDITIONS=$(gh pr view --json additions --jq '.additions')
DELETIONS=$(gh pr view --json deletions --jq '.deletions')
FILES_CHANGED=$(gh pr view --json files --jq '.files | length')

echo -e "${BLUE}📊 Estatísticas:${NC}"
echo -e "  ${GREEN}+${ADDITIONS}${NC} adições"
echo -e "  ${RED}-${DELETIONS}${NC} remoções"
echo -e "  ${YELLOW}${FILES_CHANGED}${NC} arquivos alterados"
echo ""

echo -e "${YELLOW}💡 Agora use o hook 'Analyze Pull Request' no Kiro para análise detalhada${NC}"
echo -e "${YELLOW}   O hook irá ler os arquivos via MCP e fornecer feedback completo${NC}"
