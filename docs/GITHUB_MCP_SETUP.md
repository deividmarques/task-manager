# GitHub MCP Server - Configuração

Este documento explica como configurar e usar o GitHub MCP Server no Kiro.

## O que é?

O GitHub MCP Server permite que você interaja com repositórios do GitHub diretamente do Kiro:
- Navegar em repositórios públicos
- Explorar diretórios e arquivos
- Ler conteúdo de arquivos
- Acessar repositórios privados (com token)

## Configuração

### 1. Arquivo de Configuração

O servidor já está configurado em `.kiro/settings/mcp.json`:

```json
{
  "mcpServers": {
    "github-repo-mcp": {
      "command": "npx",
      "args": ["-y", "github-repo-mcp"],
      "env": {
        "GITHUB_TOKEN": ""
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### 2. Adicionar GitHub Token (Opcional mas Recomendado)

Sem token, você tem limite de 60 requisições/hora. Com token, o limite aumenta para 5000/hora.

#### Criar Token:

1. Acesse: https://github.com/settings/tokens
2. Clique em "Generate new token" → "Generate new token (classic)"
3. Dê um nome: "Kiro MCP Server"
4. Selecione os escopos:
   - `repo` (para acessar repositórios privados)
   - `read:org` (para acessar repos de organizações)
5. Clique em "Generate token"
6. Copie o token (começa com `ghp_...`)

#### Adicionar Token ao MCP:

Edite `.kiro/settings/mcp.json` e adicione o token:

```json
{
  "mcpServers": {
    "github-repo-mcp": {
      "command": "npx",
      "args": ["-y", "github-repo-mcp"],
      "env": {
        "GITHUB_TOKEN": "ghp_seu_token_aqui"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

### 3. Reiniciar Kiro

Após adicionar o token, reinicie o Kiro para aplicar as mudanças.

## Como Usar

### Ferramentas Disponíveis

O MCP server fornece 3 ferramentas principais:

#### 1. `getRepoAllDirectories`
Lista todos os arquivos e diretórios na raiz do repositório.

**Exemplo de uso:**
```
"Mostre o conteúdo do repositório https://github.com/deividmarques/task-manager"
```

#### 2. `getRepoDirectories`
Lista o conteúdo de um diretório específico.

**Exemplo de uso:**
```
"Quais arquivos estão na pasta src do repositório https://github.com/deividmarques/task-manager?"
```

#### 3. `getRepoFile`
Lê o conteúdo de um arquivo específico.

**Exemplo de uso:**
```
"Mostre o arquivo README.md do repositório https://github.com/deividmarques/task-manager"
```

## Exemplos Práticos

### Explorar um Repositório

```
Você: "Explore o repositório https://github.com/facebook/react e me diga quais são os principais diretórios"

Kiro: [Usa getRepoAllDirectories para listar]
```

### Ler Código de Outro Projeto

```
Você: "Leia o arquivo package.json do repositório https://github.com/vercel/next.js"

Kiro: [Usa getRepoFile para ler o arquivo]
```

### Analisar Estrutura de Projeto

```
Você: "Analise a estrutura do diretório src em https://github.com/vuejs/core"

Kiro: [Usa getRepoDirectories para explorar]
```

## Limitações

- **Rate Limiting**: Sem token = 60 req/hora, com token = 5000 req/hora
- **Repositórios Privados**: Requer token com permissões adequadas
- **Arquivos Binários**: Não exibe conteúdo de arquivos binários
- **Arquivos Grandes**: GitHub API tem limite de tamanho de arquivo

## Troubleshooting

### "Rate limit exceeded"
- Adicione um GitHub token conforme instruções acima

### "Command not found"
- Certifique-se que Node.js e npm estão instalados
- Execute: `npm install -g npx`

### "Connection errors"
- Verifique sua conexão com internet
- Verifique status da API do GitHub: https://www.githubstatus.com/

### MCP Server não aparece no Kiro
- Reinicie o Kiro
- Verifique se o arquivo `.kiro/settings/mcp.json` está correto
- Verifique logs do Kiro para erros

## Auto-Approve (Opcional)

Para não precisar aprovar cada chamada, adicione as ferramentas em `autoApprove`:

```json
{
  "mcpServers": {
    "github-repo-mcp": {
      "command": "npx",
      "args": ["-y", "github-repo-mcp"],
      "env": {
        "GITHUB_TOKEN": "ghp_seu_token_aqui"
      },
      "disabled": false,
      "autoApprove": [
        "getRepoAllDirectories",
        "getRepoDirectories",
        "getRepoFile"
      ]
    }
  }
}
```

## Recursos Adicionais

- [GitHub MCP Server no npm](https://www.npmjs.com/package/github-repo-mcp)
- [Model Context Protocol](https://modelcontextprotocol.io/)
- [GitHub API Documentation](https://docs.github.com/en/rest)
