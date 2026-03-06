# Configuração do GitHub Pages

## Passo a Passo para Ativar GitHub Pages

### 1. Acessar Configurações do Repositório

1. Vá para: https://github.com/deividmarques/task-manager
2. Clique em **Settings** (Configurações)
3. No menu lateral, clique em **Pages**

### 2. Configurar Source

Na seção **Build and deployment**:

1. Em **Source**, selecione: **GitHub Actions**
2. Salve (se necessário)

### 3. Aguardar o Deploy

1. Vá para a aba **Actions**: https://github.com/deividmarques/task-manager/actions
2. Você verá o workflow "CI/CD - Build, Test and Deploy" executando
3. Aguarde todos os jobs completarem (lint → test → build → deploy)
4. O deploy leva cerca de 2-5 minutos

### 4. Acessar o Site

Após o deploy concluir, seu site estará disponível em:

**https://deividmarques.github.io/task-manager/**

## Pipeline CI/CD Configurado

O GitHub Actions agora executa automaticamente:

### ✅ Job 1: Lint
- Executa ESLint
- Verifica qualidade do código
- Falha se houver erros de lint

### ✅ Job 2: Test
- Executa todos os testes com Vitest
- Gera relatório de coverage
- Upload do relatório como artifact
- Continua mesmo se coverage não atingir 90%

### ✅ Job 3: Build
- Compila o projeto com Vite
- Gera build otimizado para produção
- Upload do build como artifact

### ✅ Job 4: Deploy
- Deploy automático no GitHub Pages
- Apenas em push para branch main
- Publica o conteúdo da pasta dist/

## Workflow Triggers

O workflow executa em:

- ✅ **Push para main**: Deploy completo
- ✅ **Pull Request**: Apenas lint, test e build (sem deploy)
- ✅ **Manual**: Via botão "Run workflow" na aba Actions

## Verificar Status do Deploy

### Via GitHub Actions
1. Acesse: https://github.com/deividmarques/task-manager/actions
2. Veja o status de cada job
3. Clique em um workflow para ver logs detalhados

### Via Commits
- Cada commit terá um ícone indicando o status:
  - ✅ Verde: Sucesso
  - ❌ Vermelho: Falha
  - 🟡 Amarelo: Em execução

## Configurações Aplicadas

### vite.config.ts
```typescript
base: '/task-manager/' // Base path para GitHub Pages
```

### GitHub Actions Workflow
- Arquivo: `.github/workflows/deploy.yml`
- Jobs em sequência com dependências
- Cache de npm para builds mais rápidos
- Upload de artifacts (coverage e build)

## Troubleshooting

### Deploy não aparece
- Verifique se GitHub Pages está ativado em Settings → Pages
- Confirme que Source está em "GitHub Actions"
- Aguarde alguns minutos após o workflow completar

### Erro 404 ao acessar
- Verifique se o base path está correto no vite.config.ts
- Deve ser: `base: '/task-manager/'`
- Faça rebuild e novo push

### Workflow falha no lint
- Execute `npm run lint` localmente
- Corrija os erros
- Commit e push novamente

### Workflow falha nos testes
- Execute `npm run test` localmente
- Corrija os testes que falharam
- Commit e push novamente

## Próximos Passos

### Adicionar Badge ao README
Adicione ao README.md:

```markdown
[![Deploy](https://github.com/deividmarques/task-manager/actions/workflows/deploy.yml/badge.svg)](https://github.com/deividmarques/task-manager/actions/workflows/deploy.yml)
```

### Configurar Custom Domain (Opcional)
1. Settings → Pages → Custom domain
2. Digite seu domínio
3. Configure DNS do seu domínio

### Branch Protection
1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Marque: "Require status checks to pass before merging"
4. Selecione: lint, test, build

## Recursos

- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
