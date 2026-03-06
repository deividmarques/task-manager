# Implementation Plan: Task Management App

## Overview

Este plano de implementação detalha as tarefas necessárias para construir uma aplicação web de gerenciamento de tarefas usando React, TypeScript e Vite. A implementação seguirá uma abordagem incremental, começando pela estrutura base, seguindo para os componentes principais, adicionando persistência, e finalizando com acessibilidade e testes.

A aplicação será construída com foco em:
- Arquitetura de componentes React com hooks customizados
- Persistência local via LocalStorage
- Interface responsiva mobile-first
- Acessibilidade completa (WCAG 2.2 AA)
- Testes unitários e baseados em propriedades

## Tasks

- [x] 1. Setup inicial do projeto e estrutura base
  - Criar projeto Vite com template React + TypeScript
  - Configurar ESLint e Prettier
  - Configurar Vitest e React Testing Library
  - Instalar fast-check para property-based testing
  - Criar estrutura de diretórios (components, hooks, types, utils, styles)
  - Configurar coverage reporting (mínimo 90%)
  - _Requirements: Todos (setup necessário)_

- [x] 2. Implementar tipos e modelos de dados
  - [x] 2.1 Criar definições de tipos TypeScript
    - Definir interface `Task` com id, title, description, status, createdAt, updatedAt
    - Definir type `TaskStatus` como 'pending' | 'completed'
    - Definir interface `TaskFormData` para dados do formulário
    - Definir interface `TaskFormErrors` para erros de validação
    - Criar arquivo `src/types/task.ts`
    - _Requirements: 1.2, 1.5, 5.1, 6.4_

  - [ ]* 2.2 Escrever property test para tipos de dados
    - **Property 22: Storage round-trip integrity**
    - **Validates: Requirements 6.2, 6.4**

- [x] 3. Implementar utilitários de validação
  - [x] 3.1 Criar funções de validação
    - Implementar `validateTitle(title: string)` - trim, não vazio, máx 200 chars
    - Implementar `validateDescription(description: string)` - trim, máx 1000 chars
    - Implementar `validateTaskFormData(data: TaskFormData)` - retorna erros
    - Criar arquivo `src/utils/validation.ts`
    - _Requirements: 1.3, 3.4, 8.3_

  - [ ]* 3.2 Escrever property tests para validação
    - **Property 2: Task creation with valid title**
    - **Validates: Requirements 1.2**
    - **Property 3: Invalid title rejection**
    - **Validates: Requirements 1.3**

  - [ ]* 3.3 Escrever unit tests para validação
    - Testar títulos válidos (casos normais)
    - Testar títulos inválidos (vazio, whitespace, muito longo)
    - Testar descrições válidas e inválidas
    - _Requirements: 1.3, 3.4, 8.3_

- [x] 4. Implementar utilitários de storage
  - [x] 4.1 Criar funções de LocalStorage
    - Implementar `saveTasks(tasks: Task[])` com tratamento de erros
    - Implementar `loadTasks()` com validação e parsing
    - Implementar `isStorageAvailable()` para detectar disponibilidade
    - Adicionar tratamento de quota exceeded
    - Criar arquivo `src/utils/storage.ts`
    - _Requirements: 6.1, 6.2, 6.3, 6.5_

  - [ ]* 4.2 Escrever property test para storage
    - **Property 22: Storage round-trip integrity**
    - **Validates: Requirements 6.2, 6.4**

  - [ ]* 4.3 Escrever unit tests para storage
    - Testar salvamento e carregamento bem-sucedidos
    - Testar LocalStorage indisponível (Edge Case 6.3)
    - Testar falha de escrita (Edge Case 6.5)
    - Testar dados corrompidos
    - _Requirements: 6.1, 6.2, 6.3, 6.5_

- [x] 5. Implementar custom hooks
  - [x] 5.1 Criar hook useLocalStorage
    - Implementar hook genérico `useLocalStorage<T>(key, initialValue)`
    - Retornar [value, setValue, error]
    - Sincronizar com mudanças de storage
    - Tratar erros de serialização/deserialização
    - Criar arquivo `src/hooks/useLocalStorage.ts`
    - _Requirements: 6.1, 6.2, 6.3_

  - [ ]* 5.2 Escrever unit tests para useLocalStorage
    - Testar inicialização com valor padrão
    - Testar persistência de mudanças
    - Testar tratamento de erros
    - _Requirements: 6.1, 6.2, 6.3_

  - [x] 5.3 Criar hook useToast
    - Implementar gerenciamento de notificações temporárias
    - Retornar { toasts, showToast, dismissToast }
    - Implementar auto-dismiss após 3 segundos
    - Gerar IDs únicos para toasts
    - Criar arquivo `src/hooks/useToast.ts`
    - _Requirements: 8.1, 8.2_

  - [ ]* 5.4 Escrever unit tests para useToast
    - Testar criação e remoção de toasts
    - Testar auto-dismiss
    - Testar múltiplos toasts simultâneos
    - _Requirements: 8.1, 8.2_

  - [x] 5.5 Criar hook useTasks
    - Implementar todas as operações CRUD de tarefas
    - Usar useLocalStorage internamente
    - Implementar createTask, updateTask, deleteTask, toggleTaskStatus
    - Gerar IDs com crypto.randomUUID()
    - Gerenciar timestamps (createdAt, updatedAt)
    - Retornar { tasks, loading, error, ...operations }
    - Criar arquivo `src/hooks/useTasks.ts`
    - _Requirements: 1.2, 1.4, 1.5, 3.2, 4.2, 5.2, 6.1_

  - [ ]* 5.6 Escrever property tests para useTasks
    - **Property 4: Task list growth and form reset**
    - **Validates: Requirements 1.4**
    - **Property 5: Unique task identifiers**
    - **Validates: Requirements 1.5**
    - **Property 10: Task update persistence**
    - **Validates: Requirements 3.2**
    - **Property 15: Confirmed deletion removes task**
    - **Validates: Requirements 4.2, 4.5**
    - **Property 18: Status toggle round-trip**
    - **Validates: Requirements 5.2**
    - **Property 21: CRUD operations persistence**
    - **Validates: Requirements 6.1**

  - [ ]* 5.7 Escrever unit tests para useTasks
    - Testar criação de tarefa com dados válidos
    - Testar atualização de tarefa existente
    - Testar exclusão de tarefa
    - Testar toggle de status
    - Testar geração de IDs únicos
    - _Requirements: 1.2, 1.4, 1.5, 3.2, 4.2, 5.2_

- [x] 6. Checkpoint - Validar fundação
  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Implementar componente EmptyState
  - [x] 7.1 Criar componente EmptyState
    - Exibir mensagem amigável quando lista está vazia
    - Incluir ícone ou ilustração
    - Sugerir criação da primeira tarefa
    - Aplicar estilos responsivos
    - Criar arquivo `src/components/EmptyState.tsx`
    - _Requirements: 2.2_

  - [ ]* 7.2 Escrever unit test para EmptyState
    - Testar renderização da mensagem (Edge Case 2.2)
    - Testar acessibilidade do componente
    - _Requirements: 2.2_

- [x] 8. Implementar componente ConfirmDialog
  - [x] 8.1 Criar componente ConfirmDialog
    - Implementar modal de confirmação acessível
    - Capturar foco quando aberto (focus trap)
    - Permitir confirmação via Enter e cancelamento via Escape
    - Bloquear interação com fundo (overlay)
    - Usar atributos ARIA apropriados (role="dialog", aria-modal, aria-labelledby)
    - Aplicar estilos responsivos
    - Criar arquivo `src/components/ConfirmDialog.tsx`
    - _Requirements: 4.1, 9.1, 9.2, 9.5_

  - [ ]* 8.2 Escrever property test para ConfirmDialog
    - **Property 14: Delete confirmation dialog**
    - **Validates: Requirements 4.1**

  - [ ]* 8.3 Escrever unit tests para ConfirmDialog
    - Testar captura de foco ao abrir
    - Testar confirmação via Enter
    - Testar cancelamento via Escape
    - Testar acessibilidade (ARIA attributes)
    - _Requirements: 4.1, 9.2, 9.5_

- [x] 9. Implementar componente TaskForm
  - [x] 9.1 Criar componente TaskForm
    - Implementar formulário controlado com useState
    - Campos: título (input) e descrição (textarea)
    - Validação inline com exibição de erros
    - Botões Submit e Cancel
    - Suportar modo criar e editar (prop task opcional)
    - Aplicar estilos responsivos
    - Adicionar labels acessíveis para todos os campos
    - Exibir erros com aria-describedby
    - Criar arquivo `src/components/TaskForm.tsx`
    - _Requirements: 1.1, 1.3, 3.1, 3.4, 8.3, 9.6_

  - [ ]* 9.2 Escrever property tests para TaskForm
    - **Property 1: Form visibility on add action**
    - **Validates: Requirements 1.1**
    - **Property 3: Invalid title rejection**
    - **Validates: Requirements 1.3**
    - **Property 9: Edit form population**
    - **Validates: Requirements 3.1**
    - **Property 12: Edit validation maintains original on error**
    - **Validates: Requirements 3.4**
    - **Property 27: Input validation before processing**
    - **Validates: Requirements 8.3**
    - **Property 32: Form control labels**
    - **Validates: Requirements 9.6**

  - [ ]* 9.3 Escrever unit tests para TaskForm
    - Testar modo criar (sem task prop)
    - Testar modo editar (com task prop)
    - Testar validação de título vazio
    - Testar validação de título muito longo
    - Testar validação de descrição muito longa
    - Testar cancelamento de edição
    - Testar acessibilidade (labels, aria-describedby)
    - _Requirements: 1.1, 1.3, 3.1, 3.4, 8.3, 9.6_

- [x] 10. Implementar componente TaskItem
  - [x] 10.1 Criar componente TaskItem
    - Exibir título, descrição, status e data de criação
    - Implementar checkbox para toggle de status
    - Botões de editar e excluir
    - Aplicar estilos diferenciados para status concluído (strikethrough)
    - Garantir touch targets mínimos de 44x44px em mobile
    - Adicionar atributos ARIA apropriados
    - Usar ícones com textos alternativos
    - Indicar status com ícone além de cor
    - Criar arquivo `src/components/TaskItem.tsx`
    - _Requirements: 2.3, 5.2, 5.3, 5.4, 7.3, 9.2, 9.5, 9.9, 9.10_

  - [ ]* 10.2 Escrever property tests para TaskItem
    - **Property 7: Task rendering completeness**
    - **Validates: Requirements 2.3**
    - **Property 19: Status visual correspondence**
    - **Validates: Requirements 5.3, 5.4**
    - **Property 23: Touch target sizing on mobile**
    - **Validates: Requirements 7.3**
    - **Property 29: ARIA attributes presence**
    - **Validates: Requirements 9.2**
    - **Property 35: Non-textual element accessibility**
    - **Validates: Requirements 9.9**
    - **Property 36: Multi-modal information presentation**
    - **Validates: Requirements 9.10**

  - [ ]* 10.3 Escrever unit tests para TaskItem
    - Testar renderização de todos os campos
    - Testar estilos de status concluído vs pendente
    - Testar callbacks de ações (edit, delete, toggle)
    - Testar touch targets em viewport mobile
    - Testar acessibilidade (ARIA, alt texts)
    - _Requirements: 2.3, 5.3, 5.4, 7.3, 9.2, 9.9, 9.10_

- [x] 11. Implementar componente TaskList
  - [x] 11.1 Criar componente TaskList
    - Renderizar lista de TaskItem ou EmptyState
    - Ordenar tarefas por createdAt (mais recentes primeiro)
    - Aplicar layout responsivo (coluna única em mobile, grid em desktop)
    - Garantir ordem de tabulação lógica
    - Criar arquivo `src/components/TaskList.tsx`
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 9.8_

  - [ ]* 11.2 Escrever property tests para TaskList
    - **Property 6: Task list ordering**
    - **Validates: Requirements 2.1**
    - **Property 8: Responsive layout adaptation**
    - **Validates: Requirements 2.4, 2.5**
    - **Property 34: Logical tab order**
    - **Validates: Requirements 9.8**

  - [ ]* 11.3 Escrever unit tests para TaskList
    - Testar renderização de EmptyState quando vazio (Edge Case 2.2)
    - Testar renderização de múltiplas tarefas
    - Testar ordenação por data
    - Testar layout responsivo em diferentes viewports
    - Testar ordem de tabulação
    - _Requirements: 2.1, 2.2, 2.4, 2.5, 9.8_

- [-] 12. Checkpoint - Validar componentes individuais
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Implementar componente App
  - [ ] 13.1 Criar componente App principal
    - Usar hook useTasks para gerenciar estado
    - Usar hook useToast para notificações
    - Gerenciar estado de UI (formulário aberto/fechado, tarefa em edição, diálogo de confirmação)
    - Implementar handlers para todas as ações (create, edit, delete, toggle)
    - Renderizar TaskForm, TaskList e ConfirmDialog condicionalmente
    - Exibir toasts para feedback de operações
    - Exibir warning se LocalStorage indisponível
    - Criar arquivo `src/App.tsx`
    - _Requirements: 1.1, 1.4, 3.3, 3.5, 4.1, 4.3, 4.4, 6.3, 8.1, 8.2_

  - [ ]* 13.2 Escrever property tests para App
    - **Property 1: Form visibility on add action**
    - **Validates: Requirements 1.1**
    - **Property 4: Task list growth and form reset**
    - **Validates: Requirements 1.4**
    - **Property 11: Edit cancellation preserves original**
    - **Validates: Requirements 3.3**
    - **Property 13: Update visibility**
    - **Validates: Requirements 3.5**
    - **Property 16: Cancelled deletion preserves task**
    - **Validates: Requirements 4.3**
    - **Property 25: Success feedback visibility**
    - **Validates: Requirements 8.1**
    - **Property 26: Error feedback visibility**
    - **Validates: Requirements 8.2**

  - [ ]* 13.3 Escrever integration tests para App
    - Testar fluxo completo de criar tarefa
    - Testar fluxo completo de editar tarefa
    - Testar fluxo completo de excluir tarefa (com confirmação)
    - Testar fluxo de cancelar exclusão
    - Testar fluxo de toggle de status
    - Testar exibição de toasts de sucesso e erro
    - Testar warning de LocalStorage indisponível
    - _Requirements: 1.1, 1.4, 3.3, 3.5, 4.1, 4.3, 6.3, 8.1, 8.2_

- [ ] 14. Implementar estilos globais e responsivos
  - [ ] 14.1 Criar estilos CSS
    - Implementar CSS reset/normalize
    - Definir variáveis CSS para cores, espaçamentos, fontes
    - Garantir contraste mínimo 4.5:1 para texto normal
    - Garantir contraste mínimo 3:1 para componentes UI
    - Implementar estilos mobile-first com media queries
    - Definir breakpoint em 768px para desktop
    - Garantir font-size mínimo de 16px
    - Implementar estilos de hover e focus visíveis
    - Aplicar estilos para touch targets (min 44x44px em mobile)
    - Testar em viewport mínimo de 320px
    - Criar arquivo `src/styles/global.css`
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 8.4, 9.3, 9.4, 9.5_

  - [ ]* 14.2 Escrever property tests para estilos
    - **Property 8: Responsive layout adaptation**
    - **Validates: Requirements 2.4, 2.5, 7.2**
    - **Property 23: Touch target sizing on mobile**
    - **Validates: Requirements 7.3**
    - **Property 24: Text legibility across viewports**
    - **Validates: Requirements 7.4**
    - **Property 28: Interactive element feedback states**
    - **Validates: Requirements 8.4**
    - **Property 30: Color contrast compliance**
    - **Validates: Requirements 9.3, 9.4**
    - **Property 31: Keyboard navigation completeness**
    - **Validates: Requirements 9.5**

  - [ ]* 14.3 Escrever unit tests para responsividade
    - Testar viewport mínimo de 320px (Edge Case 7.1)
    - Testar breakpoint de 768px
    - Testar contraste de cores com ferramentas automatizadas
    - Testar tamanhos de touch targets
    - _Requirements: 7.1, 7.2, 7.3, 9.3, 9.4_

- [ ] 15. Implementar acessibilidade avançada
  - [ ] 15.1 Adicionar live regions para anúncios
    - Criar componente LiveRegion com aria-live="polite"
    - Anunciar criação de tarefas
    - Anunciar atualização de tarefas
    - Anunciar exclusão de tarefas
    - Anunciar mudanças de status
    - Integrar com toasts para anúncios duplos (visual + screen reader)
    - _Requirements: 9.7_

  - [ ]* 15.2 Escrever property test para live regions
    - **Property 33: Dynamic content announcements**
    - **Validates: Requirements 9.7**

  - [ ]* 15.3 Escrever unit tests para acessibilidade
    - Testar anúncios de screen reader para cada operação
    - Testar navegação completa via teclado
    - Testar focus trap em diálogos
    - _Requirements: 9.7_

- [ ] 16. Implementar tratamento de erros robusto
  - [ ] 16.1 Adicionar Error Boundary
    - Criar componente ErrorBoundary
    - Capturar erros de renderização
    - Exibir fallback UI amigável
    - Fornecer botão de reload
    - Logar erros no console
    - _Requirements: 8.2_

  - [ ] 16.2 Adicionar tratamento de erros de storage
    - Detectar LocalStorage indisponível na inicialização
    - Exibir warning persistente se indisponível
    - Implementar modo in-memory fallback
    - Tratar quota exceeded com mensagem específica
    - Tratar dados corrompidos com recuperação parcial
    - _Requirements: 6.3, 6.5, 8.2_

  - [ ]* 16.3 Escrever unit tests para tratamento de erros
    - Testar ErrorBoundary com erro simulado
    - Testar LocalStorage indisponível (Edge Case 6.3)
    - Testar quota exceeded (Edge Case 6.5)
    - Testar dados corrompidos
    - _Requirements: 6.3, 6.5, 8.2_

- [ ] 17. Checkpoint - Validar aplicação completa
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 18. Configurar entry point e build
  - [ ] 18.1 Configurar main.tsx e index.html
    - Criar arquivo `src/main.tsx` com ReactDOM.render
    - Importar estilos globais
    - Configurar `index.html` com meta tags apropriadas
    - Adicionar meta viewport para responsividade
    - Adicionar lang="pt-BR" para acessibilidade
    - Configurar título da página
    - _Requirements: 7.2, 9.1_

  - [ ] 18.2 Configurar build de produção
    - Verificar configuração do Vite
    - Testar build de produção
    - Verificar otimizações (minificação, tree-shaking)
    - _Requirements: Todos (deployment)_

- [ ] 19. Testes finais de integração e cobertura
  - [ ]* 19.1 Executar todos os testes e verificar cobertura
    - Executar suite completa de testes unitários
    - Executar suite completa de property-based tests
    - Verificar cobertura mínima de 90% (line, branch, function)
    - Identificar e testar gaps de cobertura
    - _Requirements: Todos_

  - [ ]* 19.2 Testes de acessibilidade automatizados
    - Executar axe-core ou similar em todos os componentes
    - Verificar violações WCAG 2.2 AA
    - Corrigir violações encontradas
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 9.9, 9.10_

- [ ] 20. Checkpoint final - Validação completa
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tarefas marcadas com `*` são opcionais e podem ser puladas para um MVP mais rápido
- Cada tarefa referencia requisitos específicos para rastreabilidade
- Checkpoints garantem validação incremental
- Property tests validam propriedades universais de correção
- Unit tests validam casos específicos e edge cases
- Meta de cobertura: 90% (line, branch, function)
- Todas as 36 propriedades de correção do design devem ser implementadas como property tests
- Foco em acessibilidade desde o início (WCAG 2.2 AA)
- Implementação mobile-first com breakpoint em 768px
