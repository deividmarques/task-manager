# GitHub Actions - Análise Automática de PR

Este documento explica como funciona a análise automática de Pull Requests via GitHub Actions.

## 🎯 O que foi configurado

### 1. **PR Validation** (`.github/workflows/pr-validation.yml`)

Workflow básico que roda em cada PR:
- ✅ Lint (ESLint com security, quality, a11y)
- ✅ Tests (Vitest)
- ✅ Build (TypeScript + Vite)
- ✅ Coverage (opcional)

**Quando roda:**
- Ao abrir uma PR
- Ao fazer push em uma PR existente
- Ao reabrir uma PR

### 2. **AI Code Review** (`.github/workflows/ai-code-review.yml`)

Workflow avançado com análise de código:
- 📊 Validações completas
- 🔍 Análise de arquivos alterados
- ⚠️ Detecção de console.log
- 📝 Contagem de TODOs/FIXMEs
- 🧪 Verificação de testes
- 💬 Comentário automático na PR

**Quando roda:**
- Ao abrir uma PR
- Ao fazer push em uma PR existente

## 🚀 Como Ativar

### Passo 1: Commit e Push

Os workflows já estão criados. Basta fazer commit e push:

```bash
git add .github/workflows/
git commit -m "ci: Add GitHub Actions for PR validation"
git push
```

### Passo 2: Configurar Permissões (se necessário)

Se os workflows não conseguirem comentar na PR, configure as permissões:

1. Vá em: **Settings** → **Actions** → **General**
2. Em "Workflow permissions", selecione:
   - ✅ **Read and write permissions**
3. Salve as mudanças

### Passo 3: Testar

Crie ou atualize uma PR e veja os workflows rodando:

```bash
# Ver status dos workflows
gh pr checks

# Ver detalhes de um workflow
gh run view

# Ver logs
gh run view --log
```

## 📊 Exemplo de Saída

Quando você abre/atualiza uma PR, o bot comenta automaticamente:

```markdown
## 🤖 AI Code Review

### 📊 Validation Results

| Check | Status |
|-------|--------|
| **Lint** | ✅ Passed |
| **Tests** | ✅ Passed |
| **Build** | ✅ Passed |

### 📈 Code Analysis

- **Files changed**: 36 TypeScript/JavaScript files
- **Test files**: 3

### ⚠️ Warnings

⚠️ Found 2 console.log statement(s) - consider removing for production
ℹ️ Found 5 TODO/FIXME comment(s)

### ✅ Status: Ready for Review

**All automated checks passed!** This PR is ready for human review.
```

## 🔧 Personalização

### Adicionar Mais Verificações

Edite `.github/workflows/ai-code-review.yml`:

```yaml
- name: Custom check
  run: |
    # Sua verificação customizada
    npm run custom-check
```

### Mudar Quando Roda

```yaml
on:
  pull_request:
    types: [opened, synchronize]
    branches:
      - main
      - develop  # Adicione branches específicas
```

### Adicionar Notificações

```yaml
- name: Notify on Slack
  if: failure()
  uses: slackapi/slack-github-action@v1
  with:
    webhook-url: ${{ secrets.SLACK_WEBHOOK }}
```

## 🎨 Integrações Disponíveis

### 1. CodeRabbit (AI Review)

Análise de código com IA mais avançada:

```yaml
- name: CodeRabbit Review
  uses: coderabbitai/coderabbit-action@v1
  with:
    github-token: ${{ secrets.GITHUB_TOKEN }}
```

**Setup:** https://coderabbit.ai/

### 2. SonarCloud (Quality)

Análise de qualidade e segurança:

```yaml
- name: SonarCloud Scan
  uses: SonarSource/sonarcloud-github-action@master
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

**Setup:** https://sonarcloud.io/

### 3. Codecov (Coverage)

Relatório de cobertura de testes:

```yaml
- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    token: ${{ secrets.CODECOV_TOKEN }}
```

**Setup:** https://codecov.io/

### 4. Snyk (Security)

Análise de vulnerabilidades:

```yaml
- name: Snyk Security Scan
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

**Setup:** https://snyk.io/

## 📋 Comparação: Local vs GitHub Actions

| Aspecto | Local (npm run pr:check) | GitHub Actions |
|---------|--------------------------|----------------|
| **Velocidade** | ⚡ Muito rápido (10s) | 🐢 Mais lento (2-3 min) |
| **Quando roda** | Manual | Automático |
| **Feedback** | Imediato | Após push |
| **Custo** | Grátis | Grátis (2000 min/mês) |
| **Histórico** | Não | ✅ Sim |
| **Bloqueio** | Não | ✅ Pode bloquear merge |

## 🎯 Workflow Recomendado

### Durante Desenvolvimento
```bash
# Validação local rápida
npm run pr:check
```

### Antes de Push
```bash
# Validação completa
npm run validate
```

### Após Push
- GitHub Actions roda automaticamente
- Revise o comentário do bot na PR
- Corrija problemas se necessário

### Antes de Merge
- Confirme que todos os checks passaram (✅)
- Revise o código manualmente
- Solicite review de colegas

## 🔒 Bloquear Merge em Falhas

Para exigir que os checks passem antes de merge:

1. Vá em: **Settings** → **Branches**
2. Adicione regra para `main`:
   - ✅ **Require status checks to pass**
   - Selecione: `Code Quality & Tests`, `AI Code Review`
3. Salve

Agora PRs só podem ser merged se todos os checks passarem!

## 🐛 Troubleshooting

### Workflow não roda

1. Verifique se os arquivos estão em `.github/workflows/`
2. Confirme que fez push dos arquivos
3. Veja em: **Actions** tab no GitHub

### Sem permissão para comentar

1. **Settings** → **Actions** → **General**
2. Ative "Read and write permissions"

### Checks sempre falham

1. Rode localmente: `npm run validate`
2. Corrija erros localmente primeiro
3. Faça push novamente

### Muito lento

1. Use cache do npm (já configurado)
2. Rode apenas em branches específicas
3. Considere self-hosted runners

## 📚 Recursos Adicionais

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [GitHub Script Action](https://github.com/actions/github-script)
- [Marketplace](https://github.com/marketplace?type=actions)

## 💡 Próximos Passos

1. ✅ Commit os workflows
2. ✅ Faça push
3. ✅ Teste em uma PR
4. ⚙️ Configure branch protection
5. 🎨 Adicione integrações (CodeRabbit, SonarCloud, etc.)
6. 📊 Monitore uso de minutos do GitHub Actions

