#!/bin/bash

# Script para criar Pull Requests de forma flexível
# Uso:
#   npm run pr                    # PR da branch atual para main
#   npm run pr develop            # PR da branch atual para develop
#   npm run pr -- --base develop  # Controle total com flags do gh

set -e

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Verifica se gh está instalado
if ! command -v gh &> /dev/null; then
    echo -e "${YELLOW}⚠️  GitHub CLI (gh) não está instalado${NC}"
    echo "Instale com: brew install gh"
    exit 1
fi

# Verifica se está autenticado
if ! gh auth status &> /dev/null; then
    echo -e "${YELLOW}⚠️  Você não está autenticado no GitHub${NC}"
    echo "Execute: gh auth login"
    exit 1
fi

# Pega a branch atual
CURRENT_BRANCH=$(git branch --show-current)

# Define a branch base (padrão: main)
BASE_BRANCH="${1:-main}"

# Se o primeiro argumento for "--", passa todos os argumentos para gh pr create
if [ "$1" = "--" ]; then
    shift
    echo -e "${BLUE}📝 Criando PR com argumentos customizados...${NC}"
    gh pr create "$@"
else
    # Cria PR com título e descrição automáticos
    echo -e "${BLUE}📝 Criando PR de ${YELLOW}${CURRENT_BRANCH}${BLUE} para ${YELLOW}${BASE_BRANCH}${NC}"
    
    # Extrai o tipo e nome da feature da branch (ex: feature/filters-and-search)
    BRANCH_TYPE=$(echo "$CURRENT_BRANCH" | cut -d'/' -f1)
    FEATURE_NAME=$(echo "$CURRENT_BRANCH" | cut -d'/' -f2-)
    
    # Define o prefixo do commit baseado no tipo da branch
    case "$BRANCH_TYPE" in
        feature)
            COMMIT_PREFIX="feat"
            ;;
        bugfix|fix)
            COMMIT_PREFIX="fix"
            ;;
        docs)
            COMMIT_PREFIX="docs"
            ;;
        refactor)
            COMMIT_PREFIX="refactor"
            ;;
        test)
            COMMIT_PREFIX="test"
            ;;
        *)
            COMMIT_PREFIX="chore"
            ;;
    esac
    
    # Converte kebab-case para Title Case
    TITLE=$(echo "$FEATURE_NAME" | sed 's/-/ /g' | awk '{for(i=1;i<=NF;i++)sub(/./,toupper(substr($i,1,1)),$i)}1')
    
    # Cria a PR
    gh pr create \
        --base "$BASE_BRANCH" \
        --title "${COMMIT_PREFIX}: ${TITLE}" \
        --body "## Descrição

Esta PR implementa: **${TITLE}**

## Validações

- [ ] Lint passou sem erros (\`npm run lint\`)
- [ ] Todos os testes passando (\`npm run test\`)
- [ ] Build funcionando (\`npm run build\`)
- [ ] Coverage mantido acima de 50%

## Tipo de Mudança

- [ ] Nova feature
- [ ] Bug fix
- [ ] Breaking change
- [ ] Documentação
- [ ] Refatoração
- [ ] Testes

## Checklist

- [ ] Código segue os padrões do projeto
- [ ] Testes foram adicionados/atualizados
- [ ] Documentação foi atualizada (se necessário)
- [ ] Commits seguem conventional commits"
fi

echo -e "${GREEN}✅ Pull Request criada com sucesso!${NC}"
