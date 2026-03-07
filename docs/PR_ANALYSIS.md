# Análise Automática de Pull Requests

Este documento explica como usar o sistema de análise automática de PRs com Kiro.

## O que é?

Um hook do Kiro que analisa Pull Requests automaticamente, fornecendo feedback sobre:
- ✅ Qualidade de código
- 🔒 Segurança
- ♿ Acessibilidade (WCAG 2.2 AA)
- ⚡ Performance
- 🧪 Cobertura de testes
- 📚 Boas práticas

## Como Funciona

1. **Hook do Kiro** (`analyze-pr`) - Dispara a análise
2. **GitHub CLI** - Pega informações da PR
3. **GitHub MCP Server** - Lê o código dos arquivos alterados
4. **Kiro AI** - Analisa e fornece feedback detalhado

## Pré-requisitos

- ✅ GitHub CLI instalado e autenticado (`gh`)
- ✅ GitHub MCP Server configurado (veja `docs/GITHUB_MCP_SETUP.md`)
- ✅ Branch com PR aberta no GitHub

## Como Usar

### Método 1: Via Script (Recomendado)

```bash
# Analisar PR da branch atual
./scripts/analyze-pr.sh

# Analisar PR específica (faz checkout automaticamente)
./scripts/analyze-pr.sh 1
```

O script mostra:
- Título e autor da PR
- Lista de arquivos alterados
- Estatísticas (adições, remoções)
- Instruções para usar o hook

### Método 2: Via Hook do Kiro

1. Abra o Kiro
2. Vá em "Agent Hooks" no painel lateral
3. Clique no hook "Analyze Pull Request"
4. Clique em "Run Hook"

O Kiro irá:
1. Pegar a lista de arquivos alterados via `gh pr view`
2. Ler cada arquivo via GitHub MCP
3. Analisar o código
4. Fornecer feedback estruturado

### Método 3: Via Comando

```bash
# Pegar informações da PR
gh pr view --json files,title,author,additions,deletions

# Depois, no Kiro, peça:
"Analise a PR atual usando o hook analyze-pr"
```

## Exemplo de Análise

Quando você roda o hook, o Kiro fornece:

```markdown
# Análise da PR #1: Add filters and search functionality

## 📊 Resumo
- 15 arquivos alterados
- +450 linhas adicionadas
- -20 linhas removidas

## ✅ Pontos Positivos
- Boa separação de responsabilidades nos componentes
- Testes unitários incluídos
- Acessibilidade implementada corretamente

## ⚠️ Issues Encontrados

### 🔴 Crítico
Nenhum issue crítico encontrado

### 🟡 Médio
1. **StatusFilter.tsx:45** - Possível object injection
   - Sugestão: Adicionar validação de bounds

### 🟢 Baixo
1. **validation.test.ts:6** - String duplicada 3x
   - Sugestão: Extrair para constante

## 💡 Sugestões
1. Adicionar testes de integração para os filtros
2. Considerar memoização no FilterBar
3. Documentar props dos componentes com JSDoc

## 📈 Métricas
- Cobertura de testes: 92% ✅
- Complexidade cognitiva: Baixa ✅
- Acessibilidade: WCAG 2.2 AA ✅
```

## Configuração Avançada

### Personalizar a Análise

Edite o hook em `.kiro/hooks/analyze-pr.kiro.hook` para:
- Focar em aspectos específicos
- Adicionar checklist customizada
- Integrar com outras ferramentas

### Auto-Approve MCP Tools

Para não precisar aprovar cada leitura de arquivo, adicione em `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "github-repo-mcp": {
      "autoApprove": [
        "getRepoFile",
        "getRepoDirectories",
        "getRepoAllDirectories"
      ]
    }
  }
}
```

### Integrar com GitHub Actions

Você pode criar um workflow que comenta na PR:

```yaml
name: AI Code Review

on:
  pull_request:
    types: [opened, synchronize]

jobs:
  review:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Kiro Analysis
        run: |
          # Chamar Kiro API ou usar gh CLI
          gh pr comment ${{ github.event.pull_request.number }} \
            --body "$(./scripts/analyze-pr.sh)"
```

## Limitações

- **Rate Limiting**: GitHub API tem limites (use token para aumentar)
- **Arquivos Grandes**: MCP pode ter limite de tamanho
- **Arquivos Binários**: Não analisa imagens, PDFs, etc.
- **Contexto**: Análise é por arquivo, não tem contexto completo do projeto

## Troubleshooting

### "gh: command not found"
```bash
brew install gh
gh auth login
```

### "No pull request found"
```bash
# Certifique-se de estar em uma branch com PR
gh pr list

# Ou especifique o número da PR
./scripts/analyze-pr.sh 1
```

### "MCP server not responding"
```bash
# Verifique se o MCP está configurado
cat .kiro/settings/mcp.json

# Reinicie o Kiro
```

### "Rate limit exceeded"
- Adicione um GitHub token no MCP config
- Veja: `docs/GITHUB_MCP_SETUP.md`

## Próximos Passos

1. **Testar o hook** na PR atual (feature/filters-and-search)
2. **Ajustar o prompt** do hook conforme necessário
3. **Criar workflow** do GitHub Actions (opcional)
4. **Adicionar mais checks** (bundle size, performance, etc.)

## Recursos Adicionais

- [GitHub CLI Manual](https://cli.github.com/manual/)
- [Kiro Hooks Documentation](../.kiro/hooks/)
- [GitHub MCP Setup](./GITHUB_MCP_SETUP.md)
- [Code Validation](./CODE_VALIDATION.md)
