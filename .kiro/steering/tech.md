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
npm run lint         # Run ESLint
npm run format       # Format code with Prettier

# Testing
npm run test         # Run tests
npm run test:ui      # Visual test interface
npm run coverage     # Generate coverage report (90% threshold)
```

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

