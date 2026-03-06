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

## Project Commands

As the project grows, document common commands here:

```bash
# Build
# TBD

# Test
# TBD

# Development server
# TBD

# Linting
# TBD
```
