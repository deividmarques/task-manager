# Guia de Publicação no GitHub

Este guia mostra como publicar o projeto Task Manager no GitHub.

## Passo 1: Criar Repositório no GitHub

1. Acesse https://github.com/new
2. Preencha as informações:
   - **Repository name**: `task-manager`
   - **Description**: `Aplicativo web moderno para gerenciamento de tarefas com React, TypeScript e Vite`
   - **Visibility**: Public ou Private (sua escolha)
   - **NÃO** marque "Initialize this repository with a README" (já temos um)
3. Clique em "Create repository"

## Passo 2: Conectar Repositório Local ao GitHub

Execute os comandos abaixo no terminal (substitua `seu-usuario` pelo seu username do GitHub):

```bash
# Adicionar remote origin
git remote add origin https://github.com/deividmarques/task-manager.git

# Verificar se foi adicionado corretamente
git remote -v

# Renomear branch para main (se necessário)
git branch -M main

# Fazer push inicial
git push -u origin main
```

## Passo 3: Verificar no GitHub

1. Acesse https://github.com/deividmarques/task-manager
2. Verifique se todos os arquivos foram enviados
3. O README.md deve aparecer automaticamente na página inicial

## Passo 4: Configurar GitHub Pages (Opcional)

Para hospedar o aplicativo gratuitamente no GitHub Pages:

1. No repositório, vá em **Settings** → **Pages**
2. Em **Source**, selecione **GitHub Actions**
3. Crie o arquivo `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 18
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/deploy-pages@v4
        id: deployment
```

4. Faça commit e push do arquivo
5. Aguarde o deploy (alguns minutos)
6. Acesse: https://seu-usuario.github.io/task-manager

## Passo 5: Atualizar vite.config.ts (Para GitHub Pages)

Se for usar GitHub Pages, atualize o `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/task-manager/', // Nome do repositório
})
```

## Comandos Úteis

```bash
# Ver status do repositório
git status

# Ver histórico de commits
git log --oneline

# Fazer push de novos commits
git push

# Atualizar do GitHub
git pull

# Ver branches
git branch -a

# Criar nova branch
git checkout -b feature/nova-funcionalidade
```

## Estrutura de Commits

O projeto usa Conventional Commits:

- `feat:` - Nova funcionalidade
- `fix:` - Correção de bug
- `docs:` - Documentação
- `style:` - Formatação
- `refactor:` - Refatoração
- `test:` - Testes
- `chore:` - Manutenção

Exemplo:
```bash
git commit -m "feat: adicionar filtro de tarefas por status"
```

### Checklist Antes de Commitar

**IMPORTANTE**: Sempre execute antes de fazer commit:

```bash
npm run lint    # Deve passar sem erros
npm run test    # Todos os testes devem passar
```

Isso garante qualidade do código e previne falhas no GitHub Actions.

## Próximos Passos

Após publicar no GitHub, você pode:

1. ✅ Adicionar badges ao README (build status, coverage, etc)
2. ✅ Configurar GitHub Actions para CI/CD
3. ✅ Adicionar issues e projects para gerenciar tarefas
4. ✅ Configurar branch protection rules
5. ✅ Adicionar CONTRIBUTING.md para colaboradores
6. ✅ Criar releases e tags para versões

## Problemas Comuns

### Erro: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/deividmarques/task-manager.git
```

### Erro: "failed to push some refs"
```bash
git pull origin main --rebase
git push -u origin main
```

### Erro de autenticação
Use Personal Access Token em vez de senha:
1. GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Selecione scopes: `repo`
4. Use o token como senha ao fazer push

## Recursos

- [GitHub Docs](https://docs.github.com)
- [GitHub Pages](https://pages.github.com)
- [Conventional Commits](https://www.conventionalcommits.org)
- [Vite Deployment](https://vitejs.dev/guide/static-deploy.html)
