# Task Manager

[![Deploy](https://github.com/deividmarques/task-manager/actions/workflows/deploy.yml/badge.svg)](https://github.com/deividmarques/task-manager/actions/workflows/deploy.yml)

Um aplicativo web moderno para gerenciamento de tarefas, desenvolvido com React, TypeScript e Vite. Focado em usabilidade, acessibilidade e interface responsiva.

🌐 **Demo ao vivo**: https://deividmarques.github.io/task-manager/

## 🚀 Funcionalidades

- ✅ **CRUD Completo**: Criar, visualizar, editar e excluir tarefas
- 💾 **Persistência Automática**: Dados salvos automaticamente no LocalStorage
- 📱 **Interface Responsiva**: Design mobile-first com suporte a desktop
- ♿ **Acessibilidade WCAG 2.2 AA**: Navegação por teclado, leitores de tela, contraste adequado
- 🎨 **UI Moderna**: Interface limpa e intuitiva
- 🔔 **Notificações**: Feedback visual para todas as ações
- ✓ **Status de Tarefas**: Marcar tarefas como pendentes ou concluídas
- 🔍 **Validação**: Validação de formulários com mensagens de erro claras

## 🛠️ Tecnologias

- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite** - Build tool e dev server
- **CSS3** - Estilização (sem frameworks)
- **LocalStorage API** - Persistência de dados
- **ESLint** - Linting
- **Prettier** - Formatação de código
- **Vitest** - Framework de testes
- **React Testing Library** - Testes de componentes
- **fast-check** - Property-based testing

## 📋 Pré-requisitos

- Node.js 18+ 
- npm ou yarn

## 🔧 Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/task-manager.git
cd task-manager
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Acesse http://localhost:5173 no navegador

## 📦 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor de desenvolvimento

# Build
npm run build        # Cria build de produção
npm run preview      # Preview do build de produção

# Qualidade de Código
npm run lint         # Executa ESLint
npm run format       # Formata código com Prettier

# Testes
npm run test         # Executa testes
npm run test:ui      # Interface visual para testes
npm run coverage     # Relatório de cobertura de testes
```

## 🏗️ Estrutura do Projeto

```
src/
├── components/          # Componentes React
│   ├── App.tsx         # Componente principal
│   ├── TaskList.tsx    # Lista de tarefas
│   ├── TaskItem.tsx    # Item individual de tarefa
│   ├── TaskForm.tsx    # Formulário criar/editar
│   ├── ConfirmDialog.tsx   # Diálogo de confirmação
│   ├── EmptyState.tsx      # Estado vazio
│   ├── ErrorBoundary.tsx   # Tratamento de erros
│   └── LiveRegion.tsx      # Anúncios para leitores de tela
├── hooks/              # Custom React Hooks
│   ├── useTasks.ts     # Gerenciamento de tarefas
│   ├── useLocalStorage.ts  # Persistência
│   └── useToast.ts     # Notificações
├── types/              # Definições TypeScript
│   └── task.ts         # Tipos de Task
├── utils/              # Utilitários
│   ├── validation.ts   # Validação de dados
│   └── storage.ts      # Operações de storage
├── styles/             # Estilos CSS
│   └── global.css      # Estilos globais
└── main.tsx            # Entry point
```

## ♿ Acessibilidade

Este projeto foi desenvolvido seguindo as diretrizes WCAG 2.2 nível AA:

- ✓ Contraste de cores adequado (4.5:1 para texto, 3:1 para componentes)
- ✓ Navegação completa por teclado
- ✓ Suporte a leitores de tela com ARIA
- ✓ Touch targets mínimos de 44x44px
- ✓ Indicadores de foco visíveis
- ✓ Labels acessíveis em todos os controles
- ✓ Live regions para anúncios dinâmicos
- ✓ Ordem de tabulação lógica

## 🧪 Testes

O projeto utiliza Vitest + React Testing Library para testes:

- **Testes Unitários**: Componentes e utilitários
- **Coverage Mínimo**: 50% (line, branch, function, statements)

```bash
npm run test           # Executa todos os testes
npm run test:watch     # Modo watch para desenvolvimento
npm run test:ui        # Interface visual para testes
npm run coverage       # Gera relatório de cobertura
```

## 📱 Responsividade

- **Mobile**: 320px - 767px (layout de coluna única)
- **Desktop**: 768px+ (layout em grid)
- Design mobile-first
- Suporte a touch e mouse

## 🔒 Tratamento de Erros

- Error Boundary para erros de renderização
- Validação de entrada de dados
- Tratamento de falhas de LocalStorage
- Recuperação de dados corrompidos
- Mensagens de erro claras e acionáveis

## 🤖 CI/CD e Automação

### GitHub Actions

O projeto inclui workflows automatizados para análise de PRs:

- **PR Validation**: Roda lint, tests e build automaticamente
- **AI Code Review**: Análise inteligente com feedback automático
- **Coverage Reports**: Relatórios de cobertura de testes

```bash
# Ver status dos checks
gh pr checks

# Ver detalhes do workflow
gh run view
```

Veja [docs/GITHUB_ACTIONS_SETUP.md](docs/GITHUB_ACTIONS_SETUP.md) para configuração completa.

### Validação Local

Antes de fazer push, valide localmente:

```bash
npm run pr:check     # Validação rápida
npm run validate     # Validação completa
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

**Nota:** Os workflows do GitHub Actions rodarão automaticamente para validar sua PR.

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👤 Autor

Desenvolvido com ❤️ usando Kiro AI Assistant

## 🙏 Agradecimentos

- Desenvolvido seguindo metodologia Spec-Driven Development
- Implementado com foco em acessibilidade e boas práticas
- Testado com property-based testing para maior confiabilidade
