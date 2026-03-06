# Project Structure

## Directory Organization

```
.
├── .kiro/                    # Kiro AI assistant configuration
│   ├── settings/            # Kiro settings (MCP config, etc.)
│   │   └── mcp.json        # MCP server configurations
│   ├── steering/            # AI guidance documents (this folder)
│   └── specs/               # Feature specs and implementation plans
├── .vscode/                 # VS Code settings
│   └── settings.json       # Editor configuration
└── [project files]          # Application source code (TBD)
```

## Configuration Files

- `.kiro/settings/mcp.json` - MCP server configuration
- `.kiro/steering/*.md` - Steering rules for AI assistant
- `.vscode/settings.json` - Editor preferences

## Steering Rules

Steering files guide the AI assistant's behavior:

- `product.md` - Product overview and purpose
- `tech.md` - Technology stack and common commands
- `structure.md` - Project organization (this file)

Additional steering files can be added as needed for:
- Code style conventions
- Architecture patterns
- Testing strategies
- Deployment procedures

## Specs Directory

The `.kiro/specs/` directory contains feature specifications following the spec-driven development methodology:

- Each feature gets its own subdirectory: `.kiro/specs/{feature-name}/`
- Spec files: `requirements.md`, `design.md`, `tasks.md`
- Specs guide implementation with clear requirements, design decisions, and task breakdowns

## Future Structure

As the project grows, update this document to reflect:
- Source code organization
- Test file locations
- Build output directories
- Documentation structure
