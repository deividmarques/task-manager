# Design Document: Filters and Search

## Overview

A feature de Filtros e Busca estende o Task Manager existente com capacidades avançadas de filtragem, busca e ordenação de tarefas. Esta feature permite aos usuários encontrar rapidamente tarefas específicas, visualizar subconjuntos de tarefas baseados em status, e organizar tarefas de acordo com suas preferências.

### Objetivos Principais

- Fornecer busca em tempo real por título e descrição de tarefas
- Permitir filtragem por status (todas, pendentes, concluídas)
- Oferecer múltiplas opções de ordenação (data, alfabética)
- Exibir contadores de tarefas para visão geral rápida
- Persistir preferências de filtro entre sessões
- Manter acessibilidade WCAG 2.2 AA completa
- Garantir performance com até 1000 tarefas

### Escopo

A feature cobre:
- Barra de busca com filtragem em tempo real
- Controles de filtro por status (All/Pending/Completed)
- Controles de ordenação (Newest/Oldest/A-Z/Z-A)
- Contadores de tarefas (total, pendentes, concluídas)
- Botão para limpar todos os filtros
- Persistência de estado de filtros em LocalStorage
- Estados vazios informativos
- Design responsivo mobile-first
- Acessibilidade completa via teclado e leitores de tela

Fora do escopo:
- Filtros por data de criação/modificação
- Busca avançada com operadores booleanos
- Filtros por múltiplos critérios simultâneos (além dos já especificados)
- Tags ou categorias
- Busca por expressões regulares
- Histórico de buscas

## Architecture

### Integração com Arquitetura Existente

A feature de Filtros e Busca se integra à arquitetura existente do Task Manager como uma camada de apresentação adicional que não modifica a lógica de negócio central:

```
┌─────────────────────────────────────────┐
│      Filter/Search UI Layer             │
│  (FilterBar, SearchInput, SortControls) │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Filter State Management            │
│    (useFilters hook + React State)      │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Filtering/Sorting Logic            │
│  (Pure functions for filter/sort)       │
└──────────────┬──────────────────────────┘
               │
┌──────────────▼──────────────────────────┐
│      Existing Task Management           │
│    (useTasks hook, CRUD operations)     │
└─────────────────────────────────────────┘
```

### Padrões Arquiteturais

1. **Separation of Concerns**: Filtros não modificam dados originais, apenas a visualização
2. **Derived State**: Lista filtrada é computada a partir do estado original
3. **Memoization**: Uso de useMemo para otimizar cálculos de filtragem
4. **Custom Hook Pattern**: useFilters encapsula toda lógica de filtro
5. **Pure Functions**: Funções de filtro e ordenação são puras e testáveis
6. **Composition**: Componentes de filtro são compostos e reutilizáveis

### Fluxo de Dados

```
User Input (Search/Filter/Sort)
    ↓
Filter State Update (useFilters)
    ↓
Persist to LocalStorage
    ↓
Compute Filtered Tasks (useMemo)
    ↓
Render Filtered TaskList
    ↓
Announce Changes (aria-live)
```

### Estrutura de Diretórios Atualizada

```
src/
├── components/
│   ├── filters/
│   │   ├── SearchBar.tsx         # Barra de busca
│   │   ├── StatusFilter.tsx      # Filtro por status
│   │   ├── SortControls.tsx      # Controles de ordenação
│   │   ├── TaskCounter.tsx       # Contadores de tarefas
│   │   ├── ClearFiltersButton.tsx # Botão limpar filtros
│   │   └── FilterBar.tsx         # Container dos filtros
│   ├── TaskList.tsx              # (Modificado para aceitar tarefas filtradas)
│   └── ...
├── hooks/
│   ├── useFilters.ts             # Hook para gerenciar filtros
│   └── ...
├── utils/
│   ├── filterTasks.ts            # Funções de filtragem
│   ├── sortTasks.ts              # Funções de ordenação
│   └── ...
└── types/
    ├── filter.ts                 # Tipos de filtros
    └── ...
```

## Components and Interfaces

### Novos Componentes

#### FilterBar Component
Container principal que agrupa todos os controles de filtro.

**Responsabilidades:**
- Organizar layout dos controles de filtro
- Adaptar layout para mobile/desktop
- Coordenar comunicação entre sub-componentes

**Props:**
```typescript
interface FilterBarProps {
  searchText: string;
  statusFilter: StatusFilterType;
  sortOption: SortOption;
  onSearchChange: (text: string) => void;
  onStatusFilterChange: (filter: StatusFilterType) => void;
  onSortChange: (option: SortOption) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
  taskCounts: TaskCounts;
}
```

#### SearchBar Component
Campo de busca com debounce opcional.

**Props:**
```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel: string;
}
```

**Responsabilidades:**
- Capturar entrada de texto do usuário
- Fornecer label acessível
- Exibir ícone de busca
- Fornecer botão de limpar (quando há texto)
- Anunciar mudanças para screen readers

**State Interno:**
- Nenhum (controlled component)

#### StatusFilter Component
Grupo de botões para filtrar por status.

**Props:**
```typescript
interface StatusFilterProps {
  value: StatusFilterType;
  onChange: (filter: StatusFilterType) => void;
}

type StatusFilterType = 'all' | 'pending' | 'completed';
```

**Responsabilidades:**
- Renderizar três botões (All, Pending, Completed)
- Indicar visualmente opção ativa
- Suportar navegação por teclado (arrow keys)
- Anunciar mudanças para screen readers
- Aplicar estilos de foco visíveis

#### SortControls Component
Dropdown ou grupo de botões para ordenação.

**Props:**
```typescript
interface SortControlsProps {
  value: SortOption;
  onChange: (option: SortOption) => void;
}

type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a';
```

**Responsabilidades:**
- Renderizar controle de seleção (select ou radio group)
- Indicar opção ativa
- Fornecer labels descritivas
- Suportar navegação por teclado
- Anunciar mudanças para screen readers

#### TaskCounter Component
Exibe contadores de tarefas.

**Props:**
```typescript
interface TaskCounterProps {
  total: number;
  pending: number;
  completed: number;
}
```

**Responsabilidades:**
- Exibir três contadores com labels
- Usar aria-live para anunciar mudanças
- Adaptar layout para mobile/desktop
- Fornecer contexto visual claro

#### ClearFiltersButton Component
Botão para resetar todos os filtros.

**Props:**
```typescript
interface ClearFiltersButtonProps {
  onClick: () => void;
  visible: boolean;
}
```

**Responsabilidades:**
- Exibir apenas quando filtros estão ativos
- Fornecer feedback visual ao hover/focus
- Anunciar ação para screen readers
- Suportar ativação por teclado

### Custom Hooks

#### useFilters Hook
Gerencia todo o estado e lógica de filtros.

```typescript
interface FilterState {
  searchText: string;
  statusFilter: StatusFilterType;
  sortOption: SortOption;
}

interface UseFiltersReturn {
  filterState: FilterState;
  setSearchText: (text: string) => void;
  setStatusFilter: (filter: StatusFilterType) => void;
  setSortOption: (option: SortOption) => void;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  filteredTasks: Task[];
  taskCounts: TaskCounts;
}

function useFilters(tasks: Task[]): UseFiltersReturn;
```

**Responsabilidades:**
- Gerenciar estado de filtros (search, status, sort)
- Persistir estado em LocalStorage
- Restaurar estado na inicialização
- Computar lista filtrada (com memoization)
- Calcular contadores de tarefas
- Determinar se há filtros ativos
- Fornecer função para limpar filtros

**Otimizações:**
- useMemo para cálculo de tarefas filtradas
- useMemo para cálculo de contadores
- useCallback para funções de atualização
- Debounce opcional para busca (se necessário)

### Funções Utilitárias

#### filterTasks
Aplica filtros de busca e status.

```typescript
function filterTasks(
  tasks: Task[],
  searchText: string,
  statusFilter: StatusFilterType
): Task[];
```

**Lógica:**
1. Se statusFilter !== 'all', filtrar por status
2. Se searchText não vazio, filtrar por título/descrição (case-insensitive)
3. Retornar array filtrado

#### sortTasks
Ordena tarefas baseado na opção selecionada.

```typescript
function sortTasks(
  tasks: Task[],
  sortOption: SortOption
): Task[];
```

**Lógica:**
- 'newest': ordenar por createdAt desc
- 'oldest': ordenar por createdAt asc
- 'a-z': ordenar por title asc (case-insensitive)
- 'z-a': ordenar por title desc (case-insensitive)

#### calculateTaskCounts
Calcula contadores de tarefas.

```typescript
interface TaskCounts {
  total: number;
  pending: number;
  completed: number;
}

function calculateTaskCounts(tasks: Task[]): TaskCounts;
```

## Data Models

### Filter State Model

```typescript
interface FilterState {
  searchText: string;           // Texto de busca, "" = sem busca
  statusFilter: StatusFilterType; // 'all' | 'pending' | 'completed'
  sortOption: SortOption;       // 'newest' | 'oldest' | 'a-z' | 'z-a'
}

type StatusFilterType = 'all' | 'pending' | 'completed';
type SortOption = 'newest' | 'oldest' | 'a-z' | 'z-a';
```

**Valores Padrão:**
```typescript
const DEFAULT_FILTER_STATE: FilterState = {
  searchText: '',
  statusFilter: 'all',
  sortOption: 'newest'
};
```

**Regras de Validação:**
- searchText: qualquer string (incluindo vazia)
- statusFilter: deve ser um dos três valores válidos
- sortOption: deve ser uma das quatro opções válidas

### LocalStorage Schema para Filtros

**Key:** `task-manager-filters`

**Value:** JSON do FilterState

```json
{
  "searchText": "comprar",
  "statusFilter": "pending",
  "sortOption": "a-z"
}
```

**Considerações:**
- Validar estrutura ao carregar
- Usar valores padrão se inválido ou ausente
- Salvar com debounce de 500ms para evitar writes excessivos
- Tamanho negligível (~100 bytes)

### Task Counts Model

```typescript
interface TaskCounts {
  total: number;        // Total de tarefas (não filtradas)
  pending: number;      // Tarefas pendentes (não filtradas)
  completed: number;    // Tarefas concluídas (não filtradas)
}
```

**Nota:** Contadores sempre refletem o total de tarefas, não a lista filtrada.

### Extended Task Model

Nenhuma modificação necessária no modelo Task existente. A feature trabalha com o modelo atual:

```typescript
interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Search text filtering

*For any* task list and search text, all filtered tasks should contain the search text (case-insensitive) in either the title or description field.

**Validates: Requirements 1.2, 1.3**

### Property 2: Case-insensitive search equivalence

*For any* task list and search text, searching with different case variations (uppercase, lowercase, mixed) should return the same set of tasks.

**Validates: Requirements 1.3**

### Property 3: Status filter correctness

*For any* task list and status filter value (pending/completed), all filtered tasks should have a status matching the selected filter.

**Validates: Requirements 2.3, 2.4**

### Property 4: Task counter accuracy

*For any* task list, the displayed counters should accurately reflect the total count, pending count, and completed count of all tasks (regardless of active filters).

**Validates: Requirements 3.1, 3.2, 3.3**

### Property 5: Counter invariance under filtering

*For any* task list and any combination of filters, the task counters should remain unchanged when filters are applied or removed.

**Validates: Requirements 3.5**

### Property 6: Counter reactivity to CRUD operations

*For any* task list, when a task is created, updated (status change), or deleted, the task counters should immediately reflect the new counts.

**Validates: Requirements 3.4**

### Property 7: Sort order correctness - newest first

*For any* task list sorted by "newest first", each task should have a createdAt timestamp greater than or equal to the task following it.

**Validates: Requirements 4.2**

### Property 8: Sort order correctness - oldest first

*For any* task list sorted by "oldest first", each task should have a createdAt timestamp less than or equal to the task following it.

**Validates: Requirements 4.3**

### Property 9: Sort order correctness - alphabetical A-Z

*For any* task list sorted by "A-Z", each task title should be lexicographically less than or equal to the task title following it (case-insensitive).

**Validates: Requirements 4.4**

### Property 10: Sort order correctness - alphabetical Z-A

*For any* task list sorted by "Z-A", each task title should be lexicographically greater than or equal to the task title following it (case-insensitive).

**Validates: Requirements 4.5**

### Property 11: Clear filters button visibility

*For any* filter state, the clear filters button should be visible if and only if at least one filter differs from the default state (non-empty search, non-"all" status, or non-"newest" sort).

**Validates: Requirements 5.1, 5.5**

### Property 12: Clear filters resets to defaults

*For any* filter state with active filters, activating the clear button should reset search text to empty, status filter to "all", and sort option to "newest".

**Validates: Requirements 5.2, 5.3, 5.4**

### Property 13: Filter persistence round-trip

*For any* valid filter state, saving to LocalStorage and then loading should produce an equivalent filter state with all values preserved.

**Validates: Requirements 6.1, 6.3**

### Property 14: Multiple filters composition

*For any* task list with multiple active filters (search + status + sort), the result should be equivalent to applying filters sequentially: first status filter, then search filter, then sort.

**Validates: Requirements 9.5**

### Property 15: Empty state with filtered results

*For any* task list and filter combination, if no tasks match the filters but tasks exist in the system, an empty state message indicating "no matches" should be displayed.

**Validates: Requirements 10.1**

### Property 16: Empty state with no tasks

*For any* application state, if no tasks exist in the system (regardless of filters), an empty state message encouraging task creation should be displayed.

**Validates: Requirements 10.4**

### Property 17: Search clearing restores results

*For any* task list and non-empty search text, clearing the search text should restore the full task list (subject to other active filters).

**Validates: Requirements 1.6**

## Error Handling

### Error Categories

#### 1. Filter State Validation Errors

**Scenarios:**
- Invalid filter state loaded from LocalStorage
- Corrupted JSON in filter storage
- Invalid enum values for status or sort options
- Malformed filter state structure

**Handling:**
- Validate filter state structure on load with type guards
- Check enum values against allowed options
- Fall back to default filter state if invalid
- Log validation errors to console
- Show no error to user (silent recovery)

**User Experience:**
- App loads with default filters (no error message)
- User's invalid preferences are discarded
- No disruption to user workflow

**Recovery Strategy:**
```typescript
function loadFilterState(): FilterState {
  try {
    const saved = localStorage.getItem('task-manager-filters');
    if (!saved) return DEFAULT_FILTER_STATE;
    
    const parsed = JSON.parse(saved);
    
    // Validate structure and values
    if (!isValidFilterState(parsed)) {
      console.warn('Invalid filter state, using defaults');
      return DEFAULT_FILTER_STATE;
    }
    
    return parsed;
  } catch (error) {
    console.error('Failed to load filter state:', error);
    return DEFAULT_FILTER_STATE;
  }
}
```

#### 2. Storage Persistence Errors

**Scenarios:**
- LocalStorage quota exceeded when saving filters
- LocalStorage unavailable (private browsing)
- Write permission denied
- Storage disabled by user/browser

**Handling:**
- Catch storage errors on save attempts
- Continue operation in-memory only
- Log error to console
- Optionally show toast notification (non-blocking)
- Filters work but won't persist

**User Experience:**
- Filters work normally during session
- Optional notification: "Filter preferences won't be saved"
- No blocking errors or disruption

#### 3. Performance Degradation

**Scenarios:**
- Large task lists (>1000 tasks)
- Complex search queries
- Rapid filter changes
- Memory constraints

**Handling:**
- Use memoization (useMemo) for expensive computations
- Debounce search input (300ms)
- Optimize filter/sort algorithms
- Monitor performance in development

**User Experience:**
- Smooth filtering up to 1000 tasks
- Minimal lag on search input
- No visible performance issues

**Mitigation Strategies:**
- Memoize filtered task list calculation
- Memoize task counters calculation
- Use efficient array methods (filter, sort)
- Avoid unnecessary re-renders

#### 4. Empty Result Sets

**Scenarios:**
- No tasks match current filters
- All tasks filtered out by combination of filters
- User searches for non-existent content

**Handling:**
- Detect empty filtered results
- Show appropriate empty state component
- Provide clear messaging
- Suggest clearing filters

**User Experience:**
- Clear message: "No tasks match your filters"
- Helpful suggestion: "Try clearing filters to see all tasks"
- Visible "Clear Filters" button
- No confusion about why list is empty

### Error Recovery Strategies

1. **Automatic Recovery:**
   - Invalid filter state → use defaults
   - Storage failure → continue in-memory
   - Corrupted data → discard and use defaults

2. **User-Initiated Recovery:**
   - "Clear Filters" button always available
   - Filters can be manually reset
   - No data loss (only preferences)

3. **Graceful Degradation:**
   - Filters work without persistence
   - App remains fully functional
   - Core task management unaffected

### Error Prevention

1. **Input Validation:**
   - Validate filter state structure
   - Type-check enum values
   - Sanitize search input

2. **Defensive Programming:**
   - Type guards for loaded data
   - Null checks for optional values
   - Default values for missing fields

3. **Testing:**
   - Test with invalid filter states
   - Test with storage unavailable
   - Test with corrupted data
   - Test with large datasets

## Testing Strategy

### Overview

A feature de Filtros e Busca utilizará a mesma abordagem dual de testes do app principal: testes unitários para casos específicos e edge cases, e testes baseados em propriedades para verificar comportamentos universais. Esta combinação garante cobertura abrangente das funcionalidades de filtragem, busca e ordenação.

### Unit Testing

**Framework:** Vitest + React Testing Library

**Foco dos Testes Unitários:**
- Casos específicos de exemplo (busca por termo específico)
- Edge cases (busca vazia, sem resultados, lista vazia)
- Comportamentos de UI (visibilidade de botões, anúncios de screen reader)
- Integração entre componentes de filtro
- Acessibilidade (ARIA labels, keyboard navigation)
- Responsive design (mobile vs desktop layouts)

**Estrutura de Testes:**
```
src/
├── components/
│   ├── filters/
│   │   ├── __tests__/
│   │   │   ├── SearchBar.test.tsx
│   │   │   ├── StatusFilter.test.tsx
│   │   │   ├── SortControls.test.tsx
│   │   │   ├── TaskCounter.test.tsx
│   │   │   ├── ClearFiltersButton.test.tsx
│   │   │   └── FilterBar.test.tsx
├── hooks/
│   ├── __tests__/
│   │   └── useFilters.test.ts
└── utils/
    ├── __tests__/
    │   ├── filterTasks.test.ts
    │   └── sortTasks.test.ts
```

**Exemplos de Testes Unitários:**

1. **Search Bar Accessibility** (Requirement 1.5)
   - Verificar que SearchBar tem aria-label
   - Verificar que label está associado ao input

2. **Filter Controls Presence** (Requirement 2.1)
   - Verificar que três botões existem: All, Pending, Completed
   - Verificar labels corretos

3. **Sort Options Presence** (Requirement 4.1)
   - Verificar que quatro opções existem
   - Verificar labels: Newest First, Oldest First, A-Z, Z-A

4. **Clear Button Visibility** (Requirement 5.1)
   - Verificar que botão aparece com filtros ativos
   - Verificar que botão desaparece sem filtros

5. **Empty State Messages** (Requirements 10.2, 10.3)
   - Verificar mensagem específica quando filtros não retornam resultados
   - Verificar mensagem diferente quando não há tarefas

6. **Keyboard Navigation** (Requirements 2.6, 4.7, 5.6)
   - Verificar navegação por Tab entre controles
   - Verificar arrow keys em filter controls
   - Verificar Enter/Space ativam botões

7. **Touch Target Sizes** (Requirements 7.3-7.6)
   - Verificar dimensões mínimas de 44x44px em mobile
   - Testar todos os controles interativos

8. **ARIA Announcements** (Requirements 2.7, 3.6, 8.5)
   - Verificar aria-live regions
   - Verificar anúncios de mudanças de filtro
   - Verificar anúncios de contadores

9. **Responsive Layout** (Requirements 7.1, 7.2)
   - Verificar layout mobile em viewport < 768px
   - Verificar layout desktop em viewport >= 768px

10. **Filter Persistence** (Requirement 6.5)
    - Verificar que estado salvo inclui todos os campos
    - Verificar estrutura do JSON salvo

### Property-Based Testing

**Framework:** fast-check

**Configuração:**
- Mínimo de 100 iterações por teste de propriedade
- Seeds aleatórias para reprodutibilidade
- Shrinking automático para casos mínimos de falha

**Generators Customizados:**

```typescript
// Generator para texto de busca
const searchTextArb = fc.string({ maxLength: 100 });

// Generator para status filter
const statusFilterArb = fc.constantFrom('all', 'pending', 'completed');

// Generator para sort option
const sortOptionArb = fc.constantFrom('newest', 'oldest', 'a-z', 'z-a');

// Generator para filter state
const filterStateArb = fc.record({
  searchText: searchTextArb,
  statusFilter: statusFilterArb,
  sortOption: sortOptionArb
});

// Generator para task lists (reusa do app principal)
const taskListArb = fc.array(taskArb, { minLength: 0, maxLength: 100 });

// Generator para case variations
const caseVariationArb = (text: string) => fc.constantFrom(
  text.toLowerCase(),
  text.toUpperCase(),
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
);
```

**Exemplos de Testes de Propriedade:**

1. **Property 1: Search text filtering**
```typescript
// Feature: filters-and-search, Property 1: Search text filtering
fc.assert(
  fc.property(
    taskListArb,
    searchTextArb.filter(s => s.trim().length > 0),
    (tasks, searchText) => {
      const filtered = filterTasks(tasks, searchText, 'all');
      const searchLower = searchText.toLowerCase();
      
      return filtered.every(task =>
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }
  ),
  { numRuns: 100 }
);
```

2. **Property 2: Case-insensitive search equivalence**
```typescript
// Feature: filters-and-search, Property 2: Case-insensitive search equivalence
fc.assert(
  fc.property(
    taskListArb,
    fc.string({ minLength: 1, maxLength: 50 }),
    (tasks, searchText) => {
      const lower = filterTasks(tasks, searchText.toLowerCase(), 'all');
      const upper = filterTasks(tasks, searchText.toUpperCase(), 'all');
      const mixed = filterTasks(tasks, searchText, 'all');
      
      return lower.length === upper.length &&
             lower.length === mixed.length &&
             lower.every((task, i) => task.id === upper[i].id);
    }
  ),
  { numRuns: 100 }
);
```

3. **Property 3: Status filter correctness**
```typescript
// Feature: filters-and-search, Property 3: Status filter correctness
fc.assert(
  fc.property(
    taskListArb,
    fc.constantFrom('pending', 'completed'),
    (tasks, status) => {
      const filtered = filterTasks(tasks, '', status);
      return filtered.every(task => task.status === status);
    }
  ),
  { numRuns: 100 }
);
```

4. **Property 4: Task counter accuracy**
```typescript
// Feature: filters-and-search, Property 4: Task counter accuracy
fc.assert(
  fc.property(taskListArb, (tasks) => {
    const counts = calculateTaskCounts(tasks);
    const pendingCount = tasks.filter(t => t.status === 'pending').length;
    const completedCount = tasks.filter(t => t.status === 'completed').length;
    
    return counts.total === tasks.length &&
           counts.pending === pendingCount &&
           counts.completed === completedCount;
  }),
  { numRuns: 100 }
);
```

5. **Property 5: Counter invariance under filtering**
```typescript
// Feature: filters-and-search, Property 5: Counter invariance under filtering
fc.assert(
  fc.property(taskListArb, filterStateArb, (tasks, filterState) => {
    const countsBeforeFilter = calculateTaskCounts(tasks);
    
    // Apply filters (doesn't modify original tasks)
    filterTasks(tasks, filterState.searchText, filterState.statusFilter);
    
    const countsAfterFilter = calculateTaskCounts(tasks);
    
    return countsBeforeFilter.total === countsAfterFilter.total &&
           countsBeforeFilter.pending === countsAfterFilter.pending &&
           countsBeforeFilter.completed === countsAfterFilter.completed;
  }),
  { numRuns: 100 }
);
```

6. **Property 7: Sort order correctness - newest first**
```typescript
// Feature: filters-and-search, Property 7: Sort order correctness - newest first
fc.assert(
  fc.property(taskListArb, (tasks) => {
    const sorted = sortTasks(tasks, 'newest');
    
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = new Date(sorted[i].createdAt);
      const next = new Date(sorted[i + 1].createdAt);
      if (current < next) return false;
    }
    
    return true;
  }),
  { numRuns: 100 }
);
```

7. **Property 9: Sort order correctness - alphabetical A-Z**
```typescript
// Feature: filters-and-search, Property 9: Sort order correctness - alphabetical A-Z
fc.assert(
  fc.property(taskListArb, (tasks) => {
    const sorted = sortTasks(tasks, 'a-z');
    
    for (let i = 0; i < sorted.length - 1; i++) {
      const current = sorted[i].title.toLowerCase();
      const next = sorted[i + 1].title.toLowerCase();
      if (current > next) return false;
    }
    
    return true;
  }),
  { numRuns: 100 }
);
```

8. **Property 11: Clear filters button visibility**
```typescript
// Feature: filters-and-search, Property 11: Clear filters button visibility
fc.assert(
  fc.property(filterStateArb, (filterState) => {
    const hasActiveFilters = 
      filterState.searchText !== '' ||
      filterState.statusFilter !== 'all' ||
      filterState.sortOption !== 'newest';
    
    const buttonVisible = shouldShowClearButton(filterState);
    
    return hasActiveFilters === buttonVisible;
  }),
  { numRuns: 100 }
);
```

9. **Property 13: Filter persistence round-trip**
```typescript
// Feature: filters-and-search, Property 13: Filter persistence round-trip
fc.assert(
  fc.property(filterStateArb, (filterState) => {
    const saved = JSON.stringify(filterState);
    const loaded = JSON.parse(saved);
    
    return filterState.searchText === loaded.searchText &&
           filterState.statusFilter === loaded.statusFilter &&
           filterState.sortOption === loaded.sortOption;
  }),
  { numRuns: 100 }
);
```

10. **Property 14: Multiple filters composition**
```typescript
// Feature: filters-and-search, Property 14: Multiple filters composition
fc.assert(
  fc.property(
    taskListArb,
    searchTextArb,
    statusFilterArb,
    sortOptionArb,
    (tasks, search, status, sort) => {
      // Apply all filters at once
      const result1 = applyAllFilters(tasks, search, status, sort);
      
      // Apply filters sequentially
      let result2 = tasks;
      if (status !== 'all') {
        result2 = result2.filter(t => t.status === status);
      }
      if (search.trim()) {
        const searchLower = search.toLowerCase();
        result2 = result2.filter(t =>
          t.title.toLowerCase().includes(searchLower) ||
          t.description.toLowerCase().includes(searchLower)
        );
      }
      result2 = sortTasks(result2, sort);
      
      // Results should be equivalent
      return result1.length === result2.length &&
             result1.every((task, i) => task.id === result2[i].id);
    }
  ),
  { numRuns: 100 }
);
```

### Test Coverage Goals

- **Line Coverage:** Mínimo 90% para código de filtros
- **Branch Coverage:** Mínimo 90% para lógica de filtros
- **Function Coverage:** 100% para funções utilitárias
- **Property Coverage:** 100% das propriedades de correção implementadas

### Integration Testing

Além dos testes unitários e de propriedade, testar integração completa:

1. **Filter + Task CRUD Integration:**
   - Criar tarefa enquanto filtros estão ativos
   - Verificar que nova tarefa aparece se corresponder aos filtros
   - Editar tarefa para que não corresponda mais aos filtros
   - Verificar que tarefa desaparece da lista filtrada

2. **Filter Persistence + App Lifecycle:**
   - Aplicar filtros
   - Simular reload da aplicação
   - Verificar que filtros são restaurados
   - Verificar que lista filtrada é recalculada

3. **Multiple Components Interaction:**
   - Testar que mudanças em SearchBar atualizam TaskList
   - Testar que mudanças em StatusFilter atualizam TaskList
   - Testar que mudanças em SortControls atualizam TaskList
   - Testar que ClearFiltersButton reseta todos os controles

### Performance Testing

Embora não sejam testes automatizados, realizar testes manuais de performance:

- [ ] Testar com 100 tarefas
- [ ] Testar com 500 tarefas
- [ ] Testar com 1000 tarefas
- [ ] Medir tempo de filtragem
- [ ] Medir tempo de ordenação
- [ ] Verificar uso de memória
- [ ] Verificar re-renders desnecessários (React DevTools)

### Accessibility Testing

Testes manuais de acessibilidade:

- [ ] Navegação completa via teclado
- [ ] Teste com leitores de tela (anúncios de filtros)
- [ ] Teste de contraste de cores (filtros ativos vs inativos)
- [ ] Teste de foco visível em todos os controles
- [ ] Teste de touch targets em dispositivos móveis
- [ ] Teste de zoom até 200%
- [ ] Validação com ferramentas (Axe, WAVE)

### Testing Best Practices

1. **Isolamento:** Cada teste independente, limpar estado entre testes
2. **Mocking:** Mockar LocalStorage para testes de persistência
3. **User-Centric:** Testar do ponto de vista do usuário (queries acessíveis)
4. **Fast Feedback:** Testes unitários rápidos (<1s cada)
5. **Determinismo:** Testes reproduzíveis com seeds fixas
6. **Coverage:** Focar em comportamento, não em implementação
7. **Documentation:** Comentários explicando o que cada teste valida
