# Technology Stack

## Development Environment

- **IDE**: Kiro AI Assistant
- **Configuration**: JSON-based settings in `.kiro/settings/` and `.vscode/`

## MCP Integration

The workspace supports Model Context Protocol (MCP) servers for extended capabilities.

### MCP Configuration

- Configuration file: `.kiro/settings/mcp.json`
- MCP servers can be added to extend Kiro's capabilities
- Common MCP servers can be installed via `uvx` (requires `uv` Python package manager)

### Common MCP Commands

```bash
# Install uv (if not already installed)
# macOS/Linux: curl -LsSf https://astral.sh/uv/install.sh | sh
# Or via homebrew: brew install uv

# MCP servers are configured in .kiro/settings/mcp.json
# They auto-start when Kiro loads - no manual installation needed
```

## Project Stack

### Frontend
- **React 19** - UI library
- **TypeScript** - Static typing
- **Vite** - Build tool and dev server
- **CSS3** - Styling (no frameworks)

### Development Tools
- **ESLint** - Code linting
  - `eslint-plugin-security` - Security vulnerability detection
  - `eslint-plugin-sonarjs` - Code quality and complexity analysis
  - `eslint-plugin-jsx-a11y` - Accessibility (WCAG 2.2 AA) validation
- **Prettier** - Code formatting
- **Vitest** - Testing framework
- **React Testing Library** - Component testing
- **fast-check** - Property-based testing

### APIs
- **LocalStorage API** - Data persistence

## Project Commands

```bash
# Development
npm run dev          # Start development server (http://localhost:5173)

# Build
npm run build        # Create production build
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint (security + quality + accessibility)
npm run lint:security # Run security checks only
npm run format       # Format code with Prettier
npm run validate     # Run lint + test + build (use before commit)

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:ui      # Visual test interface
npm run coverage     # Generate coverage report (50% threshold)

# Pull Requests (requires GitHub CLI)
npm run pr           # Create PR from current branch to main
npm run pr develop   # Create PR from current branch to develop
npm run pr:custom -- --base main --draft  # Custom PR with gh flags
npm run pr:check     # Quick validation before push/merge
```

## Pre-commit Checklist

**IMPORTANT**: Always run these commands before committing:

```bash
npm run validate     # Runs lint + test + build (recommended)
# or individually:
npm run lint         # Must pass without errors (checks security, quality, accessibility)
npm run test         # All tests must pass
npm run build        # Build must succeed
```

This ensures code quality, security, and prevents CI/CD failures in GitHub Actions.

### Local Code Validation

The project includes automated local validation for:
- **Security**: Detects vulnerabilities (injection, unsafe regex, etc.)
- **Quality**: Analyzes code complexity and smells
- **Accessibility**: Validates WCAG 2.2 AA compliance

See `docs/CODE_VALIDATION.md` for detailed documentation.

## GitHub Repository

**Repository**: https://github.com/seu-usuario/task-manager

### Publishing to GitHub

```bash
# Create repository on GitHub first, then:
git remote add origin https://github.com/seu-usuario/task-manager.git
git branch -M main
git push -u origin main
```

### Repository Structure
- Main branch: `main`
- All commits follow conventional commits format
- 22 commits documenting the complete implementation

### Pull Request Automation

The project includes automated PR creation and validation:

```bash
# Create PR from current branch to main (auto-generates title/description)
npm run pr

# Create PR from current branch to specific branch
npm run pr develop
npm run pr staging

# Custom PR with full control
npm run pr:custom -- --base main --draft --reviewer username

# Quick PR validation (before push/merge)
npm run pr:check
```

See `scripts/README.md` and `docs/PR_AUTOMATION.md` for detailed documentation.
