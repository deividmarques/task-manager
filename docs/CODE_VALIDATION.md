# Validação de Código Local

Este projeto possui agentes locais que validam automaticamente:
- ✅ **Segurança** do código
- ✅ **Qualidade** e complexidade
- ✅ **Acessibilidade** WCAG 2.2 AA

## Ferramentas Configuradas

### 1. Segurança (`eslint-plugin-security`)

Detecta vulnerabilidades comuns:
- Injeção de código (eval, child_process)
- Regex inseguros
- Timing attacks
- Uso inseguro de buffers
- Object injection

**Exemplo de detecção:**
```typescript
// ❌ Detecta: Possível Object Injection
const value = obj[userInput]; // security/detect-object-injection

// ✅ Solução: Validar entrada
const allowedKeys = ['name', 'email'];
const value = allowedKeys.includes(userInput) ? obj[userInput] : null;
```

### 2. Qualidade (`eslint-plugin-sonarjs`)

Detecta code smells e complexidade:
- Complexidade cognitiva alta (>15)
- Funções duplicadas
- Condições idênticas
- Strings duplicadas (>3 vezes)
- Expressões redundantes

**Exemplo de detecção:**
```typescript
// ❌ Detecta: String duplicada 3+ vezes
test('test 1', () => expect('error message').toBe('error message'));
test('test 2', () => expect('error message').toBe('error message'));

// ✅ Solução: Usar constante
const ERROR_MSG = 'error message';
test('test 1', () => expect(ERROR_MSG).toBe(ERROR_MSG));
```

### 3. Acessibilidade (`eslint-plugin-jsx-a11y`)

Valida WCAG 2.2 AA compliance:
- Elementos interativos com suporte a teclado
- Textos alternativos em imagens
- Labels associados a inputs
- Roles ARIA corretos
- Contraste de cores (via outras ferramentas)

**Exemplo de detecção:**
```tsx
// ❌ Detecta: Click sem suporte a teclado
<div onClick={handleClick}>Clique aqui</div>

// ✅ Solução: Usar button ou adicionar onKeyDown
<button onClick={handleClick}>Clique aqui</button>
// ou
<div 
  role="button" 
  tabIndex={0}
  onClick={handleClick}
  onKeyDown={(e) => e.key === 'Enter' && handleClick()}
>
  Clique aqui
</div>
```

## Comandos Disponíveis

### Validação Completa (Recomendado)
```bash
npm run validate
```
Executa: lint + test + build (use antes de commitar)

### Validações Individuais
```bash
npm run lint              # Todas as validações (segurança + qualidade + a11y)
npm run lint:security     # Apenas segurança
npm run test              # Testes unitários
npm run build             # Build de produção
```

## Níveis de Severidade

- **error** 🔴 - Bloqueia o commit (deve ser corrigido)
- **warn** 🟡 - Aviso (recomendado corrigir, mas não bloqueia)

## Integração com Pre-commit Hook

O hook `.kiro/hooks/pre-commit-validation.kiro.hook` garante que você sempre execute as validações antes de commitar.

## Configuração Personalizada

Para ajustar as regras, edite `eslint.config.js`:

```javascript
// Desabilitar uma regra específica
'security/detect-object-injection': 'off',

// Mudar severidade
'sonarjs/cognitive-complexity': ['warn', 20], // aumenta limite para 20

// Desabilitar para arquivo específico
// No topo do arquivo:
/* eslint-disable security/detect-object-injection */
```

## Relatório de Validação

Ao executar `npm run lint`, você verá:

```
/src/components/Example.tsx
  10:5  warning  Click events must have key events  jsx-a11y/click-events-have-key-events
  15:3  error    Unsafe regex detected             security/detect-unsafe-regex
  20:1  warning  Cognitive complexity is 18        sonarjs/cognitive-complexity

✖ 3 problems (1 error, 2 warnings)
```

## Boas Práticas

1. **Execute `npm run validate` antes de cada commit**
2. **Corrija todos os errors** (🔴)
3. **Revise os warnings** (🟡) e corrija quando possível
4. **Não desabilite regras** sem entender o motivo
5. **Use comentários** para justificar exceções:
   ```typescript
   // eslint-disable-next-line security/detect-object-injection -- userInput is validated
   const value = obj[userInput];
   ```

## Recursos Adicionais

- [ESLint Security Plugin](https://github.com/eslint-community/eslint-plugin-security)
- [SonarJS Rules](https://github.com/SonarSource/eslint-plugin-sonarjs)
- [JSX A11y Rules](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
