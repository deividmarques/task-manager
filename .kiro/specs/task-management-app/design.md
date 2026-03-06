# Design Document: Task Management App

## Overview

O Task Management App é uma aplicação web single-page desenvolvida em React com TypeScript que permite aos usuários gerenciar suas tarefas pessoais. A aplicação oferece funcionalidades completas de CRUD (Create, Read, Update, Delete) para tarefas, com persistência local via LocalStorage e interface responsiva que funciona em dispositivos móveis e desktop.

### Objetivos Principais

- Fornecer uma interface intuitiva e responsiva para gerenciamento de tarefas
- Garantir persistência automática de dados sem necessidade de backend
- Implementar acessibilidade completa seguindo WCAG 2.2 AA
- Oferecer feedback claro e imediato para todas as ações do usuário
- Manter a aplicação leve e performática

### Escopo

A aplicação cobre:
- Criação, edição, visualização e exclusão de tarefas
- Alternância de status (pendente/concluída)
- Persistência automática em LocalStorage
- Interface responsiva (mobile-first)
- Validação de entrada e tratamento de erros
- Acessibilidade completa via teclado e leitores de tela

Fora do escopo:
- Autenticação de usuários
- Sincronização entre dispositivos
- Compartilhamento de tarefas
- Categorias ou tags
- Priorização de tarefas
- Datas de vencimento

## Architecture

### Arquitetura Geral

A aplicação segue uma arquitetura de componentes React com gerenciamento de estado local e hooks customizados. A estrutura é organizada em camadas:

```
┌─────────────────────────────────────┐
│         UI Components Layer         │
│  (TaskList, TaskForm, TaskItem)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      State Management Layer         │
│    (Custom Hooks + React State)     │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Business Logic Layer          │
│  (Task operations, validation)      │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Persistence Layer              │
│      (LocalStorage API)             │
└─────────────────────────────────────┘
```

### Padrões Arquiteturais

1. **Component-Based Architecture**: Componentes React reutilizáveis e compostos
2. **Custom Hooks**: Encapsulamento de lógica de estado e efeitos colaterais
3. **Unidirectional Data Flow**: Dados fluem de cima para baixo via props
4. **Separation of Concerns**: UI, lógica de negócio e persistência separadas
5. **Mobile-First Design**: CSS responsivo começando por mobile

### Estrutura de Diretórios

```
src/
├── components/
│   ├── TaskList.tsx          # Lista de tarefas
│   ├── TaskItem.tsx          # Item individual de tarefa
│   ├── TaskForm.tsx          # Formulário criar/editar
│   ├── ConfirmDialog.tsx     # Diálogo de confirmação
│   └── EmptyState.tsx        # Estado vazio da lista
├── hooks/
│   ├── useTasks.ts           # Hook para gerenciar tarefas
│   ├── useLocalStorage.ts    # Hook para persistência
│   └── useToast.ts           # Hook para notificações
├── types/
│   └── task.ts               # Tipos TypeScript
├── utils/
│   ├── validation.ts         # Validação de dados
│   └── storage.ts            # Utilitários de storage
├── styles/
│   └── global.css            # Estilos globais
├── App.tsx                   # Componente raiz
└── main.tsx                  # Entry point
```

## Components and Interfaces

### Componentes Principais

#### App Component
Componente raiz que orquestra a aplicação.

**Responsabilidades:**
- Gerenciar estado global das tarefas via `useTasks` hook
- Coordenar comunicação entre componentes
- Fornecer contexto de notificações

**Props:** Nenhuma

**State:**
- Lista de tarefas (gerenciada pelo hook)
- Tarefa em edição (se houver)
- Estado do formulário (criar/editar)

#### TaskList Component
Exibe a lista de tarefas ou estado vazio.

**Props:**
```typescript
interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onToggleStatus: (taskId: string) => void;
}
```

**Responsabilidades:**
- Renderizar lista de TaskItem ou EmptyState
- Ordenar tarefas por data de criação (mais recentes primeiro)
- Fornecer callbacks para ações

#### TaskItem Component
Representa uma tarefa individual na lista.

**Props:**
```typescript
interface TaskItemProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onToggleStatus: () => void;
}
```

**Responsabilidades:**
- Exibir informações da tarefa
- Aplicar estilos visuais baseados no status
- Fornecer botões de ação acessíveis
- Indicar visualmente status de conclusão

#### TaskForm Component
Formulário para criar ou editar tarefas.

**Props:**
```typescript
interface TaskFormProps {
  task?: Task;  // undefined para criar, Task para editar
  onSubmit: (data: TaskFormData) => void;
  onCancel: () => void;
}

interface TaskFormData {
  title: string;
  description: string;
}
```

**Responsabilidades:**
- Validar entrada do usuário
- Exibir mensagens de erro inline
- Gerenciar estado do formulário
- Fornecer feedback visual de validação

#### ConfirmDialog Component
Diálogo modal para confirmação de exclusão.

**Props:**
```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
```

**Responsabilidades:**
- Capturar foco quando aberto
- Permitir confirmação via Enter e cancelamento via Escape
- Bloquear interação com conteúdo de fundo
- Anunciar abertura para leitores de tela

#### EmptyState Component
Exibido quando não há tarefas.

**Props:** Nenhuma

**Responsabilidades:**
- Exibir mensagem amigável
- Sugerir ação de criar primeira tarefa

### Custom Hooks

#### useTasks Hook
Gerencia todas as operações de tarefas.

```typescript
interface UseTasksReturn {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  createTask: (data: TaskFormData) => void;
  updateTask: (id: string, data: TaskFormData) => void;
  deleteTask: (id: string) => void;
  toggleTaskStatus: (id: string) => void;
}

function useTasks(): UseTasksReturn;
```

**Responsabilidades:**
- Carregar tarefas do LocalStorage na inicialização
- Persistir mudanças automaticamente
- Gerar IDs únicos para novas tarefas
- Validar operações
- Gerenciar estados de loading e erro

#### useLocalStorage Hook
Abstração para operações de LocalStorage.

```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, string | null];
```

**Responsabilidades:**
- Serializar/deserializar dados JSON
- Tratar erros de quota excedida
- Detectar indisponibilidade de LocalStorage
- Sincronizar com mudanças de storage

#### useToast Hook
Gerencia notificações temporárias.

```typescript
interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface UseToastReturn {
  toasts: Toast[];
  showToast: (message: string, type: Toast['type']) => void;
  dismissToast: (id: string) => void;
}

function useToast(): UseToastReturn;
```

**Responsabilidades:**
- Exibir notificações temporárias
- Auto-dismiss após timeout
- Anunciar para leitores de tela via live region

## Data Models

### Task Model

```typescript
interface Task {
  id: string;              // UUID v4
  title: string;           // 1-200 caracteres, obrigatório
  description: string;     // 0-1000 caracteres, opcional
  status: TaskStatus;      // 'pending' | 'completed'
  createdAt: string;       // ISO 8601 timestamp
  updatedAt: string;       // ISO 8601 timestamp
}

type TaskStatus = 'pending' | 'completed';
```

**Regras de Validação:**
- `id`: Gerado automaticamente via `crypto.randomUUID()`
- `title`: Não pode ser vazio ou apenas whitespace, máximo 200 caracteres
- `description`: Máximo 1000 caracteres
- `status`: Sempre 'pending' na criação
- `createdAt`: Definido na criação, imutável
- `updatedAt`: Atualizado em toda modificação

### LocalStorage Schema

**Key:** `task-manager-tasks`

**Value:** Array JSON de Tasks

```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "title": "Exemplo de tarefa",
    "description": "Descrição detalhada",
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Considerações:**
- Limite de ~5MB no LocalStorage (varia por navegador)
- Estimativa: ~10.000 tarefas com títulos/descrições médias
- Serialização via `JSON.stringify()`
- Deserialização via `JSON.parse()` com validação

### Form Data Model

```typescript
interface TaskFormData {
  title: string;
  description: string;
}

interface TaskFormErrors {
  title?: string;
  description?: string;
}
```

**Validação:**
- `title`: Obrigatório, trim aplicado, 1-200 caracteres
- `description`: Opcional, trim aplicado, máximo 1000 caracteres


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Form visibility on add action

*For any* application state, when the add task button is clicked, the task form should become visible and be empty.

**Validates: Requirements 1.1**

### Property 2: Task creation with valid title

*For any* valid (non-empty, non-whitespace) title string, submitting the form should create a new task with a timestamp in the task list.

**Validates: Requirements 1.2**

### Property 3: Invalid title rejection

*For any* string composed entirely of whitespace or empty string, submitting the form should reject the input, display an error message, and leave the task list unchanged.

**Validates: Requirements 1.3**

### Property 4: Task list growth and form reset

*For any* valid task creation, the task list length should increase by one and the form should be cleared.

**Validates: Requirements 1.4**

### Property 5: Unique task identifiers

*For any* set of created tasks, all task IDs should be unique.

**Validates: Requirements 1.5**

### Property 6: Task list ordering

*For any* set of tasks with different creation timestamps, the displayed task list should be ordered by creation date with most recent first.

**Validates: Requirements 2.1**

### Property 7: Task rendering completeness

*For any* task rendered in the list, the output should contain the task's title, description, status, and creation date.

**Validates: Requirements 2.3**

### Property 8: Responsive layout adaptation

*For any* viewport width, the layout should adapt appropriately: single column for widths < 768px, optimized horizontal layout for widths >= 768px.

**Validates: Requirements 2.4, 2.5**

### Property 9: Edit form population

*For any* task, when edit is initiated, the form should be populated with that task's current title and description.

**Validates: Requirements 3.1**

### Property 10: Task update persistence

*For any* task and any valid modifications, submitting the edit form should update the task with the new information in the task list.

**Validates: Requirements 3.2**

### Property 11: Edit cancellation preserves original

*For any* task being edited, canceling the edit should discard all changes and preserve the original task data.

**Validates: Requirements 3.3**

### Property 12: Edit validation maintains original on error

*For any* task being edited, if the title is removed or made invalid and the form is submitted, an error should be displayed and the original task data should remain unchanged.

**Validates: Requirements 3.4**

### Property 13: Update visibility

*For any* task update, the changes should be immediately visible in the task list without requiring a refresh.

**Validates: Requirements 3.5**

### Property 14: Delete confirmation dialog

*For any* task, clicking the delete button should display a confirmation dialog before any deletion occurs.

**Validates: Requirements 4.1**

### Property 15: Confirmed deletion removes task

*For any* task, confirming deletion should remove the task from the task list and from persistent storage.

**Validates: Requirements 4.2, 4.5**

### Property 16: Cancelled deletion preserves task

*For any* task, canceling the deletion confirmation should keep the task in the task list unchanged.

**Validates: Requirements 4.3**

### Property 17: Initial task status

*For any* newly created task, the initial status should be "pending".

**Validates: Requirements 5.1**

### Property 18: Status toggle round-trip

*For any* task, toggling the status twice should return the task to its original status (pending → completed → pending or completed → pending → completed).

**Validates: Requirements 5.2**

### Property 19: Status visual correspondence

*For any* task, the visual styling should correspond to its status: completed tasks should have differentiated styling (e.g., strikethrough), pending tasks should have normal styling.

**Validates: Requirements 5.3, 5.4**

### Property 20: Status change persistence

*For any* task status change, the new status should be immediately persisted to LocalStorage.

**Validates: Requirements 5.5**

### Property 21: CRUD operations persistence

*For any* create, update, or delete operation, the changes should be immediately saved to LocalStorage.

**Validates: Requirements 6.1**

### Property 22: Storage round-trip integrity

*For any* set of tasks, saving to LocalStorage and then loading should produce an equivalent set of tasks with all data preserved.

**Validates: Requirements 6.2, 6.4**

### Property 23: Touch target sizing on mobile

*For any* interactive element (button, checkbox) when viewport width < 768px, the element should have minimum dimensions of 44x44 pixels for touch accessibility.

**Validates: Requirements 7.3**

### Property 24: Text legibility across viewports

*For any* viewport size, text should maintain minimum font size of 16px and adequate line-height for readability.

**Validates: Requirements 7.4**

### Property 25: Success feedback visibility

*For any* successful operation (create, update, delete, status change), visual feedback (toast notification or message) should be displayed to the user.

**Validates: Requirements 8.1**

### Property 26: Error feedback visibility

*For any* error condition, a clear and specific error message should be displayed to the user.

**Validates: Requirements 8.2**

### Property 27: Input validation before processing

*For any* user input, validation should occur and reject invalid data before any state changes or persistence operations.

**Validates: Requirements 8.3**

### Property 28: Interactive element feedback states

*For any* interactive element, CSS styles for hover and focus states should be defined and applied.

**Validates: Requirements 8.4**

### Property 29: ARIA attributes presence

*For any* interactive or dynamic element, appropriate WAI-ARIA attributes (role, aria-label, aria-describedby, etc.) should be present.

**Validates: Requirements 9.2**

### Property 30: Color contrast compliance

*For any* text or UI component, the color contrast ratio should meet or exceed WCAG requirements: 4.5:1 for normal text, 3:1 for large text and UI components.

**Validates: Requirements 9.3, 9.4**

### Property 31: Keyboard navigation completeness

*For any* interactive element, it should be reachable via keyboard navigation (Tab key) and have a visible focus indicator.

**Validates: Requirements 9.5**

### Property 32: Form control labels

*For any* form input or control, an accessible label should be provided via <label> element or aria-label attribute.

**Validates: Requirements 9.6**

### Property 33: Dynamic content announcements

*For any* dynamic content change (task added, deleted, updated), the change should be announced to screen readers via aria-live regions.

**Validates: Requirements 9.7**

### Property 34: Logical tab order

*For any* page state, the tab order should follow the visual and logical flow of the interface (top to bottom, left to right).

**Validates: Requirements 9.8**

### Property 35: Non-textual element accessibility

*For any* icon, image, or non-textual element, alternative text should be provided via alt attribute, aria-label, or visually-hidden text.

**Validates: Requirements 9.9**

### Property 36: Multi-modal information presentation

*For any* information conveyed by color (e.g., task status), additional non-color indicators (icons, text, patterns) should also be present.

**Validates: Requirements 9.10**

## Error Handling

### Error Categories

#### 1. Validation Errors
**Scenarios:**
- Empty or whitespace-only task title
- Title exceeding 200 characters
- Description exceeding 1000 characters

**Handling:**
- Display inline error message below the relevant field
- Prevent form submission
- Maintain focus on the invalid field
- Use red color with error icon (not color alone)
- Announce error to screen readers via aria-live="polite"

**User Experience:**
- Error message format: "Title is required" or "Title must be 200 characters or less"
- Error clears when user starts typing valid input
- Submit button remains enabled (validation on submit)

#### 2. Storage Errors
**Scenarios:**
- LocalStorage not available (private browsing, disabled)
- LocalStorage quota exceeded
- JSON parse errors on load
- Write failures

**Handling:**
- Detect LocalStorage availability on app initialization
- Show persistent warning banner if unavailable
- Catch and handle quota exceeded errors
- Graceful degradation: app works in-memory only
- Display toast notification for transient errors

**User Experience:**
- Warning message: "Local storage is unavailable. Your tasks will not be saved."
- Error message: "Failed to save tasks. Storage may be full."
- Provide option to export tasks as JSON file
- Auto-retry failed operations once

#### 3. Data Integrity Errors
**Scenarios:**
- Corrupted data in LocalStorage
- Invalid task structure
- Missing required fields
- Type mismatches

**Handling:**
- Validate data structure on load with JSON schema
- Filter out invalid tasks
- Log errors to console for debugging
- Show warning about recovered tasks
- Provide option to clear corrupted data

**User Experience:**
- Warning message: "Some tasks could not be loaded due to data corruption."
- Show count of recovered vs. failed tasks
- Offer "Clear All Data" button as last resort

#### 4. Runtime Errors
**Scenarios:**
- Unexpected exceptions
- Component render errors
- Event handler failures

**Handling:**
- Implement Error Boundary component
- Catch and log errors
- Display fallback UI
- Provide "Reload" button
- Preserve error details for debugging

**User Experience:**
- Error message: "Something went wrong. Please reload the page."
- Fallback UI shows error icon and message
- Error details hidden from user but logged

### Error Recovery Strategies

1. **Automatic Recovery:**
   - Retry failed storage operations once after 1 second delay
   - Auto-clear validation errors on input change
   - Restore from last known good state

2. **User-Initiated Recovery:**
   - "Try Again" button for failed operations
   - "Clear Data" option for corrupted storage
   - "Reload Page" for critical errors
   - Export/Import functionality as backup

3. **Graceful Degradation:**
   - App functions without LocalStorage (in-memory only)
   - Show reduced functionality warning
   - Disable features that require storage

### Error Logging

- Log all errors to console with context
- Include timestamp, error type, and stack trace
- Log user actions leading to error
- No sensitive data in logs
- Consider integration with error tracking service (future)

## Testing Strategy

### Overview

A aplicação utilizará uma abordagem dual de testes: testes unitários para casos específicos e edge cases, e testes baseados em propriedades para verificar comportamentos universais. Esta combinação garante cobertura abrangente e confiança na correção do sistema.

### Unit Testing

**Framework:** Vitest (compatível com Vite)

**Biblioteca de Testes:** React Testing Library

**Foco dos Testes Unitários:**
- Casos específicos de exemplo que demonstram comportamento correto
- Edge cases identificados nos requisitos
- Pontos de integração entre componentes
- Condições de erro específicas
- Comportamentos de UI complexos

**Estrutura de Testes:**
```
src/
├── components/
│   ├── __tests__/
│   │   ├── TaskList.test.tsx
│   │   ├── TaskItem.test.tsx
│   │   ├── TaskForm.test.tsx
│   │   └── ConfirmDialog.test.tsx
├── hooks/
│   ├── __tests__/
│   │   ├── useTasks.test.ts
│   │   ├── useLocalStorage.test.ts
│   │   └── useToast.test.ts
└── utils/
    └── __tests__/
        ├── validation.test.ts
        └── storage.test.ts
```

**Exemplos de Testes Unitários:**

1. **Empty State Display** (Edge Case 2.2)
   - Verificar que EmptyState é renderizado quando lista está vazia
   - Verificar mensagem específica exibida

2. **LocalStorage Unavailable** (Edge Case 6.3)
   - Simular LocalStorage indisponível
   - Verificar que warning é exibido
   - Verificar que app funciona em modo in-memory

3. **Storage Failure** (Edge Case 6.5)
   - Simular falha de escrita no LocalStorage
   - Verificar que erro apropriado é exibido
   - Verificar que estado em memória permanece consistente

4. **Minimum Viewport** (Edge Case 7.1)
   - Testar renderização em 320px de largura
   - Verificar que todos os elementos são acessíveis
   - Verificar que não há overflow horizontal

5. **Component Integration**
   - Testar fluxo completo de criar tarefa
   - Testar fluxo completo de editar tarefa
   - Testar fluxo completo de excluir tarefa

6. **Accessibility Specifics**
   - Verificar que diálogo de confirmação captura foco
   - Verificar que Escape fecha diálogos
   - Verificar que Enter submete formulários
   - Verificar anúncios de screen reader

### Property-Based Testing

**Framework:** fast-check (biblioteca PBT para JavaScript/TypeScript)

**Configuração:**
- Mínimo de 100 iterações por teste de propriedade
- Seeds aleatórias para reprodutibilidade
- Shrinking automático para encontrar casos mínimos de falha

**Foco dos Testes de Propriedade:**
- Propriedades universais que devem valer para todas as entradas
- Invariantes do sistema
- Round-trip properties (serialização, parsing)
- Comportamentos que devem ser consistentes

**Tag Format:**
Cada teste de propriedade deve incluir comentário:
```typescript
// Feature: task-management-app, Property 5: Unique task identifiers
```

**Generators Customizados:**

```typescript
// Generator para títulos válidos
const validTitleArb = fc.string({ minLength: 1, maxLength: 200 })
  .filter(s => s.trim().length > 0);

// Generator para títulos inválidos
const invalidTitleArb = fc.oneof(
  fc.constant(''),
  fc.string().filter(s => s.trim().length === 0)
);

// Generator para tarefas
const taskArb = fc.record({
  id: fc.uuid(),
  title: validTitleArb,
  description: fc.string({ maxLength: 1000 }),
  status: fc.constantFrom('pending', 'completed'),
  createdAt: fc.date().map(d => d.toISOString()),
  updatedAt: fc.date().map(d => d.toISOString())
});

// Generator para viewports
const viewportWidthArb = fc.integer({ min: 320, max: 1920 });
```

**Exemplos de Testes de Propriedade:**

1. **Property 5: Unique task identifiers**
```typescript
// Feature: task-management-app, Property 5: Unique task identifiers
fc.assert(
  fc.property(fc.array(validTitleArb, { minLength: 2, maxLength: 100 }), (titles) => {
    const tasks = titles.map(title => createTask({ title, description: '' }));
    const ids = tasks.map(t => t.id);
    const uniqueIds = new Set(ids);
    return ids.length === uniqueIds.size;
  }),
  { numRuns: 100 }
);
```

2. **Property 3: Invalid title rejection**
```typescript
// Feature: task-management-app, Property 3: Invalid title rejection
fc.assert(
  fc.property(invalidTitleArb, (title) => {
    const initialTasks = getTasks();
    const result = createTask({ title, description: '' });
    const finalTasks = getTasks();
    return result.error !== null && 
           initialTasks.length === finalTasks.length;
  }),
  { numRuns: 100 }
);
```

3. **Property 22: Storage round-trip integrity**
```typescript
// Feature: task-management-app, Property 22: Storage round-trip integrity
fc.assert(
  fc.property(fc.array(taskArb, { maxLength: 50 }), (tasks) => {
    saveTasks(tasks);
    const loaded = loadTasks();
    return JSON.stringify(tasks) === JSON.stringify(loaded);
  }),
  { numRuns: 100 }
);
```

4. **Property 18: Status toggle round-trip**
```typescript
// Feature: task-management-app, Property 18: Status toggle round-trip
fc.assert(
  fc.property(taskArb, (task) => {
    const originalStatus = task.status;
    toggleTaskStatus(task.id);
    toggleTaskStatus(task.id);
    const finalTask = getTask(task.id);
    return finalTask.status === originalStatus;
  }),
  { numRuns: 100 }
);
```

### Test Coverage Goals

- **Line Coverage:** Mínimo 90%
- **Branch Coverage:** Mínimo 90%
- **Function Coverage:** Mínimo 90%
- **Property Coverage:** 100% das propriedades de correção implementadas

### Continuous Integration

- Executar todos os testes em cada commit
- Bloquear merge se testes falharem
- Gerar relatórios de cobertura
- Executar testes de propriedade com seeds variadas

### Testing Best Practices

1. **Isolamento:** Cada teste deve ser independente
2. **Limpeza:** Limpar LocalStorage entre testes
3. **Mocking:** Mockar dependências externas (LocalStorage, Date)
4. **Acessibilidade:** Usar queries acessíveis (getByRole, getByLabelText)
5. **User-Centric:** Testar comportamento do ponto de vista do usuário
6. **Fast Feedback:** Testes unitários devem ser rápidos (<1s cada)
7. **Determinismo:** Testes devem ser determinísticos e reproduzíveis

### Manual Testing Checklist

Além dos testes automatizados, realizar testes manuais para:

- [ ] Navegação completa via teclado
- [ ] Teste com leitores de tela (NVDA, JAWS, VoiceOver)
- [ ] Teste em diferentes navegadores (Chrome, Firefox, Safari, Edge)
- [ ] Teste em dispositivos móveis reais
- [ ] Teste de contraste de cores com ferramentas (Axe, WAVE)
- [ ] Teste de zoom até 200%
- [ ] Teste em modo de alto contraste do sistema operacional
- [ ] Teste com JavaScript desabilitado (graceful degradation)

