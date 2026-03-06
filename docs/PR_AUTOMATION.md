# Automação de Pull Requests

Este documento explica como funciona a automação de análise de PRs no projeto.

## 🎯 Visão Geral

O projeto possui três níveis de automação para análise de PRs:

1. **Manual** - Você executa quando quiser
2. **Hook Automático** - Roda após cada execução do Kiro
3. **Script Rápido** - Validação antes de push/merge

## 📋 Opções Disponíveis

### 1. Análise Manual Completa

**Hook:** `.kiro/hooks/analyze-pr.kiro.hook`

Análise detalhada e completa do PR com:
- Leitura de todos os arquivos alterados
- Análise de segurança, qualidade e acessibilidade
- Sugestões de melhorias
- Feedback positivo sobre boas práticas

**Como usar:**
- Trigger manual no Kiro (botão no painel de hooks)
- Ou peça ao Kiro: "Analise o PR atual"

**Quando usar:**
- Antes de solicitar review
- Após fazer mudanças significativas
- Para obter feedback detalhado

### 2. Verificação Automática Rápida

**Hook:** `.kiro/hooks/auto-pr-review.kiro.hook`

Verificação automática que roda após cada execução do Kiro:
- Detecta se há PR aberta
- Roda validações (lint, test, build)
- Análise rápida de código novo
- Feedback conciso e acionável

**Como funciona:**
- Ativa automaticamente quando você para de trabalhar
- Só roda se houver PR aberta
- Feedback em segundos

**Configuração:**
```json
{
  "enabled": true,  // Mude para false para desativar
  "when": {
    "type": "agentStop"  // Roda quando Kiro para
  }
}
```

### 3. Script de Validação Rápida

**Script:** `scripts/quick-pr-check.sh`

Validação rápida antes de push ou merge:
- Verifica se PR existe
- Roda lint, test, build
- Scan rápido de código
- Resumo da PR

**Como usar:**
```bash
npm run pr:check
```

**Quando usar:**
- ✅ Antes de fazer push
- ✅ Antes de solicitar review
- ✅ Antes de fazer merge
- ✅ Após fazer mudanças

## 🔧 Configuração

### Ativar/Desativar Hooks

Edite os arquivos `.kiro/hooks/*.kiro.hook`:

```json
{
  "enabled": true,  // false para desativar
  // ...
}
```

### Personalizar Análise Automática

Edite `.kiro/hooks/auto-pr-review.kiro.hook` para ajustar:
- Quando roda (agentStop, promptSubmit, etc.)
- O que analisa
- Nível de detalhe do feedback

### Adicionar Verificações Customizadas

Edite `scripts/quick-pr-check.sh` para adicionar:
- Verificações específicas do projeto
- Padrões de código customizados
- Métricas adicionais

## 📊 Comparação

| Recurso | Manual | Auto Hook | Script |
|---------|--------|-----------|--------|
| **Velocidade** | Lento (2-3 min) | Rápido (30s) | Muito rápido (10s) |
| **Detalhe** | Completo | Médio | Básico |
| **Quando roda** | Manual | Automático | Manual |
| **Análise de código** | ✅ Completa | ✅ Focada | ⚠️ Básica |
| **Sugestões** | ✅ Detalhadas | ✅ Concisas | ❌ Não |
| **Validações** | ✅ Sim | ✅ Sim | ✅ Sim |

## 🎯 Workflow Recomendado

### Durante o Desenvolvimento

1. Trabalhe normalmente
2. O hook automático te avisa se algo está errado
3. Continue desenvolvendo

### Antes de Push

```bash
npm run pr:check
```

Se tudo passar, faça push com confiança.

### Antes de Solicitar Review

Peça análise completa ao Kiro:
```
"Analise o PR atual"
```

Revise o feedback e faça ajustes se necessário.

### Antes de Merge

```bash
npm run pr:check
```

Confirme que todas as validações passam.

## 🚀 Comandos Úteis

```bash
# Criar PR
npm run pr

# Validar PR
npm run pr:check

# Validação completa
npm run validate

# Ver PR no navegador
gh pr view --web

# Solicitar review
gh pr edit --add-reviewer username

# Fazer merge
gh pr merge
```

## 💡 Dicas

### Desativar Temporariamente

Se o hook automático estiver atrapalhando:

```json
// .kiro/hooks/auto-pr-review.kiro.hook
{
  "enabled": false,  // Desativa temporariamente
  // ...
}
```

### Análise Apenas de Arquivos Específicos

Modifique o prompt do hook para focar em:
- Apenas arquivos `src/`
- Apenas arquivos novos
- Apenas arquivos de teste

### Integração com CI/CD

O script `quick-pr-check.sh` pode ser usado em:
- Pre-commit hooks (Git)
- GitHub Actions
- GitLab CI
- Qualquer pipeline CI/CD

Exemplo para pre-commit hook:
```bash
# .git/hooks/pre-commit
#!/bin/bash
npm run pr:check
```

## 🔍 Troubleshooting

### "No open PR found"

Crie uma PR primeiro:
```bash
npm run pr
```

### Hook não está rodando

1. Verifique se está habilitado (`enabled: true`)
2. Reinicie o Kiro
3. Verifique logs do Kiro

### Script falha com erro

1. Verifique se GitHub CLI está instalado: `gh --version`
2. Verifique se está autenticado: `gh auth status`
3. Verifique se há PR aberta: `gh pr view`

## 📚 Recursos Adicionais

- [GitHub CLI Manual](https://cli.github.com/manual/)
- [Kiro Hooks Documentation](https://docs.kiro.ai/hooks)
- [Conventional Commits](https://www.conventionalcommits.org/)

