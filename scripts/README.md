# Scripts do Projeto

## create-pr.sh

Script para criar Pull Requests de forma flexível usando GitHub CLI.

### Pré-requisitos

- GitHub CLI (`gh`) instalado: `brew install gh`
- Autenticado no GitHub: `gh auth login`

### Uso

#### 1. PR da branch atual para `main` (padrão)

```bash
npm run pr
```

Cria uma PR da branch atual para `main` com título e descrição automáticos baseados no nome da branch.

#### 2. PR da branch atual para outra branch

```bash
npm run pr develop
npm run pr staging
npm run pr production
```

Cria uma PR da branch atual para a branch especificada.

#### 3. Controle total com flags do GitHub CLI

```bash
npm run pr:custom -- --base develop --title "Meu título customizado"
npm run pr:custom -- --base main --draft
npm run pr:custom -- --base develop --reviewer usuario1,usuario2
```

Passa todos os argumentos diretamente para `gh pr create`.

### Exemplos

**Cenário 1: Feature branch para main**
```bash
# Você está em: feature/user-authentication
npm run pr
# Cria: PR "feat: User Authentication" para main
```

**Cenário 2: Bugfix para develop**
```bash
# Você está em: bugfix/login-error
npm run pr develop
# Cria: PR "fix: Login Error" para develop
```

**Cenário 3: PR como draft**
```bash
npm run pr:custom -- --base main --draft
# Cria: PR em modo draft (rascunho)
```

**Cenário 4: PR com reviewers**
```bash
npm run pr:custom -- --base main --reviewer deividmarques,outro-usuario
# Cria: PR e solicita review dos usuários especificados
```

### Convenções de Branch

O script detecta automaticamente o tipo de commit baseado no prefixo da branch:

| Prefixo da Branch | Tipo de Commit | Exemplo |
|-------------------|----------------|---------|
| `feature/`        | `feat`         | feat: Add user authentication |
| `bugfix/` ou `fix/` | `fix`        | fix: Resolve login error |
| `docs/`           | `docs`         | docs: Update API documentation |
| `refactor/`       | `refactor`     | refactor: Improve code structure |
| `test/`           | `test`         | test: Add unit tests |
| Outros            | `chore`        | chore: Update dependencies |

### Template da PR

O script cria PRs com um template padrão incluindo:

- Descrição da mudança
- Checklist de validações (lint, test, build, coverage)
- Tipo de mudança (feature, bugfix, etc.)
- Checklist geral (padrões, testes, documentação)

### Flags Úteis do GitHub CLI

Você pode usar qualquer flag do `gh pr create`:

- `--draft` - Cria PR como rascunho
- `--reviewer user1,user2` - Adiciona reviewers
- `--assignee user` - Atribui a PR a alguém
- `--label bug,enhancement` - Adiciona labels
- `--milestone "v1.0"` - Associa a um milestone
- `--web` - Abre o navegador para criar a PR manualmente

Documentação completa: https://cli.github.com/manual/gh_pr_create
