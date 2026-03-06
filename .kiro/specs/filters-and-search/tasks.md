# Implementation Plan: Filters and Search

## Overview

Esta feature adiciona capacidades avançadas de filtragem, busca e ordenação ao Task Manager. A implementação seguirá uma abordagem incremental, começando pelas funções utilitárias puras, depois os hooks customizados, e finalmente os componentes de UI. Cada etapa inclui testes de propriedade para validar comportamentos universais.

## Tasks

- [x] 1. Criar tipos e modelos de dados para filtros
  - Criar arquivo `src/types/filter.ts` com interfaces FilterState, StatusFilterType, SortOption, TaskCounts
  - Definir constante DEFAULT_FILTER_STATE com valores padrão
  - Exportar todos os tipos para uso em outros módulos
  - _Requirements: 1.1, 2.1, 3.1, 4.1, 6.5_

- [ ] 2. Implementar funções utilitárias de filtragem e ordenação
  - [x] 2.1 Criar função filterTasks em `src/utils/filterTasks.ts`
    - Implementar filtragem por status (all/pending/completed)
    - Implementar busca case-insensitive em title e description
    - Retornar array filtrado sem modificar original
    - _Requirements: 1.2, 1.3, 2.2, 2.3, 2.4_

  - [ ]* 2.2 Escrever testes de propriedade para filterTasks
    - **Property 1: Search text filtering** - Validar que todos os resultados contêm o texto buscado
    - **Property 2: Case-insensitive search equivalence** - Validar que diferentes cases retornam mesmos resultados
    - **Property 3: Status filter correctness** - Validar que todos os resultados têm o status correto
    - **Validates: Requirements 1.2, 1.3, 2.3, 2.4**

  - [x] 2.3 Criar função sortTasks em `src/utils/sortTasks.ts`
    - Implementar ordenação por data (newest/oldest)
    - Implementar ordenação alfabética (a-z/z-a) case-insensitive
    - Retornar novo array ordenado sem modificar original
    - _Requirements: 4.2, 4.3, 4.4, 4.5_

  - [ ]* 2.4 Escrever testes de propriedade para sortTasks
    - **Property 7: Sort order correctness - newest first** - Validar ordem decrescente por createdAt
    - **Property 8: Sort order correctness - oldest first** - Validar ordem crescente por createdAt
    - **Property 9: Sort order correctness - alphabetical A-Z** - Validar ordem alfabética crescente
    - **Property 10: Sort order correctness - alphabetical Z-A** - Validar ordem alfabética decrescente
    - **Validates: Requirements 4.2, 4.3, 4.4, 4.5**

  - [x] 2.5 Criar função calculateTaskCounts em `src/utils/filterTasks.ts`
    - Calcular total, pending e completed counts
    - Retornar objeto TaskCounts
    - _Requirements: 3.1, 3.2, 3.3_

  - [ ]* 2.6 Escrever testes de propriedade para calculateTaskCounts
    - **Property 4: Task counter accuracy** - Validar que contadores refletem corretamente o total
    - **Property 5: Counter invariance under filtering** - Validar que contadores não mudam com filtros
    - **Validates: Requirements 3.1, 3.2, 3.3, 3.5**

- [ ] 3. Implementar hook useFilters para gerenciamento de estado
  - [x] 3.1 Criar hook useFilters em `src/hooks/useFilters.ts`
    - Gerenciar estado de searchText, statusFilter, sortOption
    - Implementar funções setSearchText, setStatusFilter, setSortOption, clearFilters
    - Calcular hasActiveFilters (comparar com defaults)
    - Usar useMemo para computar filteredTasks (aplicar filterTasks e sortTasks)
    - Usar useMemo para computar taskCounts
    - _Requirements: 1.1, 2.1, 4.1, 5.2, 5.3, 5.4, 9.1, 9.2, 9.3, 9.5_

  - [x] 3.2 Adicionar persistência em LocalStorage ao useFilters
    - Carregar filter state do LocalStorage na inicialização
    - Validar estrutura com type guard isValidFilterState
    - Usar defaults se inválido ou ausente
    - Salvar mudanças no LocalStorage (debounce de 500ms)
    - Tratar erros de storage silenciosamente
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]* 3.3 Escrever testes unitários para useFilters
    - Testar inicialização com defaults
    - Testar atualização de cada filtro
    - Testar clearFilters reseta para defaults
    - Testar hasActiveFilters detecta filtros ativos
    - Testar persistência em LocalStorage
    - Testar recuperação de estado inválido
    - _Requirements: 5.2, 5.3, 5.4, 6.1, 6.3, 6.4_

  - [ ]* 3.4 Escrever testes de propriedade para useFilters
    - **Property 11: Clear filters button visibility** - Validar que hasActiveFilters é true quando filtros diferem dos defaults
    - **Property 12: Clear filters resets to defaults** - Validar que clearFilters reseta todos os valores
    - **Property 13: Filter persistence round-trip** - Validar que salvar e carregar preserva valores
    - **Property 14: Multiple filters composition** - Validar que múltiplos filtros são aplicados corretamente
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5, 6.1, 6.3, 9.5**

- [ ] 4. Checkpoint - Validar lógica de filtros
  - Executar todos os testes (npm run test)
  - Verificar que funções utilitárias e hook funcionam corretamente
  - Perguntar ao usuário se há dúvidas ou ajustes necessários

- [ ] 5. Implementar componentes de UI para filtros
  - [x] 5.1 Criar componente SearchBar em `src/components/filters/SearchBar.tsx`
    - Renderizar input com label acessível (aria-label)
    - Implementar controlled component (value + onChange)
    - Adicionar ícone de busca
    - Adicionar botão de limpar quando há texto
    - Garantir touch target mínimo de 44x44px
    - _Requirements: 1.1, 1.5, 1.6, 7.3, 8.2, 8.3, 8.4_

  - [ ]* 5.2 Escrever testes unitários para SearchBar
    - Testar renderização de label acessível
    - Testar onChange ao digitar
    - Testar botão de limpar aparece/desaparece
    - Testar navegação por teclado
    - Testar touch target size
    - _Requirements: 1.5, 1.6, 7.3, 8.2, 8.3_

  - [x] 5.3 Criar componente StatusFilter em `src/components/filters/StatusFilter.tsx`
    - Renderizar três botões: All, Pending, Completed
    - Indicar visualmente botão ativo
    - Implementar navegação por arrow keys
    - Adicionar ARIA labels e roles apropriados
    - Anunciar mudanças para screen readers (aria-live)
    - Garantir touch targets mínimos de 44x44px
    - _Requirements: 2.1, 2.5, 2.6, 2.7, 7.4, 8.1, 8.2, 8.3, 8.4_

  - [ ]* 5.4 Escrever testes unitários para StatusFilter
    - Testar renderização dos três botões
    - Testar indicação visual de botão ativo
    - Testar onChange ao clicar
    - Testar navegação por arrow keys
    - Testar ARIA labels e announcements
    - Testar touch target sizes
    - _Requirements: 2.1, 2.5, 2.6, 2.7, 7.4, 8.2, 8.3, 8.4_

  - [x] 5.5 Criar componente SortControls em `src/components/filters/SortControls.tsx`
    - Renderizar select ou radio group com quatro opções
    - Labels: Newest First, Oldest First, A-Z, Z-A
    - Indicar opção ativa
    - Adicionar ARIA labels apropriados
    - Anunciar mudanças para screen readers
    - Garantir touch target mínimo de 44x44px
    - _Requirements: 4.1, 4.6, 4.7, 4.8, 7.5, 8.2, 8.3, 8.4_

  - [ ]* 5.6 Escrever testes unitários para SortControls
    - Testar renderização das quatro opções
    - Testar indicação de opção ativa
    - Testar onChange ao selecionar
    - Testar navegação por teclado
    - Testar ARIA labels e announcements
    - Testar touch target sizes
    - _Requirements: 4.1, 4.6, 4.7, 4.8, 7.5, 8.2, 8.3, 8.4_

  - [x] 5.7 Criar componente TaskCounter em `src/components/filters/TaskCounter.tsx`
    - Exibir três contadores: Total, Pending, Completed
    - Usar aria-live para anunciar mudanças
    - Adaptar layout para mobile/desktop
    - Fornecer contexto visual claro
    - _Requirements: 3.1, 3.2, 3.3, 3.6, 7.1, 7.2_

  - [ ]* 5.8 Escrever testes unitários para TaskCounter
    - Testar renderização dos três contadores
    - Testar valores exibidos corretamente
    - Testar aria-live announcements
    - Testar layout responsivo
    - _Requirements: 3.1, 3.2, 3.3, 3.6, 7.1, 7.2_

  - [ ]* 5.9 Escrever teste de propriedade para TaskCounter
    - **Property 6: Counter reactivity to CRUD operations** - Validar que contadores atualizam imediatamente após criar/editar/deletar tarefas
    - **Validates: Requirements 3.4**

  - [x] 5.10 Criar componente ClearFiltersButton em `src/components/filters/ClearFiltersButton.tsx`
    - Renderizar botão com label claro
    - Controlar visibilidade via prop visible
    - Adicionar ARIA label descritivo
    - Garantir touch target mínimo de 44x44px
    - Fornecer feedback visual ao hover/focus
    - _Requirements: 5.1, 5.5, 5.6, 5.7, 7.6, 8.2, 8.3, 8.4_

  - [ ]* 5.11 Escrever testes unitários para ClearFiltersButton
    - Testar visibilidade baseada em prop
    - Testar onClick é chamado
    - Testar ARIA label
    - Testar navegação por teclado
    - Testar touch target size
    - _Requirements: 5.1, 5.5, 5.6, 5.7, 7.6, 8.2, 8.3, 8.4_

- [ ] 6. Criar componente container FilterBar
  - [x] 6.1 Criar componente FilterBar em `src/components/filters/FilterBar.tsx`
    - Compor todos os sub-componentes (SearchBar, StatusFilter, SortControls, TaskCounter, ClearFiltersButton)
    - Implementar layout responsivo (mobile < 768px, desktop >= 768px)
    - Garantir ordem lógica de tab (keyboard navigation)
    - Adicionar estilos CSS para layout e responsividade
    - _Requirements: 7.1, 7.2, 8.7_

  - [ ]* 6.2 Escrever testes unitários para FilterBar
    - Testar renderização de todos os sub-componentes
    - Testar layout responsivo em diferentes viewports
    - Testar ordem de tab (keyboard navigation)
    - Testar integração entre componentes
    - _Requirements: 7.1, 7.2, 8.7_

- [ ] 7. Implementar estados vazios (empty states)
  - [x] 7.1 Criar componente EmptyState em `src/components/EmptyState.tsx` (ou modificar existente)
    - Detectar se não há tarefas no sistema vs. não há resultados filtrados
    - Exibir mensagem apropriada para cada caso
    - Sugerir limpar filtros quando não há resultados
    - Anunciar mensagens para screen readers (aria-live)
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 7.2 Escrever testes unitários para EmptyState
    - Testar mensagem quando não há tarefas no sistema
    - Testar mensagem quando filtros não retornam resultados
    - Testar sugestão de limpar filtros
    - Testar ARIA announcements
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

  - [ ]* 7.3 Escrever testes de propriedade para empty states
    - **Property 15: Empty state with filtered results** - Validar mensagem correta quando filtros não retornam resultados mas tarefas existem
    - **Property 16: Empty state with no tasks** - Validar mensagem correta quando não há tarefas no sistema
    - **Validates: Requirements 10.1, 10.4**

- [ ] 8. Checkpoint - Validar componentes de UI
  - Executar todos os testes (npm run test)
  - Verificar que componentes renderizam corretamente
  - Testar navegação por teclado manualmente
  - Perguntar ao usuário se há ajustes de UI necessários

- [ ] 9. Integrar filtros com aplicação principal
  - [x] 9.1 Modificar App.tsx para incluir FilterBar
    - Importar useFilters hook
    - Passar filteredTasks para TaskList ao invés de todas as tarefas
    - Passar taskCounts para TaskCounter
    - Renderizar FilterBar acima do TaskList
    - _Requirements: 1.2, 2.2, 2.3, 2.4, 4.2, 4.3, 4.4, 4.5_

  - [x] 9.2 Adicionar região aria-live para anunciar mudanças de resultados
    - Criar região aria-live="polite" para anunciar número de resultados
    - Atualizar mensagem quando filteredTasks muda
    - Formatar mensagem de forma clara (ex: "5 tarefas encontradas")
    - _Requirements: 8.5_

  - [ ]* 9.3 Escrever testes de integração
    - Testar que criar tarefa atualiza lista filtrada se corresponder aos filtros
    - Testar que editar tarefa remove da lista se não corresponder mais aos filtros
    - Testar que deletar tarefa atualiza contadores
    - Testar que mudanças em filtros atualizam TaskList
    - Testar que clearFilters reseta todos os controles
    - _Requirements: 1.2, 2.2, 2.3, 2.4, 3.4, 5.2, 5.3, 5.4_

- [ ] 10. Adicionar estilos CSS para filtros
  - [x] 10.1 Criar arquivo `src/styles/filters.css`
    - Estilos para SearchBar (input, ícone, botão limpar)
    - Estilos para StatusFilter (botões, estado ativo, hover, focus)
    - Estilos para SortControls (select/radio group, estado ativo)
    - Estilos para TaskCounter (layout, tipografia)
    - Estilos para ClearFiltersButton (botão, hover, focus)
    - Estilos para FilterBar (layout responsivo, grid/flexbox)
    - Garantir contraste mínimo 4.5:1 (WCAG 2.2 AA)
    - Garantir indicadores de foco visíveis
    - Garantir touch targets mínimos de 44x44px
    - Suportar zoom até 200% sem perda de funcionalidade
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.3, 8.6_

  - [ ]* 10.2 Validar acessibilidade dos estilos
    - Testar contraste de cores com ferramenta (Axe, WAVE)
    - Testar indicadores de foco visíveis
    - Testar touch target sizes em dispositivo móvel
    - Testar zoom até 200%
    - _Requirements: 8.1, 8.3, 8.6_

- [ ] 11. Otimizar performance
  - [x] 11.1 Adicionar memoization onde necessário
    - Verificar que useMemo está sendo usado para filteredTasks
    - Verificar que useMemo está sendo usado para taskCounts
    - Adicionar useCallback para funções de atualização se necessário
    - _Requirements: 9.1, 9.2, 9.3, 9.5_

  - [ ] 11.2 Adicionar debounce para busca se necessário
    - Avaliar se busca precisa de debounce (testar com 1000 tarefas)
    - Implementar debounce de 300ms se necessário
    - _Requirements: 9.1_

  - [ ]* 11.3 Testar performance com datasets grandes
    - Criar dataset de teste com 1000 tarefas
    - Medir tempo de filtragem (deve ser < 300ms)
    - Medir tempo de ordenação (deve ser < 200ms)
    - Verificar que não há re-renders desnecessários
    - _Requirements: 9.1, 9.2, 9.3, 9.4_

- [ ] 12. Checkpoint final - Validação completa
  - Executar todos os testes (npm run test)
  - Executar linter (npm run lint)
  - Executar build (npm run build)
  - Verificar cobertura de testes (npm run coverage)
  - Testar manualmente todas as funcionalidades
  - Testar acessibilidade com leitor de tela
  - Testar em dispositivos móveis
  - Perguntar ao usuário se está pronto para commit

## Notes

- Tarefas marcadas com `*` são opcionais e podem ser puladas para MVP mais rápido
- Cada tarefa referencia requisitos específicos para rastreabilidade
- Checkpoints garantem validação incremental
- Testes de propriedade validam comportamentos universais de correção
- Testes unitários validam exemplos específicos e edge cases
- A implementação segue padrão de composição de componentes React
- Filtros não modificam dados originais, apenas a visualização
- Performance é garantida através de memoization e algoritmos eficientes
